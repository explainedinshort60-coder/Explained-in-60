"""021 bread cutaway source (viewer request, @Ducksonic12). Beats (frames @24fps):
 BR   0-100 loaf with a bicycle pump (the myth), pumping       | YE 100-260 yeast appear, eat sugar, burp CO2, alcohol drops
 GL 260-420 proteins link into a gluten net, burps get trapped | DO 420-520 dough doubles in a bowl
 OV 520-700 oven spring, 140 F, yeast die, crumb sets, alcohol wisps out | TO 700-800 toast holes = frozen burps
Run: python3 episode.py frames 0,100,200 OUT_DIR"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'engine'))
from lib import *
HERE = os.path.dirname(os.path.abspath(__file__))
props_js = os.path.join(HERE, 'props.js')
N = 800
def r(f, a, b, e='io'): return kv([(a, 0, 'io'), (b, 1, e)], f)
SCENES = [(0, 'BR'), (100, 'YE'), (260, 'GL'), (420, 'DO'), (520, 'OV'), (700, 'TO')]
CTR = {'BR': (610, 450), 'YE': (2600, 400), 'GL': (4600, 440), 'DO': (6600, 430), 'OV': (8600, 380), 'TO': (10600, 450)}
def scene(f):
    s = 'BR'
    for a, k in SCENES:
        if f >= a: s = k
    return s
def T(f):
    return {'sc': scene(f), 'pump': r(f, 2, 12), 
            'yeast': r(f, 104, 130), 'eat': r(f, 130, 200, 'lin'), 'burp': r(f, 150, 170), 'alc': r(f, 205, 225),
            'link': r(f, 290, 345), 'trap': r(f, 350, 410, 'lin'),
            'rise': r(f, 430, 505),
            'spring': r(f, 530, 590), 'therm': r(f, 570, 580), 'temp': kv([(0, 80, 'io'), (580, 80, 'io'), (630, 141, 'io')], f),
            'die': r(f, 628, 636), 'set': r(f, 645, 660), 'wisp': r(f, 660, 680),
            'lab': r(f, 715, 770, 'lin')}
def cam(f):
    s = scene(f); start = max(k for k, v in SCENES if v == s and k <= f)
    nxt = min([k for k, _ in SCENES if k > f] + [N]); u = (f - start) / max(1, nxt - start)
    w0 = {'BR': 840, 'YE': 820}.get(s, 940); cx, cy = CTR[s]
    return {'cx': cx, 'cy': cy + 0.167 * w0, 'w': w0 * (1 - 0.06 * u)}
HL = [(20, 95, 'pump', 'THE "PUMP"', -420, 0), (135, 200, 'sugar', 'SUGAR', -60, 120), (300, 340, 'net', 'GLUTEN', -60, -360),
      (590, 640, 'window', 'YEAST', -360, 0)]
def frame(f):
    return {'T': T(f), 'cam': cam(f),
            'hl': [{'part': h[2], 'label': h[3], 'dx': h[4], 'dy': h[5]} for h in HL if h[0] <= f < h[1]],
            'cap': '', 'badge': None, 'pop': None}
if __name__ == '__main__':
    cmd = sys.argv[1]
    if cmd == 'render': render(sys.modules[__name__], sys.argv[2])
    elif cmd == 'frames': render(sys.modules[__name__], sys.argv[3], [int(x) for x in sys.argv[2].split(',')])
