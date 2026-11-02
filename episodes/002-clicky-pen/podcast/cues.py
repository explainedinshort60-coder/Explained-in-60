# 002 clicky pen podcast: acting cue sheet (Expression & Comedy Acting Rules v1.1)
SRC = '002-clicky-pen'
OUTRO = 16
EMPH = {0: [5, 9], 1: [2], 2: [0, 2], 5: [1, 3], 7: [3], 9: [0], 11: [3, 7], 13: [5, 8], 14: [6], 17: [0]}
def SFX():
    return [(W(0, 9), 'pen_click', 0.35), (W(4, 0), 'pen_click', 0.35), (W(6, 6), 'pen_click', 0.30),
            (W(8, 12), 'pen_click', 0.40), (W(9, 0), 'pen_click', 0.30), (W(10, 1), 'pen_click', 0.35),
            (W(12, 3), 'pen_click', 0.30), (W(12, 4), 'pen_click', 0.30), (W(12, 5), 'pen_click', 0.30), (W(12, 6), 'pen_click', 0.30),
            (W(13, 5), 'pen_click', 0.25), (W(13, 5, 0.18), 'pen_click', 0.25), (W(13, 5, 0.36), 'pen_click', 0.25),
            (W(14, 6), 'record_scratch', 0.10)]

# 0 hook: Blue confused, push on STAY
cut(0, 'cuB'); ex('B', 0, 'confused'); ex('B', W(0, 5, -2 * F), 'shock'); ge('B', 'shrug', W(0, 5), W(0, 9, 0, True), 0.8)
ex('O', 0, 'neutral')
# 1 Orange: the deadpan non-answer
cut(S(1, -0.06), 'cuO'); ex('O', S(1), 'done')
# 2 Blue sarcastic, two-shot so we see Orange not caring
cut(S(2, -0.04), 'two'); ex('B', S(2), 'side-eye'); ge('B', 'shrug', W(2, 1), E(2, 0.05), 0.7); ex('O', W(2, 2, REG), 'done')
# 3 Orange sighs, gives in; cutaway on "spring"
cut(S(3, -0.06), 'cuO'); ex('O', S(3), 'done'); ge('O', 'facepalm', S(3, 0.05), W(3, 0, 0, True), 0.5)
ins(W(3, 1, -0.04), (W(3, 1), 120), (W(3, 4), 140), (E(3), 180))
# 4 button, cam, stops
ins(S(4, -0.04), (S(4), 180), (W(4, 3), 190), (W(4, 10), 215), (W(4, 14), 250), (E(4), 286))
# 5 Blue impressed for the wrong reason
cut(S(5, -0.06), 'cuB'); ex('B', S(5), 'curious'); ex('B', W(5, 3), 'smug')
# 6 Orange deflates it, then press and twist
cut(S(6, -0.06), 'cuO'); ex('O', S(6), 'side-eye'); ex('O', W(6, 1), 'done')
ins(W(6, 5, -0.04), (W(6, 5), 348), (W(6, 9), 490), (E(6), 560))
# 7 Blue curious
cut(S(7, -0.06), 'cuB'); ex('B', S(7), 'curious'); ge('B', 'talk', W(7, 3), E(7), 0.6)
# 8 spring pushes back, catches on step: CLICK on "step"
ins(S(8, -0.04), (S(8), 560), (W(8, 7), 700), (W(8, 12), 790), (E(8), 818))
# 9 Blue excited
cut(S(9, -0.04), 'cuB'); ex('B', S(9, -2 * F), 'shock'); ge('B', 'panic', W(9, 0), E(9, 0.1), 0.7)
# 10 next press, long slot
ins(S(10, -0.04), (S(10), 840), (W(10, 7), 935), (E(10), 1008))
# 11 Blue's realisation, two-shot with Orange's small smug
cut(S(11, -0.06), 'two'); ex('B', S(11), 'curious'); ex('B', W(11, 3), 'shock'); ex('O', W(11, 3, REG), 'smug')
ge('B', 'shrug', W(11, 7), E(11, 0.1), 0.8)
# 12 round and round
ins(S(12, -0.04), (S(12), 960), (E(12), 1030))
# 13 Blue laughs, confesses
cut(S(13, -0.06), 'cuB'); ex('B', S(13), 'laugh'); ex('B', W(13, 0), 'wink'); ge('B', 'point', W(13, 5), W(13, 8, 0, True), 0.6)
# 14 Orange punchline, push
cut(S(14, -0.06), 'cuO'); ex('O', S(14), 'side-eye'); ex('O', W(14, 6), 'done'); PUSH.append((W(14, 6), 0.06))
# 15 Blue mock-offended, laughs, accepts
cut(S(15, -0.04), 'two'); ex('B', S(15, -2 * F), 'mock-offended'); ex('O', S(15), 'smug')
if len(L[15]['events']) > 1: ex('B', EV(15, 1), 'laugh')
ex('B', W(15, 1), 'wink')
# 16 two clicks, then Orange's "And now you know"
ins(S(16, -0.04), (S(16), 1066), (W(16, 5), 1120), (W(16, 8), 1160))
cut(W(16, 9, -0.04), 'cuO'); ex('O', W(16, 9), 'smug')
# 17 restore the hook shot for the loop
cut(S(17, -0.06), 'cuB'); ex('B', S(17, -0.06), 'curious'); ex('B', E(17, -0.2), 'confused')
