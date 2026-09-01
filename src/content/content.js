/**
 * MORIGNY — authored content for the vertical slice.
 *
 * Every record carries the envelope (morigny/CLAUDE.md):
 *   status: 'attested' | 'adapted' | 'invented'
 *   sources: [{work, locus}] — required (non-empty locus) for attested/adapted;
 *            invented records may cite a register model or carry [].
 * The pencil apparatus reads these envelopes at runtime: the fourth wall
 * is powered by the database.
 */

// ── Bibliography (cited by pencil notes) ────────────────────────────────
export const BIBLIO = {
  'fanger-rewriting': 'Claire Fanger, Rewriting Magic (Penn State UP, 2015)',
  'fanger-watson-edition':
    'Fanger & Watson (eds.), John of Morigny, Liber florum celestis doctrine (PIMS)',
  'watson-conjuring':
    'Nicholas Watson, in Fanger (ed.), Conjuring Spirits (Penn State UP, 1998)',
  'fanger-watson-esoterica':
    'Fanger & Watson, "The Prologue to John of Morigny\'s Liber Visionum," Esoterica 3 (2001)',
  'kieckhefer-mma': 'Richard Kieckhefer, Magic in the Middle Ages (CUP)',
  'rb1980': 'RB 1980: The Rule of St. Benedict (ed. Fry)',
  'newman-speculum':
    'Barbara Newman, "What Did It Mean to Say ‘I Saw’?" Speculum 80 (2005)',
  'camille-margins': 'Michael Camille, Image on the Edge (1992)',
  'veronese-notoria': 'Julien Véronèse, critical editions and studies of the ars notoria',
  'page-cloister': 'Sophie Page, Magic in the Cloister (Penn State UP, 2013)',
  'dehamel-scribes': 'Christopher de Hamel, Scribes and Illuminators (British Museum Press, 1992)',
};

// ── The hours: arrival text (John's hand) + rubric ──────────────────────
export const HOUR_TEXT = {
  matins: {
    rubric: '¶ Of rising to the night office.',
    narrator: {
      text:
        'It\'s the dead of night, before the bell. John is awake in the dark dormitory, ' +
        'dressing by feel among twenty sleeping brothers, and he already knows which of the ' +
        'two roads out of this bed he\'s more afraid of wanting.',
      sources: [{ work: 'RB 1980', locus: 'chs. 8, 22 (dormitory staging, register model)' }],
      status: 'invented',
    },
    monologue: {
      text:
        'I woke before the bell again, and it was not vigilance, it was fear. Two roads ' +
        'leave this bed: the plain one, to the office and nothing else, or the other, worn ' +
        'smooth this last year, toward the Work. Obedience costs me nothing tonight. The ' +
        'other thing might cost me everything.',
      sources: [],
      status: 'invented',
    },
  },
  lauds: {
    rubric: '¶ Of Lauds, at first light.',
    body:
      'We filed into the choir stalls two by two, the youngest oblates first, and stood for ' +
      'the psalms of praise while the windows over the altar went from black to the grey ' +
      'of unpolished pewter. My breath showed in the cold. Singing them for the ten ' +
      'thousandth time and meaning it is its own small discipline, and this morning I was ' +
      'glad of the plainness of it, glad as a man is glad who has come through water and ' +
      'only wants dry ground for a while.',
    sources: [],
    status: 'invented',
  },
  prime: {
    rubric: '¶ Of Prime, and of chapter.',
    body:
      'After Prime we did not disperse but crossed to the chapter house, where the community ' +
      'sits on stone benches around the walls and the abbot in the center chair, and the ' +
      'business of the house — a lease, a burial, a fault named and answered — is read from ' +
      'the day\'s chapter of the Rule outward into our own small failures. I sat among my ' +
      'brothers with my book in my mind the whole time, turning its pages instead of ' +
      'listening, and hoped my face gave nothing away. A face that gives nothing away is ' +
      'itself a kind of confession, to anyone practiced at reading faces — and this house ' +
      'is full of men who have read little else for thirty years.',
    sources: [{ work: 'RB 1980', locus: 'chs. 46 (register model)' }],
    status: 'invented',
  },
  terce: {
    rubric: '¶ Of Terce.',
    body:
      'At the third hour, a short office sung standing, the psalms brief, and then the day\'s ' +
      'work waiting at the door of it — the scriptorium desk, the leaf half-finished, the ' +
      'ink that will have skinned over in the cold and need working again with the point of ' +
      'the knife before it flows.',
    sources: [],
    status: 'invented',
  },
  sext: {
    rubric: '¶ Of Sext.',
    body:
      'At midday we sang in the full light, the sun square over the cloister garth, and came ' +
      'back to the desks to find the flies at the ink pot again, drowned in ones and twos, ' +
      'which the sacrist says means the ink is good and true, made properly bitter with the ' +
      'gall.',
    sources: [],
    status: 'invented',
  },
  none: {
    rubric: '¶ Of None.',
    body:
      'At the ninth hour, the office brief and welcome, for by now my hand aches from the ' +
      'pen the way a man\'s back aches from the scythe — the same three fingers, the same ' +
      'grip, hour on hour — and I offered the ache up along with the psalm, which the ' +
      'colophon-writers before me always did, and always complained about doing.',
    sources: [],
    status: 'invented',
  },
  vespers: {
    rubric: '¶ Of Vespers.',
    body:
      'At evening we sang Vespers in the choir with the last light coming low and sidelong ' +
      'through the west windows, turning the plain stone the color of old vellum, and ' +
      'wax and incense thick in the air after a day of work and silence. Standing in that ' +
      'light I thought: tonight I will ask her leave to go on. And then I thought: who am ' +
      'I, to ask.',
    sources: [],
    status: 'invented',
  },
  compline: {
    rubric: '¶ Of Compline, and the Great Silence after.',
    body:
      'We said Compline in the dark church, the last office of the spoken day, and filed out ' +
      'in procession under the one remaining lamp, and the Great Silence began — no word ' +
      'from any man until the morning office, a silence the Rule sets as mercy, so the day\'s ' +
      'business cannot follow a man to his bed. But silence is also the enemy\'s opportunity, ' +
      'for in it a man hears everything that is in him, with nothing else left to listen to.',
    sources: [{ work: 'RB 1980', locus: 'ch. 42 (register model)' }],
    status: 'invented',
  },
};

// ── Prayers ─────────────────────────────────────────────────────────────
/** The versicle that opens each hour — real liturgy, prescribed by the Rule. */
export const VERSICLE = {
  id: 'deus-in-adiutorium',
  latin: 'Deus, in adiutorium meum intende; Domine, ad adiuvandum me festina.',
  english: 'O God, come to my assistance; O Lord, make haste to help me.',
  sources: [
    { work: 'RB 1980', locus: 'chs. 17-18 (opening versicle of the hours)' },
    { work: 'Vulgate', locus: 'Ps 69:2' },
  ],
  status: 'attested',
};

/**
 * The procedure prayer (slice stand-in). John's actual prayers exist in the
 * Fanger-Watson edition and are on the Research Queue; until verified, this
 * is our invention in his register, and the apparatus says so on screen.
 */
export const PROCEDURE_PRAYER = {
  id: 'procedure-prayer-1',
  title: 'The first prayer of the procedure, said in the heart at Matins',
  verses: [
    'Flower of the field, in whose keeping is all teaching, look upon a man in the dark.',
    'I do not ask knowledge as the proud ask it, seizing; I ask it as the ground asks rain.',
    'What I learned crookedly, make straight; what I took from the enemy’s table, I have put down.',
    'If it please you, give me leave to go on; and if it does not please you, give me leave to stop.',
    'And keep the gate of my eyes, and the gate of my hands, and the gate of my sleep, this night.',
  ],
  sources: [{ work: 'Fanger & Watson, Esoterica 3 (2001)', locus: 'register model only' }],
  status: 'invented',
};

