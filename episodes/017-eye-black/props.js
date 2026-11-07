// Episode 017 props: does eye black really work? (flat diagram, generic player, plain helmet, no team, no logo).
// Scenes in one world, the camera cuts between them:
//  H (x ~540):  hook: game day, a blazing sun, the ball dropping out of the glare, a player with eye black squinting, "?"
//  P (x ~3000): side profile diagram: a sun ray hits the cheekbone and bounces up into the eye (glare);
//               modes: bare, grease (ray soaked up), sticker (ray still bounces), grape jelly (gag), burnt cork (history)
//  V (x ~5000): the player's view: bright sky, the ball washed out next to the sun
//  C (x ~7000): the 2003 Yale eye chart test: letters fade row by row; with grease one more row is readable
//  S (x ~9000): stadium scoreboard: GREASE a little better, STICKERS and PETROLEUM JELLY no change
// T: drop 0..1 (hook ball), pmode 0 bare / 1 grease / 2 sticker / 3 grape / 4 cork, paint 0..1, ray 0..1, bounce 0..1,
//    flare 0..1, soak 0..1, ok 0..1, no 0..1, rub 0..1, wash 0..1, chart 0..1, rows 0..4, extra 0..1, cok 0..1, sb 0..3
const F='font-family="DejaVu Sans, sans-serif"', RED='#e8273a', GREEN='#1fae5b', GOLD='#ffd84a', SUN='#ffc93a';
const SKIN='#f5c9a3', SKIN2='#e2a984', GRAPE='#7b3fa8', GRAPE2='#b07ad6', CORK='#c99a62', CORK2='#9c7140', GRASS='#3fae5a', BALL='#a0522d';
function rnd(i){const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);}
function cl(x){return Math.max(0,Math.min(1,x));}
function check(x,y,s,o){return `<g transform="translate(${x} ${y}) scale(${s})" opacity="${o}"><circle r="62" fill="${GREEN}" stroke="${NAVY}" stroke-width="7"/><path d="M-28 2 L-6 24 L30 -22" fill="none" stroke="${IVORY}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/></g>`;}
function xmark(x,y,s,o){return `<g transform="translate(${x} ${y}) scale(${s})" opacity="${o}"><circle r="62" fill="${RED}" stroke="${NAVY}" stroke-width="7"/><path d="M-24 -24 L24 24 M24 -24 L-24 24" stroke="${IVORY}" stroke-width="13" stroke-linecap="round"/></g>`;}
function sun(x,y,r,f,glow){
  let s=`<circle cx="${x}" cy="${y}" r="${r*2.6*glow}" fill="#fff4c2" opacity=".55"/><circle cx="${x}" cy="${y}" r="${r*1.7*glow}" fill="#ffe680" opacity=".6"/>`;
  for(let i=0;i<12;i++){const a=i*Math.PI/6+f*0.01, r1=r*1.2, r2=r*(1.55+0.08*Math.sin(f*0.2+i));s+=`<line x1="${x+Math.cos(a)*r1}" y1="${y+Math.sin(a)*r1}" x2="${x+Math.cos(a)*r2}" y2="${y+Math.sin(a)*r2}" stroke="${SUN}" stroke-width="14" stroke-linecap="round"/>`;}
  return s+`<circle cx="${x}" cy="${y}" r="${r}" fill="${SUN}" stroke="#e0a400" stroke-width="6"/>`;
}
function football(x,y,rot,s,o){
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})" opacity="${o}"><ellipse rx="78" ry="46" fill="${BALL}" stroke="${NAVY}" stroke-width="7"/>`+
   `<path d="M-60 -10 Q-70 0 -60 10 M60 -10 Q70 0 60 10" stroke="${IVORY}" stroke-width="6" fill="none"/><line x1="-26" y1="-14" x2="26" y2="-14" stroke="${IVORY}" stroke-width="6" stroke-linecap="round"/>`+
   [-18,-6,6,18].map(d=>`<line x1="${d}" y1="-24" x2="${d}" y2="-4" stroke="${IVORY}" stroke-width="5" stroke-linecap="round"/>`).join('')+`</g>`;
}
function burst(x,y,s,o){let p='';for(let i=0;i<8;i++){const a=i*Math.PI/4, r=i%2?40:90;p+=`${i?'L':'M'}${x+Math.cos(a)*r*s} ${y+Math.sin(a)*r*s} `;const a2=a+Math.PI/8;p+=`L${x+Math.cos(a2)*22*s} ${y+Math.sin(a2)*22*s} `;}
  return `<path d="${p}Z" fill="#fffbe0" stroke="${SUN}" stroke-width="6" opacity="${o}"/>`;}
