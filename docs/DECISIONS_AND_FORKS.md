# MORIGNY — Decisions & Forks

*A running log of design decisions with their reasoning, and the forks
we consciously did not take. Each fork carries "what would change our
mind." Append-only in spirit; amend by adding, not rewriting. Started
2026-07-29 with the v3 scriptorium build.*

---

## Decisions taken (v3 data + engine window, 2026-07-29)

**D-1 · Attend completes the unit with doubled error, rather than
losing the unit.** Recitation's attend loses the verse; copying's
attend keeps the unit but unsteadies the hand (error ×2 for that
roll). *Why:* losing a copied unit would mean lost parchment — a
material fiction we'd then have to simulate; and the doubled-error
model expresses the real failure mode (a distracted scribe writes on,
badly). *Reconsider if:* playtests show attend feels consequence-free
in short sessions.

**D-2 · The distraction roll is always drawn, pool or no pool.** Keeps
the RNG stream regular so a seed replays identically regardless of
pool contents. Pure engineering; no fiction at stake.

**D-3 · Verba ignota are never correctable — not even by collation.**
SCRIPTORIUM.md §3.3 gates correction on reading-with-understanding.
A mechanical letter-by-letter collation argument existed (historically
scribes did compare exemplars), but the spec's stronger claim is the
better mechanic and the sound bite is true: sense cannot rescue them.
*Reconsider if:* the Fanger–Watson reading shows John himself collating
verba (R-10); then add a costly, partial collation fix and mark it
attested.

**D-4 · Gold is gated at the pigment step, not the figure step.**
One entry point for gold (grindAndApply refuses without licentia)
instead of a gold parameter on drawFigure. The palette rule (gold =
licentia) stays enforceable in exactly one place. *Reconsider if:* the
stage wants gilded *figures* specifically (then the figure check reads
`copy.gilded`, still set in one place).

**D-5 · Verdigris corrodes in 8 game-days (years in life).** A
chronicle is a handful of days; an honest clock would never fire. The
compression is disclosed in `materials.js`'s header comment and is
`sim` math. *Reconsider if:* the campaign ever grows a real calendar.

**D-6 · Damage classes (blackened, corrosion) are not error classes.**
Errors are textual and (sometimes) correctable; damage is physical and
never correctable. Separate exported lists so tests and stemma phrasing
can treat them differently.

**D-7 · Silent failures return success-shaped values.** `drawFigure`
returns `{ drawn: true }` on success *and* failure; the proofread of an
eyeskip-only copy reports clean. The UI contract (NARRATIVE §4): the
lie must be perfect, disclosure happens at the system level (pencil
notes) and the reckoning.