/** Compline's canticle — real liturgy (the Nunc dimittis is Compline's own). */
export const COMPLINE_PRAYER = {
  id: 'compline-office',
  title: 'Compline, before the Great Silence',
  verses: [
    'Deus, in adiutorium meum intende; Domine, ad adiuvandum me festina.',
    'Nunc dimittis servum tuum, Domine, secundum verbum tuum in pace.',
    'Now let your servant depart in peace: the day is given back, such as it was.',
  ],
  sources: [
    { work: 'RB 1980', locus: 'chs. 17-18 (Compline structure)' },
    { work: 'Vulgate', locus: 'Ps 69:2; Lc 2:29' },
  ],
  status: 'attested',
};

/** When the sought dream does not come. */
export const DREAM_SHUT = {
  rubric: '¶ Of the night, in which nothing was given.',
  body:
    'I slept, and no dream rose. The books are plain that the fault in such cases is to be ' +
    'sought in the observance — a prayer scattered, a purity not kept, a work already spoiled ' +
    '— and I made my inventory in the dark, item by item, like a merchant after a bad fair.',
  sources: [],
  status: 'invented',
};

// ── Distractions (the margin's pull during recitation) ──────────────────
// kind: 'mundane' | 'memory' | 'appetite' | 'pencil'
// effects apply only when ATTENDED.
export const DISTRACTIONS = [
  {
    id: 'cold-feet',
    kind: 'mundane',
    text: 'The stone is very cold underfoot, and the cold climbs.',
    effects: { pressure: 0, despair: 0 },
    sources: [],
    status: 'invented',
  },
  {
    id: 'brother-cough',
    kind: 'mundane',
    text: 'Brother Herbert coughs, three stalls down, the same three notes as always.',
    effects: { pressure: 0, despair: 0 },
    sources: [],
    status: 'invented',
  },
  {
    id: 'hunger',
    kind: 'mundane',
    text: 'The fast sits in the stomach like a stone with opinions.',
    effects: { pressure: 1, despair: 0 },
    sources: [],
    status: 'invented',
  },
  {
    id: 'orleans-books',
    kind: 'memory',
    text:
      'Orléans. The room over the candlemaker’s, and the book that was lent, not given, ' +
      'and what it promised. It kept none of it. It kept other things.',
    effects: { pressure: 1, despair: 0 },
    sources: [{ work: 'Kieckhefer, Magic in the Middle Ages', locus: 'the "clerical underworld" (frame)' }],
    status: 'adapted',
  },
  {
    id: 'notae-memory',
    kind: 'memory',
    text:
      'The notae of the old art, wheels within wheels. I could draw them still with my eyes shut. ' +
      'That is the trouble. My eyes are shut.',
    effects: { pressure: 2, despair: 0 },
    sources: [{ work: 'Fanger, Rewriting Magic', locus: 'John’s ars notoria practice (frame)' }],
    status: 'adapted',
  },
  {
    id: 'appetite-unfinished',
    kind: 'appetite',
    text:
      'The sixth figure is wrong and I know which line is wrong, and I am supposed to be ' +
      'singing. It would take an hour. It would take less than an hour.',
    effects: { pressure: 2, despair: 0 },
    sources: [],
    status: 'invented',
  },
  {
    id: 'appetite-remembered',
    kind: 'appetite',
    text:
      'The enemy does not invent; he quotes. A page of the old art comes back entire — I ' +
      'could set it down tonight from memory — and I am ashamed how good my memory is.',
    effects: { pressure: 3, despair: 1 },
    sources: [{ work: 'Fanger, Rewriting Magic', locus: 'the retained knowledge that made the rewriting possible (frame; verify)' }],
    status: 'adapted',
    verify: true,
  },
  {
    id: 'appetite-reasonable',
    kind: 'appetite',
    text:
      'The thought under the thought: that to know a thing is not to do it, and I may ' +
      'lawfully know anything. This is the most dangerous voice, because it is quoting my ' +
      'own book back at me, and my own book is right.',
    effects: { pressure: 2, despair: 1 },
    sources: [{ work: 'Fanger, "Libri Nigromantici" (2012)', locus: 'knowing the exceptive arts versus performing them (frame; verify)' }],
    status: 'adapted',
    verify: true,
  },
  {
    id: 'pencil-rb22',
    kind: 'pencil',
    text:
      'The dormitory rules he lives under are in the Rule, ch. 22: all sleep clothed, a lamp ' +
      'burning until morning. Staging, for the hardest hours. — n.',
    effects: { pressure: 0, despair: 0 },
    cites: ['rb1980'],
    sources: [{ work: 'RB 1980', locus: 'ch. 22' }],
    status: 'attested',
  },
  {
    id: 'pencil-margins',
    kind: 'pencil',
    text:
      'These marginal intrusions are the game’s version of what Gothic margins actually did: ' +
      'commentary, mischief, pressure at the edge of the sacred page. You just proved the ' +
      'mechanic by reading this instead of the prayer. — n.',
    effects: { pressure: 0, despair: 0 },
    cites: ['camille-margins'],
    sources: [{ work: 'Camille, Image on the Edge', locus: 'passim (frame)' }],
    status: 'adapted',
  },
];

// ── The Struggle: tier interiority ──────────────────────────────────────
/** Grounds the night scene physically before TIER_TEXT's interior read —
 *  the same dormitory named at Matins, seen again from inside the dark. */
/**
 * The night, per pressure tier: narrator (may be plain/modern, per
 * STYLE_GUIDE §The Struggle rule 2) + John's own monologue (period-
 * direct, never clinical, always — the split IS the register rule).
 * QUIET/STIRRED never reach a choice (nightThreatens gates it) but get
 * the same shape for consistency; BESIEGED/CRISIS are where it matters.
 */
export const NIGHT_DELIBERATION = {
  QUIET: {
    narrator: {
      text: 'He\'s lying in the dark. Nothing is pulling at him tonight.',
      sources: [], status: 'invented',
    },
    monologue: {
      text: 'The house of the mind is swept, and nothing walks in it.',
      sources: [], status: 'invented',
    },
  },
  STIRRED: {
    narrator: {
      text:
        'He\'s lying in the dark, and something in him is stirring — not urgent yet, just ' +
        'present, the way weather is present before it decides what it is.',
      sources: [], status: 'invented',
    },
    monologue: {
      text: 'Something paces at the edge of thought, patient as rot. Not yet knocking.',
      sources: [], status: 'invented',
    },
  },
  BESIEGED: {
    narrator: {
      text:
        'He\'s lying in the dark, wide awake, and he wants to know something he is not ' +
        'permitted to know. This is the temptation Fanger actually documents at the centre ' +
        'of his book — not the flesh but the appetite: the devil notices him over a ' +
        'necromantic volume and the temptation succeeds, and what it produces is not sin so ' +
        'much as a research programme. The cruelty of it is that the appetite is the same ' +
        'one that makes him a good monk. He wants to understand. He has always wanted to ' +
        'understand.',
      sources: [{ work: 'Fanger, Rewriting Magic', locus: 'the desire for forbidden knowledge as the object of temptation (frame; verify)' }],
      status: 'adapted', verify: true,
    },
    monologue: {
      text:
        'It is in the room again — not the book, the book is elsewhere, but the shape of ' +
        'what it said. One more working would settle it. One. I could rise and pray the ' +
        'want down, or put the thing where my hands cannot reach it before morning. Or I ' +
        'could go and read, the way I have before, and be a man who knows more and is ' +
        'worth less by Prime.',
      sources: [], status: 'invented',
    },
  },
  CRISIS: {
    narrator: {
      text:
        'He is losing the argument, and the argument is not with an enemy. It is with the ' +
        'part of himself that got him his degree — the part that does not stop at a locked ' +
        'door because a door is a question. He cannot renounce the appetite without ' +
        'renouncing the man.',
      sources: [], status: 'invented',
    },
    monologue: {
      text:
        'It is not outside me. That is the horror of it: the voice arguing for it is the ' +
        'same voice that construes my Latin, and it is making an excellent case, and I have ' +
        'no argument against it that does not also silence my whole mind.',
      sources: [], status: 'invented',
    },
  },
};

