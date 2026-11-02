"""Episode 002: Why a clicky pen stays out after one click (rotating cam).
Run: python3 episode.py render OUT_DIR   |   python3 episode.py frames 0,100,200 OUT_DIR"""
import os, sys, math
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'engine'))
from lib import *
HERE=os.path.dirname(os.path.abspath(__file__))
props_js=os.path.join(HERE,'props.js')
N=1440
# ---------- pen mechanism (deterministic sim) ----------
L,HN,HB,HG=14,34,30,70
def R(u):
    m=u%180
    if m<90: return L+(HN-L)*m/90
    if m<140: return L+(HB-L)*(m-90)/50
    return HB+(HG-HB)*(m-140)/40
# clicks: (start, down, hold, up). 8 clicks = even, so the pen ends retracted and the cam turns 720 deg (2 ribs: identical).
CLICKS=[(10,5,12,8),(292,5,12,8),(350,60,150,140),(846,8,34,30),(975,5,12,8),(1014,5,12,8),(1060,8,32,26),(1158,5,12,8)]
PRESS=[(0,0,'io')]
for s,d,h,u in CLICKS: PRESS+=[(s,0,'io'),(s+d,1,'out'),(s+d+h,1,'io'),(s+d+h+u,0,'io')]
SLOW=[(350,490,0),(490,560,0.65),(560,640,0),(640,790,0.3),(846,930,2.0),(1100,1135,1.6)]
def rate(f):
    for a,b,r in SLOW:
        if a<=f<b: return r
    return 4.0
SIM=[]
def _sim():
    u,h,hs,pp=179.99,HG,HG,0
    for f in range(N):
        p=kv(PRESS,f)
        if p>0 and pp==0: hs=h
        pp=p; P=hs*(1-p) if p>0 else 999; r=rate(f)
        if P<L-0.5:
            if r>0:
                tgt=45+90*math.ceil((u-45-1e-6)/90); u=min(tgt,u+r)
        elif R(u)<=P and r>0:
            corner=90*math.floor(u/90)+89.99; u=min(corner,u+r) if u<corner else u
        h=min(R(u),P); SIM.append((h,u,p))
_sim()
def T(f): h,u,p=SIM[f]; return {'h':h,'u':u,'press':p}

# ---------- camera ----------
WIDE=(560,440,540); MED=(520,430,520); CU=(520,375,300); PUNCH=(520,365,230); DEMO=(525,440,560)
CAM=[(0,WIDE,'io'),(72,WIDE,'io'),(120,MED,'io'),(288,MED,'io'),(300,MED,'io'),(345,CU,'io'),(550,CU,'io'),(575,(520,440,420),'io'),(640,(520,440,420),'io'),(680,CU,'io'),(786,CU,'io'),(790,PUNCH,'out'),
     (806,PUNCH,'io'),(830,(520,420,500),'io'),(840,DEMO,'cut'),(1199,DEMO,'io'),(1200,WIDE,'cut')]

pm=mirror(pose('present')); rm=mirror(pose('recoil'))
CK=[(0,pose('reach'),'io'),(40,pose('reach'),'io'),(60,pose('reach',expression='realization'),'io'),(74,pose('reach',expression='realization'),'io'),
    (92,pose('fun-fact',expression='explaining'),'back'),(270,pose('fun-fact',expression='explaining',head=2),'io'),(288,pose('reach',expression='neutral'),'out'),
    (340,pose('reach',expression='curious'),'io'),(520,pose('reach',expression='thinking'),'io'),(700,pose('reach',expression='thinking'),'io'),
    (786,pose('reach',expression='surprised'),'io'),(796,dict(rm),'back'),(826,dict(rm,head=10),'io'),(842,pose('reach',expression='curious'),'out'),
    (930,pose('reach',expression='amazed'),'io'),(960,pose('reach',expression='explaining'),'io'),(1040,pose('reach',expression='curious'),'io'),
    (1130,pose('reach',expression='laughing'),'io'),(1190,pose('reach',expression='laughing'),'io'),
    (1200,pose('proud'),'cut'),(1360,pose('proud',head=-4),'io'),(1386,pose('reach',expression='curious'),'out'),(1440,pose('reach'),'io')]
BL=[(88,3),(286,2),(450,3),(640,2),(793,2),(900,2),(1012,3),(1140,2),(1260,3),(1340,2),(1384,2)]
character=Character(CK,BL)

