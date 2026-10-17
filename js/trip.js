"use strict";
// Trip planner: estimated route checkpoints, per-checkpoint forecasts and the Travel Score.
// There is no road-routing service: checkpoints are geographic points on the straight line between the two
// locations, and the duration is an estimate (straight-line distance x ROUTE_FACTOR at AVG_KMH).
const ROUTE_FACTOR=1.4,AVG_KMH=25,NEAR_KM=6,MIN_GAP_KM=1.5,MAX_TRIP_KM=300;
function tripV(){const a=S.from,b=S.to;
  app.innerHTML=`<header class="tb"><h1>${t("Plan Your Trip")}</h1></header><section class="gl jb"><button class="nd" data-a="sheet" data-m="from">${ic("pin",24)}<span><small>${t("From")}</small><b>${esc(a.n)}</b></span>${ic("chevd",16)}</button><i class="dl"></i><div class="nd">${ic("clock",24)}<span><small>${t("Departure time")}</small>${timeCtl("tm",S.dep,"ts")}</span></div><i class="dl"></i><button class="nd" data-a="sheet" data-m="to">${ic("flag",24)}<span><small>${t("To")}</small><b>${esc(b.n)}</b></span>${ic("chevd",16)}</button></section><button class="cta" data-a="trip">${t("Check My Trip")}</button><div id="tr" aria-live="polite"></div>`}
