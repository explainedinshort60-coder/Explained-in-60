/* Explained in 60 acting runtime v3 (built on the comedy pack's animation.js).
   Everything is driven explicitly from the cue timeline: no automatic sine bobbing or endless waving.
   o = {host, expression, mouth, mouthScaleY, gesture, gw, tremble, tilt, dy, squash, blink, gaze} */
(function (g) {
  const N = '#071747';
  const path = (d, w = 12) => `<path d="${d}" fill="none" stroke="${N}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const lerp = (a, b, t) => a + (b - a) * t;
  // [controlX, controlY, endX, endY] per arm. Rest = hands down by the body.
  const REST = { L: [-103, 184, -102, 233], R: [103, 184, 102, 233] };
  const POSE = {
    talk:     { L: [-103, 184, -102, 233], R: [93, 186, 137, 132] },
    shrug:    { L: [-115, 200, -149, 126], R: [115, 200, 149, 126] },
    panic:    { L: [-151, 100, -146, -5],  R: [151, 100, 146, -5] },
    facepalm: { L: [-103, 184, -102, 233], R: [160, 18, 24, -50] },
    point:    { L: [-103, 184, -102, 233], R: [120, 120, 190, 70] },
  };
  function arm(side, gest, w, tr) {
    const r = REST[side], p = (POSE[gest] || POSE.talk)[side];
    const v = r.map((x, i) => lerp(x, p[i], w));
    if (tr) { v[3] += tr * (side === 'L' ? 1 : -1); }
    return v;
  }
  function frame(data, o) {
    const host = o.host, c = host === 'blue' ? '#2465ff' : '#ff922b';
    let head = data.faces[host][o.expression];
    if (o.mouth) head = head.replace(/<g id="mouth">[\s\S]*?<\/g><\/g>/,
      `<g id="mouth"><g transform="translate(0 45) scale(1 ${o.mouthScaleY || 1})">${data.mouths[o.mouth]}</g></g>`);
    if (host === 'orange') head = head.replace('</g><g id="accent">', '</g><g id="blush"><ellipse cx="-68" cy="24" rx="17" ry="9" fill="#ffc2b4"/><ellipse cx="68" cy="24" rx="17" ry="9" fill="#ffc2b4"/></g><g id="accent">');
    if (o.blink) head = head.replace(/<g id="eyes">[\s\S]*?<\/g>/, `<g id="eyes">${path('M -56 -16 L -22 -16 M 22 -16 L 56 -16', 7)}</g>`);
    else if (o.gaze) head = head.replace('<g id="eyes">', `<g id="eyes" transform="translate(${o.gaze} 0)">`);
    const w = o.gw || 0, gest = o.gesture || 'talk';
    const L = arm('L', gest, w, o.tremble || 0), R = arm('R', gest, w, o.tremble || 0);
    const hand = (x, y) => `<ellipse cx="${x}" cy="${y}" rx="15" ry="12" fill="${N}"/>` + path(`M ${x} ${y} q 8 -24 15 -17`, 9);
    const sq = o.squash || 0; // + = squash down, - = stretch up
    const body = path('M -33 260 Q -43 314 -68 350 M 33 260 Q 43 314 68 350') + path('M -68 350 L -96 350 M 68 350 L 96 350', 22) +
      `<g id="arm-back">${path(`M -55 130 Q ${L[0]} ${L[1]} ${L[2]} ${L[3]}`)}${hand(L[2], L[3])}</g>` +
      `<path id="torso" d="M -52 98 Q -75 175 -59 260 L 59 260 Q 75 175 52 98 Z" fill="${c}" stroke="${N}" stroke-width="8" stroke-linejoin="round"/>`;
    const front = `<g id="arm-front">${path(`M 55 130 Q ${R[0]} ${R[1]} ${R[2]} ${R[3]}`)}${hand(R[2], R[3])}</g>`;
    return `<g transform="translate(0 ${o.dy || 0})">${body}<g transform="translate(0 110) scale(${1 + sq * 0.5} ${1 - sq}) translate(0 -110)"><g transform="rotate(${o.tilt || 0} 0 100)">${head}</g></g>${front}</g>`;
  }
  g.Act3 = { frame };
})(window);
