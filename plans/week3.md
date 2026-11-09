# Week 3 plan (Nov 16 to 22 ET): series test week 2 of 4

Written by the weekly review on Mon Nov 9, 2026. Rules and series come from `plans/week2.md` (approved 2026-11-06); this file only adds next week's queue, tests and long-form.

## What this week tests
- **Series balance.** Week 2 is heavy on You've Been Doing It Wrong (5) and light on Inside Your Body (2) and Where Your Money Goes (1). Week 3 runs 3 of each series plus 2 trivia controls, so every series has at least 6 episodes by Dec 6 and the Dec 7 keep or kill rule (kill below the channel median after 6 episodes, expand at 2x) can be applied fairly.
- **Title frames (planned for week 3 in plans/week2.md).** Alternate the five title frames inside each series so each frame appears at least twice: "Is [claim] Really True?" style on Is It Really?, "Never [do X]" vs "Why [thing]" on You've Been Doing It Wrong, "How [store] Uses Your Money" vs "That [X] Is a Scam" on Where Your Money Goes. Log the frame in meta.json (`title_frame`).
- **Carried over from week 2:** noon vs 6 pm ET for slot A and the 40 s vs 15 to 20 s cut get read on Dec 7 with the rest of the series data; do not change slots mid-test.

## Queue (14 Shorts, 12 stake, 2 controls)
| Day / slot (ET) | Series | Title | US Google Trends evidence (demand/board.md, charts pulled Nov 6 to 9) | Blue's myth | Authority to verify |
|---|---|---|---|---|---|
| Mon Nov 16 A | Is It Really? | Is It Safe to Leave Pumpkin Pie Out Overnight? 🥧 | BUY 95.1, Nov interest 6x yearly avg, peak Nov 25 | "It's a pie, it's fine on the counter." | USDA FSIS (custard pie, 2-hour rule) |
| Mon Nov 16 B | You've Been Doing It Wrong | Never Thaw Your Turkey on the Counter 🦃 | season lift 3.01 | "Leave it out overnight." | USDA FSIS (fridge, 24 h per 4 to 5 lb) |
| Tue Nov 17 A | Where Your Money Goes | That Black Friday Deal Site Might Be Fake 🛒 | BUY 63.9, lift 3.97 | "Real brand in the ad means a real sale." | FTC online shopping scams |
| Tue Nov 17 B | Is It Really? | Is Your Electric Blanket Really a Fire Risk? 🔥 | BUY 80.6, lift 2.53 | "It's just a blanket." | CPSC, NFPA |
| Wed Nov 18 A | You've Been Doing It Wrong | Never Heat Your House With the Oven 🔥 | space heater BUY 91.5, lift 2.31 | "Open the oven door and crank it." | CPSC, CDC carbon monoxide |
| Wed Nov 18 B | Inside Your Body | Why Your Lips Crack in Winter (Stop Licking Them) 👄 | chapped lips small but steady (series balance pick) | "Licking keeps them moist." | peer-reviewed dermatology |
| Thu Nov 19 A | You've Been Doing It Wrong | Never Deep Fry a Frozen Turkey 🔥 | Thanksgiving season peak; chart BLOCKED Nov 9, re-chart | "Hot oil cooks it faster frozen." | NFPA, CPSC (flat diagram only) |
| Thu Nov 19 B | Where Your Money Goes | That Free Early Download of the Biggest Game of the Year Is a Trap 🎮 | launch Nov 19, tape 1000+ | "Free early download = a leak." | FTC malware advice |
| Fri Nov 20 A (16:00) | Where Your Money Goes | Is the Extended Warranty Ever Worth It? 💸 | Black Friday electronics; chart BLOCKED Nov 9, re-chart | "The store warranty protects your money." | FTC service contracts |
| Fri Nov 20 B | Is It Really? | Does the Cold Really Kill Your Car Battery? 🔋 | car battery big steady volume, peak Dec 1 | "The cold killed it overnight." | battery maker and AAA guidance |
| Sat Nov 21 A | Inside Your Body | Why Do You Pee More When It's Cold? 🥶 | demand 20 (Nov 7), arctic blast | "Cold makes your bladder shrink." | peer-reviewed physiology (cold diuresis) |
| Sat Nov 21 B | Inside Your Body | Why Your Ears Pop on the Plane Home for Thanksgiving ✈️ | AAA record travel forecast, Dec index 1.21 | "Your ears are full of air bubbles." | peer-reviewed ENT / CDC travel |
| Sun Nov 22 A | Control (trivia) | Why Is Canned Cranberry Sauce Shaped Like the Can? 🥫 | Thanksgiving control, chart before scripting | "They mold it after it's canned." | food science (pectin gel) |
| Sun Nov 22 B | Control (trivia) | Why Do Leftovers Taste Better the Next Day? 🍗 | leftovers peak Nov 26 (PASS on volume) | "The fridge adds flavor." | food science |

