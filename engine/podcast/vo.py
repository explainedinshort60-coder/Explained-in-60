"""Explained in 60 podcast VO edit v3 (ElevenLabs v4 voices).
Clean line edits, matched loudness, natural gaps, continuous room tone, wrap-around loop mix,
word-timed visemes (ElevenLabs Scribe word timestamps + espeak phonemes), laugh/sigh events."""
import os, json, re, subprocess, math, numpy as np, soundfile as sf, pyloudnorm as pyln
SR = 48000; FPS = 24
LIB = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'sfx', 'lib') + '/'
import os, sys
HERE = os.path.abspath(os.environ['EPDIR'])
LJ = json.load(open(f'{HERE}/lines.json'))
CFG = json.load(open(f'{HERE}/vocfg.json')) if os.path.exists(f'{HERE}/vocfg.json') else {}
SPK = [l['sp'] for l in LJ]
LAUGH = {'laughs', 'giggles', 'chuckles', 'laughing'}; SIGH = {'sighs', 'gasps', 'exhales'}
EVENT_KIND = {}
for l in LJ:
    t = set(l['tags'])
    if t & LAUGH: EVENT_KIND[l['i']] = 'laugh'
    elif t & SIGH: EVENT_KIND[l['i']] = 'sigh'
# default gaps: quick answers after questions, a breath between same-speaker lines, overrides from vocfg.json
GAP = []
for i, l in enumerate(LJ):
    p = LJ[i - 1]
    g = 0.20 if p['sp'] == l['sp'] else (0.08 if p['text'].rstrip().endswith('?') else 0.14)
    GAP.append(g)
GAP[0] = 0.16
for k, v in CFG.get('gap', {}).items(): GAP[int(k)] = v
MAX_PAUSE, KEEP_PAUSE = 0.24, 0.16
TEMPO = 1.10
TEMPO_LINE = {l['i']: 1.16 for l in LJ if l['sp'] == 'O' and len(l['words']) >= 9}
for k, v in CFG.get('tempo', {}).items(): TEMPO_LINE[int(k)] = v

