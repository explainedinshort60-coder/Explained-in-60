# 015 touchscreen gloves podcast: acting cue sheet (Expression & Comedy Acting Rules v1.1)
SRC = '015-touchscreen-gloves'
HOOK = (10, 92, 1.4)        # cold open: bus stop at night, the phone ringing MOM, a red knit glove jabbing the answer button, nothing
OUTRO = 20
EMPH = {0: [4, 7], 1: [3, 6], 2: [0, 3], 3: [2, 5], 4: [3, 5], 5: [1, 8], 6: [4, 9], 7: [3, 4], 8: [1, 4], 9: [0, 4],
        10: [3, 6], 11: [2], 12: [1, 4], 13: [3], 14: [2, 7], 15: [3, 8], 16: [1], 17: [1, 6], 18: [5, 10], 19: [5],
        20: [0, 4], 21: [0, 3]}
def SFX():
    return [(W(3, 5), 'zoom_in', 0.12), (W(4, 5), 'electric_zap', 0.10), (W(5, 9), 'electric_zap', 0.12), (W(6, 9), 'ding', 0.12),
            (W(9, 6), 'boing', 0.12), (W(10, 6), 'crickets', 0.10), (W(11, 2), 'slide_whistle_up', 0.10),
            (W(14, 7), 'ding', 0.10), (E(16, -0.05), 'rimshot', 0.12), (W(18, 11), 'ding', 0.12)]

# 0 hook: Blue confused at his phone, mock-offended on "gloves" (after the cold open), shrug
cut(0, 'cuB'); ex('B', 0, 'confused'); ex('O', 0, 'neutral'); ex('B', W(0, 7), 'mock-offended'); ge('B', 'shrug', W(0, 4), E(0), 0.6)
# 1 Orange deadpan non-answer, tiny push on "all"
cut(S(1, -0.04), 'cuO'); ex('O', S(1), 'done'); PUSH.append((W(1, 6), 0.04))
# 2 two-shot: Blue mock-offended on "Rude", points at himself on "here"; Orange stays done
cut(S(2, -0.04), 'two'); ex('B', S(2, -2 * F), 'mock-offended'); ex('O', S(2, REG), 'done'); ge('B', 'point', W(2, 2), E(2), 0.6)
# 3 Orange sighs, then the x-ray: the wire grid appears on "grid"
cut(S(3, -0.06), 'cuO'); ex('O', S(3), 'done'); ex('O', W(3, 0), 'neutral'); ge('O', 'talk', W(3, 0), W(3, 2), 0.5)
ins(W(3, 2, -0.04), (W(3, 2), 104), (W(3, 5), 150), (E(3), 198))
# 4 the charge sparks along the wires on "charge"
ins(S(4, -0.04), (S(4), 202), (W(4, 5), 225), (E(4), 278))
# 5 listener shot: Blue curious, looks at his own hand on "skin", then the section: the finger presses, charge flows up
cut(S(5, -0.04), 'cuB'); ex('B', S(5, -2 * F), 'curious'); ex('B', W(5, 2), 'confused'); ex('O', S(5, REG), 'neutral')
ins(W(5, 3, -0.04), (W(5, 3), 288), (W(5, 6), 315), (W(5, 8), 322), (E(5), 398))
# 6 the phone: the bare finger lands, the dip ring on "dip", TAP! on "tap"
ins(S(6, -0.04), (S(6), 402), (W(6, 4), 428), (W(6, 9), 450), (E(6), 478))
# 7 Blue: smug on "steals", point at his finger
cut(S(7, -0.04), 'cuB'); ex('B', S(7, -2 * F), 'curious'); ex('B', W(7, 3), 'smug'); ge('B', 'point', W(7, 2), E(7), 0.6)
ex('O', S(7, REG), 'side-eye')
# 8 Orange deadpan: "A tiny bit. Yes. Every tap.", smug on "Every"
cut(S(8, -0.06), 'cuO'); ex('O', S(8), 'done'); ex('O', W(8, 4), 'smug')
# 9 the section with the knit glove: the charge bounces back on "conduct", X on "nowhere"
ex('O', S(9), 'neutral'); ins(S(9, -0.04), (S(9), 484), (W(9, 4), 515), (W(9, 8), 548), (E(9), 578))
# 10 listener: Blue confused on "screen", then the gloved hand goes ghost on "not there"
cut(S(10, -0.04), 'cuB'); ex('B', S(10, -2 * F), 'confused'); ex('O', S(10, REG), 'neutral')
ins(W(10, 3, -0.04), (W(10, 3), 600), (W(10, 6), 624), (E(10), 655))
# 11 Blue gasps: the one shock face, panic
cut(S(11, -0.04), 'cuB'); ex('B', S(11, -2 * F), 'shock'); ge('B', 'panic', W(11, 0), E(11), 0.7)
# 12 Orange deadpan punchline, push-in on "warm"
cut(S(12, -0.06), 'cuO'); ex('O', S(12), 'done'); PUSH.append((W(12, 4), 0.05)); ex('B', S(12, REG), 'confused')
# 13 Blue curious, fake-innocent on "sausage"
cut(S(13, -0.04), 'cuB'); ex('B', S(13, -2 * F), 'curious'); ex('B', W(13, 3), 'fake-innocent'); ge('B', 'talk', W(13, 1), E(13), 0.5)
ex('O', S(13, REG), 'side-eye')
# 14 Orange sighs "Yep.", then the sausage in a gloved fist taps: dip, TAP! on "conducts"
cut(S(14, -0.06), 'cuO'); ex('O', S(14), 'done')
ins(W(14, 1, -0.04), (W(14, 1), 662), (W(14, 4), 692), (W(14, 7), 714), (E(14), 758))
# 15 two-shot: Blue's real laugh, Orange side-eye; Blue smug on "stop"
cut(S(15, -0.04), 'two'); ex('B', S(15, -2 * F), 'laugh'); ex('O', S(15, REG), 'side-eye'); ex('B', W(15, 8), 'smug')
ge('B', 'shrug', W(15, 3), E(15), 0.7)
# 16 punchline: Orange done, push-in on "don't", the one crack after it
cut(S(16, -0.06), 'cuO'); ex('O', S(16), 'done'); PUSH.append((W(16, 1), 0.06)); ex('O', E(16, -0.2), 'holding-laugh')
# 17 the touchscreen glove close-up, sparkle on "thread"
ex('O', S(17), 'neutral'); ins(S(17, -0.04), (S(17), 762), (W(17, 6), 790), (E(17), 838))
# 18 the section: the charge runs up the thread on "runs", check on "lands"
ins(S(18, -0.04), (S(18), 842), (W(18, 2), 874), (W(18, 11), 918), (E(18), 960))
# 19 Blue whispering: side-eye, fake-innocent on "nose", point at it
cut(S(19, -0.04), 'cuB'); ex('B', S(19), 'side-eye'); ex('B', W(19, 5), 'fake-innocent'); ge('B', 'point', W(19, 4), E(19), 0.6)
ex('O', S(19, REG), 'done')
# 20 Orange sighs, facepalm on "Sure", tiny smug on "know"
cut(S(20, -0.04), 'cuO'); ex('O', S(20), 'done'); ge('O', 'facepalm', W(20, 0), W(20, 2), 0.5); ex('O', W(20, 4), 'smug')
# 21 restore the hook pose: Blue confused on "and" (loops into "Why does my phone ignore me in gloves?")
cut(S(21, -0.06), 'cuB'); ex('B', S(21, -0.06), 'curious'); ex('B', W(21, 5), 'confused'); ex('O', S(21, REG), 'neutral')