// Start, two interpolated points and the destination. Interpolated points use their own coordinates for the
// forecast; they are only given a name when a curated Bogor area lies within NEAR_KM.
function buildCheckpoints(a,b){
  const total=dist(a,b),pts=[{r:0,l:a,name:a.n,km:0}];
  for(const r of[1/3,2/3]){
    const lat=+(a.lat+(b.lat-a.lat)*r).toFixed(3),lon=+(a.lon+(b.lon-a.lon)*r).toFixed(3),nc=nearestCurated(lat,lon),named=nc&&nc.d<=NEAR_KM;
    if(dist({lat,lon},pts[pts.length-1].l)<MIN_GAP_KM||dist({lat,lon},b)<MIN_GAP_KM)continue;
    pts.push({r,l:{n:named?nc.l.n:"",lat,lon,tz:"auto"},name:named?t("Near {0}",nc.l.n):"",km:total*r});
  }
  pts.push({r:1,l:b,name:b.n,km:total});
  return pts.map((p,k)=>p.name?p:Object.assign(p,{name:t("Checkpoint {0}",k+1)}));
}
const TR=k=>({hi:t("Rain is likely along your route. Consider bringing a raincoat before leaving."),mo:t("Some parts of your route may receive rain. Prepare accordingly."),lo:t("Low rain risk along the estimated route. Your trip looks relatively favorable.")}[k]);
const fmtTripTime=min=>min>=180?{n:String(Math.round(min/6)/10),u:t("hours estimated")}:{n:String(min),u:t("min estimated")};
async function runTrip(){S.dep=getT("tm")||S.dep;const a=S.from,b=S.to,q=++S.rq,out=$("#tr");
  if(sameLoc(a,b)){out.innerHTML=`<p class="cap">${t("Choose two different locations.")}</p>`;return}
  if(dist(a,b)>MAX_TRIP_KM){out.innerHTML=`<p class="cap" role="alert">${t("This trip is too long for an estimate here. Choose locations within about {0} km of each other.",MAX_TRIP_KM)}</p>`;return}
  out.innerHTML=sk(t("Checking trip..."));
  const km=dist(a,b)*ROUTE_FACTOR,min=Math.max(5,Math.round(km/AVG_KMH*12)*5),pts=buildCheckpoints(a,b);
  try{
    const ds=await Promise.all(pts.map(p=>F(p.l)));if(q!==S.rq)return;
    const base=depMs(ds[0],S.dep),off=x=>Number.isFinite(x.utc_offset_seconds)?x.utc_offset_seconds:null;
    // Each checkpoint is looked up in the wall-clock time of ITS OWN timezone (shifted by the UTC offsets when zones differ).
    const rows=pts.map((p,k)=>{let ms=base+p.r*min*6e4;
      if(ds[k].tz!==ds[0].tz){const o0=off(ds[0]),ok=off(ds[k]);if(o0===null||ok===null)return null;ms+=(ok-o0)*1000}
      const i=idxAt(ds[k],ms);return i<0?null:{p,ms,h:H(ds[k],i)}});
    if(rows.includes(null)){out.innerHTML=`<p class="cap">${t("Weather forecast unavailable for this departure time.")}</p>`;return}
    const pp=nums(rows.map(r=>r.h.pp)),wd=nums(rows.map(r=>r.h.w)),hm=nums(rows.map(r=>r.h.hu));
    if(!pp.length){out.innerHTML=errT();return}
    const mx=Math.max(...pp),th=rows.some(r=>r.h.c>=95),wm=wd.length?Math.max(...wd):0,gm=Math.max(0,...nums(rows.map(r=>r.h.gu))),pm=Math.max(0,...nums(rows.map(r=>r.h.pr))),
      we=Math.max(wm,gm*0.6),hv=hm.length?hm.reduce((s,x)=>s+x,0)/hm.length:0,dl=dayLabel(ds[0],base);
    const sc=Math.max(0,Math.min(100,Math.round(100-(0.6*mx+Math.max(0,hv-70)*0.4+Math.min(we,50)*0.4+Math.min(10,pm*2.5)+(th?15:0))))),
      lv=sc>=80?"lo":sc>=50?"mo":"hi",label=lv==="lo"?t("Good"):lv==="mo"?t("Fair"):t("Poor"),k=rk(mx,th?95:0),R=RISK(k),dur=fmtTripTime(min);
    const bar=(l,p,v)=>`<div class="br"><span>${l}</span><i><u style="width:${Math.round(p)}%"></u></i><b>${v}</b></div>`;
    out.innerHTML=`<section class="sum"><div><small class="fl">${esc(a.n)} ${ic("arrow",14)} ${esc(b.n)}</small><span class="bn">${dur.n}</span><span class="bu">${dur.u}</span><br><small>${t("Approx. {0} km",Math.round(km))}</small></div><span class="rp ${k}">${R.b}</span></section>
<p class="cap">${t("Departing {0} · {1}.",dl,S.dep)} ${t("Estimate only: straight-line distance × 1.4 at 25 km/h, not a real road route.")}</p>
<section class="gl sc"><svg width="104" height="104" viewBox="0 0 100 100" role="img" aria-label="${esc(t("Travel Score {0} out of 100, {1}",sc,label))}"><circle class="rtk" cx="50" cy="50" r="42" fill="none" stroke-width="8"/><circle class="rv ${lv}" cx="50" cy="50" r="42" fill="none" stroke-width="8" stroke-linecap="round" stroke-dasharray="${Math.round(sc*2.64)} 264" transform="rotate(-90 50 50)"/><text class="rn" x="50" y="54" text-anchor="middle" font-size="30" font-weight="300" font-family="inherit">${sc}</text><text class="rs" x="50" y="68" text-anchor="middle" font-size="9" font-family="inherit">/100</text></svg><div class="bars"><b>${t("Travel Score: {0}",label)}</b>${bar(t("Rain"),mx,f(mx,"%"))}${bar(t("Humidity"),hv,f(hv,"%"))}${bar(t("Wind"),Math.min(100,wm/50*100),wnd(wm))}${bar(t("Storm"),th?100:0,th?t("Possible"):t("Not forecast"))}<small>${t("Gusts up to {0}, precipitation up to {1}.",wnd(gm),f(pm," mm",1))}</small></div></section>
<section class="sec"><h2>${t("Weather along the route")}</h2><ol class="jt">${rows.map(r=>{const w=W(r.h.c),rl=rk(r.h.pp,r.h.c);
  return`<li data-k="${rl||"lo"}"><div><b>${esc(r.p.name)}</b><span class="vh"> ${rl?RISK(rl).b:""}</span><br><small>${fmtWall(r.ms).slice(11,16)}${r.p.km>0&&r.p.r<1?" · "+t("{0} km from start",Math.round(r.p.km)):""}</small><br><small>${t("{0}, humidity {1}, wind {2}",w.t,f(r.h.hu,"%"),wnd(r.h.w))}</small></div><div>${wi(w.k,34)}<b>${tmp(r.h.tp)}</b><small>${t("Rain {0}",f(r.h.pp,"%"))}</small></div></li>`}).join("")}</ol><p class="cap">${t("Estimated route — weather checkpoints are based on geographic points, not live road routing.")}</p></section>${coat(k,t("Highest rain probability along the route: {0}.",f(mx,"%")),TR(k))}`}
  catch(e){if(q===S.rq)out.innerHTML=errT()}}
// Button feedback: disable while the trip is being checked.
async function trip(){const bt=document.querySelector('[data-a="trip"]'),lbl=bt?bt.textContent:"";if(bt){bt.disabled=true;bt.textContent=t("Checking...")}
  try{await runTrip()}finally{if(bt){bt.disabled=false;bt.textContent=lbl}}}
