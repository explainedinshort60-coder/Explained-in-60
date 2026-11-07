"""Episode 016: Why does a shooting star glow? (a sand-grain speck of space dust slams into the air so fast the air in
front cannot get out of the way; it piles up, gets squeezed and heats past 3,000 F (ram pressure, not friction); the heat
vaporizes the grain about 60 miles up; this month's Taurids are slow, chunkier debris, so some flare into fireballs).
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
def loop_p(f): return (0.45+(f%72)/72)%1
def T(f):
    t=dict(sky=1,zm=0,p=0.45,mt=1,fire=0,pend=1,alt=0,comet=0,cal=0,flow=1,pile=0,heat=0,vap=0,trail=0,sp=0,mag=0,wish=0)
    if f<72 or f>=1200:                        # hook and takeaway: streak across the sky window
        t.update(p=loop_p(f),fire=0.35)
    elif f<330:                                # zoom: the grain flies, air streams past
        t.update(sky=0,zm=1,sp=win(f,72,330,8,10),pile=lin(f,300,330,0,0.25))
    elif f<504:                                # air piles up in front, squeezed
        t.update(sky=0,zm=1,pile=lin(f,330,470,0.25,1),flow=lin(f,330,504,1,1.6))
    elif f<600:                                # squeezed air heats up
        t.update(sky=0,zm=1,pile=1,flow=1.6,heat=lin(f,510,580))
    elif f<700:                                # gag: the wish, magnifier shows a sand grain
        t.update(p=lin(f,600,638,0.12,0.45),wish=win(f,600,652,6,4),mag=lin(f,640,648) if f>=640 else 0)
    elif f<790:                                # heat vaporizes the grain, glowing trail
        t.update(sky=0,zm=1,pile=1,flow=1.6,heat=1,trail=lin(f,700,716),vap=lin(f,716,788,0,0.55))
    elif f<870:                                # sky: altitude line
        t.update(p=((f-790)%40)/40*1.05,alt=lin(f,794,806))
    elif f<960:                                # Taurids: comet dropping chunky dust
        t.update(mt=0,comet=lin(f,870,884))
    elif f<1040:                               # slow fireball
        t.update(p=lin(f,962,1036,0.04,0.97),fire=1,comet=max(0,1-(f-960)/10))
    elif f<1120:                               # best nights: Nov 12
        t.update(mt=0,cal=lin(f,1042,1056))
    else:                                      # most burn up high above the ground
        t.update(p=lin(f,1122,1160,0.0,0.68),pend=0.6)
    return t
def Z(w,right=555):
    """Zoom camera inside the sky window: right edge stops before the host, panel top stays below the header."""
    return (right-w/2,-120-150*w/1080+0.889*w,w)
WIDE=(440,338,800); PANEL=Z(515); CLOSE=Z(495)
CAM=[(0,WIDE,'io'),(71,(440,338,780),'io'),
     (72,CLOSE,'cut'),(154,Z(470,545),'io'),
     (156,PANEL,'cut'),(238,Z(495),'io'),
     (240,(450,338,820),'cut'),(328,(450,338,800),'io'),
     (330,CLOSE,'cut'),(418,Z(470,545),'io'),
     (420,Z(470,535),'cut'),(502,Z(455,530),'io'),
     (504,PANEL,'cut'),(598,Z(495),'io'),
     (600,(450,330,820),'cut'),(698,(450,330,800),'io'),
     (700,CLOSE,'cut'),(788,Z(470,545),'io'),
     (790,PANEL,'cut'),(868,Z(495),'io'),
     (870,PANEL,'cut'),(958,Z(495),'io'),
     (960,Z(515),'cut'),(1038,Z(495),'io'),
     (1040,WIDE,'cut'),(1118,(440,338,780),'io'),
     (1120,PANEL,'cut'),(1198,Z(495),'io'),
     (1200,(440,338,820),'cut'),(1290,(440,338,800),'io'),(1366,WIDE,'io'),(1440,WIDE,'io')]
def free(name='idle',**kw):
    p=pose(name); p.update(kw); return p
POINTUP=free(expression='amazed',la=128,le=-12,lhand='point',head=-14)
POINTUP2=free(expression='laughing',la=122,le=-18,lhand='point',head=-10)
TALK=dict(expression='explaining',ra=-35,re=-55,rhand='open',head=-8)
IDLE=lambda e,h=-8: free(expression=e,head=h)
CK=[(0,POINTUP,'io'),(36,POINTUP2,'io'),(71,POINTUP,'io'),
    (72,IDLE('explaining'),'cut'),(238,IDLE('amazed'),'io'),
    (240,free('think',expression='skeptical'),'cut'),(280,free('think',expression='skeptical'),'io'),
    (288,free(expression='laughing',la=60,le=-20,lhand='point',head=-8),'out'),(328,free(expression='laughing',la=60,le=-20,lhand='point',head=-8),'io'),
    (330,IDLE('curious'),'cut'),(598,IDLE('amazed',-12),'io'),
    (600,free('think',expression='amazed',head=-14),'cut'),(638,free('think',expression='amazed',head=-16),'io'),
    (646,free('recoil'),'out'),(664,free('facepalm'),'io'),(698,free('facepalm'),'io'),
    (700,IDLE('explaining'),'cut'),(1038,IDLE('amazed',-12),'io'),
    (1040,free('present',expression='explaining'),'cut'),(1118,free('present',expression='explaining'),'io'),
    (1120,IDLE('curious'),'cut'),(1198,IDLE('curious'),'io'),
    (1200,POINTUP,'cut'),(1260,POINTUP2,'io'),(1320,POINTUP,'io'),(1380,POINTUP2,'io'),(1440,POINTUP,'io')]
BL=[(50,3),(200,2),(460,2),(760,2),(1000,3),(1150,2),(1330,2)]
class CutCharacter(Character):
    """Overlap offsets never reach back across a cut, so no arm from the last shot ghosts into the first frames."""
    CUTS=sorted(k[0] for k in CK if k[2]=='cut')
    def state(self,f,grip): self._f=f; return super().state(f,grip)
    def samp(self,g):
        c=max([k for k in self.CUTS if k<=getattr(self,'_f',g)] or [0]); return super().samp(max(g,c))
character=CutCharacter(CK,BL)

HL=[(84,154,'grain','SPACE DUST',-60,0),
    (164,238,'air','AIR',-40,0),
    (340,418,'cap','AIR PILES UP',-60,0),
    (430,502,'cap','SQUEEZED AIR',-60,0),
    (520,598,'cap','HOT AIR',-60,0),
    (712,750,'grain','GRAIN',-40,0),(752,788,'trail','VAPOR',-80,0),
    (880,958,'comet','COMET',-120,0),
    (1164,1198,'burn','BURNED UP',-60,0)]
CAPS=[(0,72,"That shooting star? A grain of sand."),
 (72,156,"But it slams into our air crazy fast,"),
 (156,240,"tens of thousands of miles an hour."),
 (240,330,"Here's the kicker: it's not friction."),
 (330,420,"The air in front can't get out of the way,"),
 (420,504,"so it piles up and gets squeezed. Hard."),
 (504,600,"Squeezed air heats up, past 3,000 degrees."),
 (600,700,"So you've been wishing on... sand."),
 (700,790,"That heat boils the grain away into vapor,"),
 (790,870,"and the streak glows, about 60 miles up."),
 (870,960,"Bonus: this month's Taurids are slow and chunky,"),
 (960,1040,"so some flare into big, bright fireballs."),
 (1040,1120,"Best nights to look: around November 12."),
 (1120,1200,"And most burn up way before the ground."),
 (1200,1290,"So every shooting star is squeezed air,"),
 (1290,1368,"glowing white hot. Lowkey wild."),
 (1368,1440,"And now you know...")]
SAY={0:"That shooting star is a grain of sand.",
     6:"Squeezed air heats up, past three thousand degrees.",
     9:"and the streak glows, about sixty miles up.",
     12:"Best nights to look: around November twelfth.",
     15:"glowing white hot. Lowkey wild."}
SPD={}
GROUPS={}
VO_DELAY={0:0.02}
SFX=[(0,'lib_whoosh_fast'),(36,'lib_whoosh_fast'),(72,'lib_whoosh_fast'),(84,'lib_pop_bubble'),(156,'lib_whoosh_fast'),(164,'lib_pop_bubble'),
     (240,'lib_record_scratch'),(290,'lib_text_pop'),(330,'lib_whoosh_fast'),(420,'lib_whoosh_fast'),(432,'lib_mech_clunk'),
     (504,'lib_whoosh_fast'),(560,'lib_electric_zap'),(600,'lib_slide_whistle_up'),(640,'lib_record_scratch'),(650,'lib_sad_trombone'),
     (700,'lib_whoosh_fast'),(790,'lib_whoosh_fast'),(830,'lib_whoosh_fast'),(870,'lib_whoosh_fast'),(880,'lib_ding'),
     (960,'lib_whoosh_fast'),(990,'lib_ooh_crowd'),(1040,'lib_whoosh_fast'),(1050,'lib_text_pop'),(1120,'lib_whoosh_fast'),(1170,'lib_pop_bubble'),
     (1200,'lib_whoosh_fast'),(1260,'lib_whoosh_fast'),(1332,'lib_whoosh_fast'),(1404,'lib_whoosh_fast')]
def frame(f):
    pop=None
    if 286<=f<330: pop={'x':40,'y':120,'s':min(1,(f-286)/4+.3),'text':'NOPE.'}
    elif 432<=f<470: pop={'x':150,'y':380,'s':min(1,(f-432)/4+.3),'text':'SQUISH!'}
    elif 990<=f<1040: pop={'x':60,'y':480,'s':min(1,(f-990)/4+.3),'text':'FIREBALL!'}
    elif 648<=f<700: pop={'x':60,'y':-80,'s':min(1,(f-648)/4+.3),'text':'...SAND?'}
    badge=None
    if 540<=f<600: badge='3,000°F'
    return {'T':T(f),'cam':dict(zip(('cx','cy','w'),kv(CAM,f))),
            'hl':[{'part':h[2],'label':h[3],'dx':h[4],'dy':h[5]} for h in HL if h[0]<=f<h[1]],
            'cap':(at(CAPS,f) or (0,0,''))[2],'badge':badge,'pop':pop}
if __name__=='__main__':
    cmd=sys.argv[1]
    if cmd=='render': render(sys.modules[__name__],sys.argv[2])
    elif cmd=='frames': render(sys.modules[__name__],sys.argv[3],[int(x) for x in sys.argv[2].split(',')])
