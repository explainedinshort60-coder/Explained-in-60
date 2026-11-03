"""Episode 010: What does RAM actually do? (DRAM: billions of leaky capacitor buckets, a transistor gate per bit,
refreshed about every 64 ms, everything drains when the power goes, reading drains a bucket so it is refilled).
Run: python3 episode.py render OUT_DIR   |   python3 episode.py frames 0,100,200 OUT_DIR"""
import os, sys, math
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'engine'))
from lib import *
import lib
HERE=os.path.dirname(os.path.abspath(__file__))
props_js=os.path.join(HERE,'props.js')
N=1440
BITS=[1,0,1,1, 0,1,1,0, 1,1,0,1]
RATE=[1.0,1,1.25,0.8, 1,1.1,1.35,1, 0.9,1.2,1,0.75]
# ---------- plug, screen, spark ----------
PIN=(574,604); PHELD=(598,428)
PL=[(0,1,'io'),(71,1,'io'),(72,0,'cut'),(880,0,'io'),(894,1,'out'),(1199,1,'io'),(1200,0,'cut'),(1394,0,'io'),(1412,1,'out'),(1440,1,'io')]
SPARK=[(0,1,'io'),(16,0,'out'),(893,0,'io'),(898,1,'out'),(916,0,'io'),(1410,0,'io'),(1422,1,'out'),(1440,1,'io')]
ON=[(0,1,'io'),(12,1,'io'),(22,0,'in'),(71,0,'io'),(72,1,'cut'),(896,1,'io'),(908,0,'in'),(1199,0,'io'),(1200,1,'cut'),(1440,1,'io')]
GL=[(0,.6,'io'),(10,1,'io'),(22,.4,'io'),(30,0,'io'),(895,0,'io'),(898,1,'out'),(910,.3,'io'),(916,0,'io'),(1418,0,'io'),(1430,.45,'io'),(1438,.6,'io'),(1440,.6,'io')]
STK=[(0,0,'io'),(82,0,'io'),(98,1,'back'),(239,1,'io'),(240,0,'cut'),(1206,0,'io'),(1220,1,'back'),(1290,1,'io'),(1306,0,'in')]
# ---------- DRAM levels ----------
SWEEPS=[(630,30)]+[(660+24*k,22) for k in range(3)]+[(790+12*k,11) for k in range(7)]
def sw_at(f):
    for s,d in SWEEPS:
        if s<=f<s+d: return (f-s)/d*5-0.5
    if 1104<=f<1134: return 1+(f-1104)/30*2-1   # bonus refill pass over column 1
    return -9
def last_pass(c,f):
    t=None
    for s,d in SWEEPS:
        tp=s+(c+0.5)/5*d
        if tp<=f: t=tp
    return t
def leak_free(i,f):
    """Level of a '1' cell that has not been refreshed since frame 474."""
    r=RATE[i]
    if f<474: return 1.0
    if f<546: return 1-0.22*r*(f-474)/72
    return max(0.08,1-r*(0.22+0.48*min(1,(f-546)/70)))
def level(i,f):
    if not BITS[i]: return 0.0
    if f<474 or f>=1030:
        if i==5 and 1050<=f<1130:
            if f<1104: return 1-0.62*min(1,(f-1050)/40)
            return 0.38+0.62*min(1,max(0,(f-1104)/18))
        return 1.0
    fe=min(f,880)
    t=last_pass(i%4,fe)
    if t is None: L=leak_free(i,fe)
    else: L=max(0.55,1-0.03*RATE[i]*(fe-t))
    if f>880: L*=max(0,1-(f-905)/85) if f>905 else 1
    return max(0,L)
def T(f):
    p=kv(PL,f); plx=PIN[0]+(PHELD[0]-PIN[0])*p; ply=PIN[1]+(PHELD[1]-PIN[1])*p
    can=1 if 708<=f<790 else 0
    pour=0
    if can: pour=min(1,max(0,(f-716)/8))*(1 if f<776 else max(0,1-(f-776)/8))
    if can: gx,gy=600,392
    elif 96<=f<240: gx,gy=530,300
    else: gx,gy=plx,ply
    gbl=0
    if can: gbl=0.18+0.14*min(1,max(0,(f-722)/20))+0.04*math.sin(f/3)
    return {'on':kv(ON,f),'gl':kv(GL,f),'plx':plx,'ply':ply,'prot':-70*p,'spark':kv(SPARK,f),'stk':kv(STK,f),
            'lv':[level(i,f) for i in range(12)],'leak':1 if 474<=f<1000 else 0,'sw':sw_at(f) if f<880 or 1104<=f<1134 else -9,
            'gate':0.5+0.5*math.sin(f/3) if 404<=f<470 else 0,
            'rd':5 if 1046<=f<1124 else -1,'rdf':min(1,max(0,(f-1046)/10))*(1 if f<1096 else max(0,1-(f-1096)/12)),
            'cnt':1350000*min(1,((f-790)/68)**2) if f>=790 else 0,'cntOn':1 if 790<=f<870 else 0,'dead':1 if 880<=f<1030 else 0,
            'gb':can,'gbl':gbl,'pour':pour,'can':can,'pud':min(1,max(0,(f-720)/60)) if can else 0,'gx':gx,'gy':gy}

