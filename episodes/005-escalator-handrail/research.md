# Research: escalator handrail (one closed loop, end rollers, return run, friction drive from the main drive)

Demand: demand/board.md 2026-11-02 shows "escalator handrail" as NO DATA (no chart yet, supply 35, the lowest supply on the board), no RUSH and no BUY. Picked as the next backlog item: item 1 (phone battery in the cold) stays earmarked by the weekly review for Sat Nov 7 or the first Nov 9 to 14 slot, and item 2 (fridge light) was made as 004 earlier today. Lane: evergreen. Category: Street (first Street episode this week).

## Sources (mechanism)
- US patent 5,881,859 "Escalator handrail drive mechanism" (Bianchi, 1996, expired): https://patents.google.com/patent/US5881859
  - "its ends thereafter are joined to produce an endless or a closed loop"; "a supporting structure for guiding the handrail in a closed elongated loop."
  - "the handrail 22 is guided around the balustrade 20"; "The handrail has a lower return run 26."
  - Ends of the balustrade: "it is common practice to replace the guide 28 by guide rollers 30 at these ends."
  - "The motive force is provided by electric drive motor 32 which rotates outer sprocket wheel 34"; the handrail passes between driven belts and "The leaf spring 56 biases the pallet rollers 58 against the handrail 22."
  - Prior art: "a direct drive wheel to handrail contact drive assembly utilizes a pair of drive rollers which contact the handrail directly."
  - The problem it solves: "the handrails tend to slip with respect to the foot pieces" (the steps).
  - "conventional flexible construction having a C-shaped cross section."
- Designing Buildings Wiki, "Escalator": https://www.designingbuildings.co.uk/wiki/Escalator
  - "The handrail moves courtesy of a chain connected to the main drive gear by a series of pulleys."
  - The motor "also powers the moving handrail which is looped around a series of wheels and is configured so that it moves at a similar speed to the steps."
  - Material: "a blend of synthetic polymers and rubber".
  - Step speed "around 0.3-0.6 m (1-2 ft) per second".
- Interesting Engineering, "This is why escalator handrails move faster than the steps": https://interestingengineering.com/video/this-is-why-escalator-handrails-move-faster-than-the-steps
  - "designed from one giant rubber ring that flexes and stretches as it rolls around the system."
  - "This handrail is driven by a smooth-ish ring, which uses friction to move."
  - "the same friction that causes the handrail to move also wears the rubber out, stretching it out ... making it slightly longer and therefore slower than the steps."
- Tried and blocked by the fetch tool (not used): explainthatstuff.com escalators, HowStuffWorks escalator, Wikipedia "Escalator".

## Claim check (script line -> source)
- "It never ends. It's one rubber loop." -> US5881859 (closed loop), Interesting Engineering (one giant rubber ring), Designing Buildings (polymer and rubber).
- "Rollers swing it around the end" -> US5881859 (guide rollers at the balustrade ends).
- "it sneaks back underneath, upside down" -> US5881859 (lower return run). Upside down is geometric: a flat loop turned around an end comes back inverted.
- "a drive wheel grabs it. Rollers squeeze it tight, and friction pushes it along." -> US5881859 (drive rollers in direct contact, spring-biased pressure rollers), Interesting Engineering (uses friction).
- "That wheel is chained to the same motor as the steps." -> Designing Buildings (chain connected to the main drive gear; the motor also powers the handrail).
- "Hand and feet, same ride." -> Designing Buildings ("similar speed to the steps"), US5881859 (slip relative to the steps is the problem drives are built to avoid).
- "Worn rubber stretches, and the grip slips a little." -> Interesting Engineering (wear stretches the rubber, slightly slower than the steps), US5881859 (handrails tend to slip).
- The "4X" duck lap is labelled as sped up; nothing in the script claims a speed number.

## Disagreements and choices
- Interesting Engineering's headline says "faster", its text says stretched rails end up slightly slower. The script only says the hand can drift BEHIND (the slower case, which the article text and the patent's slip problem both support). No code tolerance number is claimed (not found in a source we could read).
- Where the drive sits differs by design (patent: on the return run; Designing Buildings: chain from the main drive gear). The drawing puts a drive wheel with two pressure rollers on the return run near the bottom, chained to a main drive sprocket and motor in the pit. The script does not say where in the escalator the motor is.
- Real return runs hide inside the balustrade base and truss; the drawing keeps the return inside the balustrade so it fits one cutaway.

## Reference images and shape facts (ATM)
- US5881859 FIG. 1 (side elevation of an escalator with balustrade, handrail, lower return run and drive): the handrail is a long flat loop over the balustrade, turning around both ends (newels), with the return run below the top run and the drive acting on the return run. Copied: loop shape, return run parallel under the top run, drive near the lower end on the return run.
- US5881859 description of the drive: driven belts on one side, spring-loaded pallet rollers pressing from the other side. Copied as one blue drive wheel plus two spring-arm pressure rollers.
- Designing Buildings: handrail "looped around a series of wheels", chained to the main drive gear. Copied as a sprocket on a motor shaft with a chain up to the drive wheel.
- Escalator side profile (common knowledge, matches the patent figure): about 30 degree incline, flat landings with comb plates at both ends, handrail roughly hip high above the step noses, glass balustrade between the handrail and the steps.
- Modified (show style): coral handrail as the color accent, steps with yellow tread edges, side cladding removed (cutaway) so the steps show, x-ray mode makes the balustrade see-through.
