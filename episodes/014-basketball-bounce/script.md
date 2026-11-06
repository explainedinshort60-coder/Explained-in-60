# 014 Basketball bounce: script

```
EXPLAINED IN 60  /  EP 014  /  "WHY DOES A BASKETBALL BOUNCE?"

00.00  HOOK (0-3 s). Frame 1: the host mid-dribble, the ball squashed flat on the floor in x-ray, air dots packed
        inside, pressure arrows pushing out, impact marks. Two dribbles (court bounce sounds).
        NARRATOR (0.0s): Why does a basketball even bounce?

03.00  TURN (3-10 s). Close on the ball at rest, x-ray: blue air dots zipping around (AIR). Push in: 8 arrows push out
        on the rubber wall (RUBBER WALL).
        NARRATOR (3.0s): The real MVP? The air you pumped in.
        NARRATOR (6.5s): It's packed in tight, pushing out everywhere.

10.00  SQUEEZE (10-17.5 s). Slow-mo drop from high, the bottom flattens on contact (FLAT SPOT), freeze at full squash,
        the dots crowd, arrows grow (SQUEEZED AIR). Record scratch on the freeze.
        NARRATOR (10.0s): When the ball hits the floor, the bottom flattens,
        NARRATOR (13.75s): and that air gets squeezed into less space.

17.50  SHOVE (17.5-25 s). Two big blue arrows punch up from the floor, the ball snaps round and launches (BOING!, spring
        twang). Wide: a height ruler, the ball bounces to the FULL mark.
        NARRATOR (17.5s): Squeezed air shoves back. Hard.
        NARRATOR (21.0s): Like a spring, the ball pops round and launches up.

25.00  GAG (25-29 s). The host holds up a saggy flat ball, lets go: it lands like a pancake. SPLAT. Sad trombone,
        facepalm.
        NARRATOR (25.0s): So what about a flat one?

29.00  LEAK (29-36 s). X-ray of the flat ball: only a few slow dots (LESS AIR), the wrinkled skin (BENDING RUBBER),
        heat squiggles and thud rings rise off it.
        NARRATOR (29.2s): Less air, less push. The rubber just bends,
        NARRATOR (32.9s): and the energy leaks out as heat and sound.

36.25  BONUS (36-50 s). Snowflakes, the ball turns icy blue (COLD badge), bounces only to the COLD mark. Close x-ray:
        the dots crawl (SLOW AIR). Warm glow (WARM badge): back to the FULL mark, dots zip.
        Magnifier on the skin: rows of pebbles, a fingertip presses in (PEBBLES).
        NARRATOR (36.25s): Bonus: a ball left out in the cold bounces lower,
        NARRATOR (40.0s): because the cold air inside pushes weaker.
        NARRATOR (43.3s): Warm it back up, and the bounce comes back.
        NARRATOR (46.7s): Those little bumps? Grip, for your fingertips.

50.00  TAKEAWAY (50-57 s). Back to the opening composition: the host dribbling, x-ray on (AIR).
        NARRATOR (50.0s): So every dribble is squeezed air shoving back.
        NARRATOR (53.75s): Straight up, that ball rides on air.

57.00  LOOP OUT (57-60 s). Dribble lands in the squash of frame 0.
        NARRATOR (57.0s): And now you know...
```

Words: about 125 spoken. Slang: "the real MVP", "straight up" (2).

## Craft rule (no negation list) and replacement line
- No "No X. No Y. No Z." anywhere (VO, captions, description).
- Positive stakes line, shown: the flat ball lands like a pancake (SPLAT.) and the cold ball stops at the COLD mark on the ruler. First moving part at 0 s (the ball mid-squash in the dribble).

## Variation vs 012 (explainer), 013 and 011 (podcasts) (need 3 of 6)
- Camera path: vertical tracking and slow-motion freeze on the impact, plus a height ruler shot (012: hard cuts between a helmet stand and a lineup world). CHANGED
- Host blocking: the host dribbles the ball live (IK hand on the ball) and drops a prop (012: coach costume, pointing, flailing). CHANGED
- Prop staging: one ball, a height ruler, a magnifier inset (012: helmet on a stand, play clock post, 6-helmet lineup). CHANGED
- Gag type: physical prop fail (the flat ball pancakes, SPLAT., sad trombone, facepalm) (012: verbal cutoff, dead mic). CHANGED
- Color accent: basketball orange with icy blue and warm amber states (012: turf green, amber and red LED). CHANGED
- Hook shape: "why does X even ..." question about something you never questioned, with the squash already on screen (012: "who" question). CHANGED

## QC log
- Pre-build round 1 (test frames): floor too high with empty space above the subtitle (camera helper keeps the floor near screen y 1450), host arm and head poking into the close-ups (non-pointing poses, cameras moved left), FLAT SPOT and SQUEEZED AIR labels overlapping, LESS AIR and BENDING overlapping (sequenced), flat ball overlapping the host's feet and the main ball in its x-ray beat (moved to the main ball spot, main ball hidden), SPLAT. over the host's leg, BOING! shot cutting the host's head, caption orphan word "in." (caption shortened, VO kept).
- Build round 1: loop_ok false (seam 6.9): the dribble ball floated above the floor while squashed (center was taken from the air path instead of the floor) and the air dots used a different clock at the seam. Fix: squashed ball always sits on the floor, dots in the takeaway run on f-1440, the squash holds one frame longer. Also: host hand poking into the flat-ball close-ups (camera moved left), caption orphan word "air." (line shortened).
- Build round 2: loop_ok true, seam 0.70, no VO over, 60.0 s. Flat-ball fall re-rendered after the floor fix (it uses the air path until it lands).
