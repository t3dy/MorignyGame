# MORIGNY — Encounter Systems Study (cross-project, 2026-08-31)

*A survey of the encounter architectures in the C:\Dev workspace's other
games, commissioned for the v4 encounter pool (`V4_LOOP_REDESIGN.md`
§6b). All references are to sibling projects outside this repo —
read-only research; nothing here was modified. File:line pointers were
verified at survey time and may drift.*

Projects studied: **DungeonAB**, **EmblemRoguelike**,
**AlchemyBoardGame**, **SNAKEAB**, plus two found via the workspace
registry: **AlchemyLabRoguelike** ("Laboratory of Art" — minimal
prototype, but the richest encounter *design corpus* in the workspace)
and **zosimosgames** (`chymists_lemonade_stand`,
`hermetic_temple_roguelike` — whose encounter deck already includes a
necromantic-commission card).

---

## The four mechanisms worth adapting (synthesis, priority order)

### 1. Capability × affordance gating, with a separate tag dictionary
`DungeonAB/src/encounters/EncounterEngine.js:121-166` +
`DungeonAB/src/game/Capabilities.js:22-54`

An option appears only where *what the character can do* intersects
*what the situation offers*. Nothing names a character; the engine never
enumerates tags. One encounter with 6 tagged options is 6 different
encounters to 6 different Johns; adding a capability (`latinity`,
`plainchant`, `canon-law`, `necromancy`, `herbal`, `scribal-hand`)
touches exactly one dictionary file. MORIGNY's three registers
(monastic / underworld / courtly) become **affordance families**
(`cloister`, `crypt`, `court`, `relic`, `charter`, `patron`) rather
than three separate systems. This maps directly onto v4's **faculties**
(`V4_LOOP_REDESIGN.md` §5). Take with it: `unlockedBy` provenance on
each option (the UI says *why* a choice exists — rule 10 loves this)
and `capabilityUsageSummary()` ("did investing in canon law ever create
an opportunity, and was it taken?").

### 2. Riders — encounters that ride blocks instead of consuming them
`DungeonAB/src/world/DungeonGen.js:407-429` (rationale at `:407-421`),
drift test at `DungeonAB/tests/riders.test.js`

The zero-sum insight: every dedicated encounter is bought from the
ordinary rhythm of the day. A **rider** is a faculty test stamped onto
a block that already has a job — Matins still happens, but the sacrist
*also* notices something, if John has the eye for it. `RIDER_CHANCE`
becomes the tuning dial for "how often is the player's build examined,"
decoupled from the pacing budget. Perfect fit for PACING.md's 70/20/10:
riders enrich the 70% without inflating the 20/10. Pair with
deal-without-replacement (`DungeonGen.js:395-405`) and a per-run
`dealt` set so no encounter repeats within a witness.

### 3. Escalation-ladder deck + prevention-clause-as-data + risk bags
`AlchemyBoardGame/src/lib/game/engine.ts:183-188`, `types.ts:75-86`;
`AlchemyLabRoguelike/design-notes/100choicesANALYSIS.md:287-315`;
doom-clock realization in
`zosimosgames/hermetic_temple_roguelike/index.html:151-164`

Shuffle **within** severity tier, concatenate **across** tiers: the
difficulty curve is a property of deck *construction*, not per-draw
weights — and because the deck is bigger than the run, **content is
always left unseen by design**. For MORIGNY: early-days trials →
mid-run chapter politics → late inquisitorial/underworld reckonings,
riding the renown clock. Take `preventionText`/`preventionCost` as
data: a crisis names, in advance, which prior investment (a patron's
letter, a clean confession record, a well-hidden copy) would have
blunted it — legible stakes, mechanized. The **risk-bag** token model
(player choices seed a bag of `scandal`, `heresy-suspicion`,
`necromantic-exposure`, `patron-debt` tokens; encounters draw from it)
makes which crisis arrives a consequence, not weather.

### 4. Three-beat narration, kind-fan-out, mechanically-gated writing
`SNAKEAB/src/narrative/Narrator.js:19-49, 286-396`;
`DungeonAB/src/narrative/Prose.js`, `Chronicle.js:48-75`;
`DungeonAB/tools/census.mjs`

The `KINDS` fan-out is the cheapest content multiplier surveyed: 7
mechanical encounters read as ~22 because resolution flavor is keyed
`"${kind}:${optionId}"`. For MORIGNY: one `illicit-book` encounter
whose *kind* is a psalter-hidden quire / a necromantic experimentum /
John's own Liber — same math, three unrecognizable scenes. Then
DungeonAB's writing discipline on top, because a large authored pool is
exactly where writing rots: lines must state the number the mechanic
applied and invent none (`Prose.js:58-81`); a house ban-list with a
*why* per entry; repetition detection with enough variants to survive
it; one `snapshotState` diffed on every exit path with a test that
fails if a field moves unreported (**the rule that keeps a
300-encounter pool honest**); and a census tool that walks hundreds of
seeded runs to distinguish rare-by-design from unreachable-by-bug.
MORIGNY already has the writing-coverage-test culture; these extend it.

## Runners-up (adopt opportunistically)

- **Providence → the Vow** (`DungeonAB/src/game/Providence.js:24-81,
  157-174`): the player writes a rule of life in prose; curated
  keywords nudge encounter weights, capped and guarded ("arranges
  opportunities, never rewards"). A natural monastic fit, later.
- **Outcome interpretation over success/failure**
  (`AlchemyLabRoguelike/design-notes/encounter_contract_framework/01_encounter_first_framework.md:149-165`):
  the same event read differently by prior, bishop, patron, and the
  historian's margin — nearly free drama for a five-voice game.
- **Plural reputation** (`DungeonAB/src/game/TownState.js:14-21,
  165-184`): standing per faction is money *and* danger. For MORIGNY:
  chapter, bishopric, town, court, underworld — suspicion need not stay
  a single number forever.
- **Pool exhaustion with arc-priority**
  (`EmblemRoguelike/js/main.js:244-271`): a seen-set, a coin-flip to
  advance a linear spine, a 65/35 arc-vs-random split — a through-line
  plus surprises, cheaply.
- **Writing workflow** (`AlchemyLabRoguelike/design-notes/
  encounter_writing_workflow.md:219-273`): four revision passes;
  batches of twelve where you draft 12 skeletons and ship 6. Adopt
  literally for the pool's authoring.
- **The Necromantic Invitation template**
  (`zosimosgames/hermetic_temple_roguelike/index.html:108-111`):
  accept / refuse on doctrinal grounds / refuse *and inform* — three
  morally distinct refusals. The shape (not the content) transfers.

## Per-project detail

**DungeonAB** — the most sophisticated architecture. 14 dungeon
situations + 8 town situations; options gated by `requires`
(capabilities) ∩ `affordances` (situation tags) ∩ `when()` predicates;
seeded deal-without-replacement placement; riders at 0.5 chance;
weighted-roulette choice with stacked weight sources; town factions
with standings that set prices and hostility; three-beat narration with
per-archetype variant pools; and the workspace's strongest writing
gates (Prose lint, Chronicle silence test, census). Standing rules 7–13
in `DungeonAB/CLAUDE.md:46-90` document the bug behind each gate.

**EmblemRoguelike** — quests (authored, arc-ordered: a 60% Opus-spine
coin-flip, then exhaustion-filtered giver pools with a 65/35
earliest-unseen/random split) + disasters (no weights: pure 3-way
condition intersection on lab state — materials × temperature ×
durability — with per-tick probability normalized to a fixed rate).
Court economies where reputation is a price input. Variety is
deliberately weak: it's a campaign, not a run.

**AlchemyBoardGame** — pure deterministic reducer, state-carried
mulberry32 (any game is a replay of its seed — MORIGNY's own
philosophy). The escalation-ladder deck (above); court events on fixed
rounds from a shuffled deck (you see 2 of 7); every disaster carries
its prevention clause as data, shown before the choice; per-card
`source` citation fields (e.g. "Nummedal, Zieglerin, ch.3") — the
closest existing analogue to MORIGNY's envelope rule; log entries carry
tone bands; a balance gate as a test (a scripted bot must win *some but
not all* of 40 seeds).

**SNAKEAB** — the ancestor. 7 mechanical encounter types fanned into
~22 narrative kinds; requirement grammar with `either:` OR-groups;
weighted decisions including a history bonus (the snake gets better at
encounter families it has met); three-beat narration with
state-conditional appendix clauses; solvability-retry procgen.

**AlchemyLabRoguelike** — prototype thin (8 encounters, round-robin
selection), corpus deep: the universal encounter anatomy (ID / mode
tags / scholar tags / historical pressure / visible stakes / choices /
outcome interpretation / journal / historian margin / future hooks);
the four choice roles (modest / boast / blue-skill / product); the
risk-bag spine (Temptation → Preparation Check → Consequence Frame →
Aftermath Memory); emergent-state content keyed to *pairs* of meters
("Your papers are in excellent order. Your purse has declined to
comment."); a memory typology (proof / promise / worker / contact /
slander); and the source→encounter matrix that turns a bibliography
into an encounter pool — the exact template for turning
`docs/scholarship/` into MORIGNY's pool.

**zosimosgames** — 5 weighted world-events with per-customer-class
demand and a *pre-announced next-week hint* (prepare-able weather); the
hermetic temple's tension doom-clock and fixed-cadence interstitials.
