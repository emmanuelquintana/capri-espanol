"""Comprueba la entrega sin ejecutar las aplicaciones ni sus instaladores."""
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import zipfile
from pathlib import Path
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parents[1]
repos = json.loads((ROOT / 'repositorios.json').read_text(encoding='utf-8-sig'))
env = dict(os.environ, PYTHONIOENCODING='utf-8')
result = subprocess.run([sys.executable, str(ROOT / 'herramientas/inventariar.py'), '--verificar'],
                        check=True, capture_output=True, text=True, encoding='utf-8', env=env)
checked = 0
for repo in repos:
    with zipfile.ZipFile(ROOT / 'descargas' / (repo['slug'] + '.zip')) as package:
        prefix = package.infolist()[0].filename.split('/')[0] + '/'
        for member in package.infolist():
            if member.is_dir():
                continue
            relative = member.filename[len(prefix):]
            source = ROOT / 'fuentes' / repo['slug'] / relative
            assert hashlib.sha256(package.read(member)).digest() == hashlib.sha256(source.read_bytes()).digest(), relative
            checked += 1

# Ejercita el extractor propio con los ZIP ya descargados, sin acceso a la red.
with tempfile.TemporaryDirectory(prefix='verificacion-', dir=ROOT) as temporary:
    test_root = Path(temporary).resolve()
    assert test_root.is_relative_to(ROOT), 'La carpeta temporal debe permanecer dentro de la entrega.'
    (test_root / 'herramientas').mkdir()
    (test_root / 'descargas').mkdir()
    shutil.copy2(ROOT / 'repositorios.json', test_root / 'repositorios.json')
    shutil.copy2(ROOT / 'herramientas/extraer_fuentes.py', test_root / 'herramientas/extraer_fuentes.py')
    for repo in repos:
        archive = repo['slug'] + '.zip'
        shutil.copy2(ROOT / 'descargas' / archive, test_root / 'descargas' / archive)
    subprocess.run([sys.executable, str(test_root / 'herramientas/extraer_fuentes.py')], check=True,
                   capture_output=True, text=True, encoding='utf-8', env=env)
    for repo in repos:
        source = ROOT / 'fuentes' / repo['slug']
        restored = test_root / 'fuentes' / repo['slug']
        for file in source.rglob('*'):
            if file.is_file():
                assert file.read_bytes() == (restored / file.relative_to(source)).read_bytes(), file

local_links = 0
for document in [ROOT / 'README.md', *sorted((ROOT / 'analisis').glob('*.md'))]:
    for link in re.findall(r'\]\(([^)]+)\)', document.read_text(encoding='utf-8')):
        if '://' in link or link.startswith('#'):
            continue
        target = (document.parent / unquote(link.split('#')[0])).resolve()
        assert target.is_relative_to(ROOT) and target.exists(), (document.name, link)
        local_links += 1

summary = json.loads((ROOT / 'analisis/resumen-extraccion.json').read_text(encoding='utf-8'))
assert checked == summary['source_files'] == 3680
assert summary['extracted_assets'] == 141 and summary['extracted_frames'] == 142
log = ('VERIFICACION DE FASE 1\n'
       + result.stdout
       + f'PASS: {checked} archivos fuente coinciden byte a byte con sus ZIP originales.\n'
       + 'PASS: extractor reproducido en una carpeta temporal, tres arboles restaurados sin diferencias.\n'
       + f'PASS: {local_links} enlaces locales de informes resueltos.\n'
       + 'LIMITES: no se ejecutaron aplicaciones, instaladores, hooks ni proveedores de los originales.\n')
(ROOT / 'analisis/VERIFICACION.txt').write_text(log, encoding='utf-8')
print(log)
