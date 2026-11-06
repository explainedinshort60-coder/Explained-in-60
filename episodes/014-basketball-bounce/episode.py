"""Episode 014: Why does a basketball bounce? (the air pumped inside gets squeezed when the bottom flattens and shoves
back like a spring; a flat ball loses its energy to bending rubber, heat and sound; a cold ball bounces lower because
the air inside pushes weaker; the pebbles are grip).
Run: python3 episode.py render OUT_DIR   |   python3 episode.py frames 0,100,200 OUT_DIR"""
import os, sys, math
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'engine'))
from lib import *
HERE=os.path.dirname(os.path.abspath(__file__))
props_js=os.path.join(HERE,'props.js')
N=1440
R=95; REST=605; BXD=540; BXM=330; FX=575
def win(f,a,b,ri=6,ro=6):
    if f<a or f>=b: return 0.0
    return min(1,(f-a)/ri if ri else 1,(b-f)/ro if ro else 1)
def ry(sq): return R*(1-0.32*sq)
def place(cy,sq): return 700-ry(sq) if sq>0.01 else min(cy,700-R)
def bounce(f,f0,period,peak,sqmax=0.8):
    """Periodic bounce with contact at f0 (mod period). Returns (cy, sq)."""
    u=((f-f0)%period)/period; d=min(u,1-u)*period
    cy=REST-4*u*(1-u)*(REST-peak); sq=max(0.0,1-max(0.0,d-1)/3)*sqmax
    return place(cy,sq),sq
def T(f):
    t=dict(bx=BXM,by=REST,sq=0,xr=0,spd=1,arr=0,up=0,cold=0,warm=0,fv=0,fx=FX,fy=600,fsq=1.3,fxr=0,heat=0,
           rul=0,mkF=0,mkC=0,mv=1,mag=0,fing=0,gx=BXD-10,gy=420)
    if f<72 or f>=1200:                       # dribble (hook and takeaway)
        cy,sq=bounce(f,0,36,455); t.update(df=f-1440 if f>=1200 else f,bx=BXD,by=cy,sq=sq,xr=1 if f<72 else min(1,(f-1200)/14),arr=sq,gx=BXD-10,gy=cy-ry(sq)-2)
    elif f<240:
        t.update(xr=min(1,(f-72)/10),arr=win(f,156,240,10,6))
    elif f<330:                                # slow drop into the floor
        u=min(1,(f-240)/80); cy=300+(REST-300)*u*u; sq=min(1,max(0,(f-320)/10)); t.update(xr=1,by=place(cy,sq),sq=sq,arr=sq*0.6)
    elif f<432:                                # frozen at the bottom, air squeezed
        sq=1+0.04*math.sin(f/2); t.update(xr=1,sq=sq,by=700-ry(sq),arr=1,up=win(f,420,470,6,0) if f>=420 else 0)
    elif f<504:                                # launch
        u=min(1,(f-432)/72); sq=max(0,1-(f-432)/6); cy=REST-(REST-275)*(1-(1-u)**2)
        t.update(xr=1,sq=sq,by=place(cy,sq),arr=max(0,1-(f-432)/20),up=max(0,1-(f-432)/30),rul=min(1,(f-470)/14) if f>470 else 0)
    elif f<600:                                # normal bounce, FULL height mark
        cy,sq=bounce(f,480,48,275); t.update(xr=1,by=cy,sq=sq,arr=sq,rul=1,mkF=min(1,(f-504)/12))
    elif f<700:                                # gag: the flat ball
        t.update(rul=1,mkF=1,fv=1)
        if f<640: fy=430; t.update(fy=fy,fsq=0.45,gx=FX-10,gy=fy-ry(0.45)-2)
        else:
            u=min(1,(f-640)/12); sq=0.45+0.85*min(1,max(0,(f-650)/3)); fy=430+(700-ry(sq)-430)*u*u
            t.update(fy=min(fy,700-ry(sq)),fsq=sq)
    elif f<870:                                # flat ball x-ray, energy leaks
        t.update(fv=1,fx=BXM,fy=700-ry(1.3),fxr=min(1,(f-700)/10),heat=win(f,790,870,8,0),rul=0,mv=0)
    elif f<1040:                               # cold ball: low bounce
        cy,sq=bounce(f,870+15,30,495,0.5); t.update(by=cy,sq=sq,cold=1,rul=0 if f>=960 else 1,mkF=1,mkC=min(1,max(0,(f-900)/12)),
            xr=min(1,max(0,(f-960)/8)),spd=0.25)
    elif f<1120:                               # warm again: full bounce
        cy,sq=bounce(f,1040+24,48,275); c=max(0,1-(f-1040)/14); t.update(by=cy,sq=sq,cold=c,warm=1-c,rul=1,mkF=1,mkC=1,xr=1,spd=1.3,arr=sq)
    else:                                      # pebbles: magnifier and fingertip
        t.update(mag=min(1,(f-1120)/8),fing=0.5+0.5*math.sin((f-1120)/6))
    return t
