/**
 * MORIGNY — the works registry: the single canonical list of everything
 * game content is allowed to cite. This is the machine-checkable half of
 * the research pipeline (docs/RESEARCH_PIPELINE.md; CLAUDE.md rule 11).
 *
 * WHY THIS EXISTS. Before it, `sources: [{work}]` accepted any string, so
 * the same book accumulated four spellings ("Page, Magic in the
 * Cloister" / "Sophie Page, Magic in the Cloister" / "…(camouflage by
 * binding)") and nothing could answer the question that actually
 * matters: *which scholarship is this game resting on, and where is it
 * resting on nothing in particular?* The registry answers it, and
 * `tests/works.test.js` refuses any citation that does not resolve here.
 *
 * KINDS — the honest gradient from "pinned" to "we made this up":
 *   primary          John's own texts and the period documents.
 *   scholarship      modern secondary literature; `report` links the
 *                    brief in docs/scholarship/.
 *   period-practice  standard reference knowledge about how medieval
 *                    monasteries, scriptoria, and book trades worked.
 *                    Real, uncontroversial, and NOT pinned to a page.
 *                    Every one of these is Research Queue pressure:
 *                    the goal is to move them to `scholarship` with a
 *                    locus. Their count is reported, so the debt is
 *                    visible instead of invisible.
 *   design           our own design rationale. Explicitly NOT a
 *                    scholarly claim; a record resting only on `design`
 *                    may never be `attested`.
 *
 * ADDING A WORK. Do not invent a citation string in a content file. Add
 * the work here first — which forces you to look at docs/scholarship/
 * and BIBLIOGRAPHY.md and decide what kind of claim you are making —
 * then cite its canonical `work` string. `aliases` exist only to carry
 * pre-registry content; new content uses the canonical string.
 */

export const WORK_KINDS = ['primary', 'scholarship', 'period-practice', 'design', 'digest'];

/** Kinds a content record may cite. A digest is a finding aid: it tells
 *  you where to look, and you cite the work it summarises. Enforced by
 *  tests/works.test.js (CLAUDE.md rule 11). */
export const CITABLE_KINDS = ['primary', 'scholarship', 'period-practice', 'design'];

