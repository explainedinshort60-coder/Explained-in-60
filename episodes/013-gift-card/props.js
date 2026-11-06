// Episode 013 props: how scammers drain a gift card before you buy it (flat diagram, no how-to detail).
// Scenes in one world, the camera cuts between them:
//  H (x ~560):   hook: a gift card at the register, balance $0.00, dollar bills flying out of it
//  R (x ~3000):  a store rack of generic gift cards on hooks; a navy gloved hand lifts one off and later hangs it back
//  K (x ~5000):  the card back up close: barcode, number, PIN sticker; the sticker peels, a notepad copies, the sticker goes back
//  P (x ~7000):  register on the left activates the card (+$50), a dotted line runs to a shadowy laptop; the money runs away, $0
//  S (x ~9000):  barcode swap: a fake barcode slides over yours; at the register the $50 arrow bends off to THEIR card
//  C (x ~11000): the check: magnifier over the card back with three ticks; then receipt + phone photo
//  X (x ~13000): a phone text "PAY ME IN GIFT CARDS" with a red SCAM stamp
// T: fly 0..1 (bills fly out, hook), grab 0..1 (hand lifts the card off the rack), peel 0..1 (PIN sticker lifted),
//    copy 0..1 (notepad copies), live 0..1 (card activated), drain 0..1 (money runs to the laptop), swap 0..1 (fake barcode slides on),
//    divert 0..1 (money goes to their card), checks 0..3, receipt 0..1, scam 0..1
const F='font-family="DejaVu Sans, sans-serif"', RED='#e8273a', GREEN='#1fae5b', GOLD='#ffd84a', SHADOW='#2a2f4a';
const CARDC=['#2465ff','#ff8a3d','#1fae5b','#e8273a','#8a5cf6','#ffd84a'];
function rnd(i){const x=Math.sin(i*127.1+311.7)*43758.5453;return x-Math.floor(x);}
function cardFront(cx,cy,w,col,rot,label){ // generic gift card with a ribbon and a bow, no brand
  const h=w*0.63;
  let s=`<g transform="translate(${cx} ${cy}) rotate(${rot||0})">`;
  s+=`<rect x="${-w/2}" y="${-h/2}" width="${w}" height="${h}" rx="${w*0.06}" fill="${col}" stroke="${NAVY}" stroke-width="${Math.max(4,w*0.018)}"/>`;
  s+=`<rect x="${-w*0.22}" y="${-h/2}" width="${w*0.09}" height="${h}" fill="${IVORY}" opacity=".9"/>`;
  s+=`<rect x="${-w/2}" y="${-h*0.12}" width="${w}" height="${h*0.14}" fill="${IVORY}" opacity=".9"/>`;
  s+=`<ellipse cx="${-w*0.24}" cy="${-h*0.07}" rx="${w*0.08}" ry="${h*0.1}" fill="${IVORY}" stroke="${NAVY}" stroke-width="${Math.max(3,w*0.01)}" transform="rotate(-30 ${-w*0.24} ${-h*0.07})"/>`;
  s+=`<ellipse cx="${-w*0.13}" cy="${-h*0.07}" rx="${w*0.08}" ry="${h*0.1}" fill="${IVORY}" stroke="${NAVY}" stroke-width="${Math.max(3,w*0.01)}" transform="rotate(30 ${-w*0.13} ${-h*0.07})"/>`;
  if(label)s+=`<text x="${w*0.18}" y="${h*0.36}" font-size="${w*0.09}" font-weight="900" fill="${IVORY}" text-anchor="middle" ${F}>${label}</text>`;
  return s+`</g>`;
}
function bill(x,y,r,o){return `<g transform="translate(${x} ${y}) rotate(${r})" opacity="${o}"><rect x="-58" y="-30" width="116" height="60" rx="8" fill="#8fd6a2" stroke="${NAVY}" stroke-width="5"/><circle r="17" fill="#c8f0d2" stroke="${NAVY}" stroke-width="4"/><text y="10" font-size="26" font-weight="900" fill="${NAVY}" text-anchor="middle" ${F}>$</text></g>`;}
function hook(T,f){
  let s=`<rect x="-2000" y="-2000" width="4200" height="4400" fill="#1b2347"/>`;
  s+=`<rect x="-2000" y="660" width="4200" height="1400" fill="#3a2f5c"/><line x1="-2000" y1="660" x2="2200" y2="660" stroke="${NAVY}" stroke-width="6"/>`;
  // register screen top
  s+=`<rect x="250" y="80" width="620" height="200" rx="22" fill="${NAVY}" stroke="#0a0f24" stroke-width="6"/><rect x="272" y="102" width="576" height="156" rx="12" fill="#0d1a3a"/>`;
  s+=`<text x="560" y="152" font-size="40" font-weight="800" fill="#9fb9ff" text-anchor="middle" ${F}>BALANCE</text>`;
  s+=`<text x="560" y="236" font-size="78" font-weight="900" fill="${RED}" text-anchor="middle" ${F}>$0.00</text>`;
  // the card, tilted, center
  s+=cardFront(540,470,640,BLUE,-6,'GIFT');
  // bills flying out to the right and up
  const fl=T.fly==null?1:T.fly;
  for(let i=0;i<6;i++){const u=((f*0.02+i/6)%1), x=620+u*380+rnd(i)*50, y=430-u*330+Math.sin(u*6+i)*30;
    s+=bill(x,y,-20+u*80+i*9,fl*Math.min(1,(1-u)*3));}
  return s;
}
function rack(T,f){
  let s=`<rect x="2300" y="-2000" width="1400" height="4400" fill="#d9dff2"/>`;
  s+=`<rect x="2540" y="20" width="920" height="820" rx="16" fill="#c9b48a" stroke="${NAVY}" stroke-width="7"/>`;
  for(let r=0;r<9;r++)for(let c=0;c<10;c++)s+=`<circle cx="${2590+c*92}" cy="${60+r*92}" r="7" fill="#9c8762"/>`;
  const g=T.grab||0;
  for(let r=0;r<3;r++)for(let c=0;c<3;c++){
    const x=2700+c*300, y=130+r*260, i=r*3+c;
    s+=`<line x1="${x}" y1="${y-60}" x2="${x}" y2="${y-20}" stroke="#6a6f80" stroke-width="8" stroke-linecap="round"/>`;
    if(i==4){const dy=-g*170, dx=g*40; s+=`<g transform="translate(${dx} ${dy})">`+cardFront(x,y+70,230,CARDC[i%6],g*8,'')+`</g>`;
      if(g>0.02){ // navy gloved hand (flat) holding the card from below-right
        s+=`<g transform="translate(${x+dx+120} ${y+70+dy+60})"><rect x="0" y="-26" width="420" height="70" rx="30" fill="${SHADOW}"/><circle cx="0" cy="0" r="50" fill="${SHADOW}"/><rect x="-60" y="-50" width="60" height="30" rx="14" fill="${SHADOW}"/></g>`;}
    } else s+=cardFront(x,y+70,230,CARDC[i%6],(rnd(i)-.5)*6,'');
  }
  return s;
}
function cardBack(cx,cy,w,T,f,opt){ // card back: stripe, barcode (yours or fake), number, PIN sticker
  opt=opt||{}; const h=w*0.63, x=cx-w/2, y=cy-h/2;
  let s=`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${w*0.05}" fill="${IVORY}" stroke="${NAVY}" stroke-width="7"/>`;
  s+=`<rect x="${x}" y="${y+h*0.1}" width="${w}" height="${h*0.14}" fill="${NAVY}"/>`;
  // barcode
  const bx=x+w*0.08, by=y+h*0.34, bw=w*0.5, bh=h*0.3;
  let bars=''; for(let i=0;i<34;i++){const ww=rnd(i+(opt.fake?50:0))>0.55?7:3; bars+=`<rect x="${bx+i*bw/34}" y="${by}" width="${ww}" height="${bh}" fill="${NAVY}"/>`;}
  s+=`<rect x="${bx-10}" y="${by-10}" width="${bw+20}" height="${bh+20}" fill="#ffffff"/>`+bars;
  s+=`<text x="${bx+bw/2}" y="${by+bh+40}" font-size="${w*0.05}" font-weight="700" fill="${NAVY}" text-anchor="middle" ${F}>6047 1234 5678 4821</text>`;
  // PIN area: printed PIN under a silver sticker that can peel
  const px=x+w*0.66, py=y+h*0.38, pw=w*0.27, ph=h*0.2;
  s+=`<rect x="${px}" y="${py}" width="${pw}" height="${ph}" rx="8" fill="#ffffff" stroke="${NAVY}" stroke-width="4"/>`;
  s+=`<text x="${px+pw/2}" y="${py+ph*0.7}" font-size="${w*0.06}" font-weight="900" fill="${NAVY}" text-anchor="middle" ${F}>7319</text>`;
  const p=opt.peel||0; // the sticker lifts like a flap from its left edge
  s+=`<g transform="translate(${px} ${py}) rotate(${-p*150}) "><rect x="0" y="-6" width="${pw+8}" height="${ph+12}" rx="10" fill="#b9c0d4" stroke="${NAVY}" stroke-width="5"/>`+
     `<line x1="12" y1="10" x2="${pw-10}" y2="${ph-6}" stroke="#e8ecf6" stroke-width="10" stroke-linecap="round"/></g>`;
  s+=`<text x="${px+pw/2}" y="${py+ph+44}" font-size="${w*0.045}" font-weight="900" fill="${NAVY}" text-anchor="middle" ${F}>PIN</text>`;
  // fake barcode sticker sliding on from the left
  const sw=opt.swap||0;
  if(sw>0.01){const fx=bx-10-(1-sw)*w*0.9;
    let fb=''; for(let i=0;i<34;i++){const ww=rnd(i+77)>0.5?8:3; fb+=`<rect x="${fx+10+i*bw/34}" y="${by}" width="${ww}" height="${bh}" fill="${NAVY}"/>`;}
    s+=`<g><rect x="${fx}" y="${by-14}" width="${bw+20}" height="${bh+28}" rx="6" fill="#fff4f4" stroke="${RED}" stroke-width="6" stroke-dasharray="14 8"/>${fb}</g>`;}
  return s;
}
function back(T,f){ // scene K
  let s=`<rect x="4300" y="-2000" width="1400" height="4400" fill="#0b1030"/>`;
  s+=cardBack(5000,330,820,T,f,{peel:T.peel||0});
  const c=T.copy||0;
  if(c>0.01){ // a notepad slides up and the numbers get copied
    const y=880-c*200;
    s+=`<g opacity="${Math.min(1,c*2)}"><rect x="4640" y="${y}" width="720" height="250" rx="16" fill="#fff6c8" stroke="${NAVY}" stroke-width="7"/>`;
    for(let k=0;k<3;k++)s+=`<line x1="4670" y1="${y+70+k*60}" x2="5330" y2="${y+70+k*60}" stroke="#9fb9ff" stroke-width="4"/>`;
    const txt='6047...4821   7319', n=Math.floor(txt.length*Math.min(1,c*1.4));
    s+=`<text x="4680" y="${y+120}" font-size="54" font-weight="900" fill="${NAVY}" ${F}>${txt.slice(0,n)}</text></g>`;}
  return s;
}
function laptop(x,y,lit){
  let s=`<path d="M${x-170} ${y+110} L${x+170} ${y+110} L${x+210} ${y+150} L${x-210} ${y+150} Z" fill="${SHADOW}" stroke="${NAVY}" stroke-width="6"/>`;
  s+=`<rect x="${x-160}" y="${y-100}" width="320" height="210" rx="14" fill="${SHADOW}" stroke="${NAVY}" stroke-width="6"/>`;
  s+=`<rect x="${x-140}" y="${y-80}" width="280" height="170" rx="8" fill="${lit?'#2a4a3a':'#151a30'}"/>`;
  // shadowy figure behind with two eyes
  s+=`<ellipse cx="${x}" cy="${y-200}" rx="120" ry="110" fill="${SHADOW}"/><circle cx="${x-38}" cy="${y-210}" r="12" fill="${GOLD}"/><circle cx="${x+38}" cy="${y-210}" r="12" fill="${GOLD}"/>`;
  return s;
}
function register(x,y,txt,col){
  let s=`<rect x="${x-190}" y="${y}" width="380" height="230" rx="20" fill="${IVORY}" stroke="${NAVY}" stroke-width="7"/>`;
  s+=`<rect x="${x-160}" y="${y+24}" width="320" height="96" rx="10" fill="${NAVY}"/>`;
  s+=`<text x="${x}" y="${y+90}" font-size="50" font-weight="900" fill="${col}" text-anchor="middle" ${F}>${txt}</text>`;
  for(let r=0;r<2;r++)for(let c=0;c<4;c++)s+=`<rect x="${x-150+c*78}" y="${y+138+r*44}" width="60" height="32" rx="6" fill="#c9d4f2" stroke="${NAVY}" stroke-width="4"/>`;
  return s;
}
function path2(T,f){ // scene P: register -> laptop
  let s=`<rect x="6300" y="-2000" width="1400" height="4400" fill="#e3e8f7"/>`;
  const lv=T.live||0, dr=T.drain||0;
  s+=register(6740,420,lv>0.5?(dr>0.9?'$0.00':'+$50'):'$50',lv>0.5?(dr>0.9?RED:GREEN):IVORY);
  s+=cardFront(6740,300,300,BLUE,-8,'GIFT');
  if(lv>0.5)s+=`<circle cx="6740" cy="300" r="${190+12*Math.sin(f/3)}" fill="${GREEN}" opacity=".15"/>`;
  // dotted line to the laptop
  s+=`<path d="M6900 300 C7050 120 7150 120 7260 220" fill="none" stroke="${NAVY}" stroke-width="7" stroke-dasharray="4 18" stroke-linecap="round" opacity="${0.3+0.7*lv}"/>`;
  s+=laptop(7280,420,dr>0.5);
  if(dr>0.01&&dr<0.999){for(let k=0;k<3;k++){const u=Math.min(1,Math.max(0,dr*1.4-k*0.2)); const t=u;
      const X=(1-t)**3*6900+3*(1-t)**2*t*7050+3*(1-t)*t*t*7150+t**3*7260, Y=(1-t)**3*300+3*(1-t)**2*t*120+3*(1-t)*t*t*120+t**3*220;
      if(u>0&&u<1)s+=bill(X,Y,-10+u*40,1);}}
  return s;
}
function swap(T,f){ // scene S
  let s=`<rect x="8300" y="-2000" width="1400" height="4400" fill="#0b1030"/>`;
  const sw=T.swap||0, dv=T.divert||0;
  s+=cardBack(9000,250,700,T,f,{swap:sw});
  // money arrow from the register: meant for YOUR card, bends off to THEIR card
  s+=`<g transform="translate(0 0)">`;
  s+=`<rect x="8640" y="600" width="230" height="90" rx="20" fill="${IVORY}" stroke="${NAVY}" stroke-width="6"/><text x="8755" y="660" font-size="44" font-weight="900" fill="${GREEN}" text-anchor="middle" ${F}>$50</text>`;
  if(dv>0.01){const L=Math.min(1,dv*1.2);
    s+=`<path d="M8870 645 C8990 645 9080 700 ${8870+L*300} ${645+L*120}" fill="none" stroke="${RED}" stroke-width="14" stroke-linecap="round" opacity="${L}"/>`;
    s+=cardFront(9260,800,260,SHADOW,6,'');
    s+=`<rect x="9150" y="900" width="220" height="60" rx="30" fill="${RED}" opacity="${L}"/><text x="9260" y="942" font-size="34" font-weight="900" fill="${IVORY}" text-anchor="middle" opacity="${L}" ${F}>THEIRS</text>`;}
  return s+`</g>`;
}
function check(T,f){ // scene C
  let s=`<rect x="10300" y="-2000" width="1400" height="4400" fill="#e9eefc"/>`;
  const ck=T.checks||0, rc=T.receipt||0;
  if(rc<0.5){
    s+=cardBack(11000,260,720,T,f,{});
    s+=`<g><circle cx="11250" cy="260" r="150" fill="#cfe0ff" opacity=".35" stroke="${NAVY}" stroke-width="12"/><rect x="11340" y="370" width="50" height="190" rx="22" fill="${NAVY}" transform="rotate(-40 11365 465)"/></g>`;
    const items=['STICKER ON','PIN COVERED','NO SCRATCHES'];
    for(let k=0;k<3;k++){const o=Math.min(1,Math.max(0,(ck-k)*3)); if(o<=0)continue; const y=600+k*92;
      s+=`<g opacity="${o}"><circle cx="10640" cy="${y}" r="34" fill="${GREEN}" stroke="${NAVY}" stroke-width="5"/><path d="M10622 ${y} L10636 ${y+15} L10660 ${y-14}" fill="none" stroke="${IVORY}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`+
        `<text x="10696" y="${y+16}" font-size="46" font-weight="900" fill="${NAVY}" ${F}>${items[k]}</text></g>`;}
  } else {
    // receipt and a phone taking a photo of the card
    s+=`<path d="M10620 60 L10900 60 L10900 760 L10880 740 L10860 760 L10840 740 L10820 760 L10800 740 L10780 760 L10760 740 L10740 760 L10720 740 L10700 760 L10680 740 L10660 760 L10640 740 L10620 760 Z" fill="#ffffff" stroke="${NAVY}" stroke-width="6"/>`;
    s+=`<text x="10760" y="130" font-size="40" font-weight="900" fill="${NAVY}" text-anchor="middle" ${F}>RECEIPT</text>`;
    for(let k=0;k<6;k++)s+=`<rect x="10650" y="${170+k*70}" width="${120+rnd(k)*100}" height="18" rx="8" fill="#b9c0d4"/>`;
    s+=`<text x="10760" y="660" font-size="40" font-weight="900" fill="${NAVY}" text-anchor="middle" ${F}>$50.00</text>`;
    s+=`<rect x="10990" y="80" width="400" height="700" rx="50" fill="${NAVY}"/><rect x="11014" y="130" width="352" height="590" rx="20" fill="#0d1a3a"/>`;
    s+=cardFront(11190,425,300,BLUE,0,'GIFT');
    const fl=Math.max(0,1-Math.abs(((f%40)-4))/6);
    s+=`<rect x="11014" y="130" width="352" height="590" rx="20" fill="#ffffff" opacity="${0.8*fl}"/>`;
    s+=`<circle cx="11190" cy="752" r="16" fill="#3a4a7a"/>`;
  }
  return s;
}
function scam(T,f){ // scene X
  let s=`<rect x="12300" y="-2000" width="1400" height="4400" fill="#1b2347"/>`;
  const sc=T.scam||0;
  s+=`<rect x="12780" y="20" width="440" height="820" rx="56" fill="${NAVY}" stroke="#0a0f24" stroke-width="6"/><rect x="12806" y="76" width="388" height="700" rx="22" fill="#eef2fb"/>`;
  s+=`<rect x="12830" y="150" width="330" height="200" rx="28" fill="#ffffff" stroke="#9fb9ff" stroke-width="5"/>`;
  s+=`<text x="12995" y="215" font-size="38" font-weight="900" fill="${NAVY}" text-anchor="middle" ${F}>PAY ME IN</text><text x="12995" y="265" font-size="38" font-weight="900" fill="${NAVY}" text-anchor="middle" ${F}>GIFT CARDS.</text><text x="12995" y="315" font-size="38" font-weight="900" fill="${NAVY}" text-anchor="middle" ${F}>NOW.</text>`;
  s+=cardFront(12995,520,260,CARDC[1],-6,'');
  if(sc>0.01){const k=1+0.6*(1-Math.min(1,sc*1.5));
    s+=`<g transform="translate(13000 430) rotate(-14) scale(${k})" opacity="${Math.min(1,sc*2)}"><rect x="-230" y="-80" width="460" height="160" rx="22" fill="none" stroke="${RED}" stroke-width="16"/><text y="44" font-size="120" font-weight="900" fill="${RED}" text-anchor="middle" ${F}>SCAM</text></g>`;}
  return s;
}
function anchors(T){
  return {card:{x:560,y:470},balance:{x:560,y:200},rack:{x:3000,y:400},grab:{x:3000,y:300},
    sticker:{x:5250,y:250},pin:{x:5250,y:250},number:{x:4880,y:420},notepad:{x:5000,y:760},
    register:{x:6740,y:470},cardp:{x:6740,y:300},laptop:{x:7280,y:420},
    barcode:{x:8880,y:240},theirs:{x:9260,y:800},
    check:{x:10800,y:690},magnifier:{x:11250,y:260},receipt:{x:10760,y:400},photo:{x:11190,y:425},phone:{x:13000,y:250},stamp:{x:13000,y:430}};
}
window.PROPS={labelY:40,
  draw(T,f){return {svg:hook(T,f)+rack(T,f)+back(T,f)+path2(T,f)+swap(T,f)+check(T,f)+scam(T,f),anchors:anchors(T)};},
  grip(T){return {x:560,y:470};}};
