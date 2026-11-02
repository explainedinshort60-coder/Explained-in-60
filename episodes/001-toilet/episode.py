"""Episode 001: Why your toilet always stops at the same line (ballcock fill valve).
Run: python3 episode.py render OUT_DIR   |   python3 episode.py frames 0,100,200 OUT_DIR"""
import os, sys, math
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'engine'))
from lib import *
HERE=os.path.dirname(os.path.abspath(__file__))
props_js=os.path.join(HERE,'props.js')
N=1440
# ---------- toilet ----------
YF,YE=400,535
WL=[(0,1,'io'),(24,1,'io'),(44,.05,'in'),(66,1,'out'),(310,1,'io'),(420,.05,'io'),(528,.05,'io'),(790,1,'lin'),
    (860,1,'io'),(905,.05,'in'),(918,.05,'io'),(985,1,'out'),(1130,1,'io'),(1185,1.11,'out'),(1199,1.11,'io'),(1200,1,'cut')]
FLAP=[(0,0,'io'),(20,0,'io'),(26,60,'out'),(42,60,'io'),(50,0,'in'),(300,0,'io'),(308,60,'out'),(410,60,'io'),(420,0,'in'),
      (852,0,'io'),(858,60,'out'),(903,60,'io'),(912,0,'in')]
PRESS=[(0,0,'io'),(12,0,'io'),(18,1,'out'),(26,1,'io'),(32,0,'io'),(290,0,'io'),(298,1,'out'),(306,1,'io'),(314,0,'io'),
       (846,0,'io'),(852,1,'out'),(858,1,'io'),(864,0,'io')]
OFF=[(0,0,'io'),(1010,0,'io'),(1030,14,'out'),(1060,14,'io'),(1080,-14,'io'),(1110,-14,'io'),(1125,0,'io')]
GHOST=[(1010,YF,'io'),(1030,YF+30,'out'),(1060,YF+30,'io'),(1080,YF-30,'io'),(1110,YF-30,'io'),(1125,YF,'io')]
def T(f):
    w=kv(WL,f); yw=YE-w*(YE-YF)
    return {'yw':yw,'flap':kv(FLAP,f),'press':kv(PRESS,f),'off':kv(OFF,f),'stuck':1130<=f<1200,'overflow':1176<=f<1200,
            'ghost':kv(GHOST,f) if 1010<=f<1128 else None,'levelLine':1 if (f<72 or f>=1200) else 0,
            'swirl':1 if (24<=f<66 or 308<=f<420 or 858<=f<910) else 0}

# ---------- camera ----------
WIDE=(535,470,660); MED=(430,530,560); MW=(480,520,660); CU=(385,540,430); PUNCH=(360,505,370); DEMO=(430,530,600); ADJ=(430,535,500)
CAM=[(0,WIDE,'io'),(72,WIDE,'io'),(120,MED,'io'),(288,MED,'io'),(300,MW,'io'),(420,MW,'io'),(460,CU,'io'),(788,CU,'io'),(792,PUNCH,'out'),
     (806,PUNCH,'io'),(830,(500,520,720),'io'),(840,DEMO,'cut'),(1000,DEMO,'io'),(1020,ADJ,'io'),(1199,ADJ,'io'),(1200,WIDE,'cut')]

pm=mirror(pose('present')); rm=mirror(pose('recoil'))
CK=[(0,pose('reach'),'io'),(40,pose('reach'),'io'),(66,pose('reach',expression='realization'),'io'),(74,pose('reach',expression='realization'),'io'),
    (92,dict(pm,expression='explaining'),'back'),(270,dict(pm,expression='explaining',head=2),'io'),(288,pose('reach',expression='neutral'),'out'),
    (322,pose('reach',expression='neutral'),'io'),(344,pose('think'),'out'),(600,pose('think',head=12),'io'),(786,pose('think',head=12),'io'),
    (796,dict(rm),'back'),(826,dict(rm,head=10),'io'),(846,pose('reach',expression='curious'),'out'),(866,pose('reach',expression='curious'),'io'),
    (884,pose('fun-fact'),'back'),(1000,pose('fun-fact',head=-3),'io'),(1016,dict(pm,expression='curious'),'out'),(1125,dict(pm,expression='curious'),'io'),
    (1140,dict(pm,expression='worried'),'io'),(1176,dict(pm,expression='worried'),'io'),(1190,pose('tada'),'back'),(1199,pose('tada'),'io'),
    (1200,pose('proud'),'cut'),(1360,pose('proud',head=-4),'io'),(1386,pose('reach',expression='curious'),'out'),(1440,pose('reach'),'io')]

