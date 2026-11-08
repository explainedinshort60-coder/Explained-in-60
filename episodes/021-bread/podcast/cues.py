# 021 bread podcast (viewer request @Ducksonic12): acting cue sheet (Expression & Comedy Acting Rules v1.1, week 2 beats)
SRC = '021-bread'
SERIES = 'YOU ASKED · @Ducksonic12'
HOOK = (10, 70, 1.4)        # cold open: the loaf with a bicycle pump jammed in it, pumping (Blue's myth)
OUTRO = 12
STAMPS.append((W(0, 5), 'WRONG', '#e8273a', 1.6))
EMPH = {0: [2, 5], 1: [0, 3], 3: [0, 15], 4: [3, 11], 5: [4], 6: [8, 11], 7: [4, 14], 8: [7], 9: [15, 16], 10: [4, 13], 11: [8, 9], 12: [7, 12], 13: [4]}
def SFX():
    return [(W(0, 5), 'air_hiss', 0.14), (W(1, 3), 'pop_bubble', 0.22), (W(4, 3), 'pop_bubble', 0.18),
            (W(7, 8), 'air_hiss', 0.12), (W(9, 15), 'whoosh_deep', 0.14), (W(10, 4), 'slide_whistle_down', 0.14),
            (W(11, 9), 'boing', 0.16)]

# 0 Blue's myth, confidently wrong; WRONG stamp on "pump"
cut(0, 'cuB'); ex('B', 0, 'confidently-wrong'); ex('O', 0, 'neutral'); ge('B', 'point', W(0, 4), E(0), 0.6)
# 1 Orange: "Nope." then straight to the yeast reveal
cut(S(1, -0.04), 'cuO'); ex('O', S(1), 'done'); PUSH.append((W(1, 0), 0.04))
ins(W(1, 1, -0.04), (W(1, 1), 104), (E(1), 140))
# 2 Blue gasps: the one shock face
cut(S(2, -0.04), 'cuB'); ex('B', S(2, -2 * F), 'shock'); ge('B', 'panic', W(2, 0), E(2), 0.6)
# 3 yeast eat sugar
ins(S(3, -0.04), (S(3), 112), (W(3, 13), 150), (E(3), 190))
# 4 burps: CO2 bubbles, then alcohol drops on "alcohol"
ins(S(4, -0.04), (S(4), 150), (W(4, 8), 200), (E(4), 258))
# 5 listener: Blue whispers "party", fake-innocent then smug
cut(S(5, -0.04), 'cuB'); ex('B', S(5, -2 * F), 'fake-innocent'); ex('B', W(5, 4), 'smug'); ex('O', S(5, REG), 'side-eye')
# 6 Orange "Calm down" then gluten net linking on "Kneading"
cut(S(6, -0.04), 'cuO'); ex('O', S(6), 'done'); ex('O', W(6, 2), 'neutral')
ins(W(6, 2, -0.04), (W(6, 2), 270), (W(6, 8), 330), (E(6), 352))
# 7 trapped burps inflate
ins(S(7, -0.04), (S(7), 352), (W(7, 8), 395), (E(7), 419))
cut(W(7, 10, -0.04), 'two'); ex('B', W(7, 10), 'curious')
ins(W(7, 12, -0.04), (W(7, 12), 440), (E(7), 505))
# 8 Blue's absurd idea: eat the balloon
cut(S(8, -0.04), 'cuB'); ex('B', S(8, -2 * F), 'curious'); ex('B', W(8, 4), 'smug'); ge('B', 'shrug', W(8, 4), E(8), 0.7)
# 9 Orange deadpan "Because it's raw", then the oven spring on "oven"
cut(S(9, -0.04), 'cuO'); ex('O', S(9), 'done'); PUSH.append((W(9, 2), 0.05))
ins(W(9, 3, -0.04), (W(9, 3), 522), (W(9, 15), 590), (E(9), 600))
# 10 140 F, yeast die on "die", crumb sets on "set", bubbles freeze
ins(S(10, -0.04), (S(10), 600), (W(10, 1), 630), (W(10, 4), 638), (W(10, 9), 662), (E(10), 668))
# 11 Blue amazed: frozen burp, cut to the toast on "toast"
cut(S(11, -0.04), 'cuB'); ex('B', S(11, -2 * F), 'wait-WHAT')
ins(W(11, 5, -0.04), (W(11, 5), 712), (E(11), 780))
# 12 Orange sighs, alcohol wisps on "alcohol", back for "And now you know"
cut(S(12, -0.04), 'cuO'); ex('O', S(12), 'done')
ins(W(12, 5, -0.04), (W(12, 5), 664), (E(12, -1.0), 700))
cut(W(12, 13, -0.04), 'cuO'); ex('O', W(12, 13), 'smug'); ge('O', 'talk', W(12, 13), E(12), 0.5)
# 13 Blue whispers the myth again (loops into the pump hook)
cut(S(13, -0.06), 'cuB'); ex('B', S(13, -0.06), 'fake-innocent'); ex('B', W(13, 4), 'confidently-wrong'); ex('O', S(13, REG), 'side-eye')
