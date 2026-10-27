'use strict';
const path = require('node:path');

function hookCommand(script, event = '', runtime = { executable: process.execPath, electron: Boolean(process.versions.electron), platform: process.platform }) {
  const file = path.resolve(script).replace(`app.asar${path.sep}`, `app.asar.unpacked${path.sep}`);
  // Hook hosts use a shell; these paths come from the installation, never from a model.
  for (const value of [runtime.executable, file]) {
    if (/["\r\n%]/.test(value)) throw new Error('La ruta de instalación no es compatible con los hooks.');
  }
  const command = `"${runtime.executable}" "${file}"${event ? ` ${event}` : ''}`;
  if (!runtime.electron) return command;
  return runtime.platform === 'win32'
    ? `set "ELECTRON_RUN_AS_NODE=1" && ${command}`
    : `ELECTRON_RUN_AS_NODE=1 ${command}`;
}

module.exports = { hookCommand };
