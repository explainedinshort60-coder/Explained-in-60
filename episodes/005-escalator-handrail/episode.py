"""Episode 005: Where does the escalator handrail go? (one closed rubber loop: top run, end rollers, hidden return run,
drive wheel with pressure rollers, chained to the same motor as the steps).
Run: python3 episode.py render OUT_DIR   |   python3 episode.py frames 0,100,200 OUT_DIR"""
import os, sys, math
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'engine'))
from lib import *
import lib
HERE=os.path.dirname(os.path.abspath(__file__))
props_js=os.path.join(HERE,'props.js')
N=1440
PITCH=70/math.cos(math.pi/6)
# ---------- loop length (same rounded polygon as props.js) ----------
LOOP=[(580,400,45),(420,400,50),(-550,-160,50),(-680,-160,45),(-680,-60,45),(-550,-60,50),(420,500,50),(580,500,45)]
def loop_geo():
    n=len(LOOP);C=[]
    for i in range(n):
        px,py,r=LOOP[i];ax,ay,_=LOOP[i-1];bx,by,_=LOOP[(i+1)%n]
        l1=math.hypot(px-ax,py-ay);dix,diy=(px-ax)/l1,(py-ay)/l1
        l2=math.hypot(bx-px,by-py);dox,doy=(bx-px)/l2,(by-py)/l2
        th=math.acos(max(-1,min(1,dix*dox+diy*doy)));t=r*math.tan(th/2)
        C.append(((px-dix*t,py-diy*t),(px+dox*t,py+doy*t),r*th))
    L=0
    for i in range(n): p=C[i-1][1];q=C[i][0];L+=math.hypot(q[0]-p[0],q[1]-p[1])+C[i][2]
    return L
LLEN=loop_geo()
def _segs():
    n=len(LOOP);C=[]
    for i in range(n):
        px,py,r=LOOP[i];ax,ay,_=LOOP[i-1];bx,by,_=LOOP[(i+1)%n]
        l1=math.hypot(px-ax,py-ay);dix,diy=(px-ax)/l1,(py-ay)/l1
        l2=math.hypot(bx-px,by-py);dox,doy=(bx-px)/l2,(by-py)/l2
        cr=dix*doy-diy*dox;sg=1 if cr>0 else -1;th=math.acos(max(-1,min(1,dix*dox+diy*doy)));t=r*math.tan(th/2)
        A=(px-dix*t,py-diy*t);B=(px+dox*t,py+doy*t);Cc=(A[0]-diy*sg*r,A[1]+dix*sg*r)
        C.append(dict(A=A,B=B,C=Cc,r=r,sg=sg,th=th,a0=math.atan2(A[1]-Cc[1],A[0]-Cc[0])))
    S=[];s=0
    for i in range(n):
        p=C[i-1]['B'];q=C[i]['A'];ll=math.hypot(q[0]-p[0],q[1]-p[1]);S.append(('L',p,q,s,ll));s+=ll
        c=C[i];S.append(('A',c,None,s,c['r']*c['th']));s+=c['r']*c['th']
    return S
SEGS=_segs()
def loop_at(s):
    s%=LLEN
    for k,p,q,s0,ln in SEGS:
        if s<=s0+ln+1e-9:
            u=(s-s0)/ln if ln else 0
            if k=='L': return (p[0]+(q[0]-p[0])*u,p[1]+(q[1]-p[1])*u)
            a=p['a0']+p['sg']*p['th']*u; return (p['C'][0]+p['r']*math.cos(a),p['C'][1]+p['r']*math.sin(a))
    return loop_at(0)
# ---------- handrail and step travel (same speed; the duck lap and the slip lag are the exceptions) ----------
G0,G1=784,880           # duck ride: exactly one lap of the loop
V0=4.6
def vbase(f): return V0
OFF=[0.0]*N
acc=0
w=[math.sin(math.pi*(f-G0+.5)/(G1-G0)) for f in range(G0,G1)]
ws=sum(w)
for f in range(N):
    OFF[f]=acc
    if G0<=f<G1: acc+=V0+(LLEN-V0*(G1-G0))*w[f-G0]/ws
    else: acc+=V0
# round the total travel to a whole number of steps so the loop seam matches: rescale the base speed outside the ride
tot=acc;tgt=round(tot/PITCH)*PITCH;extra=tgt-tot;nb=N-(G1-G0)
acc=0
for f in range(N):
    OFF[f]=acc
    if G0<=f<G1: acc+=V0+(LLEN-V0*(G1-G0))*w[f-G0]/ws
    else: acc+=V0+extra/nb
