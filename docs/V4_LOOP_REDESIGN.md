# MORIGNY v4 — The Loop Redesign (plan of record)

*2026-08-31. Decisions taken with Ted in session; logged same-day per
working discipline. This is the plan the next build windows execute.
Where it conflicts with older docs (`PACING.md` §3's four-type grammar,
`STYLE_GUIDE.md` D-16's narrator cap), THIS document wins and those
documents get amended as each piece ships — amendments are listed in
§8 so nothing is silently contradicted.*

---

## 0. The one-sentence version

The game becomes a **reading-forward, ~10-inputs-per-day** life
simulator: each day is a handful of *stance choices* whose consequences
are simulated whole and then **narrated at length** in an expanded
five-voice register — and every playthrough compiles into a permanent,
player-editable log page on the game's website, where player emendations
appear as their own hand.

## 1. The input budget (≤10 per day, hard target)

The unit-by-unit grammar (press O per verse/unit, H/E per distraction)
retires from live play. **Stance up front, outcome narrated**: the
player sets *how* John will do a thing; the engine simulates the whole
block (same pure, seeded engines — recitation.js, scriptorium.js keep
their math); the narrator + monologue render what happened, including
temptations fought or yielded to, as prose rather than prompts.

A canonical day's inputs:

| # | Beat | The choice |
|---|---|---|
| 1 | Matins (procedure slot) | Say the Work's prayer tonight, or only the office — and in what stance (vigilant / routine / hasty; legible costs per rule 10) |
| 2 | Chapter | Only when there is matter: confess, hold silence, or speak a fault |
| 3 | Daylight allocation | The day's labor: **S**cribe / **I**lluminate / **U** palimpsest / s**T**udy (new) / **T**alk / road |
| 4 | One sub-choice inside the block | Which exemplar; which faculty to study; one dialogue keyword exchange (compressed) |
| 5 | (flashback, when triggered) | The vignette's one choice (§4) |
| 6 | Night | The Struggle stance, when the siege comes (existing verb set, kept — it is already one choice) |
| 7 | Dream | Judge the vision: of God, or the Cross against it (kept as-is) |
| 8 | Reckoning | Journal the day (kept), begin the next witness |

Six to eight on an ordinary day; ten on a heavy one. **Add an input-count
test**: a seeded golden-path day must be completable in ≤10 keypresses
(counted mechanically, not estimated).

**Stances replace repetition.** Where the old loop expressed "attention
under siege" through many small H/E spends, the new loop expresses it
once, at commitment: *vigilant* costs resolve up front and resists
distraction in the simulation; *routine* is free and average; *hasty*
is fast, cheap, and error-prone (the scriptorium's existing
hand-speed/error math generalizes to every block). The Struggle still
intrudes — but as narrated event inside the block's outcome text, its
severity shaped by the stance paid for, not as an interactive prompt.
STYLE_GUIDE rule 3 (no reward loop that makes lapse desirable) binds
the stance-outcome math exactly as it bound H/E.

## 2. The voices: five hands now, and the narrator unbound

D-16's 1–2 sentence narrator cap is **reversed** (it solved an old
problem — overlong John-voice grounding — that the new architecture
solves differently). The register list becomes:

1. **The scholarly narrator** (iron-gall roman, *expanded*): modern,
   analytical, third-person, in the spirit of the scholarship the game
   is answerable to. Now deliberately generous — it explains monastic
   and magical contexts, names the stakes of the choice in front of
   John, situates a moment in his life and his century. Errs toward
   describing too much. It still never cites in-persona, never says
   "I", never mentions the game — those remain the pencil hand's.
2. **John's hand** (iron-gall italic): unchanged rules — first person,
   period idiom, the confessional register, never clinical. Carries the
   *conflicting desires* at each stance choice: what the flesh wants,
   what obedience wants, what the Work wants, in his own words.
3. **The rubricator** (vermilion): unchanged — liturgical, imperative,
   brief; owns choice labels and their legible stakes.
