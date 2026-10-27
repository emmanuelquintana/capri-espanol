"""Descarga/extracción de las revisiones fijadas. No instala ni ejecuta los proyectos."""
import hashlib
import json
import shutil
import urllib.request
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
for repo in json.loads((ROOT / 'repositorios.json').read_text(encoding='utf-8-sig')):
    archive = ROOT / 'descargas' / (repo['slug'] + '.zip')
    archive.parent.mkdir(parents=True, exist_ok=True)
    if not archive.exists():
        urllib.request.urlretrieve(repo['archive'], archive)
    with archive.open('rb') as stream:
        assert hashlib.file_digest(stream, 'sha256').hexdigest() == repo['archiveSha256'], archive
    destination = ROOT / 'fuentes' / repo['slug']
    if destination.exists():
        raise SystemExit(f'Ya existe {destination}. No se sobrescriben los fuentes.')
    with zipfile.ZipFile(archive) as package:
        members = package.infolist()
        assert sum(member.file_size for member in members) < 500_000_000, 'Tamaño inesperado'
        prefix = members[0].filename.split('/')[0] + '/'
        for member in members:
            assert member.filename.startswith(prefix), 'Raíz inesperada'
            relative = member.filename[len(prefix):]
            if not relative:
                continue
            target = (destination / relative).resolve()
            assert target.is_relative_to(destination.resolve()), 'Ruta fuera de la carpeta'
            if member.is_dir():
                target.mkdir(parents=True, exist_ok=True)
                continue
            target.parent.mkdir(parents=True, exist_ok=True)
            with package.open(member) as source, target.open('xb') as output:
                shutil.copyfileobj(source, output)
    print(f'Extraído: {repo["repository"]} @ {repo["commit"]}')