MK0=1000
def lag(f):
    if f<1040 or f>=1200: return 0
    return 70*min(1,(f-1040)/140)**1.4
XR=[(0,0,'io'),(76,0,'io'),(92,1,'io'),(232,1,'io'),(246,0,'io'),(296,0,'io'),(306,1,'io'),(690,1,'io'),(702,0,'io'),
    (790,0,'io'),(806,1,'io'),(996,1,'io'),(1001,0,'cut')]
DASH=[(0,0,'io'),(84,0,'io'),(96,1,'io'),(150,1,'io'),(162,0,'io'),(922,0,'io'),(934,1,'io'),(990,1,'io'),(1000,0,'io')]
SQ=[(0,0,'io'),(540,0,'io'),(552,1,'out'),(600,1,'io'),(612,0,'io')]
MK=[(0,0,'io'),(1000,0,'io'),(1010,1,'io'),(1192,1,'io'),(1199,0,'io')]
def retX(f): return -500+(f-366)*(660/74)   # RETURN callout rides along the return run (366..444), the camera follows it
MKOS0=OFF[MK0]; MKD0=PITCH+(MKOS0%PITCH)
def footx(f): return 400-0.866*(MKD0+OFF[f]+lag(f)-MKOS0)+35
MKX=footx(MK0)
def duck(f):
    if G0-6<=f<922:
        return HAND_S+(OFF[min(f,G1)]-OFF[G0]) if f>=G0 else HAND_S
    return -1
HAND_S=10+45*math.pi/2+7   # top run point under the host's hand (x=528)
def T(f):
    return {'o':OFF[f]-lag(f)*0,'os':OFF[f]+lag(f),'xr':kv(XR,f),'dash':kv(DASH,f),'sq':kv(SQ,f),'mk':kv(MK,f),
            'mkd0':MKD0,'mkos0':MKOS0,'mko0':OFF[MK0],'mkx':MKX,'retX':retX(f),'duck':duck(f),
            'duckS':min(1,(f-(G0-6))/6) if G0-6<=f<G0 else (max(0,1-(f-914)/6) if f>914 else 1),
            'g':'duck' if 760<=f<G0 else 'rail'}

# ---------- camera (cx, cy, w) ----------
WIDE=(440,420,820); FULL=(30,330,1560); UPEND=(-610,-70,560); DRIVE=(380,630,400); SQZ=(455,520,260); PITV=(395,770,380)
MED=(470,420,700)
def trk(x,w=620,dy=0): return (x,700-(400-x)*0.577-300+120+dy,w)
CAM=[(0,WIDE,'io'),(18,WIDE,'io'),(58,(-470,-40,640),'io'),(72,(-560,-60,600),'io'),
     (76,FULL,'cut'),(150,(20,330,1500),'io'),(160,(-60,240,1100),'io'),(232,(-80,250,1040),'io'),
     (240,trk(-60),'cut'),(300,trk(-250,600),'io'),(306,UPEND,'cut'),(362,(-620,-60,520),'io'),
     (366,trk(-500,600,90),'cut'),(440,trk(160,600,90),'lin'),(444,DRIVE,'cut'),(520,(385,610,395),'io'),(530,SQZ,'io'),(604,(455,510,255),'io'),
     (606,PITV,'cut'),(690,(395,765,375),'io'),(696,MED,'cut'),(740,MED,'io'),(784,(500,430,640),'io'),
     (850,(480,420,820),'io'),(880,(470,420,720),'io'),(918,(470,420,700),'io'),
     (920,FULL,'cut'),(1000,(20,330,1500),'io'),
     (1001,trk(-60,620),'cut'),(1199,trk(-60-1.0*(OFF[1199]-OFF[1000])*0.866*0+0,560),'io'),
     (1200,WIDE,'cut'),(1284,(450,410,780),'io'),(1340,(450,410,780),'io'),(1420,WIDE,'io'),(1440,WIDE,'io')]

