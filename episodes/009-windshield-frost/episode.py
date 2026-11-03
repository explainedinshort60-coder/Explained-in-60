"""Episode 009: Why there is frost on your windshield when it is not freezing (the air thermometer reads about four feet up,
the glass leans back and radiates heat to the clear night sky, it drops below freezing while the air stays above,
water vapor turns straight into ice on it; a carport roof, clouds or a tree send heat back down and keep it clear).
Cutaway source for the podcast (no presenter). Run: python3 episode.py frames 0,100,200 OUT_DIR"""
import os, sys, math
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'engine'))
from lib import *
HERE = os.path.dirname(os.path.abspath(__file__))
props_js = os.path.join(HERE, 'props.js')
N = 1100
# beats: A 0-100 hook: frost spreads at 37 F | B 100-200 air thermometer, 4 FT | C 200-300 glass faces the sky (tilt up)
#        D 300-420 invisible heat leaves for the sky | E 420-520 glass 30 F vs air 37 F | F 520-640 vapor lands, turns to ice
#        G 640-760 frosted car shivers (spare) | H 760-880 carport: roof sends heat back, glass clears
#        I 880-990 clouds blanket | J 990-1100 tree
FROST = [(0, 0.12, 'io'), (12, 0.12, 'io'), (92, 1, 'out'), (104, 1, 'io'), (122, 0, 'io'), (560, 0, 'io'), (636, 0.65, 'io'),
         (650, 1, 'io'), (790, 1, 'io'), (850, 0, 'io')]
THERM = [(0, 1, 'io'), (200, 1, 'io'), (215, 0, 'io'), (430, 0, 'io'), (446, 1, 'io'), (520, 1, 'io'), (535, 0, 'io')]
FEET = [(0, 0, 'io'), (128, 0, 'io'), (146, 1, 'out'), (196, 1, 'io'), (206, 0, 'io')]
GDIAL = [(0, 0, 'io'), (430, 0, 'io'), (444, 1, 'out'), (516, 1, 'io'), (528, 0, 'io')]
GTEMP = [(0, 37, 'io'), (446, 37, 'io'), (500, 30, 'io')]
HEATK = [(0, 0, 'io'), (318, 0, 'io'), (334, 1, 'io'), (520, 1, 'io'), (532, 0, 'io'), (770, 0, 'io'), (790, 1, 'io'), (1100, 1, 'io')]
BACK = [(0, 0, 'io'), (360, 0, 'io'), (374, 1, 'io'), (418, 1, 'io'), (428, 0, 'io')]
VAP = [(0, 0, 'io'), (522, 0, 'io'), (536, 1, 'io'), (636, 1, 'io'), (644, 0, 'io')]
STICK = [(0, 0, 'io'), (566, 0, 'io'), (628, 1, 'io')]
PORT = [(0, 0, 'io'), (762, 0, 'io'), (800, 1, 'out'), (880, 1, 'io'), (900, 0, 'in')]
CLOUD = [(0, 0, 'io'), (890, 0, 'io'), (930, 1, 'out'), (986, 1, 'io'), (1000, 0, 'io')]
TREE = [(0, 0, 'io'), (996, 0, 'io'), (1030, 1, 'back')]
DOWN = [(0, 0, 'io'), (800, 0, 'io'), (812, 1, 'io'), (878, 1, 'io'), (886, 0, 'io'), (930, 0, 'io'), (942, 1, 'io'), (984, 1, 'io'),
        (994, 0, 'io'), (1030, 0, 'io'), (1042, 1, 'io')]
def T(f):
    return {'frost': kv(FROST, f), 'therm': kv(THERM, f), 'feet': kv(FEET, f), 'gdial': kv(GDIAL, f), 'gtemp': kv(GTEMP, f),
            'heat': kv(HEATK, f), 'back': kv(BACK, f), 'vapor': kv(VAP, f), 'stick': kv(STICK, f), 'port': kv(PORT, f),
            'cloud': kv(CLOUD, f), 'tree': kv(TREE, f), 'down': kv(DOWN, f), 'shiver': 4 if 660 <= f < 750 else 0}
WIDE = (560, 640, 1150); HOOKC = (500, 590, 900); THERMO = (250, 513, 760); SKY = (560, 120, 1150); CLOSE = (560, 494, 700)
TALL = (560, 330, 1300)
CAM = [(0, HOOKC, 'io'), (96, WIDE, 'io'), (110, WIDE, 'io'), (130, THERMO, 'io'), (196, THERMO, 'io'), (212, CLOSE, 'io'),
       (240, CLOSE, 'io'), (296, SKY, 'io'), (310, TALL, 'io'), (420, TALL, 'io'), (434, WIDE, 'io'), (520, WIDE, 'io'),
       (532, CLOSE, 'io'), (636, (560, 494, 640), 'lin'), (640, WIDE, 'cut'), (760, (560, 610, 1050), 'lin'),
       (761, TALL, 'cut'), (880, TALL, 'io'), (900, TALL, 'io'), (1100, (560, 300, 1250), 'lin')]
HL = [(132, 196, 'air', 'AIR 37°F', 60, 0), (214, 250, 'glass', 'GLASS', 60, 0), (262, 300, 'sky', 'CLEAR SKY', -280, 0),
      (336, 418, 'heat', 'INVISIBLE HEAT', -200, 0), (500, 520, 'dial', 'GLASS 30°F', -300, 0),
      (540, 590, 'vapor', 'WATER VAPOR', -160, 0), (600, 636, 'ice', 'ICE', -60, 0),
      (804, 878, 'roof', 'CARPORT', -120, 0), (934, 986, 'cloud', 'CLOUDS', -200, 0), (1036, 1100, 'tree', 'TREE', -300, 0)]
def pop(f):
    if 610 <= f < 636: return {'x': 200, 'y': 250, 's': min(1, (f - 610) / 4 + .3), 'text': 'ICE!'}
    if 664 <= f < 700: return {'x': 160, 'y': 120, 's': min(1, (f - 664) / 4 + .3), 'text': 'BRRR'}
    return None
def frame(f):
    return {'T': T(f), 'cam': dict(zip(('cx', 'cy', 'w'), kv(CAM, f))),
            'hl': [{'part': h[2], 'label': h[3], 'dx': h[4], 'dy': h[5]} for h in HL if h[0] <= f < h[1]],
            'cap': '', 'badge': None, 'pop': pop(f)}
if __name__ == '__main__':
    cmd = sys.argv[1]
    if cmd == 'render': render(sys.modules[__name__], sys.argv[2])
    elif cmd == 'frames': render(sys.modules[__name__], sys.argv[3], [int(x) for x in sys.argv[2].split(',')])
