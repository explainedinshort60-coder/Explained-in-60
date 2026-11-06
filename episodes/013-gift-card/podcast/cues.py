# 013 gift card draining podcast: acting cue sheet (Expression & Comedy Acting Rules v1.1)
SRC = '013-gift-card'
HOOK = (10, 92, 1.4)        # cold open: the gift card at the register, BALANCE $0.00, bills flying out of it
SERIES = 'WHERE YOUR MONEY GOES'
OUTRO = 20
EMPH = {0: [2, 7], 1: [1, 3], 2: [0, 3], 3: [1, 7], 4: [1, 7], 5: [2, 5], 6: [3, 7], 7: [1, 4], 8: [1, 8], 9: [1, 6],
        10: [3, 5], 11: [3, 10], 12: [5, 8], 13: [1, 4], 14: [6], 15: [2, 8], 16: [3, 7], 17: [2, 5], 18: [7, 9], 19: [0, 2],
        20: [0, 4], 21: [0, 2]}
def SFX():
    return [(W(4, 3), 'swish_pop', 0.14), (W(4, 7), 'pen_click', 0.18), (W(5, 5), 'mech_click', 0.16),
            (W(8, 4), 'barcode_beep', 0.18), (W(8, 8), 'cash_register', 0.16), (W(9, 6), 'whoosh_fast', 0.14),
            (W(11, 3), 'swish_pop', 0.14), (W(11, 10), 'slide_whistle_down', 0.12), (W(13, 4), 'rimshot', 0.12),
            (W(15, 4), 'ding', 0.10), (W(15, 6), 'ding', 0.10), (W(15, 8), 'ding', 0.10), (W(17, 5), 'button_press', 0.16),
            (W(18, 9), 'bass_boom', 0.12)]

# 0 hook: Blue side-eye at the card, mock-offended on "empty" (after the cold open), point at it
cut(0, 'cuB'); ex('B', 0, 'side-eye'); ex('O', 0, 'neutral'); ex('B', W(0, 7), 'mock-offended'); ge('B', 'point', W(0, 4), E(0), 0.6)
# 1 Orange deadpan non-answer, tiny push on "Before"
cut(S(1, -0.04), 'cuO'); ex('O', S(1), 'done'); PUSH.append((W(1, 3), 0.04))
# 2 two-shot: Blue sarcastic, smug on "thief", shrug; Orange stays done
cut(S(2, -0.04), 'two'); ex('B', S(2, -2 * F), 'side-eye'); ex('O', S(2, REG), 'done'); ex('B', W(2, 3), 'smug'); ge('B', 'shrug', W(2, 0), E(2), 0.7)
# 3 Orange sighs, then the store rack: the gloved hand lifts a card on "grab"
cut(S(3, -0.06), 'cuO'); ex('O', S(3), 'done'); ex('O', W(3, 0), 'neutral'); ge('O', 'talk', W(3, 0), W(3, 1), 0.5)
ins(W(3, 1, -0.04), (W(3, 1), 104), (W(3, 7), 180), (E(3), 210))
# 4 the card back: the sticker peels on "peel", the notepad copies on "copy"
ins(S(4, -0.04), (S(4), 224), (W(4, 3), 250), (W(4, 7), 288), (E(4), 362))
# 5 the sticker goes back on "cover", the card hangs back on the rack on "hang"
ins(S(5, -0.04), (S(5), 366), (W(5, 2), 380), (W(5, 4), 410), (W(5, 5), 424), (E(5), 486))
# 6 listener shot: Blue curious, fake-innocent on "trap"
cut(S(6, -0.04), 'cuB'); ex('B', S(6, -2 * F), 'curious'); ex('B', W(6, 7), 'fake-innocent'); ge('B', 'talk', W(6, 3), E(6), 0.6)
ex('O', S(6, REG), 'side-eye')
# 7 Orange deadpan: "A trap with a bow on it", smug on "bow"
cut(S(7, -0.06), 'cuO'); ex('O', S(7), 'done'); ex('O', W(7, 4), 'smug')
# 8 the register: you pay on "register", the card goes live on "live"
ins(S(8, -0.04), (S(8), 502), (W(8, 4), 520), (W(8, 8), 541), (E(8), 600))
# 9 they wait, the money runs to the laptop on "spend"
ins(S(9, -0.04), (S(9), 602), (W(9, 3), 620), (W(9, 8), 700), (E(9), 718))
# 10 Blue gasps: the one shock face, then confused on "card"
cut(S(10, -0.04), 'cuB'); ex('B', S(10, -2 * F), 'shock'); ge('B', 'panic', W(10, 0), W(10, 3), 0.6); ex('B', W(10, 5), 'confused')
ex('O', S(10, REG), 'neutral')
# 11 "Nope." on Orange, then the barcode swap on "swap", the money bends off to THEIR card on "money"
cut(S(11, -0.04), 'cuO'); ex('O', S(11), 'done')
ins(W(11, 1, -0.04), (W(11, 1), 724), (W(11, 3), 742), (W(11, 5), 790), (W(11, 8), 800), (E(11), 856))
# 12 two-shot: Blue's real laugh, Orange deadpan side-eye
cut(S(12, -0.04), 'two'); ex('B', S(12, -2 * F), 'laugh'); ex('O', S(12, REG), 'side-eye'); ex('B', W(12, 8), 'smug')
ge('B', 'shrug', W(12, 5), E(12), 0.7)
# 13 punchline: Orange done, push-in on "thanks", the one crack after it
cut(S(13, -0.06), 'cuO'); ex('O', S(13), 'done'); PUSH.append((W(13, 4), 0.06)); ex('O', E(13, -0.25), 'holding-laugh')
# 14 Blue suspicious, point on "robbed"
cut(S(14, -0.06), 'cuB'); ex('B', S(14), 'side-eye'); ge('B', 'point', W(14, 5), E(14), 0.6); ex('O', S(14, 0.4), 'neutral')
# 15 the check: three ticks on "on", "covered", "scratched"
ins(S(15, -0.04), (S(15), 864), (W(15, 2), 880), (W(15, 4), 900), (W(15, 6), 950), (W(15, 8), 990), (E(15), 998))
# 16 Orange explains, point on "another"; Blue listens late
cut(S(16, -0.04), 'cuO'); ex('O', S(16), 'neutral'); ge('O', 'point', W(16, 4), E(16), 0.5); ex('B', S(16, REG), 'curious')
# 17 receipt and the phone photo, flash on "photo"
ins(S(17, -0.04), (S(17), 1004), (W(17, 5), 1040), (E(17), 1078))
# 18 the text "PAY ME IN GIFT CARDS", SCAM stamp on "Scam"
ins(S(18, -0.04), (S(18), 1084), (W(18, 9), 1110), (E(18), 1170))
# 19 Blue whispering paranoid: side-eye, fake-innocent on "rack"
cut(S(19, -0.04), 'cuB'); ex('B', S(19), 'side-eye'); ex('B', W(19, 2), 'fake-innocent'); ex('O', S(19, REG), 'side-eye')
# 20 Orange sighs, facepalm on "Sure", tiny smug on "know"
cut(S(20, -0.04), 'cuO'); ex('O', S(20), 'done'); ge('O', 'facepalm', W(20, 0), W(20, 2), 0.5); ex('O', W(20, 4), 'smug')
# 21 restore the hook pose: Blue side-eye on "yesterday" (loops into "I just loaded this gift card")
cut(S(21, -0.06), 'cuB'); ex('B', S(21, -0.06), 'curious'); ex('B', W(21, 2), 'side-eye'); ex('O', S(21, REG), 'neutral')
