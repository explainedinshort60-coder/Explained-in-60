// 025 dust props (Is It Really?). Flat home diagrams, scenes along x, centered near world y 420:
//  HK x 600    hook: a floor heat register in a wood floor, Blue's breath blows a gray dust cloud up off the louvers
//  MG x 2600   magnifier on a dust bunny: soil, sand, pollen, fibers, hair and a few pale skin chips; FROM OUTSIDE tags
//  HS x 4600   house cutaway: a sneaker and a dog track dirt in through the front door, tiny bits float in the window
//  PC x 6600   the dust pile as one bar: 60%+ OUTDOORS (yard green), then SKIN and FIBERS; a tiny yard sprouts on top
//  DR x 8600   inside the front door: shoes off, a good mat traps the dirt at the door
//  FL x 10600  furnace filter: the gray old one slides out, a clean one goes in, floating dust gets TRAPPED
// Contract: window.PROPS = {draw(T,f)->{svg, anchors}, grip(T)->{x,y}, labelY}
const DUST='#b9ad9a',DUSTD='#857a68',SOIL='#9a6a3e',SOILD='#6b4422',YARD='#7fb446',YARDD='#4c7d22',POLL='#f2c230',SKIN6='#f6d2b8',RED6='#e8273a',WOOD='#d9b27c',WOODD='#b58950',WALL='#fff4e0',SKY6='#d8ecff',GRILL='#f4f6fb',GRILLD='#a9b2c8',ORNG='#f08a24';
const F6='font-family="DejaVu Sans, sans-serif"';
function c6(v,a,b){return Math.max(a,Math.min(b,v));}
function tx6(x,y,s,size,fill,extra){return `<text x="${x}" y="${y}" font-size="${size}" font-weight="900" fill="${fill||NAVY}" text-anchor="middle" stroke="#fdfcf1" stroke-width="${size/5}" paint-order="stroke" ${F6} ${extra||''}>${s}</text>`;}
function bg6(x0,col){return `<rect x="${x0-800}" y="-1400" width="1600" height="3600" fill="${col}"/>`;}
function floor6(x0,y){let s=`<rect x="${x0-800}" y="${y}" width="1600" height="1400" fill="${WOOD}"/><rect x="${x0-800}" y="${y}" width="1600" height="16" fill="${WOODD}"/>`;
  for(let i=1;i<6;i++)s+=`<line x1="${x0-800}" y1="${y+i*90}" x2="${x0+800}" y2="${y+i*90}" stroke="${WOODD}" stroke-width="5" opacity=".6"/>`;
  return s;}
function puff(x,y,r,o,col){if(o<0.01)return '';col=col||DUST;
  return `<g opacity="${o}"><circle cx="${x}" cy="${y}" r="${r}" fill="${col}" stroke="${NAVY}" stroke-width="5"/><circle cx="${x-r*0.7}" cy="${y+r*0.25}" r="${r*0.72}" fill="${col}" stroke="${NAVY}" stroke-width="5"/><circle cx="${x+r*0.72}" cy="${y+r*0.2}" r="${r*0.68}" fill="${col}" stroke="${NAVY}" stroke-width="5"/>`+
    `<circle cx="${x}" cy="${y}" r="${r*0.96}" fill="${col}"/><circle cx="${x-r*0.7}" cy="${y+r*0.25}" r="${r*0.68}" fill="${col}"/><circle cx="${x+r*0.72}" cy="${y+r*0.2}" r="${r*0.64}" fill="${col}"/></g>`;}
function mote(x,y,r,col,o){return `<circle cx="${x}" cy="${y}" r="${r}" fill="${col}" stroke="${NAVY}" stroke-width="3" opacity="${o==null?1:o}"/>`;}
// --- particle icons (flat, readable at phone size)
function pSoil(x,y,k){return `<path d="M${x-26*k} ${y+6*k} L${x-12*k} ${y-22*k} L${x+18*k} ${y-18*k} L${x+28*k} ${y+8*k} L${x+6*k} ${y+24*k} Z" fill="${SOIL}" stroke="${NAVY}" stroke-width="5" stroke-linejoin="round"/>`;}
function pPollen(x,y,k){let s='';for(let i=0;i<10;i++){const a=i*Math.PI/5;s+=`<line x1="${x}" y1="${y}" x2="${x+Math.cos(a)*30*k}" y2="${y+Math.sin(a)*30*k}" stroke="${NAVY}" stroke-width="5" stroke-linecap="round"/>`;}
  return s+`<circle cx="${x}" cy="${y}" r="${20*k}" fill="${POLL}" stroke="${NAVY}" stroke-width="5"/>`;}
