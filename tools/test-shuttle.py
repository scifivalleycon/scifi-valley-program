"""Isolated shuttle checks. All production/API requests are blocked or stubbed."""
from pathlib import Path
from urllib.parse import urlparse
import json,mimetypes,subprocess,hashlib
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'.shuttle-review';OUT.mkdir(exist_ok=True)
BASE='http://127.0.0.1:8765'
def baseline(path):return json.loads(subprocess.check_output(['git','show',f'HEAD:{path}'],cwd=ROOT))
events=json.loads((ROOT/'data/events.json').read_text());old=baseline('data/events.json')
assert len(events)==len(old)
assert [e for e in events if e['id']!='shuttle']==[e for e in old if e['id']!='shuttle']
newdirs=json.loads((ROOT/'data/directions.json').read_text());olddirs=baseline('data/directions.json')
for key in set(olddirs[0])|set(newdirs[0]):
 if key not in ['shuttleNotes','shuttleHours']:assert olddirs[0].get(key)==newdirs[0].get(key),key
allowed={'app.js','index.html','event-guide-ui.js','event-guide-layout.css','service-worker.js','data/events.json','data/directions.json','data/version.json'}
assert set(subprocess.check_output(['git','diff','--name-only'],cwd=ROOT,text=True).splitlines())==allowed
assert './event-guide-media.js' in (ROOT/'service-worker.js').read_text()
assert './assets/events/shuttle-october-2026.webp' in (ROOT/'service-worker.js').read_text()
report={'sourceOnlyShuttleChanges':True,'unrelatedProfilesSchedulesAndGalleriesUnchanged':True,'cases':[]}
with sync_playwright() as p:
 for engine in ['chromium','webkit']:
  browser=getattr(p,engine).launch(headless=True)
  for width,height,scale in [(390,844,1),(320,640,1),(1280,900,1),(390,844,2),(844,390,1)]:
   errors=[]
   context=browser.new_context(viewport={'width':width,'height':height},service_workers='block',has_touch=True,is_mobile=width<900)
   def handle(route):
    request=route.request;url=urlparse(request.url)
    if request.method not in ['GET','HEAD'] or url.netloc!=urlparse(BASE).netloc:
     return route.fulfill(status=200,content_type='application/json',body='{}')
    if url.path=='/api/vendor-directory':return route.fulfill(status=200,content_type='application/json',body='[]')
    if url.path.startswith('/api/'):return route.fulfill(status=200,content_type='application/json',body='{}')
    target=(ROOT/(url.path.lstrip('/') or 'index.html')).resolve()
    if target.is_relative_to(ROOT) and target.is_file():return route.fulfill(status=200,content_type=mimetypes.guess_type(target.name)[0] or 'application/octet-stream',body=target.read_bytes())
    return route.fulfill(status=404,body='Not found')
   context.route('**/*',handle)
   page=context.new_page();page.set_default_timeout(15000)
   page.on('pageerror',lambda e:errors.append(str(e)))
   page.goto(BASE,wait_until='domcontentloaded')
   page.wait_for_function('window.SFVCEventGuide && window.SFVCEventMedia && typeof myConDataLoaded!=="undefined" && myConDataLoaded')
   page.wait_for_timeout(1200)
   page.evaluate('document.querySelectorAll("dialog[open]").forEach(d=>d.close());goTo("more")')
   if scale!=1:page.evaluate('(scale)=>applyProgramTextScale(scale,{persist:false})',scale)
   page.locator('#eventQuickGrid [data-event-open="shuttle"]').click()
   modal=page.locator('#eventModal');page.wait_for_selector('#eventModal[open] .event-guide-banner')
   text=modal.inner_text()
   for part in ['2:00-9:00 PM','10:00 AM-8:00 PM','No Sunday shuttle service','1000 Park Ave','First Frontier','Blair County Convention Center']:
    assert part in text,(engine,width,part)
   assert 'does not currently publish' not in text and 'Once the public shuttle' not in text
   assert modal.evaluate('(m)=>m.scrollWidth<=m.clientWidth+1'),(engine,width,'modal overflow')
   action=modal.locator('.event-guide-action');assert action.get_attribute('target')=='_blank'
   assert 'Altoona+Curve+Baseball+Stadium+Parking+Garage' in action.get_attribute('href')
   assert 'noopener' in action.get_attribute('rel')
   modal.evaluate('(m)=>m.scrollTop=0')
   if width==390 and scale==1:page.screenshot(path=str(OUT/f'shuttle-info-{engine}.png'))
   image=modal.locator('.event-guide-banner img');image.scroll_into_view_if_needed()
   page.wait_for_function('document.querySelector("#eventModal .event-guide-banner img").complete && document.querySelector("#eventModal .event-guide-banner img").naturalWidth===1024')
   box=image.bounding_box();assert box and box['x']>=0 and box['x']+box['width']<=width+1,(engine,width,box)
   assert abs((box['height']-4)/(box['width']-4)-2)<.03,(engine,width,box)
   if width==390 and scale==1:page.screenshot(path=str(OUT/f'shuttle-banner-{engine}.png'))
   if width==390 and scale==1:
    with page.expect_popup() as popup_info:modal.locator('.event-guide-banner>a').click()
    popup=popup_info.value;popup.wait_for_load_state();assert 'shuttle-october-2026.webp' in popup.url;popup.close()
   close=page.locator('#closeEventModal');close.scroll_into_view_if_needed();close.click()
   page.wait_for_function('!document.getElementById("eventModal").open')
   page.evaluate('openEventDetails("shuttle")');assert modal.locator('.event-guide-banner img').count()==1
   assert '1000 Park Ave' in modal.inner_text()
   page.evaluate('document.getElementById("eventModal").close();goTo("more")')
   page.locator('#eventSearch').fill('shuttle')
   card=page.locator('#eventList .event-card').filter(has_text='Friday & Saturday Shuttle Service')
   assert card.count()==1
   card.locator('summary').click();assert card.locator('.event-guide-banner img').count()==1
   assert 'No Sunday shuttle service' in card.inner_text()
   page.evaluate('goTo("directions")')
   assert page.locator('#shuttleDirectionsCard').is_visible()
   directions=page.locator('#directionsShuttleNotes').inner_text()
   assert '2:00-9:00 PM' in directions and '10:00 AM-8:00 PM' in directions and 'no Sunday service' in directions
   if width==390 and scale==1:
    page.evaluate('goTo("more");SFVCEventGuide.open("retro-gaming")')
    page.wait_for_selector('#eventModal[open] [data-console-image]')
    assert page.locator('#eventModal [data-console-image]').count()==72
    page.evaluate('document.getElementById("eventModal").close()')
   security=page.evaluate('''()=>{
     const render=SFVCEventMedia.renderBlock;
     return ['javascript:alert(1)','data:text/html,<script>alert(1)</script>','https://user:pass@example.com'].every(url=>render({type:'link',url,text:'unsafe'})==='')
       && render({type:'image',src:'javascript:alert(1)'})===''
       && render({type:'link',url:'https://example.com',text:'<img onerror=alert(1)>'}).includes('&lt;img')
       && render({type:'p',text:'unchanged'})===null;
   }''');assert security
   assert not errors,(engine,width,errors)
   report['cases'].append({'engine':engine,'width':width,'height':height,'textScale':scale,'passed':True})
   context.close()
  browser.close()
report['checks']=['Shuttle-only data changes','Both Event Guide renderers show instructions and banner','Google directions link targets the garage','Full banner opens in a new tab','No horizontal overflow at tested widths or 200% text','Close button works','Directions screen synchronized','Console gallery retains 72 entries','Unsafe media URLs and HTML rejected']
(OUT/'test-results.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2))
