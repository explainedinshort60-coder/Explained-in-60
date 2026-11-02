"""Episode 003: Why you can't rip a zipper apart (Y-channel slider, staggered teeth, bump and dent).
Run: python3 episode.py render OUT_DIR   |   python3 episode.py frames 0,100,200 OUT_DIR"""
import os, sys, math
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'engine'))
from lib import *
import lib
HERE=os.path.dirname(os.path.abspath(__file__))
props_js=os.path.join(HERE,'props.js')
N=1440
CL,OP=220,380   # slider top y: closed, open
SYK=[(0,CL,'io'),(96,CL,'io'),(124,OP,'io'),(288,OP,'io'),(300,OP,'io'),(450,320,'lin'),(545,300,'io'),(640,CL,'io'),
     (790,CL,'io'),(850,OP,'io'),(872,OP,'io'),(900,CL,'io'),(916,CL,'io'),(944,OP,'io'),(984,OP,'io'),(1050,240,'io'),
     (1150,240,'io'),(1166,OP,'io'),(1172,OP,'io'),(1196,CL,'io'),(1440,CL,'io')]
TUG=[(0,0,'io'),(8,1,'out'),(16,.25,'io'),(24,1,'out'),(32,.25,'io'),(40,1.1,'out'),(56,0,'back'),(72,0,'io'),
     (690,0,'io'),(702,1.2,'out'),(712,.6,'io'),(722,1.5,'out'),(730,1.1,'io'),(742,1.7,'out'),(762,1.7,'io'),(768,0,'back'),(1440,0,'io')]
WOB=[(0,0,'io'),(8,1.2,'out'),(24,1.2,'io'),(40,1.6,'out'),(60,-0.6,'io'),(72,0,'io'),(700,0,'io'),(742,2.6,'out'),(762,2.4,'io'),(772,-2.0,'out'),(786,1.0,'io'),(800,0,'io')]
XR=[(0,0,'io'),(226,0,'io'),(244,1,'io'),(1190,1,'io'),(1215,0,'io')]
MAC=[(0,0,'io'),(450,0,'io'),(468,1,'back'),(640,1,'io'),(660,0,'io')]
MZ=[(0,1,'io'),(560,1,'io'),(585,2,'out'),(605,3,'out'),(625,4,'out'),(1440,4,'io')]
WORN=[(0,0,'io'),(960,0,'io'),(978,1,'io'),(1112,1,'io'),(1132,0,'io')]
SPLIT=[(0,0,'io'),(984,0,'io'),(1050,1,'io'),(1150,1,'io'),(1166,0,'io')]
PL=[(0,0,'io'),(1086,0,'io'),(1104,1,'out'),(1140,1,'io'),(1156,0,'io')]
PLQ=[(0,0,'io'),(1110,0,'io'),(1124,1,'in'),(1134,1,'io'),(1142,0,'io')]
def T(f):
    return {'sy':kv(SYK,f),'tug':kv(TUG,f),'wob':kv(WOB,f),'xr':kv(XR,f),'mac':kv(MAC,f),'mz':kv(MZ,f) if f>=450 else 1,
            'worn':kv(WORN,f),'split':kv(SPLIT,f),'pl':kv(PL,f),'plq':kv(PLQ,f),'lit':370<=f<450,
            'g':'panel' if (f<78 or 650<=f<782 or f>=1290) else 'tab'}

# ---------- camera (cx, cy, w) ----------
WIDE=(565,440,560); MED=(520,420,440)
def CU(y): return (522,y+86,340)
CAM=[(0,WIDE,'io'),(72,WIDE,'io'),(96,(545,400,500),'io'),(126,(540,380,500),'out'),(150,MED,'io'),(288,MED,'io'),
     (300,CU(OP),'io'),(450,CU(320),'lin'),(470,(398,380,610),'io'),(640,(398,380,610),'io'),(664,WIDE,'io'),
     (742,(610,420,600),'out'),(770,(620,430,640),'io'),(790,CU(CL),'cut'),(850,CU(OP),'io'),(872,MED,'cut'),
     (960,MED,'io'),(984,CU(OP),'io'),(1050,CU(240),'io'),(1080,(470,330,420),'io'),(1150,(470,330,420),'io'),(1196,MED,'io'),
     (1199,MED,'io'),(1200,WIDE,'cut')]

