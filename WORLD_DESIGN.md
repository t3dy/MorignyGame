# MORIGNY — The World Layer

The abbey slice (`SLICE_SPEC.md`) is the inner loop. This document designs
the outer world: an Ultima V-style tile map of John's France, towns as
Pentiment-like narrative spaces, the Work's "reagent" system, and the
radical axis that can carry a run out of history — visibly.

## 1. The world map (U5-era presentation)

A tile world in the U5 idiom — small original tiles, a walking figure, a
moon... no: a *bell* clock — over the region John actually inhabited:

- **Morigny** — the abbey. Home tile; the whole inner game.
- **Étampes** — the market town at the abbey's door: supplies, rumor,
  lay confessions overheard, the world's noise.
- **Orléans** — the schools; the book trade; the "clerical underworld"
  (Kieckhefer's phrase): where the old art can be bought back into your
  life one quire at a time.
- **Sens** — the metropolitan see; ecclesiastical politics; where
  questions about a monk's book start becoming *procedures*.
- **Paris** — the university, the theologians, and in the end the fire of
  1323. The map's Mount Doom; every road bends there eventually.

**Tile art direction:** original pixel tiles (16×16, U5 stick-figure
plainness) in the grisaille palette with the earned-color rule intact —
vermilion for actionable, ultramarine only when the world itself turns
visionary (a tile-world vision is a palette event). We draw these
ourselves; U5's actual assets are copyrighted and wrong for us anyway.
Manifest rule applies: original tiles enter `assets_manifest.json` as
`status: invented, original art` with their reference sources listed.

**City leaves (the second register):** entering a town opens a *leaf* — a
historical map, veduta, drawing, or photograph-derived rendering of the
real place (engravings are mostly 16th-c. and later; monastic ruins and
churches photograph today). Per our anachronism rule these belong to the
**pencil layer**: the tile world is diegetic; the city leaf is the
apparatus showing you the real Étampes, dated on screen ("engraving,
1572 — two and a half centuries after John"). The player walks a 14th-c.
tile town while the pencil hand pins the real place beside it. That
double vision — game-world and document — *is* the game's thesis.

## 2. Towns as Pentiment surfaces

Towns run on **T (Talk)**: keyword conversation in the Ultima manner
(name, job, the bell's topics) but written in the three-hands register,
with NPCs as period types — the apothecary who knows what monks buy, the
stationer with a quire he shouldn't have, the archdeacon's clerk who asks
friendly questions and writes down the answers. Days spent traveling are
days of the horarium kept badly or well: the offices travel with you
(a monk saying None in a market square is *conspicuous* — suspicion and
sanctity are both visibility). Everything the abbey slice tracks
(pressure, purity, suspicion, despair) keeps running on the road; the
world layer is not a vacation from the simulation. It is the simulation
with witnesses.

## 3. The Mixing of the Work (reagent system, U4/U5/UW2 lineage)

Ultima's reagent mixing is the right *shape* and the wrong *substance* —
John's magic has no mandrake. The faithful translation: **the Work's
prayers are compounds whose reagents are states and acts**, prepared in
advance like Ultima spells are mixed before casting:

| Ultima | MORIGNY |
|---|---|
| Reagents | **Preparations**: confession current, fast kept, continence held, the appointed hour, the right figure copied and before you, licentia in hand |
| Mixing (with mortar, beforehand) | **Composing the exercise**: binding prayer + hour + figure + preparations into a scheduled observance — done at a desk, in advance, like mixing before the dungeon |
| Casting (a keypress in the moment) | **Performing** at the appointed hour (P); recitation quality decides potency |
| Fizzle (missing reagent) | **Silent invalidity** — the Work's fizzle is *undetectable at cast time*: a missing preparation voids the observance and you learn at the vision, or later, or never |
| Spell circles | **The procedures' stages**, gated by licentia rather than level |

Alongside it, literal materials exist where history puts them: the
**infirmary herbal** (an obedientiary garden, not a magic shop) — herbs,
electuaries, a sleeping draught that trades pressure now for a muddied,
dream-poor night. Medicine interacts with the Work (a drugged sleep
cannot seek a vision) without ever *being* it. UW2's improvisational
texture lives in travel: prayers said in wrong places, observances kept
in inns, the Work practiced out of its cloister — everything degrades,
and the degradation is content.

## 4. The Radical Axis (typical ↔ John ↔ the counterfactual Bruno)

A run has a **disposition axis**, moved by accumulated choices:

- **The Obedient** — refuse the Work's risks, keep the Rule only: the
  quiet life John didn't live. Valid, small, its own melancholy.
- **The Historical John** (center) — audacious *within* obedience: rewrite
  condemned magic while claiming the Virgin's own authorization. The
  documented path; the default; ends at 1323 and survives by transmission.
- **The Radical** — the player pushes John's own premises past where he
  took them: hostile answers to examiners, sarcasm at chapter, doctrine
  defended in public, the Work *taught openly*. Push far enough and the
  pencil hand draws a line in the margin: **"Here the witness departs
  from the record."** From that annotation on, the run is a marked
  counterfactual — a John who becomes a Giordano Bruno centuries early,
  with everything that implies about how such stories end. A (Attack) can
  go live out here, once, when they come for him — and the record of the
  counterfactual run is filed in the stemma as what codicology actually
  calls a **contaminated witness**.

Rules of the axis (extends `CLAUDE.md` rule 5):
1. The historical path is default and center-weighted; radical options
   are present but *cost* (they are radical in his world, price them so).
2. Counterfactual content never ships unmarked: the departure annotation
   is mandatory, in-fiction, and logged in the witness record.
3. Radical choices are built from John's **actual intellectual commitments**
   (visionary authorization, the licitness of his purified art, the right
   to rewrite) — extrapolated, never imported from modernity. He gets to
   be radical in 1315's terms, not ours.
4. The Obedient and Radical poles get the same writing care as the
   center. No strawmen at either end.

## 5. Build order

1. **Now (done in slice):** command alphabet, keyboard frame, message log,
   status sidebar — the U5 chassis around the codex.
2. **v2:** tile renderer + Morigny/Étampes maps, T-alk keyword system,
   preparations ("mixing") data model unifying the slice's purity gates.
3. **v3:** Orléans/Sens/Paris, the disposition axis, city leaves with
   sourced imagery, the marked-counterfactual machinery, 1323 in both
   registers.
