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
        unlocks: ['necromancy'],
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
