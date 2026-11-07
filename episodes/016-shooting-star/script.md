# 016 Shooting star: script

```
EXPLAINED IN 60  /  EP 016  /  "WHY DO SHOOTING STARS GLOW?"

00.00  HOOK (0-3 s). Frame 1: a night-sky window, a shooting star mid-streak (white-hot head, orange trail), the
        host beside it pointing up, grinning. Whoosh.
        NARRATOR (0.0s): That shooting star is a grain of sand.

03.00  TURN (3-10 s). Zoom into the streak: a gray speck of rock (SPACE DUST) flying left, a big speed arrow, air
        dots (AIR) streaming past.
        NARRATOR (3.0s): But it slams into our air crazy fast,
        NARRATOR (6.5s): tens of thousands of miles an hour.

10.00  MYTH (10-13.75 s). Wide: the host makes a "think" face at the zoom window, then laughs. NOPE. pops.
        NARRATOR (10.0s): Here's the kicker: it's not friction.

13.75  SQUEEZE (13.75-21 s). Close: the air dots in front of the rock can't get out of the way and pile up into a
        tight cap (AIR PILES UP, then SQUEEZED AIR). SQUISH!
        NARRATOR (13.75s): The air in front can't get out of the way,
        NARRATOR (17.5s): so it piles up and gets squeezed. Hard.

21.00  HEAT (21-25 s). The cap turns blue to orange to white hot, the rock glows (HOT AIR, badge 3,000°F). Zap.
        NARRATOR (21.0s): Squeezed air heats up, past three thousand degrees.

25.00  GAG (25-29 s). Wide: the host clasps his hands and makes a wish on the shooting star (sparkles). Record
        scratch: a magnifier opens on the streak and shows a tiny gray pebble. "...SAND?" Sad trombone, facepalm.
        NARRATOR (25.0s): So you've been wishing on... sand.

29.00  VAPOR (29-36 s). Close: the white-hot cap, the rock shrinking (GRAIN), a glowing trail of vapor streaming
        behind it (VAPOR). Sky: a dashed line, 60 MILES UP, a streak crosses under it.
        NARRATOR (29.2s): That heat boils the grain away into vapor,
        NARRATOR (32.9s): and the streak glows, about sixty miles up.

36.25  BONUS (36-50 s). A comet (COMET) sheds a trail of chunky rocks. A slow, huge fireball rolls across the window
        (FIREBALL!, crowd ooh). Wide: a calendar card NOV 12. Sky: a streak puffs out high above the trees (BURNED UP).
        NARRATOR (36.25s): Bonus: this month's Taurids are slow and chunky,
        NARRATOR (40.0s): so some flare into big, bright fireballs.
        NARRATOR (43.3s): Best nights to look: around November twelfth.
        NARRATOR (46.7s): And most burn up way before the ground.

50.00  TAKEAWAY (50-57 s). Back to the opening composition: the sky window, streaks, the host pointing up.
        NARRATOR (50.0s): So every shooting star is squeezed air,
        NARRATOR (53.75s): glowing white hot. Lowkey wild.

57.00  LOOP OUT (57-60 s). The next streak lands in the position of frame 0.
        NARRATOR (57.0s): And now you know...
```

Words: about 120 spoken. Slang: "here's the kicker", "crazy fast", "lowkey" (3).

## Craft rule (no negation list) and replacement line
- No "No X. No Y. No Z." anywhere (VO, captions, description). One single myth flip ("it's not friction"), backed by the source, then straight to what it IS.
- Positive stakes line, shown: the wish gag (the magnifier reveals the "star" is a pebble) and the 3,000°F badge. First moving part at 0 s (the streak mid-flight).

## Variation vs 014 (explainer), 015 and 013 (podcasts) (need 3 of 6)
- Camera path: a sky window the camera dives into for full-bleed zoom shots, then pulls back out (014: vertical ball tracking and a slow-motion freeze). CHANGED
- Host blocking: stargazer pointing up, a wish with clasped hands, no prop in hand (014: live dribble with IK on the ball). CHANGED
- Prop staging: framed night-sky panel, air-dot zoom view, magnifier, comet, calendar card (014: one ball, ruler, magnifier on pebbles). CHANGED
- Gag type: expectation reveal (wishing on a star that is sand) (014: physical prop fail, flat ball pancakes). CHANGED
- Color accent: deep night navy with fire orange and white-hot (014: basketball orange with icy blue). CHANGED
- Hook shape: contradiction statement ("That shooting star is a grain of sand.") (014: "why does X even" question). CHANGED

## QC log
- Pre-build round 1 (test frames): zoom cameras let the host's head and pointing hand poke into the sky window, panel edge over the header in the tightest zoom (navy on navy header), TAURIDS and FIREBALL badges overflow the fixed badge pill (replaced by a COMET callout and a FIREBALL! pop), 60 MILES UP tag crossed by the meteor path and later cut at the frame edge, comet too small, SQUISH! over the SQUEEZED AIR label (moved under the rock), GROUND callout hidden under the subtitle pill (now BURNED UP on the puff).
- Build round 1: loop_ok true (seam 0.95), no VO over, 60.0 s, -16.3 LUFS, but QC sheet failed. Fixes: pose holds were missing before cuts, so the host's arm jumped to the next shot's pose and showed at the window edge (hold keys added); arm overlap offsets reached back across cuts for 1 to 3 frames (CutCharacter clamps them at the cut).
- Build round 2: QC pass. loop_ok true (seam 0.95), no VO over, 60.0 s, -16.3 LUFS; QC sheet clean (no host parts in the window, labels clear of objects and the pill, hook frame 0 shows the streak mid-flight with the hook caption). Facts re-read against research.md.
