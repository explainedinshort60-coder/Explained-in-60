// Episode 020 props: an air-activated hand warmer packet (quilted cobalt pouch with tiny pores), its sealed plastic
// wrapper (crimped ends, tear strip), an x-ray magnifier into the pouch (iron grains, salt cubes, charcoal bits, damp
// filler flakes, oxygen molecules drifting in through the pores, grains turning rust orange with a little heat flash),
// heat glow and heat waves, a zip bag for the "pause" bonus, and a rusty old nail on a crate for the gag.
// Contract: window.PROPS = {draw(T,f)->{svg, anchors}, grip(T)->{x,y}, labelY}
// T: pk (packet 0..1), wrap (wrapper 0..1), tear (0..1), xr (x-ray 0..1), rust (0..1 share of iron rusted), air (0..1),
//    heat (0..1.4), shake (0..1), zb (zip bag 0..1), nail (0..1), cold (0..1 frosty tint), spread (charcoal rings 0..1)
const IRON='#8d94a6',RUST='#d0612a',RUST2='#9c3f16',FIRE='#ff8a1f',HOT='#ffd45c',ICE='#7fc4ff',FILL='#e2c58f',WOOD='#c98a4b';
const PX=410,PY=300,PW=240,PH=320,MX=388,MY=285,MR=162;
function F(v){return v.toFixed(1);}
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
// deterministic particle layout inside the magnifier
const PARTS=(()=>{let s=7;const r=()=>{s=(s*16807)%2147483647;return s/2147483647;};const out=[];let tries=0;
  const kinds=[];for(let i=0;i<20;i++){kinds.push('iron');if(i%4==1)kinds.push('salt');if(i%4==3)kinds.push('carbon');if(i%5==2)kinds.push('fill');}
  for(const k of kinds){for(let t=0;t<400;t++){tries++;const a=r()*Math.PI*2,d=Math.sqrt(r())*(MR-34),x=MX+Math.cos(a)*d,y=MY+18+Math.sin(a)*d*0.86;
      if(y<MY-MR+62)continue;
      if(out.every(p=>Math.hypot(p.x-x,p.y-y)>31)){out.push({k,x,y,th:r(),rot:r()*90});break;}}}
  return out;})();
