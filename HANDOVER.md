# MORIGNY — Handover

*Rewritten 2026-08-31, at the end of the v4 redesign session. Supersedes
the previous handover (which described the v1/v2 recitation-grammar
build). A fresh window can pick up from here without re-reading the
conversation.*

---

## What MORIGNY is

A monastic life & practice simulator of **John of Morigny** (fl. c.
1300–1323), the Benedictine who practiced the *ars notoria*, repented of
it, and rewrote it as the *Liber florum celestis doctrine* under claimed
Marian authorization — condemned and burned at Paris in 1323, surviving
only in copies. Grounded in **Claire Fanger's** scholarship, whose
reflexive method (the scholar written into the narrative) is the model
for the game's fourth wall.

Standalone repo: `github.com/t3dy/MorignyGame`. Vanilla JS + Vite, no
framework. Engine is pure and seeded-deterministic; UI is DOM.

## Live now

| URL | What |
|---|---|
| https://t3dy.github.io/MorignyGame/ | landing page, links all three builds |
| https://t3dy.github.io/MorignyGame/v3/ | **current** — the reading-forward redesign |
| https://t3dy.github.io/MorignyGame/v2/ | archived, frozen — the recitation-grammar campaign |
| https://t3dy.github.io/MorignyGame/v1/ | archived, frozen — the original prototype |

Deploy mechanics, the freeze pattern, and the three-step recipe for
shipping a v4 are in **`DEPLOY_STATE.md`** — read it before touching
deploy config.

> **Version numbering, once, clearly:** *site* versions (the v1/v2/v3
> URLs) and *design-doc* versions drifted apart historically. Site v2
> contains internal design version "v3d". The current site v3 is internal
> "v4". Everything below says **v4** meaning the redesign now live at
> `/v3/`. The landing page speaks site numbers only.

```bash
npm install
npm run dev          # http://localhost:5176
npm test             # 12 files, all green
```

## What the redesign changed (the short version)

**Before:** a day was dozens of keypresses — press O per verse, H/E per
distraction, unit by unit through a copy session.

**After:** a day is **≤10 decisions and a lot of reading** (enforced by
test). You choose a *stance* — how much of himself John spends on a
block of work — and the engine plays the whole block out on the same
untouched math, then narrates what happened in five voices.

Full plan of record: **`docs/V4_LOOP_REDESIGN.md`**. Decisions D-18…D-22
in `docs/DECISIONS_AND_FORKS.md`.

## Built and shipped this session

1. **The licentia fix (D-18).** A licence earned in the night's dream
   was wiped by the next day's `createJohn()`, so `grindAndApply()`
   refused gold in *all* real play — the whole gilding mechanic was
   dead content. `chronicle.licentia` now persists it until a gilding
   spends it. **This is the session's cautionary tale: verify mechanics
   end-to-end in the running game, not just in unit tests.**
2. **The stance engine** (`src/engine/stance.js`) — vigilant / the
   common discipline / by rote, each a deterministic hold-vs-attend
   policy over `recitation.js` and `scriptorium.js` (whose math is
   untouched). Stance also picks the copy hand, closing fork F-1.
3. **Five voices** (`src/engine/narration.js`,
   `src/content/stance_content.js`) — the scholarly narrator *unbound*
   (D-16's 1–2 sentence cap reversed: it now explains monastic and
   magical context at length), John's monologue, composed siege
   clauses, and the **new fifth voice**: a dry game-state ledger.
   Tested to **never disclose silent failures**.
4. **The beat log** (`src/engine/beatlog.js`) — every rendered line and
   choice captured per hour, persisted into the witness, replayable at
   the reckoning via **L — "Read the day as it was written."** This is
   the exact record the future website log page consumes.
5. **Faculties + Lectio** (`src/engine/faculties.js`) — learning,
   discretio, craft, worldliness; advanced by study hours competing for
   the same daylight; persisted in the chronicle. Craft already
   steadies the copying hand (live effect ships with the system — the
   D-18 lesson).
6. **Memory vignettes** (`src/engine/memory.js`,
   `src/content/memories.js`) — boyhood letters, Orléans and the art,
   the renouncing, teaching Bridget. Fired once per chronicle at the
   adult decision each explains; one real choice each; **echoed
   forward** when that decision recurs. Disposition shifts capped at
   one step in the engine (D-21: youth explains, the adult record
   decides).
