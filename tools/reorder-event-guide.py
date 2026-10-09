"""Move the existing search/activity block above guide shortcuts, without editing data."""
from pathlib import Path
from datetime import datetime, timezone
import hashlib
import json
import os

ROOT = Path(os.environ.get('SFVC_SOURCE', Path(__file__).resolve().parents[1]))
EXPECTED = {
    'index.html': 'ad727a1d31715b13902f48885822862b8a1c166b',
    'event-guide-layout.js': '9a666c65000b46e6ea302812f23716903fb1cecd',
    'app.js': '7778e911426ba5002cb0c20b8596762dbfef56f5',
    'service-worker.js': '6b7d531837dfe7e66b0006244fd0b772aae42045',
    'data/version.json': '0fa81bdd0c950e8e476cf5326aa722139d7d6ad9',
}
for name, expected in EXPECTED.items():
    data = (ROOT / name).read_bytes()
    actual = hashlib.sha1(b'blob ' + str(len(data)).encode() + b'\0' + data).hexdigest()
    if actual != expected:
        raise RuntimeError(f'{name} changed since review. Expected {expected}; got {actual}. Stop rather than overwrite.')

def replace_once(text, old, new):
    if text.count(old) != 1:
        raise RuntimeError(f'Expected exactly one match: {old[:100]!r}')
    return text.replace(old, new, 1)

p = ROOT / 'index.html'
s = p.read_text()
start = s.index('      <section class="event-guide-browser">')
results = s.index('        <div class="event-search-results-head">', start)
discovery = s[start:results]
# Move the actual existing elements, not a duplicate with conflicting IDs.
discovery = replace_once(discovery, '<section class="event-guide-browser">',
                          '<section id="eventGuideDiscovery" class="event-guide-browser">')
discovery = discovery.rstrip() + '\n      </section>\n\n'
s = s[:start] + '      <section class="event-guide-browser" aria-label="Program search and filter results">\n' + s[results:]
main_start = s.index('    <section id="more" class="screen">')
first_shortcut = s.index('      <button class="settings-menu-card" data-go="celebrity">', main_start)
s = s[:first_shortcut] + discovery + s[first_shortcut:]
s = replace_once(s, 'app.js?v=console-reading-v4.112', 'app.js?v=event-guide-order-v4.113')
s = replace_once(s, 'event-guide-layout.js?v=4.101', 'event-guide-layout.js?v=event-guide-order-v4.113')
p.write_text(s)

p = ROOT / 'event-guide-layout.js'
s = p.read_text()
old = '''  let zone=document.getElementById("sfvcEventGuideMainLayoutZone");
  if(zone)return zone;

  zone=document.createElement("div");
  zone.id="sfvcEventGuideMainLayoutZone";
  zone.className="sfvc-event-guide-main-layout-zone";

  const title=root.querySelector(":scope > .page-title");
  if(title?.nextSibling)root.insertBefore(zone,title.nextSibling);
  else root.prepend(zone);
  return zone;'''
new = '''  let zone=document.getElementById("sfvcEventGuideMainLayoutZone");
  if(!zone){
    zone=document.createElement("div");
    zone.id="sfvcEventGuideMainLayoutZone";
    zone.className="sfvc-event-guide-main-layout-zone";
  }

  // Keep the shortcut bars BELOW search and Events & Activities, including
  // after an Admin layout refresh. Move the nodes so their handlers survive.
  const anchor=root.querySelector(":scope > #eventGuideDiscovery")
    || root.querySelector(":scope > .page-title");
  if(anchor){
    if(anchor.nextElementSibling!==zone)root.insertBefore(zone,anchor.nextSibling);
  }else if(zone.parentElement!==root){
    root.prepend(zone);
  }
  return zone;'''
p.write_text(replace_once(s, old, new))
p = ROOT / 'app.js'
p.write_text(replace_once(p.read_text(), 'const APP_BUILD_VERSION="4.112";', 'const APP_BUILD_VERSION="4.113";'))
p = ROOT / 'service-worker.js'
p.write_text(replace_once(p.read_text(), 'const CACHE="sfvc-program-console-reading-v4.112";', 'const CACHE="sfvc-program-event-guide-order-v4.113";'))
p = ROOT / 'data/version.json'
version = json.loads(p.read_text())
version.update(version='program-v4.113-event-guide-activities-first',
               generatedAt=datetime.now(timezone.utc).isoformat(),
               source='event-guide-order-release')
p.write_text(json.dumps(version, indent=2) + '\n')
print('Updated only: ' + ', '.join(EXPECTED))
