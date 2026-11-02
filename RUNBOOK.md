# Explained in 60: production runbook

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
```
bash engine/setup.sh
```
Then read `topics.md`, `episodes/001-toilet/episode.py` and `episodes/001-toilet/props.js`.

### 1. Pick the topic
- Take the first unchecked item in `topics.md` under Backlog. If the backlog has fewer than 5 items, add new ones first:
  everyday US household or street objects with a hidden physical mechanism that can be shown in a cutaway (no medical, political, or brand-specific topics).
- The mechanism must loop visually (it returns to its start state). If it cannot loop, skip it and note why.

### 2. Research and verify (ATM: amati, tiru, modifikasi)
- Find at least 2 independent sources for the mechanism (Wikipedia, manufacturer docs, engineering or museum explainers). Record links in `episodes/<id>/research.md`.
- Find real reference images or diagrams of the object and its parts. Note shape facts you will draw (proportions, which part moves, pivot points).
- Every claim in the script must be supported by those sources. If sources disagree, use the simpler claim both support.

### 3. Script
- Write `episodes/<id>/script.md` in screenplay style (typewriter feel, monospace block), VO lines grouped by the table above.
- 140 to 170 spoken words. Short phrases. US English. No em dashes. Hook is a statement ("Why your X always does Y."), not a question.
- Split VO into caption chunks of max ~34 characters per line, max 2 lines, 2 to 4 seconds each.

### 4. Build the episode files
Create `episodes/<id>/` with:
- `props.js`: the cutaway object drawn in SVG with the show palette (navy #071747 lines 5 to 10 px, cobalt #2465ff, ivory #fffdf4, water #7da0ff at 0.6). Must set
  `window.PROPS = {labelY, draw(T,f) -> {svg, anchors}, grip(T) -> {x,y}}`. `anchors` are the world points callouts point at. `grip` is where the character's left hand grabs (the lever, handle, button).
  World layout: character root at x=720, standing on y=700. Put the object to the character's left (x 220 to 600), sized like ep 001.
- `episode.py`: copy 001's file and change the state tracks (`T(f)`), camera keys, character keys, callouts (HL), captions (CAPS), VO overrides (SAY, SPD, GROUPS) and SFX. Keep N=1440.
- `meta.json`: `{"title": "... #Shorts", "description": "...", "tags": [...], "first_comment": "..."}`. Title phrased the way Americans search ("How Does a ... Work?", "Why Does ...?"), under 70 characters.

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
2. Metricool (brand blogId `7810819`, timezone Asia/Jakarta, YouTube linked). Find the next free slot among Thursday, Friday, Saturday at 19:00 America/New_York (check `getScheduledPosts` for the next 14 days; one post per slot). Convert to Asia/Jakarta.
3. `createScheduledPost` with providers youtube, `youtubeData`: type "short", privacy "public", category "EDUCATION", madeForKids false, isAiGeneratedContent false, title and tags from meta.json; text = description; firstCommentText from meta.json.
   **Approval mode** (current setting, see `config.json`): set `"draft": true` so the owner approves in Metricool before it goes live.
4. When Metricool returns a `static.metricool.com` media URL, delete `published/<id>.mp4`, commit and push (keeps the repo small).

### 8. Log
- Tick the topic in `topics.md`, add a Log line: date, id, title, Metricool slot (ET and WIB), plannerUrl, QC result.
- Commit and push everything except `out/` and `engine/models/`.
- Final message: one short summary for the owner (title, slot, planner link, anything that needs a human).
