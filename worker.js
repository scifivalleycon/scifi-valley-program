const DIRECTORY_PATH="/api/vendor-directory";
const PHOTO_PREFIX="/api/vendor-photos/";

export default {
  async fetch(request,env){
    const url=new URL(request.url);

    try{
      if(url.pathname===DIRECTORY_PATH&&request.method==="GET"){
        return await proxyVendorDirectory(env);
      }

      if(url.pathname.startsWith(PHOTO_PREFIX)&&request.method==="GET"){
        const photoId=decodeURIComponent(url.pathname.slice(PHOTO_PREFIX.length));
        return await proxyVendorPhoto(env,photoId);
      }

      if(url.pathname.startsWith("/api/")){
        return json({error:"Program API endpoint not found."},404);
      }

      return env.ASSETS.fetch(request);
    }catch(err){
      console.error("Program vendor proxy error",url.pathname,err);
      return json({error:"The live vendor directory is temporarily unavailable."},502);
    }
  }
};

async function proxyVendorDirectory(env){
  if(!env.VENDOR_API)return json({error:"Vendor service binding is not configured."},503);

  const response=await env.VENDOR_API.fetch(new Request("https://vendor.internal/api/public/directory",{
    method:"GET",
    headers:{Accept:"application/json"}
  }));

  const contentType=response.headers.get("content-type")||"";
  if(!response.ok||!contentType.includes("application/json")){
    return json({error:`Vendor directory returned ${response.status}.`},response.ok?502:response.status);
  }

  const rows=await response.json();
  if(!Array.isArray(rows))return json({error:"Vendor directory returned an invalid response."},502);

  return json(rows.map(rewriteVendorPhotoUrls));
}

async function proxyVendorPhoto(env,photoId){
  if(!env.VENDOR_API)return new Response("Vendor service unavailable.",{status:503});
  if(!photoId||!/^[a-zA-Z0-9-]{8,160}$/.test(photoId))return new Response("Not found.",{status:404});

  const response=await env.VENDOR_API.fetch(new Request(
    `https://vendor.internal/api/public/photos/${encodeURIComponent(photoId)}`,
    {method:"GET"}
  ));
  const headers=new Headers();
  headers.set("Content-Type",response.headers.get("content-type")||"application/octet-stream");
  headers.set("Cache-Control",response.ok?"public, max-age=3600":"no-store");
  headers.set("X-Content-Type-Options","nosniff");
  return new Response(response.body,{status:response.status,headers});
}

function rewriteVendorPhotoUrls(vendor){
  return {
    ...vendor,
    photos:(Array.isArray(vendor?.photos)?vendor.photos:[]).map(photo=>({
      ...photo,
      url:photo?.id?`${PHOTO_PREFIX}${encodeURIComponent(photo.id)}`:""
    })).filter(photo=>photo.url)
  };
}

function json(body,status=200){
  return new Response(JSON.stringify(body),{
    status,
    headers:{
      "Content-Type":"application/json; charset=utf-8",
      "Cache-Control":"no-store",
      "X-Content-Type-Options":"nosniff"
    }
  });
}
