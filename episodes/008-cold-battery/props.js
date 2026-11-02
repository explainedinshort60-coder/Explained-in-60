// Episode 008 props: a phone held in the host's left hand, a magnifier bubble with an x-ray of its lithium-ion
// battery (two electrodes, electrolyte, lithium ions), falling snow, a warm/cold room tint, a snail and a hair dryer.
// Contract: window.PROPS = {draw(T,f)->{svg, anchors}, grip(T)->{x,y}, labelY}
// T: px,py (phone bottom-centre), on (screen 0..1), pct (battery %), snow (0..1), warm (0..1 tint), cold (0..1 tint),
//    bub (bubble 0..1), ph (ion phase), thick (electrolyte syrup 0..1), shiv (ion shiver 0..1), pw (power bolt 0..1),
//    sn (snail progress 0..1, <0 hidden), dry (hair dryer 0..1), hide (phone tucked behind the body 0/1)
const AMBER='#d98a1c',ICE='#bfe3ff',GRAPH='#5b6079',LIME='#33c26b',RED='#ff4d4d',YEL='#ffd84a';
const BX=300,BY=230,BR=205;
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function mix(c1,c2,t){t=clamp(t,0,1);const p=c=>[1,3,5].map(i=>parseInt(c.substr(i,2),16));const A=p(c1),B=p(c2);return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('');}
function fr(x){return x-Math.floor(x);}
function tint(T){
  let s='';
  if((T.warm||0)>0.01)s+=`<rect x="-3000" y="-3000" width="8000" height="3700" fill="#ffb347" opacity="${(0.13*T.warm).toFixed(3)}"/>`;
  if((T.cold||0)>0.01)s+=`<rect x="-3000" y="-3000" width="8000" height="3700" fill="#9cc8ff" opacity="${(0.16*T.cold).toFixed(3)}"/>`;
  return s;
}
function snow(T,f){
  const o=T.snow||0;if(o<0.02)return '';
  let s=`<g opacity="${o.toFixed(3)}" fill="#ffffff" stroke="${NAVY}" stroke-width="2.5">`;
  for(let i=0;i<46;i++){
    const x0=-300+fr(i*0.6180339)*1500, sp=(i%3)+2;            // 2..4 laps over the 1440-frame loop
    const y=-500+fr(i*0.37+f*sp/1440)*1220, x=x0+Math.sin(f/30+i)*14, r=5+(i%4)*2;
    s+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}"/>`;
  }
  return s+`</g>`;
}
function phone(T,f){
  if(T.hide)return '';
  const x=T.px,y=T.py,w=104,h=190,on=T.on||0,p=Math.round(T.pct||0);
  let s=`<g>`;
  s+=`<rect x="${x-w/2}" y="${y-h}" width="${w}" height="${h}" rx="18" fill="${NAVY}"/>`;
  s+=`<rect x="${x-w/2+7}" y="${y-h+9}" width="${w-14}" height="${h-18}" rx="12" fill="${mix('#141a33','#eaf1ff',on)}"/>`;
  if(on>0.3){
    const lo=p<=10, fc=lo?RED:LIME, bw=46, fill=bw*clamp(p/100,0,1);
    s+=`<g opacity="${on.toFixed(2)}"><rect x="${x-bw/2-2}" y="${y-h+52}" width="${bw+4}" height="24" rx="5" fill="none" stroke="${NAVY}" stroke-width="4"/>`;
    s+=`<rect x="${x+bw/2+2}" y="${y-h+58}" width="5" height="12" rx="2" fill="${NAVY}"/>`;
    if(fill>0.5)s+=`<rect x="${x-bw/2+1}" y="${y-h+55}" width="${fill.toFixed(1)}" height="18" rx="3" fill="${fc}"/>`;
    s+=`<text x="${x}" y="${y-h+124}" font-size="27" font-weight="800" fill="${lo?RED:NAVY}" text-anchor="middle" font-family="DejaVu Sans, sans-serif">${p}%</text></g>`;
  }
  s+=`<rect x="${x-14}" y="${y-h+14}" width="28" height="7" rx="3.5" fill="${NAVY}"/>`;
  s+=`</g>`;
  return s;
}
function ionsSVG(T,f){
  const th=T.thick||0,sh=T.shiv||0;let s='';
  const n=12;
  for(let i=0;i<n;i++){
    const u=fr((T.ph||0)+i/n), x=205+u*190, y=118+((i*7)%n)/n*230+Math.sin(u*6.28+i)*8;
    const jx=sh*Math.sin(f*2.3+i*1.7)*3.2, a=clamp(Math.min(u,1-u)*12,0,1);
    s+=`<g opacity="${a.toFixed(2)}" transform="translate(${(x+jx).toFixed(1)} ${y.toFixed(1)})"><circle r="15" fill="${IVORY}" stroke="${NAVY}" stroke-width="4"/>`;
    if(sh>0.3)s+=`<circle cx="-5" cy="-3" r="2.6" fill="${NAVY}"/><circle cx="5" cy="-3" r="2.6" fill="${NAVY}"/><path d="M-5 6 l3 -2 l3 2 l3 -2" fill="none" stroke="${NAVY}" stroke-width="2"/>`;
    else s+=`<path d="M-7 0 H7 M0 -7 V7" stroke="${BLUE}" stroke-width="4" stroke-linecap="round"/>`;
    s+=`</g>`;
  }
  return s;
}
function snail(T,f){
  const p=T.sn;if(p==null||p<0||p>1.2)return '';
  const x=170+p*260,y=356,b=Math.sin(f*0.6)*2;
  let s=`<g transform="translate(${x.toFixed(1)} ${y})">`;
  s+=`<path d="M-44 0 Q-40 -16 -10 -14 L30 -14 Q42 -30 46 -40 M30 -14 Q38 -32 34 -44" fill="none" stroke="${NAVY}" stroke-width="5" stroke-linecap="round"/>`;
  s+=`<path d="M-48 2 Q-44 -18 -10 -16 L34 -16 Q50 -16 50 0 Z" fill="#9be38f" stroke="${NAVY}" stroke-width="5" stroke-linejoin="round"/>`;
  s+=`<circle cx="46" cy="-40" r="5" fill="${NAVY}"/><circle cx="34" cy="-44" r="5" fill="${NAVY}"/>`;
  s+=`<g transform="translate(-6 ${-34+b})"><circle r="26" fill="${BLUE}" stroke="${NAVY}" stroke-width="5"/><path d="M0 0 m0 -4 a4 4 0 1 1 -4 4 a9 9 0 1 1 9 9 a15 15 0 1 1 -15 -15" fill="none" stroke="${IVORY}" stroke-width="4"/></g>`;
  // tiny speed lines
  s+=`<path d="M-70 -20 h-26 M-74 -6 h-34" stroke="${NAVY}" stroke-width="4" stroke-linecap="round" opacity=".7"/>`;
  return s+`</g>`;
}
function bubble(T,f){
  const b=T.bub||0;if(b<0.02)return '';
  const sc=0.35+0.65*b;
  let s=`<g opacity="${clamp(b*1.6,0,1).toFixed(2)}">`;
  // magnifier link to the phone
  if(!T.hide)s+=`<path d="M${BX+BR*0.62} ${BY+BR*0.72} L${T.px-36} ${T.py-150}" stroke="${NAVY}" stroke-width="4" stroke-dasharray="10 8"/>`;
  s+=`<g transform="translate(${BX} ${BY}) scale(${sc.toFixed(3)}) translate(${-BX} ${-BY})">`;
  s+=`<circle cx="${BX}" cy="${BY}" r="${BR}" fill="${IVORY}" stroke="${NAVY}" stroke-width="8"/>`;
  s+=`<defs><clipPath id="bc"><circle cx="${BX}" cy="${BY}" r="${BR-6}"/></clipPath></defs><g clip-path="url(#bc)">`;
  // pouch
  s+=`<rect x="118" y="92" width="364" height="290" rx="22" fill="#e6ebf8" stroke="${NAVY}" stroke-width="6"/>`;
  const th=T.thick||0, el=mix('#a9c2ff',AMBER,th);
  s+=`<rect x="190" y="100" width="220" height="274" fill="${el}" opacity="${(0.55+0.35*th).toFixed(2)}"/>`;
  if(th>0.2)for(let k=0;k<4;k++){const yy=150+k*62;s+=`<path d="M200 ${yy} q20 ${10+4*Math.sin(f/20+k)} 50 0 t60 0 t60 0 t40 0" fill="none" stroke="#a8620c" stroke-width="4" opacity="${(0.6*th).toFixed(2)}"/>`;}
  // separator
  s+=`<path d="M300 104 V370" stroke="${NAVY}" stroke-width="3" stroke-dasharray="8 10" opacity=".55"/>`;
  // electrodes: graphite stripes (left), cobalt blocks (right)
  s+=`<rect x="128" y="100" width="62" height="274" fill="${GRAPH}" stroke="${NAVY}" stroke-width="5"/>`;
  for(let k=0;k<9;k++)s+=`<path d="M134 ${118+k*29} H184" stroke="#8b90a8" stroke-width="5"/>`;
  s+=`<rect x="410" y="100" width="62" height="274" fill="${BLUE}" stroke="${NAVY}" stroke-width="5"/>`;
  for(let k=0;k<6;k++)for(let j=0;j<2;j++)s+=`<rect x="${418+j*26}" y="${112+k*43}" width="20" height="32" rx="4" fill="#5a86ff"/>`;
  s+=ionsSVG(T,f)+snail(T,f);
  // terminals and power bolt at the top
  s+=`<rect x="146" y="62" width="26" height="34" rx="4" fill="${NAVY}"/><rect x="428" y="62" width="26" height="34" rx="4" fill="${NAVY}"/>`;
  s+=`</g>`;
  const pw=T.pw||0;
  if(pw>0.05){s+=`<g opacity="${pw.toFixed(2)}" transform="translate(${BX+150} ${BY-150}) rotate(18)"><path d="M6 -40 L-18 6 H0 L-8 40 L22 -8 H4 Z" fill="${YEL}" stroke="${NAVY}" stroke-width="5" stroke-linejoin="round"/></g>`;}
  s+=`</g></g>`;
  return s;
}
function dryer(T){
  const d=T.dry||0;if(d<0.02)return '';
  const x=T.px-170,y=T.py-90-(1-d)*40;
  let s=`<g opacity="${d.toFixed(2)}" transform="translate(${x} ${y}) rotate(-10)">`;
  s+=`<rect x="-6" y="18" width="30" height="78" rx="10" fill="${BLUE}" stroke="${NAVY}" stroke-width="6"/>`;
  s+=`<path d="M-50 -22 H56 Q70 -22 70 0 Q70 22 56 22 H-50 Q-64 22 -64 0 Q-64 -22 -50 -22 Z" fill="#ff8fb1" stroke="${NAVY}" stroke-width="6"/>`;
  s+=`<rect x="70" y="-14" width="22" height="28" rx="4" fill="${NAVY}"/>`;
  for(let k=0;k<3;k++)s+=`<path d="M100 ${-14+k*14} q12 -6 24 0 t24 0" fill="none" stroke="${AMBER}" stroke-width="4"/>`;
  return s+`</g>`;
}
function anchors(T){
  const x=T.px,y=T.py;
  return {phone:{x:x,y:y-100},screen:{x:x,y:y-120},battery:{x:x,y:y-60},
    anode:{x:159,y:300},cathode:{x:441,y:300},electrolyte:{x:300,y:190},ions:{x:250,y:250},syrup:{x:330,y:330},
    bolt:{x:BX+150,y:BY-150},snail:{x:170+(T.sn||0)*260,y:320},pocket:{x:705,y:380},dryer:{x:x-170,y:y-90},bub:{x:BX,y:BY}};}
window.PROPS={labelY:5000,
  draw(T,f){PROPS.labelY=5000;
    const svg=tint(T)+snow(T,f)+bubble(T,f)+dryer(T)+phone(T,f);
    return {svg,anchors:anchors(T)};},
  grip(T){return {x:T.px+6,y:T.py-40};}};
