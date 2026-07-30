# MORIGNY — Narrative Design Report: The Scriptorium Stage

*2026-07-29. This report is written in the designer-scholar's own voice —
the same hand that writes the pencil notes. It is a working document, not
an authority: where it disagrees with `STYLE_GUIDE.md` or `CLAUDE.md`,
they win.*

---

## 1. What the scriptorium has to do, narratively

The game's thesis is that **transmission is the victory condition** — a
run's score is not what John kept but what got out, and how corrupt it
was when it did. Until now that thesis lived only in the stemma screen,
which *reads* the day. The scriptorium makes the player *produce* the
thing the stemma reads. That closes the loop between the two best
systems we have:

- The **recitation loop** taught the player that attention is a
  spendable, besieged resource.
- The **discernment system** taught them that the worst failures are
  silent and priced later.

Copying is those two lessons applied to the hand: an attention economy
whose failures are textual, heritable, and mostly invisible. The player
who has internalized H/E and the counterfeit vision already knows how to
be afraid in the scriptorium. We should not add a single new anxiety
mechanism — we inherit them all.

## 2. Register and voice assignments

Per `STYLE_GUIDE.md`, three hands, strictly kept:

- **John's hand** narrates acquisition, the grade, the hazards as they
  are felt (the sick headache off the orpiment; the shame of a leaf
  copied quick). He narrates *craft as devotion* — the colophon
  tradition gives us the register: labor named plainly, offered up.
- **The rubricator** owns the instruction surface: "¶ Of the day's
  work." "Let him keep to the leaf assigned." Hand-choice labels are
  rubrics, not tooltips.
- **The pencil hand** gets exactly three new notes this window (verba
  ignota; *scribere est orare*; the unverifiable first copy) and the
  one-time mechanical disclosure that attending doubles the unit's
  error chance. Resist the urge to let the pencil explain everything —
  its power is rationing.

## 3. The tedium question (the big risk)

Sixteen units of "press O" is a real danger. Three mitigations, in order
of importance:

1. **The distraction pool carries the drama.** In recitation the verses
   are the content; in copying the *interruptions* are. The new pool
   items are written to be missed — if the player holds fast through
   all of them, the session should feel slightly empty, the way the
   sources say the work actually felt. That emptiness is budgeted, not
   accidental (PACING §2: compression is honest).
2. **Sessions are short.** 10–16 units, one per day. The urge to let
   the player copy all afternoon must be refused; scarcity is what
   makes the deadline exemplars (pecia) legible later.
3. **The hand choice is a real dial.** Trusting the exemplar is
   genuinely fast and genuinely blind — the player who is bored is
   invited to gamble, which is exactly the historical failure mode
   (haste is how errors get in). Boredom converts to corruption
   pressure. This is the most elegant thing the engine gives us; the
   stage must surface speed differences visibly (units of light
   remaining) so the gamble is felt.

## 4. Silent failure and fairness

The eyeskip and the failed figure are never announced. Playtesting
instinct will say this is unfair; the design position is that **the
game's honesty lives at the reckoning, not at the desk**. Rules for
keeping silence fair:

- The *system* is disclosed even though *instances* are not: the pencil
  notes say plainly that eyeskip is silent, that the first copy is
  unverifiable, that figures fail without confessing. The player knows
  the world's physics; they just can't see this leaf's.
- Silence must be symmetrical: the proofread that finds nothing says
  "it reads clean" in the same voice whether it is true or not. Never
  wink (no "…or does it?"). The lie must be perfect or it is a tell.
- Every silent failure surfaces *eventually* (reckoning ledger, stemma
  faults, the framing ending). Nothing is silent forever; that would be
  cruelty without meaning. The window between act and consequence is
  the mechanic.

## 5. Choice-grammar audit (PACING §3 compliance)

| Moment | Type | Check |
|---|---|---|
| S/I/B at stage entry | (a) Rule choice | single letter, message-scroll answer ✓ |
| H/E mid-copy | (b) attention | inherited untouched from recitation ✓ |
| Hand choice | (a) | rubric-labeled, no dialogue box ✓ |
| Armarius/sacrist | (d) dialogue | they have interests (ledger, stores) ✓ |
| Isabel's `sewn` | (d) | she notices; the cost is in the talk effect ✓ |
| Proofread/figure/pigment | (a) | after-work verbs, one keypress each ✓ |
| The inventory (future) | (c) encounter | Evrart arrives; state machine; deferred to 3d ✓ |

No new choice *types* were needed — a good sign the grammar is holding.

## 6. Reward-loop hygiene (STYLE_GUIDE rule 5 extended)

The Struggle rules forbid making lapse desirable. The scriptorium has an
analogous trap: **making corruption desirable** because corrupt copies
are more interesting in the stemma. Mitigation: the stemma already
prefers the *least* corrupt surviving witness; the framing ending should
let a clean copy be quietly miraculous ("clean, which almost never
happens") rather than dull. Watch this in playtesting: if players start
farming faults for flavor, the ending text is mispriced.

Symmetrically: the illicit session (I) must not be strictly better
content than the assigned one (S). The assigned leaf gets real writing
(the lectionary is beautiful; obedience shelters) so that the Obedient
path (`WORLD_DESIGN.md` §4, pole 1) is a life and not a menu penalty.

## 7. Recommendations (actionable)

1. Ship the stage with the distraction pool at 10 and grow it to ~16
   with the Fanger reading — the craft items write themselves now, but
   the memory/flesh items specific to *copying the Work* (rather than
   reciting it) should wait for the sexual-temptation loci so the
   register is John's, not ours.
2. The `sewn` keyword on Isabel should not appear in her unlock hints
   the same way ordinary keywords do — bury it one step deeper than
   `orleans` and let the player *earn* the underworld connection.
3. Hold the candle (F-2) until the suspicion economy has been
   rebalanced against the new notice events; two suspicion faucets
   landing in one window will make the tuning unreadable.
4. When transmission lands (3d), the give-away choice should reuse the
   dialogue surface (Bridget, the brother, the correspondent are
   people, not menu rows) — reserve type-(c) encounter grammar for the
   inventory.

## 8. Open questions for the next window

- Should grade affect fault *count* (currently no — grade and faults
  are parallel outputs)? Engine says no; a scattered session already
  correlates with more attend-doubled rolls. Leave until data says
  otherwise.
- Does the Obedient path need its own scriptorium payoff (a finished
  lectionary as a witness-adjacent artifact)? Strong candidate for the
  framing ending's quiet branch. Logged as F-8.
