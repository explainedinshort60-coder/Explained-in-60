# Research: fridge light (door switch: spring-loaded plunger, movable contact, two fixed contacts)

Demand: demand/board.md 2026-11-02 shows "fridge light" as NO DATA (no chart yet, supply 40), no RUSH and no BUY on the board. Picked as backlog item 2 (evergreen, Kitchen). Backlog item 1 (phone battery in the cold) is earmarked by the weekly review for Sat Nov 7 or the first Nov 9 to 14 slot, so it was left for that slot.

## Sources (mechanism)
- EngineerFix, "Why Your Refrigerator Light Stays On When the Door Is Closed": https://engineerfix.com/why-your-refrigerator-light-stays-on-when-the-door-is-closed/
  - Switch is "typically a small plunger or lever located within the refrigerator frame, usually near the door gasket."
  - "the door frame compresses the switch plunger, physically interrupting the electrical flow to the bulb."
  - "When the door is opened, the switch is released, which completes the electrical circuit and allows power to flow to the bulb".
  - Test: "manually press the plunger in. If the light does not turn off when fully depressed, the switch is likely faulty".
  - "On some modern units, this same switch may also ... stop the evaporator fan from running."
- Fix.com, refrigerator switches: https://www.fix.com/parts/appliance/refrigerator/switches/
  - "When the door to your fridge is closed, the button on the switch is pressed down, which breaks the circuit and turns the lightbulb off."
  - "spring loaded"; "when the fridge door depresses the button there is no continuity and the light turns off. When the fridge door opens and the button is released, there is continuity, and the light turns on."
- LG service manual, door switch: https://reliableparts.net/wp-content/macreliabletechtips/RF_LMX28983/files/door_switch.html
  - "With the switch plunger pushed in, there should be infinite resistance. With the plunger released, there should be 0 ohms resistance." "(Door closed, switch open, light off.)"
- US patent 5,847,343 (Daewoo, refrigerator door push button switch, expired): https://patents.google.com/patent/US5847343A/en
  - Conventional "door switch 110 of a plunger shape" on the cabinet front, "pressed down by the inner surface of the ... door".
  - Button carries "movable contact member" parts that touch or separate from "a couple of ... fixed contact members"; "compression coil spring 31" pushes the button out when the door opens.
  - Door closed: fan motor driven and "cabinet lamp 34" off; door open: "the fan motor 33 is stopped, and simultaneously, the cabinet lamp 34 is turned on."
- US patent 4,514,603 (door operated switch assembly, expired): https://patents.google.com/patent/US4514603 (plunger moves a contact blade away from a fixed blade when the button is depressed: secondary support).
- Search attempted but failed: Sears PartsDirect light switch article (fetch error).

## Disagreements and choices
- Inside the switch, designs differ (contact members on the button in US5847343, a contact blade pushed by the plunger in US4514603). The script says "a metal bridge right under two contacts", the US5847343 layout (one movable contact member closing across a pair of fixed contacts), drawn as a simplified top-view cutaway.
- Fan: only "some" fridges (EngineerFix "on some modern units", the Daewoo patent design). Script says "On some fridges".
- Stuck light: EngineerFix gives the switch as the thing to test first; script says "Check that button first", not "it is always the switch".
- Real switches sit on the side or top of the frame ("side or top of the door frame", EngineerFix). We put it on the latch-side frame at mid height so the host can press it on camera.

## Reference images and shape facts (ATM)
- Image downloads were not attempted (text-only fetch in this run, as in earlier runs). Shape facts come from the sources: small white plastic plunger button in a housing that snaps into the liner (Fix.com, EngineerFix), plunger shape with spool and compression coil spring (US5847343), contact blade layout (US4514603).
- Drawing rules: front view fridge with a hinged door (left hinge), small ivory button on the latch-side frame; top-view cutaway card with the door slab swinging on its hinge, plunger, coil spring, metal contact bar and two fixed contacts, wired in series with the bulb.
- Directing refs: Animagraffs-style one-part-lit-per-beat cutaways; the classic "does the fridge light really go off" curiosity (x-ray through a closed door instead of a camera inside).

## Script claims check
| Claim | Sources |
|---|---|
| A button on the frame does it | EngineerFix, Fix.com, US5847343 |
| Plunger, spring behind it | Fix.com (spring loaded), US5847343 (compression coil spring), EngineerFix (plunger) |
| Metal piece bridges two contacts when released | US5847343 (movable contact member, pair of fixed contacts), LG (0 ohms released) |
| Shutting the door pushes the plunger in and breaks the circuit, light off | EngineerFix, Fix.com, LG |
| Pressing the button by hand turns the light off | EngineerFix test |
| On some fridges the same switch shuts the fan off while the door is open | US5847343, EngineerFix |
| Light on with the door shut: check the switch first | EngineerFix |
