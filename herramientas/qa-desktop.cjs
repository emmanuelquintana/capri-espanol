const { _electron } = require('../app/node_modules/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'qa-desktop');
const profile = path.join(output, 'perfiles', 'qa-' + Date.now());
const packaged = process.argv[2];
fs.mkdirSync(profile, { recursive: true });

(async () => {
  const requests = [];
  let unavailable = false;
  const provider = http.createServer(async (req, res) => {
    if (req.url === '/v1/models') return res.end(JSON.stringify({ data: [{ id: 'capri/prueba-local', object: 'model' }] }));
    if (req.url === '/v1/chat/completions') {
      let raw = ''; for await (const chunk of req) raw += chunk;
      requests.push(JSON.parse(raw));
      if (unavailable) { res.writeHead(503); return res.end(JSON.stringify({ error: { message: 'Prueba local: servicio temporalmente no disponible.' } })); }
      res.writeHead(200, { 'Content-Type': 'text/event-stream' });
      for (const text of ['Hola, choom. ', 'Soy una respuesta de prueba local. ', 'Tu modelo real se elige en el menú.']) {
        res.write('data: ' + JSON.stringify({ choices: [{ delta: { content: text } }] }) + '\n\n');
        await new Promise(resolve => setTimeout(resolve, 120));
      }
      return res.end('data: [DONE]\n\n');
    }
    res.writeHead(404); res.end();
  });
  await new Promise(resolve => provider.listen(0, '127.0.0.1', resolve));
  fs.writeFileSync(path.join(profile, 'config.json'), JSON.stringify({ provider: 'custom', customUrl: `http://127.0.0.1:${provider.address().port}/v1`,
    motion: 'reduced', motionAsked: true, wander: false, muted: true }));
  let desktop, page;
  const errors = [], results = [];
  async function launch() {
    const env = { ...process.env, CAPRI_ES_PROFILE: profile, CAPRI_ES_PORT: '47839' }; delete env.ELECTRON_RUN_AS_NODE;
    desktop = await _electron.launch({ executablePath: packaged || require('../app/node_modules/electron'),
      args: packaged ? [] : [path.join(root, 'app')], env, timeout: 60000 });
    page = await desktop.firstWindow();
    page.on('pageerror', error => errors.push(String(error)));
    await page.waitForFunction(() => document.getElementById('sprite').width > 0 && document.querySelector('.panel__line').textContent.length > 0, { timeout: 60000 });
  }
  async function command(payload) {
    await desktop.evaluate(({ BrowserWindow }, payload) => BrowserWindow.getAllWindows().find(win => win.webContents.getURL().startsWith('capri://app/')).webContents.send('capri:command', payload), payload);
  }
  async function snapshot(name) { await page.screenshot({ path: path.join(output, name + '.png') }); }
  async function until(check, label, timeout = 15000) {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      if (await check()) return;
      await page.waitForTimeout(150);
    }
    throw new Error('No se alcanzó el estado: ' + label);
  }
  try {
    await launch();
    await page.locator('[data-id="talk"]').waitFor({ state: 'visible' });
    assert.equal(await page.getAttribute('html', 'lang'), 'es');
    const identity = await desktop.evaluate(({ app }) => ({ name: app.getName(), profile: app.getPath('userData') }));
    assert.equal(identity.name, 'Capri en español'); assert.equal(identity.profile, profile);
    const contrast = await page.evaluate(() => {
      const canvas = document.createElement('canvas'), context = canvas.getContext('2d');
      const luminance = color => {
        context.fillStyle = color; context.fillRect(0, 0, 1, 1);
        const rgb = Array.from(context.getImageData(0, 0, 1, 1).data).slice(0, 3).map(v => v / 255)
          .map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
        return .2126 * rgb[0] + .7152 * rgb[1] + .0722 * rgb[2];
      };
      const ratio = selector => {
        const style = getComputedStyle(document.querySelector(selector));
        const a = luminance(style.color), b = luminance(style.backgroundColor);
        return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
      };
      return { primary: ratio('.panel__action.is-primary'), badge: ratio('.panel__state') };
    });
    assert.ok(contrast.primary >= 4.5 && contrast.badge >= 4.5, 'Contraste insuficiente: ' + JSON.stringify(contrast));
    results.push('Texto del botón principal y de estado: contraste mínimo 4.5:1.');
    results.push('Primera apertura en español y perfil propio; modo compañía sin hooks.');
    await snapshot('bienvenida-es');
    await page.getByRole('button', { name: 'Entendido', exact: true }).click();
    await page.locator('#panel').waitFor({ state: 'hidden' });

    for (const width of [1440, 1280, 1024, 768, 430, 390]) {
      await desktop.evaluate(({ BrowserWindow }, width) => BrowserWindow.getAllWindows()[0].setBounds({ x: 10, y: 10, width, height: width < 768 ? 844 : 900 }), width);
      await command({ name: 'guide', topic: 'welcome' });
      await page.locator('[data-id="talk"]').waitFor({ state: 'visible' });
      await page.waitForTimeout(200);
      const layout = await page.evaluate(() => {
        const p = document.getElementById('panel').getBoundingClientRect();
        const body = document.querySelector('.panel__body');
        return { width: innerWidth, height: innerHeight, x: p.x, y: p.y, right: p.right, bottom: p.bottom,
          contentWidth: body.clientWidth, contentScrollWidth: body.scrollWidth, overflowX: getComputedStyle(document.body).overflowX };
      });
      assert.ok(layout.x >= 0 && layout.y >= 0 && layout.right <= layout.width + 1 && layout.bottom <= layout.height + 1, JSON.stringify(layout));
      assert.equal(layout.overflowX, 'hidden');
      assert.ok(layout.contentScrollWidth <= layout.contentWidth + 1, JSON.stringify(layout));
      await snapshot('bienvenida-' + width);
      await page.getByRole('button', { name: 'Entendido', exact: true }).click();
      await page.locator('#panel').waitFor({ state: 'hidden' });
      results.push('Panel dentro de pantalla sin desbordamiento horizontal: ' + width);
    }

    await desktop.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].setBounds({ x: 10, y: 10, width: 1280, height: 900 }));
    await command({ name: 'chat' });
    let input = page.locator('.panel__input');
    await input.waitFor({ state: 'visible' });
    await input.fill('Hola, Capri'); await input.press('Enter');
    await page.waitForFunction(() => document.querySelector('.panel__line').textContent.includes('Soy una respuesta de prueba local.'));
    await page.waitForFunction(() => !document.querySelector('.panel__input').disabled);
    assert.ok(requests[0].messages[0].content.includes('Escribe todo en español'));
    await snapshot('chat-prueba-local');
    results.push('Chat: una respuesta real del motor HTTP simulado, instrucciones en español y envío por teclado.');
    await input.fill('recuerda que mi gato se llama Neko'); await input.press('Enter');
    await page.waitForFunction(() => !document.querySelector('.panel__input').disabled);
    await page.waitForFunction(async () => (await window.host.getConfig()).memories.includes('mi gato se llama Neko'));
    await input.press('Escape'); await page.locator('#panel').waitFor({ state: 'hidden' });
    await command({ name: 'customize' });
    await input.waitFor({ state: 'visible' });
    await input.fill('Álex'); await input.press('Enter');
    await page.waitForFunction(async () => (await window.host.getConfig()).userName === 'Álex');
    await page.keyboard.press('Escape');
    results.push('Nombre con tilde y recuerdo explícito guardados desde la interfaz.');
    await desktop.close(); desktop = null;
    await launch();
    input = page.locator('.panel__input');
    const saved = await page.evaluate(() => window.host.getConfig());
    assert.equal(saved.userName, 'Álex'); assert.ok(saved.memories.includes('mi gato se llama Neko'));
    const history = await page.evaluate(() => window.host.chatMemory()); assert.ok(history.length >= 4);
    results.push('Reinicio: nombre, recuerdos y conversación recuperados.');
    await command({ name: 'chat' }); await input.waitFor({ state: 'visible' });
    unavailable = true;
    await input.fill('prueba de error'); await input.press('Enter');
    await page.waitForFunction(() => !document.querySelector('.panel__input').disabled);
    await snapshot('error-proveedor-local');
    await input.press('Escape');
    results.push('Proveedor no disponible: la interfaz vuelve a permitir escribir y cerrar.');
    await page.locator('#panel').waitFor({ state: 'hidden' });
    const fixture = await desktop.evaluate(async ({ BrowserWindow }) => {
      const win = new BrowserWindow({ title: 'Ventana de prueba de Capri', x: 150, y: 350, width: 600, height: 280,
        webPreferences: { contextIsolation: true, sandbox: true, nodeIntegration: false } });
      await win.loadURL('data:text/html,<h1>Ventana de prueba local</h1><p>Solo se prueba el apoyo del personaje.</p>');
      win.setAlwaysOnTop(true, 'floating');
      win.show();
      return { id: win.id, handle: win.getNativeWindowHandle().readBigUInt64LE().toString() };
    });
    await until(async () => (await page.evaluate(() => window.host.windowsNow()))?.wins.some(win => String(win.id) === fixture.handle), 'ventana nativa detectada');
    const pile = await page.evaluate(async handle => {
      const state = await window.host.windowsNow(), config = await window.host.getConfig();
      return state.wins.filter(win => !win.max && win.w > 260 && win.y > 232 * config.scale + 12 && win.y < innerHeight - 80)
        .findIndex(win => String(win.id) === handle);
    }, fixture.handle);
    assert.ok(pile >= 0, 'La ventana de prueba debe admitir el apoyo.');
    await command({ name: 'act', act: 'sit', pile });
    // Wait for the seat anchor, not a partial frame of the teleport animation.
    await until(async () => {
      const state = await page.evaluate(async () => ({ windows: await window.host.windowsNow(), config: await window.host.getConfig(), y: document.getElementById('sprite').getBoundingClientRect().top }));
      const win = state.windows?.wins.find(win => String(win.id) === fixture.handle);
      return win && Math.abs(state.y - (win.y + 3 - (56 + 232) * state.config.scale)) < 2;
    }, 'personaje sentado');
    await page.waitForTimeout(300);
    const beforeRide = await page.locator('#sprite').boundingBox();
    await desktop.evaluate(({ BrowserWindow }, id) => {
      const win = BrowserWindow.fromId(id), bounds = win.getBounds(); win.setPosition(bounds.x, bounds.y + 40);
    }, fixture.id);
    await until(async () => {
      const target = await page.evaluate(async handle => (await window.host.windowsNow())?.wins.find(win => String(win.id) === handle), fixture.handle);
      return target && Math.abs(target.y - 390) < 2;
    }, 'observador detecta el desplazamiento nativo');
    const obstructed = await page.evaluate(async handle => {
      const state = await window.host.windowsNow(), config = await window.host.getConfig();
      const index = state.wins.findIndex(win => String(win.id) === handle), win = state.wins[index];
      const x = win.x + win.w * .4, half = 34 * config.scale;
      return state.wins.slice(0, index).some(front => front.x < x + half && front.x + front.w > x - half && front.y <= win.y && front.y + front.h >= win.y);
    }, fixture.handle);
    try {
      await page.waitForFunction(({ before, obstructed }) => {
        const y = document.getElementById('sprite').getBoundingClientRect().top;
        return obstructed ? y > before + 100 : Math.abs(y - before - 40) < 5;
      }, { before: beforeRide.y, obstructed }, { timeout: 10000 });
    } catch (error) {
      const actual = await page.locator('#sprite').boundingBox();
      const target = await page.evaluate(async handle => (await window.host.windowsNow())?.wins.find(win => String(win.id) === handle), fixture.handle);
      await snapshot('fallo-apoyo-ventana');
      throw new Error('Apoyo de ventana: ' + JSON.stringify({ beforeRide, actual, target }), { cause: error });
    }
    const afterRide = await page.locator('#sprite').boundingBox();
    assert.ok(obstructed ? afterRide.y > beforeRide.y + 100 : Math.abs((afterRide.y - beforeRide.y) - 40) < 5, JSON.stringify({ beforeRide, afterRide, obstructed }));
    await snapshot('apoyo-ventana-prueba');
    await desktop.evaluate(({ BrowserWindow }, id) => BrowserWindow.fromId(id).close(), fixture.id);
    results.push(obstructed
      ? 'Ventana nativa: detecta 40 píxeles de movimiento; Capri baja al suelo porque otra ventana tapa su borde. Seguimiento sin obstrucción verificado en prueba de lógica separada.'
      : 'Ventana nativa: Capri se apoya en ella y la acompaña al moverla 40 píxeles.');
    assert.deepEqual(errors, []);
    fs.writeFileSync(path.join(output, 'resultado-' + (packaged ? 'empaquetado' : 'fuentes') + '.json'), JSON.stringify({ identity, results, errors, requests: requests.length,
      provider: 'HTTP local simulado; sin cuentas ni cargos', packaged: Boolean(packaged) }, null, 2));
    console.log(JSON.stringify({ results, errors, requests: requests.length }, null, 2));
  } finally { if (desktop) await desktop.close(); await new Promise(resolve => provider.close(resolve)); }
})().catch(error => { console.error(error); process.exit(1); });
