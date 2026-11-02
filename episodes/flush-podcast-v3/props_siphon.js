// Side cutaway of a gravity siphon toilet: tank (rear, left), bowl, S-trap over a hump, floor drain.
// T: {lvl: bowl water y, fill: trap fill 0..1 from outlet, flow: 0..1 arrows, gurgle: 0..1, blob: -1 or 0..1 along trap (0 = in bowl), wave: 0..1 tank dump}
(function(){
const N='#071747',BL='#2465ff',IV='#fffdf4',W='#7da0ff';
const TRAP="M 395 600 C 392 640 330 650 318 600 C 310 560 300 520 268 518 C 236 516 226 560 226 700";
function draw(T,f){
  let s='';
  // tank (rear)
  s+=`<rect x="150" y="255" width="150" height="190" rx="16" fill="#e9eefc" stroke="${N}" stroke-width="10"/>`;
  const tl=300+ (T.tank===undefined?0:(1-T.tank))*130;
  s+=`<clipPath id="tk2"><rect x="155" y="260" width="140" height="180" rx="12"/></clipPath><rect x="150" y="${tl}" width="150" height="${445-tl}" fill="${W}" opacity=".6" clip-path="url(#tk2)"/>`;
  s+=`<rect x="140" y="240" width="170" height="22" rx="10" fill="${IV}" stroke="${N}" stroke-width="10"/>`;
  // floor drain
  s+=`<rect x="196" y="690" width="60" height="30" fill="${N}"/>`;
  // bowl body
  const bowl="M 300 450 L 560 450 C 575 520 520 590 430 605 L 395 610 C 360 600 330 560 318 520 L 300 450 Z";
  s+=`<path d="M 300 450 L 560 450 C 590 560 540 640 470 660 L 470 700 L 330 700 L 330 650 C 300 600 290 520 300 450 Z" fill="${IV}" stroke="${N}" stroke-width="10" stroke-linejoin="round"/>`;
  // trap tube (behind bowl body), water inside via dash fill
  s+=`<path d="${TRAP}" fill="none" stroke="${N}" stroke-width="54" stroke-linecap="round"/>`;
  s+=`<path d="${TRAP}" fill="none" stroke="#e9eefc" stroke-width="38" stroke-linecap="round"/>`;
  const fill=Math.max(0,Math.min(1,T.fill));
  if(T.gurgle>0){ // broken water column
    const g=T.gurgle; s+=`<path d="${TRAP}" pathLength="100" fill="none" stroke="${W}" stroke-width="36" stroke-dasharray="${14-8*g} ${6+10*g}" stroke-dashoffset="${-f*3}" opacity=".85"/>`;
  } else s+=`<path d="${TRAP}" pathLength="100" fill="none" stroke="${W}" stroke-width="36" stroke-dasharray="${fill*100} 200" opacity=".85"/>`;
  if(T.flow>0) for(let i=0;i<5;i++){ s+=`<path d="${TRAP}" pathLength="100" fill="none" stroke="${BL}" stroke-width="7" stroke-linecap="round" stroke-dasharray="4 96" stroke-dashoffset="${-((f*3*T.flow+i*20)%100)}" opacity="${T.flow}"/>`; }
  s+=`<clipPath id="bw"><path d="${bowl}"/></clipPath><path d="${bowl}" fill="#e9eefc"/>`;
  const L=T.lvl; let wave=''; for(let x=290;x<=580;x+=10) wave+=` L${x} ${L+Math.sin(x/16+f/3)*(2+4*(T.flow||0))}`;
  s+=`<g clip-path="url(#bw)"><path d="M290 ${L}${wave} V700 H290 Z" fill="${W}" opacity=".7"/></g>`;
  s+=`<path d="${bowl}" fill="none" stroke="${N}" stroke-width="8" stroke-linejoin="round"/>`;
  // seat
  s+=`<rect x="290" y="432" width="290" height="26" rx="13" fill="${IV}" stroke="${N}" stroke-width="10"/>`;
  // rim wave from tank
  if(T.wave>0) for(let i=0;i<4;i++){const o=((f*7+i*25)%100)/100; s+=`<circle cx="${560-o*160}" cy="${462+o*60}" r="7" fill="${BL}" opacity="${T.wave*(1-o)}"/>`;}
  // the blob (cartoon poop): position along trap or in bowl
  if(T.blob!==undefined && T.blob>=0){
    let x,y; if(T.blob<0.08){x=430;y=Math.min(L+30,590);} else {const p=document.createElementNS('http://www.w3.org/2000/svg','path');p.setAttribute('d',TRAP);const len=p.getTotalLength();const q=p.getPointAtLength(len*Math.min(1,(T.blob-0.08)/0.92));x=q.x;y=q.y;}
    s+=`<g transform="translate(${x} ${y}) rotate(${Math.sin(f/3)*10})"><path d="M -18 10 Q -20 -2 -8 -4 Q -10 -14 0 -16 Q 10 -14 8 -4 Q 20 -2 18 10 Z" fill="#8a5a2b" stroke="${N}" stroke-width="4" stroke-linejoin="round"/><circle cx="-5" cy="2" r="2.5" fill="${N}"/><circle cx="5" cy="2" r="2.5" fill="${N}"/></g>`;
  }
  // gurgle bubbles
  if(T.gurgle>0) for(let i=0;i<6;i++){const o=((f*4+i*17)%100)/100; s+=`<circle cx="${400+Math.sin(i*2+f/4)*25}" cy="${600-o*120}" r="${5+i%3*3}" fill="none" stroke="${BL}" stroke-width="4" opacity="${T.gurgle*(1-o)}"/>`;}
  const anchors={hump:{x:268,y:518},trap:{x:318,y:600},bowl:{x:470,y:Math.min(L+20,580)},tank:{x:225,y:300},drain:{x:226,y:690}};
  return {svg:s,anchors};
}
window.PROPS={labelY:225,draw,grip:()=>({x:0,y:0})};
})();
