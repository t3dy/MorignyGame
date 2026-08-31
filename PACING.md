# MORIGNY — Pacing, Balance, and the Grammar of Choice

Answers the design question: how do we balance the ordinary monastic day
against the necromantic underworld, the ecclesiastical and political
encounters, and the copying work — and when is a choice a *dialogue*, an
*encounter*, or something else entirely?

---

## 1. The ratio: what the game is mostly made of

**Roughly 70 / 20 / 10, by playtime:**

| Share | Layer | Why |
|---|---|---|
| **~70%** | The Rule and the Work — hours, recitation, the Struggle, copying, the night | This is the life. John was a monk for decades and a defendant for a week. A game that inverts that ratio is a game about a trial with monastery flavor. |
| **~20%** | The world: Étampes, the road, townsfolk, the book trade, the clerical underworld | Frequent enough to matter, rare enough to feel like leaving. |
| **~10%** | Ecclesiastical and political encounters — examiners, the archdeacon's clerk, the abbot, 1323 | Rare, heavy, and mostly *arriving at you* rather than sought. |

**The underworld is the rarest thing in the game and must stay that way.**
Kieckhefer's "clerical underworld" was not a place John commuted to; it was
a period of his youth at Orléans that he spent the rest of his life
answering for. So: necromantic material is mostly **memory** (the `notae`
distraction, the **N** command, the Orléans keyword going quiet in Isabel's
mouth) and only occasionally **transaction**. Making it a shop you visit
would falsify the whole thesis — the danger is that it is *in him*, not
that it is down the road.

## 2. Why the ordinary hours don't become filler

Three rules keep the 70% from being a chore:

1. **The ordinary hours are where the Struggle lives.** Matins is not
   downtime — it is the recitation loop, and the recitation loop is the
   temptation system. The most "boring" liturgical act is the most
   mechanically dense.
2. **Every routine act is dual-purpose.** The same hour serves the Rule
   *and* the Work; the same body-state gates both. Copying is labor,
   obedience, devotion, and conspiracy at once, depending on which leaf is
   under your hand.
3. **Compression is honest.** Terce/Sext/None collapse into one stage on an
   ordinary day. We simulate the hours that *cost* something and summarize
   the rest — the horarium is complete (coverage-tested) without being
   played minute by minute.

## 3. The grammar of choice — four kinds, deliberately distinct

The game should never present two different kinds of decision in the same
visual and mechanical clothing. Each has its own surface:

### (a) The **Rule choice** — a single letter, near-instant
Obey or don't. **O** to say the office, **S** to keep to the assigned
copying, **B** to let the bell carry the day. No dialogue box; the message
scroll answers. These are frequent, low-drama, and cumulative: they set the
body-state that everything else reads. *Most choices in the game are these.*

### (b) The **attention choice** — retired from live play (v4, D-19)
*Historical: was* **H** hold fast / **E** attend, repeating many times
within one scene. The v4 redesign (`docs/V4_LOOP_REDESIGN.md` §1) folds
this into the **stance choice**: the player commits once, up front, to
how the block will be kept (vigilant / the common discipline / by
rote), and the engine makes every hold/attend decision by that policy —
same math, same costs, one input. The Struggle's texture now lives in
the narrated outcome (the siege clauses, the game-state ledger) rather
than in repeated prompts. The engines still speak H/E internally
(`src/engine/stance.js` drives `recitation.js`/`scriptorium.js`
unmodified), so nothing about the simulation softened — only the
input surface.

### (c) The **encounter** — a scene with a state machine
The night siege, the discernment of a vision, the examination at Paris.
Distinguished by: a fixed small verb set, **gradient outcomes** (never
binary), and a cost matrix where the wrong choice may not announce itself
(the silent corruption pattern). Encounters are *rare and heavy*. One or
two per day at most.

### (d) The **dialogue** — keyword conversation, U5-style
Reserved for **people who have their own interests**. You type a word; they
answer in their own register; some words unlock others; some words cost you
(Isabel's `necromancy`, Evrart's `scorn`). Dialogue is where the *social*
world lives, and it is the only surface where the player composes rather
than selects — which is exactly right for the one domain where John must
choose his words rather than his acts.

**The load-bearing distinction:** dialogue is for people, encounters are
for situations, letters are for the Rule, and attention is for the self.
When a design impulse says "make this a dialogue tree," ask whether the
other party has interests. If not, it is an encounter.

