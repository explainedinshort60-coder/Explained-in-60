# 011 OLED perfect black podcast: acting cue sheet (Expression & Comedy Acting Rules v1.1)
SRC = '011-oled-black'
HOOK = (20, 92, 1.4)        # cold open: the gray-glowing TV black behind the true-black tablet, same night-sky picture
OUTRO = 18
EMPH = {0: [3, 4], 1: [2, 7], 2: [0, 5], 3: [9, 10], 4: [4, 9], 5: [5, 9], 6: [3, 7], 7: [2, 8], 8: [3, 5], 9: [1, 8],
        10: [2, 5], 11: [2, 8], 12: [4, 7], 13: [4, 7], 14: [3, 6], 15: [5, 9], 16: [1, 4], 17: [1, 3], 18: [1, 5], 19: [0, 2]}
def SFX():
    return [(W(3, 10), 'pop_bubble', 0.18), (W(4, 9), 'electric_zap', 0.10), (W(5, 5), 'crowd_stadium', 0.10),
            (W(6, 7), 'light_switch', 0.22), (W(10, 2), 'mech_click', 0.18), (W(11, 9), 'slide_whistle_down', 0.12),
            (W(13, 7), 'rimshot', 0.12), (W(15, 5), 'gear_ratchet', 0.12), (W(16, 4), 'whoosh_deep', 0.12)]

# 0 hook: Blue curious, side-eye on "blacker" (after the cold open), point at the screen
cut(0, 'cuB'); ex('B', 0, 'curious'); ex('O', 0, 'neutral'); ex('B', W(0, 4), 'side-eye'); ge('B', 'point', W(0, 3), E(0), 0.6)
# 1 Orange deadpan non-answer, tiny push on "nothing"
cut(S(1, -0.04), 'cuO'); ex('O', S(1), 'done'); PUSH.append((W(1, 7), 0.04))
# 2 two-shot: Blue sarcastic, smug on "mug", shrug; Orange stays done
cut(S(2, -0.04), 'two'); ex('B', S(2, -2 * F), 'side-eye'); ex('O', S(2, REG), 'done'); ex('B', W(2, 5), 'smug'); ge('B', 'shrug', W(2, 1), E(2), 0.7)
# 3 Orange sighs, then the pixel grid lights up lamp by lamp from "dot"
cut(S(3, -0.06), 'cuO'); ex('O', S(3), 'done'); ex('O', W(3, 0), 'neutral'); ge('O', 'talk', W(3, 0), W(3, 1), 0.5)
ins(W(3, 1, -0.04), (W(3, 1), 112), (W(3, 10), 182), (E(3), 198))
# 4 one pixel in cross-section, the organic layer glows on "glows"
ins(S(4, -0.04), (S(4), 204), (W(4, 9), 236), (E(4), 318))
# 5 listener shot: Blue curious, fake-innocent on "flashlights"
cut(S(5, -0.04), 'cuB'); ex('B', S(5, -2 * F), 'curious'); ex('B', W(5, 9), 'fake-innocent'); ge('B', 'talk', W(5, 2), E(5), 0.6)
ex('O', S(5, REG), 'side-eye')
# 6 Orange deadpan "Sure.", then the dark lamps switch off on "switch off"
cut(S(6, -0.06), 'cuO'); ex('O', S(6), 'done')
ins(W(6, 3, -0.04), (W(6, 3), 330), (W(6, 7), 352), (E(6), 430))
# 7 Blue gasps: the one shock face, then confused on "off"
cut(S(7, -0.04), 'cuB'); ex('B', S(7, -2 * F), 'shock'); ge('B', 'panic', W(7, 0), W(7, 2), 0.6); ex('B', W(7, 8), 'confused')
# 8 Orange "Yep.", then the TV on "regular"
cut(S(8, -0.04), 'cuO'); ex('O', S(8), 'neutral'); ex('B', S(8, REG), 'curious')
ins(W(8, 1, -0.04), (W(8, 1), 444), (E(8), 470))
# 9 x-ray: the one big light behind the TV on "light", always on
ins(S(9, -0.04), (S(9), 472), (W(9, 2), 482), (E(9), 540))
# 10 listener beat on Blue (confused), then the crystal blinds twist shut on "twist" .. "block"
cut(S(10, -0.04), 'cuB'); ex('B', S(10, -2 * F), 'confused')
ins(W(10, 2, -0.04), (W(10, 2), 572), (W(10, 7), 622), (E(10), 662))
# 11 the blinds leak on "leak", dark gray at the front
ins(S(11, -0.04), (S(11), 664), (W(11, 2), 680), (W(11, 8), 712), (E(11), 760))
# 12 two-shot: Blue's real laugh, Orange deadpan side-eye
cut(S(12, -0.04), 'two'); ex('B', S(12, -2 * F), 'laugh'); ex('O', S(12, REG), 'side-eye'); ex('B', W(12, 7), 'smug')
ge('B', 'shrug', W(12, 4), E(12), 0.7)
# 13 punchline: Orange done, push-in on "ambition", the one crack after it
cut(S(13, -0.06), 'cuO'); ex('O', S(13), 'done'); PUSH.append((W(13, 7), 0.06)); ex('O', E(13, -0.25), 'holding-laugh')
# 14 Blue suspicious, point on "lamp"
cut(S(14, -0.06), 'cuB'); ex('B', S(14), 'side-eye'); ge('B', 'point', W(14, 6), E(14), 0.6); ex('O', S(14, 0.4), 'neutral')
# 15 burn-in: the same bar stays up for ages, the clock spins on "ages"
ins(S(15, -0.04), (S(15), 862), (W(15, 5), 900), (E(15), 972))
# 16 gray test screen, the faint ghost of the bar on "ghost"
ins(S(16, -0.04), (S(16), 986), (W(16, 1), 1000), (W(16, 4), 1032), (E(16), 1080))
# 17 Blue gasps (small), curious on "haunted", smug on "Sick"
cut(S(17, -0.04), 'cuB'); ex('B', S(17), 'curious'); ex('B', W(17, 3), 'smug'); ge('B', 'point', W(17, 1), E(17), 0.6)
ex('O', S(17, REG), 'side-eye')
# 18 Orange sighs, facepalm on "Not sick", tiny smug on "know"
cut(S(18, -0.04), 'cuO'); ex('O', S(18), 'done'); ge('O', 'facepalm', W(18, 0), W(18, 2), 0.5); ex('O', W(18, 5), 'smug')
# 19 restore the hook pose: Blue curious, side-eye on "explain" (loops into "Why is this black blacker")
cut(S(19, -0.06), 'cuB'); ex('B', S(19, -0.06), 'curious'); ex('B', W(19, 2), 'side-eye'); ex('O', S(19, REG), 'neutral')
