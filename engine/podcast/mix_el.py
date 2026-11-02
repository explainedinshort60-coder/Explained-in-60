"""Remix ep_flush with the ElevenLabs SFX library (voices stay Kokoro)."""
import os, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE)
__file__ = os.path.join(HERE, 'pod2.py')
import pod2
from pod2 import L, LINES, DUR
LIB = '/home/claude/explained-in-60/engine/sfx/lib/'

# (line index, sound, anchor: 's' start / 'e' end, offset s, volume, pan)
CUES = [
    (4,  'dramatic_sting', 'e', 0.00, 0.30, 0.0),   # "who's doing the dirty work?!"
    (7,  'rimshot',        'e', 0.05, 0.55, 0.0),   # "pipe doing yoga"
    (9,  'toilet_flush',   's', 0.20, 0.55, 0.0),   # tank dumps a wave
    (10, 'bass_boom',      's', 0.35, 0.40, 0.0),   # "and boom. Siphon."
    (13, 'toilet_gurgle',  's', 0.90, 0.60, 0.0),   # big gurgle
    (14, 'laugh_small_crowd', 'e', 0.05, 0.25, 0.0),# toilet burping
    (16, 'tank_refill',    's', 0.20, 0.35, 0.0),   # floating ball refills
    (18, 'ooh_crowd',      'e', 0.00, 0.30, 0.0),   # group chat roast
    (19, 'record_scratch', 's', 0.00, 0.25, 0.0),   # "Rude!"
]

def mix(out):
    pod2.sfx()
    ins, flt, n = [], [], 0
    def add(p, t, pan=0.0, vol=1.0):
        nonlocal n
        ins.extend(['-i', p]); ms = max(0, int(t * 1000))
        flt.append(f'[{n}]aformat=sample_rates=48000:channel_layouts=stereo,pan=stereo|c0={1-max(0,pan):.2f}*c0|c1={1+min(0,pan):.2f}*c1,volume={vol},adelay={ms}|{ms}[a{n}]'); n += 1
    for l in L:
        add(os.path.join(HERE, f"l{l['i']:02d}.wav"), l['start'], -0.25 if l['sp'] == 'B' else 0.25)
    for i, snd, anc, off, vol, pan in CUES:
        l = L[i]; t = l['start'] + (l['dur'] if anc == 'e' else 0) + off
        if t < DUR - 0.4:
            add(LIB + snd + '.mp3', t, pan, vol)
    add('sfx/room.wav', 0, 0, 1.0)
    fc = ';'.join(flt) + ';' + ''.join(f'[a{k}]' for k in range(n)) + \
        f'amix=inputs={n}:normalize=0,highpass=f=70,acompressor=threshold=-18dB:ratio=2.5:attack=5:release=90,apad,atrim=0:{DUR},loudnorm=I=-16:TP=-1.5:LRA=7[out]'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', *ins, '-filter_complex', fc, '-map', '[out]', '-ar', '48000', '-ac', '2', out], check=True)

if __name__ == '__main__':
    mix('mix_el.wav')
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', '24', '-i', 'frames/f%04d.png', '-i', 'mix_el.wav',
                    '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p',
                    '-c:a', 'aac', '-b:a', '192k', '-shortest', sys.argv[1] if len(sys.argv) > 1 else 'ep_flush_podcast_v2_el.mp4'], check=True)
    print('done', DUR)