function pFiber(x,y,k,col,ang){return `<path d="M${x-60*k} ${y} q30 ${-40*k} 60 0 t60 0" transform="rotate(${ang||0} ${x} ${y})" stroke="${NAVY}" stroke-width="${14*k}" fill="none" stroke-linecap="round"/><path d="M${x-60*k} ${y} q30 ${-40*k} 60 0 t60 0" transform="rotate(${ang||0} ${x} ${y})" stroke="${col||BLUE}" stroke-width="${7*k}" fill="none" stroke-linecap="round"/>`;}
function pSkin(x,y,k){return `<path d="M${x-22*k} ${y-6*k} Q${x-4*k} ${y-20*k} ${x+20*k} ${y-10*k} Q${x+26*k} ${y+10*k} ${x+4*k} ${y+14*k} Q${x-20*k} ${y+12*k} Z" fill="${SKIN6}" stroke="${NAVY}" stroke-width="4" stroke-linejoin="round"/>`;}
function tag6(x,y,s,col,o,size){if(o<0.01)return '';size=size||40;const w=s.length*size*0.68+30;
  return `<g opacity="${o}"><rect x="${x-w/2}" y="${y-size*0.95}" width="${w}" height="${size*1.35}" rx="${size*0.45}" fill="${col}" stroke="${NAVY}" stroke-width="6"/>`+
    `<text x="${x}" y="${y}" font-size="${size}" font-weight="900" fill="#fff" text-anchor="middle" ${F6}>${s}</text></g>`;}
// ---------------- hook: Blue blows the dust off a floor register ----------------
function register(x,y,w,h,dusty){
  let s=`<rect x="${x-w/2-24}" y="${y-h/2-24}" width="${w+48}" height="${h+48}" rx="14" fill="${GRILL}" stroke="${NAVY}" stroke-width="9"/>`+
    `<rect x="${x-w/2}" y="${y-h/2}" width="${w}" height="${h}" rx="6" fill="#3a4466" stroke="${NAVY}" stroke-width="6"/>`;
  const n=7;for(let i=0;i<n;i++){const yy=y-h/2+18+i*(h-30)/(n-1);
    s+=`<rect x="${x-w/2+10}" y="${yy-9}" width="${w-20}" height="18" rx="7" fill="${GRILL}" stroke="${GRILLD}" stroke-width="4"/>`;
    if(dusty>0.01)s+=`<rect x="${x-w/2+14}" y="${yy-17}" width="${w-28}" height="${12}" rx="6" fill="${DUST}" opacity="${dusty}"/>`;}
  return s;}
function sHK(T,f,A){
  const X=600;let s=bg6(X,WALL)+`<rect x="${X-800}" y="600" width="1600" height="40" fill="#fff" stroke="${NAVY}" stroke-width="6"/>`+floor6(X,640);
  s+=`<ellipse cx="${X}" cy="770" rx="330" ry="34" fill="${NAVY}" opacity=".12"/>`;
  const b=T.blow||0;
  s+=register(X,790,600,170,1-b*0.6);
  // breath gust from the left (Blue is off screen left)
  for(let i=0;i<3;i++){const u=((f*0.06+i/3)%1);const gx=X-560+u*300;
    s+=`<path d="M${gx} ${520+i*50} q40 -20 80 0 t80 0" stroke="${BLUE}" stroke-width="12" fill="none" stroke-linecap="round" opacity="${(1-u)*0.9}"/>`;}
  // the dust cloud billows up toward the camera
  const g=c6(0.55+b*0.6+Math.sin(f*0.2)*0.04,0,1.2);
  s+=puff(X+40,700-200*g,150*g,0.95)+puff(X+240,640-150*g,95*g,0.85)+puff(X-170,660-140*g,85*g,0.8);
  for(let i=0;i<28;i++){const a=i*2.39, rr=120+((i*53+f*4)%260);
    s+=mote(X+40+Math.cos(a)*rr*1.3,600-200*g+Math.sin(a)*rr*0.8,7+(i%3)*3,i%4===0?SKIN6:(i%4===1?SOIL:DUST),0.85);}
  s+=tx6(X,180,'ALL DEAD SKIN?',96,RED6,`transform="rotate(-3 ${X} 160)"`);
  A.vent={x:X,y:760};A.cloud={x:X,y:420};
  return s;}
