# MORIGNY — Handover

*Rewritten 2026-09-01. The previous version described the v4 redesign
mid-flight and is now several major systems out of date. A fresh window
can pick up from here.*

---

## What MORIGNY is

A monastic life & practice simulator of **John of Morigny** (fl. c.
1300–1323): a Benedictine of the abbey near Étampes, a **priest**, a
**canon lawyer** trained at Orléans, and after 1308 his house's
**provost**. He copied a necromantic book from a cleric, was steered by
a physician toward the *ars notoria* as the safer alternative, came to
believe that art had been contaminated by demons — and did not stop, but
rewrote it as the *Liber florum celestis doctrine* under claimed Marian
authorization. In 1323 a chronicle records that a monk of Morigny's book
was condemned and burned at Paris. It survived in copies anyway.

Grounded in **Claire Fanger's** scholarship, and answerable to it: every
content record carries a source and a status, and the citations are
machine-checked.

## Live now

| URL | What |
|---|---|
| https://t3dy.github.io/MorignyGame/ | landing page — the project, the voices, the systems, the research |
| https://t3dy.github.io/MorignyGame/v3/ | **current build** |
| https://t3dy.github.io/MorignyGame/v2/ | archived, frozen |
| https://t3dy.github.io/MorignyGame/v1/ | archived, frozen |

Deploy mechanics and the recipe for shipping a v4: **`DEPLOY_STATE.md`**.

```bash
npm install
npm run dev     # http://localhost:5176
npm test        # 20 suites; prints two coverage reports (see below)
```

## The four binding disciplines

Read these before writing anything. Each exists because of a specific
failure, and each is enforced by tests.

1. **The research pipeline** (`docs/RESEARCH_PIPELINE.md`, rule 11).
   Every `sources[].work` must resolve to `src/data/works.js`, which
   records what *kind* of claim it is. **Digests are finding aids, never
   authorities** — a summary of scholarship tells you where to look; you
   cite the work it summarises and carry `verify` until someone has seen
   it there. *Exists because:* the game spent months simulating John's
   central struggle as sexual temptation, citing Fanger, when Fanger
   documents close to the opposite. See §5 of that document.
2. **The branch audit** (`docs/BRANCH_AUDIT.md`, rule 13). Every moment
   the game stops and waits is declared in `src/content/branches.js` and
   checked. A *decision* owes orientation, an interior voice, scholarly
   grounding where it claims something, and a plain statement of what
   each key does; a *continue* owes a label saying where it goes; a
   *surface* owes its controls, stated. **Never write a choice at an
   `act()` call site.** *Exists because:* the game shipped an opening
   that read, in its entirety, "Take up the day again."
3. **The address spine** (`docs/LOOP_SYNTHESIS.md` §2, rule 12). Every
   ritual act declares a rung from natural operation to pact — and the
   operator does not always land where he aimed.
4. **Fixed history** (rule 5). 1323 always arrives. Transgression is
   *not* departure: John really did copy a necromantic book and work the
   Four Rings. The departure annotation fires where the trajectory
   leaves what the sources support.

## The loop, as it stands

**The opening** is his early life, played: Chartres at thirteen, the
schools and the canon law, the necromantic book, Jacob of Bologna, the
years of keeping the art. It ends with the art *in his hands*, so the
campaign opens in **1301, during the ars notoria years**.

**A day** is ≤10 decisions and a great deal of reading:

| Beat | What is decided |
|---|---|
| Matins | the stance; whether to say the Work's prayer |
| Chapter | confession, or the scruple |
| Daylight | which of seven rooms, then what to do there |
| (rider) | an encounter, gated on faculty × affordance × risk |
| Compline | the stance |
| Night | the Struggle — the appetite for forbidden knowledge |
| Dream | judge the vision, whose legibility depends on disposition |
| The Writing | vision → prayer, at an address, under a frame |
| Reckoning | the ledger; read the day; read the book |

