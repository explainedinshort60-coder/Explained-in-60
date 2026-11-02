"""Explained in 60 podcast renderer v3: acting cue sheet per the Expression & Comedy Acting Rules v1.1.
Thought-driven expression changes on trigger words, listener reactions with register delay, one gesture per
thought with anticipation/hold/settle, word-timed visemes, held mouths in pauses, laugh mouths only on real
laughter, cuts to listeners, push-ins only on punchlines, seamless loop."""
import json, math, os, sys, asyncio, subprocess
sys.path.insert(0, '/home/claude/podcast/ep_flush'); import assets as A
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
FPS = 24; PACK = '/home/claude/comedypack/comedy_assets'; R = '/home/claude/explained-in-60'
TL = json.load(open(f'{HERE}/timeline.json')); L = TL['lines']; DUR = TL['total']; NF = int(round(DUR * FPS))
F = 1 / FPS

def W(i, k, off=0.0, end=False):
    w = L[i]['words'][k]; return L[i]['start'] + (w['e'] if end else w['s']) + off
def S(i, off=0.0): return L[i]['start'] + off
def E(i, off=0.0): return L[i]['start'] + L[i]['dur'] + off
def EV(i, k=0, end=False): ev = L[i]['events'][k]; return L[i]['start'] + (ev['e'] if end else ev['s'])
REG = 4 * F  # listener register delay (receive -> register -> change)

# ---------------- cue sheet (who thinks what, when) ----------------
EXPR = {'B': [(0, 'neutral')], 'O': [(0, 'neutral')]}
GEST = {'B': [], 'O': []}          # (name, accent, hold_end, peak)
SHOT = []                           # (time, shot)
PUSH = []                           # (time, amount)
INS = {}                            # line -> beat
def ex(h, t, e): EXPR[h].append((t, e))
def ge(h, name, acc, hold, peak=1.0): GEST[h].append((name, acc, hold, peak))
def cut(t, shot): SHOT.append((t, shot))

# 0 hook: Blue engaged, single big accent on "actually" (L3)
cut(0, 'cuB'); ex('B', W(0, 4, -2 * F), 'wait-WHAT'); ge('B', 'panic', W(0, 4), E(0, -0.1))
ex('O', 0, 'neutral')
# 1 Orange restrained: side-eye, disgust lands on "ate"
cut(S(1, -0.06), 'cuO'); ex('O', S(1), 'side-eye'); ex('O', W(1, 3), 'disgusted'); ex('B', E(0, 0.2), 'fake-innocent')
# 2 two-shot: Blue confidently wrong vs Orange done
cut(S(2, -0.04), 'two'); ex('B', S(2), 'confidently-wrong'); ge('B', 'talk', W(2, 0), W(2, 3, 0, True), 0.9)
ex('O', W(2, 2, REG), 'completely-done')
# 3 Orange explains, tiny smug on "motor"
cut(S(3, -0.06), 'cuO'); ex('O', S(3), 'neutral'); ge('O', 'talk', W(3, 3), W(3, 5, 0, True), 0.7); ex('O', W(3, 7), 'smug-expert')
ex('B', S(3), 'brain-buffering')
# 4 Blue genuine curiosity (save the big face for the answer)
cut(S(4, -0.06), 'cuB'); ex('B', S(4), 'brain-buffering'); ge('B', 'shrug', W(4, 4), E(4, -0.05), 0.85)
# 5-6 cutaway
for i, b in ((5, 'rest'), (6, 'hump')): INS[i] = b; cut(S(i, -0.04), 'ins')
ex('O', S(5), 'smug-expert')
# 7 Blue confidently wrong, shrug on "yoga"
cut(S(7, -0.06), 'cuB'); ex('B', S(7), 'confidently-wrong'); ge('B', 'shrug', W(7, 5), E(7, 0.1))
# 8 cut to Orange's quiet judgment (no second big reaction)
cut(E(7, 0.04), 'cuO'); ex('O', E(7, 0.04), 'side-eye'); ex('O', W(8, 1), 'neutral')
# 9-10 cutaway, then cut to Blue's reaction on "everything" while Orange finishes off-screen (main escalation, L3)
INS[9] = 'wave'; cut(S(9, -0.04), 'ins'); INS[10] = 'siphon'
cut(W(10, 7, 0.02), 'cuB'); ex('B', W(10, 7, REG), 'please-no'); PUSH.append((W(10, 7, REG), 0.04))
# 11 Blue fake-innocent, small held look
ex('B', S(11, -0.05), 'fake-innocent')
# 12 Orange almost still: the repeat is the joke
cut(S(12, -0.08), 'cuO'); ex('O', S(12, -0.08), 'neutral')
# 13 cutaway gurgle
INS[13] = 'gurgle'; cut(S(13, -0.04), 'ins')
# 14 two-shot: Blue pleased with himself, giggles; Orange starts to crack on "burp"
cut(S(14, -0.06), 'two'); ex('B', S(14), 'confidently-wrong'); ex('O', S(14), 'neutral')
ex('B', EV(14), 'no-regrets'); ex('O', W(14, 6, REG), 'holding-laugh')
# 15 Orange loses composure (rare = bigger joke): holding-laugh, small shrug on "Yeah"
cut(S(15, 0.0), 'cuO'); ge('O', 'shrug', W(15, 1), E(15, -0.1), 0.6)
# 16 cutaway refill
INS[16] = 'refill'; cut(S(16, -0.04), 'ins'); ex('O', S(16), 'smug-expert')
# 17 Blue's conclusion: proud, then no-regrets on "vibes"
cut(S(17, -0.06), 'cuB'); ex('B', S(17), 'confidently-wrong'); ge('B', 'talk', W(17, 5), W(17, 5, 0, True), 0.8)
ex('B', W(17, 7), 'no-regrets'); ge('B', 'shrug', W(17, 7), E(17, 0.05), 0.9)
# 18 Orange smug, minimal gesture; push-in lands on "group chat"
cut(S(18, -0.06), 'cuO'); ex('O', S(18), 'smug-expert'); PUSH.append((W(18, 4), 0.06))
# 19 "Rude!": one quick Blue escalation, then hold; he laughs it off
cut(S(19, -0.02), 'two'); ex('B', S(19, -2 * F), 'meltdown'); ge('B', 'panic', W(19, 0), W(19, 0, 0.35, True), 0.8)
ex('O', S(19), 'no-regrets')
if L[19]['events']: ex('B', EV(19), 'holding-laugh')
# 20 Orange's tiny satisfied smile; Blue side-eye then recovers
ex('O', S(20), 'smug-expert'); ex('O', W(20, 3), 'no-regrets'); ex('B', S(20, 0.1), 'side-eye')
# 21 restore the setup pose and eyeline for the loop
cut(S(21, -0.06), 'cuB'); ex('B', S(21, -0.06), 'neutral'); ge('B', 'talk', W(21, 0), W(21, 0, 0.15, True), 0.6)

