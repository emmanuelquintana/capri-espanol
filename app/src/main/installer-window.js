'use strict';

const path = require('node:path');
const { app, BrowserWindow, ipcMain, screen, shell } = require('electron');
const config = require('./config');
const setup = require('./setup');
const llm = require('./llm');
const { createSetupService } = require('./installer-setup');

function installerWindow({ onComplete, onClose, saveSettings, getStartup }) {
  let window = null, working = false, pulling = null, completed = false;
  const service = createSetupService({ llm, setup, load: () => config.load(), save: saveSettings });
  const progress = payload => window && !window.isDestroyed() && window.webContents.send('installer:progress', payload);
  const scoped = handler => async (event, ...args) => {
    if (!window || event.sender !== window.webContents) throw new Error('Ventana no autorizada.');
    return handler(...args);
  };
  const task = handler => scoped(async (...args) => {
    if (working) return { ok: false, error: 'Espera a que termine la operación actual.' };
    working = true;
    try { return await handler(...args); }
    catch { return { ok: false, error: 'No se pudo completar la operación. Revisa las opciones y vuelve a intentarlo.' }; }
    finally { working = false; }
  });

  ipcMain.handle('installer:info', scoped(() => {
    const { apiKeys, ...settings } = config.load();
    return { settings, startup: getStartup(), startupAllowed: !process.env.CAPRI_ES_PROFILE, providers: Object.fromEntries(Object.entries(llm.PROVIDERS)
      .filter(([id]) => !['claude', 'pollinations', 'llamacpp'].includes(id)).map(([id, value]) => [id, value.label])),
      displays: screen.getAllDisplays().map((display, i) => ({ id: display.id, label: display.label || `Pantalla ${i + 1}` })) };
  }));
  ipcMain.handle('installer:inspect', task(() => service.machine()));
  ipcMain.handle('installer:check', task((choice, response) => service.check(choice, Boolean(response))));
  ipcMain.handle('installer:finish', task(async request => {
    try {
      if (request.personal.displayId !== null && !screen.getAllDisplays().some(display => display.id === request.personal.displayId)) {
        return { ok: false, error: 'La pantalla elegida ya no está conectada. Vuelve al primer paso.' };
      }
      service.complete(request);
      completed = true;
      await onComplete();
      window?.close();
      return { ok: true };
    } catch (error) { return { ok: false, error: error.message }; }
  }));
  ipcMain.handle('installer:ollama', task(async (action, name) => {
    if (action === 'install') {
      // An OS installer cannot be rolled back by closing this window.
      window.setClosable(false);
      try {
        const state = await setup.ollamaState();
        if (state.installed) return { ok: true };
        if (!state.winget) return { ok: false, error: 'No se encontró el instalador de Windows. Usa «Descarga oficial de Ollama».' };
        const result = await setup.installOllama(() => progress({ kind: 'install' }));
        return result.ok ? { ok: true } : { ok: false, error: 'Ollama no se pudo instalar. Puedes usar su descarga oficial y volver a comprobar.' };
      } finally { window?.setClosable(true); }
    }
    if (action === 'start') {
      const result = await setup.startOllama();
      return result.ok ? result : { ok: false, error: 'Ollama no respondió. Abre su aplicación y vuelve a comprobar.' };
    }
    if (action === 'pull' && setup.MODELS.some(model => model.name === name)) {
      pulling = new AbortController();
      try {
        await setup.pullModel(name, values => progress({ kind: 'pull', ...values }), pulling.signal);
        const models = (await setup.ollamaState()).models || [];
        return models.some(model => model === name || model === name + ':latest')
          ? { ok: true } : { ok: false, error: 'La descarga terminó sin un modelo disponible. Vuelve a comprobar.' };
      } catch { return { ok: false, error: pulling.signal.aborted ? 'Descarga cancelada. Puedes retomarla después.' : 'No se pudo descargar el modelo. Comprueba la conexión y el espacio disponible.' }; }
      finally { pulling = null; }
    }
    return { ok: false, error: 'Operación no disponible.' };
  }));
  ipcMain.handle('installer:cancel', scoped(() => { pulling?.abort(); return { ok: true }; }));
  ipcMain.handle('installer:official', scoped(provider => {
    const url = provider === 'ollama' ? 'https://ollama.com/download/windows'
      : provider === 'lmstudio' ? 'https://lmstudio.ai/download' : setup.KEY_PAGES[provider];
    return url ? shell.openExternal(url).then(() => ({ ok: true })) : { ok: false };
  }));

  function open() {
    if (window && !window.isDestroyed()) { window.show(); window.focus(); return; }
    completed = false;
    const area = screen.getPrimaryDisplay().workArea;
    window = new BrowserWindow({ title: 'Personalizar Capri y conectar mi IA',
      width: Math.min(1120, area.width - 32), height: Math.min(840, area.height - 32), minWidth: 360, minHeight: 520,
      backgroundColor: '#16111e', autoHideMenuBar: true, show: false,
      webPreferences: { preload: path.join(__dirname, '..', 'installer', 'preload.js'), contextIsolation: true, sandbox: true, nodeIntegration: false } });
    window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
    window.webContents.on('will-navigate', event => event.preventDefault());
    window.once('ready-to-show', () => { window?.show(); window?.focus(); });
    window.on('closed', () => { pulling?.abort(); service.cancel(); window = null; if (!completed) onClose(); });
    window.loadURL('capri://app/src/installer/index.html');
  }
  return { open };
}

module.exports = { installerWindow };
