"""Explained in 60 LONG-FORM renderer, 16:9 1920x1080 (built from the podcast renderer).
Usage: EPDIR=episodes/<id>/longform python3 engine/longform/lf.py audio|frames LIST DIR|part k n|encode OUT|qc
Shots: two, cuB, cuO (studio cropped wide), ins (cutaway board left + speaker right), card (chapter title).
Podcast header: Usage: EPDIR=episodes/<id>/podcast python3 engine/podcast/pod.py audio|frames LIST DIR|part k n|encode OUT
The episode folder holds timeline.json (from vo.py) and cues.py (acting cue sheet, SRC, OUTRO, SFX()).
v3 notes:: acting cue sheet per the Expression & Comedy Acting Rules v1.1.
Thought-driven expression changes on trigger words, listener reactions with register delay, one gesture per
thought with anticipation/hold/settle, word-timed visemes, held mouths in pauses, laugh mouths only on real
laughter, cuts to listeners, push-ins only on punchlines, seamless loop."""
import json, math, os, sys, asyncio, subprocess
LFD = os.path.dirname(os.path.abspath(__file__)); ENG = os.path.abspath(os.path.join(LFD, '..', 'podcast')); sys.path.insert(0, ENG); import assets as A
HERE = os.path.abspath(os.environ['EPDIR'])  # episodes/<id>/podcast
FPS = 24; R = os.path.abspath(os.path.join(ENG, '..', '..'))
TL = json.load(open(f'{HERE}/timeline.json')); L = TL['lines']; DUR = TL['total']; NF = int(round(DUR * FPS))
F = 1 / FPS
# strictest union of TikTok / Reels / Shorts UI overlays on 1080x1920 (top Shorts 288, bottom Reels+Shorts 672, left TikTok 120, right Shorts 192)
# user's Reels safe-zone guide: top 220 px, bottom 420 px, 35 px sides, right button rail (~135 px) in the lower part
SAFE = (35, 220, 1045, 1500); RAIL_X, RAIL_Y = 945, 870; SCX, SCY = 540, 860

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

INSCLIP = {}
SRC = None
CARDS = {}
COUNT = []     # times when Blue's wrong-theories counter goes up by one
CHAPTERS = []  # (t, label) top-left chapter label
def card(t, title, sub=''):
    '''full-screen chapter card at t (lasts until the next cut)'''
    cut(t, 'card'); CARDS[round(t, 4)] = (title, sub)
def chapter(t, label): CHAPTERS.append((t, label))
STAMPS = []   # (t, text, color, hold_s): e.g. the red WRONG stamp on Blue's myth (week 2 plan)
SERIES = ''   # series badge text, e.g. 'IS IT REALLY?'
def ins(t, *keys, src=None):
    '''cut to an explainer cutaway at t; keys = (time, source_frame) pairs, piecewise linear; src = episodes/<src>'''
    cut(t, 'ins'); INSCLIP[round(t, 4)] = (src, sorted(keys))
def wrong(t): COUNT.append(t); STAMPS.append((t, 'WRONG', '#e8273a', 1.4))
exec(open(f'{HERE}/cues.py').read())
# FIRST FRAME = HOOK (owner rule 2026-11-03): every podcast opens on the object's most striking moment, not a host face.
# cues.py sets HOOK = (src_frame_start, src_frame_end, seconds). The cold open plays that cutaway with the hook caption,
# then cuts to the first planned shot; the last 0.42 s returns to src_frame_start so the loop seam matches frame 0.
if False:  # no loop cold-open in long-form
    _hf0, _hf1, _hd = HOOK
    _first = next((s for t, s in sorted(SHOT) if t <= 0.01), 'cuB')
    SHOT[:] = [(t, s) for t, s in SHOT if t >= _hd]
    if not any(abs(t - _hd) < 1e-6 for t, s in SHOT): SHOT.append((_hd, _first))
    ins(0.0, (0.0, _hf0), (_hd, _hf1))
    ins(DUR - 0.42, (DUR - 0.42, _hf0), (DUR, _hf0))