**Across days**, sim-time moves weeks or a season — you play the days
the record kept — from 1301 to the fire, with pinned beats at 1308 (the
provostship) and 1315 (the New Compilation).

## Code map

```
engine/   state · day · recitation · struggle · vision · commands · world
          talk · chronicle · scriptorium · stemma · stance · narration
          beatlog · faculties · memory · encounters · liberflorum
          calendar · practice · bridget · address · factions · ascent
          lifepath · branchaudit
content/  content · stance_content · memories · encounters · lifepath
          incipit · liberflorum_content · bridget_content · day_content
          examination_content · branches
data/     hours · worldmap · npcs · exemplars · materials · leaves
          assets_manifest · works · places
```

`npm test` prints two reports every run: **what the game rests on**
(citations by kind, most load-bearing works) and **branch coverage**
(54 declared, all clean).

## Where to pick up

1. **Grow the encounter pool.** Twelve is a proof of architecture. The
   engine is done and content-only additions are enforced by tests.
   Target ~40, weighted to `cloister`. Encounters currently only afford
   `cloister` — road and town encounters need affordances and a hook on
   the world stage.
2. **The knowledge portal and playthrough logs.** Both are listed as in
   progress on the landing page and both already have their data: the
   briefs under `docs/scholarship/`, and the beat log, which records
   every run in all four voices and is already readable in-game. Needs
   a lightweight hosted store; the app stays static.
3. **Provost duties.** He was provost after 1308, administering rents
   and tithes. The beat fires; the office does nothing yet.
4. **The player-as-scholar archive scenes** (decided: the player
   occupies the scholar's perspective, second person — never a named
   living person, rule 4).
5. **Wire the remaining faculties.** `craft` steadies the copying hand
   and the ascent's gifts feed all four, but `learning`, `discretio` and
   `worldliness` are otherwise only *tested* by encounter options. Do
   not add a faculty without an effect — that is how the licentia bug
   happened (D-18).

## Honest caveats

- **`AUDIT.md` is very stale** — it predates the whole v4 redesign.
  Trust `docs/LOOP_SYNTHESIS.md` and this file instead.
- **Encounters only fire in the cloister**, so a road day meets none.
- **`disposition` does two jobs** — the Radical Axis position and an
  input to `reach()`. `docs/LOOP_SYNTHESIS.md` §9 proposes splitting it;
  not done.
- **Much of `main.js` still renders declared branches from inline
  strings.** The content is declared and audited, and the opening, the
  day's rooms, the desk, the reckoning, 1323 and the two surfaces have
  been migrated onto it; other call sites duplicate their labels. This
  is tidy-up, not a correctness problem, but it can drift.
- **Everything from the digests carries `verify`.** The research queue
  in `BIBLIOGRAPHY.md` is the standing reading list, and the highest-value
  item remains the Fanger–Watson edition.

## Continuation prompt

> Continue building **MORIGNY**, a monastic life & practice simulator of
> John of Morigny, grounded in Claire Fanger's scholarship and live at
> https://t3dy.github.io/MorignyGame/v3/.
>
> **Read first:** `HANDOVER.md`, then `CLAUDE.md` (13 binding rules,
> enforced by tests). Before writing content, read
> `docs/RESEARCH_PIPELINE.md` and `docs/BRANCH_AUDIT.md` — those two
> govern how anything new gets made. `docs/LOOP_SYNTHESIS.md` explains
> how the systems compose. `DEPLOY_STATE.md` before touching deploy.
>
> **Non-negotiable:** cite only works in `src/data/works.js`; never cite
> a digest; declare every branch in `src/content/branches.js` before
> writing it; never write a choice at an `act()` call site; keep
> `npm test` green and read both coverage reports, not just pass/fail.
>
> **Verify in the running game, not only in unit tests** — the licentia
> bug (D-18) sat in shipped code because its unit test passed while the
> feature was unreachable in play.
>
> Pick up from HANDOVER "Where to pick up". Commit each completed piece.
