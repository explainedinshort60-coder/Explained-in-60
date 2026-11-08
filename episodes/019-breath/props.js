// Episode 019 props: why can you see your breath when it's cold? (flat diagrams, a generic cute person in a beanie).
// Scenes in one world, the camera cuts between them (scene centre x):
//  H  540   hook: winter morning, the person blows a huge white breath cloud, frost, "?"
//  L  2540  lungs: a flat chest diagram, damp lungs (water drops), the breath leaves warm (orange glow)
//  V  4540  invisible vapor: indoors, breath out as faint cobalt dots (vapor), WARM tag, nothing visible
//  C  6540  outside: the dot plume hits cold blue air, a thermometer drops, the dots slow down
//  M  8540  magnifier: vapor dots slow, reach the dew point mark, stick into water droplets
//  D  10540 the puff becomes a white cloud of tiny droplets (lens shows the droplets)
//  T  12540 tiny cloud gag: a small cloud by the mouth, then a crown pops on it ("majestic")
//  S  14540 real clouds over a field with morning fog: SAME WAY
//  F  16540 forecast card gag: PARTLY CLOUDY / MOSTLY ANNOYING
//  P  18540 poof: the droplet cloud shrinks back to invisible vapor
//  X  20540 split: HUMID MORNING 45 F puff visible vs DRY DAY 45 F barely any puff
// T: blow 0..1, vap 0..1, cold 0..1, therm 0..1, slow 0..1, cond 0..1, cloud 0..1, crown 0..1, fog 0..1, card 0..2, poof 0..1, split 0..1
const F='font-family="DejaVu Sans, sans-serif"', RED='#e8273a', GREEN='#1fae5b', GOLD='#ffd84a', ORNG='#ff8a3d';
const SKIN='#f5c9a3', SKY='#dcebff', SKY2='#c4dcff', SNOW='#f6f9ff', COAT='#2465ff', SCARF='#e8273a', CLOUD='#ffffff';
function rnd(i){const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);}
function cl(x){return Math.max(0,Math.min(1,x));}
function sm(x){x=cl(x);return x*x*(3-2*x);}
function txt(x,y,s,t,fill,anchor,extra){return `<text x="${x}" y="${y}" font-size="${s}" font-weight="900" fill="${fill||NAVY}" text-anchor="${anchor||'middle'}" ${F} ${extra||''}>${t}</text>`;}
function pill(x,y,t,bg,o){const w=t.length*30+60;return `<g opacity="${o==null?1:o}"><rect x="${x-w/2}" y="${y-44}" width="${w}" height="72" rx="36" fill="${bg}" stroke="${NAVY}" stroke-width="5"/>${txt(x,y+6,44,t,IVORY)}</g>`;}
function bg(cx,top,bot){return `<rect x="${cx-700}" y="-2000" width="1400" height="4400" fill="${top}"/><rect x="${cx-700}" y="1000" width="1400" height="1400" fill="${bot}"/><line x1="${cx-700}" y1="1000" x2="${cx+700}" y2="1000" stroke="${NAVY}" stroke-width="6"/>`;}
// generic cute person, side view facing right; mouth at (x+150, y+40)
function person(x,y,s,blowing,f,indoor){
  const b=blowing?1:0;
  let g=`<g transform="translate(${x} ${y}) scale(${s})">`;
  g+=`<path d="M-170 560 Q-180 260 -20 230 L60 230 Q200 250 210 560 Z" fill="${COAT}" stroke="${NAVY}" stroke-width="9"/>`;
  g+=`<path d="M-60 300 L-30 470" stroke="${NAVY}" stroke-width="6" stroke-linecap="round" opacity=".4"/>`;
  g+=`<circle cx="0" cy="0" r="160" fill="${SKIN}" stroke="${NAVY}" stroke-width="9"/>`;
  if(!indoor){
    g+=`<path d="M-170 0 Q-170 -190 0 -190 Q170 -190 170 -10 Z" fill="${COAT}" stroke="${NAVY}" stroke-width="9"/>`;
    g+=`<rect x="-178" y="-40" width="356" height="56" rx="28" fill="${IVORY}" stroke="${NAVY}" stroke-width="8"/>`;
    g+=`<circle cx="-10" cy="-205" r="44" fill="${IVORY}" stroke="${NAVY}" stroke-width="8"/>`;
    g+=`<path d="M-150 150 Q0 230 150 150 L160 215 Q0 290 -160 215 Z" fill="${SCARF}" stroke="${NAVY}" stroke-width="8"/>`;
    g+=`<rect x="-120" y="200" width="56" height="150" rx="14" fill="${SCARF}" stroke="${NAVY}" stroke-width="7" transform="rotate(8 -92 200)"/>`;
  } else {
    g+=`<path d="M-150 -60 Q-120 -175 10 -168 Q140 -160 150 -60 Q60 -120 -40 -100 Q-110 -90 -150 -60 Z" fill="#6b4a2e" stroke="${NAVY}" stroke-width="8"/>`;
  }
  // eye (closed happy arc when blowing), blush, mouth
  if(b)g+=`<path d="M58 40 Q80 22 102 40" fill="none" stroke="${NAVY}" stroke-width="9" stroke-linecap="round"/>`;
  else g+=`<ellipse cx="80" cy="36" rx="14" ry="20" fill="${NAVY}"/><circle cx="85" cy="28" r="5" fill="#fff"/>`;
  g+=`<ellipse cx="60" cy="96" rx="30" ry="16" fill="#ff9fb0" opacity=".75"/>`;
  if(b)g+=`<ellipse cx="148" cy="96" rx="16" ry="20" fill="#7a2a3a" stroke="${NAVY}" stroke-width="6"/>`;
  else g+=`<path d="M118 104 Q136 116 152 100" fill="none" stroke="${NAVY}" stroke-width="7" stroke-linecap="round"/>`;
  return g+`</g>`;
}
// visible breath cloud: a widening cone of soft white blobs from the mouth (mx,my), amount 0..1, size scale k
function puff(mx,my,amt,k,f,seed){
  if(amt<=0.01)return '';
  let s='';const n=14;
  for(let i=0;i<n;i++){const u=i/(n-1); if(u>amt)break;
    const d=40+u*520*k, r=(26+u*110)*k*(0.85+0.3*rnd(i+seed)), wob=Math.sin(f*0.12+i)*10*u;
    const x=mx+d, y=my-u*150*k+(rnd(i*3+seed)-0.5)*120*u*k+wob, o=(0.95-0.5*u)*(amt<1?1:1);
    s+=`<circle cx="${x}" cy="${y}" r="${r}" fill="${CLOUD}" opacity="${o}" stroke="#b9cdee" stroke-width="5"/>`;}
  return s;
}
// invisible vapor: faint cobalt dots with speed ticks drifting out of the mouth; slow 0..1 shortens the ticks
function vapor(mx,my,amt,f,slow,seed,spread){
  let s='';const n=40, sp=spread||1;
  for(let i=0;i<n;i++){const ph=(rnd(i+seed)+f*0.006*(1-0.7*slow))%1; if(ph>amt)continue;
    const x=mx+30+ph*560*sp, y=my-ph*160+(rnd(i*7+seed)-0.5)*260*ph*sp, a=rnd(i*11+seed)*6.28+f*0.2*(1-slow);
    const L=22*(1-0.8*slow);
    s+=`<circle cx="${x}" cy="${y}" r="9" fill="${COAT}" opacity=".8"/>`;
    if(L>3)s+=`<line x1="${x-Math.cos(a)*(12+L)}" y1="${y-Math.sin(a)*(12+L)}" x2="${x-Math.cos(a)*14}" y2="${y-Math.sin(a)*14}" stroke="${COAT}" stroke-width="5" stroke-linecap="round" opacity=".5"/>`;}
  return s;
}
function thermo(x,y,level,label,hot){
  const h=360, fill=hot?ORNG:'#5d8bff';
  let s=`<rect x="${x-34}" y="${y-h}" width="68" height="${h+20}" rx="34" fill="${IVORY}" stroke="${NAVY}" stroke-width="8"/>`;
  s+=`<circle cx="${x}" cy="${y+40}" r="58" fill="${fill}" stroke="${NAVY}" stroke-width="8"/>`;
  s+=`<rect x="${x-16}" y="${y-h*level+10}" width="32" height="${h*level+30}" fill="${fill}"/>`;
  for(let i=1;i<6;i++)s+=`<line x1="${x+34}" y1="${y-i*60+10}" x2="${x+58}" y2="${y-i*60+10}" stroke="${NAVY}" stroke-width="5"/>`;
  if(label)s+=txt(x,y+150,52,label);
  return s;
}
function snowflakes(cx,f,n,seed){let s='';for(let i=0;i<n;i++){const x=cx-640+rnd(i+seed)*1280, y=((rnd(i*5+seed)*1200+f*2.2*(0.6+rnd(i)))%1200)-120;
  s+=`<g transform="translate(${x} ${y}) rotate(${f*2+i*30})"><path d="M-14 0 L14 0 M-7 -12 L7 12 M7 -12 L-7 12" stroke="#fff" stroke-width="6" stroke-linecap="round"/></g>`;}return s;}