for h in EXPR: EXPR[h].sort()
SHOT.sort()
TILT = {'neutral': 0, 'wait-WHAT': -5, 'side-eye': 4, 'smug-expert': 3, 'confidently-wrong': -3, 'completely-done': 5,
        'disgusted': -4, 'fake-innocent': 5, 'please-no': -6, 'brain-buffering': 3, 'holding-laugh': 2, 'no-regrets': -2,
        'meltdown': -3, 'ugly-laugh': 4, 'evil-plan': 3, 'soul-left-body': 0, 'internal-scream': 0, 'awkward-silence': 0,
        'crying-laugh': 4, 'big-brain-fail': -4,
        'curious': 4, 'confused': -4, 'smug': 3, 'laugh': 4, 'shock': -5, 'mock-offended': -4, 'done': 5, 'wink': -2}
BIG = {'shock', 'mock-offended', 'laugh', 'wait-WHAT', 'please-no', 'meltdown', 'soul-left-body', 'internal-scream', 'ugly-laugh', 'crying-laugh', 'big-brain-fail'}

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
        if chunk and len(' '.join(c['txt'] for c in chunk) + ' ' + txt) > 40: flush_chunk(); chunk = []
        chunk.append({'txt': txt, 's': w['s'], 'e': w['e']})
        if txt[-1] in '.?!' and len(' '.join(c['txt'] for c in chunk)) > 8: flush_chunk(); chunk = []
    flush_chunk()
if CAPS and CAPS[0][0] < 0.6: CAPS[0][0] = 0.0  # the hook subtitle is on screen from frame 1
for k in range(len(CAPS)):
    nxt = CAPS[k + 1][0] if k + 1 < len(CAPS) else CAPS[k][1] + 0.12  # last caption clears before the loop restarts
    CAPS[k][1] = min(nxt, CAPS[k][1] + 0.35)
def esc(t): return t.replace('&', '&amp;').replace('<', '&lt;')
def overlay(t):
    out = ''
    ch = [lab for tt, lab in CHAPTERS if tt <= t]
    if ch and shot_at(t)[1] != 'card':
        lab = ch[-1]; w = 22 * len(lab) + 44
        out += (f'<g transform="translate(40 34)"><rect width="{w}" height="54" rx="27" fill="#071747"/>'
                f'<text x="{w / 2}" y="37" font-size="28" font-weight="800" fill="#ffd43b" text-anchor="middle" font-family="DejaVu Sans, sans-serif">{esc(lab)}</text></g>')
    if COUNT and t >= 0:
        n = sum(1 for c in COUNT if c <= t)
        bump = max([1 - (t - c) / 0.3 for c in COUNT if 0 <= t - c < 0.3] or [0])
        k = 1 + 0.18 * bump
        out += (f'<g transform="translate(1700 61) scale({k:.3f})"><rect x="-190" y="-27" width="380" height="54" rx="27" fill="#fffdf4" stroke="#071747" stroke-width="5"/>'
                f'<text x="0" y="10" font-size="26" font-weight="800" fill="#071747" text-anchor="middle" font-family="DejaVu Sans, sans-serif">BLUE WRONG: <tspan fill="#e8273a">{n}</tspan></text></g>')
    for t0, txt, col, hold in STAMPS:
        if t0 <= t < t0 + hold:
            u = (t - t0) / 0.22; k = 1.0 if u >= 1 else 1.6 - 0.6 * u * u * (3 - 2 * u)
            sx = 620 if shot_at(t)[1] == 'two' else 1530 if shot_at(t)[1] == 'ins' else 960
            out += (f'<g transform="translate({sx} 380) rotate(-10) scale({k:.3f})" opacity="{min(1, u * 2):.2f}">'
                    f'<rect x="-250" y="-82" width="500" height="164" rx="18" fill="none" stroke="{col}" stroke-width="16"/>'
                    f'<text x="0" y="40" font-size="120" font-weight="900" fill="{col}" text-anchor="middle" font-family="DejaVu Sans, sans-serif" letter-spacing="6">{esc(txt)}</text></g>')
    return out + caption(t)

