"""Preserve all original live console copy and verify enlarged-text behavior."""
from pathlib import Path
import json,re,subprocess,unicodedata
ROOT=Path(__file__).resolve().parents[1]
BASE='e39273ec44acde80e81d41e41c42849a258912a2'
original=json.loads(subprocess.check_output(['git','show',BASE+':data/events.json'],cwd=ROOT))
p=ROOT/'data/events.json';events=json.loads(p.read_text())
js_path=ROOT/'console-gallery.js';js=js_path.read_text()
records=json.loads(re.search(r'const records = (\[.*?\]);',js).group(1))
def key(s):return re.sub('[^a-z0-9]','',unicodedata.normalize('NFKD',s).lower())
lookup={key(name):row[0] for row in records for name in row[1:]}
old=next(e for e in original if e['id']=='retro-gaming')
new=next(e for e in events if e['id']=='retro-gaming')
previous={lookup[key(i['name'])]:i for b in old['content'] if b.get('type')=='systems' for i in b['items']}
assert len(previous)==42
items=[i for b in new['content'] if b.get('type')=='systems' for i in b['items']]
for item in items:
 number=lookup[key(item['name'])]
 if number in previous:
  item.clear();item.update(previous[number])
assert len(items)==72
assert sorted(lookup[key(i['name'])] for i in items)==list(range(1,73))
assert all(i==previous[lookup[key(i['name'])]] for i in items if lookup[key(i['name'])] in previous)
assert [e for e in events if e['id']!='retro-gaming']==[e for e in original if e['id']!='retro-gaming']
assert [b for b in new['content'] if b.get('type')!='systems']==[b for b in old['content'] if b.get('type')!='systems']
p.write_text(json.dumps(events,ensure_ascii=False,indent=2)+'\n')
js=js.replace('aria-label="Close console image" autofocus','aria-label="Close console image" data-font-scale="locked" autofocus')
js_path.write_text(js)
test_path=ROOT/'tools/test-console-gallery.py';test=test_path.read_text()
test=test.replace("assert page.locator('#consoleImageTitle').inner_text()=='Sony PS Vita'", "assert page.locator('#consoleImageTitle').inner_text()==page.locator('#eventModal [data-console-image=\"72\"]').get_attribute('data-console-label')")
anchor="  page.evaluate('window.SFVCEventGuide.open(\"retro-gaming\")')"
if 'if width==320:page.evaluate' not in test:
 test=test.replace(anchor,"  if width==320:page.evaluate('applyProgramTextScale(2,{persist:false})')\n"+anchor)
test_path.write_text(test)
print('Preserved all 42 original live console names, years and descriptions; added 30 existing full-catalog entries. Total 72. Other event records unchanged.')