7. **The encounter pool** (`src/engine/encounters.js`,
   `src/content/encounters.js`) — twelve encounters, three registers,
   three tiers, built on four mechanisms lifted from the workspace's
   other games (`docs/ENCOUNTER_SYSTEMS_STUDY.md`):
   - **faculty × affordance gating** — an option exists where what John
     can do meets what the situation offers; `unlockedBy` lets the UI
     say *why* a choice is available
   - **riders** — encounters ride the daylight block, costing no pacing
     budget
   - **escalation ladder** — shuffled within tier, concatenated across;
     the deck outlasts the run *by design*, so content is always left
     unseen
   - **risk bag** — heresy / exposure / debt / scandal, seeded by the
     player's own choices; grave encounters *require* tokens, so late
     trouble is consequence, not weather
8. **The scholarship shelf** (`docs/scholarship/`) — 17 scholar reports
   plus a narrative-design synthesis, commissioned to ground the
   Bruno-axis work. Uncertain facts carry `[verify]`.
9. **The Bruno axis recast (D-21)** — following Michael Bailey: radical
   is not "John sins harder" but **John contesting the examiners'
   authority to draw the licit/illicit line**. Two encounters already
   implement this (`chapter-accusation/contest`,
   `commission-of-inquiry/jurisdiction`); both are gated on a lean
   already earned across days.

## Code map (`src/`)

```
engine/     state · day · recitation · struggle · vision · commands
            world · talk · chronicle · scriptorium · stemma
            stance ★ narration ★ beatlog ★ faculties ★ memory ★ encounters ★
content/    content.js · stance_content.js ★ memories.js ★ encounters.js ★
data/       hours · worldmap · npcs · exemplars · materials · leaves
            assets_manifest
ui/         tiles.js
main.js     controller: keyboard dispatch, scenes, DOM
morigny.css grisaille codex + Ultima V frame
                                              ★ = new this session
```

Tests (12 files, `npm test`): `engine`, `content`, `world`, `chronicle`,
`scriptorium`, `stemma`, `stance` ★, `narration` ★, `beatlog` ★,
`faculties` ★, `memory` ★, `encounters` ★.

## Next steps, in the order I'd take them

### 1. Grow the encounter pool (highest value, pure writing)
Twelve encounters is a proof of architecture, not a rich world. The
engine is done and tested; **adding an encounter is now a content-only
change** — append a record to `src/content/encounters.js` and the tests
enforce the envelope, unique keys, legible stakes, and the
declare-your-lean rule automatically.

- Target ~40, weighted toward `cloister` (PACING §1: the underworld must
  stay rare — a test already fails if it exceeds 40% of the pool).
- The sourcing well is `docs/scholarship/` + the source→encounter matrix
  pattern noted in `docs/ENCOUNTER_SYSTEMS_STUDY.md`.
- Adopt AlchemyLabRoguelike's **batch-of-twelve** workflow: draft 12
  skeletons, ship the best 6 fully written.
- **Gap to close:** every encounter currently declares
  `affordances: ['cloister']`, so none fire on a road day. Road/town
  encounters need `affordances: ['road']` / `['town']` and the world
  stage needs a `maybeEncounter` hook (`leaveDaylight()` is the model).

### 2. The website log page (the biggest unbuilt feature)
`docs/V4_LOOP_REDESIGN.md` §7. The beat log already produces and
persists exactly the right data; nothing consumes it beyond the in-game
day review. Needs:
- a lightweight hosted store (serverless function + KV/Supabase — the
  app itself stays static);
- a page rendering a playthrough's beats as one document;
- **editing, with player emendations rendered as their own hand** (never
  silent replacement — the decision is made and is thematically
  load-bearing), plus a toggle for clean reading text.
- When this lands, `DEPLOY_STATE.md` gains a second host and a secrets
  note. **Secrets go straight into the host's secret manager — never
  into chat or a committed file.**

