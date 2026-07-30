# MORIGNY — Scriptorium Stage Spec (v3c)

Concrete build spec for wiring `engine/scriptorium.js` into the playable
day. Written 2026-07-29, before the stage code, so the choices are on the
record before the code makes them invisible. Companion documents:
`NARRATIVE_DESIGN_REPORT.md` (why these shapes), `HISTORY_CONSULT.md`
(what they stand on), `DECISIONS_AND_FORKS.md` (what we might undo).

The engine is pure and tested (30 tests). This document is only about
the **stage**: what the player sees, presses, and is told — and, as
important, what they are *not* told.

---

## 1. Where it lives in the day

The scriptorium replaces the current two-button `daylight` stage
(Terce–None compressed). Per `PACING.md` §5, copying occupies the labor
slot: *present on most days, dominant on none.* The stage budget is one
copy session per day, ~2–4 minutes of play.

```
Prime/chapter → THE SCRIPTORIUM (Terce·Sext·None) → Vespers
```

Road days keep the world stage instead; you cannot copy and walk to
Étampes in the same daylight. (Fork F-7: a half-day variant.)

## 2. The choice surface (type-a Rule choices, per PACING §3)

On entering the stage:

| Key | Choice | Grammar | Cost/effect |
|---|---|---|---|
| **S** | Scribe — keep to the assigned copying | Rule choice | copy session on the assigned (armarium) exemplar; +1 resolve on completion (obedience shelters) |
| **I** | Illuminate — steal the hour for the Work | Rule choice | copy session on a held Work exemplar (Old Compilation by default); engine's notice mechanics replace the old flat +1 suspicion |
| **T** | Talk — the armarius, or the sacrist | dialogue (type d) | keyword conversation; requisitions and warnings |
| **B** | Let the hour pass in choir and garden | Rule choice | no copy today; nothing gained, nothing risked |

`I` with more than one held exemplar opens a sub-prompt to choose which.
Exemplars in custody live in `john.items.exemplars` (ids into
`data/exemplars.js`); the Old Compilation is there from the start — his
own earlier redaction is the one thing no one had to sell him.

**Acquisition surfaces** (this window):
- *Armarium*: implicit — S always has the assigned exemplar; the armarius
  Talk gives it a face.
- *Isabel's sewn quires*: a new `sewn` keyword on Isabel (Étampes),
  unlocked from `orleans`, effect `give-exemplar-sewn` (+1 suspicion per
  `suspicionOnAcquire`). A road-day errand therefore feeds the cloister
  loop — the two layers finally trade.
- *Pecia, brother's loan*: *deferred* to the Orléans build (v2
  completion); records exist, acquisition text authored now, no surface
  yet. See `WRITING_ASSETS_AUDIT.md` §4.

## 3. The copy session (type-b attention choices)

Reuses the recitation UI grammar exactly — same margin, same H/E verbs,
same grade line — because the engine reuses its economy
(*scribere est orare* is a UI claim too).

**Flow:**
1. **Hand choice** (once per session; can be changed between units):
   - `S` — the set hand (textualis): slow, careful, costs the fingers
   - `C` — the quick hand (cursive): fast, error-prone
   - `F` — trust the exemplar: fastest, construes nothing
2. **Unit loop**: `O` advances a unit. Distractions interrupt exactly as
   in recitation: `H` hold fast (resolve, doubled when scrupulous), `E`
   attend (lapse; the engine doubles that unit's error chance — the
   stage says so once, in the pencil hand, and never again).
3. **The light**: a countdown line, `units of light remaining: n`,
   rendered in the verse box. When the session is the illicit kind, the
   line gains the engine's truth: *the light is where you are watched.*
4. **Engine events surface as log lines**: `noticed` (day), `caught`
   (inherited fault caught in the construing hand). `fire`/`seen` are
   candle events — the candle is **not in this window** (Fork F-2).
