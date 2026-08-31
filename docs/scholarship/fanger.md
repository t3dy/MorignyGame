# Claire Fanger

## Who they are
Associate Professor of Religion and Director of the Medieval and Early Modern Studies Program, Rice University. Medievalist specializing in later Latin Christianity and texts/manuscripts of magic, especially Christian angel magic. This project's canonical scholarly source and, per `CLAUDE.md` rule 4, the source of the pencil hand's *method* (never her person or name).

## Core works relevant to this game
- ***Rewriting Magic: An Exegesis of the Visionary Autobiography of a Fourteenth-Century French Monk*** (Penn State University Press, 2015) — the game's founding text; John's biography, the Old/New Compilation rewriting, and Fanger's reflexive scholarly method are all drawn from here.
- Claire Fanger & Nicholas Watson, eds., ***John of Morigny, Liber florum celestis doctrine / The Flowers of Heavenly Teaching*** (Pontifical Institute of Mediaeval Studies) — the critical edition; structure, Book of Visions episode catalog, figures, Bridget material, and stemma-relevant textual variants all need to be drawn from here once on the desk.
- Fanger & Watson, "The Prologue to John of Morigny's *Liber Visionum*: Text and Translation," *Esoterica* 3 (2001) — freely available; the project's interim drafting reference.
- Claire Fanger, ed., *Conjuring Spirits: Texts and Traditions of Medieval Ritual Magic* (Penn State University Press, 1998) — contains Watson's essay announcing the McMaster manuscript.
- Claire Fanger, ed., *Invoking Angels: Theurgic Ideas and Practices, Thirteenth to Sixteenth Centuries* (Penn State University Press, 2012) — includes further Fanger work on John and angelic invocation more broadly.

## Their key intervention
Fanger's central argument is that John of Morigny is not a curiosity but a serious case study in how a devout, orthodox monk could experience, discern, and ultimately **rewrite** condemned ritual magic as licit Marian devotion — without ever experiencing this as hypocrisy. Her method is reflexive: she writes her own reading process, doubts, and interpretive choices into *Rewriting Magic* itself, treating the act of scholarly interpretation as continuous with (not detached from) John's own act of revision. This is the load-bearing move for the whole "porous boundary between condemned magic and licit devotion" thesis this game is built on — Fanger doesn't resolve the boundary, she shows a real person living inside its ambiguity and doing careful theological work with it.

## Narrative & mechanical implications for MORIGNY
- The pencil hand (`STYLE_GUIDE.md` §4, `DESIGN.md`'s Fourth Wall) is explicitly modeled on her reflexive method and explicitly forbidden from bearing her name or inventing her words (`CLAUDE.md` rule 4) — this is already correctly implemented; no change needed, just continued discipline as new pencil notes get written.
- The palimpsest/rewriting-as-devotion framing (`STYLE_GUIDE.md`'s Scholarly Values §2, the reserved `U` verb in `SCRIPTORIUM.md` §3.5, F-6 in `docs/DECISIONS_AND_FORKS.md`) is a direct mechanization of her Old→New Compilation argument: revision as care, not undo.
- The Struggle system's confession asymmetry (`src/engine/struggle.js`'s `confess()` — lapse recovers, scrupulosity lingers) should eventually be checked against her specific account of John's sexual-temptation passages and how she handles their register (`BIBLIOGRAPHY.md`'s open Research Queue item); this is the single highest-ROI unread text against currently-shipped mechanics.
- Bridget's characterization (`docs/DECISIONS_AND_FORKS.md` D-17's `KIN_NPCS`) is currently under-sourced and gated by R-11; Fanger's edition is the only place this can be responsibly filled in — until then Bridget content should stay `adapted`/`invented` and flagged.
- Fanger's account of John auditing his own visions' authenticity (quoted in `STYLE_GUIDE.md`'s sample pencil note) is the actual scholarly warrant for the discernment mechanic (`src/engine/vision.js`) existing as a *mechanic* at all — worth stating explicitly in-game once, since right now the game asserts the design choice without citing its source.

## Citation note
This report summarizes publicly available bibliographic information (Rice University faculty pages, Penn State University Press and PIMS catalog listings, ACLS fellowship records) and does not quote Fanger directly. It is a secondary research aid, not a substitute for reading *Rewriting Magic* or the Fanger–Watson edition. Game data drawing on her work needs its own pinned `sources: [{work, locus}]` per `CLAUDE.md` rule 1; several of the items above remain on `BIBLIOGRAPHY.md`'s Research Queue precisely because that reading has not yet happened.
