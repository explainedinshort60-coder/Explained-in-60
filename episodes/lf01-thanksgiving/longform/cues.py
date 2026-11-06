# LF01 "We Fixed Thanksgiving Dinner With Science": long-form acting + cutaway sheet (Acting Rules v1.1).
# Executed inside engine/longform/lf.py. Cutaway frames come from episodes/lf01-thanksgiving/episode.py (beats in its docstring).
SRC = 'lf01-thanksgiving'
HOOK = (0, 100, 2.5)   # long-form opens on the timer popping (first frame = hook)
OUTRO = 106
EMPH = {}
T_ = 'lf01-thanksgiving'

# ---- default acting from the voice tags: speaker face on line start, listener reacts a register late ----
FACE = {'excited': 'curious', 'gasps': 'shock', 'nervous': 'please-no', 'confident': 'confidently-wrong', 'curious': 'curious',
        'confused': 'confused', 'laughs': 'laugh', 'offended': 'mock-offended', 'amazed': 'wait-WHAT', 'proud': 'smug',
        'delighted': 'laugh', 'panicking': 'meltdown', 'relieved': 'neutral', 'sighs': 'done', 'suspicious': 'side-eye',
        'impressed': 'curious', 'yawning': 'done', 'deadpan': 'done', 'dry': 'side-eye', 'flatly': 'done',
        'satisfied': 'smug', 'chuckles': 'holding-laugh'}
for l in L:
    h = l['sp']; o = 'O' if h == 'B' else 'B'
    face = next((FACE[t] for t in l['tags'] if t in FACE), 'neutral' if h == 'O' else 'curious')
    ex(h, S(l['i'], -2 * F), face)
    ex(o, S(l['i'], REG + 0.15), 'curious' if h == 'O' else 'side-eye')
    if h == 'O' and len(l['words']) >= 14: ge('O', 'talk', W(l['i'], 2), W(l['i'], min(8, len(l['words']) - 1), 0, True), 0.6)

def sh(i, shot): cut(S(i, -0.05), shot)
def cu(i): sh(i, 'cuB' if L[i]['sp'] == 'B' else 'cuO')
def cut_ins(i, a, b, j=None):
    """cutaway over line i (through line j), source frames a -> b"""
    j = i if j is None else j
    ins(S(i, -0.05), (S(i), a), (E(j), b), src=T_)
def wr(i, k): wrong(W(i, k))
def chap(i, n, name):
    t = E(i - 1, 0.25); card(t, f'CHAPTER {n}', name); chapter(t, f'CH {n} · {name.upper()}')

# ---------------- cold open: first frame is the timer popping ----------------
ins(0.0, (0.0, 0), (E(0), 100), src=T_)
cu(1); PUSH.append((W(1, 9), 0.05))
cu(2); cut(S(3, -0.05), 'two')
card(E(3, 0.2), 'WE FIXED THANKSGIVING', 'dinner, with science')
cu(4); cu(5); cu(6); cu(7); cu(8); cu(9); PUSH.append((W(9, 4), 0.04))

# ---------------- ch1 the turkey ----------------
chap(10, 1, 'The Turkey')
cu(10); wr(10, 9)
cut_ins(11, 108, 165)
cu(12)
cut_ins(13, 110, 150); cut_ins(14, 150, 200)
cu(15); cu(16); sh(17, 'two')
cut_ins(18, 205, 262); cut_ins(19, 262, 300)
cu(20); cu(21); cu(22)
cut_ins(23, 300, 362); cut_ins(24, 362, 399)
cu(25); sh(26, 'two'); wr(26, 6)
cut_ins(27, 620, 690); cut_ins(28, 690, 820)
cu(29); wr(29, 4)
cut_ins(30, 400, 500)
cu(31)
cut_ins(32, 500, 560); cut_ins(33, 560, 619)
cu(34); cu(35); cu(36); cu(37); PUSH.append((W(37, 6), 0.05))
cu(38); cu(39); PUSH.append((W(39, 5), 0.04))

# ---------------- ch1b the night before ----------------
chap(40, 2, 'The Night Before')
cu(40); wr(40, 11)
cut_ins(41, 820, 870); cut_ins(42, 870, 919)
cu(43)
cut_ins(44, 921, 1000)
cu(45); cu(46)
cu(47); wr(47, 6)
cut_ins(48, 1000, 1060); cut_ins(49, 1060, 1100)
cu(50)
cut_ins(51, 1100, 1159)
cu(52); cu(53); cu(54); sh(55, 'two'); PUSH.append((W(55, 8), 0.05))

# ---------------- ch2 the pie ----------------
chap(56, 3, 'The Pie')
cu(56); wr(56, 16)
cut_ins(57, 1160, 1200)
cu(58)
cut_ins(59, 1245, 1300); cut_ins(60, 1300, 1362)
cu(61)
cut_ins(62, 1166, 1220); cut_ins(63, 1220, 1244)
cu(64); cu(65); PUSH.append((W(65, 1), 0.05))
cu(66)
cut_ins(67, 1371, 1450)
cu(68)
cut_ins(69, 1450, 1479)
cu(70); wr(70, 15)
cu(71); PUSH.append((W(71, 5), 0.05))

# ---------------- ch3 the sides ----------------
chap(72, 4, 'The Sides')
cu(72); wr(72, 7)
cut_ins(73, 1482, 1590)
cu(74)
cut_ins(75, 1590, 1639)
cu(76); wr(76, 7)
cut_ins(77, 1640, 1722); cut_ins(78, 1722, 1799)
cu(79); cu(80); cu(81)
cut_ins(82, 1800, 1899)
cu(83); cu(84)

# ---------------- ch4 the crash, payoff, button ----------------
chap(85, 5, 'The Crash')
cu(85); wr(85, 9)
cu(86); cu(87)
cut_ins(88, 1900, 2000); cut_ins(89, 2000, 2029)
cu(90); cu(91)
cut_ins(92, 2030, 2071)
cu(93)
cut_ins(94, 2071, 2099)
cu(95); cu(96)
cut_ins(97, 560, 600)
cu(98)
cut_ins(99, 1200, 1236)
cu(100); cu(101); cu(102); cu(103); cu(104)
card(S(105, -0.05), 'BLUE WRONG: 10', 'new channel record')
cu(106)

def SFX():
    return [(W(0, 6), 'turkey_timer_pop', 0.5), (W(28, 17), 'spring_twang', 0.3), (W(30, 6), 'turkey_timer_pop', 0.35),
            (W(43, 5), 'gasp_crowd', 0.12), (W(60, 16), 'record_scratch', 0.12), (W(79, 0), 'boing', 0.18),
            (W(85, 0), 'crickets', 0.15), (S(105), 'cash_register', 0.3), (W(37, 6), 'rimshot', 0.15)] + \
           [(t, 'whoosh_fast', 0.25) for t in CARDS]
