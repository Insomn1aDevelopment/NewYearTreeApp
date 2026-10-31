// Static files from ./public + per-visitor tree state in ./data/<uuid>.json. No dependencies.
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUB = path.join(__dirname, 'public');
const DATA = process.env.DATA_DIR || path.join(__dirname, 'data');
const MAX_BODY = 64e3;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.mp3': 'audio/mpeg',
};
const ID = /^\/api\/state\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/;
fs.mkdirSync(DATA, { recursive: true });

const send = (res, code, body = '', type) => {
  if (res.headersSent) return;
  res.writeHead(code, { 'X-Content-Type-Options': 'nosniff', ...(type && { 'Content-Type': type }) }).end(body);
};

function readBody(req, cb) {
  const chunks = []; let size = 0;
  req.on('data', c => {
    size += c.length;
    if (size > MAX_BODY) { req.removeAllListeners('data'); req.resume(); cb(413); } else chunks.push(c);
  });
  req.on('end', () => size <= MAX_BODY && cb(null, Buffer.concat(chunks).toString('utf8')));
  req.on('error', () => cb(400));
}

function saveState(file, json, cb) {
  // write to a temp file then rename: a crash or a racing PUT+beacon never leaves half-written JSON
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFile(tmp, json, err => err ? cb(err) : fs.rename(tmp, file, cb));
}

function api(req, res, id) {
  const file = path.join(DATA, id + '.json');
  if (req.method === 'GET') {
    return fs.readFile(file, (err, buf) => err ? send(res, 404) : send(res, 200, buf, 'application/json'));
  }
  if (req.method === 'PUT' || req.method === 'POST') { // POST = sendBeacon
    return readBody(req, (code, body) => {
      if (code) return send(res, code);
      let obj; try { obj = JSON.parse(body); } catch { return send(res, 400); }
      if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return send(res, 400);
      saveState(file, body, err => send(res, err ? 500 : 204));
    });
  }
  send(res, 405);
}

function serveStatic(req, res, url) {
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405);
  const file = path.join(PUB, url === '/' ? 'index.html' : url);
  if (!file.startsWith(PUB + path.sep)) return send(res, 403);
  fs.readFile(file, (err, buf) => {
    if (err) return send(res, 404, 'Not found', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    send(res, 200, req.method === 'HEAD' ? '' : buf, TYPES[path.extname(file)] || 'application/octet-stream');
  });
}

const server = http.createServer((req, res) => {
  let url;
  try { url = decodeURIComponent(req.url.split('?')[0]); } catch { return send(res, 400); }
  try {
    const m = url.match(ID);
    m ? api(req, res, m[1]) : serveStatic(req, res, url);
  } catch (e) {
    console.error(e);
    send(res, 500);
  }
});

if (require.main === module) {
  server.listen(PORT, () => console.log(`http://localhost:${PORT}`));
  const stop = () => server.close(() => process.exit(0));
  process.on('SIGINT', stop).on('SIGTERM', stop);
}
module.exports = server;
