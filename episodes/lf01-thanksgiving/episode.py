"""Long-form 01 cutaway source: Thanksgiving dinner, fixed with science (no presenter). Shared with the week's Shorts.
Beats (frames @24fps):
 TK    0-100 timer pops            | 100-200 x-ray, breast 120->185, thigh 175 | 200-300 dark meat = myoglobin
       300-400 spatchcock          | 400-500 overcooked, DRY                    | 500-620 foil rest, carryover 157->165
 TM  620-760 timer cross-section, blob melts at ~185, stick shoots up           | 760-820 sprinkler cousin
 TH  820-920 counter thaw: warm rim, frozen core, bacteria zone                 | 920-1000 fridge
 ST 1000-1100 stuffing lags the breast                                          | 1100-1160 stuffing in its own dish
 PI 1160-1240 wobble | 1240-1330 egg net tightens | 1330-1370 crack | 1370-1420 soggy bottom | 1420-1480 blind bake
 GR 1480-1590 lumps + dry-core inset | 1590-1640 whisked smooth
 PO 1640-1720 gentle mash, few cells burst | 1720-1800 blender bursts them all, glue
 CR 1800-1900 cranberry jiggle + pectin net
 CX 1900-2030 plate pile, 3,000 calories, Zzz | 2030-2070 tryptophan in line at the brain gate | 2070-2100 innocent turkey
Run: python3 episode.py frames 0,100,200 OUT_DIR"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'engine'))
from lib import *
HERE = os.path.dirname(os.path.abspath(__file__))
props_js = os.path.join(HERE, 'props.js')
N = 2100
def r(f, a, b, e='io'):
    """0..1 ramp between frames a and b."""
    return kv([(a, 0, 'io'), (b, 1, e)], f)
def win(f, a, b, fade=8):
    """1 inside [a,b), fading in/out over `fade` frames."""
    return min(r(f, a, a + fade), 1 - r(f, b - fade, b))
SCENES = [(0, 'TK'), (620, 'TM'), (820, 'TH'), (1000, 'ST'), (1160, 'PI'), (1480, 'GR'), (1640, 'PO'), (1800, 'CR'), (1900, 'CX')]
def scene(f):
    s = 'TK'
    for a, k in SCENES:
        if f >= a: s = k
    return s
def T(f):
    t = {'sc': scene(f)}
    # turkey
    t['pop'] = r(f, 40, 46, 'out') if f < 100 else (0 if f < 420 else r(f, 420, 426, 'out') if f < 500 else 1)
    t['popfx'] = win(f, 46, 96) + win(f, 426, 470)
    t['xr'] = win(f, 100, 200)
    t['therm'] = max(win(f, 108, 200), win(f, 400, 500), win(f, 520, 620))
    t['temp'] = kv([(0, 120, 'io'), (120, 120, 'io'), (190, 185, 'io'), (519, 185, 'io'), (520, 157, 'cut'), (540, 157, 'io'), (610, 166, 'io')], f)
    t['therm2'] = win(f, 130, 200); t['ttemp'] = 175
    t['myo'] = win(f, 205, 300, 24)
    t['flat'] = r(f, 310, 360) if f < 400 else 0
    t['sad'] = win(f, 410, 500, 12)
    t['foil'] = win(f, 505, 620, 16); t['carry'] = win(f, 520, 620, 12)
    # timer cross-section
    t['dial'] = win(f, 625, 760); t['ttm'] = kv([(0, 70, 'io'), (630, 70, 'io'), (720, 186, 'io')], f)
    t['heat'] = r(f, 630, 720); t['melt'] = r(f, 700, 735, 'lin') if f < 760 else 1
    t['spr'] = win(f, 765, 820)
    # thaw
    t['thaw'] = r(f, 830, 900); t['fridge'] = r(f, 925, 960)
    # stuffing
    t['tst'] = win(f, 1005, 1100); t['stt'] = r(f, 1020, 1095, 'lin'); t['dish'] = r(f, 1105, 1135)
    # pie
    t['wob'] = win(f, 1165, 1245) * 0.9
    t['net'] = win(f, 1245, 1330); t['tight'] = r(f, 1270, 1320)
    t['crack'] = r(f, 1335, 1355) if 1330 <= f < 1370 else 0
    t['soggy'] = r(f, 1375, 1405) if 1370 <= f < 1420 else 0
    t['blind'] = 1 if f >= 1420 else 0
    # gravy
    t['lump'] = r(f, 1485, 1505); t['lumpx'] = win(f, 1525, 1590); t['smooth'] = r(f, 1595, 1635, 'lin')
    # potato
    t['burst'] = kv([(0, 0, 'io'), (1650, 0, 'io'), (1690, 0.18, 'io'), (1725, 0.18, 'io'), (1770, 1, 'io')], f)
    t['glue'] = r(f, 1770, 1795)
    # cranberry
    t['jig'] = win(f, 1805, 1900); t['pectin'] = win(f, 1840, 1900)
    # crash
    t['pile'] = r(f, 1905, 1955); t['calo'] = r(f, 1945, 1955); t['cal'] = kv([(0, 0, 'io'), (1955, 0, 'io'), (1995, 3000, 'out')], f)
    t['zzz'] = r(f, 2000, 2010); t['gate'] = win(f, 2030, 2072); t['innocent'] = r(f, 2072, 2085)
    return t
def cam(f):
    s = scene(f); a = dict(SCENES)
    ctr = {'TK': (600, 410), 'TM': (3000, 420), 'TH': (5000, 430), 'ST': (7000, 440), 'PI': (9000, 380),
           'GR': (11000, 380), 'PO': (13000, 390), 'CR': (15000, 420), 'CX': (17000, 400)}[s]
    w0 = 920
    base = (ctr[0], ctr[1] + 0.167 * w0, w0)  # vertical frame: visible center sits 0.167 w above cy
    start = max(k for k, v in SCENES if v == s and k <= f)
    nxt = min([k for k, _ in SCENES if k > f] + [N])
    u = (f - start) / max(1, nxt - start)
    return {'cx': base[0], 'cy': base[1], 'w': base[2] * (1 - 0.06 * u)}  # slow push-in per scene
HL = [(10, 38, 'timer', 'POP-UP TIMER', -320, 0), (214, 300, 'legs', 'MYOGLOBIN', -60, 0),
      (650, 700, 'blob', 'SOFT METAL', -340, 0), (650, 700, 'spring', 'SPRING', 120, 0),
      (850, 920, 'core', 'STILL FROZEN', -200, 0), (1180, 1240, 'center', 'WOBBLE = DONE', -260, 0),
      (1380, 1420, 'bottom', 'SOGGY', -100, 0), (1660, 1715, 'cell', 'STARCH CELL', -200, 0)]
def frame(f):
    return {'T': T(f), 'cam': cam(f),
            'hl': [{'part': h[2], 'label': h[3], 'dx': h[4], 'dy': h[5]} for h in HL if h[0] <= f < h[1]],
            'cap': '', 'badge': None, 'pop': None}
if __name__ == '__main__':
    cmd = sys.argv[1]
    if cmd == 'render': render(sys.modules[__name__], sys.argv[2])
    elif cmd == 'frames': render(sys.modules[__name__], sys.argv[3], [int(x) for x in sys.argv[2].split(',')])
