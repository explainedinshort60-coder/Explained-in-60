"""Episode 008: Why does your phone battery die in the cold? (thick electrolyte, slow lithium ions, early shutdown, warm it back).
Run: python3 episode.py render OUT_DIR   |   python3 episode.py frames 0,100,200 OUT_DIR"""
import os, sys, math
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'engine'))
from lib import *
import lib
HERE=os.path.dirname(os.path.abspath(__file__))
props_js=os.path.join(HERE,'props.js')
N=1440
# ---------- state tracks ----------
ON=[(0,1,'io'),(27,1,'io'),(30,0,'out'),(239,0,'io'),(240,1,'cut'),(880,1,'io'),(884,0,'out'),(1116,0,'io'),(1122,1,'out'),(1199,1,'io'),(1200,1,'cut')]
PCT=[(0,30,'io'),(12,30,'io'),(26,0,'in'),(239,0,'io'),(240,30,'cut'),(846,30,'io'),(876,0,'in'),(1115,0,'io'),(1116,30,'cut'),(1440,30,'io')]
SNOW=[(0,1,'io'),(239,1,'io'),(240,0,'cut'),(444,0,'io'),(470,1,'io'),(1440,1,'io')]
WARM=[(0,0,'io'),(239,0,'io'),(240,1,'cut'),(444,1,'io'),(470,0,'io'),(990,0,'io'),(1030,.7,'io'),(1110,.7,'io'),(1140,0,'io')]
COLD=[(0,1,'io'),(239,1,'io'),(240,0,'cut'),(444,0,'io'),(470,1,'io'),(990,1,'io'),(1030,.3,'io'),(1110,.3,'io'),(1140,1,'io'),(1440,1,'io')]
BUB=[(0,0,'io'),(76,0,'io'),(94,1,'back'),(959,1,'io'),(960,0,'cut'),(1029,0,'io'),(1030,1,'cut'),(1110,1,'io'),(1124,0,'io'),(1440,0,'io')]
THICK=[(0,1,'io'),(239,1,'io'),(240,0,'cut'),(516,0,'io'),(560,1,'io'),(1036,1,'io'),(1080,0,'io'),(1199,0,'io'),(1200,1,'cut')]
SHIV=[(0,1,'io'),(239,1,'io'),(240,0,'cut'),(590,0,'io'),(600,1,'io'),(1040,1,'io'),(1052,0,'io'),(1199,0,'io'),(1200,1,'cut')]
ISPD=[(0,.0025,'io'),(239,.0025,'io'),(240,.016,'cut'),(520,.016,'io'),(600,.0022,'io'),(1036,.0022,'io'),(1080,.016,'io'),(1199,.016,'io'),(1200,.0025,'cut')]
PH=[0.0]
for f in range(1,N+1): PH.append(PH[-1]+kv(ISPD,f))
SN=[(0,-1,'io'),(679,-1,'io'),(680,0,'cut'),(796,1.15,'lin'),(797,-1,'cut')]
DRY=[(0,0,'io'),(1150,0,'io'),(1160,1,'out'),(1184,1,'io'),(1196,0,'in')]
HOME=(575,430); POCK=(700,500)
PX=[(0,HOME,'io'),(966,HOME,'io'),(992,POCK,'io'),(1100,POCK,'io'),(1114,HOME,'out'),(1440,HOME,'io')]
def pw(f):
    if 372<=f<444: return 0.75+0.25*math.sin(f/2.2)
    if 800<=f<872: return max(0,0.6*math.sin(f/1.3))*(1-(f-800)/72)
    if 1080<=f<1110: return min(1,(f-1080)/10)
    return 0.0
def T(f):
    px,py=kv(PX,f)
    return {'px':px,'py':py,'on':kv(ON,f),'pct':kv(PCT,f),'snow':kv(SNOW,f),'warm':kv(WARM,f),'cold':kv(COLD,f),'bub':kv(BUB,f),
            'ph':PH[f],'thick':kv(THICK,f),'shiv':kv(SHIV,f),'pw':pw(f),'sn':kv(SN,f),'dry':kv(DRY,f),'hide':1 if 990<=f<1104 else 0}

