'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const llm = require('../src/main/llm');
const { createSetupService, personalSettings, choiceSettings } = require('../src/main/installer-setup');
const personal = { userName: 'Álex', persona: 'Cercana y con humor', scale: .6, motion: 'reduced', rest: 'corner',
  render: 'auto', muted: true, wander: false, startup: false, displayId: null, myLines: [], memories: ['Mi gato se llama Neko'] };
const setup = { openKeys: keys => ({ ...keys }), sealKey: key => 'sealed:' + Buffer.from(key).toString('base64') };

test('installer verifies a real HTTP response before saving; credentials and failed checks leave the profile intact', async t => {
  let status = 200, sent = 0, state = { apiKeys: {}, provider: 'ollama', unrelated: 'conservar' }, writes = 0;
  const server = http.createServer(async (req, res) => {
    assert.equal(req.headers.authorization, 'Bearer clave-ficticia');
    if (status !== 200) { res.writeHead(status); return res.end(JSON.stringify({ error: { message: 'SECRET-DO-NOT-REPEAT' } })); }
    if (req.url === '/v1/models') return res.end(JSON.stringify({ data: [{ id: 'prueba-local' }] }));
    let raw = ''; for await (const chunk of req) raw += chunk;
    const body = JSON.parse(raw); assert.equal(body.model, 'prueba-local');
    assert.match(body.messages[0].content, /español/); sent++;
    res.writeHead(200, { 'content-type': 'text/event-stream' });
    res.end('data: ' + JSON.stringify({ choices: [{ delta: { content: 'Hola, respuesta de prueba.' } }] }) + '\n\ndata: [DONE]\n\n');
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const service = createSetupService({ llm, setup, load: () => state, save: patch => { state = { ...state, ...patch }; writes++; } });
  const choice = { provider: 'custom', url: `http://127.0.0.1:${server.address().port}/v1`, key: 'clave-ficticia', model: 'prueba-local' };
  assert.throws(() => service.complete({ personal, choice }), /Prueba de nuevo/);
  assert.equal((await service.check(choice)).ok, true); assert.equal(writes, 0); assert.equal(sent, 0);
  status = 401;
  const failed = await service.check(choice, true);
  assert.equal(failed.ok, false); assert.doesNotMatch(failed.error, /SECRET/); assert.equal(writes, 0);
  status = 200;
  const passed = await service.check(choice, true); assert.equal(passed.ok, true); assert.equal(sent, 1);
  assert.throws(() => service.complete({ personal, choice: { ...choice, model: 'otro' }, verificationId: passed.verificationId }), /Prueba de nuevo/);
  assert.equal(writes, 0);
  service.complete({ personal, choice, verificationId: passed.verificationId });
  assert.equal(writes, 1); assert.equal(state.unrelated, 'conservar'); assert.equal(state.userName, 'Álex');
  assert.equal(state.chatModel, 'prueba-local'); assert.ok(state.apiKeys.custom.startsWith('sealed:'));
  assert.notEqual(state.apiKeys.custom, choice.key);
});

test('installer validates preferences, URLs and missing models; configuring later preserves the current provider', async () => {
  assert.throws(() => personalSettings({ ...personal, scale: 8 }));
  assert.throws(() => personalSettings({ ...personal, memories: Array(31).fill('x') }));
  for (const url of ['file:///C:/Windows', 'https://user:password@example.com/v1', 'not a URL']) {
    assert.throws(() => choiceSettings({ provider: 'custom', url }, { apiKeys: {} }, setup));
  }
  assert.throws(() => choiceSettings({ provider: 'custom', key: 'secret', url: 'http://example.com/v1' }, { apiKeys: {} }, setup), /HTTPS/);
  let state = { provider: 'custom', apiKeys: { custom: 'existing-key' }, userName: 'Anterior' };
  const service = createSetupService({ llm: { models: async () => [] }, setup, load: () => state, save: patch => { state = { ...state, ...patch }; } });
  assert.equal((await service.check({ provider: 'ollama' })).ok, false);
  service.complete({ personal, choice: { provider: 'later' } });
  assert.equal(state.provider, 'custom'); assert.equal(state.apiKeys.custom, 'existing-key'); assert.equal(state.setupComplete, true);
});

test('atomic profile updates preserve other settings; a write failure keeps the previous file and cache', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'capri-es-config-'));
  let denyRename = false;
  const scopedFs = { ...fs, renameSync: (...args) => { if (denyRename) throw new Error('fixture: denied'); return fs.renameSync(...args); } };
  const context = { require: name => name === 'electron' ? { app: { getPath: () => directory } } : name === 'node:fs' ? scopedFs : require(name), module: { exports: {} }, console: { error() {} } };
  try {
    vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../src/main/config.js'), 'utf8'), context);
    const config = context.module.exports;
    config.save({ userName: 'Antes', privateSetting: 'conservar' }, { strict: true });
    denyRename = true;
    assert.throws(() => config.save({ userName: 'Después' }, { strict: true }), /No se pudo guardar/);
    assert.equal(config.load().userName, 'Antes');
    assert.equal(JSON.parse(fs.readFileSync(config.file())).userName, 'Antes');
    denyRename = false; config.save({ userName: 'Después' }, { strict: true });
    assert.equal(config.load().privateSetting, 'conservar');
  } finally { fs.rmSync(directory, { recursive: true, force: true }); }
});
