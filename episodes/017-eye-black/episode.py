"""Episode 017: does eye black really work? (sunlight bounces off the cheekbones into the eyes = glare that washes out the
ball; black grease soaks up that light; the 2003 Yale test in bright sunlight found grease improved contrast sensitivity a
little, anti-glare stickers and petroleum jelly did not; players used to smear on burnt cork). Sources in research.md.
Cutaway source for the podcast (no presenter). Run: python3 episode.py frames 0,100,200 OUT_DIR"""
import os, sys, math
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'engine'))
from lib import *
HERE = os.path.dirname(os.path.abspath(__file__))
props_js = os.path.join(HERE, 'props.js')
N = 1000
# beats: A 0-100 hook: game day sun, ball drops out of the glare, player with eye black squints, "?"
#        B 100-200 profile: a sun ray travels down to the cheekbone | C 200-290 it bounces up into the eye, flare, squint
#        D 290-380 the view: ball washed out next to the sun | E 380-470 profile: grease paints on, the ray is soaked up, check
#        F 470-560 the 2003 eye chart test: rows fade, 3 rows read | G 560-650 with grease one more row, +1
#        H 650-740 profile: logo sticker slaps on, the ray still bounces, flare, X | I 740-830 scoreboard rows
#        J 830-910 profile: grape jelly smear (gag), X | K 910-1000 profile: burnt cork rubs on a black smudge
def seg(f, a, b, ease='io'):
    return kv([(0, 0, ease), (a, 0, ease), (b, 1, ease)], f)
def T(f):
    t = {'drop': ((f % 100) / 100.0) if f < 100 else 0, 'pmode': 0, 'paint': 0, 'ray': 0, 'bounce': 0, 'flare': 0, 'soak': 0,
         'ok': 0, 'no': 0, 'rub': 0, 'wash': 0, 'chart': 0, 'rows': 0, 'extra': 0, 'cok': 0, 'sb': 0}
    if 100 <= f < 200: t.update(ray=seg(f, 110, 180))
    if 200 <= f < 290: t.update(ray=1, bounce=seg(f, 205, 235), flare=seg(f, 233, 245))
    if 290 <= f < 380: t.update(wash=seg(f, 295, 330))
    if 380 <= f < 470: t.update(pmode=1, paint=seg(f, 383, 405), ray=seg(f, 405, 430), soak=seg(f, 430, 466, 'lin'), ok=seg(f, 448, 456))
    if 470 <= f < 560: t.update(chart=seg(f, 470, 490), rows=3 * seg(f, 495, 550, 'lin'))
    if 560 <= f < 650: t.update(chart=1, rows=3, extra=seg(f, 575, 600), cok=seg(f, 600, 608))
    if 650 <= f < 740: t.update(pmode=2, paint=seg(f, 652, 668), ray=seg(f, 670, 692), bounce=seg(f, 692, 708), flare=seg(f, 706, 716), no=seg(f, 716, 724))
    if 740 <= f < 830: t.update(sb=3 * seg(f, 745, 810, 'lin'))
    if 830 <= f < 910: t.update(pmode=3, paint=seg(f, 832, 860), no=seg(f, 868, 876))
    if f >= 910: t.update(pmode=4, rub=seg(f, 912, 975, 'lin'), paint=seg(f, 920, 978))
    return t
HC = (540, 560, 1000); PC = (3000, 560, 1000); PZ = (3060, 560, 820); VC = (5000, 520, 1000); CC = (7000, 520, 1000); SC = (9000, 520, 1000)
CAM = [(0, HC, 'io'), (100, (540, 560, 960), 'lin'),
       (101, PC, 'cut'), (200, (3020, 560, 940), 'lin'), (201, (3020, 560, 940), 'cut'), (290, PZ, 'lin'),
       (291, VC, 'cut'), (380, (5040, 440, 880), 'lin'),
       (381, PZ, 'cut'), (470, (3070, 560, 780), 'lin'),
       (471, CC, 'cut'), (560, (7000, 520, 960), 'lin'), (561, (7000, 520, 960), 'cut'), (650, (7030, 560, 960), 'lin'),
       (651, PZ, 'cut'), (740, (3070, 560, 780), 'lin'),
       (741, SC, 'cut'), (830, (9000, 500, 960), 'lin'),
       (831, PZ, 'cut'), (910, (3070, 560, 780), 'lin'), (911, PZ, 'cut'), (1000, (3070, 570, 760), 'lin')]
HL = [(130, 200, 'cheek', 'CHEEKBONE', -420, 0), (240, 290, 'eye', 'GLARE', -360, 0), (320, 380, 'ball', 'WASHED OUT', -380, 0),
      (430, 470, 'stripe', 'SOAKS UP LIGHT', -470, 0), (700, 740, 'sticker', 'STICKER', -420, 0),
      (870, 910, 'jelly', 'WRONG JELLY', -460, 0), (930, 1000, 'cork', 'BURNT CORK', -470, 0)]
def pop(f):
    return None
def frame(f):
    return {'T': T(f), 'cam': dict(zip(('cx', 'cy', 'w'), kv(CAM, f))),
            'hl': [{'part': h[2], 'label': h[3], 'dx': h[4], 'dy': h[5]} for h in HL if h[0] <= f < h[1]],
            'cap': '', 'badge': None, 'pop': pop(f)}
if __name__ == '__main__':
    cmd = sys.argv[1]
    if cmd == 'render': render(sys.modules[__name__], sys.argv[2])
    elif cmd == 'frames': render(sys.modules[__name__], sys.argv[3], [int(x) for x in sys.argv[2].split(',')])
