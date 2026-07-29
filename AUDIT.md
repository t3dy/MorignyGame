# MORIGNY — Feature Audit

Project state as of 2026-07-29. Green checkmarks show what ships in the playable build; items in the pipe are either designed (spec exists) or research-blocked (waiting on reading).

---

## BUILD STATUS

### v1 ✓ COMPLETE — The Monastic Day (playable slice)

All mechanics ship and are tested. Player can complete a full day loop, experience the Struggle, discern a vision, face examination in 1323, and receive the stemma.

| System | State | Tests | Coverage |
|--------|-------|-------|----------|
| **Recitation** | ✓ Built | 5 suites | every hour, all distractions, 3 quality grades |
| **Struggle** (night) | ✓ Built | 5 suites | 4 tiers, all verbs, all outcomes, confession asymmetry |
| **Discernment** (vision) | ✓ Built | 5 suites | all 4 discernment outcomes, silent corruption |
| **Commands** | ✓ Built | 5 suites | 26 letters, refusal text for each |
| **Horarium** | ✓ Built | coverage | all 8 canonical hours present |
| **The Struggle** (register rules) | ✓ Enforced | style checks | interior only, never depicted, no titillation loops |
| **Chronicle** | ✓ Built | 5 suites | renown accumulation across witnesses |
| **1323 Campaign** | ✓ Built | 5 suites | summons threshold, 3-question exam, 3 verdicts, stemma screen |
| **Stemma** (editorial) | ✓ Built | 5 suites | siglum generation, descent, corruptions, received witness |

**Writing coverage tested:**
- ✓ All 8 hours have authored passages (John's hand, rubricator's rubrics)
- ✓ All Struggle tiers (QUIET through CRISIS) have pressure/despair narration
- ✓ All 4 discernment outcomes: licentia (gold), silent corruption, mastery, rejection
- ✓ All night verbs (Vigil, Prayer, Cold, Endure, Yield) have resolution text
- ✓ Three examination questions with three stance options each = 9 answer passages
- ✓ Three verdict endings (Submitted, Defiant, Radical/Departed)
- ✓ Departure annotation on counterfactual path
- ✓ All content records carry `sources[]` + `status` flags; no unsourced claims

**Scholarly enforcement (CLAUDE.md tests):**
- ✓ Envelope lint: all records have `sources[]` and valid `status`
- ✓ No fabricated quotations from John or Fanger
- ✓ Struggle material never depicted or mocked
- ✓ Fixed history: 1323 always arrives; counterfactuals marked
- ✓ Asset provenance: assets_manifest.json schema validated

**Known `verify` flags in v1** (all inherited from design, not blockers):
- chronology.json: dates for the two Compilations (Old/New), pinned to Fanger–Watson edition
- personae.json: biographical notes on Bridget and the Virgin (character as game-state)

---

### v2 IN PROGRESS — The World Layer

Tile-world frame, town navigation, NPC dialogue system. Partially shipped; Orléans/Sens/Paris not yet designed.

| Feature | State | Design | Code | Tests | Writing |
|---------|-------|--------|------|-------|---------|
| **U5 tile world** | 🟡 partial | ✓ WORLD_DESIGN.md | ✓ world.js | ✓ coverage | ✓ |
| **Morigny/Étampes maps** | ✓ done | ✓ | ✓ | ✓ | ✓ |
| **NPC talk (keyword system)** | ✓ done | ✓ | ✓ talk.js | ✓ | ✓ |
| **NPCs in data** | 🟡 partial | ✓ spec | ✓ npcs.js | — | ✓ (Étampes only) |
| **Road offices** (Terce/Sext/None bells) | ✓ done | ✓ | ✓ day.js | ✓ | ✓ |
| **Orléans, Sens, Paris** | ⏳ design only | ✓ WORLD_DESIGN.md §5 | — | — | — |
| **City leaves** (sourced imagery) | ⏳ design only | ✓ ART_SOURCES.md | — | — | — |
| **Pecia system** (rented exemplars) | ⏳ design only | ✓ SCRIPTORIUM.md §3.1 | — | — | — |
| **Disposition axis** (Obedient/Radical) | 🟡 partial | ✓ WORLD_DESIGN.md §4 | ✓ exam respects it | — | ✓ 3 endings |
| **Radical marker annotation** | ✓ done | ✓ | ✓ exam.js | ✓ | ✓ departure note |
| **Inventory event** (Evrart) | ⏳ design only | ✓ SCRIPTORIUM.md §3.5 | — | — | — |

