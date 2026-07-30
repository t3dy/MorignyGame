/**
 * MORIGNY — the people of Étampes (Talk keyword system, U5 manner,
 * Pentiment register). Period types, invented persons: envelope on each.
 *
 * Keyword contract: every NPC has `name`, `job`, `bye`, and a `default`
 * line for unknown words. `unlocks` reveals further keywords; `effect`
 * keys are handled by the controller (give-draught, suspicion, radical,
 * honesty, lie, alms). Coverage-tested.
 */

const TYPE_ENVELOPE = {
  status: 'invented',
  sources: [
    { work: 'Period types after Kieckhefer; Pentiment-style town surface', locus: 'frame (morigny/WORLD_DESIGN.md §2)' },
  ],
};

export const NPCS = [
  {
    id: 'perrin',
    label: 'an apothecary at his stall',
    mapId: 'etampes', x: 5, y: 5,
    greeting: 'A narrow man among hanging bundles, hands stained green. "Herbs, brother? Or something asked after more quietly?"',
    keywords: {
      name: { text: '"Perrin. My father was Perrin. The stall was his, the debts are mine."' },
      job: {
        text: '"Simples and compounds. Fever bark, wound-wort, and things for sleeping — the town runs on bad sleep, saving your habit."',
        unlocks: ['sleep', 'herbs'],
      },
      herbs: { text: '"Sage, rue, fennel against the devil in the bowels. The garden knows more theology than half the canons."' },
      sleep: {
        text: '"A draught of poppy in wine. It shutters the house of the mind entire — no thieves, brother, but no visitors either. None at all." He looks at you a moment too long. "Monks buy this more than you\'d think."',
        unlocks: ['draught'],
      },
      draught: {
        text: 'He wraps a clay vial in straw. "For the abbey\'s infirmary, we\'ll say. Use it on a bad night and you will have no night at all — good or otherwise."',
        effect: 'give-draught',
      },
      monk: { text: '"Morigny\'s men buy fennel and honesty. The other house upriver buys rue and doesn\'t meet my eye."' },
      bye: { text: '"Go with God, brother. Mind the gate curfew."' },
    },
    default: '"That\'s beyond my shelves, brother."',
    ...TYPE_ENVELOPE,
  },
  {
    id: 'isabel',
    label: 'a stationer with a board of quires',
    mapId: 'etampes', x: 13, y: 7,
    greeting: 'A woman with knife-cut fingertips squares a stack of ruled leaves. "Parchment, brother? Or are you only hungry for the smell of it?"',
    keywords: {
      name: { text: '"Isabel. The shop was my husband\'s; the trade decided it liked me better."' },
      job: {
        text: '"Quires, inks, pumice. Scholars\' leavings from Orléans, sometimes, when the carts come up."',
        unlocks: ['quires', 'orleans'],
      },
      quires: {
        text: '"Ruled for a close hand. Take one for the abbey\'s blessing on the shop — and bring me custom that pays, next time." She wraps it before you can refuse.',
        effect: 'give-quire',
      },
      orleans: {
        text: '"Orléans." She weighs you with a look. "Law books mostly. And student trash. And once in a while a thing sewn shut that I don\'t buy twice."',
        unlocks: ['necromancy', 'student'],
      },
      student: {
        text: '"Student leavings. Grammars, disputations dog-eared to death, and —" she squares the stack, "— now and then a thing that comes north sewn shut, because the seller did not want to know what he was selling."',
        unlocks: ['sewn'],
      },
      sewn: {
        text: 'She is still a moment. "I told you I don\'t buy such things twice. I bought this one once, and once is what it cost me. Take it, brother, and take its story with it — mine stays here." Coin passes. The quires are heavier than paper should be.',
        effect: 'give-exemplar-sewn',
      },
      necromancy: {
        text: 'The knife stops. "I don\'t know that word, brother, and neither do you." She turns to another customer who is not there.',
        effect: 'suspicion',
      },
      bye: { text: '"Mind the ink in the rain, brother."' },
    },
    default: '"Not my trade, brother. Try the canons."',
    ...TYPE_ENVELOPE,
  },
  {
    id: 'evrart',
    label: 'a clerk in good black, writing against his knee',
    mapId: 'etampes', x: 8, y: 3,
    greeting: '"Brother! A moment of your charity." His smile is excellent. "Master Evrart — I serve the archdeacon\'s eyes, which are old. You\'re of Morigny? A good house. A quiet house, I\'d always heard."',
    keywords: {
      name: { text: '"Evrart, of the archdeacon\'s familia. My hand is trusted, which is a way of saying my ears are."' },
      job: {
        text: '"Visitations, inventories, the tallying of what houses hold. Books, mostly. It is wonderful," he says pleasantly, "what houses hold."',
        unlocks: ['book'],
      },
      book: {
        text: '"They say a monk at Morigny writes — beyond the ordinary, I mean. Offices of his own devising. Prayers to Our Lady of an unusual... thoroughness." The pen does not stop moving. "You would know, being of the house?"',
        unlocks: ['deny', 'truth', 'scorn'],
      },
      deny: {
        text: '"No such work that I know of, master." The lie goes out of you smooth as a coin, and sits somewhere under the ribs, and stays.',
        effect: 'lie',
      },
      truth: {
        text: '"A brother writes prayers to the Virgin, yes. Prayer is not yet an inventory matter." Evrart\'s pen writes three words. "Well said, brother. Nothing is a matter until it is."',
        effect: 'honesty',
      },
      scorn: {
        text: '"When the archdeacon\'s eyes learn to read the Psalter through a keyhole, master, send them to school on our dormitory wall first." A silence. The pen writes for some time. "Your house is droll, brother. I will remember it was droll."',
        effect: 'radical',
      },
      bye: { text: '"Go with God, brother. We will speak again — I am often on this road."' },
    },
    default: '"Mm. The archdeacon\'s eyes are old, brother, not curious about that."',
    ...TYPE_ENVELOPE,
  },
  {
    id: 'jehanne',
    label: 'a beggar wrapped against the wall by the gate',
    mapId: 'etampes', x: 13, y: 9,
    greeting: 'An old woman with a bowl the rain has cleaned. "Bread, brother? Or a blessing? I take the one that\'s warm."',
    keywords: {
      name: { text: '"Jehanne. The gate and I hold each other up."' },
      job: { text: '"I keep account of who goes in and out and God keeps account of me. Between us the town is thoroughly watched."', unlocks: ['alms'] },
      alms: {
        text: 'You give what a monk carries: the half of your road-bread and the whole of a psalm. She eats the one and pockets the other. "That\'s the warm kind. Go lighter, brother."',
        effect: 'alms',
      },
      bye: { text: '"Mind the mud, brother. It has opinions."' },
    },
    default: '"Ask the bowl, brother. It knows what I know."',
    ...TYPE_ENVELOPE,
  },
];

