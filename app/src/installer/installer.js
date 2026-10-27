const api = window.installer;
const $ = id => document.getElementById(id);
const steps = ['personal', 'connection', 'summary'];
let step = 0, info, machine, busy = false, pulling = false, models = [], verification = null;
const bytes = value => value == null ? 'No disponible' : (value / 1e9).toLocaleString('es-MX', { maximumFractionDigits: 1 }) + ' GB';
const providerName = () => $('provider').selectedOptions[0].textContent.split(' · ')[0];
const choice = () => ({ provider: $('provider').value, key: $('api-key').value.trim(), url: $('url').value.trim(), model: $('model').value });
function personal() {
  const lines = id => $(id).value.split('\n').map(line => line.trim()).filter(Boolean);
  return { userName: $('user-name').value, persona: $('persona').value, scale: Number($('size').value), motion: $('motion').value,
    rest: $('rest').value, render: $('render').value, wander: $('wander').checked, muted: !$('sound').checked,
    startup: $('startup').checked, displayId: $('display').value ? Number($('display').value) : null,
    myLines: lines('my-lines'), memories: lines('memories') };
}
function error(message = '') { $('error').textContent = message; $('error').hidden = !message; }
function controls() {
  document.querySelectorAll('button, input, textarea, select').forEach(element => { element.disabled = busy; });
  $('next').disabled = busy || !info || (step === 1 && $('provider').value !== 'later' && !verification);
  $('test-model').disabled = busy || !models.length;
  $('startup').disabled = busy || !info?.startupAllowed;
  if (pulling) $('cancel-download').disabled = false;
  document.querySelector('main').setAttribute('aria-busy', String(busy));
}
async function run(action, status) {
  if (busy) return;
  busy = true; error(); controls();
  $('operation-status').textContent = status || '';
  $('progress').hidden = !status; $('progress').removeAttribute('value');
  try { await action(); }
  catch { error('No se pudo completar la operación. Vuelve a intentarlo.'); }
  finally { busy = false; $('progress').hidden = true; controls(); }
}
function invalidate() {
  verification = null; $('test-reply').hidden = true;
  $('operation-status').textContent = ''; controls();
}
function definitions(target, values) {
  const fragment = document.createDocumentFragment();
  for (const [label, detail] of values) {
    const dt = document.createElement('dt'), dd = document.createElement('dd');
    dt.textContent = label; dd.textContent = detail; fragment.append(dt, dd);
  }
  target.replaceChildren(fragment);
}
function requirements() {
  const provider = $('provider').value, local = machine?.[provider];
  const values = [['Motor de Capri', 'Incluido en esta instalación']];
  if (provider === 'later') values.push(['Inteligencia artificial', 'Se puede conectar después; el personaje funciona sin ella.']);
  else if (provider === 'ollama' || provider === 'lmstudio') {
    values.push([providerName(), !machine ? 'Comprobación pendiente' : local?.installed ? 'Detectado en este equipo' : 'No detectado en las ubicaciones habituales'],
      ['Servicio local', !machine ? 'Comprobación pendiente' : local?.running ? 'Encendido y accesible' : 'Sin respuesta: enciéndelo y vuelve a comprobar'],
      ['Modelos disponibles', local?.models?.length ? `${local.models.length} encontrados` : 'Ninguno detectado']);
  } else values.push(['Programas adicionales', 'No necesitas instalar un motor local'],
    ['Clave de API', $('api-key').value ? 'Introducida; pendiente de validar' : machine?.keys.includes(provider) ? 'Guardada o disponible en el equipo' : provider === 'custom' ? 'Opcional, según tu servidor' : 'Pendiente']);
  if (verification) values.push(['Respuesta del modelo', 'Recibida y comprobada']);
  definitions($('requirements-list'), values);
}
function providerUI(clear = true) {
  if (clear) {
    $('api-key').value = ''; $('api-key').type = 'password';
    $('show-key').textContent = 'Mostrar clave'; $('show-key').setAttribute('aria-pressed', 'false');
    models = []; $('model').replaceChildren(); invalidate();
  }
  const provider = $('provider').value, isLocal = ['ollama', 'lmstudio'].includes(provider), custom = provider === 'custom';
  $('local-actions').hidden = !isLocal;
  $('address-fields').hidden = !custom;
  $('key-fields').hidden = ['ollama', 'later'].includes(provider);
  $('key-optional').textContent = custom || provider === 'lmstudio' ? '(si tu servidor la pide)' : '';
  $('key-page').hidden = isLocal || custom;
  $('connection-controls').hidden = provider === 'later';
  $('model-field').hidden = !models.length;
  const state = machine?.ollama;
  $('install-ollama').hidden = provider !== 'ollama' || !machine || state.installed || !state.winget;
  $('start-ollama').hidden = provider !== 'ollama' || !state?.installed || state.running;
  $('model-download').hidden = provider !== 'ollama' || !state?.running;
  $('official').textContent = `Descarga oficial de ${providerName()}`;
  $('provider-help').textContent = provider === 'later' ? 'Nos quedamos con el personaje y sus animaciones. Puedes conectar la IA desde «Configurar Capri y mi IA…». Si ya tenías una conexión, se conserva.'
    : provider === 'ollama' ? 'Ollama ejecuta un modelo en tu equipo. Comprueba el servicio, descarga un modelo si hace falta y prueba su respuesta.'
    : provider === 'lmstudio' ? 'Abre LM Studio, descarga o carga un modelo y enciende su servidor local. Capri comprobará si puede conectarse. No basta con tener la aplicación instalada.'
    : custom ? 'Conecta tu propio servidor de chat. Puede estar en este equipo o en otra dirección. La prueba comprobará los modelos y una respuesta.'
    : 'Necesitas conexión a Internet y una clave de API de este proveedor. Los mensajes y el contexto que elijas se enviarán a ese servicio. La facturación de API es independiente de una suscripción a su chat.';
  $('key-help').textContent = machine?.keys.includes(provider)
    ? 'Ya hay una clave guardada o disponible. Deja este campo vacío para conservarla, o introduce otra. Solo se guardará si la conexión funciona.'
    : 'La clave nueva se cifra en tu perfil de Windows al finalizar. Nunca se incluye en los registros de diagnóstico.';
  requirements(); controls();
}
async function scan() {
  const result = await api.inspect();
  if (result.ok === false) { error(result.error); return; }
  machine = result;
  $('machine-summary').textContent = `Memoria RAM: ${bytes(machine.ramBytes)}. Espacio libre en la unidad de tu perfil: ${bytes(machine.freeBytes)}. El rendimiento depende del modelo y de tu equipo.`;
  $('download-model').replaceChildren(...machine.downloads.map(model => new Option(`${model.name} · descarga aproximada ${bytes(model.bytes)}`, model.name)));
  providerUI(false);
  $('operation-status').textContent = 'Comprobación del equipo terminada.';
}
function preview() {
  $('character').style.height = Math.round(260 * Number($('size').value) / .6) + 'px';
  $('preview-greeting').textContent = `Hola, ${$('user-name').value.trim() || 'choom'}. Aquí me quedo contigo.`;
}
function showStep(next) {
  step = next; error();
  steps.forEach((name, index) => {
    $(name + '-step').hidden = index !== step;
    const li = document.querySelectorAll('.steps li')[index];
    if (index === step) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
  });
  $('back').hidden = step === 0;
  $('next').textContent = ['Elegir mi IA', 'Revisar configuración', 'Guardar y abrir Capri'][step];
  $('step-status').textContent = `Paso ${step + 1} de 3`;
  controls(); $('main').scrollTo(0, 0); $(steps[step] + '-title').focus({ preventScroll: true });
  if (step === 2) {
    const p = personal(), later = $('provider').value === 'later';
    $('summary-intro').textContent = later ? 'Tu personaje está preparado. La conexión de IA queda para cuando quieras configurarla.'
      : 'Tu modelo ya devolvió una respuesta de prueba. Al guardar conservaré esta conexión y tus preferencias.';
    definitions($('summary-list'), [['Tu nombre', p.userName || 'Choom'], ['Tamaño', $('size').selectedOptions[0].textContent],
      ['Conversación', p.persona || 'La personalidad de Capri en español'], ['Movimiento', $('motion').selectedOptions[0].textContent],
      ['Descanso', $('rest').selectedOptions[0].textContent], ['Sonido', p.muted ? 'Efectos silenciados' : 'Efectos activados'],
      ['Al iniciar Windows', p.startup ? 'Abrir Capri' : 'Abrirla cuando tú quieras'],
      ['Inteligencia artificial', later ? 'Configurar después' : `${providerName()} · ${$('model').value}`],
      ...(!later ? [['Comprobación', 'Respuesta recibida del modelo elegido'], ['Procesamiento', verification.local ? 'Servicio en este equipo' : 'Servicio remoto: recibe los mensajes y su contexto']] : [])]);
  }
}
$('next').addEventListener('click', () => {
  if (step === 0 && !$('personal-form').reportValidity()) return;
  if (step === 0 && [personal().myLines, personal().memories].some(list => list.length > 30 || list.some(line => line.length > 500))) {
    error('Usa hasta 30 frases o recuerdos por lista, con un máximo de 500 caracteres en cada línea.'); return;
  }
  if (step < 2) { showStep(step + 1); return; }
  run(async () => {
    const result = await api.finish({ personal: personal(), choice: choice(), verificationId: verification?.verificationId });
    if (!result.ok) error(result.error);
  }, 'Guardando tus preferencias…');
});
$('back').addEventListener('click', () => showStep(step - 1));
$('personal-form').addEventListener('submit', event => event.preventDefault());
$('user-name').addEventListener('input', preview); $('size').addEventListener('change', preview);
$('provider').addEventListener('change', () => { error(); providerUI(); });
for (const id of ['api-key', 'url', 'model']) $(id).addEventListener(id === 'model' ? 'change' : 'input', () => { invalidate(); requirements(); });
$('show-key').addEventListener('click', () => {
  const show = $('api-key').type === 'password'; $('api-key').type = show ? 'text' : 'password';
  $('show-key').textContent = show ? 'Ocultar clave' : 'Mostrar clave'; $('show-key').setAttribute('aria-pressed', String(show));
});
$('key-page').addEventListener('click', () => api.official($('provider').value));
$('official').addEventListener('click', () => api.official($('provider').value));
$('rescan').addEventListener('click', () => run(scan, 'Comprobando los servicios locales…'));
for (const [id, action] of [['install-ollama', 'install'], ['start-ollama', 'start'], ['download', 'pull']]) {
  $(id).addEventListener('click', () => run(async () => {
    invalidate(); pulling = action === 'pull'; $('cancel-download').hidden = !pulling; controls();
    const result = await api.ollama(action, $('download-model').value);
    pulling = false; $('cancel-download').hidden = true;
    if (!result.ok) { error(result.error); return; }
    await scan();
  }, action === 'pull' ? 'Descargando el modelo…' : action === 'install' ? 'Instalando Ollama. Espera a que Windows termine…' : 'Encendiendo Ollama…'));
}
$('cancel-download').addEventListener('click', () => api.cancel());
$('find-models').addEventListener('click', () => run(async () => {
  invalidate(); const result = await api.check(choice(), false);
  models = result.models || []; $('model').replaceChildren(...models.map(model => new Option(model, model)));
  if (models.includes(info.settings.chatModel)) $('model').value = info.settings.chatModel;
  $('model-field').hidden = !models.length;
  if (!result.ok) error(result.error);
  $('operation-status').textContent = result.ok ? 'Modelos encontrados. Elige uno y prueba su respuesta.' : 'La conexión todavía no está lista.';
}, 'Buscando modelos disponibles…'));
$('test-model').addEventListener('click', () => run(async () => {
  invalidate(); const result = await api.check(choice(), true);
  if (!result.ok) { error(result.error); $('operation-status').textContent = 'El modelo no superó la prueba.'; return; }
  verification = result; $('test-reply').textContent = result.reply; $('test-reply').hidden = false;
  $('operation-status').textContent = 'Respuesta recibida. La conexión está lista para guardar.'; requirements();
}, 'Esperando una respuesta del modelo. La primera carga local puede tardar…'));
api.onProgress(payload => {
  if (payload.kind === 'pull') {
    if (payload.total) { $('progress').max = payload.total; $('progress').value = payload.completed; }
    $('operation-status').textContent = payload.total ? `Descargando: ${bytes(payload.completed)} de ${bytes(payload.total)}.` : 'Preparando la descarga del modelo…';
  } else $('operation-status').textContent = 'Windows está instalando Ollama. Esta ventana volverá a estar disponible al terminar.';
});
async function boot() {
  info = await api.info(); const cfg = info.settings;
  $('user-name').value = cfg.userName; $('persona').value = cfg.persona;
  $('size').value = ['0.45', '0.6', '0.8'].includes(String(cfg.scale)) ? cfg.scale : .6;
  $('motion').value = cfg.motion; $('rest').value = cfg.rest; $('render').value = cfg.render;
  $('wander').checked = cfg.wander; $('sound').checked = !cfg.muted; $('startup').checked = info.startup;
  $('startup-note').hidden = info.startupAllowed;
  $('my-lines').value = cfg.myLines.join('\n'); $('memories').value = cfg.memories.join('\n');
  for (const display of info.displays) $('display').add(new Option(display.label, String(display.id)));
  $('display').value = info.displays.some(display => display.id === cfg.displayId) ? String(cfg.displayId) : '';
  $('provider').value = [...$('provider').options].some(option => option.value === cfg.provider) ? cfg.provider : 'later';
  $('url').value = cfg.customUrl; preview(); providerUI(false);
  await run(scan, 'Comprobando los servicios locales…'); controls();
}
boot().catch(() => { error('No se pudo abrir tu configuración. Cierra este asistente y vuelve a intentarlo.'); });