// ---------------- magnifier: what is actually in the dust bunny ----------------
function sMG(T,f,A){
  const X=2600;let s=bg6(X,WALL)+floor6(X,820);
  // couch leg and bottom edge
  s+=`<rect x="${X-800}" y="560" width="520" height="190" rx="30" fill="${BLUE}" stroke="${NAVY}" stroke-width="9"/><rect x="${X-360}" y="745" width="44" height="80" fill="${WOODD}" stroke="${NAVY}" stroke-width="7"/>`;
  // dust bunny on the floor
  s+=puff(X-120,800,60,1)+`<line x1="${X-120}" y1="800" x2="${X+20}" y2="560" stroke="${NAVY}" stroke-width="10" opacity="${c6(T.mag||0,0,1)}"/>`;
  // lens
  const m=c6(T.mag||0,0,1), R=310*m+1, LX=X+90, LY=420;
  if(m>0.01){
    s+=`<rect x="${LX+R*0.62}" y="${LY+R*0.62}" width="${70}" height="${260*m}" rx="30" transform="rotate(-45 ${LX+R*0.62} ${LY+R*0.62})" fill="${NAVY}"/>`;
    s+=`<circle cx="${LX}" cy="${LY}" r="${R+24}" fill="${NAVY}"/><circle cx="${LX}" cy="${LY}" r="${R}" fill="#f3efe6"/>`;
    s+=`<clipPath id="lens6"><circle cx="${LX}" cy="${LY}" r="${R-4}"/></clipPath><g clip-path="url(#lens6)">`;
    const k=1.25*m, jit=i=>Math.sin(f*0.15+i)*4;
    const OUT=[[-200,-120,'s'],[-60,-200,'s'],[140,-170,'p'],[200,-30,'s'],[-220,40,'f',SOIL],[-120,170,'s'],[60,200,'p'],[190,130,'s'],[-20,-60,'s'],[90,60,'s']];
    OUT.forEach((p,i)=>{const x=LX+p[0]*m+jit(i),y=LY+p[1]*m+jit(i+3);
      s+=p[2]==='s'?pSoil(x,y,k):p[2]==='p'?pPollen(x,y,k):pFiber(x,y,k*0.8,YARDD,20);});
    s+=pFiber(LX-30*m,LY+80*m,k,BLUE,-15)+pFiber(LX+60*m,LY-100*m,k*0.9,ORNG,35);
    const SK=[[-110,-20],[150,-90],[-40,110]];SK.forEach((p,i)=>{s+=pSkin(LX+p[0]*m+jit(i+7),LY+p[1]*m,k);});
    s+=`</g><circle cx="${LX}" cy="${LY}" r="${R}" fill="none" stroke="#fff" stroke-width="10" opacity=".5" stroke-dasharray="120 900"/>`;
  }
  s+=tag6(LX,LY+R+110,'FROM OUTSIDE',YARDD,c6(T.out||0,0,1),56);
  s+=tag6(LX+250,LY-R-30,'SKIN','#c98a6a',c6(T.skin||0,0,1),44);
  A.lens={x:LX,y:LY};
  return s;}
// ---------------- house cutaway: how it gets in ----------------
function sneaker(x,y,k,lift){
  return `<g transform="translate(0 ${-lift||0})"><path d="M${x-120*k} ${y} L${x-120*k} ${y-60*k} Q${x-110*k} ${y-110*k} ${x-50*k} ${y-110*k} L${x-10*k} ${y-110*k} Q${x+30*k} ${y-60*k} ${x+110*k} ${y-50*k} Q${x+140*k} ${y-40*k} ${x+140*k} ${y} Z" fill="${BLUE}" stroke="${NAVY}" stroke-width="8" stroke-linejoin="round"/>`+
    `<rect x="${x-128*k}" y="${y-6*k}" width="${276*k}" height="${26*k}" rx="${12*k}" fill="#fff" stroke="${NAVY}" stroke-width="7"/>`+
    `<path d="M${x-40*k} ${y-90*k} l40 ${18*k} M${x-20*k} ${y-100*k} l40 ${18*k}" stroke="#fff" stroke-width="7" stroke-linecap="round"/></g>`;}