export const TIER_TEXT = {
  QUIET: 'The house of the mind is swept, and nothing walks in it tonight.',
  STIRRED: 'A question paces at the edge of thought, not yet knocking, patient as rot.',
  BESIEGED:
    'The siege is set, and it is laid by a thing I want to know. Every unguarded thought is ' +
    'a gate, and I am a town with too many gates.',
  CRISIS:
    'It is here, and it is not outside me, which is the horror of it; the enemy argues from ' +
    'my own learning, in my own voice, and every argument it makes is one I taught it.',
};
export const TIER_ENVELOPE = { sources: [], status: 'invented' };

// ── Night verbs and outcomes ────────────────────────────────────────────
export const NIGHT_CHOICES = {
  vigil: 'Rise and keep vigil — outlast the wanting on your knees, and pay for it tomorrow.',
  prayer: 'Set the prayer against it, word by word, like sandbags.',
  remove: 'Get up and put the thing beyond your own reach: the armarium, and give away the key.',
  endure: 'Lie still in the dark and hold. Only hold.',
};

export const NIGHT_OUTCOMES = {
  vigil: {
    mastery:
      'Toward Matins the wanting lifted all at once, the way weather lifts; I was on my knees ' +
      'and then I was only a tired man on his knees, which is a good thing to be.',
    endured: 'I outlasted it. There is no glory in it. The lamp burned; I watched it burn.',
    lapse:
      'I kept the vigil an hour and then the vigil kept nothing. I went and read. I record ' +
      'only that I went, and that I was not disappointed, which is the worst of it.',
  },
  prayer: {
    mastery:
      'At the third verse the words stopped being sandbags and started being water; I went ' +
      'under them gladly, and when I surfaced the question had lost its urgency.',
    endured: 'I prayed the thing to a standstill. A standstill is not a victory. I will take it.',
    lapse:
      'The prayer and the appetite braided together until I could not tell which I was ' +
      'saying — and then I was saying the other one, and it had a rhythm, and I followed it.',
  },
  remove: {
    mastery:
      'I walked it down to the armarium myself and gave Denis the key without explaining, and ' +
      'by the stairs it had stopped being a live thing and become an object in a cupboard.',
    endured: 'The distance argued for me while I could not. Sometimes the answer is a locked door.',
    lapse:
      'I got as far as the cloister with it under my arm and then I thought: I will look ' +
      'once, on the way, by this window, where the moon is good. The moon was very good.',
  },
  endure: {
    mastery:
      'I held. I did nothing, said nothing, was nothing but a man refusing to get up, and it ' +
      'turned out refusing to get up was enough, this once.',
    endured: 'I held until it got bored of me. Being boring is an underpraised discipline.',
    lapse:
      'Stillness became drift, and drift became a sentence I was composing about the figures, ' +
      'and by the time I noticed I was composing it I was already at the desk.',
  },
};
export const NIGHT_ENVELOPE = {
  sources: [{ work: 'Fanger, Rewriting Magic', locus: 'the desire for forbidden knowledge as temptation (frame; verify)' }],
  status: 'adapted', verify: true,
};

// ── Confession beats (at chapter) ───────────────────────────────────────
export const CONFESSION = {
  offerPolluted: {
    narrator: {
      text:
        'Chapter has turned to the naming of faults, the way it does every morning — but ' +
        'this morning John is unclean, and nothing moves for him again until he says so, ' +
        'out loud, in this room, in front of the benches.',
      sources: [], status: 'invented',
    },
    monologue: {
      text:
        'I have to say it plainly, now, in front of them all. The saying aloud is the whole ' +
        'medicine and the whole price — and I can pay it, or I can carry the fault out of ' +
        'this room with me instead.',
      sources: [], status: 'invented',
    },
  },
  offerClean: {
    narrator: {
      text:
        'Nothing grave sits on John this morning as chapter turns to the naming of faults — ' +
        'but the scrupulous voice in him doesn\'t care what\'s true.',
      sources: [], status: 'invented',
    },
    monologue: {
      text:
        'I have nothing grave to confess. Say something anyway, the voice says. Say ' +
        'everything. Be safe. That voice wears a cassock, but I do not think it is a monk.',
      sources: [], status: 'invented',
    },
  },
  confess:
    'I said it plainly and did not decorate it. The confessor was brief and kind, which was ' +
    'worse than severity, and then it was done, and the Work stood open again.',
  delay:
    'I said nothing. The fault rode out of chapter on my back, and it has friends where ' +
    'we are going.',
  scruple:
    'I confessed what was not matter, and confessed the confessing, and felt no cleaner — ' +
    'only smaller. This is the wheel Fanger’s monk knew well: scruple grinding the soul ' +
    'finer than any sin managed.',
};
export const CONFESSION_ENVELOPE = {
  sources: [{ work: 'Fanger, Rewriting Magic', locus: 'scrupulosity (frame; verify loci)' }],
  status: 'adapted',
};

// ── The sought vision & discernment ─────────────────────────────────────
export const VISION_TELLS = {
  color: {
    true_:
      'The blue of her mantle was the blue that costs a year’s wages of lapis: deep, ' +
      'unflattering, exact.',
    false_:
      'The blue of the mantle was beautiful and slightly wrong — a blue that flatters, ' +
      'like a mirror that has learned what you hope.',
    ambiguous:
      'Of the color I can say only that it was blue, and that I wanted it to be the right ' +
      'blue so badly that I do not trust my own report.',
  },
  speech: {
    true_:
      'She said less than I wanted and better than I asked: that I should go on slowly, ' +
      'and confess often, and that nothing would be given that prayer had not carried.',
    false_:
      'The figure promised everything at once — the whole art, perfected, and soon — and ' +
      'called me by a name more honorable than mine.',
    ambiguous:
      'The words were scriptural, or nearly; I could not afterward find the verse, which ' +
      'proves nothing either way, my memory being what it is.',
  },
  affect: {
    true_: 'When I woke, the room was ordinary and I was at peace with its ordinariness.',
    false_:
      'When I woke I was exalted and restless, and wanted at once to tell someone, and to ' +
      'begin, and to be seen beginning.',
    ambiguous: 'I woke moved and shaking, which the books say may attend either visitor.',
  },
};

export const VISION_SCENE = {
  rubric: '¶ Of the dream that was sought, and what came.',
  body:
    'Having said the prayer and kept the observance, I slept, and a dream rose to meet me ' +
    'the way a fish rises: deliberately. A figure stood in a walled garden that was also, ' +
    'as is the way of dreams, the abbey church. I record the marks of it faithfully, ' +
    'because everything now depends on reading them right.',
  sources: [{ work: 'Newman, Speculum 80 (2005)', locus: 'cultivated visionary experience (frame)' }],
  status: 'adapted',
};

