"""Episode 006: How does a toaster know when to pop? (it counts: lever, rack, spring, electromagnet, timer chip, darkness knob).
Run: python3 episode.py render OUT_DIR   |   python3 episode.py frames 0,100,200 OUT_DIR"""
import os, sys, math
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'engine'))
from lib import *
import lib
HERE=os.path.dirname(os.path.abspath(__file__))
props_js=os.path.join(HERE,'props.js')
N=1440
# ---------- state tracks ----------
C=[(0,1,'io'),(18,1,'io'),(22,0,'out'),(250,0,'io'),(290,1,'in'),(738,1,'io'),(743,0,'out'),
   (930,0,'io'),(940,1,'in'),(1022,1,'io'),(1026,0,'out'),
   (1070,0,'io'),(1080,1,'in'),(1084,1,'io'),(1088,0,'out'),(1112,0,'io'),(1121,1,'in'),(1125,1,'io'),(1129,0,'out'),
   (1150,0,'io'),(1158,1,'in'),(1161,1,'io'),(1165,0,'out'),
   (1199,0,'io'),(1200,1,'cut'),(1440,1,'io')]
MAG=[(0,1,'io'),(18,1,'io'),(19,0,'cut'),(290,0,'io'),(292,1,'out'),(732,1,'io'),(736,0,'out'),(940,0,'io'),(942,1,'out'),(1020,1,'io'),(1022,0,'out'),
     (1199,0,'io'),(1200,1,'cut')]
HEAT=[(0,1,'io'),(18,1,'io'),(40,0,'io'),(292,0,'io'),(330,1,'io'),(738,1,'io'),(770,0,'io'),(942,0,'io'),(960,1,'io'),(1022,1,'io'),(1040,0,'io'),
      (1199,0,'io'),(1200,1,'cut')]
TM=[(0,.92,'lin'),(18,1,'lin'),(239,1,'io'),(240,0,'cut'),(296,0,'io'),(600,.62,'lin'),(732,1,'lin'),(919,1,'io'),(920,0,'cut'),(942,0,'io'),(1020,1,'lin'),
    (1199,1,'io'),(1200,.6,'cut'),(1440,.92,'lin')]
RING=[(0,1,'io'),(30,1,'io'),(46,0,'io'),(500,0,'io'),(512,1,'io'),(760,1,'io'),(772,0,'io'),(930,0,'io'),(940,1,'io'),(1030,1,'io'),(1040,0,'io'),
      (1199,0,'io'),(1200,1,'cut')]
B=[(0,.88,'lin'),(239,.88,'io'),(240,0,'cut'),(330,0,'io'),(738,.72,'lin'),(919,.72,'io'),(920,0,'cut'),(960,0,'io'),(1022,.55,'lin'),(1055,.55,'io'),(1056,0,'cut'),
   (1199,0,'io'),(1200,.6,'cut'),(1440,.88,'lin')]
KNOB=[(0,-20,'io'),(596,-20,'io'),(630,60,'back'),(1199,60,'io'),(1200,-20,'cut')]
XR=[(0,0,'io'),(76,0,'io'),(92,1,'io'),(239,1,'io'),(240,0,'cut'),(244,0,'io'),(258,1,'io'),(744,1,'io'),(745,0,'cut'),(919,0,'io'),
    (920,1,'cut'),(1040,1,'io'),(1056,1,'io'),(1199,1,'io'),(1200,0,'cut')]
PLUG=[(0,0,'io'),(1055,0,'io'),(1056,1,'cut'),(1199,1,'io'),(1200,0,'cut')]
SPARK=[(0,0,'io'),(290,0,'io'),(293,1,'out'),(312,0,'io'),(940,0,'io'),(943,1,'out'),(960,0,'io')]
# toast launch: up out of frame, then down onto the host's head
def launch(f):
    if 743<=f<800:
        u=(f-743)/57; return 0,-1300*(1-(1-u)**2.2),720*(f-743)/135
    if 800<=f<878:
        u=(f-800)/78; e=u*u
        return 400*u, -1300+(1300-216)*e, 720*(f-743)/135
    return 0,0,0
def T(f):
    tx,ty,tr=launch(f)
    if 870<=f<878: tr=tr+( -8-tr)*0  # spin ends near the landing angle
    return {'c':kv(C,f),'mag':kv(MAG,f),'heat':kv(HEAT,f),'tm':kv(TM,f),'ring':kv(RING,f),'b':kv(B,f),'knob':kv(KNOB,f),
            'xr':kv(XR,f),'plug':kv(PLUG,f),'spark':kv(SPARK,f),'tx':tx,'ty':ty,'tr':tr,'head':1 if 878<=f<920 else 0,
            'g':'lever' if (244<=f<300 or 1060<=f<1176) else 'none'}