class Rig(Character):
    """Character whose left-hand IK accounts for the body lean (so the host can bend down to the zipper)."""
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

def bend(lean,**kw):
    p=pose('reach',**kw); p['lean']=lean; p['lt']=-lean+30; p['lk']=-55; p['rt']=-lean-30; p['rk']=55; p['ra']=-40; p['re']=30; p['rhand']='open'; return p
def tug(lean=12,**kw):
    p=pose('reach',**kw); p['lean']=lean; p['lt']=-lean+10; p['rt']=-lean-18; p['rk']=10; p['ra']=-60; p['re']=-40; p['rhand']='fist'; return p
pm=mirror(pose('present')); rm=mirror(pose('recoil'))
CK=[(0,tug(8,expression='frustrated'),'io'),(8,tug(14,expression='frustrated'),'out'),(16,tug(8,expression='frustrated'),'io'),(24,tug(14,expression='frustrated'),'out'),
    (32,tug(8,expression='frustrated'),'io'),(40,tug(16,expression='frustrated'),'out'),(58,tug(4,expression='skeptical'),'back'),(74,tug(2,expression='skeptical'),'io'),
    (78,dict(tug(0,expression='curious'),rw=0),'io'),(80,dict(bend(-14,expression='curious'),rw=0),'io'),(94,bend(-14,expression='curious'),'io'),
    (124,bend(-12,expression='amazed'),'io'),(138,bend(-12,expression='amazed'),'io'),(156,dict(pm,expression='explaining'),'out'),
    (286,dict(pm,expression='explaining',head=3),'io'),(310,pose('think'),'io'),(440,pose('think',head=10),'io'),
    (470,pose('fun-fact'),'back'),(630,pose('fun-fact',head=-4),'io'),(648,dict(tug(0,expression='skeptical'),rw=0),'io'),(664,tug(2,expression='skeptical'),'io'),
    (690,tug(4,expression='curious'),'io'),(702,tug(16,expression='frustrated'),'out'),(712,tug(10,expression='frustrated'),'io'),(722,tug(20,expression='frustrated'),'out'),
    (730,tug(15,expression='frustrated'),'io'),(742,tug(24,expression='frustrated'),'out'),(762,tug(26,expression='frustrated'),'io'),
    (770,dict(rm),'back'),(782,dict(rm,head=10),'io'),(790,dict(rm,head=10,rw=0),'io'),(800,pose('think'),'io'),(900,pose('think',head=6),'io'),
    (916,pose('fun-fact'),'back'),(980,pose('fun-fact',head=-3),'io'),(1000,dict(pm,expression='worried'),'io'),(1050,dict(pm,expression='worried'),'io'),
    (1066,pose('facepalm'),'back'),(1090,pose('facepalm'),'io'),(1104,pose('fun-fact',expression='realization'),'back'),(1170,pose('fun-fact',expression='amazed'),'io'),
    (1192,pose('tada'),'back'),(1199,pose('tada'),'io'),
    (1200,pose('proud'),'cut'),(1290,dict(pose('proud',head=-4)),'io'),(1300,dict(tug(0,expression='explaining'),rw=0),'io'),(1330,tug(0,expression='explaining'),'io'),
    (1368,tug(2,expression='curious'),'io'),(1440,tug(8,expression='frustrated'),'io')]
BL=[(70,3),(200,2),(380,3),(520,2),(660,2),(810,3),(940,2),(1150,2),(1250,3),(1340,2)]
character=Rig(CK,BL)

