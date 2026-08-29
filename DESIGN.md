# MORIGNY — Design Document
*Working title: **Liber Florum** — a monastic life & practice simulator*

A simulation of the lived experience of **John of Morigny** (fl. c. 1300–1323),
Benedictine monk of Morigny near Étampes: keeping the Rule hour by hour while
secretly working — and endlessly *rewriting* — a system of visionary ritual
magic addressed to the Virgin Mary, under the shadow of the condemnation that
history has already scheduled for 1323.

**Canonical scholarly source:** Claire Fanger, *Rewriting Magic: An Exegesis of
the Visionary Autobiography of a Fourteenth-Century French Monk* (2015), and
Fanger & Nicholas Watson's critical edition of John's *Liber florum celestis
doctrine*. See `BIBLIOGRAPHY.md`. **Nothing ships that contradicts the
scholarship; everything invented is marked invented.** (See `CLAUDE.md` for the
enforcement rules.)

---

## The Historical Ground (brief)

- John, a young monk of the Benedictine abbey of Morigny, studied at Orléans —
  a town notorious for the student traffic in necromancy that Richard
  Kieckhefer calls the **"clerical underworld."** He practiced the
  ***ars notoria***, a Solomonic ritual art promising infused knowledge of the
  liberal arts through prayers, inspections of diagrams (*notae*), and
  ritual observance; he also had contact with frankly necromantic material.
- Troubled by visionary experiences he came to read as demonic contamination
  of the *ars notoria*, John did not abandon ritual practice — he **rewrote
  it**: the *Liber florum celestis doctrine* ("Flowers of Heavenly Teaching"),
  a purified system authorized, he claims, by visions of the Virgin herself.
  Three parts: a **Book of Visions** (his visionary autobiography), a **Book
  of Prayers** (procedures worked over weeks and months, keyed to the
  liturgical day), a **Book of Figures**. He revised the whole across two
  major redactions — the **Old Compilation** and **New Compilation** — partly
  in response to criticism. He taught the practice to others, including his
  sister **Bridget**.
- His autobiography records intense interior struggle: demonic apparitions,
  scrupulosity, and battles with sexual temptation and pollution anxiety —
  because the practice, like the *ars notoria* before it, demanded **ritual
  purity** (chastity, confession, fasting). The body was a load-bearing
  component of the magic.
- In **1323** the *Grandes Chroniques de France* report the condemnation and
  burning at Paris of a monk of Morigny's book that "sought to revive" the
  *ars notoria* under a new name. Yet the text survived in manuscript, copied
  into the fifteenth century, and was rediscovered by modern scholarship in
  the 1990s (Nicholas Watson's identification of a manuscript at McMaster
  University began the modern recovery).

> Exact dates, prayer counts, and episode details carry a `verify` flag in the
> data files until checked against the Fanger–Watson edition. See
> `BIBLIOGRAPHY.md` → Research Queue.

---

## Design Pillars

1. **Absolute fidelity, visibly enforced.** Every content record is tagged
   `attested` / `adapted` / `invented` with citations, and the in-game
   apparatus can display those tags. The fourth wall is powered by the
   database.
2. **The Rule and the Work are one loop.** The drama is scheduling: the same
   hours, the same body, the same attention must serve both the *opus Dei*
   and the secret procedures. Neither is a minigame bolted to the other.
3. **The Struggle, with dignity.** John's fight with sexual temptation is a
   core simulated system — pressure, vigilance, lapse, confession, despair,
   relief — rendered in the confessional register of his own writing, never
   explicitly depicted, never mocked. (Binding rules: `STYLE_GUIDE.md`.)
4. **The page is the interface.** The whole game is a manuscript opening.
   See `INTERFACE.md`.
5. **The scholar is in the narrative.** As Fanger writes herself into
   *Rewriting Magic*, a modern hand annotates the manuscript — the
   designer-scholar's voice: sources, doubts, and the experience of making
   this game. (We use her *method*, we do not impersonate her — see
   `STYLE_GUIDE.md` §Ethics.)
6. **History cannot be beaten, only survived.** 1323 always comes. Victory is
   transmission: what survives, in whose hands, is the score.
7. **Stakes are legible, always.** A player must be able to tell, from
   the choice itself, whether it leans toward the Rule or the Work,
   toward obedience or the Radical Axis (`WORLD_DESIGN.md` §4), and
   exactly what a spendable resource like resolve will cost before they
   spend it. Atmosphere is not a substitute for legibility — the two
   are written together, not traded off. (`CLAUDE.md` rule 10,
   `PACING.md` §Legible stakes, `docs/CLARITY_STYLE_GUIDE.md`.)

---

## Core Loops (nested)

