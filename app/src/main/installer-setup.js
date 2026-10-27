'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { createHash, randomUUID } = require('node:crypto');

const PROVIDERS = ['ollama', 'lmstudio', 'openrouter', 'openai', 'groq', 'gemini', 'deepseek', 'mistral', 'custom'];
const text = (value, max) => typeof value === 'string' && value.length <= max;

function personalSettings(value) {
  if (!value || !text(value.userName, 24) || !text(value.persona, 500)
    || ![0.45, 0.6, 0.8].includes(value.scale) || !['auto', 'full', 'reduced'].includes(value.motion)
    || !['corner', 'taskbar'].includes(value.rest) || !['auto', 'gl', 'software'].includes(value.render)
    || !(value.displayId === null || Number.isInteger(value.displayId))
    || !['muted', 'wander', 'startup'].every(key => typeof value[key] === 'boolean')) {
    throw new Error('Revisa el nombre y las opciones de personalización.');
  }
  const lists = {};
  for (const name of ['myLines', 'memories']) {
    if (!Array.isArray(value[name]) || value[name].length > 30 || value[name].some(line => !text(line, 500))) {
      throw new Error('Usa hasta 30 frases o recuerdos, de 500 caracteres como máximo.');
    }
    lists[name] = value[name].map(line => line.trim()).filter(Boolean);
  }
  return { userName: value.userName.trim(), persona: value.persona.trim(), scale: value.scale, motion: value.motion,
    rest: value.rest, render: value.render, muted: value.muted, wander: value.wander, displayId: value.displayId, ...lists };
}

function choiceSettings(value, before, setup) {
  if (!value || !PROVIDERS.includes(value.provider) || !text(value.key || '', 4096) || !text(value.model || '', 250)) {
    throw new Error('Elige un servicio de IA válido.');
  }
  const cfg = { ...before, apiKeys: setup.openKeys(before.apiKeys), provider: value.provider };
  if (value.key?.trim()) cfg.apiKeys = { ...cfg.apiKeys, [value.provider]: value.key.trim() };
  if (value.provider === 'custom') {
    if (!text(value.url, 2048)) throw new Error('Escribe la dirección del servidor.');
    let url;
    try { url = new URL(value.url.trim()); } catch { throw new Error('La dirección debe empezar por http:// o https://.'); }
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) {
      throw new Error('Usa una dirección HTTP o HTTPS sin contraseña, parámetros ni fragmentos.');
    }
    if (cfg.apiKeys.custom && url.protocol !== 'https:' && !['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) {
      throw new Error('Usa HTTPS para enviar una clave a un servidor fuera de este equipo.');
    }
    if (url.pathname === '/') url.pathname = '/v1';
    cfg.customUrl = url.toString().replace(/\/+$/, '');
  }
  return cfg;
}

function connectionError(error) {
  if (error.status === 401 || error.status === 403 || error.code === 'nokey') return 'Falta una clave válida o no tiene permiso. Revisa la clave de API y vuelve a probar.';
  if (error.status === 429) return 'El proveedor ha limitado las peticiones o no hay saldo disponible. Revisa tu cuenta e inténtalo más tarde.';
  if (error.status === 404) return 'El modelo o la dirección no están disponibles. Revisa el servidor y vuelve a buscar modelos.';
  if (error.status >= 500) return 'El servicio de IA no está disponible ahora. Puedes volver a probar o configurarlo después.';
  if (error.name === 'TimeoutError' || error.name === 'AbortError') return 'La comprobación tardó demasiado o se canceló. Si el modelo es local, espera a que termine de cargar y prueba otra vez.';
  return 'No se pudo conectar. Comprueba que el servicio esté encendido y que la dirección y el modelo sean correctos.';
}

