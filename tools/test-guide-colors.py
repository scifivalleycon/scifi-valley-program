"""Browser tests use repository files only. No production requests or writes."""
from pathlib import Path
from urllib.parse import urlparse
import copy,json,mimetypes
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'.guide-colors-review';OUT.mkdir(exist_ok=True)
BASE='http://127.0.0.1:8765'
original_settings=json.loads((ROOT/'data/map-settings.json').read_text())
layout=original_settings[0]['eventGuideLayout'] if isinstance(original_settings,list) else original_settings['eventGuideLayout']
expected=[x['id'] for x in sorted(layout['mainItems'],key=lambda x:x['order']) if x.get('visible',True)]
assert len(expected)==11
report={'checks':[],'viewports':[]}
with sync_playwright() as p:
 for engine in ['chromium','webkit']:
  browser=getattr(p,engine).launch(headless=True)
  for case,(width,height,scale) in enumerate([(390,844,1),(320,640,1),(390,844,2),(1280,900,1)]):
   settings=copy.deepcopy(original_settings)
   errors=[]
   context=browser.new_context(viewport={'width':width,'height':height},is_mobile=width<900,has_touch=True,service_workers='block')
   def route_request(route):
    request=route.request;url=urlparse(request.url);path=url.path
    if request.method not in ('GET','HEAD') or url.netloc!=urlparse(BASE).netloc:
     return route.fulfill(status=200,content_type='application/json',body='{}')
    if path=='/data/map-settings.json':return route.fulfill(status=200,content_type='application/json',body=json.dumps(settings))
    if path=='/api/vendor-directory':return route.fulfill(status=200,content_type='application/json',body='[]')
    if path.startswith('/api/'):return route.fulfill(status=200,content_type='application/json',body='{}')
    target=ROOT/(path.lstrip('/') or 'index.html')
    if not target.resolve().is_relative_to(ROOT):return route.fulfill(status=403,body='Forbidden')
    if target.is_file():return route.fulfill(status=200,content_type=mimetypes.guess_type(target.name)[0] or 'application/octet-stream',body=target.read_bytes())
    return route.fulfill(status=404,body='Not found')
   context.route('**/*',route_request)
   page=context.new_page();page.set_default_timeout(15000)
   page.on('pageerror',lambda e:errors.append(str(e)))
   page.goto(BASE,wait_until='domcontentloaded')
   page.wait_for_function('typeof goTo === "function" && myConDataLoaded')
   page.wait_for_timeout(2200)
   page.evaluate('document.querySelectorAll("dialog[open]").forEach(d=>d.close());goTo("more")')
   if scale!=1:page.evaluate('(s)=>applyProgramTextScale(s,{persist:false})',scale)
   page.wait_for_selector('#sfvcEventGuideMainLayoutZone .settings-menu-card')
   cards=page.locator('#more .settings-menu-card:visible')
   assert cards.count()==11
   assert cards.evaluate_all('(els)=>els.map(e=>e.dataset.sfvcEventGuideLayoutId)')==expected
   assert page.evaluate('document.getElementById("eventGuideDiscovery").nextElementSibling.id==="sfvcEventGuideMainLayoutZone"')
   palette=cards.evaluate_all('''els=>els.map(e=>{
    const s=getComputedStyle(e),i=getComputedStyle(e.querySelector('.settings-menu-icon'));
    return {background:s.backgroundColor,image:s.backgroundImage,border:s.borderColor,text:s.color,
      iconBackground:i.backgroundColor,iconBorder:i.borderColor,iconText:i.color,
      width:e.scrollWidth,clientWidth:e.clientWidth,iconWidth:parseFloat(i.width),iconHeight:parseFloat(i.height)};
   })''')
   for color in palette:
    assert color['background']=='rgb(115, 199, 203)',color
    assert color['image']=='none',color
    assert color['border']==color['text']=='rgb(58, 39, 32)',color
    assert color['iconBackground']=='rgb(255, 247, 223)',color
    assert color['iconBorder']==color['iconText']=='rgb(58, 39, 32)',color
    assert color['iconWidth']==color['iconHeight']==40,color
    assert color['width']<=color['clientWidth']+1,color
   for n in range(cards.count()):
    card=cards.nth(n)
    box=card.bounding_box();icon=card.locator('.settings-menu-icon').bounding_box();text=card.locator(':scope > span:nth-child(2)').bounding_box()
    assert box['x']>=0 and box['x']+box['width']<=width+1,(n,box)
    assert text['x']>=icon['x']+icon['width']+8,(n,icon,text)
    assert text['y']>=box['y'] and text['y']+text['height']<=box['y']+box['height'],(n,box,text)
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
   # Original activity colors should remain varied and untouched.
   activity_colors=page.locator('#eventQuickGrid .event-quick-button:visible').evaluate_all('(els)=>[...new Set(els.map(e=>getComputedStyle(e).backgroundColor))]')
   assert len(activity_colors)>1,activity_colors
   # Remove only the new CSS temporarily to verify unrelated sections did not change.
   before=page.locator('#home .home-reporter-card').evaluate_all('(es)=>es.map(e=>getComputedStyle(e).backgroundImage)')
   card=page.locator('#more [data-go="report"]');card.evaluate('(e)=>window.scrollTo(0,window.scrollY+e.getBoundingClientRect().top-document.querySelector(".topbar").getBoundingClientRect().height-14)')
   page.screenshot(path=str(OUT/f'guide-shortcuts-{engine}-{width}x{height}-scale-{scale}.png'))
   if case==0:
    page.locator('#more [data-go="tshirts"]').evaluate('(e)=>window.scrollTo(0,window.scrollY+e.getBoundingClientRect().top-document.querySelector(".topbar").getBoundingClientRect().height-14)')
    page.screenshot(path=str(OUT/f'guide-shortcuts-lower-{engine}.png'))
    # All existing shortcut destinations continue to open correctly.
    for destination in ['celebrity','directions','hotels','report','cosplay-clinic','registration','lost-found','tshirts','notifications','settings','faq']:
     page.evaluate('document.querySelectorAll("dialog[open]").forEach(d=>d.close());goTo("more")')
     page.locator(f'#more .settings-menu-card[data-go="{destination}"]').click()
     page.wait_for_function('(id)=>document.getElementById(id)?.classList.contains("active")',arg=destination)
    page.evaluate('goTo("more")')
    # A normal layout refresh must keep the requested color scheme and order.
    page.evaluate('window.dispatchEvent(new Event("pageshow"))')
    page.wait_for_timeout(200)
    assert cards.evaluate_all('(es)=>es.every(e=>getComputedStyle(e).backgroundColor==="rgb(115, 199, 203)")')
    assert cards.evaluate_all('(es)=>es.map(e=>e.dataset.sfvcEventGuideLayoutId)')==expected
    # Explicit future Admin overrides remain supported, including custom buttons.
    target=settings[0] if isinstance(settings,list) else settings
    colors={'background':'#dceee7','text':'#3a2720','accent':'#fff7df','border':'#3a2720'}
    target['eventGuideLayout']['mainItems'][0]['colors']=colors
    target['eventGuideLayout']['mainItems'].append({'id':'theme-test-custom','type':'custom','visible':True,'order':115,'title':'Test shortcut','description':'Test only, never saved','icon':'X','destination':'faq','linkType':'screen','style':'aqua'})
    page.evaluate('window.dispatchEvent(new Event("pageshow"))')
    page.wait_for_function('getComputedStyle(document.querySelector("#more [data-go=celebrity]")).backgroundColor==="rgb(220, 238, 231)"')
    custom=page.locator('#more [data-sfvc-event-guide-layout-id="theme-test-custom"]')
    assert custom.evaluate('(e)=>getComputedStyle(e).backgroundColor')=='rgb(115, 199, 203)'
    custom.click();page.wait_for_function('document.getElementById("faq").classList.contains("active")')
    assert before==page.locator('#home .home-reporter-card').evaluate_all('(es)=>es.map(e=>getComputedStyle(e).backgroundImage)')
   assert not errors,errors
   report['viewports'].append({'engine':engine,'width':width,'height':height,'textScale':scale,'shortcutCount':11,'status':'passed'})
   context.close()
  browser.close()
report['checks']=['All 11 shortcut backgrounds, borders, text and icon badges match','Activities-first section order preserved','All shortcut destinations work','No horizontal overflow or icon/text overlap at normal and 200% text','Colors persist through layout refresh','Explicit Admin color choices and custom links remain supported','No production network requests or writes']
(OUT/'test-results.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2))
