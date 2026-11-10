# 025 dust podcast: acting cue sheet (Expression & Comedy Acting Rules v1.1). Series: Is It Really?
SRC = '025-dust'
SERIES = 'IS IT REALLY?'
HOOK = (40, 110, 1.4)       # cold open: floor heat register, Blue's breath blows a gray dust cloud up, ALL DEAD SKIN?
OUTRO = 12
STAMPS.append((W(0, 5), 'WRONG', '#e8273a', S(1) - W(0, 5) - 0.08))   # on "skin", clears before Orange's close-up
EMPH = {0: [2, 5], 1: [0, 1, 7], 2: [0, 4], 3: [1, 2, 7, 15], 4: [1, 3, 8], 5: [1, 4, 11], 6: [2, 6], 7: [1, 7, 12],
        8: [1, 3, 12], 9: [2, 4], 10: [2, 8, 13], 11: [2, 5, 7], 12: [1, 2], 13: [0, 2]}
def SFX():
    return [(0.05, 'whoosh_deep', 0.08), (W(0, 5), 'dramatic_sting', 0.07), (W(1, 0), 'record_scratch', 0.08),
            (W(1, 1, -0.04), 'zoom_in', 0.08), (W(1, 7), 'pop_bubble', 0.08), (W(2, 4), 'boing', 0.06),
            (W(3, 7), 'swish_pop', 0.07), (W(3, 15), 'text_pop', 0.08), (W(4, 3), 'wind_cold', 0.05),
            (W(5, 4), 'bass_boom', 0.08), (W(5, 11), 'ding', 0.07), (W(6, 0), 'gasp_crowd', 0.05),
            (W(7, 1), 'text_pop', 0.08), (W(7, 7), 'pop_bubble', 0.07), (W(8, 4), 'swish_pop', 0.07),
            (W(8, 12), 'text_pop', 0.08), (W(9, 2), 'slide_whistle_down', 0.05), (W(10, 6), 'mech_clunk', 0.08),
            (W(10, 13), 'swish_pop', 0.07), (W(11, 7), 'rimshot', 0.05), (W(13, 0), 'whoosh_fast', 0.08)]

# 0 Blue's myth, smug and sure; WRONG stamp on "skin"
cut(0, 'cuB'); ex('B', 0, 'smug'); ex('O', 0, 'neutral'); ge('B', 'point', W(0, 4), E(0), 0.7)
# 1 Orange: "Nope." push-in, deadpan; cut to the magnifier on "Most"
cut(S(1, -0.04), 'cuO'); ex('O', S(1), 'done'); PUSH.append((W(1, 0), 0.04)); ex('B', S(1, REG), 'confused')
ins(W(1, 1, -0.04), (W(1, 1), 166), (W(1, 7), 214), (E(1), 235))
# 2 Blue takes "walked in" literally: the one mock-offended beat
cut(S(2, -0.04), 'cuB'); ex('B', S(2, -2 * F), 'mock-offended'); ge('B', 'shrug', W(2, 4), E(2), 0.6)
# 3 shoes and paws track it in
ins(S(3, -0.04), (S(3), 300), (W(3, 7), 380), (W(3, 15), 420), (E(3), 425))
# 4 tiny bits float in through the window
ins(S(4, -0.04), (S(4), 425), (W(4, 3), 440), (E(4), 498))
# 5 the OH!: over sixty percent from outdoors (by 0:16)
ins(S(5, -0.04), (S(5), 500), (W(5, 4), 506), (W(5, 5), 560), (E(5), 600))
# 6 Blue gasps: the one shock face, his house is the yard
cut(S(6, -0.04), 'cuB'); ex('B', S(6, -2 * F), 'shock'); ge('B', 'panic', W(6, 2), E(6), 0.6); ex('O', S(6, REG), 'side-eye')
# 7 skin is in there too, with carpet and couch fibers
ins(S(7, -0.04), (S(7), 600), (W(7, 1), 612), (W(7, 7), 640), (E(7), 690))
# 8 the fix: shoes off, a good mat just inside
ins(S(8, -0.04), (S(8), 700), (W(8, 3), 712), (W(8, 4), 740), (W(8, 12), 775), (E(8), 799))
# 9 Blue panics: he is wearing shoes right now
cut(S(9, -0.04), 'cuB'); ex('B', S(9, -2 * F), 'fake-innocent'); ge('B', 'panic', W(9, 2), E(9), 0.7)
# 10 Orange, dry: the heat is coming on; cut to the furnace filter on "check"
cut(S(10, -0.04), 'cuO'); ex('O', S(10), 'done'); PUSH.append((W(10, 2), 0.04))
ins(W(10, 6, -0.04), (W(10, 6), 800), (W(10, 9), 836), (W(10, 11), 842), (W(10, 13), 862), (E(10), 912))
# 11 Blue laughs, blames his shoes; Orange's rare crack as the listener
cut(S(11, -0.04), 'two'); ex('B', S(11, -2 * F), 'laugh'); ex('B', W(11, 4), 'smug'); ex('O', S(11, REG), 'side-eye')
ex('O', W(11, 5, REG), 'holding-laugh'); ge('B', 'point', W(11, 5), E(11), 0.6)
# 12 Orange sighs, "You're both gross. And now you know.", push-in on "gross"
cut(S(12, -0.04), 'cuO'); ex('O', S(12), 'done'); ex('O', W(12, 3), 'smug'); PUSH.append((W(12, 2), 0.05)); ge('O', 'talk', W(12, 3), E(12), 0.5)
# 13 Blue's loop line: blows the dust, "Bye, skin." back to the vent
cut(S(13, -0.06), 'cuB'); ex('B', S(13, -0.06), 'smug'); ge('B', 'point', W(13, 1), E(13), 0.6); ex('O', S(13, REG), 'side-eye')
