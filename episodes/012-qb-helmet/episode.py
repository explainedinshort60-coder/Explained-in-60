"""Episode 012: How does the quarterback hear the play in his helmet? (coach headset, one-way radio to a tiny speaker by
the ear, cut off at 15 seconds on the play clock, one green-dot player per side, QB radios since 1994, defense since 2008).
Run: python3 episode.py render OUT_DIR   |   python3 episode.py frames 0,100,200 OUT_DIR"""
import os, sys, math
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'engine'))
from lib import *
HERE=os.path.dirname(os.path.abspath(__file__))
props_js=os.path.join(HERE,'props.js')
N=1440
def win(f,a,b,ri=6,ro=6):
    """0..1 envelope that is 1 inside [a,b) with ramps."""
    if f<a or f>=b: return 0.0
    return min(1,(f-a)/ri if ri else 1,(b-f)/ro if ro else 1)
def clock(f):
    if f<72: return 31-f/24,1,0
    if f<546: return 28,0.25,0
    if f<612: return 40,1,0
    if f<700: u=(f-612)/88; return 40-25*(u**1.6),1,0
    if f<870: return 15-(f-700)/24,1,1
    if f<1200: return 40,0.25,0
    return max(31,40-(f-1200)*9/216),1,0
def T(f):
    c,con,cred=clock(f)
    wv=max(win(f,0,72,0,0),win(f,180,474,10,8),win(f,612,701,8,0),win(f,1200,1440,10,0))
    if 1368<=f: wv=1
    cut=win(f,700,870,2,6)
    sp=(0.5+0.5*math.sin(f/2.2))*wv*(1 if (f<72 or 300<=f<474 or 612<=f<700 or f>=1200) else 0)
    xr=max(win(f,318,474,10,0),win(f,474,546,0,0),win(f,1200,1368,12,24))
    bub=max(win(f,0,72,0,0),win(f,1380,1440,8,0))
    bubT='SLANT LEFT!'
    if 490<=f<546: bub=win(f,490,546,6,6); bubT='COACH??'
    if 800<=f<868: bub=win(f,800,868,5,5); bubT='HUH?'
    rep=min(1,max(0,(f-488)/30)) if 484<=f<546 else 0
    dot=0.5+0.5*math.sin(f/3) if 880<=f<950 else 0
    lw=win(f,958,1200,10,8)
    lo=max(win(f,966,1030,6,6)*0.9,win(f,1036,1110,6,6))
    ld=max(win(f,976,1030,6,6)*0.9,win(f,1116,1200,6,6))
    return {'xr':xr,'wv':wv,'cut':cut,'sp':sp,'bub':bub,'bubT':bubT,'clk':c,'clkOn':con,'clkRed':cred,'dot':dot,'rep':rep,
            'lw':lw,'clkVis':0 if (72<=f<546 or 870<=f<1200) else 1,'lo':lo,'ld':ld,'mute':1 if 700<=f<870 else 0}
# ---------- camera (cx, cy, w) ----------
HOOK=(450,360,880)
CAM=[(0,HOOK,'io'),(71,(455,365,840),'io'),
     (72,(690,250,640),'cut'),(148,(695,245,600),'io'),
     (150,(620,270,600),'cut'),(238,(600,280,620),'io'),
     (240,(560,330,760),'cut'),(316,(500,350,740),'io'),
     (318,(400,370,580),'cut'),(394,(405,375,540),'io'),
     (396,(500,350,820),'cut'),(472,(495,350,800),'io'),
     (474,(450,330,640),'cut'),(544,(455,320,610),'io'),
     (546,(170,80,600),'cut'),(610,(165,80,560),'io'),
     (612,(430,360,940),'cut'),(700,(430,360,900),'io'),
     (708,(620,300,760),'cut'),(788,(625,300,720),'io'),
     (790,(505,360,930),'cut'),(868,(505,360,910),'io'),
     (870,(470,320,560),'cut'),(948,(480,315,520),'io'),
     (950,(1970,300,1080),'cut'),(1028,(1970,310,1040),'io'),
     (1030,(1675,430,640),'cut'),(1108,(1675,435,600),'io'),
     (1110,(2265,430,640),'cut'),(1198,(2265,435,600),'io'),
     (1200,(440,360,860),'cut'),(1284,(445,360,860),'io'),(1366,(450,360,880),'io'),(1440,HOOK,'io')]
