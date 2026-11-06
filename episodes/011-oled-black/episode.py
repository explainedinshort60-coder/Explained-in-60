"""Episode 011: Why an OLED screen shows perfect black (every pixel is its own tiny lamp with a thin organic layer that glows
when powered; for black the lamp simply switches off; a regular LCD keeps one big backlight on and twists liquid crystals
like tiny blinds to block it, but the blinds leak, so its black is dark gray; bonus: a static image left up for ages wears
the lamps unevenly and leaves a faint ghost, burn-in).
Cutaway source for the podcast (no presenter). Run: python3 episode.py frames 0,100,200 OUT_DIR"""
import os, sys, math
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'engine'))
from lib import *
HERE = os.path.dirname(os.path.abspath(__file__))
props_js = os.path.join(HERE, 'props.js')
N = 1100
# beats: A 0-100 hook: gray-glowing TV black behind a true-black tablet | B 100-200 pixel grid, lamps light up one by one
#        C 200-320 one pixel in cross-section, the organic layer glows when the current flows
#        D 320-440 grid: the dark lamps switch off, only the moon stays lit | E 440-540 the TV, x-ray of the one big light behind it
#        F 540-660 LCD stack: backlight always on, crystal blinds twist shut | G 660-760 light leaks past the blinds: dark gray
#        H 760-860 side by side again (spare) | I 860-980 burn-in: a static bar stays up for ages (clock spins)
#        J 980-1100 gray test screen, the faint ghost of the bar stays
LIT = [(0, 1, 'io'), (100, 0.3, 'io'), (106, 0.3, 'io'), (170, 1, 'io')]
OFF = [(0, 0, 'io'), (350, 0, 'io'), (410, 1, 'io')]
POW = [(0, 0, 'io'), (236, 0, 'io'), (237, 1, 'io')]
XRAY = [(0, 0, 'io'), (476, 0, 'io'), (496, 1, 'out'), (540, 1, 'io')]
BLINDS = [(0, 0, 'io'), (572, 0, 'io'), (622, 1, 'io')]
LEAK = [(0, 0, 'io'), (676, 0, 'io'), (712, 1, 'io')]
BAR = [(0, 0, 'io'), (866, 0, 'io'), (880, 1, 'out')]
AGE = [(0, 0, 'io'), (884, 0, 'io'), (968, 1, 'lin')]
GHOST = [(0, 0, 'io'), (990, 0, 'io'), (991, 1, 'io')]
def T(f):
    return {'lit': kv(LIT, f), 'off': kv(OFF, f), 'power': kv(POW, f), 'xray': kv(XRAY, f), 'blinds': kv(BLINDS, f),
            'leak': kv(LEAK, f), 'back': 1, 'bar': kv(BAR, f), 'age': kv(AGE, f), 'ghost': kv(GHOST, f), 'tvglow': 1}
ROOM = (560, 420, 1150); HOOKC = (532, 430, 960); TV = (340, 360, 760); TAB = (822, 470, 640); BURN = (700, 470, 880)
GRID = (3000, 470, 1040); PIX = (5000, 450, 1080); LCDC = (7000, 420, 1060)
CAM = [(0, HOOKC, 'io'), (96, (600, 440, 880), 'lin'), (100, GRID, 'cut'), (200, (3000, 470, 960), 'lin'),
       (201, PIX, 'cut'), (320, (5000, 450, 1000), 'lin'), (321, GRID, 'cut'), (440, (3000, 470, 980), 'lin'),
       (441, ROOM, 'cut'), (470, TV, 'io'), (540, TV, 'io'), (541, LCDC, 'cut'), (760, (7000, 420, 980), 'lin'),
       (761, ROOM, 'cut'), (860, (580, 420, 1080), 'lin'), (861, BURN, 'cut'), (980, (760, 470, 800), 'lin'),
       (981, TAB, 'cut'), (1100, (822, 470, 600), 'lin')]
HL = [(130, 200, 'lamp', 'TINY LAMP', 40, 0), (206, 320, 'layer', 'ORGANIC LAYER', -200, 0),
      (360, 440, 'off', 'OFF = BLACK', -180, 0), (500, 540, 'tv', 'ONE BIG LIGHT', -160, 0),
      (550, 600, 'backlight', 'BACKLIGHT: ALWAYS ON', -300, 0), (600, 670, 'blinds', 'CRYSTAL BLINDS', -260, 0),
      (700, 760, 'front', 'DARK GRAY', -160, 0), (780, 860, 'tv', 'GRAY', -100, 0),
      (890, 980, 'bar', 'SAME IMAGE', -260, 0), (992, 1100, 'ghost', 'BURN-IN', -200, 0)]
def pop(f):
    if 390 <= f < 430: return {'x': 2700, 'y': 300, 's': min(1, (f - 390) / 4 + .3), 'text': 'OFF!'}
    if 1030 <= f < 1070: return {'x': 700, 'y': 330, 's': min(1, (f - 1030) / 4 + .3), 'text': 'BOO'}
    return None
def frame(f):
    return {'T': T(f), 'cam': dict(zip(('cx', 'cy', 'w'), kv(CAM, f))),
            'hl': [{'part': h[2], 'label': h[3], 'dx': h[4], 'dy': h[5]} for h in HL if h[0] <= f < h[1]],
            'cap': '', 'badge': None, 'pop': pop(f)}
if __name__ == '__main__':
    cmd = sys.argv[1]
    if cmd == 'render': render(sys.modules[__name__], sys.argv[2])
    elif cmd == 'frames': render(sys.modules[__name__], sys.argv[3], [int(x) for x in sys.argv[2].split(',')])
