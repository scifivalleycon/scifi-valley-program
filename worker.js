const FILES = {
  mapSettings: "data/map-settings.json",
  mapLayout: "data/map-layout.json",
  celebrityInfo: "data/celebrity-info.json",
  pricing: "data/celebrity-pricing.json",
  photoOps: "data/photo-ops.json",
  autographs: "data/autograph-schedule.json",
  groupOps: "data/group-photo-ops.json",
  panels: "data/panels.json",
  settings: "data/settings.json",
  directions: "data/directions.json",
  guests: "data/guests.json",
  schedule: "data/schedule.json",
  vendors: "data/vendors.json",
  events: "data/events.json",
  sponsors: "data/sponsors.json",
  socialLinks: "data/social-links.json",
  homeBanner: "data/home-banner.json",
  faq: "data/faq.json",
  tshirts: "data/tshirts.json"
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    try {
      if (url.pathname === "/api/me" && request.method === "GET") return await handleMe(request, env);
      if (url.pathname === "/api/health" && request.method === "GET") return await handleHealth(request, env);
      if (url.pathname === "/api/history" && request.method === "GET") return await handleHistory(request, env, url);
      if (url.pathname === "/api/reports" && request.method === "GET") return await handlePushProxyFlexible(request, env, `/v1/admin/reports${url.search}`);
      if (url.pathname === "/api/reports/push/public-key" && request.method === "GET") return await handlePushProxyFlexible(request, env, "/v1/admin/report-push/public-key");
      if (url.pathname === "/api/reports/push/subscribe" && request.method === "POST") return await handlePushProxyFlexible(request, env, "/v1/admin/report-push/subscribe", {forwardBody:true});
      if (url.pathname === "/api/reports/push/unsubscribe" && request.method === "POST") return await handlePushProxyFlexible(request, env, "/v1/admin/report-push/unsubscribe", {forwardBody:true});
      if (url.pathname === "/api/reports/push/stats" && request.method === "GET") return await handlePushProxyFlexible(request, env, "/v1/admin/report-push/stats");
      const reportFileMatch=url.pathname.match(/^\/api\/reports\/([^/]+)\/files\/(\d+)$/);
      if(reportFileMatch&&request.method==="GET")return await handlePushBinaryProxy(request,env,`/v1/admin/reports/${encodeURIComponent(decodeURIComponent(reportFileMatch[1]))}/files/${Number(reportFileMatch[2])}`);
      const reportStatusMatch=url.pathname.match(/^\/api\/reports\/([^/]+)\/status$/);
      if(reportStatusMatch&&request.method==="POST")return await handlePushProxyFlexible(request,env,`/v1/admin/reports/${encodeURIComponent(decodeURIComponent(reportStatusMatch[1]))}/status`,{forwardBody:true});
      const reportDetailMatch=url.pathname.match(/^\/api\/reports\/([^/]+)$/);
      if(reportDetailMatch&&request.method==="GET")return await handlePushProxyFlexible(request,env,`/v1/admin/reports/${encodeURIComponent(decodeURIComponent(reportDetailMatch[1]))}`);

      if (url.pathname === "/api/registrations" && request.method === "GET") return await handlePushProxy(request, env, `/v1/admin/registrations${url.search}`);
      if (url.pathname.startsWith("/api/registrations/") && request.method === "DELETE") {
        const deviceId = encodeURIComponent(decodeURIComponent(url.pathname.slice("/api/registrations/".length)));
        return await handlePushProxy(request, env, `/v1/admin/registrations/${deviceId}`);
      }
      if (url.pathname === "/api/devices" && request.method === "GET") return await handlePushProxy(request, env, `/v1/admin/devices${url.search}`);
      if (url.pathname.startsWith("/api/devices/") && url.pathname.endsWith("/test-now") && request.method === "POST") {
        const encoded = url.pathname.slice("/api/devices/".length, -"/test-now".length);
        const deviceId = encodeURIComponent(decodeURIComponent(encoded));
        return await handlePushProxy(request, env, `/v1/admin/devices/${deviceId}/test-now`, true);
      }
      if (url.pathname.startsWith("/api/devices/") && url.pathname.endsWith("/test") && request.method === "POST") {
        const encoded = url.pathname.slice("/api/devices/".length, -"/test".length);
        const deviceId = encodeURIComponent(decodeURIComponent(encoded));
        return await handlePushProxy(request, env, `/v1/admin/devices/${deviceId}/test`, true);
      }
      if (url.pathname.startsWith("/api/devices/") && request.method === "GET") {
        const deviceId = encodeURIComponent(decodeURIComponent(url.pathname.slice("/api/devices/".length)));
        return await handlePushProxy(request, env, `/v1/admin/devices/${deviceId}`);
      }
      if (url.pathname === "/api/home-banner/status" && request.method === "GET") return await handleHomeBannerStatus(request, env);
      if (url.pathname === "/api/home-banner/check" && request.method === "POST") return await handleHomeBannerCheck(request, env);
      if (url.pathname === "/api/tshirts/sync/status" && request.method === "GET") return await handleTshirtSyncStatus(request, env);
      if (url.pathname === "/api/tshirts/sync" && request.method === "POST") return await handleTshirtSync(request, env);
      if (url.pathname === "/api/reminders/health" && request.method === "GET") return await handlePushProxy(request, env, "/v1/reminders/health");
      if (url.pathname === "/api/push/stats" && request.method === "GET") return await handlePushProxy(request, env, "/v1/admin/stats");
      if (url.pathname === "/api/push/history" && request.method === "GET") return await handlePushProxy(request, env, "/v1/admin/history");
      if (url.pathname === "/api/push/send" && request.method === "POST") return await handlePushProxy(request, env, "/v1/admin/broadcast", true);
      if (url.pathname === "/api/push/remove" && request.method === "POST") return await handlePushProxy(request, env, "/v1/admin/broadcast/remove", true);
      if (url.pathname === "/api/analytics/stats" && request.method === "GET") return await handlePushProxy(request, env, "/v1/admin/analytics/stats");
      if (url.pathname === "/api/analytics/history" && request.method === "GET") return await handlePushProxy(request, env, "/v1/admin/analytics/history");
      const match = url.pathname.match(/^\/api\/content\/([^/]+)$/);
      if (match) {
        const type = decodeURIComponent(match[1]);
        if (request.method === "GET") return await handleContentGet(request, env, type);
        if (request.method === "POST" || request.method === "PUT") {
          return await handleContentPut(request, env, type);
        }
        return json({ error: "Method not allowed." }, 405);
      }
      return await env.ASSETS.fetch(request);
    } catch (err) {
      console.error("SFVC Admin uncaught route error", {
        path: url.pathname,
        method: request.method,
        message: err?.message || String(err),
        stack: err?.stack || ""
      });
      return json({
        error: `Admin backend error: ${err?.message || String(err)}`,
        path: url.pathname
      }, 500);
    }
  },

  async scheduled(controller, env, ctx) {
    const jobs=[];

    if (tshirtSyncAuthorized(env)) {
      jobs.push(
        syncTshirtsFromEcwid(env, { reason: "daily-cron" })
          .catch(err => console.error("Daily Ecwid T-shirt sync failed", err))
      );
    }

    jobs.push(
      syncHomeBannerFromWebsite(env, { reason: "daily-cron", force: false })
        .catch(err => console.error("Daily website guest-banner sync failed", err))
    );

    ctx.waitUntil(Promise.allSettled(jobs));
  }
};



