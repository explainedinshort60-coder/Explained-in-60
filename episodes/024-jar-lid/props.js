// 024 jar lid props (You've Been Doing It Wrong). Flat kitchen diagrams, scenes along x, centered near world y 420:
//  HK x 600   hook: a pickle jar on the counter, a hand straining on the gold lid, the jar wobbles, it will not turn
//  VC x 2600  cross-section: few air dots inside (LESS AIR), crowds of air dots outside, big AIR PUSH arrows on the lid
//  FR x 4600  close-up of the lid edge: seal ring jammed on the glass rim, twist arrow blocked, FRICTION
//  SP x 6600  spoon slides under the lid edge and lifts, air rushes in, HSSS, the push arrows vanish
//  HW x 8600  hot tap water on the lid: METAL GROWS more than GLASS, lid loosens a hair, twist, it comes off
// Contract: window.PROPS = {draw(T,f)->{svg, anchors}, grip(T)->{x,y}, labelY}
const GOLD='#e2b23c',GOLDD='#a87a12',GLASS='#dff0f4',GLASSD='#9cc3cc',PICK='#7fb446',PICKD='#4c7d22',BRINE='#e8f2c4',RED4='#e8273a',SEAL='#e0705a',SKIN='#ffd9b8',SKIND='#e0a982',STEEL4='#cfd8ea',STEEL4D='#8f9bb8';
const F5='font-family="DejaVu Sans, sans-serif"';
function c5(v,a,b){return Math.max(a,Math.min(b,v));}
function tx5(x,y,s,size,fill,extra){return `<text x="${x}" y="${y}" font-size="${size}" font-weight="900" fill="${fill||NAVY}" text-anchor="middle" stroke="#fdfcf1" stroke-width="${size/5}" paint-order="stroke" ${F5} ${extra||''}>${s}</text>`;}
function bg5(x0,col){return `<rect x="${x0-700}" y="-1400" width="1400" height="3600" fill="${col}"/>`;}
function counter5(x0,y){return `<rect x="${x0-700}" y="${y}" width="1400" height="1400" fill="#e9d3b3"/><rect x="${x0-700}" y="${y}" width="1400" height="26" fill="#d4b48a"/>`;}
function pickles(x,y,k){ // a few pickles standing in brine
  let s='';const P=[[-90,30,-8],[-20,10,5],[55,35,-4],[110,20,9],[-130,60,12]];
  for(const p of P){s+=`<g transform="rotate(${p[2]} ${x+p[0]*k} ${y+p[1]*k})"><rect x="${x+p[0]*k-30*k}" y="${y+p[1]*k-110*k}" width="${60*k}" height="${230*k}" rx="${30*k}" fill="${PICK}" stroke="${PICKD}" stroke-width="5"/>`+
    `<circle cx="${x+p[0]*k-8*k}" cy="${y+p[1]*k-50*k}" r="${5*k}" fill="${PICKD}"/><circle cx="${x+p[0]*k+10*k}" cy="${y+p[1]*k+10*k}" r="${5*k}" fill="${PICKD}"/><circle cx="${x+p[0]*k-6*k}" cy="${y+p[1]*k+60*k}" r="${5*k}" fill="${PICKD}"/></g>`;}
  return s;
}
function jar(x,y,k,o){ // x,y = center of the lid top; front view, glass body below. o: {cut, lidUp, lidGrow}
  o=o||{};const W=190*k, H=430*k, lw=(170+(o.lidGrow||0))*k, lu=(o.lidUp||0);
  let s=`<ellipse cx="${x}" cy="${y+H+40*k}" rx="${W*1.05}" ry="${26*k}" fill="${NAVY}" opacity=".13"/>`;
  // glass body: shoulder up to a neck under the lid
  const top=y+48*k, bot=y+H+30*k;
  s+=`<path d="M${x-150*k} ${top} L${x-150*k} ${top+30*k} Q${x-W} ${top+50*k} ${x-W} ${top+110*k} L${x-W} ${bot-40*k} Q${x-W} ${bot} ${x-W+40*k} ${bot} L${x+W-40*k} ${bot} Q${x+W} ${bot} ${x+W} ${bot-40*k} L${x+W} ${top+110*k} Q${x+W} ${top+50*k} ${x+150*k} ${top+30*k} L${x+150*k} ${top} Z" fill="${GLASS}" stroke="${NAVY}" stroke-width="9" stroke-linejoin="round"/>`;
  if(!o.cut){
    s+=`<rect x="${x-W+16*k}" y="${top+120*k}" width="${2*W-32*k}" height="${bot-top-150*k}" rx="${30*k}" fill="${BRINE}"/>`+pickles(x,top+260*k,k);
    s+=`<rect x="${x-W+4*k}" y="${top+170*k}" width="${2*W-8*k}" height="${120*k}" fill="${IVORY}" stroke="${NAVY}" stroke-width="6"/>`+
       `<text x="${x}" y="${top+250*k}" font-size="${62*k}" font-weight="900" fill="${PICKD}" text-anchor="middle" ${F5}>PICKLES</text>`;
    s+=`<path d="M${x-W+30*k} ${top+140*k} L${x-W+30*k} ${bot-60*k}" stroke="#fff" stroke-width="${16*k}" stroke-linecap="round" opacity=".7"/>`;
  }
  // lid
  const ly=y-lu;
  s+=`<rect x="${x-lw}" y="${ly}" width="${2*lw}" height="${70*k}" rx="${14*k}" fill="${GOLD}" stroke="${NAVY}" stroke-width="9"/>`;
  for(let i=-6;i<=6;i++)s+=`<line x1="${x+i*lw/7}" y1="${ly+12*k}" x2="${x+i*lw/7}" y2="${ly+58*k}" stroke="${GOLDD}" stroke-width="${5*k}" stroke-linecap="round"/>`;
  s+=`<rect x="${x-lw+12*k}" y="${ly+6*k}" width="${2*lw-24*k}" height="${12*k}" rx="${6*k}" fill="#fff" opacity=".45"/>`;
  return s;
}
function hand(x,y,k,ang){ // a cartoon hand gripping from above, cobalt cuff (Blue's sleeve)
  return `<g transform="rotate(${ang||0} ${x} ${y})">`+
    `<rect x="${x-40*k}" y="${y-330*k}" width="${80*k}" height="${170*k}" rx="${20*k}" fill="${BLUE}" stroke="${NAVY}" stroke-width="8"/>`+
    `<path d="M${x-120*k} ${y+20*k} Q${x-150*k} ${y-170*k} ${x} ${y-180*k} Q${x+150*k} ${y-170*k} ${x+120*k} ${y+20*k} Z" fill="${SKIN}" stroke="${NAVY}" stroke-width="8" stroke-linejoin="round"/>`+
    [-90,-30,30,90].map(d=>`<rect x="${x+d*k-24*k}" y="${y-30*k}" width="${48*k}" height="${80*k}" rx="${22*k}" fill="${SKIN}" stroke="${NAVY}" stroke-width="7"/>`).join('')+
    `<path d="M${x-70*k} ${y-110*k} q20 -14 40 0" stroke="${SKIND}" stroke-width="${6*k}" fill="none" stroke-linecap="round"/></g>`;
}
function airDot(x,y,r,o){return `<circle cx="${x}" cy="${y}" r="${r}" fill="${WATER}" stroke="${NAVY}" stroke-width="3" opacity="${o==null?1:o}"/>`;}
function arrowDown(x,y,len,w,col,o){ // big flat arrow pointing down, tip at (x,y)
  if(o<0.01)return '';
  return `<path d="M${x-w*0.35} ${y-len} L${x+w*0.35} ${y-len} L${x+w*0.35} ${y-w*0.7} L${x+w*0.7} ${y-w*0.7} L${x} ${y} L${x-w*0.7} ${y-w*0.7} L${x-w*0.35} ${y-w*0.7} Z" fill="${col}" stroke="${NAVY}" stroke-width="7" stroke-linejoin="round" opacity="${o}"/>`;
}
function twistArrow(x,y,r,o,col,blocked){
  if(o<0.01)return '';
  let s=`<g opacity="${o}"><path d="M${x-r} ${y} A${r} ${r*0.32} 0 0 0 ${x+r} ${y}" stroke="${NAVY}" stroke-width="22" fill="none" stroke-linecap="round"/>`+
    `<path d="M${x-r} ${y} A${r} ${r*0.32} 0 0 0 ${x+r} ${y}" stroke="${col}" stroke-width="12" fill="none" stroke-linecap="round"/>`+
    `<path d="M${x+r-34} ${y-30} L${x+r+18} ${y+4} L${x+r-40} ${y+26} Z" fill="${col}" stroke="${NAVY}" stroke-width="6" stroke-linejoin="round"/>`;
  if(blocked)s+=`<g stroke="${RED4}" stroke-width="16" stroke-linecap="round"><line x1="${x-40}" y1="${y+r*0.32-40}" x2="${x+40}" y2="${y+r*0.32+40}"/><line x1="${x+40}" y1="${y+r*0.32-40}" x2="${x-40}" y2="${y+r*0.32+40}"/></g>`;
  return s+'</g>';
}
function faucet5(x,y,flow,f){
  let s=`<path d="M${x+190} ${y-260} L${x+190} ${y-140} Q${x+190} ${y-60} ${x+90} ${y-60} Q${x} ${y-60} ${x} ${y-20}" stroke="${NAVY}" stroke-width="56" fill="none" stroke-linecap="round"/>`+
    `<path d="M${x+190} ${y-260} L${x+190} ${y-140} Q${x+190} ${y-60} ${x+90} ${y-60} Q${x} ${y-60} ${x} ${y-20}" stroke="${STEEL4}" stroke-width="40" fill="none" stroke-linecap="round"/>`+
    `<rect x="${x-26}" y="${y-24}" width="52" height="26" rx="8" fill="${STEEL4D}" stroke="${NAVY}" stroke-width="6"/>`;
  if(flow>0.01){const L=150*flow;
    s+=`<rect x="${x-16}" y="${y}" width="32" height="${L}" rx="14" fill="${WATER}" opacity=".75"/>`;
    for(let i=0;i<3;i++){const yy=y+((f*14+i*50)%Math.max(30,L-20));s+=`<rect x="${x-6}" y="${yy}" width="8" height="22" rx="4" fill="#fff" opacity=".7"/>`;}}
  return s;
}
// ---------------- hook: the jar will not turn ----------------
function sHK(T,f,A){
  const X=600;let s=bg5(X,'#fff4e0')+counter5(X,870);
  const wob=Math.sin(f*1.3)*2.2*(T.strain||1);
  s+=`<g transform="rotate(${wob*0.4} ${X} 860)">`+jar(X,350,0.95)+hand(X,360,0.95,wob)+`</g>`;
  s+=twistArrow(X,300,250,0.9,BLUE,false);
  // strain marks
  const fl=(Math.floor(f/3)%2);
  s+=`<g stroke="${RED4}" stroke-width="12" stroke-linecap="round" opacity="${0.6+0.4*fl}">`+
     `<line x1="${X-330}" y1="190" x2="${X-280}" y2="230"/><line x1="${X-350}" y1="270" x2="${X-290}" y2="275"/>`+
     `<line x1="${X+330}" y1="190" x2="${X+280}" y2="230"/><line x1="${X+350}" y1="270" x2="${X+290}" y2="275"/></g>`;
  s+=`<path d="M${X+250} ${130+(f%24)*3} q14 22 0 34 q-14 -12 0 -34 Z" fill="${WATER}" stroke="${NAVY}" stroke-width="4" opacity="${1-(f%24)/24}"/>`;
  s+=tx5(X,800,'STUCK!',120,RED4,`transform="rotate(-4 ${X} 780)"`);
  A.lid={x:X,y:380};A.jar={x:X,y:600};
  return s;
}
// ---------------- cross-section: vacuum inside, air pushing outside ----------------
function airCrowd(X,f,o,inside){
  let s='';
  // outside: many dots around the jar, jiggling
  for(let i=0;i<46;i++){const gx=(i*137)%1240-620, gy=((i*89)%900)-60;
    const x=X+gx+Math.sin(f*0.3+i)*8, y=gy+Math.cos(f*0.27+i*1.7)*8;
    if(Math.abs(x-X)<230&&y>140&&y<900)continue;
    s+=airDot(x,y,15,o);}
  // inside the headspace: only three
  const H=[[-90,0],[30,-8],[100,6]];
  H.forEach((h,i)=>{s+=airDot(X+h[0]+Math.sin(f*0.2+i)*12,inside+h[1]+Math.cos(f*0.25+i)*6,15,o);});
  return s;
}
function cutJar(X,y,k,o){ // cross-section: lid profile over the glass rim, headspace, brine with pickles
  o=o||{};let s=jar(X,y,k,{cut:1,lidUp:o.lidUp||0});
  const W=190*k, top=y+48*k;
  s+=`<rect x="${X-W+14*k}" y="${top+150*k}" width="${2*W-28*k}" height="${300*k}" rx="${24*k}" fill="${BRINE}"/>`+pickles(X,top+330*k,0.8*k);
  // seal ring under the lid on the rim
  s+=`<rect x="${X-160*k}" y="${y+60*k-(o.lidUp||0)}" width="${40*k}" height="${12*k}" rx="5" fill="${SEAL}" stroke="${NAVY}" stroke-width="4"/>`+
     `<rect x="${X+120*k}" y="${y+60*k-(o.lidUp||0)}" width="${40*k}" height="${12*k}" rx="5" fill="${SEAL}" stroke="${NAVY}" stroke-width="4"/>`;
  return s;
}
function sVC(T,f,A){
  const X=2600;let s=bg5(X,'#eaf1ff')+counter5(X,900);
  s+=cutJar(X,330,0.95);
  s+=airCrowd(X,f,c5(T.dots||0,0,1),440);
  const v=T.vac||0, p=T.press||0;
  if(v>0.01)s+=tx5(X,580,'LESS AIR',62,BLUE,`opacity="${v}"`);
  // sky pushing down: cloud and arrows
  if(p>0.01){
    s+=`<g opacity="${p}"><path d="M${X-210} 40 q-10 -70 70 -70 q30 -60 110 -30 q60 -40 110 20 q80 0 70 80 Z" fill="#fff" stroke="${NAVY}" stroke-width="8" stroke-linejoin="round"/></g>`;
    for(const dx of [-110,0,110])s+=arrowDown(X+dx,315,190*c5(p*1.4,0,1)+20,80,RED4,p);
    s+=tx5(X-320,200,'AIR',70,RED4,`opacity="${p}"`)+tx5(X-320,270,'PUSH',70,RED4,`opacity="${p}"`);
  }
  A.lid={x:X,y:360};
  return s;
}
// ---------------- friction close-up ----------------
function sFR(T,f,A){
  const X=4600;let s=bg5(X,'#fff4e0');
  const k=2.6;
  // glass rim (cross-section) with thread bumps
  s+=`<path d="M${X-430} 1100 L${X-430} 520 Q${X-430} 470 ${X-380} 470 L${X-320} 470 Q${X-270} 470 ${X-270} 520 L${X-270} 1100 Z" fill="${GLASS}" stroke="${NAVY}" stroke-width="9" stroke-linejoin="round"/>`;
  s+=`<circle cx="${X-270}" cy="640" r="26" fill="${GLASS}" stroke="${NAVY}" stroke-width="7"/>`;
  // lid profile: top plate and skirt with a lug
  s+=`<path d="M${X-520} 380 L${X+420} 380 L${X+420} 450 L${X-450} 450 L${X-450} 700 L${X-520} 700 Z" fill="${GOLD}" stroke="${NAVY}" stroke-width="9" stroke-linejoin="round"/>`;
  s+=`<path d="M${X-450} 680 L${X-400} 680 L${X-400} 700 L${X-450} 700 Z" fill="${GOLDD}" stroke="${NAVY}" stroke-width="5"/>`;
  // seal ring squashed between lid and rim
  const sq=T.jam||0;
  s+=`<rect x="${X-440}" y="${450}" width="${180}" height="${22-8*sq}" rx="8" fill="${SEAL}" stroke="${NAVY}" stroke-width="6"/>`;
  if(sq>0.01)s+=tx5(X-80,560,'SEAL',60,SEAL,`opacity="${sq}"`)+`<path d="M${X-150} 540 L${X-255} 480" stroke="${NAVY}" stroke-width="8" stroke-linecap="round" opacity="${sq}"/>`;
  // push arrows on top
  for(const dx of [-350,-150,50,250])s+=arrowDown(X+dx,370,150,70,RED4,c5(T.push||0,0,1));
  // friction: twist arrow with zigzag sparks and a block
  const fr=T.fric||0;
  if(fr>0.01){
    s+=`<g opacity="${fr}"><path d="M${X-120} 740 L${X+300} 740" stroke="${NAVY}" stroke-width="26" stroke-linecap="round"/><path d="M${X-120} 740 L${X+300} 740" stroke="${BLUE}" stroke-width="14" stroke-linecap="round"/>`+
      `<path d="M${X+290} 706 L${X+350} 740 L${X+290} 774 Z" fill="${BLUE}" stroke="${NAVY}" stroke-width="6"/>`;
    const jx=Math.sin(f*2.1)*6;
    s+=`<path d="M${X-80+jx} 680 l30 -30 l20 30 l30 -30 l20 30 l30 -30 l20 30 l30 -30" stroke="${RED4}" stroke-width="10" fill="none" stroke-linejoin="round"/></g>`;
    s+=tx5(X+90,880,'FRICTION',96,RED4,`opacity="${fr}"`);
  }
  A.lid={x:X-200,y:420};
  return s;
}
// ---------------- spoon: let the air in ----------------
function spoon(x,y,ang){ // teaspoon, bowl tip at (x,y), handle to the right
  return `<g transform="rotate(${ang} ${x} ${y})"><rect x="${x+50}" y="${y-14}" width="420" height="28" rx="14" fill="${STEEL4}" stroke="${NAVY}" stroke-width="7"/>`+
    `<ellipse cx="${x+30}" cy="${y}" rx="52" ry="34" fill="${STEEL4}" stroke="${NAVY}" stroke-width="7"/><ellipse cx="${x+22}" cy="${y-8}" rx="22" ry="10" fill="#fff" opacity=".7"/></g>`;
}
function sSP(T,f,A){
  const X=6600;let s=bg5(X,'#eaf1ff')+counter5(X,950);
  const lift=T.lift||0, inflow=T.inflow||0;
  s+=cutJar(X-60,330,0.95,{lidUp:lift*18});
  // air dots: outside crowd plus a stream into the gap at the right edge
  s+=airCrowd(X-60,f,1,470);
  if(inflow>0.01){for(let i=0;i<8;i++){const u=((f*0.05+i/8)%1);const x=X+170-u*180, y=330+Math.sin(u*6+i)*14+u*120;s+=airDot(x,y,13,c5(inflow*2,0,1)*(1-u*0.2));}}
  // push arrows fade as the air gets in
  const p=c5(1-inflow*1.6,0,1);
  for(const dx of [-170,-60,50])s+=arrowDown(X+dx,310,170,72,RED4,p);
  // spoon slides in from the right, tip under the lid skirt, then levers up
  const sl=T.slide||0;
  const sx=X+140+(1-sl)*420, sy=395;
  s+=spoon(sx,sy,-lift*14);
  if((T.hiss||0)>0.01)s+=tx5(X+260,220,'HSSS!',110,BLUE,`opacity="${T.hiss}" transform="rotate(-6 ${X+260} 200)"`);
  if((T.free||0)>0.01)s+=tx5(X-60,905,'SEAL BROKEN',72,PICKD,`opacity="${T.free}"`);
  A.lid={x:X,y:360};A.spoon={x:sx,y:sy};
  return s;
}
// ---------------- hot water: metal grows more than glass ----------------
function sHW(T,f,A){
  const X=8600;let s=bg5(X,'#fff4e0')+counter5(X,900);
  const g=T.grow||0, tw=T.twist||0;
  s+=jar(X,420,0.95,{lidGrow:g*16,lidUp:tw*150});
  if(tw>0.01)s+=twistArrow(X,420-tw*150+20,230,c5(tw*3,0,1),PICKD,false);
  s+=faucet5(X,150,T.water||0,f);
  // steam wisps
  const st=T.water||0;
  if(st>0.2)for(let i=0;i<3;i++){const u=((f*0.03+i/3)%1);s+=`<path d="M${X-120+i*120} ${390-u*120} q-18 -24 0 -48 q18 -24 0 -48" stroke="#fff" stroke-width="12" fill="none" stroke-linecap="round" opacity="${(1-u)*0.9*st}"/>`;}
  if(g>0.01){
    s+=`<g opacity="${g}"><path d="M${X-205} 455 l-70 0" stroke="${NAVY}" stroke-width="20" stroke-linecap="round"/><path d="M${X-205} 455 l-70 0" stroke="${GOLD}" stroke-width="10" stroke-linecap="round"/><path d="M${X-290} 430 l-34 25 l34 25 Z" fill="${GOLD}" stroke="${NAVY}" stroke-width="6"/>`+
      `<path d="M${X+205} 455 l70 0" stroke="${NAVY}" stroke-width="20" stroke-linecap="round"/><path d="M${X+205} 455 l70 0" stroke="${GOLD}" stroke-width="10" stroke-linecap="round"/><path d="M${X+290} 430 l34 25 l-34 25 Z" fill="${GOLD}" stroke="${NAVY}" stroke-width="6"/></g>`;
    {const mo=g*(1-c5(T.pop||0,0,1));s+=tx5(X-290,300,'METAL',62,GOLDD,`opacity="${mo}"`)+tx5(X-290,365,'GROWS',62,GOLDD,`opacity="${mo}"`);}
    {const go=c5(T.glass||0,0,1)*(1-c5(T.pop||0,0,1));s+=tx5(X+320,660,'GLASS',56,'#5d6685',`opacity="${go}"`)+tx5(X+320,720,'BARELY',46,'#5d6685',`opacity="${go}"`);}
  }
  if((T.pop||0)>0.01)s+=tx5(X+320,600,'IT',74,PICKD,`opacity="${T.pop}"`)+tx5(X+320,680,'OPENS!',74,PICKD,`opacity="${T.pop}"`);
  A.lid={x:X,y:420};
  return s;
}
window.PROPS={labelY:150,
  draw(T,f){const A={};const sc=T.sc;let s='';
    if(sc==='HK')s=sHK(T,f,A);else if(sc==='VC')s=sVC(T,f,A);else if(sc==='FR')s=sFR(T,f,A);else if(sc==='SP')s=sSP(T,f,A);else s=sHW(T,f,A);
    return {svg:s,anchors:A};},
  grip(T){return {x:600,y:400};}
};
