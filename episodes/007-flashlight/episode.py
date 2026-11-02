"""Episode 007: Why a flashlight turns on when you click it (full loop, cells nose to tail, tail spring,
contact strip, switch gap bridged by a metal disc, clicky-pen style latch, rusty contacts and the eraser fix).
Cutaway source for the podcast (no presenter). Run: python3 episode.py frames 0,100,200 OUT_DIR"""
import os, sys, math
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'engine'))
from lib import *
HERE = os.path.dirname(os.path.abspath(__file__))
props_js = os.path.join(HERE, 'props.js')
N = 1100
# beats: A 0-100 wide click on | B 100-220 x-ray + loop | C 220-330 cells nose to tail + conga | D 330-430 spring
#        E 430-540 strip | F 540-640 off: gap | G 640-760 click: bridge, light | H 760-880 clicky latch on/off
#        I 880-1000 flicker + rust | J 1000-1100 eraser fix
PRESS = [(0, 0, 'io'), (50, 0, 'io'), (56, 1, 'in'), (64, 0, 'out'), (650, 0, 'io'), (656, 1, 'in'), (668, 0, 'out'),
         (784, 0, 'io'), (790, 1, 'in'), (800, 0, 'out'), (834, 0, 'io'), (840, 1, 'in'), (850, 0, 'out')]
BRIDGE = [(0, 0, 'io'), (52, 0, 'io'), (58, 1, 'out'), (548, 1, 'io'), (562, 0, 'io'), (656, 0, 'io'), (664, 1, 'out'),
          (759, 1, 'io'), (760, 0, 'cut'), (790, 0, 'io'), (796, 1, 'out'), (840, 1, 'io'), (846, 0, 'out'), (879, 0, 'io'), (880, 1, 'cut')]
XR = [(0, 0, 'io'), (100, 0, 'io'), (128, 1, 'io')]
ROT = [(0, 0, 'io'), (790, 0, 'io'), (800, 45, 'out'), (840, 45, 'io'), (850, 90, 'out')]
LOOP = [(0, 0, 'io'), (128, 0, 'io'), (206, 1, 'io'), (220, 1, 'io'), (232, 0, 'io')]
PM = [(0, 0, 'io'), (226, 0, 'io'), (240, 1, 'out'), (330, 1, 'io'), (342, 0, 'io')]
HOP = [(0, 0, 'io'), (262, 0, 'io'), (270, 1, 'io'), (326, 1, 'io'), (334, 0, 'io')]
STRIP = [(0, 0, 'io'), (434, 0, 'io'), (446, 1, 'io'), (536, 1, 'io'), (548, 0, 'io')]
GAP = [(0, 0, 'io'), (566, 0, 'io'), (578, 1, 'io'), (652, 1, 'io'), (660, 0, 'io')]
RUSTK = [(0, 0, 'io'), (884, 0, 'io'), (900, 1, 'io'), (1030, 1, 'io'), (1070, 0, 'io')]
ERA = [(0, 0, 'io'), (1000, 0, 'io'), (1012, 1, 'out'), (1084, 1, 'io'), (1096, 0, 'io')]
def squeeze(f):
    return 0.5 + 0.5 * math.sin((f - 340) / 12 * math.pi) if 340 <= f < 424 else 0
def on(f):
    b = kv(BRIDGE, f)
    if 880 <= f < 1000:  # flicker while shaking: rusty contact drops out
        return 1 if (int(f / 3) * 7 % 5) > 1 else 0.15
    return b
def T(f):
    o = on(f)
    return {'xr': kv(XR, f), 'on': o, 'press': kv(PRESS, f), 'bridge': kv(BRIDGE, f), 'flow': o if f >= 128 else 0,
            'loop': kv(LOOP, f), 'hop': kv(HOP, f), 'squeeze': squeeze(f), 'strip': kv(STRIP, f), 'gap': kv(GAP, f),
            'rot': kv(ROT, f), 'rust': kv(RUSTK, f), 'eraser': kv(ERA, f),
            'ex': 26 * math.sin((f - 1012) / 4) if 1012 <= f < 1084 else 0,
            'shake': 3.5 * math.sin(f / 2.2) if 884 <= f < 990 else 0, 'pm': kv(PM, f)}
WIDE = (600, 580, 1000); MED = (520, 600, 720); TAIL = (250, 590, 430); HEAD = (790, 600, 560)
CAM = [(0, WIDE, 'io'), (100, WIDE, 'io'), (128, (560, 600, 900), 'io'), (220, (560, 600, 900), 'io'), (240, MED, 'io'),
       (330, MED, 'io'), (350, TAIL, 'io'), (430, TAIL, 'io'), (440, (790, 600, 640), 'io'), (536, (300, 600, 640), 'lin'),
       (548, TAIL, 'io'), (640, TAIL, 'io'), (690, TAIL, 'io'), (730, WIDE, 'out'), (759, WIDE, 'io'), (760, TAIL, 'cut'),
       (879, TAIL, 'io'), (880, HEAD, 'cut'), (1000, HEAD, 'io'), (1100, (780, 600, 600), 'lin')]
HL = [(150, 220, 'loop', 'FULL LOOP', -150, 0), (240, 285, 'plus', 'PLUS', 60, 0), (285, 330, 'minus', 'MINUS', 40, 0),
      (355, 430, 'spring', 'SPRING', 40, 0), (446, 536, 'strip', 'METAL STRIP', -180, 0),
      (578, 640, 'gap', 'GAP', 60, 0), (668, 700, 'disc', 'CONTACT', 60, 0),
      (765, 880, 'switch', 'CLICKY SWITCH', -40, 0), (900, 1000, 'contact', 'RUST', -60, 0), (1030, 1084, 'contact', 'CLEAN', -60, 0)]
def pop(f):
    if 56 <= f < 84: return {'x': 120, 'y': 470, 's': min(1, (f - 56) / 4 + .3), 'text': 'CLICK!'}
    if 664 <= f < 690: return {'x': 160, 'y': 470, 's': min(1, (f - 664) / 4 + .3), 'text': 'LIGHT!'}
    if 796 <= f < 820: return {'x': 150, 'y': 480, 's': min(1, (f - 796) / 4 + .3), 'text': 'ON'}
    if 846 <= f < 870: return {'x': 150, 'y': 480, 's': min(1, (f - 846) / 4 + .3), 'text': 'OFF'}
    return None
def frame(f):
    return {'T': T(f), 'cam': dict(zip(('cx', 'cy', 'w'), kv(CAM, f))),
            'hl': [{'part': h[2], 'label': h[3], 'dx': h[4], 'dy': h[5]} for h in HL if h[0] <= f < h[1]],
            'cap': '', 'badge': None, 'pop': pop(f)}
if __name__ == '__main__':
    cmd = sys.argv[1]
    if cmd == 'render': render(sys.modules[__name__], sys.argv[2])
    elif cmd == 'frames': render(sys.modules[__name__], sys.argv[3], [int(x) for x in sys.argv[2].split(',')])
