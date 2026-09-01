/**
 * MORIGNY — the three bodies of practice, and what they make of the book
 * (Bridget spec §4; NEWDIRECTIONS.md §3, §11; decided 2026-09-01).
 *
 * Faculties (engine/faculties.js) are CAPACITY — what John can reach
 * tonight. These are PRACTICE — what he has committed himself to. The
 * two are different questions and the game asks both.
 *
 *   SOLOMONIC   the ars notoria: rapid acquisition, induced vision.
 *               Works. That is the trap. Every node raises the rate at
 *               which Bridget's burden accrues and narrows discretio.
 *   EXCEPTIVE   the forbidden arts as KNOWLEDGE — John's own peculiar
 *               compromise ("may I know and understand necromancy, but
 *               not perform it"). Knowing is licit and costs suspicion,
 *               because the books are in his cell. PERFORMING is a
 *               separate act, and the game lets him (rule 12).
 *   MARIAN      the Liber florum proper: image-assisted meditation,
 *               dream purification, the sacramental economy. Opens only
 *               through the Renunciation, and converts what he spent on
 *               the Solomonic road into penitential material for
 *               resacralising the old figures.
 *
 * THE BOOK'S CHARACTER emerges from all of it (`bookCharacter`). It is
 * never shown as a meter — the player reads what the book has become
 * (NEWDIRECTIONS §11; decided 2026-09-01).
 */

export const TREES = {
  solomonic: {
    id: 'solomonic',
    label: 'the notory art',
    line: 'Prayers, figures, and the rapid acquisition of what other men spend years on.',
  },
  exceptive: {
    id: 'exceptive',
    label: 'the exceptive arts',
    line: 'To know necromancy, geomancy, geonegia — and, John insists, not to perform them.',
  },
  marian: {
    id: 'marian',
    label: 'the Work',
    line: 'The Virgin\'s own economy: meditation on figures, purified dreaming, grace that cannot be compelled.',
  },
};

export const TREE_IDS = Object.keys(TREES);

export function createPractice() {
  return {
    solomonic: 0,
    exceptive: 0,
    marian: 0,
    /** Solomonic investment, banked at the Renunciation for resacralising. */
    penitential: 0,
    /** Set once the Renunciation opens the Marian road. */
    renounced: false,
    /** Performances of a forbidden art — knowing is not doing (§3). */
    performances: 0,
  };
}

export function loadPractice(saved) {
  const p = createPractice();
  if (!saved) return p;
  for (const k of [...TREE_IDS, 'penitential', 'performances']) {
    if (Number.isFinite(saved[k])) p[k] = saved[k];
  }
  p.renounced = !!saved.renounced;
  return p;
}

/** The Marian road is shut until he has actually renounced. */
export function canInvest(practice, tree) {
  if (!TREE_IDS.includes(tree)) throw new Error(`unknown tree: ${tree}`);
  if (tree === 'marian') return practice.renounced;
  // After the Renunciation the Solomonic shortcuts are given up, not
  // merely deprecated: that is what renouncing meant.
  if (tree === 'solomonic') return !practice.renounced;
  return true;
}

/**
 * Invest one node. Returns the consequences the caller must apply
 * elsewhere (Bridget's burden rate, discretio, suspicion) so this
 * module stays pure and the couplings stay visible.
 */
export function invest(practice, tree) {
  if (!canInvest(practice, tree)) throw new Error(`the ${tree} road is not open`);
  practice[tree] += 1;
  switch (tree) {
    case 'solomonic':
      return { burdenRate: 1, discretio: -1 };
    case 'exceptive':
      return { suspicionPerDay: 1 };
    case 'marian':
      return { discretio: 1 };
    default:
      return {};
  }
}

/**
 * The Renunciation: the Solomonic road closes, what he spent on it
 * becomes penitential material, and the Work opens. Historically this
 * is the hinge — and Bridget reaches it before he does.
 */
export function renounce(practice) {
  if (practice.renounced) throw new Error('already renounced');
  practice.renounced = true;
  practice.penitential += practice.solomonic;
  return practice;
}

/** Spend penitential material to resacralise an old figure. */
export function resacralise(practice, n = 1) {
  if (practice.penitential < n) throw new Error('not enough penitential matter');
  practice.penitential -= n;
  return practice;
}

/** Performing a forbidden art — the doing, not the knowing (§3). */
export function perform(practice) {
  practice.performances += 1;
  return practice;
}

// ── What the book is becoming ────────────────────────────────────────

export const CHARACTERS = ['devotional', 'liber-florum', 'dirty'];

/**
 * The character of the Liber florum, derived from everything the player
 * actually did. Three outcomes, per Ted 2026-09-01:
 *
 *   'devotional'   a safe, conventional prayer book. Survives easily,
 *                  troubles nobody, and is not the Liber florum.
 *   'liber-florum' Fanger's book: audacious within obedience — Marian,
 *                  sacramental, authorized, and condemned anyway.
 *   'dirty'        the road out of the record: performed magic, prayers
 *                  that command rather than petition, errors scraped
 *                  rather than glossed.
 *
 * Returns { character, scores } — the scores are for the apparatus, not
 * for a meter on screen.
 */
export function bookCharacter(practice, book) {
  const prayers = book?.prayers ?? [];
  const conjuring = prayers.filter(p => p.mode === 'conjuring').length;
  const scraped = prayers.filter(p => p.corrupt && p.glosses.length === 0).length;

  // Performance weighs heaviest, and deliberately so: the knowing/doing
  // line is the one John himself drew ("may I know and understand
  // necromancy, but not perform it"), so crossing it must outweigh
  // merely owning the books. A man can study the exceptive arts his
  // whole life and still write the Liber florum. A man who works them
  // is writing something else.
  const dirty =
    practice.performances * 3 +
    conjuring * 2 +
    practice.exceptive +
    scraped;

  // The historical book is audacious: it takes the Solomonic project
  // seriously enough to rebuild it, under the Virgin's authorization.
  const florum =
    practice.marian * 2 +
    (practice.renounced ? 2 : 0) +
    Math.min(practice.penitential, 4) +
    prayers.filter(p => p.mode === 'adjuring').length;

  // Conventional devotion is what is left when a man never risked much:
  // few prayers, little practice, nothing to answer for.
  const devotional = Math.max(0, 6 - prayers.length - practice.solomonic - practice.exceptive);

  const scores = { dirty, 'liber-florum': florum, devotional };
  const character = CHARACTERS.reduce((best, c) => (scores[c] > scores[best] ? c : best), 'devotional');
  return { character, scores };
}