def load(i):
    a = subprocess.run(['ffmpeg', '-v', 'error', '-i', f'{HERE}/vo_raw/l{i:02d}.wav', '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(a, np.float32).copy()

def tempo(x, f):
    y = subprocess.run(['ffmpeg','-v','error','-f','f32le','-ar',str(SR),'-ac','1','-i','-','-af',f'atempo={f}','-f','f32le','-'],input=x.tobytes(),capture_output=True).stdout
    return np.frombuffer(y, np.float32).copy()

def env_db(x, hop=480):
    n = len(x) // hop
    r = np.sqrt(np.mean(x[:n * hop].reshape(n, hop) ** 2, 1) + 1e-12)
    return 20 * np.log10(r)

def words_by_line():
    return [[dict(w) for w in l['words']] for l in LJ]

V = {'ɑ':'AA','a':'AA','æ':'AE','ʌ':'AH','ə':'AH','ɐ':'AH','ɔ':'AO','ɛ':'EH','e':'EH','ɜ':'ER','ɚ':'ER','ɝ':'ER','ɪ':'IH','ᵻ':'IH','i':'IY','ʊ':'UH','u':'UW','o':'OW'}
C = {'m':'MBP','b':'MBP','p':'MBP','f':'FV','v':'FV','θ':'TH','ð':'TH','l':'L','ɹ':'R','r':'R','w':'WQ','t':'TDNSZ','d':'TDNSZ','n':'TDNSZ','s':'TDNSZ','z':'TDNSZ','ɾ':'TDNSZ','ʃ':'CHSHJ','ʒ':'CHSHJ','k':'_ctx','ɡ':'_ctx','g':'_ctx','ŋ':'_ctx','h':'_ctx','j':'IY','ʔ':None}
def phon(word):
    ipa = subprocess.run(['espeak-ng', '-q', '-v', 'en-us', '--ipa', re.sub(r'[^A-Za-z0-9\']', ' ', word)], capture_output=True, text=True).stdout
    ipa = re.sub(r'[ˈˌː\-\s]', '', ipa); seq = []
    for ch in ipa:
        if ch in V: seq.append([V[ch], 2.2])
        elif ch in C and C[ch]: seq.append([C[ch], 1.0 if C[ch] != 'MBP' else 1.3])
    for k, (v, w) in enumerate(seq):  # K/G/NG/H borrow neighbouring vowel context
        if v == '_ctx':
            nb = next((seq[j][0] for j in list(range(k + 1, len(seq))) + list(range(k - 1, -1, -1)) if seq[j][0] in V.values()), 'AH')
            seq[k][0] = nb
    return seq or [['AH', 1]]

def word_visemes(w):
    seq = phon(w['w']); tot = sum(x[1] for x in seq); d = w['e'] - w['s']; t = w['s']; out = []
    for v, wt in seq:
        dd = d * wt / tot; out.append([t, t + dd, v]); t += dd
    # make M/B/P closures readable: at least 2 frames
    for k, c in enumerate(out):
        if c[2] == 'MBP' and c[1] - c[0] < 2 / FPS:
            need = 2 / FPS - (c[1] - c[0])
            if k + 1 < len(out): out[k + 1][0] += need; c[1] += need
            else: c[0] -= need
    return out

def process():
    WL = words_by_line(); meter = pyln.Meter(SR, block_size=0.2)
    lines = []
    for i in range(len(LJ)):
        x = load(i); e = env_db(x); pk = e.max(); th = pk - 38
        vo = np.where(e > th)[0]
        a = max(0, vo[0] * 480 - int(0.05 * SR)); b = min(len(x), vo[-1] * 480 + 480 + int(0.16 * SR))
        x = x[a:b]; sh = a / SR
        tf = TEMPO_LINE.get(i, TEMPO); x = tempo(x, tf)
        ws = [{'w': w['w'], 's': (w['s'] - sh) / tf, 'e': (w['e'] - sh) / tf} for w in WL[i]]
        # refine word ends: Scribe sometimes stretches a word over a following laugh or breath
        e = env_db(x); qth = pk - 32
        for w in ws:
            a0, b0 = int(w['s'] * 100), int(w['e'] * 100); seg = e[a0:b0]; run = 0
            for k, v in enumerate(seg):
                run = run + 1 if v < qth else 0
                if (run >= 10 and (seg[k:] > qth).any()) or run >= 18:
                    w['e'] = (a0 + k - run + 1) / 100 + 0.02; break
        mp = 0.5 if i in EVENT_KIND else MAX_PAUSE
        # compress long gaps between words, unless the gap holds a laugh/sigh (voiced)
        e = env_db(x); quiet = pk - 30
        for k in range(len(ws) - 1, 0, -1):
            g0, g1 = ws[k - 1]['e'] + 0.03, ws[k]['s'] - 0.02
            if g1 - g0 <= mp: continue
            seg = e[int(g0 * 100):int(g1 * 100)]
            if len(seg) and (seg > quiet).mean() > 0.35: continue  # voiced: keep the performance
            if i in EVENT_KIND and len(seg) > 3 and (np.convolve((seg > quiet).astype(int), np.ones(3), 'valid') >= 3).any(): continue  # laugh/breath burst
            cut = (g1 - g0) - KEEP_PAUSE; c0 = g0 + KEEP_PAUSE / 2; c1 = c0 + cut; xf = int(0.015 * SR)
            A, B = int(c0 * SR), int(c1 * SR)
            fade = np.linspace(1, 0, xf, dtype=np.float32)
            x = np.concatenate([x[:A - xf], x[A - xf:A] * fade + x[B - xf:B] * (1 - fade), x[B:]])
            for w in ws:
                for kk in ('s', 'e'):
                    if w[kk] >= c1: w[kk] -= cut
        # tighten tail silence after the last word (keep laugh tails)
        # loudness match every line to -20 LUFS (both hosts equal)
        L = meter.integrated_loudness(np.concatenate([x, np.zeros(int(0.4 * SR), np.float32)]))
        x = (x * 10 ** ((-20 - L) / 20)).astype(np.float32)
        n_in, n_out = int(0.008 * SR), int(0.05 * SR)
        x[:n_in] *= np.linspace(0, 1, n_in); x[-n_out:] *= np.linspace(1, 0, n_out)
        # non-word vocal events (laughs, giggles, sighs) = voiced regions not covered by words
        e = env_db(x); hot = e > (e.max() - 34); ev = []
        if i in EVENT_KIND:
            bounds = [(0.0, ws[0]['s'])] + [(ws[k]['e'], ws[k + 1]['s']) for k in range(len(ws) - 1)] + [(ws[-1]['e'], len(x) / SR)]
            for g0, g1 in bounds:
                g0 += 0.04; g1 -= 0.03
                if g1 - g0 < 0.18: continue
                idx = np.where(hot[int(g0 * 100):int(g1 * 100)])[0]
                if len(idx) < 4 or (idx[-1] - idx[0]) < 14: continue
                ev.append({'kind': EVENT_KIND[i], 's': round(g0 + idx[0] / 100, 3), 'e': round(g0 + (idx[-1] + 1) / 100, 3)})
        sf.write(f'{HERE}/vo/l{i:02d}.wav', x, SR)
        lines.append({'i': i, 'sp': SPK[i], 'dur': len(x) / SR, 'words': ws, 'events': ev, 'text': LJ[i]['text'], 'tags': LJ[i]['tags'],
                      'env': [round(float(v), 1) for v in env_db(x)]})
    # timeline
    t = 0.0
    for i, l in enumerate(lines):
        if i > 0: t += GAP[i]
        l['start'] = round(t, 4); t += l['dur']
    total = t + GAP[0]
    total = math.ceil(total * FPS) / FPS
    # lipsync cues (absolute)
    for l in lines:
        cues = []
        for w in l['words']:
            for a, b, v in word_visemes(w): cues.append([l['start'] + a, l['start'] + b, v])
        cues.sort(); merged = []
        for c in cues:  # bridge tiny gaps inside phrases with the next shape instead of snapping to rest
            if merged and 0 < c[0] - merged[-1][1] < 0.11: merged[-1][1] = c[0]
            if merged and merged[-1][2] == c[2] and abs(merged[-1][1] - c[0]) < 1e-3: merged[-1][1] = c[1]
            else: merged.append(c)
        l['cues'] = [[round(a, 4), round(b, 4), v] for a, b, v in merged]
    json.dump({'lines': lines, 'total': total}, open(f'{HERE}/timeline.json', 'w'))
    return lines, total

def mix(lines, total, sfx_cues, music_cues=()):
    N = int(round(total * SR)); out = np.zeros((N, 2), np.float32)
    def add(x, t, gain=1.0, pan=0.0):
        if x.ndim == 1: x = np.stack([x, x], 1)
        x = x * gain; x[:, 0] *= min(1, 1 - pan); x[:, 1] *= min(1, 1 + pan)
        s = int(round(t * SR)) % N
        for k in range(0, len(x), N - s if s else N):
            pass
        idx = (np.arange(len(x)) + s) % N  # wrap-around: anything past the end loops to the start
        np.add.at(out, idx, x)
    for l in lines:
        x, _ = sf.read(f'{HERE}/vo/l{l["i"]:02d}.wav', dtype='float32')
        add(x, l['start'], 1.0, -0.12 if l['sp'] == 'B' else 0.12)
    dlg = out.copy()
    for t, name, g in sfx_cues:
        y = subprocess.run(['ffmpeg', '-v', 'error', '-i', LIB + name + '.mp3', '-ac', '2', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
        add(np.frombuffer(y, np.float32).reshape(-1, 2).copy(), t, g)
    # brand music (intro sting, outro button), ducked ~10 dB under dialogue
    if music_cues:
        mus = np.zeros_like(out); keep = out; out = mus
        for t, name, g in music_cues:
            y = subprocess.run(['ffmpeg', '-v', 'error', '-i', LIB + name + '.mp3', '-ac', '2', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
            add(np.frombuffer(y, np.float32).reshape(-1, 2).copy(), t, g)
        out = keep
        lev = np.abs(dlg).max(1); hop = 480; n = len(lev) // hop
        e = lev[:n * hop].reshape(n, hop).max(1); act = (e > 0.02).astype(float)
        sm_ = np.zeros_like(act); acc = 0.0
        for _ in range(2):
            for k in range(n):
                c = 0.5 if act[k] > acc else 0.04  # fast attack, slow release
                acc += (act[k] - acc) * c; sm_[k] = acc
        gain = 1 - 0.68 * np.repeat(sm_, hop); gain = np.concatenate([gain, np.full(len(out) - len(gain), gain[-1])])
        out += mus * gain[:, None]
    # continuous room tone: pink-ish noise built as a seamless loop
    rng = np.random.default_rng(7); w = rng.standard_normal(N + SR).astype(np.float32)
    b = np.exp(-2 * np.pi * 900 / SR); y = np.zeros_like(w); acc = 0.0
    y = subprocess.run(['ffmpeg', '-v', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-af', 'lowpass=f=1200,highpass=f=60', '-f', 'f32le', '-'], input=w.tobytes(), capture_output=True).stdout
    y = np.frombuffer(y, np.float32)[:N + SR].copy(); xf = SR
    room = y[:N].copy(); room[:xf] = room[:xf] * np.linspace(0, 1, xf) + y[N:N + xf] * np.linspace(1, 0, xf)
    room *= 10 ** (-58 / 20) / (np.sqrt(np.mean(room ** 2)) + 1e-9)
    out += np.stack([room, room], 1)
    # gentle bus compression then loudness to -14 LUFS, true-peak guard
    tmp = f'{HERE}/_bus.wav'; sf.write(tmp, out, SR)
    y = subprocess.run(['ffmpeg', '-v', 'error', '-i', tmp, '-af', 'highpass=f=70,acompressor=threshold=-20dB:ratio=2:attack=8:release=120:makeup=1', '-f', 'f32le', '-'], capture_output=True).stdout
    out = np.frombuffer(y, np.float32).reshape(-1, 2)[:N].copy()
    L = pyln.Meter(SR).integrated_loudness(out); out *= 10 ** ((-14 - L) / 20)
    lim = 10 ** (-1.5 / 20); pk = np.abs(out).max(1)
    need = np.minimum(1, lim / np.maximum(pk, 1e-9))
    from scipy.ndimage import minimum_filter1d
    la = int(0.005 * SR); g = minimum_filter1d(need, 2 * la + 1, mode='wrap')
    rel = np.exp(-1 / (0.08 * SR)); gs = g.copy()
    for _ in range(2):  # release smoothing, run twice so the loop wraps cleanly
        acc = gs[-1]
        for k in range(len(gs)):
            acc = g[k] if g[k] < acc else g[k] + (acc - g[k]) * rel
            gs[k] = acc
    out = out * gs[:, None]
    sf.write(f'{HERE}/mix.wav', out, SR)
    return out

if __name__ == '__main__':
    import os; os.makedirs(f'{HERE}/vo', exist_ok=True)
    lines, total = process()
    for l in lines: print(l['i'], l['sp'], round(l['start'], 2), round(l['dur'], 2), [w['w'] for w in l['words']][:4], l['events'])
    print('TOTAL', total)