Every Short in week 3 sets its Related video to LF02 from Sat Nov 21 (LF01 Thanksgiving until then).

## Long-form 2 (Sat Nov 21, 20:00 ET, YouTube only): How Stores Trick You On Black Friday (And How To Win) 💸
Why this one: watch hours are the Phase 1 gate, and money topics carry the highest US search demand of the month (black friday deals lift 3.97, peak Nov 25) plus the best ad rates once monetized. It goes up 6 days before Black Friday, when searches peak. Four chapters reuse Shorts: 18 (How Stores Trick You On Black Friday, week 2), 013 gift card, week 3 deal site, extended warranty and game download.
Thumbnail: Blue hugging a giant "70% OFF" tag, Orange holding a receipt showing the real price; text "IT WASN'T A DEAL".

| Time | Beat | What happens |
|---|---|---|
| 0:00 to 0:30 | Cold open | Blue at 5 a.m. in a store line with a giant TV box: "I saved 70 percent!" Orange: "You saved 4 dollars." Promise: by the end, you'll spot every trick before you pay. Title card. |
| 0:30 to 1:00 | Setup | Blue has a $500 Black Friday budget and a list. Orange bets he'll blow it by noon. Counter of Blue's wrong theories starts at 0. |
| 1:00 to 3:30 | Ch. 1, The fake discount | "Compare at" prices, the price that was raised in October, doorbusters with five units. Fix: check the price history. Re-hook: "And that's the honest stores." |
| 3:30 to 6:00 | Ch. 2, The fake store | Copycat deal sites and social ads, too-good prices, odd URLs, gift card and wire payment demands; the gift card drain on the rack (reuse 013). Midpoint turn: Blue's "deal" never ships. |
| 6:00 to 8:30 | Ch. 3, The checkout traps | Extended warranties (what they actually cover, what your card and the maker already cover), Buy Now Pay Later late fees, "free" shipping thresholds. Re-hook: "Now the one that hits even careful people." |
| 8:30 to 10:30 | Ch. 4, The download | The free early game download that installs an account stealer (reuse week 3 Short); fake delivery texts about your order. Low point: Blue's account is locked on Cyber Monday. |
| 10:30 to 11:30 | Payoff | Blue runs the checklist: price history, real store URL, no gift card payments, skip the warranty unless it covers a known failure, pay in full, ignore the texts. Recap montage. |
| 11:30 to 12:00 | Button | Final wrong-theory count; tease next week. End screen to the Shorts playlist and LF01. |

Retention rules: cold open by 0:30, a re-hook every 2 to 3 minutes, chapters in the description, mid-roll-ready breaks at the chapter turns (for Phase 2).
Facts to verify while scripting: FTC guidance on reference pricing, online shopping scams, service contracts and malware; CFPB on BNPL fees. Every number on screen gets a source line in research.md.

## Two long-forms a week
MILESTONES.md calls for two a week "as soon as the 16:9 renderer is stable"; metrics/targets.csv plans it from the week of Nov 23. LF01 rendered (9:19) but has not aired. The Nov 16 review decides on the second weekly slot after LF01 is live and the renderer has made LF02 without fixes. Candidate for the second slot in Thanksgiving week: "We Survived a Winter Blackout With Science" (space heater, oven, generator, frozen pipes, car battery, electric blanket), built mostly from week 2 and 3 Shorts.
