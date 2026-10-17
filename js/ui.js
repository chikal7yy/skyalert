"use strict";
// Icons, shared components and the Landing / Home / Weather screens.
// ---- Icon system (one stroke set) + custom weather glyphs ----
const IC={
  home:"M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10",cloud:"M7 18a4 4 0 0 1-.5-8 5.5 5.5 0 0 1 10.6 1.5A3.3 3.3 0 0 1 17 18z",
  route:"M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM18 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM8.5 17H14a3 3 0 0 0 0-6h-4a3 3 0 0 1 0-6h6",
  pin:"M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  clock:"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",refresh:"M20 11a8 8 0 0 0-14.5-4M4 4v4h4M4 13a8 8 0 0 0 14.5 4M20 20v-4h-4",
  chev:"M9 6l6 6-6 6",chevd:"M6 9l6 6 6-6",search:"M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4",flag:"M5 21V4M5 4h11l-2 4 2 4H5",
  umbrella:"M3 12a9 9 0 0 1 18 0zM12 12v6a2 2 0 0 0 4 0",alert:"M12 3l10 18H2zM12 10v5M12 18h.01",arrow:"M5 12h14M13 6l6 6-6 6",
  drop:"M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z",wind:"M3 9h11a3 3 0 1 0-3-3M3 15h15a3 3 0 1 1-3 3M3 12h7",check:"M5 12l5 5 9-10",x:"M6 6l12 12M18 6L6 18",
  thermo:"M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0z",eye:"M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  gear:"M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z",
  globe:"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18",
  moon:"M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z",bell:"M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0",
  info:"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v5M12 8h.01",shield:"M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z",
  trash:"M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"};
const ic=(n,s=22)=>`<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${IC[n]}"/></svg>`;
const CL="M20 46a10 10 0 0 1-1-20 14 14 0 0 1 27 3 8.5 8.5 0 0 1-1 17z";
// Weather glyphs. Colors come from CSS classes (see .wx in style.css) so they stay readable in the light and dark themes.
function wi(k,s=48){let b;
  if(k==="sun")b='<circle class="sf" cx="32" cy="32" r="12"/><path class="ss" d="M32 6v6M32 52v6M6 32h6M52 32h6M13.6 13.6l4.2 4.2M46.2 46.2l4.2 4.2M13.6 50.4l4.2-4.2M46.2 17.8l4.2-4.2" stroke-width="3.5" stroke-linecap="round"/>';
  else if(k==="part")b=`<circle class="sf" cx="42" cy="22" r="10"/><path class="ss" d="M42 4v4M56 10l-3 3M60 22h-4" stroke-width="3" stroke-linecap="round"/><path class="c1" d="${CL}" transform="translate(-4 4)"/>`;
  else if(k==="cloud")b=`<path class="c1" d="${CL}"/>`;
  else if(k==="fog")b=`<path class="c1" d="${CL}" transform="translate(0 -6)"/><path class="fg" d="M14 52h36M20 58h28" stroke-width="3" stroke-linecap="round" opacity=".8"/>`;
  else if(k==="storm")b=`<path class="c2" d="${CL}" transform="translate(0 -8)"/><path class="bf" d="M35 38l-9 13h7l-3 11 11-15h-7z"/>`;
  else if(k==="snow")b=`<path class="c1" d="${CL}" transform="translate(0 -8)"/><g class="sn"><circle cx="22" cy="48" r="3"/><circle cx="33" cy="52" r="3"/><circle cx="44" cy="48" r="3"/></g>`;
  else b=`<path class="${k==="heavy"?"c2":"c1"}" d="${CL}" transform="translate(0 -8)"/><path class="rd" d="M24 44l-3 9M34 44l-3 9M44 44l-3 9${k==="heavy"?"M29 53l-2 7M39 53l-2 7":""}" stroke-width="3.5" stroke-linecap="round"/>`;
  return`<svg class="wx" width="${s}" height="${s}" viewBox="0 0 64 64" aria-hidden="true">${b}</svg>`}
