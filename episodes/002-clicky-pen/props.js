// Episode 002 props: x-ray click pen (button/plunger, rotating cam with ribs, fixed stops, spring on refill).
// Contract: window.PROPS = {draw(T,f)->{svg, anchors}, grip(T)->{x,y}, labelY}
// T.h = cam height above its lowest point (px), T.u = cam rotation (deg). Two ribs, 180 deg apart.
const PX=520,BT=300,BB=580,TO=622,RO=52,RI=46,Y0=380,VO=45;
const L=14,HN=34,HB=30,HG=70;
function R(u){const m=((u%180)+180)%180;if(m<90)return L+(HN-L)*m/90;if(m<140)return L+(HB-L)*(m-90)/50;return HB+(HG-HB)*(m-140)/40;}
function px(u,r){return PX+r*Math.sin((u-VO)*Math.PI/180);}
function vis(u){return Math.cos((u-VO)*Math.PI/180);}
function geo(T){const top=Y0-T.h;return {top,btn:top-96,camB:top+58,tip:top+58+242,col:top+58+242-130};}
function ridges(){
  let s='';
  for(let k=-1;k<=2;k++){const a=180*k,b=a+140;const lo=Math.max(a,VO-88),hi=Math.min(b,VO+88);if(hi<=lo)continue;
    let d=`M${px(lo,RI)} ${BT}`;for(let u=lo;u<=hi;u+=2)d+=` L${px(u,RI)} ${Y0-R(Math.min(u,b-0.01))}`;
    d+=` L${px(hi,RI)} ${Y0-R(hi-0.01)} L${px(hi,RI)} ${BT} Z`;
    s+=`<path d="${d}" fill="${NAVY}" fill-opacity=".5" stroke="${NAVY}" stroke-width="4" stroke-linejoin="round"/>`;}
  return s;
}
function ribs(T,g){
  let s='';
  for(const u of [T.u,T.u+180,T.u-180,T.u+360]){if(vis(u)<0.08||vis(u-20)<-0.2)continue;
    const pts=[];const lo=u-20;
    pts.push([px(lo,RI),g.top+40]);pts.push([px(lo,RI),g.top+12]);
    for(let i=1;i<=5;i++){const uu=lo+i*4;pts.push([px(uu,RI),g.top+12-12*i/5]);}
    pts.push([px(u,RI),g.top+40]);
    s+=`<path d="M${pts.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' L')} Z" fill="${BLUE}" stroke="${NAVY}" stroke-width="4" stroke-linejoin="round"/>`;}
  return s;
}
function frontRib(T){let best=T.u,bv=-2;for(const u of [T.u,T.u+180,T.u-180]){if(vis(u)>bv){bv=vis(u);best=u;}}return best;}
function penSVG(T,f){
  const g=geo(T);let s='';
  // stand
  s+=`<rect x="370" y="684" width="120" height="16" rx="6" fill="${IVORY}" stroke="${NAVY}" stroke-width="6"/>`;
  s+=`<line x1="430" y1="686" x2="430" y2="478" stroke="${NAVY}" stroke-width="10" stroke-linecap="round"/><line x1="430" y1="478" x2="${PX-RO}" y2="478" stroke="${NAVY}" stroke-width="10" stroke-linecap="round"/>`;
  // barrel back (x-ray)
  const body=`M${PX-RO} ${BT} H${PX+RO} V${BB} L${PX+14} ${TO} H${PX-14} L${PX-RO} ${BB} Z`;
  s+=`<path d="${body}" fill="${TINT}"/>`;
  s+=`<clipPath id="pen"><path d="${body}"/></clipPath><g clip-path="url(#pen)">`;
  // refill + ink
  s+=`<rect x="${PX-9}" y="${g.camB-4}" width="18" height="${g.tip-24-g.camB+4}" fill="${IVORY}" stroke="${NAVY}" stroke-width="5"/>`;
  s+=`<rect x="${PX-3.5}" y="${g.camB+14}" width="7" height="${g.tip-46-g.camB}" fill="${BLUE}"/>`;
  // collar + spring
  s+=`<rect x="${PX-20}" y="${g.col}" width="40" height="12" rx="4" fill="${IVORY}" stroke="${NAVY}" stroke-width="5"/>`;
  const sp0=g.col+12,sp1=BB-2,n=7;let d=`M${PX-24} ${sp0}`;for(let i=1;i<=n*2;i++)d+=` L${PX+(i%2?24:-24)} ${sp0+(sp1-sp0)*i/(n*2)}`;
  s+=`<path d="${d}" fill="none" stroke="${NAVY}" stroke-width="5" stroke-linejoin="round"/>`;
  // cam core + rotation stripes
  s+=`<rect x="${PX-30}" y="${g.top}" width="60" height="58" rx="6" fill="${BLUE}" stroke="${NAVY}" stroke-width="5"/>`;
  for(let k=0;k<4;k++){const u=T.u+45+90*k;if(vis(u)>0.15)s+=`<line x1="${px(u,30)}" y1="${g.top+8}" x2="${px(u,30)}" y2="${g.top+50}" stroke="${IVORY}" stroke-width="${2+3*vis(u)}" opacity=".7" stroke-linecap="round"/>`;}
  // plunger (button) with sawtooth bottom
  let pl=`M${PX-26} ${g.btn+14} Q${PX-26} ${g.btn} ${PX-12} ${g.btn} H${PX+12} Q${PX+26} ${g.btn} ${PX+26} ${g.btn+14} V${g.top+2}`;
  for(let i=0;i<4;i++){const x0=PX+26-i*13;pl+=` L${x0-6.5} ${g.top+10} L${x0-13} ${g.top+2}`;}
  pl+=' Z';
  s+=`<path d="${pl}" fill="${IVORY}" stroke="${NAVY}" stroke-width="5" stroke-linejoin="round"/>`;
  // fixed stops + cam ribs
  s+=ridges();
  s+=ribs(T,g);
  s+=`</g>`;
  // button part above the barrel (drawn over the cap)
  s+=`<rect x="${PX-RO-6}" y="${BT-12}" width="${2*RO+12}" height="22" rx="10" fill="${IVORY}" stroke="${NAVY}" stroke-width="8"/>`;
  if(g.btn<BT-12){s+=`<path d="M${PX-26} ${BT-12} V${g.btn+14} Q${PX-26} ${g.btn} ${PX-12} ${g.btn} H${PX+12} Q${PX+26} ${g.btn} ${PX+26} ${g.btn+14} V${BT-12}" fill="${IVORY}" stroke="${NAVY}" stroke-width="8" stroke-linejoin="round"/>`;}
  // writing tip (outside the cone when out)
  s+=`<path d="M${PX-9} ${g.tip-24} L${PX-4} ${g.tip-5} H${PX+4} L${PX+9} ${g.tip-24} Z" fill="${NAVY}"/><circle cx="${PX}" cy="${g.tip-3}" r="5" fill="${NAVY}"/>`;
  // barrel outline, grip band, clip
  s+=`<path d="${body}" fill="none" stroke="${NAVY}" stroke-width="10" stroke-linejoin="round"/>`;
  s+=`<path d="M${PX-RO+4} ${BB-46} H${PX+RO-4}" stroke="${NAVY}" stroke-width="4" opacity=".5"/>`;
  s+=`<path d="M${PX+RO+2} ${BT+4} H${PX+RO+16} V${BT+122} Q${PX+RO+16} ${BT+138} ${PX+RO+6} ${BT+136}" fill="none" stroke="${NAVY}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`;
  return {svg:s,g};
}
function anchors(T,g){const fu=frontRib(T);
  return {button:{x:PX,y:g.btn+14},cam:{x:PX,y:g.top+34},stops:{x:px(20,RI),y:BT+18},spring:{x:PX,y:(g.col+BB)/2},tip:{x:PX,y:g.tip},
    rib:{x:px(fu-6,RI),y:g.top+10},step:{x:px(90,RI),y:Y0-HN},slot:{x:px(343,RI),y:Y0-HG+6}};}
window.PROPS={labelY:170,
  draw(T,f){const t=penSVG(T,f);return {svg:t.svg,anchors:anchors(T,t.g)};},
  grip(T){const g=geo(T);return {x:PX+6,y:g.btn-6};}};
