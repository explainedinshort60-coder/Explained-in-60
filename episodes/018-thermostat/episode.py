"""Episode 018: How does a thermostat know when to turn on? (a coil of brass and steel stuck together; brass shrinks more
in the cold, so as the room cools the coil curls tighter until its tip touches a metal contact, which starts the furnace;
as the room warms the coil loosens, the tip pulls away and the furnace shuts off; the dial moves the contact; it only
feels the air next to it, so sun or a lamp fools it warm and a draft fools it cold). Sources: IPM A Moment of Science, Lennox.
Run: python3 episode.py render OUT_DIR   |   python3 episode.py frames 0,100,200 OUT_DIR"""
import os, sys, math
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'engine'))
from lib import *
HERE=os.path.dirname(os.path.abspath(__file__))
props_js=os.path.join(HERE,'props.js')
N=1440
HX,HY=720,150   # host head (world) for sweat and shiver icons
def win(f,a,b,ri=6,ro=6):
    if f<a or f>=b: return 0.0
    return min(1,(f-a)/ri if ri else 1,(b-f)/ro if ro else 1)
def lin(f,a,b,v0=0,v1=1):
    u=min(1,max(0,(f-a)/(b-a))); return v0+(v1-v0)*u
ON=dict(c=0.62,spark=1,fl=1,amp=1)
def T(f):
    t=dict(c=0.3,dial=0,spark=0,fl=0,amp=0,cold=0,sun=0,wind=0,strip=0,bend=0,sweat=0,shiver=0,hx=HX,hy=HY)
    if f<72 or f>=1200:                       # hook and takeaway: tip on the contact, spark, furnace roaring
        t.update(ON)
    elif f<150:                               # the coil (room warm, tip away)
        t.update(c=0.3)
    elif f<228:                               # strip card: brass shrinks more, it curls toward the brass
        t.update(strip=win(f,150,228,6,4),bend=lin(f,164,214))
    elif f<300:                               # room cools: cold wisps, coil starts to curl
        t.update(cold=win(f,228,300,8,4),c=lin(f,236,298,0.3,0.42))
    elif f<384:                               # curls tighter and tighter
        t.update(cold=0.6,c=lin(f,300,380,0.42,0.57))
    elif f<468:                               # tip reaches the contact
        t.update(cold=0.4,c=lin(f,384,440,0.57,0.62),spark=lin(f,440,446))
    elif f<564:                               # click: circuit closes, current runs, furnace fires
        t.update(c=0.62,spark=1,amp=lin(f,474,486),fl=lin(f,510,522))
    elif f<660:                               # gag: ear on the thermostat, the click goes off in his ear
        t.update(c=lin(f,564,598,0.55,0.62),spark=win(f,598,640,1,10),fl=lin(f,604,614),amp=lin(f,598,604))
    elif f<744:                               # room warms, coil loosens
        t.update(c=0.62,spark=0.6,fl=1,amp=1)
    elif f<840:                               # tip pulls away, heat shuts off
        c=lin(f,746,800,0.62,0.4); t.update(c=c,spark=0.6 if c>=0.6 else 0,amp=1 if c>=0.6 else 0,fl=1 if f<770 else lin(f,770,790,1,0))
    elif f<924:                               # the dial slides the contact
        t.update(c=0.4,dial=kv([(840,0,'io'),(858,0,'io'),(880,-26,'io'),(902,18,'io'),(922,0,'io')],f))
    elif f<1008:                              # it only feels the air next to it
        t.update(c=0.4)
    elif f<1104:                              # sun on it: thinks it's warm, heat stays off, host shivers
        t.update(c=lin(f,1008,1040,0.4,0.2),sun=win(f,1008,1104,10,6),shiver=win(f,1020,1104,6,4))
    else:                                     # cold draft: heat runs, host sweats
        c=lin(f,1104,1132,0.4,0.62); t.update(c=c,wind=win(f,1104,1200,8,6),spark=1 if c>=0.6 else 0,amp=1 if c>=0.6 else 0,
                                               fl=lin(f,1134,1144),sweat=win(f,1146,1200,6,4))
    return t
