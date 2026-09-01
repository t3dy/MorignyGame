/**
 * MORIGNY — the sought dream and discretio spirituum.
 * Asymmetric error costs are the point: rejecting truth wounds hope;
 * accepting counterfeit corrupts silently. Spec: morigny/SLICE_SPEC.md.
 */

import { VISION_TELLS } from '../content/content.js';
import { addPressure, addDespair, addResolve } from './state.js';

export const TELL_CATEGORIES = ['color', 'speech', 'affect'];

/** Procedure prayer said well enough, body clean, work not already rotten. */
export function dreamEligible(john) {
  return (
    john.procedure.prayed &&
    (john.procedure.quality === 'recollected' || john.procedure.quality === 'distracted') &&
    !john.purity.polluted &&
    !john.procedure.corrupt
  );
}

/**
 * Build the vision: authenticity seeded (60% true); three tells, one of
 * which is always ambiguous so discernment never reduces to
 * pattern-matching.
 *
 * BAD INFORMATION (docs/LOOP_SYNTHESIS.md §4). The best single line in
 * the research: *"A sinful magician doesn't merely lose morality
 * points. He may start receiving bad information."* So disposition —
 * the observance kept, confession current, the Work's prayer said, and
 * what his own book has become — does not merely gate whether a vision
 * comes. It governs how LEGIBLE the vision is when it does.
 *
 * A well-disposed operator reads a clean vision: one ambiguous tell,
 * two that mean what they say. As disposition falls, more tells go
 * ambiguous, and at the bottom a tell can actively lie — showing the
 * mark of a true vision on a false one, or the reverse. Nothing
 * announces this. He simply starts being wrong more often, which is
 * exactly the trap the sources describe, and it is recoverable by
 * exactly the means John used: confession and penance.
 *
 * @param opts.disposition  2 is ordinary; below narrows, above steadies
 */
export function createVision(rng, { disposition = 2 } = {}) {
  const authentic = rng.next() < 0.6;
  const ambiguousIdx = Math.floor(rng.next() * TELL_CATEGORIES.length);

  // How far below an ordinary disposition he is, capped.
  const deficit = Math.max(0, Math.min(4, 2 - disposition));
  const extraAmbiguity = Math.min(0.6, 0.15 * deficit);
  const lieChance = deficit >= 3 ? 0.25 : 0;

  const tells = TELL_CATEGORIES.map((cat, i) => {
    if (i === ambiguousIdx) {
      return { category: cat, text: VISION_TELLS[cat].ambiguous, ambiguous: true, lying: false };
    }
    // A narrowed knower reads more of the vision as merely ambiguous…
    if (rng.next() < extraAmbiguity) {
      return { category: cat, text: VISION_TELLS[cat].ambiguous, ambiguous: true, lying: false };
    }
    // …and a badly narrowed one is sometimes shown the wrong mark.
    const lying = rng.next() < lieChance;
    const shows = lying ? !authentic : authentic;
    return {
      category: cat,
      text: VISION_TELLS[cat][shows ? 'true_' : 'false_'],
      ambiguous: false,
      lying,
    };
  });
  return { authentic, tells, disposition };
}

/**
 * Judge the vision. Mutates john; returns the outcome key
 * (licentia | delayed | corrupted | mastery) matching DISCERNMENT_OUTCOMES.
 */
export function judge(john, vision, accept) {
  if (accept && vision.authentic) {
    john.procedure.licentia = true;
    return 'licentia';
  }
  if (!accept && vision.authentic) {
    addDespair(john, 1);
    return 'delayed';
  }
  if (accept && !vision.authentic) {
    john.procedure.corrupt = true; // silent until the reckoning
    return 'corrupted';
  }
  addResolve(john, 1);
  addPressure(john, -2);
  return 'mastery';
}

/** The reckoning reveals what accepting a counterfeit concealed. */
export function reckonCorruption(john) {
  if (!john.procedure.corrupt) return false;
  addPressure(john, 2); // the demon feeds on the work it rode in
  return true;
}
