"use strict";
// Open-Meteo forecast access, caching, weather classification, risk levels and location-local time helpers.
const FORECAST_URL="https://api.open-meteo.com/v1/forecast";
const cache={},inflight={},key=l=>l.lat+","+l.lon;
const TTL_MS=10*60*1000,TIMEOUT_MS=12000;
// The request timezone is the location's own zone (from the geocoder), Asia/Jakarta for the curated Bogor list,
// otherwise "auto" (Open-Meteo resolves it from the coordinates).
function reqTz(l){if(l.tz==="auto"||(l.tz&&TZ_RE.test(l.tz)))return l.tz;return l.g?"Asia/Jakarta":"auto"}
const ci=d=>d.hourly.time.indexOf(nowFor(d).slice(0,13)+":00");
async function fetchForecast(l){
  const tz=reqTz(l);
  const u=FORECAST_URL+"?latitude="+l.lat+"&longitude="+l.lon+"&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,cloud_cover,wind_speed_10m"+
    "&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_gusts_10m,visibility"+
    "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&forecast_days=7&timezone="+encodeURIComponent(tz)+"&wind_speed_unit=kmh";
  const ac=new AbortController(),to=setTimeout(()=>ac.abort(),TIMEOUT_MS);let r;
  try{r=await fetch(u,{signal:ac.signal})}finally{clearTimeout(to)}
  if(!r.ok)throw new Error("HTTP "+r.status);
  const d=await r.json();
  if(!d||!d.hourly||!Array.isArray(d.hourly.time)||!d.current||typeof d.current.time!=="string"||!d.daily||!Array.isArray(d.daily.time))throw new Error("Malformed response");
  d.tz=typeof d.timezone==="string"&&d.timezone?d.timezone:(tz!=="auto"?tz:"");
  if(!d.tz||ci(d)<0)throw new Error("Malformed response");
  return d;
}
// Cached for 10 minutes; concurrent requests for the same coordinates share one network call.
// keep the cache small: drop the oldest entries beyond MAX_CACHE
const MAX_CACHE=40;
function trimCache(){const ks=Object.keys(cache);if(ks.length<=MAX_CACHE)return;ks.sort((x,y)=>cache[x].t-cache[y].t).slice(0,ks.length-MAX_CACHE).forEach(x=>delete cache[x])}
function F(l,force){const k=key(l),c=cache[k];if(c&&!force&&Date.now()-c.t<TTL_MS)return Promise.resolve(c.d);
  if(inflight[k]&&!force)return inflight[k];
  const p=fetchForecast(l).then(d=>{cache[k]={t:Date.now(),d};trimCache();return d}).finally(()=>{if(inflight[k]===p)delete inflight[k]});inflight[k]=p;return p}
const H=(d,i)=>{const h=d.hourly,g=k=>h[k]?h[k][i]:null;return{t:h.time[i],tp:g("temperature_2m"),fl:g("apparent_temperature"),hu:g("relative_humidity_2m"),pp:g("precipitation_probability"),c:g("weather_code"),cl:g("cloud_cover"),w:g("wind_speed_10m"),pr:g("precipitation"),gu:g("wind_gusts_10m"),v:g("visibility")}};
// WMO weather code -> localized label + visual family (k drives icon and atmosphere).
function W(c){if(!Number.isFinite(c))return{t:t("Unavailable"),k:"cloud"};
  if(c===0)return{t:t("Clear"),k:"sun"};if(c<=2)return{t:t("Partly cloudy"),k:"part"};if(c===3)return{t:t("Cloudy"),k:"cloud"};
  if(c===45||c===48)return{t:t("Fog"),k:"fog"};if(c>=95)return{t:t("Thunderstorm"),k:"storm"};
  if([71,73,75,77,85,86].includes(c))return{t:t("Snow"),k:"snow"};
  if([51,53,55,56,57,61,80].includes(c))return{t:t("Light rain"),k:"rain"};
  if([63,66,81].includes(c))return{t:t("Rain"),k:"rain"};if([65,67,82].includes(c))return{t:t("Heavy rain"),k:"heavy"};
  return{t:t("Cloudy"),k:"cloud"}}
// Rain-risk level from precipitation probability (and thunderstorms).
const rk=(p,c)=>!Number.isFinite(p)?null:(p>=60||c>=95)?"hi":p>=35?"mo":"lo";
const RISK=k=>({
  hi:{t:t("Rain alert"),r:t("Rain is likely. Consider bringing a raincoat before leaving."),b:t("Rain risk: High"),s:t("Rain is likely")},
  mo:{t:t("Be prepared"),r:t("Be prepared for rain. Consider bringing a raincoat."),b:t("Rain risk: Moderate"),s:t("Rain is possible")},
  lo:{t:t("Low rain risk"),r:t("Low rain risk. You probably won't need a raincoat."),b:t("Rain risk: Low"),s:t("Rain risk is low")}}[k]);
// TIME MODEL: every time shown or compared is the wall-clock time at the forecast location. Nothing is converted
// through UTC or the browser's own zone, except to ask "what time is it now at that location".
//  - Open-Meteo returns hourly.time as local strings like "2026-10-07T15:00" for the requested timezone (d.tz).
//  - "Now" is the device clock expressed in d.tz (Intl). If that hour is outside the forecast (wrong device clock),
//    we fall back to the API's own current.time.
//  - wall()/fmtWall() turn such strings into a minute counter and back (Date.UTC is only a calendar-safe counter).
const fmtCache={};
function localNow(tz){try{const f=fmtCache[tz]||(fmtCache[tz]=new Intl.DateTimeFormat("en-CA",{timeZone:tz,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hourCycle:"h23"}));
  const p={};f.formatToParts(new Date()).forEach(x=>{p[x.type]=x.value});return p.year+"-"+p.month+"-"+p.day+"T"+p.hour+":"+p.minute}catch(e){return null}}
function nowFor(d){const n=localNow(d.tz);return n&&d.hourly.time.includes(n.slice(0,13)+":00")?n:d.current.time.slice(0,16)}
const wall=s=>Date.parse(s.slice(0,16)+":00Z"),fmtWall=ms=>new Date(ms).toISOString().slice(0,16);
const dayLabel=(d,ms)=>fmtWall(ms).slice(0,10)===nowFor(d).slice(0,10)?t("Today"):t("Tomorrow");
// Next occurrence of "HH:MM" using the FULL wall-clock comparison: earlier than now (to the minute) means tomorrow.
function depMs(d,v){const p=String(v).split(":").map(Number);if(p.length<2||p.some(Number.isNaN))return NaN;const now=wall(nowFor(d));let ms=now-now%864e5+(p[0]*60+p[1])*6e4;if(ms<now)ms+=864e5;return ms}
// Index of the hourly slot nearest to ms (rounded to the hour); -1 when outside the 7-day forecast.
const idxAt=(d,ms)=>Number.isFinite(ms)?d.hourly.time.indexOf(fmtWall(Math.round(ms/36e5)*36e5).slice(0,13)+":00"):-1;
const ago=l=>{const c=cache[key(l)];if(!c)return"";const m=Math.floor((Date.now()-c.t)/6e4);return(m<1?t("Updated just now"):t("Updated {0} min ago",m))+" (Open-Meteo)"};
