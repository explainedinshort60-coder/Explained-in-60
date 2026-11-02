# Host and studio drawing functions from the Explained60 Podcast SVG pack (build.py)
N='#071747'; B='#2465ff'; O='#ff922b'; I='#fffdf4'
def svg(w,h,s): return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}"><g stroke-linecap="round" stroke-linejoin="round">{s}</g></svg>'
def path(d,fill='none',sw=8,stroke=N,extra=''): return f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" {extra}/>'
def rect(x,y,w,h,fill,r=0,stroke='none',sw=0): return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'
def text(x,y,t,size=32,color=N,anchor='middle'): return f'<text x="{x}" y="{y}" font-family="DejaVu Sans,sans-serif" font-weight="700" font-size="{size}" text-anchor="{anchor}" fill="{color}">{t}</text>'
def head(kind,exp='smile',gaze=0):
 c=B if kind=='blue' else O
 shape=rect(-115,-110,230,210,I,65,N,9) if kind=='blue' else f'<ellipse cy="-5" rx="117" ry="108" fill="{I}" stroke="{N}" stroke-width="9"/>'
 marks=path('M 65 -110 L 100 -85','none',19,c) if kind=='blue' else path('M -80 -102 L -65 -80 M -52 -115 L -36 -90','none',16,c)
 eyes=f'<g id="eyes" transform="translate({gaze} 0)"><ellipse cx="-36" cy="-10" rx="8" ry="17" fill="{N}"/><ellipse cx="36" cy="-10" rx="8" ry="17" fill="{N}"/></g>'
 if exp=='blink': eyes=path('M -46 -8 L -26 -8 M 26 -8 L 46 -8')
 mouths={'smile':path('M -27 35 Q 0 63 27 35'), 'talk':path('M -29 29 Q 0 40 29 29 Q 23 78 0 70 Q -23 68 -29 29',N), 'surprise':f'<ellipse cy="45" rx="17" ry="22" fill="{N}"/>','thinking':path('M -12 48 Q 5 39 24 45'),'blink':path('M -27 35 Q 0 63 27 35')}
 return f'<g id="head">{shape}<g id="accent">{marks}</g>{eyes}<g id="mouth">{mouths[exp]}</g></g>'
def host(kind,exp='smile',gaze=0):
 c=B if kind=='blue' else O
 return f'<g id="{kind}-rig">'+f'<g id="legs">{path("M -36 265 Q -44 315 -68 352 M 36 265 Q 48 315 72 352",sw=12)}{path("M -68 352 L -95 352 M 72 352 L 99 352",sw=22)}</g>'+f'<g id="arm-back">{path("M -55 122 Q -89 174 -82 231",sw=12)}</g>'+f'<g id="torso">{path("M -53 98 Q -68 153 -57 260 L 57 260 Q 68 153 53 98 Z",c)}</g>'+f'<g id="arm-front">{path("M 58 135 Q 88 192 103 171 Q 116 150 130 139",sw=12)}{path("M 130 139 Q 126 117 135 118 Q 141 120 142 135 Q 167 124 170 136 Q 172 149 146 155 Q 131 157 130 139",N,4)}</g>'+f'<g id="hand-rest">{path("M -95 234 Q -109 215 -85 214 Q -61 214 -68 235 Q -81 247 -95 234",N,3)}</g>'+head(kind,exp,gaze)+'</g>'
def place(s,x,y,k=1): return f'<g transform="translate({x} {y}) scale({k})">{s}</g>'
def mic(): return f'<g id="microphone">{path("M 0 25 L 0 120",sw=13)}<ellipse cy="125" rx="45" ry="13" fill="{N}"/>'+rect(-28,-65,56,100,N,26)+path('M -14 -40 L 14 -40 M -14 -20 L 14 -20 M -14 0 L 14 0',sw=6,stroke='#a8bacd')+'</g>'
def desk(w=1080): return '<g id="desk">'+rect(0,1100,w,240,'#e8c9a4',0,N,8)+'</g>'
def bg(): return '<g id="studio">'+rect(0,0,1080,1920,I)+rect(50,220,180,720,'#ede8df',32)+rect(850,220,180,720,'#ede8df',32)+'</g>'
def write(name,w,h,s): (P/(name+'.svg')).write_text(svg(w,h,s))

logo=rect(0,0,740,235,B,35)+text(370,95,'EXPLAINED',79,I)+text(370,192,'IN 60',85,I)
