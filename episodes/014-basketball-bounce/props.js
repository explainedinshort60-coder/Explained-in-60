// Episode 014 props: a basketball (orange, navy seams, pebble texture) that bounces and squashes on the floor, with an
// x-ray mode that shows the air inside as bouncing dots plus pressure arrows; a flat ball (pancake, wrinkles, few dots,
// heat squiggles and thud rings); a bounce-height ruler; cold (snowflakes, blue tint) and warm (glow) states; a magnifier
// on the pebbles with a fingertip.
// Contract: window.PROPS = {draw(T,f)->{svg, anchors}, grip(T)->{x,y}, labelY}
// T: bx, by (ball center), sq (squash 0..1), xr (x-ray 0..1), spd (air dot speed), arr (pressure arrows 0..1),
//    up (launch arrow 0..1), cold (0..1), warm (0..1), fv (flat ball 0..1), fx, fy, fxr (flat x-ray 0..1), heat (0..1),
//    rul (ruler 0..1), mkF, mkC (height marks 0..1), mag (magnifier 0..1), fing (finger press 0..1), gx, gy (grip)
const ORANGE='#f07b22',ORANGE2='#d9621a',COLDB='#9fc0ff',RED='#ff4d4d',WARM='#ffb020';
const R=95;
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function mix(a,b,t){const p=x=>[1,3,5].map(i=>parseInt(x.substr(i,2),16));const A=p(a),B=p(b);return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('');}
// fixed pseudo-random air dots inside a unit disk
const DOTS=[];(function(){let s=7;const r=()=>{s=(s*9301+49297)%233280;return s/233280;};
  for(let i=0;i<34;i++){let a=r()*Math.PI*2,d=Math.sqrt(r())*0.78;DOTS.push({u:Math.cos(a)*d,v:Math.sin(a)*d,p:r()*6.28,q:r()*6.28,k:0.7+r()*0.6});}})();
