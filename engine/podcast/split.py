"""Usage: python3 engine/podcast/split.py episodes/<id>/podcast
Split one-passage-per-speaker ElevenLabs takes into script lines using Scribe word timings.
Writes EPDIR/vo_raw/lNN.wav and EPDIR/lines.json (speaker, text, tags, words relative to the clip)."""
import json, re, sys, subprocess, os
SR = 48000
def groups(words):
    out, cur, k = [], [], 0
    while k < len(words):
        t = words[k]['text']
        if t == '[long' and k + 1 < len(words) and words[k + 1]['text'] == 'pause]':
            out.append(cur); cur = []; k += 2; continue
        cur.append(words[k]); k += 1
    out.append(cur); return out
def split(epdir):
    sys.path.insert(0, epdir); import script as SC
    parts = SC.PARTS if hasattr(SC, 'PARTS') else [SC.LINES]   # long-form: one ElevenLabs take per host per part
    lines = [l for p in parts for l in p]
    os.makedirs(f'{epdir}/vo_raw', exist_ok=True); res = [None] * len(lines)
    off = 0
    for pn, part in enumerate(parts):
        pre = f'p{pn}' if hasattr(SC, 'PARTS') else ''
        _split_part(epdir, part, off, pre, lines, res); off += len(part)
    json.dump(res, open(f'{epdir}/lines.json', 'w'), indent=1)
    return res
def _split_part(epdir, part, off, pre, lines, res):
    for sp in 'BO':
        idx = [off + i for i, (s, _) in enumerate(part) if s == sp]
        if not idx: continue
        W = json.load(open(f'{epdir}/words/{pre}{sp}.json'))['words']
        G = [g for g in groups(W) if g]
        assert len(G) == len(idx), (pre, sp, len(G), len(idx))
        dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f'{epdir}/raw/{pre}{sp}.mp3'], capture_output=True, text=True).stdout)
        for n, (i, g) in enumerate(zip(idx, G)):
            a = 0.0 if n == 0 else (G[n - 1][-1]['end'] + g[0]['start']) / 2
            b = dur if n == len(G) - 1 else (g[-1]['end'] + G[n + 1][0]['start']) / 2
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'{epdir}/raw/{pre}{sp}.mp3', '-ss', f'{a:.3f}', '-to', f'{b:.3f}', '-ac', '1', '-ar', str(SR), f'{epdir}/vo_raw/l{i:02d}.wav'], check=True)
            ws, inb = [], False
            for w in g:
                t = w['text']
                if t.startswith('['): inb = True
                if not inb: ws.append({'w': t, 's': round(w['start'] - a, 3), 'e': round(w['end'] - a, 3)})
                if t.endswith(']'): inb = False
            tags = re.findall(r'\[([^\]]+)\]', lines[i][1])
            res[i] = {'i': i, 'sp': sp, 'text': re.sub(r'\[[^\]]+\]\s*', '', lines[i][1]).strip(), 'tags': tags, 'words': ws}
if __name__ == '__main__':
    for l in split(os.path.abspath(sys.argv[1])): print(l['i'], l['sp'], l['tags'], ' '.join(w['w'] for w in l['words']))
