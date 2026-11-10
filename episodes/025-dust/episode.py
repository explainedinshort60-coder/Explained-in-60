"""025 dust cutaway source (Is It Really?). Beats (frames @24fps):
 HK   0-150 hook: floor heat register, Blue's breath blows a gray dust cloud up, ALL DEAD SKIN?
 MG 150-300 magnifier on a dust bunny: soil, pollen, fibers, a few skin chips; FROM OUTSIDE
 HS 300-500 house cutaway: SHOES, PAWS track dirt in the door, AIR bits float in the window
 PC 500-700 the pile as one bar: 60%+ OUTDOORS, a tiny yard sprouts; then SKIN, FIBERS
 DR 700-800 inside the front door: GOOD MAT, SHOES OFF
 FL 800-920 furnace filter: OLD one out, clean one in, floating dust TRAPPED
Run: python3 episode.py frames 0,100,200 OUT_DIR"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'engine'))
from lib import *
HERE = os.path.dirname(os.path.abspath(__file__))
props_js = os.path.join(HERE, 'props.js')
N = 920
def r(f, a, b, e='io'): return kv([(a, 0, 'io'), (b, 1, e)], f)
SCENES = [(0, 'HK'), (150, 'MG'), (300, 'HS'), (500, 'PC'), (700, 'DR'), (800, 'FL')]
CTR = {'HK': (600, 330), 'MG': (2580, 380), 'HS': (4700, 460), 'PC': (6600, 330), 'DR': (8660, 560), 'FL': (10560, 520)}
W0 = {'HK': 1000, 'MG': 1060, 'HS': 1300, 'PC': 1080, 'DR': 1180, 'FL': 1300}
def scene(f):
    s = 'HK'
    for a, k in SCENES:
        if f >= a: s = k
    return s
def T(f):
    return {'sc': scene(f), 'blow': r(f, 0, 120),
            'mag': r(f, 152, 175), 'out': r(f, 200, 220) if f < 300 else r(f, 806, 836), 'skin': r(f, 250, 268) if f < 300 else r(f, 610, 630),
            'shoe': r(f, 310, 400, 'lin'), 'paw': r(f, 380, 420), 'air': r(f, 425, 445),
            'bar': 1, 'grow': r(f, 505, 560), 'yard': r(f, 565, 595), 'fib': r(f, 640, 660),
            'mat': r(f, 772, 790), 'off': r(f, 712, 740),
            'inn': r(f, 840, 860), 'trap': r(f, 862, 912, 'lin')}
def cam(f):
    s = scene(f); start = max(k for k, v in SCENES if v == s and k <= f)
    nxt = min([k for k, _ in SCENES if k > f] + [N]); u = (f - start) / max(1, nxt - start)
    w0 = W0[s]; cx, cy = CTR[s]
    if s == 'HK': return {'cx': cx, 'cy': cy + 0.167 * w0, 'w': w0 * (1 - 0.08 * u)}
    if s == 'HS': return {'cx': cx - 60 + 100 * u, 'cy': cy + 0.167 * w0, 'w': w0 * (1 - 0.06 * u)}
    if s == 'PC': return {'cx': cx, 'cy': cy + 0.167 * w0 - 20 * u, 'w': w0 * (1 - 0.07 * u)}
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
