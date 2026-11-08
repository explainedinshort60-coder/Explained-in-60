"""022 powerball cutaway source (Where Your Money Goes). Beats (frames @24fps):
 CK   0-170 giant check $847,000,000 with confetti (myth); 120-160 it droops: VIBE | AN 170-380 30 annuity bars, NOW, +5% a year
 CA 380-560 the pot: $363.1M cash today, dotted ghost of the $847M                 | GR 560-720 invested 29 years, grows into the ad number
 TX 720-880 24% sliced off by the IRS, then up to 37% at tax time                   | OD 880-1000 wall of tickets, one gold: 1 in 292,201,338
Run: python3 episode.py frames 0,100,200 OUT_DIR"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'engine'))
from lib import *
HERE = os.path.dirname(os.path.abspath(__file__))
props_js = os.path.join(HERE, 'props.js')
N = 1000
def r(f, a, b, e='io'): return kv([(a, 0, 'io'), (b, 1, e)], f)
SCENES = [(0, 'CK'), (170, 'AN'), (380, 'CA'), (560, 'GR'), (720, 'TX'), (880, 'OD')]
CTR = {'CK': (600, 400), 'AN': (2600, 440), 'CA': (4600, 440), 'GR': (6600, 420), 'TX': (8600, 350), 'OD': (10600, 410)}
def scene(f):
    s = 'CK'
    for a, k in SCENES:
        if f >= a: s = k
    return s
def T(f):
    return {'sc': scene(f), 'droop': r(f, 120, 150),
            'bars': r(f, 180, 300, 'lin'), 'now': r(f, 182, 195), 'pct': r(f, 310, 330),
            'cash': r(f, 390, 430), 'ghost': r(f, 460, 485),
            'grow': r(f, 570, 690),
            'bar': r(f, 725, 740), 'cut': r(f, 760, 785), 'top': r(f, 820, 840),
            'grid': r(f, 885, 945, 'lin'), 'gold': r(f, 950, 965)}
def cam(f):
    s = scene(f); start = max(k for k, v in SCENES if v == s and k <= f)
    nxt = min([k for k, _ in SCENES if k > f] + [N]); u = (f - start) / max(1, nxt - start)
    w0 = 640 if s == 'CK' else 740; cx, cy = CTR[s]
    return {'cx': cx, 'cy': cy + 0.167 * w0, 'w': w0 * (1 - 0.05 * u)}
HL = []
def frame(f):
    return {'T': T(f), 'cam': cam(f),
            'hl': [{'part': h[2], 'label': h[3], 'dx': h[4], 'dy': h[5]} for h in HL if h[0] <= f < h[1]],
            'cap': '', 'badge': None, 'pop': None}
if __name__ == '__main__':
    cmd = sys.argv[1]
    if cmd == 'render': render(sys.modules[__name__], sys.argv[2])
    elif cmd == 'frames': render(sys.modules[__name__], sys.argv[3], [int(x) for x in sys.argv[2].split(',')])
