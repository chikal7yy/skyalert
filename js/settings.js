"use strict";
// Settings screen: language, default location, units, theme, notifications (not available yet), About.
const THEMES=[["system","System"],["light","Light"],["dark","Dark"]];
const darkQuery=matchMedia("(prefers-color-scheme: dark)");
function applyTheme(){
  const dark=SET.theme==="system"?darkQuery.matches:SET.theme==="dark";
  document.documentElement.dataset.theme=dark?"dark":"light";
  const m=document.querySelector('meta[name="theme-color"]');if(m)m.content=dark?"#14284f":"#7bb8ee";
}
if(darkQuery.addEventListener)darkQuery.addEventListener("change",()=>{if(SET.theme==="system")applyTheme()});
function applyLang(){
  document.documentElement.lang=SET.lang;
  document.title="SkyAlert — "+t("Know Before You Go.");
  const m=document.querySelector('meta[name="description"]');if(m)m.content=t("SkyAlert helps users understand weather conditions before travelling by combining location, time, weather forecasts, and travel recommendations.");
  $("#nav").setAttribute("aria-label",t("Main navigation"));
}
const setRow=(icon,title,val,act,desc)=>`<button class="set" data-a="${act}">${ic(icon,22)}<span class="st"><b>${esc(title)}</b>${val?`<small class="sv">${esc(val)}</small>`:""}${desc?`<small>${esc(desc)}</small>`:""}</span>${ic("chev",16)}</button>`;
const segRow=(icon,title,act,opts,cur)=>`<div class="set col"><div class="sr1">${ic(icon,22)}<b>${esc(title)}</b></div><div class="seg" role="group" aria-label="${esc(title)}">${opts.map(o=>`<button data-a="${act}" data-val="${o[0]}" aria-pressed="${o[0]===cur}">${esc(o[1])}</button>`).join("")}</div></div>`;
function settingsV(){
  const home=SET.home||byName("Cisarua");
  app.innerHTML=`<header class="tb"><h1>${t("Settings")}</h1></header>
<h2 class="gh">${t("General")}</h2><div class="sg">
${setRow("globe",t("Language"),LANGOBJ().n,"langs")}
${setRow("pin",t("Default location"),home.n+" · "+locSub(home),"defloc")}
${segRow("thermo",t("Temperature unit"),"tu",[["c","°C"],["f","°F"]],SET.tu)}
${segRow("wind",t("Wind unit"),"wu",[["kmh","km/h"],["ms","m/s"],["mph","mph"]],SET.wu)}</div>
<h2 class="gh">${t("Appearance")}</h2><div class="sg">${segRow("moon",t("Theme"),"theme",THEMES.map(x=>[x[0],t(x[1])]),SET.theme)}</div>
<h2 class="gh">${t("Notifications")}</h2><div class="sg"><div class="set off">${ic("bell",22)}<span class="st"><span class="tl"><b id="wa-l">${t("Weather alerts")}</b><span class="badge">${t("Coming soon")}</span></span><small id="wa-d">${t("Not available yet. Alerts need background notifications, which SkyAlert doesn't support yet.")}</small></span><button class="tg" role="switch" aria-checked="false" aria-labelledby="wa-l" aria-describedby="wa-d" disabled><i></i></button></div></div>
<h2 class="gh">${t("About")}</h2><div class="sg">
${setRow("info",t("About SkyAlert"),"","about")}
${setRow("info",t("How scores work"),"","scores")}
${setRow("shield",t("Data & privacy"),"","privacy")}
<div class="set note">${ic("alert",22)}<span class="st"><b>${t("Development status")}</b><small>${t("SkyAlert is still under development. Some features, weather data, locations, and recommendations may not always be completely accurate.")}</small><small>${t("SkyAlert may sometimes make mistakes or provide inaccurate information. Use it as an additional guide and verify important information before making important travel decisions.")}</small></span></div>
${setRow("trash",t("Clear cache and reload"),"","clear").replace("class=\"set\"","class=\"set quiet\"")}</div>
<p class="cap up">SkyAlert · ${t("Know Before You Go.")}</p>`}
const INFO={
  about:()=>[t("About SkyAlert"),[t("Know Before You Go."),t("SkyAlert helps users understand weather conditions before travelling by combining location, time, weather forecasts, and travel recommendations."),t("Forecast information comes from Open-Meteo. Forecasts are probabilities and may not always be accurate.")]],
  scores:()=>[t("How scores work"),[t("Rain risk is High at 60% or more (or a thunderstorm), Moderate at 35–59%, Low below 35%. The Travel Score starts at 100 and drops with higher rain probability, humidity, wind, gusts, precipitation and thunderstorms: Good 80+, Fair 50–79, Poor below 50. It is a simple guide, not a safety guarantee.")]],
  privacy:()=>[t("Data & privacy"),[t("SkyAlert has no accounts and no server. Your settings (language, theme, units and default location) are saved only on this device. To search places, the text you type is sent to Open-Meteo, and to get forecasts the coordinates of the places you view are sent to Open-Meteo. Page fonts load from Google Fonts. SkyAlert does not use GPS."),t("Coordinates of the suggested Bogor areas are approximate district centers.")]]};
// Settings actions (called from the global click handler).
const refocus=sel=>{const el=document.querySelector(sel);if(el)el.focus({preventScroll:true})};
function settingsAction(a,b){
  if(a==="langs")langSheet();
  else if(a==="lang"){SET.lang=b.dataset.c;saveSet();applyLang();closeSheet();renderNav();settingsV();refocus('[data-a="langs"]')}
  else if(a==="defloc")locSheet("default");
  else if(a==="tu"||a==="wu"||a==="theme"){SET[a]=b.dataset.val;saveSet();if(a==="theme")applyTheme();settingsV();refocus(`[data-a="${a}"][data-val="${b.dataset.val}"]`)}
  else if(INFO[a]){const[ti,p]=INFO[a]();infoSheet(ti,p)}
  else if(a==="clear")confirmSheet(t("Clear cached forecasts and reload?"),"clearok",t("Clear and reload"));
  else if(a==="clearok"){for(const k in cache)delete cache[k];for(const k in geoCache)delete geoCache[k];closeSheet();go("home",true)}
  else return false;
  return true;
}
