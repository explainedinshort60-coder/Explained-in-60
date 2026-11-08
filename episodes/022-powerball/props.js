// 022 powerball props (Where Your Money Goes). Flat money diagrams, scenes along x, centered near world y 400:
//  CK x 600   hook: a giant novelty check "$847,000,000" with confetti (Blue's myth); later it droops: VIBE
//  AN x 2600  annuity: 30 bars, NOW then one a year for 29 years, each about 5% bigger
//  CA x 4600  cash option: the prize pot holds $363.1M today; the rest of the check is a dotted ghost
//  GR x 6600  invested 29 years, the pot grows into the $847M ad number
//  TX x 8600  taxes: a 100% bar, 24% sliced off by the IRS up front, more at tax time (top rate 37%)
//  OD x 10600 odds: a wall of tickets, 1 gold one: 1 in 292,201,338
// Contract: window.PROPS = {draw(T,f)->{svg, anchors}, grip(T)->{x,y}, labelY}
const MON='#3bb273',MOND='#1f7a4a',GOLD='#ffcf3d',GOLDD='#c99700',RED2='#e8433a',PAPER='#fffdf4',CHK='#e9f6ec';
const F3='font-family="DejaVu Sans, sans-serif"';
function cl3(v,a,b){return Math.max(a,Math.min(b,v));}
function lp(a,b,u){return a+(b-a)*u;}
function tx(x,y,s,size,fill,extra){return `<text x="${x}" y="${y}" font-size="${size}" font-weight="900" fill="${fill||NAVY}" text-anchor="middle" stroke="#fdfcf1" stroke-width="${size/5}" paint-order="stroke" ${F3} ${extra||''}>${s}</text>`;}
function money(n){return '$'+Math.round(n).toLocaleString('en-US');}
function bill(x,y,w,h,o){ // flat dollar bill
  return `<g opacity="${o==null?1:o}"><rect x="${x-w/2}" y="${y-h/2}" width="${w}" height="${h}" rx="${h*0.12}" fill="${MON}" stroke="${NAVY}" stroke-width="5"/>`+
    `<rect x="${x-w/2+10}" y="${y-h/2+8}" width="${w-20}" height="${h-16}" rx="${h*0.08}" fill="none" stroke="${MOND}" stroke-width="3"/>`+
    `<circle cx="${x}" cy="${y}" r="${h*0.3}" fill="#bfe8c9" stroke="${MOND}" stroke-width="3"/><text x="${x}" y="${y+h*0.13}" font-size="${h*0.38}" font-weight="900" fill="${MOND}" text-anchor="middle" ${F3}>$</text></g>`;
}
function stack(x,base,w,n,o){let s='';for(let i=0;i<n;i++)s+=bill(x+((i%2)?6:-6),base-i*22,w,64,o);return s;}
function check(cx,cy,k,amt,droop,o){ // giant novelty check, droop 0..1 bends it down at the ends
  const w=460*k,h=220*k,d=droop*90*k;
  return `<g opacity="${o==null?1:o}"><path d="M${cx-w} ${cy-h+d} Q${cx} ${cy-h-d*0.2} ${cx+w} ${cy-h+d} L${cx+w} ${cy+h+d} Q${cx} ${cy+h-d*0.2} ${cx-w} ${cy+h+d} Z" fill="${CHK}" stroke="${NAVY}" stroke-width="9" stroke-linejoin="round"/>`+
    `<path d="M${cx-w+30*k} ${cy-h+60*k+d*0.7} Q${cx} ${cy-h+60*k-d*0.2} ${cx+w-30*k} ${cy-h+60*k+d*0.7}" stroke="${MON}" stroke-width="${14*k}" fill="none"/>`+
    `<text x="${cx-w+40*k}" y="${cy-h+130*k+d*0.5}" font-size="${40*k}" font-weight="900" fill="${NAVY}" ${F3}>PAY TO: THE WINNER</text>`+
    `<rect x="${cx-w+40*k}" y="${cy-30*k+d*0.3}" width="${w*2-80*k}" height="${120*k}" rx="${16*k}" fill="${PAPER}" stroke="${NAVY}" stroke-width="6"/>`+
    `<text x="${cx}" y="${cy+58*k+d*0.3}" font-size="${92*k}" font-weight="900" fill="${MOND}" text-anchor="middle" ${F3}>${amt}</text>`+
    `<text x="${cx-w+40*k}" y="${cy+h-30*k+d*0.6}" font-size="${34*k}" font-weight="900" fill="${NAVY}" ${F3}>JACKPOT</text>`+
    `<path d="M${cx+60*k} ${cy+h-40*k+d*0.6} q40 -30 80 0 t80 0 t80 0" stroke="${NAVY}" stroke-width="5" fill="none"/></g>`;
}
function confetti(cx,cy,f,o){let s='';const C=[GOLD,BLUE,RED2,MON];
  for(let i=0;i<18;i++){const a=i*2.4,r=200+((i*53)%120),y=cy-260+((f*6+i*47)%560);
    s+=`<rect x="${cx+Math.cos(a)*r}" y="${y}" width="22" height="12" rx="3" fill="${C[i%4]}" transform="rotate(${(f*7+i*40)%360} ${cx+Math.cos(a)*r} ${y})" opacity="${o}"/>`;}
  return s;}
