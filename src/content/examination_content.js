/**
 * MORIGNY — 1323: the summons, the examination, the verdict, the
 * stemma. Given their voices, and recast per D-21.
 *
 * TWO THINGS THIS FIXES.
 *
 * 1. The game's climax was undeclared and unvoiced. Three questions,
 *    three answers each, and no third-person orientation, no interior
 *    voice, and no statement of what the answers actually do. The
 *    branch audit found it (docs/BRANCH_AUDIT.md).
 *
 * 2. D-21, outstanding since 2026-08-31: the stances read as
 *    submit / defend / SCORN, which is the wrong description of what
 *    is happening. Following Michael Bailey, the examiners are not
 *    applying a settled rule to a clear case — they are doing
 *    boundary-work, deciding in the room, with John in front of them,
 *    which side of a line his practice falls on. So the third stance
 *    is not a temper. It is a jurisdictional claim: that they lack
 *    standing to classify what he was given. The engine keys stay
 *    (`submit` / `defend` / `scorn`) because the verdict logic and its
 *    tests are built on them; the presentation is now accurate.
 *
 * The existing answers in content.js are kept — they are good, and the
 * first one already contests the classification rather than sneering.
 * What changes is the framing around them and the stakes on each.
 */

const BAILEY = [{ work: 'Bailey, on the boundaries of magic, religion, and science', locus: 'boundary-work as an institutional practice, not the application of a settled rule (frame; verify)' }];
const PETERS = [{ work: 'Peters, The Magician, the Witch, and the Law', locus: 'accusation and process as argument built for an audience (frame)' }];
const FANGER = [{ work: 'Fanger, Rewriting Magic', locus: 'the condemnation and what survived it (frame; verify)' }];
const CHRONICLES = [{ work: 'Grandes Chroniques de France', locus: 'the 1323 notice — a chronicle\'s claim, not a transcript' }];
const INV = { sources: [], status: 'invented' };

// ── The summons ────────────────────────────────────────────────────────

export const SUMMONS_SCENE = {
  rubric: '¶ Of a letter from Paris, and the road under it.',
  narrator: {
    text:
      'The letter is the point at which the paperwork stops being ambient and becomes ' +
      'directed at him personally. Everything the game has been accumulating — what the ' +
      'house noticed, what got written into ledgers, who had cause to mention his name — ' +
      'arrives here as a single document requiring his presence. It is worth being clear ' +
      'about what is and is not known: a chronicle records that in 1323 a monk of Morigny\'s ' +
      'book was condemned and burned at Paris. The precise procedure, the charges, and ' +
      'whether anything resembling a formal heresy trial took place are not established by ' +
      'the surviving evidence. What follows is our reconstruction of a plausible examination, ' +
      'and it says so.',
    sources: [...FANGER, ...CHRONICLES, ...PETERS], status: 'adapted', verify: true,
  },
  monologue: {
    ...INV,
    text:
      'It came at Terce and I read it standing up, which I regret; a man should sit down for ' +
      'a thing like that. Three days to Paris. I have carried the book on worse roads than ' +
      'this one, and never with my own name written on the summons.',
  },
  interaction: {
    ...INV,
    text: 'There is nothing to decide yet. The road is three days, and the examination is at the end of it.',
  },
};

// ── The examination ────────────────────────────────────────────────────

export const EXAMINATION_SCENE = {
  rubric: '¶ Of the room at Paris, and the men in it.',
  narrator: {
    text:
      'Three masters, a table, and a copy of his book. The temptation is to imagine them ' +
      'applying a settled rule to a clear case, and Michael Bailey\'s work is the corrective: ' +
      'there was no settled rule. The boundary between licit devotion and illicit magic was ' +
      'itself the ongoing product of arguments like this one, redrawn by whoever was doing ' +
      'the classifying. These men are not consulting a line. They are drawing one, in the ' +
      'room, with him in front of them — and what he says in the next hour is part of how it ' +
      'gets drawn. That is what makes the third road available to him: not defiance, but a ' +
      'claim that they lack the standing to decide.',
    sources: [...BAILEY, ...PETERS], status: 'adapted', verify: true,
  },
  monologue: {
    ...INV,
    text:
      'They have my book on the table and they have been reading it. I can see where the ' +
      'quire is opened. Whatever I have prepared to say, I will now say something else, ' +
      'because that is what rooms like this are for.',
  },
  interaction: {
    ...INV,
    text:
      'Three questions, three ways to answer each. Submitting concedes their authority to ' +
      'judge; defending argues inside their frame; contesting denies they have standing at ' +
      'all. Contesting is the only road that can carry a witness out of the record — and it ' +
      'must be earned across a life, not improvised at the bar. Every answer is written down. ' +
      'The book burns whatever you say.',
  },
};

