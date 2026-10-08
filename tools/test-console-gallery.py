"""Read-only browser and asset tests for the Retro Gaming console image update."""
from pathlib import Path
from urllib.parse import urlparse
import json, os, re, mimetypes
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'.console-review';OUT.mkdir(exist_ok=True)
BASE=os.environ.get('CONSOLE_TEST_BASE','https://app.scifivalleycon.com')
OFFLINE='CONSOLE_TEST_BASE' not in os.environ
HOST=urlparse(BASE).netloc
results={'base':BASE,'offlineFixture':OFFLINE,'viewports':[],'checks':[]}
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True)
 for width,height in [(390,844),(320,640),(1280,900)]:
  context=browser.new_context(viewport={'width':width,'height':height},service_workers='block')
  def routing(route):
   req=route.request;u=urlparse(req.url)
   if req.method not in ['GET','HEAD'] or u.netloc!=HOST or u.path.startswith('/api/'):
    return route.fulfill(status=200,content_type='application/json',body='{}')
   if OFFLINE:
    path=ROOT/(u.path.lstrip('/') or 'index.html')
    if path.is_file():return route.fulfill(status=200,content_type=mimetypes.guess_type(path.name)[0] or 'application/octet-stream',body=path.read_bytes())
    return route.fulfill(status=404,body='Not found')
   return route.continue_()
  context.route('**/*',routing)
  page=context.new_page();page.set_default_timeout(20000)
  errors=[];requests=[]
  page.on('pageerror',lambda error:errors.append(str(error)))
  page.on('request',lambda req:requests.append(req.url))
  page.goto(BASE+'/',wait_until='domcontentloaded')
  page.wait_for_function('window.SFVCEventGuide && window.SFVCConsoleGallery')
  page.wait_for_timeout(1500)
  page.evaluate('document.querySelectorAll("dialog[open]").forEach(d=>d.close())')
  page.evaluate('window.SFVCEventGuide.open("retro-gaming")')
  page.wait_for_selector('#eventModal[open] .console-thumbnail')
  buttons=page.locator('#eventModal .console-thumbnail')
  assert buttons.count()==72,('Expected all 72 console images',buttons.count())
  ids=buttons.evaluate_all('(els)=>els.map(e=>Number(e.dataset.consoleImage))')
  assert sorted(ids)==list(range(1,73)),ids
  assert page.locator('#eventModal .system-wiki-button').count()==72
  full_requests=lambda:[url for url in requests if re.search(r'/console-\d+\.webp(?:\?|$)',url)]
  assert not full_requests(),('Full images must not preload',full_requests())
  assert page.evaluate('Array.from(document.querySelectorAll("#eventModal .console-thumbnail img")).every(i=>i.loading==="lazy")')
  page.screenshot(path=str(OUT/f'console-list-{width}.png'))
  target=buttons.first;target.scroll_into_view_if_needed()
  position=page.locator('#eventModal').evaluate('(el)=>el.scrollTop')
  target.click()
  page.wait_for_selector('#consoleImageViewer[open] .console-full-image:not([hidden])')
  viewer=page.locator('#consoleImageViewer');box=viewer.bounding_box()
  assert abs(box['width']-width)<2 and abs(box['height']-height)<2,box
  image=viewer.locator('.console-full-image')
  assert image.evaluate('(i)=>i.complete && i.naturalWidth>0')
  assert image.get_attribute('src').endswith('console-01.webp')
  close=viewer.locator('.console-viewer-close');cbox=close.bounding_box()
  assert cbox['x']>=0 and cbox['x']+cbox['width']<=width+1 and cbox['y']>=0 and cbox['y']+cbox['height']<=height,cbox
  assert cbox['width']>=44 and cbox['height']>=44
  assert len(full_requests())==1,full_requests()
  page.screenshot(path=str(OUT/f'console-full-{width}.png'))
  viewer.locator('.console-viewer-zoom').click()
  assert 'console-zoomed' in viewer.get_attribute('class')
  assert viewer.locator('.console-viewer-stage').evaluate('(s)=>s.scrollHeight>s.clientHeight')
  viewer.locator('.console-viewer-zoom').click()
  page.keyboard.press('Escape')
  page.wait_for_function('!document.querySelector("#consoleImageViewer").open')
  assert page.locator('#eventModal').evaluate('(el)=>el.open')
  page.wait_for_function('document.activeElement.matches(".console-thumbnail")')
  assert abs(page.locator('#eventModal').evaluate('(el)=>el.scrollTop')-position)<4
  assert not page.evaluate('document.documentElement.classList.contains("console-viewer-open")')
  page.locator('#eventModal [data-console-image="72"]').click()
  page.wait_for_selector('#consoleImageViewer[open] .console-full-image:not([hidden])')
  assert page.locator('#consoleImageTitle').inner_text()=='Sony PS Vita'
  assert image.get_attribute('src').endswith('console-72.webp')
  close.click()
  page.wait_for_function('!document.querySelector("#consoleImageViewer").open')
  page.locator('#eventModal .system-wiki-button').first.click()
  page.wait_for_selector('#wikiReaderPanel[open]')
  page.wait_for_timeout(300)
  assert not viewer.evaluate('(el)=>el.open')
  page.evaluate('document.querySelector("#wikiReaderPanel").close()')
  context.route('**/console-02.webp',lambda route:route.fulfill(status=503,body='Unavailable'))
  page.locator('#eventModal [data-console-image="2"]').click()
  page.wait_for_selector('#consoleImageViewer[open] .console-viewer-retry:not([hidden])')
  assert 'could not load' in viewer.locator('.console-viewer-status').inner_text()
  close.click()
  page.wait_for_function('!document.querySelector("#consoleImageViewer").open')
  assert not errors,errors
  results['viewports'].append({'width':width,'height':height,'consoleCount':72,'fullBeforeClick':0,'fullscreen':True,'closeX':True,'escapePreservesParent':True,'zoom':True,'wikipediaPreserved':True,'imageErrorHandled':True,'javascriptErrors':errors})
  context.close()
 from PIL import Image
 paths=list((ROOT/'assets/consoles').glob('*.webp'))
 assert len(paths)==144
 for path in paths:
  with Image.open(path) as im:
   assert im.format=='WEBP';im.verify()
 results['checks'].append('All 144 optimized image files decode correctly.')
 browser.close()
(OUT/'test-results.json').write_text(json.dumps(results,indent=2)+'\n')
print(json.dumps(results,indent=2))
