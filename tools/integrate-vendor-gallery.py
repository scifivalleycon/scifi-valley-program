"""Apply minimal, guarded integration changes to the verified V4.109 source."""
from pathlib import Path
import hashlib
ROOT = Path(__file__).resolve().parents[1]
EXPECTED = {'app.js':'d936caac03f141cf0be5f47a95798ed9339ca5e9','index.html':'8992ac6a8204c667c28f602636494cb2283dc48a','service-worker.js':'63e21a407a3d43bf68d279f2eb8463ed66e25fcf'}
for name, expected in EXPECTED.items():
    raw = (ROOT/name).read_bytes()
    actual = hashlib.sha1(b'blob '+str(len(raw)).encode()+b'\0'+raw).hexdigest()
    assert actual == expected, f'{name} changed; reconcile before applying: {actual}'

def replace_once(text, old, new):
    assert text.count(old) == 1, f'Expected one match: {old[:80]}'
    return text.replace(old, new, 1)

p = ROOT/'index.html'
text = p.read_text()
text = replace_once(text, '        <div id="mapDirectoryNotice"', '''        <div id="vendorGalleryLaunch" hidden>
          <button id="openVendorGallery" class="vendor-gallery-launch-button" type="button" aria-haspopup="dialog" aria-controls="vendorPhotoGallery" aria-describedby="vendorGallerySummary" disabled>
            <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false"><rect x="7" y="4" width="22" height="21" rx="3"/><path d="M3 10v16a3 3 0 0 0 3 3h17M8 21l6-7 5 5 4-4 5 6"/><circle cx="22" cy="10" r="2"/></svg>
            <span>VIEW ENTIRE VENDOR PHOTO GALLERY</span>
          </button>
          <p id="vendorGallerySummary"></p>
        </div>
        <div id="mapDirectoryNotice"''')
text = replace_once(text, '</head>', '  <link rel="stylesheet" href="vendor-gallery.css?v=vendor-gallery-20261008">\n</head>')
text = replace_once(text, '  <script src="console-gallery.js', '  <script src="vendor-gallery.js?v=vendor-gallery-20261008"></script>\n  <script src="console-gallery.js')
text = replace_once(text, 'app.js?v=console-gallery-20261008', 'app.js?v=vendor-gallery-20261008')
p.write_text(text)
p = ROOT/'app.js';text = p.read_text()
text = replace_once(text, 'const APP_BUILD_VERSION="4.109";', 'const APP_BUILD_VERSION="4.109";') if False else text
text = replace_once(text, 'const APP_BUILD_VERSION="4.109";', 'const APP_BUILD_VERSION="4.110";')
text = replace_once(text, 'function renderMapScreen({force=false}={}){', 'function renderMapScreen({force=false}={}){\n  window.SFVCVendorGallery?.update(state.vendors,{published:mapDirectoryVisible()&&mapVisible()});')
p.write_text(text)
p = ROOT/'service-worker.js';text = p.read_text()
text = replace_once(text, 'sfvc-program-console-gallery-20261008', 'sfvc-program-vendor-gallery-20261008')
text = replace_once(text, 'const LOCAL=[', 'const LOCAL=[\n  "./vendor-gallery.js","./vendor-gallery.css",')
p.write_text(text)
print('Integrated vendor gallery. Only index.html, app.js and service-worker.js changed.')
