# Research: what RAM actually does (DRAM cells: a capacitor bucket and a transistor gate per bit, leaks, refresh about every 64 ms, loses everything without power, reading drains a cell so it is written back)

Trend: RUSH item from the trend scout 2026-11-02 18:50Z (score 7): tape "sam altman ram" 1000+, RAM shortage memes and price spike stories. Deadline Thu Nov 5. Safety: a real person is in the story; never named or shown, described only as "the RAM shortage" (and not even mentioned in the video itself).
Live trend check this run (2026-11-03): search "RAM shortage price spike November 2026" returns ongoing coverage, e.g. Tom's Hardware "CyberPowerPC announces RAM price hikes coming to the U.S. and the U.K. starting December 7th, prebuilt proprietor cites 500 percent increase in memory cost", TechRadar "RAM to see meaningful price increases before 2026 is out", PC Gamer (Silicon Motion CEO: DRAM, HBM, NAND all in severe shortage in 2026).
Context source read: Tom's Guide, Jason England, "RAM prices keep going up: what is RAMageddon", Feb 23, 2026: https://www.tomsguide.com/computing/ram-price-crisis-2026-everything-you-need-to-know ("AI and data centers have been the leading force behind the massive surge in demand"; "consumer RAM has climbed hundreds of percent"). Not used in the script (no price claims in the video).
Category: Computer / desk (new category, no repeat this week).

## Sources (mechanism)
- halbleiter.org, "DRAM cell" (Semiconductor Technology from A to Z): https://www.halbleiter.org/en/digital-technology/dram-cell/
  - "A single NMOS transistor is enough to selectively connect this capacitor to the bit line or isolate it from it, hence the name 1T1C cell (one transistor, one capacitor)."
  - "Its gate connects to the word line, and its source-drain path connects the storage capacitor to the bit line."
  - "the stored charge is not stable. It slowly leaks away through parasitic paths, which is why every cell must be refreshed periodically"
  - "Typical DRAM devices must refresh every cell roughly every 64 milliseconds"
  - "reading a DRAM cell is destructive and makes this 'rewrite' mandatory." The sense amplifier "drives the original capacitor, via the activated word line, back to its full level."
  - "main memory is therefore built almost exclusively from DRAM."
- DEV Community, "How DRAM Works: The 64ms Memory Refresh Cycle" (updated 2026-11-01): https://dev.to/doogal/how-dram-works-the-64ms-memory-refresh-cycle-1kkn
  - "Every bit of data lives inside a cell made up of just two components: a single transistor and a single capacitor."
  - "When the bucket is full of electrons, it represents a binary 1. When it is empty, it represents a binary 0."
  - "Roughly every 64 milliseconds" the memory controller refreshes every cell.
  - "turning off the power stops the refresh immediately. The capacitors leak their remaining charge in a fraction of a second, and all data is permanently lost."
- Tried and failed (fetch permission timeouts): Wikipedia "Dynamic random-access memory" and "Memory refresh", Crucial, Kingston, Intel RAM explainers.

## Claim check (script line -> source)
- "Cord yanked... and your work is just gone?" -> dev.to (power off: refresh stops, all data permanently lost). Shown on an unplugged desktop (no battery).
- "It's called RAM. It's your computer's main memory." -> halbleiter ("main memory is ... built almost exclusively from DRAM").
- "billions of tiny buckets called capacitors" -> halbleiter and dev.to (one capacitor per bit). Billions: 16 GB = 137 billion bits (own arithmetic, 16 x 2^30 x 8). Bucket is the dev.to analogy.
- "Full bucket means one. Empty means zero." -> dev.to.
- "A tiny gate, a transistor, opens to fill or read it." -> halbleiter (transistor connects the capacitor to the bit line, gate on the word line).
- "every bucket leaks. Wait too long and your ones fade into zeros." -> halbleiter (charge leaks away, must be refreshed).
- "RAM tops up every bucket, about every 64 milliseconds." -> halbleiter and dev.to (roughly every 64 ms). Simplified: the memory controller and chip do it, said as "RAM".
- "over a million times a day" -> derived: 86,400 s / 0.064 s = 1,350,000 refreshes per cell per day (counter shows 1,350,000).
- "pull the power, and the refills stop. Every bucket drains." -> dev.to.
- "even reading a bucket drains it, so RAM refills it right after every read." -> halbleiter (destructive read, written back to full level).
- "Lightning fast, always leaking. Hit save." -> leaking from both sources; "fast" is general; "Hit save" is advice, not a claim.
- Not claimed (unverified): the 32 ms hot-temperature refresh, electron counts, prices.

## Reference shapes (ATM)
Image fetches were blocked this run, so the drawing follows the text descriptions above plus the standard look of a desktop memory module.
- Amati: 1T1C schematic = vertical bit line, horizontal word line, transistor between the bit line and the capacitor, gate tied to the word line. Memory module = long green board, a row of black chips, gold edge contacts with an off-centre key notch, retention notches at both ends.
- Tiru: grid of cells on word lines (rows) and bit lines (columns); stick with 8 chips, gold fingers and the notch.
- Modifikasi: the capacitor is drawn as a water bucket (dev.to's own analogy) so leak and refill read at phone size; the refresh is a cobalt bar sweeping the columns; a read lights the bit line and drains the bucket.
