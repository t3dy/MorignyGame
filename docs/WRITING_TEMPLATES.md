# MORIGNY — Writing Templates & Register Checklists

*2026-07-29. Fill-in shapes for every content type, so future windows
(and other hands) produce records the tests accept and the style guide
recognizes. Copy the block, fill it, run the lint. Envelope rules are
`CLAUDE.md` rule 1; voices are `STYLE_GUIDE.md`.*

**The universal envelope** (every record, no exceptions):

```js
{
  id: 'kebab-case-id',
  // ...content fields per type...
  sources: [{ work: '…', locus: '…' }], // non-empty for attested/adapted
  status: 'attested' | 'adapted' | 'invented',
  verify: true,   // only when a claim awaits the Research Queue
  sim: { /* game math only — never historical claims */ },
}
```

Register quick-test before committing any record:
- **John (J)**: first person, long periods with late turns, combat-and-
  weather idiom for temptation, never ironic, never modern vocabulary.
- **Rubricator (R)**: imperative, liturgical, brief; starts `¶` when a
  heading; no adjectives it can't cite; no jokes.
- **Pencil (P)**: reflexive first person; cites precisely; may be moved
  or unsure; the only voice allowed modern terms; signs `— n.` in
  marginal-note position.

---

## T1 — Distraction record (recitation or copy pool)

```js
{
  id: 'copy-<slug>',
  kind: 'mundane' | 'memory' | 'flesh' | 'pencil',
  text: '…',                        // J unless kind: pencil (then P + cites)
  effects: { pressure: 0-3, despair: 0-1 },
  cites: ['biblio-key'],            // pencil kind only
  sources: […], status: '…',
}
```
Checklist: flesh-kind → Struggle register rules apply in full (interior,
never depicted, never comic, quiet). Pencil-kind → must cite a real
`BIBLIO` key; reading it should cost the player something they wanted.

## T2 — NPC (town or cloister)

```js
{
  id: '<name>', label: 'a <type> <doing something>',
  mapId: 'etampes' | null /* cloister: no tile */, x, y, // town only
  greeting: '…', // >20 chars; establishes voice and one concrete detail
  keywords: {
    name: { text: '…' }, job: { text: '…', unlocks: […] },
    '<substantive>': { text: '…', unlocks: […], effect: '<known-effect>' },
    bye: { text: '…' },
  },
  default: '…', // in-voice deflection, never "I don't know that"
  ...TYPE_ENVELOPE, // or a bespoke envelope citing the period type
}
```
Checklist: the NPC has *interests* (PACING §3d) or it should be an
encounter instead. Every `effect` must exist in `applyTalkEffect`.
Costly words (`necromancy`, `scorn`, `sewn`) sit ≥2 unlocks deep.

## T3 — Acquisition passage (exemplar entering custody)

```js
// in SCRIPTORIUM_TEXT.acquire
'<exemplar-id>': {
  text: '…', // J; the object, the channel, and the price felt in one breath
  sources: [{ work: '<register model or practice>', locus: '…' }],
  status: 'invented' | 'adapted',
}
```
Checklist: names the *cost's texture* (favor owed, coin counted, the
look Isabel gives), not numbers — numbers live in `sim`. Old
Compilation: tenderness+dread, no contraband thrill (HISTORY_CONSULT §2).

## T4 — Hazard / event beat (engine event → narration)