# ---------- camera (cx, cy, w) ----------
HOOK=(600,330,640); BUBC=(300,250,560); WIDE=(430,330,820)
CAM=[(0,HOOK,'io'),(26,HOOK,'io'),(40,(610,320,560),'out'),(72,(605,320,580),'io'),
     (76,(470,290,800),'cut'),(150,(450,280,770),'io'),(232,(310,250,560),'io'),
     (240,BUBC,'cut'),(306,(300,250,540),'io'),(312,(290,240,520),'cut'),(366,(300,245,520),'io'),
     (372,WIDE,'cut'),(440,(440,330,790),'io'),
     (444,(450,320,800),'cut'),(506,(460,320,760),'io'),
     (510,BUBC,'cut'),(584,(300,260,520),'io'),(588,(295,270,480),'cut'),(662,(300,270,460),'io'),
     (666,(300,250,560),'cut'),(744,(300,260,540),'io'),(750,(450,280,800),'out'),(798,(460,290,800),'io'),
     (800,(540,330,660),'cut'),(876,(580,330,620),'io'),(880,(580,330,620),'io'),(884,(420,300,760),'out'),(956,(420,300,740),'io'),
     (960,(620,360,640),'cut'),(1028,(640,360,600),'io'),
     (1030,BUBC,'cut'),(1098,(300,250,520),'io'),
     (1100,(560,330,620),'cut'),(1146,(560,330,600),'io'),(1150,(520,330,640),'cut'),(1196,(520,330,620),'io'),
     (1200,HOOK,'cut'),(1284,(590,330,600),'io'),(1340,(595,330,610),'io'),(1420,HOOK,'io'),(1440,HOOK,'io')]

class Rig(Character):
    """Left-hand IK that accounts for the body lean (from ep 003)."""
    def state(self,f,grip):
        m=self.samp(f); s={k:(self.samp(f-self.OF[k])[k] if k in self.OF else m[k]) for k in lib.NUM}
        for k in('lhand','rhand','front','expression'): s[k]=m[k]
        s['head']+=math.sin(f/FPS*2*math.pi*.3+1)*.8
        sh=kv(SHIV,f)*(1 if 444<=f<1040 else 0)
        s['head']+=sh*math.sin(f*2.1)*1.6
        y=685-15-lib.lowfoot(s)+math.sin(f/FPS*2*math.pi*.45)*1.4
        if s['rw']>0.001:
            r=math.radians(-s['lean']); px,py=CX,y+450; gx,gy=grip['x']-px,grip['y']-py
            lx,ly=px+gx*math.cos(r)-gy*math.sin(r),py+gx*math.sin(r)+gy*math.cos(r)
            t1,t2=lib.ik((lx+8-CX,ly-4-y),-1); s['la']+=(t1-s['la'])*s['rw']; s['le']+=(t2-s['le'])*s['rw']
        st={k:s[k] for k in('la','le','ra','re','lt','lk','rt','rk','head','lhand','rhand','expression')}; st['y']=0
        return {'st':st,'y':y,'lean':s['lean'],'front':s['front'],'blink':any(b<=f<b+n for b,n in self.BL)}
def hold(name='idle',lean=None,**kw):
    """Any pose, with the left hand on the phone."""
    p=pose(name); p.update(rw=1,lhand='fist'); p['front']=[x for x in p['front'] if x!='l']
    if name=='idle': p.update(ra=-14,re=10,head=-4)
    if lean is not None: p['lean']=lean
    p.update(kw); return p
