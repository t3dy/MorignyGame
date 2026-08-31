# MORIGNY — Vertical Slice Spec (v1)

Concrete mechanics and tuning for the playable slice: **one liturgical day,
one night of the Struggle, one sought vision, three-hands apparatus.**
This file exists because `DESIGN.md` names the systems and this names the
numbers. Code lives in `src/`; tests in `tests/*.test.js`.

## John's state

| Field | Range | Meaning |
|---|---|---|
| `fatigue` | 0–10 | sleep debt; raises distraction chance |
| `resolve` | 0–5 | spendable willpower; `hold fast` costs it |
| `pressure` | 0–10 | the Struggle's siege level |
| `despair` | 0–5 | scrupulosity/acedia track; at ≥3 John is **scrupulous**: `hold fast` costs 2 resolve |
| `suspicion` | 0–10 | the community reading him |
| `purity` | flags | `polluted`, `confessed` — gates procedure validity |
| `procedure` | flags | `prayed`, `quality`, `licentia`, `corrupt` |

## Recitation loop (the core interaction)

A prayer is N verses. Each advance may spawn a **distraction** (marginal
gloss). Spawn chance `p = 0.15 + 0.03·fatigue + 0.04·pressure` (cap 0.6);
the pool is weighted toward temptation-tinged intrusions as pressure rises.
A pending distraction blocks the verse until resolved:

- **Hold fast** — costs 1 resolve (2 if scrupulous); the verse proceeds.
  Unavailable at 0 resolve: an exhausted John *must* attend.
- **Attend** — read it; the verse is lost (recitation lengthens) and the
  record's effects land (pressure, despair, memory flags). Some distractions
  are **pencil notes**: the scholarship itself pulling the eye. Reading them
  rewards the player and costs John — that tension is intended.

Quality = verses ⁄ (verses + lapses): **recollected** ≥ 0.9, **distracted**
≥ 0.6, else **scattered**. The procedure prayer requires ≥ distracted;
scattered choir recitation adds +1 suspicion (he is *seen* elsewhere-minded).

## Day arc (slice)

Matins (procedure slot + full recitation) → Lauds (brief) → Prime & chapter
(confession beat, suspicion) → daylight hours compressed (Terce–None
summarized; labor/lectio choice) → Vespers (brief) → Compline (recitation)
→ dormitory night → sought dream (if eligible) → **reckoning** (examination
of conscience: the day's ledger in period idiom + pencil endnote; witness
saved to localStorage).

All eight offices appear (coverage-tested); only some are played in full —
presence budgeting across many days is v2.

## The night (Struggle state machine)

Pressure tiers: QUIET 0–2, STIRRED 3–5, BESIEGED 6–8, CRISIS 9–10.
At BESIEGED+ the dormitory demands a choice; success chance by verb, then a
gradient roll — under half of success = **mastery** (pressure −4, resolve +1),
under success = **endured** (pressure −2), else **lapse** (`polluted`,
pressure resets to 2, despair +1).

| Verb | Success | Cost |
|---|---|---|
| Vigil | 0.75 − 0.03·pressure | fatigue +2 |
| Prayer | 0.60 + 0.05·resolve | — |
| Cold | 0.65 | fatigue +1 |
| Endure | 0.45 + 0.03·resolve − 0.04·pressure | — |

