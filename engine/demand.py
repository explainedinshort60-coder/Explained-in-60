"""Explained in 60 demand desk: Google Trends as a market feed (see DEMAND.md).

  python3 engine/demand.py scan                 snapshot Google Trends "Trending now" US (RSS) into demand/tape/
  python3 engine/demand.py chart KW [KW ...]    pull interest over time (US web, US YouTube, 5-year) into demand/charts/
  python3 engine/demand.py score                score demand/watchlist.csv -> demand/board.md (BUY / WATCH / PASS)
  python3 engine/demand.py import FILE.csv KW   import a Trends CSV downloaded by hand (trends.google.com, "Download")

Google sometimes answers cloud servers with a bot check on the chart endpoints, so `chart` may report BLOCKED.
Then wait and retry later in the run, or the owner pulls it from a home connection / imports the website CSV.
Never try to get around the bot check. The RSS scan works everywhere.
"""
import os, sys, re, csv, json, math, time, datetime as dt, urllib.request

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
D = os.path.join(ROOT, 'demand'); TAPE = os.path.join(D, 'tape'); CH = os.path.join(D, 'charts')
ANCHOR = 'microwave'  # fixed reference keyword sent with every chart request, so levels compare across requests
RSS = 'https://trends.google.com/trending/rss?geo=US'
for p in (D, TAPE, CH): os.makedirs(p, exist_ok=True)
def slug(s): return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')

# ---------------------------------------------------------------- tape (live trending searches)
def scan():
    x = urllib.request.urlopen(RSS, timeout=30).read().decode('utf-8', 'replace')
    rows = []
    for it in re.findall(r'<item>(.*?)</item>', x, re.S):
        g = lambda tag: (re.search(rf'<{tag}>(.*?)</{tag}>', it, re.S) or [None, ''])[1].strip()
        news = re.findall(r'<ht:news_item_title>(.*?)</ht:news_item_title>', it, re.S)
        rows.append({'term': g('title'), 'traffic': g('ht:approx_traffic'), 'pub': g('pubDate'), 'news': [re.sub(r'<.*?>|&\w+;', '', n)[:140] for n in news[:2]]})
    now = dt.datetime.now(dt.timezone.utc).strftime('%Y-%m-%dT%H%MZ')
    json.dump(rows, open(os.path.join(TAPE, now + '.json'), 'w'), indent=1)
    for r in rows: print(f"{r['traffic']:>7}  {r['term']}  | {r['news'][0] if r['news'] else ''}")
    return rows

# ---------------------------------------------------------------- charts (interest over time)
def chart(kws):
    try:
        from pytrends.request import TrendReq
    except ImportError:
        os.system('pip install -q --break-system-packages pytrends >/dev/null 2>&1'); from pytrends.request import TrendReq
    out = {}
    for kw in kws:
        try:
            tr = TrendReq(hl='en-US', tz=300, timeout=(10, 30))
            res = {}
            for name, tf, gp in (('web12m', 'today 12-m', ''), ('yt12m', 'today 12-m', 'youtube'), ('web5y', 'today 5-y', '')):
                tr.build_payload([kw, ANCHOR], timeframe=tf, geo='US', gprop=gp)
                df = tr.interest_over_time(); time.sleep(6)  # polite pacing, avoids the rate limit
                res[name] = [[str(i.date()), int(r[kw]), int(r[ANCHOR])] for i, r in df.iterrows()] if len(df) else []
            json.dump({'kw': kw, 'anchor': ANCHOR, 'pulled': str(dt.date.today()), **res}, open(os.path.join(CH, slug(kw) + '.json'), 'w'))
            out[kw] = 'ok'
        except Exception as e:
            msg = str(e); out[kw] = 'BLOCKED (Google bot check from this network)' if ('sorry' in msg or '429' in msg or '403' in msg or 'Proxy' in msg) else 'error: ' + msg[:120]
            if out[kw].startswith('BLOCKED'): break
    for k, v in out.items(): print(k, '->', v)
    return out

def import_csv(path, kw):
    """Trends 'Download CSV' from the website: rows of week,value (one keyword)."""
    rows = []
    for r in csv.reader(open(path, encoding='utf-8-sig')):
        if len(r) >= 2 and re.match(r'\d{4}-\d{2}-\d{2}', r[0]):
            v = r[1].replace('<1', '0'); rows.append([r[0][:10], int(v) if v.isdigit() else 0, None])
    key = 'web5y' if len(rows) > 120 else 'web12m'
    f = os.path.join(CH, slug(kw) + '.json'); data = json.load(open(f)) if os.path.exists(f) else {'kw': kw, 'anchor': None}
    data[key] = rows; data['pulled'] = str(dt.date.today()); json.dump(data, open(f, 'w')); print('imported', kw, key, len(rows), 'weeks')

