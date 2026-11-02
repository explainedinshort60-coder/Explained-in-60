# 001 toilet podcast: acting cue sheet (Expression & Comedy Acting Rules v1.1)
# Line 12 of the original take ("No sensor. No chip. No wifi.") is cut in the edit (no negation triplet), indexes below are post-cut.
SRC = '001-toilet'
OUTRO = 17
EMPH = {0: [7], 1: [3, 6], 3: [2], 4: [4], 8: [3], 9: [12], 10: [5], 12: [4], 13: [9], 14: [5], 16: [4], 18: [0]}
def SFX():
    return [(W(3, 2), 'pop_bubble', 0.20), (W(4, 4), 'boing', 0.16), (W(6, 1), 'toilet_flush', 0.22),
            (W(7, 10), 'tank_refill', 0.20), (W(9, 12), 'mech_click', 0.30), (W(10, 5), 'ding', 0.14),
            (W(13, 9), 'rimshot', 0.14), (W(15, 11), 'toilet_gurgle', 0.16)]

# 0 hook: Blue suspicious close-up, leans in on STOP
cut(0, 'cuB'); ex('B', 0, 'side-eye'); ex('B', W(0, 7, -2 * F), 'curious'); ge('B', 'point', W(0, 7), E(0, -0.1), 0.6); ex('O', 0, 'neutral')
# 1 Orange deadpan non-answer, done on "toilet"
cut(S(1, -0.06), 'cuO'); ex('O', S(1), 'neutral'); ex('O', W(1, 6), 'done')
# 2 Blue whispering conspiracy
cut(S(2, -0.04), 'cuB'); ex('B', S(2), 'fake-innocent'); ge('B', 'talk', W(2, 1), E(2), 0.5)
# 3 Orange flat answer, two-shot
cut(S(3, -0.06), 'two'); ex('O', S(3), 'side-eye'); ex('B', W(3, 2, REG), 'confused')
# 4 Blue laughs at "pool toy", Orange unmoved
cut(S(4, -0.04), 'cuB'); ex('B', S(4, -2 * F), 'laugh'); ex('B', W(4, 2), 'smug'); ge('B', 'shrug', W(4, 4), E(4, 0.1), 0.8)
# 5 beat 1: ball and arm (cutaway on "floats")
cut(S(5, -0.06), 'cuO'); ex('O', S(5), 'neutral')
ins(W(5, 2, -0.04), (W(5, 2), 170), (W(5, 11), 238), (E(5), 250))
# 6 beat 2: flush, water and ball drop
ins(S(6, -0.04), (S(6), 290), (W(6, 4), 380), (E(6), 440))
# 7 listener shot on "The arm tips down", then beat 3 tap opens on "opens"
cut(S(7, -0.04), 'cuB'); ex('B', S(7), 'curious'); ex('O', S(7), 'neutral')
ins(W(7, 5, -0.04), (W(7, 5), 440), (W(7, 9), 528), (E(7), 580))
# 8 Blue gets it (excited point)
cut(S(8, -0.06), 'cuB'); ex('B', S(8), 'curious'); ex('B', W(8, 3), 'smug'); ge('B', 'point', W(8, 3), E(8, -0.05), 0.8)
# 9 beat 4: ball rises, arm pushes the valve shut
ins(S(9, -0.04), (S(9), 600), (W(9, 7), 760), (W(9, 12), 795), (E(9), 830))
# 10 beat 5: same line every time (wide, SAME LINE label)
ins(S(10, -0.04), (S(10), 1220), (E(10), 1300))
# 11 Blue amazed, two-shot
cut(S(11, -0.06), 'two'); ex('B', S(11), 'confused'); ex('O', W(11, 1, REG), 'smug')
# 12 Blue's absurd conclusion: big face once on "smarter"
cut(S(12, -0.04), 'cuB'); ex('B', S(12, -2 * F), 'shock'); ex('B', W(12, 4), 'mock-offended'); ge('B', 'panic', W(12, 4), W(12, 8, 0, True), 0.7)
# 13 Orange's dry punchline, the one crack, push-in on "ball"
cut(S(13, -0.06), 'cuO'); ex('O', S(13), 'holding-laugh'); ex('O', W(13, 5), 'side-eye'); PUSH.append((W(13, 9), 0.06))
# 14 Blue suspicious about his own toilet
cut(S(14, -0.06), 'cuB'); ex('B', S(14), 'side-eye'); ge('B', 'point', W(14, 3), E(14, -0.05), 0.6)
# 15 bonus fail state: float too high, extra water down the overflow tube
cut(S(15, -0.06), 'cuO'); ex('O', S(15), 'neutral')
ins(W(15, 0, -0.02), (W(15, 0), 1082), (W(15, 6), 1125), (W(15, 9), 1150), (E(15), 1199))
# 16 Blue giggles: "thirsty", Orange done
cut(S(16, -0.04), 'two'); ex('B', S(16), 'fake-innocent'); ex('B', W(16, 4), 'laugh'); ex('O', W(16, 4, REG), 'done')
# 17 Orange sighs, facepalm, tiny smug on "know"
cut(S(17, -0.04), 'cuO'); ex('O', S(17), 'done'); ex('O', W(17, 4), 'smug'); ge('O', 'facepalm', S(17, 0.05), W(17, 0, 0, True), 0.5)
# 18 restore the hook shot and pose for the loop
cut(S(18, -0.06), 'cuB'); ex('B', S(18, -0.06), 'curious'); ex('B', E(18, -0.2), 'side-eye')
