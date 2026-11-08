"""Episode 020: How do hand warmers get hot? (iron powder inside a porous pouch rusts when air gets in; rusting gives off
heat; salt speeds the rusting up; charcoal spreads the heat; a damp filler holds the water; up to about 135 F for 7 to
24 hours; shaking lets more air in so it heats faster; sealed in an airtight bag it stops, reopened it starts again;
when the iron has all turned to rust it is done). Sources: Field & Stream, Duke CHEM 110 (LibreTexts), KTTC (MSU Mankato).
Run: python3 episode.py render OUT_DIR   |   python3 episode.py frames 0,100,200 OUT_DIR"""
import os, sys, math
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'engine'))
from lib import *
HERE=os.path.dirname(os.path.abspath(__file__))
props_js=os.path.join(HERE,'props.js')
N=1440
def win(f,a,b,ri=6,ro=6):
    if f<a or f>=b: return 0.0
    return min(1,(f-a)/ri if ri else 1,(b-f)/ro if ro else 1)
def lin(f,a,b,v0=0,v1=1):
    u=min(1,max(0,(f-a)/(b-a))); return v0+(v1-v0)*u
HOT=dict(pk=1,heat=1,rust=0.3)
def T(f):
    t=dict(pk=1,wrap=0,tear=0,xr=0,rust=0.3,air=0,heat=0,shake=0,zb=0,nail=0,cold=0,spread=0,ox=0,oy=0)
    if f<72 or f>=1200:                       # hook and takeaway: open packet, glowing hot
        t.update(HOT)
    elif f<228:                               # x-ray: iron powder, then salt, charcoal, damp filler
        t.update(xr=1,rust=0,heat=0)
    elif f<300:                               # sealed in its wrapper, no air, cold
        t.update(wrap=1,rust=0,cold=0.6)
    elif f<340:                               # tear it open
        t.update(wrap=1,tear=lin(f,304,334),rust=0,cold=lin(f,304,334,0.6,0))
    elif f<384:                               # x-ray: air slips in through the pores
        t.update(xr=1,rust=0,air=lin(f,340,350))
    elif f<468:                               # oxygen grabs the iron: grains turn to rust
        t.update(xr=1,air=1,rust=lin(f,388,462,0,0.45))
    elif f<564:                               # heat climbs
        t.update(rust=0.45,heat=lin(f,472,540,0.1,1))
    elif f<660:                               # gag: warming hands over a rusty old nail
        t.update(pk=0,nail=1)
    elif f<744:                               # x-ray: charcoal spreads the heat
        t.update(xr=1,air=1,rust=0.5,spread=lin(f,664,676))
    elif f<840:                               # toasty, 135 F, 7 to 24 hours
        t.update(heat=1,rust=0.5)
    elif f<924:                               # shake it: more air, hotter
        k=win(f,846,912,6,8); t.update(heat=1+0.35*lin(f,852,890),rust=0.55,shake=k,ox=k*16*math.sin(f*1.9),oy=k*10*math.cos(f*2.3))
    elif f<1008:                              # zip bag: the heat stops
        t.update(zb=lin(f,926,944),heat=lin(f,950,1000,1,0),rust=0.6)
    elif f<1104:                              # open the bag later: it fires back up
        t.update(zb=lin(f,1030,1046,1,0),heat=lin(f,1046,1090,0,1),rust=0.6,cold=0)
    elif f<1150:                              # all the iron is rust: done
        t.update(xr=1,rust=1,heat=0)
    else:                                     # cold, used up packet
        t.update(rust=1,heat=0,cold=0.5)
    return t
WIDE=(460,310,860); CLOSE=(385,290,372); GAG=(580,380,600)
CAM=[(0,WIDE,'io'),(71,(460,310,840),'io'),
     (72,CLOSE,'cut'),(226,(385,290,360),'io'),
     (228,WIDE,'cut'),(338,(460,310,830),'io'),
     (340,CLOSE,'cut'),(466,(385,290,360),'io'),
     (468,WIDE,'cut'),(562,(460,310,830),'io'),
     (564,GAG,'cut'),(658,(580,380,580),'io'),
     (660,CLOSE,'cut'),(742,(385,290,360),'io'),
     (744,WIDE,'cut'),(838,(460,310,840),'io'),
     (840,WIDE,'cut'),(922,(460,310,830),'io'),
     (924,WIDE,'cut'),(1102,(460,310,830),'io'),
     (1104,CLOSE,'cut'),(1148,(385,290,360),'io'),
     (1150,WIDE,'cut'),(1198,(460,310,840),'io'),
     (1200,(460,310,840),'cut'),(1290,(460,310,830),'io'),(1366,WIDE,'io'),(1440,WIDE,'io')]
