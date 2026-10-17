"use strict";
// Bottom sheet (dialog) plus the location picker: curated Bogor suggestions + dynamic Open-Meteo geocoder search.
const TAB={K:"Kabupaten",C:"Kota",X:"Nearby"};
const sh=$("#sh");let lastFocus=null,shTok=0,geoTimer=null,geoAbort=null;
const sheetHead=title=>`<div class="sh2"><h2>${title}</h2><button class="rb" data-a="close" aria-label="${esc(t("Close"))}">${ic("x",20)}</button></div>`;
function openSheet(label,body){shTok++;sh.classList.remove("out");lastFocus=document.activeElement;sh.hidden=false;document.body.style.overflow="hidden";
  sh.innerHTML=`<div class="bk" data-a="close"></div><div class="sht" tabindex="-1" role="dialog" aria-modal="true" aria-label="${esc(label)}"><div class="gr"></div>${body}</div>`}
function closeSheet(){if(sh.hidden)return;const tok=++shTok;clearTimeout(geoTimer);if(geoAbort)geoAbort.abort();S.gtok++;
  sh.classList.add("out");document.body.style.overflow="";if(lastFocus&&lastFocus.isConnected)lastFocus.focus();else app.focus({preventScroll:true});
  setTimeout(()=>{if(tok===shTok){sh.hidden=true;sh.innerHTML="";sh.classList.remove("out")}},matchMedia("(prefers-reduced-motion:reduce)").matches?0:200)}
function infoSheet(title,paras){openSheet(title,sheetHead(esc(title))+paras.map(p=>`<p class="cap">${esc(p)}</p>`).join(""));$(".sht").focus()}
function confirmSheet(title,action,label){openSheet(title,sheetHead(esc(title))+`<div class="acts"><button class="cta g" data-a="close">${t("Cancel")}</button><button class="cta" data-a="${action}">${esc(label)}</button></div>`);$(".sht").focus()}
function langSheet(){openSheet(t("Language"),sheetHead(t("Language"))+LANGS.map(l=>`<button class="li" data-a="lang" data-c="${l.c}"${l.c===SET.lang?' aria-current="true"':""} lang="${l.c}"><span><b>${l.n}</b></span>${l.c===SET.lang?ic("check",20):""}</button>`).join(""));$(".sht").focus()}
// ---- Location picker ----
const pickCur=()=>S.pick==="from"?S.from:S.pick==="to"?S.to:S.pick==="default"?(SET.home||byName("Cisarua")):S.loc;
function locSheet(mode){S.pick=mode;S.gt=pickCur().g||"K";S.geo={q:"",status:"idle",items:[]};
  openSheet(t("Choose your location"),`${sheetHead(t("Choose your location"))}<div class="sr">${ic("search",20)}<input id="q" type="search" placeholder="${esc(t("Search city, district, or area..."))}" aria-label="${esc(t("Search location"))}" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="search"></div><div id="tabs" class="seg" role="group" aria-label="${esc(t("Region"))}">${Object.keys(GN).map(k=>`<button data-a="gt" data-g="${k}" aria-pressed="${k===S.gt}">${t(TAB[k])}</button>`).join("")}</div><div id="ls" aria-live="polite"></div>`);
  renderLocList();matchMedia("(pointer:fine)").matches?$("#q").focus():$(".sht").focus()}
const locRow=(l,attr,cur)=>`<button class="li" ${attr}${sameLoc(l,cur)?' aria-current="true"':""}>${ic("pin",20)}<span><b>${esc(l.n)}</b><small>${esc(locSub(l))}</small></span>${sameLoc(l,cur)?ic("check",20):""}</button>`;
function renderLocList(){
  const q=($("#q")||{value:""}).value.trim(),low=q.toLowerCase(),cur=pickCur(),searching=q.length>=GEO_MIN_CHARS;
  $("#tabs").hidden=searching;
  document.querySelectorAll("#tabs button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.g===S.gt));
  const idx=LOC.map((l,i)=>[l,i]);let h="";
  if(!searching){
    const list=q?idx.filter(x=>x[0].n.toLowerCase().includes(low)):idx.filter(x=>x[0].g===S.gt);
    h=`<small class="lb">${t("Suggested around Bogor")}</small>`;
    if(!q)h+=`<div class="chips">${POP.map(n=>`<button data-a="pick" data-s="c" data-x="${LOC.indexOf(byName(n))}">${n}</button>`).join("")}</div>`;
    h+=list.length?list.map(x=>locRow(x[0],`data-a="pick" data-s="c" data-x="${x[1]}"`,cur)).join(""):`<p class="cap"><b>${t("No locations found. Try another search.")}</b></p>`;
    h+=`<p class="cap fine">${t("Coordinates of the suggested Bogor areas are approximate district centers.")}</p>`;
  }else{
    const local=idx.filter(x=>x[0].n.toLowerCase().includes(low));
    if(local.length)h+=`<small class="lb">${t("Around Bogor")}</small>`+local.map(x=>locRow(x[0],`data-a="pick" data-s="c" data-x="${x[1]}"`,cur)).join("");
    const g=S.geo;
    if(g.status==="loading")h+=`<p class="cap" role="status">${t("Searching...")}</p>`;
    else if(g.status==="error")h+=`<p class="cap" role="alert">${t("Couldn't search locations right now. Check your connection and try again.")}</p>`;
    else if(g.status==="ok"){
      // hide geocoder hits that duplicate a curated Bogor area of the same name
      const items=g.items.map((l,i)=>[l,i]).filter(x=>!local.some(c=>c[0].n.toLowerCase()===x[0].n.toLowerCase()&&dist(c[0],x[0])<5));
      if(items.length)h+=`<small class="lb">${t("Search results")}</small>`+items.map(x=>locRow(x[0],`data-a="pick" data-s="g" data-r="${x[1]}"`,cur)).join("");
      else if(!local.length)h+=`<p class="cap"><b>${t("No locations found. Try another search.")}</b></p>`;
    }
  }
  $("#ls").innerHTML=h;
}
// Debounced geocoder search; stale responses are ignored and the previous request is aborted.
function onLocQuery(){
  const q=$("#q").value.trim();clearTimeout(geoTimer);if(geoAbort)geoAbort.abort();const tok=++S.gtok;
  if(q.length<GEO_MIN_CHARS){S.geo={q:"",status:"idle",items:[]};renderLocList();return}
  S.geo={q,status:"loading",items:[]};renderLocList();
  geoTimer=setTimeout(()=>{geoAbort=new AbortController();
    geoSearch(q,geoAbort.signal).then(items=>{if(tok!==S.gtok)return;S.geo={q,status:"ok",items};renderLocList()},()=>{if(tok!==S.gtok)return;S.geo={q,status:"error",items:[]};renderLocList()})},GEO_DEBOUNCE_MS)}
// A location was chosen in the picker (mode = S.pick).
function applyPick(loc){const m=S.pick;
  if(m==="default"){SET.home=cleanLoc(loc);saveSet();S.loc=loc;closeSheet();settingsV();return}
  if(m==="loc"){S.loc=loc;closeSheet();go(S.view==="home"?"home":"wx");return}
  if(getT("tm"))S.dep=getT("tm");S[m]=loc;closeSheet();tripV()}
