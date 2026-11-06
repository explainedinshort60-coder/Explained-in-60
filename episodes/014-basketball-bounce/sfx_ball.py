"""Procedural ball sounds for 014 ($0): a ringing court bounce and a dull flat-ball thud. Writes into engine/sfx/."""
import os, numpy as np, soundfile as sf
SR=48000; OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..','engine','sfx'); rng=np.random.default_rng(14)
def bounce():
    t=np.arange(int(SR*.35))/SR
    body=np.sin(2*np.pi*(150-60*t)*t)*np.exp(-t*22)+0.45*np.sin(2*np.pi*410*t)*np.exp(-t*30)+0.2*np.sin(2*np.pi*780*t)*np.exp(-t*45)
    slap=rng.normal(0,1,len(t))*np.exp(-t*260)*0.5; y=body+slap; return y/np.max(np.abs(y))*0.7
def thud():
    t=np.arange(int(SR*.4))/SR
    y=np.sin(2*np.pi*(80-30*t)*t)*np.exp(-t*30)+rng.normal(0,1,len(t))*np.exp(-t*90)*0.25
    k=np.ones(40)/40; y=np.convolve(y,k,'same'); return y/np.max(np.abs(y))*0.75
for n,y in {'ball_bounce':bounce(),'ball_flat_thud':thud()}.items(): sf.write(os.path.join(OUT,n+'.wav'),y.astype(np.float32),SR); print(n)