**Writing needed for v2 completion:**
- Orléans NPC encounters (armarius deputy, book trader, Radical contact)
- Sens NPC encounters (metropolitan clerk, inquisitor, sympathetic canon)
- Paris NPC encounters (theologian, inquisition trial)
- City leaf introductions (3 towns × sourced imagery + dating overlay)

**Known `verify` flags in v2:**
- Pecia system specifics: was it used at Orléans? (SCRIPTORIUM.md §3.1, mark as `adapted` per rule 6)

---

### v3 NOT STARTED — The Scriptorium & Campaign Completion

**The core mechanic: copying is the victory condition.** Specification is complete in SCRIPTORIUM.md. The build follows that document's §5 (Build order) step-by-step. No code has shipped yet; all design is solid and testable.

#### 3a. Data (`data/exemplars.js`, `data/materials.js`)

| What | Design | Code | Tests |
|------|--------|------|-------|
| **Exemplar records** | ✓ SCRIPTORIUM.md §3.1 | — | — |
| **Exemplar sources** (armarium, loan, Isabel, pecia, Old Compilation) | ✓ §3.1 table | — | — |
| **Materials** (parchment, ink, pigments + hazards) | ✓ §3.5 | — | — |
| **Witness extension** (copies[], corruptions[]) | ✓ stem­ma.js existing | ⚠️ extend | — |
| **Assets manifest entries** (parchment, inks, pigments) | ✓ ART_SOURCES.md | — | — |

**Blocking nothing** — can start immediately; `verify` flags move to research queue only.

#### 3b. Engine (`engine/scriptorium.js`)

Pure, seeded-deterministic state machine reusing recitation loop's grammar. Specification is in SCRIPTORIUM.md §2–4; build order is §5.

| What | Design | Engine | Tests | Notes |
|-------|--------|--------|-------|-------|
| **Quire model** | ✓ §2, §3.2 | — | — | N units per quire; quire signatures |
| **Copy loop** | ✓ §2, §3.2 | — | — | Reuse `recitation.js` structure: units → distractions → quality grade |
| **Hand choices** | ✓ §3.2 | — | — | Textualis (slow, careful); Cursive (fast, error-prone); Trusting exemplar (fastest, no error-correction) |
| **Error classes** | ✓ §3.2 | — | — | eyeskip (silent), dittography (visible, correctable), verba ignota garble (never self-correctable) |
| **Fatigue model** | ✓ §3.2 | — | — | Textualis costs finger fatigue; error rates by hand + fatigue |
| **Correction pass** | ✓ §3.3 | — | — | Expunctuation; can't correct eyeskip or verba ignota without collation |
| **Figure check** | ✓ §3.4 | — | — | Geometry/proportion/inscribed words; fail → `procedure.corrupt` (silent invalidity) |
| **Daylight constraint** | ✓ §3.2 | — | — | Public units plentiful; night units need candle, fire risk, worst suspicion |
| **Pigment hazards** | ✓ §3.5 | — | — | Orpiment sickens scribe, reacts with lead/copper; verdigris eats through leaf over time |
| **Palimpsest** | ✓ INTERFACE.md | — | — | Scraping old leaf; under-text faintly visible (Old Compilation showing through New) |

**Test-first, per house rule.** Coverage needed: all error classes × all hands, all correction scenarios, figure success/fail, daylight public/night, all pigment hazard outcomes.

#### 3c. Stage (scriptorium UI)

Reuses `recitation.js` UI grammar: units, distractions, grade at end. Adds daylight constraint on screen.

| What | Design | Code | Tests | Writing |
|------|--------|------|-------|---------|
| **Scriptorium scene** | ✓ SCRIPTORIUM.md | — | — | — |
| **Unit loop** (copy by hand) | ✓ §2, §3.2 | — | — | — |
| **Distraction pool** | ✓ §2 | — | — | Sourced from struggle/temptation + scholarly pencil notes |
| **Quality grade** | ✓ reuse from recitation | — | — | recollected/distracted/scattered → fidelity score |
| **Daylight display** | ✓ §3.2 | — | — | Show remaining daylight units + public/hidden unit status |
| **Correction interface** | ✓ §3.3 | — | — | View errors; choose correction method (expunctuate/marginal insert) |
| **Figure drawing** (check) | ✓ §3.4 | — | — | Geometry validation; success/fail feedback |

**Writing coverage needed:**
- Acquisition narration (getting the exemplar, cost/risk)
- Copying unit distractions (same pool as recitation? new pool? mixed?)
- Quality grades (recollected/distracted/scattered at end)
- Correction narration (success/failure of each method)
- Figure drawing narration (success feels like mastery; fail is silent)
- Pigment hazard events (mixing orpiment sickness, verdigris eating through discovered months later)

