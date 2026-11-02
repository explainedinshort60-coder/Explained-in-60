"""Episode 004: Does your fridge light really turn off? (door switch: plunger, spring, metal bridge, two contacts).
Run: python3 episode.py render OUT_DIR   |   python3 episode.py frames 0,100,200 OUT_DIR"""
import os, sys, math
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'engine'))
from lib import *
import lib
HERE=os.path.dirname(os.path.abspath(__file__))
props_js=os.path.join(HERE,'props.js')
N=1440
A0=0.5  # door ajar in the opening (and closing) composition
# ---------- door: 0 shut, 1 open ----------
AK=[(0,A0,'io'),(30,0,'in'),(80,0,'io'),(112,1,'io'),(370,1,'io'),(440,.3,'io'),(540,0,'lin'),(668,0,'io'),(700,1,'io'),
    (860,1,'io'),(888,0,'in'),(900,0,'io'),(925,1,'io'),(950,1,'io'),(976,0,'in'),(1040,0,'io'),(1068,1,'io'),(1110,1,'io'),(1136,0,'in'),
    (1199,0,'io'),(1200,A0,'cut'),(1440,A0,'io')]
XR=[(0,0,'io'),(34,0,'io'),(46,1,'io'),(78,1,'io'),(86,0,'io'),(600,0,'io'),(601,1,'cut'),(668,1,'io'),(690,0,'io'),
    (950,0,'io'),(962,1,'io'),(1199,1,'io'),(1200,0,'cut')]
FAULT=[(0,0,'io'),(1136,0,'io'),(1138,1,'io'),(1199,1,'io'),(1200,0,'cut')]
def card(f): return 1.0 if (150<=f<600 or 840<=f<950) else 0.0
# finger press on the switch (gag): reach, press, then disco taps
HP=[(0,0,'io'),(714,0,'io'),(718,1,'out'),(730,1,'io')]
fr=734
while fr<790: HP+=[(fr,0,'out'),(fr+2,0,'io'),(fr+3,1,'out'),(fr+5,1,'io')]; fr+=6
HP+=[(792,1,'io'),(796,0,'out'),(1440,0,'io')]
def press_door(a):
    fy=200-370*math.tan(math.radians(a*45)); return max(0,min(1,(fy-146)/50))
# fan: spins while the door switch is pressed (door shut), eased; total spin rounded to a multiple of 120 deg so the loop matches
SPIN=[];sp=0
for f in range(N):
    tgt=1.0 if press_door(kv(AK,f))>0.62 else 0.0; sp+= (tgt-sp)*0.12; SPIN.append(sp)
tot=sum(SPIN)*22; scale=(round(tot/120)*120)/tot if tot else 1
FAN=[0]*N;acc=0
for f in range(N): FAN[f]=(acc%360); acc+=SPIN[f]*22*scale
def T(f):
    hop,ph=0,0
    if 734<=f<792: u=(f-734)/6; hop=abs(math.sin(u*math.pi))*min(1,(792-f)/6); ph=u*math.pi
    return {'a':kv(AK,f),'xr':kv(XR,f),'fault':kv(FAULT,f),'hp':kv(HP,f),'card':card(f),'fan':FAN[f],'hop':hop,'hopPh':ph,
            'g':'button' if 690<=f<800 else 'handle'}

# ---------- camera (cx, cy, w) ----------
WIDE=(540,430,720); CARD=(1650,390,580); MED=(560,350,580); XRAY=(470,400,620)
CAM=[(0,WIDE,'io'),(30,WIDE,'io'),(46,XRAY,'out'),(72,XRAY,'io'),(96,WIDE,'io'),(112,WIDE,'io'),(149,(571,340,140),'in'),
     (150,(1760,300,360),'cut'),(176,CARD,'out'),(196,(1700,370,520),'io'),(236,(1730,340,500),'io'),(300,(1740,320,470),'io'),
     (370,CARD,'io'),(440,(1700,300,540),'io'),(540,(1770,270,430),'io'),(599,CARD,'io'),
     (600,XRAY,'cut'),(660,(480,400,650),'io'),(690,MED,'io'),(792,MED,'io'),(839,(560,370,640),'io'),
     (840,CARD,'cut'),(900,(1690,360,540),'io'),(949,CARD,'io'),
     (950,(450,400,600),'cut'),(1040,(470,320,500),'io'),(1110,(470,320,500),'io'),(1140,(500,400,640),'io'),(1199,(500,400,640),'io'),
     (1200,WIDE,'cut'),(1284,(535,420,670),'io'),(1340,(535,420,670),'io'),(1420,WIDE,'io'),(1440,WIDE,'io')]

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