def free(name='idle',**kw):
    p=pose(name); p.update(kw); return p
HOLD=lambda e='amazed',h=-10,**kw: pose('reach',expression=e,head=h,**kw)
IDLE=lambda e,h=-8: free(expression=e,head=h)
WARM=lambda k: free(expression='curious',lean=-12,head=-16,la=30+4*k,le=-4,ra=38-4*k,re=-24,lhand='open',rhand='open',front=['r'])
CK=[(0,HOLD('amazed'),'io'),(36,HOLD('laughing',-6),'io'),(71,HOLD('amazed'),'io'),
    (72,IDLE('explaining'),'cut'),(226,IDLE('curious'),'io'),
    (228,HOLD('curious',-8),'cut'),(300,HOLD('curious',-8),'io'),(330,HOLD('surprised',-12),'io'),(338,HOLD('surprised',-12),'io'),
    (340,IDLE('explaining'),'cut'),(466,IDLE('amazed',-12),'io'),
    (468,HOLD('curious'),'cut'),(520,HOLD('amazed',-12),'io'),(562,HOLD('laughing',-8),'io'),
    (564,WARM(0),'cut'),(580,WARM(1),'io'),(596,WARM(0),'io'),(610,WARM(1),'io'),
    (616,free(expression='frustrated',head=-6,la=24,le=-60,ra=-24,re=60),'out'),(636,free(expression='frustrated',head=-2,la=27,le=-60,ra=-27,re=60),'io'),
    (644,free(expression='frustrated',head=-6,la=24,le=-60,ra=-24,re=60),'io'),(658,free('facepalm'),'io'),
    (660,IDLE('explaining'),'cut'),(742,IDLE('amazed',-12),'io'),
    (744,HOLD('laughing',-6),'cut'),(838,HOLD('amazed'),'io'),
    (840,HOLD('curious'),'cut'),(870,HOLD('surprised',-12),'io'),(922,HOLD('surprised',-12),'io'),
    (924,HOLD('curious'),'cut'),(1006,HOLD('thinking',-6),'io'),
    (1008,HOLD('thinking',-6),'cut'),(1050,HOLD('amazed'),'io'),(1102,HOLD('laughing',-6),'io'),
    (1104,IDLE('explaining'),'cut'),(1148,IDLE('worried'),'io'),
    (1150,HOLD('worried',-6),'cut'),(1198,HOLD('frustrated',-6),'io'),
    (1200,HOLD('amazed'),'cut'),(1260,HOLD('laughing',-6),'io'),(1320,HOLD('amazed'),'io'),(1380,HOLD('laughing',-6),'io'),(1440,HOLD('amazed'),'io')]
BL=[(50,3),(200,2),(460,2),(760,2),(1000,3),(1170,2),(1330,2)]
class CutCharacter(Character):
    """Overlap offsets never reach back across a cut."""
    CUTS=sorted(k[0] for k in CK if k[2]=='cut')
    def state(self,f,grip): self._f=f; return super().state(f,grip)
    def samp(self,g):
        c=max([k for k in self.CUTS if k<=getattr(self,'_f',g)] or [0]); return super().samp(max(g,c))
character=CutCharacter(CK,BL)

HL=[(80,150,'iron','IRON POWDER',-60,0),
    (156,186,'salt','SALT',-40,0),(184,206,'carbon','CHARCOAL',-60,0),(204,226,'fill','DAMP FILLER',-60,0),
    (346,382,'pores','TINY HOLES',-60,0),
    (400,466,'rust','RUST',-40,0),
    (566,612,'nail','RUSTY NAIL',-200,0),
    (668,740,'carbon','CHARCOAL',-60,0)]
