// Episode 007 props: x-ray flashlight lying on its side (tail switch left, head right).
// Two cells nose to tail, tail spring, metal contact strip along the tube, tail clicky switch with a gap
// that a metal disc bridges, LED + reflector, warm beam. Current dots run the loop when it is closed.
// Contract: window.PROPS = {draw(T,f)->{svg, anchors}, grip(T)->{x,y}, labelY}
// T: xr (x-ray 0..1), on (light 0..1), press (button 0..1), bridge (disc 0..1), flow (dots 0..1),
//    loop (loop path glow 0..1), hop (conga bounce 0..1), squeeze (spring push 0..1), strip (strip glow 0..1),
//    gap (gap glow 0..1), rot (switch ratchet angle deg), rust (0..1), eraser (0..1 visible), ex (eraser x offset),
//    shake (deg tilt), pm (+/- tags 0..1)
const AY=600, TX0=150, TX1=780, R0=56, HX1=950, HR=96;
const BAT=[[300,535],[535,770]];
const WARM='#ffd84a', COPPER='#d9893a', RUST='#a0522d';
function cell(x0,x1,dy,T){
  let s='';const r=42;
  s+=`<rect x="${x0}" y="${AY-r+dy}" width="${x1-x0-12}" height="${2*r}" rx="10" fill="${BLUE}" stroke="${NAVY}" stroke-width="6"/>`;
  s+=`<rect x="${x0+8}" y="${AY-r+8+dy}" width="${(x1-x0-12)*0.34}" height="${2*r-16}" rx="6" fill="${IVORY}" opacity=".35"/>`;
  s+=`<rect x="${x1-14}" y="${AY-14+dy}" width="14" height="28" rx="4" fill="${IVORY}" stroke="${NAVY}" stroke-width="5"/>`;
  if(T.pm>0.01){
    s+=`<g opacity="${T.pm}"><circle cx="${x1-44}" cy="${AY+dy}" r="21" fill="${IVORY}" stroke="${NAVY}" stroke-width="4"/><text x="${x1-44}" y="${AY+12+dy}" font-size="36" font-weight="900" fill="${NAVY}" text-anchor="middle" font-family="DejaVu Sans, sans-serif">+</text>`;
    s+=`<circle cx="${x0+28}" cy="${AY+dy}" r="21" fill="${IVORY}" stroke="${NAVY}" stroke-width="4"/><text x="${x0+28}" y="${AY+11+dy}" font-size="38" font-weight="900" fill="${NAVY}" text-anchor="middle" font-family="DejaVu Sans, sans-serif">-</text></g>`;}
  return s;
}
function loopPts(T){
  // closed path the current follows (x-ray): cells center line -> LED -> up to strip -> strip back to tail -> switch -> spring -> cells
  const yS=AY-R0+12;
  return [[BAT[0][0],AY],[BAT[1][1],AY],[800,AY],[800,yS],[230,yS],[205,yS],[205,AY],[260,AY],[BAT[0][0],AY]];
}
function pathLen(P){let L=0;for(let i=1;i<P.length;i++)L+=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);return L;}
function ptAt(P,d){for(let i=1;i<P.length;i++){const l=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);if(d<=l){const u=d/l;return [P[i-1][0]+(P[i][0]-P[i-1][0])*u,P[i-1][1]+(P[i][1]-P[i-1][1])*u];}d-=l;}return P[P.length-1];}
function flashSVG(T,f){
  let s='';const xr=T.xr, sh=T.shake||0;
  // beam (behind everything, from the lens to the right)
  if(T.on>0.01){
    s+=`<defs><linearGradient id="bm" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${WARM}" stop-opacity="${0.85*T.on}"/><stop offset="1" stop-color="${WARM}" stop-opacity="0"/></linearGradient></defs>`;
    s+=`<path d="M${HX1} ${AY-HR+10} L${HX1+620} ${AY-330} L${HX1+620} ${AY+330} L${HX1} ${AY+HR-10} Z" fill="url(#bm)"/>`;
  }
  s+=`<g transform="rotate(${sh} 560 ${AY})">`;
  // cradles
  s+=`<path d="M300 700 L330 ${AY+R0+4} H390 L420 700 Z M620 700 L650 ${AY+R0+4} H710 L740 700 Z" fill="${IVORY}" stroke="${NAVY}" stroke-width="6" stroke-linejoin="round"/>`;
  // tube + tail cap + head outline shapes
  const tube=`M${TX0+40} ${AY-R0} H${TX1} L${TX1+60} ${AY-HR} H${HX1} V${AY+HR} H${TX1+60} L${TX1} ${AY+R0} H${TX0+40} Q${TX0} ${AY+R0} ${TX0} ${AY+R0-30} V${AY-R0+30} Q${TX0} ${AY-R0} ${TX0+40} ${AY-R0} Z`;
  // solid body (fades out with x-ray)
  s+=`<path d="${tube}" fill="${TINT}"/>`;
  s+=`<g opacity="${1-xr}"><path d="${tube}" fill="${BLUE}"/>`;
  for(let k=0;k<9;k++)s+=`<line x1="${330+k*26}" y1="${AY-R0+14}" x2="${330+k*26}" y2="${AY+R0-14}" stroke="${NAVY}" stroke-width="5" opacity=".35"/>`;
  s+=`<rect x="${TX0+36}" y="${AY-R0}" width="16" height="${2*R0}" fill="${NAVY}" opacity=".3"/></g>`;
  // ---- x-ray insides ----
  s+=`<g opacity="${xr}">`;
  const hop=T.hop||0;
  // tail switch housing
  s+=`<rect x="${TX0+12}" y="${AY-44}" width="88" height="88" rx="12" fill="${IVORY}" stroke="${NAVY}" stroke-width="5"/>`;
  // ratchet (clicky-pen style) inside the switch: striped cylinder that turns
  for(let k=0;k<4;k++){const a=(T.rot||0)+k*45, v=Math.cos(a*Math.PI/90);const y=AY-30+((a%180+180)%180)/180*60;
    s+=`<line x1="${TX0+22}" y1="${y}" x2="${TX0+60}" y2="${y}" stroke="${BLUE}" stroke-width="${3+3*Math.abs(v)}" stroke-linecap="round" opacity=".8"/>`;}
  // fixed contacts of the gap (two copper tabs)
  const yS=AY-R0+12, rust=T.rust||0;
  s+=`<rect x="${TX0+70}" y="${yS-6}" width="12" height="${AY-yS+30}" fill="${COPPER}" stroke="${NAVY}" stroke-width="4"/>`;
  // metal disc that bridges the gap (moves in from the left with press/bridge)
  const dx=TX0+26+30*T.bridge;
  s+=`<rect x="${dx}" y="${AY-38}" width="12" height="76" rx="4" fill="${COPPER}" stroke="${NAVY}" stroke-width="4"/>`;
  s+=`<rect x="${dx-26}" y="${AY-6}" width="26" height="12" fill="${NAVY}"/>`;
  // spring between switch and first cell
  const sq=T.squeeze||0, sp0=TX0+96, sp1=BAT[0][0]-8*sq;
  let d=`M${sp0} ${AY}`;const n=7;for(let i=1;i<=n*2;i++)d+=` L${sp0+(sp1-sp0)*i/(n*2)} ${AY+(i%2?32:-32)}`;
  s+=`<path d="${d}" fill="none" stroke="${NAVY}" stroke-width="6" stroke-linejoin="round"/>`;
  // cells (conga hop: alternate bounce)
  BAT.forEach(([a,b],i)=>{const dy=-14*hop*Math.max(0,Math.sin(f/3+i*Math.PI));s+=cell(a-8*sq,b-8*sq,dy,T);});
  // metal strip along the top inside of the tube, from the head back to the switch tab
  const sg=T.strip||0;
  s+=`<path d="M${TX0+82} ${yS} H800 V${AY-30}" fill="none" stroke="${sg>0.01?WARM:COPPER}" stroke-width="${10+6*sg}" stroke-linejoin="round" opacity="${0.85+0.15*sg}"/>`;
  s+=`<path d="M${TX0+82} ${yS} H800 V${AY-30}" fill="none" stroke="${NAVY}" stroke-width="2" opacity=".6"/>`;
  // LED + reflector in the head
  s+=`<path d="M${TX1+66} ${AY-HR+12} L${HX1-6} ${AY-HR+12} L${HX1-6} ${AY+HR-12} L${TX1+66} ${AY+HR-12} Z" fill="${IVORY}" stroke="${NAVY}" stroke-width="4" opacity=".7"/>`;
  s+=`<path d="M806 ${AY-30} L${HX1-8} ${AY-HR+14} M806 ${AY+30} L${HX1-8} ${AY+HR-14}" stroke="${NAVY}" stroke-width="5" opacity=".6"/>`;
  s+=`<rect x="784" y="${AY-30}" width="22" height="60" rx="5" fill="${IVORY}" stroke="${NAVY}" stroke-width="5"/>`;
  // rust on the contacts
  if(rust>0.01){s+=`<g opacity="${rust}"><circle cx="${BAT[1][1]-6}" cy="${AY}" r="15" fill="${RUST}"/><circle cx="${TX0+76}" cy="${yS+14}" r="12" fill="${RUST}"/>`;
    for(let k=0;k<6;k++)s+=`<circle cx="${BAT[1][1]-14+(k*7)%20}" cy="${AY-12+(k*11)%26}" r="3" fill="#6b3416"/>`;s+=`</g>`;}
  // loop glow (the path electricity takes)
  const P=loopPts(T);
  if(T.loop>0.01){const Lp=pathLen(P);s+=`<path d="M${P.map(p=>p.join(' ')).join(' L')}" fill="none" stroke="${WARM}" stroke-width="16" stroke-linejoin="round" stroke-linecap="round" opacity=".75" stroke-dasharray="${Lp*T.loop} ${Lp}"/>`;}
  // current dots
  if(T.flow>0.01){const Lp=pathLen(P);for(let k=0;k<22;k++){const q=ptAt(P,((k/22)*Lp+f*9)%Lp);s+=`<circle cx="${q[0]}" cy="${q[1]}" r="8" fill="${WARM}" stroke="${NAVY}" stroke-width="3" opacity="${T.flow}"/>`;}}
  // gap glow
  if(T.gap>0.01)s+=`<circle cx="${TX0+64}" cy="${AY}" r="34" fill="none" stroke="${RUST}" stroke-width="6" stroke-dasharray="10 8" opacity="${T.gap}"/>`;
  s+=`</g>`;
  // LED glow (visible through the lens in both views)
  if(T.on>0.01)s+=`<circle cx="800" cy="${AY}" r="${40+20*T.on}" fill="${WARM}" opacity="${0.55*T.on}"/>`;
  // outlines
  s+=`<path d="${tube}" fill="none" stroke="${NAVY}" stroke-width="9" stroke-linejoin="round"/>`;
  s+=`<line x1="${TX1}" y1="${AY-R0}" x2="${TX1}" y2="${AY+R0}" stroke="${NAVY}" stroke-width="5" opacity=".5"/>`;
  s+=`<rect x="${HX1-6}" y="${AY-HR}" width="16" height="${2*HR}" rx="6" fill="${IVORY}" stroke="${NAVY}" stroke-width="7"/>`;
  // tail button (pushes in)
  const bx=TX0-26+18*T.press;
  s+=`<rect x="${bx}" y="${AY-30}" width="${TX0-bx+6}" height="60" rx="12" fill="${NAVY}"/><rect x="${bx+6}" y="${AY-22}" width="10" height="44" rx="5" fill="${BLUE}"/>`;
  // eraser
  if(T.eraser>0.01){const ex=BAT[1][1]+60+(T.ex||0);
    s+=`<g opacity="${T.eraser}" transform="rotate(-12 ${ex} ${AY-150})"><rect x="${ex-18}" y="${AY-330}" width="36" height="170" fill="${WARM}" stroke="${NAVY}" stroke-width="6"/><rect x="${ex-18}" y="${AY-160}" width="36" height="24" fill="#c0c6d6" stroke="${NAVY}" stroke-width="6"/><rect x="${ex-18}" y="${AY-136}" width="36" height="40" rx="8" fill="#f29bb0" stroke="${NAVY}" stroke-width="6"/></g>`;}
  s+=`</g>`;
  return s;
}
function anchors(T){const yS=AY-R0+12;
  return {tube:{x:470,y:AY-R0},head:{x:870,y:AY-HR},led:{x:795,y:AY},cell1:{x:410,y:AY-42},cell2:{x:650,y:AY-42},
    plus:{x:BAT[0][1]-44,y:AY-21},minus:{x:BAT[1][0]+28,y:AY-21},spring:{x:TX0+124,y:AY-32},strip:{x:560,y:yS},
    switch:{x:TX0+56,y:AY-44},gap:{x:TX0+64,y:AY-38},disc:{x:TX0+32+30*T.bridge,y:AY-38},button:{x:TX0-12,y:AY-30},
    contact:{x:BAT[1][1]-6,y:AY-15},loop:{x:560,y:yS}};}
window.PROPS={labelY:400,
  draw(T,f){return {svg:flashSVG(T,f),anchors:anchors(T)};},
  grip(T){return {x:TX0-20,y:AY};}};