# ---------- camera (cx, cy, w) ----------
def C(cx,w,lift=0):
    """Camera that keeps the floor line near screen y 1450 (just above the subtitle pill)."""
    return (cx,700-0.453*w-min(lift,0.1*w),w)
HOOK=C(520,780)
CAM=[(0,HOOK,'io'),(71,C(520,760),'io'),
     (72,C(310,430),'cut'),(154,C(310,410),'io'),
     (156,C(310,400),'cut'),(238,C(310,390),'io'),
     (240,C(300,470,120),'cut'),(328,C(310,420),'io'),
     (330,C(310,380),'cut'),(418,C(310,370),'io'),
     (420,C(270,500),'cut'),(502,C(280,540,60),'io'),
     (504,C(390,760,20),'cut'),(598,C(400,740,20),'io'),
     (600,C(500,820),'cut'),(698,C(500,800),'io'),
     (700,C(305,430),'cut'),(788,C(305,410),'io'),
     (790,C(300,450,30),'cut'),(868,C(300,430,30),'io'),
     (870,C(380,740,20),'cut'),(958,C(380,720,20),'io'),
     (960,C(295,410),'cut'),(1038,C(295,395),'io'),
     (1040,C(390,760,20),'cut'),(1118,C(390,740,20),'io'),
     (1120,C(320,560,90),'cut'),(1198,C(320,540,90),'io'),
     (1200,C(520,820),'cut'),(1290,C(520,800),'io'),(1366,HOOK,'io'),(1440,HOOK,'io')]
def free(name='idle',**kw):
    p=pose(name); p.update(kw); return p
DRIB=free('reach',lhand='open',expression='explaining',ra=-35,re=-55,rhand='open',head=-10)
DRIB2=free('reach',lhand='open',expression='laughing',ra=-40,re=-60,rhand='open',head=-6)
TALK=dict(expression='explaining',ra=-35,re=-55,rhand='open',head=-8)
POINT=free(expression='explaining',la=78,le=-12,lhand='point',head=-10)
CK=[(0,DRIB,'io'),(36,DRIB2,'io'),(71,DRIB,'io'),
    (72,free(**TALK),'cut'),(156,free(expression='amazed',ra=-35,re=-55,rhand='open',head=-6),'cut'),
    (240,free(expression='curious',head=-12),'cut'),(330,free(expression='thinking',head=-8),'cut'),
    (420,free(expression='surprised',head=-8),'cut'),(470,free(expression='amazed',head=-14),'io'),
    (504,free(expression='explaining',la=75,le=-15,lhand='point',head=-16),'cut'),(598,free(expression='explaining',la=70,le=-10,lhand='point',head=-6),'io'),
    (600,free('reach',lhand='fist',expression='skeptical',ra=-30,re=-50),'cut'),(638,free('reach',lhand='fist',expression='curious',ra=-30,re=-50),'io'),
    (644,free(expression='surprised',la=40,le=-20,lhand='open',ra=-40,re=-30,rhand='open'),'out'),
    (668,free('facepalm'),'io'),(700,free('facepalm'),'io'),
    (702,free(**TALK),'cut'),(790,free(expression='worried',head=-8),'cut'),
    (870,free('fun-fact',expression='realization'),'cut'),(960,free(expression='curious',head=-8),'cut'),
    (1040,free('tada',expression='laughing'),'cut'),(1120,free('present',expression='explaining'),'cut'),(1198,free('present',expression='explaining'),'io'),
    (1200,DRIB,'cut'),(1260,DRIB2,'io'),(1320,DRIB,'io'),(1380,DRIB2,'io'),(1440,DRIB,'io')]