WIDE=(460,310,860); CLOSE=(400,232,330); CARD=(405,232,330); DOWN=(287,505,556); EAR=(520,262,720)
CAM=[(0,WIDE,'io'),(71,(460,310,840),'io'),
     (72,CLOSE,'cut'),(148,(405,232,320),'io'),
     (150,CARD,'cut'),(226,(405,232,320),'io'),
     (228,WIDE,'cut'),(298,(460,310,830),'io'),
     (300,CLOSE,'cut'),(382,(410,232,315),'io'),
     (384,(410,232,315),'cut'),(466,(425,215,290),'io'),
     (468,CLOSE,'cut'),(486,CLOSE,'io'),(530,DOWN,'io'),(562,DOWN,'io'),
     (564,EAR,'cut'),(658,(520,262,690),'io'),
     (660,DOWN,'cut'),(742,(287,505,550),'io'),
     (744,CLOSE,'cut'),(838,(405,232,320),'io'),
     (840,CLOSE,'cut'),(922,(405,232,320),'io'),
     (924,WIDE,'cut'),(1006,(460,310,830),'io'),
     (1008,WIDE,'cut'),(1102,(460,310,840),'io'),
     (1104,WIDE,'cut'),(1198,(460,310,840),'io'),
     (1200,(460,310,840),'cut'),(1290,(460,310,830),'io'),(1366,WIDE,'io'),(1440,WIDE,'io')]
def free(name='idle',**kw):
    p=pose(name); p.update(kw); return p
POINT=free(expression='amazed',la=78,le=-28,lhand='point',head=-10)
POINT2=free(expression='laughing',la=84,le=-34,lhand='point',head=-6)
IDLE=lambda e,h=-8: free(expression=e,head=h)
SHIV=lambda k: free(expression='worried',la=24+3*k,le=-60,ra=-24-3*k,re=60,head=-4+4*k)
CK=[(0,POINT,'io'),(36,POINT2,'io'),(71,POINT,'io'),
    (72,IDLE('explaining'),'cut'),(226,IDLE('curious'),'io'),
    (228,SHIV(0),'cut'),(298,SHIV(1),'io'),
    (300,IDLE('curious'),'cut'),(562,IDLE('amazed',-12),'io'),
    (564,free(expression='curious',lean=-12,head=-24,la=40,le=-30),'cut'),(596,free(expression='curious',lean=-16,head=-28,la=40,le=-30),'io'),
    (602,free('recoil'),'out'),(624,free('recoil'),'io'),(640,free(expression='laughing',la=92,le=-8,lhand='point',head=-8),'io'),(658,free(expression='laughing',la=92,le=-8,lhand='point',head=-8),'io'),
    (660,IDLE('explaining'),'cut'),(922,IDLE('amazed',-12),'io'),
    (924,free('present',expression='explaining'),'cut'),(1006,free('present',expression='explaining'),'io'),
    (1008,SHIV(0),'cut')]+[(1012+8*i,SHIV(i%2),'io') for i in range(11)]+[
    (1104,free(expression='frustrated',head=-6),'cut'),(1150,free(expression='frustrated',head=-6),'io'),(1166,free('facepalm'),'io'),(1198,free('facepalm'),'io'),
    (1200,POINT,'cut'),(1260,POINT2,'io'),(1320,POINT,'io'),(1380,POINT2,'io'),(1440,POINT,'io')]
CK.insert(next(i for i,k in enumerate(CK) if k[0]==228)+1,(260,SHIV(1),'io'))
CK.sort(key=lambda k:k[0])
BL=[(50,3),(200,2),(460,2),(760,2),(1000,3),(1150,2),(1330,2)]
class CutCharacter(Character):
    """Overlap offsets never reach back across a cut."""
    CUTS=sorted(k[0] for k in CK if k[2]=='cut')
    def state(self,f,grip): self._f=f; return super().state(f,grip)
    def samp(self,g):
        c=max([k for k in self.CUTS if k<=getattr(self,'_f',g)] or [0]); return super().samp(max(g,c))
character=CutCharacter(CK,BL)

HL=[(80,148,'coil','COIL',-60,0),
    (160,226,'brass','BRASS',-20,0),(186,226,'steel','STEEL',-330,0),
    (310,382,'tip','TIP',-40,0),
    (400,466,'contact','CONTACT',-60,0),
    (760,838,'tip','TIP',-40,0),
    (850,922,'dial','DIAL',-40,0),
    (934,1006,'thermo','FEELS THIS SPOT',-60,0)]
