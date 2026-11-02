# 007 flashlight podcast: acting cue sheet (Expression & Comedy Acting Rules v1.1)
SRC = '007-flashlight'
OUTRO = 18
EMPH = {0: [1, 5], 2: [1], 3: [6], 5: [3], 8: [4], 10: [8], 11: [4], 13: [8], 14: [1], 15: [4], 17: [3], 19: [2]}
def ft(ta, fa, tb, fb, f):  # time at which source frame f plays inside a cutaway segment
    return ta + (tb - ta) * (f - fa) / (fb - fa)
def SFX():
    return [(ft(S(1), 44, E(1), 96, 56), 'light_switch', 0.30), (W(6, 2), 'spring_twang', 0.16),
            (W(10, 0), 'light_switch', 0.30), (W(12, 11), 'pen_click', 0.30), (W(12, 13), 'pen_click', 0.30),
            (W(15, 4), 'glitch', 0.14), (W(16, 7), 'mech_click', 0.18), (W(17, 3), 'boing', 0.18)]

# 0 hook: Blue curious, click gesture (point) on "click", tiny confused on "flashlight"
cut(0, 'cuB'); ex('B', 0, 'curious'); ex('O', 0, 'neutral')
ge('B', 'point', W(0, 5), W(0, 7, 0, True), 0.6); ex('B', W(0, 7), 'confused')
# 1 Orange deadpan non-answer, shown: the click and LIGHT, Orange in the bubble
ins(S(1, -0.04), (S(1), 44), (E(1), 96)); ex('O', S(1), 'done')
# 2 Blue mock-offended (the one big escalation), push on "could've"
cut(S(2, -0.04), 'cuB'); ex('B', S(2, -2 * F), 'mock-offended'); ge('B', 'shrug', W(2, 1), E(2, 0.1), 0.8); PUSH.append((W(2, 1), 0.05))
# 3 Orange sighs, then cutaway on "Electricity": x-ray, loop traced
cut(S(3, -0.06), 'cuO'); ex('O', S(3), 'done'); ex('O', W(3, 0), 'neutral'); ge('O', 'talk', W(3, 0), W(3, 0, 0, True), 0.5)
ins(W(3, 1, -0.04), (W(3, 1), 104), (W(3, 7), 206), (E(3), 220))
# 4 cells nose to tail, plus and minus
ins(S(4, -0.04), (S(4), 226), (E(4), 290))
# 5 listener shot: Blue giggles, conga
cut(S(5, -0.04), 'cuB'); ex('B', S(5, -2 * F), 'holding-laugh'); ex('B', W(5, 3), 'smug'); ge('B', 'talk', W(5, 3), E(5), 0.7)
# 6 Orange "Sure." flat, then the spring
cut(S(6, -0.06), 'cuO'); ex('O', S(6), 'side-eye')
ins(W(6, 1, -0.04), (W(6, 1), 340), (E(6), 428))
# 7 metal strip, pan head to tail
ins(S(7, -0.04), (S(7), 432), (E(7), 540))
# 8 Blue curious about his click
cut(S(8, -0.06), 'two'); ex('B', S(8), 'curious'); ex('O', S(8, REG), 'neutral'); ge('B', 'point', W(8, 4), E(8), 0.6)
# 9 off: the gap
ins(S(9, -0.04), (S(9), 548), (W(9, 6), 578), (E(9), 640))
# 10 click: disc bridges the gap, LIGHT, pull out
ins(S(10, -0.04), (S(10), 650), (W(10, 0), 656), (W(10, 10), 690), (E(10), 730))
ex('O', W(10, 8), 'smug')
# 11 Blue gasps (listener shot)
cut(S(11, -0.06), 'cuB'); ex('B', S(11, -2 * F), 'shock'); ex('B', W(11, 4), 'curious')
# 12 clicky tail = clicky pen: ON, OFF on the words
ins(S(12, -0.04), (S(12), 762), (W(12, 11), 788), (W(12, 13), 838), (E(12), 872))
# 13 two-shot: Blue's real laugh, Orange stays deadpan
cut(S(13, -0.04), 'two'); ex('B', S(13, -2 * F), 'laugh'); ex('O', S(13, REG), 'side-eye'); ex('B', W(13, 5), 'smug')
ge('B', 'shrug', W(13, 8), E(13), 0.7)
# 14 punchline: Orange done, push-in; the one crack after it
cut(S(14, -0.06), 'cuO'); ex('O', S(14), 'done'); PUSH.append((W(14, 2), 0.06)); ex('O', E(14, -0.25), 'holding-laugh')
# 15 Blue suspicious, cut to the flicker on "flicker"
cut(S(15, -0.06), 'cuB'); ex('B', S(15), 'side-eye'); ge('B', 'panic', W(15, 7), E(15), 0.5)
ins(W(15, 4, -0.04), (W(15, 4), 884), (E(15), 940))
# 16 rust, then the eraser
ins(S(16, -0.04), (S(16), 944), (W(16, 7), 1004), (E(16), 1092))
# 17 Blue whispers the bad idea, fake innocent
cut(S(17, -0.04), 'cuB'); ex('B', S(17), 'fake-innocent'); ex('B', W(17, 3), 'wink')
# 18 Orange sighs, facepalm, tiny smug on "know"
cut(S(18, -0.04), 'cuO'); ex('O', S(18), 'done'); ge('O', 'facepalm', S(18, 0.05), W(18, 0, 0, True), 0.5); ex('O', W(18, 4), 'smug')
# 19 restore the hook shot and pose for the loop
cut(S(19, -0.06), 'cuB'); ex('B', S(19, -0.06), 'curious'); ex('B', E(19, -0.2), 'curious')
