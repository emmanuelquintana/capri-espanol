'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { execFile } = require('node:child_process');
const { hookCommand } = require('../scripts/hook-runtime');

test('bundled Electron executes a hook with spaces in its path and without Node on PATH', { skip: process.platform !== 'win32' }, async () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'capri-es-hook-'));
  assert.ok(path.resolve(directory).startsWith(path.join(os.tmpdir(), 'capri-es-hook-')));
  try {
    const script = path.join(directory, 'hook with spaces.js');
    fs.writeFileSync(script, 'process.stdin.resume();process.stdin.on("data", data => process.stdout.write(data));');
    const command = hookCommand(script, '', { executable: require('electron'), electron: true, platform: 'win32' });
    const result = await new Promise((resolve, reject) => {
      const child = execFile(path.join(process.env.SystemRoot, 'System32/cmd.exe'), ['/d', '/c', command],
        { windowsHide: true, windowsVerbatimArguments: true, env: { ...process.env, PATH: path.join(process.env.SystemRoot, 'System32') }, timeout: 10000 },
        (error, stdout) => error ? reject(error) : resolve(stdout));
      child.stdin.end('evento sin Node externo');
    });
    assert.equal(result, 'evento sin Node externo');
  } finally { fs.rmSync(directory, { recursive: true, force: true }); }
});

test('a hook path cannot inject shell metacharacters through environment expansion', () => {
  assert.throws(() => hookCommand('C:/unsafe%PATH%/hook.js'));
  assert.throws(() => hookCommand('C:/unsafe"/hook.js'));
});
