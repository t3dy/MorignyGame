# MORIGNY — Agent Guide (system file)

Standalone repository (grown out of the DungeonAB workspace): **monastic
life & practice simulator** of John of Morigny. **Start with
`HANDOVER.md`** (current state, what's in flight, continuation prompt).
Then read in order: `DESIGN.md`, `STYLE_GUIDE.md`,
`INTERFACE.md`, `COMMANDS.md`, `WORLD_DESIGN.md`, `SCRIPTORIUM.md`,
`ART_SOURCES.md`, `BIBLIOGRAPHY.md`; `SLICE_SPEC.md` holds the current
build's numbers. Code lives in
`src/` (engine is pure and tested; UI is DOM). These rules are binding
for everything in this repository.

> Also inherits `C:\Dev\CLAUDE.md`'s **Working Discipline** (verify-before-done, no secrets in chat, log decisions to a file, checkpoint long jobs) even where this file doesn't restate it.

## Standing Rules

1. **No unsourced content.** Every content record (data, narration, vision,
   Struggle event) carries `sources: [{work, locus}]` and
   `status: attested | adapted | invented`. Renderer and tests refuse
   records without them. Uncertain claims carry `verify: true` and appear in
   the Research Queue (`BIBLIOGRAPHY.md`).
2. **Never fabricate quotations** — not from John, not from Fanger, not from
   anyone. Invented text in John's voice is `status: invented`, and the
   in-game apparatus can disclose that.
3. **The Struggle simulates the temptation the sources actually
   document: the desire for forbidden KNOWLEDGE.** *(Corrected
   2026-08-31 — see `docs/RESEARCH_PIPELINE.md` §5 for the error this
   replaces.)* Fanger's John is tempted by knowledge, deceived through
   devotion, and asks God for comprehensive knowledge precisely so that
   he may *resist* sin. The register rules in `STYLE_GUIDE.md` remain
   binding: interior simulation only; never depicted; never mocked; no
   reward loop that makes lapse desirable. Ritual purity — including
   continence — stays a real gate on operation, because the sources put
   it there; but it is a **precondition**, not the interior drama, and
   no record may imply Fanger documents a sexual struggle she does not.
   Any new mechanic touching this system gets a style-guide check
   before merge.
4. **Use Fanger's method, not her person.** The pencil hand is the
   designer-scholar's own voice. It never bears her name or invents her
   words. Cite her constantly; impersonate her never. Where the game
   wants a scholar's *perspective*, the player occupies it — second
   person, in the archive — rather than any named living person.
5. **Fixed history stays fixed, and the line sits where the record
   actually ends.** 1323 always arrives on the historical path. No
   *unmarked* alternate history: the Radical Axis (`WORLD_DESIGN.md`
   §4) may carry a run out of the record ONLY through the mandatory
   in-fiction departure annotation ("Here the witness departs from the
   record"), logged in the witness. **But transgression is not by
   itself departure** (`NEWDIRECTIONS.md` §11): John demonstrably
   copied a necromantic book, sought out Jacob of Bologna, worked the
   Four Rings of Solomon, kept necromantic books after his conversion,
   and was composing a *nova nigromancia*. A player doing those things
   is inside the record and gets citations, not an annotation. The
   annotation fires where the *trajectory* leaves what the sources can
   support — refusing the recognition that historically came. Default
   agency = endurance, revision, transmission.
6. **Asset provenance before pixels.** No image or audio enters the repo
   without a complete `assets_manifest.json` entry (schema in
   `ART_SOURCES.md`). Processing beyond cleanup demotes `attested` →
   `adapted`, recorded in the manifest.
7. **Period discipline:** core-play imagery c. 1280–1330 northern France
   (see `ART_SOURCES.md`); later material only in the pencil apparatus and
   the whitening epilogue, always dated on-screen.
8. **Tests ship with mechanics** (house rule), plus this sub-project's own:
   provenance lint, schema validation, writing coverage
   (hour × obligation × interruption; every Struggle state), horarium
   integrity on seeded days.
9. **When the scholarship and a fun mechanic conflict, the scholarship
   wins** — then find the fun *inside* what the sources actually say. The
   record so far is that the sources are stranger and better than invention.
10. **Choices declare their stakes.** A choice's *type* (does it lean
    Obedient or Radical; does it favor the Rule or the Work) and its
    *price* (an exact number, where a spendable resource like resolve
    is at stake) must be legible at the moment of choosing — stated in
    the choice's own label or `why` line, in the register that choice
    belongs to — never left for the player to discover only in the
    outcome text. Ambient/continuous state (fatigue, suspicion,
    pressure) keeps the numeral-free manuscript idiom (`INTERFACE.md`);
    this rule governs the instant of decision, not the sidebar. Binding
    for every new choice. See `PACING.md` §Legible stakes,
    `STYLE_GUIDE.md` §Legible stakes, and `docs/CLARITY_STYLE_GUIDE.md`
    for worked examples and the choice-label template.
11. **The research pipeline is mandatory** (`docs/RESEARCH_PIPELINE.md`,
    enforced by `tests/works.test.js`). Every `sources[].work` string
    must resolve to the works registry in `src/data/works.js`; you may
    not invent a citation string in a content file. Adding a work means
    adding it to the registry first, with its `kind` and what it
    grounds. **Digests are finding aids, never authorities**: a summary
    of a source (including anything in `docs/research/` and the briefs
    in `docs/scholarship/`) tells you where to look — you cite the work
    it summarises, and carry `verify: true` until someone has seen the
    claim in the work itself. Rule 1 says cite something; this rule
    says cite something *real*, and know what kind of claim you are
    making. It exists because rule 1 alone did not prevent the
    sexual-temptation error (`docs/RESEARCH_PIPELINE.md` §5).
12. **Two modes of ritual agency** (`NEWDIRECTIONS.md` §11). Every
    ritual act declares whether John **adjures** (petitions; efficacy
    in the divine order; he cannot compel) or **conjures** (commands;
    efficacy in the operator). Both are playable and both get the full
    writing budget. Adjuration must never be the merely-weaker option:
    it is slower and less certain, and it is the only road on which
    *licentia* can be granted — which is the only thing that makes a
    witness blessed and a transmission worth having. Conjuration works
    now; adjuration is what works after 1323.

## Data layout (all under `src/data/`, as ES modules so both the
Vite app and the Node test runner import them directly)

| File | Contents |
|---|---|
| `hours.js` | canonical hours, seasonal horarium (present) |
| `rule.json` | Rule of St Benedict excerpts in play (RB 8–20 offices, 22 dormitory, 48 labor/lectio, chapter/discipline) |
| `liber_florum.json` | structure of the work: books, procedures, prayer sequences, figures — populate from the Fanger–Watson edition |
| `personae.json` | John, Bridget, the community, the Virgin, the apparitions |
| `chronology.json` | dated beats incl. 1323; `verify` until pinned |
| `visions.json` | vision episodes + discernment tells |
| `struggle.json` | temptation events/states; register-checked |
| `assets_manifest.json` | every art/audio asset's provenance |

**Record envelope** (all files):

```json
{
  "id": "…",
  "…": "content fields",
  "sources": [{ "work": "…", "locus": "…" }],
  "status": "attested | adapted | invented",
  "verify": false,
  "sim": { "mechanical fields — invention by definition, no sources needed": true }
}
```

Historical fields need sources; the `sim` block is where game math lives so
the two are never confused.
