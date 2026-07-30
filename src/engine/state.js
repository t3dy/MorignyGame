/**
 * MORIGNY — John's state. One body, read by both loops (the Rule and the
 * Work). Ranges and meanings: morigny/SLICE_SPEC.md.
 */

export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

export function createJohn() {
  return {
    fatigue: 2,
    resolve: 3,
    pressure: 3,
    despair: 0,
    suspicion: 0,
    purity: { polluted: false, confessed: true },
    procedure: { prayed: false, quality: null, licentia: false, corrupt: false },
    /** Radical Axis (WORLD_DESIGN.md §4): 0 = the historical center. */
    disposition: 0,
    /** The scrip: the Old Compilation is the one exemplar nobody had to
     *  sell him (docs/DECISIONS_AND_FORKS.md D-11). */
    items: { draught: 0, quire: 0, exemplars: ['old-compilation'] },
    log: [],
  };
}

/** Scrupulosity: despair taxes attention — hold-fast costs double. */
export function isScrupulous(john) {
  return john.despair >= 3;
}

export function pressureTier(pressure) {
  if (pressure <= 2) return 'QUIET';
  if (pressure <= 5) return 'STIRRED';
  if (pressure <= 8) return 'BESIEGED';
  return 'CRISIS';
}

export function addPressure(john, d) { john.pressure = clamp(john.pressure + d, 0, 10); }
export function addDespair(john, d) { john.despair = clamp(john.despair + d, 0, 5); }
export function addFatigue(john, d) { john.fatigue = clamp(john.fatigue + d, 0, 10); }
export function addResolve(john, d) { john.resolve = clamp(john.resolve + d, 0, 5); }
export function addSuspicion(john, d) { john.suspicion = clamp(john.suspicion + d, 0, 10); }
