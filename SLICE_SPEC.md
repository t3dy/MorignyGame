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