#### 3d. Meta: Witness Copies & Stemma Integration

Witnesses now carry copies; each copy has its own corruption genealogy. The stemma screen reads back the most-surviving copy.

| What | Design | Code | Tests |
|------|--------|------|-------|
| **Witness.copies[]** | ✓ stemma.js extend | — | — |
| **Copy.corruptions[]** | ✓ error classes map | — | — |
| **Concealment state** | ✓ SCRIPTORIUM.md §3.6 | — | — |
| **Transmission choice** (give copy away) | ✓ §3.7 | — | — |
| **Stemma reads survival** | ✓ (existing) | ⚠️ extend | — |
| **Framing ending** | ✓ content design | — | — | Modern scholar receives the best surviving copy; reading it back in pencil hand |

---

### RESEARCH QUEUE (blocks `verify` flags)

All research is optional for shipping v3; all `verify` flags stay in place and content marked `verify: true` appears in the apparatus. But reading has high ROI: pins dates, prayer structure, visions, sexual-temptation loci.

**Reading program** (from BIBLIOGRAPHY.md):

| Source | Chapters/sections | Blocks | Priority |
|--------|-------------------|--------|----------|
| Fanger, *Rewriting Magic* | I, II.1–2, III (vision discernment + the 1323 notice) | dates, verba ignota, prayer structure, sexual loci | High |
| Fanger–Watson edition | Introduction + 1-2 exemplar visions | vision list, figure program, Old/New Compilation differences | High |
| Sophie Page, *Magic in the Cloister* | Pages on monks acquiring texts (camouflage by binding evidence) | pecia feasibility at Orléans | Medium |
| Kieckhefer, *Unquiet Souls* (on *acedia*) | Chapter on scrupulosity in confession | despair spiral mechanics validation | Medium |

---

## ASSET INVENTORY

### Imagery Status

**Currently:** Typographic only. No images ship without `assets_manifest.json` entry per CLAUDE.md rule 6.

**For v3 completion, needed:**
- **Tile world** (original 16×16 U5-era tiles): Morigny abbey, Étampes town, Orléans town, Sens town, Paris town, terrain, roads. **Status:** design spec exists (WORLD_DESIGN.md); original art needed.
- **City leaves** (sourced historical imagery): 
  - **Étampes** — engravings, photographs of the town and church (16th-c. onward, honestly dated)
  - **Orléans** — university buildings, cathedral, market (sourced 15th-17th-c. material, marked)
  - **Sens** — cathedral, archbishop's palace (sourced medieval/later imagery, marked)
  - **Paris** — University of Paris buildings, Notre-Dame (sourced, extensively documented, marked)
  - **Morigny abbey ruins** — photograph of the archaeological site today (dated on screen)

**Asset sourcing rule (CLAUDE.md rule 6, ART_SOURCES.md):**
- Every image enters `assets_manifest.json` with: `id`, `title`, `source` (archive/book/link), `provenance` (attested/adapted/invented), `dateRange` (when the depicted moment occurred), `screenDate` (when to display it to player — e.g., "engraving, 1572")
- Processed images (cropped, color-shifted for grisaille, etc.) demote `attested` → `adapted`, recorded in manifest
- Original artwork (`status: invented, original art`) cites its reference sources (e.g., "based on Vatican Lat. MS 3056 f. 2r")

---

## WRITING COVERAGE

### Currently Authored

- ✓ All 8 canonical hours (Matins through Compline)
- ✓ All Struggle tiers and outcomes
- ✓ All 4 discernment outcomes
- ✓ All 26 command refusals
- ✓ 1323 examination (3 questions × 3 stances = 9 answers)
- ✓ Three verdict endings
- ✓ Departure annotation (counterfactual marker)
- ✓ All pencil-hand apparatus passages

### Needed for v2 Completion

- Orléans NPC encounters (3 NPCs × 3 keywords each = ~9 passages)
- Sens NPC encounters (3 NPCs × 3 keywords = ~9 passages)
- Paris NPC encounters (3 NPCs × 3 keywords = ~9 passages)
- City leaf introductions (3 cities × pencil-hand description = ~3 passages)

### Needed for v3 Completion (Scriptorium)

- Exemplar acquisition narration (5 sources × acquisition/refusal text)
- Copy loop distractions (~15–20 new distractions specific to copying)
- Copy quality grades (recollected/distracted/scattered)
- Correction narration (success/failure per method)
- Figure drawing narration (success/silent failure)
- Pigment hazard narration (sickness from orpiment; verdigris discovery)
- Transmission choices (giving copy to Bridget, sympathetic brother, correspondent)
- Framing ending (scholar receives best copy; reads it back in pencil hand)

