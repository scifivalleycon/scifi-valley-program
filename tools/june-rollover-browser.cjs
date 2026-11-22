/* Isolated browser review. Every request is fulfilled from local files or fixtures;
   this test never contacts a live attendee, admin, vendor or notification service. */
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const {chromium,webkit}=require('playwright');
const root=path.resolve(__dirname,'..');
const origin='https://sfvc-review.test';
const mime={'.js':'application/javascript','.css':'text/css','.json':'application/json','.html':'text/html','.svg':'image/svg+xml','.avif':'image/avif','.png':'image/png','.webp':'image/webp','.webmanifest':'application/manifest+json'};
const results=[];
let reviewPage=null;
async function main(){
 for(const engine of (process.env.SFVC_TEST_ENGINES||'chromium,webkit').split(',')){
  const browser=await ({chromium,webkit}[engine]).launch({headless:true,...(process.env.SFVC_CHROMIUM_PATH&&engine==='chromium'?{executablePath:process.env.SFVC_CHROMIUM_PATH}:{})});
  for(const width of [390,320]){
   const context=await browser.newContext({viewport:{width,height:844},serviceWorkers:'block',timezoneId:'America/Los_Angeles'});
   const requests=[],errors=[];let oldOffline=false;
   await context.route('**/*',async route=>{
    const request=route.request(),url=new URL(request.url());requests.push({url:url.href,method:request.method(),body:request.postData()});
    if(url.origin===origin){
     if(url.pathname==='/api/vendor-directory')return route.fulfill({contentType:'application/json',body:JSON.stringify([{id:'oct-vendor',name:'October vendor',location:'D9',eventId:'october-2026',photos:[]}]),headers:{'X-SFVC-Event-Id':'october-2026'}});
     if(oldOffline&&url.pathname==='/data/settings.json')return route.fulfill({contentType:'application/json',headers:{'X-SFVC-Offline':'1'},body:JSON.stringify([{startDate:'2026-10-16',endDate:'2026-10-18',eventName:'Old October'}])});
     if(oldOffline&&url.pathname==='/data/guests.json')return route.fulfill({contentType:'application/json',headers:{'X-SFVC-Offline':'1'},body:JSON.stringify([{id:'old-guest',name:'October guest',group:'OLD',knownFor:'October'}])});
     if(oldOffline&&url.pathname==='/data/schedule.json')return route.fulfill({contentType:'application/json',headers:{'X-SFVC-Offline':'1'},body:JSON.stringify([{id:'old-event',title:'October event',day:'Friday',time:'3:00 PM'}])});
     const file=path.join(root,decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));
     if(file.startsWith(root+path.sep)&&fs.existsSync(file)&&fs.statSync(file).isFile())return route.fulfill({path:file,contentType:mime[path.extname(file)]||'application/octet-stream'});
     return route.fulfill({status:404,body:'Not found'});
    }
    if(url.origin==='https://app.scifivalleycon.com'&&url.pathname==='/assets/events/june-2027-header.avif')return route.fulfill({path:path.join(root,url.pathname),contentType:'image/avif'});
    return route.fulfill({contentType:'application/json',body:JSON.stringify({ok:true,broadcasts:[],conventionId:'sfvc-2027-06',restoredSchedule:[]})});
   });
   await context.addInitScript(()=>{
    localStorage.setItem('sfvc-favorites','["old-guest"]');localStorage.setItem('sfvc-my-schedule','["old-event"]');
    localStorage.setItem('sfvc-my-schedule-snapshots-v2','{"old-event":{"title":"October event","day":"Friday","time":"3:00 PM"}}');
    localStorage.setItem('sfvc-my-con-guests-v1','{"old-guest":{"name":"October guest"}}');
    localStorage.setItem('sfvc-reminder-minutes','30');localStorage.setItem('sfvc-program-text-scale-v1','1.5');
   });
   const page=await context.newPage();reviewPage=page;page.on('pageerror',err=>errors.push(err.message));
   await page.goto(origin,{waitUntil:'domcontentloaded'});
   await page.waitForFunction(()=>myConCatalogReady===true);
   await page.evaluate(()=>{document.querySelectorAll('dialog[open]').forEach(d=>d.close());pushPromptShownThisSession=true;});
   assert.equal(await page.locator('#heroEventDates').textContent(),'JUNE 11–13, 2027');
   assert.equal(await page.evaluate(()=>state.guests.length+state.schedule.length+state.vendors.length),0);
   assert.equal(await page.evaluate(()=>state.favorites.size+state.mySchedule.size),0);
   assert.equal(await page.evaluate(()=>localStorage.getItem('sfvc-my-schedule')),'["old-event"]');
   assert.equal(await page.evaluate(()=>state.reminderMinutes),30);
   assert.equal(await page.locator('[data-photo-shop]:visible').count(),0);
   assert.equal(await page.locator('[href*="2026_October"]').count(),0);
   await page.waitForFunction(()=>document.querySelector('#homeGuestBannerImage').naturalWidth>0);
   assert.equal(await page.locator('#homeGuestBanner').isDisabled(),true);
   assert.equal(await page.locator('#homeGuestBanner .home-guest-banner-cta').isVisible(),false);
   await page.screenshot({path:path.join(root,`tools/june-${engine}-${width}-home.png`),fullPage:false});
   await page.locator('#homeGuestBanner').scrollIntoViewIfNeeded();
   await page.screenshot({path:path.join(root,`tools/june-${engine}-${width}-banner.png`),fullPage:false});
   results.push(`${engine} ${width}: June homepage, archived choices retained, new header, no old checkout`);

   await page.evaluate(()=>goTo('schedule'));
   assert.equal(await page.evaluate(()=>state.dayFilter),'Friday');
   assert.match(await page.locator('#scheduleList').innerText(),/schedule for this event will be announced soon/i);
   await page.evaluate(()=>goTo('map'));
   assert.equal(await page.locator('#mapPublishedContent').isVisible(),false);
   assert.match(await page.locator('#mapDraftNote').innerText(),/have not been created yet/);
   assert.equal(await page.locator('#mapSvgHost svg').count(),0);
   await page.screenshot({path:path.join(root,`tools/june-${engine}-${width}-map.png`),fullPage:false});
   await page.evaluate(()=>goTo('guests'));
   assert.match(await page.locator('#guestList').innerText(),/guests.*will be announced soon/i);
   results.push(`${engine} ${width}: schedule/guests empty, pending floor plan, no old vendor fallback`);

   await page.evaluate(()=>goTo('more'));
   await page.locator('[data-event-open="costume-contest"]').first().click();
   await page.waitForFunction(()=>document.querySelector('#eventModalContent')?.textContent.includes('Saturday, June 12'));
   const costume=await page.locator('#eventModalContent').innerText();
   assert.match(costume,/2:30-5:00 PM/);assert.match(costume,/6:00 PM/);assert.ok(!/Oct\.|October/.test(costume));
   await page.screenshot({path:path.join(root,`tools/june-${engine}-${width}-costume.png`),fullPage:false});
   await page.evaluate(()=>document.querySelector('#eventModal').close());
   assert.equal(await page.locator('[data-event-open="shuttle"]:visible').count(),0);
   assert.equal(await page.locator('[data-event-open="after-party"]:visible').count(),0);
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2);assert.equal(overflow,false,`${engine} ${width} overflow`);
   results.push(`${engine} ${width}: June activity dates and narrow enlarged-text layout`);

   await page.evaluate(()=>{state.settings.photoOpsEnabled=true;state.settings.photoShop='https://photo.example/june-2027';applyEventSettings();goTo('home');});
   assert.equal(await page.locator('#home [data-photo-shop]').isVisible(),true);
   assert.equal(await page.locator('#home [data-photo-shop]').getAttribute('href'),'https://photo.example/june-2027');
   await page.evaluate(()=>{state.settings.photoOpsEnabled=false;applyEventSettings();});
   assert.equal(await page.locator('[data-photo-shop]:visible').count(),0);
   await page.evaluate(()=>{applyRecoveredRegistrationState({conventionId:'sfvc-2026-10',restoredSchedule:[{eventId:'old-event',title:'October event'}]})});
   assert.equal(await page.evaluate(()=>state.mySchedule.size),0);
   results.push(`${engine} ${width}: future photo-sales toggle and cross-event recovery guard`);

   oldOffline=true;
   await page.reload({waitUntil:'domcontentloaded'});
   await page.waitForFunction(()=>savedScheduleInitialLoadComplete===true);
   assert.equal(await page.evaluate(()=>state.settings.conventionId),'sfvc-2027-06');
   assert.equal(await page.evaluate(()=>state.guests.length+state.schedule.length+state.mySchedule.size),0);
   assert.ok(!(await page.locator('body').innerText()).includes('October event'));
   assert.deepEqual(errors,[]);
   assert.ok(requests.filter(r=>r.url.includes('/v1/device/sync')).every(r=>JSON.parse(r.body).conventionId==='sfvc-2027-06'));
   results.push(`${engine} ${width}: old offline cache rejected; no application exceptions`);
   await context.close();
  }
  await browser.close();
 }
 fs.writeFileSync(path.join(root,'tools/june-browser-results.json'),JSON.stringify({passed:results.length,checks:results},null,2)+'\n');
 console.log(JSON.stringify({passed:results.length,checks:results},null,2));
}
main().catch(async err=>{
 console.error(err);
 if(reviewPage&&!reviewPage.isClosed())await reviewPage.screenshot({path:path.join(root,'tools/june-browser-failure.png'),fullPage:true}).catch(()=>{});
 fs.writeFileSync(path.join(root,'tools/june-browser-results.json'),JSON.stringify({passed:results.length,checks:results,error:err.stack||err.message},null,2)+'\n');
 process.exit(1);
});