4. **The pencil hand** (graphite): unchanged — reflexive
   designer-scholar, citations, rationed.
5. **The game-state voice** (NEW — plain, dry, technical): beneath the
   narration, a direct mechanical explainer: what was spent, what
   changed, what is now open or shut ("Resolve 3→1. Vigilant stance
   held through two distractions. The licence remains unspent.").
   Typography: small, neutral, unmistakably interface — *not* a new
   hue in the manuscript sense (INTERFACE.md's earned-color rule is
   about the world's palette; this voice sits visibly outside the
   world, like the pencil does). Exact treatment decided at build time.

Distinctness rule (binding): the narrator explains *John's world*; the
pencil explains *our knowing of it*; the game-state voice explains *the
machine*. A passage that cites belongs to the pencil; a passage with a
number in it belongs to the game-state voice; everything contextual and
analytical in between is the narrator's new territory.

## 3. The Struggle made visible (willpower as the felt economy)

Resolve becomes the choice-facing resource everywhere, not just in
recitation: stances price in resolve, radical options price in resolve,
study invests time that could have restored it. At every priced choice,
John's monologue voices the *pull in both directions* (the desire and
the cost, in his idiom) while the narrator names the dynamic plainly
above him — the two-hands split STYLE_GUIDE already mandates for the
Struggle, now applied to every deliberation. The game-state voice
states the arithmetic below. All existing Struggle register rules
(interior only, never depicted, never mocked) bind unchanged.

## 4. Flashbacks: the life behind the day

New content system: **vignettes of John's childhood, youth (Orléans,
the necromantic milieu), and earlier adulthood**, triggered at key
adult decision points — the first `I`lluminate, the first underworld
contact, the first radical beat, the summons. Each is mostly narrated
(scholarly narrator + young John's hand) with **one real choice**,
which (a) shifts disposition or a faculty a step, and (b) is *echoed
forward*: when the adult decision arrives, the narrator cites the
memory ("He has been here before, in a manner..."). Sources: John's own
autobiographical notices as read in the scholarship; envelope rules
apply in full (attested/adapted/invented per record; the necromancy
acquisition story is already in the Research Queue). Flashback choices
count against the day's input budget on the day they fire.

## 5. Faculties and study (the skill tree)

New `john.faculties` block, persisted across days in the chronicle
(like custody and licentia — the pattern is established):

- **learning** — Latin, theology, the schools; tested by examiners
  and courtly encounters
- **discretio** — the trained eye for spirits; improves the dream's
  tell quality
- **craft** — the scribe's hand; improves copy grade and figure success
- **worldliness** — the road, the market, the court; tested in
  Étampes/Orléans/Sens/Paris encounters

**Currency is study hours**: the daylight allocation gains a s**T**udy
option competing with copying, the Work, and talk — advancement costs
the same scarce daylight everything else wants; no abstract XP.
Faculties are spent nowhere; they are *tested* — encounter outcomes
read them (as `successChance` reads resolve today). Numbers live in
`sim` blocks; the game-state voice may quote them, the sidebar keeps
the numeral-free idiom.

## 6. The underworld and the court (v2 World Layer, redesigned)

The vehicle is the already-spec'd three-city build (WORLD_DESIGN.md
§5): **Orléans** the "clerical underworld" (memory-first per PACING §1
— the danger is *in him*, not down the road), **Sens/Paris** the
ecclesiastical-political surface. Redesign on top of the old spec:
encounters there test faculties and price resolve, with stakes fully
legible per rule 10; they add stress (pressure/suspicion) as Ted
specified — extra load on the same one body the Rule already taxes.
The existing Radical Axis rules (marked departure, priced radicalism,
extrapolated-never-imported) all bind unchanged.

**The Bruno axis, decided (D-21, grounded in `docs/scholarship/`):**

