// Episode 003 props: jacket on a coat stand with an x-ray zipper (two staggered rows of teeth, Y-channel slider, stops),
// a magnifier showing the bump-and-dent tooth profile, and pliers for the worn-slider fix.
// Contract: window.PROPS = {draw(T,f)->{svg, anchors}, grip(T)->{x,y}, labelY}
// T: sy (slider top y), xr (x-ray 0..1), tug (panel stretch), wob (stand sway deg), mac (magnifier 0..1), mz (teeth nested 0..4),
//    worn (0..1 slider worn loose), split (0..1 teeth below slider failed to lock), pl (pliers 0..1 shown), plq (pliers squeeze 0..1), g ('tab'|'panel')
const ZX=520,TOP=214,BOT=592,SL=62,P=15,HX=ZX,HY=150,DY=56;
const LIN='#dfe6fb';
function chainX(T,y,side){ // centreline offset of a row
  const ys=T.sy,yb=ys+SL;let d;
  if(y>=yb) d=T.split*24*Math.max(0,Math.min(1,(BOT-30-y)/50));
  else if(y>=ys){const u=(yb-y)/SL; d=Math.max(0,(u-0.35)/0.65)*(15+T.worn*4);}
  else d=15+(ys-y)*0.34;
  return side*d;
}
function teeth(T){
  let s='';
  for(const side of [-1,1]){
    for(let i=0;;i++){
      const y=TOP+9+i*P+(side>0?P/2:0); if(y>BOT-8)break;
      const o=chainX(T,y,side), o2=chainX(T,y-4,side), ang=Math.atan2(o2-o,4)*180/Math.PI;
      const cx=ZX+o+side*-0; // tooth spans from tape (outer) across the centre
      const x0=side<0?cx-24:cx-6, w=30;
      const lit=(T.lit&&Math.abs(y-(T.sy+SL+10+(side>0?P/2:0)))<P*0.6);
      s+=`<g transform="rotate(${ang.toFixed(2)} ${(ZX+o+side*-9).toFixed(1)} ${y})"><rect x="${x0.toFixed(1)}" y="${(y-5.5).toFixed(1)}" width="${w}" height="11" rx="5" fill="${lit?BLUE:IVORY}" stroke="${NAVY}" stroke-width="3.5"/>`+
         `<circle cx="${(side<0?x0+w-8:x0+8).toFixed(1)}" cy="${y}" r="2.6" fill="${lit?IVORY:NAVY}"/></g>`;
    }
  }
  return s;
}
function panelPath(T,side){ // fabric panel from tape edge to the side seam
  const pts=[],pts2=[];const tw=T.tug*(side>0?1:0);
  for(let y=TOP-6;y<=BOT+8;y+=8){const o=chainX(T,y,side);pts.push([ZX+o+side*22,y]);}
  const outer=(y)=>{const sh=y<230?(y-185)/45:1;const base=ZX+side*(55+ (Math.max(0,Math.min(1,sh)))*70);
    const pull=tw*34*Math.exp(-Math.pow((y-420)/120,2));const open=Math.max(0,chainX(T,y,side)*side)*0.45;return base+side*(pull+open);};
  for(let y=BOT+8;y>=TOP-6;y-=8)pts2.push([outer(y),y]);
  const top=[[ZX+side*55,185],[ZX+side*22,TOP-6]];
  const all=[...pts,...pts2,[ZX+side*125,215],[ZX+side*55,180]];
  return 'M'+all.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' L')+' Z';
}
function sleeve(T,side){const x=ZX+side*126+side*(side>0?T.tug*14:0);return `<path d="M${x} 214 Q${x+side*22} 222 ${x+side*26} 250 L${x+side*30} 540 Q${x+side*18} 556 ${x+side*4} 544 L${x} 260 Z" fill="${BLUE}" stroke="${NAVY}" stroke-width="7" stroke-linejoin="round"/>`;}
function tapes(T){let s='';for(const side of [-1,1]){let d='';for(let y=TOP-6;y<=BOT+6;y+=6){const o=chainX(T,y,side);d+=(d?' L':'M')+(ZX+o+side*15).toFixed(1)+' '+y;}
  s+=`<path d="${d}" fill="none" stroke="${IVORY}" stroke-width="16"/><path d="${d}" fill="none" stroke="${NAVY}" stroke-width="2" opacity=".35"/>`;}return s;}