class Rig(Character):
    """Left-hand IK that accounts for the body lean (from ep 003)."""
    def state(self,f,grip):
        m=self.samp(f); s={k:(self.samp(f-self.OF[k])[k] if k in self.OF else m[k]) for k in lib.NUM}
        for k in('lhand','rhand','front','expression'): s[k]=m[k]
        s['head']+=math.sin(f/FPS*2*math.pi*.3+1)*.8
        y=685-15-lib.lowfoot(s)+math.sin(f/FPS*2*math.pi*.45)*1.4
        if s['rw']>0.001:
            r=math.radians(-s['lean']); px,py=CX,y+450; gx,gy=grip['x']-px,grip['y']-py
            lx,ly=px+gx*math.cos(r)-gy*math.sin(r),py+gx*math.sin(r)+gy*math.cos(r)
            t1,t2=lib.ik((lx+8-CX,ly-4-y),-1); s['la']+=(t1-s['la'])*s['rw']; s['le']+=(t2-s['le'])*s['rw']
        st={k:s[k] for k in('la','le','ra','re','lt','lk','rt','rk','head','lhand','rhand','expression')}; st['y']=0
        return {'st':st,'y':y,'lean':s['lean'],'front':s['front'],'blink':any(b<=f<b+n for b,n in self.BL)}

def reach(lean=-6,**kw):
    p=pose('reach',**kw); p['lean']=lean; p['lt']=-lean+3; p['rt']=-lean-6; p['ra']=-24; p['re']=12; return p
pm=dict(mirror(pose('present')))
R0=reach(-8,expression='curious',head=-6)
CK=[(0,R0,'io'),(20,reach(-8,expression='curious',head=-12),'io'),(60,reach(-10,expression='skeptical',head=-16),'io'),(72,reach(-10,expression='skeptical',head=-14),'io'),
    (76,pose('think'),'cut'),(232,pose('think',expression='curious'),'io'),(430,pose('think',expression='curious'),'io'),(444,pose('idle',expression='curious',head=-6),'cut'),(690,pose('idle',expression='amazed',head=-6),'io'),
    (696,dict(pm,expression='explaining'),'cut'),(720,dict(pm,expression='explaining',head=4),'io'),(740,pose('fun-fact'),'back'),(760,pose('fun-fact'),'io'),
    (774,reach(-6,expression='laughing',lhand='open'),'io'),(G0,reach(-6,expression='laughing',lhand='open'),'io'),
    (796,dict(pm,expression='amazed'),'io'),(870,dict(pm,expression='amazed',head=-6),'io'),
    (G1,pose('recoil'),'back'),(900,pose('recoil'),'io'),(912,dict(pm,expression='laughing'),'io'),(919,dict(pm,expression='laughing'),'io'),
    (920,pose('think'),'cut'),(1199,pose('think'),'io'),
    (1200,pose('proud'),'cut'),(1270,pose('proud',head=-4),'io'),(1290,dict(pm,expression='explaining'),'io'),(1340,dict(pm,expression='explaining',head=3),'io'),
    (1376,R0,'io'),(1440,R0,'io')]
BL=[(40,3),(200,2),(400,3),(640,2),(730,3),(950,2),(1150,2),(1250,3),(1330,2)]
character=Rig(CK,BL)

# callouts: (start, end, anchor, label, dx, dy)
HL=[(112,150,'loop','ONE LOOP',-120,0),
    (176,232,'rail','HAND',-200,0),(176,232,'steps','FEET',-200,0),
    (256,300,'top','TOP RUN',-180,0),
    (316,362,'rollers','ROLLERS',-80,0),
    (380,440,'ret','RETURN',-140,0),
    (460,520,'wheel','DRIVE WHEEL',-300,0),
    (540,604,'press','SQUEEZE',-200,0),
    (620,690,'motor','MOTOR',-120,0),(640,690,'chain','CHAIN',-330,0),
    (1060,1199,'mhand','HAND',-200,0),(1060,1199,'mfoot','FEET',-200,0)]
CAPS=[(0,72,"Where does the escalator handrail go?"),
 (72,150,"It never ends. It's one rubber loop."),
 (150,240,"But something has to match it to your feet."),
 (240,306,"Your hand rides the top run."),
 (306,366,"Rollers swing it around the end,"),
 (366,444,"it sneaks back underneath, upside down,"),
 (444,522,"and down here, a drive wheel grabs it."),
 (522,606,"Rollers squeeze it tight, and friction pushes it along."),
 (606,696,"That wheel's chained to the same motor as the steps."),
 (696,750,"Hand and feet, same ride."),
 (750,810,"Don't believe me? Send in the duck."),
 (810,870,"Lowkey the best ride in the mall."),
 (870,920,"And it's back. Every time."),
 (920,1000,"Up, around, under, through the wheel. Forever."),
 (1000,1090,"Here's the kicker: hand drifting behind your feet?"),
 (1090,1200,"Worn rubber stretches, and the grip slips a little."),
 (1200,1284,"So the handrail never ends."),
 (1284,1368,"It just loops back around, all day."),
 (1368,1440,"And now you know...")]