const DEFAULT_HOME_BANNER = [{
  id:"home-guest-banner",
  enabled:true,
  imageUrl:"https://cdn.prod.website-files.com/619e7b191607b3812aafab16/6a7f8b6c237b4ce3f69d2523_Website Slider Guest Banner 10-2026 (8-9-26).avif",
  alt:"Sci-Fi Valley Con celebrity guest banner",
  linkTarget:"guests",
  autoUpdate:true,
  sourceUrl:"https://scifivalleycon.com/",
  sourceMode:"website-auto",
  sourceUpdatedAt:""
}];

async function handleHomeBannerStatus(request,env){
  const auth=authorize(request,env);
  if(!auth.ok)return json({error:auth.error},auth.status);

  const current=await readJsonFileFromGitHub(env,FILES.homeBanner,DEFAULT_HOME_BANNER);
  const item=Array.isArray(current)&&current[0]?current[0]:DEFAULT_HOME_BANNER[0];

  return json({
    ok:true,
    autoUpdate:item.autoUpdate!==false,
    enabled:item.enabled!==false,
    imageUrl:String(item.imageUrl||""),
    sourceUrl:String(item.sourceUrl||"https://scifivalleycon.com/"),
    sourceMode:String(item.sourceMode||"manual"),
    sourceUpdatedAt:String(item.sourceUpdatedAt||"")
  });
}

async function handleHomeBannerCheck(request,env){
  const auth=authorize(request,env);
  if(!auth.ok)return json({error:auth.error},auth.status);

  try{
    const result=await syncHomeBannerFromWebsite(env,{
      reason:`manual:${auth.email}`,
      force:true
    });
    return json({ok:true,...result});
  }catch(err){
    return json({error:err?.message||String(err)},400);
  }
}