for h in EXPR: EXPR[h].sort()
SHOT.sort()
EMPH = {0: [4, 8], 2: [0, 5], 3: [0, 5, 7], 4: [4], 7: [5], 8: [0, 2], 11: [0], 12: [0], 15: [1], 17: [5, 7], 18: [4], 19: [0], 20: [3], 21: [0]}
TILT = {'neutral': 0, 'wait-WHAT': -5, 'side-eye': 4, 'smug-expert': 3, 'confidently-wrong': -3, 'completely-done': 5,
        'disgusted': -4, 'fake-innocent': 5, 'please-no': -6, 'brain-buffering': 3, 'holding-laugh': 2, 'no-regrets': -2,
        'meltdown': -3, 'ugly-laugh': 4, 'evil-plan': 3, 'soul-left-body': 0, 'internal-scream': 0, 'awkward-silence': 0,
        'crying-laugh': 4, 'big-brain-fail': -4}
BIG = {'wait-WHAT', 'please-no', 'meltdown', 'soul-left-body', 'internal-scream', 'ugly-laugh', 'crying-laugh', 'big-brain-fail'}

def sm(x): x = max(0, min(1, x)); return x * x * (3 - 2 * x)
def back(x, s=1.7): x = max(0, min(1, x)) - 1; return x * x * ((s + 1) * x + s) + 1
def expr_at(h, t):
    cur, prev, tc = EXPR[h][0][1], EXPR[h][0][1], -9
    for tt, e in EXPR[h]:
        if tt <= t + 1e-6:
            if e != cur: prev, cur, tc = cur, e, tt
        else: break
    return cur, prev, tc
def gest_at(h, t):
    best = None
    for g in GEST[h]:
        if g[1] - 0.2 <= t: best = g
    if not best: return 'talk', 0.0, 0.0
    name, acc, hold, pk = best; d = t - acc
    if d < -0.125: w = 0
    elif d < -0.04: w = -0.12 * sm((d + 0.125) / 0.085)            # anticipation (opposite)
    elif d < 0.12: w = -0.12 + (pk * 1.06 + 0.12) * back((d + 0.04) / 0.16, 1.2)
    elif t < hold: w = pk * (1.06 - 0.06 * sm((d - 0.12) / 0.15))   # settle into a moving hold
    else: w = pk * (1 - sm((t - hold) / 0.3))                        # release
    trem = 5 * math.sin(2 * math.pi * 6 * t) * math.exp(-max(0, d) / 0.3) if name == 'panic' and 0 < d and t < hold else 0
    return name, w, trem