def caption(t):
    c = next((c for c in CAPS if c[0] - 0.04 <= t < c[1]), None)
    if not c or shot_at(t)[1] == 'card': return ''
    return (f'<text x="960" y="1030" font-size="50" font-weight="800" fill="#ffffff" stroke="#071747" stroke-width="11" '
            f'stroke-linejoin="round" paint-order="stroke" text-anchor="middle" font-family="DejaVu Sans, sans-serif">{esc(c[2])}</text>')

def card_svg(t):
    t0 = max(tt for tt in CARDS if tt <= t + 1e-6); title, sub = CARDS[t0]; u = min(1, (t - t0) / 0.35)
    k = 0.85 + 0.15 * (1 - (1 - u) ** 3)
    return (f'<rect width="1920" height="1080" fill="#2465ff"/><g opacity=".12">' + ''.join(f'<circle cx="{x}" cy="{y}" r="90" fill="#fffdf4"/>' for x, y in ((160, 160), (1760, 220), (300, 900), (1650, 940), (960, 80))) + '</g>'
            f'<g transform="translate(960 520) scale({k:.3f})"><text y="0" font-size="120" font-weight="900" fill="#fffdf4" stroke="#071747" stroke-width="14" paint-order="stroke" text-anchor="middle" font-family="DejaVu Sans, sans-serif">{esc(title)}</text>'
            f'<text y="110" font-size="52" font-weight="800" fill="#ffd43b" text-anchor="middle" font-family="DejaVu Sans, sans-serif">{esc(sub)}</text></g>')

# ---------------- cutaways: sampled from the original explainer episode ----------------
import importlib.util
sys.path.insert(0, R + '/engine')
SRCS = sorted({v[0] or SRC for v in INSCLIP.values()} - {None})
SEPS = {}
for _s in SRCS:
    _sp = importlib.util.spec_from_file_location('src_' + _s.replace('-', '_'), f'{R}/episodes/{_s}/episode.py'); _m = importlib.util.module_from_spec(_sp); _sp.loader.exec_module(_m); SEPS[_s] = _m
def ins_seg(t):
    t0 = None
    for k, (tt, sh) in enumerate(SHOT):
        if tt <= t + 1e-6: t0, t1 = tt, (SHOT[k + 1][0] if k + 1 < len(SHOT) else DUR)
    return t0, t1
# ---------------- page ----------------
JS_POD = '''(P)=>{
 const ch=(o,x,y,k)=>`<g transform="translate(${x} ${y}) scale(${k})">${Act4.frame(RIG,o)}</g>`;
 let hosts='', vb='';
 if(P.shot==='two'){hosts=ch(P.B,280,820,1.2)+ch(P.O,780,820,1.2); vb='-60 520 1200 675';}
 else if(P.shot==='cuB'){hosts=ch(P.B,520,800,2.0); vb='-240 340 1520 855';} else {hosts=ch(P.O,520,800,2.0); vb='-240 340 1520 855';}
 document.querySelector('#stage').innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="${vb}" preserveAspectRatio="xMidYMid slice"><rect x="-400" y="0" width="1900" height="1920" fill="#fffdf4"/><g transform="translate(520 800) scale(${P.k}) translate(-520 -800)">${P.bg}${hosts}${P.fg}</g></svg><svg width="1920" height="1080" style="position:absolute;left:0;top:0">${P.ov}</svg>`;}'''
JS_CARD = '''(P)=>{document.querySelector('#stage').innerHTML=`<svg width="1920" height="1080">${P.svg}</svg>`;}'''
JS_INS = '''(S)=>{window.PROPS=window.PR[S.src]; drawFrame(S);
 const st=document.querySelector('#stage'); const inner=st.innerHTML;
 st.innerHTML=`<div style="position:absolute;left:0;top:0;width:1920px;height:1080px;background:#fffdf4"></div>
  <div style="position:absolute;left:150px;top:24px;width:1040px;height:930px;border-radius:36px;overflow:hidden;border:7px solid #071747;background:#fffdf4">
   <div style="position:absolute;left:0;top:0;width:1080px;height:1920px;transform-origin:0 0;transform:translate(520px,470px) scale(0.72) translate(-540px,-780px)">${inner}</div></div>`;
 const host=`<g transform="translate(1530 640) scale(1.25)">${Act4.frame(RIG,S.pipo)}</g>`;
 st.insertAdjacentHTML('beforeend',`<svg width="1920" height="1080" style="position:absolute;left:0;top:0"><path d="M 1240 1080 L 1240 905 Q 1240 885 1260 885 L 1900 885 Q 1920 885 1920 905 L 1920 1080 Z" fill="#e8c9a4" stroke="#071747" stroke-width="6"/>${host}${S.extra}</svg>`)}'''