CAPS=[(0,72,"This thermostat turns your heat on by bending."),
 (72,150,"Inside: a coil of brass and steel, stuck together."),
 (150,228,"Here's the kicker: brass shrinks more in the cold."),
 (228,300,"So when your room cools down,"),
 (300,384,"the coil curls tighter and tighter,"),
 (384,468,"until its tip touches a metal contact."),
 (468,564,"Click. That closes a circuit, and the furnace fires up."),
 (564,660,"Yep. That tiny click is the whole brain."),
 (660,744,"As the room warms, the coil loosens,"),
 (744,840,"the tip pulls away, and the heat shuts off."),
 (840,924,"Turning the dial just slides the contact closer or farther."),
 (924,1008,"Bonus: it only feels the air right next to it."),
 (1008,1104,"Sun or a lamp on it? It thinks the house is warm."),
 (1104,1200,"A cold draft? It runs the heat for nothing."),
 (1200,1290,"So one curling metal strip runs your heat."),
 (1290,1368,"Lowkey genius, right?"),
 (1368,1440,"And now you know...")]
SAY={}
SPD={}
GROUPS={}
VO_DELAY={0:0.02}
SFX=[(0,'lib_whoosh_deep'),(30,'lib_electric_zap'),(72,'lib_whoosh_fast'),(80,'lib_pop_bubble'),(150,'lib_whoosh_fast'),(164,'lib_wind_cold'),(186,'lib_pop_bubble'),
     (228,'lib_wind_cold'),(300,'lib_whoosh_fast'),(310,'lib_gear_ratchet'),(384,'lib_whoosh_fast'),(400,'lib_pop_bubble'),(440,'lib_mech_click'),
     (468,'lib_mech_click'),(476,'lib_electric_zap'),(512,'lib_whoosh_deep'),
     (564,'lib_whoosh_fast'),(598,'lib_mech_click'),(600,'lib_record_scratch'),(606,'lib_boing'),(610,'lib_whoosh_deep'),
     (660,'lib_whoosh_fast'),(744,'lib_whoosh_fast'),(752,'lib_mech_click'),(770,'lib_slide_whistle_down'),
     (840,'lib_whoosh_fast'),(858,'lib_gear_ratchet'),(902,'lib_gear_ratchet'),(924,'lib_whoosh_fast'),(934,'lib_ding'),
     (1008,'lib_whoosh_fast'),(1030,'lib_sad_trombone'),(1104,'lib_wind_cold'),(1132,'lib_mech_click'),(1136,'lib_whoosh_deep'),
     (1200,'lib_whoosh_deep'),(1260,'lib_electric_zap'),(1332,'lib_whoosh_fast'),(1404,'lib_whoosh_fast')]
def frame(f):
    pop=None
    if f<40 or f>=1412: pop={'x':240,'y':-150,'s':1,'text':'CLICK!'}
    elif 600<=f<640: pop={'x':260,'y':-40,'s':min(1,(f-600)/4+.3),'text':'CLICK!'}
    elif 440<=f<468: pop={'x':260,'y':40,'s':min(1,(f-440)/4+.3),'text':'TINK.'}
    elif 1034<=f<1104: pop={'x':400,'y':-170,'s':min(1,(f-1034)/4+.3),'text':'BRRR.'}
    elif 1150<=f<1200: pop={'x':370,'y':-170,'s':min(1,(f-1150)/4+.3),'text':'TOO HOT.'}
    badge=None
    if 240<=f<300: badge='66°F'
    elif 1016<=f<1104: badge='80°F?'
    return {'T':T(f),'cam':dict(zip(('cx','cy','w'),kv(CAM,f))),
            'hl':[{'part':h[2],'label':h[3],'dx':h[4],'dy':h[5]} for h in HL if h[0]<=f<h[1]],
            'cap':(at(CAPS,f) or (0,0,''))[2],'badge':badge,'pop':pop}
if __name__=='__main__':
    cmd=sys.argv[1]
    if cmd=='render': render(sys.modules[__name__],sys.argv[2])
    elif cmd=='frames': render(sys.modules[__name__],sys.argv[3],[int(x) for x in sys.argv[2].split(',')])
