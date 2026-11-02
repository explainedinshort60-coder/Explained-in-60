# Flush podcast v3 (ElevenLabs VO + acting guide)
Voices: ElevenLabs eleven_v4. Blue = "Hale v3" (wWWn96OtTHu1sn8SRGEr), Orange = "Lyan" (tnVKC6NjwhdRxoQIfKue). Flow RfRAnrykb7Thxjc4e8uP.
Audio tags used for acting: [genuinely curious], [deadpan], [sighs], [giggles], [trying not to laugh], [chuckles], [offended] ... [laughs].
Word timings: ElevenLabs Scribe on align_src.mp3 (all lines concatenated, offsets in align_offsets.json).
Pipeline: engine/podcast/vo3.py (edit, loudness match -20 LUFS per line, gap/overlap timeline, wrap-around loop mix, -14 LUFS master)
-> engine/podcast/pod3.py (cue sheet per Expression & Comedy Acting Rules v1.1, renders frames) using engine/podcast/anim3.js.