function slider(T){
  const ys=T.sy,w1=40+T.worn*6,w2=24+T.worn*7,yb=ys+SL,x=T.xr;
  let s=`<path d="M${ZX-w1} ${ys} H${ZX+w1} Q${ZX+w1+4} ${ys} ${ZX+w1} ${ys+8} L${ZX+w2} ${yb} H${ZX-w2} L${ZX-w1} ${ys+8} Q${ZX-w1-4} ${ys} ${ZX-w1} ${ys} Z" fill="${TINT}" fill-opacity="${1-0.72*x}" stroke="${NAVY}" stroke-width="6" stroke-linejoin="round"/>`;
  if(x>0.01){ // Y channel and the centre post (diamond)
    s+=`<g opacity="${x}"><path d="M${ZX-w1+8} ${ys+2} L${ZX-12} ${ys+SL*0.62} L${ZX-12} ${yb} M${ZX+w1-8} ${ys+2} L${ZX+12} ${ys+SL*0.62} L${ZX+12} ${yb}" fill="none" stroke="${BLUE}" stroke-width="5" stroke-linecap="round"/>`+
       `<path d="M${ZX-11} ${ys+1} H${ZX+11} L${ZX} ${ys+SL*0.5} Z" fill="${NAVY}" fill-opacity=".75"/></g>`;
  }
  // pull tab hanging from the hinge
  const hy=ys+16,tl=74,to=(1-0.65*x).toFixed(2);
  s+=`<g opacity="${to}">`;
  s+=`<rect x="${ZX-9}" y="${hy-6}" width="18" height="14" rx="5" fill="${IVORY}" stroke="${NAVY}" stroke-width="5"/>`;
  s+=`<path d="M${ZX-13} ${hy+4} H${ZX+13} L${ZX+15} ${hy+tl-8} Q${ZX+15} ${hy+tl} ${ZX+6} ${hy+tl} H${ZX-6} Q${ZX-15} ${hy+tl} ${ZX-15} ${hy+tl-8} Z" fill="${IVORY}" stroke="${NAVY}" stroke-width="6" stroke-linejoin="round"/>`;
  s+=`<circle cx="${ZX}" cy="${hy+tl-16}" r="6" fill="${TINT}" stroke="${NAVY}" stroke-width="4"/></g>`;
  return s;
}
function stops(){return `<rect x="${ZX-31}" y="${TOP-10}" width="12" height="9" rx="2" fill="${NAVY}"/><rect x="${ZX+19}" y="${TOP-10}" width="12" height="9" rx="2" fill="${NAVY}"/>`+
  `<rect x="${ZX-22}" y="${BOT-4}" width="44" height="16" rx="5" fill="${NAVY}"/>`;}
function stand(){return `<line x1="${HX}" y1="${96+DY}" x2="${HX}" y2="692" stroke="${NAVY}" stroke-width="12" stroke-linecap="round"/>`+
  `<path d="M${HX-80} 698 Q${HX} 670 ${HX+80} 698 Z" fill="${NAVY}"/><circle cx="${HX}" cy="${92+DY}" r="11" fill="${NAVY}"/>`+
  `<path d="M${HX} ${104+DY} q-16 0 -16 14 q0 10 16 14 v16" fill="none" stroke="${NAVY}" stroke-width="6" stroke-linecap="round"/>`;}
