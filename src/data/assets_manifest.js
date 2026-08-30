/**
 * MORIGNY — asset provenance manifest (morigny/CLAUDE.md rule 6,
 * schema in morigny/ART_SOURCES.md). Nothing visual or audible ships
 * without an entry. The provenance lint walks this file.
 */

export const ASSETS_MANIFEST = [
  {
    id: 'tileset-world-v1',
    role: 'tile set (procedural, drawn in code: src/ui/tiles.js)',
    institution: 'original work, this project',
    shelfmark: 'n/a',
    folio: 'n/a',
    source_url: 'n/a',
    license: 'project license',
    date: '2026',
    region: 'n/a',
    status: 'invented',
    processing: [],
    notes:
      'U5-era plainness in the grisaille palette; no external imagery. ' +
      'References for silhouettes (walls, church, market) are common-knowledge ' +
      'period forms; a sourced city leaf for Étampes (Notre-Dame-du-Fort) is ' +
      'on the Research Queue in BIBLIOGRAPHY.md.',
  },

  // ── Sourced leaves (pencil-apparatus layer; ART_SOURCES.md pipeline) ──
  // Files under src/public/leaves/, straight copies of the user's occult
  // image database card renders (C:\Dev\OCCULTIMGDB) — themselves derived
  // from the open-access sources below. Display-level grisaille is CSS
  // only (files unmodified), disclosed per entry; the vision leaf alone
  // is shown in color (the palette's one earned exception).
  {
    id: 'leaf-nota-grammar-bnf',
    role: 'leaf (incipit frontispiece): the first figure of grammar, an ars notoria nota',
    institution: 'Bibliothèque nationale de France, Paris',
    shelfmark: 'BnF Latin 9336',
    folio: 'f. 18',
    source_url: 'https://commons.wikimedia.org/wiki/File:The_first_figure_of_grammar.jpg',
    license: 'Public domain (via Wikimedia Commons)',
    date: '13th c.',
    region: 'France',
    status: 'attested',
    processing: ['displayed desaturated toward grisaille via CSS; file itself unmodified'],
    notes:
      'A wheel of prayer-text ringed and flanked by angels bearing crosses — the ' +
      'actual diagrammatic tradition John practiced and rewrote, from his own ' +
      'century and country. The closest thing to core-period imagery this game has.',
  },
  {
    id: 'leaf-liber-floridus-scribe',
    role: 'leaf (scriptorium): a monastic scribe at his desk',
    institution: 'via Wikimedia Commons (Liber Floridus autograph tradition, Ghent UB Ms. 92 ambit)',
    shelfmark: 'Liber Floridus',
    folio: 'the Sithiu/Saint-Omer scribe folio',
    source_url: 'https://commons.wikimedia.org/wiki/File:Liber_Floridus_Scribe.png',
    license: 'Public domain (via Wikimedia Commons)',
    date: 'after 1120 (12th c.)',
    region: 'Saint-Omer, Flanders',
    status: 'attested',
    processing: ['displayed desaturated toward grisaille via CSS; file itself unmodified'],
    notes:
      'Lambert of Saint-Omer\'s encyclopedia: a tonsured scribe writing at a sloped ' +
      'desk beneath the towers of Sithiu. Source catalog titled this record ' +
      '"Cosmological folio"; the image is in fact the scribe portrait (the Commons ' +
      'filename says so) — corrected here, since the caption must match the pixels.',
  },
  {
    id: 'leaf-solomon-receives',
    role: 'leaf (the vision, in color): Solomon receives the ars notoria from the angel Pamphilius',
    institution: 'Bibliothèque nationale de France, Paris',
    shelfmark: 'BnF Latin 7153',
    folio: 'miniature',
    source_url: 'https://commons.wikimedia.org/wiki/File:Solomon_Receives_the_Ars_Notoria.jpg',
    license: 'Public domain (via Wikimedia Commons)',
    date: 'c. 1480–1520',
    region: 'France',
    status: 'attested',
    processing: ['none — shown in original color: the vision is the palette\'s one earned exception (INTERFACE.md)'],
    notes:
      'A kneeling king, crown and scepter set on the floor, receiving a book from a ' +
      'descending angel against a deep blue ground. The art\'s own legend of where ' +
      'such books come from — painted two centuries after John, dated on screen.',
  },
  {
    id: 'leaf-bodley-951-theology',
    role: 'leaf (the figure check): the fifth figure of theology, an ars notoria nota',
    institution: 'Bodleian Library, Oxford',
    shelfmark: 'MS Bodley 951',
    folio: 'f. 19',
    source_url: 'https://commons.wikimedia.org/wiki/File:Oxford,_Bodley_951,_f._19,_15th_century.jpg',
    license: 'Public domain (via Wikimedia Commons)',
    date: 'c. 1450',
    region: 'England',
    status: 'attested',
    processing: ['displayed desaturated toward grisaille via CSS; file itself unmodified'],
    notes:
      'Angels with crosses, rings of unknown words, characters set each in its ' +
      'compartment, beasts and swords in the margin — what "the words set each in ' +
      'its house" actually looks like on parchment, a century-and-a-quarter after John.',
  },
  {
    id: 'leaf-aurora-consurgens',
    role: 'leaf (the reading room): a miniature from the Aurora consurgens',
    institution: 'Zentralbibliothek Zürich (via e-codices)',
    shelfmark: 'Ms. Rh. 172',
    folio: 'miniature',
    source_url: 'https://www.e-codices.unifr.ch/en/list/one/zbz/Ms-Rh-0172',
    license: 'Public domain (Zentralbibliothek Zürich / e-codices)',
    date: 'c. 1420',
    region: 'probably Germany; MS at Zurich',
    status: 'attested',
    processing: ['displayed desaturated toward grisaille via CSS; file itself unmodified'],
    notes:
      'Sun-crowned and moon-shielded riders in combat on lion and griffin — interior ' +
      'spiritual combat painted, a century after John, as literal battle. The ' +
      'whitening arc in one image, dated on screen.',
  },
];