SHOTS=[(0,72,'S01 HOOK','WS > TRACK UP'),(72,240,'S02 TURN','FULL XRAY'),(240,696,'S03 MECHANISM + REVEALS','TRACK, UPEND, DRIVE, PIT'),
       (696,920,'S04 GAG','MS > FULL'),(920,1000,'S05 DEMO','FULL XRAY'),(1000,1200,'S06 BONUS','TRACK'),(1200,1368,'S07 TAKEAWAY','WS = S01'),(1368,1440,'S08 LOOP OUT','WS')]
SAY={0:"Where does the escalator handrail... go?",8:"That wheel is chained to the same motor as the steps.",18:"And now you know..."}
SPD={18:0.85}
GROUPS={}
VO_DELAY={0:0.02}
SFX=[(58,'lib_whoosh_fast'),(76,'lib_whoosh_fast'),(240,'lib_whoosh_fast'),(306,'lib_whoosh_fast'),(330,'lib_mech_click'),(366,'lib_whoosh_fast'),
     (444,'lib_whoosh_fast'),(548,'lib_mech_clunk'),(560,'lib_gear_ratchet'),(606,'lib_whoosh_fast'),(640,'lib_gear_ratchet'),
     (696,'lib_whoosh_fast'),(778,'lib_pop_bubble'),(786,'lib_slide_whistle_up'),(818,'lib_boing'),(826,'lib_slide_whistle_down'),
     (862,'lib_mech_click'),(872,'lib_boing'),(G1,'lib_boing'),(884,'lib_ooh_crowd'),(920,'lib_whoosh_fast'),(1001,'lib_whoosh_fast'),
     (1150,'lib_record_scratch'),(1200,'lib_whoosh_fast'),(1290,'lib_ding')]
def frame(f):
    pop=None
    if 44<=f<72: pop={'x':-860,'y':-300,'s':min(1,(f-44)/4+.3),'text':'THE END?'}
    elif 806<=f<846:
        p=duckpos(f); pop={'x':p[0]-260,'y':p[1]-260,'s':min(1,(f-806)/4+.3),'text':'WHEEE!'}
    elif G1<=f<918: pop={'x':120,'y':10,'s':min(1,(f-G1)/4+.3)*(1+0.05*math.sin(f*1.2)),'text':"IT'S BACK!"}
    elif 1150<=f<1199: pop={'x':footx(f)-330,'y':700-(400-footx(f))*0.577-560,'s':min(1,(f-1150)/4+.3),'text':'SLIP!'}
    badge=None
    if G0<=f<G1: badge='4X'
    elif kv(XR,f)>0.5: badge='X-RAY'
    cam=kv(CAM,f)
    if 366<=f<444: cam=trk(retX(f),600,90)
    if 790<=f<G1+2:
        xs=ys=0;n=0
        for g in range(f-5,f+6):
            g=max(G0,min(G1,g));x,y=loop_at(duck(g));xs+=x;ys+=y;n+=1
        dx,dy=xs/n,ys/n;u=min(1,(f-790)/10);u=u*u*(3-2*u);v=min(1,max(0,(G1+2-f)/8));u*=v*v*(3-2*v)
        c0=kv(CAM,f);cam=(c0[0]+(dx-c0[0])*u,c0[1]+(dy+60-c0[1])*u,c0[2]+(820-c0[2])*u)
    if 1001<=f<1200: x=footx(min(f,1192)); cam=trk(x-60,640,-10)
    return {'T':T(f),'cam':dict(zip(('cx','cy','w'),cam)),
            'hl':[{'part':h[2],'label':h[3],'dx':h[4],'dy':h[5]} for h in HL if h[0]<=f<h[1]],
            'cap':(at(CAPS,f) or (0,0,''))[2],'badge':badge,'pop':pop}
def duckpos(f): return loop_at(duck(f))
if __name__=='__main__':
    cmd=sys.argv[1]
    if cmd=='render': render(sys.modules[__name__],sys.argv[2])
    elif cmd=='frames': render(sys.modules[__name__],sys.argv[3],[int(x) for x in sys.argv[2].split(',')])
