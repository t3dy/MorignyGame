# Edward Peters

## Who they are
(1936–2022 [death year verify]) American historian; Henry Charles Lea Professor of History, Emeritus, at the University of Pennsylvania, specializing in the religious, legal, and political history of medieval Europe.

## Core works relevant to this game
- ***The Magician, the Witch, and the Law*** (University of Pennsylvania Press, 1978) — this game's bibliography does not currently cite Peters, but this remains a standard reference on the legal and doctrinal history of magic accusation in medieval Europe.
- *Heresy and Authority in Medieval Europe* (University of Pennsylvania Press, 1980) — a sourcebook of primary documents on the legal apparatus of heresy prosecution, directly relevant background for inquisitorial procedure.
- *The First Crusade* (University of Pennsylvania Press) and other works — outside this project's scope.

## Their key intervention
Peters traces how magic moved, over the medieval centuries, from being treated primarily as a practical (if sometimes foolish or sinful) craft to being reconceived as a *legal category* bound up with heresy — a shift that mattered enormously for how magic accusations were actually prosecuted. As ecclesiastical and secular courts developed more systematic procedure (inquisitorial method, standards of proof, categories of culpability), magic and witchcraft accusations were increasingly folded into the same legal-theological machinery used against heresy, with real consequences for what counted as evidence, what confession meant procedurally, and what penalties applied. *The Magician, the Witch, and the Law* is essentially a legal-institutional history of how "magic" became prosecutable, complementing the doctrinal/theological histories (Bailey, Kieckhefer) with an account of actual court procedure and evidentiary standards.

## Narrative & mechanical implications for MORIGNY
- The 1323 examination (`src/engine/chronicle.js`'s `createExamination`/`answerQuestion`/`verdict`) is precisely the kind of procedural event Peters's legal-institutional framework describes — his work is the natural source to check the examination's three questions and its stance mechanic (submit/defend/scorn) against actual inquisitorial procedure and evidentiary categories, rather than a generalized "trial scene" template.
- His account of confession's specific *procedural* meaning in inquisitorial process (not just its sacramental meaning) is a useful parallel to check against the Struggle's own confession asymmetry (`src/engine/struggle.js`'s `confess()` — confess/delay/scruple) — these are two different registers of "confession" (sacramental vs. inquisitorial) that the examination scene may eventually need to distinguish carefully if it develops further, so as not to conflate a chapter confession with a legal deposition.
- Peters's account of the legal apparatus around heresy prosecution is good grounding for Sens's "ecclesiastical politics; where questions about a monk's book start becoming procedures" (`WORLD_DESIGN.md`) — the phrase "becoming procedures" is itself a Peters-shaped observation (informal suspicion turning into formal legal process), and future Sens content could draw on his account of exactly what that formalization looked like step by step.
- His sourcebook approach (primary documents with commentary) is a useful model for how the pencil hand could eventually present the *Grandes Chroniques* 1323 notice itself — as a primary document with critical apparatus around it, rather than paraphrased lore — once that notice's exact wording is pinned per `BIBLIOGRAPHY.md`'s Research Queue.
- Honest limit: Peters's *Magician, the Witch, and the Law* predates John by drawing mostly on earlier medieval and Carolingian-to-high-medieval material, and does not, to this researcher's knowledge, discuss John of Morigny specifically. His value is structural/legal-historical background for the examination scene, not a direct source for John-specific facts.

## Citation note
This report summarizes publicly available bibliographic information (University of Pennsylvania Press catalog, Wikipedia and standard biographical reference) and does not quote Peters directly; his death year is marked `[verify]`. It is a secondary research aid. Game data drawing on his work needs its own pinned `sources: [{work, locus}]` per `CLAUDE.md` rule 1.
