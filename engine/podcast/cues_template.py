# Acting cue sheet for one podcast episode. Executed inside engine/podcast/pod.py, so these helpers exist:
#   W(i, k, off=0, end=False)  time of word k of line i     S(i, off) line start     E(i, off) line end
#   EV(i, k, end=False)        laugh/sigh event time         REG = 4 frames listener register delay
#   ex(host, t, expression)    host 'B' or 'O'; expressions: neutral curious confused side-eye smug fake-innocent
#                              holding-laugh laugh shock mock-offended done wink
#   ge(host, gesture, accent_t, hold_end_t, peak)  gestures: talk shrug panic facepalm point
#   cut(t, shot)               shots: 'two' 'cuB' 'cuO'
#   ins(t, (t, src_frame), ...) cutaway to the explainer animation of SRC, frames mapped piecewise-linear
#   PUSH.append((t, amount))   push-in, punchlines only (0.04 to 0.06)
# Rules (Expression & Comedy Acting Rules v1.1): change expression on the trigger word, listeners react REG late,
# one gesture per thought with anticipation and hold, big faces are rare, the last line restores the line-0 shot and pose.
SRC = '001-toilet'          # episodes/<SRC>/episode.py + props.js supply the cutaways
HOOK = (790, 860, 1.4)      # REQUIRED: cold-open cutaway (src frame start, src frame end, seconds): the object's most striking moment
OUTRO = 18                  # line index of "And now you know" (outro button starts at its end)
EMPH = {}                   # {line: [word indexes]} small head accents on stressed words
def SFX():                  # [(time, library_name, gain)] names from engine/sfx/lib/index.json
    return []

cut(0, 'cuB'); ex('B', 0, 'curious')
