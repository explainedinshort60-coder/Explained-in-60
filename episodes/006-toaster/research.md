# Research: pop-up toaster (lever, rack, spring, electromagnet hold, timer chip, darkness control)

Demand: demand/board.md 2026-11-02 shows "toaster" as NO DATA (no chart yet, supply 45), no RUSH and no BUY. Picked as the next backlog item after 004 (fridge light) and 005 (escalator handrail); backlog item 1 (phone battery in the cold) stays earmarked by the weekly review for Sat Nov 7 or the first Nov 9 to 14 slot. Lane: evergreen. Category: Kitchen (second Kitchen topic this week, the cap is 2).

## Sources (mechanism)
- Wikipedia, "Toaster": https://en.wikipedia.org/wiki/Toaster
  - "A lever on the side of the toaster is pressed down, lowering the bread into the toaster and activating the heating elements."
  - "The completion of toasting may be determined by a timer (sometimes manually set) or by a thermal sensor, such as a bimetallic strip".
  - "when an internal device determines that the toasting cycle is complete, the toaster turns off and the toast pops up out of the slots."
  - "The length of the toasting cycle (and therefore the degree of toasting) is adjustable via a lever, knob, or series of pushbuttons."
  - Heating elements "often made of nichrome wire."
- US patent application 2012/0097044, "Anti-burn/anti-jam electric toaster with electromagnetic latch": https://patents.justia.com/patent/20120097044
  - "The coil of the electromagnet is supplied with current during the toasting operation in order to hold the toasting carriage in a lowered position."
  - "A ferrous part 29 is fixed to the latching block 25 for cooperating with the electromagnet 17."
  - "At the same time as being lowered the toasting carriage makes switch contacts for energising toaster elements".
  - "Adjustment is accomplished by varying a time constant by means of a manually variable resistor".
  - "At the end of the toasting time the controller 56 stops the latching signal ... thereby opening the circuit powering the electromagnet"; "the supply of current to the electromagnet is stopped, and the toasting carriage rises" (background: under the action of the spring).
- Restarters wiki, "Toasters": https://wiki.restarters.net/Toasters
  - "the lever is held down against the spring by an electromagnet"
  - The timer is an oscillator and counter; "A control adjusts this frequency and hence the toasting time."
  - "An electromechanical or electronic timing mechanism pops up the toast and switches off the heater after a length of time determined by the browning control."
  - "In the oldest toasters the lever is held down at the bottom of its travel by a catch."
- Hackaday, "The surprising tech of a cheap toaster": https://hackaday.com/2019/03/27/the-surprising-tech-of-a-cheap-toaster
  - "The lever turns on the power which turns on an electromagnet."
  - "The darkness control sets the frequency ... and the timer asserts the output until the timer expires."
- US patent 2,667,828 (Sunbeam, "Automatic toaster", 1954, expired): https://patents.google.com/patent/US2667828A/en
  - Background: the carriage "is releasably latched in such toasting position" and moving it stresses an energy storage means; "Automatic means are provided to release the carriage when the toasting operation is completed whereby the energy storage means is released to cause so-called pop-up action."
- Tried and failed: HowStuffWorks toaster pages (empty response), explainthatstuff toasters (fetch error).

## Claim check (script line -> source)
- "it's not watching. It's counting." -> Restarters (oscillator plus counter sets the time), Hackaday (timer), Justia (time constant). Scope: the toaster in the episode is the common electromagnet and timer type; Wikipedia notes some toasters use a thermal sensor instead, so the description says "your toaster" about this type and the bonus says "a magnet toaster".
- "Push the lever. The rack drops, and stretches a spring that wants it back up." -> Wikipedia (lever lowers the bread), Restarters ("held down against the spring"), US2667828 (energy storage released for pop-up).
- "a metal plate meets an electromagnet. Click. It holds." -> Justia (ferrous part cooperating with the electromagnet; current holds the carriage down), Restarters, Hackaday.
- "The wires start glowing." -> Justia (lowered carriage makes switch contacts energising the elements), Wikipedia (nichrome elements).
- "a little timer chip counts down." -> Restarters, Hackaday (integrated timer), Justia (controller).
- "Your darkness knob just changes how long it counts." -> Justia (variable resistor sets the time constant), Restarters and Hackaday (control sets the frequency and so the time), Wikipedia (knob adjusts the cycle length).
- "the chip cuts power to the magnet. The spring wins." -> Justia (opens the circuit powering the electromagnet, carriage rises), Restarters (pops up and switches off the heater).
- "unplug a magnet toaster, and the lever won't stay down." -> follows from Justia (current is what holds the carriage) and Restarters/Hackaday (the lever is held by the electromagnet, which the power turns on). Scoped to magnet toasters, since the oldest toasters used a mechanical catch (Restarters).
- The launch to the ceiling and the toast on the host's head are an obvious cartoon gag, not a claim.

## Disagreements and choices
- Timer electronics differ (RC time constant in the Justia design, oscillator plus counter in the Restarters description). The script only says "timer chip counts down" and "the knob changes how long it counts", which both support. No capacitor claim.
- Some toasters sense heat (bimetal strip) instead of timing. The script is about the electromagnet type and says "a magnet toaster" in the bonus.

## Reference images and shape facts (ATM)
- Justia 2012/0097044 drawings and description: carriage on a vertical guide at one end, latching block with a ferrous part meeting an electromagnet at the bottom of travel, switch contacts closed by the lowered carriage, controller board with a variable resistor. Copied: guide rod at the lever end, plate on the slider, magnet at the bottom, chip board low inside the case.
- Typical two-slot pop-up toaster (front view): rounded box, slots on top, lever in a vertical slot at one end, a darkness knob on the front. Copied as drawn; nichrome drawn as zigzags beside the slice.
- Modified (show style): cobalt body with an x-ray mode, a countdown ring floating above the toaster tied to the chip by a dashed line, toast that gets a face when it flies.