def free(name='idle',**kw):
    p=pose(name); p.update(kw); return p
TALK=dict(expression='explaining',ra=-35,re=-55,rhand='open',head=-6)
H0=free(expression='explaining',la=75,le=-15,lhand='point',head=-10,ra=-40,re=-60,rhand='open')
POINT=free(expression='explaining',la=78,le=-12,lhand='point',head=-8)
FL=[free(expression='frustrated',la=150,le=-30,ra=-55,re=70,lhand='open',rhand='open',head=-8),
    free(expression='laughing',la=55,le=70,ra=-150,re=30,lhand='open',rhand='open',head=8)]
CK=[(0,H0,'io'),(36,free(expression='explaining',la=70,le=-20,lhand='point',head=-6,ra=-45,re=-70,rhand='open'),'io'),(71,H0,'io'),
    (72,free(**TALK),'cut'),(100,free('proud',expression='realization',head=-4),'io'),(148,free('proud',expression='realization',head=4),'io'),
    (150,free(expression='explaining',head=-8,ra=-150,re=-40,rhand='open'),'cut'),(238,free(expression='explaining',head=-10,ra=-145,re=-45,rhand='open'),'io'),
    (240,POINT,'cut'),(316,free(expression='explaining',la=82,le=-8,lhand='point',head=-12),'io'),
    (396,free(expression='explaining',la=80,le=-10,lhand='point',head=-8,ra=-30,re=-50),'cut'),(472,free(**TALK),'io'),
    (612,free(**TALK),'cut'),(690,free(expression='explaining',head=-8,ra=-150,re=-40,rhand='open'),'io'),
    (700,free(expression='explaining',head=-8,ra=-150,re=-40,rhand='open'),'io'),
    (708,free(expression='explaining',head=-6,ra=-150,re=-40,rhand='open'),'cut'),(740,free(expression='explaining',head=-12,ra=-150,re=-30,rhand='open'),'io'),
    (760,free(expression='surprised',head=-4,ra=-150,re=-40,rhand='open'),'io'),(788,free(expression='worried',head=4,ra=-150,re=-40,rhand='open'),'io')]
f=790
for k in range(10):
    CK.append((f,FL[k%2],'io')); f+=8
CK+=[(868,FL[0],'io'),
    (870,free(expression='curious',la=78,le=-12,lhand='point',head=-8),'cut'),
    (950,free(**TALK),'cut'),
    (1200,free(**TALK),'cut'),(1240,POINT,'io'),(1300,free('proud',expression='realization'),'io'),(1350,free(**TALK),'io'),(1400,H0,'io'),(1440,H0,'io')]
BL=[(50,3),(200,2),(430,2),(660,2),(1000,3),(1260,2),(1330,2)]
character=Character(CK,BL)

HL=[(80,148,'headset','HEADSET',-140,0),
    (160,238,'mic','MIC',-180,0),
    (252,316,'wave','RADIO',-80,0),
    (326,394,'speaker','SPEAKER',-200,0),(346,394,'receiver','RECEIVER',40,0),
    (410,472,'wave','ONE-WAY',-80,0),
    (556,610,'clock','PLAY CLOCK',40,0),
    (880,948,'dot','GREEN DOT',-200,0),
    (962,1028,'lineO','OFFENSE',-120,0),(976,1028,'lineD','DEFENSE',-100,0),
    (1040,1108,'lineO','QB',-30,0),(1120,1198,'lineD','DEFENSE',-100,0),
    (1214,1284,'speaker','SPEAKER',-200,0),(1226,1284,'headset','HEADSET',-80,0)]
