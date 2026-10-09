"""Apply the requested shortcut theme only to verified source files."""
from pathlib import Path
from datetime import datetime, timezone
import hashlib
import json
ROOT=Path(__file__).resolve().parents[1]
EXPECTED={
 'event-guide-layout.css':'d90cc47365f35e7f02126b10bd08a73af6045b1e',
 'index.html':'5118f97691a5ad55aa0544a4dae0424ae522532d',
 'app.js':'8e34e6c5cbfdd82bbadda1517427320b1d45360e',
 'service-worker.js':'bc981193cc77bfdad2460443487b1752fd711b81',
 'data/version.json':'42b4c373cac2faee1511b8e7c77ae921173910af',
}
for name,expected in EXPECTED.items():
 data=(ROOT/name).read_bytes()
 actual=hashlib.sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest()
 if actual!=expected:raise RuntimeError(f'{name} changed: stop rather than overwrite. {actual} != {expected}')
def once(name,old,new):
 p=ROOT/name;s=p.read_text()
 if s.count(old)!=1:raise RuntimeError(f'Expected one match in {name}: {old}')
 p.write_text(s.replace(old,new,1))
p=ROOT/'event-guide-layout.css'
p.write_text(p.read_text()+(ROOT/'tools/event-guide-shortcut-theme.css').read_text())
once('index.html','event-guide-layout.css?v=4.101','event-guide-layout.css?v=guide-colors-v4.114')
once('index.html','app.js?v=event-guide-order-v4.113','app.js?v=guide-colors-v4.114')
once('app.js','const APP_BUILD_VERSION="4.113";','const APP_BUILD_VERSION="4.114";')
once('service-worker.js','const CACHE="sfvc-program-event-guide-order-v4.113";','const CACHE="sfvc-program-guide-colors-v4.114";')
p=ROOT/'data/version.json';v=json.loads(p.read_text())
v.update(version='program-v4.114-event-guide-shortcut-colors',generatedAt=datetime.now(timezone.utc).isoformat(),source='event-guide-shortcut-colors-release')
p.write_text(json.dumps(v,indent=2)+'\n')
print('Updated only: '+', '.join(EXPECTED))
