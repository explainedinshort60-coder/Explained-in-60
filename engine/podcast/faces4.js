/* Explained in 60 character faces v4: rebuilt as layered vectors from the latest Blue/Orange expression sheets
   (ATM: measured from 01_Latest_Design_References, normalised to one canonical head per host).
   Local origin = head centre. Groups: head-base, accent, cheeks, brows, eyes, mouth. */
(function (g) {
  const N = '#071747', IV = '#fdfbf3', PINK = '#fcc4b6', TONGUE = '#f07f8f', COB = '#2465ff', ORA = '#ff922b';
  const P = (d, w = 6.5, c = N) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const F = (d, c = N) => `<path d="${d}" fill="${c}"/>`;
  const E = (x, y, rx, ry, c = N) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${c}"/>`;
  const HEAD = {
    blue: `<rect x="-115" y="-104" width="230" height="208" rx="64" fill="${IV}" stroke="${N}" stroke-width="8.5"/>`,
    orange: `<circle cx="0" cy="0" r="112" fill="${IV}" stroke="${N}" stroke-width="8.5"/>`,
  };
  const ACCENT = {
    blue: P('M 50 -104 L 92 -80', 17, COB),
    orange: P('M -81 -95 L -66 -70', 13, ORA) + P('M -57 -104 L -42 -79', 13, ORA),
  };
  const CHEEKS = E(-72, 37, 17, 8.5, PINK) + E(72, 37, 17, 8.5, PINK);
  const oval = (x, y, ry = 16, rx = 8) => E(x, y, rx, ry);
  const lid = (x0, x1, y, px) => P(`M ${x0} ${y} L ${x1} ${y}`, 6.5) + F(`M ${px - 9} ${y} A 9 8 0 0 0 ${px + 9} ${y} Z`);
  const smile = (x0, x1, y, d) => P(`M ${x0} ${y} Q ${(x0 + x1) / 2} ${y + d} ${x1} ${y}`);
  const dMouth = (x0, x1, y, h, tilt = 0) => {  // open smile with tongue
    const mx = (x0 + x1) / 2;
    return `<g>${F(`M ${x0} ${y} Q ${mx} ${y + 4 + tilt} ${x1} ${y - tilt} Q ${x1 - 2} ${y + h} ${mx} ${y + h} Q ${x0 + 2} ${y + h} ${x0} ${y} Z`)}` +
      `${F(`M ${mx - (x1 - x0) * 0.28} ${y + h * 0.78} Q ${mx} ${y + h * 0.42} ${mx + (x1 - x0) * 0.28} ${y + h * 0.78} Q ${mx} ${y + h * 0.98} ${mx - (x1 - x0) * 0.28} ${y + h * 0.78} Z`, TONGUE)}</g>`;
  };
  // 12 sheet expressions
  const X = {
    neutral:   { eyes: oval(-38, -4) + oval(38, -4), mouth: smile(-27, 29, 40, 17) },
    curious:   { brows: P('M 18 -42 Q 38 -58 58 -42'), eyes: oval(-37, -4) + oval(35, -4), mouth: dMouth(-29, 22, 41, 19, 2) },
    confused:  { brows: P('M -64 -30 Q -60 -48 -40 -46') + P('M 24 -30 Q 42 -34 56 -21'), eyes: oval(-38, 2, 14, 7) + oval(31, 2, 14, 7), mouth: P('M -10 60 Q -2 46 10 48 Q 18 49 24 44') },
    'side-eye':{ eyes: lid(-64, -24, -5, -33) + lid(26, 66, -5, 56) + P('M 66 -5 L 72 -9', 5), mouth: P('M -18 44 L 17 44') },
    smug:      { brows: P('M 30 -32 Q 44 -44 60 -42'), eyes: lid(-62, -21, -8, -30) + lid(18, 60, -8, 50), mouth: smile(-25, 27, 41, 15) },
    'fake-innocent': { brows: P('M -55 -40 Q -38 -54 -24 -42') + P('M 24 -42 Q 38 -54 55 -40'), eyes: oval(-37, -8, 18, 8.5) + oval(37, -8, 18, 8.5),
                 mouth: P('M -6 42 Q 4 42 3 48 Q 2 52 -4 52 Q 3 53 3 58 Q 3 64 -6 63', 5.5) },
    'holding-laugh': { eyes: P('M -62 -14 L -38 -4 L -62 6') + P('M 62 -14 L 38 -4 L 62 6'), mouth: smile(-22, 22, 36, 14) },
    laugh:     { eyes: P('M -60 -6 Q -45 -24 -30 -6') + P('M 30 -6 Q 45 -24 60 -6'), mouth: dMouth(-45, 45, 24, 48) },
    shock:     { brows: P('M -55 -48 Q -40 -60 -24 -50') + P('M 24 -50 Q 40 -60 55 -48'),
                 eyes: `<ellipse cx="-37" cy="0" rx="15" ry="20" fill="none" stroke="${N}" stroke-width="5.5"/>` + oval(-37, 0, 10, 6) +
                       `<ellipse cx="35" cy="0" rx="15" ry="20" fill="none" stroke="${N}" stroke-width="5.5"/>` + oval(35, 0, 10, 6),
                 mouth: E(-2, 52, 10, 14) },
    'mock-offended': { brows: P('M -55 -33 L -24 -21') + P('M 24 -21 L 53 -33'), eyes: oval(-37, 4, 15) + oval(35, 4, 15), mouth: P('M -12 50 Q 0 32 12 50') },
    done:      { eyes: lid(-66, -20, -4, -42) + lid(20, 70, -4, 40), mouth: P('M -18 44 L 14 44') },
    wink:      { eyes: P('M -62 2 Q -49 -14 -35 2') + oval(39, -4), mouth: smile(-29, 29, 38, 18) },
  };
  // the comedy cue sheet's thought IDs -> nearest sheet expression (cute-first)
  const MAP = { 'wait-WHAT': 'shock', 'please-no': 'shock', 'soul-left-body': 'shock', 'internal-scream': 'shock', 'side-eye': 'side-eye',
    'smug-expert': 'smug', 'confidently-wrong': 'smug', 'evil-plan': 'smug', 'completely-done': 'done', 'awkward-silence': 'done',
    disgusted: 'confused', 'brain-buffering': 'confused', 'big-brain-fail': 'confused', 'fake-innocent': 'fake-innocent',
    'holding-laugh': 'holding-laugh', 'ugly-laugh': 'laugh', 'crying-laugh': 'laugh', 'no-regrets': 'wink', meltdown: 'mock-offended', neutral: 'neutral' };
  // speech mouths in the new style (centre around y 45)
  const o = (rx, ry, y = 46) => E(0, y, rx, ry);
  const open = (w, h) => dMouth(-w / 2, w / 2, 46 - h * 0.35, h);
  const SPEECH = {
    MBP: P('M -15 46 Q 0 49 15 46'), rest: P('M -14 45 Q 0 50 14 45'),
    AA: open(44, 26), AI: open(42, 24), AH: open(38, 20), AE: open(44, 20),
    EH: open(42, 15), E: open(44, 13), IH: open(40, 11), IY: open(42, 9),
    AO: o(15, 15), O: o(14, 15), OW: o(13, 15), ER: o(13, 12), R: o(12, 11),
    UW: o(9, 10), U: o(9, 10), UH: o(11, 11), WQ: o(8, 9),
    FV: F('M -16 42 Q 0 40 16 42 Q 14 54 0 54 Q -14 54 -16 42 Z') + `<rect x="-11" y="41" width="22" height="5" rx="2" fill="#fff"/>`,
    TH: open(32, 16) + E(0, 44, 7, 5, TONGUE), L: open(32, 16) + E(0, 40, 6, 4, TONGUE),
    TDNSZ: open(34, 11), CHSHJ: o(14, 10),
    laugh: dMouth(-45, 45, 24, 48),
  };
  function head(host, expr, mouth, mouthScaleY, blink, gaze) {
    const key = X[expr] ? expr : (MAP[expr] || 'neutral'); const f = X[key];
    let eyes = f.eyes;
    if (blink) eyes = P('M -52 -4 L -24 -4') + P('M 24 -4 L 52 -4');
    let m = f.mouth;
    if (mouth) { const s = SPEECH[mouth] || SPEECH.AH; m = `<g transform="translate(0 46) scale(1 ${mouthScaleY || 1}) translate(0 -46)">${s}</g>`; }
    return `<g id="head"><g id="head-base">${HEAD[host]}</g><g id="accent">${ACCENT[host]}</g><g id="cheeks">${CHEEKS}</g>` +
      `<g id="brows">${f.brows || ''}</g><g id="eyes" transform="translate(${blink ? 0 : (gaze || 0)} 0)">${eyes}</g><g id="mouth">${m}</g></g>`;
  }
  g.Faces4 = { head, X, MAP, SPEECH };
})(typeof module !== 'undefined' ? module.exports : window);