### 1. The Hour (minutes of play)
The volvelle turns to the next canonical hour. Each hour presents its
obligations (choir, lectio, labor, chapter, meals, sleep) and John's private
intentions (a procedure prayer due, a figure to copy, a confession owed).
**Attention** is the currency: during recitation and prayer the player holds
focus on the text block while distractions — rendered as marginal drolleries
and intrusive glosses — pull the eye. Looking feeds them. This is *custodia
oculorum* as a mechanic: distraction in prayer is the front door of
temptation (the tradition from Cassian's *logismoi* onward).

### 2. The Day (one session)
The horarium: eight offices plus the day's labors, meals, chapter of faults,
and the night. Seasonal variation (winter/summer horarium, fasts, feasts)
comes from the liturgical calendar data. At night: the dormitory (Rule of St
Benedict ch. 22 — monks sleep clothed, a light always burning — the
historical staging of the Struggle's hardest hours) and, if the procedures
are in motion, **sought dreams**.

### 3. The Procedure (weeks–months)
The Liber florum's ritual programs run on long clocks: sequences of prayers
keyed to hours and days, gated by **purity state** (confession current,
fasts kept, continence held) and advanced only by **licence** (*licentia*) —
visionary permission from the Virgin, sought in dreams. An invalidated
precondition silently invalidates the work; John may not know until the
vision fails or turns strange.

### 4. The Compilation (the campaign)
Criticism, rumor, and suspicion accumulate toward 1323. John's response —
historically — was **rewriting**: Old Compilation → New Compilation. The
campaign-level verbs are compose, revise, scrape (palimpsest), copy, teach
(Bridget and others), conceal. Each teaching creates a possible surviving
witness.

### 5. The Witness (meta, across runs)
Every completed run is a **manuscript witness** of the player's particular
Liber florum, with its variants. The run-history screen is a **stemma
codicum**. The framing ending: a modern reading room, a call slip, the
manuscript found — the run you just played is the text the scholar receives.

---

## Systems

### The Struggle (temptation & continence)
- **Pressure** builds from ascetic strain, idleness, fatigue, rich feast
  days, distraction debt, and — dangerously — from visionary experience
  itself (John's demons come *dressed as* consolation).
- **Vigilance verbs**: prayer, vigil, cold, labor, flight to the choir,
  confiding in a confessor. Each has costs against sleep, attention, and
  suspicion.
- **Lapse** is a gradient, not a fail state: pollution invalidates ritual
  purity until confession; the *interesting* failure is **scrupulosity** —
  over-confession, despair, *acedia* — which damages both the Rule-life and
  the Work more than the lapse did.
- All rendered interiorly (text, pacing, attention mechanics, marginalia
  pressure). Never depicted. Register rules in `STYLE_GUIDE.md` are binding.

### Discernment of Spirits (*discretio spirituum*)
Visions arrive ambiguous. The player examines iconographic and affective
"tells" (populated from John's own recorded criteria in the Book of Visions —
research queue) and rules: of God, or of the enemy? Wrong discernment
corrupts the procedure quietly. Gradient outcomes throughout (house rule #4).

### Suspicion & Secrecy
The community watches. Scriptorium access, candle use at odd hours, absences
from labor, a brother glimpsing a figure — all feed a hidden suspicion track
that shapes *how* 1323 arrives (denounced early, protected by friends,
tolerated warily), never *whether*.

### Purity Gating
A single body-state (sleep, fasting, continence, confession currency) is read
by *both* loops: the Rule rewards what the Work requires, and vice versa —
until they conflict (a required procedure prayer during choir; a fast the
labor can't afford). The conflicts are the game.

---

## The Fourth Wall: Three Hands

The manuscript carries three layers of writing, all always potentially
present:

1. **John's hand** (iron-gall brown): the text itself — narrative, prayers,
   confessions. First person, confessional, Latinate.
2. **The rubricator/glossator** (vermilion): the medieval systemic voice —
   instructions, incipits, liturgical stage-direction. This is the "UI voice."
3. **The modern hand** (graphite, unmistakably *penciled*): the
   designer-scholar. Footnotes citing real scholarship; reflections on
   reading Fanger; admissions of what is invented and why; occasionally, the
   experience of *making this game* — the historical game designer written
   into the narrative exactly as *Rewriting Magic* writes in the scholar.

The pencil hand lives in a collapsible drawer, closed by default and one
click away always (`docs/DECISIONS_AND_FORKS.md` D-14) — the apparatus
is a product surface, not an extra, but it is not required reading
either. A passage's citation marker only appears when there is a real
citation behind it; the reading column stays clean by construction.

### The Whitening Arc (epilogue layer)
After 1323, the pencil hand narrates the afterlife of the text: manuscripts
copied into the fifteenth century; the broader late-medieval movement that
laundered necromantic technique into licit angelic and Marian devotion
(Klaassen's "transformations"); the horizon of Renaissance learned magic
(Ficino, Trithemius, Agrippa). Later-period imagery is **allowed only here**,
honestly dated on-screen — the anachronism is the content.

---

## Scope

- **v1 (vertical slice):** one full liturgical day + one night of the
  Struggle + one sought vision with discernment + the three-hands apparatus.
  Codex interface, grisaille art from sourced assets.
- **v2:** a full first procedure (one month of sim-time), suspicion system,
  liturgical calendar, Bridget.
- **v3:** compilations, palimpsest rewriting, 1323, witness stemma across
  runs, whitening epilogue.

**Relationship to DungeonAB:** standalone module in this repo (`morigny/`).
Shares the house culture — design-first, test-first, seeded determinism,
writing-coverage tests — but not the autobattler engine.

## Planned Tests (house rule: every mechanic ships with tests)

- **Writing coverage:** every hour × obligation × interruption has authored
  text; every Struggle state has authored interiority.
- **Provenance lint:** build fails if any content record or art asset lacks
  `sources` + `status`, or if any asset is missing from the manifest.
- **Schema validation** for all data files.
- **Horarium integrity:** seeded day/calendar generation always yields a
  legal monastic day (all eight offices reachable, sleep math closes).
