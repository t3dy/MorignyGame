/**
 * MORIGNY — the Liber florum: the book John is writing, as a live
 * artifact of play (NEWDIRECTIONS.md §4, §8).
 *
 * The design premise, from Fanger: the Liber florum "doesn't merely
 * contain information; it tries to reproduce the process by which John
 * himself came to know." It is simultaneously textbook, prayer book,
 * autobiography, and record of revelations — and its writing IS the
 * practice, not a record kept alongside the practice.
 *
 * So the recursion is the mechanic:
 *
 *   vision → interpretation → A PRAYER IS WRITTEN → the prayer is
 *   performed → it disposes him for the next vision → which may reveal
 *   that an earlier prayer was defective → which is GLOSSED, not
 *   deleted → and the book goes on
 *
 * Two rules carried straight from the sources:
 *
 * 1. **Errors are preserved, never erased.** The New Compilation keeps
 *    John's mistaken instructions visible with corrective glosses so
 *    later operators will not follow them; the flowers and leaves
 *    around those passages are, in his own account, the sign of the
 *    chastisement of his error. `glossPrayer` therefore never removes
 *    anything. A corrupt prayer stays in the book, marked.
 *
 * 2. **The Old and New Compilations are childhood and maturity.** In
 *    the Old, John invents figures freely (milk); after the Barking
 *    Dogs' attack he is girded and led where he does not choose to go
 *    (meat). Composition is cheap and free before the attack, and
 *    constrained after it.
 *
 * Digest-sourced (docs/research/*, CLAUDE.md rule 11): mechanics here
 * are ours; the shape they imitate carries `verify` until checked
 * against the Fanger–Watson edition.
 */

export const COMPILATIONS = ['old', 'new'];

/** How a prayer was obtained — the two modes, rule 12. */
export const PRAYER_MODES = ['adjuring', 'conjuring'];

export function createLiberFlorum() {
  return {
    prayers: [],
    compilation: 'old',
    /** Set when the Barking Dogs attack: the hinge of the two acts. */
    attacked: false,
  };
}

/** Additive load, like every other chronicle block. */
export function loadLiberFlorum(saved) {
  const fresh = createLiberFlorum();
  if (!saved) return fresh;
  if (Array.isArray(saved.prayers)) fresh.prayers = saved.prayers.map(p => ({ ...p }));
  if (COMPILATIONS.includes(saved.compilation)) fresh.compilation = saved.compilation;
  fresh.attacked = !!saved.attacked;
  return fresh;
}

/**
 * Write a prayer out of a vision. `vision` is the judged vision;
 * `judgement` is the discernment outcome key.
 *
 * A prayer composed from a vision John accepted but which was
 * counterfeit is `corrupt` — and it does not announce itself. That is
 * the silent-failure pattern the game already uses at the desk, moved
 * to the book's own spine: the operator's own writing carries the
 * error forward into every later performance until something reveals
 * it.
 */
export function composePrayer(book, { vision, judgement, mode = 'adjuring', incipit, day }) {
  if (!PRAYER_MODES.includes(mode)) throw new Error(`unknown mode: ${mode}`);
  if (book.compilation === 'new' && book.attacked && mode === 'conjuring') {
    // Maturity: after the attack he no longer invents freely.
    throw new Error('the New Compilation is received, not devised');
  }
  const prayer = {
    id: `prayer-${book.prayers.length + 1}`,
    ordinal: book.prayers.length + 1,
    incipit,
    mode,
    day: day ?? null,
    compilation: book.compilation,
    fromJudgement: judgement,
    /** Silent, exactly like a failed figure: accepting a counterfeit
     *  writes the counterfeit into the book. */
    corrupt: judgement === 'corrupted',
    glosses: [],
  };
  book.prayers.push(prayer);
  return prayer;
}

/**
 * Gloss a prayer: mark the error beside it, and leave the error.
 * Returns the gloss. Glossing a prayer neutralises its corruption for
 * future practice — the operator now knows — without pretending the
 * mistake never happened.
 */
export function glossPrayer(book, prayerId, { reason, day }) {
  const prayer = book.prayers.find(p => p.id === prayerId);
  if (!prayer) throw new Error(`no such prayer: ${prayerId}`);
  const gloss = { reason, day: day ?? null };
  prayer.glosses.push(gloss);
  return gloss;
}

/** Prayers whose corruption has not yet been marked. */
export function unglossedCorruptions(book) {
  return book.prayers.filter(p => p.corrupt && !p.glosses.length);
}

/**
 * How well the book disposes its operator for the next vision.
 * Sound prayers help; unglossed corrupt ones hurt more than a sound
 * one helps, because a defective observance is worse than none —
 * that is the whole logic of silent invalidity (SLICE_SPEC §Procedure).
 * Glossed corruptions are neutral: the error is known and marked.
 */
export function disposition(book) {
  let d = 0;
  for (const p of book.prayers) {
    if (!p.corrupt) d += 1;
    else if (!p.glosses.length) d -= 2;
  }
  return d;
}

/**
 * The Barking Dogs attack: the hinge between the compilations.
 * Historically John's critics attacked the figures for their crosses,
 * circles, and planetary cycles. His response was not to concede the
 * work was demonic but to conclude he had erred by ACTING BEFORE THE
 * PROMISED INSTRUCTION CAME — a failure of obedience and discernment.
 */
export function beginNewCompilation(book) {
  book.attacked = true;
  book.compilation = 'new';
  return book;
}

/** Whether the run has enough book to be worth attacking yet. */
export function attackDue(book, { minPrayers = 3 } = {}) {
  return !book.attacked && book.prayers.length >= minPrayers;
}