BL=[(88,3),(286,2),(340,3),(560,2),(700,3),(793,2),(882,2),(1012,3),(1140,2),(1260,3),(1340,2),(1384,2)]

character=Character(CK,BL)
HL=[(170,215,'ball','BALL',-300,-260),(215,250,'arm','ARM',-260,-260),(250,288,'tap','TAP',-200,-240),
    (316,410,'flap','FLAPPER',-120,-300),(440,528,'tap','TAP OPENS',-60,-260),(600,780,'ball','RISING',-60,-260),(790,840,'tap','SHUT',-60,-240),
    (842,893,'ball','WATER MOVES BALL',-200,-300),(893,946,'arm','BALL MOVES ARM',-200,-300),(946,1000,'tap','ARM WORKS TAP',-200,-300),
    (1030,1060,'arm','BEND DOWN = LESS',-260,-280),(1080,1125,'arm','BEND UP = MORE',-260,-280),(1140,1200,'overflow','OVERFLOW TUBE',-480,-320),
    (0,72,'line','SAME LINE',-120,-260),(1220,1368,'line','SAME LINE',-120,-260),(1400,1440,'line','SAME LINE',-120,-260)]
CAPS=[(0,72,"Why your toilet always stops at the same line."),(72,130,"No sensor. No chip."),(130,170,"No timer."),(170,230,"Just a ball that floats,"),(230,288,"an arm, and a tap."),
 (288,348,"Flush, and a rubber flap lifts."),(348,408,"The tank empties in seconds."),(408,468,"As the water drops, the ball drops too,"),(468,528,"and the arm pulls the tap open."),
 (528,600,"Fresh water rushes in."),(600,700,"The ball rides it up. Higher. Higher."),(700,790,"Until the arm pushes the tap shut."),(790,840,"Click."),
 (840,893,"Water moves the ball."),(893,946,"The ball moves the arm."),(946,1000,"The arm controls the water."),(1000,1065,"Bend the arm down, it fills less."),
 (1065,1130,"Bend it up, it fills more."),(1130,1165,"If the tap ever sticks,"),(1165,1200,"this tube drains the extra."),(1200,1284,"Your toilet isn't smart."),
 (1284,1368,"The water just turns off its own tap."),(1368,1440,"And now you know...")]

SHOTS=[(0,72,'S01 HOOK','WS'),(72,288,'S02 MECHANISM','PUSH-IN MS'),(288,528,'S03 REVEAL A','MS > CU'),(528,840,'S04 REVEAL B','CU > PUNCH > MS'),
       (840,1200,'S05 FULL DEMO','MS > CU'),(1200,1368,'S06 TAKEAWAY','WS = S01'),(1368,1440,'S07 LOOP OUT','WS > S01')]

# VO: lines are spoken from CAPS. SAY overrides the spoken text, SPD the speed, GROUPS voices two captions as one take.
SAY={0:"Why your toilet always stops... at the same line.",10:"The ball rides it up. Higher... higher...",12:"Click!",17:"Bend it up, it fills more!",22:"And now you know..."}
SPD={22:0.85}
GROUPS={7:(8,"As the water drops, the ball drops too, and the arm pulls the tap open."),18:(19,"If the tap ever sticks, this tube drains the extra.")}
VO_DELAY={0:0.02,12:0.2}
SFX=[(20,'flush'),(298,'flush'),(852,'flush'),(790,'click')]
def frame(f):
    return {'T':T(f),'cam':dict(zip(('cx','cy','w'),kv(CAM,f))),
            'hl':[{'part':h[2],'label':h[3],'dx':h[4],'dy':h[5]} for h in HL if h[0]<=f<h[1]],
            'cap':(at(CAPS,f) or (0,0,''))[2],'badge':'>> 8x' if 44<=f<66 else None,
            'pop':{'x':300,'y':392,'s':min(1,(f-790)/4+.3),'text':'CLICK!'} if 790<=f<818 else None}
if __name__=='__main__':
    cmd=sys.argv[1]
    if cmd=='render': render(sys.modules[__name__],sys.argv[2])
    elif cmd=='frames': render(sys.modules[__name__],sys.argv[3],[int(x) for x in sys.argv[2].split(',')])
