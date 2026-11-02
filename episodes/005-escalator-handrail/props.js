// Episode 005 props: an up escalator in side cutaway between a lower floor (y=700) and a mezzanine (y=140).
// The handrail is ONE closed loop (coral rubber): top run over the glass balustrade, turn-around rollers at each
// newel end, a hidden return run inside the balustrade (upside down), a drive wheel with two pressure rollers near the
// bottom, chained to the main motor in the pit, which also turns the step sprocket.
// Contract: window.PROPS = {draw(T,f)->{svg, anchors}, grip(T)->{x,y}, labelY}
// T: o (handrail offset along the loop), os (step offset along the incline), xr (x-ray 0..1), duck (loop s or -1),
//    duckS (duck scale), mk (bonus markers 0..1), lagS (step marker extra travel), sq (squeeze 0..1), ly (label world y),
//    dash (x-ray light dash 0..1), g ('rail'|'duck'), pulse (0..1)
const CORAL='#ff5a4e',CORALD='#c23a31',METAL='#c7cfe6',WARM='#ffd84a',INS='#e6ebf8',PIT='#e3e8f6';
const C30=Math.cos(Math.PI/6),S30=Math.sin(Math.PI/6),PITCH=70/C30; // 80.83 along the incline
const LOWX=400,LOWY=700; // lower comb (nose line start)
const LOOP=[[580,400,45],[420,400,50],[-550,-160,50],[-680,-160,45],[-680,-60,45],[-550,-60,50],[420,500,50],[580,500,45]];
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
// ---------- rounded closed polygon, parametrised by arc length ----------
const SEG=(function(){
  const n=LOOP.length,C=[];
  for(let i=0;i<n;i++){
    const [px,py,r]=LOOP[i],[ax,ay]=LOOP[(i+n-1)%n],[bx,by]=LOOP[(i+1)%n];
    let dix=px-ax,diy=py-ay,l1=Math.hypot(dix,diy);dix/=l1;diy/=l1;
    let dox=bx-px,doy=by-py,l2=Math.hypot(dox,doy);dox/=l2;doy/=l2;
    const cr=dix*doy-diy*dox,sg=cr>0?1:-1,th=Math.acos(clamp(dix*dox+diy*doy,-1,1)),t=r*Math.tan(th/2);
    const A=[px-dix*t,py-diy*t],B=[px+dox*t,py+doy*t],Cc=[A[0]-diy*sg*r,A[1]+dix*sg*r];
    C.push({A,B,C:Cc,r,sg,th,a0:Math.atan2(A[1]-Cc[1],A[0]-Cc[0])});
  }
  const S=[];let s=0;
  for(let i=0;i<n;i++){
    const p=C[(i+n-1)%n].B,q=C[i].A,ll=Math.hypot(q[0]-p[0],q[1]-p[1]);
    S.push({k:'L',p,q,s0:s,len:ll});s+=ll;
    const c=C[i],al=c.r*c.th;S.push({k:'A',c,s0:s,len:al});s+=al;
  }
  let d=`M${C[n-1].B[0].toFixed(1)} ${C[n-1].B[1].toFixed(1)}`;
  for(const c of C)d+=` L${c.A[0].toFixed(1)} ${c.A[1].toFixed(1)} A${c.r} ${c.r} 0 0 ${c.sg>0?1:0} ${c.B[0].toFixed(1)} ${c.B[1].toFixed(1)}`;
  return {S,L:s,d:d+' Z'};
})();
window.LOOP_LEN=SEG.L;
function at(s){ // -> {x,y,tx,ty}
  s=((s%SEG.L)+SEG.L)%SEG.L;
  for(const g of SEG.S){ if(s<=g.s0+g.len+1e-6){const u=(s-g.s0)/g.len;
      if(g.k=='L'){const tx=(g.q[0]-g.p[0])/g.len,ty=(g.q[1]-g.p[1])/g.len;return {x:g.p[0]+(g.q[0]-g.p[0])*u,y:g.p[1]+(g.q[1]-g.p[1])*u,tx,ty};}
      const c=g.c,a=c.a0+c.sg*c.th*u;return {x:c.C[0]+c.r*Math.cos(a),y:c.C[1]+c.r*Math.sin(a),tx:-c.sg*Math.sin(a),ty:c.sg*Math.cos(a)};}}
  return at(0);
}
// s of a point on the top run at x (lower flat or incline)
function sTop(x){const g0=SEG.S[0];// L from P8 arc end up the newel... find by search
  let best=0,bd=1e9;for(let s=0;s<SEG.L;s+=2){const p=at(s);if(p.ty<0.6&&p.tx<0&&Math.abs(p.x-x)<bd&&p.y<420){bd=Math.abs(p.x-x);best=s;}}return best;}
