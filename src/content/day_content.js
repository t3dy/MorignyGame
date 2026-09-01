/**
 * MORIGNY — the day's remaining branches, given their voices.
 *
 * These are the moments a player hits most often and which had, until
 * now, no narration whatever: the desk after a copy is finished, where
 * the leaf rests tonight, the choice of room, the frame a prayer is
 * presented under, and the reckoning at the end of every single day.
 * They were bare menus. The branch audit (docs/BRANCH_AUDIT.md) found
 * them because they were finally declared.
 *
 * Pipeline note (rule 11): historical claims cite the work the digests
 * summarise and carry `verify`; John's own words are invented.
 */

const PAGE = [{ work: 'Page, Magic in the Cloister', locus: 'the monastic material infrastructure of occult practice (frame; verify)' }];
const SCRIPT = [{ work: 'SCRIPTORIUM.md working notes', locus: 'the copy loop, correction, and concealment (design rationale)' }];
const CODICOLOGY = [{ work: 'Standard codicology, summarized in SCRIPTORIUM.md §1', locus: 'quires, binding, and how a book is physically kept' }];
const FANGER = [{ work: 'Fanger, Rewriting Magic', locus: 'the Book of Visions as a record kept nightly (frame; verify)' }];
const RB = [{ work: 'RB 1980 (Rule of St Benedict)', locus: 'RB 4, 42, 48 — the examination of conscience and the ordering of the day (frame)' }];
const INV = { sources: [], status: 'invented' };

// ── The daylight hour: which room ──────────────────────────────────────

export const DAYLIGHT_PLACES = {
  rubric: '¶ Of the day\'s work, and where it will be done.',
  narrator: {
    text:
      'The hours between Terce and None are the ones the Rule assigns to labour, and they ' +
      'are the only stretch of the day John has any say over. Where he spends them decides ' +
      'what is even possible: the scriptorium has parchment and witnesses, the armarium has ' +
      'the books and the shelf behind them, his cell has a door that closes, the workshop ' +
      'has lead and a sealing press, and the gate has whatever the world has brought. Sophie ' +
      'Page\'s work on monastic libraries makes the point that a house like this is not ' +
      'somewhere magic happens but the plant that makes it possible — materials, access, ' +
      'skills, privacy, and people who notice things.',
    sources: [...PAGE, ...RB], status: 'adapted', verify: true,
  },
  monologue: {
    ...INV,
    text:
      'One hour, and six doors. Whichever I open, the others stay shut until tomorrow, and ' +
      'tomorrow is not a thing I have been promised.',
  },
  interaction: {
    ...INV,
    text: 'Choose a room, then what to do in it. You may look into a room and come back out without spending the hour.',
  },
};

// ── The desk, after a copy is finished ─────────────────────────────────

export const DESK_AFTER = {
  rubric: '¶ Of what remains when the copying is done.',
  narrator: {
    text:
      'The quire is written and the work is not finished. What a scribe does in the hour ' +
      'after the last unit is what separates a book from a stack of skins: reading it over ' +
      'for what the eye can still catch, drawing whatever figures the exemplar demands, ' +
      'laying colour, and deciding where the thing will physically live tonight. Each of ' +
      'those is a real decision with a real cost, and two of them cannot be undone. The ' +
      'errors reading can find are the visible ones; the eyeskip that dropped a line is ' +
      'silent, and stays silent until somebody collates this copy against another.',
    sources: [...SCRIPT, ...CODICOLOGY], status: 'adapted',
  },
  monologue: {
    ...INV,
    text:
      'Done, and not done. Read it over, and I will find what I am able to find, which is ' +
      'not the same as what is there.',
  },
  interaction: {
    ...INV,
    text: 'Examine, draw, and rubricate as often as the leaf allows; the hour ends when you decide where the quire rests.',
  },
};

// ── Where the leaf rests ───────────────────────────────────────────────

export const CONCEALMENT_CHOICE = {
  rubric: '¶ Of where a dangerous book sleeps.',
  narrator: {
    text:
      'This is the decision that determines whether anything survives him, and it is made ' +
      'with a physical object in his hands at the end of a working day. Page found that the ' +
      'monks of St Augustine\'s did not simply hide their strange books — they shelved them ' +
      'beside orthodox works, bound them into innocuous volumes, and occasionally coded a ' +
      'passage. Concealment was a matter of presentation as much as of hiding places. Loose ' +
      'quires can be moved and can be scattered; a bound codex looks like a book and is ' +
      'read as one; an openly shelved volume is safest from suspicion and least safe from ' +
      'an inventory, because an inventory is exactly a list of what is on the shelves.',
    sources: [...PAGE, ...CODICOLOGY], status: 'adapted', verify: true,
  },
  monologue: {
    ...INV,
    text:
      'Under the mattress, in the press, or on the shelf where God and Denis can both see ' +
      'it. I have argued myself into all three and I notice the argument is always about ' +
      'what I would say if asked.',
  },
  interaction: {
    ...INV,
    text: 'Each option quotes its own odds of being found if the house is ever searched. The choice ends the daylight hour.',
  },
};

