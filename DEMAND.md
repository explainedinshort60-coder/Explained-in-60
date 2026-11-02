# Demand desk: Google Trends as a market

Every topic decision starts here. We treat attention like a market: Google Trends is the price feed (demand), YouTube is the order book (supply), and an episode is a position. We look for the **spread**, a topic where people are searching more than the Shorts that answer it can satisfy, and we enter **before** the crowd.

Tool: `engine/demand.py`. Data: `demand/` (tape, charts, watchlist, board).

## 1. The feeds
| Feed | What it tells us | How we get it | Refresh |
|---|---|---|---|
| **Tape**: Google Trends "Trending now", US | What is spiking in the last 24 hours (Lane A trend trades) | `demand.py scan` (official RSS feed, works from any network) | Every daily scout run; each snapshot is saved in `demand/tape/`, so we build our own history |
| **Chart**: interest over time, US web, 12 months | Size and momentum of an evergreen or seasonal keyword | `demand.py chart` (pytrends) | Every 14 days per keyword, 4 keywords per run |
| **Chart**: interest over time, US YouTube search, 12 months | Whether people look for it **on YouTube**, which is the market we sell into | same | same |
| **Chart**: 5 years, US web | Seasonality: when the keyword peaks every year | same | same |
| **Anchor** | Every chart is pulled together with the fixed keyword `microwave`, so levels compare across topics | built in | |
| **Order book** (supply) | How many good Shorts already answer it | YouTube search for the question; count Shorts in the top 20 that explain the mechanism, are under 12 months old and have over 100K views. Score 0 (nobody) to 100 (saturated) in `watchlist.csv`. A YouTube Data API key can automate this later (free quota). | When the topic enters the watchlist, and again before production |

Google sometimes shows this cloud server a bot check on the chart endpoint. Then the script reports BLOCKED and we simply retry on a later run. We never try to get around it. Backup: the owner downloads the CSV from trends.google.com and runs `demand.py import file.csv "keyword"`.

## 2. Indicators (computed by `demand.py score`)
| Indicator | Trading idea | Formula |
|---|---|---|
| Size (vs anchor) | Market cap | keyword's 12-week mean divided by the anchor's |
| Momentum | Price trend | last 4 weeks vs the 8 weeks before, minus 1 |
| YouTube momentum | Volume on our exchange | same, on YouTube search |
| Season lift | Known seasonal run-up | average of what the keyword did 2 to 6 weeks ahead in each of the last 4 years, vs that year's mean |
| Season peak | Expiry date | median past peak date, moved to this year |
| **Demand score** (0 to 100) | Fair value | 20 base + size (to 30) + momentum (-15 to 25) + season lift (to 25) + YouTube momentum (-10 to 10) + mechanism fit bonus 10 |
| **Supply score** (0 to 100) | Liquidity on the other side | order-book count above |
| **Spread** | The arbitrage | demand minus supply |

## 3. Signals
- **BUY** (spread 20 or more, safety not 0): produce it. Seasonal BUYs go live 5 to 14 days before the season peak, so the Short is already ranking when searches spike.
- **WATCH** (spread 5 to 20): keep on the board, re-check the chart in 14 days.
- **PASS** (spread under 5): crowded trade. Only take it with a sharper angle (a narrower question, a fail state, a surprising fact), and re-score the new angle.
- **Lane A trend trades** come from the tape: a spiking term with a hidden everyday mechanism, scored with the TRENDS.md table (act on 7 or more). Deadline = when the spike fades.

## 4. Portfolio rules
- **Trend-led (owner rule 2026-11-03):** every new episode needs a live trend signal: a Trending-now term, rising chart or YouTube momentum, or a seasonal search that is already rising. Evergreen topics with no signal are not produced. Mix target: about 60% trend day-trades (tape), 40% seasonal swings with rising charts.
- Position size: a BUY with spread 35 or more can get a series (2 or 3 related Shorts in a row in the same room or category).
- Never more than 2 topics from the same category in one week.
- Stop-loss: a series is dropped when its first Short lands under 0.5x the trailing median at 7 days, or under 60% viewed vs swiped.
- Take-profit: any Short at 5x the trailing median gets a follow-up within 7 days (GROWTH.md rule).

## 5. P&L (in the weekly review)
- Return of an episode = 7-day views divided by the channel's trailing median (1.0 = market return).
- Track the return per lane (evergreen, seasonal, trend) and per signal (BUY, WATCH taken anyway, trend).
- Calibration check every 4 weeks: did BUYs beat WATCHes? If not, adjust the demand score weights here and log the change below.

## 6. Run order (scheduled tasks)
1. **Trend scout (daily):** `demand.py scan`, read the tape, score candidates for Lane A, write RUSH items. Then `demand.py chart` (4 stalest keywords) and `demand.py score`. Commit `demand/`.
2. **Production (daily):** before picking a topic, read `demand/board.md`. Pick order: RUSH, then BUY in its entry window, then the backlog top. Note the signal and spread in the episode's research.md.
3. **Weekly review (Monday):** P&L by lane, refresh supply scores for the top 5 BUYs, add 3 to 5 new keywords to `watchlist.csv` (from the tape, from viewer comments, from autocomplete on YouTube for "how does", "why does").

## Change log
| Date | Change | Why |
|---|---|---|
| 2026-11-02 | Desk created: tape, charts, anchor, spread, portfolio rules | Owner asked for topic choice to always follow Google Trends demand, like trading |
| 2026-11-03 | Trend-led: backlog cleared, every episode needs a live trend signal, scout runs 4 times a day | Owner decision after 7 episodes |
