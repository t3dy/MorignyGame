/**
 * MORIGNY — faculties (v4 step 4, docs/V4_LOOP_REDESIGN.md §5).
 * Four trained capacities, advanced by study hours — the daylight
 * block's scarcest currency — and TESTED by encounters, never spent.
 * Persisted across days in the chronicle (the licentia/custody
 * pattern), because a faculty is a life's accretion, not a day's mood.
 *
 * Live effects now: craft steadies the copying hand (scriptorium.js
 * reads it). learning / discretio / worldliness are tested by the
 * world-layer encounters (v4 §6) — staged, not dead: the study loop,
 * persistence, and display all ship here so the investment is real
 * the day the first encounter reads it.
 */

export const FACULTIES = {
  learning: {
    label: 'learning',
    line: 'Latin, theology, the schools — what the examiners will probe.',
  },
  discretio: {
    label: 'discretio',
    line: 'The trained eye for spirits — the discernment literature, read slowly.',
  },
  craft: {
    label: 'craft',
    line: 'The scribe\'s hand — letterforms, the knife, the rule. Steadies the copying hand.',
  },
  worldliness: {
    label: 'worldliness',
    line: 'The road, the market, the court — how the world outside reads a monk.',
  },
};

export const FACULTY_MAX = 5;

export function createFaculties() {
  const f = { progress: {} };
  for (const id of Object.keys(FACULTIES)) {
    f[id] = 0;
    f.progress[id] = 0;
  }
  return f;
}

/** An old chronicle (or none) yields fresh faculties; a saved block
 *  reads through, missing ids defaulted — additive, like custody. */
export function loadFaculties(saved) {
  const fresh = createFaculties();
  if (!saved) return fresh;
  for (const id of Object.keys(FACULTIES)) {
    if (typeof saved[id] === 'number') fresh[id] = saved[id];
    if (typeof saved.progress?.[id] === 'number') fresh.progress[id] = saved.progress[id];
  }
  return fresh;
}

/**
 * ── DISPOSITION-GATED CAPACITY (NEWDIRECTIONS.md §2) ─────────────────
 *
 * Hugh of St Victor's model is a ladder: discipline makes a properly
 * formed student, who then learns better. John radicalises it into
 * something nearly ontological — the right practices change a person's
 * CAPACITY to know, and learning is an effect of grace whose efficacy
 * depends on the disposition of the recipient.
 *
 * So a faculty level is what he has trained, and `reach()` is how much
 * of it he can actually get at tonight. A learned man who is unclean,
 * unconfessed, and has broken his observance cannot reach his own
 * learning. Fanger's formulation: "devotion was engaged with the aim of
 * learning, and learning was engaged with the aim of devotion."
 *
 * Digest-sourced; carries verify (docs/RESEARCH_PIPELINE.md §1).
 */

/** What disposes a knower, and by how much. Sums to the reach modifier. */
export function dispositionOf(john, { book = 0 } = {}) {
  let d = 0;
  if (!john.purity.polluted) d += 1;      // the observance intact
  if (john.purity.confessed) d += 1;      // confession current
  if (john.procedure.prayed) d += 1;      // the Work's prayer said today
  if (john.despair >= 3) d -= 1;          // the scruple-wheel narrows him
  if (john.fatigue >= 7) d -= 1;          // a spent body is a poor instrument
  d += Math.max(-2, Math.min(2, book));   // what his own book has become
  return d;
}

/**
 * How much of a trained faculty he can actually reach right now.
 * Never below zero, never above what he has trained: disposition
 * cannot invent learning he does not have, and cannot take away more
 * than he has.
 */
export function reach(john, id, opts = {}) {
  const trained = john.faculties?.[id] ?? 0;
  if (!trained) return 0;
  const d = dispositionOf(john, opts);
  // A neutral disposition (2) reaches everything trained; each point
  // below narrows him, each above cannot exceed the training.
  return Math.max(0, Math.min(trained, trained + (d - 2)));
}

/**
 * One study hour into one faculty. Each level costs level+1 hours
 * (1, 2, 3, 4, 5): the deep end of any art is the slow end.
 * Returns { leveled, level, toNext }.
 */
export function study(faculties, id) {
  if (!(id in FACULTIES)) throw new Error(`unknown faculty: ${id}`);
  if (faculties[id] >= FACULTY_MAX) {
    return { leveled: false, level: faculties[id], toNext: 0 };
  }
  faculties.progress[id] += 1;
  const cost = faculties[id] + 1;
  if (faculties.progress[id] >= cost) {
    faculties.progress[id] = 0;
    faculties[id] += 1;
    return { leveled: true, level: faculties[id], toNext: faculties[id] >= FACULTY_MAX ? 0 : faculties[id] + 1 };
  }
  return { leveled: false, level: faculties[id], toNext: cost - faculties.progress[id] };
}