/**
 * Stance framing, per question. The engine keys are unchanged; these
 * name what each answer actually does, in the terms D-21 established.
 */
export const STANCE_FRAMING = {
  'the-words': {
    submit: {
      label: 'Concede the words. You cannot construe them either.',
      why: 'Accept their authority to classify: a fool with a pen is not a heretic. Leans Obedient.',
    },
    defend: {
      label: 'Argue inside their frame: the Church sings what it does not construe.',
      why: 'Meet them on doctrine — alleluia, hosanna, a word may be a door. Their rule, your reading.',
    },
    scorn: {
      label: 'Point out that they have just said the words aloud themselves.',
      why: 'Contest the classification: if the words do what you claim, master, look what you have done. Leans Radical.',
    },
  },
  'the-authorization': {
    submit: {
      label: 'Grant that a private dream cannot outweigh the Church.',
      why: 'Concede the hierarchy of authority entirely. The safest answer available. Leans Obedient.',
    },
    defend: {
      label: 'Offer the fruits: it made him a better monk, not a freer one.',
      why: 'Argue by the test they accept — a vision is known by what it produces.',
    },
    scorn: {
      label: 'Name who authorized it, and note that she is behind them on the wall.',
      why: 'Contest their standing: the warrant is hers, not yours to weigh. Leans Radical.',
    },
  },
  // "It promises the same thing, brother. What have you purified, if
  // the appetite is unchanged?" — the question that lands on the
  // retargeted Struggle: knowledge is what tempts him, and it is also
  // what he asks for as his defence against temptation.
  'the-end': {
    submit: {
      label: 'Concede it: perhaps he only washed the cup.',
      why: 'The truest thing anyone has said to him, and he has no answer. Submits the whole of it. Leans Obedient.',
    },
    defend: {
      label: 'Argue that what was purified is the mediation, not the appetite.',
      why: 'The wanting is not the sin; whom you ask, and by whose leave, is the whole question. Their frame, his distinction.',
    },
    scorn: {
      label: 'Deny that this room can determine what was given to him.',
      why: 'Refuse the jurisdiction outright: the appetite was never theirs to weigh. Walked far enough, this leaves the record. Leans Radical.',
    },
  },
};

export const STANCE_FRAMING_ENVELOPE = { sources: BAILEY, status: 'adapted', verify: true };

// ── The verdict ────────────────────────────────────────────────────────

export const VERDICT_SCENE = {
  narrator: {
    text:
      'They confer briefly, because the outcome was never really the question. Every road ' +
      'ends with the book burned — that is the fixed point of this game and of the history ' +
      'it simulates. What the hour decided is not whether he keeps the work but which ' +
      'register 1323 happens in for him: submitted, defiant, or departed from the record ' +
      'altogether. And then the part the chronicle does not record: what was in his cell ' +
      'when they went looking, and what had already left.',
    sources: [...FANGER, ...CHRONICLES], status: 'adapted', verify: true,
  },
  monologue: {
    ...INV,
    text:
      'I watched it go. I had thought I would say something and I said nothing, and the ' +
      'nothing was not resignation; it was arithmetic. I was counting what is not in this ' +
      'room.',
  },
};

// ── The stemma ─────────────────────────────────────────────────────────

export const STEMMA_SCENE = {
  narrator: {
    text:
      'Seven centuries later, in a reading room. This is the part of the story that is not ' +
      'about John at all: the Liber florum survived, in copies, in houses he never saw, and ' +
      'was recovered by modern scholarship — a manuscript at McMaster identified in the ' +
      '1990s, then more in Austria, Italy, Spain. What a scholar receives is not the best ' +
      'copy but the one that got out, and every copy carries the faults of every copy it ' +
      'descended from. That is what a stemma is: a family tree of errors, and the only ' +
      'honest scoreboard this game has.',
    sources: [
      ...FANGER,
      { work: 'Watson, "John the Monk\'s Book of Visions" (Conjuring Spirits, 1998)', locus: 'the modern recovery (frame; verify)' },
    ],
    status: 'adapted', verify: true,
  },
  monologue: {
    ...INV,
    text: 'Somebody is reading it. I did not know that would be the answer to the prayer, and I would not have believed it, and it is the answer.',
  },
};
