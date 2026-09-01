/**
 * MORIGNY — the recitation loop (custodia oculorum as a mechanic).
 * A prayer is N verses; distractions interrupt and must be resolved.
 * Spec & tuning: morigny/SLICE_SPEC.md.
 */

import { isScrupulous, addPressure, addDespair } from './state.js';

const SPAWN_BASE = 0.15;
const SPAWN_CAP = 0.6;

export function distractionChance(john) {
  return Math.min(SPAWN_CAP, SPAWN_BASE + 0.03 * john.fatigue + 0.04 * john.pressure);
}

/** Pressure tilts the pool toward the flesh; pencil notes stay rare but present. */
export function distractionWeight(record, john) {
  const base = { mundane: 3, memory: 2, appetite: 2, pencil: 1 }[record.kind] ?? 1;
  if (record.kind === 'appetite') return base * (1 + john.pressure * 0.3);
  return base;
}

function weightedPick(rng, pool, john) {
  const weights = pool.map(r => distractionWeight(r, john));
  const total = weights.reduce((a, b) => a + b, 0);
  let roll = rng.next() * total;
  for (let i = 0; i < pool.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return pool[i];
  }
  return pool[pool.length - 1];
}

/**
 * @param rng   SeededRandom stream dedicated to this recitation
 * @param john  mutable state
 * @param opts  { verses: string[], pool: distraction records }
 */
export function createRecitation(rng, john, { verses, pool }) {
  const r = {
    verses,
    verse: 0,
    lapses: 0,
    pending: null,
    done: false,

    /** Attempt the next verse; may instead surface a distraction. */
    advance() {
      if (r.done || r.pending) return r;
      if (rng.next() < distractionChance(john)) {
        r.pending = weightedPick(rng, pool, john);
      } else {
        r.verse++;
        if (r.verse >= r.verses.length) r.done = true;
      }
      return r;
    },

    holdFastCost() {
      return isScrupulous(john) ? 2 : 1;
    },

    canHoldFast() {
      return !!r.pending && john.resolve >= r.holdFastCost();
    },

    /** Spend resolve; the verse proceeds; the margin is refused. */
    holdFast() {
      if (!r.canHoldFast()) throw new Error('cannot hold fast');
      john.resolve -= r.holdFastCost();
      r.pending = null;
      r.verse++;
      if (r.verse >= r.verses.length) r.done = true;
      return r;
    },

    /** Read the distraction: the verse is lost, its effects land. */
    attend() {
      if (!r.pending) throw new Error('nothing pending');
      const record = r.pending;
      r.pending = null;
      r.lapses++;
      addPressure(john, record.effects.pressure);
      addDespair(john, record.effects.despair);
      return record;
    },

    quality() {
      const total = r.verses.length + r.lapses;
      return total === 0 ? 1 : r.verses.length / total;
    },

    grade() {
      const q = r.quality();
      if (q >= 0.9) return 'recollected';
      if (q >= 0.6) return 'distracted';
      return 'scattered';
    },
  };
  return r;
}
