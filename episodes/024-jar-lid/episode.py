"""024 jar lid cutaway source (You've Been Doing It Wrong). Beats (frames @24fps):
 HK   0-150 hook: pickle jar, a hand straining on the gold lid, STUCK!
 VC 150-400 cross-section: LESS AIR inside, crowds of air outside, the sky's AIR PUSH arrows on the lid
 FR 400-520 lid edge close-up: seal jammed on the rim, FRICTION
 SP 520-720 spoon under the lid edge, lift, air rushes in, HSSS!, push arrows vanish, SEAL BROKEN
 HW 720-920 hot tap water: METAL GROWS, GLASS BARELY, lid loosens, twist, IT OPENS!
Run: python3 episode.py frames 0,100,200 OUT_DIR"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'engine'))
from lib import *
HERE = os.path.dirname(os.path.abspath(__file__))
props_js = os.path.join(HERE, 'props.js')
N = 920
def r(f, a, b, e='io'): return kv([(a, 0, 'io'), (b, 1, e)], f)
SCENES = [(0, 'HK'), (150, 'VC'), (400, 'FR'), (520, 'SP'), (720, 'HW')]
CTR = {'HK': (600, 230), 'VC': (2600, 250), 'FR': (4560, 420), 'SP': (6560, 260), 'HW': (8600, 300)}
W0 = {'HK': 820, 'VC': 1060, 'FR': 1060, 'SP': 1000, 'HW': 1000}
def scene(f):
    s = 'HK'
    for a, k in SCENES:
        if f >= a: s = k
    return s
def T(f):
    return {'sc': scene(f), 'strain': 1.0,
            'dots': r(f, 155, 175), 'vac': r(f, 215, 235), 'press': r(f, 290, 330),
            'push': r(f, 402, 412), 'jam': r(f, 420, 440), 'fric': r(f, 470, 490),
            'slide': r(f, 545, 590), 'lift': r(f, 610, 640), 'inflow': r(f, 640, 690, 'lin'), 'hiss': r(f, 660, 672), 'free': r(f, 690, 705),
            'water': r(f, 728, 745), 'grow': r(f, 790, 830), 'glass': r(f, 815, 835), 'twist': r(f, 878, 905), 'pop': r(f, 895, 910)}
def cam(f):
    s = scene(f); start = max(k for k, v in SCENES if v == s and k <= f)
    nxt = min([k for k, _ in SCENES if k > f] + [N]); u = (f - start) / max(1, nxt - start)
    w0 = W0[s]; cx, cy = CTR[s]
    if s == 'HK': return {'cx': cx, 'cy': cy + 0.167 * w0, 'w': w0 * (1 - 0.08 * u)}
    if s == 'SP': return {'cx': cx + 40 * u, 'cy': cy + 0.167 * w0 - 30 * u, 'w': w0 * (1 - 0.12 * u)}
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