export const DISCERNMENT_OUTCOMES = {
  licentia:
    'I judged it of God, and it was of God. In the morning the license lay in me like gold ' +
    'leaf laid on and burnished: the Work may proceed. Blessed is she who is patient with ' +
    'slow students.',
  delayed:
    'I judged it false, and it was true. She is not wounded by my caution — the books say ' +
    'she prefers it to presumption — but the license is withheld, and the fault of the delay ' +
    'is mine, and it sits in me like a stone of a particular weight.',
  corrupted:
    'I judged it of God. (It was not. Nothing announced this. The work went on, and seemed ' +
    'to prosper, and something rode along inside it the way rot rides in a beam — found ' +
    'only when weight is put on it.)',
  mastery:
    'I judged it false, and it was false, and the naming broke it like a stick. Let it be ' +
    'recorded that the counterfeit cannot abide examination — this is its one honesty.',
};
export const DISCERNMENT_ENVELOPE = {
  sources: [{ work: 'Fanger, Rewriting Magic', locus: 'discretio spirituum in John (frame; verify loci)' }],
  status: 'adapted',
};

// ── Pencil endnotes (reckoning apparatus) ───────────────────────────────
export const PENCIL_NOTES = [
  {
    id: 'note-invented-prayer',
    text:
      'The prayer you recited tonight is my invention. John’s real prayers survive, edited ' +
      'by Fanger and Watson; until I have that volume open on this desk, the database marks ' +
      'this text invented, and refuses to let me pretend otherwise.',
    cites: ['fanger-watson-edition'],
    sources: [{ work: 'Fanger & Watson (eds.), Liber florum', locus: 'edition (pending)' }],
    status: 'attested',
  },
  {
    id: 'note-struggle',
    text:
      'I had this wrong, and the correction is worth more than the mechanic. I built this ' +
      'night system on the assumption that John’s recorded struggle was sexual, and cited ' +
      'Fanger for it. Reading her more carefully: she does not document that. What she ' +
      'documents is that his temptation is the desire for forbidden knowledge — the devil ' +
      'notices him over a necromantic book — and, astonishingly, that he asks God for ' +
      'comprehensive knowledge precisely so that he may resist sin. The thing that tempts ' +
      'him is the thing he begs for as his defence. Ritual purity, continence included, is ' +
      'real and attested, but it gates the Work; it is not the drama. I have left this note ' +
      'where the old one stood rather than quietly replacing it.',
    cites: ['fanger-rewriting'],
    sources: [{ work: 'Fanger, Rewriting Magic', locus: 'the object of temptation (frame; verify — via digest, see docs/RESEARCH_PIPELINE.md §5)' }],
    status: 'adapted',
    verify: true,
  },
  {
    id: 'note-audit',
    text:
      'John audited his own miracles — tested his visions while receiving them. I have made ' +
      'that audit a mechanic with a cost matrix, and I am aware this is a strange thing to ' +
      'do to a man’s recorded inner life. The alternative was to invent a monk, and he ' +
      'deserved better than to be replaced by one.',
    cites: ['fanger-rewriting', 'newman-speculum'],
    sources: [{ work: 'Fanger, Rewriting Magic', locus: 'frame' }],
    status: 'attested',
  },
  {
    id: 'note-witness',
    text:
      'This run has been saved as a witness — your particular Liber florum, with its variants. ' +
      'The real text survived 1323 the same way: copies, in other hands, elsewhere. One of ' +
      'them surfaced at McMaster University and started the modern recovery. Transmission ' +
      'is the victory condition. It always was.',
    cites: ['watson-conjuring'],
    sources: [{ work: 'Watson, in Conjuring Spirits (1998)', locus: 'the rediscovery' }],
    status: 'attested',
  },
];

// ── Daylight choice (compressed hours) ──────────────────────────────────
export const DAYLIGHT = {
  rubric: '¶ Of the day’s work, between Terce and None.',
  narrator: {
    text:
      'It\'s the hour between Terce and None. John is at his desk with a commentary on ' +
      'Matthew half-copied in front of him — dull, assigned, safe work — and his attention ' +
      'keeps sliding toward the other book, the one only he knows about.',
    sources: [], status: 'invented',
  },
  monologue: {
    text:
      'My will is going soft again. I could hold to what I was given and finish the ' +
      'commentary — it costs me nothing but the boredom of it. Or I could set this aside ' +
      'and give the hour to the Work instead. God knows what that costs me if I\'m seen.',
    sources: [], status: 'invented',
  },
};

// ── The journey (world stage) ───────────────────────────────────────────
export const JOURNEY = {
  depart: {
    rubric: '¶ Of the errand to Étampes, after chapter.',
    body:
      'The prior gave me the errand as one gives a coin to a child: kindly, and watching what ' +
      'I did with it. The infirmary wants poppy and the sacristy wants ink, and I want — I ' +
      'record it honestly — the road. A monk outside his wall is a snail out of its shell: ' +
      'quicker, softer, and in season.',
    sources: [],
    status: 'invented',
  },
  officeWild: {
    text:
      'The bell of no church rang it, but the hour rang in me, and I said the office where I ' +
      'stood, the river carrying the psalm downstream to whoever has ears.',
    sources: [],
    status: 'invented',
  },
  officeTown: {
    text:
      'I said the office in the street, hood back, voice level. A monk praying in a market is ' +
      'a spectacle exactly as edifying as it is conspicuous, and the town counted the house I ' +
      'came from twice.',
    sources: [],
    status: 'invented',
  },
  officeMissedLine:
    'The hours I let pass on the road sat in me at evening like unanswered letters.',
  blocked: [
    'The Juine has the right of way here.',
    'The forest keeps its own rule, and does not admit novices.',
    'Wall. The town is firm on the subject.',
  ],
  sources: [],
  status: 'invented',
};

/** The night after the draught: pressure bought with dreamlessness. */
export const DRUGGED_DREAM = {
  rubric: '¶ Of the night under poppy, in which nothing at all was given.',
  body:
    'The draught did what the apothecary promised: it shuttered the house of the mind entire. ' +
    'No siege — and no garden, no figure, no blue of any kind. I woke with the sense of a ' +
    'door having been knocked upon, softly, in a house where no one was home. I do not know ' +
    'who knocked. That is the price, and I paid it in advance, and I will wonder about it ' +
    'for longer than the sleep was worth.',
  sources: [],
  status: 'invented',
};

/** The Radical Axis surfacing (WORLD_DESIGN.md §4) — the pencil hand notices. */
export const RADICAL_NOTE = {
  id: 'note-radical',
  text:
    'That answer is not in any record. John’s audacity ran through visionary channels — ' +
    'authorization, not defiance. Keep pushing in this register and this witness will earn ' +
    'the margin’s gravest annotation: departure from the record. I will mark it when it ' +
    'comes. That is the deal we made, you and I.',
  cites: ['fanger-rewriting'],
  sources: [{ work: 'Fanger, Rewriting Magic', locus: 'John’s stance toward authority (frame)' }],
  status: 'attested',
};

// ── 1323: the summons, the examination, the endings ─────────────────────

