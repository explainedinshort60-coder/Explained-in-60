# 023 wash turkey podcast: acting cue sheet (Expression & Comedy Acting Rules v1.1). Series: You've Been Doing It Wrong
SRC = '023-wash-turkey'
SERIES = "YOU'VE BEEN DOING IT WRONG"
HOOK = (10, 60, 1.4)        # cold open: raw turkey under the tap, germy droplets flying at the camera
OUTRO = 12
STAMPS.append((W(0, 7), 'WRONG', '#e8273a', S(1) - W(0, 7) - 0.08))   # clears before Orange's close-up
EMPH = {0: [1, 7, 9], 1: [0, 2, 4], 2: [1, 4], 3: [2, 5, 8], 4: [1, 5, 7, 9], 5: [0, 2], 6: [1, 8, 14], 7: [1, 7],
        8: [1, 5], 9: [1, 4, 11, 16], 10: [1, 5], 11: [3, 6], 12: [0, 3], 13: [1, 3]}
def SFX():
    return [(0.05, 'faucet_on', 0.10), (W(0, 7), 'dramatic_sting', 0.07), (W(1, 0), 'record_scratch', 0.08),
            (W(1, 2), 'whoosh_fast', 0.08), (W(3, 8), 'boing', 0.08), (W(4, 1), 'water_drip', 0.10),
            (W(4, 5), 'pop_bubble', 0.09), (W(4, 7), 'pop_bubble', 0.09), (W(4, 9), 'pop_bubble', 0.10),
            (W(6, 8), 'text_pop', 0.09), (W(7, 1), 'text_pop', 0.09), (W(9, 4), 'record_scratch', 0.06),
            (W(9, 11), 'ding', 0.10), (W(10, 1), 'air_hiss', 0.07), (W(12, 1), 'crickets', 0.06)]

# 0 Blue's myth, confident; WRONG stamp on "germs"
cut(0, 'cuB'); ex('B', 0, 'smug'); ex('O', 0, 'neutral'); ge('B', 'point', W(0, 5), E(0), 0.7)
# 1 Orange: "Nope." push-in, deadpan; cut to the spray on "sprays"
cut(S(1, -0.04), 'cuO'); ex('O', S(1), 'done'); PUSH.append((W(1, 0), 0.04)); ex('B', S(1, REG), 'mock-offended')
ins(W(1, 2, -0.04), (W(1, 2), 60), (E(1), 110))
# 2 Blue offended: grandma (the one mock-offended beat)
cut(S(2, -0.04), 'cuB'); ex('B', S(2, -2 * F), 'mock-offended'); ge('B', 'point', W(2, 1), E(2), 0.6)
# 3 water can't wash off the bacteria, it bounces them off the bird
cut(S(3, -0.04), 'cuO'); ex('O', S(3), 'neutral'); ge('O', 'talk', W(3, 1), W(3, 5), 0.5)
ins(W(3, 6, -0.04), (W(3, 6), 100), (E(3), 148))
# 4 splash map: SINK, COUNTER, SALAD on the words
ins(S(4, -0.04), (S(4), 160), (W(4, 5), 210), (W(4, 7), 252), (W(4, 9), 300), (E(4), 330))
# 5 Blue gasps: the one shock face
cut(S(5, -0.04), 'cuB'); ex('B', S(5, -2 * F), 'shock'); ge('B', 'panic', W(5, 0), E(5), 0.6); ex('O', S(5, REG), 'side-eye')
# 6 USDA study: 60% sink
cut(S(6, -0.04), 'cuO'); ex('O', S(6), 'neutral')
ins(W(6, 1, -0.04), (W(6, 1), 414), (W(6, 8), 424), (W(6, 9), 452), (W(6, 14), 470), (E(6), 490))
# 7 26% salad
ins(S(7, -0.04), (S(7), 496), (W(7, 1), 503), (W(7, 7), 550), (E(7), 565))
# 8 Blue whispers (comedy peak); Orange's rare crack at the end
cut(S(8, -0.04), 'cuB'); ex('B', S(8, -2 * F), 'fake-innocent'); ge('B', 'shrug', W(8, 2), E(8), 0.6)
cut(E(8, -0.3), 'cuO'); ex('O', E(8, -0.28), 'holding-laugh')
# 9 only heat kills them: skip the rinse, thermometer to 165
cut(S(9, -0.04), 'cuO'); ex('O', S(9), 'done'); PUSH.append((W(9, 1), 0.05))
ins(W(9, 3, -0.04), (W(9, 3), 600), (W(9, 4), 604), (W(9, 6), 622), (W(9, 7), 640), (W(9, 11), 762), (E(9), 792))
# 10 scrub the sink
ins(S(10, -0.04), (S(10), 800), (W(10, 1), 806), (E(10), 900))
# 11 Blue laughs at himself
cut(S(11, -0.04), 'two'); ex('B', S(11, -2 * F), 'laugh'); ex('B', W(11, 4), 'fake-innocent'); ex('O', S(11, REG), 'side-eye')
ge('B', 'facepalm', W(11, 4), E(11), 0.7)
# 12 Orange sighs, "And now you know", push-in
cut(S(12, -0.04), 'cuO'); ex('O', S(12), 'done'); ex('O', W(12, 2), 'smug'); PUSH.append((W(12, 2), 0.04)); ge('O', 'talk', W(12, 2), E(12), 0.5)
# 13 Blue's loop line: whispering, sneaky, straight back to the tap
cut(S(13, -0.06), 'cuB'); ex('B', S(13, -0.06), 'fake-innocent'); ge('B', 'point', W(13, 1), E(13), 0.6); ex('O', S(13, REG), 'side-eye')