function paw(x,y,k,o){if(o<0.01)return '';
  return `<g opacity="${o}"><ellipse cx="${x}" cy="${y}" rx="${26*k}" ry="${20*k}" fill="${SOIL}"/>`+[-28,-10,10,28].map((d,i)=>`<circle cx="${x+d*k}" cy="${y-(i%3===0?24:32)*k}" r="${9*k}" fill="${SOIL}"/>`).join('')+'</g>';}
function sHS(T,f,A){
  const X=4600;let s=bg6(X,SKY6);
  // outside yard on the left, house wall with door and window
  s+=`<rect x="${X-800}" y="760" width="1600" height="1400" fill="${YARD}"/><rect x="${X-800}" y="760" width="1600" height="14" fill="${YARDD}"/>`;
  s+=`<rect x="${X-230}" y="40" width="1030" height="730" fill="${WALL}" stroke="${NAVY}" stroke-width="9"/><rect x="${X-230}" y="760" width="1030" height="1400" fill="${WOOD}"/><line x1="${X-230}" y1="768" x2="${X+800}" y2="768" stroke="${NAVY}" stroke-width="7"/>`;
  // open door
  s+=`<rect x="${X-230}" y="250" width="220" height="510" fill="#3a4466" stroke="${NAVY}" stroke-width="8"/><path d="M${X-230} 250 L${X-330} 300 L${X-330} 800 L${X-230} 760 Z" fill="${ORNG}" stroke="${NAVY}" stroke-width="8" stroke-linejoin="round"/>`;
  // window with air bits drifting in
  s+=`<rect x="${X+330}" y="170" width="300" height="250" fill="${SKY6}" stroke="${NAVY}" stroke-width="9"/><line x1="${X+480}" y1="170" x2="${X+480}" y2="420" stroke="${NAVY}" stroke-width="7"/>`;
  const air=c6(T.air||0,0,1);
  if(air>0.01){for(let i=0;i<12;i++){const u=((f*0.012+i/12)%1);const x=X+480-120+((i*71)%240)+u*0, y=290+((i*37)%110)-60+u*420;
      s+=mote(x+Math.sin(u*8+i)*30,y,8+(i%3)*2,i%3===0?POLL:(i%3===1?SOIL:DUST),air*(1-u*0.6));}
    s+=`<path d="M${X+420} 450 q30 40 0 80 q-30 40 0 80" stroke="${BLUE}" stroke-width="12" fill="none" stroke-linecap="round" opacity="${air}"/><path d="M${X+400} 590 l20 34 l24 -30" stroke="${BLUE}" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="${air}"/>`;}
  // sneaker steps in from the yard, leaving dirt prints on the floor
  const sh=c6(T.shoe||0,0,1);
  for(let i=0;i<4;i++){const px=X-160+i*150;if(sh*4>i+0.5)s+=`<g opacity=".95">${pSoil(px,800,0.8)}${pSoil(px+40,812,0.5)}</g>`;}
  const sx=X-500+sh*700;
  s+=sneaker(sx,770,1.0,Math.abs(Math.sin(sh*Math.PI*3))*40);
  for(let i=0;i<5;i++){s+=pSoil(sx-60+i*36,780,0.45);}
  // dog paw prints
  const pw=c6(T.paw||0,0,1);
  for(let i=0;i<4;i++)s+=paw(X-80+i*160,890+(i%2)*40,1,c6(pw*4-i,0,1));
  s+=tag6(X+60,640,'SHOES',BLUE,sh,52)+tag6(X+380,1000,'PAWS',SOILD,pw,52)+tag6(X+480,110,'AIR',BLUE,air,52);
  A.door={x:X-120,y:500};
  return s;}
