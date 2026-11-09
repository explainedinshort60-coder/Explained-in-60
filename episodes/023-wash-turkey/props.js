// 023 wash turkey props (You've Been Doing It Wrong). Flat kitchen diagrams, scenes along x, centered near world y 420:
//  TP x 600   hook: raw turkey under the running tap in the sink, droplets with germs flying at the camera
//  SP x 2600  splash map: droplets arc from the sink onto the COUNTER and the SALAD
//  ST x 4600  USDA study cards: 60% bacteria in the sink, 26% on the salad
//  HT x 6600  only heat kills them: rinse crossed out, thermometer climbs to 165°F, germs pop
//  SK x 8600  scrub the sink: sponge and hot soapy water bubbles
// Contract: window.PROPS = {draw(T,f)->{svg, anchors}, grip(T)->{x,y}, labelY}
const RAW='#f7d2c2',RAWD='#e6a995',GOLD3='#e39a3f',GOLD3D='#b86b1e',GERM='#7bc950',GERMD='#3f8a2a',RED3='#e8273a',STEEL='#cfd8ea',STEELD='#8f9bb8',LET='#8fd16a',LETD='#4f9a35',TOM='#ff6b5a';
const F4='font-family="DejaVu Sans, sans-serif"';
function c4(v,a,b){return Math.max(a,Math.min(b,v));}
function tx4(x,y,s,size,fill,extra){return `<text x="${x}" y="${y}" font-size="${size}" font-weight="900" fill="${fill||NAVY}" text-anchor="middle" stroke="#fdfcf1" stroke-width="${size/5}" paint-order="stroke" ${F4} ${extra||''}>${s}</text>`;}
function bg4(x0,col){return `<rect x="${x0-700}" y="-1400" width="1400" height="3600" fill="${col}"/>`;}
function germ(x,y,r,o){ // small cute-ish germ: green blob, little bumps, two dot eyes (mild, not gross)
  if(o!=null&&o<0.01)return '';
  let s=`<g opacity="${o==null?1:o}">`;
  for(let i=0;i<6;i++){const a=i*Math.PI/3;s+=`<circle cx="${x+Math.cos(a)*r*1.05}" cy="${y+Math.sin(a)*r*1.05}" r="${r*0.28}" fill="${GERM}" stroke="${GERMD}" stroke-width="2.5"/>`;}
  s+=`<circle cx="${x}" cy="${y}" r="${r}" fill="${GERM}" stroke="${GERMD}" stroke-width="3.5"/>`+
    `<circle cx="${x-r*0.32}" cy="${y-r*0.1}" r="${r*0.16}" fill="${NAVY}"/><circle cx="${x+r*0.32}" cy="${y-r*0.1}" r="${r*0.16}" fill="${NAVY}"/></g>`;
  return s;
}
function drop(x,y,r,o,g){ // water droplet, optional germ inside
  return `<g opacity="${o==null?1:o}"><path d="M${x} ${y-r*1.5} Q${x+r} ${y-r*0.2} ${x+r} ${y+r*0.2} A${r} ${r} 0 1 1 ${x-r} ${y+r*0.2} Q${x-r} ${y-r*0.2} ${x} ${y-r*1.5} Z" fill="#cfdcff" stroke="${NAVY}" stroke-width="${Math.max(3,r*0.12)}"/>`+
    (g?germ(x,y+r*0.25,r*0.42,1):`<ellipse cx="${x-r*0.35}" cy="${y-r*0.05}" rx="${r*0.18}" ry="${r*0.3}" fill="#fff"/>`)+`</g>`;
}
function turkey(x,y,k,col,colD){ // whole bird, breast up, drumsticks toward the viewer's left/right
  col=col||RAW;colD=colD||RAWD;
  let s=`<ellipse cx="${x}" cy="${y+100*k}" rx="${200*k}" ry="${22*k}" fill="${NAVY}" opacity=".12"/>`;
  // drumsticks
  for(const sg of [-1,1]){
    const lx=x+sg*150*k, ly=y+30*k;
    s+=`<path d="M${x+sg*70*k} ${y+20*k} Q${x+sg*170*k} ${y-10*k} ${lx+sg*40*k} ${ly-50*k}" stroke="${NAVY}" stroke-width="${78*k+10}" stroke-linecap="round" fill="none"/>`+
       `<path d="M${x+sg*70*k} ${y+20*k} Q${x+sg*170*k} ${y-10*k} ${lx+sg*40*k} ${ly-50*k}" stroke="${col}" stroke-width="${78*k}" stroke-linecap="round" fill="none"/>`+
       `<circle cx="${lx+sg*64*k}" cy="${ly-82*k}" r="${20*k}" fill="${IVORY}" stroke="${NAVY}" stroke-width="7"/><circle cx="${lx+sg*84*k}" cy="${ly-70*k}" r="${18*k}" fill="${IVORY}" stroke="${NAVY}" stroke-width="7"/>`+
       `<rect x="${lx+sg*44*k-11*k}" y="${ly-86*k}" width="${22*k}" height="${34*k}" fill="${IVORY}" transform="rotate(${sg*40} ${lx+sg*54*k} ${ly-70*k})"/>`;
  }
  // body
  s+=`<path d="M${x-170*k} ${y+40*k} Q${x-190*k} ${y-120*k} ${x} ${y-135*k} Q${x+190*k} ${y-120*k} ${x+170*k} ${y+40*k} Q${x} ${y+110*k} ${x-170*k} ${y+40*k} Z" fill="${col}" stroke="${NAVY}" stroke-width="9" stroke-linejoin="round"/>`+
    `<path d="M${x-10*k} ${y-120*k} Q${x-20*k} ${y-20*k} ${x} ${y+60*k}" stroke="${colD}" stroke-width="${7*k}" fill="none" stroke-linecap="round"/>`+
    `<path d="M${x-120*k} ${y-60*k} q30 -30 60 -36" stroke="#fff" stroke-width="${10*k}" fill="none" stroke-linecap="round" opacity=".6"/>`;
  return s;
}
function sink(x,y,w,water){ // front view: counter top, basin cut
  return `<rect x="${x-w/2-120}" y="${y-30}" width="${w+240}" height="60" rx="14" fill="${STEEL}" stroke="${NAVY}" stroke-width="8"/>`+
    `<path d="M${x-w/2} ${y} L${x-w/2+30} ${y+190} Q${x} ${y+225} ${x+w/2-30} ${y+190} L${x+w/2} ${y} Z" fill="#e6ecf8" stroke="${NAVY}" stroke-width="8" stroke-linejoin="round"/>`+
    `<rect x="${x-w/2-120}" y="${y+28}" width="${w+240}" height="240" fill="#ffffff" opacity="0"/>`;
}
function faucet(x,y,flow,f){ // gooseneck from the back of the sink, pouring at (x, y+...)
  let s=`<path d="M${x+170} ${y+150} L${x+170} ${y-40} Q${x+170} ${y-130} ${x+70} ${y-130} Q${x} ${y-130} ${x} ${y-70}" stroke="${NAVY}" stroke-width="56" fill="none" stroke-linecap="round"/>`+
    `<path d="M${x+170} ${y+150} L${x+170} ${y-40} Q${x+170} ${y-130} ${x+70} ${y-130} Q${x} ${y-130} ${x} ${y-70}" stroke="${STEEL}" stroke-width="40" fill="none" stroke-linecap="round"/>`+
    `<rect x="${x-26}" y="${y-74}" width="52" height="26" rx="8" fill="${STEELD}" stroke="${NAVY}" stroke-width="6"/>`;
  if(flow>0.01){const L=200*flow;
    s+=`<rect x="${x-16}" y="${y-50}" width="32" height="${L}" rx="14" fill="${WATER}" opacity=".7"/>`;
    for(let i=0;i<4;i++){const yy=y-40+((f*14+i*55)%Math.max(40,L));s+=`<rect x="${x-6}" y="${yy}" width="8" height="26" rx="4" fill="#fff" opacity=".7"/>`;}}
  return s;
}
function bowl(x,y,k){ // salad bowl, lettuce and a tomato
  return `<path d="M${x-120*k} ${y-20*k} q30 -70 70 -40 q40 -60 80 -10 q40 -40 70 20 Z" fill="${LET}" stroke="${LETD}" stroke-width="6"/>`+
    `<circle cx="${x+40*k}" cy="${y-38*k}" r="${26*k}" fill="${TOM}" stroke="${NAVY}" stroke-width="5"/>`+
    `<path d="M${x-150*k} ${y-20*k} L${x+150*k} ${y-20*k} Q${x+140*k} ${y+90*k} ${x} ${y+95*k} Q${x-140*k} ${y+90*k} ${x-150*k} ${y-20*k} Z" fill="#ffffff" stroke="${NAVY}" stroke-width="8" stroke-linejoin="round"/>`+
    `<path d="M${x-120*k} ${y+20*k} Q${x} ${y+40*k} ${x+120*k} ${y+20*k}" stroke="${BLUE}" stroke-width="${10*k}" fill="none" stroke-linecap="round"/>`;
}
// ---------------- hook: rinse under the tap ----------------
function sTP(T,f,A){
  const X=600;let s=bg4(X,'#eaf1ff');
  s+=`<rect x="${X-700}" y="560" width="1400" height="900" fill="#dfe6f5" transform="scale(1,1.6)" transform-origin="0 600"/>`;
  s+=sink(X,560,520);
  s+=turkey(X,560,0.78);
  s+=faucet(X-10,250,T.flow,f);
  // germs on the bird
  const gs=[[-80,480],[40,450],[110,510],[-20,530]];for(const [dx,dy] of gs)s+=germ(X+dx,dy,16,1);
  // splash: droplets burst outward, some huge toward the camera
  const sp=T.spray||0;
  const D=[[-1,-0.6,1.0,28,1],[1,-0.8,0.9,34,1],[-1.3,-0.1,0.8,22,0],[1.4,-0.2,1.1,30,1],[-0.6,-1,1.2,24,0],[0.7,-1.1,0.7,20,1],[-1.6,-0.7,1.0,60,1],[1.7,-0.5,1.0,72,1],[0.2,-1.3,0.9,26,1]];
  if(sp>0.01)D.forEach((d,i)=>{const u=((sp*1.0+i*0.13)%1);const big=d[3]>50;
    const x=X+d[0]*(big?330:300)*(0.25+u), y=470+d[1]*260*(0.3+u)+(big?0:u*u*120), r=d[3]*(big?(0.6+0.7*u):(0.7+0.5*u));
    s+=drop(x,y,r,c4(sp*3,0,1)*(big?1:(1-u*0.3)),d[4]);});
  A.turkey={x:X,y:470};A.tap={x:X,y:240};
  return s;
}
// ---------------- splash map ----------------
function sSP(T,f,A){
  const X=2600;let s=bg4(X,'#eaf1ff');
  s+=`<rect x="${X-700}" y="600" width="1400" height="900" fill="#dfe6f5" transform="scale(1,1.6)" transform-origin="0 600"/>`;
  s+=`<rect x="${X-470}" y="570" width="940" height="60" rx="14" fill="${STEEL}" stroke="${NAVY}" stroke-width="8"/>`;
  // sink basin in the middle with the bird
  s+=`<path d="M${X-150} 600 L${X-130} 720 Q${X} 745 ${X+130} 720 L${X+150} 600 Z" fill="#e6ecf8" stroke="${NAVY}" stroke-width="8" stroke-linejoin="round"/>`;
  s+=turkey(X,555,0.55);
  // cutting board on the counter (left), salad bowl (right)
  s+=`<rect x="${X-440}" y="525" width="200" height="46" rx="12" fill="#e7b77a" stroke="${NAVY}" stroke-width="7"/>`;
  s+=bowl(X+320,500,0.8);
  const a=T.arcs||0, l1=T.l1||0, l2=T.l2||0, l3=T.l3||0;
  // arcs: dashed trajectories from the bird
  const tr=[[X-340,520,-1],[X+320,450,1],[X-90,650,-0.3]];
  tr.forEach((t,i)=>{const o=c4(a*3-i*0.6,0,1);if(o<0.01)return;
    const mx=(X+t[0])/2, my=Math.min(330,t[1]-220);
    s+=`<path d="M${X} 460 Q${mx} ${my} ${t[0]} ${t[1]}" stroke="${WATER}" stroke-width="8" stroke-dasharray="4 22" stroke-linecap="round" fill="none" opacity="${o}"/>`;
    for(let j=1;j<=3;j++){const u=j/4*o;const bx=(1-u)*(1-u)*X+2*(1-u)*u*mx+u*u*t[0], by=(1-u)*(1-u)*460+2*(1-u)*u*my+u*u*t[1];s+=drop(bx,by,18,o,j===3);}
    if(o>0.9)s+=germ(t[0]+(i===0?60:-40),t[1]+(i===2?0:-10),18,c4((o-0.9)*10,0,1));
  });
  if(l1>0.01)s+=tx4(X-60,830,'SINK',80,NAVY,`opacity="${l1}"`);
  if(l2>0.01)s+=tx4(X-300,440,'COUNTER',62,NAVY,`opacity="${l2}"`);
  if(l3>0.01)s+=tx4(X+320,730,'SALAD',80,RED3,`opacity="${l3}"`);
  A.sink={x:X,y:620};A.salad={x:X+320,y:470};A.counter={x:X-340,y:520};
  return s;
}
// ---------------- USDA study cards ----------------
function card(x,y,pct,o,lab1,lab2,icon){
  return `<g opacity="${o}"><rect x="${x-200}" y="${y-200}" width="400" height="420" rx="34" fill="#ffffff" stroke="${NAVY}" stroke-width="8"/>`+icon+
    `<text x="${x}" y="${y+110}" font-size="120" font-weight="900" fill="${RED3}" text-anchor="middle" ${F4}>${pct}</text>`+
    `<text x="${x}" y="${y+160}" font-size="40" font-weight="900" fill="${NAVY}" text-anchor="middle" ${F4}>${lab1}</text>`+
    `<text x="${x}" y="${y+204}" font-size="40" font-weight="900" fill="${NAVY}" text-anchor="middle" ${F4}>${lab2}</text></g>`;
}
function sST(T,f,A){
  const X=4600;let s=bg4(X,'#fff4e0');
  const h=T.head||0,c1=T.c1||0,c2=T.c2||0,n1=T.n1||0,n2=T.n2||0;
  s+=tx4(X,170,'USDA STUDY',84,BLUE,`opacity="${h}"`);
  s+=tx4(X,232,'PEOPLE WHO RINSED RAW POULTRY',40,'#5d6685',`opacity="${h}"`);
  const ic1=`<path d="M${X-215-80} ${480-130} L${X-215-60} ${480-40} Q${X-215} ${480-25} ${X-215+60} ${480-40} L${X-215+80} ${480-130} Z" fill="#e6ecf8" stroke="${NAVY}" stroke-width="6"/>`+germ(X-215-20,480-80,14,1)+germ(X-215+30,480-70,12,1);
  const ic2=`<g transform="translate(${X+215} ${480-90}) scale(0.55) translate(${-(X+215)} ${-(480-90)})">`+bowl(X+215,480-90,1)+`</g>`+germ(X+215+20,480-125,13,1);
  const p1=Math.round(60*n1), p2=Math.round(26*n2);
  if(c1>0.01)s+=card(X-215,480,p1+'%',c1,'BACTERIA IN','THE SINK',ic1);
  if(c2>0.01)s+=card(X+215,480,p2+'%',c2,'BACTERIA ON','THE SALAD',ic2);
  A.c1={x:X-215,y:480};A.c2={x:X+215,y:480};
  return s;
}
// ---------------- only heat kills them ----------------
function sHT(T,f,A){
  const X=6600;let s=bg4(X,'#fff1e6');
  const nr=T.norinse||0, th=T.therm||0, ck=T.cook||0;
  // roasting pan with the bird turning golden as it cooks
  const mix=(a,b,u)=>{const p=n=>[1,3,5].map(i=>parseInt(n.substr(i,2),16));const A1=p(a),B1=p(b);return '#'+A1.map((v,i)=>Math.round(v+(B1[i]-v)*u).toString(16).padStart(2,'0')).join('');};
  s+=`<path d="M${X-260} 600 L${X+260} 600 L${X+220} 690 L${X-220} 690 Z" fill="${STEELD}" stroke="${NAVY}" stroke-width="8" stroke-linejoin="round"/>`;
  s+=turkey(X,560,0.78,mix(RAW,GOLD3,ck),mix(RAWD,GOLD3D,ck));
  // germs pop away as heat climbs
  const gs=[[-80,480],[40,450],[110,510],[-20,530]];
  gs.forEach((g,i)=>{const k=c4(th*1.6-i*0.15-0.3,0,1);if(k<1)s+=germ(X+g[0],g[1]-k*30,16*(1-k*0.6),1-k);
    if(k>0.3&&k<1)s+=`<g opacity="${1-k}"><path d="M${X+g[0]-30} ${g[1]-40} l-16 -16 M${X+g[0]+30} ${g[1]-40} l16 -16 M${X+g[0]} ${g[1]-50} l0 -22" stroke="${GOLD3D}" stroke-width="6" stroke-linecap="round"/></g>`;});
  // probe thermometer in the thigh, dial reading climbs to 165
  if(th>0.01){const tx0=X+120,ty0=420,deg=Math.round(40+125*c4(th,0,1));
    s+=`<g opacity="${c4(th*4,0,1)}"><line x1="${tx0}" y1="${ty0}" x2="${tx0-60}" y2="${ty0+150}" stroke="${STEELD}" stroke-width="12" stroke-linecap="round"/><line x1="${tx0}" y1="${ty0}" x2="${tx0-60}" y2="${ty0+150}" stroke="${NAVY}" stroke-width="3" stroke-linecap="round" opacity=".5"/>`+
      `<circle cx="${tx0+10}" cy="${ty0-70}" r="104" fill="#ffffff" stroke="${NAVY}" stroke-width="8"/>`+
      `<text x="${tx0+10}" y="${ty0-52}" font-size="${deg>=100?54:58}" font-weight="900" fill="${deg>=165?RED3:NAVY}" text-anchor="middle" ${F4}>${deg}°F</text></g>`;
    if(th>0.98)s+=tx4(X,800,'165°F KILLS THEM',80,RED3,`opacity="${c4((th-0.98)*50,0,1)}"`);}
  // the rinse, crossed out (top left)
  if(nr>0.01){const fx=X-290,fy=240;
    s+=`<g opacity="${nr}"><circle cx="${fx}" cy="${fy}" r="95" fill="#ffffff" stroke="${NAVY}" stroke-width="7"/>`+
      `<path d="M${fx+40} ${fy+40} L${fx+40} ${fy-20} Q${fx+40} ${fy-55} ${fx+5} ${fy-55} Q${fx-25} ${fy-55} ${fx-25} ${fy-30}" stroke="${STEELD}" stroke-width="18" fill="none" stroke-linecap="round"/>`+
      `<rect x="${fx-32}" y="${fy-25}" width="14" height="60" rx="6" fill="${WATER}"/>`+
      `<line x1="${fx-65}" y1="${fy-65}" x2="${fx+65}" y2="${fy+65}" stroke="${RED3}" stroke-width="16" stroke-linecap="round"/>`+
      `<circle cx="${fx}" cy="${fy}" r="95" fill="none" stroke="${RED3}" stroke-width="14"/></g>`+tx4(fx,fy+150,'SKIP IT',60,RED3,`opacity="${nr}"`);}
  A.turkey={x:X,y:470};A.therm={x:X+130,y:350};
  return s;
}
// ---------------- scrub the sink ----------------
function sSK(T,f,A){
  const X=8600;let s=bg4(X,'#eaf1ff');
  s+=`<rect x="${X-700}" y="560" width="1400" height="900" fill="#dfe6f5" transform="scale(1,1.6)" transform-origin="0 600"/>`;
  s+=sink(X,500,560);
  const sc=T.scrub||0, sb=T.suds||0;
  // germs in the basin fade as the suds rise
  [[-120,600],[-20,640],[90,610],[160,590]].forEach((g,i)=>{s+=germ(X+g[0],g[1],15,c4(1-sb*1.4+i*0.08,0,1));});
  // suds
  for(let i=0;i<16;i++){const o=c4(sb*16-i,0,1);if(o<0.01)continue;const x=X-220+((i*97)%440),y=560+((i*53)%120)-o*10,r=24+((i*13)%22);
    s+=`<circle cx="${x}" cy="${y}" r="${r}" fill="#ffffff" stroke="${WATER}" stroke-width="4" opacity="${o}"/><circle cx="${x-r*0.35}" cy="${y-r*0.35}" r="${r*0.2}" fill="#dfe8ff" opacity="${o}"/>`;}
  // sponge scrubbing back and forth
  if(sc>0.01){const sx=X+Math.sin(f*0.5)*110*c4(sc*3,0,1), sy=560;
    s+=`<g opacity="${c4(sc*4,0,1)}"><rect x="${sx-80}" y="${sy-50}" width="160" height="64" rx="16" fill="#ffd43b" stroke="${NAVY}" stroke-width="7"/><rect x="${sx-80}" y="${sy-50}" width="160" height="24" rx="10" fill="${LET}" stroke="${NAVY}" stroke-width="7"/></g>`;}
  // steam squiggles: hot water
  for(let i=0;i<3;i++){const x=X-90+i*90,o=c4(sb*2,0,1)*0.8;s+=`<path d="M${x} ${470-((f*2+i*20)%40)} q-18 -30 0 -60 t0 -60" stroke="${STEELD}" stroke-width="7" fill="none" stroke-linecap="round" opacity="${o}"/>`;}
  if(sb>0.3)s+=tx4(X,860,'HOT, SOAPY WATER',70,BLUE,`opacity="${c4((sb-0.3)*3,0,1)}"`);
  A.sink={x:X,y:600};
  return s;
}
window.PROPS={
  labelY:150,
  draw(T,f){const A={};let s='';
    const fn={TP:sTP,SP:sSP,ST:sST,HT:sHT,SK:sSK};
    s+=fn[T.sc||'TP'](T,f,A);
    return {svg:s,anchors:A};
  },
  grip(T){return {x:600,y:400};}
};
