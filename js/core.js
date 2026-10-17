"use strict";
// Shared state, DOM helpers, escaping, unit formatting and the 24-hour time control.
const $=s=>document.querySelector(s),app=$("#app");
const S={view:"land",loc:SET.home||byName("Cisarua"),from:byName("Cisarua"),to:byName("Cicurug"),dep:"15:00",
  rq:0,force:false,pick:"loc",gt:"K",k:"part",geo:{q:"",status:"idle",items:[]},gtok:0};
// Everything that comes from an API or from storage is escaped before it is put into innerHTML.
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const f=(x,u="",r=0)=>Number.isFinite(x)?x.toFixed(r)+u:"n/a";
const nums=a=>a.filter(Number.isFinite);
// Units: all weather data stays in °C and km/h internally; only the display changes.
const tmp=c=>{if(!Number.isFinite(c))return"n/a";const v=Math.round(SET.tu==="f"?c*9/5+32:c);return(v===0?0:v)+"°"};
const WIND_UNITS={kmh:{u:"km/h",k:1,r:0},ms:{u:"m/s",k:1/3.6,r:1},mph:{u:"mph",k:0.621371,r:0}};
const wnd=kmh=>{if(!Number.isFinite(kmh))return"n/a";const w=WIND_UNITS[SET.wu]||WIND_UNITS.kmh;return(kmh*w.k).toFixed(w.r)+" "+w.u};
const provinceName=()=>t("West Java");
const locSub=l=>l.sub||(l.g?(l.g==="X"?"Kab. Sukabumi":GN[l.g])+", "+provinceName():"");
// 24-hour time control (Indonesia uses 24h). Two native selects keep the mobile wheel pickers.
const timeCtl=(id,v,cls="")=>{const[h,m]=v.split(":"),o=(a,s)=>a.map(x=>`<option${x===s?" selected":""}>${x}</option>`).join("");
  return`<div class="tc ${cls}" id="${id}" role="group" aria-label="${esc(t("Departure time"))}"><select id="${id}-h" aria-label="${esc(t("Hour"))}">${o(Array.from({length:24},(_,i)=>String(i).padStart(2,"0")),h)}</select><span aria-hidden="true">:</span><select aria-label="${esc(t("Minute"))}">${o(["00","15","30","45"],m)}</select></div>`};
const getT=id=>{const s=document.querySelectorAll("#"+id+" select");return s.length===2?s[0].value+":"+s[1].value:""};
let deviceTz="";try{deviceTz=Intl.DateTimeFormat().resolvedOptions().timeZone||""}catch(e){}
