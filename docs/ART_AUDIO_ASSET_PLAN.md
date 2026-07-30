# MORIGNY — Art & Audio Asset Plan (v2/v3)

*2026-07-29. Companion to `ART_SOURCES.md` (pipeline + manifest schema,
which remain binding) and `AUDIT.md` §Asset Inventory. This plan lists
every non-writing asset the full campaign needs, its provenance route,
and its gating rule. Nothing here enters the repo without a complete
`assets_manifest.json` entry (CLAUDE.md rule 6). Currently the game is
typographic + procedural tiles only, and ships fine that way — every
item below is enhancement, not blocker.*

## 1. Original tile art (status: invented, original art)

| Asset | For | Notes |
|---|---|---|
| Orléans town tiles + gate | v2 | U5 plainness, grisaille; law-school & trade silhouettes |
| Sens town tiles (cathedral mass, palace) | v2 | the see reads as *weight* on the skyline |
| Paris tiles (bridges, university quarter, Notre-Dame mass) | v2 | largest map; the fire's home address |
| Scriptorium interior glyphs (desk, armarium press, lectern) | v3c+ | only if the stage ever goes tiled; currently typographic |
| Road variants (river crossings, forest, vineyard) | v2 | route texture Morigny→Orléans→Sens→Paris |

Each tileset: one manifest entry, reference sources listed (period forms
only, c. 1280–1330 northern France per rule 7).

## 2. City leaves (sourced historical imagery, pencil layer)

Per `WORLD_DESIGN.md` §1: the leaf is apparatus, honestly dated on
screen. Sourcing targets (all need archive-grade provenance before
entry):

| City | Candidate imagery | Date reality | Route |
|---|---|---|---|
| Étampes | Notre-Dame-du-Fort engravings; tower photographs | 16th c.+ / modern | public-domain scans; verify archive license |
| Orléans | veduta engravings; cathedral & schools | 16th c.+ | ditto |
| Sens | cathedral + synodal palace imagery | 13th-c. building, later images | ditto |
| Paris | Notre-Dame, university quarter engravings/maps | 16th c.+ (earlier maps exist) | ditto; the 1550 Truschet–Hoyau plan is a candidate, verify rights |
| Morigny | photographs of the priory site today | modern | may require own-photo or licensed image |

Gate: each leaf ships with `dateRange`, `screenDate` ("engraving, 1572 —
two and a half centuries after John"), license, and archive link in the
manifest. Processing to grisaille demotes `attested` → `adapted`,
recorded.

## 3. Figure/nota imagery (HIGH SENSITIVITY)

The ars notoria's *notae* and John's Book of Figures: **no invented
figure art presented as period**. Options, in order of preference:
1. Sourced manuscript reproductions with full provenance (R-2/R-8
   research: which MSS preserve figures, which are digitized, what the
   libraries' licenses allow).
2. Diagrammatic *shapes* (procedural, obviously schematic, grisaille)
   marked `invented, original art` — the stage's current typographic
   route, kept.
3. Nothing — the figure stays described, never shown. Always acceptable.

## 4. Audio (all optional, all manifest-gated)

| Asset | For | Route |
|---|---|---|
| Bell tones (hour changes; road bells) | v1+ | record/synthesize original; entry as invented |
| Ambient: choir hum, scriptorium quill/scrape | v3c | original foley; the scrape doubles for the palimpsest verb |
| Chant fragments | offices | ONLY public-domain recordings of public-domain chant with verifiable license; else synthesize plainly; register rule: never dramatic scoring — the game's silence is a feature |

## 5. Non-goals

- No character portraits (faces belong to the reader).
- No depiction of the Struggle in any medium, ever (STYLE_GUIDE).
- No AI-generated pastiche of period art presented as sourced; anything
  generated is `invented` and must look deliberately diagrammatic, not
  faux-medieval.
