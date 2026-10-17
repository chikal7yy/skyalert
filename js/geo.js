"use strict";
// Dynamic location search with the free Open-Meteo Geocoding API (no API key).
const GEO_URL="https://geocoding-api.open-meteo.com/v1/search";
const GEO_TIMEOUT_MS=8000,GEO_MIN_CHARS=2,GEO_DEBOUNCE_MS=350;
const geoCache={};
// Turns raw geocoder results into location objects; skips malformed rows and duplicates.
function parseGeo(raw){
  const seen=new Set(),out=[];
  for(const x of raw){
    if(!x||typeof x.name!=="string"||!x.name.trim()||!Number.isFinite(x.latitude)||!Number.isFinite(x.longitude))continue;
    const subParts=[...new Set([x.admin2,x.admin1,x.country].filter(p=>typeof p==="string"&&p&&p!==x.name))];
    const dup=[x.name,x.admin1,x.admin2,x.country_code].join("|").toLowerCase();
    if(seen.has(dup))continue;seen.add(dup);
    const loc=cleanLoc({n:x.name,sub:subParts.join(", "),lat:x.latitude,lon:x.longitude,cc:x.country_code,tz:x.timezone});
    if(loc)out.push(loc);
  }
  return out;
}
async function geoSearch(q,signal){
  const k=SET.lang+"|"+q.toLowerCase();
  if(geoCache[k])return geoCache[k];
  const ac=new AbortController(),to=setTimeout(()=>ac.abort(),GEO_TIMEOUT_MS);
  if(signal)signal.addEventListener("abort",()=>ac.abort(),{once:true});
  let r;
  try{r=await fetch(GEO_URL+"?name="+encodeURIComponent(q)+"&count=10&language="+SET.lang+"&format=json",{signal:ac.signal})}finally{clearTimeout(to)}
  if(!r.ok)throw new Error("HTTP "+r.status);
  const d=await r.json();
  if(!d||typeof d!=="object")throw new Error("Malformed response");
  const raw=d.results===undefined?[]:d.results; // no "results" key when nothing matches
  if(!Array.isArray(raw))throw new Error("Malformed response");
  return(geoCache[k]=parseGeo(raw));
}
