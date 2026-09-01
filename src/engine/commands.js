/**
 * MORIGNY — the command alphabet (Ultima V homage).
 * 26 single-key verbs. Most are refused most of the time: the refusal line,
 * in period voice, is worldbuilding — a Rule is exactly a machine for
 * telling you "not now." Design rationale: morigny/COMMANDS.md.
 *
 * Every command MUST have: verb, gloss (shown in the command bar),
 * refusal (the default "Not here!" in the house voice). Scene handlers
 * make letters live; anything not live falls back to its refusal.
 */

export const COMMANDS = {
  A: {
    verb: 'Attack',
    gloss: 'raise your hand',
    refusal: 'A monk’s hands are for the psalter. (There may come a day. It is not this one.)',
  },
  B: {
    verb: 'Bell',
    gloss: 'let the hour pass',
    refusal: 'The bell keeps its own counsel. Wait for it.',
  },
  C: {
    verb: 'Confess',
    gloss: 'say it aloud',
    refusal: 'There is no confessor at hand, and the stones do not absolve.',
  },
  D: {
    verb: 'Discern',
    gloss: 'judge the vision',
    refusal: 'Nothing here asks to be judged. Be glad of it.',
  },
  E: {
    verb: 'Examine',
    gloss: 'look closer',
    refusal: 'Nothing here rewards a closer look.',
  },
  F: {
    verb: 'Fast',
    gloss: 'keep the fast',
    refusal: 'No table is set. The fast keeps itself just now.',
  },
  G: {
    verb: 'Gaze',
    gloss: 'upon the figure',
    refusal: 'The figure is not before you. (It is never far from you.)',
  },
  H: {
    verb: 'Hold fast',
    gloss: 'refuse the margin',
    refusal: 'There is nothing at the gate just now.',
  },
  I: {
    verb: 'Illuminate',
    gloss: 'steal the hour for the Work',
    refusal: 'No desk, no leaf, no stolen hour.',
  },
  J: {
    verb: 'Journal',
    gloss: 'write the visions down',
    refusal: 'The ink is dry and the hour is not yours.',
  },
  K: {
    verb: 'Kneel',
    gloss: 'a moment’s prayer',
    refusal: 'You have knelt. More kneeling now would be display.',
  },
  L: {
    verb: 'Look',
    gloss: 'take in the scene',
    refusal: 'Dark, and stone, and the breathing of brothers.',
  },
  M: {
    verb: 'Mortify',
    gloss: 'the stone’s argument',
    refusal: 'Not every hour needs the stone’s argument. Save it for the siege.',
  },
  N: {
    verb: 'Notae',
    gloss: 'recall the old art',
    refusal: 'The old wheels turn behind your eyes uninvited; do not also invite them.',
  },
  O: {
    verb: 'Obey',
    gloss: 'the Rule’s next thing',
    refusal: 'The Rule asks nothing of you this instant. That is the hard part.',
  },
  P: {
    verb: 'Pray the Work',
    gloss: 'the procedure’s prayer',
    refusal: 'The prayer has its appointed hour. To force it is the old art’s error.',
  },
  Q: {
    verb: 'Quit',
    gloss: 'close the book',
    refusal: 'The book does not close itself.',
  },
  R: {
    verb: 'Rest',
    gloss: 'lie down',
    refusal: 'Sleep is assigned, like everything here. Its hour will come.',
  },
  S: {
    verb: 'Scribe',
    gloss: 'the assigned copying',
    refusal: 'The scriptorium is not open to you now.',
  },
  T: {
    verb: 'Talk',
    gloss: 'break silence',
    refusal: 'It is the silence. Words would cost more than they buy.',
  },
  U: {
    verb: 'Use',
    gloss: 'put a thing to work',
    refusal: 'Your hands find nothing that answers to use.',
  },
  V: {
    verb: 'Vigil',
    gloss: 'outlast it kneeling',
    refusal: 'Vigil is a night’s work.',
  },
  W: {
    verb: 'Withstand',
    gloss: 'only hold',
    refusal: 'There is nothing to withstand. Say rather: not yet.',
  },
  X: {
    verb: 'Cross',
    gloss: 'make the sign',
    refusal: 'The sign is made. To make it again and again is the scrupulous wheel.',
  },
  Y: {
    verb: 'Yield',
    gloss: 'consent by inches',
    refusal: 'Yield to what? The day is plain and the book is shut. (The night may ask again.)',
  },
  Z: {
    verb: 'Zelus animae',
    gloss: 'the state of the soul',
    refusal: 'The soul declines to be examined twice in one breath.',
  },
};

export const LETTERS = Object.keys(COMMANDS);

/** Night-siege verbs → struggle engine verbs. Y (yield) is handled apart. */
export const NIGHT_KEYS = { V: 'vigil', K: 'prayer', M: 'remove', W: 'endure' };
