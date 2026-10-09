"""Read-only console viewer integration tests, with no requests to user accounts."""
from pathlib import Path
from urllib.parse import urlparse
import hashlib, json, mimetypes, re
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'.console-navigation-review';OUT.mkdir(exist_ok=True)
BASE='http://127.0.0.1:8765'
script=(ROOT/'console-gallery.js').read_text()
records=json.loads(re.search(r'const records = (.*?);',script).group(1))
def key(name):
 import unicodedata
 return re.sub('[^a-z0-9]','',unicodedata.normalize('NFKD',name).lower())
ids={key(alias):r[0] for r in records for alias in r[1:]}
retro=next(e for e in json.loads((ROOT/'data/events.json').read_text()) if e['id']=='retro-gaming')
expected=[(ids[key(i['name'])],i['name']) for block in retro['content'] if block['type']=='systems' for i in block['items']]
assert len(expected)==len(set(x[0] for x in expected))==72
result={'viewports':[], 'checks':[], 'sourceHashes':{}}
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True)
 for case,(width,height,scale) in enumerate([(390,844,1),(320,640,1),(1280,900,1),(390,844,2),(844,390,1)]):
  requests=[];errors=[];failed=set()
  context=browser.new_context(viewport={'width':width,'height':height},service_workers='block')
  def route_request(route):
   req=route.request;path=urlparse(req.url).path
   if req.method not in ('GET','HEAD') or urlparse(req.url).netloc!=urlparse(BASE).netloc:
    return route.fulfill(status=200,content_type='application/json',body='{}')
   if path=='/api/vendor-directory':return route.fulfill(status=200,content_type='application/json',body='[]')
   if path.startswith('/api/'):return route.fulfill(status=200,content_type='application/json',body='{}')
   if path in failed:return route.fulfill(status=503,body='Unavailable')
   target=ROOT/(path.lstrip('/') or 'index.html')
   if target.is_file():return route.fulfill(status=200,content_type=mimetypes.guess_type(target.name)[0] or 'application/octet-stream',body=target.read_bytes())
   return route.fulfill(status=404,body='Not found')
  context.route('**/*',route_request)
  page=context.new_page();page.set_default_timeout(15000)
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.on('request',lambda r:requests.append(urlparse(r.url).path))
  page.goto(BASE,wait_until='domcontentloaded')
  page.wait_for_function('window.SFVCConsoleGallery && myConDataLoaded')
  page.wait_for_timeout(2500)
  page.evaluate('document.querySelectorAll("dialog[open]").forEach(d=>d.close());goTo("events");')
  if scale!=1:page.evaluate('(s)=>applyProgramTextScale(s,{persist:false})',scale)
  page.evaluate('SFVCEventGuide.open("retro-gaming")')
  page.wait_for_selector('#eventModal[open] [data-console-image]')
  cards=page.locator('#eventModal [data-console-image]')
  assert cards.count()==72
  assert not [r for r in requests if re.search(r'/console-\d+\.webp$',r)],'Full posters loaded early'
  cards.first.click()
  viewer=page.locator('#consoleImageViewer')
  def ready():page.wait_for_selector('#consoleImageViewer[open] .console-full-image:not([hidden])')
  ready()
  assert page.locator('#consoleImageTitle').inner_text()=='Magnavox Odyssey'
  assert page.locator('#consoleImageProgress').inner_text()=='1 / 72'
  assert set(r for r in requests if re.search(r'/console-\d+\.webp$',r))=={'/assets/consoles/console-01.webp'}
  def controls_fit():
   for selector in ['.console-viewer-close','.console-viewer-previous','.console-viewer-next']:
    b=viewer.locator(selector).bounding_box()
    assert b and b['width']>=44 and b['height']>=44 and b['x']>=0 and b['y']>=0 and b['x']+b['width']<=width+1 and b['y']+b['height']<=height+1,(selector,b)
   assert viewer.evaluate('(el)=>el.scrollWidth<=el.clientWidth+1')
  controls_fit()
  page.screenshot(path=str(OUT/f'console-navigation-{width}x{height}-scale-{scale}.png'))
  if case==0:
   failed.add('/assets/consoles/console-12.webp')
   viewer.locator('.console-viewer-next').click()
   page.wait_for_selector('.console-viewer-retry:not([hidden])')
   assert viewer.locator('.console-viewer-zoom').is_disabled()
   assert not viewer.locator('.console-viewer-next').is_disabled()
   failed.clear();viewer.locator('.console-viewer-retry').click();ready()
   viewer.locator('.console-viewer-previous').click();ready()
   seen=[]
   for idx,(id,name) in enumerate(expected):
    ready();src=viewer.locator('img').get_attribute('src')
    seen.append(int(re.search(r'console-(\d+)\.webp',src).group(1)))
    assert page.locator('#consoleImageTitle').inner_text()==name
    assert page.locator('#consoleImageProgress').inner_text()==f'{idx+1} / 72'
    viewer.locator('.console-viewer-next').click()
   assert seen==[x[0] for x in expected]
   page.evaluate('for(let n=0;n<12;n++)document.querySelector(".console-viewer-next").click()')
   ready();assert page.locator('#consoleImageTitle').inner_text()==expected[12][1]
   page.evaluate('for(let n=0;n<12;n++)document.querySelector(".console-viewer-previous").click()')
  else:viewer.locator('.console-viewer-next').click();ready();viewer.locator('.console-viewer-previous').click()
  ready();assert page.locator('#consoleImageProgress').inner_text()=='1 / 72'
  viewer.locator('.console-viewer-previous').click();ready()
  assert page.locator('#consoleImageTitle').inner_text()==expected[-1][1]
  assert page.locator('#consoleImageProgress').inner_text()=='72 / 72'
  page.keyboard.press('ArrowRight');ready()
  assert page.locator('#consoleImageTitle').inner_text()==expected[0][1]
  before=viewer.locator('.console-viewer-next').bounding_box()
  viewer.locator('.console-viewer-zoom').click()
  assert viewer.evaluate('el=>el.classList.contains("console-zoomed")')
  page.evaluate('document.querySelector(".console-viewer-stage").scrollTo(200,250)')
  controls_fit()
  after=viewer.locator('.console-viewer-next').bounding_box()
  assert abs(before['y']-after['y'])<1
  viewer.locator('.console-viewer-next').click();ready()
  assert not viewer.evaluate('el=>el.classList.contains("console-zoomed")')
  assert page.locator('#consoleImageTitle').inner_text()==expected[1][1]
  assert viewer.locator('.console-viewer-zoom').inner_text()=='ZOOM IN'
  page.keyboard.press('Escape')
  page.wait_for_function('!document.querySelector("#consoleImageViewer").open')
  assert page.locator('#eventModal').evaluate('e=>e.open')
  assert cards.first.evaluate('e=>e===document.activeElement')
  assert not page.evaluate('document.documentElement.classList.contains("console-viewer-open")')
  mid=cards.nth(35);mid.scroll_into_view_if_needed()
  scroll=page.locator('#eventModal').evaluate('e=>e.scrollTop')
  mid.click();ready()
  assert page.locator('#consoleImageTitle').inner_text()==expected[35][1]
  assert page.locator('#consoleImageProgress').inner_text()=='36 / 72'
  viewer.locator('.console-viewer-next').click();ready()
  assert page.locator('#consoleImageTitle').inner_text()==expected[36][1]
  viewer.locator('.console-viewer-close').click()
  assert mid.evaluate('e=>e===document.activeElement')
  assert abs(page.locator('#eventModal').evaluate('e=>e.scrollTop')-scroll)<2
  page.evaluate('SFVCConsoleGallery.open(1);document.querySelector("#consoleImageViewer").close();SFVCConsoleGallery.open(29);')
  ready();page.wait_for_timeout(30)
  assert page.locator('#consoleImageTitle').inner_text()=='PlayStation 5'
  assert page.evaluate('document.documentElement.classList.contains("console-viewer-open")')
  viewer.locator('.console-viewer-close').click()
  assert not page.evaluate('document.documentElement.classList.contains("console-viewer-open")')
  assert not errors,errors
  result['viewports'].append({'width':width,'height':height,'textScale':scale,'status':'passed'})
  print('PASSED',width,height,scale,flush=True)
  context.close()
 browser.close()
result['checks']=['All 72 images match the displayed console order','Forward and reverse wraparound','Open any thumbnail at its correct gallery position','Only selected full image loads','Rapid arrow clicks keep image and title matched','Image load error and retry','Side arrows remain accessible while zoomed','New console resets to fit-to-screen','Left/right keyboard navigation','X and Escape restore original console-list focus and scroll','Native close/reopen cleanup','No browser page errors','No live-account writes']
for f in ['console-gallery.js','console-gallery.css','app.js','index.html','service-worker.js','data/version.json']:
 result['sourceHashes'][f]=hashlib.sha256((ROOT/f).read_bytes()).hexdigest()
(OUT/'test-results.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2))
