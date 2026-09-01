/**
 * MORIGNY — the abbey as a production environment
 * (docs/LOOP_SYNTHESIS.md §5; decided 2026-09-01).
 *
 * Sophie Page's St Augustine's is the model, and the point is that a
 * monastery is not "a place where magic happens" — it is the plant that
 * makes magic possible. Her Canterbury house had an infirmary, metal
 * casting, a plumber's workshop for lead, probably a sealing press,
 * pigments and parchment, astronomical instruments, a library with
 * thirty-odd magical texts in it, and craftsmen and travellers coming
 * and going. Magic there was partly an economy of materials, access,
 * skills, secrecy and institutional relationships.
 *
 * So the daylight hour is now two questions instead of one: WHERE does
 * he spend it, and WHAT does he do there. Places also give the
 * encounter pool real affordances — an encounter can require the lead
 * workshop, and then it can only happen at the lead workshop.
 *
 * Digest-sourced (docs/research/page-cloister-2026-09-01.txt); carries
 * `verify` (rule 11).
 */

const PAGE = [{ work: 'Page, Magic in the Cloister', locus: 'the monastic material infrastructure of occult practice (frame; verify)' }];
const RB = [{ work: 'RB 1980 (Rule of St Benedict)', locus: 'the obediences and the ordering of the house (frame)' }];

/**
 * `affords` are the tags encounters and actions gate on. `key` is the
 * daylight letter. `restricted` places cost something to enter or are
 * noticed.
 */
export const PLACES = {
  scriptorium: {
    id: 'scriptorium', key: 'S', label: 'The scriptorium',
    line: 'Desks, daylight, and forty years of other men\'s hands on the same exemplars.',
    affords: ['desk', 'parchment', 'pigment', 'cloister'],
    sources: [...PAGE, ...RB], status: 'adapted', verify: true,
  },
  armarium: {
    id: 'armarium', key: 'A', label: 'The armarium',
    line: 'The book cupboard, and behind it the shelf that is not read aloud from at table.',
    affords: ['books', 'restricted', 'cloister'],
    sources: PAGE, status: 'adapted', verify: true,
  },
  cell: {
    id: 'cell', key: 'C', label: 'Your own cell',
    line: 'A door that closes. The single most valuable thing the house gives a man who has something to do quietly.',
    affords: ['private', 'cloister'],
    sources: PAGE, status: 'adapted', verify: true,
  },
  infirmary: {
    id: 'infirmary', key: 'I', label: 'The infirmary',
    line: 'The sick, the dying, the herbal, and the one cupboard in the abbey nobody questions you for opening.',
    affords: ['herbs', 'medicine', 'bodies', 'cloister'],
    sources: [...PAGE, { work: 'RB 1980 (Rule of St Benedict)', locus: 'RB 36, the care of the sick (frame)' }],
    status: 'adapted', verify: true,
  },
  workshop: {
    id: 'workshop', key: 'W', label: 'The workshop',
    line: 'Lead, solder, the casting sand, the sealing press. Everything a figure needs to stop being a drawing.',
    affords: ['metal', 'lead', 'seals', 'cloister'],
    sources: PAGE, status: 'adapted', verify: true,
  },
  garden: {
    id: 'garden', key: 'G', label: 'The garden',
    line: 'Beds of physic and pot-herbs, and the only hour of the day nobody can account for you.',
    affords: ['herbs', 'quiet', 'cloister'],
    sources: [...PAGE, ...RB], status: 'adapted', verify: true,
  },
  gate: {
    id: 'gate', key: 'T', label: 'The gate',
    line: 'Where the world arrives: carriers, stationers\' men, guests, kin, and books from elsewhere.',
    affords: ['world', 'trade', 'kin'],
    sources: [...PAGE, { work: 'RB 1980 (Rule of St Benedict)', locus: 'RB 53, the reception of guests (frame)' }],
    status: 'adapted', verify: true,
  },
};

export const PLACE_IDS = Object.keys(PLACES);

export function placeById(id) {
  return PLACES[id] ?? null;
}

/** Every affordance any place offers — the vocabulary encounters gate on. */
export function allAffordances() {
  return [...new Set(Object.values(PLACES).flatMap(p => p.affords))].sort();
}