function jacket(T){
  let s='';
  // lining visible when open
  s+=`<path d="M${ZX-55} 180 L${ZX-120} 214 L${ZX-120} ${BOT+8} L${ZX+120} ${BOT+8} L${ZX+120} 214 L${ZX+55} 180 Q${ZX} 200 ${ZX-55} 180 Z" fill="${LIN}" stroke="${NAVY}" stroke-width="6" stroke-linejoin="round"/>`;
  s+=`<path d="M${ZX-95} ${BOT+8} L${ZX-95} 240 M${ZX+95} ${BOT+8} L${ZX+95} 240" stroke="${NAVY}" stroke-width="3" opacity=".25"/>`;
  s+=sleeve(T,-1)+sleeve(T,1);
  s+=`<path d="${panelPath(T,-1)}" fill="${BLUE}" stroke="${NAVY}" stroke-width="7" stroke-linejoin="round"/>`;
  s+=`<path d="${panelPath(T,1)}" fill="${BLUE}" stroke="${NAVY}" stroke-width="7" stroke-linejoin="round"/>`;
  // collar
  s+=`<path d="M${ZX-58} 176 Q${ZX} 206 ${ZX+58} 176 L${ZX+50} 160 Q${ZX} 184 ${ZX-50} 160 Z" fill="${IVORY}" stroke="${NAVY}" stroke-width="6" stroke-linejoin="round"/>`;
  // pockets
  for(const side of [-1,1]){const o=chainX(T,470,side)*0.6+(side>0?T.tug*18:0);s+=`<path d="M${ZX+side*58+o} 455 L${ZX+side*100+o} 445" stroke="${NAVY}" stroke-width="6" stroke-linecap="round"/>`;}
  // strain lines during the tug
  if(T.tug>0.15){const a=Math.min(1,(T.tug-0.15)*1.4);for(let k=0;k<3;k++){const y=380+k*36;s+=`<path d="M${ZX+26} ${y} Q${ZX+70} ${y+8} ${ZX+118+T.tug*28} ${400+k*14}" fill="none" stroke="${NAVY}" stroke-width="4" opacity="${0.55*a}" stroke-linecap="round"/>`;}}
  s+=tapes(T)+teeth(T)+stops()+slider(T);
  return s;
}
function magnifier(T){
  if(T.mac<0.01)return '';
  const cx=262,cy=330,r=142*T.mac;
  let s=`<line x1="${cx+r*0.7}" y1="${cy+r*0.7}" x2="${ZX-30}" y2="${T.sy+SL+20+DY}" stroke="${NAVY}" stroke-width="4" stroke-dasharray="10 8" opacity="${T.mac}"/>`;
  s+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fdfcf1" stroke="${NAVY}" stroke-width="9"/>`;
  s+=`<clipPath id="mag"><circle cx="${cx}" cy="${cy}" r="${r-5}"/></clipPath><g clip-path="url(#mag)"><g transform="translate(${cx} ${cy}) scale(${T.mac}) translate(${-cx} ${-cy})">`;
  // side profile: stacked teeth, each with a bump on top and a dent underneath
  const H=40,BW=140;
  for(let k=0;k<4;k++){
    const side=k%2?1:-1; let p=Math.max(0,Math.min(1,T.mz-k+1)); if(k==0)p=1; if(p<=0.001)continue;
    const e=1-Math.pow(1-p,3), off=(1-e)*side*170, lift=(1-e)*26, rot=(1-e)*side*-16;
    const by=cy+82-k*H-lift, x0=cx-BW/2+off;
    const fill=side<0?BLUE:IVORY;
    const d=`M${x0} ${by} V${by-H+8} Q${x0} ${by-H} ${x0+8} ${by-H} H${cx+off-15} Q${cx+off-15} ${by-H-13} ${cx+off} ${by-H-13} Q${cx+off+15} ${by-H-13} ${cx+off+15} ${by-H} H${x0+BW-8} Q${x0+BW} ${by-H} ${x0+BW} ${by-H+8} V${by} H${cx+off+16} Q${cx+off+16} ${by-14} ${cx+off} ${by-14} Q${cx+off-16} ${by-14} ${cx+off-16} ${by} Z`;
    s+=`<path d="${d}" transform="rotate(${rot} ${cx+off} ${by-H/2})" fill="${fill}" stroke="${NAVY}" stroke-width="6" stroke-linejoin="round"/>`;
  }
  s+=`</g></g>`;
  return s;
}
function pliers(T){
  if(T.pl<0.01)return '';
  const ys=T.sy, g=24+T.worn*7-T.plq*3, dy=(1-T.pl)*260, py=ys+SL+44+dy, jy=ys+SL*0.62+dy, sp=34-T.plq*14;
  let s=`<g opacity="${Math.min(1,T.pl*1.6).toFixed(2)}">`;
  for(const side of [-1,1]){ // each half: jaw on one side of the slider, handle crossing to the other side below the pivot
    s+=`<path d="M${ZX+side*(g+12)} ${jy-14} Q${ZX+side*(g+2)} ${jy} ${ZX+side*(g+8)} ${jy+16} L${ZX-side*8} ${py} L${ZX-side*(sp+12)} ${py+170} L${ZX-side*(sp-6)} ${py+176} L${ZX+side*6} ${py+6} Z" fill="${NAVY}"/>`;
    s+=`<rect x="${ZX-side*sp-15}" y="${py+70}" width="30" height="120" rx="15" transform="rotate(${side*6} ${ZX-side*sp} ${py+130})" fill="${BLUE}" stroke="${NAVY}" stroke-width="5"/>`;
  }
  s+=`<circle cx="${ZX}" cy="${py}" r="9" fill="${IVORY}" stroke="${NAVY}" stroke-width="5"/></g>`;
  return s;
}
function anchors(T){const ys=T.sy;
  return {slider:{x:ZX+30,y:ys+20},ych:{x:ZX-14,y:ys+SL*0.45},tab:{x:ZX,y:ys+70},teethL:{x:ZX-12,y:Math.min(BOT-30,ys+SL+40)},teethR:{x:ZX+12,y:Math.min(BOT-22,ys+SL+48)},
    open:{x:ZX,y:Math.max(TOP+20,ys-60)},topstop:{x:ZX+25,y:TOP-6},bottom:{x:ZX,y:BOT+4},panel:{x:ZX+120+T.tug*34,y:420},
    bump:{x:262,y:330+82-40-12},dent:{x:262,y:330+82-40-7},stack:{x:262,y:330},pliers:{x:ZX-34,y:ys+SL*0.62},worn:{x:ZX+30,y:ys+SL-6},split:{x:ZX+30,y:Math.min(BOT-60,ys+SL+110)}};}
window.PROPS={labelY:120,
  draw(T,f){const tr=`rotate(${T.wob||0} ${HX} ${92+DY}) translate(0 ${DY})`;
    const A=anchors(T);for(const k in A)if(!['bump','dent','stack'].includes(k))A[k].y+=DY;
    const svg=stand()+`<g transform="${tr}">`+jacket(T)+pliers(T)+`</g>`+magnifier(T);return {svg,anchors:A};},
  grip(T){if(T.g=='panel')return {x:ZX+122+T.tug*34,y:420+DY};return {x:ZX,y:T.sy+16+66+DY};}};
