"use strict";
// Curated, suggested locations around Bogor (a single source for these areas) plus small geo helpers.
// Coordinates are APPROXIMATE district centres entered by hand, not official data. Anywhere else in the world
// is found with the Open-Meteo Geocoding API (see geo.js), never from this list.
const GN={K:"Kabupaten Bogor",C:"Kota Bogor",X:"Nearby (Kab. Sukabumi)"};
const RAW={
K:"Babakan Madang,-6.57,106.88;Bojonggede,-6.49,106.795;Caringin,-6.705,106.835;Cariu,-6.53,107.15;Ciampea,-6.56,106.69;Ciawi,-6.65,106.85;Cibinong,-6.48,106.85;Cibungbulang,-6.57,106.64;Cigombong,-6.74,106.80;Cigudeg,-6.49,106.49;Cijeruk,-6.68,106.79;Cileungsi,-6.40,106.96;Ciomas,-6.60,106.77;Cisarua,-6.68,106.94;Ciseeng,-6.42,106.68;Citeureup,-6.49,106.88;Dramaga,-6.58,106.74;Gunung Putri,-6.44,106.90;Gunung Sindur,-6.39,106.70;Jasinga,-6.48,106.46;Jonggol,-6.47,107.05;Kemang,-6.52,106.73;Klapanunggal,-6.46,106.99;Leuwiliang,-6.58,106.56;Leuwisadeng,-6.59,106.61;Megamendung,-6.65,106.88;Nanggung,-6.60,106.52;Pamijahan,-6.63,106.63;Parung,-6.42,106.73;Parung Panjang,-6.35,106.57;Rancabungur,-6.51,106.72;Rumpin,-6.40,106.60;Sukajaya,-6.55,106.43;Sukamakmur,-6.60,107.07;Sukaraja,-6.57,106.84;Tajurhalang,-6.45,106.77;Tamansari,-6.65,106.76;Tanjungsari,-6.57,107.12;Tenjo,-6.34,106.48;Tenjolaya,-6.65,106.70",
C:"Bogor Barat,-6.58,106.78;Bogor Selatan,-6.63,106.80;Bogor Tengah,-6.595,106.797;Bogor Timur,-6.60,106.82;Bogor Utara,-6.57,106.81;Tanah Sareal,-6.57,106.78",
X:"Cicurug,-6.78,106.78"};
const LOC=[];for(const g in RAW)RAW[g].split(";").forEach(s=>{const p=s.split(",");LOC.push({n:p[0],g,lat:+p[1],lon:+p[2]})});
const byName=n=>LOC.find(l=>l.n===n);
const POP=["Cisarua","Megamendung","Ciawi","Caringin","Cibinong","Bogor Tengah"];
const sameLoc=(a,b)=>!!a&&!!b&&Math.abs(a.lat-b.lat)<1e-4&&Math.abs(a.lon-b.lon)<1e-4;
const rad=x=>x*Math.PI/180;
// Great-circle distance in km.
const dist=(a,b)=>{const p=rad(b.lat-a.lat),q=rad(b.lon-a.lon),x=Math.sin(p/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(q/2)**2;return 12742*Math.asin(Math.sqrt(x))};
const nearestCurated=(lat,lon)=>{let best=null;for(const l of LOC){const d=dist({lat,lon},l);if(!best||d<best.d)best={l,d}}return best};