export const SUMMONS = {
  rubric: '¶ Of the letter that came to chapter, and was read aloud.',
  body:
    'The abbot read it himself, which was a kindness, and did not look at me while he read, ' +
    'which was a greater one. A monk of Morigny is required at Paris, with his book, to ' +
    'answer concerning certain prayers and figures. I had imagined this letter so many times ' +
    'that the real one seemed a poor copy. My hands were steady. I noticed them being steady ' +
    'and was ashamed of noticing.',
  sources: [
    { work: 'Grandes Chroniques de France', locus: 'the 1323 condemnation notice (frame; wording on Research Queue)' },
  ],
  status: 'adapted',
};

export const ROAD_TO_PARIS = {
  text:
    'Three days on the road, and the Work in a satchel against my ribs the whole way, and the ' +
    'country going about its business on either side as though nothing were being carried ' +
    'through it.',
  sources: [],
  status: 'invented',
};

/**
 * The examination. Three questions; each takes submit / defend / scorn.
 * The examiners are composites of the period's theological objections to
 * the ars notoria: the words, the authorization, the end.
 */
export const EXAMINATION = [
  {
    id: 'the-words',
    rubric: '¶ The first question: concerning the words.',
    question:
      '"There are words in these prayers," said the master in the middle chair, "that are not ' +
      'Latin, nor Greek, nor Hebrew, nor any tongue a Christian people has spoken. What is a ' +
      'word that no one understands, brother, if it is not a word addressed to something that ' +
      'does understand it?"',
    stances: {
      submit:
        '"I do not know what they are, master. I copied them because they were given to me to ' +
        'copy, and if they are what you fear, then I have been a fool with a pen, and I would ' +
        'rather be a fool than the other thing."',
      defend:
        '"The Church sings alleluia and hosanna and does not construe them, master. A word may ' +
        'be a door without the doorkeeper knowing the joinery. Mine were given in prayer, and ' +
        'in prayer I said them, and to Our Lady and no other."',
      scorn:
        '"You have read them aloud in this room, master, to make your point. If they are what ' +
        'you say, you have just done the thing you are trying me for — and with better ' +
        'pronunciation than I ever managed."',
    },
  },
  {
    id: 'the-authorization',
    rubric: '¶ The second question: concerning by whose leave.',
    question:
      '"You write that the Blessed Virgin authorized this book. In a dream." The youngest ' +
      'examiner did not look up from his notes. "Every heresiarch in the calendar has had a ' +
      'dream, brother. What has yours that theirs had not?"',
    stances: {
      submit:
        '"Nothing, master, that I can prove to you. I know what I saw. I know also what I am, ' +
        'and what I am is not a man whose seeing should outweigh the judgment of the Church. ' +
        'Judge it. I will hold what you hold."',
      defend:
        '"Fruits, master. Mine sent me to confession more often, not less; to obedience, not ' +
        'away from it; and to Our Lady, not past her. A dream that makes a man a better monk ' +
        'is at least not the enemy\'s usual work."',
      scorn:
        '"What has mine that theirs had not? A woman in it who told me to be careful, master. ' +
        'You would know the type. She is on the wall behind you, and I notice none of you have ' +
        'turned around."',
    },
  },
  {
    id: 'the-end',
    rubric: '¶ The third question: concerning what it is for.',
    question:
      '"The old art promised knowledge — grammar, rhetoric, all the arts, poured into a man ' +
      'without study. You say yours is purified. But it promises the same thing, brother. ' +
      'What have you purified, if the appetite is unchanged?"',
    stances: {
      submit:
        '"That is the truest thing anyone has said to me about it, master, and I have said it ' +
        'to myself at Matins for years without answering it. Perhaps I only washed the cup. I ' +
        'submit the whole of it."',
      defend:
        '"The appetite for knowledge is not the sin, master; the theft of it is. I asked. I ' +
        'fasted and confessed and asked, and was refused more often than granted — which is ' +
        'not how demons do business, in my experience of them."',
      scorn:
        '"Unchanged? Master, this room is full of men who spent twenty years and their fathers\' ' +
        'money buying what I was offered for a night\'s prayer. The difference between us is not ' +
        'appetite. It is invoices."',
    },
  },
];
export const EXAMINATION_ENVELOPE = {
  sources: [
    { work: 'Period objections to the ars notoria (after Kieckhefer, Véronèse)', locus: 'frame; composite examiners' },
  ],
  status: 'invented',
};

export const VERDICTS = {
  submitted: {
    rubric: '¶ Of the burning, and of what I did after.',
    body:
      'They burned it in the square, and I stood where I was told to stand and watched the ' +
      'thing I had spent my life on become weather. I had expected to feel torn in half. What ' +
      'I felt was the particular quiet of a debt discharged. I made my satisfaction. I was ' +
      'received back. And in the spring I began again, in a smaller hand, with the parts they ' +
      'had been right about left out — because obedience is not the opposite of the Work, ' +
      'whatever they think in Paris. It is the condition of it.',
  },
  defiant: {
    rubric: '¶ Of the burning, and of the silence they put me under.',
    body:
      'They burned it, and I did not give them the face they wanted while it burned. That was ' +
      'the whole of my rebellion and it cost more than it bought: silence laid on me, my hours ' +
      'watched, my ink measured out like medicine. I am a man with a locked mouth in a house ' +
      'full of keys. Somewhere north of here a woman I taught is saying the prayers tonight, ' +
      'badly, from a copy with my own errors in it, and Paris cannot reach her. Let that be ' +
      'the account.',
  },
  departed: {
    rubric: '¶ Here the witness departs from the record.',
    body:
      'And I did not stop, and I did not go home. I said it in the street where they burned it ' +
      'and I said it in three towns after, that the vision is given to whoever fasts and asks, ' +
      'and that a Church which cannot bear to be told so is confessing something about itself ' +
      'and not about heaven. They took me at Sens in the autumn. What they did then is not ' +
      'written anywhere, because none of this is written anywhere.',
  },
};
export const VERDICT_ENVELOPE = {
  submitted: {
    sources: [{ work: 'Fanger, Rewriting Magic', locus: 'John\'s rewriting after condemnation (frame; verify)' }],
    status: 'adapted',
  },
  defiant: { sources: [], status: 'invented' },
  departed: { sources: [], status: 'invented' },
};

/** The mandatory annotation on the counterfactual path (CLAUDE.md rule 5). */
export const DEPARTURE_NOTE = {
  id: 'note-departure',
  text:
    'Stop. What you just read did not happen. The record has John condemned in 1323 and then ' +
    '— quietly, astonishingly — still writing: a New Compilation, revised in response to the ' +
    'people who burned him. He rewrote rather than recanted, and rewrote rather than ' +
    'martyred. I gave you the Bruno road because you kept walking toward it and because a ' +
    'game that only permits the documented life is a diorama, not an argument. But this ' +
    'witness is now contaminated, and it goes into the stemma marked as such. The real John ' +
    'is stranger than the martyr I just let you make: he survived, and kept working, and that ' +
    'is why there is anything here to play at all.',
  cites: ['fanger-rewriting', 'watson-conjuring'],
  sources: [{ work: 'Fanger, Rewriting Magic', locus: 'the Old and New Compilations (frame)' }],
  status: 'attested',
};

/**
 * The framing ending's three branches, driven by what the scriptorium
 * actually produced and what survived custody (docs/DECISIONS_AND_FORKS.md
 * F-8; SCRIPTORIUM.md §3.7). Pencil-hand register, matching READING_ROOM.
 */
export const RECIPIENT_NAMES = {
  bridget: 'his sister\'s hand, not his own, on the flyleaf',
  anseau: 'a brother\'s hand — the record does not say whose',
  correspondent: 'no hand at all that anyone troubled to name',
};