const S_HAND=sTop(528),S_MID=sTop(-60),S_UP=sTop(-560);
window.LOOP_INFO={L:SEG.L,hand:S_HAND};
// ---------- steps, truss, floors ----------
function nose(d){return [LOWX-d*C30,LOWY-d*S30];}
function steps(T){
  const off=((T.os%PITCH)+PITCH)%PITCH;let top='',fill='';
  let pts=[];for(let k=-2;k<17;k++){const [x,y]=nose(k*PITCH+off);pts.push([x,y]);}
  // sawtooth: from each nose, tread right 70, riser down to the next lower nose
  let d=`M${pts[pts.length-1][0]} ${pts[pts.length-1][1]}`;
  for(let i=pts.length-1;i>0;i--){const [x,y]=pts[i];d+=` H${x+70} V${pts[i-1][1]}`;}
  const [xa,ya]=pts[0],[xb,yb]=pts[pts.length-1];
  const body=d+` L${xa+60} ${ya+80} L${xb+60} ${yb+80} Z`;
  let s=`<clipPath id="stc"><rect x="-570" y="-400" width="970" height="1100"/></clipPath><g clip-path="url(#stc)">`;
  s+=`<path d="${body}" fill="${METAL}" stroke="${NAVY}" stroke-width="5" stroke-linejoin="round"/>`;
  for(let i=1;i<pts.length;i++){const [x,y]=pts[i];s+=`<path d="M${x+4} ${y+3} H${x+22}" stroke="${WARM}" stroke-width="6"/>`;}
  s+=`<path d="${d}" fill="none" stroke="${NAVY}" stroke-width="6" stroke-linejoin="round"/></g>`;
  return s;
}
function truss(T){
  const xr=T.xr||0;
  // cladding under the steps (parallelogram), clipped above the lower floor unless x-ray
  const [x0,y0]=nose(-10),[x1,y1]=nose(1150);
  let s=`<clipPath id="trc"><rect x="-700" y="-400" width="1500" height="${1100+300*xr}"/></clipPath><g clip-path="url(#trc)">`;
  s+=`<path d="M${x0+60} ${y0+80} L${x1+60} ${y1+80} L${x1+60} ${y1+200} L${x0+60} ${y0+200} Z" fill="${INS}" stroke="${NAVY}" stroke-width="5"/>`;
  if(xr>0.02){for(let k=0;k<14;k++){const [a,b]=nose(k*82),[c,e]=nose(k*82+41);s+=`<path d="M${a+60} ${b+200} L${c+60} ${e+80}" stroke="${NAVY}" stroke-width="3" opacity="${.35*xr}"/>`;}}
  s+=`</g>`;
  // mezzanine slab and its column
  s+=`<rect x="-640" y="200" width="44" height="500" fill="${IVORY}" stroke="${NAVY}" stroke-width="5"/>`;
  s+=`<rect x="-1700" y="140" width="1140" height="60" fill="${IVORY}" stroke="${NAVY}" stroke-width="6"/><path d="M-1700 140 H-560" stroke="${NAVY}" stroke-width="6"/>`;
  // comb plates
  s+=`<rect x="380" y="693" width="230" height="14" rx="4" fill="${METAL}" stroke="${NAVY}" stroke-width="4"/>`;
  s+=`<rect x="-720" y="133" width="170" height="14" rx="4" fill="${METAL}" stroke="${NAVY}" stroke-width="4"/>`;
  return s;
}
function pit(T,f){
  const xr=T.xr||0;if(xr<0.02)return '';
  const ga=(T.os/PITCH)*45,wa=(T.o/PITCH)*90;
  let s=`<g opacity="${xr}"><rect x="240" y="707" width="400" height="200" rx="10" fill="${PIT}" stroke="${NAVY}" stroke-width="5" stroke-dasharray="16 10"/>`;
  // motor
  s+=`<rect x="270" y="760" width="120" height="90" rx="12" fill="${BLUE}" stroke="${NAVY}" stroke-width="6"/>`;
  for(let k=0;k<4;k++)s+=`<path d="M${284+k*26} 772 V838" stroke="${NAVY}" stroke-width="4" opacity=".5"/>`;
  s+=`<path d="M390 805 H476" stroke="${NAVY}" stroke-width="10"/>`;
  // main drive sprocket
  s+=`<g transform="rotate(${ga.toFixed(2)} 510 805)"><circle cx="510" cy="805" r="46" fill="${METAL}" stroke="${NAVY}" stroke-width="6"/>`;
  for(let k=0;k<8;k++)s+=`<rect x="504" y="751" width="12" height="16" rx="3" fill="${NAVY}" transform="rotate(${k*45} 510 805)"/>`;
  s+=`<path d="M510 775 V835 M480 805 H540" stroke="${NAVY}" stroke-width="5"/></g><circle cx="510" cy="805" r="8" fill="${NAVY}"/>`;
  s+=`</g>`;
  return s;
}
function chain(T,f){ // chain belt from the sprocket (440,805,r46) to the drive wheel (500,546,r32)
  const xr=T.xr||0;if(xr<0.02)return '';
  const off=(-T.o)%24;
  const d=`M464 805 L468 546 M556 805 L532 546`;
  return `<g><path d="${d}" stroke="${NAVY}" stroke-width="12" stroke-linecap="round"/><path d="${d}" stroke="${METAL}" stroke-width="6" stroke-dasharray="8 4" stroke-dashoffset="${off}"/></g>`;
}
function drive(T,f){
  const xr=T.xr||0;if(xr<0.02)return '';
  const wa=(T.o/PITCH)*90,sq=T.sq||0,py=476+sq*5;
  let s=`<g>`;
  s+=`<g transform="rotate(${wa.toFixed(2)} 500 546)"><circle cx="500" cy="546" r="32" fill="${BLUE}" stroke="${NAVY}" stroke-width="6"/>`;
  for(let k=0;k<4;k++)s+=`<path d="M500 546 L500 518" stroke="${IVORY}" stroke-width="6" stroke-linecap="round" transform="rotate(${k*90} 500 546)"/>`;
  s+=`</g><circle cx="500" cy="546" r="7" fill="${NAVY}"/>`;
  for(const [x,dir] of [[462,1],[538,-1]]){
    s+=`<path d="M${x} ${py} L${x+dir*20} ${py-34}" stroke="${NAVY}" stroke-width="5"/>`;
    s+=`<g transform="rotate(${(-wa*2).toFixed(1)} ${x} ${py})"><circle cx="${x}" cy="${py}" r="13" fill="${IVORY}" stroke="${NAVY}" stroke-width="5"/><path d="M${x} ${py-8} V${py+8}" stroke="${NAVY}" stroke-width="3"/></g>`;
  }
  if(sq>0.05)for(const x of [462,538])s+=`<path d="M${x-10} ${py-24} L${x} ${py-16} L${x+10} ${py-24}" fill="none" stroke="${CORALD}" stroke-width="4" opacity="${sq}"/>`;
  // turn-around guide rollers on both newel arcs
  for(const c of [SEG.S[1].c,SEG.S[7].c,SEG.S[15].c,SEG.S[13].c,SEG.S[5].c,SEG.S[3].c]){
    for(let u=0.2;u<0.95;u+=0.3){const a=c.a0+c.sg*c.th*u,rx=c.C[0]+(c.r-22)*Math.cos(a),ry=c.C[1]+(c.r-22)*Math.sin(a);
      s+=`<circle cx="${rx.toFixed(1)}" cy="${ry.toFixed(1)}" r="8" fill="${IVORY}" stroke="${NAVY}" stroke-width="4"/>`;}
  }
  return s+`</g>`;
}
function rail(T,f){
  const o=T.o||0,xr=T.xr||0;
  let s=`<path d="${SEG.d}" fill="none" stroke="${NAVY}" stroke-width="30" stroke-linejoin="round"/>`;
  s+=`<path d="${SEG.d}" fill="none" stroke="${CORAL}" stroke-width="18" stroke-linejoin="round"/>`;
  s+=`<path d="${SEG.d}" fill="none" stroke="${CORALD}" stroke-width="18" stroke-dasharray="7 ${(PITCH/2-7).toFixed(3)}" stroke-dashoffset="${(-o).toFixed(2)}"/>`;
  return s;
}
function lightDash(T,f){
  const d=T.dash||0;if(d<0.02)return '';
  return `<path d="${SEG.d}" fill="none" stroke="${WARM}" stroke-width="10" stroke-linecap="round" opacity="${d}" stroke-dasharray="160 ${(SEG.L-160).toFixed(1)}" stroke-dashoffset="${(-(f*34)%SEG.L).toFixed(1)}"/>`;
}
function panel(T){
  const xr=T.xr||0,op=(0.96-0.74*xr).toFixed(2),dash=xr>0.05?'stroke-dasharray="18 12"':'';
  const d=`M-650 -146 L-550 -146 L420 414 L548 414 Q560 414 560 430 L560 640 L420 640 L-550 80 L-650 80 Q-662 80 -662 68 L-662 -134 Q-662 -146 -650 -146 Z`;
  let s=`<path d="${d}" fill="${TINT}" fill-opacity="${op}" stroke="${NAVY}" stroke-width="6" stroke-linejoin="round" ${dash}/>`;
  if(xr<0.6){for(let k=0;k<6;k++){const x=-480+k*170;s+=`<path d="M${x} ${-60+(x+550)*0.577} l60 -60" stroke="#ffffff" stroke-width="8" opacity="${0.7*(1-xr)}" stroke-linecap="round"/>`;}}
  return s;
}
function duckSVG(T){
  if(T.duck==null||T.duck<0)return '';
  const p=at(T.duck),nx=-p.ty,ny=p.tx,rot=Math.atan2(p.ty,p.tx)*180/Math.PI-180,sc=1.5*(T.duckS==null?1:T.duckS);
  const x=p.x+nx*12,y=p.y+ny*12;
  return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)}) scale(${sc})">`+
    `<path d="M24 -30 L36 -40 L32 -22 Z" fill="${WARM}" stroke="${NAVY}" stroke-width="4" stroke-linejoin="round"/>`+
    `<ellipse cx="2" cy="-20" rx="30" ry="19" fill="${WARM}" stroke="${NAVY}" stroke-width="5"/>`+
    `<circle cx="-18" cy="-46" r="16" fill="${WARM}" stroke="${NAVY}" stroke-width="5"/>`+
    `<path d="M-32 -46 L-48 -42 L-32 -38 Z" fill="#ff9f43" stroke="${NAVY}" stroke-width="4" stroke-linejoin="round"/>`+
    `<circle cx="-22" cy="-50" r="3.5" fill="${NAVY}"/><path d="M-4 -22 q10 8 20 0" fill="none" stroke="${NAVY}" stroke-width="4"/></g>`;
}
function mkPts(T){
  const [fx,fy]=nose((T.mkd0||0)+(T.os-(T.mkos0||0)));
  if(T._hs0==null||T._hx!=T.mkx){T._hx=T.mkx;window._HS0=window._HSX==T.mkx?window._HS0:sTop(T.mkx);window._HSX=T.mkx;}
  const hp=at(window._HS0+(T.o-(T.mko0||0)));
  return {fx:fx+35,fy,hx:hp.x,hy:hp.y};
}
function markers(T){
  const m=T.mk||0;if(m<0.02)return '';
  const P=mkPts(T);
  const lean=(T.lagS||0);
  let s=`<g opacity="${m}"><path d="M${P.hx} ${P.hy} L${P.fx+14} ${P.fy-30}" stroke="${CORALD}" stroke-width="6" stroke-dasharray="14 10"/><path d="M${P.fx-8} ${P.fy-2} h46 q6 0 6 -8 q0 -12 -14 -14 l-14 -4 v-34 h-24 Z" fill="${NAVY}"/>`;
  s+=`<g transform="translate(${P.hx} ${P.hy}) rotate(-30)"><path d="M-30 -2 Q-30 -30 0 -30 Q30 -30 30 -2 Z" fill="${NAVY}"/><path d="M-12 -10 V-24 M0 -10 V-26 M12 -10 V-24" stroke="${IVORY}" stroke-width="4" stroke-linecap="round"/><rect x="-10" y="-62" width="20" height="36" rx="8" fill="${NAVY}"/></g></g>`;
  return s;
}
function anchors(T){
  const P=(T.mk||0)>0.02?mkPts(T):{fx:0,fy:0,hx:0,hy:0};
  const rx=T.retX==null?0:T.retX,dk=T.duck!=null&&T.duck>=0?at(T.duck):{x:0,y:0},tp=at(sTopCache.tr);
  return {hand:{x:528,y:392},top:{x:tp.x,y:tp.y-12},loop:{x:-80,y:176},steps:{x:-140,y:420},rail:{x:-140,y:93},
    upend:{x:-708,y:-110},rollers:{x:-668,y:-138},ret:{x:rx,y:-60+(rx+550)*0.577},wheel:{x:500,y:560},press:{x:462,y:476},
    motor:{x:330,y:805},chain:{x:466,y:680},sprocket:{x:510,y:805},mfoot:{x:P.fx+10,y:P.fy-40},mhand:{x:P.hx,y:P.hy-60},duck:{x:dk.x,y:dk.y-40},newel:{x:592,y:450}};
}
const sTopCache={mid:S_MID,tr:sTop(-150)};
window.PROPS={labelY:5000,
  draw(T,f){PROPS.labelY=T.ly==null?5000:T.ly;
    const xr=T.xr||0;
    let svg=truss(T)+pit(T,f)+steps(T)+rail(T,f)+panel(T);
    if(xr>0.02)svg+=`<g opacity="${xr.toFixed(3)}">`+chain(T,f)+drive(T,f)+rail(T,f)+`</g>`;
    svg+=lightDash(T,f)+duckSVG(T)+markers(T);
    return {svg,anchors:anchors(T)};},
  grip(T){if(T.g=='duck'){return {x:556,y:340};}return {x:528,y:384};}};