function arrow(x,y,ang,len,w,col,op){
  if(op<0.02||len<4)return '';
  return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${ang.toFixed(1)})" opacity="${op.toFixed(2)}"><path d="M0 0 L${len-16} 0" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/><path d="M${len} 0 L${len-22} -15 L${len-22} 15 Z" fill="${col}"/></g>`;
}
function ball(id,x,y,sq,o){
  // o: {xr, spd, arr, cold, warm, flat, ndots, f, heat}
  const rx=R*(1+0.32*sq),ry=R*(1-0.32*sq),f=o.f;
  const base=o.flat?'#c9733a':mix(ORANGE,COLDB,o.cold||0);
  let g='';
  if((o.warm||0)>0.02)g+=`<ellipse cx="${x}" cy="${y}" rx="${rx+40}" ry="${ry+40}" fill="${WARM}" opacity="${(0.35*o.warm).toFixed(2)}"/>`;
  g+=`<defs><clipPath id="c${id}"><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/></clipPath>`+
     `<pattern id="p${id}" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="7" cy="7" r="2.6" fill="${NAVY}" opacity=".16"/></pattern></defs>`;
  g+=`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${base}"/>`;
  g+=`<g clip-path="url(#c${id})"><rect x="${x-rx}" y="${y-ry}" width="${2*rx}" height="${2*ry}" fill="url(#p${id})"/>`;
  // shading
  g+=`<ellipse cx="${x+rx*0.25}" cy="${y+ry*0.3}" rx="${rx}" ry="${ry}" fill="${ORANGE2}" opacity=".25" transform="translate(${rx*0.15} ${ry*0.15})"/>`;
  g+=`<ellipse cx="${x-rx*0.38}" cy="${y-ry*0.42}" rx="${rx*0.22}" ry="${ry*0.14}" fill="${IVORY}" opacity=".35"/>`;
  // seams
  const sw=7;
  g+=`<path d="M${x-rx} ${y} L${x+rx} ${y}" stroke="${NAVY}" stroke-width="${sw}"/>`;
  g+=`<path d="M${x} ${y-ry} Q${x+rx*0.12} ${y} ${x} ${y+ry}" fill="none" stroke="${NAVY}" stroke-width="${sw}"/>`;
  g+=`<path d="M${x-rx*0.62} ${y-ry*0.82} Q${x-rx*0.18} ${y} ${x-rx*0.62} ${y+ry*0.82}" fill="none" stroke="${NAVY}" stroke-width="${sw}"/>`;
  g+=`<path d="M${x+rx*0.62} ${y-ry*0.82} Q${x+rx*0.18} ${y} ${x+rx*0.62} ${y+ry*0.82}" fill="none" stroke="${NAVY}" stroke-width="${sw}"/>`;
  if(o.flat){for(let k=0;k<3;k++)g+=`<path d="M${x-rx*0.7+k*rx*0.55} ${y-ry*0.5} q14 18 0 34 q-14 16 2 30" fill="none" stroke="${NAVY}" stroke-width="4" opacity=".55"/>`;}
  g+=`</g>`;
  // x-ray: rubber wall ring, pale inside, air dots, pressure arrows
  const xr=o.xr||0;
  if(xr>0.02){
    g+=`<g opacity="${xr.toFixed(2)}"><ellipse cx="${x}" cy="${y}" rx="${rx-13}" ry="${ry-13}" fill="#eaf0ff"/>`;
    const n=o.ndots||DOTS.length,sp=o.spd===undefined?1:o.spd;
    for(let i=0;i<n;i++){const d=DOTS[i];
      let u=d.u+0.16*Math.sin(f*0.21*sp*d.k+d.p),v=d.v+0.16*Math.cos(f*0.19*sp*d.k+d.q);
      const L=Math.hypot(u,v);if(L>0.8){u*=0.8/L;v*=0.8/L;}
      const px=x+u*(rx-20),py=y+v*(ry-20);
      g+=`<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="9" fill="${BLUE}" stroke="${NAVY}" stroke-width="3"/>`;
      if(sp>0.6)g+=`<path d="M${(px-12*Math.cos(f*0.3+d.p)).toFixed(1)} ${(py-12*Math.sin(f*0.3+d.p)).toFixed(1)} l${(-16*Math.cos(f*0.3+d.p)).toFixed(1)} ${(-16*Math.sin(f*0.3+d.p)).toFixed(1)}" stroke="${BLUE}" stroke-width="3" opacity=".5"/>`;}
    const a=o.arr||0;
    if(a>0.02){
      for(let k=0;k<8;k++){const t=k/8*Math.PI*2+0.39;const ex=x+Math.cos(t)*(rx-30),ey=y+Math.sin(t)*(ry-30);
        g+=arrow(ex-Math.cos(t)*30,ey-Math.sin(t)*30,t*180/Math.PI,28+22*a,7,NAVY,a*0.9);}
    }
    g+=`</g>`;
  }
  g+=`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="none" stroke="${NAVY}" stroke-width="8"/>`;
  return g;
}
function ruler(T){
  const op=T.rul||0;if(op<0.02)return '';
  let s=`<g opacity="${op.toFixed(2)}"><rect x="186" y="150" width="28" height="550" rx="8" fill="${IVORY}" stroke="${NAVY}" stroke-width="6"/>`;
  for(let y=170;y<700;y+=40)s+=`<path d="M186 ${y} L204 ${y}" stroke="${NAVY}" stroke-width="4"/>`;
  const mk=(y,t,a,col)=>a<0.02?'':`<g opacity="${a.toFixed(2)}"><path d="M150 ${y} L700 ${y}" stroke="${col}" stroke-width="5" stroke-dasharray="16 12"/><rect x="60" y="${y-26}" width="${t.length*24+26}" height="44" rx="22" fill="${col}"/><text x="${73+t.length*12}" y="${y+8}" font-size="28" font-weight="900" fill="${IVORY}" text-anchor="middle" font-family="DejaVu Sans, sans-serif">${t}</text></g>`;
  s+=mk(180,'FULL',T.mkF||0,BLUE)+mk(400,'COLD',T.mkC||0,'#4a78d8');
  return s+`</g>`;
}
function snow(x,y,s,op){
  let g=`<g transform="translate(${x} ${y}) scale(${s})" opacity="${op.toFixed(2)}">`;
  for(let k=0;k<3;k++)g+=`<path d="M-24 0 L24 0 M-14 -8 L-22 0 L-14 8 M14 -8 L22 0 L14 8" stroke="${COLDB}" stroke-width="6" stroke-linecap="round" fill="none" transform="rotate(${k*60})"/>`;
  return g+`<circle r="5" fill="${IVORY}" stroke="${COLDB}" stroke-width="3"/></g>`;
}
function magnifier(T,f){
  const m=T.mag||0;if(m<0.02)return '';
  const cx=330,cy=250,r=170;
  let s=`<g opacity="${clamp(m*1.4,0,1).toFixed(2)}"><path d="M${T.bx-60} ${T.by-70} L${cx+80} ${cy+150}" stroke="${NAVY}" stroke-width="5"/>`;
  s+=`<defs><clipPath id="mg"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath></defs><circle cx="${cx}" cy="${cy}" r="${r}" fill="#fdfcf1"/>`;
  s+=`<g clip-path="url(#mg)"><path d="M${cx-r} ${cy+40} Q${cx} ${cy-30} ${cx+r} ${cy+40} L${cx+r} ${cy+r} L${cx-r} ${cy+r} Z" fill="${ORANGE}"/>`;
  // pebbles along the curved surface, and a dark seam channel
  for(let i=-6;i<=6;i++){const t=i/6,px=cx+t*r,py=cy+40-70*(1-t*t)+2;
    for(let j=0;j<4;j++){s+=`<circle cx="${(px+(j%2)*13).toFixed(1)}" cy="${(py+12+j*30).toFixed(1)}" r="11" fill="${ORANGE2}" stroke="${NAVY}" stroke-width="3"/>`;}
    s+=`<circle cx="${px.toFixed(1)}" cy="${(py-6).toFixed(1)}" r="11" fill="${ORANGE}" stroke="${NAVY}" stroke-width="4"/>`;}
  s+=`<path d="M${cx+70} ${cy-10} L${cx+90} ${cy+r}" stroke="${NAVY}" stroke-width="18"/>`;
  // fingertip pressing from above
  const fp=T.fing||0,fy=cy-150+70*fp;
  s+=`<path d="M${cx-70} ${fy-200} L${cx-70} ${fy} Q${cx-70} ${fy+60} ${cx} ${fy+60} Q${cx+70} ${fy+60} ${cx+70} ${fy} L${cx+70} ${fy-200} Z" fill="${IVORY}" stroke="${NAVY}" stroke-width="7"/>`;
  s+=`<path d="M${cx-34} ${fy+10} Q${cx} ${fy-14} ${cx+34} ${fy+10} M${cx-24} ${fy+30} Q${cx} ${fy+12} ${cx+24} ${fy+30}" fill="none" stroke="${NAVY}" stroke-width="3" opacity=".5"/>`;
  if(fp>0.8)for(let k=0;k<3;k++)s+=`<path d="M${cx-110+k*110} ${fy+70} l0 22" stroke="${BLUE}" stroke-width="7" stroke-linecap="round" opacity="${(fp-0.8)*5}"/>`;
  s+=`</g><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${NAVY}" stroke-width="12"/><path d="M${cx+r*0.7} ${cy+r*0.7} L${cx+r*0.7+70} ${cy+r*0.7+70}" stroke="${NAVY}" stroke-width="24" stroke-linecap="round"/></g>`;
  return s;
}
window.PROPS={labelY:60,
  grip:T=>({x:T.gx||600,y:T.gy||420}),
  draw(T,f){
    let s=ruler(T);
    // floor shadow under the ball
    if((T.mv===undefined?1:T.mv)>0.5){const h=clamp((700-T.by-R)/450,0,1);
    s+=`<ellipse cx="${T.bx}" cy="704" rx="${(R*(1+0.32*T.sq)*(1-0.5*h)).toFixed(1)}" ry="10" fill="${NAVY}" opacity="${(0.25*(1-h)).toFixed(2)}"/>`;}
    // impact marks
    if(T.sq>0.35)for(let k=-1;k<=1;k+=2)s+=`<path d="M${T.bx+k*(R*1.3+10)} 690 l${k*30} -14 M${T.bx+k*(R*1.3+12)} 676 l${k*22} -24" stroke="${NAVY}" stroke-width="6" stroke-linecap="round" opacity="${clamp((T.sq-0.35)*2,0,1).toFixed(2)}"/>`;
    if((T.mv===undefined?1:T.mv)>0.5)s+=ball('m',T.bx,T.by,T.sq,{xr:T.xr,spd:T.spd,arr:T.arr,cold:T.cold,warm:T.warm,f:(T.df===undefined?f:T.df)});
    // floor push arrows (squeezed air shoving back)
    if((T.up||0)>0.02){s+=arrow(T.bx+R*1.45+50,690,-90,150+120*T.up,14,BLUE,clamp(T.up*1.5,0,1));s+=arrow(T.bx-R*1.45-50,690,-90,150+120*T.up,14,BLUE,clamp(T.up*1.5,0,1));}
    if((T.cold||0)>0.02){const c=T.cold;[[T.bx-150,T.by-120,1],[T.bx+140,T.by-160,0.8],[T.bx+170,T.by+20,0.7],[T.bx-170,T.by+40,0.9]].forEach((p,i)=>{s+=snow(p[0],p[1]+6*Math.sin(f/9+i),p[2],c);});}
    // flat ball
    if((T.fv||0)>0.02){
      s+=`<g opacity="${clamp(T.fv*1.5,0,1).toFixed(2)}">`;
      if(T.fy>560)s+=`<ellipse cx="${T.fx}" cy="704" rx="${R*1.45}" ry="10" fill="${NAVY}" opacity=".25"/>`;
      s+=ball('f',T.fx,T.fy,T.fsq,{flat:1,xr:T.fxr,spd:0.35,ndots:7,f:f});
      const hh=T.heat||0;
      if(hh>0.02){for(let k=0;k<3;k++){const xx=T.fx-60+k*60,yy=T.fy-90-((f*2+k*20)%50);s+=`<path d="M${xx} ${yy+40} q-12 -10 0 -20 q12 -10 0 -20" fill="none" stroke="${RED}" stroke-width="7" stroke-linecap="round" opacity="${(hh*0.9).toFixed(2)}"/>`;}
        for(let k=0;k<2;k++){const rr=30+((f*3+k*30)%60);s+=`<path d="M${T.fx+R*1.4+10} ${700-rr} A${rr} ${rr} 0 0 1 ${T.fx+R*1.4+10+rr} 700" fill="none" stroke="${NAVY}" stroke-width="5" opacity="${(hh*(1-((f*3+k*30)%60)/60)).toFixed(2)}"/>`;}}
      s+=`</g>`;
    }
    s+=magnifier(T,f);
    const ry=R*(1-0.32*T.sq),rx=R*(1+0.32*T.sq);
    const anchors={ball:{x:T.bx-rx*0.7,y:T.by-ry*0.6},air:{x:T.bx-20,y:T.by-15},wall:{x:T.bx-rx+6,y:T.by-20},
      flatspot:{x:T.bx-rx*0.5,y:700},flat:{x:T.fx-50,y:(T.fy||600)-30},rubber:{x:(T.fx||0)-R*1.2,y:(T.fy||600)},
      pebble:{x:270,y:180},mkF:{x:400,y:180},mkC:{x:400,y:400},top:{x:T.bx,y:T.by-ry}};
    return {svg:s,anchors};
  }};
