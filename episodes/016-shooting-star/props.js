// Episode 016 props: a night-sky window (navy panel, stars, hill and pine silhouettes) with a shooting star streaking
// across it; a zoom view of the speck of space dust ramming the air (air dots stream past, pile up into a squeezed cap
// in front, the cap heats blue -> orange -> white, the grain shrinks and a glowing vapor trail streams behind); an
// altitude line (60 MILES UP); a comet shedding chunky dust (Taurids); a slow fireball; a calendar card (NOV 12);
// a magnifier for the wish gag that shows the meteor is a sand grain.
// Contract: window.PROPS = {draw(T,f)->{svg, anchors}, grip(T)->{x,y}, labelY}
// T: sky (0..1 sky view), zm (0..1 zoom view), p (meteor 0..1 along its path), mt (meteor visible 0..1), fire (0..1),
//    pend (path point where the meteor burns out, 1 = runs off the panel), alt (0..1), comet (0..1), cal (0..1),
//    flow (air speed), pile (0..1), heat (0..1), vap (0..1 grain gone), trail (0..1), sp (speed arrow 0..1),
//    mag (0..1 magnifier), wish (0..1 sparkles), gx, gy
const SKY='#0d1d55',SKY2='#16297a',HILL='#071747',FIRE='#ff9a2e',HOT='#ffe9a8',WHITE='#ffffff',ROCK='#8c8a99',ROCK2='#5f5d70';
const PX0=40,PX1=640,PY0=-120,PY1=660,ZX=330,ZY=250;
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function mix(a,b,t){const p=x=>[1,3,5].map(i=>parseInt(x.substr(i,2),16));const A=p(a),B=p(b);t=clamp(t,0,1);return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('');}
function heatCol(h){return h<0.5?mix(BLUE,FIRE,h*2):mix(FIRE,HOT,(h-0.5)*2);}
let seed=11;const rnd=()=>{seed=(seed*9301+49297)%233280;return seed/233280;};
const STARS=[];for(let i=0;i<46;i++)STARS.push({x:PX0+20+rnd()*(PX1-PX0-40),y:PY0+20+rnd()*520,r:1.5+rnd()*3,t:rnd()*6.28});
const AIR=[];for(let i=0;i<70;i++)AIR.push({x:rnd(),y:PY0+40+rnd()*(PY1-PY0-120),k:0.8+rnd()*0.5,p:rnd()*6.28});
const ROCKPTS=[];for(let i=0;i<11;i++){const a=i/11*Math.PI*2;ROCKPTS.push([Math.cos(a),Math.sin(a),0.78+0.3*((i*37)%7)/7]);}
function rock(x,y,r,col,stroke){
  if(r<1)return '';
  const d=ROCKPTS.map((q,i)=>`${i?'L':'M'}${(x+q[0]*r*q[2]).toFixed(1)} ${(y+q[1]*r*q[2]).toFixed(1)}`).join(' ')+'Z';
  return `<path d="${d}" fill="${col||ROCK}" stroke="${NAVY}" stroke-width="${stroke||6}" stroke-linejoin="round"/>`+
    `<circle cx="${(x-r*0.25).toFixed(1)}" cy="${(y-r*0.2).toFixed(1)}" r="${(r*0.16).toFixed(1)}" fill="${ROCK2}"/><circle cx="${(x+r*0.3).toFixed(1)}" cy="${(y+r*0.25).toFixed(1)}" r="${(r*0.11).toFixed(1)}" fill="${ROCK2}"/>`;
}
function arrow(x,y,ang,len,w,col,op){
  if(op<0.02||len<4)return '';
  return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${ang.toFixed(1)})" opacity="${op.toFixed(2)}"><path d="M0 0 L${len-20} 0" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/><path d="M${len} 0 L${len-28} -20 L${len-28} 20 Z" fill="${col}"/></g>`;
}
// meteor path in the sky view
const MA={x:600,y:-60},MB={x:110,y:420};
function mpos(p){return {x:MA.x+(MB.x-MA.x)*p,y:MA.y+(MB.y-MA.y)*p};}
const MANG=Math.atan2(MB.y-MA.y,MB.x-MA.x);
function meteor(T,f){
  const op=(T.mt===undefined?1:T.mt);if(op<0.02)return '';
  const p=T.p,pe=(T.pend===undefined?1:T.pend);
  let fade=clamp(p/0.08,0,1);if(p>pe-0.06)fade*=clamp((pe-p)/0.06,0,1);
  const fire=T.fire||0;
  if(fade<0.01&&!(p>pe))return '';
  const h=mpos(Math.min(p,pe)),L=230+180*fire,ux=Math.cos(MANG),uy=Math.sin(MANG);
  let s=`<g opacity="${op.toFixed(2)}">`;
  if(p<=pe){
    const tail={x:h.x-ux*L,y:h.y-uy*L},nx=-uy,ny=ux,w=10+16*fire;
    s+=`<path d="M${tail.x.toFixed(1)} ${tail.y.toFixed(1)} L${(h.x+nx*w).toFixed(1)} ${(h.y+ny*w).toFixed(1)} L${(h.x-nx*w).toFixed(1)} ${(h.y-ny*w).toFixed(1)} Z" fill="${FIRE}" opacity="${(0.75*fade).toFixed(2)}"/>`;
    s+=`<path d="M${(h.x-ux*L*0.6).toFixed(1)} ${(h.y-uy*L*0.6).toFixed(1)} L${(h.x+nx*w*0.45).toFixed(1)} ${(h.y+ny*w*0.45).toFixed(1)} L${(h.x-nx*w*0.45).toFixed(1)} ${(h.y-ny*w*0.45).toFixed(1)} Z" fill="${HOT}" opacity="${fade.toFixed(2)}"/>`;
    const g=26+40*fire+3*Math.sin(f*1.3);
    s+=`<circle cx="${h.x.toFixed(1)}" cy="${h.y.toFixed(1)}" r="${(g*1.9).toFixed(1)}" fill="${FIRE}" opacity="${(0.22*fade).toFixed(2)}"/>`;
    s+=`<circle cx="${h.x.toFixed(1)}" cy="${h.y.toFixed(1)}" r="${g.toFixed(1)}" fill="${HOT}" opacity="${(0.85*fade).toFixed(2)}"/>`;
    s+=`<circle cx="${h.x.toFixed(1)}" cy="${h.y.toFixed(1)}" r="${(g*0.5).toFixed(1)}" fill="${WHITE}" opacity="${fade.toFixed(2)}"/>`;
    if(fire>0.3){for(let k=0;k<4;k++){const a=k*Math.PI/2+f*0.05;s+=`<path d="M${(h.x+Math.cos(a)*g*1.1).toFixed(1)} ${(h.y+Math.sin(a)*g*1.1).toFixed(1)} L${(h.x+Math.cos(a)*g*1.9).toFixed(1)} ${(h.y+Math.sin(a)*g*1.9).toFixed(1)}" stroke="${HOT}" stroke-width="8" stroke-linecap="round" opacity="${(fire*fade).toFixed(2)}"/>`;}}
  } else {
    const u=Math.min(1,(p-pe)/0.08);s+=`<circle cx="${h.x.toFixed(1)}" cy="${h.y.toFixed(1)}" r="${(30+20*u).toFixed(1)}" fill="${FIRE}" opacity="${(0.25*(1-0.5*u)).toFixed(2)}"/>`;for(let k=0;k<8;k++){const a=k/8*Math.PI*2;s+=`<circle cx="${(h.x+Math.cos(a)*(14+46*u)).toFixed(1)}" cy="${(h.y+Math.sin(a)*(14+46*u)).toFixed(1)}" r="${(7*(1-0.6*u)+1).toFixed(1)}" fill="${HOT}"/>`;}
  }
  return s+`</g>`;
}
function skyView(T,f){
  const op=T.sky||0;if(op<0.02)return '';
  let s=`<g opacity="${op.toFixed(2)}">`;
  for(const st of STARS)s+=`<circle cx="${st.x.toFixed(1)}" cy="${st.y.toFixed(1)}" r="${(st.r*(0.8+0.25*Math.sin(f/7+st.t))).toFixed(1)}" fill="${IVORY}" opacity=".85"/>`;
  // comet shedding chunky dust
  const cm=T.comet||0;
  if(cm>0.02){
    s+=`<g opacity="${cm.toFixed(2)}"><path d="M120 60 Q340 -40 600 90" fill="none" stroke="${IVORY}" stroke-width="4" stroke-dasharray="6 16" opacity=".6"/>`;
    for(let k=0;k<9;k++){const t=((k/9+f*0.004)%1),x=120+480*t,y=60-110*4*t*(1-t)+50*t+12*Math.sin(k*2.1);s+=rock(x,y,14+(k%3)*6,ROCK,4);}
    const cx=400+20*Math.sin(f/60),cy=0;
    s+=`<path d="M${cx} ${cy-40} L${cx+260} ${cy-130} L${cx+300} ${cy-50} L${cx+270} ${cy+20} Z" fill="${IVORY}" opacity=".45"/>`;
    s+=`<circle cx="${cx}" cy="${cy}" r="60" fill="${IVORY}" opacity=".35"/>`+rock(cx,cy,40,ROCK,6)+`</g>`;
  }
  // altitude line
  const al=T.alt||0;
  if(al>0.02){const y=230;s+=`<g opacity="${al.toFixed(2)}"><path d="M${PX0+10} ${y} L${PX1-10} ${y}" stroke="${IVORY}" stroke-width="5" stroke-dasharray="18 12"/>`+
    `<rect x="${PX1-440}" y="${y-76}" width="300" height="56" rx="28" fill="${BLUE}" stroke="${IVORY}" stroke-width="4"/><text x="${PX1-290}" y="${y-37}" font-size="32" font-weight="900" fill="${IVORY}" text-anchor="middle" font-family="DejaVu Sans, sans-serif">60 MILES UP</text>`+
    `<path d="M${PX0+50} ${y+30} L${PX0+50} ${PY1-140}" stroke="${IVORY}" stroke-width="5" opacity=".7"/><path d="M${PX0+32} ${y+50} L${PX0+50} ${y+22} L${PX0+68} ${y+50} Z" fill="${IVORY}" opacity=".7"/></g>`;}
  s+=meteor(T,f);
  // hill and pines
  s+=`<path d="M${PX0} ${PY1-40} Q180 ${PY1-110} 330 ${PY1-70} Q480 ${PY1-30} ${PX1} ${PY1-90} L${PX1} ${PY1} L${PX0} ${PY1} Z" fill="${HILL}"/>`;
  for(const [x,h] of [[110,120],[160,90],[540,110]])s+=`<path d="M${x} ${PY1-60-h} L${x+34} ${PY1-50} L${x-34} ${PY1-50} Z" fill="${HILL}"/><path d="M${x} ${PY1-90-h} L${x+26} ${PY1-30-h} L${x-26} ${PY1-30-h} Z" fill="${HILL}"/>`;
  // calendar card
  const cl=T.cal||0;
  if(cl>0.02){const sc=0.6+0.4*clamp(cl*1.3,0,1);s+=`<g opacity="${clamp(cl*1.5,0,1).toFixed(2)}" transform="translate(340 330) scale(${sc.toFixed(3)}) rotate(-4)">`+
    `<rect x="-130" y="-120" width="260" height="240" rx="24" fill="${IVORY}" stroke="${NAVY}" stroke-width="8"/><rect x="-130" y="-120" width="260" height="74" rx="24" fill="${BLUE}" stroke="${NAVY}" stroke-width="8"/>`+
    `<text x="0" y="-66" font-size="40" font-weight="900" fill="${IVORY}" text-anchor="middle" font-family="DejaVu Sans, sans-serif">NOV</text><text x="0" y="78" font-size="120" font-weight="900" fill="${NAVY}" text-anchor="middle" font-family="DejaVu Sans, sans-serif">12</text>`+
    `<circle cx="-70" cy="-126" r="10" fill="${NAVY}"/><circle cx="70" cy="-126" r="10" fill="${NAVY}"/></g>`;}
  return s+`</g>`;
}
function zoomView(T,f){
  const op=T.zm||0;if(op<0.02)return '';
  const vap=T.vap||0,r=58*(1-0.85*vap),gx=ZX+40,gy=ZY,pile=T.pile||0,heat=T.heat||0,flow=(T.flow===undefined?1:T.flow);
  let s=`<g opacity="${op.toFixed(2)}"><rect x="${PX0}" y="${PY0}" width="${PX1-PX0}" height="${PY1-PY0}" fill="${SKY2}"/>`;
  for(const st of STARS.slice(0,20))s+=`<circle cx="${st.x.toFixed(1)}" cy="${st.y.toFixed(1)}" r="${(st.r*0.7).toFixed(1)}" fill="${IVORY}" opacity=".4"/>`;
  // vapor trail behind (right of) the grain
  const tr=T.trail||0;
  if(tr>0.02){
    s+=`<path d="M${gx} ${gy-r-34*heat} Q${gx+160} ${gy-r*0.6} ${PX1+20} ${gy-14} L${PX1+20} ${gy+14} Q${gx+160} ${gy+r*0.6} ${gx} ${gy+r+34*heat} Z" fill="${FIRE}" opacity="${(0.55*tr).toFixed(2)}"/>`;
    s+=`<path d="M${gx} ${gy-r*0.6} Q${gx+140} ${gy-r*0.3} ${PX1+20} ${gy-5} L${PX1+20} ${gy+5} Q${gx+140} ${gy+r*0.3} ${gx} ${gy+r*0.6} Z" fill="${HOT}" opacity="${(0.8*tr).toFixed(2)}"/>`;
    for(let k=0;k<10;k++){const u=((f*0.03+k/10)%1),x=gx+30+u*(PX1-gx),y=gy+Math.sin(k*1.7+f*0.1)*(18+40*u);s+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(7*(1-u)+2).toFixed(1)}" fill="${HOT}" opacity="${(tr*(1-u)).toFixed(2)}"/>`;}
  }
  // free-stream air dots, flowing left to right (the grain flies left)
  const W=PX1-PX0;
  for(const d of AIR){
    let x=PX0+((d.x*W+f*7*flow*d.k)%W),y=d.y+6*Math.sin(f*0.15+d.p);
    const dx=x-gx,dy=y-gy,dist=Math.hypot(dx,dy);
    if(dist<r+20+40*pile)continue;               // inside the cap or the grain
    if(dx>0&&Math.abs(dy)<r+30*heat&&tr>0.3)continue; // inside the hot trail
    s+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="8" fill="${BLUE}" stroke="${IVORY}" stroke-width="2.5" opacity=".9"/>`;
    if(flow>0.3)s+=`<path d="M${(x-12).toFixed(1)} ${y.toFixed(1)} l-18 0" stroke="${IVORY}" stroke-width="3" opacity=".45"/>`;
  }
  // squeezed cap in front (left) of the grain
  if(pile>0.02){
    const col=heatCol(heat);
    if(heat>0.05)s+=`<ellipse cx="${(gx-r*0.7).toFixed(1)}" cy="${gy}" rx="${(r+70).toFixed(1)}" ry="${(r+80).toFixed(1)}" fill="${col}" opacity="${(0.35*heat).toFixed(2)}"/>`;
    if(heat>0.55)s+=`<path d="M${(gx-r*0.2).toFixed(1)} ${(gy-r-40).toFixed(1)} Q${(gx-r-70).toFixed(1)} ${gy} ${(gx-r*0.2).toFixed(1)} ${(gy+r+40).toFixed(1)} Q${(gx-r-20).toFixed(1)} ${gy} ${(gx-r*0.2).toFixed(1)} ${(gy-r-40).toFixed(1)} Z" fill="${WHITE}" opacity="${((heat-0.55)*2).toFixed(2)}"/>`;
    const n=Math.round(40*pile);
    for(let i=0;i<n;i++){const row=i%3,a=Math.PI*(0.62+0.76*((i*0.618)%1)),rr=r+14+row*14*pile+3*Math.sin(f*0.9+i);
      s+=`<circle cx="${(gx+Math.cos(a)*rr).toFixed(1)}" cy="${(gy+Math.sin(a)*rr*1.05).toFixed(1)}" r="7.5" fill="${col}" stroke="${NAVY}" stroke-width="2.5"/>`;}
  }
  s+=rock(gx,gy,r,mix(ROCK,FIRE,heat*0.6),6);
  // speed arrow (direction of flight)
  s+=arrow(gx-r-60,gy+r+70,180,190,14,IVORY,T.sp||0);
  return s+`</g>`;
}
function magnifier(T,f){
  const m=T.mag||0;if(m<0.02)return '';
  const h=mpos(T.p),cx=330,cy=220,r=150;
  let s=`<g opacity="${clamp(m*1.4,0,1).toFixed(2)}"><path d="M${h.x} ${h.y} L${cx+r*0.6} ${cy+r*0.6}" stroke="${IVORY}" stroke-width="5"/>`;
  s+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${IVORY}"/>`;
  s+=rock(cx,cy+6,26+6*Math.sin(f/8),ROCK,5);
  s+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${NAVY}" stroke-width="12"/><path d="M${cx+r*0.7} ${cy+r*0.7} L${cx+r*0.7+70} ${cy+r*0.7+70}" stroke="${NAVY}" stroke-width="24" stroke-linecap="round"/></g>`;
  return s;
}
function sparkles(T,f){
  const w=T.wish||0;if(w<0.02)return '';
  let s='';for(let k=0;k<4;k++){const x=640+k*40+10*Math.sin(f/5+k),y=150-((f*2+k*25)%90),sz=8+4*Math.sin(f/4+k);
    s+=`<path d="M${x} ${y-sz*2} L${x+sz*0.5} ${y-sz*0.5} L${x+sz*2} ${y} L${x+sz*0.5} ${y+sz*0.5} L${x} ${y+sz*2} L${x-sz*0.5} ${y+sz*0.5} L${x-sz*2} ${y} L${x-sz*0.5} ${y-sz*0.5} Z" fill="${BLUE}" opacity="${w.toFixed(2)}"/>`;}
  return s;
}
window.PROPS={labelY:-175,
  grip:T=>({x:T.gx||600,y:T.gy||420}),
  draw(T,f){
    let s=`<defs><clipPath id="pn"><rect x="${PX0}" y="${PY0}" width="${PX1-PX0}" height="${PY1-PY0}" rx="30"/></clipPath></defs>`;
    s+=`<rect x="${PX0}" y="${PY0}" width="${PX1-PX0}" height="${PY1-PY0}" rx="30" fill="${SKY}"/>`;
    s+=`<g clip-path="url(#pn)">`+skyView(T,f)+zoomView(T,f)+magnifier(T,f)+`</g>`;
    s+=`<rect x="${PX0}" y="${PY0}" width="${PX1-PX0}" height="${PY1-PY0}" rx="30" fill="none" stroke="${NAVY}" stroke-width="10"/>`;
    s+=sparkles(T,f);
    const h=mpos(Math.min(T.p||0,T.pend===undefined?1:T.pend)),vap=T.vap||0,r=58*(1-0.85*vap);
    const anchors={meteor:{x:h.x,y:h.y},grain:{x:ZX+40,y:ZY-r*0.3},cap:{x:ZX+40-r-34,y:ZY-r*0.5},air:{x:150,y:60},
      trail:{x:560,y:ZY-10},comet:{x:380,y:-20},dust:{x:250,y:20},alt:{x:600,y:230},sand:{x:330,y:200},hill:{x:300,y:600},burn:{x:306,y:228}};
    return {svg:s,anchors};
  }};
