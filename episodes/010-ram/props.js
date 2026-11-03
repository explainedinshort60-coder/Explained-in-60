// Episode 010 props: a desk with a monitor and a PC tower, a wall socket and a power cord (the plug can be held by
// the host), a floating RAM stick, and a separate "inside the chip" world zone with a 4x3 grid of DRAM cells:
// word lines, bit lines, a transistor gate per cell and a capacitor drawn as a leaky water bucket.
// Gag props: a leaky bucket on the desk and a watering can held by the host. Plus a refill counter.
// Contract: window.PROPS = {draw(T,f)->{svg, anchors}, grip(T)->{x,y}, labelY}
// T: on (screen 0..1), gl (glitch 0..1), plx,ply (plug position), spark (0..1), stk (RAM stick 0..1),
//    lv[12] (bucket levels), leak (0..1 drips), sw (refresh bar column float, <0 hidden), gate (0..1 all gates glow),
//    rd (read cell index or -1), rdf (read flow 0..1), cnt (counter value), cntOn (0/1), dead (0..1 grid power off),
//    gb (gag bucket 0..1), gbl (gag bucket level), pour (0..1), can (0/1 watering can in hand), pud (puddle 0..1),
//    gx,gy (hand grip point)
const GREEN='#2f9e5b',GOLD='#e2b33c',RED='#ff4d4d',CHIP='#1d2233',WAT='#7da0ff';
const BITS=[1,0,1,1, 0,1,1,0, 1,1,0,1];
const GX=1560,GY=60,CW=190,RH=220;
const SOCK={x:612,y:612},TOWER={x:430,y:500,w:110,h:200};
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function fr(x){return x-Math.floor(x);}
function fmt(n){return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g,',');}
// ---------- desk zone ----------
function desk(T,f){
  let s='';
  // wall socket
  s+=`<rect x="${SOCK.x-26}" y="${SOCK.y-40}" width="52" height="80" rx="10" fill="${IVORY}" stroke="${NAVY}" stroke-width="5"/>`;
  s+=`<rect x="${SOCK.x-11}" y="${SOCK.y-22}" width="6" height="16" rx="2" fill="${NAVY}"/><rect x="${SOCK.x+5}" y="${SOCK.y-22}" width="6" height="16" rx="2" fill="${NAVY}"/><circle cx="${SOCK.x}" cy="${SOCK.y+16}" r="5" fill="${NAVY}"/>`;
  // desk
  s+=`<rect x="130" y="470" width="440" height="26" rx="6" fill="${BLUE}" stroke="${NAVY}" stroke-width="6"/>`;
  s+=`<rect x="150" y="496" width="20" height="204" fill="${NAVY}"/><rect x="530" y="496" width="20" height="204" fill="${NAVY}"/>`;
  // tower under the desk
  const t=TOWER;
  s+=`<rect x="${t.x-t.w/2}" y="${t.y}" width="${t.w}" height="${t.h}" rx="10" fill="#dfe6fb" stroke="${NAVY}" stroke-width="6"/>`;
  for(let k=0;k<4;k++)s+=`<path d="M${t.x-36} ${t.y+30+k*16} H${t.x+36}" stroke="${NAVY}" stroke-width="4" opacity=".5"/>`;
  s+=`<circle cx="${t.x}" cy="${t.y+150}" r="12" fill="${(T.on||0)>0.5?'#33c26b':'#5b6079'}" stroke="${NAVY}" stroke-width="4"/>`;
  // monitor (shifted left to leave desk room for the gag bucket)
  const on=T.on||0; s+=`<g transform="translate(-50 0)">`;
  s+=`<rect x="315" y="440" width="30" height="32" fill="${NAVY}"/><rect x="270" y="462" width="120" height="12" rx="5" fill="${NAVY}"/>`;
  s+=`<rect x="190" y="262" width="280" height="186" rx="14" fill="${NAVY}"/>`;
  s+=`<rect x="202" y="274" width="256" height="162" rx="6" fill="#0d1124"/>`;
  if(on>0.02){
    s+=`<g opacity="${on.toFixed(2)}"><rect x="202" y="274" width="256" height="162" rx="6" fill="#eaf1ff"/>`;
    s+=`<rect x="202" y="274" width="256" height="26" fill="${BLUE}"/><text x="214" y="294" font-size="17" font-weight="700" fill="${IVORY}" font-family="DejaVu Sans, sans-serif">essay_FINAL</text>`;
    s+=`<rect x="378" y="279" width="74" height="17" rx="8" fill="${RED}"/><text x="415" y="293" font-size="12" font-weight="800" fill="${IVORY}" text-anchor="middle" font-family="DejaVu Sans, sans-serif">UNSAVED</text>`;
    s+=`<rect x="222" y="310" width="216" height="118" fill="#ffffff"/>`;
    for(let k=0;k<7;k++)s+=`<rect x="232" y="${320+k*15}" width="${k==6?90:180-((k*37)%60)}" height="6" rx="3" fill="#8b90a8"/>`;
    s+=`<rect x="${326+((f%24)<12?0:400)}" y="410" width="3" height="12" fill="${NAVY}"/>`;
    s+=`</g>`;
  }
  const g=T.gl||0;
  if(g>0.02){
    s+=`<g opacity="${g.toFixed(2)}">`;
    for(let k=0;k<6;k++){const yy=280+fr(k*0.37+f*0.11)*150,w=60+fr(k*0.61+f*0.07)*190,xx=204+fr(k*0.29+f*0.13)*(256-w);
      s+=`<rect x="${xx.toFixed(0)}" y="${yy.toFixed(0)}" width="${w.toFixed(0)}" height="${8+(k%3)*6}" fill="${['#ff4d4d','#33c26b','#2465ff','#0d1124'][k%4]}" opacity=".85"/>`;}
    s+=`</g>`;
  }
  s+=`</g>`;
  return s;
}
function cord(T){
  const x0=TOWER.x+TOWER.w/2,y0=TOWER.y+150,x1=T.plx,y1=T.ply;
  const mx=(x0+x1)/2,my=Math.max(y0,y1)+60;
  let s=`<path d="M${x0} ${y0} Q${mx} ${my} ${x1} ${y1}" fill="none" stroke="${NAVY}" stroke-width="7" stroke-linecap="round"/>`;
  // plug body with prongs pointing right
  s+=`<g transform="translate(${x1} ${y1}) rotate(${T.prot||0})"><rect x="-6" y="-17" width="30" height="34" rx="7" fill="${IVORY}" stroke="${NAVY}" stroke-width="5"/>`;
  s+=`<rect x="24" y="-11" width="14" height="6" fill="${GOLD}" stroke="${NAVY}" stroke-width="2"/><rect x="24" y="5" width="14" height="6" fill="${GOLD}" stroke="${NAVY}" stroke-width="2"/></g>`;
  const sp=T.spark||0;
  if(sp>0.05){
    s+=`<g opacity="${sp.toFixed(2)}" transform="translate(${SOCK.x} ${SOCK.y-10})">`;
    for(let k=0;k<6;k++){const a=k*60+20,r1=34,r2=34+30*sp;const c=Math.cos(a*Math.PI/180),d=Math.sin(a*Math.PI/180);
      s+=`<path d="M${(c*r1).toFixed(1)} ${(d*r1).toFixed(1)} L${(c*r2).toFixed(1)} ${(d*r2).toFixed(1)}" stroke="${GOLD}" stroke-width="7" stroke-linecap="round"/>`;}
    s+=`<path d="M-8 -26 L6 -4 H-4 L8 22" fill="none" stroke="${GOLD}" stroke-width="6" stroke-linejoin="round"/></g>`;
  }
  return s;
}
function stick(T){
  const k=T.stk||0;if(k<0.02)return '';
  const cx=335,cy=150,sc=0.3+0.7*k;
  let s=`<g opacity="${clamp(k*1.5,0,1).toFixed(2)}">`;
  s+=`<g transform="translate(${cx} ${cy}) scale(${sc.toFixed(3)})">`;
  s+=`<path d="M-170 -50 H170 V40 H-170 Z" fill="${GREEN}" stroke="${NAVY}" stroke-width="6" stroke-linejoin="round"/>`;
  for(let i=0;i<8;i++)s+=`<rect x="${-158+i*40}" y="-38" width="34" height="46" rx="3" fill="${CHIP}"/>`;
  s+=`<rect x="-170" y="40" width="340" height="22" fill="${GREEN}" stroke="${NAVY}" stroke-width="6"/>`;
  for(let i=0;i<26;i++){const xx=-162+i*12.6;if(xx>-12&&xx<4)continue;s+=`<rect x="${xx.toFixed(1)}" y="44" width="8" height="15" fill="${GOLD}"/>`;}
  s+=`<rect x="-10" y="46" width="16" height="20" fill="#fdfcf1"/>`;
  s+=`<circle cx="-178" cy="-6" r="10" fill="#fdfcf1" stroke="${NAVY}" stroke-width="5"/><circle cx="178" cy="-6" r="10" fill="#fdfcf1" stroke="${NAVY}" stroke-width="5"/>`;
  s+=`</g></g>`;
  return s;
}
function gagBucket(T,f){
  const v=T.gb||0;let s='';
  if(v>0.02){
    const x=505,top=372,bot=470,l=clamp(T.gbl||0,0,1);
    s+=`<g opacity="${v.toFixed(2)}">`;
    const wy=bot-(bot-top-8)*l;
    if(l>0.02)s+=`<path d="M${472+ (wy-top)*0.18} ${wy} L${538-(wy-top)*0.18} ${wy} L${528} ${bot-4} L${482} ${bot-4} Z" fill="${WAT}" opacity=".75"/>`;
    s+=`<path d="M462 ${top} L548 ${top} L530 ${bot} L480 ${bot} Z" fill="none" stroke="${NAVY}" stroke-width="7" stroke-linejoin="round"/>`;
    s+=`<path d="M466 ${top-2} Q505 ${top-60} 544 ${top-2}" fill="none" stroke="${NAVY}" stroke-width="5"/>`;
    // leak jets out of the side holes, over the desk edge
    for(let k=0;k<3;k++){const hy=bot-14-k*22;s+=`<circle cx="${531-k*4}" cy="${hy}" r="4" fill="${NAVY}"/>`;
      if(l>0.05)s+=`<path d="M${533-k*4} ${hy} q ${30+k*8} 6 ${44+k*10} ${70+(2-k)*20}" fill="none" stroke="${WAT}" stroke-width="6" stroke-linecap="round" opacity=".85"/>`;}
    s+=`</g>`;
  }
  const p=T.pud||0;
  if(p>0.02)s+=`<ellipse cx="590" cy="700" rx="${(30+70*p).toFixed(1)}" ry="${(5+9*p).toFixed(1)}" fill="${WAT}" opacity=".7"/>`;
  return s;
}
function wateringCan(T,f){
  if(!(T.can>0.5))return '';
  const x=T.gx,y=T.gy,tilt=-28*(T.pour||0);
  let s=`<g transform="translate(${x} ${y}) rotate(${tilt})">`;
  s+=`<path d="M-58 0 L-120 -34" stroke="${NAVY}" stroke-width="10" stroke-linecap="round"/>`;
  s+=`<rect x="-62" y="-6" width="74" height="60" rx="10" fill="${GREEN}" stroke="${NAVY}" stroke-width="6"/>`;
  s+=`<path d="M-4 -6 Q14 -40 30 -2" fill="none" stroke="${NAVY}" stroke-width="7"/>`;
  s+=`<ellipse cx="-124" cy="-37" rx="9" ry="13" fill="${GOLD}" stroke="${NAVY}" stroke-width="4" transform="rotate(-30 -124 -37)"/>`;
  s+=`</g>`;
  const p=T.pour||0;
  if(p>0.3){
    const a=tilt*Math.PI/180,tx=x+(-124*Math.cos(a)+37*Math.sin(a)),ty=y+(-124*Math.sin(a)-37*Math.cos(a));
    s+=`<path d="M${tx.toFixed(1)} ${ty.toFixed(1)} Q${(tx-20).toFixed(1)} ${(ty+10).toFixed(1)} 500 ${390}" fill="none" stroke="${WAT}" stroke-width="7" stroke-linecap="round" opacity="${(p*0.9).toFixed(2)}"/>`;
  }
  return s;
}
// ---------- chip zone ----------
function cellXY(i){const c=i%4,r=Math.floor(i/4);return {x:GX+c*CW,y:GY+r*RH,c,r};}
function grid(T,f){
  let s='';
  const dead=T.dead||0, lineC=dead>0.5?'#8b90a8':NAVY;
  // chip die background
  s+=`<rect x="${GX-60}" y="${GY-40}" width="${4*CW+80}" height="${3*RH+40}" rx="26" fill="#eef2fd" stroke="${NAVY}" stroke-width="6"/>`;
  // bit lines (vertical)
  for(let c=0;c<4;c++){const x=GX+c*CW+30;let col=lineC,w=5;
    if(T.rd>=0&&T.rd%4==c&&(T.rdf||0)>0.05){col=BLUE;w=5+7*T.rdf;}
    s+=`<path d="M${x} ${GY-30} V${GY+3*RH-30}" stroke="${col}" stroke-width="${w.toFixed(1)}"/>`;}
  // word lines (horizontal)
  for(let r=0;r<3;r++){const y=GY+r*RH+30;s+=`<path d="M${GX-50} ${y} H${GX+4*CW-10}" stroke="${lineC}" stroke-width="5"/>`;}
  // refresh bar
  const sw=T.sw;
  if(sw!=null&&sw>-0.5&&sw<4.5){const bx=GX+sw*CW+95;
    s+=`<rect x="${bx-38}" y="${GY-36}" width="76" height="${3*RH+30}" rx="30" fill="${BLUE}" opacity=".22"/>`;
    s+=`<rect x="${bx-6}" y="${GY-36}" width="12" height="${3*RH+30}" rx="6" fill="${BLUE}" opacity=".7"/>`;}
  for(let i=0;i<12;i++){
    const {x,y}=cellXY(i), L=clamp(T.lv[i],0,1);
    const open=Math.max(T.gate||0,(T.rd==i)?(T.rdf||0):0, (sw!=null&&Math.abs(sw-(i%4))<0.5)?1:0);
    // transistor on the bit line, gate tied to the word line
    s+=`<path d="M${x+30} ${y+30} V${y+52}" stroke="${lineC}" stroke-width="4"/>`;
    s+=`<rect x="${x+13}" y="${y+52}" width="34" height="44" rx="8" fill="${open>0.3?BLUE:IVORY}" stroke="${NAVY}" stroke-width="5"/>`;
    s+=`<path d="M${x+47} ${y+86} H${x+76}" stroke="${open>0.3?BLUE:lineC}" stroke-width="${open>0.3?8:5}"/>`;
    // bucket (capacitor)
    const top=y+58,bot=y+170, wy=bot-(bot-top-6)*L;
    if(L>0.01){const ins=(wy-top)*0.12;s+=`<path d="M${x+76+ins} ${wy} L${x+174-ins} ${wy} L${x+162} ${bot-3} L${x+88} ${bot-3} Z" fill="${WAT}" opacity=".75"/>`;
      s+=`<path d="M${x+80+ins} ${wy} H${x+170-ins}" stroke="${BLUE}" stroke-width="4"/>`;}
    s+=`<path d="M${x+72} ${top} L${x+178} ${top} L${x+164} ${bot} L${x+86} ${bot} Z" fill="none" stroke="${NAVY}" stroke-width="7" stroke-linejoin="round"/>`;
    // drips (leak)
    const lk=T.leak||0;
    if(lk>0.05&&L>0.05){for(let k=0;k<2;k++){const u=fr(f*0.045+i*0.29+k*0.5);
      s+=`<path d="M${x+125} ${bot+4+u*34} q -6 9 0 13 q 6 -4 0 -13" fill="${WAT}" stroke="${NAVY}" stroke-width="2" opacity="${(lk*(1-u)).toFixed(2)}"/>`;}}
    // bit digit
    const one=BITS[i]==1&&(L>0.5||T.rd==i), warn=BITS[i]==1&&!one;
    s+=`<text x="${x+125}" y="${y+214}" font-size="38" font-weight="900" fill="${warn?RED:(one?BLUE:NAVY)}" text-anchor="middle" font-family="DejaVu Sans, sans-serif">${one?1:0}</text>`;
  }
  // counter panel
  if(T.cntOn>0.5){
    s+=`<rect x="${GX+10}" y="${GY-150}" width="740" height="96" rx="22" fill="${NAVY}"/>`;
    s+=`<text x="${GX+40}" y="${GY-86}" font-size="34" font-weight="700" fill="${IVORY}" font-family="DejaVu Sans, sans-serif">REFILLS TODAY</text>`;
    s+=`<text x="${GX+730}" y="${GY-82}" font-size="50" font-weight="900" fill="${GOLD}" text-anchor="end" font-family="DejaVu Mono, monospace">${fmt(T.cnt||0)}</text>`;
  }
  if(dead>0.02)s+=`<rect x="${GX-60}" y="${GY-40}" width="${4*CW+80}" height="${3*RH+40}" rx="26" fill="#0d1124" opacity="${(0.12*dead).toFixed(3)}"/>`;
  return s;
}
function anchors(T){
  const c=i=>{const p=cellXY(i);return p;};
  return {plug:{x:T.plx+16,y:T.ply},socket:{x:SOCK.x,y:SOCK.y},screen:{x:280,y:330},unsaved:{x:365,y:288},
    stick:{x:335,y:150},chips:{x:275,y:140},tower:{x:TOWER.x,y:TOWER.y+40},
    bucket:{x:c(0).x+125,y:c(0).y+120},bucket5:{x:c(5).x+125,y:c(5).y+120},gate:{x:c(1).x+30,y:c(1).y+74},
    word:{x:GX-40,y:GY+30},bit:{x:GX+30+CW*2,y:GY+3*RH-60},one:{x:c(2).x+125,y:c(2).y+200},zero:{x:c(1).x+125,y:c(1).y+200},
    fade:{x:c(6).x+125,y:c(6).y+200},refresh:{x:GX+(T.sw||0)*CW+95,y:GY-20},read:{x:c(T.rd>=0?T.rd:0).x+30,y:c(T.rd>=0?T.rd:0).y+74},
    gbucket:{x:505,y:400},can:{x:T.gx-40,y:T.gy+20}};
}
window.PROPS={labelY:5000,
  draw(T,f){PROPS.labelY=5000;
    const svg=grid(T,f)+desk(T,f)+gagBucket(T,f)+stick(T)+cord(T)+wateringCan(T,f);
    return {svg,anchors:anchors(T)};},
  grip(T){return {x:T.gx,y:T.gy};}};
