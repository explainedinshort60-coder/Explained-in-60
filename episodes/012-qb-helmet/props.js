// Episode 012 props: a football helmet on a display stand (side view, facing left) with an x-ray mode that shows
// the padding, a tiny speaker by the ear hole, a receiver and its wire; a green dot on the back; a play clock on a post;
// turf with yard lines; a lineup zone (3 offense helmets facing right, 3 defense helmets facing left, one dot each).
// Front overlay (drawn over the host): a coach headset on the host's head and the radio waves from its mic.
// Contract: window.PROPS = {draw(T,f)->{svg, anchors}, grip(T)->{x,y}, labelY}
// T: xr (x-ray 0..1), wv (waves 0..1), cut (0..1 broken signal), sp (speaker pulse 0..1), bub (0..1), bubT (text),
//    clk (play clock value), clkOn (0..1), clkRed (0..1), dot (green dot glow 0..1), rep (reply attempt 0..1),
//    lw (lineup waves 0..1), lo (offense glow 0..1), ld (defense glow 0..1), mute (0..1 muted mic icon)
const TURF='#2f9e5b',TURF2='#278a4e',DOT='#35d062',AMBER='#ffb020',RED='#ff4d4d',PAD='#f1d9a6',SHELL='#2465ff';
const H={x:390,y:380};          // main helmet center
const EAR={x:428,y:392};        // ear hole / speaker
const CLK={x:140,y:40};         // play clock board center
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function helmet(x,y,s,flip,o){
  // side view facing left (facemask on the left), local coords centered on (0,0); o: {xr, dot, glow, sp}
  o=o||{};const xr=o.xr||0;
  let g=`<g transform="translate(${x} ${y}) scale(${flip?-s:s} ${s})">`;
  if(o.glow>0.02)g+=`<ellipse cx="0" cy="0" rx="210" ry="185" fill="${DOT}" opacity="${(0.25*o.glow).toFixed(2)}"/>`;
  const shell='M-120 40 C-150 -80 -90 -175 20 -175 C120 -175 170 -100 165 -10 C162 50 140 90 110 110 L40 110 L30 60 L-60 50 Z';
  g+=`<path d="${shell}" fill="${SHELL}" stroke="${NAVY}" stroke-width="9" stroke-linejoin="round"/>`;
  // ivory center stripe
  g+=`<path d="M-95 -120 C-50 -170 60 -178 120 -128" fill="none" stroke="${IVORY}" stroke-width="18" stroke-linecap="round"/>`;
  // face mask
  g+=`<path d="M-118 -20 L-185 -16 Q-200 40 -165 78 L-60 70" fill="none" stroke="#b9c1d6" stroke-width="12" stroke-linejoin="round" stroke-linecap="round"/>`;
  g+=`<path d="M-188 22 L-100 25 M-150 -18 L-140 75" fill="none" stroke="#b9c1d6" stroke-width="10" stroke-linecap="round"/>`;
  g+=`<path d="M-118 -20 L-185 -16 Q-200 40 -165 78 L-60 70" fill="none" stroke="${NAVY}" stroke-width="3" opacity=".6"/>`;
  // jaw pad + chin strap
  g+=`<path d="M-60 50 L30 60 L40 110 L-40 112 Z" fill="${NAVY}" opacity=".85"/>`;
  // x-ray interior
  if(xr>0.02){
    g+=`<g opacity="${xr.toFixed(2)}">`;
    g+=`<path d="${shell}" fill="#dfe6fb" stroke="${NAVY}" stroke-width="9" stroke-dasharray="18 12"/>`;
    g+=`<path d="M-95 30 C-120 -60 -70 -140 20 -142 C105 -142 140 -80 135 -10 C132 40 115 70 95 85 L45 85 L35 45 L-60 38 Z" fill="${PAD}" stroke="${NAVY}" stroke-width="5"/>`;
    for(let k=0;k<4;k++)g+=`<path d="M${-60+k*45} -120 Q${-50+k*45} -40 ${-62+k*45} 30" fill="none" stroke="#c9a96b" stroke-width="5"/>`;
    // receiver box near the back and its wire to the speaker
    g+=`<path d="M100 40 Q80 10 52 12" fill="none" stroke="${NAVY}" stroke-width="5"/>`;
    g+=`<rect x="88" y="30" width="44" height="34" rx="6" fill="${NAVY}"/><rect x="96" y="38" width="10" height="6" fill="${DOT}"/>`;
    g+=`</g>`;
  }
  // ear hole + speaker
  const sp=o.sp||0;
  if(xr>0.02){
    g+=`<g opacity="${xr.toFixed(2)}"><circle cx="38" cy="12" r="${30+4*sp}" fill="${NAVY}"/><circle cx="38" cy="12" r="${18+5*sp}" fill="${BLUE}" stroke="${IVORY}" stroke-width="3"/><circle cx="38" cy="12" r="6" fill="${IVORY}"/></g>`;
  }
  g+=`<circle cx="38" cy="12" r="15" fill="${NAVY}" opacity="${(1-xr*0.7).toFixed(2)}"/>`;
  if(sp>0.05)for(let k=0;k<2;k++)g+=`<path d="M${-6-k*16} ${-14-k*10} Q${-14-k*18} 12 ${-6-k*16} ${38+k*10}" fill="none" stroke="${IVORY}" stroke-width="6" stroke-linecap="round" opacity="${(sp*(0.9-0.3*k)).toFixed(2)}"/>`;
  // green dot on the back
  if(o.dot!==undefined&&o.dot>=0){
    const d=o.dot||0;
    if(d>0.05)g+=`<circle cx="148" cy="-92" r="${26+10*d}" fill="${DOT}" opacity="${(0.35*d).toFixed(2)}"/>`;
    g+=`<circle cx="148" cy="-92" r="15" fill="${DOT}" stroke="${NAVY}" stroke-width="5"/>`;
  }
  g+=`</g>`;return g;
}
function arcs(x0,y0,x1,y1,f,amt,n,col){
  // radio pulses traveling from (x0,y0) to (x1,y1)
  if(amt<0.02)return '';
  const dx=x1-x0,dy=y1-y0,L=Math.hypot(dx,dy),a=Math.atan2(dy,dx)*180/Math.PI;let s='';
  for(let k=0;k<n;k++){const p=((f/16+k/n)%1);const x=x0+dx*p,y=y0+dy*p,r=26+26*p;const op=amt*Math.min(1,p*4)*Math.min(1,(1-p)*4);
    s+=`<path d="M0 ${-r} A${r} ${r} 0 0 1 0 ${r}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${a.toFixed(1)})" fill="none" stroke="${col||BLUE}" stroke-width="10" stroke-linecap="round" opacity="${op.toFixed(2)}"/>`;}
  return s;
}
function turf(){
  let s=`<rect x="-1200" y="700" width="4200" height="600" fill="${TURF}"/>`;
  for(let x=-1100;x<3000;x+=160)s+=`<rect x="${x}" y="702" width="10" height="70" fill="${IVORY}" opacity=".85" transform="skewX(-30) translate(${0.58*700} 0)"/>`;
  s+=`<rect x="-1200" y="700" width="4200" height="10" fill="${TURF2}"/>`;
  return s;
}
function clock(T){
  const vis=T.clkVis===undefined?1:T.clkVis;if(vis<0.02)return '';const on=T.clkOn||0,v=Math.max(0,Math.ceil(T.clk||0)),red=T.clkRed||0;
  let s=`<g opacity="${vis.toFixed(2)}"><rect x="${CLK.x-10}" y="${CLK.y+90}" width="20" height="${700-CLK.y-90}" fill="${NAVY}"/>`;
  s+=`<rect x="${CLK.x-100}" y="${CLK.y-95}" width="200" height="185" rx="16" fill="${NAVY}" stroke="${NAVY}" stroke-width="6"/>`;
  s+=`<rect x="${CLK.x-86}" y="${CLK.y-82}" width="172" height="140" rx="8" fill="#0d1124"/>`;
  s+=`<text x="${CLK.x}" y="${CLK.y+80}" font-size="20" font-weight="800" fill="${IVORY}" text-anchor="middle" letter-spacing="2" font-family="DejaVu Sans, sans-serif">PLAY CLOCK</text>`;
  const col=red>0.5?RED:AMBER;
  s+=`<text x="${CLK.x}" y="${CLK.y+42}" font-size="120" font-weight="900" fill="${col}" opacity="${(0.25+0.75*on).toFixed(2)}" text-anchor="middle" font-family="DejaVu Sans Mono, monospace">${String(v).padStart(2,'0')}</text></g>`;
  return s;
}
function bubble(x,y,txt,a,tail){
  if(a<0.02)return '';const w=txt.length*22+50;
  return `<g opacity="${clamp(a*1.5,0,1).toFixed(2)}" transform="translate(${x} ${y}) scale(${(0.6+0.4*clamp(a*2,0,1)).toFixed(2)})"><rect x="${-w/2}" y="-40" width="${w}" height="80" rx="36" fill="${IVORY}" stroke="${NAVY}" stroke-width="6"/>`+
    `<path d="M${tail[0]} 36 L${tail[1]} ${tail[2]} L${tail[0]+30} 36" fill="${IVORY}" stroke="${NAVY}" stroke-width="6" stroke-linejoin="round"/><rect x="${tail[0]-2}" y="30" width="36" height="9" fill="${IVORY}"/>`+
    `<text x="0" y="13" font-size="38" font-weight="900" fill="${NAVY}" text-anchor="middle" font-family="DejaVu Sans, sans-serif">${txt}</text></g>`;
}
const LINE=[{x:1500,o:0},{x:1675,o:1},{x:1850,o:0},{x:2090,d:0},{x:2265,d:1},{x:2440,d:0}];
function lineup(T,f){
  let s='';
  s+=`<rect x="1966" y="560" width="8" height="140" fill="${IVORY}" opacity=".0"/>`;
  s+=`<path d="M1970 700 L1970 760" stroke="${IVORY}" stroke-width="8"/>`;
  // sky source: a small sideline headset icon
  s+=`<g transform="translate(1970 230) scale(1.8)"><path d="M-46 20 Q-46 -40 0 -40 Q46 -40 46 20" fill="none" stroke="${NAVY}" stroke-width="10"/><rect x="-60" y="4" width="26" height="44" rx="8" fill="${BLUE}" stroke="${NAVY}" stroke-width="6"/><rect x="34" y="4" width="26" height="44" rx="8" fill="${BLUE}" stroke="${NAVY}" stroke-width="6"/></g>`;
  for(const h of LINE){
    const off=h.o!==undefined,has=off?h.o:h.d,glow=has?(off?T.lo:T.ld)||0:0;
    s+=helmet(h.x,645,0.5,off,{dot:has?glow:undefined,glow:glow,sp:has?(T.lw||0)*(0.5+0.5*Math.sin(f/2)):0});
    if(has)s+=arcs(1970,330,h.x,540,f,(T.lw||0)*(off?Math.max(0.35,T.lo||0):Math.max(0.35,T.ld||0)),3);
  }
  return s;
}
window.PROPS={labelY:-40,
  grip:T=>({x:600,y:330}),
  draw(T,f){
    let s=turf();
    s+=clock(T);
    // stand
    s+=`<rect x="${H.x-12}" y="${H.y+100}" width="24" height="${700-H.y-110}" fill="${NAVY}"/><rect x="${H.x-80}" y="688" width="160" height="16" rx="6" fill="${NAVY}"/>`;
    s+=helmet(H.x,H.y,1,false,{xr:T.xr,dot:T.dot||0,sp:T.sp});
    s+=bubble(250,180,T.bubT||'SLANT LEFT!',T.bub||0,[40,90,95]);
    // reply attempt: dashed wave that dies with an X
    const r=T.rep||0;
    if(r>0.02){
      s+=`<g opacity="${clamp(r*1.5,0,1).toFixed(2)}"><path d="M${EAR.x+40} ${EAR.y-30} Q${EAR.x+90} ${EAR.y-120} ${EAR.x+40+130*Math.min(1,r*1.4)} ${EAR.y-150}" fill="none" stroke="${RED}" stroke-width="7" stroke-dasharray="14 12"/>`;
      if(r>0.6)s+=`<g transform="translate(${EAR.x+175} ${EAR.y-160})"><path d="M-22 -22 L22 22 M22 -22 L-22 22" stroke="${RED}" stroke-width="12" stroke-linecap="round"/></g>`;
      s+=`</g>`;
    }
    s+=lineup(T,f);
    const anchors={helmet:{x:H.x-20,y:H.y-150},speaker:{x:EAR.x,y:EAR.y},receiver:{x:H.x+110,y:H.y+47},dot:{x:H.x+148,y:H.y-92},
      clock:{x:CLK.x+60,y:CLK.y-60},wave:{x:545,y:300},mic:{x:640,y:228},headset:{x:722,y:72},reply:{x:EAR.x+175,y:EAR.y-160},
      qb:{x:1675,y:560},def:{x:2265,y:560},lineO:{x:1675,y:575},lineD:{x:2265,y:575}};
    return {svg:s,anchors};
  },
  // drawn over the host: headset and radio waves (exact head position from the rig state)
  front(S){
    const C=S.C,T=S.T;if(!C)return '';
    let s=`<g transform="translate(720 ${C.y.toFixed(2)}) rotate(${C.lean.toFixed(2)} 0 450) rotate(${C.st.head.toFixed(2)} 0 280)">`;
    s+=`<path d="M-128 168 Q-134 48 0 52 Q134 48 128 168" fill="none" stroke="${NAVY}" stroke-width="13" stroke-linecap="round"/>`;
    s+=`<rect x="-150" y="138" width="34" height="78" rx="12" fill="${BLUE}" stroke="${NAVY}" stroke-width="7"/><rect x="116" y="138" width="34" height="78" rx="12" fill="${BLUE}" stroke="${NAVY}" stroke-width="7"/>`;
    s+=`<path d="M-140 206 Q-128 262 -50 236" fill="none" stroke="${NAVY}" stroke-width="8" stroke-linecap="round"/><ellipse cx="-42" cy="234" rx="15" ry="11" fill="${NAVY}"/>`;
    // antenna on the far cup
    s+=`<path d="M138 140 L160 70" stroke="${NAVY}" stroke-width="6" stroke-linecap="round"/><circle cx="160" cy="68" r="8" fill="${(T.mute||0)>0.5?RED:DOT}" stroke="${NAVY}" stroke-width="4"/>`;
    s+=`</g>`;
    // waves from the mic to the helmet ear hole
    const r=C.lean*Math.PI/180,h=C.st.head*Math.PI/180;
    let mx=-42,my=234; // rotate about head pivot then lean pivot
    let x1=mx*Math.cos(h)-(my-280)*Math.sin(h),y1=mx*Math.sin(h)+(my-280)*Math.cos(h)+280;
    let x2=x1*Math.cos(r)-(y1-450)*Math.sin(r),y2=x1*Math.sin(r)+(y1-450)*Math.cos(r)+450;
    const MX=720+x2-24,MY=C.y+y2;
    const cut=T.cut||0;
    if(cut<0.5)s+=arcs(MX,MY,EAR.x+20,EAR.y-10,S.f,T.wv||0,4);
    if(cut>0.02){
      s+=`<g opacity="${cut.toFixed(2)}" transform="translate(${MX-70} ${MY+10})"><path d="M30 -40 L-6 -4 L16 6 L-24 44" fill="none" stroke="${RED}" stroke-width="9" stroke-linejoin="round" stroke-linecap="round"/>`;
      s+=`<path d="M-60 -30 L-20 10 M-20 -30 L-60 10" stroke="${RED}" stroke-width="9" stroke-linecap="round" transform="translate(-30 -10)"/></g>`;
    }
    return s;
  }};
// Inject the front layer after core draws each frame.
(function(){const orig=window.drawFrame;window.drawFrame=function(S){orig(S);const svg=document.querySelector('#stage svg');if(svg&&PROPS.front)svg.insertAdjacentHTML('beforeend',PROPS.front(S));};})();
