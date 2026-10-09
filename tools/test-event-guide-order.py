"""Read-only isolated browser checks for the requested Event Guide section order."""
from pathlib import Path
from urllib.parse import urlparse
import hashlib
import json
import mimetypes
import os
from playwright.sync_api import sync_playwright

ROOT = Path(os.environ.get('SFVC_SOURCE', Path(__file__).resolve().parents[1]))
OUT = ROOT / '.event-guide-order-review'
OUT.mkdir(exist_ok=True)
BASE = 'http://127.0.0.1:8765'
result = {'checks': [], 'viewports': [], 'sourceHashes': {}}
settings_template = json.loads((ROOT / 'data/map-settings.json').read_text())

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, executable_path=os.environ.get('CHROMIUM_PATH'))
    for case, (width, height, scale) in enumerate([(390,844,1),(320,640,1),(1280,900,1),(390,844,2),(844,390,1)]):
        settings = json.loads(json.dumps(settings_template))
        failures = []
        context = browser.new_context(viewport={'width':width,'height':height}, service_workers='block',
                                      has_touch=True, is_mobile=width<900)
        def route_request(route):
            req = route.request
            url = urlparse(req.url)
            path = url.path
            if req.method not in ('GET','HEAD') or url.netloc != urlparse(BASE).netloc:
                return route.fulfill(status=200,content_type='application/json',body='{}')
            if path == '/api/vendor-directory':
                return route.fulfill(status=200,content_type='application/json',body='[]')
            if path.startswith('/api/'):
                return route.fulfill(status=200,content_type='application/json',body='{}')
            if path == '/data/map-settings.json':
                return route.fulfill(status=200,content_type='application/json',body=json.dumps(settings))
            target = ROOT / (path.lstrip('/') or 'index.html')
            if target.is_file():
                return route.fulfill(status=200,content_type=mimetypes.guess_type(target.name)[0] or 'application/octet-stream',body=target.read_bytes())
            return route.fulfill(status=404,body='Not found')
        context.route('**/*',route_request)
        page = context.new_page()
        page.set_default_timeout(15000)
        page.on('pageerror', lambda e: failures.append(str(e)))
        page.goto(BASE,wait_until='domcontentloaded')
        page.wait_for_function('myConDataLoaded && document.getElementById("sfvcEventGuideMainLayoutZone")')
        page.wait_for_timeout(2500)
        page.evaluate('document.querySelectorAll("dialog[open]").forEach(d=>d.close());goTo("more");')
        if scale != 1:
            page.evaluate('(s)=>applyProgramTextScale(s,{persist:false})',scale)
        page.wait_for_timeout(180)
        def correct_order():
            assert page.evaluate('''() => {
              const root=document.getElementById('more');
              const title=root.querySelector(':scope > .page-title');
              const discovery=document.getElementById('eventGuideDiscovery');
              const shortcuts=document.getElementById('sfvcEventGuideMainLayoutZone');
              return title.nextElementSibling===discovery && discovery.nextElementSibling===shortcuts
                && discovery.contains(document.getElementById('eventSearch'))
                && discovery.contains(document.getElementById('eventQuickGrid'))
                && [...root.querySelectorAll('.settings-menu-card')].every(el=>shortcuts.contains(el));
            }''')
            assert page.locator('#eventSearch').count()==1
            assert page.locator('#eventQuickGrid').count()==1
            assert page.locator('#more .settings-menu-card').count()>=11
            discovery_box=page.locator('#eventGuideDiscovery').bounding_box()
            first_shortcut=page.locator('#sfvcEventGuideMainLayoutZone .settings-menu-card:visible').first.bounding_box()
            assert first_shortcut['y']>=discovery_box['y']+discovery_box['height']-1
            assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'), 'Horizontal overflow'
        correct_order()
        page.evaluate('window.scrollTo(0,0)')
        page.screenshot(path=str(OUT/f'event-guide-top-{width}x{height}-scale-{scale}.png'))
        if case==0:
            page.locator('#eventSearch').focus()
            page.keyboard.press('Tab')
            assert page.evaluate('document.activeElement.closest("#eventQuickGrid")!==null')
            page.locator('#eventQuickGrid [data-event-open="con-quest"]').click()
            page.wait_for_selector('#eventModal[open]')
            assert 'Con-Quest' in page.locator('#eventModal').inner_text()
            page.evaluate('SFVCEventGuide.close()')
            page.wait_for_selector('#eventModal[open]',state='detached')
            initial=page.locator('#eventList .event-card').count()
            page.locator('#eventSearch').fill('retro')
            page.wait_for_function('document.querySelectorAll("#eventList .event-card").length>0 && document.querySelectorAll("#eventList .event-card").length<'+str(initial))
            assert 'retro' in page.locator('#eventList').inner_text().lower()
            page.locator('#eventSearch').fill('')
            page.wait_for_function('document.querySelectorAll("#eventList .event-card").length=='+str(initial))
            destinations=page.locator('#sfvcEventGuideMainLayoutZone .settings-menu-card:visible').evaluate_all('(els)=>els.map(e=>e.dataset.go).filter(Boolean)')
            for destination in destinations:
                page.locator(f'#sfvcEventGuideMainLayoutZone [data-go="{destination}"]').click()
                page.wait_for_function('(id)=>document.getElementById(id)?.classList.contains("active")',arg=destination)
                page.evaluate('goTo("more")')
                correct_order()
            first=page.locator('#sfvcEventGuideMainLayoutZone .settings-menu-card:visible').first
            first.evaluate('(e)=>window.scrollTo(0,window.scrollY+e.getBoundingClientRect().top-300)')
            page.screenshot(path=str(OUT/'activities-to-shortcuts.png'))
            raw=settings[0] if isinstance(settings,list) else settings
            main=raw.setdefault('eventGuideLayout',{}).setdefault('mainItems',[])
            main.append({'id':'test-order-only','type':'custom','visible':True,'order':-10,
                         'title':'TEST GUIDE LINK','linkType':'screen','destination':'hotels',
                         'colors':{'background':'#73c7cb','text':'#251e1a','accent':'#efc448','border':'#251e1a'}})
            page.evaluate('window.dispatchEvent(new Event("pageshow"))')
            page.wait_for_selector('[data-sfvc-event-guide-layout-id="test-order-only"]')
            correct_order()
            assert page.locator('#sfvcEventGuideMainLayoutZone .settings-menu-card').first.get_attribute('data-sfvc-event-guide-layout-id')=='test-order-only'
            assert page.locator('[data-sfvc-event-guide-layout-id="test-order-only"]').evaluate('(e)=>e.style.getPropertyValue("--sfvc-layout-bg")')=='#73c7cb'
            page.locator('[data-sfvc-event-guide-layout-id="test-order-only"]').click()
            page.wait_for_function('document.getElementById("hotels").classList.contains("active")')
            result['checks'] += ['Search precedes activities and shortcut bars in DOM, visual and keyboard order',
                                 'No duplicate search or activity elements', 'Activity details still open',
                                 'Search still filters all program information',
                                 'Every visible built-in shortcut still opens its destination',
                                 'Admin layout refresh retains requested section placement, custom links and colors']
        assert not failures, failures
        result['viewports'].append({'width':width,'height':height,'textScale':scale,'passed':True})
        context.close()
    browser.close()
for name in ['index.html','event-guide-layout.js','app.js','service-worker.js','data/version.json']:
    result['sourceHashes'][name]=hashlib.sha256((ROOT/name).read_bytes()).hexdigest()
(OUT/'test-results.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2))