// ---- Shared pieces ----
const errCard=(title,text)=>`<section class="er" role="alert">${wi("cloud",72)}<h2>${title}</h2><p>${text}</p><button class="cta" data-a="retry">${t("Retry")}</button></section>`;
const errW=()=>errCard(t("Weather unavailable"),t("We couldn't load the latest weather data."));
const errT=()=>errCard(t("Trip unavailable"),t("We couldn't calculate the trip right now."));
const sk=txt=>`<p class="cap" role="status">${txt}</p><div class="sk" style="height:210px"></div><div class="sk" style="height:84px"></div><div class="sk" style="height:150px"></div>`;
const theme=k=>{S.k=k;document.body.dataset.w=k};
const tb=(g,ti)=>`<header class="tb"><h1 class="vh">${t(ti||"Home")}</h1><div>${g?`<small>${g}</small>`:""}<button class="pill" data-a="sheet" data-m="loc" aria-label="${esc(t("Change location, currently {0}",S.loc.n))}">${ic("pin",18)}<span><b>${esc(S.loc.n)}</b><small>${esc(locSub(S.loc))}</small></span>${ic("chevd",16)}</button></div><button class="rb" data-a="ref" aria-label="${esc(t("Refresh weather"))}">${ic("refresh",20)}</button></header>`;
const strip=(hu,pp,w)=>`<div class="strip"><div>${ic("umbrella",18)}<b>${f(pp,"%")}</b><small>${t("Rain")}</small></div><div>${ic("drop",18)}<b>${f(hu,"%")}</b><small>${t("Humidity")}</small></div><div>${ic("wind",18)}<b>${wnd(w)}</b><small>${t("Wind")}</small></div></div>`;
function hero(d){const c=d.current,h=H(d,ci(d)),w=W(c.weather_code);theme(w.k);
  return`<section class="hero" aria-label="${esc(t("Current weather"))}"><div class="hw"><div><div class="temp">${tmp(c.temperature_2m)}</div><div class="cond">${w.t}</div><small>${t("Feels like {0}",tmp(c.apparent_temperature))}</small></div>${wi(w.k,120)}</div>${strip(c.relative_humidity_2m,h.pp,c.wind_speed_10m)}</section>`}
const tile=(d,i,on)=>{const h=H(d,i),w=W(h.c),hh=h.t.slice(11,16);
  return`<div class="hh${on?" on":""}" role="group" aria-label="${esc(t("{0}, {1}, {2}, rain probability {3}",hh,w.t,tmp(h.tp),f(h.pp,"%")))}"><small>${hh}</small>${wi(w.k,34)}<b>${tmp(h.tp)}</b><small>${f(h.pp,"%")}</small></div>`};
const coat=(k,text,rec)=>{const R=RISK(k);
  return`<section class="coat ${k}" role="${k==="hi"?"alert":"status"}"><div class="cb">${ic(k==="hi"?"alert":"umbrella",26)}</div><div><span class="rp ${k}">${R.b}</span><h2>${R.t}</h2><p>${text}</p><p class="rc"><b>${rec||R.r}</b></p></div></section>`};
