# Research: retractable click pen (rotating cam)

## Sources (mechanism)
- Penvibe, "Engineers Explain How Click Pens Work": https://penvibe.com/how-pens-work/
  - Parts: "the cam body a plunger and stop members".
  - Press "drives the plunger and the cam body downwards below the fixed stop members"; the cam rotates and "you can hear the first click".
  - Release: the spring pushes back up, "which allows the cam body to rotate another 45 degrees and strike the blue stop members". "There is now a second audible click"; the refill is "fully extended and locked in place".
  - "Pressing the push-button again restarts the sequence but this time the pen refill will be retracted when you release".
- Ben Lau (CUNY), technical description of a click gel pen: https://benlauengr.commons.gc.cuny.edu/technical-description/
  - Plunger has "sharp teeth"; cam body "has angled teeth surrounding it"; stop members sit inside the upper barrel and "do not move".
  - Press: "the plunger slides down the angled teeth of the cam body, rotates the cam body, and strikes it to produce a click."
  - Release: the spring (in the lower barrel) "will extend and push the cartridge up"; the cam rotates again, "strikes the stopper and creates the second click. Now, the cam body is locked in place".
  - Second press: pushed past the stops again, released, and the cartridge is fully retracted.
- US 3,205,863 "Writing instrument", N. K. Rhoades, The Parker Pen Company (filed 1953): https://patents.google.com/patent/US3205863
  - Rotating cam body with helical cam surfaces, fixed stop tabs; writing position = shallow recess, retracted position = deeper recess. Rotation in one direction only.
- US 5,997,204 "Retractable ball-point pen", Y. Ducrocq, BIC (filed 1997): https://patents.google.com/patent/US5997204
  - Ribs, saw-teeth ("eight saw-teeth and four grooves"), ramped rib ends. Retracted: rib inside a long axial groove. Writing: rib held at the base between two teeth.
  - Spring acts through the ink tube and pushes rearward.
- Machined Pens, "Mechs Explainer Part 1": https://machinedpens.substack.com/p/coming-soon
  - "The spring sits on the shoulder of the refill"; the spring is what pushes the refill back up.
- Context: Wikipedia, Retractable pen: https://en.wikipedia.org/wiki/Retractable_pen (bistable cam system; one position retracted, one extended).

## Disagreements and choices
- Spring position: Penvibe mentions a spring "at the top"; Ben Lau, Machined Pens and US5997204 put the return spring on the refill near the tip. We draw one spring on the refill shoulder in the lower barrel (the simpler claim most sources support).
- Rotation per step: only Penvibe gives a number (45 degrees). The script says "a little twist" and gives no angle.
- Part names differ (thruster / cam body / rotor; stop members / ribs / guide). Script uses "button", "cam", "stops", "ribs", "short step", "long slot".

## Reference images and shape facts
- Image downloads from patentimages and Wikimedia were blocked by this session's network policy, so drawings were not viewed directly. Shape facts come from the figure descriptions and patent text above:
  - Ben Lau Fig 4 colour key (plunger white, stop member blue, cam orange, cartridge gray) and Figs 5 to 9 step positions: plunger on top, cam below it, stops fixed to the barrel wall, refill below the cam.
  - US5997204: saw-teeth all face the same way (one-way rotation), ramped rib ends, long grooves alternate with tooth bases.
  - US3205863: two alternating rest depths, shallow (tip out) and deep (tip in).
- Drawing rules used: button/plunger on top with a sawtooth bottom, cam with angled ribs below it, stops are fixed parts of the barrel wall with sloped bottom ends, a short step and a long slot alternate around the barrel, spring around the refill sits on a collar and pushes up, the tip pokes out about one cam-step when locked.
- Directing refs: Animagraffs-style cutaway (one part lit per beat); Bill Hammack, engineerguy "How a retractable pen works" (2015), cited by Make and Hackaday.

## Script claims check
| Claim | Sources |
|---|---|
| Spring sits on the ink tube and pushes it back up | Ben Lau, Machined Pens, US5997204 |
| Press shoves the cam down past the stops | Penvibe, Ben Lau |
| Angled teeth twist the cam | Ben Lau, Penvibe (rotation), US5997204 (saw-teeth) |
| On release it twists again and catches on a short step: tip stays out | Penvibe, Ben Lau, US3205863 (shallow recess) |
| Next click: it twists into a long slot: tip goes in | US3205863 (deep recess), US5997204 (groove), Penvibe |
| Two clicks: one going down, one as it locks | Penvibe, Ben Lau |
