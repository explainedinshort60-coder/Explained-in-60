"""Explained in 60 render library. An episode file (episodes/<id>/episode.py) imports this,
declares its timeline (camera, character keys, prop state, callouts, captions) and calls render()."""
import json, math, asyncio, os, sys
HERE=os.path.dirname(os.path.abspath(__file__)); ROOT=os.path.dirname(HERE)
PJ=json.load(open(os.path.join(ROOT,'poses','poses.json')))
FPS=24; CX=720  # character root x in world units; floor at y=700
BASE={'la':12,'le':0,'ra':-12,'re':0,'lt':3,'lk':0,'rt':-3,'rk':0,'head':0,'lean':0,'rw':0,
      'lhand':'relaxed','rhand':'relaxed','expression':'neutral','front':[]}
NUM=['la','le','ra','re','lt','lk','rt','rk','head','lean','rw']
EXPRESSIONS=['neutral','curious','thinking','confused','surprised','amazed','realization','explaining','skeptical','worried','frustrated','laughing']
HANDS=['relaxed','open','point','fist','thumb']
def pose(n,**kw):
    """Named poses: idle, reach (left hand on PROPS.grip), present, tada, facepalm, think, fun-fact, recoil, proud, dash."""
    p=dict(BASE)
    if n not in('idle','reach'):
        q=PJ[n]; p.update({k:v for k,v in q.items() if k in BASE}); p['lean']=q.get('root_lean_deg_about_hips',0); p['front']=q.get('front_layer_arms',[])
    if n=='reach': p.update(rw=1,lhand='fist',expression='curious',head=-5,rt=-6,rk=6)
    p.update(kw); return p
def mirror(p):
    q=dict(p)
    for a,b in(('la','ra'),('le','re'),('lt','rt'),('lk','rk')): q[a],q[b]=-p[b],-p[a]
    q['head']=-p['head']; q['lean']=-p['lean']; q['lhand'],q['rhand']=p['rhand'],p['lhand']
    q['front']=[{'l':'r','r':'l'}[s] for s in p['front']]; return q
def ease(t,k):
    if k=='out': return 1-(1-t)**3
    if k=='in': return t**3
    if k=='back': s=1.5; t-=1; return t*t*((s+1)*t+s)+1
    if k=='lin': return t
    if k=='cut': return 1.0
    return -(math.cos(math.pi*t)-1)/2
def kv(keys,f):
    """Interpolate keys [(frame, value|tuple, ease_into_this_key)]."""
    if f<=keys[0][0]: return keys[0][1]
    for (f0,a,_),(f1,b,e) in zip(keys,keys[1:]):
        if f0<=f<=f1:
            u=ease((f-f0)/(f1-f0) if f1>f0 else 1,e)
            return a+(b-a)*u if not isinstance(a,(tuple,list)) else [x+(y-x)*u for x,y in zip(a,b)]
    return keys[-1][1]
def at(lst,f): return next((x for x in lst if x[0]<=f<x[1]),None)
def ik(t,bend=-1):
    sx,sy=-52,300; tx,ty=t; dx,dy=tx-sx,ty-sy; d=min(math.hypot(dx,dy),174.5)
    deg=lambda x,y: math.degrees(math.atan2(-x,y)); phi=deg(dx,dy)
    al=math.degrees(math.acos((90*90+d*d-85*85)/(180*d))); t1=phi+bend*al
    ex,ey=sx-90*math.sin(math.radians(t1)),sy+90*math.cos(math.radians(t1)); return t1,deg(tx-ex,ty-ey)-t1
def lowfoot(s):
    best=-1e9
    for sd,hx in(('l',-35),('r',35)):
        t,k=s[sd+'t'],s[sd+'k']; d=lambda a:(-math.sin(math.radians(a)),math.cos(math.radians(a)))
        kx,ky=hx+110*d(t)[0],450+110*d(t)[1]; fx,fy=kx+110*d(t+k)[0],ky+110*d(t+k)[1]; r=math.radians(s['lean'])
        best=max(best,fx*math.sin(r)+(fy-450)*math.cos(r)+450)
    return best
class Character:
    """Pose-to-pose character track with overlap offsets, moving holds, blinks and planted feet."""
    OF={'la':1,'ra':1,'le':3,'re':3,'head':2}
    def __init__(self,keys,blinks=()): self.K=keys; self.BL=blinks
    def samp(self,f):
        K=self.K
        if f<=K[0][0]: return dict(K[0][1])
        for (f0,a,_),(f1,b,e) in zip(K,K[1:]):
            if f0<=f<=f1:
                t=(f-f0)/(f1-f0) if f1>f0 else 1; u=ease(t,e); s={k:a[k]+(b[k]-a[k])*u for k in NUM}
                sw=b if t>=.5 else a; s.update(lhand=sw['lhand'],rhand=sw['rhand'],front=sw['front'],expression=b['expression'] if t>=.35 else a['expression']); return s
        return dict(K[-1][1])
    def state(self,f,grip):
        m=self.samp(f); s={k:(self.samp(f-self.OF[k])[k] if k in self.OF else m[k]) for k in NUM}
        for k in('lhand','rhand','front','expression'): s[k]=m[k]
        s['head']+=math.sin(f/FPS*2*math.pi*.3+1)*.8
        y=685-15-lowfoot(s)+math.sin(f/FPS*2*math.pi*.45)*1.4
        if s['rw']>0.001:
            t1,t2=ik((grip['x']+8-CX,grip['y']-4-y),-1); s['la']+=(t1-s['la'])*s['rw']; s['le']+=(t2-s['le'])*s['rw']
        st={k:s[k] for k in('la','le','ra','re','lt','lk','rt','rk','head','lhand','rhand','expression')}; st['y']=0
        return {'st':st,'y':y,'lean':s['lean'],'front':s['front'],'blink':any(b<=f<b+n for b,n in self.BL)}
def render(ep,outdir,frames=None):
    """ep must provide: N, props_js (path), frame(f)->dict(T,cam,hl,cap,pop,badge), character (Character)."""
    from playwright.async_api import async_playwright
    os.makedirs(outdir,exist_ok=True)
    async def run():
        async with async_playwright() as p:
            b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':1080,'height':1920})
            await pg.set_content('<html><body style="margin:0;overflow:hidden"><div id=a style="display:none"></div><div id=stage style="position:relative;width:1080px;height:1920px"></div></body></html>')
            for js in (os.path.join(HERE,'rig.js'),os.path.join(HERE,'core.js'),ep.props_js): await pg.add_script_tag(path=js)
            await pg.evaluate("window.actor=Explained60Rig.create(document.querySelector('#a'));actor.pause(true);")
            for f in (frames or range(ep.N)):
                S=ep.frame(f); S.setdefault('f',f); S.setdefault('slate',''); S.setdefault('tc',f'F{f:04d}')
                grip=await pg.evaluate("T=>gripPoint(T)",S['T'])
                if getattr(ep,'character',None): S['C']=ep.character.state(f,grip)
                await pg.evaluate("S=>drawFrame(S)",S); await pg.screenshot(path=f"{outdir}/f{f:04d}.png")
            await b.close()
    asyncio.run(run())