const upd=()=>`<p class="cap up">${ago(S.loc)}</p>`;
// ---- Landing ----
function land(){theme("part");
  const feat=(i,ti,tx)=>`<div class="hl">${ic(i,26)}<div><b>${t(ti)}</b><small>${t(tx)}</small></div></div>`;
  const step=(n,ti,tx)=>`<li data-n="${n}"><b>${t(ti)}</b><br><small>${t(tx)}</small></li>`;
  app.innerHTML=`<svg class="wx" width="60" height="60" viewBox="0 0 48 48" aria-hidden="true" style="margin-top:28px"><circle cx="31" cy="15" r="8" fill="#ffcb47"/><path d="M12 37a8 8 0 0 1 1-16 11 11 0 0 1 21 3 6.5 6.5 0 0 1-1 13z" fill="#fff"/></svg><h1 class="lh">SkyAlert</h1><p class="tag">${t("Know Before You Go.")}</p><p class="cap lede">${t("Check the weather and understand what to expect before your journey.")}</p>
<div class="jr" role="img" aria-label="${esc(t("Example journey"))}: Cisarua, Megamendung, Cicurug"><div>${wi("rain",56)}<b>Cisarua</b></div><div>${wi("cloud",56)}<b>Megamendung</b></div><div>${wi("part",56)}<b>Cicurug</b></div></div><small class="ex">${t("Example journey")}</small>
<button class="cta" data-v="home">${t("Check Weather")}</button><button class="cta g" data-v="trip">${t("Plan My Trip")}</button>
<section class="sec"><h2>${t("Why SkyAlert?")}</h2>${feat("cloud","Weather Around You","Conditions across different places.")}${feat("clock","Weather When You Leave","The weather expected at the exact time you plan to go.")}${feat("route","Plan Your Trip","Weather between your start point and destination.")}${feat("umbrella","Smart Recommendation","Simple advice, like whether to bring a raincoat.")}</section>
<section class="sec"><h2>${t("How SkyAlert Works")}</h2><ol class="stp">${step(1,"Choose your location","Select where you are or where you want to go.")}${step(2,"Check the weather","Temperature, humidity, rain probability, wind and forecast.")}${step(3,"Choose when you're leaving","Select your planned departure time.")}${step(4,"Plan your journey","Select your destination.")}${step(5,"Get your recommendation","SkyAlert analyzes the forecast for you.")}</ol></section>`}
// ---- Home ----
const tzNote=d=>d.tz&&deviceTz&&d.tz!==deviceTz?`<p class="cap">${esc(t("Local time at this location ({0})",d.tz))}</p>`:"";
function leaveHTML(d){const m=depMs(d,S.dep),i=idxAt(d,m);
  if(i<0)return`<p class="cap">${t("Weather forecast unavailable for this departure time.")}</p>`;
  const h=H(d,i),w=W(h.c),k=rk(h.pp,h.c),R=k?RISK(k):null,c0=ci(d),cur=H(d,c0),nw=W(d.current.weather_code);
  const hr=h.t.slice(11,16),dl=dayLabel(d,m),df=Number.isFinite(h.pp)&&Number.isFinite(cur.pp)?h.pp-cur.pp:0;
  const a=i-c0<=12?c0:Math.max(0,i-2),z=Math.min(d.hourly.time.length-1,i+2),tiles=[];for(let j=a;j<=z;j++)tiles.push(tile(d,j,j===i));
  const say=[R?t("{0} around your departure.",R.s):t("Rain probability unavailable for this hour."),df>10?t("Rain risk is higher than now."):df<-10?t("Rain risk is lower than now."):t("Rain risk is similar to now."),
    Number.isFinite(h.gu)?t("Humidity {0}, wind {1}, gusts {2}.",f(h.hu,"%"),wnd(h.w),wnd(h.gu)):t("Humidity {0}, wind {1}.",f(h.hu,"%"),wnd(h.w))];
  if(hr!==S.dep)say.push(t("Using the {0} forecast, the nearest available hourly forecast to {1}.",hr,S.dep));
  if(i-c0>72)say.push(t("Forecast confidence is lower for this time."));
  return`<section class="jny" aria-label="${esc(t("Now compared with your departure"))}"><div class="jn"><small>${t("NOW")}</small><b>${nowFor(d).slice(11,16)}</b>${wi(nw.k,40)}<span>${tmp(d.current.temperature_2m)}</span><small>${nw.t}</small></div><div class="ln" aria-hidden="true">${ic("arrow",24)}</div><div class="jn dp"><small>${t("YOUR DEPARTURE")}</small><b>${hr}</b><small class="dd">${dl} · ${S.dep}</small>${wi(w.k,40)}<span>${tmp(h.tp)}</span><small class="dd">${w.t}</small></div></section>
<p class="cap">${say.join(" ")}</p>${tzNote(d)}${R?coat(k,t("{0} rain probability at {1}",f(h.pp,"%"),hr)):""}
<section class="sec"><h2>${t("Hourly")}</h2><div class="sw">${tiles.join("")}</div></section><p class="cap">${t("Forecasts are probabilities, not guarantees. The nearest forecast hour is used.")}</p>`}
async function home(){const q=++S.rq,fo=S.force;S.force=false;app.innerHTML=`<header class="tb"><h1>${t("Home")}</h1></header>`+sk(t("Loading weather..."));
  try{const d=await F(S.loc,fo);if(q!==S.rq)return;const hh=+nowFor(d).slice(11,13);
    app.innerHTML=tb(hh<11?t("Good morning"):hh<18?t("Good afternoon"):t("Good evening"))+hero(d)+`<section class="gl lv"><label for="t-h">${t("When are you leaving?")}</label><div class="tp">${ic("clock",26)}${timeCtl("t",S.dep)}</div></section><div id="lv" aria-live="polite">${leaveHTML(d)}</div><button class="cta" data-v="trip">${t("Plan My Trip")} ${ic("arrow",20)}</button><section class="sec"><div class="sh2"><h2>${t("Weather Around Bogor")}</h2><button class="lk" data-a="sheet" data-m="loc">${t("All areas")}</button></div><div class="sw">${POP.map(n=>{const ix=LOC.indexOf(byName(n));return`<button class="pc" data-a="loc" data-x="${ix}" id="p${ix}"><span class="pn">${n}</span><div class="sk" style="height:70px;width:100%"></div></button>`}).join("")}</div></section>`+upd();
    POP.forEach(n=>{const l=byName(n),ix=LOC.indexOf(l);F(l,fo).then(x=>{const el=$("#p"+ix);if(q!==S.rq||!el)return;const c=x.current,w=W(c.weather_code),pp=H(x,ci(x)).pp,k=rk(pp,c.weather_code);
      el.dataset.w=w.k;el.innerHTML=`<span class="pn">${n}</span>${wi(w.k,46)}<b class="pt">${tmp(c.temperature_2m)}</b><small>${w.t}, ${t("Rain")} ${f(pp,"%")}</small>${k?`<small class="pr ${k}">${k==="hi"?t("Bring a raincoat"):k==="mo"?t("Maybe bring a raincoat"):t("Low rain risk")}</small>`:""}`}).catch(()=>{const el=$("#p"+ix);if(q===S.rq&&el)el.innerHTML=`<span class="pn">${n}</span><small>${t("Unavailable")}</small>`})})}
  catch(e){if(q===S.rq)app.innerHTML=`<header class="tb"><h1>${t("Home")}</h1></header>`+errW()}}