# ---------- camera (cx, cy, w) ----------
WIDE=(420,380,820); XFULL=(330,320,600); MED=(430,340,680)
CAM=[(0,WIDE,'io'),(18,(370,360,700),'io'),(24,(360,320,640),'out'),(72,(360,330,660),'io'),
     (76,XFULL,'cut'),(150,(340,320,560),'io'),(232,(410,395,320),'io'),
     (240,MED,'cut'),(300,(420,330,640),'io'),(306,(420,300,340),'cut'),(366,(420,320,330),'io'),
     (372,(410,395,290),'cut'),(440,(410,400,280),'io'),(444,(320,320,520),'cut'),(506,(320,320,500),'io'),
     (510,(140,300,560),'cut'),(584,(150,300,540),'io'),(588,(240,330,560),'cut'),(662,(230,320,540),'io'),
     (666,(410,400,290),'cut'),(728,(410,400,280),'io'),(740,(380,330,720),'out'),
     (748,(380,300,720),'io'),(790,(390,-760,760),'out'),(800,(390,-800,760),'io'),(878,(510,60,760),'in'),(884,(510,250,760),'out'),(918,(510,300,760),'io'),
     (920,XFULL,'cut'),(1052,(330,320,620),'io'),
     (1056,(320,330,1000),'cut'),(1196,(330,330,980),'io'),
     (1200,WIDE,'cut'),(1284,(420,360,780),'io'),(1340,(420,360,780),'io'),(1420,WIDE,'io'),(1440,WIDE,'io')]

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
R0=pose('idle',expression='curious',head=-6)
CK=[(0,R0,'io'),(18,pose('idle',expression='curious',head=-8),'io'),(26,pose('recoil',expression='surprised'),'back'),(60,pose('recoil',expression='surprised'),'io'),(72,pose('idle',expression='amazed'),'io'),
    (76,pose('think'),'cut'),(239,pose('think',expression='curious'),'io'),
    (240,reach(-4,expression='explaining'),'cut'),(250,reach(-6,expression='explaining'),'io'),(290,reach(-10,expression='curious'),'io'),(300,reach(-10,expression='curious'),'io'),
    (316,dict(pm,expression='explaining'),'io'),(360,dict(pm,expression='explaining',head=4),'io'),(372,pose('think'),'cut'),(500,pose('think',expression='curious'),'io'),(520,pose('think'),'io'),(700,pose('think',expression='curious'),'io'),
    (738,pose('idle',expression='curious'),'io'),(746,pose('recoil',expression='surprised',head=-14),'back'),(800,pose('idle',expression='amazed',head=-16),'io'),
    (870,pose('idle',expression='worried',head=-18),'io'),(878,pose('idle',expression='surprised',head=0),'cut'),(888,pose('facepalm'),'back'),(906,pose('facepalm'),'io'),(919,dict(pm,expression='laughing'),'io'),
    (920,pose('think'),'cut'),(1055,pose('think'),'io'),
    (1056,pose('idle',expression='curious'),'cut'),(1062,reach(-4,expression='curious'),'io'),(1080,reach(-8,expression='explaining'),'io'),(1090,reach(-2,expression='surprised'),'out'),
    (1121,reach(-8,expression='skeptical'),'in'),(1131,reach(-2,expression='frustrated'),'out'),(1158,reach(-10,expression='frustrated'),'in'),(1167,reach(0,expression='frustrated'),'out'),
    (1176,dict(pm,expression='frustrated'),'io'),(1199,dict(pm,expression='frustrated'),'io'),
    (1200,pose('proud'),'cut'),(1270,pose('proud',head=-4),'io'),(1290,dict(pm,expression='explaining'),'io'),(1340,dict(pm,expression='explaining',head=3),'io'),
    (1376,R0,'io'),(1440,R0,'io')]
BL=[(50,3),(200,2),(420,3),(640,2),(960,2),(1240,3),(1330,2)]
character=Rig(CK,BL)

HL=[(100,150,'magnet','MAGNET',-300,0),(110,150,'chip','TIMER',-160,0),
    (250,276,'lever','LEVER',-200,0),(276,302,'rack','RACK',-260,0),
    (316,366,'spring','SPRING',60,0),(380,408,'plate','METAL PLATE',-330,0),(408,444,'magnet','ELECTROMAGNET',-330,0),
    (452,506,'wires','HOT WIRES',-120,0),(520,584,'chip','TIMER CHIP',-60,0),(596,662,'knob','DARKNESS',-200,0),
    (680,728,'magnet','POWER OFF',-260,0),(1100,1160,'magnet','NO POWER',-260,0),(1060,1100,'plug','UNPLUGGED',-120,0),(176,236,'magnet','MAGNET',-260,0)]
