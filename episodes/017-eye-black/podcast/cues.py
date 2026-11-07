# 017 eye black podcast: acting cue sheet (Expression & Comedy Acting Rules v1.1)
SRC = '017-eye-black'
HOOK = (10, 92, 1.4)        # cold open: game-day sun, the ball dropping out of the glare, a player with eye black squinting, "?"
OUTRO = 19
EMPH = {0: [2, 3], 1: [6], 2: [1, 2, 7], 3: [3, 6], 4: [1, 6, 8], 5: [1, 4], 6: [1, 2, 8], 7: [2, 5], 8: [0, 3],
        9: [1, 2, 4], 10: [2, 5, 7], 11: [0, 5], 12: [3, 5], 13: [2, 5, 7], 14: [1, 4], 15: [3, 8], 16: [0, 4, 6],
        17: [0], 18: [5, 6, 11], 19: [1, 3, 7], 20: [2, 5]}
def SFX():
    return [(0.05, 'crowd_stadium', 0.06), (W(3, 3), 'whoosh_fast', 0.10), (W(4, 1), 'boing', 0.11), (W(4, 8), 'zoom_in', 0.10),
            (W(6, 2), 'pop_bubble', 0.10), (W(6, 5), 'ding', 0.12), (W(9, 2), 'text_pop', 0.10), (W(10, 5), 'ding', 0.12),
            (E(12, -0.05), 'rimshot', 0.12), (W(13, 7), 'record_scratch', 0.10), (W(15, 1), 'text_pop', 0.08),
            (W(15, 9), 'sad_trombone', 0.08), (W(16, 1), 'pop_bubble', 0.10), (W(17, 0), 'honk', 0.10), (W(18, 6), 'whoosh_deep', 0.08)]

# 0 hook: Blue curious, skeptical squint on "actually" (after the cold open), shrug
cut(0, 'cuB'); ex('B', 0, 'curious'); ex('O', 0, 'neutral'); ex('B', W(0, 3), 'confused'); ge('B', 'shrug', W(0, 3), E(0), 0.6)
# 1 Orange deadpan non-answer, tiny push on "raccoon"
cut(S(1, -0.04), 'cuO'); ex('O', S(1), 'done'); PUSH.append((W(1, 6), 0.04))
# 2 two-shot: Blue mock-offended on "war", points at his face on "scary"; Orange stays done
cut(S(2, -0.04), 'two'); ex('B', S(2, -2 * F), 'mock-offended'); ex('O', S(2, REG), 'done'); ge('B', 'point', W(2, 1), E(2), 0.6)
ex('B', W(2, 7), 'smug')
# 3 Orange sighs, then the profile: the sun ray travels down to the cheekbone
cut(S(3, -0.06), 'cuO'); ex('O', S(3), 'done'); ex('O', W(3, 0), 'neutral'); ge('O', 'talk', W(3, 0), W(3, 2), 0.5)
ins(W(3, 3, -0.04), (W(3, 3), 104), (W(3, 4), 118), (E(3), 198))
# 4 it bounces up into the eye on "bounces", the flare and squint on "eyes", GLARE on "glare"
ins(S(4, -0.04), (S(4), 202), (W(4, 1), 206), (W(4, 6), 234), (W(4, 8), 246), (E(4), 288))
# 5 listener shot: Blue squints like he is in the sun on "washes", then the washed-out ball view
cut(S(5, -0.04), 'cuB'); ex('B', S(5, -2 * F), 'curious'); ex('O', S(5, REG), 'neutral')
ins(W(5, 1, -0.04), (W(5, 1), 292), (W(5, 4), 318), (E(5), 378))
# 6 profile with grease: paints on "grease", the ray is soaked up on "soaks", check on "light"
ins(S(6, -0.04), (S(6), 382), (W(6, 1), 400), (W(6, 2), 430), (W(6, 5), 450), (E(6), 468))
# 7 Blue: smug realization on "sunglasses", points at his face
cut(S(7, -0.04), 'cuB'); ex('B', S(7, -2 * F), 'curious'); ex('B', W(7, 2), 'smug'); ge('B', 'point', W(7, 3), E(7), 0.6)
ex('O', S(7, REG), 'side-eye')
# 8 Orange deadpan, push on "Sure"
cut(S(8, -0.06), 'cuO'); ex('O', S(8), 'done'); PUSH.append((W(8, 3), 0.04))
# 9 the 2003 eye chart test appears on "Yale", rows read on "tested"
ex('O', S(9), 'neutral'); ins(W(9, 2, -0.04), (W(9, 2), 472), (W(9, 4), 495), (E(9), 552))
# 10 with grease one more row lights up on "contrast"
ins(S(10, -0.04), (S(10), 562), (W(10, 2), 576), (W(10, 5), 600), (E(10), 640))
# 11 Blue smug "Told you", point at Orange
cut(S(11, -0.04), 'two'); ex('B', S(11, -2 * F), 'smug'); ge('B', 'point', W(11, 0), W(11, 3), 0.6); ex('O', S(11, REG), 'side-eye')
ex('B', W(11, 5), 'wink')
# 12 Orange punchline, push-in on "blinded", the one crack after it
cut(S(12, -0.06), 'cuO'); ex('O', S(12), 'done'); PUSH.append((W(12, 5), 0.06)); ex('O', E(12, -0.2), 'holding-laugh')
# 13 the sticker slaps on on "stickers", the ray still bounces, X on "help"
ex('O', S(13), 'neutral'); ins(W(13, 2, -0.04), (W(13, 2), 652), (W(13, 5), 670), (W(13, 7), 708), (W(13, 8), 718), (E(13), 738))
# 14 Blue gasps: the one shock face, panic
cut(S(14, -0.04), 'cuB'); ex('B', S(14, -2 * F), 'shock'); ge('B', 'panic', W(14, 1), E(14), 0.7); ex('O', S(14, REG), 'done')
# 15 the scoreboard: rows land through the line, PETROLEUM JELLY on "jelly"
ins(S(15, -0.04), (S(15), 742), (W(15, 1), 760), (W(15, 9), 810), (E(15), 828))
# 16 two-shot: Blue's real laugh, then the grape jelly smear on "face"
cut(S(16, -0.04), 'two'); ex('B', S(16, -2 * F), 'laugh'); ex('O', S(16, REG), 'side-eye'); ge('B', 'shrug', W(16, 0), W(16, 2), 0.7)
ins(W(16, 2, -0.04), (W(16, 2), 834), (W(16, 4), 860), (E(16), 864))
# 17 Orange in the bubble: X and WRONG JELLY on "Wrong"
ins(S(17, -0.04), (S(17), 866), (W(17, 0), 870), (E(17), 900))
# 18 burnt cork rubs on a black smudge on "cork"
ex('O', S(18), 'neutral'); ins(S(18, -0.04), (S(18), 912), (W(18, 6), 950), (E(18), 998))
# 19 Orange sighs, shrug on "little", tiny smug on "know"
cut(S(19, -0.04), 'cuO'); ex('O', S(19), 'done'); ge('O', 'shrug', W(19, 3), W(19, 4), 0.5); ex('O', W(19, 7), 'smug')
# 20 restore the hook pose: Blue side-eye whisper, curious on "question" (loops into "Does eye black actually do anything?")
cut(S(20, -0.06), 'cuB'); ex('B', S(20, -0.06), 'side-eye'); ex('B', W(20, 5), 'curious'); ex('O', S(20, REG), 'neutral')