# ---------- camera (cx, cy, w) ----------
HOOK=(510,420,760); WIDE=(470,400,860); GRID=(1940,330,900)
CAM=[(0,HOOK,'io'),(30,(505,420,740),'io'),(71,(500,420,730),'io'),
     (72,WIDE,'cut'),(150,(470,390,830),'io'),(236,(460,360,760),'io'),
     (240,GRID,'cut'),(316,(1940,330,860),'io'),
     (318,(1940,210,640),'cut'),(394,(1940,215,620),'io'),
     (396,(1720,230,520),'cut'),(472,(1715,235,500),'io'),
     (474,GRID,'cut'),(544,(1940,320,860),'io'),(546,(1950,330,820),'cut'),(622,(1950,330,780),'io'),
     (624,GRID,'cut'),(706,(1940,320,880),'io'),
     (708,(540,420,720),'cut'),(788,(545,420,690),'io'),
     (790,(1940,290,900),'cut'),(868,(1940,300,880),'io'),
     (870,HOOK,'cut'),(919,(510,420,720),'io'),
     (920,GRID,'cut'),(1028,(1940,340,840),'io'),
     (1030,(1860,370,640),'cut'),(1102,(1860,380,600),'io'),(1104,(1860,380,600),'io'),(1198,(1870,370,640),'io'),
     (1200,HOOK,'cut'),(1284,(505,415,730),'io'),(1360,(510,420,750),'io'),(1440,HOOK,'io')]

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
def hold(name='idle',lean=None,**kw):
    p=pose(name); p.update(rw=1,lhand='fist'); p['front']=[x for x in p['front'] if x!='l']
    if name=='idle': p.update(ra=-14,re=10,head=-4)
    if lean is not None: p['lean']=lean
    p.update(kw); return p
def free(name='idle',**kw):
    p=pose(name); p.update(kw); return p
GEST=dict(ra=-70,re=-40,rhand='open')
H0=hold('recoil',lean=-6,expression='surprised',head=-8)
CK=[(0,H0,'io'),(20,hold('recoil',lean=-8,expression='surprised',head=-10),'io'),(44,hold(expression='frustrated',head=-12),'io'),(71,hold(expression='frustrated',head=-10),'io'),
    (72,free(expression='thinking',head=-6,ra=-30,re=-60),'cut'),(92,free(expression='curious',head=-8),'io'),
    (98,hold(expression='explaining',lhand='point',head=-10),'back'),(160,hold(expression='explaining',lhand='point',head=-6,**GEST),'io'),(236,hold(expression='amazed',lhand='point',head=-8),'io'),
    (708,hold(expression='curious',head=-8),'cut'),(722,hold(expression='worried',head=-12,lean=-4),'io'),(748,hold(expression='frustrated',head=-14,lean=-6),'io'),
    (756,hold('recoil',lean=-8,expression='surprised',head=-10),'back'),(788,hold(expression='frustrated',head=-6,ra=-60,re=-30,rhand='open'),'io'),
    (870,free(expression='curious',head=-8),'cut'),(882,hold(expression='curious',head=-10),'io'),(896,hold('recoil',lean=-8,expression='surprised',head=-10),'back'),(919,hold(expression='worried',head=-12),'io'),
    (1200,free(expression='explaining',**GEST),'cut'),(1284,free(expression='explaining',head=4,**GEST),'io'),(1330,free('proud',expression='realization'),'io'),
    (1376,free(expression='curious',head=-8),'io'),(1396,hold(expression='curious',head=-10),'io'),(1414,hold('recoil',lean=-8,expression='surprised',head=-10),'back'),(1428,H0,'io'),(1440,H0,'io')]
BL=[(50,3),(200,2),(760,2),(910,2),(1240,3),(1330,2)]
character=Rig(CK,BL)

