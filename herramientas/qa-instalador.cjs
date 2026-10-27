const { _electron } = require('../app/node_modules/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), http = require('node:http');
const root = path.resolve(__dirname, '..'), output = path.join(root, 'qa-desktop/instalador');
const profile = path.join(root, 'qa-desktop/perfiles', 'instalador-qa-' + Date.now());
const executable = process.argv[2];
fs.mkdirSync(output, { recursive: true }); fs.mkdirSync(profile, { recursive: true });
(async () => {
  let fail = false, desktop, page, requests = 0;
  const errors = [], checks = [];
  const server = http.createServer(async (req, res) => {
    assert.equal(req.headers.authorization, 'Bearer clave-ficticia-local');
    if (fail) { res.writeHead(401); return res.end(JSON.stringify({ error: { message: 'SECRET-NO-MOSTRAR' } })); }
    if (req.url === '/v1/models') return res.end(JSON.stringify({ data: [{ id: 'capri/prueba-instalador' }] }));
    let body = ''; for await (const chunk of req) body += chunk;
    assert.equal(JSON.parse(body).model, 'capri/prueba-instalador'); requests++;
    res.writeHead(200, { 'content-type': 'text/event-stream' });
    res.end('data: ' + JSON.stringify({ choices: [{ delta: { content: 'Hola. Esta es una respuesta de prueba local del instalador.' } }] }) + '\n\ndata: [DONE]\n\n');
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  fs.writeFileSync(path.join(profile, 'config.json'), JSON.stringify({ userName: 'Anterior', motion: 'reduced', welcomed: true, wander: false,
    customUrl: `http://127.0.0.1:${server.address().port}/v1`, unrelatedSetting: 'conservar' }));
  const launch = async () => {
    const env = { ...process.env, CAPRI_ES_PROFILE: profile, CAPRI_ES_PORT: '47839' }; delete env.ELECTRON_RUN_AS_NODE;
    desktop = await _electron.launch({ executablePath: executable || require('../app/node_modules/electron'),
      args: [...(executable ? [] : [path.join(root, 'app')]), '--configurar'], env });
    page = await desktop.firstWindow(); page.on('pageerror', error => errors.push(String(error)));
    await page.waitForFunction(() => !document.getElementById('next').disabled);
  };
  const shot = name => page.screenshot({ path: path.join(output, name + '.png') });
  const idle = () => page.waitForFunction(() => document.querySelector('main').getAttribute('aria-busy') === 'false');
  try {
    await launch();
    assert.equal(await page.getAttribute('html', 'lang'), 'es');
    const contrast = await page.evaluate(() => {
      const context = document.createElement('canvas').getContext('2d');
      const light = color => {
        context.fillStyle = color; context.fillRect(0, 0, 1, 1);
        const [r, g, b] = Array.from(context.getImageData(0, 0, 1, 1).data).slice(0, 3).map(value => value / 255)
          .map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
        return .2126 * r + .7152 * g + .0722 * b;
      };
      const ratio = (selector, background) => {
        const style = getComputedStyle(document.querySelector(selector));
        const a = light(style.color), b = light(background ? getComputedStyle(document.querySelector(background)).backgroundColor : style.backgroundColor);
        return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
      };
      return { primary: ratio('#next'), hint: ratio('.intro', 'body'), input: ratio('#user-name') };
    });
    assert.ok(Object.values(contrast).every(value => value >= 4.5), JSON.stringify(contrast));
    checks.push('Contraste renderizado de botón principal, texto de ayuda y campos: al menos 4.5:1.');
    await page.locator('#user-name').fill('Álex'); await page.locator('#persona').fill('Cercana, con humor y respuestas breves.');
    await page.locator('#size').selectOption('0.8'); await page.locator('#rest').selectOption('taskbar');
    await page.locator('#motion').selectOption('reduced');
    await page.locator('summary').click(); await page.locator('#memories').fill('Mi gato se llama Neko');
    assert.match(await page.locator('#preview-greeting').innerText(), /Álex/);
    for (const width of [1440, 1280, 1024, 768, 430, 390]) {
      await desktop.evaluate(({ BrowserWindow }, width) => BrowserWindow.getAllWindows()[0].setContentSize(width, 820), width);
      const layout = await page.evaluate(() => ({ w: innerWidth, h: innerHeight, scroll: document.documentElement.scrollWidth,
        content: document.querySelector('main').scrollWidth, footer: document.querySelector('footer').getBoundingClientRect().bottom }));
      assert.ok(layout.scroll <= layout.w + 1 && layout.content <= layout.w + 1 && layout.footer <= layout.h + 1, JSON.stringify(layout));
      await page.evaluate(() => document.querySelector('main').scrollTo(0, 0));
      await shot('personalizacion-' + width);
    }
    checks.push('Personalización y vista previa; sin desbordamiento horizontal en seis tamaños.');
    await page.locator('#next').click();
    assert.equal(await page.evaluate(() => document.activeElement.id), 'connection-title');
    // Only these three operations are simulated. No software or model is installed on the user's PC.
    await desktop.evaluate(({ app }) => {
      const localRequire = process.getBuiltinModule('module').createRequire(app.getAppPath() + '/package.json');
      const setup = localRequire(app.getAppPath() + '/src/main/setup.js');
      globalThis.installerFixture = { installed: false, running: false, models: [], winget: true };
      setup.ollamaState = async () => ({ ...globalThis.installerFixture });
      setup.installOllama = async () => { globalThis.installerFixture.installed = true; return { ok: true }; };
      setup.startOllama = async () => { globalThis.installerFixture.running = true; return { ok: true }; };
      setup.pullModel = async (name, progress) => { progress({ total: 100, completed: 100 }); globalThis.installerFixture.models = [name]; };
    });
    await page.locator('#provider').selectOption('ollama'); await page.locator('#rescan').click(); await idle();
    await page.locator('#install-ollama').click(); await idle();
    await page.locator('#start-ollama').click(); await idle();
    await page.locator('#download').click(); await idle();
    assert.match(await page.locator('#requirements-list').innerText(), /1 encontrados/);
    await shot('ollama-estados-simulados');
    checks.push('Estados de Ollama con fixtures: falta instalar, falta encender y descarga disponible; sin ejecutar instalaciones reales.');
    await desktop.evaluate(({ app }) => {
      const localRequire = process.getBuiltinModule('module').createRequire(app.getAppPath() + '/package.json');
      localRequire(app.getAppPath() + '/src/main/setup.js').pullModel = (_name, _progress, signal) =>
        new Promise((_resolve, reject) => signal.addEventListener('abort', () => reject(new Error('cancelled')), { once: true }));
    });
    await page.locator('#download').click(); await page.locator('#cancel-download').click(); await idle();
    assert.match(await page.locator('#error').innerText(), /Descarga cancelada/);
    checks.push('Cancelación de una descarga simulada: permite continuar sin guardar una conexión incompleta.');
    await page.locator('#provider').selectOption('custom');
    await page.locator('#api-key').fill('clave-ficticia-local');
    fail = true; await page.locator('#find-models').click(); await idle();
    assert.match(await page.locator('#error').innerText(), /clave válida/);
    assert.doesNotMatch(await page.locator('body').innerText(), /SECRET-NO-MOSTRAR/);
    await shot('error-clave'); assert.ok(await page.locator('#next').isDisabled());
    fail = false; await page.locator('#find-models').click(); await idle();
    assert.ok(await page.locator('#next').isDisabled());
    await page.locator('#test-model').click(); await idle();
    assert.match(await page.locator('#test-reply').innerText(), /respuesta de prueba local/);
    assert.ok(await page.locator('#next').isEnabled());
    await page.locator('#api-key').fill('otra'); assert.ok(await page.locator('#next').isDisabled());
    await page.locator('#api-key').fill('clave-ficticia-local'); await page.locator('#test-model').click(); await idle();
    await shot('conexion-probada');
    await page.evaluate(() => document.querySelector('main').scrollTo(0, 0)); await shot('conexion-primer-paso');
    checks.push('HTTP real simulado: clave rechazada sin secretos, modelos listados, respuesta recibida y prueba invalidada al cambiar la clave.');
    const before = JSON.parse(fs.readFileSync(path.join(profile, 'config.json')));
    assert.equal(before.userName, 'Anterior'); assert.equal(before.apiKeys, undefined);
    await page.locator('#next').click(); await shot('resumen');
    const newWindow = desktop.waitForEvent('window'); await page.locator('#next').click();
    const companion = await newWindow; await companion.waitForLoadState('domcontentloaded');
    const saved = JSON.parse(fs.readFileSync(path.join(profile, 'config.json')));
    assert.equal(saved.userName, 'Álex'); assert.equal(saved.scale, .8); assert.equal(saved.rest, 'taskbar');
    assert.equal(saved.unrelatedSetting, 'conservar'); assert.equal(saved.provider, 'custom');
    assert.equal(saved.chatModel, 'capri/prueba-instalador'); assert.ok(saved.memories.includes('Mi gato se llama Neko'));
    assert.match(saved.apiKeys.custom, /^enc:/); assert.ok(!fs.readFileSync(path.join(profile, 'config.json'), 'utf8').includes('clave-ficticia-local'));
    await desktop.close(); desktop = null;
    await launch(); assert.equal(await page.locator('#user-name').inputValue(), 'Álex');
    assert.equal(await page.locator('#api-key').inputValue(), '');
    await page.locator('#next').click(); await page.locator('#provider').selectOption('later');
    await page.keyboard.press('Tab'); await page.locator('#next').focus(); await page.keyboard.press('Enter');
    assert.equal(await page.locator('#summary-title').getAttribute('tabindex'), '-1');
    checks.push('Guardado solo al finalizar, clave cifrada con Windows, perfil conservado, reapertura precompletada y ruta sin IA por teclado.');
    assert.deepEqual(errors, []);
    fs.writeFileSync(path.join(output, 'resultado.json'), JSON.stringify({ checks, errors, requests, packaged: Boolean(executable), provider: 'HTTP local simulado; sin cuentas ni cargos' }, null, 2));
    console.log(JSON.stringify({ checks, errors, requests }, null, 2));
  } finally { if (desktop) await desktop.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exit(1); });
