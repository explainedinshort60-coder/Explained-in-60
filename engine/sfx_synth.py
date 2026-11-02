"""Procedural SFX for Explained in 60 ($0, no external service). Writes WAVs into engine/sfx/.
Usage: python3 engine/sfx_synth.py"""
import os, numpy as np, soundfile as sf
SR=48000; OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'sfx'); rng=np.random.default_rng(7)
def tick(n=0.004,f=3200):
    t=np.arange(int(SR*n))/SR; return (rng.normal(0,1,len(t))*0.6+np.sin(2*np.pi*f*t))*np.exp(-t*900)
def bp(x,lo,hi):
    X=np.fft.rfft(x); fr=np.fft.rfftfreq(len(x),1/SR); X[(fr<lo)|(fr>hi)]=0; return np.fft.irfft(X,len(x))
def zipper(dur,rate0,rate1):
    out=np.zeros(int(SR*dur)+SR//10); t=0.0
    while t<dur:
        r=rate0+(rate1-rate0)*t/dur; k=tick(f=2600+rng.uniform(-500,500)); i=int(t*SR); out[i:i+len(k)]+=k*rng.uniform(.5,1); t+=1/r
    n=bp(rng.normal(0,1,len(out)),1500,7000)*0.12; env=np.clip(np.minimum(np.arange(len(out))/(SR*.03),(len(out)-np.arange(len(out)))/(SR*.08)),0,1)
    y=(out+n)*env; return y/np.max(np.abs(y))*0.7
def tug():
    t=np.arange(int(SR*.28))/SR; thump=np.sin(2*np.pi*(90-40*t)*t)*np.exp(-t*18)
    cloth=bp(rng.normal(0,1,len(t)),300,2500)*np.exp(-t*14)*0.5; y=thump+cloth; return y/np.max(np.abs(y))*0.6
def snap():
    t=np.arange(int(SR*.35))/SR; wh=bp(rng.normal(0,1,len(t)),800,6000)*np.exp(-((t-.08)/.05)**2)
    pop=np.sin(2*np.pi*(220-150*t)*t)*np.exp(-np.maximum(0,t-.12)*25)*(t>.12); y=wh*.6+pop; return y/np.max(np.abs(y))*0.65
if __name__=='__main__':
    for name,y in {'zip_fast':zipper(1.0,50,70),'zip_med':zipper(2.5,25,35),'zip_slow':zipper(6.0,6,9),'tug':tug(),'snap':snap()}.items():
        sf.write(os.path.join(OUT,name+'.wav'),y.astype(np.float32),SR); print(name,round(len(y)/SR,2))
