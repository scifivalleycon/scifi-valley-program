"""Prepare only the 72 explicitly supplied public console images for review."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import hashlib
import json
import time
import gdown
from PIL import Image, ImageDraw, ImageOps

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / '.console-build'
ORIGINALS = OUT / 'originals'
OPTIMIZED = OUT / 'optimized'
for directory in (ORIGINALS, OPTIMIZED):
    directory.mkdir(parents=True, exist_ok=True)
SOURCES = [line.split() for line in (ROOT / 'tools/console-source-ids.txt').read_text().splitlines() if line.strip()]
assert [int(row[0]) for row in SOURCES] == list(range(1, 73))

def prepare(row):
    number, file_id = int(row[0]), row[1]
    source = ORIGINALS / f'{number:02d}.jpg'
    for attempt in range(3):
        try:
            if not source.exists():
                result = gdown.download(id=file_id, output=str(source), quiet=True, use_cookies=False)
                if not result:
                    raise RuntimeError(f'Download failed: console {number}')
            with Image.open(source) as image:
                image = ImageOps.exif_transpose(image).convert('RGB')
                width, height = image.size
                full = image.copy()
                full.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
                full_path = OPTIMIZED / f'console-{number:02d}.webp'
                full.save(full_path, 'WEBP', quality=78, method=6)
                thumb = image.copy()
                thumb.thumbnail((240, 320), Image.Resampling.LANCZOS)
                thumb_path = OPTIMIZED / f'console-{number:02d}-thumb.webp'
                thumb.save(thumb_path, 'WEBP', quality=76, method=6)
            print(f'Prepared console {number}: {source.stat().st_size} -> {full_path.stat().st_size} + {thumb_path.stat().st_size} bytes', flush=True)
            return {'number': number, 'fileId': file_id, 'sha256': hashlib.sha256(source.read_bytes()).hexdigest(), 'width': width, 'height': height, 'originalBytes': source.stat().st_size, 'fullBytes': full_path.stat().st_size, 'thumbnailBytes': thumb_path.stat().st_size}
        except Exception:
            source.unlink(missing_ok=True)
            if attempt == 2:
                raise
            time.sleep(3 * (attempt + 1))

with ThreadPoolExecutor(max_workers=4) as executor:
    results = sorted(executor.map(prepare, SOURCES), key=lambda row: row['number'])
(OUT / 'image-manifest.json').write_text(json.dumps(results, indent=2) + '\n')
for offset in range(0, 72, 12):
    sheet = Image.new('RGB', (1500, 1320), 'white')
    draw = ImageDraw.Draw(sheet)
    for index, number in enumerate(range(offset + 1, min(offset + 13, 73))):
        x, y = (index % 3) * 500, (index // 3) * 330
        with Image.open(ORIGINALS / f'{number:02d}.jpg') as image:
            header = image.crop((0, 0, image.width, int(image.height * 0.45)))
            header.thumbnail((490, 290), Image.Resampling.LANCZOS)
            sheet.paste(header, (x, y + 35))
        draw.text((x + 10, y + 8), f'FILE {number}', fill='black')
    sheet.save(OUT / f'contact-{offset + 1:02d}-{offset + 12:02d}.jpg', quality=90)
print(json.dumps({'count': len(results), 'originalBytes': sum(x['originalBytes'] for x in results), 'fullBytes': sum(x['fullBytes'] for x in results), 'thumbnailBytes': sum(x['thumbnailBytes'] for x in results)}))
