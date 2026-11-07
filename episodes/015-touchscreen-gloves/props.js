// Episode 015 props: why your touchscreen ignores you when you wear gloves (flat diagram, generic phone, no brand).
// Scenes in one world, the camera cuts between them:
//  H (x ~520):  hook: a cold night bus stop, a phone ringing (MOM), a red knit glove jabbing the answer button, nothing happens
//  P (x ~2950): the phone up close: x-ray reveals the wire grid under the glass, yellow charge sparks along it;
//               a hand (bare, glove, sausage held by a glove, touchscreen glove) touches; the dip ring = a tap (or a red X)
//  Z (x ~5000): cross-section macro: finger over glass over the wire layer; charge hops up into the bare finger,
//               bounces off the knit glove, runs up the silver thread of a touchscreen glove
//  I (x ~7000): close-up of a touchscreen glove: silver thread patches on the index and thumb tips
// T: tap 0..1 hook jab (cycled), xray 0..1, spark 0..1, hand 0 none / 1 bare / 2 glove / 3 sausage / 4 thread glove,
//    reach 0..1, dip 0..1, ok 0..1, fail 0..1, ghost 0..1, zmode 0 bare / 1 glove / 2 thread, press 0..1, flow 0..1, block 0..1, zok 0..1, zx 0..1, shine 0..1
const F='font-family="DejaVu Sans, sans-serif"', RED='#e8273a', GREEN='#1fae5b', GOLD='#ffd84a', CYAN='#31c8ff';
const SKIN='#f5c9a3', SKIN2='#e2a984', KNIT='#d6343c', KNIT2='#a8222c', SILVER='#cfd6e0';
function rnd(i){const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);}
function cl(x){return Math.max(0,Math.min(1,x));}
function spark(x,y,r,o){return `<g opacity="${o}"><circle cx="${x}" cy="${y}" r="${r*1.9}" fill="${GOLD}" opacity=".35"/><circle cx="${x}" cy="${y}" r="${r}" fill="${GOLD}" stroke="#b8860b" stroke-width="2"/></g>`;}
function check(x,y,s,o){return `<g transform="translate(${x} ${y}) scale(${s})" opacity="${o}"><circle r="62" fill="${GREEN}" stroke="${NAVY}" stroke-width="7"/><path d="M-28 2 L-6 24 L30 -22" fill="none" stroke="${IVORY}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/></g>`;}
function xmark(x,y,s,o){return `<g transform="translate(${x} ${y}) scale(${s})" opacity="${o}"><circle r="62" fill="${RED}" stroke="${NAVY}" stroke-width="7"/><path d="M-24 -24 L24 24 M24 -24 L-24 24" stroke="${IVORY}" stroke-width="13" stroke-linecap="round"/></g>`;}
// knit texture: rows of little v stitches inside a clip
function knitRows(x0,y0,x1,y1,col){let s='';for(let y=y0;y<y1;y+=26)for(let x=x0+((y/26)%2)*14;x<x1;x+=28)s+=`<path d="M${x-9} ${y-7} L${x} ${y+5} L${x+9} ${y-7}" fill="none" stroke="${col}" stroke-width="4" stroke-linecap="round" opacity=".75"/>`;return s;}
// a hand reaching up-left; (tx,ty) is the fingertip. type 1 bare, 2 glove, 3 sausage in a glove fist, 4 touchscreen glove
function hand(tx,ty,type,o,id){
  const fill=type==1?SKIN:KNIT, ln=NAVY;
  let s=`<g opacity="${o}" transform="translate(${tx} ${ty}) rotate(-38)">`;
  if(type==3){ // sausage held in a gloved fist
    s+=`<rect x="-30" y="-6" width="60" height="300" rx="30" fill="#c8564a" stroke="${ln}" stroke-width="7"/>`;
    s+=`<path d="M-14 40 Q0 50 14 40 M-14 110 Q0 120 14 110" fill="none" stroke="#e98a77" stroke-width="6" stroke-linecap="round"/>`;
    s+=`<ellipse cx="6" cy="330" rx="120" ry="100" fill="${KNIT}" stroke="${ln}" stroke-width="8"/>`;
    for(let k=0;k<4;k++)s+=`<path d="M${-70+k*42} 262 Q${-50+k*42} 240 ${-30+k*42} 262" fill="${KNIT}" stroke="${ln}" stroke-width="6"/>`;
    s+=`<rect x="-80" y="410" width="180" height="300" fill="${KNIT2}" stroke="${ln}" stroke-width="8"/>`;
    for(let k=0;k<6;k++)s+=`<line x1="${-60+k*30}" y1="420" x2="${-60+k*30}" y2="700" stroke="${KNIT}" stroke-width="7"/>`;
    return s+`</g>`;
  }
  // index finger
  s+=`<rect x="-34" y="0" width="68" height="250" rx="34" fill="${fill}" stroke="${ln}" stroke-width="7"/>`;
  if(type==1)s+=`<path d="M-14 26 Q0 18 14 26" fill="none" stroke="${SKIN2}" stroke-width="5" stroke-linecap="round"/>`;
  if(type==2||type==4)s+=`<clipPath id="kc${id}"><rect x="-34" y="0" width="68" height="250" rx="34"/></clipPath><g clip-path="url(#kc${id})">${knitRows(-40,10,40,250,KNIT2)}</g>`;
  if(type==4)s+=`<rect x="-30" y="2" width="60" height="62" rx="28" fill="${SILVER}" stroke="${ln}" stroke-width="5"/><path d="M-20 14 L20 54 M-20 34 L8 62 M-6 6 L22 34 M20 14 L-20 54 M20 34 L-8 62 M6 6 L-22 34" stroke="#8b96a8" stroke-width="3"/>`;
  // fist
  s+=`<ellipse cx="22" cy="300" rx="120" ry="104" fill="${fill}" stroke="${ln}" stroke-width="8"/>`;
  for(let k=0;k<3;k++)s+=`<path d="M${30+k*36} 222 Q${48+k*36} 206 ${66+k*36} 226" fill="${fill}" stroke="${ln}" stroke-width="6"/>`;
  if(type!=1)s+=`<clipPath id="fc${id}"><ellipse cx="22" cy="300" rx="116" ry="100"/></clipPath><g clip-path="url(#fc${id})">${knitRows(-100,200,140,410,KNIT2)}</g>`;
  // wrist or cuff
  if(type==1)s+=`<rect x="-62" y="380" width="160" height="320" fill="${SKIN}" stroke="${ln}" stroke-width="8"/><rect x="-74" y="520" width="184" height="200" fill="${BLUE}" stroke="${ln}" stroke-width="8"/>`;
  else{s+=`<rect x="-70" y="380" width="176" height="320" fill="${KNIT2}" stroke="${ln}" stroke-width="8"/>`;for(let k=0;k<6;k++)s+=`<line x1="${-50+k*30}" y1="390" x2="${-50+k*30}" y2="690" stroke="${KNIT}" stroke-width="7"/>`;}
  return s+`</g>`;
}
function snow(x0,x1,y0,y1,f,n){let s='';for(let i=0;i<n;i++){const x=x0+rnd(i)*(x1-x0)+Math.sin(f*0.05+i)*14, y=y0+((rnd(i+50)*(y1-y0)+f*(2+rnd(i+9)*2))%(y1-y0));s+=`<circle cx="${x}" cy="${y}" r="${5+rnd(i+3)*6}" fill="#ffffff" opacity=".85"/>`;}return s;}
// --- H: the hook
function hook(T,f){
  let s=`<rect x="-1500" y="-2000" width="3500" height="4400" fill="#2b3a70"/>`;
  s+=`<rect x="-1500" y="930" width="3500" height="1200" fill="#e9eefc"/><line x1="-1500" y1="930" x2="2000" y2="930" stroke="${NAVY}" stroke-width="6"/>`;
  // bus stop sign
  s+=`<rect x="70" y="80" width="18" height="860" fill="#9fb0d8" stroke="${NAVY}" stroke-width="5"/><rect x="-10" y="40" width="180" height="120" rx="14" fill="${IVORY}" stroke="${NAVY}" stroke-width="6"/><text x="80" y="118" font-size="52" font-weight="900" fill="${NAVY}" text-anchor="middle" ${F}>BUS</text>`;
  s+=snow(-200,1300,-400,1200,f,46);
  // phone, buzzing
  const bz=Math.sin(f*1.7)*4, PX=540+bz, PY=430;
  s+=`<g transform="rotate(${Math.sin(f*1.3)*1.2} ${PX} ${PY})">`;
  s+=`<rect x="${PX-240}" y="${PY-480}" width="480" height="960" rx="64" fill="${NAVY}" stroke="#0a0f24" stroke-width="6"/>`;
  s+=`<rect x="${PX-214}" y="${PY-450}" width="428" height="900" rx="44" fill="#1d2d63"/>`;
  s+=`<circle cx="${PX}" cy="${PY-200}" r="96" fill="${IVORY}" stroke="${NAVY}" stroke-width="6"/><circle cx="${PX}" cy="${PY-226}" r="34" fill="#9fb9ff"/><path d="M${PX-56} ${PY-148} Q${PX} ${PY-210} ${PX+56} ${PY-148}" fill="#9fb9ff"/>`;
  s+=`<text x="${PX}" y="${PY-30}" font-size="84" font-weight="900" fill="${IVORY}" text-anchor="middle" ${F}>MOM</text>`;
  s+=`<text x="${PX}" y="${PY+30}" font-size="34" font-weight="700" fill="#9fb9ff" text-anchor="middle" ${F}>incoming call</text>`;
  const pulse=1+0.06*Math.sin(f*0.5);
  s+=`<circle cx="${PX}" cy="${PY+300}" r="${78*pulse}" fill="${GREEN}" stroke="${NAVY}" stroke-width="6"/>`;
  s+=`<path d="M${PX-28} ${PY+282} q8 -14 18 -4 l10 12 q4 8 -4 14 q10 22 30 30 q6 -8 14 -4 l12 10 q10 10 -4 18 q-40 10 -72 -40 q-12 -24 -4 -36z" fill="${IVORY}"/>`;
  s+=`</g>`;
  // buzz marks
  for(const sd of [-1,1])s+=`<path d="M${PX+sd*270} ${PY-80} q${sd*22} 40 0 80 M${PX+sd*300} ${PY-110} q${sd*30} 70 0 140" fill="none" stroke="${GOLD}" stroke-width="8" stroke-linecap="round" opacity="${0.5+0.5*Math.sin(f*0.9)}"/>`;
  // the gloved jab: tap cycle 0..1 (1 = touching)
  const tp=T.tap||0, tx=PX+18+(1-tp)*70, ty=PY+300+(1-tp)*80;
  s+=hand(tx,ty,2,1,'h');
  if(tp>0.9){const w=Math.floor(f/22)%2; s+=`<text x="${w?PX-150:PX+170}" y="${PY+160}" font-size="64" font-weight="900" fill="${IVORY}" stroke="${NAVY}" stroke-width="10" paint-order="stroke" text-anchor="middle" transform="rotate(${w?-10:10} ${w?PX-150:PX+170} ${PY+160})" ${F}>TAP</text>`;}
  s+=`<text x="${PX-310}" y="${PY+380}" font-size="120" font-weight="900" fill="${RED}" stroke="${NAVY}" stroke-width="8" paint-order="stroke" text-anchor="middle" ${F} opacity="${f>40?1:0}">?</text>`;
  return s;
}
// --- P: the phone up close
const PX=2950, PY=420, TPX=2990, TPY=520;
function phone(T,f){
  let s=`<rect x="2350" y="-2000" width="1300" height="4400" fill="#dfe7fb"/>`;
  s+=`<rect x="2350" y="980" width="1300" height="1200" fill="#c9d4f2"/>`;
  s+=`<rect x="${PX-260}" y="${PY-520}" width="520" height="1040" rx="70" fill="${NAVY}" stroke="#0a0f24" stroke-width="6"/>`;
  const sx0=PX-232, sy0=PY-490, sw=464, sh=980;
  s+=`<rect x="${sx0}" y="${sy0}" width="${sw}" height="${sh}" rx="48" fill="#eef2fb"/>`;
  // generic app tiles (no logos)
  const xr=T.xray||0;
  const cols=['#2465ff','#ff8a3d','#1fae5b','#e8273a','#8a5cf6','#ffd84a','#31c8ff','#ff6fa8'];
  s+=`<g opacity="${1-0.75*xr}">`;
  for(let r=0;r<5;r++)for(let c=0;c<4;c++){const i=r*4+c;s+=`<rect x="${sx0+34+c*106}" y="${sy0+90+r*130}" width="80" height="80" rx="22" fill="${cols[i%8]}" stroke="${NAVY}" stroke-width="4"/>`;}
  s+=`<text x="${PX}" y="${sy0+62}" font-size="34" font-weight="800" fill="${NAVY}" text-anchor="middle" ${F}>9:41</text></g>`;
  // x-ray: the wire grid under the glass
  if(xr>0){
    s+=`<rect x="${sx0}" y="${sy0}" width="${sw}" height="${sh}" rx="48" fill="#0e1d4d" opacity="${0.85*xr}"/>`;
    const dip=T.dip||0;
    for(let k=0;k<12;k++){const y=sy0+40+k*82, hot=dip>0&&Math.abs(y-TPY)<41; s+=`<line x1="${sx0+12}" y1="${y}" x2="${sx0+sw-12}" y2="${y}" stroke="${hot?GOLD:CYAN}" stroke-width="${hot?10:5}" opacity="${xr*(hot?1:0.8)}"/>`;}
    for(let k=0;k<6;k++){const x=sx0+42+k*76, hot=dip>0&&Math.abs(x-TPX)<38; s+=`<line x1="${x}" y1="${sy0+12}" x2="${x}" y2="${sy0+sh-12}" stroke="${hot?GOLD:CYAN}" stroke-width="${hot?10:5}" opacity="${xr*(hot?1:0.8)}"/>`;}
    const sp=T.spark||0;
    if(sp>0)for(let i=0;i<34;i++){
      let x,y; const u=((f*0.012+rnd(i))%1);
      if(i%2){const k=i%12; y=sy0+40+k*82; x=sx0+12+u*(sw-24);} else {const k=i%6; x=sx0+42+k*76; y=sy0+12+u*(sh-24);}
      const dd=Math.hypot(x-TPX,y-TPY); let o=sp;
      if(dip>0&&dd<230){const m=dip; x=x+(TPX-x)*m; y=y+(TPY-y)*m; o=sp*(1-m*0.9);}
      s+=spark(x,y,9,o);
    }
    if(dip>0){for(let r=0;r<3;r++){const q=((dip*1.4+r*0.33)%1);s+=`<circle cx="${TPX}" cy="${TPY}" r="${30+q*150}" fill="none" stroke="${GOLD}" stroke-width="8" opacity="${(1-q)*Math.min(1,dip*3)}"/>`;}}
  }
  // glass sheen
  s+=`<path d="M${sx0+40} ${sy0+40} L${sx0+180} ${sy0+40} L${sx0+40} ${sy0+300} Z" fill="#ffffff" opacity=".18"/>`;
  const hd=T.hand||0;
  if(hd){const rc=T.reach||0, gh=T.ghost||0; const tx=TPX+(1-rc)*420, ty=TPY+(1-rc)*520;
    s+=hand(tx,ty,hd,1-0.65*gh,'p');
    if(gh>0)s+=`<g opacity="${gh}" transform="translate(${tx} ${ty}) rotate(-38)"><rect x="-44" y="-10" width="88" height="270" rx="44" fill="none" stroke="${IVORY}" stroke-width="6" stroke-dasharray="14 12"/><ellipse cx="22" cy="300" rx="132" ry="116" fill="none" stroke="${IVORY}" stroke-width="6" stroke-dasharray="14 12"/></g>`;}
  const ok=T.ok||0, fl=T.fail||0;
  if(ok>0)s+=check(TPX-150,TPY-150,0.6+0.4*Math.min(1,ok*2),Math.min(1,ok*3))+`<text x="${TPX-150}" y="${TPY-240}" font-size="58" font-weight="900" fill="${IVORY}" stroke="${NAVY}" stroke-width="10" paint-order="stroke" text-anchor="middle" opacity="${Math.min(1,ok*3)}" ${F}>TAP!</text>`;
  if(fl>0)s+=xmark(TPX-150,TPY-150,0.6+0.4*Math.min(1,fl*2),Math.min(1,fl*3));
  return s;
}
// --- Z: the cross-section macro
const ZX=5000, GT=470;
function section(T,f){
  let s=`<rect x="4350" y="-2000" width="1300" height="4400" fill="#eef3ff"/>`;
  const zm=T.zmode||0, pr=T.press||0;
  // display, wire layer, glass
  s+=`<rect x="4520" y="660" width="960" height="150" fill="${NAVY}"/>`;
  for(let i=0;i<24;i++)s+=`<rect x="${4536+i*40}" y="690" width="26" height="26" rx="5" fill="${['#e8273a','#1fae5b','#2465ff'][i%3]}" opacity=".85"/>`;
  s+=`<text x="5000" y="780" font-size="34" font-weight="800" fill="#9fb9ff" text-anchor="middle" ${F}>SCREEN</text>`;
  for(let i=0;i<9;i++)s+=`<rect x="${4560+i*110}" y="610" width="70" height="30" rx="8" fill="${CYAN}" stroke="${NAVY}" stroke-width="4"/>`;
  s+=`<rect x="4520" y="${GT}" width="960" height="130" fill="#bfe3ff" opacity=".7" stroke="${NAVY}" stroke-width="6"/>`;
  s+=`<text x="4610" y="${GT+80}" font-size="34" font-weight="800" fill="${NAVY}" opacity=".55" ${F}>GLASS</text>`;
  // finger from above
  const tip=GT-(1-pr)*260;
  if(zm==0){
    s+=`<path d="M${ZX-150} ${tip-900} L${ZX-150} ${tip-150} A150 150 0 0 0 ${ZX+150} ${tip-150} L${ZX+150} ${tip-900} Z" fill="${SKIN}" stroke="${NAVY}" stroke-width="8"/>`;
    for(let k=0;k<3;k++)s+=`<path d="M${ZX-100+k*20} ${tip-70-k*26} Q${ZX} ${tip-20-k*26} ${ZX+100-k*20} ${tip-70-k*26}" fill="none" stroke="${SKIN2}" stroke-width="6" stroke-linecap="round"/>`;
  } else {
    s+=`<path d="M${ZX-190} ${tip-900} L${ZX-190} ${tip-190} A190 190 0 0 0 ${ZX+190} ${tip-190} L${ZX+190} ${tip-900} Z" fill="${KNIT}" stroke="${NAVY}" stroke-width="8"/>`;
    s+=`<clipPath id="zk"><path d="M${ZX-190} ${tip-900} L${ZX-190} ${tip-190} A190 190 0 0 0 ${ZX+190} ${tip-190} L${ZX+190} ${tip-900} Z"/></clipPath><g clip-path="url(#zk)">${knitRows(ZX-200,tip-900,ZX+200,tip+10,KNIT2)}</g>`;
    s+=`<path d="M${ZX-130} ${tip-900} L${ZX-130} ${tip-210} A130 130 0 0 0 ${ZX+130} ${tip-210} L${ZX+130} ${tip-900} Z" fill="${SKIN}" stroke="${NAVY}" stroke-width="7"/>`;
    if(zm==2)for(let k=0;k<7;k++){const x=ZX-150+k*50, y1=tip-14-Math.pow(Math.abs(k-3),2)*9; s+=`<path d="M${x} ${y1} L${x} ${y1-120}" stroke="${NAVY}" stroke-width="28" stroke-linecap="round"/><path d="M${x} ${y1} L${x} ${y1-120}" stroke="${SILVER}" stroke-width="20" stroke-linecap="round"/><path d="M${x} ${y1} L${x} ${y1-120}" stroke="#8b96a8" stroke-width="4" stroke-dasharray="10 10"/>`;}
  }
  // charge on the wires, flows up when the finger touches
  const fw=T.flow||0, bl=T.block||0;
  for(let i=0;i<9;i++){const ex=4595+i*110, near=Math.abs(ex-ZX)<190;
    for(let j=0;j<2;j++){const jx=ex+(j?16:-16)+Math.sin(f*0.3+i+j)*6, jy=600+Math.cos(f*0.25+i*2+j)*6;
      if(near&&fw>0){const q=((f*0.03+j*0.5+i*0.17)%1); let x=jx+(ZX-jx)*q*0.5, y=jy-(jy-(tip-(zm==2?120:110)))*q; s+=spark(x,y,11,Math.min(1,fw*2)*(1-q*0.6));}
      else if(near&&bl>0){const q=((f*0.035+j*0.5+i*0.21)%1), up=q<0.5?q*2:2-q*2; s+=spark(jx,jy-(jy-GT-10)*up,11,1);}
      else s+=spark(jx,jy,10,1);
    }}
  if(T.zok)s+=check(ZX+300,GT-260,0.8,Math.min(1,T.zok*3));
  if(T.zx)s+=xmark(ZX+300,GT-260,0.8,Math.min(1,T.zx*3));
  return s;
}
// --- I: touchscreen glove close-up
function gloveUp(T,f){
  let s=`<rect x="6350" y="-2000" width="1300" height="4400" fill="#f6efe6"/>`;
  const cx=7000, cy=520;
  s+=`<clipPath id="gk"><path id="gp" d=""/></clipPath>`;
  const fingers=[[-150,-330,-8],[-55,-390,-2],[45,-380,3],[140,-310,9]];
  let shape='';
  for(const [dx,dy,r] of fingers)shape+=`<rect x="${cx+dx-44}" y="${cy+dy}" width="88" height="${-dy+40}" rx="44" transform="rotate(${r} ${cx+dx} ${cy})"/>`;
  shape+=`<rect x="${cx-205}" y="${cy-60}" width="400" height="340" rx="120"/>`;
  s+=`<path d="M${cx-150} ${cy+150} L${cx-330} ${cy-10}" stroke="${NAVY}" stroke-width="104" stroke-linecap="round"/><path d="M${cx-150} ${cy+150} L${cx-330} ${cy-10}" stroke="${KNIT}" stroke-width="88" stroke-linecap="round"/>`;
  s+=`<g fill="${KNIT}" stroke="${NAVY}" stroke-width="8">${shape}</g>`;
  s+=`<clipPath id="gc">${shape}</clipPath><g clip-path="url(#gc)">${knitRows(cx-420,cy-420,cx+260,cy+300,KNIT2)}</g>`;
  s+=`<rect x="${cx-215}" y="${cy+250}" width="420" height="220" fill="${KNIT2}" stroke="${NAVY}" stroke-width="8"/>`;
  for(let k=0;k<13;k++)s+=`<line x1="${cx-200+k*32}" y1="${cy+260}" x2="${cx-200+k*32}" y2="${cy+460}" stroke="${KNIT}" stroke-width="8"/>`;
  // silver thread patches: index tip and thumb tip
  const sh=T.shine||0;
  const pads=[[cx-55-9-30,cy-376,-2],[cx-378,cy-50,-48]];
  for(const [x,y,r] of pads){
    s+=`<g transform="rotate(${r} ${x+44} ${y+30})"><rect x="${x+4}" y="${y-6}" width="80" height="78" rx="34" fill="${SILVER}" stroke="${NAVY}" stroke-width="5"/>`;
    for(let k=0;k<5;k++)s+=`<path d="M${x+10+k*16} ${y} L${x+10+k*16} ${y+66}" stroke="#8b96a8" stroke-width="4" stroke-dasharray="7 6"/>`;
    s+=`</g>`;
    const tw=Math.max(0,Math.sin(f*0.25+x))*sh;
    s+=`<path d="M${x+60} ${y-40} l8 22 l22 8 l-22 8 l-8 22 l-8 -22 l-22 -8 l22 -8z" fill="#ffffff" stroke="${NAVY}" stroke-width="3" opacity="${tw}"/>`;
  }
  return s;
}
function anchors(T){
  return {phoneH:{x:540,y:430},grid:{x:2830,y:220},charge:{x:2832,y:296},dip:{x:TPX,y:TPY},glove:{x:TPX+60,y:TPY+80},
    sausage:{x:TPX+40,y:TPY+60},finger:{x:ZX-60,y:180},flow:{x:ZX,y:GT+60},knit:{x:ZX-150,y:GT-60},thread:{x:ZX-50,y:GT-60},
    patch:{x:6946,y:160},thumb:{x:6670,y:-10}};
}
window.PROPS={labelY:90,
  draw(T,f){return {svg:hook(T,f)+phone(T,f)+section(T,f)+gloveUp(T,f),anchors:anchors(T)};},
  grip(T){return {x:540,y:430};}};
