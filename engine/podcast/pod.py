"""Explained in 60 podcast renderer (generic). Usage: EPDIR=episodes/<id>/podcast python3 engine/podcast/pod.py audio|frames LIST DIR|part k n|encode OUT
The episode folder holds timeline.json (from vo.py) and cues.py (acting cue sheet, SRC, OUTRO, SFX()).
v3 notes:: acting cue sheet per the Expression & Comedy Acting Rules v1.1.
Thought-driven expression changes on trigger words, listener reactions with register delay, one gesture per
thought with anticipation/hold/settle, word-timed visemes, held mouths in pauses, laugh mouths only on real
laughter, cuts to listeners, push-ins only on punchlines, seamless loop."""
import json, math, os, sys, asyncio, subprocess
ENG = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, ENG); import assets as A
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
def ins(t, *keys):
    '''cut to the explainer cutaway at t; keys = (time, source_frame) pairs, piecewise linear'''
    cut(t, 'ins'); INSCLIP[round(t, 4)] = sorted(keys)
exec(open(f'{HERE}/cues.py').read())
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
        if chunk and len(' '.join(c['txt'] for c in chunk) + ' ' + txt) > 22: flush_chunk(); chunk = []
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
    x0, x1 = SAFE[0] + 20, RAIL_X - 10; y = SAFE[3] - 60
    return (f'<text x="{(x0 + x1) / 2}" y="{y}" font-size="66" font-weight="800" fill="#ffffff" stroke="#071747" stroke-width="14" '
            f'stroke-linejoin="round" paint-order="stroke" text-anchor="middle" font-family="DejaVu Sans, sans-serif">{esc(c[2])}</text>')

# ---------------- cutaways: sampled from the original explainer episode ----------------
import importlib.util
sys.path.insert(0, R + '/engine')
_sp = importlib.util.spec_from_file_location('src_ep', f'{R}/episodes/{SRC}/episode.py'); SEP = importlib.util.module_from_spec(_sp); _sp.loader.exec_module(SEP)
def ins_seg(t):
    t0 = None
    for k, (tt, sh) in enumerate(SHOT):
        if tt <= t + 1e-6: t0, t1 = tt, (SHOT[k + 1][0] if k + 1 < len(SHOT) else DUR)
    return t0, t1
# ---------------- page ----------------
JS_POD = '''(P)=>{
 const ch=(o,x,y,k)=>`<g transform="translate(${x} ${y}) scale(${k})">${Act4.frame(RIG,o)}</g>`;
 let hosts='';
 if(P.shot==='two') hosts=ch(P.B,280,820,1.2)+ch(P.O,780,820,1.2);
 else if(P.shot==='cuB') hosts=ch(P.B,520,800,2.0); else hosts=ch(P.O,520,800,2.0);
 document.querySelector('#stage').innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920"><g transform="translate(520 800) scale(${P.k}) translate(-520 -800)">${P.bg}${hosts}${P.fg}</g>${P.ov}</svg>`;}'''
JS_INS = '''(S)=>{drawFrame(S);
 const st=document.querySelector('#stage'); st.innerHTML=`<div style="position:absolute;left:0;top:0;width:1080px;height:1920px;transform-origin:0 0;transform:translate(504px,768px) scale(0.72) translate(-540px,-780px)">${st.innerHTML}</div>`;
 const pip=`<defs><clipPath id="pc"><circle cx="790" cy="390" r="92"/></clipPath></defs><circle cx="790" cy="390" r="92" fill="#fffdf4"/><g clip-path="url(#pc)"><g transform="translate(790 398) scale(0.6)">${Act4.frame(RIG,S.pipo)}</g></g><circle cx="790" cy="390" r="92" fill="none" stroke="${S.pipc}" stroke-width="10"/>`;
 document.querySelector('#stage').insertAdjacentHTML('beforeend',`<svg width="1080" height="1920" style="position:absolute;left:0;top:0">${pip}${S.extra}</svg>`)}'''
DESK = ('<defs><linearGradient id="dk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9b386"/><stop offset="1" stop-color="#c99d6e"/></linearGradient>'
        '<linearGradient id="dt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6e3c6"/><stop offset="1" stop-color="#ecd0aa"/></linearGradient></defs>'
        '<rect x="-20" y="1180" width="1120" height="760" fill="url(#dk)"/>'
        '<rect x="-20" y="1200" width="1120" height="34" fill="#071747" opacity=".08"/>'
        '<path d="M -30 1092 L 1110 1092 L 1110 1170 Q 1110 1200 1080 1200 L 0 1200 Q -30 1200 -30 1170 Z" fill="url(#dt)" stroke="#071747" stroke-width="7" stroke-linejoin="round"/>'
        '<path d="M 30 1188 L 1050 1188" stroke="#d2ad83" stroke-width="6" stroke-linecap="round"/>'
        '<path d="M 60 1110 L 1020 1110" stroke="#fffaf0" stroke-width="5" stroke-linecap="round" opacity=".9"/>')