function createSetupService({ llm, setup, load, save }) {
  let verified = null, checking = null;
  const fingerprint = (choice, cfg) => createHash('sha256').update(JSON.stringify({ provider: choice.provider,
    url: cfg.customUrl, model: choice.model, keys: cfg.apiKeys })).digest('hex');

  async function machine() {
    const [ollama, lmModels] = await Promise.all([
      setup.ollamaState(), llm.models('lmstudio', { apiKeys: {} }).catch(() => null),
    ]);
    const candidates = [path.join(process.env.LOCALAPPDATA || os.homedir(), 'Programs', 'LM Studio', 'LM Studio.exe'),
      path.join(os.homedir(), '.lmstudio', 'bin', 'lms.exe'),
      path.join(process.env.ProgramFiles || 'C:/Program Files', 'LM Studio', 'LM Studio.exe')];
    let freeBytes = null;
    try { const disk = fs.statfsSync(os.homedir()); freeBytes = disk.bavail * disk.bsize; } catch { /* space is informational */ }
    const keys = setup.openKeys(load().apiKeys);
    return { ramBytes: os.totalmem(), freeBytes, runtimeIncluded: true, ollama,
      lmstudio: { installed: Array.isArray(lmModels) || candidates.some(file => fs.existsSync(file)), running: Array.isArray(lmModels), models: lmModels || [] },
      downloads: setup.MODELS, keys: PROVIDERS.filter(id => Boolean(keys[id]) || Boolean(llm.PROVIDERS[id]?.env && process.env[llm.PROVIDERS[id].env])) };
  }

  async function check(choice, response = false) {
    verified = null;
    checking?.abort();
    const controller = new AbortController();
    checking = controller;
    let cfg;
    try { cfg = choiceSettings(choice, load(), setup); } catch (error) { return { ok: false, error: error.message }; }
    try {
      const models = await llm.models(choice.provider, cfg);
      if (!models?.length) return { ok: false, error: 'No hay modelos disponibles. Enciende el servidor y descarga o carga un modelo.', models: [] };
      if (!response) return { ok: true, models };
      if (!models.includes(choice.model)) return { ok: false, error: 'El modelo elegido ya no está disponible. Vuelve a buscar modelos.' };
      let received = '';
      const result = await llm.chat(choice.provider, cfg, { model: choice.model, messages: [
        { role: 'system', content: 'Escribe en español. Responde con una sola frase breve. Esta es una prueba de conexión.' },
        { role: 'user', content: 'Saluda para confirmar que puedes responder.' },
      ] }, delta => { received += delta; }, AbortSignal.any([controller.signal, AbortSignal.timeout(90000)]));
      const reply = String(result || received).trim();
      if (!reply) return { ok: false, error: 'El servicio conectó, pero el modelo no devolvió texto. Elige un modelo de conversación.' };
      verified = { id: randomUUID(), fingerprint: fingerprint(choice, cfg), time: Date.now() };
      return { ok: true, reply: reply.slice(0, 600), verificationId: verified.id, local: llm.isLocal(choice.provider, cfg) };
    } catch (error) { return { ok: false, error: connectionError(error) }; }
  }

  function complete({ personal, choice, verificationId }) {
    const patch = personalSettings(personal);
    if (choice?.provider !== 'later') {
      const cfg = choiceSettings(choice, load(), setup);
      if (!verified || verified.id !== verificationId || Date.now() - verified.time > 15 * 60 * 1000
        || verified.fingerprint !== fingerprint(choice, cfg)) throw new Error('Prueba de nuevo el modelo antes de guardar esta conexión.');
      Object.assign(patch, { provider: choice.provider, chatModel: choice.model });
      if (choice.provider === 'custom') patch.customUrl = cfg.customUrl;
      if (choice.key?.trim()) patch.apiKeys = { ...load().apiKeys, [choice.provider]: setup.sealKey(choice.key.trim()) };
    }
    save({ ...patch, setupComplete: true, lang: 'es', motionAsked: true }, personal.startup);
    verified = null;
    return { ok: true };
  }
  return { machine, check, complete, cancel: () => checking?.abort() };
}

module.exports = { createSetupService, personalSettings, choiceSettings, connectionError };