```js
'<event-type>': {
  text: '…', // J: felt in the body or the room; R only if procedural
  sources: [{ work: 'SCRIPTORIUM.md §1 (craft/hazard grounding)', locus: '…' }],
  status: 'attested' /* the hazard */ ,
}
```
Checklist: one event, one sentence-cluster, no mechanics-speak ("+2
fatigue" never appears in J or R). Sickness/fear beats: felt, not
clinical, never slapstick.

## T5 — Encounter (type-c: a scene with a state machine)

Structure (see the night and the examination for models):
```
rubric (R)            — '¶ Of …'
arrival (J)           — the situation, in the body
verbs (2–5, gradient) — each: choice label (R or J-imperative) + outcome
                        texts per gradient band (J)
silent branch?        — if the encounter can fail silently, the failure
                        text must wear success's face (NARRATIVE §4)
pencil note (P)       — optional, one, cited
```
Checklist: gradient outcomes, never binary; costs may hide; one or two
encounters per day max (PACING §3c).

## T6 — Pencil note (apparatus)

```js
{
  id: 'note-<slug>',
  text: '… — n.', // P; ≤ ~90 words; one idea; may confess uncertainty
  cites: ['biblio-key', …], // ≥1, must exist in BIBLIO
  sources: [{ work: '…', locus: '…' }], status: 'attested' | 'adapted',
}
```
Checklist: never explains a mechanic the player hasn't met; never
speaks for Fanger — cites her; "the database refuses" family of
self-disclosures is encouraged but ration to one per note.

## T7 — Examination / interrogation question

```js
{
  rubric: '¶ The <n>th question.',
  question: '…', // the period's real objection, sourced or verify
  stances: { submit: '…', defend: '…', scorn: '…' }, // all three, equal care
}
```
Checklist: scorn is radical *in 1315's terms* (WORLD_DESIGN §4.3);
submit is never craven, defend never anachronistic-liberal.

## T8 — City leaf caption (v2)

```js
{
  id: 'leaf-<city>',
  text: '<what the image is>, <maker/genre>, <date> — <centuries> after John. …', // P
  cites: […], sources: [{ work: '<archive/book>', locus: '<plate/shelfmark>' }],
  status: 'attested', // the image; the juxtaposition is ours
}
```
Checklist: date on screen always (`CLAUDE.md` rule 7); the caption's
second sentence may do the double-vision work (game-world vs document).

## T9 — Ending / verdict variant

```js
{
  rubric: '¶ …', body: '…', // J for the lived ending; P for framing endings
  sources: […], status: '…',
}
```
Checklist: every road burns the book (rule 5); [X] endings only behind
the departure annotation; the framing ending reads the *received* copy,
faults and all — the faults phrasing comes from the engine's classes via
the stemma map (WRITING_ASSETS_AUDIT §3).

## T10 — Refusal line (command alphabet, contextual)

One sentence, R or J-adjacent, in-world, never "you can't do that here."
The refusal should teach something about the world ("the 'Not here!' is
worldbuilding" — the tests quote it).

## T11 — Choice label (binding shape, `CLAUDE.md` rule 10)

Every `act(key, label, why, fn)` call in `main.js` is a choice label.
This is the highest-traffic template in the game — a player reads more
of these than any other single content type — and the one the clarity
pass exists because of. Full reasoning and worked before/after examples:
`docs/CLARITY_STYLE_GUIDE.md`.

```js
act('<KEY>',
  '<Verb: the concrete action, rubricator-terse>',
  '<Stakes: what kind of choice this is, and its exact price, in one line>',
  () => { /* … */ });
```

Fill the `why` line by asking, in order:
1. **Does this choice lean Obedient/Radical, or Rule/Work?** If yes,
   the line must say so in voice — not "this is the risky one" but a
   phrase that *reads* as risk without breaking register. Models:
   *"Obedience is a wall, and walls also shelter"* (safe) /
   *"The light is where you are watched"* (risk).
2. **Does this choice spend a bounded resource** (resolve, most
   often; occasionally fatigue)? If yes, state the exact number and
   the current pool: *"Costs 2 resolve (you have 3)"*. Do not round
   this into vibes — a player allocating a limited pool needs the
   real number, the same way `nightStakes()` in `main.js` computes a
   live percentage from `engine/struggle.js`'s pure `successChance()`
   rather than describing the odds in adjectives.
3. **Does this choice have a probability, not a flat cost** (the
   night verbs)? State the live percentage, computed from the engine's
   own exported pure function — never a hand-authored guess, since the
   real number changes with `john`'s current state and a guess will
   drift out of sync with the mechanics it describes.
4. **If none of the above apply** (a pure narrative branch, a Talk
   `bye`), the `why` line may be empty or purely atmospheric — legible
   stakes is a rule for choices that *have* stakes, not a mandate to
   invent tension where the fiction has none.

Checklist:
- [ ] Could a first-time player tell, from the label + why line alone
      and without opening the apparatus, what they are choosing and
      what it costs or risks?
- [ ] Is any numeric cost/chance computed live from engine state, not
      hard-authored prose that can drift?
- [ ] Does the label stay in its register (rubricator-terse for a Rule
      choice; John's-hand-adjacent only where the choice is voiced in
      his mouth, as in the night verbs and examination stances)?
- [ ] Is the evocative phrasing doing real informational work, or only
      decorating an otherwise-blank line? (A `why` of `''` is a bug
      under rule 10 unless step 4 above applies.)