### Legible stakes (binding, cuts across all four types)

Playtesting on the v1 slice found the opening scenes opaque: a new
player could not tell, from the choice text alone, that S/I at the
scriptorium desk was a fork between safety and risk, or that H (hold
fast) was spending a resource with a bottom. The fix is a standing
rule, not a one-off rewrite (`CLAUDE.md` rule 10; full worked examples
in `docs/CLARITY_STYLE_GUIDE.md`):

1. **Disposition-bearing choices say which way they lean, in voice, in
   the choice itself.** Not "this will feel obedient" discovered after
   the fact — the label or its `why` line names the fork as the player
   is choosing it. *"Obedience is a wall, and walls also shelter"*
   beside *"The light is where you are watched"* is the model: both
   evocative and unambiguous about which is safe and which is risked.
2. **Resource-spending choices state their exact price and the current
   pool, at the point of choice.** "Costs 2 resolve (you have 3)" is
   not a UI compromise to be prettied away — it is the information a
   player needs to make an informed spend, the same way a real account
   ledger states a balance before a withdrawal. This applies specifically
   to *choice-time* information; it does not require the ambient
   sidebar to abandon its pip/manuscript idiom (§ below).
3. **The type (a)/(b)/(c)/(d) grammar above already does half the work**
   — a Rule choice (a) is a single legible letter *because* it is
   simple; an attention choice (b) already shows its resolve cost. The
   discipline this section adds is: never let a choice's *evocative*
   phrasing substitute for its *legible* stakes. Beautiful and clear
   are not in tension; a choice that is only beautiful has failed half
   its job.

**Reconciling with "State Without Numerals" (`INTERFACE.md`):** the
numeral-free manuscript idiom governs *ambient, continuous* state —
what the sidebar shows you between decisions, always available, never
demanding attention. Legible stakes governs the *instant of decision* —
what a choice tells you as you are about to make it. A candle burning
down over an afternoon and a choice prompt that says "costs 2 resolve"
are not the same kind of information and do not compete for the same
register.

## 4. Where the ecclesiastical/political material belongs

Political pressure should almost never be a scene you *go to*. It arrives:

- **As inventory and audit** — Evrart asking friendly questions; a book
  census; the armarius noticing a requisition. Threat expressed as
  *paperwork*, which is historically exact and much more frightening than
  a confrontation.
- **As the suspicion track** — the community reading you, expressed in the
  margins as another hand's *nota bene* marks.
- **As chapter** — the daily institutional surface, where confession and
  fault-telling happen among your own.
- **As the summons** — once, at the end, when renown crosses the threshold.

The politics of the Church in this game is 95% ambient and 5% acute. The
one acute moment (the examination) earns its weight from the 95%.

## 5. Copying's place in the mix (per `SCRIPTORIUM.md`)

Copying should occupy the **labor slot of the day** — the thing you do with
your hands while the offices punctuate it. Target: present on most days,
dominant on none. It uses the recitation loop's grammar (units,
interruption, quality) so it *feels* like the sibling of prayer that it
historically was (*scribere est orare*), and it is the only system whose
output outlives the run — which is what makes it worth the screen time.

Its choices are mostly type (a) and (b): which hand to write in, whether to
work by candle, whether to construe the sense. The *acquisition* of
exemplars is dialogue (type d); the *inventory* that threatens them is an
encounter (type c).

## 6. Difficulty and the failure curve

- **No fail states, only gradients.** (House rule #4, inherited from
  DungeonAB.) You cannot lose the game before 1323; you can only arrive
  there with a worse life and a more corrupt book.
- **The interesting failures are slow**: despair accumulating, a corrupt
  figure discovered late, a witness that never got out.
- **Renown is the clock.** Every audacity moves you toward the summons.
  Playing safe means fewer, later, cleaner witnesses; playing bold means a
  richer book and an earlier trial. That tension *is* the campaign.

## 7. Session shape (v4)

A day is **at most 10 decisions** (tested:
`tests/stance.test.js` §input budget) and mostly *reading*: stance
choices whose consequences arrive as narrated outcome — the unbound
narrator, John's monologue, the siege clauses, the game-state ledger.
Continue-presses (the B that ends an hour) are page turns, not
decisions, and don't count against the budget. A chronicle (a full
campaign to 1323) is a handful of days. Short enough to replay, and
replay is the point: each run is another witness in the stemma.