HL=[(0,72,'button','ONE CLICK',-200,-260),(130,180,'spring','SPRING',-330,-300),(180,207,'button','BUTTON',-260,-260),(207,234,'cam','CAM',-300,-260),
    (234,288,'stops','STOPS',-260,-260),(360,490,'cam','PUSHED DOWN',-200,-260),(490,560,'rib','TWIST',-160,-260),(560,640,'spring','SPRING PUSHES UP',-300,-300),
    (640,700,'rib','TWISTS AGAIN',-200,-260),(700,790,'step','SHORT STEP',-200,-260),(846,900,'rib','ANOTHER TWIST',-220,-260),(900,960,'slot','LONG SLOT',-240,-260),
    (978,1008,'step','STEP = OUT',-240,-260),(1010,1030,'slot','SLOT = IN',-240,-260),(1066,1100,'cam','CLICK 1',-220,-260),(1120,1160,'rib','CLICK 2',-220,-260),
    (1220,1368,'button','ONE CLICK',-200,-260),(1400,1440,'button','ONE CLICK',-200,-260)]
CAPS=[(0,72,"Why your pen stays out after one click."),(72,130,"No magnet. No motor. No glue."),(130,180,"Just a spring on the ink tube,"),
 (180,234,"a button, a spinning cam,"),(234,288,"and fixed stops inside the barrel."),(288,348,"Click it back in. Now, in slow motion."),
 (348,420,"Press, and the button shoves the cam down"),(420,490,"past the stops."),(490,560,"Its angled teeth give it a little twist."),
 (560,640,"Let go, and the spring pushes everything back up."),(640,700,"The cam twists a bit more,"),(700,790,"and its ribs catch on a short step. Locked."),
 (790,840,"Click!"),(840,900,"Click again. The cam twists again,"),(900,960,"and the ribs slide up a long slot."),
 (960,1030,"Short step, tip out. Long slot, tip in."),(1030,1100,"Listen closely. One click going down,"),(1100,1200,"and a second one as it locks in place."),
 (1200,1284,"Your pen has no memory at all."),(1284,1368,"A tiny cam just turns a little with every click."),(1368,1440,"And now you know...")]

SHOTS=[(0,72,'S01 HOOK','WS'),(72,288,'S02 MECHANISM','PUSH-IN MS'),(288,528,'S03 REVEAL A','MS > CU'),(528,840,'S04 REVEAL B','CU > PUNCH > MS'),
       (840,1200,'S05 FULL DEMO','MS'),(1200,1368,'S06 TAKEAWAY','WS = S01'),(1368,1440,'S07 LOOP OUT','WS > S01')]

SAY={0:"Why your pen stays out... after one click.",12:"Click!",21:"And now you know..."}
SPD={21:0.85}
GROUPS={6:(7,"Press, and the button shoves the cam down, past the stops.")}
VO_DELAY={0:0.02,12:0.15}
def _events():
    ev=[]
    for i in range(1,N):
        if SIM[i][2]>=0.999 and SIM[i-1][2]<0.999: ev.append((i,'click'))
        a,b=SIM[i-1][1]%90,SIM[i][1]%90
        if abs(b-89.99)<1e-6 and abs(a-89.99)>1e-6 and SIM[i][2]<0.5: ev.append((i,'click'))
    return ev
SFX=_events()
def frame(f):
    return {'T':T(f),'cam':dict(zip(('cx','cy','w'),kv(CAM,f))),
            'hl':[{'part':h[2],'label':h[3],'dx':h[4],'dy':h[5]} for h in HL if h[0]<=f<h[1]],
            'cap':(at(CAPS,f) or (0,0,''))[2],'badge':'SLOW' if 348<=f<790 else None,
            'pop':{'x':430,'y':250,'s':min(1,(f-790)/4+.3),'text':'CLICK!'} if 790<=f<818 else None}
if __name__=='__main__':
    cmd=sys.argv[1]
    if cmd=='render': render(sys.modules[__name__],sys.argv[2])
    elif cmd=='frames': render(sys.modules[__name__],sys.argv[3],[int(x) for x in sys.argv[2].split(',')])
    elif cmd=='sim':
        print('SFX',SFX)
        for f in range(0,N,int(sys.argv[2]) if len(sys.argv)>2 else 10): print(f,[round(x,1) for x in SIM[f]])