**Confession asymmetry (the design's spine):** at chapter, `confess` clears
pollution (despair −1); `delay` keeps the procedure invalid and adds despair;
confessing *without matter* adds despair — the scrupulosity spiral. Lapse
recovers in a day; despair lingers and taxes everything.

## Discernment (asymmetric errors)

Eligibility for the sought dream: procedure prayer completed at ≥ distracted,
not polluted, not corrupt. Authenticity seeded (60% true). Three tells drawn
from the vision's nature — color (*ultramarine* vs "a blue that flatters"),
speech (consonant with humility vs granting too much too fast), after-affect
(peace vs agitation) — with one ambiguous tell so it never reduces to
pattern-matching.

| | Vision was true | Vision was counterfeit |
|---|---|---|
| **Accept** | **Licentia** (gold): procedure advances | **Silent corruption**: seems to advance; revealed at reckoning — work void, pressure +2 |
| **Reject** | Licentia delayed; despair +1 (his recorded fear) | **Mastery**: resolve +1, pressure −2 |

## Scriptorium loop (v3 engine — built; stage pending)

A quire is N units (per exemplar, `data/exemplars.js`); copying reuses
the recitation grammar: the same distraction spawn `p`, hold fast (1
resolve, 2 if scrupulous), attend (lapse lands its effects **and the
unit's error chance doubles** — a distracted hand errs). Quality and
grades identical to recitation.

**Hands** (per unit): textualis `err 0.05, finger +1, catch 0.8` ·
cursive `err 0.12, finger +0.5, catch 0.4` · trusting `err 0.08, finger
+0.25, catch 0` — trusting does not construe and *cannot* catch
inherited faults. Error chance `= errBase · (1 + 0.05·fingerFatigue +
0.03·fatigue)`, cap 0.9. Fresh text errors split eyeskip 0.4 (silent) /
dittography 0.6 (visible); **verba ignota** units double the rate and
garble in their own class, never self-correctable.

**Light:** day + hot/unassigned leaf → notice 0.1/unit (+1 suspicion);
candle → fire 0.02/unit, seen 0.05/unit (**+3 suspicion**, the worst in
the game). Pecia deadline: 3 days held, then exceeded.

**Emendatio:** dittography → expunctuation; eyeskip → marginal insertion
*only after collation against another witness* (the first copy of
anything is unverifiable); verba ignota → never. Damage (blackened,
corrosion) is not an error and stands.

**Figures:** success `0.7 − 0.04·fatigue − 0.04·despair` (floor 0.2);
failure silently sets `copy.corrupt` **and** `procedure.corrupt` — the
result does not confess.

**Pigments:** orpiment sickens on grind 0.35 (fatigue +2) and blackens
against lead-white/minium/verdigris in either order; verdigris corrodes
the leaf 8 game-days after laying (compressed from years); ultramarine
marks the copy conspicuous; gold refused without licentia, else the copy
is gilded.

**Concealment → inventory:** shelved found always · loose 0.5 · bound
0.15 · given never — giving a copy away is the only real survival.

## Slice presentation

Typographic codex only — per `CLAUDE.md` rule 6, no imagery ships
without a provenance manifest, and none is cleared yet. CSS carries the
grisaille register: paper, iron-gall ink, vermilion rubrics, ultramarine
reserved for the vision, gold for licentia, graphite for the pencil hand.

## Slice tests

- Envelope lint: every content record has `sources[]` + valid `status`;
  `attested` requires a non-empty locus; invented text is marked.
- Coverage: every hour has authored text; every Struggle tier, night verb ×
  outcome, distraction, and discernment cell has writing.
- Determinism: same seed → same day, same distraction sequence, same vision.
- Machine correctness: quality math, tier boundaries, confession asymmetry,
  all four discernment outcomes reachable.

## v4: stances and faculties (docs/V4_LOOP_REDESIGN.md)

**Stances** (one choice per block; policy decides every hold/attend):

| Stance | Policy | Copy hand |
|---|---|---|
| vigilant | hold fast against every distraction while resolve allows | textualis |
| routine | hold fast against `flesh` only, while affordable | cursive |
| hasty | attend everything; spend nothing | trusting |

Same hold-fast cost math as before (1 resolve, 2 when scrupulous).
`firstBreak` records where a resisting stance's guard broke. The
Matins `P` option prays the Work vigilant by definition.

**Faculties** (0–5; each level costs level+1 study hours; study = the
daylight block, +1 fatigue): `learning`, `discretio`, `craft`,
`worldliness`. Persisted in `chronicle.faculties`. Live effect now:
craft multiplies the hand's base error rate by `max(0.5, 1 − 0.1·craft)`.
The rest are read by the world-layer encounters (v4 §6).

**Input budget**: ≤10 decisions per day, tested
(`tests/stance.test.js`). Continue-presses are page turns, not
decisions.
