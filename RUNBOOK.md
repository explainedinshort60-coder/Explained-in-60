# Explained in 60: production runbook (podcast format v1)

This is the brief for the scheduled agent. Each run makes ONE new episode, end to end, and queues it in Metricool.
Read this whole file before starting. **The benchmark is the approved flush podcast** (`episodes/flush-podcast-v3/`, final cut approved 2026-11-02). Copy its timing, acting density, layout and mix.

## The show
- 55 to 60 second vertical (1080x1920, 24 fps) **two-host podcast** loop. Audience: United States, general (not made for kids).
- Each episode answers ONE everyday question about an object people use daily, by showing its hidden mechanism.
- **Hosts** (vector characters from the production pack's latest design sheets, `engine/podcast/faces4.js` + `anim4.js`). Cute first, funny through acting.
  - **Blue** (square head, cobalt accent): asks, guesses wrong, roasts, laughs. Voice: ElevenLabs "Hale v3" `wWWn96OtTHu1sn8SRGEr`.
  - **Orange** (round head, two orange marks, blush): explains, deadpan, rarely cracks. Voice: ElevenLabs "Lyan" `tnVKC6NjwhdRxoQIfKue`.
  - Model `eleven_v4` with audio tags for acting: `[deadpan] [sighs] [laughs] [giggles] [chuckles] [gasps] [whispering] [curious] [offended] [sarcastic]`.
- **Shots**: `two` (both at the desk), `cuB`, `cuO` (close-ups), `ins` (cutaway to the explainer animation of the object, scaled into the safe area, speaker in a corner bubble).
- **Layout** (owner's Reels safe-zone guide, also safe for Shorts and TikTok): keep everything important inside x 35 to 1045, y 220 to 1500; nothing important right of x 945 below y 870 (button rail). Logo top, desk, mics.
- **Subtitles**: plain white bold text (66 px, weight 800) with a navy #071747 outline (14 px), centered above y 1440, max 22 characters per chunk, word-timed. The last caption clears before the loop restarts.
- **Sound**: intro sting A at 0 s, outro button A after "And now you know", both ducked under dialogue; library SFX on the action words; continuous room tone; master -14 LUFS, peaks under -1.5 dBTP.
- **Loop**: Blue's last line ("Cool. But real question..." or similar) leads straight back into the hook. The final shot and pose match frame 0.
- Structure (seconds, roughly):

| Time | Job |
|---|---|
| 0-3 | Blue's hook question (works on mute as the first subtitle), close-up, an instant reaction |
| 3-8 | Orange's deadpan non-answer, Blue's roast or wrong guess |
| 8-35 | The mechanism in 3 to 5 cutaways, broken up by Blue's reactions (one listener shot at least every 2 cutaways) |
| 25-40 | Comedy peak: Blue's absurd conclusion, Orange's dry punchline (push-in), the rare crack |
| 40-50 | Bonus fact or fail state (why yours breaks, how to fix it) |
| 50-60 | "And now you know", outro button, Blue's loop line |

### Acting rules (Expression & Comedy Acting Rules v1.1, short form)
- Expression changes land on the **trigger word**, not the line start. Listeners react 4 frames late (receive, register, react).
- One gesture per thought: anticipation, accent, hold, release. Gestures: talk, shrug, panic, facepalm, point.
- Big faces (shock, mock-offended, laugh) are rare and land once. Orange's crack (holding-laugh) at most once per episode: rarity makes it funny.
- Push-ins only on punchlines (0.04 to 0.06). Laugh mouths only on real laughter (detected events).
- Expressions available: neutral, curious, confused, side-eye, smug, fake-innocent, holding-laugh, laugh, shock, mock-offended, done, wink.

## Run steps

### 0. Setup (every run, fresh container)
This task runs daily. If topics.md has a RUSH item, skip the slot check and produce it now. Otherwise first check Metricool `getScheduledPosts` for the next 7 days against the slots in `config.json` (`slots` and `slots_from`). If every slot in the next 7 days already has a post, stop here with a one-line message. Otherwise fill the earliest free slot.
```
bash engine/setup.sh
```
Then read `DEMAND.md`, `demand/board.md`, `topics.md`, and the benchmark `episodes/flush-podcast-v3/README.md`.

### 1. Pick the topic (demand first)
- Read `GROWTH.md` (targets, latest weekly review) and `demand/board.md`. Pick order: RUSH, then a **BUY** inside its entry window (seasonal: live 5 to 14 days before the season peak), then the backlog top. Never pick a PASS unless the angle was re-scored.
- If the chosen keyword has no chart or it is older than 14 days, run `python3 engine/demand.py chart "<keyword>"` once (if BLOCKED, go on and note it).
- Topic rules: an everyday object US adults touch daily, a hidden mechanism we can show in a cutaway, a surprise or stakes twist. Proven title shapes: "How does X work?", "Why does X ...?", "What's inside X?", a money or fail twist. No kids content, medical, political or brand-specific topics.
- Group topics by room or category (Kitchen, Bathroom, Bedroom, Street, Car, Office). Max 2 per category per week.

### 2. Research and verify (ATM: amati, tiru, modifikasi)
- At least 2 independent sources for the mechanism; real reference images of the object and its parts (proportions, pivots, what moves). Record links in `episodes/<id>/research.md`, plus the demand line: signal, spread, season peak.
- Every claim in the script must be supported. If sources disagree, use the simpler claim both support.

### 3. Script (two hosts, casual, dense)
Write `episodes/<id>/podcast/script.py`: `LINES = [('B', "[tag] text"), ('O', "[tag] text"), ...]`, 16 to 22 lines, 120 to 170 words. Also keep a readable copy in `episodes/<id>/script.md` in screenplay format (monospace block).
- Blue opens with the question (3 to 9 words on the first subtitle). No greeting. Never start a line with "Okay".
- Orange's first answer is a deadpan non-answer; the explanation comes in short lines (each one cutaway beat).
- Blue reacts between explanation beats: a wrong guess, a roast, an absurd conclusion. Natural US slang, 2 or 3 hits max, never forced.
- Put the laugh, sigh and gasp in the audio tags where they really happen. One real laugh from Blue, at most one crack from Orange.
- A bonus line: why yours fails, or how to fix it (stakes).
- Ending: Orange "[sighs] ... And now you know." then Blue's loop line that sets up the hook again.
- No negation triplet ("No X. No Y. No Z.") in VO, captions or description (weekly review rule 2026-11-02).
- Variation rule (inauthentic-content policy): every episode differs from the last 3 in at least 3 of: hook shape, Blue's gag type, cutaway staging, camera path in the cutaway, object color accent, ending line. Log it in script.md.

### 4. Build the cutaway animation
The cutaways reuse the explainer engine: `episodes/<id>/props.js` (object in SVG, show palette: navy #071747 lines 5 to 10 px, cobalt #2465ff, ivory #fffdf4, water #7da0ff at 0.6, `window.PROPS = {labelY, draw(T,f) -> {svg, anchors}, grip(T)}`) and `episodes/<id>/episode.py` (state tracks `T(f)`, camera keys, part labels HL, pop words). Copy `episodes/001-toilet/` structure. The explainer's own character, captions and VO are not used in the podcast, so only the object animation, camera and labels need care. Plan the frame ranges as beats (one beat per Orange explanation line).
Test frames: `python3 episodes/<id>/episode.py frames 0,200,500,800,1100 /tmp/chk` and look at them.

### 5. Voice (ElevenLabs, one take per host)
1. `python3 engine/podcast/passage.py episodes/<id>/podcast` prints the Blue and Orange passages (lines joined by `[long pause]`).
2. `creative_create_flow`, then `creative_generate_speech` twice on that flow (model `eleven_v4`, voice IDs above, one passage each). Do not retry a generation call; it charges again.
3. `creative_transcribe_audio` with `connect_from` = each speech node (Scribe, word timestamps). Read results with `creative_get_flow_run_status`.
4. Download the audio and the words JSON (signed URLs, valid 2 hours) to `episodes/<id>/podcast/raw/B.mp3`, `raw/O.mp3`, `words/B.json`, `words/O.json`. If storage.googleapis.com is blocked, ask the owner to allow it.
5. Split and edit:
```
python3 engine/podcast/split.py episodes/<id>/podcast
EPDIR=episodes/<id>/podcast python3 engine/podcast/vo.py
```
`vo.py` trims, speeds 1.10 (1.16 on long explanation lines), compresses dead air, keeps laughs, matches every line to -20 LUFS, builds the gap or overlap timeline, visemes and laugh events. Target total 54 to 60 s. Tune gaps or tempo in `podcast/vocfg.json` (`{"gap": {"5": 0.1}, "tempo": {"9": 1.2}}`) if needed.

### 6. Cue sheet and render
Copy `engine/podcast/cues_template.py` to `episodes/<id>/podcast/cues.py` and write the acting: shots, expressions on trigger words, listener reactions, gestures, cutaways `ins(t, (t, frame), ...)` mapped to the episode.py beats, push-ins on punchlines, `SRC`, `OUTRO`, `EMPH`, `SFX()` (names from `engine/sfx/lib/index.json`). Line indexes and word indexes come from `timeline.json`.
```
export EPDIR=episodes/<id>/podcast
python3 engine/podcast/pod.py frames 0,200,600,1000 /tmp/chk    # look at these first
python3 engine/podcast/pod.py audio
python3 engine/podcast/pod.py part 0 2 & python3 engine/podcast/pod.py part 1 2 & wait
python3 engine/podcast/pod.py encode episodes/<id>/out/final.mp4
python3 engine/podcast/pod.py qc
```

### 7. QC gate (all must pass, max 3 fix rounds)
- `qc.json`: `seam_ok`, `audio_ok`, `dur_ok` true, no missing frames.
- Open `qc_sheet.png` and look: hosts on model (cute, correct accents, Orange's blush), subtitles inside the safe zone and never under the rail, nothing important cut off, cutaway labels readable at phone size, insert never covers a subtitle.
- Listen-check by reading `timeline.json`: no line clipped, laughs kept, no gap over 0.4 s except planned beats.
- Facts: re-read the script against `research.md`.
- If any check still fails after 3 rounds: do NOT publish. Write the failure in `topics.md` under Log and stop.

### 8. Publish
1. Copy the video to `published/<id>.mp4`, commit and push to `main` (`git pull --rebase` first).
   Public URL: `https://raw.githubusercontent.com/explainedinshort60-coder/Explained-in-60/main/published/<id>.mp4`
2. Metricool (brand blogId `7810819`, timezone Asia/Jakarta, YouTube linked). Earliest free slot from `config.json`; check `getScheduledPosts` for the next 14 days; one post per slot. Convert to Asia/Jakarta.
3. `createScheduledPost` with providers youtube, `youtubeData`: type "short", privacy "public", category "EDUCATION", madeForKids false, isAiGeneratedContent false (stylized cartoon, not realistic), title and tags from meta.json; text = description; firstCommentText from meta.json.
   **Approval mode** (`config.json`): set `"draft": true` so the owner approves in Metricool before it goes live.
4. When Metricool returns a `static.metricool.com` media URL, delete `published/<id>.mp4`, commit and push.

`meta.json`: `{"title": "... #Shorts", "description": "...", "tags": [...], "first_comment": "...", "category": "Kitchen", "related_episode": "<id>", "demand": {"keyword": "...", "signal": "BUY", "spread": 0}}`. Title phrased the way Americans search, under 70 characters, using the board keyword.

### 9. Log
- Tick the topic in `topics.md`, add a Log line: date, id, title, slot (ET and WIB), plannerUrl, QC result, demand signal.
- Update the keyword's `status` in `demand/watchlist.csv` to `live <date>`.
- Commit and push everything except `out/`, `engine/models/` and the podcast work folders (`vo_raw/`, `vo/`, `frames/`, `mix.wav`).
- Add the production cost to the Cost ledger in `GROWTH.md` (ElevenLabs credits used for 2 speech takes + 2 transcriptions; no Higgsfield, ever).
- Final message: one short summary for the owner (title, slot, planner link, demand signal, and the manual step: in YouTube Studio set the Short's Related video to `related_episode` and add it to its category playlist).
