# 022 powerball podcast: acting cue sheet (Expression & Comedy Acting Rules v1.1). Series: Where Your Money Goes
SRC = '022-powerball'
SERIES = 'WHERE YOUR MONEY GOES'
HOOK = (10, 64, 1.4)        # cold open: the giant $847,000,000 check in confetti (Blue's myth)
OUTRO = 16
STAMPS.append((W(0, 6), 'WRONG', '#e8273a', 1.6))
EMPH = {0: [1, 6, 8], 1: [0, 3], 2: [1, 4], 3: [4, 5, 8], 4: [1, 9, 11], 5: [3, 6], 6: [4, 5, 8], 7: [0, 5],
        8: [2, 5, 12], 9: [0, 7, 11, 14], 10: [2, 7], 11: [2, 4, 14], 12: [1, 4], 13: [3, 10], 14: [2, 9, 11], 15: [0, 4],
        16: [0, 6], 17: [0, 2, 4]}
def SFX():
    return [(0.05, 'cash_register', 0.10), (W(0, 6), 'dramatic_sting', 0.07), (W(1, 0), 'record_scratch', 0.08),
            (W(3, 5), 'whoosh_fast', 0.08), (W(4, 9), 'slide_whistle_up', 0.10), (W(6, 4), 'cash_register', 0.10),
            (W(8, 2), 'pop_bubble', 0.10), (W(9, 7), 'slide_whistle_up', 0.09), (W(10, 7), 'slide_whistle_down', 0.11),
            (W(11, 4), 'whoosh_deep', 0.10), (W(13, 10), 'text_pop', 0.08), (W(14, 7), 'ding', 0.10), (W(16, 2), 'crickets', 0.07)]

# 0 Blue's myth, confident; WRONG stamp on "forty-seven"
cut(0, 'cuB'); ex('B', 0, 'smug'); ex('O', 0, 'neutral'); ge('B', 'point', W(0, 4), E(0), 0.7)
# 1 Orange: "Nope." push-in, deadpan
cut(S(1, -0.04), 'cuO'); ex('O', S(1), 'done'); PUSH.append((W(1, 0), 0.04)); ex('B', S(1, REG), 'mock-offended')
# 2 Blue offended: points at the check (cut to the check on "giant")
cut(S(2, -0.04), 'cuB'); ex('B', S(2, -2 * F), 'mock-offended'); ge('B', 'point', W(2, 1), E(2), 0.6)
ins(W(2, 4, -0.04), (W(2, 4), 64), (E(2), 100))
# 3 the annuity: 30 bars grow on "Thirty payments"
cut(S(3, -0.04), 'cuO'); ex('O', S(3), 'neutral'); ge('O', 'talk', W(3, 1), W(3, 4), 0.5)
ins(W(3, 5, -0.04), (W(3, 5), 196), (E(3), 262))
# 4 NOW, one a year, +5% on "five percent"
ins(S(4, -0.04), (S(4), 240), (W(4, 5), 290), (W(4, 9), 306), (E(4), 340))
# 5 Blue gasps: the one shock face
cut(S(5, -0.04), 'cuB'); ex('B', S(5, -2 * F), 'shock'); ge('B', 'panic', W(5, 3), E(5), 0.6); ex('O', S(5, REG), 'side-eye')
# 6 Orange dry: the cash pot fills on "cash"
cut(S(6, -0.04), 'cuO'); ex('O', S(6), 'done')
ins(W(6, 4, -0.04), (W(6, 4), 386), (W(6, 6), 425), (E(6), 445))
# 7 Blue: where did the other half go (listener shot)
cut(S(7, -0.04), 'two'); ex('B', S(7, -2 * F), 'confused'); ge('B', 'shrug', W(7, 1), E(7), 0.7); ex('O', S(7, REG), 'neutral')
# 8 the ghost check: never in the pot
ins(S(8, -0.04), (S(8), 450), (W(8, 3), 490), (E(8), 555))
# 9 invested 29 years, grows into 847, ad number
ins(S(9, -0.04), (S(9), 562), (W(9, 11), 692), (E(9), 715))
# 10 Blue sarcastic: the check droops into VIBE on "vibe"
cut(S(10, -0.04), 'cuB'); ex('B', S(10, -2 * F), 'side-eye')
ins(W(10, 2, -0.04), (W(10, 2), 110), (W(10, 7), 150), (E(10), 168))
# 11 Orange deadpan: IRS slices 24% on "twenty-four"
cut(S(11, -0.04), 'cuO'); ex('O', S(11), 'done'); PUSH.append((W(11, 2), 0.05))
ins(W(11, 3, -0.04), (W(11, 3), 735), (W(11, 4), 760), (W(11, 9), 790), (E(11), 815))
# 12 Blue whispers the punchline (comedy peak), Orange's rare crack
cut(S(12, -0.04), 'cuB'); ex('B', S(12, -2 * F), 'fake-innocent'); ex('B', W(12, 4), 'smug')
cut(E(12, -0.35), 'cuO'); ex('O', E(12, -0.3), 'holding-laugh')
# 13 more at tax time, up to 37%
cut(S(13, -0.04), 'cuO'); ex('O', S(13), 'neutral')
ins(W(13, 3, -0.04), (W(13, 3), 815), (W(13, 10), 840), (E(13), 870))
# 14 the odds: ticket wall, gold ticket on "One"
ins(S(14, -0.04), (S(14), 884), (W(14, 7), 945), (W(14, 11), 966), (E(14), 990))
# 15 Blue laughs: basically mine
cut(S(15, -0.04), 'cuB'); ex('B', S(15, -2 * F), 'laugh'); ex('B', W(15, 3), 'smug'); ex('O', S(15, REG), 'side-eye')
# 16 Orange sighs, "And now you know", push-in
cut(S(16, -0.04), 'cuO'); ex('O', S(16), 'done'); ex('O', W(16, 3), 'smug'); PUSH.append((W(16, 3), 0.04)); ge('O', 'talk', W(16, 3), E(16), 0.5)
# 17 Blue's loop line: confident again (matches the hook myth)
cut(S(17, -0.06), 'cuB'); ex('B', S(17, -0.06), 'smug'); ge('B', 'point', W(17, 1), E(17), 0.7); ex('O', S(17, REG), 'side-eye')