GEST=dict(ra=-70,re=-40,rhand='open')
H0=hold(expression='curious',head=-8)
CK=[(0,H0,'io'),(14,hold(expression='curious',head=-10),'io'),(30,hold('recoil',lean=-8,expression='surprised'),'back'),(58,hold('recoil',lean=-8,expression='frustrated'),'io'),(72,hold(expression='frustrated',head=-6),'io'),
    (76,hold('think',expression='thinking'),'cut'),(150,hold('think',expression='curious'),'io'),(239,hold('think',expression='curious'),'io'),
    (240,hold(expression='explaining',**GEST),'cut'),(372,hold(expression='explaining',**GEST),'io'),(400,hold('fun-fact',expression='amazed'),'io'),(440,hold('fun-fact',expression='explaining'),'io'),
    (444,hold(expression='worried',ra=-40,re=-60),'cut'),(500,hold(expression='worried',ra=-40,re=-60,head=-10),'io'),
    (506,hold(expression='worried',ra=-40,re=-60),'io'),(666,hold(expression='worried'),'io'),
    (744,hold(expression='curious'),'io'),(752,hold('recoil',lean=-6,expression='laughing'),'back'),(780,hold(expression='laughing',head=8,**GEST),'io'),(799,hold(expression='laughing',**GEST),'io'),
    (800,hold(expression='skeptical',head=-10),'cut'),(870,hold(expression='worried',head=-12),'io'),(884,hold('recoil',lean=-6,expression='surprised'),'back'),(910,hold(expression='frustrated',head=-8,ra=-30,re=-20),'io'),(959,hold(expression='frustrated',head=-6),'io'),
    (960,hold(expression='explaining',head=-6),'cut'),(992,hold(expression='realization',head=-2),'io'),(1028,hold(expression='realization',head=4),'io'),
    (1100,hold(expression='curious',head=-6),'cut'),(1124,hold('fun-fact',expression='amazed'),'io'),(1146,hold('fun-fact',expression='laughing'),'io'),
    (1150,hold(expression='curious',head=-8),'cut'),(1166,hold(expression='skeptical',head=-14,ra=-110,re=-30,rhand='open'),'back'),(1176,hold(expression='skeptical',head=10,ra=-110,re=-30,rhand='open'),'io'),(1186,hold(expression='skeptical',head=-10,ra=-110,re=-30,rhand='open'),'io'),(1199,hold(expression='neutral',head=-4),'io'),
    (1200,hold(expression='explaining',**GEST),'cut'),(1284,hold(expression='explaining',head=4,**GEST),'io'),(1340,hold('proud',expression='realization'),'io'),
    (1376,H0,'io'),(1440,H0,'io')]
BL=[(50,3),(200,2),(420,3),(640,2),(960,2),(1240,3),(1330,2)]
character=Rig(CK,BL)

HL=[(100,150,'ions','STILL CHARGED',-170,0),
    (248,300,'anode','ELECTRODE',-112,0),(262,306,'cathode','ELECTRODE',-112,0),(276,306,'electrolyte','ELECTROLYTE',-137,0),
    (316,366,'ions','LITHIUM IONS',-150,0),(390,440,'bolt','POWER',-75,0),
    (520,584,'syrup','SYRUPY',-75,0),(900,956,'bub','CHARGE STILL HERE',-210,0),
    (1000,1028,'pocket','INSIDE POCKET',-260,0),(1156,1186,'dryer','HAIR DRYER',-100,0)]
CAPS=[(0,72,"30%... and your phone just died?"),
 (72,150,"Here's the thing: that charge is still in there."),
 (150,240,"The cold just jammed the traffic inside your battery."),
 (240,306,"Inside: two electrodes, with a liquid between them."),
 (306,372,"Lithium ions swim across that liquid."),
 (372,444,"Every trip they make powers your phone."),
 (444,510,"Now add the cold."),
 (510,588,"The liquid thickens up, kind of like syrup."),
 (588,666,"And the ions slow to a crawl."),
 (666,744,"Lowkey, a snail could beat them."),
 (744,800,"Sorry, ions."),
 (800,880,"Your phone asks for power. The battery can't keep up."),
 (880,960,"So it shuts down, with charge still inside."),
 (960,1030,"Fix: inside pocket, close to your body."),
 (1030,1100,"The ions warm up and get moving again."),
 (1100,1150,"And your battery comes right back."),
 (1150,1200,"Hair dryer? Nope."),
 (1200,1284,"So your battery didn't die. It just got cold."),
 (1284,1368,"Cold liquid. Slow ions. Phone taps out."),
 (1368,1440,"And now you know...")]
