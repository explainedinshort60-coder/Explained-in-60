// Episode 001 props: cutaway toilet tank (ballcock fill valve, flapper, overflow tube).
// Contract: window.PROPS = {draw(T,f)->{svg, anchors}, grip(T)->{x,y}, labelY}
const P={x:300,y:392},L=150,BR=24,H={x:560,y:378},FH={x:490,y:548};
function geo(T){
  const s=Math.max(-0.2,Math.min(0.867,(T.yw-P.y)/L)); const a=Math.asin(s);
  const ball={x:P.x+L*Math.cos(a),y:P.y+L*Math.sin(a)};
  const th=T.press*35*Math.PI/180;
  const grip={x:H.x+38*Math.cos(th),y:H.y+38*Math.sin(th)};
  const inner={x:H.x-100*Math.cos(th),y:H.y-100*Math.sin(th)};
  const ph=T.flap*Math.PI/180; const flapTip={x:FH.x-54*Math.cos(ph),y:FH.y-54*Math.sin(ph)};
  const adeg=a*180/Math.PI; const open=T.stuck?1:Math.max(0,Math.min(1,(adeg-T.off-3)/8));
  return {a,ball,grip,inner,flapTip,open};
}
function toiletSVG(T,f){
  const g=geo(T); let s='';
  // floor + wall
  // supply pipe
  s+=`<path d="M300 560 V625 H150" fill="none" stroke="${NAVY}" stroke-width="10" stroke-linejoin="round"/>`;
  // bowl
  s+=`<rect x="330" y="555" width="150" height="40" fill="${IVORY}" stroke="${NAVY}" stroke-width="10"/>`;
  s+=`<path d="M245 612 Q250 670 345 680 L360 700 H450 L465 680 Q560 670 565 612 Z" fill="${IVORY}" stroke="${NAVY}" stroke-width="10" stroke-linejoin="round"/>`;
  s+=`<rect x="225" y="588" width="360" height="28" rx="14" fill="${IVORY}" stroke="${NAVY}" stroke-width="10"/>`;
  if(T.swirl>0){for(let i=0;i<3;i++){const o=((f*6+i*40)%120);s+=`<path d="M${300+i*20} ${640+i*10} q${60+o/3} -18 ${150-o/2} 6" fill="none" stroke="${BLUE}" stroke-width="6" stroke-linecap="round" opacity="${T.swirl*(1-o/140)}"/>`;}}
  // tank interior
  s+=`<rect x="250" y="360" width="310" height="200" rx="18" fill="${TINT}"/>`;
  s+=`<clipPath id="tk"><rect x="255" y="365" width="300" height="190" rx="14"/></clipPath><g clip-path="url(#tk)">`;
  let wave=`M240 ${T.yw}`;for(let x=240;x<=570;x+=10)wave+=` L${x} ${T.yw+Math.sin(x/18+f/4)*2.2}`;
  s+=`<path d="${wave} V570 H240 Z" fill="${WATER}" opacity=".6"/><path d="${wave}" fill="none" stroke="${BLUE}" stroke-width="4"/>`;
  // overflow tube
  s+=`<rect x="515" y="382" width="18" height="168" fill="${IVORY}" stroke="${NAVY}" stroke-width="5"/>`;
  if(T.overflow)for(let i=0;i<5;i++){const y=385+((f*9+i*34)%160);s+=`<line x1="524" y1="${y}" x2="524" y2="${y+16}" stroke="${BLUE}" stroke-width="6" stroke-linecap="round"/>`;}
  // drain hole + flapper + chain
  s+=`<ellipse cx="463" cy="553" rx="30" ry="6" fill="${NAVY}"/>`;
  s+=`<line x1="${g.inner.x}" y1="${g.inner.y}" x2="${g.flapTip.x}" y2="${g.flapTip.y}" stroke="${NAVY}" stroke-width="3" stroke-dasharray="5 4"/>`;
  s+=`<line x1="${FH.x}" y1="${FH.y}" x2="${g.flapTip.x}" y2="${g.flapTip.y}" stroke="${BLUE}" stroke-width="13" stroke-linecap="round"/>`;
  if(T.flap>20)for(let i=0;i<3;i++){const y=556+((f*8+i*14)%30);s+=`<line x1="${450+i*12}" y1="${y}" x2="${450+i*12}" y2="${y+12}" stroke="${BLUE}" stroke-width="5" stroke-linecap="round" opacity=".8"/>`;}
  // fill valve tube + flow
  s+=`<rect x="292" y="${P.y}" width="16" height="${550-P.y}" fill="${IVORY}" stroke="${NAVY}" stroke-width="5"/>`;
  if(g.open>0.05){for(let i=0;i<5;i++){const y=P.y+8+((f*10+i*30)%150);s+=`<line x1="300" y1="${y}" x2="300" y2="${y+14}" stroke="${BLUE}" stroke-width="6" stroke-linecap="round" opacity="${g.open}"/>`;}
    for(let i=0;i<3;i++){const r=((f*3+i*9)%26);s+=`<circle cx="${318+r}" cy="${548-r*0.6}" r="${4-r/10}" fill="${BLUE}" opacity="${g.open*(1-r/30)}"/>`;}}
  // arm (with bend offset) + ball
  const off=T.off*Math.PI/180, m={x:P.x+L*0.45*Math.cos(g.a-off),y:P.y+L*0.45*Math.sin(g.a-off)};
  s+=`<path d="M${P.x} ${P.y} L${m.x} ${m.y} L${g.ball.x} ${g.ball.y}" fill="none" stroke="${NAVY}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`;
  s+=`<rect x="284" y="${P.y-14}" width="32" height="20" rx="5" fill="${g.open>0.05?BLUE:IVORY}" stroke="${NAVY}" stroke-width="5"/>`;
  s+=`<circle cx="${g.ball.x}" cy="${g.ball.y}" r="${BR}" fill="${BLUE}" stroke="${NAVY}" stroke-width="6"/><path d="M${g.ball.x-10} ${g.ball.y-9} q6 -6 13 -4" stroke="${IVORY}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  // trip arm
  s+=`<line x1="${H.x}" y1="${H.y}" x2="${g.inner.x}" y2="${g.inner.y}" stroke="${NAVY}" stroke-width="6" stroke-linecap="round"/>`;
  s+=`</g>`;
  if(T.ghost!=null)s+=`<line x1="262" y1="${T.ghost}" x2="548" y2="${T.ghost}" stroke="${BLUE}" stroke-width="4" stroke-dasharray="10 8"/>`;
  if(T.levelLine)s+=`<line x1="235" y1="400" x2="575" y2="400" stroke="${NAVY}" stroke-width="3" stroke-dasharray="8 8" opacity="${T.levelLine}"/>`;
  // tank shell + lid + handle
  s+=`<rect x="250" y="360" width="310" height="200" rx="18" fill="none" stroke="${NAVY}" stroke-width="10"/>`;
  s+=`<rect x="238" y="338" width="334" height="26" rx="12" fill="${IVORY}" stroke="${NAVY}" stroke-width="10"/>`;
  s+=`<line x1="${H.x}" y1="${H.y}" x2="${g.grip.x}" y2="${g.grip.y}" stroke="${NAVY}" stroke-width="12" stroke-linecap="round"/><circle cx="${H.x}" cy="${H.y}" r="9" fill="${IVORY}" stroke="${NAVY}" stroke-width="5"/>`;
  return {svg:s,g};
}
function anchors(T,g){return {ball:g.ball,arm:{x:(P.x+g.ball.x)/2,y:(P.y+g.ball.y)/2},tap:{x:300,y:P.y-4},flap:{x:(FH.x+g.flapTip.x)/2,y:(FH.y+g.flapTip.y)/2},overflow:{x:524,y:400},handle:g.grip,line:{x:250,y:400}};}

window.PROPS={labelY:330,
  draw(T,f){const t=toiletSVG(T,f);return {svg:t.svg,anchors:anchors(T,t.g)};},
  grip(T){return geo(T).grip;}};
