// Episode 018 props: a classic round wall thermostat behind a clear cover (a flat brass-and-steel spiral coil fixed at
// the center, its free end carrying a little arm with a ball tip, a steel contact post on the dial ring, a set pointer),
// a furnace on the floor (flame window, warm-air vent), one wire from the thermostat to the furnace with current dots,
// a wall window (night sky; sun and a light beam for the "fooled" gag; a cold draft), and a bimetal strip close-up card
// (brass on top, steel below; it curls toward the brass side in the cold).
// Contract: window.PROPS = {draw(T,f)->{svg, anchors}, grip(T)->{x,y}, labelY}
// T: c (coil cold 0..1, 0.6 = touching the contact at dial 0), dial (deg, rotates contact and pointer), spark (0..1),
//    fl (furnace flame 0..1), amp (wire current 0..1), cold (cold-air wisps 0..1), sun (0..1), wind (0..1),
//    strip (card 0..1), bend (strip curl 0..1), sweat (0..1), shiver (0..1), hx, hy (host head world point)
const BRASS='#f2b134',BRASS2='#c98a12',STEEL='#a7afc0',STEEL2='#6f7890',FIRE='#ff8a1f',HOT='#ffd45c',ICE='#7fc4ff',WALL='#f3efe0';
const TX=420,TY=220,R=120;
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function F(v){return v.toFixed(1);}
function deg(a){return a*Math.PI/180;}
const PHI0=-60;               // contact angle (deg) at dial 0, measured clockwise from +x in screen space
const KSW=200;                // degrees of tip swing per unit of c
function tipAng(T){const a=PHI0+KSW*((T.c||0)-0.6);return Math.min(a,PHI0+(T.dial||0));}
function touching(T){return PHI0+KSW*((T.c||0)-0.6)>=PHI0+(T.dial||0)-0.5;}
function spiral(T,off){
  const ta=deg(tipAng(T)),turns=2.4,A0=ta-turns*2*Math.PI;let d='';
  for(let i=0;i<=120;i++){const t=i/120,th=A0+(ta-A0)*t,r=12+54*t+off;d+=`${i?'L':'M'}${F(TX+Math.cos(th)*r)} ${F(TY+Math.sin(th)*r)} `;}
  return d;
}
function thermostat(T,f){
  let s='';
  // wall plate shadow and body
  s+=`<circle cx="${TX+8}" cy="${TY+10}" r="${R+6}" fill="${NAVY}" opacity=".12"/>`;
  s+=`<circle cx="${TX}" cy="${TY}" r="${R}" fill="${IVORY}" stroke="${NAVY}" stroke-width="9"/>`;
  // dial ring with ticks, rotated by the dial
  const dl=T.dial||0;
  s+=`<g transform="rotate(${F(dl)} ${TX} ${TY})"><circle cx="${TX}" cy="${TY}" r="${R-16}" fill="none" stroke="${BLUE}" stroke-width="14"/>`;
  for(let k=-6;k<=6;k++){const a=deg(PHI0-90+k*12+180);s+=`<path d="M${F(TX+Math.cos(a)*(R-23))} ${F(TY+Math.sin(a)*(R-23))} L${F(TX+Math.cos(a)*(R-9))} ${F(TY+Math.sin(a)*(R-9))}" stroke="${IVORY}" stroke-width="${k%3?3:6}"/>`;}
  // set pointer (bottom of the ring)
  const pa=deg(PHI0+180);
  s+=`<path d="M${F(TX+Math.cos(pa)*(R-30))} ${F(TY+Math.sin(pa)*(R-30))} L${F(TX+Math.cos(pa+0.13)*(R+4))} ${F(TY+Math.sin(pa+0.13)*(R+4))} L${F(TX+Math.cos(pa-0.13)*(R+4))} ${F(TY+Math.sin(pa-0.13)*(R+4))} Z" fill="${NAVY}"/>`;
  // contact post on the ring
  const ca=deg(PHI0),cx=TX+Math.cos(ca)*84,cy=TY+Math.sin(ca)*84;
  s+=`</g>`;
  // window behind the cover
  s+=`<circle cx="${TX}" cy="${TY}" r="${R-26}" fill="#eef3ff" stroke="${NAVY}" stroke-width="4"/>`;
  // contact post, carried by the dial
  s+=`<g transform="rotate(${F(dl)} ${TX} ${TY})"><path d="M${F(TX+Math.cos(ca)*84)} ${F(TY+Math.sin(ca)*84)} L${F(TX+Math.cos(ca)*100)} ${F(TY+Math.sin(ca)*100)}" stroke="${NAVY}" stroke-width="8"/><g transform="rotate(${F(PHI0+90)} ${F(cx)} ${F(cy)})"><rect x="${F(cx-10)}" y="${F(cy-14)}" width="20" height="28" rx="4" fill="${STEEL}" stroke="${NAVY}" stroke-width="5"/></g></g>`;
  // coil: navy outline, steel outside, brass inside
  s+=`<path d="${spiral(T,0)}" fill="none" stroke="${NAVY}" stroke-width="17" stroke-linecap="round" stroke-linejoin="round"/>`;
  s+=`<path d="${spiral(T,2.6)}" fill="none" stroke="${STEEL}" stroke-width="5.5" stroke-linecap="round"/>`;
  s+=`<path d="${spiral(T,-2.6)}" fill="none" stroke="${BRASS}" stroke-width="5.5" stroke-linecap="round"/>`;
  s+=`<circle cx="${TX}" cy="${TY}" r="9" fill="${NAVY}"/>`;
  // arm and ball tip
  const ta=deg(tipAng(T)),ax=TX+Math.cos(ta)*66,ay=TY+Math.sin(ta)*66,bx=TX+Math.cos(ta)*76,by=TY+Math.sin(ta)*76;
  s+=`<path d="M${F(ax)} ${F(ay)} L${F(bx)} ${F(by)}" stroke="${NAVY}" stroke-width="9" stroke-linecap="round"/><circle cx="${F(bx)}" cy="${F(by)}" r="8" fill="${BRASS}" stroke="${NAVY}" stroke-width="4"/>`;
  // spark when touching
  const sp=touching(T)?(T.spark||0):0;
  if(sp>0.02){const cxx=TX+Math.cos(deg(PHI0+(T.dial||0)))*80,cyy=TY+Math.sin(deg(PHI0+(T.dial||0)))*80,z=17+5*Math.sin(f*1.7);
    s+=`<g opacity="${sp.toFixed(2)}"><circle cx="${F(cxx)}" cy="${F(cyy)}" r="${F(z*2)}" fill="${HOT}" opacity=".45"/>`;
    for(let k=0;k<6;k++){const a=k/6*Math.PI*2+f*0.3;s+=`<path d="M${F(cxx+Math.cos(a)*z*0.6)} ${F(cyy+Math.sin(a)*z*0.6)} L${F(cxx+Math.cos(a)*z*1.9)} ${F(cyy+Math.sin(a)*z*1.9)}" stroke="${HOT}" stroke-width="5" stroke-linecap="round"/>`;}
    s+=`</g>`;}
  // clear cover glint
  s+=`<path d="M${TX-70} ${TY-50} Q${TX-40} ${TY-88} ${TX+5} ${TY-92}" stroke="${IVORY}" stroke-width="9" fill="none" stroke-linecap="round" opacity=".8"/>`;
  return s;
}
function furnace(T,f){
  const x0=80,x1=300,y0=430,y1=700,fl=T.fl||0;
  let s=`<rect x="${x0}" y="${y0}" width="${x1-x0}" height="${y1-y0}" rx="14" fill="${IVORY}" stroke="${NAVY}" stroke-width="8"/>`;
  s+=`<rect x="${x0+20}" y="${y0+24}" width="${x1-x0-40}" height="70" rx="8" fill="${WALL}" stroke="${NAVY}" stroke-width="5"/>`;
  for(let k=0;k<5;k++)s+=`<path d="M${x0+36} ${y0+38+k*11} L${x1-36} ${y0+38+k*11}" stroke="${NAVY}" stroke-width="3" opacity=".55"/>`;
  // flame window
  const wx=130,wy=560,ww=120,wh=95;
  s+=`<rect x="${wx}" y="${wy}" width="${ww}" height="${wh}" rx="10" fill="${fl>0.05?'#3a1a10':NAVY}" stroke="${NAVY}" stroke-width="6"/>`;
  if(fl>0.02){for(let k=0;k<5;k++){const fx=wx+14+k*23,h=(38+16*Math.sin(f*0.9+k*1.3))*fl;
      s+=`<path d="M${fx} ${wy+wh-12} Q${fx+3} ${wy+wh-12-h*0.6} ${fx+10} ${wy+wh-12-h} Q${fx+17} ${wy+wh-12-h*0.6} ${fx+20} ${wy+wh-12} Z" fill="${FIRE}"/>`+
        `<path d="M${fx+5} ${wy+wh-12} Q${fx+8} ${wy+wh-12-h*0.4} ${fx+10} ${wy+wh-12-h*0.6} Q${fx+12} ${wy+wh-12-h*0.4} ${fx+15} ${wy+wh-12} Z" fill="${HOT}"/>`;}
    s+=`<rect x="${wx+6}" y="${wy+wh-14}" width="${ww-12}" height="8" rx="3" fill="${BLUE}"/>`;}
  // vent on top with warm air
  s+=`<rect x="100" y="${y0-26}" width="80" height="28" rx="5" fill="${STEEL}" stroke="${NAVY}" stroke-width="5"/>`;
  if(fl>0.02){for(let k=0;k<3;k++){const ph=((f*0.035+k/3)%1),y=y0-40-ph*150,x=120+k*20;
      s+=`<path d="M${x} ${F(y)} q-12 -18 0 -36 q12 -18 0 -36" fill="none" stroke="${FIRE}" stroke-width="6" stroke-linecap="round" opacity="${(fl*(1-ph)).toFixed(2)}"/>`;}}
  return s;
}
function wire(T,f){
  const pts=[[TX-20,TY+R-4],[TX-20,395],[250,395],[250,404]];
  const d=pts.map((p,i)=>`${i?'L':'M'}${p[0]} ${p[1]}`).join(' ');
  let s=`<path d="${d}" fill="none" stroke="${NAVY}" stroke-width="8" stroke-linejoin="round"/>`;
  const a=T.amp||0;
  if(a>0.02){const L=[];let tot=0;for(let i=1;i<pts.length;i++){const l=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]);L.push(l);tot+=l;}
    for(let k=0;k<6;k++){let u=((f*0.025+k/6)%1)*tot,i=0;while(i<L.length-1&&u>L[i]){u-=L[i];i++;}const t=u/L[i];
      const x=pts[i][0]+(pts[i+1][0]-pts[i][0])*t,y=pts[i][1]+(pts[i+1][1]-pts[i][1])*t;
      s+=`<circle cx="${F(x)}" cy="${F(y)}" r="9" fill="${HOT}" stroke="${NAVY}" stroke-width="3" opacity="${a.toFixed(2)}"/>`;}}
  return s;
}
function windowView(T,f){
  const x0=70,x1=250,y0=-180,y1=10,sun=T.sun||0;
  let s=`<rect x="${x0}" y="${y0}" width="${x1-x0}" height="${y1-y0}" rx="10" fill="${sun>0.02?'#9fd0ff':'#16297a'}"/>`;
  if(sun<0.98)for(const [x,y] of [[100,-150],[200,-120],[150,-60],[225,-30],[110,-20]])s+=`<circle cx="${x}" cy="${y}" r="3.5" fill="${IVORY}" opacity="${(0.8*(1-sun)).toFixed(2)}"/>`;
  if(sun>0.02)s+=`<g opacity="${sun.toFixed(2)}"><circle cx="190" cy="-120" r="36" fill="${HOT}" stroke="${BRASS2}" stroke-width="5"/></g>`;
  s+=`<path d="M${(x0+x1)/2} ${y0} L${(x0+x1)/2} ${y1} M${x0} ${(y0+y1)/2} L${x1} ${(y0+y1)/2}" stroke="${NAVY}" stroke-width="7"/>`;
  s+=`<rect x="${x0}" y="${y0}" width="${x1-x0}" height="${y1-y0}" rx="10" fill="none" stroke="${NAVY}" stroke-width="9"/>`;
  s+=`<rect x="${x0-14}" y="${y1}" width="${x1-x0+28}" height="16" rx="5" fill="${IVORY}" stroke="${NAVY}" stroke-width="6"/>`;
  return s;
}
function beam(T,f){
  const sun=T.sun||0;if(sun<0.02)return '';
  return `<path d="M175 -100 L215 -150 L${TX+R} ${TY-40} L${TX-40} ${TY+R} Z" fill="${HOT}" opacity="${(0.4*sun).toFixed(2)}"/>`+
    `<circle cx="${TX}" cy="${TY}" r="${R+18}" fill="${HOT}" opacity="${(0.18*sun).toFixed(2)}"/>`;
}
function wisps(col,op,x,y,f,dir){
  if(op<0.02)return '';let s='';
  for(let k=0;k<4;k++){const ph=((f*0.03+k/4)%1),xx=x+dir*ph*150,yy=y+k*36;
    s+=`<path d="M${F(xx)} ${F(yy)} q${dir*20} -16 ${dir*40} 0 q${dir*20} 16 ${dir*40} 0" fill="none" stroke="${col}" stroke-width="7" stroke-linecap="round" opacity="${(op*Math.sin(ph*Math.PI)).toFixed(2)}"/>`;}
  return s;
}
function strip(T,f){
  const op=T.strip||0;if(op<0.02)return '';
  const cx0=250,cy0=70,cw=310,ch=300,x0=285,y0=275,L=225,b=T.bend||0,k=b/190;
  let s=`<g opacity="${clamp(op*1.4,0,1).toFixed(2)}"><rect x="${cx0}" y="${cy0}" width="${cw}" height="${ch}" rx="26" fill="${IVORY}" stroke="${NAVY}" stroke-width="9"/>`;
  const pt=(u,off)=>{const a=k*u;if(k<1e-4)return [x0+u,y0+off];return [x0+Math.sin(a)/k+off*Math.sin(a),y0-(1-Math.cos(a))/k+off*Math.cos(a)];};
  const line=off=>{let d='';for(let i=0;i<=40;i++){const p=pt(L*i/40,off);d+=`${i?'L':'M'}${F(p[0])} ${F(p[1])} `;}return d;};
  s+=`<path d="${line(0)}" stroke="${NAVY}" stroke-width="40" fill="none" stroke-linecap="round"/>`;
  s+=`<path d="${line(-8)}" stroke="${BRASS}" stroke-width="14" fill="none" stroke-linecap="round"/>`;
  s+=`<path d="${line(8)}" stroke="${STEEL}" stroke-width="14" fill="none" stroke-linecap="round"/>`;
  s+=`<rect x="${x0-30}" y="${y0-36}" width="34" height="72" rx="6" fill="${NAVY}"/>`;
  // snowflakes when cold
  for(const [x,y,z] of [[505,110,16],[440,128,11],[530,190,12]]){const o=b;if(o<0.05)continue;
    s+=`<g opacity="${o.toFixed(2)}" stroke="${ICE}" stroke-width="5" stroke-linecap="round">`;
    for(let a=0;a<3;a++){const r=deg(a*60+f*2);s+=`<path d="M${F(x-Math.cos(r)*z)} ${F(y-Math.sin(r)*z)} L${F(x+Math.cos(r)*z)} ${F(y+Math.sin(r)*z)}"/>`;}
    s+=`</g>`;}
  return s+`</g>`;
}
function hostFx(T,f){
  let s='';const hx=T.hx||700,hy=T.hy||150;
  const sw=T.sweat||0;
  if(sw>0.02)for(let k=0;k<3;k++){const ph=((f*0.05+k/3)%1),x=hx+118+k*14,y=hy-40+ph*60;
    s+=`<path d="M${x} ${F(y)} q-10 16 0 22 q10 -6 0 -22 Z" fill="${ICE}" stroke="${NAVY}" stroke-width="3" opacity="${(sw*(1-ph)).toFixed(2)}"/>`;}
  const sh=T.shiver||0;
  if(sh>0.02)for(const [dx,dy,z] of [[-150,-60,14],[135,-100,12],[150,10,10]]){const x=hx+dx,y=hy+dy;
    s+=`<g opacity="${sh.toFixed(2)}" stroke="${ICE}" stroke-width="5" stroke-linecap="round">`;
    for(let a=0;a<3;a++){const r=deg(a*60+f*3);s+=`<path d="M${F(x-Math.cos(r)*z)} ${F(y-Math.sin(r)*z)} L${F(x+Math.cos(r)*z)} ${F(y+Math.sin(r)*z)}"/>`;}
    s+=`</g>`;}
  return s;
}
window.PROPS={labelY:-60,
  grip:T=>({x:TX+R+6,y:TY+20}),
  draw(T,f){
    let s=`<rect x="-400" y="-1000" width="2200" height="1700" fill="${WALL}" opacity=".55"/>`;
    s+=windowView(T,f)+wire(T,f)+furnace(T,f)+beam(T,f)+thermostat(T,f);
    s+=wisps(ICE,T.cold||0,TX-R-150,TY-70,f,1);
    s+=wisps(ICE,T.wind||0,240,-120,f,1);
    s+=strip(T,f)+hostFx(T,f);
    const ta=deg(tipAng(T)),ca=deg(PHI0+(T.dial||0)),b=T.bend||0,k=b/190;
    const sp=u=>{const a=k*u;return k<1e-4?[285+u,275]:[285+Math.sin(a)/k,275-(1-Math.cos(a))/k];},s1=sp(200),s2=sp(80);
    const anchors={coil:{x:TX-40,y:TY+20},tip:{x:TX+Math.cos(ta)*76,y:TY+Math.sin(ta)*76},contact:{x:TX+Math.cos(ca)*84,y:TY+Math.sin(ca)*84},
      brass:{x:s1[0],y:s1[1]-8},steel:{x:s2[0],y:s2[1]+10},furnace:{x:190,y:600},wire:{x:330,y:395},dial:{x:TX,y:TY+R-14},
      sun:{x:190,y:-120},thermo:{x:TX,y:TY-R},window:{x:160,y:-90}};
    return {svg:s,anchors};
  }};
