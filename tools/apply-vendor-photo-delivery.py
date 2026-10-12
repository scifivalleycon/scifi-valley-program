from pathlib import Path
import hashlib,json,datetime
ROOT=Path(__file__).resolve().parents[1]
EXPECTED={'app.js':'f83c0a9244308de481f13ac4a0930030e58f523d','index.html':'aa1a2d5b04c8c2c05de3265a227b9881dc115fc7','vendor-gallery.js':'f968a2a0773e5461f59d9d648209a837d552626d','service-worker.js':'c2fbf51353cf98585ef1d69fa256acf91a3b33cf','data/version.json':'02aa406f354d7c9ccf806de36b372296ce165788'}
for name,expected in EXPECTED.items():
 b=(ROOT/name).read_bytes();assert hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()==expected,f'{name} changed; stop rather than overwrite.'
def once(s,a,b):
 assert s.count(a)==1,(a[:100],s.count(a))
 return s.replace(a,b,1)
p=ROOT/'app.js';s=p.read_text()
helper='''function vendorPhotoDeliveryUrl(value,size="display"){
  const original=String(value||"");
  try{
    const url=new URL(original,location.href);
    if(url.origin==="https://vendor.scifivalleycon.com"&&/^\\/api\\/public\\/photos\\/[a-zA-Z0-9-]+$/.test(url.pathname)){
      url.searchParams.set("size",size==="thumb"?"thumb":"display");
      url.searchParams.set("opt","1");
      return url.href;
    }
  }catch{}
  return original;
}
'''
s=once(s,'function mapVendorPhotoGallery(vendor){',helper+'function mapVendorPhotoGallery(vendor){')
s=once(s,'<img src="${escapeAppHtml(photo.url||"")}" alt="${escapeAppHtml(vendor.name)} photo ${index+1}" loading="lazy">','<img src="${escapeAppHtml(vendorPhotoDeliveryUrl(photo.url,"thumb"))}" data-full-src="${escapeAppHtml(vendorPhotoDeliveryUrl(photo.url))}" alt="${escapeAppHtml(vendor.name)} photo ${index+1}" loading="lazy" decoding="async">')
s=once(s,'const gallery=images.map(img=>({src:img.currentSrc||img.src,caption:img.alt}));','const gallery=images.map(img=>({src:img.dataset.fullSrc||img.currentSrc||img.src,caption:img.alt}));')
s=once(s,'if(image)openPhotoLightbox(image.currentSrc||image.src,image.alt,"",gallery,images.indexOf(image));','if(image)openPhotoLightbox(image.dataset.fullSrc||image.currentSrc||image.src,image.alt,"",gallery,images.indexOf(image));')
s=once(s,'<img src="${escapeAppHtml(photo.url)}" alt="" width="40" height="40" loading="lazy" decoding="async">','<img src="${escapeAppHtml(vendorPhotoDeliveryUrl(photo.url,"thumb"))}" alt="" width="40" height="40" loading="lazy" decoding="async">')
s=once(s,'const APP_BUILD_VERSION="4.114";','const APP_BUILD_VERSION="4.115";');p.write_text(s)
p=ROOT/'vendor-gallery.js';s=p.read_text();s=once(s,'      const url = new URL(value, location.href);','''      const url = new URL(value, location.href);
      if (url.origin === "https://vendor.scifivalleycon.com" && /^\\/api\\/public\\/photos\\/[a-zA-Z0-9-]+$/.test(url.pathname)) {
        url.searchParams.set("size", "display");
        url.searchParams.set("opt", "1");
      }''');p.write_text(s)
p=ROOT/'index.html';s=p.read_text();s=once(s,'app.js?v=guide-colors-v4.114','app.js?v=vendor-photo-optimization-v4.115');s=once(s,'vendor-gallery.js?v=vendor-gallery-20261008','vendor-gallery.js?v=photo-optimization-v4.115');p.write_text(s)
p=ROOT/'service-worker.js';p.write_text(once(p.read_text(),'const CACHE="sfvc-program-guide-colors-v4.114";','const CACHE="sfvc-program-vendor-photo-optimization-v4.115";'))
p=ROOT/'data/version.json';v=json.loads(p.read_text());v.update(version='program-v4.115-vendor-photo-optimization',generatedAt=datetime.datetime.now(datetime.timezone.utc).isoformat(),source='vendor-photo-optimization');p.write_text(json.dumps(v,indent=2)+'\n')
