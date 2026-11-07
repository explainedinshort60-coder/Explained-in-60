"""Episode 015: why your touchscreen ignores you when you wear gloves (a grid of tiny wires under the glass holds a little
charge; skin conducts, so a touch pulls some charge into your finger and the grid feels the dip at that spot = a tap;
wool and leather do not conduct, so nothing changes; a sausage conducts (salty, wet); touchscreen gloves have conductive
thread in the fingertips that carries the charge into you). Sources: HKUST Science Focus, The North Face FAQ, MakeUseOf (research.md).
Cutaway source for the podcast (no presenter). Run: python3 episode.py frames 0,100,200 OUT_DIR"""
import os, sys, math
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'engine'))
from lib import *
HERE = os.path.dirname(os.path.abspath(__file__))
props_js = os.path.join(HERE, 'props.js')
N = 980
# beats: A 0-100 hook: bus stop, phone ringing MOM, red glove jabs the answer button, nothing | B 100-200 x-ray: the wire grid
#        C 200-280 charge sparks on the grid | D 280-400 section: bare finger, charge flows up into it
#        E 400-480 phone: bare finger touches, the dip ring, TAP! | F 480-580 section: knit glove, charge bounces back, X
#        G 580-660 phone: glove touches, nothing, the hand goes ghost, X | H 660-760 phone: a sausage in a gloved fist, dip, TAP!
#        I 760-840 touchscreen glove close-up: silver thread tips | J 840-980 section: thread glove, charge runs up the thread, check
def tapc(f):
    if f >= 100: return 0
    u = (f % 22) / 22.0
    return max(0.0, 1 - abs(u - 0.5) * 4) ** 0.6 if 0.25 < u < 0.75 else 0.0
XR = [(0, 0, 'io'), (110, 0, 'io'), (150, 1, 'io')]
SP = [(0, 0, 'io'), (200, 0, 'io'), (225, 1, 'io')]
def seg(f, a, b, ease='io'):
    return kv([(0, 0, ease), (a, 0, ease), (b, 1, ease)], f)
def T(f):
    t = {'tap': tapc(f), 'xray': kv(XR, f), 'spark': kv(SP, f), 'hand': 0, 'reach': 0, 'dip': 0, 'ok': 0, 'fail': 0, 'ghost': 0,
         'zmode': 0, 'press': 0, 'flow': 0, 'block': 0, 'zok': 0, 'zx': 0, 'shine': 0}
    if 280 <= f < 400: t.update(zmode=0, press=seg(f, 290, 315), flow=1 if f >= 318 else 0, zok=seg(f, 360, 368))
    if 400 <= f < 480: t.update(hand=1, reach=seg(f, 400, 425), dip=seg(f, 427, 470, 'lin'), ok=seg(f, 448, 456))
    if 480 <= f < 580: t.update(zmode=1, press=seg(f, 490, 515), block=1 if f >= 515 else 0, zx=seg(f, 545, 553))
    if 580 <= f < 660: t.update(hand=2, reach=seg(f, 585, 608), fail=seg(f, 612, 620), ghost=seg(f, 622, 645))
    if 660 <= f < 760: t.update(hand=3, reach=seg(f, 665, 690), dip=seg(f, 692, 745, 'lin'), ok=seg(f, 712, 720))
    if 760 <= f < 840: t.update(shine=seg(f, 770, 790))
    if f >= 840: t.update(zmode=2, press=seg(f, 850, 870), flow=1 if f >= 872 else 0, zok=seg(f, 915, 923))
    return t
HC = (540, 520, 1000); PW = (2960, 560, 1000); PC = (3010, 560, 860); ZC = (5000, 540, 1000); IC = (7000, 600, 1000)
CAM = [(0, HC, 'io'), (100, (540, 500, 940), 'lin'), (101, PW, 'cut'), (200, (2960, 540, 940), 'lin'), (280, (2980, 540, 900), 'lin'),
       (281, ZC, 'cut'), (400, (5000, 520, 940), 'lin'), (401, PC, 'cut'), (480, (3010, 540, 820), 'lin'),
       (481, ZC, 'cut'), (580, (5000, 520, 940), 'lin'), (581, PC, 'cut'), (660, (3010, 540, 820), 'lin'),
       (661, PC, 'cut'), (760, (3010, 540, 820), 'lin'), (761, IC, 'cut'), (840, (7000, 560, 900), 'lin'),
       (841, ZC, 'cut'), (980, (5000, 520, 920), 'lin')]
HL = [(125, 200, 'grid', 'WIRE GRID', -120, 0), (210, 280, 'charge', 'TINY CHARGE', -120, 0),
      (322, 400, 'flow', 'CHARGE FLOWS IN', -330, 0), (452, 480, 'dip', 'DIP = TAP', -330, 0),
      (518, 580, 'knit', 'WOOL BLOCKS IT', -300, 0), (625, 660, 'glove', 'NOBODY HERE', -380, 0),
      (695, 760, 'sausage', 'SALTY + WET', -380, 0), (775, 840, 'patch', 'CONDUCTIVE THREAD', -330, 0),
      (876, 980, 'thread', 'THREAD CARRIES IT', -330, 0)]
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