# ---------------------------------------------------------------- indicators
def mean(v): v = [x for x in v if x is not None]; return sum(v) / len(v) if v else 0.0
def indicators(c, today=None):
    today = today or dt.date.today(); r = {}
    w = c.get('web12m') or []
    if w:
        v = [x[1] for x in w]
        r['level'] = round(mean(v[-4:]), 1)                       # last month, 0 to 100 of this chart
        r['vs_anchor'] = round(mean(v[-12:]) / max(1, mean([x[2] for x in w[-12:] if x[2] is not None]) or 1), 2) if w[0][2] is not None else None
        r['momentum'] = round(mean(v[-4:]) / max(1, mean(v[-12:-4])) - 1, 2)  # last 4 weeks vs the 8 before
    y = c.get('yt12m') or []
    if y: r['yt_momentum'] = round(mean([x[1] for x in y[-4:]]) / max(1, mean([x[1] for x in y[-12:-4]])) - 1, 2)
    f = c.get('web5y') or []
    if len(f) > 104:  # seasonal run-up: what this keyword did in the coming 2 to 6 weeks in past years, vs its yearly mean
        lifts, peaks = [], []
        for yrs in (1, 2, 3, 4):
            a, b = today + dt.timedelta(weeks=2) - dt.timedelta(days=365 * yrs), today + dt.timedelta(weeks=6) - dt.timedelta(days=365 * yrs)
            yr = [x[1] for x in f if today - dt.timedelta(days=365 * yrs + 182) <= dt.date.fromisoformat(x[0]) <= today - dt.timedelta(days=365 * yrs - 182)]
            win = [x for x in f if a <= dt.date.fromisoformat(x[0]) <= b]
            if yr and win:
                lifts.append(mean([x[1] for x in win]) / max(1, mean(yr)))
                pk = max(win, key=lambda x: x[1]); peaks.append((dt.date.fromisoformat(pk[0]) + dt.timedelta(days=365 * yrs)).isoformat())
        if lifts: r['season_lift'] = round(mean(lifts), 2); r['season_peak'] = sorted(peaks)[len(peaks) // 2]
    return r

def score_row(row, ind):
    """Demand 0 to 100 from the chart, supply 0 to 100 from the watchlist (owner or agent estimate), spread = demand - supply."""
    dem = 0.0
    dem += min(30, 30 * (ind.get('vs_anchor') or 0.5))                         # size vs a known everyday keyword
    dem += max(-15, min(25, 50 * ind.get('momentum', 0)))                       # trend
    dem += max(0, min(25, 40 * (ind.get('season_lift', 1) - 1)))               # seasonal run-up ahead
    dem += max(-10, min(10, 20 * ind.get('yt_momentum', 0)))                    # people searching YouTube for it
    dem += 10 if row.get('mechanism_fit', '') == '2' else 0
    dem = max(0, min(100, dem + 20))
    try: sup = float(row.get('supply') or 50)
    except ValueError: sup = 50
    spread = round(dem - sup, 1)
    safe = row.get('safety', '2') != '0'
    sig = 'PASS' if not safe else ('BUY' if spread >= 20 else 'WATCH' if spread >= 5 else 'PASS')
    return round(dem, 1), sup, spread, sig

def score():
    wl = os.path.join(D, 'watchlist.csv'); rows = list(csv.DictReader(open(wl)))
    out = []
    for r in rows:
        f = os.path.join(CH, slug(r['keyword']) + '.json')
        ind = indicators(json.load(open(f))) if os.path.exists(f) else {}
        dem, sup, spr, sig = score_row(r, ind) if ind else (None, r.get('supply'), None, 'NO DATA')
        out.append((r, ind, dem, sup, spr, sig))
    rank = {'BUY': 0, 'WATCH': 1, 'NO DATA': 2, 'PASS': 3}
    out.sort(key=lambda x: (rank[x[5]], -(x[4] or -999)))
    L = [f'# Demand board ({dt.date.today()})', '', 'Generated by `engine/demand.py score`. Signals per DEMAND.md. Charts older than 14 days are stale.', '',
         '| Signal | Keyword | Topic | Lane | Demand | Supply | Spread | Momentum | Season lift | Season peak | Chart date |', '|---|---|---|---|---|---|---|---|---|---|---|']
    for r, ind, dem, sup, spr, sig in out:
        f = os.path.join(CH, slug(r['keyword']) + '.json'); pulled = json.load(open(f)).get('pulled', '') if os.path.exists(f) else ''
        L.append(f"| {sig} | {r['keyword']} | {r['topic']} | {r['lane']} | {dem if dem is not None else ''} | {sup} | {spr if spr is not None else ''} | {ind.get('momentum', '')} | {ind.get('season_lift', '')} | {ind.get('season_peak', '')} | {pulled} |")
    open(os.path.join(D, 'board.md'), 'w').write('\n'.join(L) + '\n'); print('\n'.join(L))

if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'score'
    if cmd == 'scan': scan()
    elif cmd == 'chart':
        if sys.argv[2:]: chart(sys.argv[2:])
        else:  # refresh the stalest charts first, a few per run (Google rate-limits bursts)
            def age(kw):
                f = os.path.join(CH, slug(kw) + '.json')
                return (dt.date.today() - dt.date.fromisoformat(json.load(open(f))['pulled'])).days if os.path.exists(f) else 999
            kws = sorted({r['keyword'] for r in csv.DictReader(open(os.path.join(D, 'watchlist.csv')))}, key=age, reverse=True)
            chart([k for k in kws if age(k) >= 14][:4])
    elif cmd == 'import': import_csv(sys.argv[2], sys.argv[3])
    else: score()
