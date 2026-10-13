"""Update only shuttle content, media rendering, and release cache keys."""
from pathlib import Path
import hashlib,json,os,re
ROOT=Path(os.environ.get('SFVC_SOURCE',Path(__file__).resolve().parents[1]))
EXPECTED={
 'app.js':'06cc3af6a3ddacc06bd02494973cf50413adf94b',
 'index.html':'943d5bea00106869534a892dc38845c8fa1835aa',
 'event-guide-ui.js':'73d024f69006f803fc14bc71faf9193a7df9ee06',
 'event-guide-layout.css':'ffa51558e70a4148a5443d1967ea78b92a10718a',
 'service-worker.js':'1196a3521e5d0cdbe289a478fcbd812a0099d7e7',
 'data/events.json':'9bf5a5af5aa3edc1318ffb04aa011521e8443ce8',
 'data/directions.json':'6b8440a399cdcc10b94f957b540539ea8374efa4',
 'data/version.json':'528ba3c5da0e2507c5974d4b789a440887193112'
}
def blob(data):return hashlib.sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest()
for name,expected in EXPECTED.items():
 assert blob((ROOT/name).read_bytes())==expected,f'{name} changed. Stop without overwriting.'
def replace(text,old,new):
 assert text.count(old)==1,repr(old)
 return text.replace(old,new,1)
events_path=ROOT/'data/events.json'
events=json.loads(events_path.read_text()); indexes=[i for i,e in enumerate(events) if e.get('id')=='shuttle'];assert len(indexes)==1
events[indexes[0]]=json.loads((ROOT/'tools/shuttle-block.json').read_text())
events_path.write_text(json.dumps(events,ensure_ascii=False,indent=2)+'\n')
p=ROOT/'data/directions.json';directions=json.loads(p.read_text());row=directions[0]
row['shuttleNotes']='Park at the Altoona Curve Baseball Stadium Parking Garage when convention center parking is full. Ride to the Blair County Convention Center entrance. Allow extra time before photo ops or panels. Friday and Saturday only; no Sunday service.'
row['shuttleHours']='Friday, October 16: 2:00-9:00 PM; Saturday, October 17: 10:00 AM-8:00 PM. All times Eastern.'
p.write_text(json.dumps(directions,ensure_ascii=False,indent=2)+'\n')
p=ROOT/'app.js';text=p.read_text();text=replace(text,'function renderBlock(b){','function renderBlock(b){\n  const media=window.SFVCEventMedia?.renderBlock(b);\n  if(media!=null)return media;');text=replace(text,'const APP_BUILD_VERSION="4.115";','const APP_BUILD_VERSION="4.116";');p.write_text(text)
p=ROOT/'event-guide-ui.js';text=p.read_text();text=replace(text,'  function renderBlock(block){','  function renderBlock(block){\n    const media=window.SFVCEventMedia?.renderBlock(block);\n    if(media!=null)return media;');p.write_text(text)
p=ROOT/'event-guide-layout.css'
css='''
/* V4.116: responsive event banners and directions, in both guide renderers. */
.event-content .event-guide-banner{display:block;width:100%;max-width:520px;margin:18px auto;box-sizing:border-box}
.event-content .event-guide-banner>a{display:block}
.event-content .event-guide-banner img{display:block;width:100%;max-width:100%;height:auto;box-sizing:border-box;border:2px solid var(--ink,#3a2720);border-radius:10px;background:var(--cream,#fff7df)}
.event-content .event-guide-banner figcaption{margin-top:8px;font-size:14px;line-height:1.4;text-align:center;overflow-wrap:anywhere}
.event-content .event-guide-action{display:inline-block;box-sizing:border-box;max-width:100%;padding:12px 16px;border:2px solid var(--ink,#3a2720);border-radius:8px;background:var(--aqua,#73c7cb);color:var(--ink,#3a2720);font-family:"Trebuchet MS",Arial,sans-serif;font-weight:800;line-height:1.4;text-align:center;text-decoration:underline;overflow-wrap:anywhere}
.event-content .event-guide-action:focus-visible,.event-content .event-guide-banner>a:focus-visible{outline:3px solid var(--ink,#3a2720);outline-offset:3px}
'''
p.write_text(p.read_text()+css)
p=ROOT/'index.html';text=p.read_text();text=replace(text,'<script src="event-guide-ui.js?v=console-gallery-20261008"></script>','<script src="event-guide-media.js?v=shuttle-v4.116"></script>\n  <script src="event-guide-ui.js?v=shuttle-v4.116"></script>');text=replace(text,'event-guide-layout.css?v=guide-colors-v4.114','event-guide-layout.css?v=shuttle-v4.116');text=replace(text,'app.js?v=vendor-photo-optimization-v4.115','app.js?v=shuttle-v4.116');p.write_text(text)
p=ROOT/'service-worker.js';text=p.read_text();text=replace(text,'const CACHE="sfvc-program-vendor-photo-optimization-v4.115";','const CACHE="sfvc-program-shuttle-v4.116";');text=replace(text,'const LOCAL=[','const LOCAL=[\n  "./event-guide-media.js","./assets/events/shuttle-october-2026.webp",');p.write_text(text)
p=ROOT/'data/version.json';v=json.loads(p.read_text());v.update(version='program-v4.116-shuttle-information',generatedAt='2026-10-13T16:45:00Z',source='official-events-page-shuttle-update');p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
print('Updated only: '+', '.join(EXPECTED))