CAPS=[(0,72,"This little packet is rusting in your hand."),
 (72,150,"Inside: a pile of super fine iron powder,"),
 (150,228,"plus salt, charcoal and a damp filler."),
 (228,300,"Here's the kicker: the wrapper keeps air out."),
 (300,384,"Tear it open, and air slips in through tiny holes."),
 (384,468,"Oxygen grabs the iron and turns it into rust."),
 (468,564,"Rusting gives off heat, and salt makes it rust crazy fast."),
 (564,660,"This old nail did the same thing, just way too slow."),
 (660,744,"Charcoal spreads the heat around,"),
 (744,840,"so it stays toasty, up to about 135 degrees."),
 (840,924,"Shake it, and more air gets in. Hotter, faster."),
 (924,1008,"Bonus: zip it in an airtight bag, and it stops."),
 (1008,1104,"Open the bag later, and it fires right back up."),
 (1104,1200,"After 7 to 24 hours, the iron is all rust. Done."),
 (1200,1290,"So that warm packet is rust on fast-forward."),
 (1290,1368,"Wild, right?"),
 (1368,1440,"And now you know...")]
SAY={7:"This old nail did the same thing. Just way too slow.",13:"After seven to twenty four hours, the iron is all rust. Done.",9:"so it stays toasty, up to about a hundred thirty five degrees."}
SPD={}
GROUPS={}
VO_DELAY={0:0.02}
SFX=[(0,'lib_whoosh_deep'),(30,'lib_pop_bubble'),(72,'lib_whoosh_fast'),(80,'lib_pop_bubble'),(156,'lib_pop_bubble'),(184,'lib_pop_bubble'),(204,'lib_pop_bubble'),
     (228,'lib_whoosh_fast'),(304,'lib_zipper'),(340,'lib_whoosh_fast'),(346,'lib_pop_bubble'),(352,'lib_wind_cold'),
     (388,'lib_text_pop'),(410,'lib_text_pop'),(432,'lib_text_pop'),(468,'lib_whoosh_deep'),(500,'lib_slide_whistle_up'),
     (564,'lib_whoosh_fast'),(590,'lib_wind_cold'),(614,'lib_record_scratch'),(620,'lib_sad_trombone'),
     (660,'lib_whoosh_fast'),(668,'lib_pop_bubble'),(744,'lib_whoosh_fast'),(760,'lib_ding'),
     (840,'lib_whoosh_fast'),(852,'lib_spring_twang'),(884,'lib_whoosh_deep'),
     (924,'lib_whoosh_fast'),(930,'lib_zipper'),(990,'lib_slide_whistle_down'),(1030,'lib_zipper'),(1050,'lib_whoosh_deep'),
     (1104,'lib_whoosh_fast'),(1150,'lib_sad_trombone'),
     (1200,'lib_whoosh_deep'),(1260,'lib_pop_bubble'),(1332,'lib_whoosh_fast'),(1404,'lib_whoosh_fast')]
def frame(f):
    pop=None
    if f<40 or f>=1412: pop={'x':230,'y':-170,'s':1,'text':'RUST?!'}
    elif 612<=f<660: pop={'x':330,'y':-60,'s':min(1,(f-612)/4+.3),'text':'BRRR.'}
    elif 870<=f<924: pop={'x':230,'y':-170,'s':min(1,(f-870)/4+.3),'text':'HOTTER!'}
    elif 960<=f<1008: pop={'x':230,'y':-170,'s':min(1,(f-960)/4+.3),'text':'PAUSED.'}
    elif 1056<=f<1104: pop={'x':230,'y':-170,'s':min(1,(f-1056)/4+.3),'text':'BACK ON!'}
    badge=None
    if f<72 or f>=1200 or 744<=f<840: badge='135°F'
    elif 468<=f<564: badge=f"{int(lin(f,472,540,70,135))}°F"
    elif 1104<=f<1200: badge='DONE'
    return {'T':T(f),'cam':dict(zip(('cx','cy','w'),kv(CAM,f))),
            'hl':[{'part':h[2],'label':h[3],'dx':h[4],'dy':h[5]} for h in HL if h[0]<=f<h[1]],
            'cap':(at(CAPS,f) or (0,0,''))[2],'badge':badge,'pop':pop}
if __name__=='__main__':
    cmd=sys.argv[1]
    if cmd=='render': render(sys.modules[__name__],sys.argv[2])
    elif cmd=='frames': render(sys.modules[__name__],sys.argv[3],[int(x) for x in sys.argv[2].split(',')])