1. **The axis is recast as boundary-contest.** Per Bailey (via the
   scholarship synthesis §2): the examiners at Paris were not applying
   a settled rule but actively redrawing the licit/illicit boundary
   for their own institutional purposes. Radical choices become
   **argumentative acts** — John asserting his own authority to
   classify his art: defending the Work *as licit devotion*, teaching
   it, claiming the Virgin's authorization outranks the theologians'.
   The examination's three stances get rewritten in these terms
   (submit = accept their authority to draw the line; defend = argue
   inside their frame; the radical stance = refuse the frame itself).
   Sharper history *and* sharper drama; touches existing examination
   content.
2. **The departed path gets an authored narrated epilogue.** Departure
   still files the contaminated witness — but now triggers a
   multi-beat narrated epilogue (scholarly narrator + the departed
   John's hand) tracing the counterfactual life to its plausible end:
   exile, open teaching, and, like the man the axis is named for, very
   likely a later fire of his own. No new playable systems; the
   departure annotation's dating discipline ("Here the witness departs
   from the record") extends over every beat, and rule 5's marked-
   counterfactual requirement binds throughout.
3. **Disposition stays adult-earned; flashbacks color it.** Flashback
   choices shift disposition a step at most — their main job is
   determining *which* radical options later feel in-character (the
   echo system). The record stays the center; youth explains, never
   determines.
4. **Two sociologies made visible** — see §6b's register tag.

## 6b. The encounter pool (breadth across playthroughs)

The world layer's content model changes from "authored fixed scenes"
to a **large weighted pool of historically-grounded encounters** —
monastic, necromantic-underworld, courtly-political — of which any one
playthrough sees only a fraction. Requirements:

- **Pool, not script**: encounters are data records (envelope-complete:
  `sources[]`, `status`, `verify` — rule 1 binds every encounter) with
  prerequisites (location, faculties, disposition, chronicle state,
  day count), weights, and one-shot/repeatable flags. Selection is
  seeded per-run so a witness's encounters are reproducible.
- **Fresh per run**: mechanisms to guarantee different runs differ —
  per-run deck draws, exhaustion of one-shots, mutually exclusive
  branches, prerequisite gating off the run's own trajectory (a
  high-worldliness John meets different trouble than a scrupulous one).
- **Historical realism is the filter**: every encounter grows from the
  record or its immediate context (the scholarship reports in
  `docs/scholarship/` are the sourcing well; the Research Queue takes
  the `verify` overflow). Underworld encounters stay memory-weighted
  per PACING §1 — the pool makes the *world* rich, not the necromancy
  frequent.
- **Mechanisms (from the cross-project study,
  `docs/ENCOUNTER_SYSTEMS_STUDY.md`)** — the pool engine adopts four:
  (1) **faculty × affordance gating** with a separate tag dictionary
  (DungeonAB's capability engine; v4's faculties are the capabilities);
  (2) **riders** — faculty tests stamped on blocks that already have a
  job, so the ordinary day gets richer without costing pacing budget;
  (3) an **escalation-ladder deck** (shuffle within severity tier,
  concatenate across; deck bigger than the run so unseen content is
  designed in) with **prevention clauses as data** and a **risk bag**
  seeded by the player's own choices (`heresy-suspicion`,
  `necromantic-exposure`, `patron-debt` tokens); (4) **kind fan-out**
  narration (one mechanical encounter, several narrative "kinds") plus
  DungeonAB's writing gates (state-the-number lint, silence test,
  census tool) extended into MORIGNY's existing coverage-test culture.
- **Register tag (D-21)**: every magic-adjacent encounter and exemplar
  carries a `register: 'cloister' | 'underworld'` field — Page's
  insider sociology vs Kieckhefer's milieu-apart — narrated as such
  (the narrator names which world John is standing in), and read
  mechanically: suspicion and disposition respond differently to
  armarium audacity than to Orléans contraband.

## 7. The log: every playthrough a witness on the web

The engine already saves witnesses; v4 makes the day emit a **beat
log** — a structured record per narrative moment (stage, voices' texts,
choices offered/taken, state deltas) — from which two things render:

