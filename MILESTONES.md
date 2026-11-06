# Path to $6,000 a week from ads (owner goal, set 2026-11-06)

Ads only: YouTube long-form ads, YouTube Shorts ads, YouTube Premium share. Sponsors, services and TikTok are not counted here.
Tracked every week by the weekly review with `engine/scorecard.py` (metrics/weekly.csv vs metrics/targets.csv, report in metrics/scorecard.md).

## The math
| Input | Value used | Source / why |
|---|---|---|
| Long-form RPM | $8 per 1,000 views | Education & Science median RPM is $10.22 (AIR Media-Tech, 300 channels, 2026), P25 $2.31, P75 $19.50. We use $8 because our audience is not yet US-heavy. |
| Shorts RPM | $0.30 per 1,000 engaged views | YouTube's own example values 1M engaged Shorts views at about $405 a month; creator reports range $0.04 to $0.40. US-heavy audiences sit at the top. |
| Shorts revenue floor | 10M qualified Shorts views per 90 days (about 111K a day) | From Feb 1, 2027, below that floor Shorts earn $0. |
| Long-form average view | 5 minutes of a 12-minute episode (about 40%) | Typical for animated explainers; measured from the first episodes and updated here. |

**$6,000 a week = about 550,000 long-form views a week ($4,400) + about 5.5M Shorts views a week ($1,650).**
Long-form carries 70%+ of the money. Shorts are the funnel: they win subscribers and feed the long-form through the Related video link.
A channel earning this is typically in the 250K to 400K subscriber range with 60+ long-form episodes. Most channels never get there; the plan is built so every phase pays off on its own and every week shows whether we are on track.

## The deadline that decides everything: Feb 1, 2027
YouTube Partner Program (ads) entry today: 1,000 subscribers + 4,000 watch hours in 12 months, OR 10M Shorts views in 90 days.
From Feb 1, 2027 for new applicants: 1,000 subscribers + **8,000** watch hours, OR **20M** Shorts views in 90 days.
At 2K views a day, 10M Shorts views is out of reach; **4,000 long-form watch hours is reachable.** That is about 48,000 long-form views at 5 minutes each between Nov 14 and late January, plus 1,000 subscribers. Missing it doubles the bar, so Phase 1 is all-in on watch hours.

## Milestones
| Phase | By | Gate (all must be true) | Ad revenue a week |
|---|---|---|---|
| 1 Qualify | Jan 25, 2027 | 1,000 subs, 4,000 watch hours (365 days), YPP application sent before Feb 1 | $0 |
| 2 First dollars | Apr 30, 2027 | Monetized; long-form 50K views a week; US in top 3 countries | $400 |
| 3 Scale | Sep 30, 2027 | Long-form 200K a week; Shorts above the 10M per 90 days floor | $2,000 |
| 4 Q4 push | Dec 2027 | Long-form 300K a week; Shorts 3.5M a week; Q4 ad rates | $3,500 |
| 5 Target | mid 2028 | Long-form 550K a week; Shorts 5.5M a week | **$6,000** |
Weekly checkpoints for every metric are in metrics/targets.csv. A breakout (one episode at 1M+) moves every date earlier; the review then re-forecasts.

## Levers by phase
1. **Qualify (now to Jan):** two long-form episodes a week as soon as the 16:9 renderer is stable (one built from the week's Shorts, one new). Every Short's Related video points to the newest long-form. Long-form titles and thumbnails built for US search and the Home feed. Retention first: cold open by 0:30, re-hook every 2 to 3 minutes, chapters.
2. **First dollars:** keep 2 long-forms a week; mid-roll ads on 8+ minute episodes; US-first topics (money, home, body, car) for higher RPM; series playlists for binge sessions.
3. **Scale:** turn winning series into 20 to 30 minute compilations (high watch time, near-zero new production); localize the top episodes with YouTube auto-dubbing; push Shorts volume only when per-Short metrics hold.
4. **Q4 push:** stock up holiday and gift-season long-forms by October (Q4 RPM is the highest of the year).
5. **Target:** keep the library growing; every episode earns for years.

## Weekly evaluation and correction rules
Every Monday the weekly review fills metrics/weekly.csv (Metricool plus the owner's YouTube Studio numbers), runs `python3 engine/scorecard.py`, and applies these rules:
- **Watch hours RED twice:** move one Short slot a day into long-form work; re-cut the best Shorts into a long-form compilation that week.
- **Subscribers RED twice:** add a subscribe beat to the long-form (a series promise), test series-first titles, check that Shorts end on a "full episode" tease.
- **Long-form views RED twice:** change packaging first (title and thumbnail A/B with YouTube's Test & Compare), then topic.
- **Shorts views RED twice:** apply GROWTH.md playbook diagnostics (viewed vs swiped first, then percent viewed).
- **Any metric GREEN three weeks running:** pull the next checkpoints forward and say so in the review.
- **Jan 11 check:** if the 4,000-hour projection lands after Jan 25, every slot goes to long-form until it is fixed.
- If Feb 1, 2027 is missed, Phase 1 becomes 8,000 hours (or 20M Shorts views) and every later date moves by about 4 months.

## Guardrails (non-negotiable)
No bought views, subscribers or watch hours; no engagement pods or sub-for-sub; no misleading titles or reused content; no mass-produced templates (YouTube's inauthentic content policy would remove monetization); no paid tools without the owner's OK; approval mode stays on. Breaking these risks the channel and the money, which defeats the goal.