export const TRANSMISSION_ENDINGS = {
  obedient: {
    text:
      'No second book comes up on this trolley — there wasn\'t one. This witness kept the ' +
      'Rule and gave the Work nothing, and the lectionary he actually finished isn\'t the ' +
      'kind of object a reading room requests by call slip. That isn\'t a failure. It\'s a ' +
      'life, fully spent on the plain road, and the record has no less respect for it.',
    sources: [], status: 'invented',
  },
  nothingEscaped: {
    text:
      'Nothing came up from the stacks. Every copy this witness made stayed in the room ' +
      '1323 emptied. Most books end this way. That is why the ones that do not are worth ' +
      'six hundred years.',
    sources: [], status: 'invented',
  },
};

/** Composed with the actual `receivedCopy()` result — faults and
 *  recipient are real facts about this run, not authored per-branch. */
export function transmissionEndingText(copy, faultPhrases) {
  const hand = RECIPIENT_NAMES[copy.recipient] ?? 'a hand the record never caught';
  const state = copy.gilded
    ? 'gold still on it, licence and all'
    : faultPhrases.length
      ? `carrying ${faultPhrases.length} fault${faultPhrases.length === 1 ? '' : 's'} uncorrected: ${faultPhrases.join('; ')}`
      : 'clean, which almost never happens';
  return `The trolley holds a slim quire — ${hand}, ${state}. It is not the copy he would ` +
    'have chosen to be remembered by. It is the one that got out.';
}

/** The framing ending: the reading room, seven centuries on. */
export const READING_ROOM = {
  rubric: '¶ Explicit. — And then, a long time afterward:',
  body:
    'A reading room, and a call slip, and a foam cradle. The manuscript comes up from the ' +
    'stacks on a trolley with three others, none of them related to it, which is how the ' +
    'important things always arrive. It is not the copy he kept. It is one of the ones that ' +
    'got out — with his errors in it, and somebody else\'s, and a fifteenth-century hand in ' +
    'the margin arguing with him about a prayer. Nicholas Watson found one like this. Claire ' +
    'Fanger spent years reading it. That is the whole victory condition, and it took six ' +
    'hundred years to score.',
  sources: [
    { work: 'Watson, in Conjuring Spirits (1998)', locus: 'the modern rediscovery' },
    { work: 'Fanger, Rewriting Magic', locus: 'the reading of the text' },
  ],
  status: 'attested',
};

// ── The scriptorium (v3c stage) ─────────────────────────────────────────
// Writing manifest: docs/SCRIPTORIUM_STAGE_SPEC.md §6. Registers per
// STYLE_GUIDE.md; the silent-failure texts wear success's face by design
// (docs/NARRATIVE_DESIGN_REPORT.md §4) — do not "fix" their certainty.

const CRAFT_ENV = locus => ({
  sources: [{ work: 'Standard codicology, summarized in SCRIPTORIUM.md §1', locus }],
  status: 'attested',
});
const SCRIPT_ENV = {
  sources: [{ work: 'Monastic scriptorium practice (RB 48; silence; the light)', locus: 'SCRIPTORIUM.md §1 "The monastic setting"' }],
  status: 'invented',
};