function crown(x,y,s,o){return `<g transform="translate(${x} ${y}) scale(${s})" opacity="${o}"><path d="M-70 30 L-80 -40 L-38 -6 L0 -60 L38 -6 L80 -40 L70 30 Z" fill="${GOLD}" stroke="${NAVY}" stroke-width="8" stroke-linejoin="round"/><circle cx="0" cy="-60" r="12" fill="${RED}" stroke="${NAVY}" stroke-width="5"/></g>`;}
function bigcloud(x,y,s,o){return `<g transform="translate(${x} ${y}) scale(${s})" opacity="${o}"><path d="M-170 60 Q-230 60 -220 0 Q-215 -55 -150 -50 Q-140 -130 -50 -120 Q0 -190 80 -130 Q160 -150 170 -60 Q240 -50 230 10 Q225 60 170 60 Z" fill="${CLOUD}" stroke="${NAVY}" stroke-width="9" stroke-linejoin="round"/></g>`;}
function lens(cx,cy,r,inner){return `<clipPath id="ln${cx}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath><circle cx="${cx}" cy="${cy}" r="${r}" fill="#eef5ff"/><g clip-path="url(#ln${cx})">${inner}</g><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${NAVY}" stroke-width="12"/><line x1="${cx-r*0.72}" y1="${cy+r*0.72}" x2="${cx-r*1.15}" y2="${cy+r*1.15}" stroke="${NAVY}" stroke-width="30" stroke-linecap="round"/>`;}
// molecules inside the lens: cond 0 = fast separate dots, 1 = clumped into water droplets
function molecules(cx,cy,r,cond,f){
  let s='';const n=36, cents=[[-90,-60],[80,-90],[-40,90],[110,70],[0,-10]];
  for(let i=0;i<n;i++){const c=cents[i%cents.length], a0=rnd(i)*6.28+f*0.25*(1-cond), rr=r*0.75*rnd(i*3+1);
    const fx=cx+Math.cos(a0)*rr, fy=cy+Math.sin(a0*1.3)*rr, ang=a0+0.6;
    const tx=cx+c[0]+Math.cos(i*2.4)*16*(i%3), ty=cy+c[1]+Math.sin(i*2.4)*16*(i%3);
    const x=fx+(tx-fx)*sm(cond), y=fy+(ty-fy)*sm(cond);
    s+=`<circle cx="${x}" cy="${y}" r="13" fill="${COAT}"/>`;
    if(cond<0.6)s+=`<line x1="${x-Math.cos(ang)*48*(1-cond)}" y1="${y-Math.sin(ang)*48*(1-cond)}" x2="${x-Math.cos(ang)*18}" y2="${y-Math.sin(ang)*18}" stroke="${COAT}" stroke-width="6" stroke-linecap="round" opacity="${0.6*(1-cond)}"/>`;}
  const dO=cl((cond-0.55)*2.5);
  if(dO>0)cents.forEach((c,k)=>{s+=`<circle cx="${cx+c[0]}" cy="${cy+c[1]}" r="${44+6*(k%2)}" fill="${WATER}" opacity="${0.55*dO}" stroke="${NAVY}" stroke-width="5"/><ellipse cx="${cx+c[0]-14}" cy="${cy+c[1]-16}" rx="10" ry="7" fill="#fff" opacity="${dO}"/>`;});
  return s;
}
// --- H: hook
function hook(T,f){
  const cx=540;let s=bg(cx,SKY,SNOW);
  s+=`<rect x="-160" y="-2000" width="1400" height="1500" fill="${SKY2}"/>`;
  s+=`<path d="M-160 1000 Q120 900 400 990 Q700 880 1240 990 L1240 1000 Z" fill="#fff" stroke="${NAVY}" stroke-width="5"/>`;
  for(const tx of [-40,1120])s+=`<path d="M${tx} 990 L${tx-70} 990 L${tx} 700 L${tx+70} 990 Z" fill="#2c8f63" stroke="${NAVY}" stroke-width="6"/><path d="M${tx-40} 860 L${tx} 760 L${tx+40} 860 Z" fill="#fff" opacity=".9"/>`;
  s+=snowflakes(cx,f,14,3);
  s+=person(330,600,1.05,1,f,false);
  s+=puff(330+157,600+100,0.25+0.75*sm(T.blow),1.0,f,1);
  s+=txt(820,250,170,'?',RED,'middle',`stroke="${NAVY}" stroke-width="9" paint-order="stroke"`);
  return s;
}
// --- L: lungs
function lungs(T,f){
  const cx=2540;let s=bg(cx,'#eaf2ff','#eaf2ff');
  s+=`<path d="M${cx-340} 1100 Q${cx-360} 380 ${cx} 330 Q${cx+360} 380 ${cx+340} 1100 Z" fill="${COAT}" stroke="${NAVY}" stroke-width="9" opacity=".22"/>`;
  s+=`<rect x="${cx-30}" y="200" width="60" height="230" rx="26" fill="#ffd6dc" stroke="${NAVY}" stroke-width="8"/>`;
  const br=1+0.04*Math.sin(f*0.18);
  for(const sd of [-1,1])s+=`<path transform="translate(${cx} 640) scale(${sd*br} ${br})" d="M30 -200 Q40 -230 80 -220 Q230 -170 250 60 Q260 230 160 260 Q60 280 40 200 Z" fill="#ff9fb0" stroke="${NAVY}" stroke-width="9" stroke-linejoin="round"/>`;
  s+=`<path d="M${cx} 420 L${cx} 470 M${cx} 470 L${cx-60} 540 M${cx} 470 L${cx+60} 540" stroke="${NAVY}" stroke-width="10" stroke-linecap="round" fill="none"/>`;
  const dm=sm(T.damp||0);
  for(let i=0;i<9;i++){const sd=i%2?1:-1, x=cx+sd*(110+rnd(i)*90), y=540+rnd(i*3)*260, o=cl(dm*3-i*0.25);
    s+=`<path d="M${x} ${y-26} Q${x+20} ${y} ${x} ${y+16} Q${x-20} ${y} ${x} ${y-26} Z" fill="${WATER}" stroke="${NAVY}" stroke-width="4" opacity="${o}"/>`;}
  return s;
}
// --- V: indoors, invisible vapor
function indoor(T,f){
  const cx=4540;let s=bg(cx,'#fff4e2','#f0d9b5');
  s+=`<rect x="${cx+250}" y="180" width="300" height="260" rx="14" fill="#bfe0ff" stroke="${NAVY}" stroke-width="8"/><line x1="${cx+400}" y1="180" x2="${cx+400}" y2="440" stroke="${NAVY}" stroke-width="6"/>`;
  s+=person(cx-220,560,1.0,1,f,true);
  const mx=cx-220+150, my=560+96;
  s+=vapor(mx,my,sm(T.vap),f,0,5,0.9);
  s+=`<circle cx="${mx+120}" cy="${my-10}" r="${90+8*Math.sin(f*0.2)}" fill="${ORNG}" opacity="${0.18*sm(T.vap)}"/>`;
  return s;
}
// --- C: outside, cold air
function outside(T,f){
  const cx=6540;let s=bg(cx,'#cfe2ff',SNOW);
  const c=sm(T.cold);
  s+=`<rect x="${cx-700}" y="-2000" width="1400" height="3000" fill="#9cc0ff" opacity="${0.45*c}"/>`;
  for(let i=0;i<5;i++)s+=`<path d="M${cx-80+i*40} ${200+i*150} q60 -30 120 0 t120 0" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity="${0.7*c}"/>`;
  s+=person(cx-250,600,0.9,1,f,false);
  const mx=cx-250+135, my=600+86;
  s+=vapor(mx,my,1,f,sm(T.slow),9,0.8);
  s+=thermo(cx+420,700,0.7-0.45*sm(T.therm),'',false);
  return s;
}
// --- M: magnifier, dew point
function magnify(T,f){
  const cx=8540;let s=bg(cx,'#cfe2ff',SNOW);
  s+=lens(cx-70,500,330,molecules(cx-70,500,330,T.cond||0,f));
  // dew point thermometer
  const lv=0.75-0.4*sm(T.therm);
  s+=thermo(cx+430,720,lv,'',false);
  s+=`<line x1="${cx+380}" y1="${720-0.35*360+10}" x2="${cx+500}" y2="${720-0.35*360+10}" stroke="${RED}" stroke-width="9" stroke-dasharray="14 8"/>`;
  return s;
}
// --- D: droplet cloud
function droplets(T,f){
  const cx=10540;let s=bg(cx,'#cfe2ff',SNOW);
  s+=person(cx-310,620,0.85,1,f,false);
  const mx=cx-310+128, my=620+82;
  s+=puff(mx,my,sm(T.cloud),1.1,f,4);
  const o=cl((T.cloud-0.4)*2);
  if(o>0){let d='';for(let i=0;i<22;i++)d+=`<circle cx="${cx+250+(rnd(i)-0.5)*300}" cy="${380+(rnd(i*3)-0.5)*300}" r="${16+rnd(i*5)*16}" fill="${WATER}" stroke="${NAVY}" stroke-width="4" opacity=".75"/>`;
    s+=`<g opacity="${o}">${lens(cx+250,380,190,d)}</g>`;}
  return s;
}
// --- T: tiny cloud + crown gag
function tiny(T,f){
  const cx=12540;let s=bg(cx,'#cfe2ff',SNOW);
  s+=person(cx-200,600,1.0,1,f,false);
  const mx=cx-200+150, my=600+96;
  s+=bigcloud(mx+150,my-50,0.42+0.02*Math.sin(f*0.2),1);
  const c=T.crown||0;
  if(c>0)s+=crown(mx+150,my-140-30*(1-sm(c*2)),0.9,cl(c*3));
  if(c>0.3){for(let i=0;i<6;i++){const a=i*1.05+f*0.05, r=150+10*Math.sin(f*0.3+i);s+=`<path d="M${mx+150+Math.cos(a)*r} ${my-80+Math.sin(a)*r*0.7} l8 -18 l8 18 l18 8 l-18 8 l-8 18 l-8 -18 l-18 -8 Z" fill="${GOLD}" stroke="${NAVY}" stroke-width="3" opacity="${cl((c-0.3)*3)}"/>`;}}
  return s;
}
// --- S: real clouds and fog
function sky(T,f){
  const cx=14540;let s=bg(cx,'#bcd6ff','#cfe8c8');
  s+=`<circle cx="${cx-380}" cy="880" r="110" fill="${GOLD}" opacity=".7"/>`;
  const a=sm(T.fog||0);
  s+=bigcloud(cx-200+20*Math.sin(f*0.02),260,1.0,1)+bigcloud(cx+280-15*Math.sin(f*0.02),420,0.75,1);
  for(let i=0;i<4;i++)s+=`<rect x="${cx-700+((f*1.5+i*350)%1400)}" y="${880+i*34}" width="520" height="56" rx="28" fill="#fff" opacity="${0.75*a}"/>`;
  s+=`<rect x="${cx-700}" y="900" width="1400" height="110" fill="#fff" opacity="${0.5*a}"/>`;
  return s;
}
// --- F: forecast card gag
function forecast(T,f){
  const cx=16540;let s=bg(cx,'#14275e','#14275e');
  s+=`<rect x="${cx-470}" y="120" width="940" height="860" rx="40" fill="#1d3a8a" stroke="${IVORY}" stroke-width="8"/>`;
  s+=txt(cx,230,62,'TODAY',GOLD);
  s+=`<circle cx="${cx-120}" cy="420" r="110" fill="${GOLD}" stroke="${NAVY}" stroke-width="8"/>`+bigcloud(cx+40,470,0.75,1);
  const c=T.card||0;
  s+=`<g opacity="${cl(c*3)}">${txt(cx,700,74,'PARTLY CLOUDY',IVORY)}</g>`;
  s+=`<g opacity="${cl((c-1)*3)}">${txt(cx,830,74,'MOSTLY ANNOYING',ORNG)}</g>`;
  return s;
}
// --- P: poof
function poof(T,f){
  const cx=18540;let s=bg(cx,'#cfe2ff',SNOW);
  s+=person(cx-310,620,0.85,1,f,false);
  const mx=cx-310+128, my=620+82, p=sm(T.poof||0);
  s+=`<g opacity="${1-p}">${puff(mx,my,1,1.1*(1-0.35*p),f,4)}</g>`;
  s+=`<g opacity="${p}">${vapor(mx+60,my,1,f,0,13,1.0)}</g>`;
  return s;
}
// --- X: humid vs dry at the same temperature
function split(T,f){
  const cx=20540;let s=bg(cx,'#cfe2ff',SNOW);
  s+=`<rect x="${cx-700}" y="-2000" width="700" height="3000" fill="#c9dcf5"/><rect x="${cx}" y="-2000" width="700" height="3000" fill="#ffefd2"/>`;
  s+=`<line x1="${cx}" y1="-2000" x2="${cx}" y2="1000" stroke="${NAVY}" stroke-width="8"/>`;
  // humid side mist streaks
  for(let i=0;i<4;i++)s+=`<rect x="${cx-660+((f*1.2+i*220)%600)}" y="${180+i*60}" width="200" height="30" rx="15" fill="#fff" opacity=".6"/>`;
  s+=txt(cx-330,150,50,'HUMID MORNING',NAVY)+txt(cx+330,150,50,'DRY DAY',NAVY);
  const p=sm(T.split||0);
  s+=person(cx-470,640,0.62,1,f,false)+person(cx+230,640,0.62,1,f,false);
  s+=puff(cx-470+93,640+60,p,0.5,f,2);
  s+=`<g opacity=".55">${puff(cx+230+93,640+60,p*0.35,0.45,f,7)}</g>`;
  for(const x of [cx-350,cx+350]){s+=`<rect x="${x-80}" y="880" width="160" height="80" rx="20" fill="${IVORY}" stroke="${NAVY}" stroke-width="6"/>`+txt(x,938,46,'45°F',NAVY);}
  return s;
}
function anchors(T){
  return {lungs:{x:2540+180,y:640},vapor:{x:4540-70+260,y:600},cold:{x:6540+120,y:330},therm:{x:6540+420,y:520},
    dot:{x:8540-70,y:500},dew:{x:8540+440,y:604},drop:{x:10540+250,y:380},cloud:{x:12540+40,y:640},fog:{x:14540,y:920},
    hcloud:{x:14540-200,y:260},poof:{x:18540-80,y:620},humid:{x:20540-300,y:620},dry:{x:20540+400,y:660}};
}
window.PROPS={labelY:60,
  draw(T,f){return {svg:hook(T,f)+lungs(T,f)+indoor(T,f)+outside(T,f)+magnify(T,f)+droplets(T,f)+tiny(T,f)+sky(T,f)+forecast(T,f)+poof(T,f)+split(T,f),anchors:anchors(T)};},
  grip(T){return {x:540,y:430};}};
