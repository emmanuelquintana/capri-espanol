"""Inventario local y extracción de sprites; no ejecuta código de los repositorios."""
import csv
import base64
import io
import hashlib
import json
import re
import shutil
import sys
from collections import Counter, defaultdict
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
MEDIA = {'.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp', '.ico', '.svg', '.avif',
         '.ttf', '.otf', '.woff', '.woff2', '.mp3', '.wav', '.ogg', '.m4a', '.flac',
         '.mp4', '.webm', '.glb', '.gltf', '.vrm', '.fbx', '.obj', '.blend', '.psd',
         '.aseprite', '.atlas', '.moc3', '.cubism', '.vsix'}


def digest(path):
    with path.open('rb') as stream:
        return hashlib.file_digest(stream, 'sha256').hexdigest()


def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def csv_file(path, rows):
    with path.open('w', encoding='utf-8-sig', newline='') as stream:
        writer = csv.DictWriter(stream, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)


def verify():
    rows = json.loads((ROOT / 'analisis/assets.json').read_text(encoding='utf-8'))
    for row in rows:
        assert digest(ROOT / row['extracted']) == row['sha256'], row['extracted']
        assert digest(ROOT / row['source']) == row['source_sha256'], row['source']
    repos = json.loads((ROOT / 'repositorios.json').read_text(encoding='utf-8-sig'))
    slugs = {repo['repository']: repo['slug'] for repo in repos}
    with (ROOT / 'analisis/archivos-completos.csv').open(encoding='utf-8-sig', newline='') as stream:
        for row in csv.DictReader(stream):
            assert digest(ROOT / 'fuentes' / slugs[row['repository']] / row['path']) == row['sha256'], row['path']
    clips = json.loads((ROOT / 'analisis/animaciones.json').read_text(encoding='utf-8'))
    for clip in clips:
        original = Image.open(ROOT / clip['source']).convert('RGBA')
        rebuilt = Image.new('RGBA', original.size)
        for index in range(clip['frames']):
            frame = Image.open(ROOT / clip['output'] / f'{index:03}.png').convert('RGBA')
            rebuilt.paste(frame, (index * clip['cell_width'], 0))
        assert original.tobytes() == rebuilt.tobytes(), clip['name']
    for repo in json.loads((ROOT / 'repositorios.json').read_text(encoding='utf-8-sig')):
        assert digest(ROOT / 'descargas' / (repo['slug'] + '.zip')) == repo['archiveSha256']
    print(f'PASS: {len(rows)} assets íntegros, {sum(c["frames"] for c in clips)} frames reconstruidos sin diferencias, 3 archivos de origen verificados.')