async function syncHomeBannerFromWebsite(env,{reason="manual",force=false}={}){
  const current=await readJsonFileFromGitHub(env,FILES.homeBanner,DEFAULT_HOME_BANNER);
  const item={
    ...DEFAULT_HOME_BANNER[0],
    ...(Array.isArray(current)&&current[0]?current[0]:{})
  };

  if(!force && item.autoUpdate===false){
    return {
      skipped:true,
      reason:"auto-update-disabled",
      imageUrl:item.imageUrl
    };
  }

  const sourceUrl=String(item.sourceUrl||"https://scifivalleycon.com/").trim();
  if(!/^https:\/\//i.test(sourceUrl))throw new Error("Home banner source URL must use HTTPS.");

  const response=await fetch(sourceUrl,{
    headers:{
      "Accept":"text/html,application/xhtml+xml",
      "User-Agent":"Sci-Fi-Valley-Con-Admin-Banner-Sync/1.0"
    },
    redirect:"follow"
  });

  if(!response.ok)throw new Error(`Sci-Fi Valley Con website returned ${response.status}.`);

  const html=await response.text();
  const detected=extractFirstGuestSliderBanner(html);

  if(!detected){
    throw new Error("No celebrity guest slider banner could be detected on the website homepage.");
  }

  const changed=String(item.imageUrl||"")!==detected;
  const now=new Date().toISOString();

  if(changed){
    const next=[{
      ...item,
      imageUrl:detected,
      sourceMode:"website-auto",
      sourceUrl,
      sourceUpdatedAt:now
    }];

    const saved=await writeJsonFileToGitHub(
      env,
      FILES.homeBanner,
      next,
      `Update home celebrity guest banner from website (${reason})`
    );

    return {
      changed:true,
      detectedUrl:detected,
      imageUrl:detected,
      sourceUrl,
      commit:saved.commit||null,
      checkedAt:now
    };
  }

  return {
    changed:false,
    detectedUrl:detected,
    imageUrl:item.imageUrl,
    sourceUrl,
    checkedAt:now
  };
}

function extractFirstGuestSliderBanner(html){
  const text=String(html||"");
  const pattern=/https:\/\/cdn\.prod\.website-files\.com\/[^\s"'<>]+?\.(?:avif|webp|png|jpe?g)(?:\?[^\s"'<>]*)?/gi;
  const seen=new Set();
  const candidates=[];

  for(const match of text.matchAll(pattern)){
    let raw=String(match[0]||"")
      .replace(/&amp;/gi,"&")
      .replace(/&#38;/gi,"&");

    // Webflow HTML often URL-encodes spaces. Keep the original valid URL, but
    // decode a copy for filename scoring.
    let decoded=raw;
    try{decoded=decodeURIComponent(raw)}catch{}

    // Remove srcset sizing query variants when possible.
    const canonical=raw.replace(/[?&](?:w|width)=\d+.*$/i,"");
    const key=canonical.toLowerCase();
    if(seen.has(key))continue;
    seen.add(key);

    const lower=decoded.toLowerCase();
    const context=text.slice(Math.max(0,match.index-500),Math.min(text.length,match.index+700)).toLowerCase();

    let score=0;
    if(lower.includes("website slider guest banner"))score+=1000;
    if(lower.includes("guest banner"))score+=700;
    if(lower.includes("guest"))score+=180;
    if(lower.includes("slider"))score+=180;
    if(context.includes("w-slider"))score+=150;
    if(context.includes("slide"))score+=60;
    if(/\.avif(?:$|\?)/i.test(raw))score+=25;

    candidates.push({url:canonical,score,index:match.index});
  }

  candidates.sort((a,b)=>b.score-a.score||a.index-b.index);

  // Require a meaningful guest/slider signal so an unrelated logo or tracking
  // image can never replace the app's celebrity banner.
  const best=candidates.find(item=>item.score>=300);
  return best?.url||"";
}

function tshirtSyncAuthorized(env){
  return String(env.CRYPTOTEEOLOGY_SYNC_AUTHORIZED||"").trim().toLowerCase()==="yes";
}

function tshirtSyncConfig(env){
  return {
    authorized:tshirtSyncAuthorized(env),
    storeId:String(env.ECWID_STORE_ID||"").trim(),
    publicToken:String(env.ECWID_PUBLIC_TOKEN||"").trim(),
    categoryId:Number(env.ECWID_SFVC_CATEGORY_ID||118538756)
  };
}

async function handleTshirtSyncStatus(request,env){
  const auth=authorize(request,env);
  if(!auth.ok)return json({error:auth.error},auth.status);

  const config=tshirtSyncConfig(env);
  let data=[];
  try{
    data=await readJsonFileFromGitHub(env,FILES.tshirts,[]);
  }catch{}

  const auto=data.filter(row=>row?.source==="ecwid");
  const manual=data.filter(row=>row?.source!=="ecwid");
  const lastUpdated=auto.map(row=>String(row.sourceUpdatedAt||"")).filter(Boolean).sort().at(-1)||null;

  return json({
    ok:true,
    configured:Boolean(config.storeId&&config.publicToken),
    authorized:config.authorized,
    storeIdConfigured:Boolean(config.storeId),
    publicTokenConfigured:Boolean(config.publicToken),
    categoryId:config.categoryId,
    automaticProducts:auto.length,
    manualProducts:manual.length,
    totalProducts:data.length,
    lastCatalogUpdate:lastUpdated
  });
}

async function handleTshirtSync(request,env){
  const auth=authorize(request,env);
  if(!auth.ok)return json({error:auth.error},auth.status);

  try{
    const result=await syncTshirtsFromEcwid(env,{reason:`manual:${auth.email}`});
    return json({ok:true,...result});
  }catch(err){
    return json({error:err?.message||String(err)},400);
  }
}

async function syncTshirtsFromEcwid(env,{reason="manual"}={}){
  const config=tshirtSyncConfig(env);
  if(!config.authorized){
    throw new Error("Cryptoteeology catalog sync is disabled. Set CRYPTOTEEOLOGY_SYNC_AUTHORIZED=yes only after you have permission to synchronize this catalog.");
  }
  if(!config.storeId)throw new Error("ECWID_STORE_ID is not configured.");
  if(!config.publicToken)throw new Error("ECWID_PUBLIC_TOKEN is not configured.");

  const all=[];
  let offset=0;
  const limit=100;

  while(true){
    const url=new URL(`https://app.ecwid.com/api/v3/${encodeURIComponent(config.storeId)}/products`);
    url.searchParams.set("limit",String(limit));
    url.searchParams.set("offset",String(offset));
    url.searchParams.set("baseUrl","https://www.cryptoteeology.com/shop");
    url.searchParams.set("cleanURLs","true");

    const response=await fetch(url,{
      headers:{
        "Authorization":`Bearer ${config.publicToken}`,
        "Accept":"application/json"
      }
    });
    if(!response.ok){
      const text=await response.text().catch(()=>"");
      throw new Error(`Ecwid returned ${response.status}: ${text.slice(0,300)}`);
    }

    const payload=await response.json();
    const items=Array.isArray(payload.items)?payload.items:[];
    all.push(...items);

    const total=Number(payload.total||all.length);
    offset+=items.length;
    if(!items.length||offset>=total)break;
    if(offset>5000)throw new Error("Ecwid product pagination exceeded the safety limit.");
  }

  const categoryId=Number(config.categoryId);
  const matching=all.filter(product=>
    product?.enabled!==false &&
    Array.isArray(product?.categoryIds) &&
    product.categoryIds.map(Number).includes(categoryId)
  );

  const current=await readJsonFileFromGitHub(env,FILES.tshirts,[]);
  const manual=current.filter(row=>row?.source!=="ecwid");
  const oldAuto=new Map(
    current.filter(row=>row?.source==="ecwid")
      .map(row=>[String(row.sourceProductId||row.id||""),row])
  );

  const now=new Date().toISOString();

  const automatic=matching.map((product,index)=>{
    const key=String(product.id);
    const previous=oldAuto.get(key)||{};
    const gallery=[
      product.imageUrl,
      product.originalImageUrl,
      product.thumbnailUrl,
      ...(Array.isArray(product.galleryImages)
        ? product.galleryImages.flatMap(image=>[
            image?.imageUrl,
            image?.originalImageUrl,
            image?.thumbnailUrl
          ])
        : [])
    ].map(value=>String(value||"").trim()).filter(Boolean);

    const uniqueGallery=[...new Set(gallery)];
    const options=Array.isArray(product.options)
      ? product.options.map(option=>({
          name:String(option?.name||""),
          type:String(option?.type||""),
          choices:Array.isArray(option?.choices)
            ? option.choices.map(choice=>({
                text:String(choice?.text||choice?.name||""),
                priceModifier:Number(choice?.priceModifier||0)
              }))
            : []
        }))
      : [];

    const description=stripHtmlText(product.description||"");
    const yearMatch=String(product.name||"").match(/\b(20\d{2}|19\d{2})\b/);

    return {
      id:`ecwid-${product.id}`,
      source:"ecwid",
      sourceProductId:Number(product.id),
      sourceOrder:index,
      title:String(product.name||"Official Sci-Fi Valley Con T-Shirt"),
      price:String(product.defaultDisplayedPriceFormatted||(
        Number.isFinite(Number(product.price))?`$${Number(product.price).toFixed(2)}`:""
      )),
      url:String(product.url||`https://www.cryptoteeology.com/shop/Sci-fi-Valley-Con-Shirts-c${categoryId}`),
      image:uniqueGallery[0]||"",
      gallery:uniqueGallery,
      description,
      inStock:product.inStock!==false,
      options,
      badge:String(previous.badge||yearMatch?.[1]||""),
      enabled:previous.enabled!==false,
      sourceUpdatedAt:now
    };
  });

  const merged=[...automatic,...manual];
  const normalized=JSON.stringify(merged,null,2)+"\n";
  const currentNormalized=JSON.stringify(current,null,2)+"\n";

  let changed=normalized!==currentNormalized;
  let commit=null;

  if(changed){
    const saved=await writeJsonFileToGitHub(
      env,
      FILES.tshirts,
      merged,
      `Auto-sync Sci-Fi Valley Con T-shirts from Ecwid (${reason})`
    );
    commit=saved.commit||null;
  }

  return {
    changed,
    source:"Ecwid official Products API",
    storeId:config.storeId,
    categoryId,
    matchedProducts:automatic.length,
    manualProducts:manual.length,
    totalProducts:merged.length,
    commit
  };
}

function stripHtmlText(value){
  return String(value||"")
    .replace(/<script[\s\S]*?<\/script>/gi," ")
    .replace(/<style[\s\S]*?<\/style>/gi," ")
    .replace(/<[^>]+>/g," ")
    .replace(/&nbsp;/gi," ")
    .replace(/&amp;/gi,"&")
    .replace(/&quot;/gi,'"')
    .replace(/&#39;/gi,"'")
    .replace(/\s+/g," ")
    .trim();
}

async function readJsonFileFromGitHub(env,path,fallback=[]){
  const response=await github(env,`/contents/${path}?ref=${encodeURIComponent(branch(env))}`);
  if(response.status===404)return fallback;
  if(!response.ok)throw new Error(`GitHub read failed for ${path}: ${response.status}`);
  const payload=await response.json();
  return JSON.parse(decodeBase64(payload.content||""));
}

async function writeJsonFileToGitHub(env,path,data,message){
  const serialized=JSON.stringify(data,null,2)+"\n";
  const current=await github(env,`/contents/${path}?ref=${encodeURIComponent(branch(env))}`);
  let sha=null;
  if(current.ok){
    const payload=await current.json();
    sha=payload.sha;
  }else if(current.status!==404){
    throw new Error(`GitHub lookup failed for ${path}: ${current.status}`);
  }

  const body={
    message,
    content:encodeBase64(serialized),
    branch:branch(env)
  };
  if(sha)body.sha=sha;

  const response=await github(env,`/contents/${path}`,{
    method:"PUT",
    body:JSON.stringify(body)
  });
  if(!response.ok){
    const payload=await response.json().catch(()=>({}));
    throw new Error(payload.message||`GitHub write failed: ${response.status}`);
  }
  const payload=await response.json();
  return {
    sha:payload.content?.sha||null,
    commit:payload.commit?.sha||null
  };
}

async function handleMe(request, env) {
  const auth = authorize(request, env);
  if (!auth.ok) return json({ error: auth.error }, auth.status);
  return json({ email: auth.email });
}


async function handleHealth(request, env) {
  const auth = authorize(request, env);
  if (!auth.ok) return json({ error: auth.error }, auth.status);

  const result = {
    ok: true,
    authenticatedAs: auth.email,
    target: {
      repository: String(env.GITHUB_REPO || ""),
      branch: branch(env),
      mapPath: FILES.mapLayout
    },
    bindings: {
      GITHUB_REPO: Boolean(String(env.GITHUB_REPO || "").trim()),
      GITHUB_BRANCH: Boolean(String(env.GITHUB_BRANCH || "").trim()),
      GITHUB_TOKEN: Boolean(String(env.GITHUB_TOKEN || "").trim()),
      STAFF_EMAILS: Boolean(String(env.STAFF_EMAILS || "").trim()),
      ASSETS: Boolean(env.ASSETS)
    },
    repository: String(env.GITHUB_REPO || ""),
    branch: branch(env),
    github: {
      reachable: false,
      status: null,
      message: ""
    }
  };

  try {
    const response = await github(env, "");
    result.github.status = response.status;
    result.github.reachable = response.ok;

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      result.github.message = body.message || `GitHub returned ${response.status}`;
    } else {
      const body = await response.json();
      result.github.message = `Connected to ${body.full_name || result.repository}`;
    }
  } catch (err) {
    result.ok = false;
    result.github.message = err?.message || String(err);
  }

  return json(result, result.ok ? 200 : 500);
}


async function handlePushProxyFlexible(request,env,path,{forwardBody=false}={}){
  const auth=authorize(request,env);if(!auth.ok)return json({error:auth.error},auth.status);
  const base=String(env.PUSH_API_URL||"https://notify.scifivalleycon.com").replace(/\/+$/,'');
  const secret=String(env.PUSH_ADMIN_SECRET||"");if(!secret)return json({error:"PUSH_ADMIN_SECRET is not configured in the admin Worker."},500);
  const headers={"Authorization":`Bearer ${secret}`,"X-SFVC-Admin-Email":auth.email};
  if(forwardBody)headers["Content-Type"]=request.headers.get("content-type")||"application/json";
  const init={method:request.method,headers};if(forwardBody)init.body=await request.arrayBuffer();
  const response=await fetch(`${base}${path}`,init);const body=await response.arrayBuffer();
  return new Response(body,{status:response.status,headers:{"content-type":response.headers.get("content-type")||"application/json","cache-control":"no-store"}})
}
async function handlePushBinaryProxy(request,env,path){
  const auth=authorize(request,env);if(!auth.ok)return json({error:auth.error},auth.status);
  const base=String(env.PUSH_API_URL||"https://notify.scifivalleycon.com").replace(/\/+$/,'');const secret=String(env.PUSH_ADMIN_SECRET||"");if(!secret)return json({error:"PUSH_ADMIN_SECRET is not configured in the admin Worker."},500);
  const response=await fetch(`${base}${path}`,{headers:{"Authorization":`Bearer ${secret}`,"X-SFVC-Admin-Email":auth.email}});const headers=new Headers(response.headers);headers.set("cache-control","private, no-store");return new Response(response.body,{status:response.status,headers})
}

async function handlePushProxy(request,env,path,forwardBody=false){
  const auth=authorize(request,env);
  if(!auth.ok)return json({error:auth.error},auth.status);

  const base=String(env.PUSH_API_URL||"https://notify.scifivalleycon.com").replace(/\/+$/,"");
  const secret=String(env.PUSH_ADMIN_SECRET||"");
  if(!secret)return json({error:"PUSH_ADMIN_SECRET is not configured in the admin Worker."},500);

  const init={
    method:forwardBody?"POST":"GET",
    headers:{
      "Authorization":`Bearer ${secret}`,
      "Content-Type":"application/json"
    }
  };
  if(forwardBody)init.body=await request.text();

  const response=await fetch(`${base}${path}`,init);
  const text=await response.text();
  return new Response(text,{
    status:response.status,
    headers:{"content-type":response.headers.get("content-type")||"application/json","cache-control":"no-store"}
  });
}

async function handleContentGet(request, env, type) {
  const auth = authorize(request, env);
  if (!auth.ok) return json({ error: auth.error }, auth.status);
  const path = FILES[type];
  if (!path) return json({ error: "Unknown content section." }, 404);
  const response = await github(env, `/contents/${path}?ref=${encodeURIComponent(branch(env))}`);
  if (response.status === 404) {
    if (type === "settings") return json({ data: [{
      eventName:"Sci-Fi Valley Con",
      editionLabel:"FALL 2026",
      startDate:"2026-10-16",
      endDate:"2026-10-18",
      venue:"Blair County Convention Center",
      city:"Altoona",
      state:"PA",
      photoShop:"https://checkout.conventions.leapevent.tech/eh/2026_October_Sci_Fi_Valley_Con_Photo_Ops"
    }], sha:null, exists:false });
    if (type === "directions") return json({ data: [{
      venueName:"Blair County Convention Center",
      venueAddress:"1 Convention Center Dr, Altoona, PA 16602",
      venueNotes:"Parking and convention entrance destination",
      shuttleEnabled:false,
      shuttleName:"Shuttle Pickup / Park & Ride",
      shuttleAddress:"",
      shuttleNotes:"",
      shuttleHours:""
    }], sha:null, exists:false });
    if (type === "mapSettings") return json({ data: [{published:false,directoryPublished:false,title:"Interactive Floor Map",subtitle:"",conQuestNote:"Red table markers indicate Con-Quest participation.",draftNote:"Map draft"}], sha:null, exists:false });
    if (type === "mapLayout") return json({
      error: "The GitHub map-layout.json lookup returned 404.",
      repository: String(env.GITHUB_REPO || ""),
      branch: branch(env),
      path
    }, 404);
    if (type === "sponsors") return json({ data: [], sha: null, exists: false });
    if (type === "socialLinks") return json({ data: [], sha: null, exists: false });
    if (type === "homeBanner") return json({ data: DEFAULT_HOME_BANNER, sha: null, exists: false });
    if (type === "faq") return json({ data: [], sha: null, exists: false });
    if (type === "tshirts") return json({ data: [], sha: null, exists: false });
    return json({ error: `${path} was not found in the attendee app repository.` }, 404);
  }
  if (!response.ok) return githubError(response);
  const payload = await response.json();
  const data = JSON.parse(decodeBase64(payload.content || ""));
  return json({ data, sha: payload.sha, exists: true });
}

async function bumpProgramVersion(env,type,email){
  const path="data/version.json";
  const current=await github(env,`/contents/${path}?ref=${encodeURIComponent(branch(env))}`);
  let sha=null;
  if(current.ok){
    const payload=await current.json();
    sha=payload.sha||null;
  }else if(current.status!==404){
    return {ok:false,error:`Version marker lookup returned ${current.status}.`};
  }

  const data={
    version:`admin-${Date.now()}`,
    generatedAt:new Date().toISOString(),
    source:String(type||"content"),
    updatedBy:String(email||"")
  };
  const serialized=JSON.stringify(data,null,2)+"\n";
  const body={
    message:`Refresh attendee app data version after ${type} update (${email})`,
    content:encodeBase64(serialized),
    branch:branch(env)
  };
  if(sha)body.sha=sha;
  const saved=await github(env,`/contents/${path}`,{method:"PUT",body:JSON.stringify(body)});
  if(!saved.ok)return {ok:false,error:`Version marker update returned ${saved.status}.`};
  const payload=await saved.json().catch(()=>({}));
  return {ok:true,commit:payload.commit?.sha||null};
}

async function handleContentPut(request, env, type) {
  const auth = authorize(request, env);
  if (!auth.ok) return json({ error: auth.error }, auth.status);
  const path = FILES[type];
  if (!path) return json({ error: "Unknown content section." }, 404);
  let incoming;
  try { incoming = await request.json(); } catch { return json({ error: "Invalid JSON request." }, 400); }
  if (!incoming || !Array.isArray(incoming.data)) return json({ error: "The content payload must contain a data array." }, 400);
  const validation = validate(type, incoming.data);
  if (!validation.ok) return json({ error: validation.error }, 400);
  const serialized = JSON.stringify(incoming.data, null, 2) + "\n";
  if (new TextEncoder().encode(serialized).byteLength > 900000) return json({ error: "This JSON file is too large for the admin editor." }, 413);

  const current = await github(env, `/contents/${path}?ref=${encodeURIComponent(branch(env))}`);
  let sha = null;
  if (current.ok) {
    const payload = await current.json();
    sha = payload.sha;
  } else if (current.status !== 404) {
    return githubError(current);
  }

  const body = {
    message: `Update ${type} via SFVC Admin (${auth.email})`,
    content: encodeBase64(serialized),
    branch: branch(env)
  };
  if (sha) body.sha = sha;

  const saved = await github(env, `/contents/${path}`, { method: "PUT", body: JSON.stringify(body) });
  if (!saved.ok) return githubError(saved);
  const payload = await saved.json();
  let versionUpdate={ok:false,error:"Version marker was not updated."};
  try{versionUpdate=await bumpProgramVersion(env,type,auth.email);}catch(err){versionUpdate={ok:false,error:err.message};}
  return json({
    ok:true,
    sha:payload.content?.sha||null,
    commit:payload.commit?.sha||null,
    versionBumped:versionUpdate.ok===true,
    versionCommit:versionUpdate.commit||null,
    versionWarning:versionUpdate.ok?null:(versionUpdate.error||"Version marker update failed.")
  });
}

async function handleHistory(request, env, url) {
  const auth = authorize(request, env);
  if (!auth.ok) return json({ error: auth.error }, auth.status);
  const type = url.searchParams.get("type") || "";
  const path = FILES[type];
  if (!path) return json({ error: "Unknown content section." }, 404);
  const response = await github(env, `/commits?path=${encodeURIComponent(path)}&sha=${encodeURIComponent(branch(env))}&per_page=10`);
  if (!response.ok) return githubError(response);
  const commits = await response.json();
  return json({ commits: commits.map(c => ({ sha: c.sha, message: c.commit?.message || "", author: c.commit?.author?.name || c.author?.login || "", date: c.commit?.author?.date || "" })) });
}

function authorize(request, env) {
  const email = (request.headers.get("cf-access-authenticated-user-email") || "").trim().toLowerCase();
  if (!email) return { ok: false, status: 401, error: "Cloudflare Access authentication was not detected. Sign in through admin.scifivalleycon.com, then reload the page." };
  const allowed = String(env.STAFF_EMAILS || "").split(",").map(x => x.trim().toLowerCase()).filter(Boolean);
  if (allowed.length && !allowed.includes(email)) return { ok: false, status: 403, error: "This staff account is not on the admin allowlist." };
  return { ok: true, email };
}

function validate(type, data) {
  if (data.length > 1000) return { ok: false, error: "This section contains too many records." };
  if (type === "mapSettings") {
    if (data.length !== 1 || typeof data[0] !== "object") return { ok:false, error:"Map settings must contain exactly one settings record." };
    return { ok:true };
  }
  if (type === "mapLayout") {
    if (data.length !== 1 || typeof data[0] !== "object") return { ok:false, error:"Map layout must contain exactly one layout record." };
    const doc=data[0]||{};
    if (!Array.isArray(doc.locations)) return { ok:false, error:"Map layout locations must be an array." };
    if (!Array.isArray(doc.elements)) return { ok:false, error:"Map layout elements must be an array." };
    return { ok:true };
  }
  if (type === "celebrityInfo") {
    if (data.length !== 1) return { ok:false, error:"Celebrity Guide Info must contain exactly one record." };
    return { ok:true };
  }
  if (type === "pricing") for (const [i,p] of data.entries()) if (!String(p?.guestName||"").trim()) return bad(i,"Guest name is required.");
  if (type === "photoOps") for (const [i,p] of data.entries()) {
    if (!["Friday","Saturday","Sunday"].includes(p.day)) return bad(i,"Photo op day is invalid.");
    if (!String(p?.time||"").trim()) return bad(i,"Photo op time is required.");
    if (!String(p?.title||"").trim()) return bad(i,"Photo op title is required.");
  }
  if (type === "autographs") for (const [i,a] of data.entries()) if (!String(a?.guestName||"").trim()) return bad(i,"Guest name is required.");
  if (type === "groupOps") for (const [i,g] of data.entries()) if (!String(g?.title||"").trim()) return bad(i,"Group or duo name is required.");
  if (type === "panels") for (const [i,p] of data.entries()) {
    if (!["Friday","Saturday","Sunday"].includes(p.day)) return bad(i,"Panel day is invalid.");
    if (!String(p?.startTime||"").trim()) return bad(i,"Panel start time is required.");
    if (!String(p?.title||"").trim()) return bad(i,"Panel title is required.");
  }
  if (type === "directions") {
    if (data.length !== 1 || typeof data[0] !== "object") return { ok:false, error:"Venue & Directions must contain exactly one settings record." };
    const d=data[0]||{};
    if (!String(d.venueName||"").trim()) return {ok:false,error:"Venue name is required."};
    if (!String(d.venueAddress||"").trim()) return {ok:false,error:"Venue address is required."};
    if (d.shuttleEnabled && !String(d.shuttleAddress||"").trim()) return {ok:false,error:"A shuttle pickup address is required when the shuttle location is published."};
    return {ok:true};
  }
  if (type === "settings") {
    if (data.length !== 1) return { ok:false, error:"Event Details must contain exactly one settings record." };
    const s=data[0]||{};
    if (!String(s.eventName||"").trim()) return { ok:false, error:"Event name is required." };
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(s.startDate||""))) return { ok:false, error:"Start date is required." };
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(s.endDate||""))) return { ok:false, error:"End date is required." };
    if (s.endDate < s.startDate) return { ok:false, error:"End date cannot be before the start date." };
    if (!String(s.venue||"").trim()) return { ok:false, error:"Venue is required." };
    if (!String(s.city||"").trim()) return { ok:false, error:"City is required." };
    return { ok:true };
  }
  if (type === "guests") for (const [i,g] of data.entries()) if (!String(g?.name || "").trim()) return bad(i, "Guest name is required.");
  if (type === "schedule") for (const [i,e] of data.entries()) {
    if (!String(e?.title || "").trim()) return bad(i, "Schedule title is required.");
    if (!["Friday","Saturday","Sunday"].includes(e.day)) return bad(i, "Schedule day must be Friday, Saturday, or Sunday.");
    if (!String(e?.time || "").trim()) return bad(i, "Schedule time is required.");
  }
  if (type === "vendors") for (const [i,v] of data.entries()) {
    if (!String(v?.name || "").trim()) return bad(i, "Vendor name is required.");
    if (!String(v?.location || "").trim()) return bad(i, "Table / booth location is required.");
  }
  if (type === "events") for (const [i,e] of data.entries()) {
    if (!String(e?.title || "").trim()) return bad(i, "Event Guide title is required.");
    if (!Array.isArray(e.content)) return bad(i, "Event Guide content must be an array.");
  }
  if (type === "sponsors") for (const [i,s] of data.entries()) if (!String(s?.name || "").trim()) return bad(i, "Sponsor name is required.");
  if (type === "socialLinks") for (const [i,s] of data.entries()) {
    if (!String(s?.label || "").trim()) return bad(i, "Social media label is required.");
    if (!String(s?.url || "").trim()) return bad(i, "Social media URL is required.");
  }
  if (type === "homeBanner") {
    if (data.length !== 1 || typeof data[0] !== "object") return {ok:false,error:"Home Banner must contain exactly one record."};
    const b=data[0]||{};
    if (!/^https:\/\//i.test(String(b.imageUrl||""))) return {ok:false,error:"Home Banner image URL must use HTTPS."};
    if (!/^https:\/\//i.test(String(b.sourceUrl||""))) return {ok:false,error:"Home Banner source URL must use HTTPS."};
    return {ok:true};
  }
  if (type === "faq") for (const [i,f] of data.entries()) {
    if (!String(f?.question || "").trim()) return bad(i, "FAQ question is required.");
    if (!String(f?.answer || "").trim() && !(Array.isArray(f?.bullets)&&f.bullets.length)) {
      return bad(i, "FAQ answer or bullet list is required.");
    }
  }
  if (type === "tshirts") for (const [i,s] of data.entries()) {
    if (!String(s?.title || "").trim()) return bad(i, "T-shirt title is required.");
    if (!String(s?.url || "").trim()) return bad(i, "T-shirt product URL is required.");
  }
  return { ok: true };
}
function bad(index, message) { return { ok: false, error: `Item ${index + 1}: ${message}` }; }
function branch(env) { return String(env.GITHUB_BRANCH || "main"); }
function repo(env) {
  const value = String(env.GITHUB_REPO || "").trim();
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(value)) throw new Error("GITHUB_REPO is not configured as owner/repository.");
  return value;
}
async function github(env, path, init = {}) {
  const token = String(env.GITHUB_TOKEN || "");
  if (!token) throw new Error("GITHUB_TOKEN secret is not configured.");
  return fetch(`https://api.github.com/repos/${repo(env)}${path}`, {
    ...init,
    headers: {
      "Accept": "application/vnd.github+json",
      "Authorization": `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "Sci-Fi-Valley-Con-Admin",
      "Content-Type": "application/json",
      ...(init.headers || {})
    }
  });
}
async function githubError(response) {
  const body = await response.json().catch(() => ({}));
  let message = body.message || `GitHub returned ${response.status}.`;
  if (response.status === 409) message = "GitHub reported a conflict. Reload this section before saving again.";
  if (response.status === 401 || response.status === 403) message = "GitHub rejected the admin credential. Check GITHUB_TOKEN and its Contents permission.";
  return json({ error: message }, response.status);
}
function decodeBase64(value) {
  const binary = atob(String(value).replace(/\s/g, ""));
  return new TextDecoder().decode(Uint8Array.from(binary, c => c.charCodeAt(0)));
}
function encodeBase64(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary);
}
function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "x-content-type-options": "nosniff" } });
}
