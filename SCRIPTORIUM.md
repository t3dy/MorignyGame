# MORIGNY — The Scriptorium: Manuscript Production as Core Play

**Design plan for the manuscript system.** John's whole historical
significance is that he *wrote and rewrote a book*, and the book survived
him by being copied. So copying is not a side activity here — it is the
victory condition's machinery. This document plans the system; it is not
yet built. Research grounding is in §1; every claim carrying `verify`
belongs on the Research Queue in `BIBLIOGRAPHY.md`.

Ties into existing systems: `procedure.corrupt` (silent invalidity),
purity gating, suspicion, the Radical Axis, the witness/stemma meta-layer.

---

## 1. Research grounding

### The craft (well-attested, common to all medieval book production)
- **Support**: parchment/vellum — limed skins, scraped with a *lunellum*,
  stretched on a herse, pounced with pumice, chalked. Expensive: a big
  codex is a herd of animals. Hair side and flesh side differ in color and
  texture, and quires are arranged so like faces like (**Gregory's Rule**).
- **Structure**: bifolia nested into **quires** (gatherings), commonly
  quaternions (4 bifolia = 8 leaves). Pricked and ruled (plummet/lead
  point in this period) before writing. Quire signatures and catchwords
  keep the order.
- **Ink**: iron-gall — oak galls, copperas (iron sulfate), gum arabic,
  wine or water. It bites *into* the skin, which is why scraping leaves a
  ghost.
- **Pigments** (each with a real hazard, which is game design handed to us):
  **vermilion** (mercury sulfide — the rubricator's red), **ultramarine**
  (ground lapis, purified with wax and lye; ruinously costly),
  **verdigris** (copper + vinegar — corrodes through the leaf over time),
  **orpiment** (arsenic sulfide — poisonous, and reacts badly with
  lead- and copper-based pigments), **lead white**, **minium** (red lead).
- **Gold**: leaf laid on a gesso/bole ground and burnished with a
  dog-tooth or agate; or shell gold (powdered, painted). Gold is laid
  *before* pigment.
- **Tools**: quill (goose; a right-handed scribe prefers a left-wing
  feather, which curves away from the eye), **penknife** held in the off
  hand — to steady the leaf *and* to scrape errors out, awl, ruler,
  plummet, pumice.
- **Order of work**: text first, with **spaces left blank** for rubrics,
  initials, and figures; the rubricator and illuminator come after —
  which is why unfinished manuscripts survive with gaps. (A gap is
  evidence of intent. So is a filled one.)
- **Errors of copying** (named, because scribes named them):
  **homoeoteleuton/eyeskip** (the eye jumps between similar line-endings,
  and a whole passage vanishes), **dittography** (doubling),
  **haplography** (dropping a repeated element). Corrected by
  **expunctuation** (dots beneath the cancelled letters) and marginal
  insertions keyed with *signes-de-renvoi*.
- **Colophons**: the scribe's own voice at the end — famously complaining
  about the labor ("three fingers write, the whole body labors"). Our
  place for John's most direct address to the reader, and for the pencil
  hand to meet him there.

### The monastic setting
- **RB 48** structures the day as manual labor and *lectio divina*; books
  are issued at the start of Lent. The **armarius** keeps the *armarium*
  (book cupboard) and assigns work; the **sacrist** controls supplies.
- **Silence** governs the scriptorium; requests are made by sign.
- **Daylight only.** Many houses forbade candles near books and parchment
  — the fire risk was existential. This is the system's cruelest and most
  historically honest constraint: *the Work must be copied in the light,
  and the light is where you are watched.*
- Houses **inventoried** their books. An inventory is a search with a
  clerk's face on it. (Master Evrart, already in `data/npcs.js`, does
  inventories for the archdeacon. The threat is pre-installed.)

### Magic texts specifically
- The ***ars notoria*** is built on **figures (*notae*)** — full-page
  diagrams with prayers inscribed in and around them. The text is close to
  useless without them, and **an inaccurately copied figure invalidates
  the ritual**. Fidelity is not aesthetics here; it is efficacy.
- Its prayers include ***verba ignota*** — long strings of unknown
  "Hebrew/Greek/Chaldean" words. Because they carry no sense, **a scribe
  cannot self-correct them from meaning**; they garble catastrophically in
  transmission, and historically did. (This is the single best mechanic in
  the research: unintelligible text has no error-correction.)
- John's *Liber florum* has its own **Book of Figures**, and he revised the
  figure program between the Old and New Compilations. `verify` — pin to
  the Fanger–Watson edition.
- **Sophie Page, *Magic in the Cloister*** — monks acquired, catalogued,
  and *bound* magic texts alongside licit ones. **Camouflage by binding**
  is a documented survival strategy, not our invention.
- **Pecia**: at university towns (Paris, Bologna; Orléans is a law-school
  town in the same world) an approved exemplar was divided into *peciae*
  and **rented by the piece** to copyists. A rented exemplar has a
  **deadline** — copy fast, and fast copying is how errors get in. The
  clerical underworld's book-trade version of this is exactly how a monk
  gets three days with a text he should not have.

---

## 2. The core loop

```
ACQUIRE exemplar → PREPARE support & ink → RULE the quire →
COPY (verse by verse, the recitation loop's sibling) → CORRECT →
RUBRICATE / draw the FIGURES → BIND or leave loose → CONCEAL →
COPY OUT to another hand  ⇒  a WITNESS that may survive 1323
```

Copying reuses the **recitation loop's grammar** (`SLICE_SPEC.md`): a
sequence of units, distractions that interrupt, a quality grade at the
end. It is the same attention economy applied to the hand instead of the
mouth — and that parallel is the point: *scribere est orare*.

## 3. Systems

### 3.1 Exemplars and descent (the stemma made mechanical)
An exemplar is a record: `{ id, work, corruptions[], completeness,
provenance, hot }`. You copy *from* something, and **its errors are
inherited** unless caught. `hot` marks a text whose mere possession is
matter for a court.

Sources, each with a character:
| Source | Cost | Risk |
|---|---|---|
| The abbey *armarium* (licit texts) | requisition from the armarius | visibility, none serious |
| A brother's loan | a favor owed | he remembers |
| **Isabel** the stationer, Étampes (`data/npcs.js`) | coin | she notices what you ask for |
| **Orléans pecia**, rented by the quire | coin + a **deadline** | copying under a clock; errors bloom |
| John's own earlier redaction | free | the Old Compilation's errors are *his* |

### 3.2 The copying minigame (fidelity vs. speed vs. daylight)
Each quire is N units. Per unit the scribe chooses a **hand**:
- **Textualis, careful** — slow, low error, high fatigue in the fingers.
- **Cursive, quick** — fast, error-prone. What a deadline forces.
- **Trusting the exemplar** — copy without construing the sense: fastest,
  and **it cannot catch inherited errors**.

Error classes fire by hand and fatigue: *eyeskip* (silently drops a
passage — the player is not told), *dittography* (visible, correctable),
*verba ignota* garble (**double error rate, and never self-correctable**,
because sense cannot rescue it).

**Light** is the master constraint. Daylight units are plentiful but
public (suspicion accrues if the leaf on your desk is not the leaf you
were assigned). Night units require a candle: fire risk, and if seen, the
worst suspicion in the game.

### 3.3 Correction (*emendatio*)
A separate pass, gated on **reading with understanding** — which the
*verba ignota* deny you by construction. Expunctuation and marginal
insertion clean visible errors; **eyeskip is invisible until collation**
against another witness, which requires *having* another witness. The
first copy of anything is unverifiable. That is the horror of textual
transmission, and it is free content.

### 3.4 Figures and the silent invalidity
Drawing a *nota* is a distinct check — geometry, proportion, the inscribed
words in their right compartments. A failed figure sets the **existing
`procedure.corrupt` flag**: the copy *looks* finished, the procedure
worked from it seems to run, and the rot surfaces at the reckoning. This
reuses the discernment system's best idea (silent corruption revealed
late) with a completely different fiction, and it is historically exact.