def line_of(t):
    cur = None
    for l in L:
        if l['start'] - 1e-6 <= t <= l['start'] + l['dur']: cur = l
    return cur
def mouth_at(h, t):
    l = line_of(t)
    if not l or l['sp'] != h: return None, 1
    for a, b, v in l['cues']:
        if a <= t < b: return v, 1
    lt = t - l['start']
    for ev in l['events']:
        if ev['s'] <= lt < ev['e']:
            env = l['env']; k = min(len(env) - 1, int(lt * 100)); mx = max(env)
            amp = max(0, min(1, (env[k] - (mx - 30)) / 26))
            return ('laugh', 0.45 + 0.65 * amp) if ev['kind'] == 'laugh' else ('U', 0.7 + 0.3 * amp)
    return None, 1  # pause: hold the expression's own mouth
BLINK = {}
for h, seed in (('B', 0.7), ('O', 2.1)):
    ts, t, k = [], seed, 0
    while t < DUR - 0.6:
        ts.append(t); k += 1; t += 3.0 + 1.4 * ((k * 0.618 + seed) % 1)
    BLINK[h] = ts
def host_opts(h, t):
    e, pe, tc = expr_at(h, t); d = t - tc
    tilt = TILT[pe] + (TILT[e] - TILT[pe]) * back(d / 0.22, 2.0) if d < 0.22 else TILT[e]
    sq = 0.0
    if e in BIG and -0.1 < d < 0.3:
        sq = 0.04 * sm((d + 0.1) / 0.08) if d < -0.02 else (-0.05 * (1 - sm((d + 0.02) / 0.28)))
    dy = 2.0 * math.sin(2 * math.pi * round(DUR / 3.6) * t / DUR + (0 if h == 'B' else 1.9))
    l = line_of(t)
    if l and l['sp'] == h:
        for k in EMPH.get(l['i'], []):
            dw = t - (l['start'] + l['words'][k]['s'])
            if 0 <= dw < 0.35: dy += 5 * math.sin(math.pi * dw / 0.35); tilt += 1.5 * math.sin(math.pi * dw / 0.35)
    g, gw, tr = gest_at(h, t)
    m, ms = mouth_at(h, t)
    blink = any(0 <= t - b < 3 * F for b in BLINK[h])
    o = {'host': 'blue' if h == 'B' else 'orange', 'expression': e, 'gesture': g, 'gw': round(gw, 4), 'tremble': round(tr, 2),
         'tilt': round(tilt, 3), 'dy': round(dy, 2), 'squash': round(sq, 4), 'blink': blink, 'gaze': 5 if h == 'B' else -5}
    if m: o['mouth'] = m; o['mouthScaleY'] = round(ms, 3)
    return o
def shot_at(t):
    s = SHOT[0]
    for x in SHOT:
        if x[0] <= t + 1e-6: s = x
    return s
def push_at(t):
    st = shot_at(t)[0]; k = 1.0
    for tp, amt in PUSH:
        if st - 1e-6 <= tp <= t: k = 1 + amt * sm((t - tp) / 0.3)
    return k

# ---------------- captions (word timed) ----------------
CAPS = []
for l in L:
    chunk = []
    def flush_chunk():
        if chunk: CAPS.append([l['start'] + chunk[0]['s'], l['start'] + chunk[-1]['e'], ' '.join(c['txt'] for c in chunk), l['sp']])
    for w in l['words']:
        txt = 'sh*t' if w.get('bleep') else w['w']
        if chunk and len(' '.join(c['txt'] for c in chunk) + ' ' + txt) > 26: flush_chunk(); chunk = []
        chunk.append({'txt': txt, 's': w['s'], 'e': w['e']})
        if txt[-1] in '.?!' and len(' '.join(c['txt'] for c in chunk)) > 8: flush_chunk(); chunk = []
    flush_chunk()
for k in range(len(CAPS)):
    nxt = CAPS[k + 1][0] if k + 1 < len(CAPS) else CAPS[k][1] + 0.12  # last caption clears before the loop restarts
    CAPS[k][1] = min(nxt, CAPS[k][1] + 0.35)