def reach(lean=-4,**kw):
    p=pose('reach',**kw); p['lean']=lean; p['lt']=-lean+3; p['rt']=-lean-6; p['ra']=-24; p['re']=12; return p
def tap(lean=0,**kw):
    p=reach(lean,lhand='point',**kw); return p
pm=dict(mirror(pose('present')))
R0=reach(-12,expression='curious')
CK=[(0,R0,'io'),(30,reach(-6,expression='explaining'),'in'),(44,reach(-2,expression='skeptical',head=-8),'io'),(72,reach(-2,expression='skeptical',head=-6),'io'),
    (84,reach(-4,expression='curious'),'io'),(98,dict(pm,expression='amazed'),'io'),(140,dict(pm,expression='explaining'),'io'),
    (150,pose('think'),'cut'),(600,pose('think'),'io'),(612,pose('think',expression='skeptical',head=8),'io'),(658,pose('think',expression='skeptical',head=8),'io'),
    (668,reach(-4,expression='curious'),'io'),(682,dict(pm,expression='explaining'),'io'),(692,dict(pm,expression='explaining'),'io'),
    (712,tap(-2,expression='skeptical'),'io'),(730,tap(-3,expression='surprised'),'io')]
fr=734;sgn=1
while fr<790: CK.append((fr+3,tap(-3+3*sgn,expression='laughing',head=8*sgn),'io')); fr+=6; sgn=-sgn
CK+=[(792,tap(0,expression='laughing'),'io'),(800,dict(pm,expression='laughing'),'out'),(812,pose('tada'),'back'),(839,pose('tada'),'io'),
    (840,pose('think'),'cut'),(949,pose('think'),'io'),(950,dict(pm,expression='explaining'),'cut'),(1030,dict(pm,expression='explaining',head=4),'io'),
    (1046,pose('fun-fact'),'back'),(1104,pose('fun-fact',head=-4),'io'),(1118,dict(pm,expression='worried'),'io'),(1140,pose('facepalm'),'back'),(1199,pose('facepalm'),'io'),
    (1200,pose('proud'),'cut'),(1284,pose('proud',head=-4),'io'),(1300,dict(pm,expression='explaining'),'io'),(1340,dict(pm,expression='explaining',head=3),'io'),
    (1372,R0,'io'),(1440,R0,'io')]
BL=[(60,3),(200,2),(380,3),(520,2),(640,2),(820,3),(1000,2),(1150,2),(1250,3),(1330,2)]
character=Rig(CK,BL)

HL=[(104,150,'button','DOOR SWITCH',-420,0),
    (160,196,'plunger','PLUNGER',-360,0),(196,236,'spring','SPRING',-340,0),(236,268,'bridge','BRIDGE',40,0),(268,300,'contacts','CONTACTS',-360,0),
    (300,336,'contacts','CLOSED',-300,0),(336,370,'cbulb','LIGHT ON',-60,0),
    (452,520,'plunger','PUSHED IN',-380,0),(520,560,'gap','GAP',-260,0),(560,600,'cbulb','OFF',-40,0),
    (612,668,'bulb','OFF',-200,0),
    (868,900,'plunger','IN: OFF',-360,0),(925,950,'plunger','OUT: ON',-360,0),
    (962,1040,'fan','FAN',60,0),(1072,1110,'fan','FAN OFF',40,0),(1150,1200,'button','CHECK ME',-380,0)]