// --- H: hook
function hook(T,f){
  let s=`<rect x="-1500" y="-2000" width="3500" height="4400" fill="#bfe0ff"/>`;
  s+=`<rect x="-1500" y="-2000" width="3500" height="1800" fill="#d8ecff"/>`;
  // crowd band and field
  s+=`<rect x="-1500" y="880" width="3500" height="170" fill="#6c7fb8"/>`;
  for(let i=0;i<60;i++)s+=`<circle cx="${-60+i*22}" cy="${905+(i%3)*45}" r="13" fill="${['#ffd84a','#ff8a3d','#e9eefc','#2465ff'][i%4]}" opacity=".85"/>`;
  s+=`<rect x="-1500" y="1050" width="3500" height="1300" fill="${GRASS}"/><line x1="-1500" y1="1050" x2="2000" y2="1050" stroke="${NAVY}" stroke-width="6"/>`;
  s+=sun(250,40,105,f,1+0.06*Math.sin(f*0.3));
  // ball dropping out of the glare
  const d=T.drop||0, bx=330+d*260, by=110+d*300;
  s+=football(bx,by,-30+d*200,0.9+d*0.25,0.35+0.65*d);
  s+=`<circle cx="${bx}" cy="${by}" r="${130*(1-d)+30}" fill="#fffbe0" opacity="${0.55*(1-d)}"/>`;
  // glare streaks
  for(let i=0;i<3;i++)s+=`<line x1="${330+i*40}" y1="${170+i*30}" x2="${470+i*50}" y2="${520+i*20}" stroke="#fffbe0" stroke-width="${16-i*4}" stroke-linecap="round" opacity="${0.5+0.3*Math.sin(f*0.4+i)}"/>`;
  // player, front view
  const HX=560, HY=660;
  s+=`<path d="M${HX-330} 1160 Q${HX-320} 900 ${HX-120} 880 L${HX+120} 880 Q${HX+320} 900 ${HX+330} 1160 Z" fill="${BLUE}" stroke="${NAVY}" stroke-width="8"/>`;
  s+=`<path d="M${HX-60} 880 L${HX} 950 L${HX+60} 880" fill="none" stroke="${IVORY}" stroke-width="12"/>`;
  s+=`<circle cx="${HX}" cy="${HY}" r="255" fill="${BLUE}" stroke="${NAVY}" stroke-width="9"/>`;
  s+=`<clipPath id="hs"><circle cx="${HX}" cy="${HY}" r="250"/></clipPath><rect x="${HX-22}" y="${HY-260}" width="44" height="200" fill="${IVORY}" clip-path="url(#hs)"/>`;
  s+=`<circle cx="${HX-245}" cy="${HY+40}" r="26" fill="${NAVY}"/><circle cx="${HX+245}" cy="${HY+40}" r="26" fill="${NAVY}"/>`;
  s+=`<rect x="${HX-170}" y="${HY-80}" width="340" height="330" rx="120" fill="${SKIN}" stroke="${NAVY}" stroke-width="8"/>`;
  // squinting eyes, eye black
  const sq=0.5+0.5*Math.sin(f*0.35);
  for(const sd of [-1,1]){const ex=HX+sd*72, ey=HY+10;
    s+=`<path d="M${ex-28} ${ey-14-6*sq} L${ex+(sd>0?-6:6)} ${ey} L${ex+28} ${ey-14-6*sq}" fill="none" stroke="${NAVY}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" transform="${sd>0?'':''}"/>`;
    s+=`<rect x="${ex-44}" y="${ey+34}" width="88" height="30" rx="15" fill="#151515" stroke="${NAVY}" stroke-width="3"/>`;
    s+=`<ellipse cx="${ex+sd*36}" cy="${ey+90}" rx="22" ry="12" fill="#ff9fb0" opacity=".7"/>`;}
  s+=`<path d="M${HX-30} ${HY+120} Q${HX} ${HY+100} ${HX+30} ${HY+120}" fill="none" stroke="${NAVY}" stroke-width="7" stroke-linecap="round"/>`;
  // facemask
  for(const y of [HY+150,HY+210])s+=`<path d="M${HX-200} ${y-20} Q${HX} ${y+20} ${HX+200} ${y-20}" fill="none" stroke="#8b96a8" stroke-width="16" stroke-linecap="round"/>`;
  for(const x of [HX-70,HX+70])s+=`<line x1="${x}" y1="${HY+140}" x2="${x}" y2="${HY+225}" stroke="#8b96a8" stroke-width="14" stroke-linecap="round"/>`;
  // sweat drop and question mark
  s+=`<path d="M${HX+190} ${HY-120} q16 26 0 40 q-16 -14 0 -40z" fill="#9fd4ff" stroke="${NAVY}" stroke-width="4"/>`;
  s+=`<text x="${HX+250}" y="${HY-170}" font-size="130" font-weight="900" fill="${RED}" stroke="${NAVY}" stroke-width="8" paint-order="stroke" text-anchor="middle" ${F} opacity="1">?</text>`;
  return s;
}
// --- P: the side profile diagram
const PCX=2930, PCY=560, EYE={x:3108,y:520}, CHEEK={x:3128,y:612}, SUNP={x:3330,y:300};
function profile(T,f){
  let s=`<rect x="2350" y="-2000" width="1300" height="4400" fill="#d8ecff"/><rect x="2350" y="1050" width="1300" height="1300" fill="${GRASS}"/><line x1="2350" y1="1050" x2="3650" y2="1050" stroke="${NAVY}" stroke-width="6"/>`;
  s+=sun(SUNP.x,SUNP.y,70,f,1);
  const m=T.pmode||0;
  // neck and jersey
  s+=`<path d="M${PCX-220} 1150 Q${PCX-200} 900 ${PCX-20} 860 L${PCX+150} 860 Q${PCX+260} 930 ${PCX+300} 1150 Z" fill="${BLUE}" stroke="${NAVY}" stroke-width="8"/>`;
  s+=`<rect x="${PCX+20}" y="760" width="130" height="130" fill="${SKIN}" stroke="${NAVY}" stroke-width="7"/>`;
  // face (skin) facing right
  s+=`<path d="M${PCX-60} 330 Q${PCX+160} 300 ${PCX+200} 440 Q${PCX+215} 500 ${PCX+262} 560 Q${PCX+275} 580 ${PCX+240} 592 Q${PCX+235} 680 ${PCX+200} 720 Q${PCX+150} 800 ${PCX+40} 800 L${PCX-60} 800 Z" fill="${SKIN}" stroke="${NAVY}" stroke-width="8" stroke-linejoin="round"/>`;
  // cheekbone hint
  s+=`<path d="M${CHEEK.x-50} ${CHEEK.y+8} Q${CHEEK.x} ${CHEEK.y-12} ${CHEEK.x+50} ${CHEEK.y+6}" fill="none" stroke="${SKIN2}" stroke-width="6" stroke-linecap="round"/>`;
  s+=`<ellipse cx="${CHEEK.x-10}" cy="${CHEEK.y+46}" rx="34" ry="16" fill="#ff9fb0" opacity=".6"/>`;
  // helmet shell (cobalt, ivory stripe), covers the back and top
  s+=`<path d="M${PCX-300} 760 Q${PCX-330} 260 ${PCX+20} 220 Q${PCX+210} 210 ${PCX+235} 420 L${PCX+130} 430 Q${PCX+60} 360 ${PCX-20} 380 Q${PCX-80} 470 ${PCX-60} 620 Q${PCX-40} 700 ${PCX+30} 760 Z" fill="${BLUE}" stroke="${NAVY}" stroke-width="9" stroke-linejoin="round"/>`;
  s+=`<path d="M${PCX-270} 520 Q${PCX-250} 260 ${PCX+20} 236 Q${PCX+170} 228 ${PCX+215} 380" fill="none" stroke="${IVORY}" stroke-width="22" stroke-linecap="round"/>`;
  s+=`<circle cx="${PCX-160}" cy="560" r="34" fill="${NAVY}"/>`;
  // eye (profile), squints under glare
  const fl=T.flare||0;
  if(fl>0.5)s+=`<path d="M${EYE.x-26} ${EYE.y-14} L${EYE.x+6} ${EYE.y} L${EYE.x-26} ${EYE.y+14}" fill="none" stroke="${NAVY}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`;
  else s+=`<ellipse cx="${EYE.x}" cy="${EYE.y}" rx="17" ry="24" fill="${NAVY}"/><circle cx="${EYE.x+5}" cy="${EYE.y-8}" r="6" fill="#ffffff"/><path d="M${EYE.x-6} ${EYE.y-30} L${EYE.x+18} ${EYE.y-44}" stroke="${NAVY}" stroke-width="7" stroke-linecap="round"/>`;
  // mouth
  s+=`<path d="M${PCX+190} 690 Q${PCX+210} 700 ${PCX+226} 690" fill="none" stroke="${NAVY}" stroke-width="6" stroke-linecap="round"/>`;
  // what is under the eye
  const pt=T.paint||0, rb=T.rub||0;
  if(m==1||m==4){const w=96*(m==4?Math.min(1,pt):pt);
    s+=`<rect x="${CHEEK.x-48}" y="${CHEEK.y-16}" width="${w}" height="30" rx="15" fill="#151515" transform="rotate(-6 ${CHEEK.x} ${CHEEK.y})"/>`;
    if(m==1&&pt>0.95)s+=`<path d="M${CHEEK.x-30} ${CHEEK.y-8} L${CHEEK.x+10} ${CHEEK.y-12}" stroke="#555" stroke-width="5" stroke-linecap="round" transform="rotate(-6 ${CHEEK.x} ${CHEEK.y})"/>`;}
  if(m==2&&pt>0){const sc=0.6+0.4*cl(pt*1.5);
    s+=`<g transform="translate(${CHEEK.x} ${CHEEK.y}) rotate(-6) scale(${sc})" opacity="${cl(pt*2)}"><rect x="-56" y="-20" width="112" height="40" rx="8" fill="#151515" stroke="${NAVY}" stroke-width="4"/>`+
      `<path d="M0 -13 L4 -4 L13 -4 L6 2 L9 11 L0 6 L-9 11 L-6 2 L-13 -4 L-4 -4 Z" fill="${IVORY}"/></g>`;}
  if(m==3&&pt>0){s+=`<g opacity="${cl(pt*2)}" transform="translate(-58 -22)"><path d="M${CHEEK.x-60} ${CHEEK.y-10} Q${CHEEK.x-20} ${CHEEK.y-40} ${CHEEK.x+40} ${CHEEK.y-20} Q${CHEEK.x+70} ${CHEEK.y} ${CHEEK.x+40} ${CHEEK.y+28} Q${CHEEK.x} ${CHEEK.y+50*pt} ${CHEEK.x-30} ${CHEEK.y+30} Q${CHEEK.x-70} ${CHEEK.y+20} ${CHEEK.x-60} ${CHEEK.y-10} Z" fill="${GRAPE}" stroke="${NAVY}" stroke-width="5"/>`+
      `<ellipse cx="${CHEEK.x-10}" cy="${CHEEK.y-14}" rx="22" ry="8" fill="${GRAPE2}" opacity=".9"/><path d="M${CHEEK.x+10} ${CHEEK.y+30} q4 ${30*pt} 0 ${44*pt}" stroke="${GRAPE}" stroke-width="12" stroke-linecap="round"/></g>`;
    // the jar
    s+=`<g transform="translate(${CHEEK.x+250} 900)" opacity="${cl(pt*2)}"><rect x="-70" y="-90" width="140" height="170" rx="22" fill="${GRAPE}" stroke="${NAVY}" stroke-width="7"/><rect x="-78" y="-120" width="156" height="40" rx="10" fill="${IVORY}" stroke="${NAVY}" stroke-width="6"/>`+
      `<rect x="-56" y="-40" width="112" height="70" rx="10" fill="${IVORY}" stroke="${NAVY}" stroke-width="4"/><circle cx="-14" cy="-6" r="12" fill="${GRAPE2}" stroke="${NAVY}" stroke-width="3"/><circle cx="10" cy="-6" r="12" fill="${GRAPE2}" stroke="${NAVY}" stroke-width="3"/><circle cx="-2" cy="14" r="12" fill="${GRAPE2}" stroke="${NAVY}" stroke-width="3"/></g>`;}
  if(m==4){ // burnt cork rubbing on the cheek
    const cx=CHEEK.x+34+Math.sin(rb*Math.PI*6)*22*(1-pt*0.3), cy=CHEEK.y-4-Math.sin(rb*Math.PI*6)*6;
    s+=`<g transform="translate(${cx} ${cy}) rotate(-135)" opacity="${1-cl((pt-0.98)*40)}"><rect x="-40" y="0" width="80" height="170" rx="14" fill="${CORK}" stroke="${NAVY}" stroke-width="6"/>`+
      `${[30,70,110,140].map((y,i)=>`<circle cx="${i%2?12:-14}" cy="${y}" r="5" fill="${CORK2}"/>`).join('')}<rect x="-40" y="0" width="80" height="34" rx="12" fill="#2a2320" stroke="${NAVY}" stroke-width="6"/></g>`;
    if(rb>0.05&&rb<0.98)for(let i=0;i<4;i++)s+=`<circle cx="${cx-30+rnd(i+f%7)*40}" cy="${cy+30+rnd(i+3+f%5)*30}" r="${3+rnd(i)*3}" fill="#2a2320" opacity=".8"/>`;}
  // the ray: sun -> cheekbone -> eye (or soaked up)
  const ry=T.ray||0, bo=T.bounce||0;
  if(ry>0){const x=SUNP.x+(CHEEK.x+20-SUNP.x)*ry, y=SUNP.y+(CHEEK.y-SUNP.y)*ry;
    s+=`<line x1="${SUNP.x}" y1="${SUNP.y}" x2="${x}" y2="${y}" stroke="${SUN}" stroke-width="18" stroke-linecap="round" stroke-dasharray="40 18" stroke-dashoffset="${-f*6}"/>`;
    s+=`<circle cx="${x}" cy="${y}" r="16" fill="#fffbe0" stroke="${SUN}" stroke-width="5"/>`;}
  if(bo>0){const x0=CHEEK.x+20, y0=CHEEK.y, x=x0+(EYE.x+16-x0)*bo, y=y0+(EYE.y+10-y0)*bo;
    s+=`<line x1="${x0}" y1="${y0}" x2="${x}" y2="${y}" stroke="${SUN}" stroke-width="18" stroke-linecap="round"/>`;
    s+=`<path d="M${x} ${y} l-14 18 m14 -18 l18 10" stroke="${SUN}" stroke-width="10" stroke-linecap="round"/>`;}
  if(fl>0)s+=burst(EYE.x+4,EYE.y,0.7+0.35*Math.sin(f*0.6),cl(fl*2));
  const so=T.soak||0;
  if(so>0)for(let r=0;r<3;r++){const q=((so*1.6+r*0.33)%1);s+=`<circle cx="${CHEEK.x+10}" cy="${CHEEK.y}" r="${20+q*70}" fill="none" stroke="#151515" stroke-width="6" opacity="${(1-q)*cl(so*3)}"/>`;}
  if(T.ok)s+=check(EYE.x-280,EYE.y-200,0.75,cl(T.ok*3));
  if(T.no)s+=xmark(EYE.x-280,EYE.y-200,0.75,cl(T.no*3));
  return s;
}
// --- V: the player's view of the sky
function view(T,f){
  const w=T.wash||0;
  let s=`<rect x="4350" y="-2000" width="1300" height="4400" fill="#cfe6ff"/>`;
  s+=`<rect x="4350" y="860" width="1300" height="200" fill="#6c7fb8"/>`;
  for(let i=0;i<60;i++)s+=`<circle cx="${4380+i*22}" cy="${885+(i%3)*45}" r="13" fill="${['#ffd84a','#ff8a3d','#e9eefc','#2465ff'][i%4]}" opacity=".85"/>`;
  s+=`<rect x="4350" y="1050" width="1300" height="1300" fill="${GRASS}"/>`;
  // goalpost
  s+=`<path d="M4740 1050 L4740 760 M4740 760 L5260 760 M4740 760 L4740 300 M5260 760 L5260 300" stroke="${GOLD}" stroke-width="22" fill="none" stroke-linecap="round"/><path d="M4740 1050 L4740 760 M4740 760 L5260 760 M4740 760 L4740 300 M5260 760 L5260 300" stroke="${NAVY}" stroke-width="4" fill="none"/>`;
  s+=sun(5130,210,110,f,1+0.5*w);
  const bx=5010-w*10, by=300+Math.sin(f*0.1)*10;
  s+=football(bx,by,-20+f*3,1.1,1-0.82*w);
  s+=`<rect x="4350" y="-2000" width="1300" height="4400" fill="#fffbe6" opacity="${0.55*w}"/>`;
  s+=`<circle cx="5130" cy="210" r="${380+120*w}" fill="#fffbe6" opacity="${0.5*w}"/>`;
  return s;
}
// --- C: the 2003 eye chart test
const LET=['HSZ','DNC','KRV','OZN','SHD','CVR'], OPA=[1,0.62,0.4,0.25,0.15,0.09];
function chart(T,f){
  let s=`<rect x="6350" y="-2000" width="1300" height="4400" fill="#eef3ff"/>`;
  const c=T.chart||0;
  s+=`<g opacity="${cl(c*2)}"><text x="7000" y="40" font-size="58" font-weight="900" fill="${NAVY}" text-anchor="middle" ${F}>2003 YALE TEST</text>`;
  for(const [bx,lab,grease] of [[6770,'NO GREASE',0],[7230,'GREASE',1]]){
    s+=`<rect x="${bx-200}" y="120" width="400" height="800" rx="20" fill="#ffffff" stroke="${NAVY}" stroke-width="7"/>`;
    s+=`<text x="${bx}" y="990" font-size="48" font-weight="900" fill="${grease?NAVY:'#4a5578'}" text-anchor="middle" ${F}>${lab}</text>`;
    if(grease)s+=`<rect x="${bx-60}" y="1020" width="120" height="30" rx="15" fill="#151515"/>`;
    const seen=Math.min(3,T.rows||0)+(grease?(T.extra||0):0);
    for(let r=0;r<6;r++){const y=210+r*120, sh=Math.floor(seen)>r||(r<seen&&seen-r>0.5);
      s+=`<text x="${bx}" y="${y+40}" font-size="92" font-weight="900" letter-spacing="14" fill="#000" opacity="${OPA[r]}" text-anchor="middle" ${F}>${LET[r]}</text>`;
      if(sh)s+=`<path d="M${bx-184} ${y+12} l14 14 l26 -30" fill="none" stroke="${GREEN}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`;}
  }
  s+=`</g>`;
  if(T.cok){const o=cl(T.cok*3);s+=`<rect x="7044" y="${210+3*120-50}" width="372" height="112" rx="18" fill="none" stroke="${GREEN}" stroke-width="9" opacity="${o}"/>`+
    `<rect x="7110" y="1070" width="240" height="70" rx="35" fill="${GREEN}" stroke="${NAVY}" stroke-width="5" opacity="${o}"/><text x="7230" y="1120" font-size="44" font-weight="900" fill="${IVORY}" text-anchor="middle" opacity="${o}" ${F}>+1 ROW</text>`;}
  return s;
}
// --- S: the scoreboard
function board(T,f){
  let s=`<rect x="8350" y="-2000" width="1300" height="4400" fill="#cfe6ff"/><rect x="8350" y="1050" width="1300" height="1300" fill="${GRASS}"/>`;
  s+=`<rect x="8640" y="760" width="40" height="300" fill="#4a5578" stroke="${NAVY}" stroke-width="6"/><rect x="9320" y="760" width="40" height="300" fill="#4a5578" stroke="${NAVY}" stroke-width="6"/>`;
  s+=`<rect x="8530" y="80" width="940" height="720" rx="26" fill="${NAVY}" stroke="#04102f" stroke-width="8"/>`;
  s+=`<text x="9000" y="180" font-size="54" font-weight="900" fill="${GOLD}" text-anchor="middle" letter-spacing="6" ${F}>GLARE TEST</text>`;
  const rows=[['GREASE','BETTER',GREEN],['STICKERS','SAME',RED],['PETROLEUM JELLY','SAME',RED]];
  const sb=T.sb||0;
  rows.forEach(([a,b,c],i)=>{const o=cl(sb-i), y=320+i*170;
    s+=`<g opacity="${o}"><rect x="8580" y="${y-80}" width="840" height="130" rx="16" fill="#0e1d4d" stroke="${c}" stroke-width="6"/>`+
      `<text x="8610" y="${y+8}" font-size="50" font-weight="900" fill="${IVORY}" ${F}>${a}</text>`+
      `<text x="9390" y="${y+8}" font-size="50" font-weight="900" fill="${c}" text-anchor="end" ${F}>${b}</text></g>`;});
  for(let i=0;i<16;i++)s+=`<circle cx="${8570+i*57}" cy="110" r="8" fill="${GOLD}" opacity="${0.4+0.6*((Math.floor(f/4)+i)%2)}"/>`;
  return s;
}
function anchors(T){
  return {ballH:{x:330,y:110},eyeH:{x:632,y:700},cheek:{x:CHEEK.x,y:CHEEK.y},eye:{x:EYE.x,y:EYE.y},ball:{x:5010,y:300},
    stripe:{x:CHEEK.x,y:CHEEK.y},sticker:{x:CHEEK.x,y:CHEEK.y},jelly:{x:CHEEK.x,y:CHEEK.y},cork:{x:CHEEK.x+40,y:CHEEK.y+40},
    rowL:{x:6770,y:570},rowR:{x:7230,y:570},sb:{x:9000,y:320}};
}
window.PROPS={labelY:60,
  draw(T,f){return {svg:hook(T,f)+profile(T,f)+view(T,f)+chart(T,f)+board(T,f),anchors:anchors(T)};},
  grip(T){return {x:540,y:430};}};
