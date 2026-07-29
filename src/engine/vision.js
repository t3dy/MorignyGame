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
 * which is always ambiguous so discernment never reduces to pattern-matching.
 */
export function createVision(rng) {
  const authentic = rng.next() < 0.6;
  const ambiguousIdx = Math.floor(rng.next() * TELL_CATEGORIES.length);
  const tells = TELL_CATEGORIES.map((cat, i) => ({
    category: cat,
    text: i === ambiguousIdx
      ? VISION_TELLS[cat].ambiguous
      : VISION_TELLS[cat][authentic ? 'true_' : 'false_'],
    ambiguous: i === ambiguousIdx,
  }));
  return { authentic, tells };
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
