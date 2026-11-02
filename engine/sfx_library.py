"""One-time ElevenLabs sound library generator for Explained in 60 (needs ELEVENLABS_API_KEY and api.elevenlabs.io allowed).
Generated on a paid (Creator) plan, so the files are licensed for commercial use. Resumable: skips files that exist.
Usage: python3 engine/sfx_library.py [--only name1,name2]"""
import os, sys, json, time, urllib.request, urllib.error
HERE=os.path.dirname(os.path.abspath(__file__)); OUT=os.path.join(HERE,'sfx','lib')
# name: (prompt, duration_seconds or None, loop, tags)
LIB={
 # brand
 'sting_intro_a':("Short upbeat podcast intro sting, bright plucky synth arpeggio rising into a playful drum hit, modern YouTube explainer vibe",3.0,False,'brand'),
 'sting_intro_b':("Quirky cartoon intro jingle, bouncy bass, snappy snare, ends with a cheerful cymbal hit",3.0,False,'brand'),
 'sting_intro_c':("Lo-fi podcast intro: vinyl crackle, warm Rhodes chord, soft kick and clap, short and catchy",3.5,False,'brand'),
 'sting_outro_a':("Short playful outro button, two quick xylophone notes and a soft cymbal tap",1.5,False,'brand'),
 'bed_lofi_loop':("Very light lo-fi hip hop beat loop for background under talking, soft kick, mellow keys, no melody lead",20.0,True,'bed'),
 'bed_funk_loop':("Light funky bass groove loop for a comedy podcast, quiet and unobtrusive, steady tempo",20.0,True,'bed'),
 'room_tone_loop':("Quiet small podcast studio room tone, faint air, no voices",10.0,True,'ambience'),
 # transitions
 'whoosh_fast':("Fast clean whoosh transition",0.8,False,'transition'),
 'whoosh_deep':("Deep cinematic whoosh swipe",1.2,False,'transition'),
 'swish_pop':("Quick swish ending in a soft pop, cartoon UI",0.7,False,'transition'),
 'zoom_in':("Cartoon zoom-in swoop sound",0.8,False,'transition'),
 'pop_bubble':("Single bubbly pop, cute",0.4,False,'ui'),
 'text_pop':("Snappy pop for a caption appearing on screen",0.4,False,'ui'),
 'ding':("Bright single notification ding, idea moment",0.8,False,'ui'),
 # comedy
 'rimshot':("Drum rimshot ba dum tss",1.5,False,'comedy'),
 'sad_trombone':("Sad trombone wah wah wah waaah",2.5,False,'comedy'),
 'record_scratch':("Vinyl record scratch stop",0.8,False,'comedy'),
 'crickets':("Awkward silence crickets chirping at night",2.5,False,'comedy'),
 'laugh_small_crowd':("Small studio audience laughing briefly",2.0,False,'comedy'),
 'laugh_big_crowd':("Studio audience bursting into big laughter",3.0,False,'comedy'),
 'ooh_crowd':("Small crowd going oooh in surprise",1.5,False,'comedy'),
 'gasp_crowd':("Crowd gasping in shock",1.2,False,'comedy'),
 'bass_boom':("Deep dramatic bass boom hit for a comedic reveal",1.5,False,'comedy'),
 'boing':("Cartoon spring boing",0.8,False,'comedy'),
 'slide_whistle_down':("Slide whistle going down, cartoon fall",1.2,False,'comedy'),
 'slide_whistle_up':("Slide whistle going up, cartoon rise",1.0,False,'comedy'),
 'honk':("Single clown horn honk",0.6,False,'comedy'),
 'dramatic_sting':("Dramatic orchestral dun dun dunnn sting",2.5,False,'comedy'),
 'cash_register':("Cash register cha-ching",1.0,False,'comedy'),
 'glitch':("Short digital glitch stutter, brain buffering",1.0,False,'comedy'),
 'fart_tiny':("Tiny comedic squeaky toot, cartoonish, not gross",0.7,False,'comedy'),
 # bathroom / home mechanisms
 'toilet_flush':("Toilet flush with strong swirl and drain, close up",4.0,False,'bathroom'),
 'toilet_gurgle':("Toilet gurgle at the end of a flush as air enters the pipe",1.8,False,'bathroom'),
 'tank_refill':("Toilet tank refilling with water hiss, then valve shuts off with a click",4.0,False,'bathroom'),
 'water_drip':("Single water drip in a sink",0.6,False,'bathroom'),
 'faucet_on':("Faucet turning on, water running briefly",1.5,False,'bathroom'),
 'fridge_door':("Refrigerator door opening with a seal pop, then hum",1.5,False,'kitchen'),
 'microwave_beep':("Microwave finishing beep beep beep",1.5,False,'kitchen'),
 'toaster_pop':("Toaster popping up toast",1.0,False,'kitchen'),
 'kettle_whistle':("Kettle whistle starting",2.0,False,'kitchen'),
 'can_opener':("Manual can opener cranking around a can",2.0,False,'kitchen'),
 'barcode_beep':("Supermarket barcode scanner beep",0.5,False,'store'),
 'pen_click':("Ballpoint pen click click",0.6,False,'office'),
 'zipper':("Zipper zipping up quickly",1.0,False,'clothing'),
 'door_latch':("Door closing with latch click",1.0,False,'home'),
 'light_switch':("Light switch click",0.4,False,'home'),
 'mech_click':("Small mechanical click, plastic and metal",0.4,False,'mechanism'),
 'mech_clunk':("Heavy mechanical clunk of a lever",0.6,False,'mechanism'),
 'spring_twang':("Metal spring twang",0.7,False,'mechanism'),
 'gear_ratchet':("Gear ratchet clicking",1.0,False,'mechanism'),
 'button_press':("Satisfying button press click",0.4,False,'mechanism'),
 'electric_zap':("Small electric zap spark",0.6,False,'mechanism'),
 'air_hiss':("Short pressurized air hiss release",1.0,False,'mechanism'),
 'cork_pop':("Champagne cork pop with fizz",1.5,False,'seasonal'),
 'firework_small':("Single small firework whistle and pop",2.0,False,'seasonal'),
 'turkey_timer_pop':("Tiny plastic pop of a button springing up",0.4,False,'seasonal'),
 'wind_cold':("Cold winter wind gust",2.5,False,'seasonal'),
 'crowd_stadium':("Short stadium crowd cheer",2.5,False,'seasonal'),
}
def gen(name,prompt,dur,loop):
    key=os.environ['ELEVENLABS_API_KEY']; body={'text':prompt,'prompt_influence':0.5,'loop':loop,'model_id':'eleven_text_to_sound_v2'}
    if dur: body['duration_seconds']=dur
    req=urllib.request.Request('https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128',data=json.dumps(body).encode(),
        headers={'xi-api-key':key,'Content-Type':'application/json'},method='POST')
    with urllib.request.urlopen(req,timeout=120) as r: data=r.read(); cost=r.headers.get('character-cost')
    open(os.path.join(OUT,name+'.mp3'),'wb').write(data); return cost
if __name__=='__main__':
    os.makedirs(OUT,exist_ok=True); only=None
    if '--only' in sys.argv: only=set(sys.argv[sys.argv.index('--only')+1].split(','))
    idx_p=os.path.join(OUT,'index.json'); idx=json.load(open(idx_p)) if os.path.exists(idx_p) else {}
    for name,(prompt,dur,loop,tag) in LIB.items():
        if only and name not in only: continue
        if os.path.exists(os.path.join(OUT,name+'.mp3')): continue
        for attempt in range(3):
            try:
                cost=gen(name,prompt,dur,loop); idx[name]={'prompt':prompt,'duration':dur,'loop':loop,'tag':tag,'cost':cost,
                    'source':'ElevenLabs sound effects, generated on paid Creator plan (commercial license)','date':time.strftime('%Y-%m-%d')}
                print('ok',name,cost,flush=True); break
            except urllib.error.HTTPError as e: print('http',e.code,name,e.read()[:200]); time.sleep(3)
            except Exception as e: print('err',name,e); time.sleep(3)
        json.dump(idx,open(idx_p,'w'),indent=1)
    print('library size',len(idx))