1. **Live play** — the richer in-game screen (§2).
2. **The compiled log page** — a permanent page per playthrough on the
   game's attendant website, displaying the full five-voice narrative.

**Editable, as another hand**: every beat's text can be modified,
added to, or cut by the player. Edits never silently replace — they
render as the player's own hand (distinct typography), the log becoming
a witness with visible emendations; a toggle shows the clean reading
text. (The game's provenance ethos applied to the player's own text.)

**Architecture**: MORIGNY stays a static Vite app; a lightweight hosted
store (serverless + small DB — e.g. Vercel functions + KV/Supabase,
decided at build time) persists published logs and their edits. When
the deploy grows a second path, `DEPLOY_STATE.md` gets written (house
rule). Beat-log emission is the enabling step and ships first; the
website page can follow a window later.

## 7b. Versioning: the redesign is a NEW site version; old ones stay live

The deploy already does this for v1 → v2 (`vite.config.js`,
`.github/workflows/deploy.yml`, `deploy/landing.html`): v1 is frozen
at `/MorignyGame/v1/` and never rebuilt; the current game deploys to
`/MorignyGame/v2/`; the landing page links both. The redesign extends
the same pattern:

1. **Freeze v2**: before the redesign's first deploy, the workflow's
   "only thing this job rebuilds" target moves from `v2/` to `v3/`,
   and `v2/` joins `v1/` in the never-touched set (its last good build
   stays on gh-pages exactly as the migration block froze v1).
2. **The redesign deploys as `/v3/`** (`PAGES_BASE`/base updated).
3. **The landing page gains a third card** — v1 the prototype, v2 the
   completed first campaign (recitation-grammar era), v3 the
   reading-forward redesign — each dated and one line on what it is,
   in the landing page's existing idiom.
4. A `DEPLOY_STATE.md` records the canonical URLs and the frozen-path
   rule (house rule: multiple deploy paths ⇒ the file exists).

Numbering note for the confused (all of us): *site* versions (v1/v2/v3
URLs) and *design-doc* versions (the internal v3 scriptorium, v3d
transmission, this v4 plan) drifted apart. Site v2 contains internal
v3d. The redesign is internal v4, site v3. The landing page uses site
numbers only.

## 8. Doc amendments this plan obligates (as pieces ship)

- `STYLE_GUIDE.md`: reverse D-16's length cap; add the game-state
  voice; retitle "The Four Hands" → five.
- `PACING.md`: §3's type (b) attention choice retires from live play;
  §7 session shape rewritten around the input budget.
- `INTERFACE.md`: game-state voice typography; the log page.
- `SLICE_SPEC.md`: stance system numbers; faculties ranges.
- `WORLD_DESIGN.md`: faculty-tested encounters; Bruno-axis content
  after the scholarship lands.
- `COMMANDS.md`: the alphabet survives (stances are letters too) but
  the per-unit verbs (O per unit, H/E) move to legacy.
- `docs/DECISIONS_AND_FORKS.md`: D-19 (this plan) recorded; F-1
  (per-unit hand choice) closes as overtaken.

## 9. Build order (each step green before the next)

1. **Stance engine** (pure, tested): stance → whole-block simulation
   over the existing recitation/scriptorium math; outcome record with
   narratable events. Input-count test.
2. **Voice expansion**: narrator content for every block × stance ×
   outcome band; game-state voice renderer; monologue deliberations at
   each stance choice. (Writing-coverage tests extend.)
3. **Beat log emission** + in-game day review from it.
4. **Faculties + study option** (chronicle-persisted, tested).
5. **Flashback system** + first three vignettes (envelope-complete).
6. **World layer redesign** with faculty-tested encounters; Bruno-axis
   content gated on the scholarship synthesis.
7. **Website log page** + hosted store + editable hands.

Steps 1–3 are one coherent windowful and change the game's feel
entirely; 4–7 stack on top independently.
