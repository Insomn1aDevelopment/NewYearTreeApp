const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

process.env.DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'tree-'));
const server = require('./server');

test('server', async t => {
  await new Promise(r => server.listen(0, r));
  const base = `http://localhost:${server.address().port}`;
  const api = base + '/api/state/67b8d37c-ef51-49ae-a4db-8b841b5fa75d';
  t.after(() => server.close());

  assert.equal((await fetch(base + '/%')).status, 400, 'malformed url must not crash');
  assert.equal((await fetch(base + '/')).status, 200);
  assert.equal((await fetch(base + '/..%2fserver.js')).status, 403);
  assert.equal((await fetch(api)).status, 404);

  const state = JSON.stringify({ name: 'Ёлочка'.repeat(3000), t: 1 }); // multi-byte, spans several chunks
  assert.equal((await fetch(api, { method: 'PUT', body: state })).status, 204);
  assert.equal(await (await fetch(api)).text(), state);
  assert.equal((await fetch(api, { method: 'POST', body: '[1]' })).status, 400);
  assert.equal((await fetch(api, { method: 'PUT', body: 'x'.repeat(70e3) })).status, 413);
  assert.equal((await fetch(api, { method: 'DELETE' })).status, 405);
});