Gold on a figure marks a licentia-authorized copy — the palette rule
(`INTERFACE.md`) already reserves gold for exactly this.

### 3.5 Materials, hazards, and the sacrist
Parchment, ink, and pigment are requisitioned (the sacrist notices),
bought in Étampes (coin, and Isabel remembers), or **scraped from an old
leaf** — the **palimpsest**, which is already the design's rewriting verb
(`INTERFACE.md` §Motion: the knife lifts the old reading, which remains
faintly visible forever). Under-text stays legible to the apparatus: the
Old Compilation showing through the New.

Pigment hazards are real and modeled: orpiment sickens the scribe who
grinds it carelessly and blackens where it touches lead; verdigris eats
through the leaf over sim-time, corrupting a *finished* copy months later.
Ultramarine is so costly that using it is itself a statement — and a
question someone may ask about a poor monk's private book.

### 3.6 Concealment and the inventory
Where a copy lives decides how it dies:
| State | Working speed | Survives an inventory? |
|---|---|---|
| Loose quires, unbound | fast to work on | hideable — but losable, and fragile |
| Bound into a licit codex (**Page's camouflage**) | slow to work on | usually — the spine lies for you |
| Shelved openly in the armarium | fastest | no |
| Given away / sent out | not yours anymore | **this is the only real survival** |

### 3.7 Transmission — the victory condition
**Copying out to another hand** — Bridget, a sympathetic brother, a
correspondent — creates a witness that leaves your custody and your fate.
1323 destroys what is in the room. It cannot reach what was already
elsewhere. The stemma screen (`DESIGN.md` §The Witness) becomes literal:
your copies, their inherited errors, and which of them the modern scholar
receives in the framing ending. **A run's score is not what you kept. It
is what got out, and how corrupt it was when it did.**

## 4. Command alphabet (already reserved in `COMMANDS.md`)
`S` Scribe (assigned work) · `I` Illuminate (steal the hour for the Work)
· `G` Gaze upon the figure · `J` Journal · `U` Use (knife: scrape;
candle: night light) · `E` Examine (collate, construe, proofread) ·
`T` Talk (armarius, sacrist, stationer). **No new letters needed** — the
alphabet was designed with this system in view.

## 5. Build order
1. **Data**: `data/exemplars.js`, `data/materials.js` (+ manifest entries);
   extend the witness record with copies and their corruptions.
2. **Engine**: `engine/scriptorium.js` — pure: quire model, copy loop,
   error classes, correction pass, figure check → `procedure.corrupt`,
   concealment state. Tests first, per house rule.
3. **Stage**: a scriptorium scene reusing the recitation UI grammar
   (units, interruption, grade) with the light constraint on screen.
4. **Meta**: the stemma screen — witnesses as a descent tree with their
   variants; the framing ending reads *your* most-corrupt-yet-surviving
   copy back to you.
5. **Then**: pecia deadlines in Orléans, the inventory event driven by
   Evrart, verdigris's slow corruption of finished copies.

## 6. Scholarly-fidelity notes
- The craft details in §1 are standard codicology and safe to build on.
- Everything specific to *John's own* figures, prayer counts, and the
  redaction differences is `verify` until the Fanger–Watson edition is on
  the desk. Build the *shape*; let the apparatus say `verify` meanwhile
  (`CLAUDE.md` rule 1).
- No fabricated *verba ignota* presented as genuine: invented strings are
  `status: invented` in data, and the pencil hand says so.
- The pecia system belongs to universities; Orléans usage in our fiction
  is `adapted`, and should be labeled as such rather than asserted.
