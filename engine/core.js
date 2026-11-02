// Explained in 60 render core. Draws one frame: world (props + rig character) under a camera,
// plus the screen overlay (header, callouts, subtitle pill). Episode props come from window.PROPS.
const NAVY='#071747',BLUE='#2465ff',IVORY='#fffdf4',WATER='#7da0ff',TINT='#e9eefc';
function charSVG(C){
  actor.set(C.st); const tmp=document.createElement('div'); tmp.innerHTML=actor.exportSVG(); const svg=tmp.firstChild;
  const st=C.st, c=svg.querySelector('#character');
  const Lm={'left-arm':['la','le',90,85],'right-arm':['ra','re',90,85],'left-leg':['lt','lk',110,110],'right-leg':['rt','rk',110,110]};
  for(const [id,[u,l,a,b]] of Object.entries(Lm)){const g=svg.querySelector('#'+id),low=g.querySelector('#'+id+'-lower'),end=g.querySelector('#'+id+'-end');
    const t2=st[l]*Math.PI/180,E=[0,a],Hh=[-b*Math.sin(t2),a+b*Math.cos(t2)],M=[Hh[0]/2,Hh[1]/2],k=.35,Cc=[E[0]+(E[0]-M[0])*k,E[1]+(E[1]-M[1])*k];
    g.querySelector(':scope>path').setAttribute('stroke','none');low.querySelector(':scope>path').setAttribute('stroke','none');
    const p=document.createElementNS('http://www.w3.org/2000/svg','path');p.setAttribute('d',`M0 0 Q${Cc[0]} ${Cc[1]} ${Hh[0]} ${Hh[1]}`);p.setAttribute('fill','none');p.setAttribute('stroke',NAVY);p.setAttribute('stroke-width',10);p.setAttribute('stroke-linecap','round');g.prepend(p);
    const tang=Math.atan2(-(Hh[0]-Cc[0]),Hh[1]-Cc[1])*180/Math.PI;let d=tang-st[l];d=((d+540)%360)-180;let rot=d*.8;if(id.includes('leg'))rot=-(C.lean+st[u]+st[l]);
    end.setAttribute('transform',`translate(0 ${b}) rotate(${rot})`);}
  c.setAttribute('transform',`translate(${720} ${C.y}) rotate(${C.lean} 0 450)`);
  for(const side of C.front)c.append(c.querySelector('#'+(side=='l'?'left-arm':'right-arm')));
  if(C.blink)c.querySelectorAll('#eyes ellipse').forEach(e=>{e.setAttribute('ry',2.5);e.setAttribute('rx',10)});
  return c.outerHTML;
}
function wrap(t,n){const w=t.split(' ');let lines=[''];for(const x of w){if((lines.at(-1)+' '+x).trim().length>n)lines.push(x);else lines[lines.length-1]=(lines.at(-1)+' '+x).trim();}return lines;}
function esc(t){return t.replace(/&/g,'&amp;').replace(/</g,'&lt;');}
window.drawFrame=function(S){
  const W=1080,Hs=1920,cam=S.cam,vw=cam.w,vh=vw*Hs/W,x0=cam.cx-vw/2,y0=cam.cy-vh/2,k=W/vw;
  const t=PROPS.draw(S.T,S.f);
  let world=`<rect x="-3000" y="-3000" width="8000" height="8000" fill="#fdfcf1"/><line x1="-3000" y1="700" x2="5000" y2="700" stroke="${NAVY}" stroke-width="5"/>`+t.svg+(S.C?charSVG(S.C):'');
  const A=t.anchors;
  for(const h of S.hl){const a=A[h.part];world+=`<circle cx="${a.x}" cy="${a.y}" r="${h.part=='line'?0:36+Math.sin(S.f/4)*3}" fill="none" stroke="${BLUE}" stroke-width="5" opacity=".9"/>`;}
  let ov='';
  for(const h of S.hl){const a=A[h.part];const sx=(a.x-x0)*k,sy=(a.y-y0)*k;const tw=h.label.length*25;const lx=Math.max(60+tw/2,Math.min(W-60-tw/2,sx+(h.dx||-260)+tw/2)),ly=Math.max(250,Math.min(sy-60,((PROPS.labelY||330)-y0)*k-26));
    ov+=`<line x1="${sx}" y1="${sy}" x2="${lx}" y2="${ly+12}" stroke="${NAVY}" stroke-width="3"/><circle cx="${sx}" cy="${sy}" r="7" fill="${NAVY}"/>`;
    ov+=`<text x="${lx}" y="${ly}" font-size="40" font-weight="700" fill="${NAVY}" stroke="#fdfcf1" stroke-width="10" paint-order="stroke" text-anchor="middle" font-family="DejaVu Sans, sans-serif">${esc(h.label)}</text>`;}
  ov+=`<text x="540" y="96" font-size="25" letter-spacing="5.5" fill="${NAVY}" text-anchor="middle" font-family="DejaVu Sans, sans-serif">EXPLAINED IN 60</text>`;
  if(S.cap){const ls=wrap(S.cap,34);const h=ls.length==1?116:180;ov+=`<rect x="60" y="1620" width="960" height="${h}" rx="24" fill="#051545"/>`;
    ls.forEach((ln,i)=>{ov+=`<text x="540" y="${1620+h/2+16+(i-(ls.length-1)/2)*64}" font-size="44" font-weight="700" fill="#fdfcf1" text-anchor="middle" font-family="DejaVu Sans, sans-serif">${esc(ln)}</text>`;});}
  if(S.badge)ov+=`<rect x="830" y="210" width="200" height="70" rx="35" fill="${BLUE}"/><text x="930" y="258" font-size="40" font-weight="800" fill="${IVORY}" text-anchor="middle" font-family="DejaVu Sans, sans-serif">${S.badge}</text>`;
  if(S.pop)ov+=`<text x="${(S.pop.x-x0)*k+170}" y="${(S.pop.y-y0)*k+150}" font-size="${90*S.pop.s}" font-weight="900" fill="${BLUE}" stroke="${NAVY}" stroke-width="6" paint-order="stroke" font-family="DejaVu Sans, sans-serif" transform="rotate(-8 ${(S.pop.x-x0)*k} ${(S.pop.y-y0)*k})">${esc(S.pop.text||'CLICK!')}</text>`;
  document.querySelector('#stage').innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${Hs}" viewBox="${x0} ${y0} ${vw} ${vh}" style="position:absolute;left:0;top:0">${world}</svg><svg width="${W}" height="${Hs}" style="position:absolute;left:0;top:0">${ov}</svg>`;
};
window.gripPoint=T=>(window.PROPS&&PROPS.grip)?PROPS.grip(T):{x:0,y:0};
