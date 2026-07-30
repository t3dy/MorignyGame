/**
 * MORIGNY — materials of the scriptorium (SCRIPTORIUM.md §1, §3.5).
 * The craft facts are standard codicology (§6 clears them to build on);
 * the pigment hazards are real chemistry handed to the design. Game
 * numbers live in `sim` — including time compression: verdigris takes
 * years in life and days here, because a chronicle is a handful of days.
 */

const CRAFT = locus => [
  { work: 'Standard codicology, summarized in SCRIPTORIUM.md §1', locus },
];

export const MATERIALS = [
  // ── supports ─────────────────────────────────────────────────
  {
    id: 'parchment',
    kind: 'support',
    name: 'parchment',
    desc:
      'Limed skin, scraped with the lunellum, stretched on the herse, pounced ' +
      'and chalked. Hair side and flesh side differ, and quires nest so that ' +
      'like faces like — Gregory’s Rule. A great codex is a herd of animals.',
    status: 'attested',
    sources: CRAFT('"The craft" — support; Gregory’s Rule'),
    sim: { coin: 2, viaSacrist: true, undertext: false },
  },
  {
    id: 'palimpsest',
    kind: 'support',
    name: 'a scraped leaf',
    desc:
      'An old leaf scraped for reuse. Iron-gall bites into the skin, so the ' +
      'knife lifts the reading but not the ghost of it: the under-text stays ' +
      'faintly legible, forever, to any eye that thinks to look.',
    status: 'attested',
    sources: CRAFT('"The craft" — support, ink; INTERFACE.md §Motion (the palimpsest verb)'),
    sim: { coin: 0, viaSacrist: false, undertext: true },
  },

  // ── ink ──────────────────────────────────────────────────────
  {
    id: 'iron-gall',
    kind: 'ink',
    name: 'iron-gall ink',
    desc:
      'Oak galls, copperas, gum arabic, wine or water. It does not sit on the ' +
      'skin; it bites in — which is why scraping leaves a ghost.',
    status: 'attested',
    sources: CRAFT('"The craft" — ink'),
    sim: { coin: 1, viaSacrist: true },
  },

  // ── pigments ─────────────────────────────────────────────────
  {
    id: 'vermilion',
    kind: 'pigment',
    name: 'vermilion',
    desc: 'Mercury sulfide: the rubricator’s red. The color of instruction.',
    status: 'attested',
    sources: CRAFT('"The craft" — pigments'),
    sim: { coin: 1 },
  },
  {
    id: 'ultramarine',
    kind: 'pigment',
    name: 'ultramarine',
    desc:
      'Ground lapis, purified with wax and lye; ruinously costly. On a poor ' +
      'monk’s private book it is not a color, it is a question someone ' +
      'may ask.',
    status: 'attested',
    sources: CRAFT('"The craft" — pigments; §3.5 (cost as statement)'),
    sim: { coin: 6, conspicuous: true },
  },
  {
    id: 'verdigris',
    kind: 'pigment',
    name: 'verdigris',
    desc:
      'Copper and vinegar. A green that does not forgive: over time it eats ' +
      'through the leaf it colors, and a finished copy discovers this after ' +
      'the scribe has stopped checking.',
    status: 'attested',
    sources: CRAFT('"The craft" — pigments; §3.5 (slow corrosion)'),
    // corrodesAfterDays is compressed from years to game-days (see header).
    sim: { coin: 1, corrodesAfterDays: 8 },
  },
  {
    id: 'orpiment',
    kind: 'pigment',
    name: 'orpiment',
    desc:
      'Arsenic sulfide: a yellow near gold, for those who cannot afford gold. ' +
      'It sickens the scribe who grinds it carelessly, and it blackens where ' +
      'it touches the lead- and copper-made colors.',
    status: 'attested',
    sources: CRAFT('"The craft" — pigments; §3.5 (hazards)'),
    sim: { coin: 2, sickensOnGrind: 0.35, reactsWith: ['lead-white', 'minium', 'verdigris'] },
  },
  {
    id: 'lead-white',
    kind: 'pigment',
    name: 'lead white',
    desc: 'The whitest white the period has, made of lead and its patience.',
    status: 'attested',
    sources: CRAFT('"The craft" — pigments'),
    sim: { coin: 1 },
  },
  {
    id: 'minium',
    kind: 'pigment',
    name: 'minium',
    desc: 'Red lead — the lesser red, for initials and the miniator’s work.',
    status: 'attested',
    sources: CRAFT('"The craft" — pigments'),
    sim: { coin: 1 },
  },

  // ── gold ─────────────────────────────────────────────────────
  {
    id: 'gold-leaf',
    kind: 'gold',
    name: 'gold leaf',
    desc:
      'Laid on a gesso ground and burnished with a dog’s tooth; laid before ' +
      'pigment, always. In this book gold is not decoration: the palette rule ' +
      'reserves it for the licence.',
    status: 'attested',
    sources: CRAFT('"The craft" — gold; INTERFACE.md palette rule (gold = licentia)'),
    sim: { coin: 4, licentiaMark: true },
  },
];

export function materialById(id) {
  return MATERIALS.find(m => m.id === id) ?? null;
}

export const PIGMENTS = MATERIALS.filter(m => m.kind === 'pigment');
