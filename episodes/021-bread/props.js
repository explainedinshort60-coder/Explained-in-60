// 021 bread props (viewer request). Scenes along x, each centered near world y 400 (camera w ~920):
//  BR x 600   hook: a fluffy loaf with a bicycle pump jammed in it (Blue's myth), pump pumping
//  YE x 2600  yeast cells eat sugar, burp CO2 bubbles and little alcohol drops
//  GL x 4600  two flour proteins link into a stretchy gluten net; burps get trapped and inflate like balloons
//  DO x 6600  dough rising in a bowl
//  OV x 8600  oven: oven spring, thermometer to 140 F, yeast die, bubbles set, alcohol wisps out of the vent
//  TO x 10600 toast slice: every hole is a frozen burp
// Contract: window.PROPS = {draw(T,f)->{svg, anchors}, grip(T)->{x,y}, labelY}
const CR='#e0a35a',CRD='#a8662a',CRUMB='#fbe7b8',DOUGH='#f7e2b5',YEAST='#f5d36b',SUG='#ffffff',CO2='#bfe3ff',ALC='#c9a7ff',
      GLA='#f08a24',GLB='#3aa3e0',RED2='#e8433a',OVEN='#59627e',HOT='#ff8a3d';
const F3='font-family="DejaVu Sans, sans-serif"';
function cl3(v,a,b){return Math.max(a,Math.min(b,v));}
function lp(a,b,u){return a+(b-a)*u;}
function tx(x,y,s,size,fill,extra){return `<text x="${x}" y="${y}" font-size="${size}" font-weight="900" fill="${fill||NAVY}" text-anchor="middle" stroke="#fdfcf1" stroke-width="${size/5}" paint-order="stroke" ${F3} ${extra||''}>${s}</text>`;}
function face(x,y,s,mood){ // tiny cute face; mood: happy | dead | burp
  if(mood==='dead')return `<path d="M${x-14*s} ${y-6*s} l8 8 m0 -8 l-8 8 M${x+6*s} ${y-6*s} l8 8 m0 -8 l-8 8" stroke="${NAVY}" stroke-width="${3.5*s}" stroke-linecap="round"/>`;
  const m=mood==='burp'?`<ellipse cx="${x}" cy="${y+10*s}" rx="${6*s}" ry="${7*s}" fill="${NAVY}"/>`:`<path d="M${x-7*s} ${y+7*s} q${7*s} ${7*s} ${14*s} 0" stroke="${NAVY}" stroke-width="${3*s}" fill="none" stroke-linecap="round"/>`;
  return `<circle cx="${x-10*s}" cy="${y-4*s}" r="${4*s}" fill="${NAVY}"/><circle cx="${x+10*s}" cy="${y-4*s}" r="${4*s}" fill="${NAVY}"/><ellipse cx="${x-17*s}" cy="${y+5*s}" rx="${5*s}" ry="${3*s}" fill="#f6a5a5" opacity=".8"/><ellipse cx="${x+17*s}" cy="${y+5*s}" rx="${5*s}" ry="${3*s}" fill="#f6a5a5" opacity=".8"/>`+m;
}
function yeastCell(x,y,s,mood,bud){
  return `<g><ellipse cx="${x}" cy="${y}" rx="${46*s}" ry="${40*s}" fill="${YEAST}" stroke="${NAVY}" stroke-width="${6*s}"/>`+
    (bud?`<circle cx="${x+40*s}" cy="${y-30*s}" r="${14*s}" fill="${YEAST}" stroke="${NAVY}" stroke-width="${5*s}"/>`:'')+face(x,y+2*s,s,mood)+`</g>`;
}
function bubble(x,y,r,o,lab){return `<g opacity="${o}"><circle cx="${x}" cy="${y}" r="${r}" fill="${CO2}" stroke="${BLUE}" stroke-width="5"/><circle cx="${x-r*0.35}" cy="${y-r*0.35}" r="${r*0.22}" fill="#fff"/>`+(lab&&r>26?`<text x="${x}" y="${y+r*0.18}" font-size="${r*0.5}" font-weight="900" fill="${BLUE}" text-anchor="middle" ${F3}>CO₂</text>`:'')+`</g>`;}
function loaf(cx,cy,k,puff,o){ // side view sandwich loaf
  const w=300*k,h=(170+40*puff)*k;
  return `<g opacity="${o==null?1:o}"><ellipse cx="${cx}" cy="${cy+12}" rx="${w*1.02}" ry="${26*k}" fill="${NAVY}" opacity=".14"/>`+
    `<path d="M${cx-w} ${cy} L${cx-w} ${cy-h*0.55} Q${cx-w} ${cy-h*1.1} ${cx-w*0.45} ${cy-h*1.05} Q${cx} ${cy-h*1.3} ${cx+w*0.45} ${cy-h*1.05} Q${cx+w} ${cy-h*1.1} ${cx+w} ${cy-h*0.55} L${cx+w} ${cy} Z" fill="${CR}" stroke="${NAVY}" stroke-width="8" stroke-linejoin="round"/>`+
    `<path d="M${cx-w*0.55} ${cy-h*0.95} Q${cx} ${cy-h*1.17} ${cx+w*0.5} ${cy-h*0.95}" stroke="#ffd59a" stroke-width="${12*k}" fill="none" stroke-linecap="round" opacity=".8"/></g>`;
}
// ---------------- hook: the pump myth ----------------
function sBR(T,f,A){
  let s=`<rect x="-200" y="-1400" width="1600" height="2800" fill="#fff4e0"/><rect x="-200" y="620" width="1600" height="900" fill="#e8d9bd"/><line x1="-200" y1="620" x2="1400" y2="620" stroke="${NAVY}" stroke-width="6"/>`;
  const pu=T.pump||0, st=Math.max(0,Math.sin(f*0.35))*pu;
  s+=`<rect x="160" y="595" width="880" height="34" rx="14" fill="#c98b4a" stroke="${NAVY}" stroke-width="6"/>`;
  s+=loaf(600,600,1,0.25+0.25*st);
  // hose from loaf to pump
  if(pu>0.01){s+=`<path d="M760 430 C860 400 880 520 930 520" stroke="${NAVY}" stroke-width="14" fill="none" stroke-linecap="round"/>`+
    `<rect x="900" y="${300}" width="70" height="230" rx="16" fill="${RED2}" stroke="${NAVY}" stroke-width="7"/>`+
    `<rect x="927" y="${220+60*st}" width="16" height="100" fill="${NAVY}"/><rect x="880" y="${205+60*st}" width="110" height="26" rx="12" fill="${NAVY}"/>`+
    `<rect x="890" y="525" width="90" height="20" rx="8" fill="${NAVY}"/>`;}
  if((T.qm||0)>0.01)s+=tx(600,190,'?',140,BLUE,`opacity="${T.qm}"`);
  A.loaf={x:600,y:440};A.pump={x:935,y:330};
  return s;
}
// ---------------- yeast eating sugar ----------------
function sYE(T,f,A){
  const X=2600;let s=`<rect x="1900" y="-1400" width="1400" height="2800" fill="#fff8e6"/>`;
  s+=`<circle cx="${X}" cy="420" r="430" fill="${DOUGH}" opacity=".6"/>`;
  const ap=T.yeast||0, eat=T.eat||0, bu=T.burp||0, al=T.alc||0;
  const pos=[[X-240,300],[X+200,250],[X-60,470],[X+230,560],[X-280,600]];
  pos.forEach(([x,y],i)=>{
    const o=cl3(ap*5-i,0,1);if(o<0.01)return;
    // sugar cube in front of each cell, shrinking as it is eaten
    const su=1-cl3(eat*1.2-i*0.05,0,1);
    if(su>0.02)s+=`<rect x="${x+50}" y="${y+10-30*su}" width="${44*su}" height="${44*su}" rx="6" fill="${SUG}" stroke="${NAVY}" stroke-width="4" opacity="${o}"/>`;
    const burping=bu>0.01&&((Math.floor(f/9)+i)%3===0);
    s+=`<g opacity="${o}" transform="translate(${x} ${y+Math.sin(f/8+i)*5}) scale(${0.9+0.1*o}) translate(${-x} ${-y})">`+yeastCell(x,y,1,burping?'burp':'happy',i%2===0)+`</g>`;
    // burps: CO2 bubbles rising from the cell
    for(let j=0;j<3;j++){const p=((f/30+j/3+i*0.17)%1), r=(16+p*30)*bu;if(r<2)continue;
      s+=bubble(x-10+Math.sin(p*6+i)*18,y-50-p*200,r,bu*(1-p*0.7),true);}
    for(let j=0;j<2;j++){const p=((f/26+j/2+i*0.29)%1);if(al<0.01)continue;
      s+=`<path d="M${x+40+p*60} ${y+30-p*90} q10 -18 0 -30 q-10 12 0 30 Z" fill="${ALC}" stroke="#7e57c2" stroke-width="3" opacity="${al*(1-p)}"/>`;}
  });
  if(al>0.4)s+=tx(X+200,760,'+ a little alcohol',44,'#7e57c2',`opacity="${cl3((al-0.4)*3,0,1)}"`);
  A.yeast={x:X-60,y:470};A.sugar={x:X+12,y:458};A.co2={x:X-240,y:150};A.alc={x:X+290,y:520};
  return s;
}
// ---------------- gluten net ----------------
function sGL(T,f,A){
  const X=4600;let s=`<rect x="3900" y="-1400" width="1400" height="2800" fill="#fff8e6"/><circle cx="${X}" cy="420" r="430" fill="${DOUGH}"/><circle cx="${X}" cy="420" r="430" fill="none" stroke="${CRD}" stroke-width="8"/>`;
  const lk=T.link||0, tr=T.trap||0, R=400;
  s+=`<clipPath id="glc"><circle cx="${X}" cy="420" r="${R+20}"/></clipPath><g clip-path="url(#glc)">`;
  // loose strands -> grid net
  for(let i=0;i<7;i++){
    let d='', e='';
    for(let j=0;j<=10;j++){
      const x=X-420+j*84, yNet=420-300+i*100, yLoose=yNet+Math.sin(j*1.3+i*2.1)*60;
      const y=lp(yLoose,yNet,lk)+(j%2?14:-14)*lk;
      d+=(j?'L':'M')+x+' '+y+' ';
      const x2=X-300+i*100, yy=-20+j*88, xLoose=x2+Math.cos(j*1.1+i*1.7)*60;
      e+=(j?'L':'M')+(lp(xLoose,x2,lk)+(j%2?14:-14)*lk)+' '+yy+' ';
    }
    s+=`<path d="${d}" fill="none" stroke="${GLA}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>`;
    s+=`<path d="${e}" fill="none" stroke="${GLB}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/>`;
  }
  // links appear where strands cross
  if(lk>0.6)for(let i=0;i<7;i++)for(let j=0;j<7;j++){s+=`<circle cx="${X-300+j*100}" cy="${120+i*100}" r="8" fill="${NAVY}" opacity="${(lk-0.6)*2.5}"/>`;}
  // trapped bubbles inflating inside the cells of the net
  const cells=[[0,1],[2,2],[4,1],[1,4],[3,3],[5,4],[2,5],[4,5],[0,3],[5,2]];
  cells.forEach(([c,r],k)=>{const g=cl3(tr*1.4-k*0.04,0,1);if(g<0.01)return;
    const x=X-250+c*100, y=170+r*100, rad=10+38*g;
    s+=bubble(x,y,rad,1,true);});
  s+=`</g>`;
  if(lk<0.3)s+=tx(X-200,40,'PROTEIN 1',40,GLA)+tx(X+200,40,'PROTEIN 2',40,GLB);
  if(lk>0.7&&tr<0.2)s+=tx(X,880,'GLUTEN NET',56,NAVY);
  if(tr>0.3)s+=tx(X,880,'TRAPPED BURPS',56,BLUE,`opacity="${cl3((tr-0.3)*3,0,1)}"`);
  A.net={x:X,y:420};A.bub={x:X-50,y:370};
  return s;
}
// ---------------- dough rising ----------------
function sDO(T,f,A){
  const X=6600;let s=`<rect x="5900" y="-1400" width="1400" height="2800" fill="#fff4e0"/><rect x="5900" y="620" width="1400" height="900" fill="#e8d9bd"/><line x1="5900" y1="620" x2="7300" y2="620" stroke="${NAVY}" stroke-width="6"/>`;
  const r=T.rise||0, h=60+230*r;
  s+=`<path d="M${X-260} ${470-h*0.4} Q${X-250} ${470-h} ${X} ${470-h*1.15} Q${X+250} ${470-h} ${X+260} ${470-h*0.4} Z" fill="${DOUGH}" stroke="${NAVY}" stroke-width="8"/>`;
  for(let i=0;i<6;i++){const a=i*1.7;s+=`<circle cx="${X+Math.cos(a)*150}" cy="${470-h*0.55+Math.sin(a)*h*0.25}" r="${6+10*r}" fill="#fff" opacity=".7"/>`;}
  s+=`<path d="M${X-300} 470 L${X-250} 620 L${X+250} 620 L${X+300} 470 Z" fill="${BLUE}" stroke="${NAVY}" stroke-width="9" stroke-linejoin="round"/><rect x="${X-320}" y="452" width="640" height="34" rx="16" fill="${BLUE}" stroke="${NAVY}" stroke-width="9"/>`;
  s+=tx(X,150,r<0.5?'1 HOUR LATER...':'2x BIGGER',60,NAVY,`opacity="${cl3(r*2,0,1)}"`);
  A.dough={x:X,y:470-h};
  return s;
}
// ---------------- oven ----------------
function sOV(T,f,A){
  const X=8600;let s=`<rect x="7900" y="-1400" width="1400" height="2800" fill="#fff4e0"/>`;
  const sp=T.spring||0, tp=T.temp||80, die=T.die||0, set=T.set||0, wf=T.wisp||0;
  s+=`<rect x="${X-420}" y="40" width="840" height="740" rx="40" fill="${OVEN}" stroke="${NAVY}" stroke-width="10"/><rect x="${X-370}" y="110" width="740" height="560" rx="26" fill="#2c2f45"/>`;
  s+=`<rect x="${X-370}" y="110" width="740" height="560" rx="26" fill="${HOT}" opacity=".25"/>`;
  for(let i=0;i<5;i++)s+=`<line x1="${X-330+i*165}" y1="640" x2="${X-330+i*165}" y2="${640-6*Math.sin(f/4+i)}" stroke="${HOT}" stroke-width="10" stroke-linecap="round"/>`;
  // loaf pan + loaf
  s+=`<path d="M${X-240} 470 L${X-210} 600 L${X+210} 600 L${X+240} 470 Z" fill="#9aa3bd" stroke="${NAVY}" stroke-width="8" stroke-linejoin="round"/>`;
  const bh=90+90*sp, col=set>0.5?CR:DOUGH;
  s+=`<path d="M${X-235} 475 Q${X-230} ${475-bh} ${X} ${475-bh*1.25} Q${X+230} ${475-bh} ${X+235} ${475} Z" fill="${col}" stroke="${NAVY}" stroke-width="8"/>`;
  // cutaway window of crumb with bubbles and yeast
  const wx=X, wy=455-bh*0.5, wr=80+20*sp;
  s+=`<circle cx="${wx}" cy="${wy}" r="${wr}" fill="${CRUMB}" stroke="${NAVY}" stroke-width="6"/>`;
  for(let i=0;i<5;i++){const a=i*1.3, r=(14+12*sp)*(set>0.5?1:1);s+=bubble(wx+Math.cos(a)*wr*0.55,wy+Math.sin(a)*wr*0.5,r,1,false);}
  s+=`<g transform="translate(${wx} ${wy}) scale(.55) translate(${-wx} ${-wy})">`+yeastCell(wx,wy,1,die>0.5?'dead':'happy',false)+`</g>`;
  if(set>0.01)s+=tx(wx,wy-wr-20,'SET!',50,NAVY,`opacity="${set}"`);
  // wisps out of the vent
  for(let i=0;i<4;i++){const p=((f/36+i/4)%1);if(wf<0.01)break;
    s+=`<path d="M${X+300+i*20} ${150-p*160} q20 -30 0 -60 q-20 -30 0 -60" stroke="${ALC}" stroke-width="10" fill="none" stroke-linecap="round" opacity="${wf*(1-p)}"/>`;}
  if(wf>0.3)s+=tx(X,860,'ALCOHOL BAKES OFF',56,'#7e57c2',`opacity="${wf}"`);
  // thermometer
  const tO=T.therm||0;
  if(tO>0.01){const tx0=X+340,ty=230,hot=tp>=140;s+=`<g opacity="${tO}"><rect x="${tx0-80}" y="${ty-60}" width="160" height="80" rx="20" fill="${NAVY}"/><rect x="${tx0-68}" y="${ty-50}" width="136" height="60" rx="12" fill="#eaffea"/><text x="${tx0}" y="${ty-6}" font-size="44" font-weight="900" fill="${hot?RED2:BLUE}" text-anchor="middle" ${F3}>${Math.round(tp)}°</text></g>`;}
  if(sp>0.2&&die<0.1)s+=tx(X,860,'OVEN SPRING',64,HOT,`opacity="${cl3(sp*2,0,1)}"`);
  A.loaf={x:X,y:475-bh};A.window={x:wx,y:wy};A.therm={x:X+340,y:200};A.vent={x:X+300,y:30};
  return s;
}
// ---------------- toast ----------------
function sTO(T,f,A){
  const X=10600;let s=`<rect x="9900" y="-1400" width="1400" height="2800" fill="#fff4e0"/>`;
  const lb=T.lab||0;
  s+=`<path d="M${X-260} 760 L${X-260} 300 Q${X-300} 120 ${X-140} 90 Q${X} 30 ${X+140} 90 Q${X+300} 120 ${X+260} 300 L${X+260} 760 Z" fill="${CR}" stroke="${NAVY}" stroke-width="10" stroke-linejoin="round"/>`;
  s+=`<path d="M${X-225} 730 L${X-225} 310 Q${X-260} 150 ${X-130} 125 Q${X} 70 ${X+130} 125 Q${X+260} 150 ${X+225} 310 L${X+225} 730 Z" fill="${CRUMB}"/>`;
  const holes=[[-120,250,34],[60,210,26],[150,350,38],[-60,400,30],[-150,560,40],[60,520,46],[160,640,28],[-40,680,24],[120,450,20]];
  holes.forEach(([dx,y,r],i)=>{s+=`<ellipse cx="${X+dx}" cy="${y}" rx="${r}" ry="${r*0.8}" fill="#e9c98f" stroke="${CRD}" stroke-width="4"/>`;
    if(lb>0.01&&i<4){const o=cl3(lb*4-i,0,1);s+=`<g opacity="${o}">${face(X+dx,y+2,0.8,'burp')}</g>`;}});
  if(lb>0.5)s+=tx(X,900,'FROZEN BURPS',64,BLUE,`opacity="${cl3((lb-0.5)*3,0,1)}"`);
  A.hole={x:X+60,y:520};A.toast={x:X,y:420};
  return s;
}
window.PROPS={
  labelY:150,
  draw(T,f){const A={};let s='';
    const fn={BR:sBR,YE:sYE,GL:sGL,DO:sDO,OV:sOV,TO:sTO};
    s+=fn[T.sc||'BR'](T,f,A);
    return {svg:s,anchors:A};
  },
  grip(T){return {x:600,y:400};}
};