**Total new passages needed for full campaign:** ~50–70 passages across v2+v3.

---

## BUILD SEQUENCE (RECOMMENDED)

The critical path for a playable v1+v2+v3 campaign:

1. **v2 Completion** (1–2 windows)
   - Design 3 city maps (Orléans, Sens, Paris) — light: NPCs + keywords only
   - Author city NPC encounters (~27 passages)
   - Wire city navigation into world.js
   - Test: player can walk to all 3 cities, talk to all NPCs

2. **v3 Scriptorium Data** (1 window)
   - `data/exemplars.js`: 5 exemplar records (sources: armarium, loan, Isabel, pecia, Old Compilation)
   - `data/materials.js`: parchment, ink, pigments with `sim` hazard fields
   - Extend `data/npcs.js`: armarius, sacrist, Isabel notes about materials
   - Extend witness record in `chronicle.js`: add `copies[]` array

3. **v3 Scriptorium Engine** (1–2 windows)
   - Write tests for `engine/scriptorium.js` first (test-first house rule)
   - Build quire/copy loop grammar reusing recitation.js structure
   - Implement error classes (eyeskip, dittography, verba ignota)
   - Implement correction pass logic
   - Implement figure check → `procedure.corrupt`
   - Implement pigment hazard model
   - Verify: same seed replays identical copy sequence

4. **v3 Scriptorium UI & Writing** (1–2 windows)
   - Wire scriptorium stage into main.js day flow (daylight hours)
   - Reuse recitation UI for copy-unit loop + distractions
   - Add daylight-units display
   - Author all copy narration (~40 passages)
   - Test: player can complete a copy, see quality grade, encounter errors

5. **v3 Transmission & Stemma** (1 window)
   - Wire "give copy away" choice into daylight/recovery phases
   - Extend stemma.js to track copies and their corruptions
   - Update stemma screen to show all copies + inherited faults
   - Author framing ending (pencil hand reads best copy back)
   - Test: different copy choices produce different stems and different ending text

6. **v2 Expansion** (2 windows, ongoing)
   - Source city leaves for Étampes, Orléans, Sens, Paris, Morigny
   - Add to assets_manifest.json with full provenance
   - Wire city-leaf images to city entry scenes
   - Radical Axis: design disposition-axis choices in city encounters
   - Test: disposition axis moves; examination respects axis position

7. **Research Reading** (ongoing, in parallel)
   - Read Fanger, *Rewriting Magic* (pin dates, prayer structure, sexual loci)
   - Read Fanger–Watson edition (vision list, figure program)
   - Move all `verify` flags to `checked: true` as reading completes

---

## METRICS

| Metric | v1 complete | v2 complete | v3 complete |
|--------|-------------|-------------|-------------|
| **Canonical hours** | 8 | 8 | 8 |
| **Towns** | 2 | 5 | 5 |
| **NPCs** | 4 | 7 | 10+ |
| **Authored passages** | ~120 | ~150 | ~200+ |
| **Test suites** | 5 | 7+ | 10+ |
| **Content records** | ~80 | ~100 | ~150+ |
| **Playtime (per run)** | 15–20 min | 30–45 min | 60–90 min |
| **`verify` flags** | 2 | 2–3 | 5–8 (research-dependent) |

---

## DEPENDENCIES & BLOCKERS

**Hard blockers (must resolve before shipping):**
- None. All systems are designed. Code work is implementation only.

**Soft blockers (research-backed but not required for beta):**
- Figure program details (awaiting Fanger–Watson edition)
- Exact verba ignota lists (awaiting reading)
- Prayer procedure structure (awaiting reading)
- Pecia system at Orléans (awaiting Sophie Page chapter)

**Nice-to-haves (not required for campaign completion):**
- Inventory event (Evrart's archdeacon visit — good but not necessary to ending)
- Verdigris slow corruption (mechanics exist, narrative nice-to-have)
- Disposition-axis consequences (exists in skeleton; city NPC design can expand)

---

## NEXT IMMEDIATE STEP

**Recommended:** Begin v3 Scriptorium Data build. It is the lowest-complexity, highest-ROI work: five exemplar records in JSON, two materials files, no code yet. This unblocks the engine work and surfaces any data-design issues before touching the copy loop.

Then immediately move to **v3 Scriptorium Engine** — the test-first suite for the copy loop, error classes, correction, figures. This is the mechanical spine and benefits from rapid tight iteration.

**Alternative:** Begin v2 completion (city NPC design + wording) in parallel. No dependencies; can ship independently.