**D-8 · Concealment odds: shelved 1.0 / loose 0.5 / bound 0.15 /
given 0.** Round numbers, tuned for legibility over realism; the
*ordering* is the historical claim (Page's camouflage), the numbers are
sim. *Reconsider:* after the inventory encounter ships and we see how
often Evrart actually arrives.

## Decisions taken (v3c stage window, 2026-07-29)

**D-9 · The scriptorium replaces the daylight stub entirely** (no
parallel "old daylight" branch). The S/I choice survives as the stage's
entry choice, so the old fiction is contained, not deleted; DAYLIGHT's
result texts retire from play but stay in content.js for the tests'
history. *Reconsider if:* pacing wants an occasional no-scriptorium
day; then B (let the hour pass) already covers it.

**D-10 · Cloister NPCs are scene-summoned, not tile-placed.** No abbey
interior map exists; building one for two conversations is a window of
tile work for no walk value. `CLOISTER_NPCS` export keeps the world
tests' tile assumptions intact. *Reconsider if:* the abbey ever gets
an interior map (chapter house, dormitory, scriptorium as rooms) —
then merge the lists and place them.

**D-11 · The Old Compilation starts in custody.** `john.items.exemplars
= ['old-compilation']` from day one: his own redaction is the one
exemplar nobody had to sell him, and it gives the I choice a target on
a fresh run. Historically plausible, biographically unverified (R-2);
the acquisition text is therefore about *taking it up again*, not
obtaining it.

**D-12 · Hand keys are S/C/F inside the session.** Letters are
contextual inside scenes (precedent: P/O/D/G/X elsewhere). S(et
hand)/C(ursive)/F(trust) avoids colliding with H/E which stay reserved
for the attention verbs mid-session.

**D-13 · No verba ignota strings on screen.** The stage renders the
*shape* of the unknown words, never invented strings presented as
genuine (SCRIPTORIUM.md §6, HISTORY_CONSULT §2.4).

## Decisions taken (clarity pass, 2026-08-29)

**D-14 · Citations moved from inline paragraph tags to a collapsible
apparatus drawer; John's hand gets a "ground before you turn" craft
rule.** Playtester feedback: the opening scenes read as opaque —
every paragraph ended in a small citation tag regardless of whether it
carried real sources, and the prose leapt from bare rubric straight to
confessional metaphor without ever describing the room, the object, or
the physical task, so a new player couldn't tell what was concretely
happening or what a choice concretely risked. Fix, two parts:
1. *Presentation*: `passage()` now pushes a citation to `#apparatus`
   (a slide-out drawer, closed by default, opened by a small edge tab
   or by clicking a passage's tiny superscript marker) only when the
   record carries non-empty `sources[]`. Plain `invented`-with-no-
   sources narration — most of the game's prose — gets no marker at
   all now, which removed the majority of the visual clutter without
   losing a single citation; `ui.footnote()` routes the same way.
   The margin's diegetic pencil-kind distractions keep their inline
   provenance tag (that citation is content — part of what the player
   is choosing whether to read — not apparatus).
2. *Craft*: STYLE_GUIDE.md's John's-hand section gained a bullet
   ("ground before you turn") requiring concrete physical/procedural
   description before the interior/confessional turn. Rewritten under
   it: all 8 `HOUR_TEXT` records, `DAYLIGHT`, `SCRIPTORIUM_TEXT.scene-
   Assigned/sceneIllicit`, two `acquire` records, and `CONFESSION`'s
   two offer-texts. The S/I scriptorium choice labels were also
   tightened to state the fork's stakes in the label itself
   ("Obedience is a wall, and walls also shelter" / "The light is
   where you are watched") rather than leaving risk-vs-safety implicit.
*Reconsider if:* the drawer's marker-suppression on sourceless records
ever hides something a reader actually wanted cited — the fix there is
a per-record opt-in flag, not reverting to always-inline. *Applies
going forward*: every new passage written under `WRITING_TEMPLATES.md`
should be checked against the "ground before you turn" rule, and
should not expect readers to open the apparatus to understand a scene.

## Forks not taken (open, with triggers)

**F-1 · Per-unit hand micro-choice.** Spec says the scribe chooses per
unit; stage v1 sets a session hand switchable between units. Full
per-unit prompting = 16 prompts of friction. *Take it if:* players
report wanting mid-quire tactical shifts and the switch affordance
goes unfound.

**F-2 · The candle (night copying).** Engine complete (fire/seen
events); stage deliberately withheld: two new suspicion faucets in one
window would make tuning unreadable (NARRATIVE §7.3), and R-12 (how
general was the candle prohibition?) is open. *Take it when:* notice-
event suspicion data exists from real runs, and R-12 is read. Design
sketch: a night-stage fork before the Struggle — the candle hour costs
sleep (fatigue), risks fire, and the Struggle rolls against a wearier
John after.

**F-3 · Pecia deadline on screen.** Needs multi-day exemplar custody
UI (`deadlineExceeded` exists). *Take it with:* the Orléans city build,
where the rental and return live.

**F-4 · Collation scene.** Needs two witnesses of the same work in
custody — only possible after transmission/copies exist (3d). The
"first copy of anything is unverifiable" line does real work *because*
collation arrives late. *Take it in:* 3d or immediately after.

**F-5 · The inventory encounter (Evrart).** Type-c encounter, the
concealment table's payoff. Deliberately 3d: it needs copies worth
finding. The threat is already planted in his Étampes dialogue.

**F-6 · Palimpsest as a support choice.** The scraped leaf with the
Old Compilation ghosting through is the design's best image
(INTERFACE.md's rewriting verb) and deserves a window where it can be
more than a menu row — under-text distraction records that quote the
player's own earlier run's faults. *Take it when:* copies persist
across runs (3d+) so there is a real under-text to show.

**F-7 · Half-day: road *and* desk.** Currently exclusive. *Take it
if:* v2 city trips make full road days feel too expensive against
copying progress.

**F-8 · The Obedient path's own artifact.** A finished lectionary as
the [O] run's witness-adjacent object, read in the framing ending's
quiet branch. *Take it in:* 3d ending work; costs ~2 records.

**F-9 · Haplography as a fourth error class.** Folded into eyeskip for
now (three classes are teachable; four are a textbook). *Take it if:*
a pencil note wants to disclose the simplification and someone misses
the distinction in practice. Cheap to add: the engine's class list and
one narration record.

**F-10 · Materials as consumed inventory.** Parchment/ink quantities
are not tracked; sessions assume supply. Tracking would give the
sacrist's issue and Isabel's trade real weight but adds a hunger-bar
economy the design may not want (the scarcity that matters is *light*
and *attention*). *Take it if:* playtests show requisition dialogue
feels weightless. Watch instead: `sim.coin` fields already exist.