// ── The frame a prayer is presented under ──────────────────────────────

export const LEGITIMATION_SCENE = {
  rubric: '¶ Under what name shall it stand?',
  narrator: {
    text:
      'A ritual is not only what it does; it is also what it is called, and medieval ' +
      'practitioners spent enormous effort on the second question. The same operation ' +
      'presented as liturgy, as private devotion, as natural philosophy, or as personal ' +
      'revelation is not equally recognisable as magic to a man walking past the door — and ' +
      'the practitioner very often believes his own framing. This is not cynical cover. It ' +
      'is a claim about what kind of knowledge the thing is, and John, who was a canon ' +
      'lawyer, made such claims for a living.',
    sources: [{ work: 'Fanger (ed.), Invoking Angels', locus: 'legitimation and the contested category of the operation (frame; verify)' }],
    status: 'adapted', verify: true,
  },
  monologue: {
    ...INV,
    text:
      'What do I call it, if I am asked? And which of the answers would I still give if no ' +
      'one were asking? Those should be the same answer. I have not always been certain ' +
      'that they are.',
  },
  interaction: {
    ...INV,
    text: 'The stronger the frame, the more it conceals — and suspicion accrues only from what the frame fails to cover.',
  },
};

// ── The reckoning ──────────────────────────────────────────────────────

export const RECKONING_SCENE = {
  rubric: '¶ The examination of conscience, and the ledger of the day.',
  narrator: {
    text:
      'The Rule asks a monk to examine his conscience daily, and John did something stranger ' +
      'with the habit: he wrote the examination down, in order, sparing himself very little, ' +
      'and that record became the first book of the Liber florum. The Book of Visions is not ' +
      'a diary — Fanger is clear that it was constructed retrospectively — but its raw ' +
      'material is exactly this, a man at the end of a day setting out what happened and ' +
      'what he made of it. Everything the game has shown you today is available to be read ' +
      'back, in every voice, because that is the form his own practice took.',
    sources: [...RB, ...FANGER], status: 'adapted', verify: true,
  },
  monologue: {
    ...INV,
    text:
      'Set it down as it was. The prayer and the failure and the thing I would rather not ' +
      'write, because a book that holds only my good days would be no use to anyone, ' +
      'including me.',
  },
  interaction: {
    ...INV,
    text:
      'Journalling eases despair. You may read the day back as it was written, or read the ' +
      'Liber florum from the beginning to see what it is becoming, before beginning another day.',
  },
};

export const RECKONING_OPTIONS = {
  journal: {
    key: 'J',
    label: 'Journal: write the day into the Liber.',
    why: 'He wrote it all down; that is why any of this exists. (Despair −1.)',
  },
  review: {
    key: 'L',
    label: 'Read the day as it was written.',
    why: 'The whole day back in every voice — narrator, his own hand, and the ledger beneath.',
  },
  book: {
    key: 'F',
    label: 'Read the Liber florum over from the beginning.',
    why: 'What you have actually been making, which is not always what you meant.',
  },
  next: {
    key: 'B',
    label: 'Begin another day. (A new witness.)',
    why: 'The calendar moves weeks or a season; what you have built persists.',
  },
};
export const RECKONING_OPTIONS_ENVELOPE = { sources: FANGER, status: 'adapted', verify: true };

// ── The rooms, in his own voice ────────────────────────────────────────

/** Each room gets an interior line, so entering one is not a bare list. */
export const PLACE_MONOLOGUE = {
  scriptorium: { ...INV, text: 'Forty years of other men\'s hands on these same exemplars, and mine now among them, for whatever that is worth.' },
  armarium: { ...INV, text: 'The cupboard, and the shelf behind the cupboard. I know the order of both by heart and I did not set out to.' },
  cell: { ...INV, text: 'A door that closes. I have never been able to decide whether that is a mercy or the whole of the problem.' },
  infirmary: { ...INV, text: 'The dying and the herbal in the same room, and nobody thinks it strange that I am comfortable in both.' },
  workshop: { ...INV, text: 'Lead and solder and the smell of it. Here a drawing stops being a thought and becomes a thing that can be picked up.' },
  garden: { ...INV, text: 'Beans, and an hour nobody is counting. I come back able to think again and I do not write that part down.' },
  gate: { ...INV, text: 'Whatever the road has brought today. It is the only door in the house that opens outward.' },
};
