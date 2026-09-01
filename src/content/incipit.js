/**
 * MORIGNY — the opening (rewritten 2026-09-01).
 *
 * WHAT WAS WRONG. The game opened with two bare menu items — "Begin at
 * Matins — a day within the walls" and, worse, for anyone returning,
 * "Take up the day again." No narration, no orientation, no statement
 * of what the player was about to do or how to do it. It was a mode
 * select at the front of a game about a man's life.
 *
 * What an opening owes the reader, per the branch audit
 * (docs/BRANCH_AUDIT.md): third-person orientation, an interior voice,
 * scholarly grounding for the claims it makes, and a plain account of
 * how the game is played. All four, before the first choice — and the
 * first choice is in childhood, because that is where the life starts.
 */

const FANGER = [{ work: 'Fanger, Rewriting Magic', locus: 'John of Morigny\'s life and the Liber florum (frame; verify)' }];
const CHRONICLES = [{ work: 'Grandes Chroniques de France', locus: 'the 1323 notice — a chronicle\'s claim, per docs/scholarship/peters.md' }];

export const INCIPIT = {
  rubric: '¶ Here begins the book of the flowers of heavenly teaching.',

  narrator: {
    text:
      'John of Morigny was a real man. He was a Benedictine of the abbey of Morigny near ' +
      'Étampes, a priest, and a canon lawyer trained at Orléans; after 1308 he was his ' +
      'house\'s provost, which meant rents and tithes and the trust of men who counted ' +
      'money carefully. He was also, for years, a practitioner of forbidden arts — first a ' +
      'necromantic book he copied from a cleric, then the ars notoria, a Solomonic art that ' +
      'promised the whole of human learning to anyone who could keep its prayers and fasts. ' +
      'He came to believe the art had been contaminated by demons. He did not stop. He ' +
      'rewrote it, into a new work he called the Liber florum celestis doctrine, the Flowers ' +
      'of Heavenly Teaching, and he claimed the Virgin Mary herself had authorized the ' +
      'rewriting. In 1323 a chronicle records that a monk of Morigny\'s book was condemned ' +
      'and burned at Paris. It survived anyway, in copies, in houses he never saw, and was ' +
      'rediscovered by scholars in our own lifetime.',
    sources: [...FANGER, ...CHRONICLES], status: 'adapted', verify: true,
  },

  monologue: {
    text:
      'I wrote it all down. The visions and the errors and the things I am least able to ' +
      'defend — I set them in order and did not spare myself, because a man who records only ' +
      'his successes has written nothing anyone can follow. If you are reading this, then ' +
      'something of mine got out. Begin where I began.',
    sources: [], status: 'invented',
  },

  /** The scholarly hand, on what this thing is and what it is not. */
  pencil: {
    text:
      'This is a simulation of that life, built on Claire Fanger\'s scholarship, and it is ' +
      'answerable to it: every line of writing in it carries a source and a status — ' +
      'attested, adapted, or invented — and the apparatus will show you which whenever you ' +
      'ask. Nothing here puts words in the mouth of a living scholar, and nothing invents a ' +
      'quotation from John. Where the record is silent, the game says so and offers you the ' +
      'roads a man of his time and place actually walked.',
    cites: ['fanger-rewriting'],
    sources: FANGER, status: 'adapted', verify: true,
  },

  /**
   * How the thing is played. The audit requires this of every decision;
   * the opening requires it most, because nothing has taught the reader
   * anything yet.
   */
  interaction: {
    text:
      'You play by choosing. Each choice is a letter — press it, or click it — and every ' +
      'choice states its own price before you take it: what it costs, which way it leans, ' +
      'and what it risks. Four voices will speak to you. A modern narrator sets the scene ' +
      'and explains the world. John answers in his own words, in italic, in the idiom of his ' +
      'century. A pencil hand in the margin says where the history comes from and where we ' +
      'have invented. And a plain ledger underneath reports exactly what the machine did. ' +
      'You cannot win: 1323 arrives on every road. What varies is the life he has until ' +
      'then, what he writes, and whether any of it survives him.',
    sources: [], status: 'invented',
  },

  options: [
    {
      id: 'begin', key: 'B',
      label: 'Begin at the beginning: Chartres, and a boy of thirteen.',
      why: 'Five scenes of the life before the life — the vision, the schools, the first forbidden book, and the man who recommended something safer. What you choose there is the man you will play.',
    },
    {
      id: 'apparatus', key: 'N',
      label: 'First, the note on what this game depicts.',
      why: 'Sexual and spiritual crisis, demonic apparition, and a real person treated with the dignity owed to the dead. Read before beginning, if you would rather know.',
    },
  ],
};

/**
 * The opening on a life already begun. This is the branch that used to
 * read, in its entirety, "Take up the day again." A returning player
 * deserves to be told what he is returning to.
 */
export const RETURNING = {
  rubric: '¶ Of the life so far, and the day that waits.',

  narrator: {
    text:
      'The life is already under way. What follows is not a new game but the next remembered ' +
      'day of the same one — because that is how this simulation handles time: you do not ' +
      'play every day of a monk\'s life, you play the days the record kept. Between them the ' +
      'calendar moves weeks, or a season, and the ordinary hours go by unrecorded, exactly ' +
      'as they did for him. What you have already done persists: what he has learned, what ' +
      'he has practised, what is written in his book, who in the house trusts him, and what ' +
      'his sister has been asked to carry.',
    sources: [{ work: 'Fanger, Rewriting Magic', locus: 'the Book of Visions as retrospectively constructed and selective (frame; verify)' }],
    status: 'adapted', verify: true,
  },

  monologue: {
    text:
      'The bell will go whether I am ready. It always has. Whatever I settled last season is ' +
      'settled; whatever I left open is still open, and has been thinking about itself in my ' +
      'absence.',
    sources: [], status: 'invented',
  },

  pencil: {
    text:
      'Your chronicle is stored in this browser. Reading the Liber florum at any reckoning ' +
      'will show you what the book has become, and the day review will show you the day as ' +
      'it was written, in every voice.',
    cites: ['fanger-rewriting'],
    sources: [{ work: 'Fanger, Rewriting Magic', locus: 'the book as a record of its own making (frame; verify)' }],
    status: 'adapted', verify: true,
  },

  interaction: {
    text:
      'Press the letter of a choice, or click it. The sidebar carries his state — what the ' +
      'Rule and the Work have spent, what he can still reach, and who in the house is for ' +
      'him. The dateline above shows where in his life you are standing.',
    sources: [], status: 'invented',
  },

  options: [
    {
      id: 'walls', key: 'B',
      label: 'The next day within the walls.',
      why: 'The horarium, the desk, the rooms of the abbey, and the night. (Advances the calendar by weeks or a season.)',
    },
    {
      id: 'road', key: 'E',
      label: 'The next day on the road: the errand to Étampes.',
      why: 'The offices travel with you and are kept badly or well, in front of witnesses. Arrow keys walk; T talks.',
    },
  ],
};