SHOTS=[(0,72,'S01 HOOK','MS 30% > DEAD'),(72,240,'S02 TURN','BUBBLE OPENS'),(240,444,'S03 MECHANISM (WARM)','BUBBLE CU, WIDE'),(444,666,'S04 COLD','WIDE > BUBBLE ECU'),
       (666,800,'S05 GAG','SNAIL RACE'),(800,960,'S06 DEMO','SHUTDOWN'),(960,1200,'S07 BONUS','POCKET, DRYER'),(1200,1368,'S08 TAKEAWAY','MS = S01'),(1368,1440,'S09 LOOP OUT','MS')]
SAY={0:"Thirty percent... and your phone just died?",13:"Fix: inside pocket, close to your body.",19:"And now you know..."}
SPD={19:0.9}
GROUPS={}
VO_DELAY={0:0.02}
SFX=[(16,'lib_glitch'),(30,'lib_record_scratch'),(76,'lib_whoosh_fast'),(80,'lib_pop_bubble'),(240,'lib_whoosh_fast'),(312,'lib_whoosh_fast'),(372,'lib_whoosh_fast'),(380,'lib_electric_zap'),
     (444,'lib_whoosh_fast'),(510,'lib_whoosh_fast'),(588,'lib_whoosh_fast'),(666,'lib_whoosh_fast'),(684,'lib_slide_whistle_up'),(750,'lib_rimshot'),(756,'lib_ooh_crowd'),
     (800,'lib_whoosh_fast'),(884,'lib_glitch'),(960,'lib_whoosh_fast'),(990,'lib_pop_bubble'),(1030,'lib_whoosh_fast'),(1100,'lib_whoosh_fast'),(1120,'lib_button_press'),(1124,'lib_ding'),
     (1150,'lib_whoosh_fast'),(1166,'lib_boing'),(1200,'lib_whoosh_fast'),(1290,'lib_ding')]
def frame(f):
    pop=None
    if 30<=f<70: pop={'x':300,'y':-50,'s':min(1,(f-30)/4+.3),'text':'WHAT?!'}
    elif 620<=f<662: pop={'x':120,'y':40,'s':min(1,(f-620)/4+.3)*(1+0.04*math.sin(f*2)),'text':'BRRR!'}
    elif 750<=f<798: pop={'x':20,'y':-90,'s':min(1,(f-750)/4+.3),'text':'SNAIL WINS!'}
    elif 1166<=f<1196: pop={'x':200,'y':-40,'s':min(1,(f-1166)/4+.3),'text':'NOPE!'}
    badge=None
    if 240<=f<444: badge='WARM'
    elif 444<=f<960: badge='COLD'
    elif 1030<=f<1100: badge='WARM'
    return {'T':T(f),'cam':dict(zip(('cx','cy','w'),kv(CAM,f))),
            'hl':[{'part':h[2],'label':h[3],'dx':h[4],'dy':h[5]} for h in HL if h[0]<=f<h[1]],
            'cap':(at(CAPS,f) or (0,0,''))[2],'badge':badge,'pop':pop}
if __name__=='__main__':
    cmd=sys.argv[1]
    if cmd=='render': render(sys.modules[__name__],sys.argv[2])
    elif cmd=='frames': render(sys.modules[__name__],sys.argv[3],[int(x) for x in sys.argv[2].split(',')])
