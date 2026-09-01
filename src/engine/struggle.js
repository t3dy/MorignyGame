/**
 * MORIGNY — the Struggle: the night state machine and the confession
 * asymmetry (lapse recovers in a day; scrupulosity lingers).
 * Spec & tuning: morigny/SLICE_SPEC.md.
 */

import {
  pressureTier, addPressure, addDespair, addFatigue, addResolve, clamp,
} from './state.js';

export const NIGHT_VERBS = ['vigil', 'prayer', 'remove', 'endure'];

export function nightThreatens(john) {
  const tier = pressureTier(john.pressure);
  return tier === 'BESIEGED' || tier === 'CRISIS';
}

export function successChance(john, verb) {
  switch (verb) {
    case 'vigil': return clamp(0.75 - 0.03 * john.pressure, 0.05, 0.95);
    case 'prayer': return clamp(0.60 + 0.05 * john.resolve, 0.05, 0.95);
    case 'remove': return 0.65;
    case 'endure':
      return clamp(0.45 + 0.03 * john.resolve - 0.04 * john.pressure, 0.05, 0.95);
    default: throw new Error(`unknown verb: ${verb}`);
  }
}

/** Gradient outcome: mastery / endured / lapse. Mutates john. */
export function resolveNight(rng, john, verb) {
  const success = successChance(john, verb);
  if (verb === 'vigil') addFatigue(john, 2);
  if (verb === 'remove') addFatigue(john, 1);

  const roll = rng.next();
  let outcome;
  if (roll < success * 0.5) {
    outcome = 'mastery';
    addPressure(john, -4);
    addResolve(john, 1);
  } else if (roll < success) {
    outcome = 'endured';
    addPressure(john, -2);
  } else {
    outcome = 'lapse';
    john.purity.polluted = true;
    john.purity.confessed = false;
    john.pressure = 2; // spent, not besieged — the quiet after is part of it
    addDespair(john, 1);
  }
  return { verb, outcome, roll, success };
}

/**
 * Chapter confession. modes:
 *  'confess'  — with matter: clears pollution, eases despair
 *  'delay'    — with matter: the Work stays shut, despair grows
 *  'scruple'  — without matter: the spiral; despair grows anyway
 */
export function confess(john, mode) {
  switch (mode) {
    case 'confess':
      if (!john.purity.polluted) throw new Error('nothing to confess');
      john.purity.polluted = false;
      john.purity.confessed = true;
      addDespair(john, -1);
      return 'confess';
    case 'delay':
      if (!john.purity.polluted) throw new Error('nothing to delay');
      addDespair(john, 1);
      return 'delay';
    case 'scruple':
      if (john.purity.polluted) throw new Error('this is matter, not scruple');
      addDespair(john, 1);
      return 'scruple';
    default: throw new Error(`unknown mode: ${mode}`);
  }
}
