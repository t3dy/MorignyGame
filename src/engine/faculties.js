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
