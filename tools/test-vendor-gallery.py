"""Read-only integration tests with isolated vendor API/photo fixtures."""
from pathlib import Path
from urllib.parse import urlparse
import copy, hashlib, json, mimetypes
from playwright.sync_api import sync_playwright
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT/'.vendor-gallery-review'; OUT.mkdir(exist_ok=True)
BASE = 'http://127.0.0.1:8765'
PHOTO = (ROOT/'assets/consoles/console-01.webp').read_bytes()

def photos(*ids):
    return [{'id':value, 'url':f'{BASE}/test-vendor-photos/{value}.webp'} for value in ids]

FIXTURE = [
    {'id':'last', 'location':'Z4', 'name':'Final Vendor', 'description':'Collectibles and handmade gifts.', 'photos':photos('z4')},
    {'id':'a10', 'location':'A10', 'name':'Table Ten', 'description':'Books and prints.', 'photos':photos('a10a','a10b')},
    {'id':'a4', 'location':'A4', 'name':'Record Timing', 'description':'Indie animator, V-tuber and multimedia artist.', 'photos':photos('a4')},
    {'id':'a2', 'location':'A2', 'name':'TNT Games', 'description':'Video games and consoles.', 'photos':[]},
    {'id':'multi', 'location':'B3, B1', 'name':'Multi Table Vendor', 'description':'Artwork spanning two tables.', 'photos':photos('b1a','b1b')},
    {'id':'a1', 'location':'A1', 'name':'RavenCraft3D', 'description':'3D printed products\nHandcrafted and painted collectibles.', 'photos':photos('a1a','a1b')},
    {'id':'b2', 'location':'B2', 'name':'Table Two', 'categories':'Handmade jewelry', 'photos':photos('b2')}
]
EXPECTED = ['a1a','a1b','a4','a10a','a10b','b1a','b1b','b2','z4']
results = {'readOnlyFixtures':True, 'viewports':[], 'checks':[], 'sourceHashes':{}}
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True)
    for width,height,scale in [(390,844,1),(320,640,1),(1280,900,1),(390,844,2),(844,390,1)]:
        live = copy.deepcopy(FIXTURE)
        failed = set(); requests = []; errors = []; writes = []
        context=browser.new_context(viewport={'width':width,'height':height}, service_workers='block')
        def route_request(route):
            req=route.request; path=urlparse(req.url).path
            if req.method not in ['GET','HEAD']:
                writes.append(req.url); return route.fulfill(status=200,content_type='application/json',body='{}')
            if urlparse(req.url).netloc != urlparse(BASE).netloc:
                return route.fulfill(status=200,content_type='application/json',body='{}')
            if path.startswith('/test-vendor-photos/'):
                if path in failed: return route.fulfill(status=503,body='Unavailable')
                return route.fulfill(status=200,content_type='image/webp',body=PHOTO)
            if path=='/api/vendor-directory': return route.fulfill(status=200,content_type='application/json',body=json.dumps(live))
            if path.startswith('/api/'): return route.fulfill(status=200,content_type='application/json',body='{}')
            target=ROOT/(path.lstrip('/') or 'index.html')
            if target.is_file(): return route.fulfill(status=200,content_type=mimetypes.guess_type(target.name)[0] or 'application/octet-stream',body=target.read_bytes())
            return route.fulfill(status=404,body='Not found')
        context.route('**/*',route_request)
        page=context.new_page();page.set_default_timeout(15000)
        page.on('pageerror',lambda error:errors.append(str(error)))
        page.on('request',lambda request:requests.append(request.url))
        page.goto(BASE,wait_until='domcontentloaded')
        page.wait_for_function('window.SFVCVendorGallery && myConDataLoaded')
        page.evaluate('document.querySelectorAll("dialog[open]").forEach(d=>d.close());goTo("map");')
        if scale!=1: page.evaluate('(s)=>applyProgramTextScale(s,{persist:false})',scale)
        launch=page.locator('#openVendorGallery');launch.scroll_into_view_if_needed()
        page.wait_for_function('!document.querySelector("#openVendorGallery").disabled')
        assert page.locator('#vendorGallerySummary').inner_text().startswith('9 photos from 6 vendors.'), page.locator('#vendorGallerySummary').inner_text()
        assert page.evaluate('document.querySelector("#vendorGalleryLaunch").previousElementSibling.classList.contains("map-directory-head")')
        assert page.evaluate('document.querySelector("#vendorGalleryLaunch").nextElementSibling.id==="mapDirectoryNotice"')
        if scale==1: page.screenshot(path=str(OUT/f'launch-{width}x{height}.png'))
        page.locator('#mapSearch').fill('No matching vendor')
        assert page.locator('.map-directory-card').count()==0
        assert not launch.is_disabled()
        launch.scroll_into_view_if_needed()
        scroll=page.evaluate('window.scrollY')
        launch.click()
        viewer=page.locator('#vendorPhotoGallery')
        page.wait_for_selector('#vendorPhotoGallery[open] .vendor-gallery-image:not([hidden])')
        page.wait_for_timeout(120)
        assert page.locator('#vendorGalleryName').inner_text()=='RavenCraft3D'
        assert 'A1' in page.locator('#vendorGalleryTable').inner_text()
        assert '\n' in page.locator('#vendorGalleryDescription').inner_text()
        box=viewer.bounding_box()
        assert abs(box['width']-width)<2 and abs(box['height']-height)<2,box
        for selector in ['.vendor-gallery-close','.vendor-gallery-previous','.vendor-gallery-next']:
            b=viewer.locator(selector).bounding_box()
            assert b and b['width']>=44 and b['height']>=44 and b['x']>=0 and b['y']>=0 and b['x']+b['width']<=width+1 and b['y']+b['height']<=height+1,(selector,b)
        assert viewer.evaluate('(el)=>el.scrollWidth<=el.clientWidth+1')
        assert viewer.locator('.vendor-gallery-details').evaluate('(el)=>el.scrollWidth<=el.clientWidth+1')
        imageBox=viewer.locator('.vendor-gallery-image').bounding_box()
        detailBox=viewer.locator('.vendor-gallery-details').bounding_box()
        assert detailBox['y'] >= imageBox['y']+imageBox['height']-1
        page.screenshot(path=str(OUT/f'gallery-{width}x{height}-scale-{scale}.png'))
        seen=[]
        for i in range(len(EXPECTED)):
            page.wait_for_function('document.querySelector(".vendor-gallery-image").complete && !document.querySelector(".vendor-gallery-image").hidden')
            seen.append(Path(urlparse(viewer.locator('img').get_attribute('src')).path).stem)
            assert page.locator('#vendorGalleryProgress').inner_text()==f'{i+1} / 9'
            viewer.locator('.vendor-gallery-next').click()
        assert seen==EXPECTED,seen
        assert page.locator('#vendorGalleryProgress').inner_text()=='1 / 9'
        viewer.locator('.vendor-gallery-previous').click()
        assert page.locator('#vendorGalleryName').inner_text()=='Final Vendor'
        page.keyboard.press('ArrowRight')
        assert page.locator('#vendorGalleryName').inner_text()=='RavenCraft3D'
        live[5]['description']='Handmade collectibles. '*400
        page.evaluate('refreshLiveVendorDirectory("gallery-test")')
        page.wait_for_function('document.querySelector("#vendorGalleryDescription").textContent.length>2000')
        assert viewer.locator('.vendor-gallery-details').evaluate('(el)=>el.scrollHeight>el.clientHeight')
        assert viewer.locator('.vendor-gallery-close').is_visible()
        live[2]['photos'] += photos('a4new')
        page.evaluate('refreshLiveVendorDirectory("gallery-test")')
        page.wait_for_function('document.querySelector("#vendorGalleryProgress").textContent==="1 / 10"')
        assert viewer.locator('img').get_attribute('src').endswith('/a1a.webp')
        live[5]['photos']=photos('a1b')
        page.evaluate('refreshLiveVendorDirectory("gallery-test")')
        page.wait_for_function('document.querySelector(".vendor-gallery-image").src.endsWith("/a1b.webp")')
        assert page.locator('#vendorGalleryProgress').inner_text()=='1 / 9'
        failed.add('/test-vendor-photos/a4.webp')
        viewer.locator('.vendor-gallery-next').click()
        page.wait_for_selector('.vendor-gallery-retry:not([hidden])')
        assert page.locator('#vendorGalleryName').inner_text()=='Record Timing'
        failed.clear();viewer.locator('.vendor-gallery-retry').click()
        page.wait_for_selector('.vendor-gallery-image:not([hidden])')
        assert viewer.locator('.vendor-gallery-retry').is_hidden()
        page.keyboard.press('Escape')
        page.wait_for_function('!document.querySelector("#vendorPhotoGallery").open')
        page.wait_for_function('document.activeElement.id==="openVendorGallery"')
        assert abs(page.evaluate('window.scrollY')-scroll)<4
        launch.click();page.wait_for_selector('.vendor-gallery-image:not([hidden])')
        assert viewer.locator('img').get_attribute('src').endswith('/a1b.webp')
        viewer.locator('.vendor-gallery-close').click()
        page.wait_for_function('!document.querySelector("#vendorPhotoGallery").open')
        single=[{'id':'only','name':'Only Vendor','location':'C1','photos':photos('one')}]
        page.evaluate('(v)=>{state.vendors=v;renderMapScreen()}',single)
        launch.click();page.wait_for_selector('.vendor-gallery-image:not([hidden])')
        assert viewer.locator('.vendor-gallery-next').is_disabled()
        assert 'No description' in page.locator('#vendorGalleryDescription').inner_text()
        page.evaluate('state.vendors=[];renderMapScreen()')
        page.wait_for_function('!document.querySelector("#vendorPhotoGallery").open')
        assert launch.is_disabled()
        page.evaluate('(v)=>{state.vendors=v;renderMapScreen()}',single)
        launch.click();page.wait_for_selector('#vendorPhotoGallery[open]')
        page.evaluate('state.mapSettings.published=false;renderMapScreen()')
        page.wait_for_function('!document.querySelector("#vendorPhotoGallery").open')
        assert page.locator('#vendorGalleryLaunch').is_hidden()
        assert not page.evaluate('document.documentElement.classList.contains("vendor-gallery-open")')
        assert not errors,errors
        results['viewports'].append({'width':width,'height':height,'textScale':scale,'status':'passed','pageErrors':errors})
        context.close()
    context=browser.new_context();page=context.new_page()
    page.goto('about:blank')
    page.add_script_tag(content=(ROOT/'vendor-gallery.js').read_text())
    data=[{'name':'Bad', 'location':'A1','photos':[{'url':'javascript:alert(1)'},{'url':'data:image/svg+xml,<svg/>'},{'url':'https://name:secret@example.com/x'}]},
          {'id':'multi','name':'Range','location':'A10-A12, A3-1','photos':[{'url':'https://example.com/1'},{'url':'https://example.com/2'}]},
          {'id':'a2','name':'Two','location':'A2','photos':[{'url':'https://example.com/3'}]}]
    transformed=page.evaluate('(v)=>{const before=JSON.stringify(v);const items=SFVCVendorGallery.buildItems(v);return {items,unchanged:before===JSON.stringify(v)}}',data)
    assert transformed['unchanged']
    assert [i['vendorKey'] for i in transformed['items']]==['multi','multi','a2'],transformed
    context.close();browser.close()
results['checks']=['Button below directory heading','Full gallery independent of search','Natural table sorting, multi-table grouping and input immutability','Both directions loop','Vendor name, table and full description below image','Keyboard arrows and Escape','Focus and scroll restoration','Live additions/removals preserve current image','Error handling and retry','Empty and single-photo states','Draft/unpublished data stays hidden','Unsafe URL schemes excluded','No external account writes from test fixtures']
for name in ['vendor-gallery.js','vendor-gallery.css','index.html','app.js','service-worker.js']:
    results['sourceHashes'][name]=hashlib.sha256((ROOT/name).read_bytes()).hexdigest()
(OUT/'test-results.json').write_text(json.dumps(results,indent=2)+'\n')
print(json.dumps(results,indent=2))
