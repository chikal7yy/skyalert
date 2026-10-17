"use strict";
// Navigation, global event handling and startup.
const NAV=[["home","Home","home"],["wx","Weather","cloud"],["trip","Trip","route"],["settings","Settings","gear"]];
const VIEWS={land,home,wx,trip:tripV,settings:settingsV};
function renderNav(){$("#nav").innerHTML=NAV.map(n=>`<button data-v="${n[0]}"${n[0]===S.view?' aria-current="page"':""}>${ic(n[2],24)}<span>${t(n[1])}</span></button>`).join("")}
function go(v,force){S.view=v;S.force=!!force;if(!sh.hidden)closeSheet();document.body.classList.toggle("land",v==="land");renderNav();
  app.classList.remove("in");void app.offsetWidth;app.classList.add("in");VIEWS[v]();window.scrollTo(0,0)}
// Resolves the location behind a picker row (curated list index or geocoder result index).
const pickedLoc=b=>b.dataset.s==="g"?S.geo.items[+b.dataset.r]:LOC[+b.dataset.x];
document.addEventListener("click",e=>{const b=e.target.closest("[data-v],[data-a]");if(!b)return;const a=b.dataset.a;
  if(!a)return go(b.dataset.v);
  if(settingsAction(a,b))return;
  if(a==="sheet")locSheet(b.dataset.m);
  else if(a==="close")closeSheet();
  else if(a==="gt"){S.gt=b.dataset.g;$("#q").value="";onLocQuery()}
  else if(a==="loc"){S.loc=LOC[+b.dataset.x];go("wx")}
  else if(a==="pick"){const l=pickedLoc(b);if(l)applyPick(l)}
  else if(a==="retry")S.view==="trip"?trip():go(S.view,true);
  else if(a==="ref")go(S.view,true);
  else if(a==="trip")trip()});
let depTok=0;
function updDep(v){if(!v)return;S.dep=v;const q=++depTok,put=x=>{const el=$("#lv");if(el&&q===depTok)el.innerHTML=x};F(S.loc).then(d=>put(leaveHTML(d)),()=>put(errW()))}
document.addEventListener("change",e=>{if(e.target.closest("#t"))updDep(getT("t"))});
document.addEventListener("input",e=>{if(e.target.id==="q")onLocQuery()});
document.addEventListener("keydown",e=>{if(sh.hidden)return;if(e.key==="Escape")return closeSheet();
  if(e.key==="Tab"){const x=[...sh.querySelectorAll("button:not([disabled]),input,select")],a=x[0],z=x[x.length-1];
    if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}});
applyTheme();applyLang();go("land");
