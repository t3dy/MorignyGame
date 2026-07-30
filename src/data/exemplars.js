/**
 * MORIGNY — exemplars: what John copies FROM (SCRIPTORIUM.md §3.1).
 * You copy *from* something, and its errors are inherited unless caught.
 * `hot` marks a text whose mere possession is matter for a court.
 *
 * Envelope per CLAUDE.md: historical fields carry sources; the `sim`
 * block is game math and by definition invention. Fault classes in
 * `sim.faults` must be members of ERROR_CLASSES in engine/scriptorium.js
 * (the scriptorium tests enforce the correspondence).
 */

export const EXEMPLAR_SOURCES = ['armarium', 'loan', 'stationer', 'pecia', 'own'];

export const EXEMPLARS = [
  {
    id: 'armarium-lectionary',
    title: 'a lectionary of the house',
    desc:
      'Assigned work: the abbey’s lectionary, recopied against its wearing ' +
      'out. The armarius handed it over without looking up, which is what trust ' +
      'looks like in that office.',
    source: 'armarium',
    hot: false,
    completeness: 1,
    status: 'invented',
    sources: [
      { work: 'Monastic book provision (RB 48; the armarius and the armarium)', locus: 'SCRIPTORIUM.md §1 "The monastic setting"' },
    ],
    sim: {
      units: 10, verbaShare: 0, figures: 0,
      faults: ['dittography'],
      coin: 0, favorOwed: false, assigned: true,
      deadlineDays: null, suspicionOnAcquire: 0,
    },
  },
  {
    id: 'loan-glossed-psalter',
    title: 'a brother’s glossed psalter',
    desc:
      'Brother Anseau’s psalter, the gloss crowded into the margins in a ' +
      'hand smaller than charity. Lent freely, which is to say: he will ' +
      'remember it. Somewhere in it a line is missing that no one living ' +
      'knows to miss.',
    source: 'loan',
    hot: false,
    completeness: 1,
    status: 'invented',
    sources: [
      { work: 'Monastic lending and the favor economy (period type)', locus: 'SCRIPTORIUM.md §3.1 sources table' },
    ],
    sim: {
      units: 12, verbaShare: 0, figures: 0,
      faults: ['eyeskip'],
      coin: 0, favorOwed: true, assigned: false,
      deadlineDays: null, suspicionOnAcquire: 0,
    },
  },
  {
    id: 'isabel-sewn-quires',
    title: 'the quires sewn shut',
    desc:
      'From Isabel’s board at Étampes: student leavings off the Orléans ' +
      'carts, sewn shut along the fore-edge. Inside, the notae and the prayers ' +
      'of the art, the unknown words in their long strings — incomplete, ' +
      'and no saying what its parent copy already garbled.',
    source: 'stationer',
    hot: true,
    completeness: 0.6,
    status: 'adapted',
    sources: [
      { work: 'The ars notoria: figures (notae) and verba ignota (after Véronèse)', locus: 'SCRIPTORIUM.md §1 "Magic texts specifically"' },
      { work: 'Sophie Page, Magic in the Cloister (monks acquiring magic texts)', locus: 'BIBLIOGRAPHY.md context shelf; specifics on the Research Queue' },
    ],
    sim: {
      units: 14, verbaShare: 0.35, figures: 1,
      faults: ['verba_ignota', 'eyeskip'],
      coin: 2, favorOwed: false, assigned: false,
      deadlineDays: null, suspicionOnAcquire: 1,
    },
  },
  {
    id: 'pecia-orleans',
    title: 'rented quires, by the piece',
    desc:
      'Through the Orléans trade: an exemplar divided and rented by the quire, ' +
      'the way the universities feed their copyists. Three days, then the piece ' +
      'goes back — the next man’s coin is already waiting, and haste ' +
      'is how errors get in.',
    source: 'pecia',
    hot: true,
    completeness: 1,
    status: 'adapted',
    verify: true,
    sources: [
      { work: 'Pecia system (university stationers; Paris, Bologna)', locus: 'SCRIPTORIUM.md §1 "Magic texts specifically"' },
      { work: 'Sophie Page, Magic in the Cloister', locus: 'Research Queue — pecia feasibility at Orléans; usage here is adapted, per SCRIPTORIUM.md §6' },
    ],
    sim: {
      units: 16, verbaShare: 0.3, figures: 2,
      faults: ['eyeskip'],
      coin: 3, favorOwed: false, assigned: false,
      deadlineDays: 3, suspicionOnAcquire: 2,
    },
  },
  {
    id: 'old-compilation',
    title: 'the Old Compilation, his own hand',
    desc:
      'John’s own earlier redaction of the work. It costs nothing and asks ' +
      'nothing — except that every fault in it is his, and copying it ' +
      'forward is deciding which of his own errors to keep.',
    source: 'own',
    hot: true,
    completeness: 1,
    status: 'adapted',
    verify: true,
    sources: [
      { work: 'Fanger & Watson (eds.), Liber florum celestis doctrine', locus: 'Old/New Compilation redactions — verify: pin to the edition' },
      { work: 'Fanger, Rewriting Magic', locus: 'the rewriting; chapter locus on the Research Queue' },
    ],
    sim: {
      units: 16, verbaShare: 0.25, figures: 2,
      faults: ['verba_ignota', 'dittography'],
      coin: 0, favorOwed: false, assigned: false,
      deadlineDays: null, suspicionOnAcquire: 0,
    },
  },
];

export function exemplarById(id) {
  return EXEMPLARS.find(e => e.id === id) ?? null;
}
