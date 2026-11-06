// Long-form 01 props: Thanksgiving dinner, fixed with science. Reusable by the week's Shorts.
// Scenes along x (each centered near world y 400; camera w ~1000, cy ~560):
//  TK  x 600   roast turkey on a platter: pop-up timer, thermometer, x-ray temps, myoglobin legs, spatchcock, foil + carryover
//  TM  x 3000  pop-up timer cross-section: spring held by a soft-metal blob that melts, stick shoots up; sprinkler cousin
//  TH  x 5000  thawing: counter bird (warm danger rim, frozen core) vs fridge bird; danger-zone gauge 40 to 140 F
//  ST  x 7000  stuffing inside the bird lags behind the breast; then its own dish
//  PI  x 9000  pumpkin pie: wobble, egg-protein net tightening, crack; blind bake with pie weights, soggy bottom
//  GR  x 11000 gravy pan: flour lumps (gel shell, dry core) vs smooth whisk
//  PO  x 13000 potato cells: starch bags, gentle mash vs blender burst, glue strands
//  CR  x 15000 cranberry jelly wobble + pectin net
//  CX  x 17000 the crash: plate pile + calorie counter, Zzz, innocent turkey, amino-acid line at the brain gate
// Contract: window.PROPS = {draw(T,f)->{svg, anchors}, grip(T)->{x,y}, labelY}
const GOLD='#e0973f',GOLDD='#a85f22',SKIN='#f2c77e',RED='#e8433a',FROST='#bfe3ff',ICE='#7cc4ff',FOIL='#d8dde8',
      PUMP='#f08a24',CRUST='#e9b872',GRAVY='#8a5428',POT='#fbefc4',CRAN='#c8143c',WARM2='#ffd84a',COUNTER='#e8e1d0';
