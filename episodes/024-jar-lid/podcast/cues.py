# 024 jar lid podcast: acting cue sheet (Expression & Comedy Acting Rules v1.1). Series: You've Been Doing It Wrong
SRC = '024-jar-lid'
SERIES = "YOU'VE BEEN DOING IT WRONG"
HOOK = (20, 90, 1.4)        # cold open: pickle jar, hand straining on the gold lid, STUCK!
OUTRO = 13
STAMPS.append((W(0, 4), 'WRONG', '#e8273a', S(1) - W(0, 4) - 0.08))   # on "harder", clears before Orange's close-up
EMPH = {0: [1, 4], 1: [0, 2, 6], 2: [1, 3, 7], 3: [2, 4, 8], 4: [3, 6, 9], 5: [1, 5], 6: [1, 2, 12], 7: [3, 7, 15],
        8: [2, 6], 9: [1], 10: [1, 3, 11, 14], 11: [2, 5, 7], 12: [2, 7], 13: [0, 5], 14: [2, 3]}
def SFX():
    return [(0.05, 'gear_ratchet', 0.08), (W(0, 4), 'dramatic_sting', 0.07), (W(1, 0), 'record_scratch', 0.08),
            (W(1, 2, -0.04), 'whoosh_fast', 0.08), (W(3, 4), 'pop_bubble', 0.09), (W(4, 6), 'bass_boom', 0.08),
            (W(5, 1), 'gasp_crowd', 0.05), (W(6, 2), 'mech_clunk', 0.08), (W(6, 12), 'gear_ratchet', 0.07),
            (W(7, 7), 'whoosh_fast', 0.07), (W(7, 15), 'spring_twang', 0.06), (W(8, 2), 'air_hiss', 0.12),
            (W(10, 2), 'faucet_on', 0.10), (W(10, 11), 'text_pop', 0.09), (W(11, 7), 'cork_pop', 0.10),
            (W(12, 7), 'sad_trombone', 0.05), (W(13, 1), 'rimshot', 0.05)]

# 0 Blue's myth, smug, mimes a squeeze; WRONG stamp on "harder"
cut(0, 'cuB'); ex('B', 0, 'smug'); ex('O', 0, 'neutral'); ge('B', 'point', W(0, 3), E(0), 0.7)
# 1 Orange: "Nope." push-in, deadpan; cut to the cross-section on "air"
cut(S(1, -0.04), 'cuO'); ex('O', S(1), 'done'); PUSH.append((W(1, 0), 0.04)); ex('B', S(1, REG), 'confused')
ins(W(1, 2, -0.04), (W(1, 2), 150), (E(1), 200))
# 2 Blue offended: the air is on his side (the one mock-offended beat)
cut(S(2, -0.04), 'cuB'); ex('B', S(2, -2 * F), 'mock-offended'); ge('B', 'point', W(2, 3), E(2), 0.6)
# 3 vacuum: LESS AIR inside
ins(S(3, -0.04), (S(3), 200), (W(3, 2), 212), (W(3, 4), 222), (E(3), 270))
# 4 the outside air presses the lid down (the OH! by 0:13)
ins(S(4, -0.04), (S(4), 270), (W(4, 6), 296), (W(4, 9), 330), (E(4), 398))
# 5 Blue gasps: the one shock face, paranoid
cut(S(5, -0.04), 'cuB'); ex('B', S(5, -2 * F), 'shock'); ge('B', 'panic', W(5, 1), E(5), 0.6); ex('O', S(5, REG), 'side-eye')
# 6 friction close-up
ins(S(6, -0.04), (S(6), 400), (W(6, 2), 420), (W(6, 7), 470), (W(6, 12), 495), (E(6), 518))
# 7 the spoon fix
ins(S(7, -0.04), (S(7), 520), (W(7, 5), 545), (W(7, 15), 610), (E(7), 640))
# 8 the hiss
ins(S(8, -0.04), (S(8), 640), (W(8, 2), 662), (E(8), 716))
# 9 Blue whispers, betrayed by a jar
cut(S(9, -0.04), 'cuB'); ex('B', S(9, -2 * F), 'fake-innocent'); ge('B', 'shrug', W(9, 1), E(9), 0.5)
# 10 hot tap water: metal grows more than glass
cut(S(10, -0.04), 'cuO'); ex('O', S(10), 'done'); PUSH.append((W(10, 1), 0.05))
ins(W(10, 2, -0.04), (W(10, 2), 722), (W(10, 10), 790), (W(10, 14), 825), (E(10), 850))
# 11 loosens a hair, twist, it opens
ins(S(11, -0.04), (S(11), 850), (W(11, 2), 865), (W(11, 7), 880), (E(11), 916))
# 12 Blue laughs at himself; Orange's rare crack as the listener
cut(S(12, -0.04), 'two'); ex('B', S(12, -2 * F), 'laugh'); ex('B', W(12, 4), 'fake-innocent'); ex('O', S(12, REG), 'side-eye')
ex('O', W(12, 6, REG), 'holding-laugh'); ge('B', 'facepalm', W(12, 4), E(12), 0.7)
# 13 Orange sighs, "And now you know", push-in
cut(S(13, -0.04), 'cuO'); ex('O', S(13), 'done'); ex('O', W(13, 2), 'smug'); PUSH.append((W(13, 2), 0.04)); ge('O', 'talk', W(13, 2), E(13), 0.5)
# 14 Blue's loop line: straining, still squeezing, back to the stuck jar
cut(S(14, -0.06), 'cuB'); ex('B', S(14, -0.06), 'smug'); ge('B', 'panic', W(14, 2), E(14), 0.6); ex('O', S(14, REG), 'side-eye')