BL=[(50,3),(200,2),(460,2),(760,2),(1000,3),(1150,2),(1330,2)]
character=Character(CK,BL)

HL=[(84,154,'air','AIR',-60,0),
    (164,238,'wall','RUBBER WALL',-40,0),
    (332,372,'flatspot','FLAT SPOT',-60,0),(374,418,'air','SQUEEZED AIR',-90,0),
    (712,748,'flat','LESS AIR',-120,0),(750,788,'rubber','BENDING RUBBER',-40,0),
    (970,1038,'air','SLOW AIR',-80,0),
    (1130,1198,'pebble','PEBBLES',-40,0),
    (1214,1288,'air','AIR',-60,0)]
CAPS=[(0,72,"Why does a basketball even bounce?"),
 (72,156,"The real MVP? The air inside."),
 (156,240,"It's packed in tight, pushing out everywhere."),
 (240,330,"When the ball hits the floor, the bottom flattens,"),
 (330,420,"and that air gets squeezed into less space."),
 (420,504,"Squeezed air shoves back. Hard."),
 (504,600,"Like a spring, the ball pops round and launches up."),
 (600,700,"So what about a flat one?"),
 (700,790,"Less air, less push. The rubber just bends,"),
 (790,870,"and the energy leaks out as heat and sound."),
 (870,960,"Bonus: a ball left out in the cold bounces lower,"),
 (960,1040,"because the cold air inside pushes weaker."),
 (1040,1120,"Warm it back up, and the bounce comes back."),
 (1120,1200,"Those little bumps? Grip, for your fingertips."),
 (1200,1290,"So every dribble is squeezed air shoving back."),
 (1290,1368,"Straight up, it rides on air."),
 (1368,1440,"And now you know...")]
SAY={1:"The real MVP? The air you pumped in."}
SPD={16:0.9}
GROUPS={}
VO_DELAY={0:0.02}
SFX=[(0,'ball_bounce'),(36,'ball_bounce'),(72,'lib_whoosh_fast'),(84,'lib_pop_bubble'),(156,'lib_whoosh_fast'),(240,'lib_whoosh_fast'),
     (320,'ball_bounce'),(330,'lib_record_scratch'),(350,'lib_pop_bubble'),(420,'lib_whoosh_fast'),(432,'lib_spring_twang'),(504,'lib_whoosh_fast'),
     (528,'ball_bounce'),(576,'ball_bounce'),(600,'lib_whoosh_fast'),(652,'ball_flat_thud'),(660,'lib_sad_trombone'),
     (700,'lib_whoosh_fast'),(790,'lib_whoosh_fast'),(870,'lib_whoosh_fast'),(885,'ball_bounce'),(915,'ball_bounce'),(945,'ball_bounce'),
     (960,'lib_whoosh_fast'),(1040,'lib_whoosh_fast'),(1064,'ball_bounce'),(1112,'ball_bounce'),(1120,'lib_whoosh_fast'),(1130,'lib_ding'),
     (1200,'lib_whoosh_fast'),(1224,'ball_bounce'),(1260,'ball_bounce'),(1296,'ball_bounce'),(1332,'ball_bounce'),(1368,'ball_bounce'),(1404,'ball_bounce')]
def frame(f):
    pop=None
    if 432<=f<470: pop={'x':120,'y':150,'s':min(1,(f-432)/4+.3),'text':'BOING!'}
    elif 652<=f<700: pop={'x':120,'y':330,'s':min(1,(f-652)/4+.3),'text':'SPLAT.'}
    badge=None
    if 870<=f<1040: badge='COLD'
    elif 1040<=f<1120: badge='WARM'
    return {'T':T(f),'cam':dict(zip(('cx','cy','w'),kv(CAM,f))),
            'hl':[{'part':h[2],'label':h[3],'dx':h[4],'dy':h[5]} for h in HL if h[0]<=f<h[1]],
            'cap':(at(CAPS,f) or (0,0,''))[2],'badge':badge,'pop':pop}
if __name__=='__main__':
    cmd=sys.argv[1]
    if cmd=='render': render(sys.modules[__name__],sys.argv[2])
    elif cmd=='frames': render(sys.modules[__name__],sys.argv[3],[int(x) for x in sys.argv[2].split(',')])