const IRONS=PARTS.filter(p=>p.k=='iron').sort((a,b)=>a.th-b.th);
function dx(T){return T.ox||0;}
function dy(T){return T.oy||0;}
function glow(T,f,ox,oy){
  const h=T.heat||0;if(h<0.02)return '';
  let s=`<ellipse cx="${PX+ox}" cy="${PY+oy}" rx="${F(PW*0.85+40*h)}" ry="${F(PH*0.72+40*h)}" fill="${HOT}" opacity="${F(0.22*Math.min(h,1.3))}"/>`;
  s+=`<ellipse cx="${PX+ox}" cy="${PY+oy}" rx="${F(PW*0.66+20*h)}" ry="${F(PH*0.6+20*h)}" fill="${FIRE}" opacity="${F(0.18*Math.min(h,1.3))}"/>`;
  for(let k=0;k<4;k++){const ph=((f/48+k/4)%1),x=PX-75+k*50+ox,y=PY-PH/2-30-ph*120+oy;
    s+=`<path d="M${x} ${F(y)} q-12 -16 0 -32 q12 -16 0 -32" fill="none" stroke="${FIRE}" stroke-width="7" stroke-linecap="round" opacity="${F(Math.min(1,h)*Math.sin(ph*Math.PI))}"/>`;}
  return s;
}
function packet(T,f,ox,oy){
  if((T.pk||0)<0.02)return '';
  const x0=PX-PW/2+ox,y0=PY-PH/2+oy,h=Math.min(1,T.heat||0),c=T.cold||0;
  let s=`<g opacity="${F(T.pk)}">`;
  s+=`<rect x="${x0+8}" y="${y0+10}" width="${PW}" height="${PH}" rx="30" fill="${NAVY}" opacity=".14"/>`;
  s+=`<rect x="${x0}" y="${y0}" width="${PW}" height="${PH}" rx="30" fill="${IVORY}" stroke="${NAVY}" stroke-width="9"/>`;
  // quilt seams
  s+=`<rect x="${x0+22}" y="${y0+22}" width="${PW-44}" height="${PH-44}" rx="18" fill="none" stroke="${BLUE}" stroke-width="4" stroke-dasharray="10 9" opacity=".8"/>`;
  // warm face tint
  if(h>0.02)s+=`<rect x="${x0+22}" y="${y0+22}" width="${PW-44}" height="${PH-44}" rx="18" fill="${FIRE}" opacity="${F(0.42*h)}"/>`;
  // pores (tiny holes)
  for(let i=0;i<6;i++)for(let j=0;j<8;j++){const x=x0+48+i*29,y=y0+52+j*31;s+=`<circle cx="${x}" cy="${y}" r="3.2" fill="${NAVY}" opacity=".55"/>`;}
  // label band (generic, no brand)
  s+=`<rect x="${x0+40}" y="${y0+PH/2-34}" width="${PW-80}" height="68" rx="14" fill="${BLUE}" stroke="${NAVY}" stroke-width="5"/>`;
  s+=`<text x="${PX+ox}" y="${y0+PH/2-4}" font-size="25" font-weight="900" fill="${IVORY}" text-anchor="middle" font-family="DejaVu Sans, sans-serif">HAND</text>`;
  s+=`<text x="${PX+ox}" y="${y0+PH/2+24}" font-size="25" font-weight="900" fill="${IVORY}" text-anchor="middle" font-family="DejaVu Sans, sans-serif">WARMER</text>`;
  if(c>0.02)s+=`<rect x="${x0}" y="${y0}" width="${PW}" height="${PH}" rx="30" fill="${ICE}" opacity="${F(0.35*c)}"/>`;
  return s+`</g>`;
}
function wrapper(T,f,ox,oy){
  const w=T.wrap||0;if(w<0.02)return '';
  const tr=T.tear||0,x0=PX-PW/2-26+ox,y0=PY-PH/2-46+oy,W=PW+52,H=PH+92;
  const slide=clamp((tr-0.45)/0.55,0,1),op=w*(1-slide);
  let s='';
  // body (clear film, slides down and fades once torn)
  if(op>0.02){s+=`<g opacity="${F(op)}" transform="translate(0 ${F(slide*260)})">`;
    s+=`<rect x="${x0}" y="${y0+30}" width="${W}" height="${H-30}" rx="16" fill="#dfe8ff" opacity=".72" stroke="${NAVY}" stroke-width="6"/>`;
    s+=`<path d="M${x0+30} ${y0+70} L${x0+70} ${y0+40}" stroke="${IVORY}" stroke-width="9" stroke-linecap="round"/>`;
    // bottom crimp
    let z='';for(let i=0;i<=14;i++)z+=`${i?'L':'M'}${F(x0+i*W/14)} ${F(y0+H+(i%2?10:0))} `;
    s+=`<path d="${z}" fill="none" stroke="${NAVY}" stroke-width="5"/>`;
    s+=`<rect x="${x0+20}" y="${y0+H-80}" width="${W-40}" height="40" rx="8" fill="${IVORY}" stroke="${NAVY}" stroke-width="4"/>`;
    s+=`<text x="${PX+ox}" y="${y0+H-51}" font-size="22" font-weight="900" fill="${NAVY}" text-anchor="middle" font-family="DejaVu Sans, sans-serif">AIR-ACTIVATED</text>`;
    s+=`</g>`;}
  // top tear strip (flies off up and to the left)
  const tx=-tr*160,ty=-tr*190,rot=-tr*40,top=w*(1-clamp((tr-0.6)/0.4,0,1));
  if(top>0.02){s+=`<g opacity="${F(top)}" transform="translate(${F(tx)} ${F(ty)}) rotate(${F(rot)} ${F(x0+W/2)} ${F(y0+15)})">`;
    let z=`M${x0} ${y0+30} `;for(let i=0;i<=14;i++)z+=`L${F(x0+i*W/14)} ${F(y0+(i%2?0:10))} `;z+=`L${x0+W} ${y0+30} Z`;
    s+=`<path d="${z}" fill="#dfe8ff" stroke="${NAVY}" stroke-width="6" stroke-linejoin="round"/>`;
    s+=`<path d="M${x0+W-30} ${y0+16} l14 14" stroke="${NAVY}" stroke-width="5"/>`;
    s+=`</g>`;}
  return s;
}
function zipbag(T,f,ox,oy){
  const z=T.zb||0;if(z<0.02)return '';
  const x0=PX-PW/2-40+ox,y0=PY-PH/2-70+oy,W=PW+80,H=PH+110;
  let s=`<g opacity="${F(z)}"><rect x="${x0}" y="${y0}" width="${W}" height="${H}" rx="18" fill="#e8f1ff" opacity=".55" stroke="${NAVY}" stroke-width="6"/>`;
  s+=`<rect x="${x0+6}" y="${y0+16}" width="${W-12}" height="16" rx="6" fill="${BLUE}" stroke="${NAVY}" stroke-width="4"/>`;
  s+=`<path d="M${x0+30} ${y0+70} L${x0+30} ${y0+H-40}" stroke="${IVORY}" stroke-width="9" stroke-linecap="round" opacity=".9"/>`;
  return s+`</g>`;
}
function o2(x,y,s,op){
  return `<g opacity="${F(op)}"><circle cx="${F(x-9*s)}" cy="${F(y)}" r="${F(11*s)}" fill="${ICE}" stroke="${NAVY}" stroke-width="4"/><circle cx="${F(x+9*s)}" cy="${F(y)}" r="${F(11*s)}" fill="${ICE}" stroke="${NAVY}" stroke-width="4"/></g>`;
}
function xray(T,f){
  const xr=T.xr||0;if(xr<0.02)return '';
  const rust=T.rust||0,air=T.air||0,sp=T.spread||0;
  let s=`<g opacity="${F(clamp(xr*1.3,0,1))}">`;
  s+=`<circle cx="${MX}" cy="${MY}" r="${MR+16}" fill="${NAVY}" opacity=".18"/>`;
  s+=`<clipPath id="mclip"><circle cx="${MX}" cy="${MY}" r="${MR}"/></clipPath>`;
  s+=`<g clip-path="url(#mclip)"><rect x="${MX-MR}" y="${MY-MR}" width="${MR*2}" height="${MR*2}" fill="#2a1d14"/>`;
  // outside air above the fabric
  s+=`<rect x="${MX-MR}" y="${MY-MR}" width="${MR*2}" height="58" fill="#eaf3ff"/>`;
  // fabric band with pores
  const fy=MY-MR+58;
  s+=`<rect x="${MX-MR}" y="${fy}" width="${MR*2}" height="20" fill="${BLUE}"/>`;
  for(let i=0;i<7;i++){const x=MX-MR+30+i*46;s+=`<rect x="${x}" y="${fy}" width="14" height="20" fill="#2a1d14"/>`;}
  // charcoal heat rings (spread)
  if(sp>0.02)for(const p of PARTS.filter(p=>p.k=='carbon')){const ph=(f/36+p.th)%1;
    s+=`<circle cx="${F(p.x)}" cy="${F(p.y)}" r="${F(14+ph*60)}" fill="none" stroke="${FIRE}" stroke-width="5" opacity="${F(sp*(1-ph)*0.9)}"/>`;}
  // particles
  const nR=Math.round(rust*IRONS.length);
  for(const p of PARTS){
    if(p.k=='iron'){const r=IRONS.indexOf(p)<nR;
      s+=`<circle cx="${F(p.x)}" cy="${F(p.y)}" r="13" fill="${r?RUST:IRON}" stroke="${NAVY}" stroke-width="4"/>`;
      if(r)s+=`<circle cx="${F(p.x-4)}" cy="${F(p.y-3)}" r="3.5" fill="${RUST2}"/><circle cx="${F(p.x+5)}" cy="${F(p.y+4)}" r="2.5" fill="${RUST2}"/>`;
      else s+=`<circle cx="${F(p.x-4)}" cy="${F(p.y-5)}" r="3.5" fill="${IVORY}" opacity=".8"/>`;}
    else if(p.k=='salt')s+=`<rect x="${F(p.x-10)}" y="${F(p.y-10)}" width="20" height="20" rx="3" fill="${IVORY}" stroke="${NAVY}" stroke-width="4" transform="rotate(${F(p.rot)} ${F(p.x)} ${F(p.y)})"/>`;
    else if(p.k=='carbon')s+=`<path d="M${F(p.x-12)} ${F(p.y+4)} L${F(p.x-4)} ${F(p.y-11)} L${F(p.x+11)} ${F(p.y-6)} L${F(p.x+9)} ${F(p.y+9)} L${F(p.x-6)} ${F(p.y+11)} Z" fill="#111827" stroke="${NAVY}" stroke-width="3"/>`;
    else s+=`<ellipse cx="${F(p.x)}" cy="${F(p.y)}" rx="15" ry="7" fill="${FILL}" stroke="${NAVY}" stroke-width="3" transform="rotate(${F(p.rot-45)} ${F(p.x)} ${F(p.y)})"/><circle cx="${F(p.x+8)}" cy="${F(p.y-9)}" r="4.5" fill="${WATER}"/>`;
  }
  // oxygen drifting in through the pores to the next grains in line, flash on arrival
  if(air>0.02){const n=6;
    for(let k=0;k<n;k++){const per=40,ph=((f+k*per/n)%per)/per,g=IRONS[(nR+k)%IRONS.length],pore=MX-MR+37+((k*3)%7)*46;
      const sx=pore,sy=MY-MR+20,ex=g.x,ey=g.y-14;let x,y;
      if(ph<0.35){const u=ph/0.35;x=sx;y=sy+u*(fy+26-sy);} else {const u=(ph-0.35)/0.55;x=sx+(ex-sx)*Math.min(1,u);y=fy+26+(ey-fy-26)*Math.min(1,u);}
      if(ph<0.9)s+=o2(x,y,1,air);
      else{const u=(ph-0.9)/0.1;s+=`<circle cx="${F(g.x)}" cy="${F(g.y)}" r="${F(16+u*22)}" fill="${HOT}" opacity="${F(air*(1-u)*0.8)}"/>`;}}}
  s+=`</g>`;
  s+=`<circle cx="${MX}" cy="${MY}" r="${MR}" fill="none" stroke="${NAVY}" stroke-width="12"/>`;
  s+=`<path d="M${MX-MR*0.62} ${MY-MR*0.55} Q${MX-MR*0.3} ${MY-MR*0.86} ${MX+MR*0.05} ${MY-MR*0.88}" stroke="${IVORY}" stroke-width="8" fill="none" stroke-linecap="round" opacity=".55"/>`;
  return s+`</g>`;
}
function nailProp(T,f){
  const n=T.nail||0;if(n<0.02)return '';
  const x0=420,x1=630,y0=480;
  let s=`<g opacity="${F(n)}"><rect x="${x0}" y="${y0}" width="${x1-x0}" height="${700-y0}" rx="8" fill="${WOOD}" stroke="${NAVY}" stroke-width="7"/>`;
  s+=`<path d="M${x0} ${y0+70} L${x1} ${y0+70} M${x0} ${y0+140} L${x1} ${y0+140}" stroke="${NAVY}" stroke-width="5"/>`;
  // rusty nail lying on top
  s+=`<path d="M${x0+30} ${y0-18} L${x1-50} ${y0-18} L${x1-20} ${y0-9} L${x1-50} ${y0} L${x0+30} ${y0} Z" fill="${RUST}" stroke="${NAVY}" stroke-width="5" stroke-linejoin="round"/>`;
  s+=`<rect x="${x0+18}" y="${y0-26}" width="14" height="36" rx="3" fill="${RUST}" stroke="${NAVY}" stroke-width="5"/>`;
  for(const [x,y] of [[x0+60,y0-9],[x0+95,y0-10],[x0+125,y0-7]])s+=`<circle cx="${x}" cy="${y}" r="3.5" fill="${RUST2}"/>`;
  return s+`</g>`;
}
window.PROPS={labelY:-90,
  grip:T=>({x:PX+PW/2+2+dx(T),y:PY+40+dy(T)}),
  draw(T,f){
    const ox=dx(T),oy=dy(T);
    let s=glow(T,f,ox,oy)+packet(T,f,ox,oy)+wrapper(T,f,ox,oy)+zipbag(T,f,ox,oy)+nailProp(T,f)+xray(T,f);
    const g=IRONS[0],r=IRONS[Math.max(0,Math.round((T.rust||0)*IRONS.length)-1)];
    const pick=k=>{const p=PARTS.filter(q=>q.k==k).sort((a,b)=>Math.hypot(a.x-MX,a.y-MY-30)-Math.hypot(b.x-MX,b.y-MY-30))[0];return {x:p.x,y:p.y-12};};
    const anchors={packet:{x:PX+ox,y:PY-PH/2+oy},iron:{x:g.x,y:g.y-12},salt:pick('salt'),carbon:pick('carbon'),fill:pick('fill'),
      pores:{x:MX-MR+37+2*46,y:MY-MR+68},rust:{x:r.x,y:r.y-12},nail:{x:480,y:466},bag:{x:PX+ox,y:PY-PH/2-60+oy}};
    return {svg:s,anchors};
  }};
