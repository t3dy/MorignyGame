# MORIGNY — Clarity Style Guide

*2026-08-29. This guide exists because two rounds of playtesting on the
v1 slice found the same failure from two angles: the opening scenes
read as opaque. A new player could not tell, from the text alone,
that copying the assigned leaf was the safe road and stealing an hour
for the Work was the risky one; and a player facing the night's
temptation could not tell that holding fast was spending a resource
with a bottom. Both gaps are now closed and both fixes are now binding
rules (`CLAUDE.md` rule 10, `PACING.md` §Legible stakes, `DESIGN.md`
pillar 7, `STYLE_GUIDE.md`'s "ground before you turn"). This document
is the worked-example companion: not new rules, but how to write to
the rules that now exist, with real before/after text from the pass
that established them.*

Companion documents: `docs/WRITING_TEMPLATES.md` (copy-paste shapes,
including T11 — the choice-label template this guide exists to
explain), `docs/DECISIONS_AND_FORKS.md` D-14/D-15 (the decision record).

---

## The two rules, in one paragraph each

**Ground before you turn.** Every scene opens on the concrete and
procedural — the room, the object in hand, the actual physical task —
before the sentence is allowed to climb into metaphor or confession. A
reader who has never touched a quire should still know, after the
first two sentences of a scriptorium passage, what a quire *is* and
what John is doing to it. The interior turn earns its metaphor by
first paying out in plain description.

**Legible stakes.** A choice's *type* (does it lean Obedient or
Radical; does it favor the Rule or the Work) and its *price* (an exact
number, where a spendable resource is at stake) must be legible at the
moment of choosing — stated in the choice's own label or `why` line —
never left for the player to discover only in the outcome text.

These are not the same rule solving the same problem twice: **grounding
is about scenes** (the paragraphs the player reads), **legible stakes
is about choices** (the options the player picks between). A scene can
be perfectly grounded and still hide its choices' stakes, and a choice
can state its stakes with total clarity inside a scene that never
tells you where you're standing. Both failures showed up in the
original v1 text; both needed a fix; neither fix substitutes for the
other.

---

## Worked example 1 — grounding (Matins, before and after)

**Before** (the original v1 text — atmospheric, but you don't know
where you are or what the two roads concretely are until you already
half-guess it from vibes):

> *"The bell had not yet rung when I woke, which I confess was not
> vigilance but fear; the dark of the dormitory lay on me like a hand.
> A single lamp burned, as the Rule provides. I rose, and my
> intention rose with me, and not all of it was for the choir."*

**After** (the rewrite — same voice, same confessional turn at the
end, but now grounded in a concrete room with a concrete population
and concrete clothing, and the "not all of it was for the choir"
turn is followed by a plain statement of what the two roads *are*):

> *"The bell that rings the dead of night has not yet rung, and I am
> awake before it, in the dark dormitory where twenty men sleep in a
> row of narrow beds, clothed, as the Rule commands, with one lamp
> burning at the far end so that no man wakes entirely blind. I dress
> by feel — the same wool, the same knots, my hands know the order
> without my eyes. This waking-before-the-bell I confess was not
> vigilance but fear; and my intention rose with my body, and not all
> of it was for the choir. Two roads leave this bed: the plain one,
> down to the church and the office only, and the other, which I have
> worn smooth this last year, toward the private prayer that is the
> Work — a second, unlicensed office, said inside the first, that asks
> of me not obedience only but risk."*

What changed, concretely:
- "twenty men," "narrow beds," "clothed," "one lamp burning at the far
  end" — a reader now has a room, a population, a light source, before
  any interiority starts.
- "I dress by feel — the same wool, the same knots" — a physical,
  procedural beat (this is what waking in a dormitory *does*, bodily)
  planted before the fear/intention sentence that follows it.
- The closing sentence — "Two roads leave this bed..." — is the
  grounding rule paying off directly into the legible-stakes rule: the
  fork is now *named*, in plain terms ("obedience only" vs. "risk"),
  the very first time the game asks the player to understand what kind
  of story this is.

## Worked example 2 — legible stakes (the scriptorium fork)

**Before** (a plausible first draft, not what shipped — labels the
action, not the stakes):

> `S — Scribe.`
> `I — Illuminate.`

A player has no way to know, from these two words, that one of them is
safe and the other is a risk with a suspicion cost attached. The
information exists in the engine (`I` runs the notice/suspicion
mechanics from `engine/scriptorium.js`), but it is invisible at the
point of choice — exactly the failure this guide exists to close.

**After** (what shipped, `src/main.js`):

> `S — Scribe: the assigned leaf. Obedience is a wall, and walls also shelter.`
> `I — Illuminate: steal the hour for the Work. The light is where you are watched.`

Neither line breaks the rubricator's terse register into confession —
they are still one clause of action, one clause of consequence. But
"walls also shelter" reads unambiguously as *safe*, and "you are
watched" reads unambiguously as *risk*, without either line needing
the word "safe" or "risk" in it. **Legible does not mean literal.** A
choice label can — should — stay in period voice; it just cannot
*rely* on the player already knowing the mechanics to decode which
voice-choice is the careful one.