// ---- Weather ----
const cell=(i,l,v)=>`<div>${ic(i,20)}<small>${l}</small><b>${v}</b></div>`;
function detail(d){const i0=ci(d),tiles=[];for(let j=i0;j<Math.min(i0+24,d.hourly.time.length);j++)tiles.push(tile(d,j,j===i0));
  const D=d.daily,lo=Math.min(...nums(D.temperature_2m_min)),hi=Math.max(...nums(D.temperature_2m_max)),sp=Math.max(1,hi-lo),h=H(d,i0),C=d.current;
  const rows=D.time.map((x,j)=>{const w=W(D.weather_code[j]),a=D.temperature_2m_min[j],b=D.temperature_2m_max[j],
    nm=j===0?t("Today"):new Date(x+"T00:00:00Z").toLocaleDateString(LANGOBJ().loc,{weekday:"long",timeZone:"UTC"});
    return`<div class="dr"><span>${esc(nm)}</span><span>${wi(w.k,26)}<small>${f(D.precipitation_probability_max[j],"%")}</small></span>${Number.isFinite(a)&&Number.isFinite(b)?`<div class="rw"><small>${tmp(a)}</small><span class="rg"><i style="left:${((a-lo)/sp*100).toFixed(0)}%;width:${Math.max(6,(b-a)/sp*100).toFixed(0)}%"></i></span><b>${tmp(b)}</b></div>`:"<b>n/a</b>"}</div>`}).join("");
  return hero(d)+`<section class="sec"><h2>${t("Hourly forecast")}</h2><div class="sw">${tiles.join("")}</div></section><section class="sec"><h2>${t("Conditions")}</h2><div class="cg">${cell("thermo",t("Feels like"),tmp(C.apparent_temperature))}${cell("umbrella",t("Rain probability"),f(h.pp,"%"))}${cell("drop",t("Precipitation"),f(h.pr," mm",1))}${cell("drop",t("Humidity"),f(C.relative_humidity_2m,"%"))}${cell("wind",t("Wind"),wnd(C.wind_speed_10m))}${cell("wind",t("Wind gusts"),wnd(h.gu))}${cell("cloud",t("Cloud cover"),f(C.cloud_cover,"%"))}${cell("eye",t("Visibility"),Number.isFinite(h.v)?f(h.v/1000," km",1):"n/a")}</div></section><section class="sec"><h2>${t("7-day forecast")}</h2><div class="gl rows">${rows}</div></section>`}
async function wx(){const q=++S.rq,fo=S.force;S.force=false;app.innerHTML=tb("","Weather")+'<div id="dt">'+sk(t("Loading weather..."))+'</div>';
  try{const d=await F(S.loc,fo);if(q!==S.rq)return;$("#dt").innerHTML=detail(d)+upd()}catch(e){if(q===S.rq)$("#dt").innerHTML=errW()}}
