"""Episode 019: why can you see your breath when it's cold? (your lungs are damp, so breath out is warm and full of invisible
water vapor; outside it hits cold air and loses heat; at its dew point some vapor condenses into thousands of tiny droplets,
a very small, very temporary cloud; clouds and fog form the same way; the droplets evaporate again a second later; humidity
matters too, so on a humid morning you can see it in the 40s and on a dry day you may not). Sources in research.md.
Cutaway source for the podcast (no presenter). Run: python3 episode.py frames 0,100,200 OUT_DIR"""
import os, sys, math
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'engine'))
from lib import *
HERE = os.path.dirname(os.path.abspath(__file__))
props_js = os.path.join(HERE, 'props.js')
N = 1000
# beats: A 0-100 hook: winter morning, a huge white breath cloud, "?" | B 100-200 lungs, damp drops appear
#        C 200-290 indoors: breath out as invisible vapor dots, warm glow | D 290-380 outside: cold air, thermometer drops, dots slow
#        E 380-470 magnifier: dots slow to the dew point and clump into droplets | F 470-560 the puff becomes a droplet cloud
#        G 560-650 tiny cloud, crown pops on (majestic gag) | H 650-740 real clouds and morning fog, same way
#        I 740-830 forecast card PARTLY CLOUDY, MOSTLY ANNOYING | J 830-910 poof: droplets evaporate back to vapor
#        K 910-1000 split: humid morning 45 F visible puff vs dry day 45 F barely any
def seg(f, a, b, ease='io'):
    return kv([(0, 0, ease), (a, 0, ease), (b, 1, ease)], f)
def T(f):
    t = {'blow': 0, 'damp': 0, 'vap': 0, 'cold': 0, 'therm': 0, 'slow': 0, 'cond': 0, 'cloud': 0, 'crown': 0, 'fog': 0, 'card': 0,
         'poof': 0, 'split': 0}
    if f < 100: t.update(blow=0.7 + 0.3 * seg(f, 0, 60))
    if 100 <= f < 200: t.update(damp=seg(f, 115, 170))
    if 200 <= f < 290: t.update(vap=seg(f, 205, 250, 'lin'))
    if 290 <= f < 380: t.update(cold=seg(f, 293, 320), therm=seg(f, 300, 350), slow=seg(f, 320, 372))
    if 380 <= f < 470: t.update(therm=seg(f, 385, 425), cond=seg(f, 420, 462))
    if 470 <= f < 560: t.update(cloud=seg(f, 474, 530))
    if 560 <= f < 650: t.update(crown=seg(f, 603, 640, 'lin'))
    if 650 <= f < 740: t.update(fog=seg(f, 680, 720))
    if 740 <= f < 830: t.update(card=seg(f, 748, 760) + seg(f, 790, 800))
    if 830 <= f < 910: t.update(poof=seg(f, 845, 880))
    if f >= 910: t.update(split=seg(f, 915, 960))
    return t
def C(x, w=1000, y=560): return (x, y, w)
CAM = [(0, C(560, 1060, 540), 'io'), (100, C(560, 1000, 540), 'lin'),
       (101, C(2540, 1000), 'cut'), (200, C(2540, 920, 600), 'lin'),
       (201, C(4520, 1000), 'cut'), (290, C(4560, 940), 'lin'),
       (291, C(6560, 1040), 'cut'), (380, C(6560, 980), 'lin'),
       (381, C(8560, 1040), 'cut'), (470, C(8520, 960), 'lin'),
       (471, C(10560, 1060), 'cut'), (560, C(10600, 1000), 'lin'),
       (561, C(12560, 1000), 'cut'), (650, C(12580, 920, 540), 'lin'),
       (651, C(14540, 1080), 'cut'), (740, C(14540, 1020), 'lin'),
       (741, C(16540, 1000), 'cut'), (830, C(16540, 960), 'lin'),
       (831, C(18560, 1060), 'cut'), (910, C(18580, 1000), 'lin'),
       (911, C(20540, 1400, 560), 'cut'), (1000, C(20540, 1360, 560), 'lin')]
HL = [(125, 200, 'lungs', 'DAMP LUNGS', -380, 0), (225, 290, 'vapor', 'INVISIBLE VAPOR', -470, 0), (320, 380, 'cold', 'COLD AIR', -380, 0),
      (425, 470, 'dew', 'DEW POINT', -520, 0), (520, 560, 'drop', 'TINY DROPLETS', -560, 0), (700, 740, 'hcloud', 'SAME WAY', -200, 0),
      (870, 910, 'poof', 'EVAPORATES', -300, 0)]
def pop(f):
    if 852 <= f < 905: return {'x': 18540 + 20, 'y': 300, 's': min(1.0, (f - 852) / 6.0), 'text': 'POOF!'}
    return None
def frame(f):
    return {'T': T(f), 'cam': dict(zip(('cx', 'cy', 'w'), kv(CAM, f))),
            'hl': [{'part': h[2], 'label': h[3], 'dx': h[4], 'dy': h[5]} for h in HL if h[0] <= f < h[1]],
            'cap': '', 'badge': None, 'pop': pop(f)}
if __name__ == '__main__':
    cmd = sys.argv[1]
    if cmd == 'render': render(sys.modules[__name__], sys.argv[2])
    elif cmd == 'frames': render(sys.modules[__name__], sys.argv[3], [int(x) for x in sys.argv[2].split(',')])
