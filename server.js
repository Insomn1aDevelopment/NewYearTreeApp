// Static files from ./public + per-visitor tree state in ./data/<uuid>.json. No dependencies.
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUB = path.join(__dirname, 'public');
const DATA = path.join(__dirname, 'data');
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8' };
const ID = /^\/api\/state\/([0-9a-f-]{36})$/;
fs.mkdirSync(DATA, { recursive: true });

http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  const api = url.match(ID);

  if (api) {
    const file = path.join(DATA, api[1] + '.json');
    if (req.method === 'GET') {
      return fs.readFile(file, (err, buf) => {
        if (err) return res.writeHead(404).end();
        res.writeHead(200, { 'Content-Type': 'application/json' }).end(buf);
      });
    }
    if (req.method === 'PUT' || req.method === 'POST') { // POST = sendBeacon
      let body = '';
      req.on('data', c => { body += c; if (body.length > 64e3) req.destroy(); });
      return req.on('end', () => {
        try { JSON.parse(body); } catch { return res.writeHead(400).end(); }
        fs.writeFile(file, body, err => res.writeHead(err ? 500 : 204).end());
      });
    }
    return res.writeHead(405).end();
  }

  const file = path.join(PUB, url === '/' ? 'index.html' : url);
  if (!file.startsWith(PUB + path.sep)) return res.writeHead(403).end();
  fs.readFile(file, (err, buf) => {
    if (err) return res.writeHead(404).end('Not found');
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' }).end(buf);
  });
}).listen(PORT, () => console.log(`http://localhost:${PORT}`));