/**
 * The cloister — scene-summoned, not tile-placed (docs/DECISIONS_AND_FORKS.md
 * D-10): the abbey interior has no map, so the scriptorium stage summons
 * these two by T. Same keyword contract and envelope as the townsfolk;
 * the world tests' contract loop runs over both lists, the tile-reach
 * test over the town list only.
 */
const OFFICE_ENVELOPE = {
  status: 'invented',
  sources: [
    { work: 'Monastic offices: the armarius and the sacrist (RB 48 frame)', locus: 'SCRIPTORIUM.md §1 "The monastic setting"' },
  ],
};

export const CLOISTER_NPCS = [
  {
    id: 'denis',
    label: 'the armarius, at his ledger',
    mapId: null, x: null, y: null,
    greeting:
      'The armarius looks up from his ledger the way a man surfaces from deep water. ' +
      '"Brother John. The press is locked, the day is short, and you will want something. ' +
      'They always want something."',
    keywords: {
      name: { text: '"Denis. Twenty years keeper of the press, and every book in it knows my hand better than the priory knows my face."' },
      job: {
        text: '"I keep the armarium, and the ledger of what leaves it. At Lent each brother his book; through the year, each desk its leaf. Nothing is lost, brother. Things are only ever somewhere I have not looked yet."',
        unlocks: ['work', 'ledger'],
      },
      work: {
        text: '"Your leaf is the lectionary — the house\'s own, recopied against its age. Keep to it and the light will love you. The last hand on it failed at the feast of St. Denis, which I take personally."',
      },
      ledger: {
        text: '"Everything issued, everything returned, everything —" he taps the book, "— remembered. When the archdeacon\'s men come counting, it is my ledger that answers. And it answers everything it is asked."',
      },
      bye: { text: '"Go with God, brother. And bring it back with both boards."' },
    },
    default: '"Not in my press, brother. And if it is not in my press, I have opinions about whether it is anywhere."',
    ...OFFICE_ENVELOPE,
  },
  {
    id: 'maur',
    label: 'the sacrist, counting by touch',
    mapId: null, x: null, y: null,
    greeting:
      '"Mind the threshold, brother — the oil." The sacrist is on his knees among boxes, ' +
      'counting by touch. "Candles, chrism, colors, skins. If it burns, stains, or costs ' +
      'the house money, it is mine. What do you need?"',
    keywords: {
      name: { text: '"Maur. I was given to the church at seven; I have been counting her belongings ever since."' },
      job: {
        text: '"Sacrist. The vessels, the vestments, the lights — and the scriptorium\'s stores, which vanish faster than mice can be blamed for."',
        unlocks: ['parchment', 'colors'],
      },
      parchment: {
        text: 'He weighs you a moment, then draws out a ruled quire. "For the house\'s work, mind. A herd died for this; write nothing a cow would be ashamed of."',
        effect: 'give-quire',
      },
      colors: {
        text: '"Vermilion I have. The blue is bought by weight of silver, and you shall not touch it without the prior\'s own word. The yellow —" he pauses. "The yellow you will treat with respect."',
        unlocks: ['orpiment'],
      },
      orpiment: {
        text: '"Respect, I said. Grind it with your face turned and your mouth shut. Brother Guy ground it careless for the great antiphoner; he sang flat for a month and was buried before Advent. And keep it from the lead and the green, or the leaf turns black as your prospects."',
      },
      bye: { text: '"Go, and God go with you. The quire comes back written or blank — but it comes back."' },
    },
    default: '"If it does not burn, stain, or cost money, brother, it is not my office."',
    ...OFFICE_ENVELOPE,
  },
];
