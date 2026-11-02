# 003 zipper podcast: acting cue sheet (Expression & Comedy Acting Rules v1.1)
SRC = '003-zipper'
OUTRO = 18
EMPH = {0: [3, 15], 1: [3], 2: [2], 8: [3], 10: [1], 12: [7], 15: [0], 16: [2], 19: [0]}
def SFX():
    return [(W(0, 3), 'zipper', 0.22), (W(2, 2), 'record_scratch', 0.12), (W(6, 0), 'zipper', 0.25),
            (W(7, 8), 'mech_click', 0.30), (W(9, 1), 'boing', 0.20), (W(11, 2), 'zipper', 0.25),
            (W(14, 3), 'mech_click', 0.25), (W(16, 2), 'mech_clunk', 0.18)]

# 0 hook: Blue frustrated, tug gesture on "rip", big face only on "second"
cut(0, 'cuB'); ex('B', 0, 'confused'); ge('B', 'panic', W(0, 3), W(0, 6, 0, True), 0.7)
ex('B', W(0, 14, -2 * F), 'shock'); ex('O', 0, 'neutral')
# 1 Orange deadpan non-answer, done on "wrong"
cut(S(1, -0.06), 'cuO'); ex('O', S(1), 'side-eye'); ex('O', W(1, 3), 'done')
# 2 Blue mock-offended (one big escalation), push on GREAT
cut(S(2, -0.04), 'cuB'); ex('B', S(2, -2 * F), 'mock-offended'); ge('B', 'shrug', W(2, 2), E(2, 0.1), 0.9); PUSH.append((W(2, 2), 0.05))
# 3 Orange starts, cutaway on "Two rows"
cut(S(3, -0.06), 'two'); ex('O', S(3), 'neutral'); ex('B', S(3, 0.1), 'side-eye'); ge('O', 'point', W(3, 0), W(3, 1, 0, True), 0.7)
ins(W(3, 2, -0.04), (W(3, 2), 150), (E(3), 200))
# 4 bump and dent
ins(S(4, -0.04), (S(4), 455), (W(4, 4), 490), (W(4, 9), 525), (E(4), 545))
# 5 listener shot: Blue buffering while Orange explains the Y tunnel off screen
cut(S(5, -0.04), 'cuB'); ex('B', S(5), 'confused'); ex('B', W(5, 5, REG), 'curious')
# 6 zip up, Y squeezes
ins(S(6, -0.04), (S(6), 288), (E(6), 450))
# 7 bumps drop in, LOCKED
ins(S(7, -0.04), (S(7), 545), (W(7, 8), 612), (E(7), 640))
ex('O', S(7), 'smug')
# 8 Blue tries: sideways (tug)
cut(S(8, -0.06), 'cuB'); ex('B', S(8), 'curious'); ge('B', 'panic', W(8, 1), E(8, -0.05), 0.8)
# 9 does nothing: NOPE gag
ins(S(9, -0.04), (S(9), 700), (W(9, 1), 742), (E(9), 790))
# 10 Blue gasps
cut(S(10, -0.06), 'cuB'); ex('B', S(10, -2 * F), 'shock')
# 11 zip down splits them
ins(S(11, -0.04), (S(11), 790), (E(11), 872))
# 12 Blue suspicious about his jacket
cut(S(12, -0.06), 'two'); ex('B', S(12), 'side-eye'); ex('O', W(12, 4, REG), 'neutral')
ge('B', 'point', W(12, 4), W(12, 8, 0, True), 0.6)
# 13 worn slider, 14 pliers
ins(S(13, -0.04), (S(13), 990), (W(13, 2), 1050), (E(13), 1104))
ins(S(14, -0.04), (S(14), 1104), (W(14, 7), 1150))
cut(W(14, 8, -0.04), 'cuO'); ex('O', W(14, 8), 'side-eye'); PUSH.append((W(14, 8), 0.04))
# 15 Blue whispering, fake innocent
cut(S(15, -0.04), 'cuB'); ex('B', S(15), 'fake-innocent')
# 16 Orange sees through it: punchline
cut(S(16, -0.06), 'cuO'); ex('O', S(16), 'side-eye'); ex('O', W(16, 2), 'done'); PUSH.append((W(16, 4), 0.06))
# 17 two-shot: Blue laughs, Orange done
cut(S(17, -0.04), 'two'); ex('B', S(17, -2 * F), 'laugh'); ex('O', S(17), 'done'); ex('B', W(17, 0), 'wink')
# 18 Orange sighs, tiny smug on "know"
cut(S(18, -0.04), 'cuO'); ex('O', S(18), 'done'); ex('O', W(18, 3), 'smug'); ge('O', 'facepalm', S(18, 0.05), W(18, 0, 0, True), 0.5)
# 19 restore hook shot and pose for the loop
cut(S(19, -0.06), 'cuB'); ex('B', S(19, -0.06), 'curious'); ex('B', E(19, -0.2), 'confused')
