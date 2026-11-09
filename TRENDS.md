# Growth hacks: riding virality

**Owner rule (2026-11-03): the channel is trend-led.** Every new episode must come from a live trend signal: a Google Trends "Trending now" US term (`demand.py scan`), a keyword with rising chart momentum or YouTube momentum on `demand/board.md`, or a seasonal moment whose searches are already rising. Topics with no trend signal are not produced. The scout keeps the Trend queue in topics.md stocked for 4 Shorts per day.

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

**Act on 6 or more** (7+ goes to RUSH with a deadline; 6 goes to the Trend queue). Safety 0 is an automatic reject whatever the total.

### Blocklist (never trend-jack)
Deaths, disasters with victims, crimes, wars, elections and politics, health scares and medical claims, minors, religion, anything mocking a real person, trademarked characters or logos, unverified viral claims. Product names may appear in the title only as plain description ("the new phone's hinge"), never logos.

### Speed protocol
1. Scout writes the topic at the top of `topics.md` under `## RUSH` with: angle, score breakdown, sources, deadline (when the spike will be over), suggested title.
2. Production (14:17 WIB daily) always takes RUSH first and may use one extra slot per day beyond the cadence: the next 19:00 ET, or 12:00 ET if 19:00 is taken. It still runs the full QC gate; quality is never skipped for speed.
3. RUSH builds reuse an existing prop or a simpler prop when possible and keep the 60-second structure. Target: live within 24 h of the scout run.
4. The owner gets a push notification and should approve the draft fast; a trend draft not approved before its deadline is moved back to the normal backlog with a reworded evergreen title.

