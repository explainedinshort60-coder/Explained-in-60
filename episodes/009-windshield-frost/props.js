// Episode 009 props: a car seen from the front at night, windshield tilted up to a clear starry sky.
// Air thermometer on a post (37 F at about four feet), a glass-temperature dial on the windshield,
// invisible heat (orange wavy arrows) leaving the glass for the sky, water vapor dots that stick and turn into ice,
// frost crystals spreading over the glass, then a carport roof, clouds and a tree that send heat back down.
// Contract: window.PROPS = {draw(T,f)->{svg, anchors}, grip(T)->{x,y}, labelY}
// T: frost 0..1 (glass coverage), therm 0..1 (air thermometer), gdial 0..1 (glass dial), gtemp (F on the dial),
//    heat 0..1 (arrows up), back 0..1 (sky sends back, tiny), vapor 0..1 (vapor dots), stick 0..1 (dots land and freeze),
//    port 0..1 (carport slides down), cloud 0..1 (clouds roll in), tree 0..1 (tree grows in), down 0..1 (heat sent back down),
//    feet 0..1 (four-feet bracket), shiver (px)
const GY=700, SKYTOP=-1600;
const ICE='#ffffff', HEAT='#ff8a3d', FROSTB='#dfe9ff', GLASS='#9fb9ff', SKY1='#0b1a52', SKY2='#2a3f96', ROAD='#26346f';
// windshield trapezoid (bottom wide, top narrow) = glass leaning back toward the sky
const WS={bl:[300,478],br:[820,478],tr:[750,300],tl:[370,300]};
function rnd(i){const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);}
function crystal(x,y,r,o,rot){
  let s=`<g transform="translate(${x} ${y}) rotate(${rot})" opacity="${o}">`;
  for(let k=0;k<6;k++){const a=k*60;
    s+=`<g transform="rotate(${a})"><line x1="0" y1="0" x2="0" y2="${-r}" stroke="${ICE}" stroke-width="${Math.max(2,r/6)}" stroke-linecap="round"/>`+
       `<line x1="0" y1="${-r*0.55}" x2="${r*0.3}" y2="${-r*0.8}" stroke="${ICE}" stroke-width="${Math.max(1.5,r/9)}" stroke-linecap="round"/>`+
       `<line x1="0" y1="${-r*0.55}" x2="${-r*0.3}" y2="${-r*0.8}" stroke="${ICE}" stroke-width="${Math.max(1.5,r/9)}" stroke-linecap="round"/></g>`;}
  return s+`</g>`;
}
function wsPt(u,v){ // u across 0..1, v bottom(0) to top(1)
  const xl=WS.bl[0]+(WS.tl[0]-WS.bl[0])*v, xr=WS.br[0]+(WS.tr[0]-WS.br[0])*v, y=WS.bl[1]+(WS.tl[1]-WS.bl[1])*v;
  return [xl+(xr-xl)*u,y];
}
function wavy(x,y0,y1,ph,w){ // vertical wavy arrow path from y0 up to y1
  let d=`M${x} ${y0}`;const n=18;
  for(let i=1;i<=n;i++){const y=y0+(y1-y0)*i/n;d+=` L${x+Math.sin(i*0.9+ph)*w} ${y}`;}
  return d;
}
function arrow(x,y0,y1,ph,o,col,wid){
  if(o<=0.01)return '';const dir=y1<y0?-1:1;
  return `<g opacity="${o}"><path d="${wavy(x,y0,y1,ph,10)}" fill="none" stroke="${col}" stroke-width="${wid}" stroke-linecap="round"/>`+
    `<path d="M${x-18} ${y1-dir*18} L${x} ${y1} L${x+18} ${y1-dir*18}" fill="none" stroke="${col}" stroke-width="${wid}" stroke-linecap="round" stroke-linejoin="round"/></g>`;
}
function sky(T,f){
  let s=`<defs><linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${SKY1}"/><stop offset="1" stop-color="${SKY2}"/></linearGradient>`+
    `<clipPath id="wsc"><path d="M${WS.bl.join(' ')} L${WS.br.join(' ')} L${WS.tr.join(' ')} L${WS.tl.join(' ')} Z"/></clipPath></defs>`;
  s+=`<rect x="-2000" y="${SKYTOP}" width="5200" height="${GY-SKYTOP}" fill="url(#sk)"/>`;
  // stars (twinkle), hidden by clouds
  const so=1-0.85*(T.cloud||0);
  for(let i=0;i<70;i++){const x=-500+rnd(i)*2100, y=-1100+rnd(i+99)*1250, r=2+rnd(i+7)*4, tw=0.55+0.45*Math.sin(f/5+i);
    s+=`<circle cx="${x}" cy="${y}" r="${r}" fill="${IVORY}" opacity="${so*tw}"/>`;}
  // moon
  s+=`<g opacity="${so}"><circle cx="930" cy="-170" r="62" fill="${IVORY}"/><circle cx="958" cy="-188" r="56" fill="${SKY1}"/></g>`;
  // road
  s+=`<rect x="-2000" y="${GY}" width="5200" height="1600" fill="${ROAD}"/><line x1="-2000" y1="${GY}" x2="3200" y2="${GY}" stroke="${NAVY}" stroke-width="6"/>`;
  for(let k=0;k<6;k++)s+=`<rect x="${-300+k*320}" y="${GY+180}" width="150" height="16" rx="8" fill="${IVORY}" opacity=".35"/>`;
  return s;
}
function car(T,f){
  const sh=T.shiver||0, dx=sh*Math.sin(f*2.3);
  let s=`<g transform="translate(${dx} 0)">`;
  // shadow
  s+=`<ellipse cx="560" cy="${GY+6}" rx="360" ry="22" fill="${NAVY}" opacity=".45"/>`;
  // tires
  s+=`<rect x="262" y="600" width="90" height="102" rx="18" fill="${NAVY}"/><rect x="768" y="600" width="90" height="102" rx="18" fill="${NAVY}"/>`;
  // mirrors
  s+=`<path d="M270 470 L214 452 Q196 450 198 470 L204 492 Q208 504 222 502 L276 496 Z" fill="${BLUE}" stroke="${NAVY}" stroke-width="7" stroke-linejoin="round"/>`;
  s+=`<path d="M850 470 L906 452 Q924 450 922 470 L916 492 Q912 504 898 502 L844 496 Z" fill="${BLUE}" stroke="${NAVY}" stroke-width="7" stroke-linejoin="round"/>`;
  // roof + pillars (cabin frame)
  s+=`<path d="M352 300 Q360 272 392 270 L728 270 Q760 272 768 300 L842 482 L278 482 Z" fill="${BLUE}" stroke="${NAVY}" stroke-width="8" stroke-linejoin="round"/>`;
  // lower body
  s+=`<path d="M250 500 Q250 476 280 474 L840 474 Q870 476 870 500 L878 620 Q878 646 850 646 L270 646 Q242 646 242 620 Z" fill="${BLUE}" stroke="${NAVY}" stroke-width="8" stroke-linejoin="round"/>`;
  // hood line, grille, headlights, plate
  s+=`<path d="M290 500 Q560 520 830 500" fill="none" stroke="${NAVY}" stroke-width="5" opacity=".5"/>`;
  s+=`<rect x="440" y="560" width="240" height="56" rx="16" fill="${NAVY}"/>`;
  for(let k=0;k<4;k++)s+=`<line x1="${470+k*60}" y1="568" x2="${470+k*60}" y2="608" stroke="${BLUE}" stroke-width="5" opacity=".8"/>`;
  s+=`<rect x="282" y="532" width="120" height="50" rx="22" fill="${IVORY}" stroke="${NAVY}" stroke-width="7"/><rect x="718" y="532" width="120" height="50" rx="22" fill="${IVORY}" stroke="${NAVY}" stroke-width="7"/>`;
  s+=`<rect x="516" y="622" width="88" height="18" rx="5" fill="${IVORY}" stroke="${NAVY}" stroke-width="4"/>`;
  // glass
  const P=`M${WS.bl.join(' ')} L${WS.br.join(' ')} L${WS.tr.join(' ')} L${WS.tl.join(' ')} Z`;
  s+=`<path d="${P}" fill="${GLASS}"/>`;
  s+=`<path d="M420 470 L520 310 L570 310 L470 470 Z M520 470 L600 330 L622 330 L542 470 Z" fill="${IVORY}" opacity=".35"/>`;
  // frost layer + crystals (clipped to glass)
  const fr=T.frost||0;
  if(fr>0.005){
    s+=`<g clip-path="url(#wsc)"><path d="${P}" fill="${FROSTB}" opacity="${0.85*Math.min(1,fr*1.2)}"/>`;
    const n=46;
    for(let i=0;i<n;i++){const th=rnd(i+3)*0.9; if(fr<th)continue; const g=Math.min(1,(fr-th)/0.22);
      const [x,y]=wsPt(rnd(i+11),rnd(i+23)); s+=crystal(x,y,(16+rnd(i+5)*26)*g,0.95,rnd(i)*60);}
    s+=`</g>`;
  }
  s+=`<path d="${P}" fill="none" stroke="${NAVY}" stroke-width="8" stroke-linejoin="round"/>`;
  // wipers
  s+=`<path d="M330 470 L520 446 M600 470 L790 446" stroke="${NAVY}" stroke-width="8" stroke-linecap="round"/>`;
  // roof frost line
  if(fr>0.05)s+=`<path d="M392 272 L728 272" stroke="${ICE}" stroke-width="${3+6*fr}" stroke-linecap="round" opacity="${fr}"/>`;
  // glass temperature dial
  if((T.gdial||0)>0.01){const o=T.gdial, gt=Math.round(T.gtemp||37), cold=gt<=32;
    s+=`<g opacity="${o}"><rect x="486" y="352" width="148" height="78" rx="20" fill="${cold?'#1d3fb8':IVORY}" stroke="${NAVY}" stroke-width="6"/>`+
      `<text x="560" y="406" font-size="46" font-weight="900" fill="${cold?IVORY:NAVY}" text-anchor="middle" font-family="DejaVu Sans, sans-serif">${gt}°F</text></g>`;}
  s+=`</g>`;
  return s;
}
function thermo(T){
  const o=T.therm||0; if(o<=0.01)return '';
  let s=`<g opacity="${o}">`;
  s+=`<rect x="104" y="330" width="14" height="${GY-330}" fill="${IVORY}" stroke="${NAVY}" stroke-width="5"/>`;
  s+=`<rect x="70" y="210" width="82" height="170" rx="40" fill="${IVORY}" stroke="${NAVY}" stroke-width="7"/>`;
  s+=`<rect x="104" y="236" width="14" height="110" rx="7" fill="#e9eefc" stroke="${NAVY}" stroke-width="3"/><rect x="104" y="282" width="14" height="64" rx="7" fill="#ff5a4a"/><circle cx="111" cy="350" r="18" fill="#ff5a4a" stroke="${NAVY}" stroke-width="4"/>`;
  s+=`<rect x="34" y="120" width="154" height="74" rx="20" fill="${IVORY}" stroke="${NAVY}" stroke-width="6"/><text x="111" y="172" font-size="46" font-weight="900" fill="${NAVY}" text-anchor="middle" font-family="DejaVu Sans, sans-serif">37°F</text>`;
  // four-feet bracket
  const fo=T.feet||0;
  if(fo>0.01)s+=`<g opacity="${fo}"><path d="M176 ${GY} L196 ${GY} L196 300 L176 300" fill="none" stroke="${IVORY}" stroke-width="6"/>`+
    `<text x="214" y="${(GY+300)/2+14}" font-size="40" font-weight="900" fill="${IVORY}" font-family="DejaVu Sans, sans-serif" transform="rotate(-90 214 ${(GY+300)/2})" text-anchor="middle">4 FT</text></g>`;
  return s+`</g>`;
}
function heat(T,f){
  let s='';const h=T.heat||0, sent=(T.port||0)+(T.cloud||0)+(T.tree||0)>0.3, xs=sent?[400,560,720]:[400,480,560,640,720];
  const capY=(T.port||0)>0.5?125:((T.cloud||0)>0.5?-520:((T.tree||0)>0.5?-60:-900));
  xs.forEach((x,i)=>{const v=0.18+0.12*Math.sin(i*1.7);const [,y]=wsPt(0.5,v+0.3);
    const run=((f*6+i*70)%220);
    s+=arrow(x,y-30-run*0.3,Math.max(capY,y-330-run),f/3+i,h*(0.85),HEAT,9);});
  // the clear sky sends back a tiny bit
  const b=T.back||0;
  if(b>0.01){s+=arrow(860,-640,-470,f/4,b*0.8,'#ffc59a',6);}
  // heat sent back down (carport roof, clouds, tree)
  const d=T.down||0;
  if(d>0.01){const y0=(T.port||0)>0.5?100:((T.cloud||0)>0.5?-420:30);
    [480,640].forEach((x,i)=>{const run=((f*5+i*50)%90);s+=arrow(x,y0+20+run*0.4,Math.min(262,y0+190+run*0.4),f/3+i*2,d,'#ffd84a',11);});}
  return s;
}
function vapor(T,f){
  const v=T.vapor||0, st=T.stick||0; if(v<=0.01)return '';
  let s='';
  for(let i=0;i<18;i++){const [gx,gy]=wsPt(0.12+rnd(i+40)*0.76,0.15+rnd(i+60)*0.7);
    const fx=gx+Math.sin(f/9+i)*80+(rnd(i+80)-0.5)*260, fy=gy-180-rnd(i+90)*240+Math.cos(f/11+i)*30;
    const land=Math.min(1,Math.max(0,st*1.4-rnd(i+70)*0.4));
    const x=fx+(gx-fx)*land, y=fy+(gy-fy)*land;
    if(land<0.98) s+=`<g opacity="${v}"><circle cx="${x}" cy="${y}" r="13" fill="${WATER}" stroke="${IVORY}" stroke-width="4"/></g>`;
    else s+=crystal(gx,gy,26,v,i*13);}
  return s;
}
function carport(T){
  const p=T.port||0; if(p<=0.01)return '';
  const y=-700+(60+700)*p; let s=`<g opacity="${Math.min(1,p*1.5)}">`;
  s+=`<rect x="70" y="${y}" width="24" height="${GY-y}" fill="#c9d3f5" stroke="${NAVY}" stroke-width="6"/><rect x="1026" y="${y}" width="24" height="${GY-y}" fill="#c9d3f5" stroke="${NAVY}" stroke-width="6"/>`;
  s+=`<path d="M30 ${y} L1090 ${y} L1070 ${y+46} L50 ${y+46} Z" fill="#c9d3f5" stroke="${NAVY}" stroke-width="8" stroke-linejoin="round"/>`;
  s+=`<path d="M40 ${y-4} L1080 ${y-4}" stroke="${ICE}" stroke-width="10" stroke-linecap="round"/>`; // frost lands on the roof instead
  return s+`</g>`;
}
function clouds(T,f){
  const c=T.cloud||0; if(c<=0.01)return '';
  let s='';const off=(1-c)*1400;
  [[-200,-600,1],[300,-660,1.25],[820,-590,1.1],[1250,-640,1]].forEach(([x,y,k],i)=>{x+=off*(i%2?1:-1)+Math.sin(f/30+i)*10;
    s+=`<g transform="translate(${x} ${y}) scale(${k})" opacity="${Math.min(1,c*1.3)}"><path d="M-180 60 Q-200 -10 -120 -20 Q-110 -100 -10 -90 Q50 -150 130 -80 Q220 -80 210 0 Q260 50 190 70 Z" fill="#c9d3f5" stroke="${NAVY}" stroke-width="7" stroke-linejoin="round"/></g>`;});
  return s;
}
function tree(T,f){
  const t=T.tree||0; if(t<=0.01)return '';
  const k=0.4+0.6*t; let s=`<g opacity="${Math.min(1,t*1.5)}" transform="translate(1000 ${GY}) scale(${k}) translate(-1000 ${-GY})">`;
  s+=`<path d="M970 ${GY} L985 120 L1015 120 L1030 ${GY} Z" fill="#6b4a2f" stroke="${NAVY}" stroke-width="7"/>`;
  s+=`<path d="M1000 140 Q900 220 640 160 Q380 120 420 30 Q340 -60 470 -110 Q520 -230 680 -200 Q780 -300 920 -220 Q1090 -280 1150 -150 Q1290 -120 1240 0 Q1300 120 1150 150 Q1080 170 1000 140 Z" fill="#2f8f5b" stroke="${NAVY}" stroke-width="8" stroke-linejoin="round"/>`;
  for(let i=0;i<9;i++)s+=`<circle cx="${560+rnd(i+200)*620}" cy="${-150+rnd(i+210)*260}" r="${14+rnd(i)*10}" fill="#46b277" opacity=".8"/>`;
  return s+`</g>`;
}
function anchors(T){
  const [gx,gy]=wsPt(0.5,0.55);
  return {glass:{x:gx,y:gy},glasstop:{x:560,y:300},dial:{x:560,y:352},thermo:{x:111,y:194},air:{x:111,y:194},
    sky:{x:560,y:-260},heat:{x:560,y:120},roof:{x:560,y:60},cloud:{x:420,y:-560},tree:{x:760,y:-140},
    vapor:{x:560,y:180},ice:{x:wsPt(0.3,0.5)[0],y:wsPt(0.3,0.5)[1]},car:{x:560,y:470}};
}
window.PROPS={labelY:60,
  draw(T,f){return {svg:sky(T,f)+clouds(T,f)+tree(T,f)+carport(T)+thermo(T)+car(T,f)+heat(T,f)+vapor(T,f),anchors:anchors(T)};},
  grip(T){return {x:560,y:470};}};
