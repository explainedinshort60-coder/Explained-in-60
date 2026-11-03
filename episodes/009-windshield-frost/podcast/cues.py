# 009 windshield frost podcast: acting cue sheet (Expression & Comedy Acting Rules v1.1)
SRC = '009-windshield-frost'
HOOK = (30, 92, 1.4)        # cold open: frost spreading across the windshield while the thermometer reads 37 F
OUTRO = 16
EMPH = {0: [1, 7], 1: [3], 2: [0, 3], 3: [4], 5: [0, 4], 8: [3, 6], 10: [5, 9], 11: [6], 12: [4, 7], 15: [2, 5], 16: [6], 17: [0, 3]}
def SFX():
    return [(0.10, 'wind_cold', 0.12), (W(7, 3), 'slide_whistle_down', 0.14), (W(9, 11), 'pop_bubble', 0.20),
            (W(13, 2), 'mech_clunk', 0.18), (W(14, 0), 'whoosh_deep', 0.12), (W(15, 5), 'boing', 0.14)]

# 0 hook: Blue side-eye at the cold, confused on "frozen" (after the cold open)
cut(0, 'cuB'); ex('B', 0, 'side-eye'); ex('O', 0, 'neutral'); ex('B', W(0, 7), 'confused'); ge('B', 'point', W(0, 6), E(0), 0.6)
# 1 Orange deadpan non-answer, tiny push on "isn't"
cut(S(1, -0.04), 'cuO'); ex('O', S(1), 'done'); PUSH.append((W(1, 3), 0.04))
# 2 Blue sarcastic: side-eye, smug on "professor", shrug
cut(S(2, -0.04), 'two'); ex('B', S(2, -2 * F), 'side-eye'); ex('O', S(2, REG), 'done'); ex('B', W(2, 3), 'smug'); ge('B', 'shrug', W(2, 1), E(2), 0.7)
# 3 Orange sighs, then the air thermometer on "air", 4 FT bracket
cut(S(3, -0.06), 'cuO'); ex('O', S(3), 'done'); ex('O', W(3, 0), 'neutral'); ge('O', 'talk', W(3, 0), W(3, 2), 0.5)
ins(W(3, 4, -0.04), (W(3, 4), 130), (E(3), 198))
# 4 glass leaning back, tilt up to the clear sky on "staring"
ins(S(4, -0.04), (S(4), 210), (W(4, 5), 246), (E(4), 300))
# 5 listener shot: Blue curious, fake-innocent on "romantic"
cut(S(5, -0.04), 'cuB'); ex('B', S(5, -2 * F), 'curious'); ex('B', W(5, 4), 'fake-innocent'); ge('B', 'talk', W(5, 1), E(5), 0.6)
# 6 Orange deadpan, heat leaves for the sky on "Everything", the tiny return on "sends back"
cut(S(6, -0.06), 'cuO'); ex('O', S(6), 'done'); ex('O', W(6, 2), 'neutral')
ins(W(6, 3, -0.04), (W(6, 3), 318), (W(6, 11), 368), (E(6), 420))
# 7 glass dial 37 to 30 on "freezing" while the air stays 37
ins(S(7, -0.04), (S(7), 432), (W(7, 5), 498), (E(7), 520))
# 8 Blue gasps: the one shock face
cut(S(8, -0.04), 'cuB'); ex('B', S(8, -2 * F), 'shock'); ex('B', W(8, 6), 'confused'); ge('B', 'panic', W(8, 3), E(8), 0.6)
# 9 vapor lands and turns into ice on "ice"
ins(S(9, -0.04), (S(9), 524), (W(9, 4), 566), (W(9, 11), 612), (E(9), 640))
# 10 two-shot: Blue's real laugh, Orange stays deadpan
cut(S(10, -0.04), 'two'); ex('B', S(10, -2 * F), 'laugh'); ex('O', S(10, REG), 'side-eye'); ex('B', W(10, 10), 'smug')
ge('B', 'shrug', W(10, 9), E(10), 0.7)
# 11 punchline: Orange done, push-in on "routine", the one crack after it
cut(S(11, -0.06), 'cuO'); ex('O', S(11), 'done'); PUSH.append((W(11, 6), 0.06)); ex('O', E(11, -0.25), 'holding-laugh')
# 12 Blue suspicious, point on "neighbor's"
cut(S(12, -0.06), 'cuB'); ex('B', S(12), 'side-eye'); ge('B', 'point', W(12, 4), E(12), 0.6); ex('B', W(12, 7), 'curious')
ex('O', S(12, 0.4), 'neutral')
# 13 carport slides in on "roof", heat sent back down, glass clears
ins(S(13, -0.04), (S(13), 762), (W(13, 2), 800), (E(13), 878))
# 14 clouds roll in on "Clouds", blanket
ins(S(14, -0.04), (S(14), 892), (W(14, 6), 944), (E(14), 986))
# 15 Blue whispers the sneaky plan: fake-innocent, wink on "carport"
cut(S(15, -0.04), 'cuB'); ex('B', S(15), 'fake-innocent'); ex('B', W(15, 5), 'wink')
# 16 Orange sighs, the tree on "tree", back for "And now you know" with a tiny smug
cut(S(16, -0.04), 'cuO'); ex('O', S(16), 'done')
ins(W(16, 1, -0.04), (W(16, 1), 996), (W(16, 3), 1050))
cut(W(16, 3, -0.04), 'cuO'); ge('O', 'facepalm', W(16, 3), W(16, 5), 0.5); ex('O', W(16, 6), 'smug')
# 17 restore the hook pose: Blue side-eye, confused on "sense" (loops into "It's 37 out")
cut(S(17, -0.06), 'cuB'); ex('B', S(17, -0.06), 'side-eye'); ex('B', W(17, 4), 'confused'); ex('O', S(17, REG), 'neutral')
