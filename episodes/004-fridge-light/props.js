// Episode 004 props: a kitchen fridge (front view, swinging door, x-ray door, warm interior light, fan, dancing milk carton)
// plus a TOP VIEW cutaway card of the door switch (door slab, plunger, spring, metal bridge, two contacts, wired bulb).
// Contract: window.PROPS = {draw(T,f)->{svg, anchors}, grip(T)->{x,y}, labelY}
// T: a (door 0 shut .. 1 open), hp (finger press 0..1), xr (x-ray door 0..1), fault (light stuck on 0..1),
//    hop (milk hop 0..1), fan (fan rotation deg), g ('handle'|'button'), card (show card 0..1)
const WARM='#ffd84a',GLOW='#fff1b8',METAL='#c7cfe6',INS='#dfe6fb';
const BY=340,FX0=220,FX1=580,FY0=110,FY1=690,HING=FX0;
const CXH=1420,CYH=200,PX=1790,TIP_OUT=146,TRAV=50;
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function mix(c1,c2,t){const p=c=>[1,3,5].map(i=>parseInt(c.substr(i,2),16));const A=p(c1),B=p(c2);return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('');}
function doorFaceY(a){const ph=a*45*Math.PI/180;return CYH-(PX-CXH)*Math.tan(ph);} // inner face y at the plunger x (top view)
function press(T){const pd=clamp((doorFaceY(T.a)-TIP_OUT)/TRAV,0,1);return Math.max(pd,T.hp||0);}
function light(T){const p=press(T);return Math.max(clamp((0.62-p)/0.12,0,1),T.fault||0);}
// ---------------- front view fridge ----------------
function interior(T,L){
  const back=mix('#2b3668',GLOW,L),side=mix('#222c5a','#f3e3a2',L),shelf=mix('#55608f',IVORY,L);
  let s=`<rect x="${FX0+18}" y="${FY0+18}" width="${FX1-FX0-36}" height="${FY1-FY0-36}" fill="${side}"/>`;
  s+=`<rect x="268" y="150" width="264" height="500" fill="${back}"/>`;
  s+=`<path d="M238 128 L268 150 M562 128 L532 150 M238 672 L268 650 M562 672 L532 650" stroke="${NAVY}" stroke-width="3" opacity=".35"/>`;
  // fan (back wall, top right)
  const fx=488,fy=196;
  s+=`<circle cx="${fx}" cy="${fy}" r="26" fill="${mix('#3a4677',IVORY,L)}" stroke="${NAVY}" stroke-width="4"/><g transform="rotate(${T.fan||0} ${fx} ${fy})">`;
  for(let k=0;k<3;k++)s+=`<path d="M${fx} ${fy} Q${fx+6} ${fy-20} ${fx+2} ${fy-23} Q${fx-10} ${fy-16} ${fx} ${fy} Z" transform="rotate(${k*120} ${fx} ${fy})" fill="${BLUE}" stroke="${NAVY}" stroke-width="2.5"/>`;
  s+=`</g><circle cx="${fx}" cy="${fy}" r="5" fill="${NAVY}"/>`;
  // bulb under a dome cover, top centre
  s+=`<path d="M372 150 Q372 182 400 182 Q428 182 428 150 Z" fill="${L>0.5?WARM:'#8b94b8'}" stroke="${NAVY}" stroke-width="4"/>`;
  // shelves and food
  const hop=T.hop||0;
  s+=`<rect x="300" y="${236-hop*6}" width="74" height="54" rx="8" fill="${BLUE}" stroke="${NAVY}" stroke-width="4"/><path d="M300 ${256-hop*6} H374" stroke="${IVORY}" stroke-width="5"/>`; // butter dish / box
  s+=`<ellipse cx="452" cy="${270+hop*2}" rx="34" ry="20" fill="${mix('#4b5a8e','#ffb3a0',L)}" stroke="${NAVY}" stroke-width="4"/>`; // leftovers bowl
  s+=`<path d="M248 300 H552" stroke="${shelf}" stroke-width="10"/><path d="M248 300 H552" stroke="${NAVY}" stroke-width="2" opacity=".4" transform="translate(0 6)"/>`;
  const my=-hop*34, mr=hop*(Math.sin((T.hopPh||0))*12);
  s+=`<g transform="translate(0 ${my}) rotate(${mr} 320 450)"><path d="M296 450 V378 L306 360 H334 L344 378 V450 Z" fill="${IVORY}" stroke="${NAVY}" stroke-width="5" stroke-linejoin="round"/><path d="M306 360 L320 348 L334 360" fill="${IVORY}" stroke="${NAVY}" stroke-width="5" stroke-linejoin="round"/><rect x="302" y="398" width="36" height="22" fill="${BLUE}"/><circle cx="312" cy="388" r="3" fill="${NAVY}"/><circle cx="328" cy="388" r="3" fill="${NAVY}"/></g>`;
  s+=`<rect x="400" y="${398-hop*10}" width="50" height="52" rx="10" fill="${mix('#3f6b4e','#9be0a8',L)}" stroke="${NAVY}" stroke-width="4"/><rect x="398" y="${388-hop*10}" width="54" height="14" rx="4" fill="${NAVY}"/>`; // jar
  s+=`<circle cx="490" cy="${430-hop*20}" r="20" fill="${mix('#7a2f3a','#ff6b6b',L)}" stroke="${NAVY}" stroke-width="4"/><path d="M490 ${410-hop*20} q3 -8 9 -9" stroke="${NAVY}" stroke-width="4" fill="none"/>`; // apple
  s+=`<path d="M248 452 H552" stroke="${shelf}" stroke-width="10"/>`;
  s+=`<rect x="262" y="540" width="276" height="112" rx="14" fill="${mix('#2e3a6c','#e9f0ff',L)}" fill-opacity=".85" stroke="${NAVY}" stroke-width="4"/><path d="M370 562 H430" stroke="${NAVY}" stroke-width="5" stroke-linecap="round"/>`;
  return s;
}
function body(T,L){
  let s=`<rect x="${FX0+14}" y="${FY1-4}" width="26" height="14" rx="3" fill="${NAVY}"/><rect x="${FX1-40}" y="${FY1-4}" width="26" height="14" rx="3" fill="${NAVY}"/>`;
  s+=`<rect x="${FX0}" y="${FY0}" width="${FX1-FX0}" height="${FY1-FY0}" rx="18" fill="${IVORY}" stroke="${NAVY}" stroke-width="7"/>`;
  s+=interior(T,L);
  s+=`<rect x="${FX0+18}" y="${FY0+18}" width="${FX1-FX0-36}" height="${FY1-FY0-36}" fill="none" stroke="${NAVY}" stroke-width="5"/>`;
  // door switch on the latch-side frame
  const p=press(T),bw=12-4*p,bh=22-8*p;
  s+=`<rect x="${571-bw/2-4}" y="${BY-bh/2-4}" width="${bw+8}" height="${bh+8}" rx="5" fill="${INS}" stroke="${NAVY}" stroke-width="3"/>`;
  s+=`<rect x="${571-bw/2}" y="${BY-bh/2}" width="${bw}" height="${bh}" rx="4" fill="${IVORY}" stroke="${NAVY}" stroke-width="3"/>`;
  return s;
}
function glow(T,L,open){
  if(L<0.02)return '';
  let s=`<defs><radialGradient id="gl"><stop offset="0" stop-color="${WARM}" stop-opacity=".55"/><stop offset="1" stop-color="${WARM}" stop-opacity="0"/></radialGradient><clipPath id="inr"><rect x="238" y="128" width="324" height="544"/></clipPath></defs>`;
  s+=`<circle cx="400" cy="170" r="${190}" fill="url(#gl)" opacity="${L}" clip-path="url(#inr)"/>`;
  if(open>0.02)s+=`<ellipse cx="${420+open*40}" cy="712" rx="${120+open*120}" ry="16" fill="${WARM}" opacity="${0.45*L*Math.min(1,open*2)}"/>`;
  return s;
}
function door(T){
  const th=T.a*80*Math.PI/180,w=(FX1-FX0)*Math.cos(th),dy=26*Math.sin(th),ex=HING+w,xr=T.xr||0;
  const op=(1-0.82*xr).toFixed(2),dash=xr>0.05?'stroke-dasharray="18 12"':'';
  let s=`<path d="M${HING} ${FY0} L${ex} ${FY0-dy} L${ex} ${FY1+dy} L${HING} ${FY1} Z" fill="${TINT}" fill-opacity="${op}" stroke="${NAVY}" stroke-width="7" stroke-linejoin="round" ${dash}/>`;
  const ew=22*Math.sin(th);
  if(ew>0.5)s+=`<path d="M${ex} ${FY0-dy} L${ex+ew} ${FY0-dy+6} L${ex+ew} ${FY1+dy-6} L${ex} ${FY1+dy} Z" fill="${IVORY}" stroke="${NAVY}" stroke-width="5" stroke-linejoin="round"/>`;
  const hx=HING+w-40*Math.cos(th),hw=Math.max(5,16*Math.cos(th));
  s+=`<rect x="${hx-hw/2}" y="${250-dy*0.3}" width="${hw}" height="${170+dy*0.6}" rx="${hw/2}" fill="${BLUE}" stroke="${NAVY}" stroke-width="5" opacity="${(1-0.6*xr).toFixed(2)}"/>`;
  return s;
}
// ---------------- top view cutaway card ----------------
function spring(x,y0,y1,n,amp){let d=`M${x} ${y0}`;const h=(y1-y0)/n;for(let i=0;i<n;i++){d+=` L${x+(i%2?-amp:amp)} ${y0+h*(i+.5)}`;}d+=` L${x} ${y1}`;return d;}
function card(T,f,L){
  if((T.card||0)<0.01)return '';
  const p=press(T),tip=TIP_OUT+TRAV*p,br=tip+146,closed=p<0.62,on=L>0.5;
  let s=`<g opacity="${T.card}"><clipPath id="cc"><rect x="1390" y="40" width="520" height="650" rx="28"/></clipPath>`;
  s+=`<rect x="1390" y="40" width="520" height="650" rx="28" fill="#fdfcf1" stroke="${NAVY}" stroke-width="8"/><g clip-path="url(#cc)">`;
  // fridge inside (left) and insulated side wall (right), front face at y=200
  s+=`<rect x="1390" y="200" width="310" height="490" fill="${mix('#2b3668',GLOW,L)}"/>`;
  s+=`<rect x="1700" y="200" width="210" height="490" fill="${INS}"/>`;
  for(let k=0;k<7;k++)s+=`<path d="M${1700+k*34} 690 L${1700+k*34+60} 200" stroke="${NAVY}" stroke-width="2" opacity=".12"/>`;
  s+=`<path d="M1390 200 H1910" stroke="${NAVY}" stroke-width="6"/><path d="M1700 200 V690" stroke="${NAVY}" stroke-width="5"/>`;
  // wires: left contact -> bulb -> bottom -> right side -> right contact
  const wc=closed?BLUE:NAVY,wo=closed?1:.45,off=(-f*3)%40;
  const wire=`M1756 286 H1720 V430 H1584 M1550 466 V630 H1868 V286 H1824`;
  s+=`<path d="${wire}" fill="none" stroke="${wc}" stroke-width="7" stroke-linejoin="round" opacity="${wo}"/>`;
  if(closed)s+=`<path d="${wire}" fill="none" stroke="${WARM}" stroke-width="4" stroke-dasharray="10 30" stroke-dashoffset="${off}" stroke-linecap="round"/>`;
  // bulb
  if(on)s+=`<circle cx="1550" cy="430" r="90" fill="${WARM}" opacity="${0.35*L}"/>`;
  s+=`<circle cx="1550" cy="422" r="36" fill="${on?WARM:'#8b94b8'}" stroke="${NAVY}" stroke-width="6"/><rect x="1534" y="452" width="32" height="20" rx="4" fill="${METAL}" stroke="${NAVY}" stroke-width="5"/>`;
  s+=`<path d="M1538 426 q6 -14 12 0 q6 14 12 0" fill="none" stroke="${NAVY}" stroke-width="4"/>`;
  // switch housing (cut open)
  s+=`<rect x="1750" y="208" width="80" height="272" rx="8" fill="${IVORY}" stroke="${NAVY}" stroke-width="5"/>`;
  s+=`<path d="${spring(PX,br+12,470,10,22)}" fill="none" stroke="${NAVY}" stroke-width="5" stroke-linejoin="round"/>`;
  s+=`<rect x="1777" y="${tip+20}" width="26" height="${br-tip-18}" fill="${BLUE}" stroke="${NAVY}" stroke-width="4"/>`;
  s+=`<path d="M1773 ${tip+34} V${tip+12} Q1773 ${tip} 1790 ${tip} Q1807 ${tip} 1807 ${tip+12} V${tip+34} Z" fill="${BLUE}" stroke="${NAVY}" stroke-width="5"/>`;
  s+=`<rect x="1753" y="${br}" width="74" height="12" rx="3" fill="${METAL}" stroke="${NAVY}" stroke-width="4"/>`;
  for(const cx of [1764,1816])s+=`<rect x="${cx-9}" y="276" width="18" height="16" rx="2" fill="${closed?WARM:METAL}" stroke="${NAVY}" stroke-width="4"/>`;
  if(closed&&on)for(const cx of [1764,1816])s+=`<circle cx="${cx}" cy="292" r="${9+Math.sin(f/2)*2}" fill="none" stroke="${WARM}" stroke-width="4"/>`;
  // door slab, hinged at the left, swings up (open) in top view
  const ang=-T.a*45;
  s+=`<g transform="rotate(${ang} ${CXH} ${CYH})"><rect x="${CXH}" y="${CYH-74}" width="490" height="74" rx="10" fill="${TINT}" stroke="${NAVY}" stroke-width="7"/>`;
  s+=`<rect x="${CXH+6}" y="${CYH-12}" width="478" height="10" rx="4" fill="${IVORY}" stroke="${NAVY}" stroke-width="3"/>`;
  s+=`<rect x="${CXH+400}" y="${CYH-100}" width="60" height="22" rx="10" fill="${BLUE}" stroke="${NAVY}" stroke-width="5"/></g>`;
  s+=`<circle cx="${CXH}" cy="${CYH}" r="9" fill="${NAVY}"/>`;
  s+=`</g></g>`;
  return s;
}
function anchors(T){const p=press(T),tip=TIP_OUT+TRAV*p,br=tip+146,th=T.a*80*Math.PI/180;
  return {button:{x:571,y:BY},bulb:{x:400,y:168},fan:{x:488,y:196},inside:{x:400,y:380},doorfront:{x:FX0+(FX1-FX0)*Math.cos(th)*0.5,y:520},
    plunger:{x:PX,y:tip+14},spring:{x:PX+12,y:(br+470)/2},contacts:{x:1764,y:284},bridge:{x:1820,y:br+6},cbulb:{x:1550,y:422},slab:{x:1600,y:doorFaceY(T.a)-30},
    gap:{x:1790,y:292}};}
window.PROPS={labelY:90,
  draw(T,f){const L=light(T),th=T.a*80*Math.PI/180;
    const svg=body(T,L)+glow(T,L,T.a)+door(T)+card(T,f,L);return {svg,anchors:anchors(T)};},
  grip(T){if(T.g=='button')return {x:578+(1-(T.hp||0))*14,y:BY+6};const th=T.a*80*Math.PI/180;return {x:HING+(FX1-FX0)*Math.cos(th)-40*Math.cos(th)+6,y:345};}};
