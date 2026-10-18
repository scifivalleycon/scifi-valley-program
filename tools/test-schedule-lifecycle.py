"""Full-app tests. Every remote/API request is intercepted; no live writes."""
import json,os,threading
from pathlib import Path
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from urllib.parse import urlparse
from datetime import datetime
from playwright.sync_api import sync_playwright
ROOT=Path.cwd();OUT=ROOT/'.schedule-review';OUT.mkdir(exist_ok=True)
class Handler(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',8765),Handler);threading.Thread(target=server.serve_forever,daemon=True).start()
vendors=(ROOT/'data/vendors.json').read_text()
ENDED='panel-panel-sunday-robin-lord-taylor-qanda-panel';FUTURE='sched-sunday-panel2-conquest-raffle';OLD='sched-friday-trivia-tournament';START_ONLY='photoop-photo-sunday-mike-vogel';GUEST='david-giuntoli';checks=[]
def mark(name):checks.append(name);print('PASS '+name,flush=True)
def intercept(route):
 url=urlparse(route.request.url)
 if url.hostname=='127.0.0.1' and not url.path.startswith('/api/'):route.continue_();return
 if url.path=='/api/vendor-directory':route.fulfill(status=200,content_type='application/json',body=vendors);return
 if route.request.resource_type=='image':route.fulfill(status=200,content_type='image/svg+xml',body='<svg xmlns="http://www.w3.org/2000/svg" width="4" height="4"></svg>');return
 route.fulfill(status=200,content_type='application/json',body=json.dumps({'ok':True,'updates':[],'favorites':[],'reminders':[],'reports':[],'pushLinked':False}))
def open_page(browser,when,zone='America/New_York',width=390,seed=True):
 ctx=browser.new_context(viewport={'width':width,'height':844},timezone_id=zone,service_workers='block');ctx.route('**/*',intercept)
 page=ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
 page.clock.install(time=datetime.fromisoformat(when.replace('Z','+00:00')))
 payload={'sfvc-my-schedule':json.dumps([OLD,ENDED,FUTURE,START_ONLY] if seed else []),'sfvc-favorites':json.dumps([GUEST]),'sfvc-reminder-minutes':'15','sfvc-schedule-hidden-categories':json.dumps(['Autographs']),'sfvc-push-user-disabled':'yes','sfvc-meta-advertising-consent-v1':'denied'}
 page.add_init_script('for(const [k,v] of Object.entries('+json.dumps(payload)+'))localStorage.setItem(k,v);')
 page.goto('http://127.0.0.1:8765/',wait_until='domcontentloaded');page.wait_for_function('myConCatalogReady && myConDataLoaded')
 page.evaluate('document.querySelectorAll("dialog[open]").forEach(d=>d.close())');assert not errors,errors
 return ctx,page,errors
def when(page,time):page.clock.set_system_time(datetime.fromisoformat(time.replace('Z','+00:00')));page.evaluate('refreshSavedScheduleLifecycle()')
def saved(page):return page.evaluate('[...state.mySchedule]')
try:
 with sync_playwright() as p:
  for engine in ['chromium','webkit']:
   browser=getattr(p,engine).launch()
   ctx,page,errors=open_page(browser,'2026-10-18T17:15:00Z',zone='America/Los_Angeles')
   assert page.evaluate('state.dayFilter')=='Sunday';assert OLD not in saved(page);assert set(saved(page))=={ENDED,FUTURE,START_ONLY}
   card=page.locator('#schedulePreview [data-saved-event="'+ENDED+'"]');assert 'saved-event-completed' in card.get_attribute('class')
   assert card.locator('.saved-event-ended').inner_text()=='This event is over'
   for selector in ['.saved-event-title','.saved-event-when']:assert card.locator(selector).evaluate('(e)=>getComputedStyle(e).textDecorationLine')=='line-through'
   assert card.locator('.schedule-remove').evaluate('(e)=>getComputedStyle(e).textDecorationLine')!='line-through'
   assert page.locator('#settingsScheduleList .saved-event-completed').count()==1
   assert page.locator('#schedulePreview [data-saved-event="'+FUTURE+'"] .saved-event-ended').count()==0
   assert page.evaluate('localStorage.getItem("sfvc-reminder-minutes")')=='15'
   assert page.evaluate('[...state.favorites]')==[GUEST];assert page.evaluate('[...state.scheduleHiddenCategories]')==['Autographs']
   mark(engine+': crossed-out title/day/time, status badge, both lists, guest favorites and preferences preserved')
   page.locator('#schedulePreview').scroll_into_view_if_needed();page.screenshot(path=str(OUT/(engine+'-my-schedule.png')))
   when(page,'2026-10-18T18:59:59Z');assert ENDED in saved(page)
   page.clock.fast_forward(1100);page.wait_for_function('(id)=>!state.mySchedule.has(id)',arg=ENDED)
   assert FUTURE in saved(page) and START_ONLY in saved(page)
   assert ENDED not in page.evaluate('Object.keys(savedScheduleSnapshots)')
   assert ENDED not in [x['eventId'] for x in page.evaluate('deviceSchedulePayload()')]
   assert page.evaluate('state.panels.some(p=>p.id==="panel-sunday-robin-lord-taylor-qanda-panel")')
   page.reload(wait_until='domcontentloaded');page.wait_for_function('myConCatalogReady')
   assert ENDED not in saved(page) and OLD not in saved(page);assert page.evaluate('[...state.favorites]')==[GUEST]
   mark(engine+': exact two-hour timer expiry, local storage, sync payload and reload')
   page.evaluate('goTo("home");document.querySelectorAll("dialog[open]").forEach(d=>d.close())')
   page.locator('#schedulePreview [data-remove-schedule="'+START_ONLY+'"]').click();assert START_ONLY not in saved(page)
   page.evaluate('(id)=>applyRecoveredRegistrationState({restoredSchedule:[{eventId:id,day:"Sunday",time:"12:00 PM",title:"ROBIN LORD TAYLOR Q&A PANEL"}]})',ENDED)
   assert ENDED not in saved(page);mark(engine+': manual X and expired-event recovery safeguard')
   page.evaluate('goTo("schedule")');assert page.locator('#dayFilters .active').inner_text()=='SUNDAY'
   page.locator('#dayFilters [data-day="Friday"]').click();page.evaluate('renderAll();refreshSavedScheduleLifecycle()');assert page.evaluate('state.dayFilter')=='Friday'
   page.evaluate('goTo("home");goTo("schedule")');assert page.evaluate('state.dayFilter')=='Sunday'
   mark(engine+': default Sunday with manual Friday browsing preserved during refresh');assert not errors,errors;ctx.close()
   ctx,page,errors=open_page(browser,'2026-10-10T12:00:00Z',zone='Pacific/Auckland',seed=False)
   assert page.evaluate('state.dayFilter')=='Friday';page.evaluate('goTo("schedule")')
   when(page,'2026-10-17T03:59:59Z');assert page.evaluate('state.dayFilter')=='Friday'
   when(page,'2026-10-17T04:00:00Z');assert page.evaluate('state.dayFilter')=='Saturday'
   page.locator('#dayFilters [data-day="Friday"]').click();page.evaluate('renderAll()');assert page.evaluate('state.dayFilter')=='Friday'
   page.clock.set_system_time(datetime.fromisoformat('2026-10-18T04:00:00+00:00'));page.evaluate('window.dispatchEvent(new Event("pageshow"))');assert page.evaluate('state.dayFilter')=='Sunday'
   when(page,'2026-10-19T05:00:00Z');assert page.evaluate('state.dayFilter')=='Sunday'
   mark(engine+': pre-event Friday, Eastern midnight, resume, post-event Sunday');ctx.close()
   ctx,page,errors=open_page(browser,'2026-10-18T17:15:00Z')
   page.evaluate('state.panels.find(p=>p.id==="panel-sunday-robin-lord-taylor-qanda-panel").endTime="2:00 PM";reconcileMyCon();renderMySchedule()')
   assert page.locator('#schedulePreview [data-saved-event="'+ENDED+'"] .saved-event-ended').count()==0
   page.evaluate('(id)=>dismissMyConChange("event:"+id)',ENDED);assert ENDED in saved(page)
   when(page,'2026-10-18T19:30:00Z');assert ENDED in saved(page)
   when(page,'2026-10-18T20:00:00Z');assert ENDED not in saved(page)
   mark(engine+': changed end time controls expiry; dismissing update does not unsave');ctx.close()
   ctx,page,errors=open_page(browser,'2026-10-18T17:15:00Z')
   page.evaluate('''() => {
    myConCatalogReady=false;myConDataLoaded=false;state.schedule=[];state.panels=[];state.photoOps=[];
    state.mySchedule.add("unknown-legacy");savedScheduleSnapshots["unknown-legacy"]={id:"unknown-legacy",title:"Legacy pending refresh",day:"Sunday",time:"TBD"};renderMySchedule();
   }''')
   when(page,'2026-10-18T19:00:00Z');assert ENDED not in saved(page);assert 'unknown-legacy' in saved(page) and FUTURE in saved(page)
   assert page.evaluate('[...state.favorites]')==[GUEST];mark(engine+': offline snapshots, unknown legacy and future items preserved');ctx.close()
   ctx,page,errors=open_page(browser,'2026-10-18T17:15:00Z',width=320)
   page.evaluate('for(let i=0;i<10;i++)document.getElementById("fontSizeIncrease").click()')
   page.locator('#schedulePreview').scroll_into_view_if_needed()
   assert page.locator('#schedulePreview').evaluate('(e)=>e.scrollWidth<=e.clientWidth+1')
   page.screenshot(path=str(OUT/(engine+'-my-schedule-small.png')));assert not errors,errors
   mark(engine+': 320-pixel mobile at enlarged text without saved-list overflow');ctx.close();browser.close()
 (OUT/'results.json').write_text(json.dumps({'result':'passed','checks':checks,'count':len(checks),'liveApiWrites':0},indent=2)+'\n')
 print(json.dumps({'result':'passed','count':len(checks),'liveApiWrites':0}))
finally:server.shutdown()
