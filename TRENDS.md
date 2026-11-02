# Growth hacks: riding virality

Demand comes first: every topic is checked on the demand desk (DEMAND.md, `demand/board.md`). This file holds the trend lanes and the calendar; DEMAND.md holds the scoring of size, momentum, seasonality and supply.

Quota: at least ONE growth-hack episode every week, on top of the regular backlog. Two lanes, plus non-trend hacks.

## Lane A: reactive trend-jack (live within 24 hours)
The daily trend scout (scheduled task, 10:47 WIB) scans what the US is talking about and looks for an everyday object or mechanism hiding inside it.
- First run `python3 engine/demand.py scan` (Google Trends "Trending now" US, saved to `demand/tape/`). Then check other sources (use several, note which worked): Google Trends "Trending now" US, top US news of the last 24 h (AP, Reuters, NBC, The Verge for tech), YouTube and TikTok trend roundups (vidIQ, Later, Tokboard), Reddit r/popular, product launches, weather events.
- Angle: "the thing everyone is talking about, and the hidden mechanism inside it". Examples: a viral product launch, how its hinge or button works; a winter storm, why salt melts ice; a big game, how the yellow first-down line appears on TV; a viral gadget, what is inside it.

### Score each candidate (0 to 2 each, total 10)
| Factor | 2 | 1 | 0 |
|---|---|---|---|
| Mechanism fit | Clear physical mechanism we can cutaway | Loose link | None |
| US scale | National, millions searching | Regional or niche | Tiny |
| Freshness | Rising in last 48 h or peaks in the next 72 h | Peaked 2 to 4 days ago | Older |
| Shelf life | Keeps search traffic after the spike | Some | Dead in a day |
| Safety | Fully safe | Needs care | Fail (see blocklist) |

**Act on 7 or more.** Safety 0 is an automatic reject whatever the total.

### Blocklist (never trend-jack)
Deaths, disasters with victims, crimes, wars, elections and politics, health scares and medical claims, minors, religion, anything mocking a real person, trademarked characters or logos, unverified viral claims. Product names may appear in the title only as plain description ("the new phone's hinge"), never logos.

### Speed protocol
1. Scout writes the topic at the top of `topics.md` under `## RUSH` with: angle, score breakdown, sources, deadline (when the spike will be over), suggested title.
2. Production (14:17 WIB daily) always takes RUSH first and may use one extra slot per day beyond the cadence: the next 19:00 ET, or 12:00 ET if 19:00 is taken. It still runs the full QC gate; quality is never skipped for speed.
3. RUSH builds reuse an existing prop or a simpler prop when possible and keep the 60-second structure. Target: live within 24 h of the scout run.
4. The owner gets a push notification and should approve the draft fast; a trend draft not approved before its deadline is moved back to the normal backlog with a reworded evergreen title.

## Lane B: planned moments (calendar)
Publish before the moment so the Short is already ranking when search interest spikes. The exact entry window comes from the keyword's season peak on `demand/board.md` (live 5 to 14 days before it); the dates below are the fallback when a chart is missing. Every calendar topic is in `demand/watchlist.csv`. Production picks these as RUSH when the publish window opens.

| Publish window | Moment | Episode idea (mechanism) |
|---|---|---|
| Nov 9 to 14 | First cold snaps | Why your phone battery dies faster in the cold |
| Nov 19 to 24 | Thanksgiving (Thu Nov 26) | How the pop-up turkey timer knows the turkey is done |
| Nov 24 to 27 | Thanksgiving / Black Friday (Nov 27) | How a can opener works (cranberry can) or how a barcode scanner reads a price |
| Nov 28 to Dec 1 | Cyber Monday (Nov 30) | How a package tracking label gets scanned everywhere |
| Dec 3 to 10 | Holiday decorating | Why one dead bulb kills an old string of Christmas lights |
| Dec 10 to 18 | Snow season | Why road salt melts ice |
| Dec 26 to 31 | New Year's Eve | Why champagne pops (pressure and the cork) |
| Jan 2 to 8 | New Year resolutions | How your phone counts your steps |
| Jan 10 to 25 | Deep winter | How a thermostat knows when to turn the heat on |
| Feb 8 to 13 | Super Bowl LXI (Sun Feb 14, 2027) | How the yellow first-down line shows up on TV |
| Feb 8 to 13 | Valentine's Day (Feb 14) | How a mood ring changes color |

## Non-trend growth hacks (owner can run these in minutes)
- **Follow the winner:** any Short at 5x the trailing median gets a Part 2 within 7 days, set as its Related video.
- **Reply with a Short:** answer a good viewer comment with a Short (YouTube Studio feature); production can make it as a RUSH topic.
- **Cross-post for free:** Metricool can post the same video to TikTok and Instagram Reels at $0. Needs the owner to connect those accounts in Metricool once; then set `crosspost` in config.json.
- **Search titles in season:** reuse evergreen episodes in the calendar window with a pinned comment and a playlist bump.

## Log (newest first)
| Date | Lane | Topic | Score | Live after | 7-day views | vs median |
|---|---|---|---|---|---|---|