## Producer self-scout (when the Trend queue is empty)
1. `python3 engine/demand.py scan` and read the tape (last 24 to 48 h). Also check one other source from Lane A.
2. Find the everyday object or mechanism inside a trending term (weather: snow, frost, wind; sports: the gear, the scoreboard, the ball; launches: the hinge, the button, the battery; holidays: the gadget everyone is about to use). Score it with the table above; take the best one with 6 or more that is not already made.
3. Add it to the Trend queue with its evidence, mark it in progress, push, then produce it.

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
| 2026-11-09 | A (tape oil price today 500+; chart premium gas PASS spread -29, momentum -11%) | Where Your Money Goes: Is Premium Gas Really Better for Your Car? (Stake pipeline, Nov 20 to 25, re-chart first) | 6 | | | |
| 2026-11-09 | B (chart car battery PASS spread -5.9, season lift 1.11, peak Dec 1; AccuWeather multiple waves of dangerous cold this week) | Is It Really? Does the Cold Really Kill Your Car Battery? (Stake pipeline, Dec 1 to Jan 31) | 8 | | | |
| 2026-11-09 | B (chart electric blanket BUY spread 45.6, momentum +100%, season lift 2.53, peak Nov 30; AccuWeather multiple waves of dangerous cold, Daily Voice coldest air with snow this week) | Is It Really? Is Your Electric Blanket Really a Fire Risk? (Stake pipeline, Nov 16 to 25) | 9 | | | |
| 2026-11-08 | A + B (chart polar vortex BUY spread 20.9, momentum +144%, peak Nov 30; CBS polar vortex maps, AccuWeather 150M below freezing) | Is It Really? Is the Polar Vortex Really a Giant Storm? (RUSH, deadline Sat Nov 14) | 9 | | | |
| 2026-11-08 | A (tape: grand theft auto 6 1000+, pre-load Nov 10, launch Nov 19; chart gta 6 scam PASS spread -20) | Where Your Money Goes: That Free Early Download of the Biggest Game of the Year Is a Trap (Stake pipeline, Nov 16 to 19) | 7 | | | |
| 2026-11-08 | A (producer self-scout: tape lottery 2000+, $847M Powerball jackpot won in New Jersey, Nov 4 draw; queue items all Nov 9+) | Where Your Money Goes: Does the Powerball Winner Really Get $847 Million? (022 podcast, Sun Nov 8 17:00 ET) | 8 | Nov 8 | | |
| 2026-11-08 | A (tape: lottery 2000+, $847M Powerball jackpot won in NJ; chart lottery scam PASS spread -20) | Where Your Money Goes: That "You Won the Lottery" Call Is a Scam (Stake pipeline, next jackpot run or Dec 1 to 20) | 7 | | | |
| 2026-11-08 | A (producer self-scout: arctic blast, AccuWeather nearly 150 million below freezing this week; tape thin; chart hand warmers BLOCKED) | How Do Hand Warmers Get Hot? (020 explainer, Sun Nov 8 20:00 ET) | 9 | Nov 8 | | |
| 2026-11-08 | B (stake pipeline: chart pumpkin pie BUY spread 60.1, momentum +74%, season lift 3.08, peak Nov 25; Thanksgiving Nov 26) | Is It Really? Is It Safe to Leave Pumpkin Pie Out Overnight? (Stake pipeline, Nov 20 to 25) | 8 | | | |
| 2026-11-08 | A (weather: AccuWeather nearly 150 million below freezing this week; chart warm up car PASS spread -17.2, season lift 1.50, peak Dec 1) | Is It Really? Do You Really Need to Warm Up Your Car? (Trend queue, Nov 9 to Dec 1) | 9 | | | |
| 2026-11-07 | B (stake pipeline: chart thermostat BUY spread 24.7, momentum +12%, peak Dec 1; arctic blast) | Where Your Money Goes: Does Cranking the Thermostat Heat Your House Faster? (Stake pipeline, Nov 16 to Dec 1) | 8 | | | |
| 2026-11-07 | B (stake pipeline: chart ice melt WATCH spread 17.7, momentum +14%, peak Dec 1; first snows Great Lakes and Northeast) | Is It Really? Does Rock Salt Really Melt Ice When It's Super Cold? (Stake pipeline, Nov 23 to Dec 10) | 8 | | | |
| 2026-11-07 | A + B (producer self-scout: chart thermostat BUY spread 24.7, momentum +12%, peak Dec 1; first furnace weekend, arctic blast; tape thin) | How Does a Thermostat Know When to Turn On? (018 explainer, Sun Nov 8 12:00 ET) | 9 | Nov 8 | | |
| 2026-11-07 | A (producer self-scout: college football Saturday tape, clemson vs syracuse 1000+, florida state vs boston college 500+) | Is It Really? Does Eye Black Actually Work? (017 podcast, Sat Nov 7 20:00 ET) | 9 | Nov 7 | | |
| 2026-11-07 | B (stake pipeline: chart space heater BUY spread 56.5, momentum +150%, peak Dec 1; arctic blast) | You've Been Doing It Wrong: Never Heat Your House With the Oven (Stake pipeline, Nov 16 to Dec 1) | 9 | | | |
| 2026-11-07 | B (stake pipeline: chart black friday deals BUY spread 23.9, momentum +225%, peak Nov 25) | Where Your Money Goes: That Black Friday Deal Site Might Be Fake (Stake pipeline, Nov 18 to 27) | 8 | | | |
| 2026-11-07 | B (stake pipeline: CPSC male-to-male cord warning, outage season; chart BLOCKED twice) | You've Been Doing It Wrong: Never Plug a Generator Into Your Wall Outlet (Stake pipeline, first big winter storm outage) | 8 | | | |
| 2026-11-07 | A + B (stake pipeline: tape freeze warning 5000+, arctic blast; chart BLOCKED twice) | You've Been Doing It Wrong: Never Pour Hot Water on a Frozen Windshield (Stake pipeline, Nov 16 to Jan 31) | 8 | | | |
| 2026-11-07 | A + B (chart frostbite BUY spread 39.4, momentum +75%; arctic blast record cold for 100M+ next week) | Inside Your Body: Why Your Fingers and Toes Freeze First (RUSH, publish Nov 9 to 13, deadline Nov 15) | 9 | | | |
| 2026-11-06 | B (stake pipeline: arctic blast next week, Jan peak 5.46; chart BLOCKED twice) | Is It Really? Do Frozen Pipes Really Burst Because the Ice Cracks Them? (Stake pipeline, Jan 2 to 20 or first Southern hard freeze) | 9 | | | |
| 2026-11-06 | B (stake pipeline: Thanksgiving Nov 26 season peak; chart BLOCKED twice) | Is It Really? Is It Really Safe to Cook the Stuffing Inside the Turkey? (Stake pipeline, publish Nov 23 to 25) | 8 | | | |
| 2026-11-06 | B (stake pipeline: arctic blast + holiday party season) | Inside Your Body: Does a Drink Really Warm You Up? (Stake pipeline, publish Dec 1 to 31) | 7 | | | |
| 2026-11-06 | A (weather: arctic blast, multiple waves of dangerous cold next week; first freeze weekend) | Is It Really? Do You Really Lose Most of Your Heat Through Your Head? (RUSH, publish Nov 9+, deadline Nov 15) | 10 | | | |
| 2026-11-06 | A (news: state AGs holiday gift-card scam warning blitz; tape when is black friday 2026 200+) | Where Your Money Goes: How Scammers Drain a Gift Card Before You Buy It (Trend queue, deadline Dec 24) | 8 | | | |
| 2026-11-06 | A (chart: carbon monoxide detector momentum +9%, season lift 1.09; freeze weekend) | Inside Your Body: Why You Can't Smell Carbon Monoxide (Trend queue, publish Nov 9+, deadline Nov 22) | 8 | | | |
| 2026-11-06 | A (weather: first freeze weekend + arctic blast) | Inside Your Body: Why Your Nose Runs When It's Cold (Trend queue, publish Nov 9+, deadline Nov 22) | 9 | | | |
| 2026-11-06 | B (stake pipeline started: 12 candidates across 4 series; chart how to thaw a turkey season lift 3.19) | Stake pipeline in topics.md for weeks 3 and 4 | | | | |
| 2026-11-06 | A (weather: first widespread freeze Nov 7 to 8, NWS freeze warnings; chart WATCH spread 12.3, momentum +12%) | Why your tire pressure light comes on when it gets cold (RUSH, publish Nov 9+, deadline Nov 14) | 10 | | | |
| 2026-11-06 | A (weather: first widespread freeze Nov 7 to 8, arctic blast next week) | Why you can see your breath when it's cold (RUSH, publish Nov 9+, deadline Nov 15) | 10 | | | |
| 2026-11-06 | A + B (tape: when is black friday 2026 200+; Black Friday Nov 27) | How a barcode scanner reads the price (RUSH, publish Nov 20 to 26, deadline Nov 30) | 9 | | | |
| 2026-11-06 | A (launch: first touchscreen MacBook Pros, Fri Nov 6) + cold | Why your touchscreen ignores you when you wear gloves (RUSH, deadline Nov 13) | 9 | | | |
| 2026-11-06 | A + B (sky: Northern Taurids fireball peak Nov 11 to 12, chart BUY spread 20.6) | Why a shooting star glows (RUSH, publish Nov 9 to 11, deadline Nov 13) | 9 | | | |
| 2026-11-03 | A (launch: biggest game launch Thu Nov 19, countdown coverage rising) | How a game controller vibrates (RUSH, publish Nov 12 to 19, deadline Nov 22) | 9 | | | |
| 2026-11-03 | A (launch: Apple OLED iPad mini, Fri Nov 6) | How an OLED screen shows perfect black (RUSH, deadline Nov 8) | 10 | | | |
| 2026-11-03 | A (tape: tua tagovailoa 1000+, NFL prime time) | How the quarterback hears the play call in his helmet (RUSH, deadline Nov 9) | 9 | | | |
| 2026-11-03 | A (tape: memphis grizzlies 5000+, NBA night) | Why a basketball bounces (Trend queue, deadline Nov 8) | 6 | | | |
| 2026-11-02 | A (weather) + B | Why your phone battery dies in the cold (RUSH, deadline Nov 14) | 9 | 008 explainer, draft Wed Nov 4 12:00 ET | | |
| 2026-11-02 | A (weather) | Why frost forms on your windshield overnight (RUSH, deadline Nov 9) | 8 | | | |
| 2026-11-02 | A (tape: sam altman ram 1000+) | What RAM actually does (RUSH, deadline Nov 5) | 7 | 010 explainer, draft Wed Nov 4 20:00 ET | | |