def esc(t): return t.replace('&', '&amp;').replace('<', '&lt;')
def caption(t):
    c = next((c for c in CAPS if c[0] - 0.04 <= t < c[1]), None)
    if not c: return ''
    h = 116; col = A.B if c[3] == 'B' else A.O
    return (f'<rect x="60" y="1620" width="960" height="{h}" rx="24" fill="#051545"/><rect x="60" y="1620" width="18" height="{h}" rx="9" fill="{col}"/>'
            f'<text x="550" y="{1620 + h / 2 + 16}" font-size="50" font-weight="700" fill="#fdfcf1" text-anchor="middle" font-family="DejaVu Sans, sans-serif">{esc(c[2])}</text>')

# ---------------- cutaway states (from v2) ----------------
def lv(w): return 535 - w * 135
def insert_state(beat, u):
    if beat in ('rest', 'hump', 'wave', 'siphon', 'gurgle'):
        T = {'lvl': 520, 'fill': .5, 'flow': 0, 'gurgle': 0, 'blob': 0, 'tank': 1, 'wave': 0}; hl = []; pop = None; cam = (390, 560, 620)
        if beat == 'rest': hl = [{'part': 'trap', 'label': 'S-TRAP', 'dx': -200, 'dy': -260}]
        if beat == 'hump': hl = [{'part': 'hump', 'label': 'THE HUMP', 'dx': -120, 'dy': -220}]; cam = (350, 540, 500)
        if beat == 'wave':
            T.update(tank=1 - .7 * sm(u), wave=1, lvl=520 - 22 * sm(u * 1.4), fill=.5 + .5 * sm(u * 1.2), flow=sm(u)); hl = [{'part': 'hump', 'label': 'OVER THE HUMP', 'dx': -120, 'dy': -220}]; cam = (380, 550, 580)
        if beat == 'siphon':
            T.update(tank=.3 - .2 * u, lvl=498 + 90 * sm(u * 1.3), fill=1, flow=1, blob=.05 + .95 * sm(u * 1.15)); hl = [{'part': 'trap', 'label': 'SIPHON', 'dx': -200, 'dy': -260}]
            pop = {'x': 260, 'y': 560, 's': min(1, .3 + u * 3), 'text': 'WHOOSH!'} if u < .45 else None; cam = (370, 560, 560)
        if beat == 'gurgle':
            T.update(tank=.1 + .1 * u, lvl=590, fill=1, gurgle=1, flow=.3, blob=-1); hl = [{'part': 'hump', 'label': 'AIR GETS IN', 'dx': -120, 'dy': -220}]
            pop = {'x': 300, 'y': 520, 's': .8 + .2 * sm(u * 4), 'text': 'GLUG GLUG'}; cam = (380, 550, 560)
        return 'S', T, hl, pop, cam
    T = {'yw': lv(.08 + .92 * sm(u * 1.1)), 'flap': 0, 'press': 0, 'off': 0, 'stuck': False, 'overflow': False, 'ghost': None, 'levelLine': 0, 'swirl': 0}
    hl = [{'part': 'ball', 'label': 'FLOAT', 'dx': -60, 'dy': -260}]; pop = None
    if u > .85: hl = [{'part': 'tap', 'label': 'SHUT', 'dx': -60, 'dy': -240}]; pop = {'x': 300, 'y': 392, 's': min(1, .3 + (u - .85) * 12), 'text': 'CLICK!'}
    return 'T', T, hl, pop, (400, 530, 480)
def ins_line(t):
    st = shot_at(t)[0]; l = line_of(t)
    cands = [i for i in INS if L[i]['start'] - 0.05 <= t]
    return max(cands) if cands else None

# ---------------- page ----------------
JS_POD = '''(P)=>{
 const ch=(o,x,y,k)=>`<g transform="translate(${x} ${y}) scale(${k})">${Act3.frame(RIG,o)}</g>`;
 let hosts='';
 if(P.shot==='two') hosts=ch(P.B,290,800,1.15)+ch(P.O,790,800,1.15);
 else if(P.shot==='cuB') hosts=ch(P.B,530,760,1.9); else hosts=ch(P.O,530,760,1.9);
 document.querySelector('#stage').innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920"><g transform="translate(540 760) scale(${P.k}) translate(-540 -760)">${P.bg}${hosts}${P.fg}</g>${P.ov}</svg>`;}'''
JS_INS = '''(S)=>{window.PROPS=S.which==='S'?window.PROPS_SIPHON:window.PROPS_TANK;drawFrame(S);
 const pip=`<defs><clipPath id="pc"><circle cx="150" cy="1470" r="95"/></clipPath></defs><circle cx="150" cy="1470" r="95" fill="#fffdf4"/><g clip-path="url(#pc)"><g transform="translate(150 1478) scale(0.62)">${Act3.frame(RIG,S.pipo)}</g></g><circle cx="150" cy="1470" r="95" fill="none" stroke="${S.pipc}" stroke-width="10"/>`;
 document.querySelector('#stage').insertAdjacentHTML('beforeend',`<svg width="1080" height="1920" style="position:absolute;left:0;top:0">${pip}${S.extra}</svg>`)}'''