CAPS=[(0,72,"Does your fridge light really turn off?"),(72,150,"You've shut it a thousand times. Watch this button."),
 (150,196,"Inside: a plunger,"),(196,236,"a spring behind it,"),(236,300,"and a metal bridge right under two contacts."),
 (300,370,"Bridge on the contacts? Light on."),(370,440,"Now shut the door."),
 (440,520,"It shoves the plunger in and squeezes the spring,"),(520,600,"the bridge drops away. Circuit broken. Lights out."),
 (600,668,"So yes. It's dark in there."),(668,724,"Don't trust it? Press the button yourself."),
 (724,800,"Boom. Lowkey a tiny fridge rave."),(800,860,"Okay. Full speed now."),
 (860,950,"Shut: button in, light off. Open: button out, light on."),
 (950,1040,"Here's the kicker. On some fridges, that same button"),(1040,1110,"also shuts the fan off while the door's open."),
 (1110,1200,"Light stays on with the door shut? Check that button first."),
 (1200,1284,"So your fridge door? It's the light switch."),(1284,1368,"Straight up, it just pushes a button."),(1368,1440,"And now you know...")]

SHOTS=[(0,72,'S01 HOOK','WS > XRAY'),(72,150,'S02 TURN','WS > DIVE'),(150,600,'S03 MECHANISM + REVEALS','TOP VIEW CARD'),(600,668,'S04 PROOF','XRAY'),
       (668,840,'S05 GAG','MS'),(840,950,'S06 DEMO','CARD'),(950,1200,'S07 BONUS','MS XRAY'),(1200,1368,'S08 TAKEAWAY','WS = S01'),(1368,1440,'S09 LOOP OUT','WS > S01')]

SAY={0:"Does your fridge light... really turn off?",4:"And a metal bridge, right under two contacts.",19:"And now you know..."}
SPD={19:0.85}
GROUPS={}
VO_DELAY={0:0.02}
SFX=[(26,'lib_door_latch'),(80,'lib_fridge_door'),(136,'lib_whoosh_fast'),(330,'lib_light_switch'),(512,'lib_light_switch'),(536,'lib_door_latch'),
     (600,'lib_whoosh_fast'),(668,'lib_fridge_door'),(716,'lib_button_press'),(734,'lib_funk')]
fr=734
while fr<790: SFX.append((fr+3,'lib_mech_click')); fr+=6
SFX+=[(792,'lib_record_scratch'),(840,'lib_whoosh_fast'),(884,'lib_door_latch'),(900,'lib_fridge_door'),(950,'lib_whoosh_fast'),(972,'lib_door_latch'),
      (1040,'lib_fridge_door'),(1132,'lib_door_latch'),(1140,'lib_glitch'),(1178,'lib_ding'),(1200,'lib_whoosh_fast')]
def frame(f):
    pop=None
    if 40<=f<72: pop={'x':250,'y':40,'s':min(1,(f-40)/4+.3),'text':'OFF?'}
    elif 738<=f<792: pop={'x':243,'y':12,'s':min(1,(f-738)/4+.3)*(1+0.06*math.sin(f*1.3)),'text':'DISCO!'}
    elif 1140<=f<1192: pop={'x':133,'y':471,'s':min(1,(f-1140)/4+.3),'text':'STUCK ON?'}
    return {'T':T(f),'cam':dict(zip(('cx','cy','w'),kv(CAM,f))),
            'hl':[{'part':h[2],'label':h[3],'dx':h[4],'dy':h[5]} for h in HL if h[0]<=f<h[1]],
            'cap':(at(CAPS,f) or (0,0,''))[2],'badge':'SLOW' if 440<=f<540 else ('X-RAY' if card(f) else None),'pop':pop}
if __name__=='__main__':
    cmd=sys.argv[1]
    if cmd=='render': render(sys.modules[__name__],sys.argv[2])
    elif cmd=='frames': render(sys.modules[__name__],sys.argv[3],[int(x) for x in sys.argv[2].split(',')])
