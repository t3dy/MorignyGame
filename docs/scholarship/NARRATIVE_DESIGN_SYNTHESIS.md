# MORIGNY — Narrative Design Synthesis: Reading the Field

*Written in the designer-scholar's own voice — the same hand that writes the
pencil notes and `docs/NARRATIVE_DESIGN_REPORT.md`. A working document, not
an authority: where it disagrees with `STYLE_GUIDE.md` or `CLAUDE.md`, they
win. It reads across the seventeen reports in `docs/scholarship/` after
finishing all of them, and it does not repeat what each report's own
implications section already said — it goes looking for the seams between
scholars instead.*

---

## 1. What reading them back to back actually taught me

I went in expecting to find seventeen separate toolkits, one per system. I
came out finding something more like three live arguments the field is
still having, arguments this game has quietly already taken a side in
without saying so out loud. That's the real payoff of doing this as a
batch rather than one citation at a time: a single scholar reads like a
source; seventeen in a row read like a room full of people disagreeing
about how porous the boundary actually is, and disagreeing about it is
the more useful thing to overhear.

## 2. The clerical underworld, revised

Kieckhefer's phrase does real work in this project — `WORLD_DESIGN.md`
uses it correctly, credited, for Orléans. But reading Page's *Magic in the
Cloister* right after him makes the phrase's limits visible in a way
citing it alone never would. Kieckhefer's underworld is sociologically a
*place apart*: clerics operating in a milieu adjacent to, but distinct
from, ordinary institutional religious life. Page's Canterbury monks are
the opposite case in the same decades John was alive — not a milieu apart
at all, but professed brothers in good standing who acquired, bound, and
shelved magic texts as an unremarkable extension of monastic intellectual
life. Both are true, and neither cancels the other; John's own biography
sits closer to Page's picture than to Kieckhefer's (he's a monk, not a
wandering cleric), but his Orléans years — the frankly necromantic
material `DESIGN.md`'s Historical Ground already flags — are closer to
Kieckhefer's. The game currently uses "clerical underworld" as if it were
one stable place. It's actually naming two different sociologies that
happen to share a vocabulary, and John moves between both. If the
planned Orléans/Sens/Paris expansion wants real texture rather than one
flavor of "illicit magic town," the fix is cheap: let armarium-sourced
exemplars (`SCRIPTORIUM.md` §3.1, Page's register) sit visibly alongside
Isabel's and the Orléans pecia's underworld-sourced ones (Kieckhefer's
register), rather than treating "where you get an exemplar" as a single
flat list.

Bailey sharpens this further and in a direction I didn't expect: his
argument isn't just that the boundary is porous, it's that the boundary
*is itself the ongoing product of an argument*, actively redrawn by
whoever is doing the classifying, for their own institutional purposes.
That reframes something already built. The examination at Paris
(`src/engine/chronicle.js`'s `createExamination`/`verdict`) reads, on the
page, like the application of a settled rule to John's case. Bailey says
there was no settled rule to apply — the examiners are doing the same
live, interested boundary-work he documents happening across two
centuries, and John's "departed" outcome isn't him breaking a fixed law,
it's him refusing to accept that they have the authority to keep
redrawing the line in real time. That's a better description of what the
Radical Axis is actually about than "he goes too far" — it's available
as a pencil note now, at zero mechanical cost, and it would make Bailey's
critique of the magic/religion/science trichotomy legible as something
the *examiners* are doing to John, not just a historiographical footnote
about how scholars talk.

## 3. Two systems already do real scholarship without knowing whose it is

The stemma (`src/engine/stemma.js`) and the discernment system
(`src/engine/vision.js`) are the two best pieces of design in this
project, by the scriptorium report's own account, and reading Mathiesen,
Láng, and Newman back to back showed me that both are already doing
recognizable scholarly *method* in miniature, uncredited.

The stemma's whole vocabulary — sigla, descent, inherited vs. own
corruption, a "contaminated" witness — is standard stemmatic practice,
and Mathiesen's and Láng's careers are essentially this method applied to
real sprawling manuscript families (the *Clavicula Salomonis* corpus;
learned-magic manuscripts across Central Europe). Neither of them wrote
about John. That doesn't matter as much as it first appears to: what the
game needs from them isn't a fact about Morigny, it's *confidence that
this is how the real discipline actually thinks*, which is exactly the
kind of thing a pencil note can say once, plainly, without inventing
anything ("this is how editors actually reconstruct a stemma; here's who
does that work for real manuscripts, and it isn't John's"). Right now the
apparatus lets the stemma speak for itself without ever naming the
discipline it's imitating.

Newman does something similar for discernment but with a real fault line
underneath it. Her actual argument is that *discretio spirituum* was
never a private test a visionary ran alone — it was social: the
confessor, the community, and the visionary all had stakes in the
verdict, and the visionary was actively constructing legibility for an
audience, not just checking her own experience against a private
rubric. `judge()` is entirely interior to John. That's not a bug — it's
required by the Struggle's own register discipline (`STYLE_GUIDE.md`
rule 3, "interior simulation only"), and discernment isn't the Struggle,
so there's no actual rule violation in play. But it does mean the
current mechanic is Newman's theory with the *practice* half quietly
removed. If the design ever wants a confessor or community reaction
folded into a reported vision, Newman is the citation that would justify
it as more historically apt, not less disciplined — worth flagging as an
open possibility rather than a gap to be embarrassed about, since the
interior-only version is also defensible and was clearly a deliberate
choice.

## 4. Where the margins could go further

Camille's actual claim about Gothic marginalia is more specific than "the
margins comment on the center": the comment is usually keyed to the
*adjacent text*, a parody or inversion of what's directly above or below
it on the page. The recitation distraction pool (`src/engine/recitation.js`)
is content-agnostic by construction — any distraction can fire regardless
of which verse is actually being said. That was almost certainly the
right call for a first build (`docs/DECISIONS_AND_FORKS.md`'s D-2 keeps
the RNG stream regular precisely so pool contents don't have to be
content-matched). But it means the mechanic currently borrows Camille's
warrant without his precision: real medieval margins were funnier and
more dangerous *because* they knew exactly what they were mocking. A
future pass that keys a handful of drolleries to specific psalms or
procedure prayers — not a rewrite, an addition — would be the single
highest-fidelity upgrade available to an already-built system, and it
costs writing, not architecture.

## 5. The whitening thesis wants a second victim: the stemma itself

Klaassen's "whitening" is correctly scoped to the epilogue
(`DESIGN.md`), and that's right — it's a fifteenth–sixteenth-century
process, a century-plus after 1323. But his actual argument is that
whitening happens *across manuscript generations*, carried by later
owners and copyists reframing inherited material, not by a single
author's decision. The stemma already models generational descent. It
currently stops at the framing ending. Nothing says the epilogue couldn't
extend the stemma one or two more (very compressed, clearly `sim`) nodes
past 1323 — later hands recopying the surviving witness, gradually
reframing its most dangerous material as safer devotional practice —
which would let "whitening" be *shown happening to your specific copy*
rather than narrated as a general historical trend the pencil hand
describes from outside. This is scope, not a fix; I'm flagging it as the
single most promising unbuilt idea this reading turned up, not
recommending it get built now.

## 6. The gap I couldn't close: cross-cultural transmission

The design brief asked specifically about Jewish-Christian-Islamicate
transmission of magical texts, and Mesler is the scholar in this set
whose work bears most directly on it — and she's also the one this
research pass verified the least confidently. The honest finding is that
this is a real, currently unaddressed dimension of the *ars notoria*
itself: its claimed Solomonic origin and its *verba ignota* ("Hebrew,
Greek, Chaldean" words, per `SCRIPTORIUM.md` §1) are exactly the kind of
claimed-exotic-authority discourse her work on "legends of Jewish
sorcery" would help unpack. I don't think this project should build
anything here on the strength of one uncertain report. I think it should
know the gap exists, know roughly which scholar's shelf to pull from, and
treat any actual content in this space — especially anything depicting
Jewish characters, texts, or practices, even glancingly — as needing
real sourcing beyond this pass, not a design shortcut.

## 7. A caution shared by Peters, Veenstra, and, honestly, the 1323 notice itself

Both Peters and Veenstra's work amounts to the same warning from two
angles: a document that accuses someone of magic is never a neutral
window onto what that person did. It's an argument, built for an
audience, serving whoever commissioned or wrote it. The *Grandes
Chroniques* notice about John — still on `BIBLIOGRAPHY.md`'s Research
Queue, still `verify` — is exactly this kind of document. When it's
finally read and pinned, the pencil hand should probably say what it is
before it says what it claims: a condemnatory chronicle entry, not a
transcript. That's a one-line discipline, cheap to apply, and it's the
place where Peters's and Veenstra's shared caution meets this project's
own rule 1 (no unsourced content) most directly — the notice can be
`attested` as *a chronicle's claim*, without every detail inside it
automatically inheriting that status.

## 8. What honestly doesn't bear on anything

Not every scholar in a reading list earns a place in the mechanics, and
pretending otherwise would be worse than saying so. Conti's Observant
Franciscan preachers are a century-plus late and an ocean of political
geography away from Morigny; his real value here is showing the field is
still actively being worked by living scholars, not a source for
anything John-specific. Flint's accommodation thesis is centuries too
early to describe John's own moment directly — its value is depth, not a
citation for a fourteenth-century fact. Camille never wrote about ritual
magic at all. None of this is a strike against including them — the
brief asked for the field, not just the scholars who mention John by
name — but the reports say so plainly, and this synthesis should too:
several of these seventeen are here for structure and method, not for
facts that will ever carry a pinned `sources[]` locus.

## 9. If I had to pick three things to actually build next

Not a mandate — three candidates, in order of cheapness:

1. **A pencil note naming the stemma's and discernment's real
   disciplinary ancestors** (§3 above) — zero mechanical cost, pure
   writing, and it's the single most honest thing missing from the
   current apparatus.
2. **A handful of content-matched drolleries** keyed to specific
   procedure prayers (§4) — writing-only, extends an existing pool
   rather than building a new system.
3. **A framing-caveat on the eventual 1323 notice** (§7) — a discipline
   to apply once the Research Queue item is actually read, not a system
   at all.

Everything else above — the extended stemma, the confessor-facing
discernment, the cross-cultural content — is real, and I don't want it
lost, but it's scope, and scope decisions aren't mine to make from a
reading list.

## Citation note
This synthesis reads across the seventeen `docs/scholarship/*.md` reports
and does not introduce new bibliographic claims beyond what they already
contain; where it characterizes a scholar's argument it is restating that
report's own summary, not returning to primary sources independently.
It is a design-reflection document, not itself a citation source — any
game data record still needs its own pinned `sources: [{work, locus}]`
per `CLAUDE.md` rule 1, traced back to the actual scholarly work, not to
this file.
