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

## Decisions taken (baking the clarity direction into system files, 2026-08-29)

**D-15 · Legible stakes formalized as a standing rule across the whole
system-file suite, not left as an implementation detail of one pass.**
D-14 shipped the fix (grounded narration + collapsible apparatus) but
left the underlying principle — that a choice must state its own
stakes — undocumented anywhere binding, and left one genuine gap
unfixed: the night verbs (V/P/C/W), the scene most directly tied to
the original playtesting note ("I want a system where it is clear that
you are investing willpower that has a limit"), shipped with blank
`why` lines. Fixed both problems together:

1. **Documented as binding, not just demonstrated.** `CLAUDE.md` gained
   rule 10; `PACING.md` gained a "Legible stakes" section under the
   choice-grammar chapter (the natural home, since it's a cross-cutting
   rule over all four choice types); `STYLE_GUIDE.md`'s rubricator
   section gained the choice-label register note; `DESIGN.md` gained
   Pillar 7; `WORLD_DESIGN.md` §4 gained axis-rule 5. `INTERFACE.md`'s
   "State Without Numerals" table gained an explicit scope carve-out
   (ambient display stays numeral-free; choice-time stakes state exact
   numbers) so the new rule doesn't silently contradict the old art
   pillar — the two were reconciled in writing, not left to quietly
   conflict. `INTERFACE.md`'s Pencil Apparatus section and `DESIGN.md`'s
   Fourth Wall paragraph were also corrected — both still described the
   pre-D-14 "toggle, default visible" apparatus; they now describe the
   shipped collapsible drawer. Doc drift from an unstated implementation
   decision is exactly the failure mode CLAUDE.md's binding-rules model
   exists to prevent; fixing it here, not leaving it for the next
   session to discover a mismatch.
2. **Fixed the one glaring gap.** The night verb choices' `why` lines
   were literally `''`. `main.js` gained `nightStakes(verb)`, which
   calls `engine/struggle.js`'s already-exported pure `successChance()`
   to compute a live percentage — never a hand-authored number that
   could drift out of sync with tuning — plus the fatigue cost where
   one exists, plus a parenthetical naming resolve as an input for
   Prayer and Withstand specifically, since those are the two verbs
   where the player's banked willpower measurably changes the odds.
   Yield's `why` line was also tightened to state its guaranteed
   outcome ("This always ends the same way") rather than only gesturing
   at inevitability.
3. **New reference doc, not just terse rule statements.** The system
   files above carry the binding one-liners; `docs/CLARITY_STYLE_GUIDE.md`
   carries the full worked before/after text (the actual Matins
   rewrite, the actual S/I labels, the actual Hold-Fast and new night-
   verb lines) plus a pre-flight checklist and an honest "not yet
   audited" list (`NIGHT_OUTCOMES` grounding, `EXAMINATION` stance
   stakes, the unwritten v2 city dialogue, the distraction pool's
   register question) so the next window knows what this pass covered
   and what it didn't, rather than assuming silently that everything
   old now conforms.

*Reconsider if:* a future system genuinely has no legible number to
show (a pure narrative fork with no mechanical weight) — T11 in
`docs/WRITING_TEMPLATES.md` already carves this out (step 4: an empty
`why` line is fine when the choice truly has no stakes; the bug was
leaving it empty when it *did*).

## Decisions taken (simplification pass, 2026-08-29)

**D-16 · A fourth voice, the narrator, replaces "ground before you turn"
as the game's scene-setting mechanism; John's hand becomes a short,
plain, first-person deliberation nested inside it.** Two rounds of
clarity fixes still read as opaque and overwritten — grounding a scene
entirely in John's own first-person voice produced accurate but long
passages that buried the actual choice. Feedback also asked for the
sexual-temptation material to be more direct. Resolved together, per
explicit user choice between a period-direct-only option and a
modern-explicit option (the user chose a third path — see below):

- **The narrator** (new, `STYLE_GUIDE.md` §The Four Hands #1): brief,
  third-person, modern in its clarity — closer to how Fanger writes
  *about* John than to how John writes about himself. One or two
  sentences, then stops. It is the one hand allowed to be direct about
  the Struggle (naming arousal, the urge, plainly) because it is
  documentary framing, not John's own confession.
- **John's hand** (#2) now nests inside the narrator as a short
  interior monologue — the actual deliberation, in his own period
  idiom, *always*, even the instant after the narrator named the plain
  fact above him. That gap between the two hands, stated as a binding
  rule, is what let the sexual-temptation content get more direct
  (narrator) while keeping John's own words exactly as careful as the
  project's founding "dignity owed to the dead" commitment requires.
- Rewritten to the new shape: `HOUR_TEXT.matins`, `DAYLIGHT` (the
  scriptorium fork — now near-verbatim the user's own worked example:
  "commentary on Matthew" vs. "the Work"), `CONFESSION.offerPolluted`/
  `offerClean`, and `NIGHT_DELIBERATION` (new, replaces the one-shot
  `NIGHT_SCENE` with a narrator+monologue pair per pressure tier).
  `SCRIPTORIUM_TEXT.sceneAssigned`/`sceneIllicit` shrank to one-line
  transitions since `DAYLIGHT` now carries the deliberation.
- `main.js` gained `deliberation()`/`sceneBody()`, rendering either
  shape through one call site; `ui.body()` now accepts arrays. CSS:
  `.narrator` (default roman) / `.monologue` (italic, inset) — no new
  hue, per `INTERFACE.md`'s palette discipline; two typographic modes
  of one ink, not two pigments.
- New test (`content.test.js`): asserts John's BESIEGED monologue never
  uses clinical language and does use his own idiom — the register
  split is now mechanically enforced, not just a style-guide promise.

*Reconsider if:* the narrator's "one or two sentences" limit starts
feeling clipped once the v2 city content is written — the limit is a
discipline against recreating the previous overcorrection, not a hard
ceiling; loosen it deliberately if a scene genuinely needs three.
*Not touched this pass:* the other six hours (Lauds, Prime's own body
text, Terce/Sext/None, Vespers, Compline) keep their single-voice
shape — they carry no choice, so the deliberation split wasn't the
fix they needed; `sceneBody()` renders them unchanged via the legacy
path, so nothing broke, but a future pass could still tighten them.

## Decisions taken (v3d slice: transmission, palimpsest, Bridget, 2026-08-30)

**D-17 · `chronicle.custody[]` gives copies a life beyond the day they
were made.** A journal resets daily, so before this, a finished copy was
sealed into its witness the same evening — no carrying a quire forward,
no giving away last week's copy, nothing for 1323 to threaten later.
Custody entries persist in the chronicle blob (additive, old saves
default to empty), carry full fault detail, and are resolved once at the
verdict via the already-tested `inventoryFinds()`. Transmission is Talk
(Bridget in new `KIN_NPCS`, Brother Anseau reused from the exemplar
loan, a tile-placed courier in Étampes), FIFO on the first not-given
copy; the palimpsest is the reserved `U` verb, pulling a real fault
from the player's own save history as an under-text distraction — never
mendable, per the verba-ignota precedent. The framing ending branches
three ways (obedient / nothing escaped / the received copy, gilded
preferred) from `receivedCopy()` + `transmissionEndingText()`.
*Deferred, unchanged:* the full mid-campaign Evrart inventory encounter
(F-5) — verdict-time resolution already makes concealment matter.

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
