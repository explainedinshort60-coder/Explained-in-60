# Long-form pipeline (16:9, 1920x1080)

Same steps as the podcast pipeline (engine/podcast/README.md), with the episode folder `episodes/<id>/longform/` and `engine/longform/lf.py` as the renderer.
- `script.py`: `PARTS = [[(speaker, text), ...], ...]`, one part per chapter (ElevenLabs takes stay short enough per call). `split.py` handles parts.
- `cues.py`: same acting helpers as the podcast, plus `card(t, title, sub)` (chapter card), `chapter(t, label)` (top-left label), `wrong(t)` (WRONG stamp + Blue's wrong-theories counter) and `ins(t, keys..., src='<episode id>')` (cutaways from any explainer episode).
- Shots: `two`, `cuB`, `cuO` (studio cropped wide), `ins` (cutaway board left, speaker right), `card`.
- QC: `qc.json` checks audio, 8 to 18 minutes, missing frames; look at `qc_sheet.png`.