def main():
    if '--verificar' in sys.argv:
        verify()
        return
    rows, all_files = [], []
    repos = json.loads((ROOT / 'repositorios.json').read_text(encoding='utf-8-sig'))
    for repo in repos:
        source_root = ROOT / 'fuentes' / repo['slug']
        for source in sorted(source_root.rglob('*')):
            if not source.is_file():
                continue
            relative = source.relative_to(source_root)
            source_digest = digest(source)
            all_files.append({'repository': repo['repository'], 'path': relative.as_posix(),
                              'bytes': source.stat().st_size, 'sha256': source_digest})
            if source.name.lower().startswith(('license', 'notice', 'ofl')):
                destination = ROOT / 'licencias' / repo['slug'] / relative
                destination.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(source, destination)
            is_metadata = source.suffix == '.json' and any(p in ('assets', 'sprites') for p in relative.parts)
            embedded = []
            if source.suffix in ('.js', '.ts', '.tsx', '.html', '.css', '.md'):
                content = source.read_text(encoding='utf-8-sig', errors='replace')
                for match in re.finditer(r'''(?:atob\(\s*["']|data:image/(?:png|jpeg|webp|gif|x-icon);base64,)([A-Za-z0-9+/=]+)''', content):
                    if len(match[1]) < 128:
                        continue
                    try:
                        raw = base64.b64decode(match[1], validate=True)
                        with Image.open(io.BytesIO(raw)) as image:
                            image.verify()
                        embedded.append((raw, content[:match.start()].count('\n') + 1))
                    except (OSError, ValueError):
                        continue
            for index, (raw, line) in enumerate(embedded):
                with Image.open(io.BytesIO(raw)) as image:
                    ext = image.format.lower()
                    destination = ROOT / 'assets/embedded' / repo['slug'] / relative.parent / f'{relative.stem}-{index}.{ext}'
                    destination.parent.mkdir(parents=True, exist_ok=True)
                    destination.write_bytes(raw)
                    rows.append({'repository': repo['repository'], 'path': relative.as_posix() + f'#L{line}',
                                 'role': 'imagen embebida; revisar contexto original', 'type': ext, 'bytes': len(raw),
                                 'sha256': hashlib.sha256(raw).hexdigest(), 'source_sha256': source_digest,
                                 'extraction': 'base64', 'width': image.width, 'height': image.height,
                                 'container_frames': getattr(image, 'n_frames', 1), 'alpha': 'A' in image.getbands(),
                                 'source': source.relative_to(ROOT).as_posix(), 'extracted': destination.relative_to(ROOT).as_posix(),
                                 'url': f'https://github.com/{repo["repository"]}/blob/{repo["commit"]}/{relative.as_posix()}#L{line}'})
            if source.suffix.lower() not in MEDIA and not is_metadata:
                continue
            destination = ROOT / 'assets' / repo['slug'] / relative
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(source, destination)
            role = 'documentación' if any(p in ('docs', 'readme', 'site') for p in relative.parts) else 'producto / recurso'
            if any(p in ('test', 'tests', 'fixtures') for p in relative.parts):
                role = 'fixture de prueba; no es un recurso del personaje'
            row = {'repository': repo['repository'], 'path': relative.as_posix(), 'role': role,
                   'type': source.suffix.lower()[1:], 'bytes': source.stat().st_size, 'sha256': source_digest,
                   'source_sha256': source_digest, 'extraction': 'archivo original',
                   'width': '', 'height': '', 'container_frames': '', 'alpha': '',
                   'source': source.relative_to(ROOT).as_posix(), 'extracted': destination.relative_to(ROOT).as_posix(),
                   'url': f'https://github.com/{repo["repository"]}/blob/{repo["commit"]}/{relative.as_posix()}'}
            try:
                with Image.open(source) as im:
                    row.update(width=im.width, height=im.height, container_frames=getattr(im, 'n_frames', 1),
                               alpha=('A' in im.getbands() or 'transparency' in im.info))
            except (OSError, ValueError):
                pass
            rows.append(row)
    csv_file(ROOT / 'analisis/assets.csv', rows)
    csv_file(ROOT / 'analisis/archivos-completos.csv', all_files)
    write_json(ROOT / 'analisis/assets.json', rows)
    duplicates = defaultdict(list)
    for row in rows:
        duplicates[row['sha256']].append(row['extracted'])
    write_json(ROOT / 'analisis/duplicados.json', {k: v for k, v in duplicates.items() if len(v) > 1})

    # Los recuentos y velocidades se toman del constructor Clip original, sin inferirlos del dibujo.
    original = ROOT / 'fuentes/lachydotmcg--capri-desktop/app/Capri.cs'
    definitions = re.findall(r'new Clip\("([\w_]+)", (\d+), ([\d.]+), ([\d.]+)f?\)', original.read_text(encoding='utf-8-sig'))
    assert len(definitions) == 13, 'Cambió el mapa de animaciones: revisar antes de extraer.'
    clips = []
    for name, count, fps, scale in definitions:
        source = ROOT / f'fuentes/lachydotmcg--capri-desktop/assets/sprites/{name}.png'
        im = Image.open(source).convert('RGBA')
        count, fps = int(count), float(fps)
        assert im.width % count == 0, name
        cell = im.width // count
        output = ROOT / f'assets/frames-lachy/{name}'
        output.mkdir(parents=True, exist_ok=True)
        frames = [im.crop((i * cell, 0, (i + 1) * cell, im.height)) for i in range(count)]
        for index, frame in enumerate(frames):
            frame.save(output / f'{index:03}.png')
        frames[0].save(output / 'preview.webp', save_all=True, append_images=frames[1:],
                       duration=round(1000 / fps), loop=0, lossless=True)
        clips.append({'name': name, 'frames': count, 'fps': fps, 'render_height_factor': float(scale),
                      'cell_width': cell, 'cell_height': im.height, 'source': source.relative_to(ROOT).as_posix(),
                      'output': output.relative_to(ROOT).as_posix(), 'evidence': 'app/Capri.cs:363-375'})
    write_json(ROOT / 'analisis/animaciones.json', clips)

    previews = []
    for clip in clips:
        previews.append((f'Lachy / {clip["name"]} / {clip["frames"]} f', ROOT / clip['output'] / '000.png'))
    mochi = ROOT / 'fuentes/mochiiwuff--capri-desktop/assets/capri'
    previews.extend(('Mochii / ' + p.stem, p) for p in sorted(mochi.glob('*')) if p.suffix.lower() in ('.png', '.webp'))
    font = ImageFont.truetype('C:/Windows/Fonts/segoeui.ttf', 14)
    width, height, columns = 230, 210, 5
    sheet = Image.new('RGB', (width * columns, 55 + height * ((len(previews) + columns - 1) // columns)), '#15191c')
    draw = ImageDraw.Draw(sheet)
    draw.text((18, 14), 'CAPRI / FASE 1 — Assets originales y frames extraídos', fill='#f5f5f5', font=font)
    for index, (label, source) in enumerate(previews):
        x, y = (index % columns) * width, 55 + (index // columns) * height
        im = Image.open(source).convert('RGBA')
        im.thumbnail((width - 22, height - 38))
        sheet.paste(im, (x + (width - im.width) // 2, y + 2), im)
        draw.text((x + 8, y + height - 25), label[:33], font=font, fill='#e7e7e7')
    sheet.save(ROOT / 'analisis/lamina-assets.jpg', quality=92)
    summary = {'source_files': len(all_files), 'extracted_assets': len(rows), 'embedded_images': sum(r['extraction'] == 'base64' for r in rows), 'unique_asset_hashes': len(duplicates),
               'asset_bytes': sum(r['bytes'] for r in rows), 'by_repository': dict(Counter(r['repository'] for r in rows)),
               'by_type': dict(Counter(r['type'] for r in rows)), 'animation_clips': len(clips),
               'extracted_frames': sum(c['frames'] for c in clips), 'contact_sheet_tiles': len(previews)}
    write_json(ROOT / 'analisis/resumen-extraccion.json', summary)
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    verify()


if __name__ == '__main__':
    main()