def statics(shot):
    if shot == 'two':
        bg = A.bg() + A.place(A.logo, 170, 180, 1); fg = A.desk() + A.place(A.mic(), 130, 1045) + A.place(A.mic(), 950, 1045) + A.rect(0, 1345, 1080, 575, A.I)
    else:
        kind = 'blue' if shot == 'cuB' else 'orange'
        bg = A.bg() + A.place(A.logo, 220, 150, .86); fg = A.desk() + A.place(A.mic(), 230 if kind == 'blue' else 850, 1050, 1.2) + A.rect(0, 1345, 1080, 575, A.I)
    return bg, fg
ST = {s: statics(s) for s in ('two', 'cuB', 'cuO')}

def frame_payload(f):
    t = f / FPS; shot = shot_at(t)[1]
    if shot == 'ins':
        i = ins_line(t); l = L[i]; u = max(0, min(1, (t - l['start']) / max(.3, l['dur'])))
        which, T, hl, pop, cam = insert_state(INS[i], u)
        po = host_opts(l['sp'], t); po.update(gaze=0, tilt=po['tilt'] * 0.5, gw=0, dy=0)
        return 'ins', {'f': f, 'T': T, 'cam': {'cx': cam[0], 'cy': cam[1], 'w': cam[2] * (1 - .04 * u)}, 'hl': hl, 'cap': '', 'badge': None, 'pop': pop,
                       'slate': '', 'tc': '', 'extra': caption(t), 'which': which, 'pipo': po, 'pipc': A.B if l['sp'] == 'B' else A.O}
    bg, fg = ST[shot]
    return 'pod', {'shot': shot, 'k': push_at(t), 'bg': bg, 'fg': fg, 'ov': caption(t), 'B': host_opts('B', t), 'O': host_opts('O', t)}

async def render(outdir, frames):
    from playwright.async_api import async_playwright
    os.makedirs(outdir, exist_ok=True)
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width': 1080, 'height': 1920})
        await pg.set_content('<html><body style="margin:0;overflow:hidden;background:#fdfcf1"><div id=a style="display:none"></div><div id=stage style="position:relative;width:1080px;height:1920px"></div></body></html>')
        await pg.add_script_tag(path=R + '/engine/rig.js'); await pg.add_script_tag(path=R + '/engine/core.js')
        await pg.add_script_tag(path=R + '/episodes/001-toilet/props.js'); await pg.evaluate("()=>{window.PROPS_TANK=window.PROPS}")
        await pg.add_script_tag(path='/home/claude/podcast/ep_flush/props_siphon.js'); await pg.evaluate("()=>{window.PROPS_SIPHON=window.PROPS}")
        await pg.add_script_tag(path=os.path.join(HERE, 'anim3.js'))
        await pg.evaluate("d=>{window.RIG=d}", json.load(open(PACK + '/rig-data.json')))
        for f in frames:
            kind, P = frame_payload(f)
            await pg.evaluate(JS_INS if kind == 'ins' else JS_POD, P)
            await pg.screenshot(path=f'{outdir}/f{f:04d}.png')
        await b.close()

def sfx_cues():
    return [(W(9, 4), 'toilet_flush', 0.30), (W(10, 1), 'bass_boom', 0.18), (W(13, 12, -0.1), 'toilet_gurgle', 0.35),
            (W(16, 3), 'tank_refill', 0.18)] + [(t - 0.03, 'swish_pop', 0.10) for t, s in SHOT if s == 'ins']

if __name__ == '__main__':
    cmd = sys.argv[1]
    if cmd == 'audio':
        import vo3; vo3.mix(L, DUR, sfx_cues()); print('mix ok', DUR)
    elif cmd == 'frames':
        fr = [int(x) for x in sys.argv[2].split(',')]; asyncio.run(render(sys.argv[3], fr))
    elif cmd == 'part':  # part k of n
        k, n = int(sys.argv[2]), int(sys.argv[3]); asyncio.run(render(f'{HERE}/frames', range(k, NF, n)))
    elif cmd == 'encode':
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', '24', '-i', f'{HERE}/frames/f%04d.png', '-i', f'{HERE}/mix.wav', '-map', '0:v', '-map', '1:a',
                        '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-shortest', sys.argv[2]], check=True)
    print('NF', NF, 'DUR', DUR)
