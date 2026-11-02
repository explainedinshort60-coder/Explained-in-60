# Explained in 60: production runbook, EXPLAINER format (single host, Kokoro voice)

Used for the explainer half of the launch sprint A/B test (config.json `sprint`). The podcast format is in RUNBOOK.md. Slots: during the sprint use `config.json` sprint slots and the explainer assignment there (2 explainers per ET day), not `slots`.
Topic choice is trend-led exactly as in RUNBOOK.md step 1: RUSH, then the Trend queue, else self-scout (TRENDS.md). No evergreen backlog topics. Log every episode in topics.md with `format: explainer`.

This is the brief for the scheduled agent. Each run makes ONE new episode, end to end, and queues it in Metricool.
Read this whole file before starting. Episode 001 (`episodes/001-toilet/`) is the gold standard: copy its structure, timing and quality.

## The show
- 60-second vertical (1080x1920, 24 fps) loop explainer. Audience: United States, general (not made for kids).
- Each episode answers ONE everyday question about an object people use daily, by showing its hidden mechanism.
- Character: the cutout rig in `engine/rig.js` (blue body, ivory square head, navy line). Poses in `engine/lib.py` (`pose()`, `mirror()`).
- Format (from the approved reference):
  - Header "EXPLAINED IN 60" small and letter-spaced at the top (drawn by `engine/core.js`, never change it).
  - Subtitle: navy pill (#051545), top at y=1620, ivory bold text, one short phrase at a time (2 to 4 s each).
  - Part labels: bold navy text above the object, thin pointer line. No section titles, no slate.
  - Background #FDFCF1, floor line at world y=700.
- Structure (24 fps frames):

| Time | Frames | Job |
|---|---|---|
| 0-3 s | 0-72 | Hook: the question as a statement + an instant visual demo of the phenomenon |
| 3-12 s | 72-288 | Establish the mechanism: name the 2 to 4 parts, one callout at a time |
| 12-35 s | 288-840 | Progressive reveals: each step of the mechanism, one part lit per beat; one comedy beat (pop word + recoil) near the middle |
| 35-50 s | 840-1200 | Complete demo: the whole cycle runs; one bonus fact (adjustment or safety backup) |
| 50-57 s | 1200-1368 | Takeaway line, back in the EXACT opening composition |
| 57-60 s | 1368-1440 | "And now you know..." while the action returns to frame 0 |

- The last frame must match frame 0 (camera, pose, prop state, labels). The VO "And now you know..." flows into the hook line.

## Run steps

### 0. Setup (every run, fresh container)
This task runs daily. If topics.md has a RUSH item, skip the slot check and produce it now. Otherwise first check Metricool `getScheduledPosts` for the next 7 days against the slots in `config.json` (`slots` and `slots_from`). If every slot in the next 7 days already has a post, stop here with a one-line message. Otherwise fill the earliest free slot.

```
bash engine/setup.sh
```
Then read `topics.md`, `episodes/001-toilet/episode.py` and `episodes/001-toilet/props.js`.

### 1. Pick the topic
- Read `GROWTH.md` first (targets, latest weekly review, current rules). The latest review can override topic order.
- If `topics.md` has an item under `## RUSH`, take it first. Otherwise take the top of the Trend queue.
- There is no evergreen backlog anymore (owner rule 2026-11-03). After RUSH, take the top of the Trend queue; if empty, self-scout one trend topic (TRENDS.md).
- Topic rules (from data, see GROWTH.md): an everyday object US adults touch daily, with a hidden mechanism that can be shown in a cutaway, plus a surprise or stakes twist. Proven title shapes: "How does X work?", "What's inside X?", a contradiction ("Why doesn't X ...?"), a money or stakes twist. Avoid anything that reads as kids content, plain science demos, medical, political or brand-specific topics.
- Group topics by room or category (Kitchen, Bathroom, Bedroom, Street, Car, Office) so episodes chain into each other.
- The mechanism must loop visually (returns to its start state). If it cannot, skip it and note why.

### 2. Research and verify (ATM: amati, tiru, modifikasi)
- Find at least 2 independent sources for the mechanism (Wikipedia, manufacturer docs, engineering or museum explainers). Record links in `episodes/<id>/research.md`.
- Find real reference images or diagrams of the object and its parts. Note shape facts you will draw (proportions, which part moves, pivot points).
- Every claim in the script must be supported by those sources. If sources disagree, use the simpler claim both support.

### 3. Script (fast, dense, casual)
Use the script-writing approach: question-driven, reference-anchored. Write `episodes/<id>/script.md` in screenplay style (monospace block).
- Voice of the host: a friend who just figured this out and can't wait to tell you. Casual, second person, contractions, light US slang used naturally ("lowkey", "no cap", "the real MVP", "here's the kicker", "wild", "straight up"), max 2 or 3 slang hits per episode and never forced. No dated memes. Not formal, never textbook.
- Dense, not fast: the voice speed stays natural (Kokoro speed 1.0 to 1.1); speed comes from cutting setup and from the visuals. 110 to 160 spoken words.
- Frame 1: the question works on mute as the first subtitle (3 to 8 words) and the object is already on screen mid-action. No greeting, no "Hey guys".
- 0 to 3 s hook: contradiction or curiosity gap, show the result first.
- 3 to 8 s: a "but" turn that raises stakes ("...but one tiny part does ALL the work").
- Body: 4 to 6 reveals, a new beat every 5 to 7 s, and something visibly changes every 1 to 3 s (camera move, pose swap, prop motion, callout, pop word).
- Midpoint (25 to 35 s): one visual gag or punchline as the peak. Put jokes in the animation and timing, because AI voices land humor worse than humans.
- No spoken call to action. The ending line "And now you know..." flows into the hook line; last frame equals frame 1.
- Craft rule from weekly review 2026-11-02 (retire the negation triplet): episodes 001, 002 and 003 all lean on the same "No X. No Y. No Z." line (001 description "No sensor. No chip. No timer.", 002 VO "No magnet. No motor. No glue.", 003 takeaway "No glue. No magnets."). Three in a row is now a template tell, and it spends 2 to 3 s on what the object is NOT. From episode 004 on: do not use a negation list in the VO, captions or description. Replace it with a POSITIVE stakes line that is shown, not listed (for example a number, a fail state, or a "you've done this a thousand times" moment), and get the first moving part on screen by 6 s at the latest. Log the replacement line under the variation notes in script.md.
- Variation rule (inauthentic-content policy): every episode must differ visibly from the last 3 in at least 3 of: camera path, host blocking, prop staging, gag type, color accent of the object, hook shape. Log which ones in script.md.

### 4. Build the episode files
Create `episodes/<id>/` with:
- `props.js`: the cutaway object drawn in SVG with the show palette (navy #071747 lines 5 to 10 px, cobalt #2465ff, ivory #fffdf4, water #7da0ff at 0.6). Must set
  `window.PROPS = {labelY, draw(T,f) -> {svg, anchors}, grip(T) -> {x,y}}`. `anchors` are the world points callouts point at. `grip` is where the character's left hand grabs (the lever, handle, button).
  World layout: character root at x=720, standing on y=700. Put the object to the character's left (x 220 to 600), sized like ep 001.
- `episode.py`: copy 001's file and change the state tracks (`T(f)`), camera keys, character keys, callouts (HL), captions (CAPS), VO overrides (SAY, SPD, GROUPS) and SFX. Keep N=1440.
- `meta.json`: `{"title": "... #Shorts", "description": "...", "tags": [...], "first_comment": "...", "category": "Kitchen", "related_episode": "<id of the best thematically linked earlier episode>"}`. Title phrased the way Americans search ("How Does a ... Work?", "Why Does ...?"), under 70 characters. Description starts with one hook sentence, then "Explained in 60 #<number>", then hashtags. First comment points to the related episode by name ("Next: how your toilet knows when to stop filling") so viewers keep watching.

Test single frames while building:
```
python3 episodes/<id>/episode.py frames 0,200,500,800,1100,1300,1439 /tmp/chk
```
Look at every test frame with the Read tool. Fix before the full build.

### 5. Build
```
python3 engine/build.py episodes/<id>
```
Outputs `episodes/<id>/out/final.mp4`, `qc_sheet.png`, `qc.json`.

### 6. QC gate (all must pass, max 3 fix rounds)
- `qc.json`: `loop_ok` true, no VO line with `over: true`.
- Open `qc_sheet.png` and look at it. Check: labels never overlap the object, lid or subtitle; character never clips through props in an ugly way; object reads clearly at phone size; nothing goes off frame unintentionally; subtitle matches the action on screen.
- Facts: re-read the script against `research.md`.
- If any check still fails after 3 rounds: do NOT publish. Write the failure to `topics.md` under Log and stop.

### 7. Publish
1. Copy the video to `published/<id>.mp4`, commit and push to `main`.
   Public URL: `https://raw.githubusercontent.com/explainedinshort60-coder/explained-in-60/main/published/<id>.mp4`
2. Metricool (brand blogId `7810819`, timezone Asia/Jakarta, YouTube linked). Find the earliest free slot from `config.json` (use `slots_from` entries whose start date has passed; check `getScheduledPosts` for the next 14 days; one post per slot). Convert to Asia/Jakarta.
3. `createScheduledPost` with providers youtube, `youtubeData`: type "short", privacy "public", category "EDUCATION", madeForKids false, isAiGeneratedContent false, title and tags from meta.json; text = description; firstCommentText from meta.json.
   **Approval mode** (current setting, see `config.json`): set `"draft": true` so the owner approves in Metricool before it goes live.
4. When Metricool returns a `static.metricool.com` media URL, delete `published/<id>.mp4`, commit and push (keeps the repo small).

### 8. Log
- Tick the topic in `topics.md`, add a Log line: date, id, title, Metricool slot (ET and WIB), plannerUrl, QC result.
- Commit and push everything except `out/` and `engine/models/`.
- Add the production cost of this run to the Cost ledger in `GROWTH.md` (should be $0: free tools only; note any paid call and why).
- Final message: one short summary for the owner (title, slot, planner link, and the manual step: in YouTube Studio set the Short's Related video to `related_episode` and add it to its category playlist, since the API used cannot do this).