5. **End of session**: grade line (recollected/distracted/scattered) in
   the recitation's own words, then the after-work verbs:

| Key | After-work verb | What it does |
|---|---|---|
| **E** | Examine — read the copy over | proofread: visible faults (dittography) expunctuated, narrated; **silent faults stay silent** — if the copy holds only invisible faults the text says it reads clean, and lies |
| **G** | Gaze — draw the figure(s) | one `drawFigure` per figure in the exemplar's program; success and failure wear the same face, on screen as in engine |
| **R** | Rubricate — lay a color | pick one pigment (vermilion, orpiment, verdigris, ultramarine, gold); hazards fire from the engine; gold refused without licentia |
| **B** | Bind up the day's leaves | end the stage → Vespers |

**What the player is never told at the desk:** eyeskip happened; the
figure failed; what the verdigris will do. The reckoning and the stemma
tell them later, or never. This is the discernment system's silence
pattern applied to the hand, and it is the point of the whole build.

## 4. The journal and the witness

`journal.copies[]` gains one record per completed session:
`{ exemplarId, assigned, grade, faultsVisible, faultsTotal, corrupt,
gilded, conspicuous, pigments }` — the *witness* stemma integration
(copies as descent nodes, transmission choice, framing ending) is stage
3d, next window, but the data starts accumulating now so no run played
today is lost to that build.

`reckoning` gains one ledger line: what was copied, in which hand, and
the grade — plus, when hazards fired, their sentence.

## 5. The cloister NPCs (type-d dialogue)

Two new NPCs in `data/npcs.js`, exported as `CLOISTER_NPCS` (no tiles —
the abbey interior has no map; they are summoned by T inside the stage):

- **The armarius** (Brother Denis): assigns the work, keeps the
  armarium, remembers what is requisitioned. Keywords: name, job, work,
  book (his ledger — a soft inventory threat), bye.
- **The sacrist** (Brother Maur): keeps the supplies. Keywords: name,
  job, parchment (effect: `give-quire` — the sacrist's issue and
  Isabel's gift pool together), colors (unlocks `orpiment`), orpiment
  (the period's own hazard warning, in the rubricator's imperative), bye.

Contract identical to the town NPCs (name/job/bye/default + envelope);
the world test's contract loop extends over both lists; the
tile-reachability test stays on the town list only.

## 6. Writing manifest for this window

All records in `SCRIPTORIUM_TEXT` (content.js), all enveloped. Counts:

| Group | Records |
|---|---|
| Scene intro (assigned / illicit variants) | 2 |
| Acquisition (5 exemplars) + sewn-quires refusal before unlock | 6 |
| Hand choice lines | 3 |
| Copy distraction pool (craft/memory/flesh/pencil) | 10 |
| Grade lines | 3 |
| Proofread & correction beats (clean-lie, expunctuation, first-copy-unverifiable, verba refusal) | 4 |
| Figure narration (same face; gilded variant) | 2 |
| Pigment beats (5 pigments + sickened + reaction + gold-refused) | 8 |
| Light events (noticed; fire and seen authored for the candle build) | 3 |
| Caught-fault line | 1 |
| New pencil notes (verba ignota; scribere est orare; first copy) | 3 |
| **Total** | **45** |

Coverage-tested in `tests/scriptorium.test.js` (new describe block):
every exemplar has acquisition text; every hand, grade, pigment, light
event, and correction beat has writing; pencil notes cite `BIBLIO`.

## 7. Explicitly deferred (see DECISIONS_AND_FORKS.md)

- The candle (night copying) — engine done, stage not (F-2)
- Pecia deadline pressure on screen — needs multi-day custody UI (F-3)
- Collation (needs two witnesses of the same work in custody) (F-4)
- Concealment choice + Evrart's inventory encounter (F-5, 3d)
- Transmission (give the copy away) + stemma copies (3d proper)
- Palimpsest as a support choice with under-text rendering (F-6)