### 3. The departed-path epilogue (D-21)
The Radical Axis can reach `departed` at the examination, but the run
still ends at the verdict. Owed: a multi-beat **authored narrated
epilogue** (scholarly narrator + the departed John's hand) tracing the
counterfactual life — exile, open teaching, and plausibly a fire of his
own. No new playable systems. Every beat under the departure
annotation's dating discipline; rule 5 binds throughout.

### 4. Wire the remaining faculties to something
`craft` has a live effect. `learning`, `discretio`, and `worldliness`
are *tested* by encounter options (that is real, and shipped) but touch
no other system. Natural next hooks: `discretio` improving the dream's
tell quality (`vision.js`), `learning` in the 1323 examination,
`worldliness` on the road. **Do not add a faculty without an effect** —
that is how the licentia bug happened.

### 5. Amend the remaining docs
`docs/V4_LOOP_REDESIGN.md` §8 lists the doc amendments this plan
obligates. `STYLE_GUIDE.md` (five hands), `PACING.md` (§3b retired, §7
rewritten), `SLICE_SPEC.md` (v4 numbers) are **done**. Still owed:
`INTERFACE.md` (game-state voice typography, the log page),
`COMMANDS.md` (per-unit verbs moved to legacy), `WORLD_DESIGN.md`
(faculty-tested encounters; the recast axis), and `AUDIT.md` (stale —
it still describes the v1/v2 build).

### 6. Research queue (unchanged, still the real blocker on `verify`)
Fanger's *Rewriting Magic* and the Fanger–Watson edition, with
`BIBLIOGRAPHY.md`'s queue in hand. Every memory vignette and several
encounters carry `verify: true` pending it.

## Known gaps and honest caveats

- **Encounters only fire in the cloister** (see next-step 1). A road day
  currently meets no encounters at all.
- **`AUDIT.md` is stale** — it predates the redesign entirely.
- **The 1323 examination has not been rewritten** in the boundary-contest
  terms D-21 specifies. The recast is implemented in the *encounter*
  pool but `content.js`'s three examination questions still read in the
  old scorn/audacity framing. This is the largest inconsistency in the
  repo right now.
- **`localStorage` is shared across site versions** (same origin) — a v2
  save and a v3 save use the same keys. Loaders default missing fields
  additively so nothing crashes, but a clean test run wants site data
  cleared. Noted in `DEPLOY_STATE.md`.
- **The scholarship reports carry `[verify]` marks** on several living
  scholars' current affiliations. They are a research aid, never a
  citation source for game data (`CLAUDE.md` rule 1 still requires each
  record's own pinned `sources[]`).

## Continuation prompt (paste into a new window)

> Continue building **MORIGNY**, a monastic life & practice simulator of
> John of Morigny (fl. c. 1300–1323), grounded in Claire Fanger's
> scholarship. The v4 reading-forward redesign is **built, tested, and
> live** at https://t3dy.github.io/MorignyGame/v3/.
>
> **Read first:** `HANDOVER.md` (this file), then `CLAUDE.md` (binding
> rules, enforced by tests), `docs/V4_LOOP_REDESIGN.md` (the plan of
> record), `STYLE_GUIDE.md` (five voices), and
> `docs/CLARITY_STYLE_GUIDE.md` before writing any new scene or choice.
> `DEPLOY_STATE.md` before touching deploy config.
>
> **Binding and test-enforced:** no unsourced content (every record
> carries `sources[]` + `attested|adapted|invented`); no fabricated
> quotations from John, Fanger, or anyone; the Struggle material stays
> interior and never depicted; fixed history stays fixed (1323 always
> arrives; counterfactuals only through the marked departure
> annotation); choices declare their stakes and their lean at the
> moment of choosing.
>
> **Recommended next task:** grow the encounter pool from 12 toward 40
> (`src/content/encounters.js` — content-only; the tests enforce the
> rules), and give road/town encounters their affordances plus a
> `maybeEncounter` hook on the world stage. See HANDOVER "Next steps".
>
> **House discipline:** tests ship with mechanics (`npm test` stays
> green), the engine stays pure and seeded-deterministic, and **verify
> new mechanics in the running game, not just in unit tests** — the
> licentia bug (D-18) sat in shipped code precisely because its unit
> test passed while the feature was unreachable in play. Commit each
> completed piece.
