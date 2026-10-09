"""Apply only the verified console viewer changes and release cache markers."""
from pathlib import Path
import hashlib,json
ROOT=Path(__file__).resolve().parents[1]
EXPECTED={'console-gallery.js':'4cefb54a3342e18e54bdf3a45edb68946439d6ca','console-gallery.css':'dcad808ac85ea0f3d5df4a67b8a442a2e73cf476','app.js':'a346743d9b59dd4bf8597dcec55f5cdeec058a3d','index.html':'2ec8e62475038e46ff365e663eb71fd8850a5208','service-worker.js':'9339df4ea798749a39415048866aada8df3fe5f4','data/version.json':'e60d59928322639b1163829c481cf8881737062e'}
for name,sha in EXPECTED.items():
 b=(ROOT/name).read_bytes()
 assert hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()==sha, f'Source changed: {name}'
p=ROOT/'console-gallery.js';s=p.read_text()
a=s.index('  let modal, imageNode, stage, status, zoomButton, retryButton, returnFocus, activeImage;')
b=s.index('  document.addEventListener("click", event => {',a)
p.write_text(s[:a]+(ROOT/'tools/console-navigation-viewer.js.txt').read_text()+s[b:])
p=ROOT/'console-gallery.css';p.write_text(p.read_text()+(ROOT/'tools/console-navigation-style.css.txt').read_text())
p=ROOT/'app.js';p.write_text(p.read_text().replace('const APP_BUILD_VERSION="4.110";','const APP_BUILD_VERSION="4.111";',1))
p=ROOT/'index.html';s=p.read_text()
for ext in ['js','css']:
 old=f'console-gallery.{ext}?v=console-gallery-20261008';assert s.count(old)==1
 s=s.replace(old,f'console-gallery.{ext}?v=console-navigation-v4.111')
s=s.replace('app.js?v=vendor-gallery-20261008','app.js?v=console-navigation-v4.111',1);p.write_text(s)
p=ROOT/'service-worker.js';p.write_text(p.read_text().replace('const CACHE="sfvc-program-vendor-gallery-20261008";','const CACHE="sfvc-program-console-navigation-v4.111";',1))
p=ROOT/'data/version.json';version=json.loads(p.read_text());version.update(version='program-v4.111-console-image-navigation',generatedAt='2026-10-09T02:30:00Z',source='console-image-navigation-release');p.write_text(json.dumps(version,indent=2)+'\n')
for name in EXPECTED:
 b=(ROOT/name).read_bytes();print(name,hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest(),flush=True)
