# MORIGNY — The Research Pipeline

*How scholarship becomes game content here, and how the repo enforces
it. Binding: `CLAUDE.md` rule 11. Machine-checked by
`tests/works.test.js` against `src/data/works.js`.*

The project's oldest rule is "no unsourced content." That rule turned
out to be too weak on its own: a record could carry
`sources: [{ work: 'Fanger, Rewriting Magic', locus: 'sexual-temptation
material' }]` and pass every test while resting on a claim Fanger does
not actually make. It did, for months, in shipped code. This document
exists because of that failure. See §5.

---

## 1. The intake path

Research enters the repo in one of three forms, and they are **not**
interchangeable:

| Tier | What it is | May content cite it? |
|---|---|---|
| **Source** | the scholarly work itself — Fanger's book, the Fanger–Watson edition, the Rule | **Yes.** This is what `sources[].work` names. |
| **Digest** | a summary of a source: our reading notes, briefs in `docs/scholarship/`, transcripts in `docs/research/` | **No.** A digest is how you *find* a claim, never what you cite for it. |
| **Design** | our own reasoning about mechanics | Only as `design`, and a record resting solely on it may never be `attested`. |

**A digest is a finding aid, not an authority.** When a digest tells you
something useful, you cite the *work it summarises*, and you mark the
claim `verify: true` until someone has seen it in the work itself. The
digest gets recorded in `docs/research/` so the next session knows where
the claim came in from.

This matters most for AI-generated or second-hand summaries, which are
exactly as fallible as they are convenient. `docs/research/` entries
must say, in their registry entry, what they are.

## 2. The works registry

`src/data/works.js` is the single canonical list of everything content
may cite. Each entry declares:

- `work` — the exact citation string content uses
- `kind` — `primary` · `scholarship` · `period-practice` · `design` · `digest`
- `grounds` — what this work is used to establish in the game
- `report` — the brief in `docs/scholarship/`, where one exists
- `aliases` — pre-registry phrasings, carried so old content still resolves

**Adding a work is a deliberate act.** You may not invent a citation
string in a content file; the test will reject it. You add the work to
the registry first — which forces you to decide what kind of claim you
are making and to look at what we already have — and then cite its
canonical string.

## 3. Writing a content record

1. **Find the claim in a source.** If a digest pointed you there, note
   the digest in `docs/research/` and keep reading toward the source.
2. **Resolve the work** in `src/data/works.js`. Not there? Add it, with
   its kind and what it grounds.
3. **Write the `locus` honestly.** "ch. 3, on penance" is a locus.
   "(frame)" means *this record takes its shape from that work without
   resting on a specific passage* — legitimate, and weaker.
4. **Set `status`** — `attested` (the sources say this), `adapted` (we
   extrapolated from what they say), `invented` (ours). When in doubt,
   go one step weaker.
5. **Set `verify: true`** if the claim came through a digest, or if you
   are asserting something a reader could check and you have not.
6. **Interior monologue in John's voice is always `invented`.** Rule 2
   is absolute: we never fabricate a quotation, and everything we write
   in his voice is marked as ours.

## 4. What the tests enforce

`tests/works.test.js`:

- every citation string in every content module resolves to the registry
- the registry is well-formed: unique ids, unique strings, scholarship
  entries link their brief, every entry says what it grounds
- **digests are never cited by content** — a digest is a finding aid
- the pillars stay load-bearing (if the game stops resting on Fanger,
  something has gone wrong with its premises, not just its footnotes)
- scholarship outweighs our own design rationale
- the unpinned `period-practice` share stays under 50%
- and it **prints a report every run**: how many citations, by kind,
  which works are most load-bearing, and which registry works nothing
  cites

Per-file provenance lints (in `content.test.js`, `memory.test.js`,
`encounters.test.js`, and others) still check the envelope on every
record. The registry test is the layer above them.

## 5. The failure this exists to prevent

**The sexual-temptation error (2026-08-31).** The game's Struggle
system — its central interior mechanic, a binding style rule, and the
content note shown at launch — was built on the premise that John's
recorded battles with sexual temptation were a documented centre of his
autobiography. Records cited `Fanger, Rewriting Magic` with loci like
"sexual-temptation material, frame."

On finally reading a careful summary of Fanger's actual argument
(`docs/research/fanger-summaries-2026-08-31.txt`), the position is
close to the opposite: a search of the Fanger material for
masturbation, lust, concupiscence and related terms finds no passage in
which John says he struggled with that, and "the sexual component is
not prominent in the Fanger text that we have." What Fanger documents
is that **John's principal temptation is the desire for forbidden
knowledge** — and, strikingly, that he asks for comprehensive knowledge
*as the thing that will let him resist sin*.

Ritual purity including continence remains real: the ars notoria and
the Liber florum both gate operation on it, and that is attested. What
was ours, unmarked, was the interior drama.

Three lessons, now enforced:

1. **A citation is a claim about a book, and claims about books are
   checkable.** The registry makes each one nameable; `verify` makes the
   unchecked ones countable.
2. **The direction of an error matters.** We did not merely
   over-attribute — we built a system pointed at the wrong subject and
   spent a great deal of writing on it. Fidelity failures are usually
   *interesting*, and the interesting version is usually the real one:
   knowledge-as-temptation is a better mechanic than the one it replaced.
3. **"Grounded in Fanger's scholarship" is a promise.** DESIGN.md makes
   it on the first page. A promise like that has to be redeemable by
   somebody opening the book.

## 6. The standing research queue

`BIBLIOGRAPHY.md` holds the queue of claims flagged `verify`. Moving an
item from `period-practice` to `scholarship` with a real locus is always
a welcome change and never needs justifying. The works-registry report
printed by `npm test` is the current scoreboard.

**Highest-value reading, in order:** the Fanger–Watson edition
(Introduction B for the manuscripts; the Book of Visions for the vision
sequence); Fanger, *Rewriting Magic* (to pin what
`docs/research/fanger-summaries-2026-08-31.txt` currently carries at
one remove); Fanger's "Divine Dreamwork" (2018) for the dream-incubation
practice the day loop is now built on.
