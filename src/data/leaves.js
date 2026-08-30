/**
 * MORIGNY — sourced leaves: historical images shown in the pencil-
 * apparatus layer (CLAUDE.md rules 6–7; ART_SOURCES.md). Every leaf
 * points at a complete provenance entry in assets_manifest.js — the
 * lint walks the pair. The `dateline` renders on screen, always: honest
 * anachronism is content, silent anachronism is a bug. Captions are the
 * pencil hand (graphite register): modern, cited, dated.
 *
 * Display discipline: leaves are shown desaturated toward grisaille
 * (CSS only; files unmodified) so sourced color does not outshout the
 * palette's semantic reserve — except the vision leaf, which keeps its
 * color deliberately: the vision is the game's one earned palette event
 * (INTERFACE.md; WORLD_DESIGN.md §1).
 */

export const LEAVES = {
  incipit: {
    assetId: 'leaf-nota-grammar-bnf',
    src: 'leaves/nota-grammar-bnf.jpg',
    alt: 'A manuscript page: a great wheel of close-written prayer text, ringed and flanked by angels in blue and red robes bearing crosses.',
    dateline: 'BnF Latin 9336, f. 18 — France, 13th century',
    caption:
      'The first figure of grammar, from an ars notoria manuscript of John\'s own ' +
      'century and country: a wheel of prayer to be gazed upon, angels standing ' +
      'guard at its rim. This is the art he learned at Orléans, repented of, and ' +
      'spent his life rewriting. — n.',
    color: false,
  },
  scriptorium: {
    assetId: 'leaf-liber-floridus-scribe',
    src: 'leaves/liber-floridus-scribe.jpg',
    alt: 'A manuscript page: a tonsured scribe writing with a quill at a sloped desk, beneath an arcade of painted towers.',
    dateline: 'Liber Floridus, the Sithiu scribe folio — Saint-Omer, after 1120',
    caption:
      'A monk at the desk John worked at — sloped board, quill, the leaf held ' +
      'open — drawn two centuries before him at Saint-Omer, sixty leagues north. ' +
      'The posture never changed. Neither did the ache in the three fingers. — n.',
    color: false,
  },
  vision: {
    assetId: 'leaf-solomon-receives',
    src: 'leaves/solomon-receives.jpg',
    alt: 'A miniature: a kneeling king, crown and scepter laid on the floor, receiving a book from an angel descending against a deep blue patterned ground.',
    dateline: 'BnF Latin 7153 — France, c. 1480–1520',
    caption:
      'Solomon receives the ars notoria from the angel Pamphilius: the art\'s own ' +
      'story of where such books come from — an angel, a book, a man who has set ' +
      'his crown on the floor. Painted two centuries after John; shown here in ' +
      'its own colors, because in this game the vision is the one place color is ' +
      'permitted. — n.',
    color: true,
  },
  figure: {
    assetId: 'leaf-bodley-951-theology',
    src: 'leaves/bodley-951-theology.jpg',
    alt: 'A manuscript opening: geometrical figures inscribed with characters, rings of unknown words, angels holding crosses, and beasts and swords drawn in the margin.',
    dateline: 'Bodleian MS Bodley 951, f. 19 — England, c. 1450',
    caption:
      'The fifth figure of theology, as a copyist drew it a century and a quarter ' +
      'after John: the words set each in its house, the angels at their stations, ' +
      'the margin full of swords and birds. Every copy of a page like this is a ' +
      'wager that the geometry survived the journey. — n.',
    color: false,
  },
  figureGilded: {
    assetId: 'leaf-sigillum-dei-anselmi',
    src: 'leaves/sigillum-dei-anselmi.jpg',
    alt: 'A heptagram-and-circles seal in red and black ink, unknown words ringing its border, pentagrams at its points.',
    dateline: 'attributed to Giorgio Anselmi — Parma, 15th century',
    caption:
      'A Sigillum Dei, parent tradition to the seal John Dee would draw a ' +
      'century and a half later: unknown words ringing a heptagram, each point ' +
      'its own small star. Shown in its own color, like the vision — gold is ' +
      'not a hue here, it is a verdict, and this run\'s figure just received ' +
      'one. — n.',
    color: true,
  },
  readingRoom: {
    assetId: 'leaf-aurora-consurgens',
    src: 'leaves/aurora-consurgens.jpg',
    alt: 'A miniature: a sun-headed rider on a lion and a moon-shielded rider on a griffin, fighting with lances on a red ground.',
    dateline: 'Aurora consurgens, Zürich, Ms. Rh. 172 — c. 1420',
    caption:
      'A century after John: the Aurora consurgens paints interior combat as ' +
      'literal battle — sun against moon, lion against griffin. What he fought ' +
      'lying still in a dark dormitory, the tradition that outlived him sent to ' +
      'the tournament ground. Transmission changes what it carries. — n.',
    color: false,
  },
  examination: {
    assetId: 'leaf-nota-logic-bodley',
    src: 'leaves/nota-logic-bodley.jpg',
    alt: 'A manuscript page: two angels flanking a great wheel of dense unfamiliar script, with smaller diagram roundels and a triangle of grammar terms below.',
    dateline: 'after Bodleian MS Bodley 951, f. 10v — original 12th–13th c.; this redrawing made in the 21st century',
    caption:
      'The figure of logic, in the same family as what John copied: angels ' +
      'standing guard over a wheel of words no one now living can construe. ' +
      'A disclosure the pencil hand insists on: this image is not the medieval ' +
      'folio itself but a careful modern redrawing of it, credited to its ' +
      'Wikimedia maker — the original photograph was not the one that reached ' +
      'this desk, and the difference matters enough to say so twice. — n.',
    color: false,
  },
};
