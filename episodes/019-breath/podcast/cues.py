# 019 breath podcast: acting cue sheet (Expression & Comedy Acting Rules v1.1)
SRC = '019-breath'
HOOK = (20, 92, 1.4)        # cold open: winter morning, the huge white breath cloud, "?"
OUTRO = 18
SERIES = 'INSIDE YOUR BODY'
EMPH = {0: [3, 5, 8], 1: [2, 3], 2: [0, 3, 5], 3: [1, 5], 4: [4, 8, 10], 5: [0, 4, 9], 6: [2, 5, 11], 7: [0, 2, 4, 8],
        8: [0, 3, 6], 9: [2, 4, 6], 10: [0, 5], 11: [1, 3, 6], 12: [3, 7], 13: [0, 3], 14: [1, 5, 7], 15: [5, 6],
        16: [0, 3, 11], 17: [3, 6, 8], 18: [1, 3, 4, 8], 19: [0, 2, 6]}
STAMPS.append((W(2, 5), 'WRONG', '#e8273a', 1.4))
def SFX():
    return [(0.05, 'wind_cold', 0.07), (W(2, 5), 'dramatic_sting', 0.07), (W(3, 5), 'water_drip', 0.11), (W(4, 8), 'whoosh_fast', 0.08),
            (W(5, 4), 'wind_cold', 0.08), (W(6, 5), 'ding', 0.10), (W(6, 11), 'pop_bubble', 0.10), (W(7, 4), 'text_pop', 0.08),
            (W(9, 4), 'slide_whistle_down', 0.07), (W(10, 5), 'ding', 0.12), (W(12, 7), 'text_pop', 0.08),
            (E(13, -0.05), 'rimshot', 0.12), (W(14, 7), 'pop_bubble', 0.12), (W(16, 0), 'record_scratch', 0.09),
            (W(17, 8), 'sad_trombone', 0.08)]

