"""Build an episode end to end: frames -> voice-over -> mix -> MP4 -> QC sheets.
Usage: python3 engine/build.py episodes/<id> [--skip-render]
Outputs in episodes/<id>/out/: final.mp4, vo.wav, qc_sheet.png, qc.json"""
import os, sys, json, subprocess, importlib.util, math
import numpy as np, soundfile as sf
from PIL import Image, ImageDraw
HERE=os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0,HERE)
def sh(*a): subprocess.run(a,check=True)
def load(epdir):
    spec=importlib.util.spec_from_file_location('episode',os.path.join(epdir,'episode.py')); m=importlib.util.module_from_spec(spec); spec.loader.exec_module(m); return m
def trim(a,sr,th=0.01):
    idx=np.where(np.abs(a)>th)[0]; return a[max(0,idx[0]-int(.02*sr)):idx[-1]+int(.06*sr)]
def voice(ep,out):
    from kokoro_onnx import Kokoro
    k=Kokoro(os.path.join(HERE,'models','kokoro-v1.0.onnx'),os.path.join(HERE,'models','voices-v1.0.bin'))
    voice_id=getattr(ep,'VOICE','af_heart'); CAPS=ep.CAPS; SAY=getattr(ep,'SAY',{}); SPD=getattr(ep,'SPD',{}); G=getattr(ep,'GROUPS',{}); D=getattr(ep,'VO_DELAY',{})
    skip={j for j,_ in G.values()}; clips=[]; report=[]
    for i,(a,b,txt) in enumerate(CAPS):
        if i in skip: continue
        if i in G: j,txt=G[i]; end=CAPS[j][1]
        else: txt=SAY.get(i,txt); end=b
        slot=(end-a)/24; sp=SPD.get(i,1.0)
        for _ in range(4):
            s,sr=k.create(txt,voice=voice_id,speed=sp,lang='en-us'); s=trim(s,sr); d=len(s)/sr
            if d<=slot-0.12 or sp>=1.25: break
            sp=min(1.25,sp*d/(slot-0.12)+0.02)
        p=os.path.join(out,f'vo_{i:02d}.wav'); sf.write(p,s,sr); clips.append((p,a/24+D.get(i,0.06)))
        report.append({'line':i,'text':txt,'slot':round(slot,2),'dur':round(d,2),'speed':round(sp,2),'over':d>slot})
    for f,name in getattr(ep,'SFX',[]): clips.append((os.path.join(HERE,'sfx',name+'.wav'),f/24))
    ins=[];flt=[]
    for n,(p,t) in enumerate(clips): ins+=['-i',p]; ms=int(t*1000); flt.append(f'[{n}]adelay={ms}|{ms}[a{n}]')
    dur=ep.N/24
    fc=';'.join(flt)+';'+''.join(f'[a{n}]' for n in range(len(clips)))+f'amix=inputs={len(clips)}:normalize=0,highpass=f=70,acompressor=threshold=-18dB:ratio=2.5:attack=5:release=90,apad,atrim=0:{dur},loudnorm=I=-16:TP=-1.5:LRA=7[out]'
    sh('ffmpeg','-y','-loglevel','error',*ins,'-filter_complex',fc,'-map','[out]','-ar','48000','-ac','2',os.path.join(out,'vo.wav'))
    return report
def qc(frames,out,N):
    a=np.asarray(Image.open(f'{frames}/f0000.png').convert('L'),float)[320:1450]; b=np.asarray(Image.open(f'{frames}/f{N-1:04d}.png').convert('L'),float)[320:1450]
    seam=float(abs(a-b).mean())
    fs=list(range(0,N,max(1,N//40)))[:40]; W,H=216,384; cols=10; sheet=Image.new('RGB',(W*cols,H*math.ceil(len(fs)/cols)),'white'); d=ImageDraw.Draw(sheet)
    for i,f in enumerate(fs): sheet.paste(Image.open(f'{frames}/f{f:04d}.png').resize((W,H)),((i%cols)*W,(i//cols)*H)); d.text(((i%cols)*W+4,(i//cols)*H+4),f'F{f}',fill='red')
    sheet.save(os.path.join(out,'qc_sheet.png'))
    return {'loop_seam_diff':round(seam,3),'loop_ok':seam<4.0}
if __name__=='__main__':
    epdir=os.path.abspath(sys.argv[1]); ep=load(epdir); out=os.path.join(epdir,'out'); frames=os.path.join(out,'frames'); os.makedirs(frames,exist_ok=True)
    if '--skip-render' not in sys.argv:
        from lib import render; render(ep,frames)
    rep=voice(ep,out)
    sh('ffmpeg','-y','-loglevel','error','-framerate','24','-i',f'{frames}/f%04d.png','-i',os.path.join(out,'vo.wav'),'-map','0:v','-map','1:a','-c:v','libx264','-preset','veryfast','-crf','20','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-shortest',os.path.join(out,'final.mp4'))
    q=qc(frames,out,ep.N); q['vo']=rep; json.dump(q,open(os.path.join(out,'qc.json'),'w'),indent=1)
    print(json.dumps({'mp4':os.path.join(out,'final.mp4'),'loop_ok':q['loop_ok'],'vo_over':[r['line'] for r in rep if r['over']]}))
