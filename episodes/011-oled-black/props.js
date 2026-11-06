// Episode 011 props: why an OLED screen shows perfect black.
// Four scenes in one world, the camera cuts between them:
//  R (x ~560): a dim living room, a regular LCD TV (gray glowing black) behind a new tablet on a stand (true black), same night-sky picture
//  P (x ~3000): a magnified pixel grid, every dot is its own tiny lamp; lamps in the dark part of the picture switch off
//  X (x ~5000): one pixel in cross-section: glass, a thin organic layer that glows when a current flows, contact
//  L (x ~7000): an LCD stack, back to front bottom to top: backlight (always on), filter, twisting crystal "blinds", filter; light leaks
// Burn-in happens back in scene R on the tablet: a static bar for ages (clock spins), then a faint ghost stays on gray.
// Contract: window.PROPS = {draw(T,f)->{svg, anchors}, grip(T)->{x,y}, labelY}
// T: lit 0..1 (pixel lamps glowing), off 0..1 (dark lamps switching off), power 0..1 (current flows, organic layer glows),
//    blinds 0..1 (0 open, 1 closed), leak 0..1 (light leaking through closed blinds), back 0..1 (backlight on),
//    xray 0..1 (TV x-ray hint in room), bar 0..1 (static bar on the tablet), age 0..1 (clock spins), ghost 0..1 (gray test + ghost),
//    tvglow 0..1 (gray haze around the TV black)
const ROOM='#1b2347', DESK='#3a2f5c', OLEDK='#000000', LCDK='#4a5576', LAMP=['#fffdf4','#7da0ff','#ffd84a','#ff8a3d','#2465ff'];
function rnd(i){const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);}
const F='font-family="DejaVu Sans, sans-serif"';
function pic(x,y,w,h,blk,id,f){ // the night-sky picture shown on both screens
  let s=`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${blk}"/>`;
  s+=`<g clip-path="url(#${id})">`;
  const mx=x+w*0.68, my=y+h*0.32, r=Math.min(w,h)*0.16;
  s+=`<circle cx="${mx}" cy="${my}" r="${r}" fill="${IVORY}"/><circle cx="${mx-r*0.35}" cy="${my-r*0.15}" r="${r*0.16}" fill="#e6e1c8"/><circle cx="${mx+r*0.3}" cy="${my+r*0.35}" r="${r*0.1}" fill="#e6e1c8"/>`;
  for(let i=0;i<14;i++){const sx=x+rnd(i+3)*w, sy=y+rnd(i+31)*h*0.9, tw=0.6+0.4*Math.sin(f/5+i);
    s+=`<circle cx="${sx}" cy="${sy}" r="${3+rnd(i)*4}" fill="${IVORY}" opacity="${tw}"/>`;}
  s+=`<path d="M${x} ${y+h} L${x+w*0.25} ${y+h*0.78} L${x+w*0.45} ${y+h*0.88} L${x+w*0.7} ${y+h*0.72} L${x+w} ${y+h*0.86} L${x+w} ${y+h} Z" fill="${BLUE}"/>`;
  return s+`</g>`;
}
function room(T,f){
  let s=`<defs><clipPath id="tvc"><rect x="96" y="168" width="488" height="272"/></clipPath><clipPath id="tbc"><rect x="676" y="252" width="292" height="404" rx="10"/></clipPath>`+
    `<radialGradient id="haze"><stop offset="0" stop-color="#8a95c4" stop-opacity=".55"/><stop offset="1" stop-color="#8a95c4" stop-opacity="0"/></radialGradient></defs>`;
  s+=`<rect x="-2000" y="-2000" width="4200" height="2702" fill="${ROOM}"/><rect x="-2000" y="700" width="4200" height="1400" fill="${DESK}"/>`;
  s+=`<line x1="-2000" y1="700" x2="2200" y2="700" stroke="${NAVY}" stroke-width="6"/>`;
  // TV (LCD) on the wall: its black glows gray, a haze spills out
  const g=T.tvglow==null?1:T.tvglow;
  s+=`<ellipse cx="340" cy="304" rx="${330}" ry="${220}" fill="url(#haze)" opacity="${0.9*g}"/>`;
  s+=`<rect x="80" y="152" width="520" height="304" rx="14" fill="${NAVY}" stroke="#0a0f24" stroke-width="6"/>`;
  s+=pic(96,168,488,272,LCDK,'tvc',f);
  s+=`<rect x="96" y="168" width="488" height="272" fill="#8a95c4" opacity="${0.16*g}"/>`;
  s+=`<rect x="300" y="456" width="80" height="20" fill="${NAVY}"/>`;
  s+=`<rect x="250" y="500" width="180" height="62" rx="31" fill="${IVORY}" stroke="${NAVY}" stroke-width="6"/><text x="340" y="544" font-size="38" font-weight="900" fill="${NAVY}" text-anchor="middle" ${F}>LCD TV</text>`;
  // x-ray hint: the one big light behind the TV
  const xr=T.xray||0;
  if(xr>0.01){s+=`<g opacity="${xr}"><rect x="96" y="168" width="488" height="272" fill="#fff6c8" opacity=".85"/>`;
    for(let k=0;k<7;k++)s+=`<line x1="${120+k*72}" y1="180" x2="${120+k*72}" y2="430" stroke="#ffd84a" stroke-width="10" stroke-linecap="round" opacity=".8"/>`;
    s+=`</g>`;}
  // tablet on a stand: true black
  s+=`<path d="M780 660 L760 700 L900 700 L880 660 Z" fill="${NAVY}"/>`;
  s+=`<rect x="742" y="722" width="160" height="62" rx="31" fill="${BLUE}" stroke="${NAVY}" stroke-width="6"/><text x="822" y="766" font-size="38" font-weight="900" fill="${IVORY}" text-anchor="middle" ${F}>OLED</text>`;
  s+=`<rect x="660" y="236" width="324" height="436" rx="30" fill="${NAVY}" stroke="#0a0f24" stroke-width="6"/>`;
  const gh=T.ghost||0;
  if(gh<0.5){s+=pic(676,252,292,404,OLEDK,'tbc',f);}
  else{s+=`<rect x="676" y="252" width="292" height="404" rx="10" fill="#8d8d8d"/>`;}
  // static bar (burn-in source)
  const b=T.bar||0;
  if(b>0.01 && gh<0.5)s+=`<g opacity="${b}" clip-path="url(#tbc)"><rect x="676" y="590" width="292" height="66" fill="#ff8a3d"/><rect x="694" y="606" width="120" height="34" rx="8" fill="${IVORY}"/><circle cx="930" cy="623" r="17" fill="${IVORY}"/></g>`;
  if(gh>=0.5){const go=0.75*Math.min(1,(gh-0.5)*2.2);
    s+=`<g opacity="${go}"><rect x="676" y="590" width="292" height="66" fill="#6a6a6a"/><rect x="694" y="606" width="120" height="34" rx="8" fill="#b4b4b4"/><circle cx="930" cy="623" r="17" fill="#b4b4b4"/></g>`;}
  // clock: ages pass
  const a=T.age||0;
  if(a>0.01 && a<0.999){const o=Math.min(1,Math.min(a,1-a)*8);
    s+=`<g opacity="${o}" transform="translate(470 560)"><circle r="78" fill="${IVORY}" stroke="${NAVY}" stroke-width="9"/>`+
      `<line x1="0" y1="0" x2="0" y2="-56" stroke="${NAVY}" stroke-width="9" stroke-linecap="round" transform="rotate(${a*4320})"/>`+
      `<line x1="0" y1="0" x2="0" y2="-36" stroke="${BLUE}" stroke-width="11" stroke-linecap="round" transform="rotate(${a*360})"/><circle r="9" fill="${NAVY}"/></g>`;}
  return s;
}
function grid(T,f){ // scene P around (3000, 430)
  let s=`<rect x="2300" y="-2000" width="1400" height="4400" fill="#05070f"/>`;
  const lit=T.lit||0, off=T.off||0, N=7, sp=118, x0=3000-sp*3, y0=440-sp*3;
  // the bright part of the picture (the moon, top right) stays on
  for(let r=0;r<N;r++)for(let c=0;c<N;c++){
    const x=x0+c*sp, y=y0+r*sp, i=r*N+c, moon=(c>=4&&r<=2&&!(c==6&&r==2)&&!(c==4&&r==0)), hill=(r==6||(r==5&&c%2==0));
    const col=moon?IVORY:(hill?BLUE:LAMP[i%5]);
    const thr=rnd(i+5)*0.7; const dark=!(moon||hill); const o=dark?lit*(1-Math.min(1,Math.max(0,(off-thr)/0.3))):lit;
    s+=`<circle cx="${x}" cy="${y}" r="46" fill="#11152a" stroke="#2a3150" stroke-width="5"/>`;
    if(o>0.01){s+=`<circle cx="${x}" cy="${y}" r="${62+4*Math.sin(f/4+i)}" fill="${col}" opacity="${0.22*o}"/>`+
      `<circle cx="${x}" cy="${y}" r="40" fill="${col}" opacity="${o}"/><circle cx="${x-12}" cy="${y-13}" r="10" fill="#ffffff" opacity="${0.8*o}"/>`;}
  }
  return s;
}
function pixel(T,f){ // scene X around (5000, 430)
  let s=`<rect x="4300" y="-2000" width="1400" height="4400" fill="#0b1030"/>`;
  const p=T.power||0, X=4660, Wd=680;
  // glow rays out of the top
  if(p>0.05)for(let k=0;k<6;k++){const x=X+70+k*108, run=(f*7+k*40)%160;
    s+=`<line x1="${x}" y1="${250-run}" x2="${x}" y2="${200-run}" stroke="#ffd84a" stroke-width="12" stroke-linecap="round" opacity="${p*(1-run/160)}"/>`;}
  s+=`<rect x="${X}" y="270" width="${Wd}" height="70" rx="12" fill="#cfe0ff" opacity=".8" stroke="${NAVY}" stroke-width="7"/>`; // glass
  s+=`<rect x="${X}" y="344" width="${Wd}" height="64" fill="${p>0.05?'#ffe98a':'#6b5fb8'}" stroke="${NAVY}" stroke-width="7"/>`; // organic layer
  if(p>0.05)s+=`<rect x="${X}" y="344" width="${Wd}" height="64" fill="#fffbe0" opacity="${0.6*p}"/>`;
  s+=`<rect x="${X}" y="412" width="${Wd}" height="58" rx="8" fill="#9aa3c7" stroke="${NAVY}" stroke-width="7"/>`; // contact
  // wire loop + switch + battery
  s+=`<path d="M${X+Wd} 440 L5460 440 L5460 640 L4540 640 L4540 376 L${X} 376" fill="none" stroke="#9fb9ff" stroke-width="10" stroke-linejoin="round"/>`;
  s+=`<rect x="4930" y="604" width="140" height="72" rx="14" fill="${IVORY}" stroke="${NAVY}" stroke-width="7"/><rect x="5070" y="622" width="16" height="36" rx="4" fill="${NAVY}"/>`;
  s+=`<text x="5000" y="652" font-size="34" font-weight="900" fill="${NAVY}" text-anchor="middle" ${F}>+ −</text>`;
  if(p>0.05){for(let k=0;k<10;k++){const u=((f*0.012+k/10)%1); // electrons around the loop
    const L=[[X+Wd,440],[5460,440],[5460,640],[4540,640],[4540,376],[X,376]];
    const seg=L.length-1, q=u*seg, j=Math.floor(q), t=q-j, a=L[j], b=L[j+1];
    s+=`<circle cx="${a[0]+(b[0]-a[0])*t}" cy="${a[1]+(b[1]-a[1])*t}" r="12" fill="#ffd84a" stroke="${NAVY}" stroke-width="4" opacity="${p}"/>`;}}
  return s;
}
function lcd(T,f){ // scene L around (7000, 430), back (bottom) to front (top)
  let s=`<rect x="6300" y="-2000" width="1400" height="4400" fill="#0b1030"/>`;
  const bk=T.back==null?1:T.back, bl=T.blinds||0, lk=T.leak||0, X=6680, Wd=640;
  // backlight slab
  s+=`<rect x="${X-20}" y="640" width="${Wd+40}" height="70" rx="16" fill="#fff6c8" stroke="${NAVY}" stroke-width="7"/>`;
  if(bk>0.01)s+=`<rect x="${X-40}" y="620" width="${Wd+80}" height="110" rx="30" fill="#ffd84a" opacity="${0.25*bk}"/>`;
  // light rays rising from the backlight
  for(let k=0;k<7;k++){const x=X+30+k*96;
    const top=bl>0.5?380:120; // closed blinds stop most of the light
    const run=(f*8+k*37)%120;
    s+=`<line x1="${x}" y1="${620-run*0.3}" x2="${x}" y2="${Math.max(top,520-run*2.2)}" stroke="#ffd84a" stroke-width="9" stroke-linecap="round" opacity="${0.85*bk}"/>`;}
  // leak: faint rays slip past the closed blinds
  if(lk>0.01)for(let k=0;k<4;k++){const x=X+80+k*160;
    s+=`<line x1="${x}" y1="340" x2="${x}" y2="${120+((f*3+k*20)%60)}" stroke="#aab3d8" stroke-width="10" stroke-linecap="round" opacity="${0.75*lk}"/>`;}
  // filters
  [540,250].forEach(y=>{s+=`<rect x="${X}" y="${y}" width="${Wd}" height="26" rx="6" fill="#9fb9ff" stroke="${NAVY}" stroke-width="6"/>`;
    for(let k=0;k<16;k++)s+=`<line x1="${X+20+k*38}" y1="${y+4}" x2="${X+20+k*38}" y2="${y+22}" stroke="${NAVY}" stroke-width="3" opacity=".6"/>`;});
  // crystal blinds: open = edge-on (vertical pills), closed = flat (horizontal), overlapping
  for(let k=0;k<8;k++){const cx=X+40+k*80, ang=90*(1-bl);
    s+=`<g transform="translate(${cx} 400) rotate(${ang})"><rect x="-44" y="-11" width="88" height="22" rx="11" fill="${IVORY}" stroke="${NAVY}" stroke-width="5"/></g>`;}
  // the front: what you see
  const seen=bl>0.5?(0.25+0.35*lk):1;
  s+=`<rect x="${X}" y="90" width="${Wd}" height="90" rx="14" fill="${bl>0.5?LCDK:'#fff6c8'}" stroke="${NAVY}" stroke-width="7"/>`;
  if(bl>0.5)s+=`<rect x="${X}" y="90" width="${Wd}" height="90" rx="14" fill="#8a95c4" opacity="${0.35*lk}"/>`;
  return s;
}
function anchors(T){
  return {tv:{x:340,y:304},tablet:{x:822,y:454},lamp:{x:3000-118*3,y:440-118*3},moon:{x:3000+118*2,y:440-118*2},
    off:{x:3000-118,y:440},layer:{x:5000,y:376},glass:{x:5000,y:305},power:{x:5000,y:640},
    backlight:{x:7000,y:675},blinds:{x:7000,y:400},filter:{x:7000,y:263},front:{x:7000,y:135},
    bar:{x:822,y:623},ghost:{x:822,y:623},clock:{x:470,y:560}};
}
window.PROPS={labelY:40,
  draw(T,f){return {svg:room(T,f)+grid(T,f)+pixel(T,f)+lcd(T,f),anchors:anchors(T)};},
  grip(T){return {x:560,y:470};}};