CAPS=[(0,72,"Who's talking inside a QB's helmet?"),
 (72,150,"His coach. Live, mid-game."),
 (150,240,"The coach talks into this headset,"),
 (240,318,"and a radio signal zips it onto the field."),
 (318,396,"Tucked by his ear: a tiny speaker."),
 (396,474,"Here's the kicker: it only goes one way."),
 (474,546,"He can't answer back. Coach talks, he listens."),
 (546,612,"And there's a timer on it."),
 (612,708,"The play clock counts down from 40,"),
 (708,790,"and at 15 seconds, the radio cuts out."),
 (790,870,"Mid-sentence? Too bad. Coach is on mute."),
 (870,950,"So who gets the speaker? Find the green dot."),
 (950,1030,"One player on offense, one on defense."),
 (1030,1110,"Bonus: quarterbacks got radios in 1994,"),
 (1110,1200,"and defenses had to wait until 2008."),
 (1200,1284,"So that voice in his helmet is the coach..."),
 (1284,1368,"One-way, on a timer. Lowkey genius."),
 (1368,1440,"And now you know...")]
SAY={0:"Who's talking inside a quarterback's helmet?",8:"The play clock counts down from forty,",9:"and at fifteen seconds, the radio cuts out.",
     13:"Bonus: quarterbacks got radios in nineteen ninety-four,",14:"and defenses had to wait until two thousand eight.",17:"And now you know..."}
SPD={17:0.9}
GROUPS={}
VO_DELAY={0:0.02}
SFX=[(0,'lib_crowd_stadium'),(72,'lib_whoosh_fast'),(150,'lib_pop_bubble'),(240,'lib_whoosh_fast'),(318,'lib_whoosh_fast'),(326,'lib_ding'),
     (396,'lib_whoosh_fast'),(474,'lib_whoosh_fast'),(504,'lib_glitch'),(520,'lib_boing'),(546,'lib_whoosh_fast'),(556,'lib_mech_click'),
     (612,'lib_whoosh_fast'),(618,'lib_gear_ratchet'),(698,'lib_record_scratch'),(704,'lib_electric_zap'),(708,'lib_whoosh_fast'),
     (790,'lib_whoosh_fast'),(796,'lib_slide_whistle_up'),(826,'lib_boing'),(846,'lib_rimshot'),(870,'lib_whoosh_fast'),(880,'lib_ding'),
     (950,'lib_whoosh_fast'),(962,'lib_ooh_crowd'),(1030,'lib_whoosh_fast'),(1040,'lib_pop_bubble'),(1110,'lib_whoosh_fast'),(1120,'lib_pop_bubble'),
     (1200,'lib_whoosh_fast'),(1296,'lib_ding')]
def frame(f):
    pop=None
    if 520<=f<546: pop={'x':200,'y':-60,'s':min(1,(f-520)/4+.3),'text':'NOPE.'}
    elif 702<=f<760: pop={'x':260,'y':-80,'s':min(1,(f-702)/4+.3),'text':'BZZT!'}
    elif 800<=f<868: pop={'x':180,'y':-120,'s':min(1,(f-800)/4+.3),'text':'PLAN B!'}
    badge=None
    if 1030<=f<1110: badge='1994'
    elif 1110<=f<1200: badge='2008'
    return {'T':T(f),'cam':dict(zip(('cx','cy','w'),kv(CAM,f))),
            'hl':[{'part':h[2],'label':h[3],'dx':h[4],'dy':h[5]} for h in HL if h[0]<=f<h[1]],
            'cap':(at(CAPS,f) or (0,0,''))[2],'badge':badge,'pop':pop}
if __name__=='__main__':
    cmd=sys.argv[1]
    if cmd=='render': render(sys.modules[__name__],sys.argv[2])
    elif cmd=='frames': render(sys.modules[__name__],sys.argv[3],[int(x) for x in sys.argv[2].split(',')])