export const WORKS = [
  // ── Primary: John, and the documents of his world ──────────────────
  {
    id: 'liber-florum',
    kind: 'primary',
    work: 'Fanger & Watson (eds.), Liber florum celestis doctrine',
    author: 'John of Morigny, ed. Claire Fanger & Nicholas Watson',
    year: 2015,
    grounds: 'the structure of the Work itself: books, procedures, prayer sequences, figures, the Book of Visions episodes, Bridget',
    report: 'docs/scholarship/fanger.md',
    aliases: ['Fanger & Watson (eds.), Liber florum'],
  },
  {
    id: 'esoterica-prologue',
    kind: 'primary',
    work: 'Fanger & Watson, Esoterica 3 (2001)',
    author: 'Claire Fanger & Nicholas Watson',
    year: 2001,
    grounds: 'the Prologue to the Liber visionum in text and translation — the first reference for John\'s own voice',
    report: 'docs/scholarship/watson.md',
    aliases: [],
  },
  {
    id: 'rb',
    kind: 'primary',
    work: 'RB 1980 (Rule of St Benedict)',
    author: 'ed. Timothy Fry',
    year: 1981,
    grounds: 'the horarium, the offices, dormitory and chapter staging, labor and lectio, the care of the sick, the reception of guests',
    report: null,
    aliases: ['RB 1980'],
  },
  {
    id: 'vulgate',
    kind: 'primary',
    work: 'Vulgate',
    author: null,
    year: null,
    grounds: 'the psalms and versicles actually said in the offices',
    report: null,
    aliases: [],
  },
  {
    id: 'grandes-chroniques',
    kind: 'primary',
    work: 'Grandes Chroniques de France',
    author: null,
    year: null,
    grounds: 'the 1323 notice: the condemnation and burning at Paris. A chronicle\'s CLAIM, not a transcript — see docs/scholarship/peters.md',
    report: 'docs/scholarship/peters.md',
    aliases: [],
  },

  // ── Scholarship: the field this game answers to ────────────────────
  {
    id: 'fanger-rewriting',
    kind: 'scholarship',
    work: 'Fanger, Rewriting Magic',
    author: 'Claire Fanger',
    year: 2015,
    grounds: 'John\'s biography and chronology; the visions read as contamination; the Old/New Compilation rewriting; scrupulosity and the sexual-temptation material; the reflexive method the pencil hand imitates',
    report: 'docs/scholarship/fanger.md',
    aliases: ['Fanger, Rewriting Magic (rewriting as devotion, frame)'],
  },
  {
    id: 'watson-visions',
    kind: 'scholarship',
    work: 'Watson, "John the Monk\'s Book of Visions" (Conjuring Spirits, 1998)',
    author: 'Nicholas Watson',
    year: 1998,
    grounds: 'the modern rediscovery (the McMaster manuscript); John\'s account of his Orléans years; the framing ending',
    report: 'docs/scholarship/watson.md',
    aliases: ['Watson, in Conjuring Spirits (1998)'],
  },
  {
    id: 'kieckhefer-magic',
    kind: 'scholarship',
    work: 'Kieckhefer, Magic in the Middle Ages',
    author: 'Richard Kieckhefer',
    year: 1989,
    grounds: 'the "clerical underworld" — always in quotes, always credited on first use (STYLE_GUIDE terminology sheet)',
    report: 'docs/scholarship/kieckhefer.md',
    aliases: [],
  },
  {
    id: 'page-cloister',
    kind: 'scholarship',
    work: 'Page, Magic in the Cloister',
    author: 'Sophie Page',
    year: 2013,
    grounds: 'monks acquiring, binding, cataloguing and domesticating magic texts — the cloister register of D-21, against Kieckhefer\'s milieu-apart',
    report: 'docs/scholarship/page.md',
    aliases: [
      'Sophie Page, Magic in the Cloister',
      'Sophie Page, Magic in the Cloister (camouflage by binding)',
      'Sophie Page, Magic in the Cloister (monks acquiring magic texts)',
      'Monks acquiring magic texts (after Sophie Page)',
    ],
  },
  {
    id: 'veronese-ars-notoria',
    kind: 'scholarship',
    work: 'Véronèse, editions and studies of the ars notoria',
    author: 'Julien Véronèse',
    year: null,
    grounds: 'what John actually practiced: the art\'s prayers, its notae, its verba ignota, and its transmission',
    report: 'docs/scholarship/veronese.md',
    aliases: [
      'Véronèse, ars notoria editions',
      'Véronèse (ars notoria transmission)',
      'The ars notoria: figures (notae) and verba ignota (after Véronèse)',
      'The ars notoria’s verba ignota (after Véronèse)',
      'Verba ignota admit no correction-from-sense (after Véronèse)',
      'Period objections to the ars notoria (after Kieckhefer, Véronèse)',
      'Figure fidelity as efficacy (ars notoria; John’s Book of Figures)',
    ],
  },
  {
    id: 'klaassen-transformations',
    kind: 'scholarship',
    work: 'Klaassen, The Transformations of Magic',
    author: 'Frank Klaassen',
    year: 2013,
    grounds: 'the long "whitening" arc by which ritual magic was reframed toward Renaissance learned magic — the epilogue layer\'s spine',
    report: 'docs/scholarship/klaassen.md',
    aliases: [],
  },
  {
    id: 'newman-i-saw',
    kind: 'scholarship',
    work: 'Newman, Speculum 80 (2005)',
    author: 'Barbara Newman',
    year: 2005,
    grounds: 'how visionary experience was cultivated and reported; discretio spirituum as a social practice — the discernment system\'s spine',
    report: 'docs/scholarship/newman.md',
    aliases: [],
  },
  {
    id: 'carruthers-memory',
    kind: 'scholarship',
    work: 'Carruthers, The Book of Memory',
    author: 'Mary Carruthers',
    year: 1990,
    grounds: 'trained attention and memoria as craft — the warrant for treating custodia oculorum as labor',
    report: 'docs/scholarship/carruthers.md',
    aliases: [],
  },
  {
    id: 'camille-margin',
    kind: 'scholarship',
    work: 'Camille, Image on the Edge',
    author: 'Michael Camille',
    year: 1992,
    grounds: 'the Gothic margin — warrant and grammar for the drollery-pressure mechanic',
    report: 'docs/scholarship/camille.md',
    aliases: [],
  },
  {
    id: 'bailey-boundaries',
    kind: 'scholarship',
    work: 'Bailey, on the boundaries of magic, religion, and science',
    author: 'Michael D. Bailey',
    year: null,
    grounds: 'boundary-work as an institutional practice: the licit/illicit line is drawn by whoever is classifying. The basis of D-21\'s recast Radical Axis',
    report: 'docs/scholarship/bailey.md',
    aliases: [],
  },
  {
    id: 'peters-magician',
    kind: 'scholarship',
    work: 'Peters, The Magician, the Witch, and the Law',
    author: 'Edward Peters',
    year: 1978,
    grounds: 'accusation documents as arguments built for an audience, never neutral windows onto what a person did',
    report: 'docs/scholarship/peters.md',
    aliases: [],
  },

  // ── Period practice: real, standard, and not yet pinned ─────────────
  // Each of these is Research Queue pressure. Moving one to
  // `scholarship` with a locus is always a welcome change.
  {
    id: 'codicology',
    kind: 'period-practice',
    work: 'Standard codicology, summarized in SCRIPTORIUM.md §1',
    author: null,
    year: null,
    grounds: 'quires, bifolia, ruling, pricking, the physical facts of making a book',
    report: null,
    aliases: ['Gregory’s Rule (quire arrangement)'],
  },
  {
    id: 'scriptorium-practice',
    kind: 'period-practice',
    work: 'Monastic scriptorium practice (RB 48; silence; the light)',
    author: null,
    year: null,
    grounds: 'how a copying room ran: hours, silence, daylight, the prohibition on candles',
    report: null,
    aliases: [
      'RB 48 (labor and lectio); colophon commonplaces',
      'Medieval colophon commonplace ("three fingers write")',
    ],
  },
  {
    id: 'monastic-offices',
    kind: 'period-practice',
    work: 'Monastic offices: the armarius and the sacrist (RB 48 frame)',
    author: null,
    year: null,
    grounds: 'the obedientiaries a scribe actually dealt with, and what each controlled',
    report: null,
    aliases: [
      'Monastic book provision (RB 48; the armarius and the armarium)',
      'Monastic lending and the favor economy (period type)',
    ],
  },
  {
    id: 'pecia',
    kind: 'period-practice',
    work: 'Pecia system (university stationers; Paris, Bologna)',
    author: null,
    year: null,
    grounds: 'the rental-exemplar trade, adapted to Orléans; deadlines on borrowed books',
    report: null,
    aliases: ['Pecia rental (university practice, adapted to Orléans)'],
  },
  {
    id: 'textual-criticism',
    kind: 'period-practice',
    work: 'Textual criticism (collation); Fanger–Watson apparatus',
    author: null,
    year: null,
    grounds: 'collation, stemmatics, and the vocabulary of inherited error — see docs/scholarship/mathiesen.md and lang.md for who does this work for real manuscripts',
    report: 'docs/scholarship/mathiesen.md',
    aliases: [],
  },
  {
    id: 'period-types',
    kind: 'period-practice',
    work: 'Period types after Kieckhefer; Pentiment-style town surface',
    author: null,
    year: null,
    grounds: 'the townsfolk a monk met: apothecary, stationer, archdeacon\'s clerk — types, not attested individuals',
    report: 'docs/scholarship/kieckhefer.md',
    aliases: [],
  },
  {
    id: 'regional-geography',
    kind: 'period-practice',
    work: 'Regional geography: Morigny abbey and Étampes on the Juine',
    author: null,
    year: null,
    grounds: 'the real places and distances the world map is built on',
    report: null,
    aliases: ['Notre-Dame-du-Fort, Étampes (12th-c. collegiate church)'],
  },

  // ── Scholarship added from the 2026-08-31 digests ──────────────────
  {
    id: 'fanger-invoking-angels',
    kind: 'scholarship',
    work: 'Fanger (ed.), Invoking Angels',
    author: 'Claire Fanger (ed.)',
    year: 2012,
    grounds: 'theurgy as a historiographical category — the contested middle between liturgy and nigromancy; "the operator adjures more than conjures"; sacred language whose efficacy does not depend on the operator understanding it',
    report: 'docs/scholarship/fanger.md',
    aliases: [],
  },
  {
    id: 'fanger-dreamwork',
    kind: 'scholarship',
    work: 'Fanger, "Divine Dreamwork" (2018)',
    author: 'Claire Fanger',
    year: 2018,
    grounds: 'dream incubation as practice: mild fasting, scripted prayer before sleep, the twilight hour, and the interpretation afterwards; solicited visions that remain free to refuse',
    report: 'docs/scholarship/fanger.md',
    aliases: [],
  },
  {
    id: 'fanger-family',
    kind: 'scholarship',
    work: 'Fanger, "The Magician at Home with his Family" (2017)',
    author: 'Claire Fanger',
    year: 2017,
    grounds: 'John and Bridget: magic embedded in household, kinship and obligation rather than the private-magician stereotype; the gendered dimension of teaching a sister to read',
    report: 'docs/scholarship/fanger.md',
    aliases: [],
  },
  {
    id: 'fanger-libri-nigromantici',
    kind: 'scholarship',
    work: 'Fanger, "Libri Nigromantici" (2012)',
    author: 'Claire Fanger',
    year: 2012,
    grounds: 'John\'s necromantic books after his conversion; the exceptive arts; knowing magic versus performing it',
    report: 'docs/scholarship/fanger.md',
    aliases: [],
  },
  {
    id: 'hugh-didascalicon',
    kind: 'primary',
    work: 'Hugh of St Victor, Didascalicon',
    author: 'Hugh of St Victor',
    year: null,
    grounds: 'the monastic theory of learning John inherits and radicalises: study as formation of the whole person; the good student humble, docile, concerned to become learned rather than appear so; magic excepted from the order of knowledge',
    report: null,
    aliases: [],
  },

  // ── Digests: finding aids. Content may NEVER cite these. ───────────
  {
    id: 'digest-fanger-summaries',
    kind: 'digest',
    work: 'docs/research/fanger-summaries-2026-08-31.txt',
    author: 'AI-generated summary of Fanger, supplied by Ted',
    year: 2026,
    grounds: 'chapter-by-chapter summary of Rewriting Magic plus material on sacramental theology, penance, daily habits, and the manuscripts. A summary of a source, not a source: cite the work it summarises and carry verify:true',
    report: null,
    aliases: [],
  },
  {
    id: 'digest-fanger-theurgy',
    kind: 'digest',
    work: 'docs/research/fanger-theurgy-pedagogy-2026-08-31.txt',
    author: 'AI-generated summary of Fanger, supplied by Ted',
    year: 2026,
    grounds: 'theurgy as historiographical category, the ars notoria as devotional pedagogy, Hugh of St Victor as John\'s inheritance, adjuration versus conjuration. A finding aid only',
    report: null,
    aliases: [],
  },

  // ── Design: our own reasoning, never a scholarly claim ─────────────
  {
    id: 'design-notes',
    kind: 'design',
    work: 'SCRIPTORIUM.md working notes',
    author: 'this project',
    year: null,
    grounds: 'our own design rationale for the copy loop. NOT scholarship: a record resting only on this may not be `attested`',
    report: null,
    aliases: ['SCRIPTORIUM.md working notes (Fanger–Watson edition apparatus, frame)'],
  },
];

