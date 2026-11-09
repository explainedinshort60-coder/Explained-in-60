"""023 wash turkey cutaway source (You've Been Doing It Wrong). Beats (frames @24fps):
 TP   0-150 hook: raw turkey under the running tap, germy droplets fly at the camera
 SP 150-400 splash map: droplets arc onto the SINK, the COUNTER and the SALAD
 ST 400-600 USDA study: 60% bacteria in the sink, 26% on the salad
 HT 600-800 rinse crossed out; thermometer climbs to 165°F, germs pop, the bird turns golden
 SK 800-950 scrub the sink with hot, soapy water
Run: python3 episode.py frames 0,100,200 OUT_DIR"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'engine'))
from lib import *
HERE = os.path.dirname(os.path.abspath(__file__))
props_js = os.path.join(HERE, 'props.js')
N = 950
def r(f, a, b, e='io'): return kv([(a, 0, 'io'), (b, 1, e)], f)
SCENES = [(0, 'TP'), (150, 'SP'), (400, 'ST'), (600, 'HT'), (800, 'SK')]
CTR = {'TP': (600, 420), 'SP': (2600, 520), 'ST': (4600, 380), 'HT': (6600, 440), 'SK': (8600, 520)}
W0 = {'TP': 680, 'SP': 1000, 'ST': 900, 'HT': 900, 'SK': 900}
def scene(f):
    s = 'TP'
    for a, k in SCENES:
        if f >= a: s = k
    return s
def T(f):
    return {'sc': scene(f), 'flow': r(f, 0, 6), 'spray': 0.34 + f / 36.0,
            'arcs': r(f, 160, 300, 'lin'), 'l1': r(f, 200, 215), 'l2': r(f, 240, 255), 'l3': r(f, 290, 305),
            'head': r(f, 405, 420), 'c1': r(f, 420, 440), 'n1': r(f, 425, 450), 'c2': r(f, 500, 520), 'n2': r(f, 505, 530),
            'norinse': r(f, 605, 620), 'therm': r(f, 640, 760, 'lin'), 'cook': r(f, 640, 780),
            'scrub': r(f, 805, 815), 'suds': r(f, 810, 900, 'lin')}
def cam(f):
    s = scene(f); start = max(k for k, v in SCENES if v == s and k <= f)
    nxt = min([k for k, _ in SCENES if k > f] + [N]); u = (f - start) / max(1, nxt - start)
    w0 = W0[s]; cx, cy = CTR[s]
    if s == 'TP': return {'cx': cx, 'cy': cy + 0.167 * w0, 'w': w0 * (1 - 0.08 * u)}
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