## Worked example 3 — legible stakes, numeric (resolve and the night)

The recitation loop's Hold Fast choice was already correct before this
pass — it is the model the rest of the game now follows:

> `H — Hold fast to the text. Costs 2 resolve (you have 3).`

That line answers "what kind of choice is this" (spend a resource to
resist) and "what does it cost, right now, to me specifically"
(2 of my current 3) in one clause. It does not round the cost into
"a little effort" or "some of your strength" — a player managing a
bounded pool needs the number, the way a bank balance needs the
number and not a mood.

The night verbs (`V`igil, `P`rayer, `C`old, `W`ithstand) shipped
*without* this — their `why` line was empty. Under the new rule this
is a bug, and it is the one the clarity pass fixed alongside writing
this guide: `main.js`'s `nightStakes(verb)` now computes a **live
percentage from the engine's own exported `successChance()`** (never a
hand-authored guess, which would drift out of sync with the real
math the moment tuning changes) and states it plainly:

> `V — Rise and keep vigil… 71% to hold the night · costs 2 fatigue.`
> `P — Set the prayer against it… 75% to hold the night (your resolve, 3/5, is part of that number).`

The parenthetical on Prayer and Withstand does something the Hold Fast
line doesn't need to: it tells the player *why* the number is what it
is — that their banked resolve is doing work here too, closing the
loop the very first playtesting note asked for ("I want a system where
it is clear that you are investing willpower that has a limit").
Resolve isn't spent by these two verbs, but it is *read* by them, and
now the game says so.

---

## Reconciling with "State Without Numerals"

`INTERFACE.md`'s art-direction pillar — ambient state rendered as
manuscript convention (a candle burning down, pips instead of digits,
drolleries multiplying in the margin) rather than a modern HUD — is
still correct and still binding. It is not in tension with legible
stakes; it governs a different moment:

| | Ambient display (sidebar) | Choice-time stakes (`why` line) |
|---|---|---|
| **When** | Continuously, between decisions | At the instant of a specific choice |
| **Answers** | "How am I doing?" | "What will *this* cost me, *right now*?" |
| **Register** | Manuscript convention, numeral-free | Plain number, mechanical clarity |
| **Precedent** | Resolve pips `●●●○○` | "Costs 2 resolve (you have 3)" |

A glance at the sidebar should never require arithmetic. A choice
prompt should never require the player to have memorized a formula
from `SLICE_SPEC.md` to know what they're about to spend. Both things
are true at once because they're answering different questions.

---

## Pre-flight checklist (run this before committing new content)

For any new **passage** (uses `WRITING_TEMPLATES.md` T1–T9):
- [ ] Does the first sentence or two ground the reader in a concrete
      place, object, or physical action — before any metaphor or
      interior turn?
- [ ] Could a reader who has never done this task (recited an office,
      copied a leaf, ground a pigment) picture the physical mechanics
      of it from the prose alone?

For any new **choice** (`WRITING_TEMPLATES.md` T11):
- [ ] Run T11's four-question checklist in full.
- [ ] If the choice has a live-computable cost or odds, is it computed
      from the engine's own exported pure function, not authored by
      hand?

For a **pass over existing content** (see "What's not yet audited"
below): the same two checklists, applied retroactively; log the
before/after in `DECISIONS_AND_FORKS.md` the way D-14/D-15 do, so the
next window knows what changed and why.

---

## What's audited, and what isn't yet

Audited and conforming (this pass, 2026-08-29):
- All 8 `HOUR_TEXT` records (grounding)
- `DAYLIGHT`, `SCRIPTORIUM_TEXT.sceneAssigned`/`sceneIllicit` (grounding)
- Two `acquire` records; `CONFESSION`'s two offer-texts (grounding)
- The scriptorium S/I/T/B choice labels (legible stakes)
- The recitation H/E choice (legible stakes — was already correct;
  it's the model the rest of the pass follows)
- The night verb choices V/P/C/W and Yield (legible stakes — fixed
  alongside this guide; see `nightStakes()` in `main.js`)

**Not yet audited — flagged for the next writing window, not silently
assumed fine:**
- `NIGHT_OUTCOMES` (grounding — these are strong prose but were
  written before "ground before you turn" existed; spot-check against
  it before the v3d transmission work extends this file)
- `EXAMINATION` stances (legible stakes — submit/defend/scorn should
  each make clear, going in, roughly what they cost the disposition
  axis; currently that's discoverable only after answering)
- The v2 city NPC dialogue (unwritten; write it *to* this guide from
  the start rather than auditing it after — cheaper)
- `DISTRACTIONS` and `COPY_DISTRACTIONS` (grounding — these are
  deliberately compressed, single-image passages; whether they need
  the full ground-before-turn treatment or whether their brevity is
  itself the right register is an open craft question, not a known
  gap — a call for whoever writes the next batch, informed by
  playtesting rather than decided here in the abstract)

This list is honest bookkeeping, not a todo list demanding immediate
action — per house culture, ship the shape, mark what's unverified,
let the apparatus (or in this case, this document) say so.