CAPS=[(0,72,"How does your toaster know when to pop?"),
 (72,150,"Plot twist: it's not watching. It's counting."),
 (150,240,"And one tiny magnet decides when your toast jumps."),
 (240,306,"Push the lever. The rack drops,"),
 (306,372,"and stretches a spring that wants it back up."),
 (372,444,"At the bottom, a metal plate meets an electromagnet."),
 (444,510,"Click. It holds. The wires start glowing."),
 (510,588,"Meanwhile, a little timer chip counts down."),
 (588,666,"Your darkness knob just changes how long it counts."),
 (666,744,"Time's up: the chip cuts power to the magnet."),
 (744,800,"The spring wins. Toast launches."),
 (800,860,"Lowkey a little too much spring."),
 (860,920,"Breakfast is served."),
 (920,1056,"Down, hold, heat, count, release. Every single time."),
 (1056,1130,"Here's the kicker: unplug a magnet toaster,"),
 (1130,1200,"and the lever won't stay down."),
 (1200,1284,"So your toaster is a timer with a magnet."),
 (1284,1368,"And a spring with big plans."),
 (1368,1440,"And now you know...")]
SHOTS=[(0,72,'S01 HOOK','WS POP'),(72,240,'S02 TURN','XRAY > MAGNET'),(240,744,'S03 MECHANISM + REVEALS','MS, INSERTS'),(744,920,'S04 GAG','WHIP UP > DOWN'),
       (920,1056,'S05 DEMO','XRAY 2X'),(1056,1200,'S06 BONUS','WS UNPLUGGED'),(1200,1368,'S07 TAKEAWAY','WS = S01'),(1368,1440,'S08 LOOP OUT','WS')]
SAY={0:"How does your toaster know... when to pop?",18:"And now you know..."}
SPD={18:0.85}
GROUPS={}
VO_DELAY={0:0.02}
SFX=[(20,'lib_toaster_pop'),(22,'lib_spring_twang'),(76,'lib_whoosh_fast'),(240,'lib_whoosh_fast'),(286,'lib_mech_clunk'),(292,'lib_electric_zap'),
     (306,'lib_whoosh_fast'),(372,'lib_whoosh_fast'),(444,'lib_mech_click'),(510,'lib_whoosh_fast'),(600,'lib_gear_ratchet'),(666,'lib_whoosh_fast'),
     (734,'lib_mech_click'),(742,'lib_toaster_pop'),(744,'lib_spring_twang'),(750,'lib_slide_whistle_up'),(798,'lib_mech_clunk'),(806,'lib_slide_whistle_down'),(878,'lib_boing'),(884,'lib_rimshot'),
     (920,'lib_whoosh_fast'),(938,'lib_mech_clunk'),(1022,'lib_toaster_pop'),(1056,'lib_whoosh_fast'),(1086,'lib_spring_twang'),(1127,'lib_spring_twang'),(1163,'lib_boing'),
     (1200,'lib_whoosh_fast'),(1290,'lib_ding')]
def frame(f):
    pop=None
    if 22<=f<66: pop={'x':160,'y':-60,'s':min(1,(f-22)/4+.3),'text':'POP!'}
    elif 752<=f<800: pop={'x':150,'y':-560-(f-752)*4,'s':min(1,(f-752)/4+.3),'text':'WHOOSH!'}
    elif 878<=f<918: pop={'x':160,'y':-120,'s':min(1,(f-878)/4+.3)*(1+0.05*math.sin(f*1.2)),'text':'BONK!'}
    elif 1163<=f<1199: pop={'x':-60,'y':-40,'s':min(1,(f-1163)/4+.3),'text':'BOING!'}
    badge=None
    if 920<=f<1056: badge='FAST'
    elif kv(XR,f)>0.5: badge='X-RAY'
    return {'T':T(f),'cam':dict(zip(('cx','cy','w'),kv(CAM,f))),
            'hl':[{'part':h[2],'label':h[3],'dx':h[4],'dy':h[5]} for h in HL if h[0]<=f<h[1]],
            'cap':(at(CAPS,f) or (0,0,''))[2],'badge':badge,'pop':pop}
if __name__=='__main__':
    cmd=sys.argv[1]
    if cmd=='render': render(sys.modules[__name__],sys.argv[2])
    elif cmd=='frames': render(sys.modules[__name__],sys.argv[3],[int(x) for x in sys.argv[2].split(',')])