function bg(x0,col){return `<rect x="${x0-700}" y="-1400" width="1400" height="2800" fill="${col}"/>`;}
// ---------------- hook: the giant check ----------------
function sCK(T,f,A){
  let s=bg(600,'#fff4e0');
  const dr=T.droop||0;
  s+=confetti(600,420,f,1-dr);
  s+=`<ellipse cx="600" cy="700" rx="300" ry="24" fill="${NAVY}" opacity=".12"/>`;
  s+=check(600,430,0.62,'$847,000,000',dr);
  if(dr>0.3)s+=`<g transform="rotate(-12 600 300)" opacity="${cl3((dr-0.3)*3,0,1)}"><rect x="460" y="300" width="280" height="100" rx="18" fill="none" stroke="${BLUE}" stroke-width="11"/>`+tx(600,382,'VIBE',80,BLUE)+`</g>`;
  A.amount={x:600,y:440};A.check={x:600,y:300};
  return s;
}
// ---------------- annuity: 30 payments ----------------
function sAN(T,f,A){
  const X=2600;let s=bg(X,'#f1f5ff');
  const base=640,x0=X-290,step=19.5,bw=14,b=T.bars||0;
  s+=`<line x1="${x0-30}" y1="${base}" x2="${X+460}" y2="${base}" stroke="${NAVY}" stroke-width="8" stroke-linecap="round"/>`;
  for(let i=0;i<30;i++){const o=cl3(b*30-i,0,1);if(o<0.01)continue;
    const h=95*Math.pow(1.05,i)*o, x=x0+i*step;
    s+=`<rect x="${x}" y="${base-h}" width="${bw}" height="${h}" rx="5" fill="${i===0?GOLD:MON}" stroke="${NAVY}" stroke-width="4"/>`;}
  const nw=T.now||0;
  if(nw>0.01){s+=tx(x0+20,base+60,'NOW',42,GOLDD,`opacity="${nw}"`);}
  if(b>0.96)s+=tx(x0+29*step-30,base+60,'YEAR 29',42,NAVY,`opacity="${cl3((b-0.96)*25,0,1)}"`);
  if(b>0.2)s+=tx(X,780,'30 PAYMENTS',70,NAVY,`opacity="${cl3(b*4-0.8,0,1)}"`)+tx(X,850,'OVER 29 YEARS',54,BLUE,`opacity="${cl3(b*4-0.8,0,1)}"`);
  const pc=T.pct||0;
  if(pc>0.01){const i=14,x=x0+i*step,h=95*Math.pow(1.05,i);
    s+=`<g opacity="${pc}"><path d="M${x-40} ${base-h-30} q50 -70 110 -20" stroke="${RED2}" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M${x+70} ${base-h-50} l4 34 l-32 -8" fill="${RED2}"/>`+tx(x-20,base-h-110,'+5% A YEAR',54,RED2)+`</g>`;}
  A.bars={x:X,y:base-200};A.first={x:x0+10,y:base-160};
  return s;
}
// ---------------- cash option: the pot today ----------------
function pot(x,y,k,fill){ // prize pot, a wide flat jar
  return `<path d="M${x-180*k} ${y-170*k} L${x+180*k} ${y-170*k} L${x+160*k} ${y+60*k} Q${x} ${y+110*k} ${x-160*k} ${y+60*k} Z" fill="#dfe7ff" stroke="${NAVY}" stroke-width="8" stroke-linejoin="round"/>`+
    `<rect x="${x-205*k}" y="${y-200*k}" width="${410*k}" height="40" rx="14" fill="${BLUE}" stroke="${NAVY}" stroke-width="6"/>`;
}
function sCA(T,f,A){
  const X=4600;let s=bg(X,'#fff4e0');
  const ca=T.cash||0, gh=T.ghost||0;
  // ghost check behind: the ad number, dotted
  if(gh>0.01)s+=`<g opacity="${0.9*gh}"><rect x="${X-280}" y="150" width="560" height="160" rx="20" fill="none" stroke="${NAVY}" stroke-width="6" stroke-dasharray="22 16"/>`+tx(X,262,'$847M',90,'#9aa3bd')+`</g>`+tx(X,375,'NEVER IN THE POT',50,RED2,`opacity="${gh}"`);
  s+=pot(X,690,1.1);
  const n=Math.round(7*ca);
  s+=stack(X,730,240,n,1);
  if(ca>0.5)s+=`<g opacity="${cl3((ca-0.5)*3,0,1)}"><rect x="${X-220}" y="800" width="440" height="100" rx="24" fill="${MON}" stroke="${NAVY}" stroke-width="7"/>`+`<text x="${X}" y="876" font-size="72" font-weight="900" fill="#fff" text-anchor="middle" ${F3}>$363.1M</text>`+`</g>`+tx(X,960,'CASH TODAY',50,MOND,`opacity="${cl3((ca-0.5)*3,0,1)}"`);
  A.pot={x:X,y:520};A.ghost={x:X,y:160};
  return s;
}
// ---------------- growth: invested 29 years ----------------
function sGR(T,f,A){
  const X=6600;let s=bg(X,'#f1f5ff');
  const g=T.grow||0, x0=X-280, x1=X+250, base=760, y0=base-150, y1=base-500;
  s+=`<line x1="${x0-20}" y1="${base}" x2="${x1+30}" y2="${base}" stroke="${NAVY}" stroke-width="8" stroke-linecap="round"/>`;
  // curve to g
  let d=`M${x0} ${y0}`;const N=40;for(let i=1;i<=N*g;i++){const u=i/N;d+=` L${lp(x0,x1,u)} ${lp(y0,y1,Math.pow(u,1.6))}`;}
  s+=`<path d="${d}" stroke="${MON}" stroke-width="16" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  const ux=lp(x0,x1,g),uy=lp(y0,y1,Math.pow(g,1.6));
  s+=`<circle cx="${ux}" cy="${uy}" r="22" fill="${GOLD}" stroke="${NAVY}" stroke-width="6"/>`;
  s+=tx(X,base+80,'INVESTED 29 YEARS',50,NAVY);
  const v=363.1+(847-363.1)*Math.pow(g,1.6);
  s+=tx(X-90,360,'$'+Math.round(v)+'M',96,g>0.97?RED2:MOND);
  if(g>0.97)s+=tx(X-40,450,'= THE AD NUMBER',60,RED2,`opacity="${cl3((g-0.97)*30,0,1)}"`);
  A.curve={x:ux,y:uy};A.start={x:x0,y:y0};
  return s;
}
// ---------------- taxes: 24% off the top ----------------
function sTX(T,f,A){
  const X=8600;let s=bg(X,'#fff4e0');
  const br=T.bar||0, cu=T.cut||0, tp=T.top||0;
  const x0=X-300,W=600,y=430,h=150, cw=W*0.24;
  if(br>0.01){
    s+=`<g opacity="${br}"><rect x="${x0+cw}" y="${y}" width="${W-cw}" height="${h}" rx="0" fill="${MON}" stroke="${NAVY}" stroke-width="8"/>`;
    // the 24% chunk slides up and away to the IRS box
    const dx=cu*0, dy=-cu*190, rot=-cu*8;
    s+=`<g transform="translate(${dx} ${dy}) rotate(${rot} ${x0+cw/2} ${y+h/2})"><rect x="${x0}" y="${y}" width="${cw}" height="${h}" fill="${cu>0.05?RED2:MON}" stroke="${NAVY}" stroke-width="8"/>`+
      `<text x="${x0+cw/2}" y="${y+h/2+24}" font-size="54" font-weight="900" fill="#fff" text-anchor="middle" ${F3}>24%</text></g>`;
    s+=`<text x="${x0+cw+(W-cw)/2}" y="${y+h/2+24}" font-size="64" font-weight="900" fill="#fff" text-anchor="middle" ${F3}>${cu>0.5?'76%':''}</text></g>`;
    if(cu<0.05)s+=`<text x="${X}" y="${y+h/2+24}" font-size="60" font-weight="900" fill="#fff" text-anchor="middle" ${F3} opacity="${br}">YOUR PRIZE</text>`;
  }
  if(cu>0.5)s+=tx(X,y-250,'IRS WITHHOLDS',50,RED2,`opacity="${cl3((cu-0.5)*3,0,1)}"`);
  if(tp>0.01){const c2=W*0.37;
    s+=`<g opacity="${tp}"><path d="M${x0} ${y+h+40} L${x0} ${y+h+70} L${x0+c2} ${y+h+70} L${x0+c2} ${y+h+40}" stroke="${NAVY}" stroke-width="8" fill="none" stroke-linejoin="round"/>`+
      tx(X,y+h+150,'TAX TIME: UP TO 37%',50,NAVY)+`</g>`;}
  A.bar={x:X,y:y+h/2};A.chunk={x:x0+cw/2,y:y-150};
  return s;
}
// ---------------- odds: one gold ticket ----------------
function sOD(T,f,A){
  const X=10600;let s=bg(X,'#f1f5ff');
  const gr=T.grid||0, gd=T.gold||0;
  const cols=12,rows=13,cw=46,ch=38,x0=X-cols*cw/2,y0=230;
  const n=Math.round(cols*rows*gr);
  for(let i=0;i<n;i++){const c=i%cols,r=Math.floor(i/cols),x=x0+c*cw,y=y0+r*ch;
    const g=(c===8&&r===8);
    s+=`<rect x="${x+4}" y="${y+4}" width="${cw-10}" height="${ch-10}" rx="5" fill="${g&&gd>0.01?GOLD:'#ffffff'}" stroke="${g&&gd>0.01?GOLDD:'#9aa3bd'}" stroke-width="${g&&gd>0.01?5:3}"/>`;}
  if(gd>0.01){const x=x0+8*cw+cw/2-3,y=y0+8*ch+ch/2-3;s+=`<circle cx="${x}" cy="${y}" r="${40+30*gd}" fill="none" stroke="${GOLD}" stroke-width="8" opacity="${gd}"/>`;}
  if(gr>0.5)s+=tx(X,y0+rows*ch+100,'1 IN 292,201,338',58,NAVY,`opacity="${cl3((gr-0.5)*3,0,1)}"`);
  s+=tx(X,y0-36,'ONLY ONE WINS',44,'#5d6685',`opacity="${cl3(gr*3,0,1)}"`);
  A.gold={x:x0+8*cw+cw/2,y:y0+8*ch+ch/2};A.grid={x:X,y:y0+rows*ch/2};
  return s;
}
window.PROPS={
  labelY:150,
  draw(T,f){const A={};let s='';
    const fn={CK:sCK,AN:sAN,CA:sCA,GR:sGR,TX:sTX,OD:sOD};
    s+=fn[T.sc||'CK'](T,f,A);
    return {svg:s,anchors:A};
  },
  grip(T){return {x:600,y:400};}
};