export const SCRIPTORIUM_TEXT = {
  // Brief transitions only — DAYLIGHT already carried the deliberation
  // and the choice; these just confirm which desk John is actually at.
  sceneAssigned: {
    rubric: '¶ Of the work of the hands.',
    body: 'I put the other book out of my mind, or try to, and give the hour to what I was given.',
    ...SCRIPT_ENV,
  },
  sceneIllicit: {
    rubric: '¶ Of the other work, done in the same light.',
    body: 'I set the assigned leaf where it should sit, and beneath it, the one that matters more.',
    ...SCRIPT_ENV,
  },

  acquire: {
    'armarium-lectionary': {
      text:
        'The armarius set the lectionary in my hands without looking up, which is what ' +
        'trust looks like in that office: a stout quarto, boards a little sprung, the ' +
        'quires sewn on four cords and the leather gone dark at the corners where forty ' +
        'years of hands have carried it to the lectern and back. A slip of vellum marked ' +
        'the place where the last hand\'s strength gave out, mid-word, in a script gone ' +
        'shaky toward the end of the gathering — an old man\'s hand, or a tired one.',
      ...SCRIPT_ENV,
    },
    'loan-glossed-psalter': {
      text:
        'Brother Anseau lent it the way the poor lend — freely, and forever after. It is a ' +
        'small book, easily carried, the psalms in a tight formal hand down the center of ' +
        'each page and his own gloss crowded into the margins on three sides in ink gone ' +
        'brown, smaller and smaller as the years of commentary outgrew the space he\'d ' +
        'left for them. "Mind the gloss," he said, "it is smaller than charity." I owe him ' +
        'now a debt no inventory will ever find.',
      ...SCRIPT_ENV,
    },
    'isabel-sewn-quires': {
      text:
        'She did not name a price at first. She looked at me the way a woman looks who is ' +
        'deciding what she will know about you tomorrow. Then she named it, and it was ' +
        'fair, which frightened me more. The quires rode home against my ribs, sewn shut, ' +
        'saying nothing.',
      sources: [{ work: 'Monks acquiring magic texts (after Sophie Page)', locus: 'SCRIPTORIUM.md §1 "Magic texts specifically"' }],
      status: 'adapted',
    },
    'pecia-orleans': {
      text:
        'Three days, the man said, and the next hand’s coin already on the board. A text ' +
        'by the piece, like meat. What the schools have made of books I do not like to ' +
        'say; but I took the quire, and I began counting light.',
      sources: [{ work: 'Pecia rental (university practice, adapted to Orléans)', locus: 'SCRIPTORIUM.md §1, §3.1; Research Queue' }],
      status: 'adapted',
    },
    'old-compilation': {
      text:
        'I took up my own first book again. Every fault in it is mine; I know them as a ' +
        'man knows his scars, which is to say not all of them, and not the worst. To copy ' +
        'it forward is to choose among my errors. Our Lady willing, I choose fewer than I keep.',
      sources: [{ work: 'Fanger, Rewriting Magic (rewriting as devotion, frame)', locus: 'Old/New Compilation; loci on Research Queue' }],
      status: 'adapted',
    },
  },

  /** The sewn quires, opened later, alone. */
  sewnFirstLook: {
    text:
      'In the dormitory dark I cut the thread. The unknown words stood in their long ' +
      'ranks, letter by letter, keeping their counsel. Whoever copied them before me ' +
      'could not read them either. That is the condition of this art: we carry what we ' +
      'cannot construe, and it garbles as it goes.',
    sources: [{ work: 'The ars notoria’s verba ignota (after Véronèse)', locus: 'SCRIPTORIUM.md §1 "Magic texts specifically"' }],
    status: 'adapted',
  },

  hands: {
    textualis: {
      name: 'the set hand',
      line: 'Formed and slow; the fingers pay, and the sense keeps watch.',
      ...CRAFT_ENV('"The craft" — scripts and hands'),
    },
    cursive: {
      name: 'the quick hand',
      line: 'Running and light; haste is how errors get in.',
      ...CRAFT_ENV('"The craft" — scripts and hands'),
    },
    trusting: {
      name: 'trusting the exemplar',
      line: 'Letter by letter, construing nothing; the fastest hand, and the blindest.',
      ...CRAFT_ENV('"The craft" — errors of copying'),
    },
  },

  grades: {
    recollected: {
      text:
        'The leaf is even and the hand held. For an afternoon the writing and the praying ' +
        'were one work, and I was not two men but one.',
      ...SCRIPT_ENV,
    },
    distracted: {
      text:
        'The leaf will serve. Twice or three times I came back to my hand from somewhere ' +
        'else, and the strokes remember where I went.',
      ...SCRIPT_ENV,
    },
    scattered: {
      text:
        'A poor leaf. The letters walk like men in mud, and my mind was in six houses ' +
        'while my body sat at one desk.',
      ...SCRIPT_ENV,
    },
  },

  correction: {
    /** Used whether or not invisible faults remain: the lie must be perfect. */
    cleanLie: {
      text:
        'I read the leaf over, word by word, and it read clean, and I thanked Our Lady ' +
        'for a day without faults.',
      ...SCRIPT_ENV,
    },
    expunctuation: {
      text:
        'The doubled words I put to death mercifully: dots beneath the condemned, and the ' +
        'true reading standing after. The page forgives, but it does not forget; a ' +
        'correction shows the way a scar shows.',
      ...CRAFT_ENV('"The craft" — expunctuation, signes-de-renvoi'),
    },
    firstCopy: {
      text:
        'Against what should I prove it? There is no second witness within these walls. ' +
        'A first copy is like a first confession: you must trust the teller, and the ' +
        'teller is you.',
      ...SCRIPT_ENV,
    },
    verbaRefused: {
      text:
        'The unknown words I cannot try. Sense would show me a fault; they have none to ' +
        'show. I copied what stood, stroke for stroke, and prayed the strokes were prayers.',
      sources: [{ work: 'Verba ignota admit no correction-from-sense (after Véronèse)', locus: 'SCRIPTORIUM.md §3.3' }],
      status: 'adapted',
    },
  },

  figure: {
    /** One face for success and failure alike (D-7). */
    drawn: {
      text:
        'I drew the figure with compass and rule, the words set each in its house. It is ' +
        'finished, and it is fair to see. Whether it is true, the eye that made it cannot say.',
      sources: [{ work: 'Figure fidelity as efficacy (ars notoria; John’s Book of Figures)', locus: 'SCRIPTORIUM.md §3.4; figure program on Research Queue' }],
      status: 'adapted',
    },
    gilded: {
      text:
        'On the licensed copy I laid the gold and burnished it with the tooth, and the ' +
        'figure took the light the way she takes a prayer: entirely, and giving it back changed.',
      ...SCRIPT_ENV,
    },
  },

  pigment: {
    vermilion: {
      text: 'Vermilion for the rubrics: instruction’s own red. The leaf begins to speak in two voices, as a book should.',
      ...CRAFT_ENV('"The craft" — pigments'),
    },
    ultramarine: {
      text:
        'I ground the blue that is past my station and laid it thin as absolution. A poor ' +
        'monk’s book with heaven’s own color in it: someone will ask, someday, how it came there.',
      ...CRAFT_ENV('"The craft" — pigments; §3.5 (cost as statement)'),
    },
    verdigris: {
      text:
        'The green went on sweetly and dried true. A fair color, verdigris, and patient; ' +
        'what it is patient for, I did not then know.',
      ...CRAFT_ENV('"The craft" — pigments; §3.5 (slow corrosion)'),
    },
    orpiment: {
      text:
        'The yellow that is nearly gold, for those of us who will never afford gold. It ' +
        'lies handsome on the leaf, and keeps bad company with the other colors.',
      ...CRAFT_ENV('"The craft" — pigments; §3.5 (hazards)'),
    },
    goldLaid: {
      text:
        'Gold on the ground of gesso, burnished till it held the window in it. Gold is not ' +
        'a color; it is a witness. It says: this leaf was permitted.',
      ...SCRIPT_ENV,
    },
    goldRefused: {
      text:
        'I weighed the gold in its paper and put it back. She has not said yes. Gold ' +
        'without leave is not illumination; it is lying in metal.',
      ...SCRIPT_ENV,
    },
    sickened: {
      text:
        'By None my head swam and my stomach turned against me, and there was a taste ' +
        'under my tongue like a coin. The orpiment takes its toll of the grinder; brothers ' +
        'have warned brothers of it since the colors had names. I offered up what it cost. ' +
        'It accepted, and took more.',
      ...CRAFT_ENV('"The craft" — pigments; §3.5 (orpiment)'),
    },
    reaction: {
      text:
        'Where the yellow touched the other color the leaf turned traitor: a blackness ' +
        'spreading, slow as suspicion and as sure. Two fair colors, and between them, ' +
        'ruin. There is a sermon in that. I was too vexed to preach it to myself.',
      ...CRAFT_ENV('"The craft" — pigments; §3.5 (reactions)'),
    },
  },

  light: {
    noticed: {
      text:
        'A shadow held at my shoulder a moment longer than passing needs. I did not look ' +
        'up. Not looking up is also a kind of confession.',
      ...SCRIPT_ENV,
    },
    fire: {
      text:
        'The candle guttered and a bead of flame walked the tallow toward my sleeve, and ' +
        'for one heartbeat I saw the whole scriptorium as tinder: the herd of skins, the ' +
        'oil, the dry old wood. I pinched it, and sat shaking, and did not write again that hour.',
      ...SCRIPT_ENV,
    },
    seen: {
      text:
        'A light where no light is permitted is a bell that rings by being seen. The ' +
        'stair had eyes; I heard them go. What comes up a stair at night in silence goes ' +
        'back down it, in the morning, as a question.',
      ...SCRIPT_ENV,
    },
  },

  caught: {
    text:
      'The exemplar stumbled — a word doubled where its parent had doubled it. I caught ' +
      'it as it passed into my pen, and set it right, and thanked the sense for keeping ' +
      'watch where the eye alone would have carried it, faithful and wrong.',
    ...CRAFT_ENV('"The craft" — errors of copying'),
  },

  /** Where the leaf rests, once the day's work is done (SCRIPTORIUM.md
   *  §3.6). Narrator + monologue, per STYLE_GUIDE §The Four Hands. */
  concealment: {
    loose: {
      narrator: {
        text: 'John leaves the quires loose in his scrip, easiest to reach and easiest to lose.',
        sources: [], status: 'invented',
      },
      monologue: {
        text: 'Loose is fast. Loose is also the first place anyone would think to look, if anyone thought to look at all.',
        sources: [], status: 'invented',
      },
    },
    bound: {
      narrator: {
        text: 'John binds the finished quires into the spine of a licit psalter, the stitching invisible under the boards.',
        sources: [{ work: 'Sophie Page, Magic in the Cloister (camouflage by binding)', locus: 'SCRIPTORIUM.md §3.6' }],
        status: 'adapted',
      },
      monologue: {
        text: 'Let it lie under something no one will ever ask to open. A lie told with thread instead of words is still a lie — but it\'s the kind confession can reach, if I\'m ever brave enough to say so.',
        sources: [], status: 'invented',
      },
    },
    shelved: {
      narrator: {
        text: 'John returns the quires to the open shelf of the armarium, where every book in the house can be counted.',
        sources: [], status: 'invented',
      },
      monologue: {
        text: 'Hiding nothing is its own kind of hiding — until someone finally reads what\'s in front of them.',
        sources: [], status: 'invented',
      },
    },
  },

  /** The transmission's mechanical resolution (SCRIPTORIUM.md §3.7). The
   *  recipient's own dialogue carries the scene; this is what the game
   *  itself has to say about what just left the room. */
  transmission: {
    clean: {
      text: 'It goes out of your hands clean, so far as you know. Whether it stays that way is no longer yours to answer for.',
      sources: [], status: 'invented',
    },
    corrupt: {
      text: 'It goes out of your hands with its faults still in it, and you say nothing about them. Some gifts are also debts.',
      sources: [], status: 'invented',
    },
  },
};