const F2='font-family="DejaVu Sans, sans-serif"';
function cl(v,a,b){return Math.max(a,Math.min(b,v));}
function lerp(a,b,u){return a+(b-a)*u;}
function txt(x,y,s,size,fill,extra){return `<text x="${x}" y="${y}" font-size="${size}" font-weight="900" fill="${fill||NAVY}" text-anchor="middle" stroke="#fdfcf1" stroke-width="${size/5}" paint-order="stroke" ${F2} ${extra||''}>${s}</text>`;}
function plate(cx,cy,rx){return `<ellipse cx="${cx}" cy="${cy+10}" rx="${rx}" ry="${rx*0.2}" fill="${NAVY}" opacity=".15"/><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${rx*0.2}" fill="${IVORY}" stroke="${NAVY}" stroke-width="6"/><ellipse cx="${cx}" cy="${cy-4}" rx="${rx*0.78}" ry="${rx*0.13}" fill="none" stroke="${TINT}" stroke-width="6"/>`;}
function thermo(x,y,temp,o,lab){ // instant-read thermometer: probe goes down-left from a round dial at (x,y)
  if(o<0.01)return '';
  const t=Math.round(temp), hot=t>=165, col=t>=180?RED:(hot?'#2aa84a':BLUE);
  return `<g opacity="${o}"><line x1="${x}" y1="${y}" x2="${x-70}" y2="${y+150}" stroke="${NAVY}" stroke-width="12" stroke-linecap="round"/><line x1="${x}" y1="${y}" x2="${x-66}" y2="${y+142}" stroke="${FOIL}" stroke-width="6" stroke-linecap="round"/>`+
    `<rect x="${x-78}" y="${y-62}" width="156" height="78" rx="20" fill="${NAVY}"/><rect x="${x-66}" y="${y-52}" width="132" height="58" rx="12" fill="#eaffea"/>`+
    `<text x="${x}" y="${y-8}" font-size="42" font-weight="900" fill="${col}" text-anchor="middle" ${F2}>${t}°</text>`+(lab?txt(x,y-78,lab,30):'')+`</g>`;
}
function zz(x,y,f,o){if(o<0.01)return '';let s='';for(let i=0;i<3;i++){const p=((f/30+i/3)%1);s+=`<text x="${x+p*60+i*8}" y="${y-p*120}" font-size="${34+p*30}" font-weight="900" fill="${BLUE}" opacity="${o*(1-p)}" ${F2}>Z</text>`;}return s;}
// ---------------- the bird ----------------
function bird(cx,cy,T,f,opt){ // side view roast turkey; opt: {flat, myo, xr, cut}
  const fl=opt.flat||0, sx=1+0.45*fl, sy=1-0.42*fl, k=opt.k||1;
  let s=`<g transform="translate(${cx} ${cy}) scale(${k})">`;
  const legx=230+90*fl, legy=40+40*fl, myo=opt.myo||0;
  const legC=myo>0?`rgb(${lerp(224,170,myo)|0},${lerp(151,40,myo)|0},${lerp(63,50,myo)|0})`:GOLD;
  const brC=myo>0?`rgb(${lerp(224,250,myo)|0},${lerp(151,226,myo)|0},${lerp(63,190,myo)|0})`:GOLD;
  for(const sg of [-1,1]){ // drumsticks
    const a=sg*(28+30*fl);
    s+=`<g transform="translate(${sg*legx*0.78} ${legy}) rotate(${a})"><ellipse cx="0" cy="-30" rx="78" ry="104" fill="${legC}" stroke="${NAVY}" stroke-width="7"/>`+
      `<rect x="-14" y="-200" width="28" height="80" rx="12" fill="${IVORY}" stroke="${NAVY}" stroke-width="6"/>`+
      `<path d="M-26 -200 l8 -26 l9 18 l9 -22 l9 22 l9 -18 l8 26 Z" fill="${IVORY}" stroke="${NAVY}" stroke-width="5" stroke-linejoin="round"/></g>`;
  }
  s+=`<g transform="scale(${sx} ${sy})"><ellipse cx="0" cy="0" rx="250" ry="170" fill="${brC}" stroke="${NAVY}" stroke-width="8"/>`+
     `<path d="M-170 -70 Q-60 -150 90 -120" fill="none" stroke="#fff3c8" stroke-width="18" stroke-linecap="round" opacity=".7"/>`+
     `<path d="M120 20 q60 30 40 80" fill="none" stroke="${GOLDD}" stroke-width="8" stroke-linecap="round"/></g>`;
  const xr=opt.xr||0;
  if(xr>0.01){ // x-ray: breast zone (top) and thigh zones
    s+=`<g opacity="${xr}"><ellipse cx="0" cy="${-60*sy}" rx="${170*sx}" ry="${80*sy}" fill="${WATER}" opacity=".55" stroke="${BLUE}" stroke-width="5" stroke-dasharray="14 10"/>`;
    for(const sg of [-1,1])s+=`<ellipse cx="${sg*legx*0.78}" cy="${legy-20}" rx="70" ry="80" fill="${RED}" opacity=".45" stroke="${RED}" stroke-width="5" stroke-dasharray="14 10"/>`;
    s+=`</g>`;
  }
  return s+`</g>`;
}
function popTimer(x,y,u,k){ // small timer stuck in the bird; u 0..1 = stick out
  k=k||1;return `<g transform="translate(${x} ${y}) scale(${k})"><rect x="-16" y="${-30-70*u}" width="32" height="${40+70*u}" rx="10" fill="${RED}" stroke="${NAVY}" stroke-width="6"/><ellipse cx="0" cy="8" rx="34" ry="12" fill="${IVORY}" stroke="${NAVY}" stroke-width="6"/></g>`;
}
function sTK(T,f,A){
  let s=`<rect x="-200" y="-1400" width="1600" height="2800" fill="#fdf4e3"/><rect x="-200" y="640" width="1600" height="900" fill="${COUNTER}"/><line x1="-200" y1="640" x2="1400" y2="640" stroke="${NAVY}" stroke-width="6"/>`;
  s+=plate(600,580,430);
  const pu=T.pop||0;
  s+=bird(600,430,T,f,{flat:T.flat||0,myo:T.myo||0,xr:T.xr||0});
  const fl=T.flat||0;
  if(fl<0.5)s+=popTimer(640,270+fl*80,pu);
  if(pu>0.6&&(T.popfx||0)>0.01)s+=txt(780,170,'POP!',80,RED,`opacity="${T.popfx}" transform="rotate(-10 780 170)"`);
  s+=thermo(560,170,T.temp||0,T.therm||0,'BREAST');
  s+=thermo(930,300,T.ttemp||0,T.therm2||0,'THIGH');
  const fo=T.foil||0;
  if(fo>0.01){s+=`<g opacity="${fo}"><path d="M300 560 L380 250 Q600 150 820 250 L900 560 Z" fill="${FOIL}" stroke="${NAVY}" stroke-width="7" stroke-linejoin="round"/>`+
     `<path d="M420 280 L470 520 M560 220 L580 520 M700 230 L690 520" stroke="#ffffff" stroke-width="8" opacity=".8"/></g>`;}
  const ca=T.carry||0;
  if(ca>0.01){for(let i=0;i<8;i++){const a=i/8*Math.PI*2, p=((f/24+i*0.13)%1), r0=300-p*170, x=600+Math.cos(a)*r0*1.2, y=420+Math.sin(a)*r0*0.75, ex=600+Math.cos(a)*(r0-50)*1.2, ey=420+Math.sin(a)*(r0-50)*0.75;
      s+=`<line x1="${x}" y1="${y}" x2="${ex}" y2="${ey}" stroke="${RED}" stroke-width="12" stroke-linecap="round" opacity="${ca*(1-p*0.6)}" marker-end="url(#ah)"/>`;}
    s=`<defs><marker id="ah" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto"><path d="M0 0 L4 2 L0 4 Z" fill="${RED}"/></marker></defs>`+s;}
  if((T.sad||0)>0.01)s+=`<g opacity="${T.sad}"><path d="M560 380 q20 -16 40 0 M640 380 q20 -16 40 0" stroke="${NAVY}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M590 440 q30 -22 60 0" stroke="${NAVY}" stroke-width="7" fill="none" stroke-linecap="round"/>${txt(330,250,'DRY',80,RED)}</g>`;
  A.timer={x:640,y:240};A.breast={x:600,y:330};A.thigh={x:820,y:450};A.legs={x:360,y:430};A.bird={x:600,y:430};A.foil={x:600,y:250};
  return s;
}
// ---------------- pop-up timer cross-section ----------------
function sTM(T,f,A){
  const X=3000,m=T.melt||0,u=cl((m-0.6)/0.25,0,1);
  let s=`<rect x="2300" y="-1400" width="1400" height="2800" fill="#fff6e8"/>`;
  // heat glow behind
  s+=`<circle cx="${X}" cy="560" r="${300}" fill="${RED}" opacity="${0.12+0.18*(T.heat||0)}"/>`;
  // housing: tube from y 160 (top flange) down to y 640
  s+=`<rect x="${X-120}" y="180" width="240" height="460" rx="40" fill="${IVORY}" stroke="${NAVY}" stroke-width="9"/>`;
  s+=`<rect x="${X-170}" y="150" width="340" height="50" rx="20" fill="${IVORY}" stroke="${NAVY}" stroke-width="9"/>`;
  // stick: bottom tip held at y 600 by the blob until it melts
  const top=200-260*u, bot=600-260*u;
  s+=`<rect x="${X-34}" y="${top-120}" width="68" height="${bot-top+120}" rx="18" fill="${RED}" stroke="${NAVY}" stroke-width="8"/>`;
  // spring: coil between y 560 (bottom seat) and the stick collar at y 260
  const y0=590,y1=lerp(330,330-260*u+0,1), n=9; let d=`M${X-80} ${y0}`;
  for(let i=1;i<=n*2;i++){const y=lerp(y0,y1-(260*u)*0,i/(n*2)), yy=lerp(y0,330-180*u,i/(n*2));d+=` L${i%2?X+80:X-80} ${yy}`;}
  s+=`<path d="${d}" fill="none" stroke="#7b86a8" stroke-width="10" stroke-linejoin="round"/>`;
  // soft-metal blob at the bottom
  const bl=1-0.75*m;
  s+=`<ellipse cx="${X}" cy="${612+m*14}" rx="${70*(0.6+0.6*m)}" ry="${38*bl}" fill="${WARM2}" stroke="${NAVY}" stroke-width="7"/>`;
  if(m>0.3&&m<0.95){for(let i=0;i<3;i++){const p=((f/16+i/3)%1);s+=`<circle cx="${X-40+i*40}" cy="${640+p*60}" r="${10*(1-p)}" fill="${WARM2}"/>`;}}
  s+=`<rect x="${X-120}" y="630" width="240" height="20" fill="${NAVY}"/>`;
  // temperature dial
  s+=thermo(X+380,360,T.ttm||70,T.dial||0,'');
  if(u>0.5)s+=txt(X+250,90,'POP!',90,RED,`transform="rotate(-10 ${X+250} 90)"`);
  // sprinkler cousin
  const sp=T.spr||0;
  if(sp>0.01){s+=`<g opacity="${sp}" transform="translate(${X-330} 300)"><rect x="-90" y="-180" width="180" height="40" fill="#9aa3bd" stroke="${NAVY}" stroke-width="6"/><rect x="-20" y="-140" width="40" height="70" fill="#9aa3bd" stroke="${NAVY}" stroke-width="6"/>`+
    `<path d="M-50 -70 H50 L30 -20 H-30 Z" fill="#c7cfe6" stroke="${NAVY}" stroke-width="6"/><ellipse cx="0" cy="-10" rx="22" ry="14" fill="${WARM2}" stroke="${NAVY}" stroke-width="5"/>`+
    `<path d="M-60 20 L-120 120 M0 20 V130 M60 20 L120 120" stroke="${ICE}" stroke-width="10" stroke-linecap="round" stroke-dasharray="18 14" opacity="${sp>0.7?1:0}"/>${txt(0,200,'SPRINKLER',34)}</g>`;}
  A.blob={x:X,y:612};A.spring={x:X+60,y:460};A.stick={x:X,y:top-60};A.spr={x:X-330,y:290};A.dial={x:X+380,y:330};
  return s;
}
// ---------------- thawing ----------------
function frozenBird(cx,cy,warm,k){ // cutaway: outer rim warms (red), inner core stays icy
  return `<g transform="translate(${cx} ${cy}) scale(${k||1})"><ellipse rx="230" ry="150" fill="${SKIN}" stroke="${NAVY}" stroke-width="8"/>`+
    `<ellipse rx="230" ry="150" fill="${RED}" opacity="${0.5*warm}"/>`+
    `<ellipse rx="${160-40*warm}" ry="${100-26*warm}" fill="${FROST}" stroke="${ICE}" stroke-width="6"/>`+
    `<path d="M-40 -20 l18 18 l-18 18 M30 -30 l14 14 l-14 14" stroke="#ffffff" stroke-width="6" fill="none"/></g>`;
}
function sTH(T,f,A){
  const X=5000;let s=`<rect x="4300" y="-1400" width="1400" height="2800" fill="#fdf4e3"/>`;
  const w=T.thaw||0, fr=T.fridge||0;
  // counter
  s+=`<rect x="4300" y="560" width="1400" height="900" fill="${COUNTER}"/><line x1="4300" y1="560" x2="5700" y2="560" stroke="${NAVY}" stroke-width="6"/>`;
  const bx=lerp(X,X-230,fr), k=lerp(1.25,0.85,fr);
  s+=frozenBird(bx,420,w,k);
  if(w>0.2)s+=txt(bx,660,'40 to 140°F',56,RED,`opacity="${cl((w-0.2)*3,0,1)}"`);
  if(w>0.5)s+=txt(bx,720,'BACTERIA ZONE',44,NAVY,`opacity="${cl((w-0.5)*3,0,1)}"`);
  // bacteria dots on the warm rim
  const bc=Math.floor(w*14);
  for(let i=0;i<bc;i++){const a=i*0.9+f/60, r=1;s+=`<circle cx="${bx+Math.cos(a)*205*k}" cy="${420+Math.sin(a)*130*k}" r="${10+3*Math.sin(f/5+i)}" fill="#3cb44b" stroke="${NAVY}" stroke-width="3"/>`;}
  if(fr>0.01){const fx=X+260;s+=`<g opacity="${fr}"><rect x="${fx-150}" y="40" width="300" height="520" rx="26" fill="${IVORY}" stroke="${NAVY}" stroke-width="9"/><rect x="${fx-120}" y="80" width="240" height="440" rx="12" fill="#e7f4ff"/>`+
     `<line x1="${fx-120}" y1="300" x2="${fx+120}" y2="300" stroke="${NAVY}" stroke-width="5"/>`+frozenBird(fx,400,0.0,0.42)+`<rect x="${fx+110}" y="200" width="14" height="90" rx="7" fill="${NAVY}"/>${txt(fx,620,'FRIDGE',48)}</g>`;}
  A.rim={x:bx+200*k,y:420};A.core={x:bx,y:420};A.fridge={x:X+260,y:300};
  return s;
}
// ---------------- stuffing ----------------
function sST(T,f,A){
  const X=7000;let s=`<rect x="6300" y="-1400" width="1400" height="2800" fill="#fdf4e3"/>`;
  const d=T.dish||0;
  s+=plate(X-60*d,600,380*(1-0.3*d));
  s+=`<g transform="translate(${-200*d} 0)">`+bird(X,450,T,f,{k:1-0.3*d})+`</g>`;
  // cavity cutaway with stuffing
  const so=1-d;
  if(so>0.01){s+=`<g opacity="${so}"><ellipse cx="${X}" cy="470" rx="140" ry="80" fill="${GOLDD}" stroke="${NAVY}" stroke-width="7"/>`;
    for(let i=0;i<14;i++)s+=`<rect x="${X-110+(i%7)*32}" y="${430+Math.floor(i/7)*36}" width="26" height="24" rx="6" fill="${CRUST}" stroke="${NAVY}" stroke-width="3" transform="rotate(${i*23} ${X-97+(i%7)*32} ${442+Math.floor(i/7)*36})"/>`;
    s+=`</g>`;}
  const tt=T.stt||0; // 0..1 time
  s+=thermo(X-80,200,lerp(110,190,tt),(T.tst||0)*so,'BREAST');
  s+=thermo(X+300,340,lerp(60,165,Math.pow(tt,1.6)),(T.tst||0)*so,'STUFFING');
  if(d>0.01){const dx=X+300;s+=`<g opacity="${d}"><rect x="${dx-170}" y="430" width="340" height="150" rx="30" fill="#5b7bd6" stroke="${NAVY}" stroke-width="8"/><rect x="${dx-150}" y="410" width="300" height="50" rx="16" fill="${CRUST}" stroke="${NAVY}" stroke-width="6"/>`;
    for(let i=0;i<8;i++)s+=`<path d="M${dx-130+i*36} 418 l14 -14 l14 14" stroke="${GOLDD}" stroke-width="7" fill="none"/>`;
    s+=txt(dx,370,'OWN DISH',48)+`</g>`;}
  A.cavity={x:X,y:470};A.dish={x:X+300,y:440};
  return s;
}
// ---------------- pie ----------------
function sPI(T,f,A){
  const X=9000;let s=`<rect x="8300" y="-1400" width="1400" height="2800" fill="#fff6e8"/>`;
  const wb=(T.wob||0)*Math.sin(f*0.9)*1, cr=T.crack||0, bl=T.blind||0, sg=T.soggy||0;
  const cy=470;
  s+=`<ellipse cx="${X}" cy="${cy+90}" rx="390" ry="80" fill="${NAVY}" opacity=".12"/>`;
  // pan + crust side
  s+=`<path d="M${X-360} ${cy} L${X-310} ${cy+90} Q${X} ${cy+130} ${X+310} ${cy+90} L${X+360} ${cy} Z" fill="${CRUST}" stroke="${NAVY}" stroke-width="8" stroke-linejoin="round"/>`;
  if(sg>0.01)s+=`<path d="M${X-300} ${cy+70} Q${X} ${cy+110} ${X+300} ${cy+70} L${X+290} ${cy+86} Q${X} ${cy+124} ${X-290} ${cy+86} Z" fill="${ICE}" opacity="${0.8*sg}"/>`;
  // top surface: filling (or empty crust with weights when blind baking)
  const rim=`<ellipse cx="${X}" cy="${cy}" rx="360" ry="110" fill="${CRUST}" stroke="${NAVY}" stroke-width="8"/>`;
  s+=rim;
  if(bl<0.5){
    const sq=1+0.03*wb;
    s+=`<g transform="translate(${X} ${cy}) scale(${sq} ${1/sq})"><ellipse rx="318" ry="90" fill="${PUMP}" stroke="${GOLDD}" stroke-width="5"/><ellipse cx="${-60+wb*6}" cy="-20" rx="${140}" ry="34" fill="#ffb05c" opacity=".7"/></g>`;
    if((T.wob||0)>0.05)s+=`<path d="M${X-60} ${cy-140} q-14 14 0 28 q14 14 0 28 M${X+60} ${cy-140} q14 14 0 28 q-14 14 0 28" stroke="${BLUE}" stroke-width="7" fill="none" opacity="${T.wob}"/>`;
    if(cr>0.01){const L=cr;s+=`<path d="M${X-240*L} ${cy-8} l40 18 l30 -24 l40 22 l36 -20 l40 24 l34 -18 l40 20 l30 -16 l40 18 l34 -20" transform="translate(${X-240-(X-240*L)} 0)" fill="none" stroke="#6a3410" stroke-width="10" stroke-linejoin="round" stroke-linecap="round" clip-path="none" opacity="${cl(cr*3,0,1)}"/>`;}
  } else {
    s+=`<ellipse cx="${X}" cy="${cy}" rx="318" ry="90" fill="#f4d9a6" stroke="${GOLDD}" stroke-width="5"/><ellipse cx="${X}" cy="${cy}" rx="300" ry="80" fill="#ffffff" opacity=".9" stroke="#c9c9c9" stroke-width="4"/>`;
    for(let i=0;i<40;i++){const a=i*2.4, r=Math.sqrt(i/40);s+=`<ellipse cx="${X+Math.cos(a)*r*270}" cy="${cy+Math.sin(a)*r*70}" rx="16" ry="11" fill="#8a5a3c" stroke="${NAVY}" stroke-width="3"/>`;}
    s+=txt(X,cy-150,'PIE WEIGHTS',48);
  }
  // protein net inset
  const nt=T.net||0;
  if(nt>0.01){const ix=X+270, iy=170, t=T.tight||0, R=150;
    s+=`<g opacity="${nt}"><circle cx="${ix}" cy="${iy}" r="${R+12}" fill="${NAVY}"/><circle cx="${ix}" cy="${iy}" r="${R}" fill="#fff1d6"/><clipPath id="netc"><circle cx="${ix}" cy="${iy}" r="${R}"/></clipPath><g clip-path="url(#netc)">`;
    const sc=1-0.4*t;
    for(let i=0;i<6;i++){let d=`M${ix-R}`+` ${iy-R+i*60*sc+R*(1-sc)}`;for(let j=1;j<=8;j++)d+=` L${ix-R+j*40} ${iy-R+i*60*sc+R*(1-sc)+(j%2?18:-18)*sc}`;s+=`<path d="${d}" fill="none" stroke="${PUMP}" stroke-width="9" stroke-linecap="round"/>`;}
    for(let i=0;i<6;i++){let d=`M${ix-R+i*60*sc+R*(1-sc)} ${iy-R}`;for(let j=1;j<=8;j++)d+=` L${ix-R+i*60*sc+R*(1-sc)+(j%2?18:-18)*sc} ${iy-R+j*40}`;s+=`<path d="${d}" fill="none" stroke="#d96a12" stroke-width="7" stroke-linecap="round"/>`;}
    if(t>0.3)for(let i=0;i<6;i++){const p=((f/20+i/6)%1);s+=`<circle cx="${ix+Math.cos(i)*p*R}" cy="${iy+Math.sin(i)*p*R}" r="12" fill="${ICE}" opacity="${(t-0.3)*1.4*(1-p)}"/>`;}
    s+=`</g>${txt(ix,iy+R+50,t>0.5?'SQUEEZE':'EGG NET',40)}</g>`;}
  A.center={x:X,y:cy};A.edge={x:X-320,y:cy};A.bottom={x:X,y:cy+110};A.net={x:X+270,y:170};A.crack={x:X,y:cy-10};
  return s;
}
// ---------------- gravy ----------------
function sGR(T,f,A){
  const X=11000;let s=`<rect x="10300" y="-1400" width="1400" height="2800" fill="#fdf4e3"/>`;
  const lu=T.lump||0, sm=T.smooth||0;
  s+=`<rect x="${X+300}" y="420" width="260" height="34" rx="17" fill="${NAVY}"/>`;
  s+=`<path d="M${X-330} 420 L${X-300} 600 Q${X} 640 ${X+300} 600 L${X+330} 420 Z" fill="#59627e" stroke="${NAVY}" stroke-width="9" stroke-linejoin="round"/>`;
  s+=`<ellipse cx="${X}" cy="420" rx="330" ry="80" fill="#3c4560" stroke="${NAVY}" stroke-width="9"/><ellipse cx="${X}" cy="428" rx="300" ry="64" fill="${GRAVY}"/>`;
  const n=Math.round(9*lu*(1-sm));
  for(let i=0;i<n;i++){const a=i*2.1, r=0.3+0.6*((i*37)%10)/10, x=X+Math.cos(a)*r*250, y=428+Math.sin(a)*r*48+Math.sin(f/8+i)*3;
    s+=`<circle cx="${x}" cy="${y}" r="${22-i%3*3}" fill="#f6ead2" stroke="${GRAVY}" stroke-width="6"/>`;}
  if(sm>0.01){const a=f/5;s+=`<g transform="translate(${X+Math.cos(a)*90} ${400+Math.sin(a)*20}) rotate(${20+Math.cos(a)*10})" opacity="${cl(sm*3,0,1)*(sm<0.95?1:0)}"><rect x="-10" y="-330" width="20" height="200" rx="10" fill="${NAVY}"/>`+
    `<path d="M0 -140 C-60 -100 -50 -10 0 0 C50 -10 60 -100 0 -140 M0 -140 C-30 -90 -25 -10 0 0 C25 -10 30 -90 0 -140" fill="none" stroke="#9aa3bd" stroke-width="7"/></g>`;}
  // lump cross-section inset
  const ins=T.lumpx||0;
  if(ins>0.01){const ix=X-240, iy=150;s+=`<g opacity="${ins}"><circle cx="${ix}" cy="${iy}" r="150" fill="${NAVY}"/><circle cx="${ix}" cy="${iy}" r="140" fill="${GRAVY}"/>`+
    `<circle cx="${ix}" cy="${iy}" r="96" fill="#e8c9a0" stroke="#f6ead2" stroke-width="12"/><circle cx="${ix}" cy="${iy}" r="66" fill="#ffffff"/>`;
    for(let i=0;i<12;i++)s+=`<circle cx="${ix+Math.cos(i*2.4)*Math.sqrt(i/12)*50}" cy="${iy+Math.sin(i*2.4)*Math.sqrt(i/12)*50}" r="6" fill="#d8d0c0"/>`;
    s+=txt(ix,iy+200,'DRY INSIDE',40)+`</g>`;}
  A.lump={x:X+60,y:420};A.pan={x:X,y:430};A.inset={x:X-240,y:150};
  return s;
}
// ---------------- potato cells ----------------
function sPO(T,f,A){
  const X=13000;let s=`<rect x="12300" y="-1400" width="1400" height="2800" fill="#fff8e6"/>`;
  const b=T.burst||0, g=T.glue||0, R=74;
  let k=0;
  for(let r=0;r<5;r++)for(let c=0;c<7;c++){
    const x=X-420+c*130+(r%2)*65, y=170+r*112, i=r*7+c, thr=((i*53)%35)/35, open=b>thr+0.02;
    if(!open){s+=`<path d="${hex(x,y,R)}" fill="${POT}" stroke="#c9a34a" stroke-width="7"/>`;
      for(let j=0;j<5;j++)s+=`<ellipse cx="${x-30+(j%3)*30}" cy="${y-16+Math.floor(j/3)*32}" rx="16" ry="12" fill="#ffffff" stroke="#d8c88e" stroke-width="3"/>`;}
    else{const p=cl((b-thr)*6,0,1);s+=`<path d="${hex(x,y,R)}" fill="none" stroke="#c9a34a" stroke-width="7" stroke-dasharray="20 16" opacity="${1-p*0.6}"/>`+
      `<circle cx="${x}" cy="${y}" r="${30+50*p}" fill="#f4f0e0" opacity="${0.8}"/>`;k++;}
  }
  if(g>0.01){s+=`<g opacity="${g}"><ellipse cx="${X}" cy="140" rx="90" ry="40" fill="#c7cfe6" stroke="${NAVY}" stroke-width="7"/><rect x="${X-10}" y="-200" width="20" height="300" rx="10" fill="${NAVY}"/>`;
    for(let i=0;i<5;i++)s+=`<path d="M${X-60+i*30} 170 Q${X-60+i*30+Math.sin(f/7+i)*14} ${260+g*60} ${X-80+i*40} ${380+g*100}" stroke="#d9c27a" stroke-width="${16-i}" fill="none" stroke-linecap="round" opacity=".95"/>`;
    s+=txt(X,40,'GLUE',70,RED)+`</g>`;}
  A.cell={x:X-130,y:282};A.cells={x:X,y:390};
  return s;
}
function hex(x,y,r){let d='';for(let i=0;i<6;i++){const a=Math.PI/6+i*Math.PI/3;d+=(i?'L':'M')+(x+Math.cos(a)*r).toFixed(1)+' '+(y+Math.sin(a)*r*0.92).toFixed(1)+' ';}return d+'Z';}
// ---------------- cranberry ----------------
function sCR(T,f,A){
  const X=15000;let s=`<rect x="14300" y="-1400" width="1400" height="2800" fill="#fdf4e3"/>`;
  s+=plate(X,600,300);
  const w=(T.jig||0)*Math.sin(f*0.8), sk=w*10;
  s+=`<g transform="translate(${X} 590) skewX(${sk})"><rect x="-130" y="-300" width="260" height="300" rx="26" fill="${CRAN}" stroke="${NAVY}" stroke-width="8"/>`;
  for(let i=1;i<5;i++)s+=`<line x1="-128" y1="${-300+i*60}" x2="128" y2="${-300+i*60}" stroke="#8f0a2a" stroke-width="6"/>`;
  s+=`<rect x="-96" y="-280" width="30" height="220" rx="15" fill="#ffffff" opacity=".35"/></g>`;
  const p=T.pectin||0;
  if(p>0.01){const ix=X+250,iy=230;s+=`<g opacity="${p}"><circle cx="${ix}" cy="${iy}" r="150" fill="${NAVY}"/><circle cx="${ix}" cy="${iy}" r="140" fill="#ffe6ec"/>`;
    for(let i=0;i<7;i++){let d=`M${ix-140} ${iy-120+i*40}`;for(let j=1;j<=7;j++)d+=` Q${ix-140+j*40-20} ${iy-120+i*40+(j%2?24:-24)} ${ix-140+j*40} ${iy-120+i*40}`;s+=`<path d="${d}" fill="none" stroke="${CRAN}" stroke-width="8"/>`;}
    s+=txt(ix,iy+200,'PECTIN',44)+`</g>`;}
  A.jelly={x:X,y:440};A.pectin={x:X+250,y:230};
  return s;
}
// ---------------- the crash ----------------
function sCX(T,f,A){
  const X=17000;let s=`<rect x="16300" y="-1400" width="1400" height="2800" fill="#efe8ff"/>`;
  const pl=T.pile||0, dim=1-0.75*(T.gate||0);
  s+=`<g opacity="${dim}">`+plate(X-150,610,300);
  const items=[[POT,0],[GRAVY,1],[GOLD,2],[CRAN,3],[CRUST,4],['#7cb342',5],[PUMP,6],[POT,7]];
  for(const [c,i] of items){const v=cl(pl*8-i,0,1);if(v<0.01)continue;const y=570-i*48*v;s+=`<ellipse cx="${X-150+((i*29)%40-20)}" cy="${y}" rx="${190-i*16}" ry="38" fill="${c}" stroke="${NAVY}" stroke-width="6"/>`;}
  s+=`</g>`;
  const cal=Math.round(T.cal||0);
  if((T.calo||0)>0.01)s+=`<g opacity="${T.calo}"><rect x="${X+110}" y="120" width="320" height="130" rx="24" fill="${NAVY}"/><text x="${X+270}" y="214" font-size="72" font-weight="900" fill="${WARM2}" text-anchor="middle" ${F2}>${cal.toLocaleString('en-US')}</text>${txt(X+270,300,'CALORIES',40)}</g>`;
  s+=zz(X-60,200,f,T.zzz||0);
  const inn=T.innocent||0;
  if(inn>0.01){s+=`<g opacity="${inn}" transform="translate(${X+300} 520) scale(.42)">`+bird(0,0,T,f,{})+`</g>`+
    `<g opacity="${inn}"><rect x="${X+160}" y="320" width="290" height="80" rx="14" fill="${IVORY}" stroke="${NAVY}" stroke-width="6"/><text x="${X+305}" y="374" font-size="40" font-weight="900" fill="#2aa84a" text-anchor="middle" ${F2}>INNOCENT</text></g>`;}
  const ga=T.gate||0;
  if(ga>0.01){const gx=X+150,gy=560;s+=`<g opacity="${ga}"><rect x="${gx+130}" y="${gy-150}" width="40" height="190" fill="${NAVY}"/>${txt(gx+150,gy-170,'BRAIN',40)}`;
    for(let i=0;i<9;i++){const x=gx-180+i*36+Math.sin(f/6+i)*4, tr=i==1;s+=`<circle cx="${x}" cy="${gy-30-(i%2)*44}" r="${tr?24:20}" fill="${tr?PUMP:'#9aa3bd'}" stroke="${NAVY}" stroke-width="4"/>`;}
    s+=txt(gx-140,gy+60,'TRYPTOPHAN',30,PUMP)+`</g>`;}
  A.plate={x:X-150,y:500};A.counter={x:X+270,y:180};A.gate={x:X+290,y:470};
  return s;
}
window.PROPS={
  labelY:150,
  draw(T,f){const A={};let s='';
    const sc=T.sc||'TK';
    const fn={TK:sTK,TM:sTM,TH:sTH,ST:sST,PI:sPI,GR:sGR,PO:sPO,CR:sCR,CX:sCX};
    for(const k of Object.keys(fn)){if(sc===k||sc==='ALL')s+=fn[k](T,f,A);}
    A.line={x:0,y:0};
    return {svg:s,anchors:A};
  },
  grip(T){return {x:600,y:400};}
};