DESK = ('<defs><linearGradient id="dk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9b386"/><stop offset="1" stop-color="#c99d6e"/></linearGradient>'
        '<linearGradient id="dt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6e3c6"/><stop offset="1" stop-color="#ecd0aa"/></linearGradient></defs>'
        '<rect x="-420" y="1180" width="1940" height="760" fill="url(#dk)"/>'
        '<rect x="-420" y="1200" width="1940" height="34" fill="#071747" opacity=".08"/>'
        '<path d="M -430 1092 L 1510 1092 L 1510 1200 L -430 1200 Z" fill="url(#dt)" stroke="#071747" stroke-width="7" stroke-linejoin="round"/>'
        '<path d="M -430 1188 L 1510 1188" stroke="#d2ad83" stroke-width="6" stroke-linecap="round"/>'
        '<path d="M -430 1110 L 1510 1110" stroke="#fffaf0" stroke-width="5" stroke-linecap="round" opacity=".9"/>')
def statics(shot):
    if shot == 'two':
        bg = '<rect x="-420" y="0" width="1940" height="1920" fill="#fffdf4"/>' + A.bg() + A.place(A.logo, 400, 245, .38); fg = DESK + A.place(A.mic(), 130, 1048) + A.place(A.mic(), 950, 1048)
    else:
        kind = 'blue' if shot == 'cuB' else 'orange'
        bg = '<rect x="-420" y="0" width="1940" height="1920" fill="#fffdf4"/>' + A.bg() + A.place(A.logo, 400, 245, .38); fg = DESK + A.place(A.mic(), 230 if kind == 'blue' else 850, 1020, 1.2)
    return bg, fg
ST = {s: statics(s) for s in ('two', 'cuB', 'cuO')}

def frame_payload(f):
    t = f / FPS; shot = shot_at(t)[1]
    if shot == 'ins':
        t0, t1 = ins_seg(t); K = INSCLIP[round(t0, 4)][1]
        if t <= K[0][0]: fv = K[0][1]
        elif t >= K[-1][0]: fv = K[-1][1]
        else:
            k = max(j for j in range(len(K) - 1) if K[j][0] <= t); (ta, fa), (tb, fb) = K[k], K[k + 1]; fv = fa + (fb - fa) * (t - ta) / (tb - ta)
        sf_ = int(round(fv)); src = INSCLIP[round(t0, 4)][0] or SRC; S = SEPS[src].frame(sf_)
        l = line_of(t) or line_of(t0); sp = l['sp'] if l else 'O'
        po = host_opts(sp, t); po.update(gaze=-6)
        return 'ins', {'f': sf_, 'T': S['T'], 'cam': S['cam'], 'hl': S['hl'], 'cap': '', 'badge': None, 'pop': S.get('pop'),
                       'slate': '', 'tc': '', 'extra': overlay(t), 'pipo': po, 'src': src}
    if shot == 'card':
        return 'card', {'svg': card_svg(t)}
    bg, fg = ST[shot]
    return 'pod', {'shot': shot, 'k': push_at(t), 'bg': bg, 'fg': fg, 'ov': overlay(t), 'B': host_opts('B', t), 'O': host_opts('O', t)}

