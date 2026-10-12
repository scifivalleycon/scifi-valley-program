"""Isolated browser tests. No requests reach the live service."""
from pathlib import Path
from urllib.parse import urlparse,parse_qs
import io,json,mimetypes
from PIL import Image
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'.photo-delivery-tests';OUT.mkdir(exist_ok=True)
BASE='http://127.0.0.1:8765';VENDOR='https://vendor.scifivalleycon.com'
def png(size):
 im=Image.new('RGB',(size,size),'white');out=io.BytesIO();im.save(out,'PNG');return out.getvalue()
THUMB=png(320);DISPLAY=png(1600)
FIXTURE=[{'id':'a1','location':'A1','area':'Main Level','name':'Vendor One','description':'Original description, unchanged.','photos':[{'id':'photo-1','url':VENDOR+'/api/public/photos/photo-1'},{'id':'photo-2','url':VENDOR+'/api/public/photos/photo-2'}]},{'id':'a2','location':'A2','area':'Main Level','name':'Vendor Two','description':'Second description.','photos':[{'id':'photo-3','url':VENDOR+'/api/public/photos/photo-3'}]}]
results=[]
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True)
 for width,height in [(390,844),(1280,900)]:
  requests=[];errors=[];context=browser.new_context(viewport={'width':width,'height':height},service_workers='block')
  def route_request(route):
   req=route.request;url=urlparse(req.url);path=url.path
   if url.netloc==urlparse(VENDOR).netloc and path.startswith('/api/public/photos/'):
    requests.append(req.url);query=parse_qs(url.query);assert query.get('size') in [['thumb'],['display']],req.url
    return route.fulfill(status=200,content_type='image/png',body=THUMB if query['size']==['thumb'] else DISPLAY)
   if req.method not in ['GET','HEAD'] or url.netloc!=urlparse(BASE).netloc:return route.fulfill(status=200,content_type='application/json',body='{}')
   if path=='/api/vendor-directory':return route.fulfill(status=200,content_type='application/json',body=json.dumps(FIXTURE))
   if path.startswith('/api/'):return route.fulfill(status=200,content_type='application/json',body='{}')
   target=ROOT/(path.lstrip('/') or 'index.html')
   if target.is_file():return route.fulfill(status=200,content_type=mimetypes.guess_type(target.name)[0] or 'application/octet-stream',body=target.read_bytes())
   return route.fulfill(status=404,body='Not found')
  context.route('**/*',route_request);page=context.new_page();page.set_default_timeout(15000);page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto(BASE,wait_until='domcontentloaded');page.wait_for_function('window.SFVCVendorGallery && myConDataLoaded');page.wait_for_timeout(2100)
  page.evaluate('document.querySelectorAll("dialog[open]").forEach(d=>d.close());goTo("map");')
  launch=page.locator('#openVendorGallery');launch.scroll_into_view_if_needed();page.wait_for_function('!document.querySelector("#openVendorGallery").disabled')
  urls=page.locator('.map-directory-photos img').evaluate_all('(els)=>els.map(el=>el.src)');assert len(urls)==3 and all('size=thumb' in u for u in urls),urls
  assert all('size=thumb' in u for u in requests),requests
  launch.click();page.wait_for_selector('#vendorPhotoGallery[open] .vendor-gallery-image:not([hidden])')
  assert 'size=display' in page.locator('.vendor-gallery-image').get_attribute('src');assert page.locator('.vendor-gallery-image').evaluate('(el)=>el.naturalWidth')==1600
  page.locator('.vendor-gallery-next').click();page.wait_for_function('document.querySelector(".vendor-gallery-image").complete && !document.querySelector(".vendor-gallery-image").hidden')
  assert 'photo-2' in page.locator('.vendor-gallery-image').get_attribute('src')
  page.locator('.vendor-gallery-next').click();assert page.locator('#vendorGalleryName').inner_text()=='Vendor Two'
  page.locator('.vendor-gallery-next').click();assert page.locator('#vendorGalleryName').inner_text()=='Vendor One'
  page.locator('.vendor-gallery-close').click();page.wait_for_function('!document.querySelector("#vendorPhotoGallery").open')
  page.evaluate('''()=>{const root=document.createElement('div');root.id='testProfile';root.innerHTML=mapVendorPhotoGallery(state.vendors.find(v=>v.id==='a1'));document.body.append(root);bindMapVendorPhotoLightboxes(root);}''')
  image=page.locator('#testProfile img').first;assert 'size=thumb' in image.get_attribute('src') and 'size=display' in image.get_attribute('data-full-src')
  page.locator('#testProfile button').first.evaluate('(el)=>el.click()');page.wait_for_selector('#photoLightbox[open]')
  assert 'size=display' in page.locator('#photoLightboxImage').get_attribute('src');page.wait_for_function('document.querySelector("#photoLightboxImage").naturalWidth===1600')
  page.locator('#nextPhotoLightbox').click();assert 'photo-2' in page.locator('#photoLightboxImage').get_attribute('src')
  for vendor in FIXTURE:
   actual=page.evaluate('(id)=>state.vendors.find(v=>v.id===id)',vendor['id']);assert actual['photos']==vendor['photos'];assert actual['description']==vendor['description']
  assert page.evaluate('vendorPhotoDeliveryUrl("https://example.com/private-image.jpg")')=='https://example.com/private-image.jpg';assert not errors,errors
  results.append({'viewport':[width,height],'passed':True,'thumbnailRequests':sum('size=thumb' in u for u in requests),'displayRequests':sum('size=display' in u for u in requests),'profileFieldsUnchanged':True,'fullResolutionViewer':True});context.close()
 browser.close()
(OUT/'results.json').write_text(json.dumps(results,indent=2)+'\n');print(json.dumps(results))