# 0 hook: Blue curious, rubs the cold off with a shrug on "cold"
cut(0, 'cuB'); ex('B', 0, 'curious'); ex('O', 0, 'neutral'); ge('B', 'shrug', W(0, 8), E(0), 0.5)
# 1 Orange deadpan non-answer, tiny push on "Congrats"
cut(S(1, -0.04), 'cuO'); ex('O', S(1), 'done'); PUSH.append((W(1, 3), 0.04))
# 2 two-shot: Blue smug, points at himself on "dragon" (WRONG stamp lands there); Orange side-eye
cut(S(2, -0.04), 'two'); ex('B', S(2, -2 * F), 'smug'); ex('O', S(2, REG), 'side-eye'); ge('B', 'point', W(2, 5), E(2), 0.6)
# 3 Orange sighs, then the lungs: drops appear on "damp"
cut(S(3, -0.06), 'cuO'); ex('O', S(3), 'done'); ex('O', W(3, 0), 'neutral'); ge('O', 'talk', W(3, 1), W(3, 3), 0.5)
ins(W(3, 1, -0.04), (W(3, 1), 104), (W(3, 5), 128), (E(3), 198))
# 4 indoors: the vapor dots stream out, warm glow, INVISIBLE VAPOR
ins(S(4, -0.04), (S(4), 202), (W(4, 4), 222), (W(4, 8), 236), (E(4), 288))
# 5 outside: cold air on "cold", the dots slow on "loses"
ins(S(5, -0.04), (S(5), 292), (W(5, 4), 318), (W(5, 7), 340), (E(5), 378))
# 6 magnifier: thermometer reaches the dew point on "dew", dots clump on "liquid"
ins(S(6, -0.04), (S(6), 382), (W(6, 2), 400), (W(6, 5), 426), (W(6, 11), 462), (E(6), 468))
# 7 listener shot: Blue leans in curious, then the droplet cloud on "droplets"
cut(S(7, -0.04), 'cuB'); ex('B', S(7, -2 * F), 'curious'); ex('O', S(7, REG), 'neutral')
ins(W(7, 2, -0.04), (W(7, 2), 476), (W(7, 4), 520), (E(7), 558))
# 8 Blue gasps: the one shock face, panic hands on "cloud"
cut(S(8, -0.04), 'cuB'); ex('B', S(8, -2 * F), 'shock'); ge('B', 'panic', W(8, 3), E(8), 0.6); ex('B', W(8, 6), 'curious')
ex('O', S(8, REG), 'done')
# 9 tiny cloud by the mouth on "small", push on "Yes"
ins(S(9, -0.04), (S(9), 562), (E(9), 600)); ex('O', S(9), 'done')
# 10 Blue mock-offended in the two-shot, then the crown pops on the cloud on "majestic"
cut(S(10, -0.04), 'two'); ex('B', S(10, -2 * F), 'mock-offended'); ex('O', S(10, REG), 'done'); ge('B', 'point', W(10, 2), W(10, 4), 0.6)
ins(W(10, 5, -0.04), (W(10, 5), 604), (E(10), 640))
# 11 real clouds and morning fog: fog rolls on "fog", SAME WAY
ex('O', S(11), 'neutral'); ins(S(11, -0.04), (S(11), 652), (W(11, 3), 690), (W(11, 8), 718), (E(11), 738))
# 12 Blue's real laugh in the two-shot, shrug on "forecast"
cut(S(12, -0.04), 'two'); ex('B', S(12, -2 * F), 'laugh'); ex('O', S(12, REG), 'side-eye'); ex('B', W(12, 4), 'smug')
ge('B', 'shrug', W(12, 4), E(12), 0.7)
# 13 forecast card punchline: PARTLY CLOUDY on "Partly", MOSTLY ANNOYING on "Mostly", then Orange's one crack
ins(S(13, -0.04), (S(13), 742), (W(13, 0), 750), (W(13, 2), 792), (E(13), 812))
cut(E(13, -0.12), 'cuO'); ex('O', E(13, -0.12), 'holding-laugh'); PUSH.append((E(13, -0.1), 0.05))
# 14 poof: the droplets evaporate on "evaporate", POOF
ex('O', W(14, 1), 'neutral'); ins(W(14, 2, -0.04), (W(14, 2), 836), (W(14, 5), 852), (W(14, 7), 884), (E(14), 908))
# 15 Blue curious, shrug
cut(S(15, -0.04), 'cuB'); ex('B', S(15, -2 * F), 'curious'); ex('O', S(15, REG), 'neutral'); ge('B', 'shrug', W(15, 5), E(15), 0.5)
# 16 "Nope." on Orange, then the split humid vs dry at 45 F on "humid"
cut(S(16, -0.04), 'cuO'); ex('O', S(16), 'done')
ins(W(16, 3, -0.04), (W(16, 3), 914), (W(16, 11), 958), (E(16), 975))
# 17 Blue whisper, side-eye, facepalm on "cancelled" (the split stays: dry side, barely a puff)
cut(S(17, -0.04), 'cuB'); ex('B', S(17, -2 * F), 'side-eye'); ex('B', W(17, 8), 'done'); ge('B', 'facepalm', W(17, 8), E(17), 0.6)
ex('O', S(17, REG), 'side-eye')
# 18 Orange sighs, tiny smug on "know", push on "real"
cut(S(18, -0.04), 'cuO'); ex('O', S(18), 'done'); PUSH.append((W(18, 4), 0.04)); ex('O', W(18, 8), 'smug')
# 19 restore the hook pose: Blue giggles, rubs his arms (shrug) on "freezing", curious on "question" (loops into the hook)
cut(S(19, -0.06), 'cuB'); ex('B', S(19, -0.06), 'fake-innocent'); ge('B', 'shrug', W(19, 2), W(19, 4), 0.5)
ex('B', W(19, 5), 'curious'); ex('O', S(19, REG), 'neutral')