/** Composed in main.js from a `scrapeLeaf()` result + `faultPhrase()`
 *  (engine/stemma.js) — kept as templates, not hardcoded engine prose. */
export const UNDERTEXT_TEXT = {
  eyeskip: phrase => `Under the fresh line, if he holds the leaf to the light: ${phrase}, from a hand that was his own, once, and never knew it had erred.`,
  dittography: phrase => `Under the fresh line, if he holds the leaf to the light: ${phrase} — the old doubling, faint, patient, unmended.`,
  verba_ignota: phrase => `Under the fresh line, if he holds the leaf to the light: ${phrase}, in a hand that could not have known better either.`,
  blackened: phrase => `Under the fresh line, if he holds the leaf to the light: ${phrase}, an old ruin the new ink writes carefully around.`,
  corrosion: phrase => `Under the fresh line, if he holds the leaf to the light: ${phrase}, the green still working, slower than he is.`,
};

/** The copy loop’s own margin (joins the pencil notes from DISTRACTIONS). */
export const COPY_DISTRACTIONS = [
  {
    id: 'copy-quill-split',
    kind: 'mundane',
    text: 'The quill splits its stroke; the knife is in the other hand before the thought is. Small surgeries, all day long.',
    effects: { pressure: 0, despair: 0 },
    sources: [], status: 'invented',
  },
  {
    id: 'copy-ink-flies',
    kind: 'mundane',
    text: 'The flies have found the ink again. They die scholars’ deaths, in the middle of the line.',
    effects: { pressure: 0, despair: 0 },
    sources: [], status: 'invented',
  },
  {
    id: 'copy-three-fingers',
    kind: 'mundane',
    text: 'The fingers stiffen around the pen. Three fingers write, the whole body labors — and today the whole body is cold.',
    effects: { pressure: 1, despair: 0 },
    sources: [{ work: 'Medieval colophon commonplace ("three fingers write")', locus: 'SCRIPTORIUM.md §1 (colophons)' }],
    status: 'adapted',
  },
  {
    id: 'copy-gregorys-rule',
    kind: 'mundane',
    text: 'Hair side to hair side, flesh to flesh: the quire is a herd folded in order. I count faces to be sure of it, and lose the line I was on.',
    effects: { pressure: 0, despair: 0 },
    sources: [{ work: 'Gregory’s Rule (quire arrangement)', locus: 'SCRIPTORIUM.md §1 "The craft"' }],
    status: 'adapted',
  },
  {
    id: 'copy-orleans-hand',
    kind: 'memory',
    text: 'This stroke — I learned this stroke at Orléans, from a hand I have not prayed for in years. The letters remember their teachers. That is not always a mercy.',
    effects: { pressure: 1, despair: 0 },
    sources: [{ work: 'Kieckhefer, Magic in the Middle Ages', locus: 'the "clerical underworld" (frame)' }],
    status: 'adapted',
  },
  {
    id: 'copy-young-hand',
    kind: 'memory',
    text: 'In the margin of my first book, a note in my own young hand, certain of everything. I have not the heart to scrape him, and not the right to keep him.',
    effects: { pressure: 1, despair: 1 },
    sources: [], status: 'invented',
  },
  {
    id: 'copy-idle-hand',
    kind: 'appetite',
    text: 'The copying hand is busy and the other is idle, and idleness in one member is heard by all the rest. I set the free hand to the penknife’s work, and give it a duty.',
    effects: { pressure: 2, despair: 0 },
    sources: [], status: 'invented',
  },
  {
    id: 'copy-enemy-illumination',
    kind: 'appetite',
    text: 'Between one letter and the next, unbidden, the enemy offers an illumination of his own devising. I will not gild it. Margin, take what I refuse.',
    effects: { pressure: 2, despair: 1 },
    sources: [], status: 'invented',
  },
  {
    id: 'copy-pencil-verba',
    kind: 'pencil',
    text:
      'The strings of unknown words you are copying were garbled before John ever saw ' +
      'them; the surviving witnesses disagree, and there is no "correct" text to restore. ' +
      'You are not preserving a signal. You are faithfully preserving the noise. — n.',
    effects: { pressure: 0, despair: 0 },
    cites: ['veronese-notoria'],
    sources: [{ work: 'Véronèse, ars notoria editions', locus: 'transmission of the verba ignota (frame)' }],
    status: 'adapted',
  },
  {
    id: 'copy-pencil-pecia',
    kind: 'pencil',
    text:
      'Deadline copying against a rented exemplar is documented university practice; ' +
      'whether Orléans’s trade ran true peciae is on my research queue, so the database ' +
      'holds that record at adapted. The clock you are feeling is real. The town is my guess. — n.',
    effects: { pressure: 0, despair: 0 },
    cites: ['page-cloister'],
    sources: [{ work: 'Sophie Page, Magic in the Cloister', locus: 'Research Queue — pecia at Orléans' }],
    status: 'adapted',
  },
];

/** Pencil notes shown from the scriptorium stage (not the reckoning pool). */
export const SCRIPTORIUM_NOTES = [
  {
    id: 'note-verba-ignota',
    text:
      'Unintelligible text has no error-correction: a scribe who cannot construe cannot ' +
      'see where he has strayed. The verba ignota garbled catastrophically in real ' +
      'transmission, and in this game they are the one fault nothing can mend. That is ' +
      'not a difficulty setting. It is philology.',
    cites: ['veronese-notoria'],
    sources: [{ work: 'Véronèse (ars notoria transmission)', locus: 'SCRIPTORIUM.md §1, §3.3' }],
    status: 'attested',
  },
  {
    id: 'note-scribere',
    text:
      'The copy loop reuses the recitation engine function for function, because the ' +
      'monks’ own metaphor said they were one economy — scribere est orare. The colophons ' +
      'complain about the body (three fingers write; the whole body labors) the way John ' +
      'complains about the night. Same attention, different member.',
    cites: ['rb1980', 'dehamel-scribes'],
    sources: [{ work: 'RB 48 (labor and lectio); colophon commonplaces', locus: 'SCRIPTORIUM.md §1; display citations pending (R-9)' }],
    status: 'adapted',
  },
  {
    id: 'note-first-copy',
    text:
      'Eyeskip is invisible until you can collate, and you cannot collate until a second ' +
      'witness exists. Every "it reads clean" this game has told you was said in good ' +
      'faith and possibly false. The textual tradition you are building has the same ' +
      'epistemology as the visions: accepted on tells, proven later, or never.',
    cites: ['fanger-watson-edition'],
    sources: [{ work: 'Textual criticism (collation); Fanger–Watson apparatus', locus: 'SCRIPTORIUM.md §3.3' }],
    status: 'adapted',
  },
];

// ── Content note (first launch; canonical wording from STYLE_GUIDE.md) ──
export const CONTENT_NOTE =
  'This game simulates the inner life of a real fourteenth-century monk, John of Morigny, ' +
  'as recorded in his own visionary autobiography: his religious practice, his hunger for ' +
  'knowledge he was forbidden to pursue, and his struggles with temptation, deception, and ' +
  'scrupulosity, in the confessional language of his time. It depicts demonic apparition ' +
  'and spiritual crisis. Nothing is explicitly depicted. The historical John is treated ' +
  'throughout with the dignity owed to the dead.';
