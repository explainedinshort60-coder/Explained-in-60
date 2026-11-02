// Episode 006 props: a two-slot pop-up toaster on a kitchen counter, front view, with an x-ray shell.
// Inside: toast on a rack (carriage) tied to a slider on a guide rod, an extension spring pulling the slider up,
// an electromagnet at the bottom with a metal plate on the slider, glowing nichrome wires, a timer chip with a
// countdown ring, a darkness knob, and a cord to a wall outlet.
// Contract: window.PROPS = {draw(T,f)->{svg, anchors}, grip(T)->{x,y}, labelY}
// T: c (carriage 0 up .. 1 down), mag (magnet on 0..1), heat (0..1), tm (timer elapsed 0..1), ring (ring shown 0..1),
//    b (toast brown 0..1), knob (deg), xr (x-ray 0..1), ly (label world y), plug (0 in .. 1 out),
//    tx,ty,tr (toast launch offset and spin), head (toast on host head 0/1), g ('lever'|'none'), spark (0..1)
const ORANGE='#ff7a1a',GLOWC='#ffb347',METAL='#c7cfe6',CRUST='#9a5a2a',INS='#e6ebf8',WOOD='#dfe5f7';
const OX=-90,TX0=250,TX1=570,TY0=200,TY1=430,ROD=545,UPY=300,DNY=395;
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function mix(c1,c2,t){t=clamp(t,0,1);const p=c=>[1,3,5].map(i=>parseInt(c.substr(i,2),16));const A=p(c1),B=p(c2);return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('');}
function rackY(T){return UPY+(DNY-UPY)*(T.c||0);}
function bread(b){return b<0.5?mix('#fff1c9','#e8b06a',b*2):mix('#e8b06a','#8a4a1c',(b-0.5)*2);}
function toastShape(x,y,b,face){ // slice with a rounded top, bottom-centre at (x,y), 180 wide, 170 tall
  const fill=bread(b),cr=mix('#d9a05a',CRUST,b);
  let s=`<path d="M${x-90} ${y} V${y-120} Q${x-100} ${y-170} ${x-50} ${y-172} Q${x} ${y-182} ${x+50} ${y-172} Q${x+100} ${y-170} ${x+90} ${y-120} V${y} Z" fill="${cr}" stroke="${NAVY}" stroke-width="6" stroke-linejoin="round"/>`;
  s+=`<path d="M${x-76} ${y-10} V${y-118} Q${x-84} ${y-156} ${x-44} ${y-158} Q${x} ${y-166} ${x+44} ${y-158} Q${x+84} ${y-156} ${x+76} ${y-118} V${y-10} Z" fill="${fill}"/>`;
  if(face){s+=`<circle cx="${x-24}" cy="${y-96}" r="6" fill="${NAVY}"/><circle cx="${x+24}" cy="${y-96}" r="6" fill="${NAVY}"/><path d="M${x-16} ${y-70} Q${x} ${y-58} ${x+16} ${y-70}" fill="none" stroke="${NAVY}" stroke-width="5" stroke-linecap="round"/>`;}
  return s;
}
function counter(T){
  let s=`<rect x="-400" y="430" width="1040" height="34" rx="6" fill="${WOOD}" stroke="${NAVY}" stroke-width="6"/>`;
  s+=`<rect x="-380" y="464" width="1000" height="236" fill="${IVORY}" stroke="${NAVY}" stroke-width="6"/>`;
  for(const x of [-60,290])s+=`<rect x="${x}" y="490" width="300" height="186" rx="10" fill="none" stroke="${NAVY}" stroke-width="4"/><path d="M${x+130} 520 H${x+170}" stroke="${NAVY}" stroke-width="7" stroke-linecap="round"/>`;
  // backsplash outlet
  s+=`<rect x="-60" y="270" width="70" height="104" rx="10" fill="${IVORY}" stroke="${NAVY}" stroke-width="5"/>`;
  for(const y of [300,344])s+=`<path d="M-36 ${y-8} V${y+8} M-14 ${y-8} V${y+8}" stroke="${NAVY}" stroke-width="5"/>`;
  return s;
}
function cord(T){
  const p=T.plug||0,px=-20+p*110,py=344+p*66,rot=p*80;
  let s=`<path d="M${TX0+10} 420 C 120 432, 40 ${426}, ${px+20} ${py+ (p>0.5?0:30)} " fill="none" stroke="${NAVY}" stroke-width="7"/>`;
  s+=`<g transform="translate(${px} ${py}) rotate(${rot})"><rect x="-10" y="-22" width="40" height="44" rx="8" fill="${BLUE}" stroke="${NAVY}" stroke-width="5"/>`;
  if(p>0.05)s+=`<path d="M-10 -8 h-14 M-10 8 h-14" stroke="${NAVY}" stroke-width="5"/>`;
  s+=`</g>`;
  return s;
}
function wires(T,f){ // nichrome zigzags on both sides of each slice
  const h=T.heat||0,c=mix('#8b94b8',ORANGE,h);let s='';
  for(const x0 of [272,548-0]){}
  const zig=(x,y0,y1)=>{let d=`M${x} ${y0}`;for(let y=y0,i=0;y<y1;y+=14,i++)d+=` L${x+(i%2?-9:9)} ${y+7}`;return d+` L${x} ${y1}`;};
  for(const x of [292,528]){
    if(h>0.05)s+=`<path d="${zig(x,222,412)}" fill="none" stroke="${GLOWC}" stroke-width="16" opacity="${0.35*h}" stroke-linejoin="round"/>`;
    s+=`<path d="${zig(x,222,412)}" fill="none" stroke="${c}" stroke-width="5" stroke-linejoin="round"/>`;
  }
  return s;
}
function inner(T,f){
  const xr=T.xr||0;if(xr<0.02)return '';
  const ry=rackY(T),mag=T.mag||0,sp=T.spark||0;
  let s=`<g opacity="${xr.toFixed(3)}">`;
  s+=`<rect x="${TX0+18}" y="${TY0+14}" width="${TX1-TX0-36}" height="${TY1-TY0-28}" rx="20" fill="${INS}"/>`;
  s+=wires(T,f);
  // guide rod, spring (slider up to the top), electromagnet
  s+=`<path d="M${ROD} 214 V422" stroke="${NAVY}" stroke-width="6"/>`;
  const n=11;let d=`M${ROD} 218`;const hh=(ry-14-218)/n;for(let i=0;i<n;i++)d+=` L${ROD+(i%2?-13:13)} ${218+hh*(i+.5)}`;d+=` L${ROD} ${ry-14}`;
  s+=`<path d="${d}" fill="none" stroke="${NAVY}" stroke-width="5" stroke-linejoin="round"/>`;
  const mc=mix('#8b94b8',BLUE,mag);
  s+=`<rect x="${ROD-22}" y="402" width="44" height="24" rx="5" fill="${mc}" stroke="${NAVY}" stroke-width="5"/>`;
  for(let k=0;k<4;k++)s+=`<path d="M${ROD-16+k*10} 404 V424" stroke="${NAVY}" stroke-width="2.5" opacity=".6"/>`;
  if(mag>0.5)for(let k=0;k<3;k++){const a=(f*0.4+k*2.1);s+=`<path d="M${ROD-30-k*4} ${414} q-10 ${-8-Math.sin(a)*4} -20 0" fill="none" stroke="${BLUE}" stroke-width="4" opacity="${0.7*mag}"/><path d="M${ROD+30+k*4} ${414} q10 ${-8-Math.sin(a)*4} 20 0" fill="none" stroke="${BLUE}" stroke-width="4" opacity="${0.7*mag}"/>`;}
  // slider with the metal plate, rack under the slices
  s+=`<rect x="${ROD-16}" y="${ry-16}" width="32" height="18" rx="4" fill="${METAL}" stroke="${NAVY}" stroke-width="5"/>`;
  s+=`<rect x="${ROD-20}" y="${ry+1}" width="40" height="7" rx="2" fill="${NAVY}"/>`;
  s+=`<path d="M318 ${ry+2} H${ROD-16}" stroke="${NAVY}" stroke-width="7" stroke-linecap="round"/>`;
  // timer chip
  s+=`<rect x="276" y="362" width="74" height="50" rx="6" fill="#2f8f5b" stroke="${NAVY}" stroke-width="4"/><rect x="296" y="372" width="34" height="26" rx="3" fill="${NAVY}"/>`;
  for(let k=0;k<4;k++)s+=`<path d="M${299+k*9} 368 v4 M${299+k*9} 398 v4" stroke="${METAL}" stroke-width="3"/>`;
  if(sp>0.05)s+=`<path d="M${ROD-34} 396 l10 -12 l-2 10 l12 -8" fill="none" stroke="${WARM_}" stroke-width="5" opacity="${sp}"/>`;
  s+=`</g>`;
  return s;
}
const WARM_='#ffd84a';
function shell(T,f){
  const xr=T.xr||0,op=(1-0.78*xr).toFixed(2),dash=xr>0.05?'stroke-dasharray="18 12"':'';
  let s=`<rect x="${TX0+20}" y="${TY1-4}" width="34" height="14" rx="4" fill="${NAVY}"/><rect x="${TX1-54}" y="${TY1-4}" width="34" height="14" rx="4" fill="${NAVY}"/>`;
  s+=`<rect x="${TX0}" y="${TY0}" width="${TX1-TX0}" height="${TY1-TY0}" rx="46" fill="${BLUE}" fill-opacity="${op}" stroke="${NAVY}" stroke-width="7" ${dash}/>`;
  if(xr<0.6){s+=`<path d="M${TX0+30} ${TY0+40} Q${TX0+24} ${TY0+120} ${TX0+40} ${TY0+190}" stroke="#ffffff" stroke-width="10" fill="none" opacity="${0.5*(1-xr)}" stroke-linecap="round"/>`;}
  // darkness knob
  const ka=T.knob||0;
  s+=`<circle cx="470" cy="388" r="20" fill="${IVORY}" stroke="${NAVY}" stroke-width="5"/><path d="M470 388 L${470+15*Math.sin(ka*Math.PI/180)} ${388-15*Math.cos(ka*Math.PI/180)}" stroke="${NAVY}" stroke-width="5" stroke-linecap="round"/>`;
  for(let k=0;k<5;k++){const a=(-100+k*50)*Math.PI/180;s+=`<circle cx="${470+29*Math.sin(a)}" cy="${388-29*Math.cos(a)}" r="${2+k*0.7}" fill="${IVORY}" opacity="${(1-0.6*xr).toFixed(2)}"/>`;}
  // lever slot on the right face and the lever knob
  s+=`<rect x="${TX1-8}" y="${UPY-14}" width="12" height="${DNY-UPY+28}" rx="6" fill="${NAVY}"/>`;
  const ry=rackY(T);
  s+=`<rect x="${TX1-4}" y="${ry-12}" width="44" height="26" rx="12" fill="${IVORY}" stroke="${NAVY}" stroke-width="6"/>`;
  return s;
}
function slotTop(T){ // slot openings drawn over the toast so slices look like they sit inside
  let s=`<rect x="300" y="${TY0-6}" width="220" height="16" rx="8" fill="${NAVY}"/>`;
  const h=T.heat||0;
  if(h>0.05&&(T.c||0)>0.5)s+=`<ellipse cx="410" cy="${TY0}" rx="${110}" ry="${18+4*Math.sin((T.f||0)/3)}" fill="${GLOWC}" opacity="${0.45*h}"/>`;
  return s;
}
function toast(T,f){
  if(T.head)return '';
  const ry=rackY(T),x=410+(T.tx||0),y=ry+(T.ty||0),tr=T.tr||0;
  let s=`<g transform="rotate(${tr} ${x} ${y-85})">`+toastShape(x,y,T.b||0,(T.ty||0)<-40)+`</g>`;
  return s;
}
function headToast(T){
  if(!T.head)return '';
  return `<g transform="rotate(-8 720 0)">`+toastShape(720,84,T.b||0,true)+`</g>`;
}
function ceiling(T){ // only seen when the toast flies up
  let s=`<rect x="-600" y="-1400" width="1800" height="250" fill="${WOOD}"/><path d="M-600 -1150 H1200" stroke="${NAVY}" stroke-width="7"/>`;
  s+=`<path d="M560 -1150 V-1040" stroke="${NAVY}" stroke-width="5"/><path d="M510 -990 Q560 -1060 610 -990 Z" fill="${IVORY}" stroke="${NAVY}" stroke-width="6"/>`;
  return s;
}
function ring(T){
  const r=T.ring||0;if(r<0.02)return '';
  const cx=230,cy=40,R=58,a=clamp(T.tm||0,0,1)*2*Math.PI;
  let s=`<g opacity="${r}"><circle cx="${cx}" cy="${cy}" r="${R}" fill="${IVORY}" stroke="${NAVY}" stroke-width="7"/>`;
  if(a>0.01){const ex=cx+R*0.78*Math.sin(a),ey=cy-R*0.78*Math.cos(a),lg=a>Math.PI?1:0;
    s+= a>=2*Math.PI-0.001?`<circle cx="${cx}" cy="${cy}" r="${R*0.78}" fill="${ORANGE}"/>`:`<path d="M${cx} ${cy} L${cx} ${cy-R*0.78} A${R*0.78} ${R*0.78} 0 ${lg} 1 ${ex} ${ey} Z" fill="${ORANGE}"/>`;}
  s+=`<path d="M${cx} ${cy} L${cx+R*0.86*Math.sin(a)} ${cy-R*0.86*Math.cos(a)}" stroke="${NAVY}" stroke-width="6" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="7" fill="${NAVY}"/>`;
  s+=`<path d="M${cx} ${cy+R} Q 260 240 300 362" fill="none" stroke="${NAVY}" stroke-width="4" stroke-dasharray="10 8"/></g>`;
  return s;
}
function anchors(T){const ry=rackY(T);
  return {lever:{x:TX1+30,y:ry},rack:{x:440,y:ry+2},spring:{x:ROD+12,y:(218+ry)/2},magnet:{x:ROD,y:414},plate:{x:ROD,y:ry+4},
    wires:{x:292,y:300},wires2:{x:528,y:250},chip:{x:313,y:385},ring:{x:230,y:-10},knob:{x:470,y:388},toast:{x:410,y:ry-120},
    plug:{x:-20+(T.plug||0)*110,y:344+(T.plug||0)*66},slot:{x:410,y:TY0}};}
window.PROPS={labelY:5000,
  draw(T,f){PROPS.labelY=T.ly==null?5000:T.ly;T.f=f;
    const svg=`<g transform="translate(${OX} 0)">`+ceiling(T)+counter(T)+cord(T)+ring(T)+inner(T,f)+toast(T,f)+shell(T,f)+slotTop(T)+(T.ty<-40?toast(T,f):'')+`</g>`+headToast(T);
    const A=anchors(T);for(const k in A)A[k]={x:A[k].x+OX,y:A[k].y};
    return {svg,anchors:A};},
  grip(T){const ry=rackY(T);if(T.g=='none')return {x:600,y:ry};return {x:TX1+22+OX,y:ry-2};}};