// ── lookup ───────────────────────────────────────────────────────────

const BY_STRING = new Map();
for (const w of WORKS) {
  BY_STRING.set(w.work, w);
  for (const a of w.aliases) BY_STRING.set(a, w);
}

/** The registry entry a citation string names, or null. */
export function resolveWork(workString) {
  return BY_STRING.get(workString) ?? null;
}

export function workById(id) {
  return WORKS.find(w => w.id === id) ?? null;
}

/** Canonical strings only — what new content should cite. */
export function canonicalWorkStrings() {
  return WORKS.map(w => w.work);
}

/**
 * Which scholarship the game actually rests on, and where it rests on
 * nothing in particular. Walks content modules, resolves every
 * citation, and reports counts by kind plus unpinned period-practice
 * debt. Used by tests/works.test.js and the research report script.
 */
export function citationReport(modules) {
  const byKind = Object.fromEntries(WORK_KINDS.map(k => [k, 0]));
  const byWork = new Map();
  const unresolved = new Set();
  let total = 0;

  const walk = (node, seen = new Set()) => {
    if (!node || typeof node !== 'object' || seen.has(node)) return;
    seen.add(node);
    if (Array.isArray(node)) { for (const v of node) walk(v, seen); return; }
    if (Array.isArray(node.sources)) {
      for (const s of node.sources) {
        if (!s?.work) continue;
        total++;
        const entry = resolveWork(s.work);
        if (!entry) { unresolved.add(s.work); continue; }
        byKind[entry.kind]++;
        byWork.set(entry.id, (byWork.get(entry.id) ?? 0) + 1);
      }
    }
    for (const v of Object.values(node)) walk(v, seen);
  };
  for (const m of modules) walk(m);

  return {
    total,
    byKind,
    byWork,
    unresolved: [...unresolved],
    /** Works in the registry that nothing cites — the shelf we bought and never opened. */
    uncited: WORKS.filter(w => !byWork.has(w.id)).map(w => w.id),
  };
}
