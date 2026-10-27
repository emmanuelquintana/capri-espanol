'use strict';
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('installer', {
  info: () => ipcRenderer.invoke('installer:info'),
  inspect: () => ipcRenderer.invoke('installer:inspect'),
  check: (choice, response) => ipcRenderer.invoke('installer:check', choice, response),
  finish: data => ipcRenderer.invoke('installer:finish', data),
  ollama: (action, name) => ipcRenderer.invoke('installer:ollama', action, name),
  cancel: () => ipcRenderer.invoke('installer:cancel'),
  official: provider => ipcRenderer.invoke('installer:official', provider),
  onProgress: handler => ipcRenderer.on('installer:progress', (_event, payload) => handler(payload)),
});
