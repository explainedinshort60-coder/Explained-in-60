"""Print the two ElevenLabs passages (one per host) for an episode script.
Usage: python3 engine/podcast/passage.py episodes/<id>/podcast   -> B and O text, lines joined by [long pause]"""
import sys, os, json
d = os.path.abspath(sys.argv[1]); sys.path.insert(0, d); from script import LINES
out = {sp: ' [long pause] '.join(t for s, t in LINES if s == sp) for sp in 'BO'}
print(json.dumps(out, indent=1))
