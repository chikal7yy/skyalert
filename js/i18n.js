"use strict";
// Persisted settings (localStorage) and UI localization. The English text is the lookup key (see dict.js).
// Weather values from the API are never translated; only labels and messages are.
const LANGS=[{c:"id",n:"Bahasa Indonesia",loc:"id-ID"},{c:"en",n:"English",loc:"en-US"},{c:"ja",n:"日本語",loc:"ja-JP"},{c:"ko",n:"한국어",loc:"ko-KR"}];
const SETTINGS_KEY="skyalert.settings";
const store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
const TZ_RE=/^[A-Za-z][A-Za-z0-9_+\-]*(\/[A-Za-z0-9_+\-]+)+$/;
const str=(v,max)=>typeof v==="string"?v.slice(0,max):"";
// Validates a location object coming from storage or the geocoder; returns a clean copy or null.
function cleanLoc(x){
  if(!x||typeof x!=="object"||typeof x.n!=="string"||!x.n.trim())return null;
  if(!Number.isFinite(x.lat)||!Number.isFinite(x.lon)||Math.abs(x.lat)>90||Math.abs(x.lon)>180)return null;
  const o={n:str(x.n,80),sub:str(x.sub,100),lat:x.lat,lon:x.lon,cc:str(x.cc,3),tz:TZ_RE.test(x.tz||"")?x.tz:""};
  if(x.g==="K"||x.g==="C"||x.g==="X")o.g=x.g;
  return o;
}
function loadSettings(){
  let s={};try{s=JSON.parse(store.get(SETTINGS_KEY)||"{}")||{}}catch(e){}
  const pick=(v,ok,d)=>ok.includes(v)?v:d,codes=LANGS.map(l=>l.c),nav=String(navigator.language||"en").slice(0,2).toLowerCase();
  return{lang:pick(s.lang,codes,codes.includes(nav)?nav:"en"),theme:pick(s.theme,["system","light","dark"],"system"),
    tu:pick(s.tu,["c","f"],"c"),wu:pick(s.wu,["kmh","ms","mph"],"kmh"),home:cleanLoc(s.home)};
}
const SET=loadSettings();
const saveSet=()=>store.set(SETTINGS_KEY,JSON.stringify(SET));
const LANGOBJ=()=>LANGS.find(l=>l.c===SET.lang)||LANGS[1];
// t("Key {0}", a) -> translated string with placeholders filled; unknown keys fall back to the English key.
// dict.js rows are [Indonesian, Japanese, Korean]; English is the key itself.
const LANG_COL={id:0,ja:1,ko:2};
const t=(k,...a)=>{const r=DICT[k],i=LANG_COL[SET.lang];const s=(i!==undefined&&r&&r[i])||k;return s.replace(/\{(\d)\}/g,(_,n)=>a[+n]==null?"":a[+n])};
