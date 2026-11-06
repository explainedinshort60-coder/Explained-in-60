"""Print the two ElevenLabs passages (one per host) for an episode script.
Usage: python3 engine/podcast/passage.py episodes/<id>/podcast   -> B and O text, lines joined by [long pause]"""
import sys, os, json
d = os.path.abspath(sys.argv[1]); sys.path.insert(0, d); import script as SC
parts = SC.PARTS if hasattr(SC, 'PARTS') else [SC.LINES]
out = {}
for n, part in enumerate(parts):
    pre = f'p{n}' if hasattr(SC, 'PARTS') else ''
    for sp in 'BO':
        txt = ' [long pause] '.join(t for s, t in part if s == sp)
        if txt: out[pre + sp] = txt
print(json.dumps(out, indent=1))