// ---------------- the pile as a bar: 60%+ from outdoors ----------------
function sPC(T,f,A){
  const X=6600;let s=bg6(X,'#eef3ff');
  const bx=X-420, by=320, bw=840, bh=260, o=c6(T.bar||0,0,1), g=c6(T.grow||0,0,1);
  s+=`<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="40" fill="${DUST}" stroke="${NAVY}" stroke-width="10"/>`;
  // speckles so the bar still reads as dust
  for(let i=0;i<30;i++)s+=mote(bx+30+((i*97)%(bw-60)),by+30+((i*53)%(bh-60)),6,DUSTD,0.6);
  const gw=bw*0.62*g;
  if(gw>2){s+=`<rect x="${bx}" y="${by}" width="${gw}" height="${bh}" rx="40" fill="${YARD}" stroke="${NAVY}" stroke-width="10"/>`;
    for(let i=0;i<10;i++){const xx=bx+40+((i*67)%Math.max(40,gw-80));s+=pSoil(xx,by+70+((i*41)%130),0.8);}
    // a tiny yard sprouting on top of the green part
    const yd=c6(T.yard||0,0,1);
    if(yd>0.01)for(let i=0;i<7;i++){const xx=bx+50+i*(gw-100)/6;s+=`<path d="M${xx} ${by+4} q-10 ${-50*yd} -24 ${-70*yd} M${xx} ${by+4} q4 ${-56*yd} 18 ${-80*yd}" stroke="${YARDD}" stroke-width="9" fill="none" stroke-linecap="round"/>`;}
  }
  s+=tx6(bx+bw*0.31,by+bh+130,'60%+',120,YARDD,`opacity="${g}"`)+tx6(bx+bw*0.31,by+bh+220,'OUTDOORS',72,YARDD,`opacity="${g}"`);
  const sk=c6(T.skin||0,0,1);
  if(sk>0.01){s+=`<g opacity="${sk}">`+pSkin(bx+bw*0.74,by+90,1.6)+pSkin(bx+bw*0.86,by+170,1.4)+pFiber(bx+bw*0.8,by+bh-60,1,BLUE,-10)+pFiber(bx+bw*0.9,by+70,0.8,ORNG,20)+'</g>';
    s+=tag6(bx+bw*0.81,by-70,'SKIN','#c98a6a',sk,46)+tag6(bx+bw*0.81,by+bh+100,'FIBERS',BLUE,c6(T.fib||0,0,1),46);}
  s+=tx6(X,180,'ONE STUDY',64,NAVY,`opacity="${g}"`);
  A.bar={x:X,y:by+bh/2};
  return s;}
// ---------------- the fix: shoes off at the door, a good mat ----------------
function sDR(T,f,A){
  const X=8600;let s=bg6(X,WALL)+floor6(X,800);
  // front door (closed, inside view)
  s+=`<rect x="${X-420}" y="120" width="340" height="690" rx="10" fill="${ORNG}" stroke="${NAVY}" stroke-width="9"/><circle cx="${X-120}" cy="480" r="20" fill="${POLL}" stroke="${NAVY}" stroke-width="6"/>`+
     `<rect x="${X-380}" y="170" width="260" height="220" rx="10" fill="none" stroke="${NAVY}" stroke-width="6"/><rect x="${X-380}" y="430" width="260" height="320" rx="10" fill="none" stroke="${NAVY}" stroke-width="6"/>`;
  // mat just inside the door
  const mt=c6(T.mat||0,0,1);
  s+=`<g opacity="${mt}"><path d="M${X-470} 860 L${X+30} 860 L${X+70} 960 L${X-510} 960 Z" fill="#c9a46a" stroke="${NAVY}" stroke-width="9" stroke-linejoin="round"/>`;
  for(let i=0;i<9;i++)s+=`<line x1="${X-440+i*55}" y1="870" x2="${X-460+i*58}" y2="950" stroke="#a5814a" stroke-width="7"/>`;
  for(let i=0;i<9;i++)s+=pSoil(X-430+((i*113)%460),890+((i*29)%50),0.55);
  s+='</g>'+tag6(X-220,1060,'GOOD MAT',YARDD,mt,50);
  // shoes come off and line up next to the door
  const of=c6(T.off||0,0,1);
  s+=sneaker(X+160,940,0.8,(1-of)*120)+sneaker(X+380,950,0.8,(1-of)*160);
  s+=tag6(X+270,700,'SHOES OFF',BLUE,of,54);
  // clean floor sparkle past the mat
  if(mt>0.5){for(let i=0;i<3;i++){const x=X+150+i*170, y=1080+(i%2)*40, r=18+6*Math.sin(f*0.3+i);s+=`<path d="M${x} ${y-r} L${x+r*0.3} ${y-r*0.3} L${x+r} ${y} L${x+r*0.3} ${y+r*0.3} L${x} ${y+r} L${x-r*0.3} ${y+r*0.3} L${x-r} ${y} L${x-r*0.3} ${y-r*0.3} Z" fill="#fff" stroke="${NAVY}" stroke-width="4" opacity="${(mt-0.5)*2}"/>`;}}
  A.mat={x:X-220,y:910};
  return s;}