HL=[(150,200,'teethL','TEETH',-260,0),(200,244,'slider','SLIDER',40,0),(244,288,'ych','Y CHANNEL',-300,0),
    (300,370,'ych','Y CHANNEL',-300,0),(370,410,'teethL','LEFT',-250,0),(410,450,'teethR','RIGHT',60,0),
    (480,520,'bump','BUMP',-150,0),(520,560,'dent','DENT',40,0),(610,640,'stack','LOCKED',-120,0),
    (800,850,'open','SPLIT',-260,0),(872,900,'teethL','LOCKED',-250,0),(916,944,'open','OPEN',-200,0),
    (990,1050,'split','SPLITS OPEN',40,0),(1050,1104,'worn','WORN LOOSE',-330,0),(1104,1150,'pliers','SQUEEZE',-250,0),
    (1172,1196,'teethL','LOCKED',-250,0)]
CAPS=[(0,72,"Try ripping a zipper apart. Nope."),(72,150,"But this little slider? One second."),
 (150,200,"Two rows of teeth, staggered,"),(200,244,"plus a slider"),(244,288,"with a Y-shaped tunnel inside."),
 (288,370,"Zip up, and the Y squeezes both rows together,"),(370,450,"one tooth from the left, one from the right."),
 (450,545,"Each tooth has a bump on top and a dent underneath."),(545,640,"Each bump drops into the next dent. Locked."),
 (640,700,"So pulling sideways does... nothing."),(700,790,"Lowkey the strongest grip in your closet."),
 (790,872,"Zip down, and the Y splits them apart again."),(872,960,"Up: locked. Down: open. Every time."),
 (960,1050,"Here's the kicker. If yours keeps splitting,"),(1050,1104,"the slider's just worn loose."),
 (1104,1200,"Pinch it a hair tighter with pliers. Fixed."),
 (1200,1284,"No glue. No magnets."),(1284,1368,"Just tiny bumps in tiny dents."),(1368,1440,"And now you know...")]

SHOTS=[(0,72,'S01 HOOK','WS'),(72,288,'S02 MECHANISM','WS > MS'),(288,640,'S03 REVEALS','CU TILT > MAGNIFIER'),(640,790,'S04 GAG','WS PUSH'),
       (790,1200,'S05 DEMO + BONUS','CU > MS'),(1200,1368,'S06 TAKEAWAY','WS = S01'),(1368,1440,'S07 LOOP OUT','WS > S01')]

SAY={0:"Try ripping a zipper apart... nope.",15:"Pinch it a hair tighter, with pliers. Fixed.",18:"And now you know..."}
SPD={18:0.85}
GROUPS={}
VO_DELAY={0:0.02}
SFX=[(0,'tug'),(24,'tug'),(40,'tug'),(98,'zip_fast'),(302,'zip_slow'),(585,'click'),(605,'click'),(625,'click'),(702,'tug'),(722,'tug'),(742,'tug'),(768,'snap'),
     (792,'zip_med'),(873,'zip_fast'),(917,'zip_fast'),(986,'zip_med'),(1124,'click'),(1151,'zip_fast'),(1173,'zip_fast')]
def frame(f):
    return {'T':T(f),'cam':dict(zip(('cx','cy','w'),kv(CAM,f))),
            'hl':[{'part':h[2],'label':h[3],'dx':h[4],'dy':h[5]} for h in HL if h[0]<=f<h[1]],
            'cap':(at(CAPS,f) or (0,0,''))[2],'badge':'SLOW' if 300<=f<450 else None,
            'pop':({'x':560,'y':230,'s':min(1,(f-100)/4+.3),'text':'ZIP!'} if 100<=f<124 else
                   {'x':560,'y':260,'s':min(1,(f-742)/4+.3),'text':'NOPE.'} if 742<=f<770 else None)}
if __name__=='__main__':
    cmd=sys.argv[1]
    if cmd=='render': render(sys.modules[__name__],sys.argv[2])
    elif cmd=='frames': render(sys.modules[__name__],sys.argv[3],[int(x) for x in sys.argv[2].split(',')])