def statics(shot):
    if shot == 'two':
        bg = A.bg() + A.place(A.logo, 400, 245, .38); fg = DESK + A.place(A.mic(), 130, 1048) + A.place(A.mic(), 950, 1048)
    else:
        kind = 'blue' if shot == 'cuB' else 'orange'
        bg = A.bg() + A.place(A.logo, 400, 245, .38); fg = DESK + A.place(A.mic(), 230 if kind == 'blue' else 850, 1020, 1.2)
    return bg, fg
ST = {s: statics(s) for s in ('two', 'cuB', 'cuO')}

def frame_payload(f):
    t = f / FPS; shot = shot_at(t)[1]
    if shot == 'ins':
        t0, t1 = ins_seg(t); K = INSCLIP[round(t0, 4)]
        if t <= K[0][0]: fv = K[0][1]
        elif t >= K[-1][0]: fv = K[-1][1]
        else:
            k = max(j for j in range(len(K) - 1) if K[j][0] <= t); (ta, fa), (tb, fb) = K[k], K[k + 1]; fv = fa + (fb - fa) * (t - ta) / (tb - ta)
        sf_ = int(round(fv)); S = SEP.frame(sf_)
        l = line_of(t) or line_of(t0); sp = l['sp'] if l else 'O'
        po = host_opts(sp, t); po.update(gaze=0, tilt=po['tilt'] * 0.5, gw=0, dy=0)
        return 'ins', {'f': sf_, 'T': S['T'], 'cam': S['cam'], 'hl': S['hl'], 'cap': '', 'badge': None, 'pop': S.get('pop'),
                       'slate': '', 'tc': '', 'extra': caption(t), 'pipo': po, 'pipc': A.B if sp == 'B' else A.O}
    bg, fg = ST[shot]
    return 'pod', {'shot': shot, 'k': push_at(t), 'bg': bg, 'fg': fg, 'ov': caption(t), 'B': host_opts('B', t), 'O': host_opts('O', t)}

async def render(outdir, frames):
    from playwright.async_api import async_playwright
    os.makedirs(outdir, exist_ok=True)
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width': 1080, 'height': 1920})
        await pg.set_content('<html><body style="margin:0;overflow:hidden;background:#fdfcf1"><div id=a style="display:none"></div><div id=stage style="position:relative;width:1080px;height:1920px"></div></body></html>')
        await pg.add_script_tag(path=R + '/engine/rig.js'); await pg.add_script_tag(path=R + '/engine/core.js')
        await pg.add_script_tag(path=f'{R}/episodes/{SRC}/props.js')
        await pg.add_script_tag(path=os.path.join(ENG, 'faces4.js')); await pg.add_script_tag(path=os.path.join(ENG, 'anim4.js'))
        await pg.evaluate("()=>{window.RIG={}}")
        for f in frames:
            kind, P = frame_payload(f)
            await pg.evaluate(JS_INS if kind == 'ins' else JS_POD, P)
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
        ims = [Image.open(f'{fd}/f{n:04d}.png').convert('RGB').resize((270, 480)) for n in picks]
        sheet = Image.new('RGB', (270 * 6, 480 * 2), 'white')
        for k, im in enumerate(ims): sheet.paste(im, (270 * (k % 6), 480 * (k // 6)))
        sheet.save(f'{HERE}/qc_sheet.png')
        a, b = Image.open(f'{fd}/f0000.png').convert('RGB'), Image.open(f'{fd}/f{NF - 1:04d}.png').convert('RGB')
        seam = sum(ImageStat.Stat(ImageChops.difference(a, b)).mean) / 3
        x, sr = sf_.read(f'{HERE}/mix.wav'); lufs = pyln.Meter(sr).integrated_loudness(x); tp = 20 * np.log10(np.abs(x).max())
        q = {'frames': NF, 'dur': DUR, 'seam_mean_diff': round(seam, 2), 'seam_ok': seam < 6, 'lufs': round(lufs, 1), 'peak_dbfs': round(tp, 2),
             'audio_ok': abs(lufs + 14) < 1 and tp <= -1.0, 'dur_ok': DUR <= 60.5, 'missing_frames': [f for f in range(NF) if not os.path.exists(f'{fd}/f{f:04d}.png')][:10]}
        json.dump(q, open(f'{HERE}/qc.json', 'w'), indent=1); print(q)
    print('NF', NF, 'DUR', DUR)
