# Podcast pipeline (format v1)

Episode work folder: `episodes/<id>/podcast/` with `script.py`, `raw/{B,O}.mp3`, `words/{B,O}.json`, `cues.py`, optional `vocfg.json`.

| Step | Command | Output |
|---|---|---|
| Passages for ElevenLabs | `python3 engine/podcast/passage.py <dir>` | Blue and Orange text, lines joined by `[long pause]` |
| Split takes into lines | `python3 engine/podcast/split.py <dir>` | `vo_raw/lNN.wav`, `lines.json` |
| VO edit + timeline | `EPDIR=<dir> python3 engine/podcast/vo.py` | `vo/lNN.wav`, `timeline.json` |
| Mix | `EPDIR=<dir> python3 engine/podcast/pod.py audio` | `mix.wav` |
| Frames | `EPDIR=<dir> python3 engine/podcast/pod.py part k n` | `frames/` |
| Video | `EPDIR=<dir> python3 engine/podcast/pod.py encode OUT.mp4` | mp4 |
| QC | `EPDIR=<dir> python3 engine/podcast/pod.py qc` | `qc.json`, `qc_sheet.png` |

Files: `faces4.js` (host heads, 12 expressions, mouths), `anim4.js` (bodies, arms, gestures), `assets.py` (studio, logo, mic),
`cues_template.py` (acting cue sheet template), `legacy/` (flush v3 scripts, kept for reference).
Cutaways sample the original explainer episode (`episodes/<SRC>/episode.py` + `props.js`).
