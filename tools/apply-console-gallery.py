from pathlib import Path
import json, copy
ROOT=Path(__file__).resolve().parents[1]
def replace_once(name,old,new):
 p=ROOT/name;s=p.read_text()
 if new in s:return
 assert s.count(old)==1,(name,'patch anchor missing or ambiguous')
 p.write_text(s.replace(old,new,1))
replace_once('app.js','  if(b.type==="systems")return ', '  if(b.type==="systems" && window.SFVCConsoleGallery)return `<h4>${escapeAppHtml(b.title||"")}</h4><div class="system-grid">${(b.items||[]).map(i=>window.SFVCConsoleGallery.renderCard(i)).join("")}</div>`;\n  if(b.type==="systems")return ')
replace_once('event-guide-ui.js','    if(block.type==="systems"){','    if(block.type==="systems" && window.SFVCConsoleGallery){\n      return `<section class="system-section">${block.title?`<h3>${esc(block.title)}</h3>`:""}<div class="system-grid">${(block.items||[]).map(item=>window.SFVCConsoleGallery.renderCard(item)).join("")}</div></section>`;\n    }\n\n    if(block.type==="systems"){')
replace_once('index.html','  <script src="event-guide-ui.js?v=4.82"></script>','  <script src="console-gallery.js?v=console-gallery-20261008"></script>\n  <script src="event-guide-ui.js?v=console-gallery-20261008"></script>')
replace_once('index.html','</head>','  <link rel="stylesheet" href="console-gallery.css?v=console-gallery-20261008">\n</head>')
replace_once('index.html','app.js?v=guest-weekend-20261007','app.js?v=console-gallery-20261008')
replace_once('app.js','const APP_BUILD_VERSION="4.108";','const APP_BUILD_VERSION="4.109";')
replace_once('service-worker.js','sfvc-program-guest-weekend-20261007','sfvc-program-console-gallery-20261008')
replace_once('service-worker.js','  "./","./index.html",','  "./console-gallery.js","./console-gallery.css",\n  "./","./index.html",')
root_events=json.loads((ROOT/'events.json').read_text())
full=next(e for e in root_events if e['id']=='retro-gaming')
source_blocks=[b for b in full['content'] if b.get('type')=='systems']
assert sum(len(b['items']) for b in source_blocks)==72
p=ROOT/'data/events.json';events=json.loads(p.read_text());before=copy.deepcopy(events)
retro=next(e for e in events if e['id']=='retro-gaming')
blocks=retro['content'];first=next(i for i,b in enumerate(blocks) if b.get('type')=='systems')
retro['content']=[b for b in blocks[:first] if b.get('type')!='systems']+source_blocks+[b for b in blocks[first:] if b.get('type')!='systems']
assert [e for e in events if e['id']!='retro-gaming']==[e for e in before if e['id']!='retro-gaming']
p.write_text(json.dumps(events,ensure_ascii=False,indent=2)+'\n')
p=ROOT/'.assetsignore';s=p.read_text()
for line in ['tools/','.console-build/','.console-review/','assets/consoles/build-manifest.json']:
 if line not in s.splitlines():s+='\n'+line
p.write_text(s.rstrip()+'\n')
print('Patched console gallery integration. All non-console event records are unchanged.')