async def render(outdir, frames):
    from playwright.async_api import async_playwright
    os.makedirs(outdir, exist_ok=True)
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width': 1920, 'height': 1080})
        await pg.set_content('<html><body style="margin:0;overflow:hidden;background:#fdfcf1"><div id=a style="display:none"></div><div id=stage style="position:relative;width:1920px;height:1080px;overflow:hidden"></div></body></html>')
        await pg.add_script_tag(path=R + '/engine/rig.js'); await pg.add_script_tag(path=R + '/engine/core.js')
        await pg.evaluate("()=>{window.PR={}}")
        for _s in SRCS:
            # each props.js in its own scope: episodes reuse top-level names (const P, L, H ...)
            await pg.add_script_tag(content='(()=>{' + open(f'{R}/episodes/{_s}/props.js').read() + '\n})();'); await pg.evaluate("(s)=>{window.PR[s]=window.PROPS}", _s)
        await pg.add_script_tag(path=os.path.join(ENG, 'faces4.js')); await pg.add_script_tag(path=os.path.join(ENG, 'anim4.js'))
        await pg.evaluate("()=>{window.RIG={}}")
        for f in frames:
            kind, P = frame_payload(f)
            await pg.evaluate(JS_INS if kind == 'ins' else JS_CARD if kind == 'card' else JS_POD, P)
            await pg.screenshot(path=f'{outdir}/f{f:04d}.png')
        await b.close()

def music_cues():
    return [(0.0, 'sting_intro_a', 0.55), (E(OUTRO, 0.02), 'sting_outro_a', 0.6)]

def sfx_cues():
    return SFX() + [(t - 0.03, 'swish_pop', 0.10) for t, s in SHOT if s == 'ins']

if __name__ == '__main__':
    cmd = sys.argv[1]
    if cmd == 'audio':
        import vo; vo.mix(L, DUR, sfx_cues(), music_cues()); print('mix ok', DUR)
    elif cmd == 'frames':
        fr = [int(x) for x in sys.argv[2].split(',')]; asyncio.run(render(sys.argv[3], fr))
    elif cmd == 'range':
        a, b, k, n = map(int, sys.argv[2:6]); asyncio.run(render(f'{HERE}/frames', range(a + k, b, n)))
    elif cmd == 'part':  # part k of n
        k, n = int(sys.argv[2]), int(sys.argv[3]); asyncio.run(render(f'{HERE}/frames', range(k, NF, n)))
    elif cmd == 'encode':
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', '24', '-i', f'{HERE}/frames/f%04d.png', '-i', f'{HERE}/mix.wav', '-map', '0:v', '-map', '1:a',
                        '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-shortest', sys.argv[2]], check=True)
    elif cmd == 'qc':  # contact sheet + loop seam + loudness -> qc.json, qc_sheet.png
        from PIL import Image, ImageChops, ImageStat; import soundfile as sf_, pyloudnorm as pyln, numpy as np
        fd = f'{HERE}/frames'; picks = [int(NF * k / 12) for k in range(12)]
        ims = [Image.open(f'{fd}/f{n:04d}.png').convert('RGB').resize((480, 270)) for n in picks]
        sheet = Image.new('RGB', (480 * 4, 270 * 3), 'white')
        for k, im in enumerate(ims): sheet.paste(im, (480 * (k % 4), 270 * (k // 4)))
        sheet.save(f'{HERE}/qc_sheet.png')
        a, b = Image.open(f'{fd}/f0000.png').convert('RGB'), Image.open(f'{fd}/f{NF - 1:04d}.png').convert('RGB')
        seam = sum(ImageStat.Stat(ImageChops.difference(a, b)).mean) / 3
        x, sr = sf_.read(f'{HERE}/mix.wav'); lufs = pyln.Meter(sr).integrated_loudness(x); tp = 20 * np.log10(np.abs(x).max())
        q = {'frames': NF, 'dur': DUR, 'seam_mean_diff': round(float(seam), 2), 'lufs': round(float(lufs), 1), 'peak_dbfs': round(float(tp), 2),
             'audio_ok': bool(abs(lufs + 14) < 1 and tp <= -1.0), 'dur_ok': bool(480 <= DUR <= 1080), 'cold_open_ok': bool(shot_at(0)[1] in ('ins', 'two', 'cuB', 'cuO')), 'missing_frames': [f for f in range(NF) if not os.path.exists(f'{fd}/f{f:04d}.png')][:10]}
        json.dump(q, open(f'{HERE}/qc.json', 'w'), indent=1); print(q)
    print('NF', NF, 'DUR', DUR)