// ---------------- the furnace filter ----------------
function filter6(x,y,w,h,dirt){
  const col=dirt>0.5?'#9c958a':'#fbfaf5';
  let s=`<rect x="${x-w/2}" y="${y-h/2}" width="${w}" height="${h}" rx="8" fill="${col}" stroke="${NAVY}" stroke-width="9"/>`;
  for(let i=1;i<12;i++){const xx=x-w/2+i*w/12;s+=`<path d="M${xx} ${y-h/2+16} l-14 ${h/6} l14 ${h/6} l-14 ${h/6} l14 ${h/6} l-14 ${h/6} l14 ${h/6-16}" stroke="${dirt>0.5?'#6f695f':'#c9ccd8'}" stroke-width="5" fill="none"/>`;}
  s+=`<rect x="${x-w/2}" y="${y-h/2}" width="${w}" height="${h}" rx="8" fill="none" stroke="#e7d6a8" stroke-width="22"/><rect x="${x-w/2}" y="${y-h/2}" width="${w}" height="${h}" rx="8" fill="none" stroke="${NAVY}" stroke-width="8"/>`;
  return s;}
function sFL(T,f,A){
  const X=10600;let s=bg6(X,'#eef3ff')+floor6(X,980);
  // furnace cabinet with a filter slot
  s+=`<rect x="${X-330}" y="120" width="660" height="870" rx="18" fill="#dfe4f1" stroke="${NAVY}" stroke-width="10"/><rect x="${X-280}" y="180" width="560" height="200" rx="10" fill="#c7cee2" stroke="${NAVY}" stroke-width="6"/>`+
     `<rect x="${X-290}" y="580" width="580" height="40" rx="6" fill="#3a4466" stroke="${NAVY}" stroke-width="6"/>`;
  for(let i=0;i<5;i++)s+=`<rect x="${X-230+i*100}" y="230" width="60" height="16" rx="8" fill="#3a4466"/>`;
  const out=c6(T.out||0,0,1), inn=c6(T.inn||0,0,1);
  // old gray filter slides out to the left, new one slides in from the right
  s+=filter6(X-out*200,600+out*520,560-out*120,300-out*80,1);
  if(inn>0.01)s+=filter6(X+(1-inn)*760,600,560,300,0);
  s+=tag6(X-200,1290,'OLD',DUSTD,out,46);
  // floating dust drifts in and sticks to the new filter
  const tr=c6(T.trap||0,0,1);
  if(tr>0.01){for(let i=0;i<14;i++){const u=c6(tr*1.4-i/20,0,1);const sx=X+620, sy=200+(i*61)%700;const x=sx+(X-200+((i*53)%400)-sx)*u, y=sy+(560+((i*31)%90)-sy)*u;
      s+=mote(x,y,9,i%3===0?POLL:(i%3===1?SOIL:DUST),1);}
    s+=tag6(X,820,'TRAPPED',YARDD,c6(tr*2-0.8,0,1),56);}
  s+=tag6(X,90,'CHECK IT',BLUE,out,56);
  A.filter={x:X,y:600};
  return s;}
window.PROPS={labelY:150,
  draw(T,f){const A={};const sc=T.sc;let s='';
    if(sc==='HK')s=sHK(T,f,A);else if(sc==='MG')s=sMG(T,f,A);else if(sc==='HS')s=sHS(T,f,A);else if(sc==='PC')s=sPC(T,f,A);else if(sc==='DR')s=sDR(T,f,A);else s=sFL(T,f,A);
    return {svg:s,anchors:A};},
  grip(T){return {x:600,y:400};}
};
