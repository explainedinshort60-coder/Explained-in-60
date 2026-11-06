"""Episode 013: How scammers drain a gift card before you buy it (thieves take cards off the store rack, scratch or peel
the back to copy the number and PIN, cover it up and hang it back; when you pay and the card goes live they spend the money
online without the card; some swap the barcode so your money loads their card; fix: check the back, stickers on, PIN covered,
nothing scratched, grab another and tell the cashier, keep the receipt and a photo; anyone asking for payment in gift
cards is a scammer). Sources: FTC consumer alerts, DC Attorney General alert (research.md).
Cutaway source for the podcast (no presenter). Run: python3 episode.py frames 0,100,200 OUT_DIR"""
import os, sys, math
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'engine'))
from lib import *
HERE = os.path.dirname(os.path.abspath(__file__))
props_js = os.path.join(HERE, 'props.js')
N = 1180
# beats: A 0-100 hook: card at the register, BALANCE $0.00, bills flying out | B 100-220 rack, the gloved hand lifts a card
#        C 220-420 card back: the PIN sticker peels, the notepad copies the number and PIN, the sticker goes back
#        D 420-500 rack: the card is hung back | E 500-600 register: you pay, the card goes live (+$50)
#        F 600-720 the money runs along the dotted line to the shadowy laptop, register reads $0.00
#        G 720-860 barcode swap: a fake barcode slides over, the $50 bends off to THEIR card
#        H 860-1000 the check: three ticks | I 1000-1080 receipt + phone photo | J 1080-1180 "PAY ME IN GIFT CARDS" + SCAM stamp
GRAB = [(0, 0, 'io'), (130, 0, 'io'), (178, 1, 'io'), (432, 1, 'io'), (480, 0, 'io')]
PEEL = [(0, 0, 'io'), (238, 0, 'io'), (276, 1, 'out'), (372, 1, 'io'), (404, 0, 'io')]
COPY = [(0, 0, 'io'), (288, 0, 'io'), (360, 1, 'lin')]
LIVE = [(0, 0, 'io'), (540, 0, 'io'), (541, 1, 'io')]
DRAIN = [(0, 0, 'io'), (620, 0, 'io'), (700, 1, 'lin')]
SWAP = [(0, 0, 'io'), (742, 0, 'io'), (788, 1, 'out')]
DIV = [(0, 0, 'io'), (800, 0, 'io'), (846, 1, 'io')]
CHK = [(0, 0, 'io'), (880, 0, 'io'), (900, 1, 'io'), (930, 1, 'io'), (950, 2, 'io'), (970, 2, 'io'), (990, 3, 'io')]
REC = [(0, 0, 'io'), (1000, 0, 'io'), (1001, 1, 'io')]
SCAMK = [(0, 0, 'io'), (1110, 0, 'io'), (1120, 1, 'out')]
def T(f):
    return {'fly': 1, 'grab': kv(GRAB, f), 'peel': kv(PEEL, f), 'copy': kv(COPY, f) if f < 420 else 0, 'live': kv(LIVE, f),
            'drain': kv(DRAIN, f), 'swap': kv(SWAP, f), 'divert': kv(DIV, f), 'checks': kv(CHK, f), 'receipt': kv(REC, f),
            'scam': kv(SCAMK, f)}
HOOKC = (560, 440, 900); RACK = (3000, 420, 1050); BACK = (5000, 470, 1000); PATH = (7010, 400, 1100)
SWP = (9000, 470, 1000); CHKC = (11000, 440, 1050); SCM = (13000, 430, 1000)
CAM = [(0, HOOKC, 'io'), (100, (560, 430, 900), 'lin'), (101, RACK, 'cut'), (220, (3000, 360, 900), 'io'),
       (221, BACK, 'cut'), (420, (5000, 440, 940), 'lin'), (421, RACK, 'cut'), (500, (3000, 420, 980), 'lin'),
       (501, PATH, 'cut'), (720, (7010, 380, 1040), 'lin'), (721, SWP, 'cut'), (860, (9000, 470, 960), 'lin'),
       (861, CHKC, 'cut'), (1000, (11000, 440, 1000), 'lin'), (1001, (11000, 420, 1000), 'cut'), (1080, (11000, 420, 960), 'lin'),
       (1081, SCM, 'cut'), (1180, (13000, 430, 920), 'lin')]
HL = [(140, 220, 'grab', 'STORE RACK', -200, -150), (290, 420, 'number', 'NUMBER + PIN COPIED', -220, -250),
      (520, 600, 'cardp', 'CARD GOES LIVE', -180, -250), (640, 720, 'laptop', 'SPENT ONLINE', -150, -330),
      (750, 860, 'barcode', 'FAKE BARCODE', -100, -200),
      (1010, 1080, 'photo', 'KEEP BOTH', -100, -380)]
def pop(f):
    if 690 <= f < 720: return {'x': 6740, 'y': 820, 's': min(1, (f - 690) / 4 + .3), 'text': 'POOF'}
    return None
def frame(f):
    return {'T': T(f), 'cam': dict(zip(('cx', 'cy', 'w'), kv(CAM, f))),
            'hl': [{'part': h[2], 'label': h[3], 'dx': h[4], 'dy': h[5]} for h in HL if h[0] <= f < h[1]],
            'cap': '', 'badge': None, 'pop': pop(f)}
if __name__ == '__main__':
    cmd = sys.argv[1]
    if cmd == 'render': render(sys.modules[__name__], sys.argv[2])
    elif cmd == 'frames': render(sys.modules[__name__], sys.argv[3], [int(x) for x in sys.argv[2].split(',')])