HL=[(30,70,'unsaved','UNSAVED',-60,0),
    (104,236,'stick','RAM',-30,0),
    (252,316,'bucket','CAPACITOR',-140,0),
    (330,394,'one','FULL = 1',30,0),(346,394,'zero','EMPTY = 0',-260,0),
    (410,472,'gate','TRANSISTOR',-150,0),
    (490,544,'bucket5','LEAK',-60,0),(570,622,'fade','FADING',-90,0),
    (640,704,'refresh','REFRESH',-100,0),
    (940,1026,'bucket','NO REFILLS',-150,0),
    (1056,1100,'read','READ',-60,0),(1110,1150,'refresh','REFILL',-80,0),(1226,1290,'stick','RAM',-30,0)]
CAPS=[(0,72,"Cord yanked... and your work is just gone?"),
 (72,150,"Blame this little stick. It's called RAM."),
 (150,240,"It's your computer's main memory."),
 (240,318,"Zoom in: billions of tiny buckets called capacitors."),
 (318,396,"Full bucket means one. Empty means zero."),
 (396,474,"A tiny gate, a transistor, opens to fill or read it."),
 (474,546,"Here's the kicker: every bucket leaks."),
 (546,612,"Wait too long and your ones fade into zeros."),
 (612,708,"So RAM refills them all, about every 64 milliseconds."),
 (708,790,"By hand? No cap, impossible."),
 (790,870,"RAM does it over a million times a day."),
 (870,950,"But pull the power, and the refills stop."),
 (950,1030,"Every bucket drains. Your work drains with it."),
 (1030,1110,"Bonus: even reading a bucket drains it,"),
 (1110,1200,"so RAM refills it right after every read."),
 (1200,1284,"So RAM is your computer's main memory..."),
 (1284,1368,"Lightning fast, always leaking. Hit save."),
 (1368,1440,"And now you know...")]
SAY={8:"So RAM refills them all, about every sixty-four milliseconds.",17:"And now you know..."}
SPD={17:0.9}
GROUPS={}
VO_DELAY={0:0.02}
SFX=[(2,'lib_electric_zap'),(8,'lib_glitch'),(72,'lib_whoosh_fast'),(86,'lib_pop_bubble'),(240,'lib_whoosh_fast'),(318,'lib_whoosh_fast'),(396,'lib_whoosh_fast'),(404,'lib_mech_click'),
     (474,'lib_whoosh_fast'),(546,'lib_slide_whistle_down'),(624,'lib_whoosh_fast'),(632,'lib_ding'),
     (708,'lib_whoosh_fast'),(756,'lib_boing'),(770,'lib_rimshot'),(790,'lib_whoosh_fast'),(796,'lib_gear_ratchet'),(864,'lib_ding'),
     (870,'lib_whoosh_fast'),(896,'lib_electric_zap'),(900,'lib_glitch'),(920,'lib_whoosh_fast'),(950,'lib_slide_whistle_down'),(1000,'lib_funk'),
     (1030,'lib_whoosh_fast'),(1050,'lib_pop_bubble'),(1112,'lib_ding'),(1200,'lib_whoosh_fast'),(1210,'lib_pop_bubble'),(1290,'lib_ding'),(1414,'lib_electric_zap')]
def frame(f):
    pop=None
    if 14<=f<66: pop={'x':200,'y':80,'s':min(1,(f-14)/4+.3),'text':'NOOO!'}
    elif 752<=f<788: pop={'x':120,'y':10,'s':min(1,(f-752)/4+.3),'text':'TOO SLOW!'}
    elif 990<=f<1028: pop={'x':1560,'y':-150,'s':min(1,(f-990)/4+.3),'text':'BYE, ESSAY.'}
    elif 1062<=f<1100: pop={'x':1700,'y':-100,'s':min(1,(f-1062)/4+.3),'text':'SLURP!'}
    badge=None
    if 624<=f<708 or 790<=f<870: badge='64 ms'
    return {'T':T(f),'cam':dict(zip(('cx','cy','w'),kv(CAM,f))),
            'hl':[{'part':h[2],'label':h[3],'dx':h[4],'dy':h[5]} for h in HL if h[0]<=f<h[1]],
            'cap':(at(CAPS,f) or (0,0,''))[2],'badge':badge,'pop':pop}
if __name__=='__main__':
    cmd=sys.argv[1]
    if cmd=='render': render(sys.modules[__name__],sys.argv[2])
    elif cmd=='frames': render(sys.modules[__name__],sys.argv[3],[int(x) for x in sys.argv[2].split(',')])
