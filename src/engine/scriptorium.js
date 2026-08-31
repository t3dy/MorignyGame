/**
 * MORIGNY — the scriptorium engine (SCRIPTORIUM.md §2–4). Pure and
 * seeded-deterministic: a quire is N units, copying reuses the recitation
 * loop's grammar (units, distractions, a grade), and errors have the
 * period's own names. The verba ignota carry no sense and so admit no
 * error-correction — the single best mechanic the research handed us.
 *
 * RNG draw order per unit (tests script this exactly):
 *   advance:   1. distraction roll (+1 pick draw if it spawns)
 *   complete:  2. catch roll — only for an inherited, catchable fault
 *              3. error roll
 *              4. class roll — only if a fresh error fired on a text unit
 *              5. light — day: 1 notice draw iff the leaf is hot/unassigned;
 *                 candle: 2 draws (fire, seen)
 */

import { isScrupulous, addPressure, addDespair, addFatigue, addSuspicion } from './state.js';
import { distractionChance } from './recitation.js';

export const ERROR_CLASSES = ['eyeskip', 'dittography', 'verba_ignota'];
export const DAMAGE_CLASSES = ['blackened', 'corrosion'];
export const CONCEALMENTS = ['loose', 'bound', 'shelved', 'given'];

/** The unknown words double the danger, and sense cannot rescue them. */
export const VERBA_ERROR_MULT = 2;

export const HANDS = {
  textualis: { label: 'Textualis, careful', speed: 1, errBase: 0.05, fingerCost: 1, construes: true, catchInherited: 0.8 },
  cursive: { label: 'Cursive, quick', speed: 2, errBase: 0.12, fingerCost: 0.5, construes: true, catchInherited: 0.4 },
  trusting: { label: 'Trusting the exemplar', speed: 3, errBase: 0.08, fingerCost: 0.25, construes: false, catchInherited: 0 },
};

const EYESKIP_SHARE = 0.4;      // fresh text errors: eyeskip vs dittography
const NOTICE_CHANCE = 0.1;      // per public unit on an unassigned/hot leaf
const FIRE_CHANCE = 0.02;       // per candle unit — the risk was existential
const SEEN_CHANCE = 0.05;       // per candle unit; the worst suspicion in the game
const SEEN_SUSPICION = 3;
const FIGURE_BASE = 0.7;        // steadiness erodes with fatigue and despair
/** Exported so the UI can quote a live percentage (CLAUDE.md rule 10)
 *  instead of hand-authoring one — same pattern as struggle.js's
 *  successChance(), which nightStakes() in main.js already reads live. */
export const CONCEALMENT_FOUND_CHANCE = { loose: 0.5, bound: 0.15, shelved: 1, given: 0 };

/** Exported for the faculties tests: craft (v4 §5) steadies the hand —
 *  each level shaves a tenth off the hand's base error rate. */
export function errorChance(hand, fingerFatigue, john) {
  const craft = john.faculties?.craft ?? 0;
  const steadied = hand.errBase * Math.max(0.5, 1 - 0.1 * craft);
  return Math.min(0.9, steadied * (1 + 0.05 * fingerFatigue + 0.03 * john.fatigue));
}

/** Lay out the quire: which units are verba ignota, where the exemplar's
 *  own faults sit. Linear probing keeps placement collision-free without
 *  extra draws. */
function layoutQuire(rng, exemplar) {
  const n = exemplar.sim.units;
  const layout = Array.from({ length: n }, () => ({ kind: 'text', inherited: null }));
  const verbaIdxs = [];
  const verbaCount = Math.round((exemplar.sim.verbaShare ?? 0) * n);
  for (let v = 0; v < verbaCount; v++) {
    let idx = Math.floor(rng.next() * n) % n;
    while (layout[idx].kind === 'verba') idx = (idx + 1) % n;
    layout[idx].kind = 'verba';
    verbaIdxs.push(idx);
  }
  for (const cls of exemplar.sim.faults ?? []) {
    let idx;
    if (cls === 'verba_ignota' && verbaIdxs.length) {
      idx = verbaIdxs[Math.floor(rng.next() * verbaIdxs.length) % verbaIdxs.length];
      while (layout[idx].inherited) idx = (idx + 1) % n;
    } else {
      idx = Math.floor(rng.next() * n) % n;
      while (layout[idx].inherited) idx = (idx + 1) % n;
    }
    layout[idx].inherited = cls;
  }
  return layout;
}

/**
 * @param rng   SeededRandom stream dedicated to this copy session
 * @param john  mutable state
 * @param opts  { exemplar, light: 'day'|'candle', pool: distraction records }
 */
export function createCopySession(rng, john, { exemplar, light = 'day', pool = [] }) {
  const s = {
    exemplar,
    light,
    layout: layoutQuire(rng, exemplar),
    unitIndex: 0,
    lapses: 0,
    pending: null,
    currentHand: null,
    fingerFatigue: 0,
    events: [],
    done: false,
    copy: {
      exemplarId: exemplar.id,
      completeness: exemplar.completeness,
      faults: [],
      pigments: [],
      reactive: [],
      figures: { drawn: 0, needed: exemplar.sim.figures ?? 0 },
      concealment: 'loose',
      given: false,
      collated: false,
      corrupt: false,
      gilded: false,
      conspicuous: false,
      ageDays: 0,
      corrodeAt: null,
      complete: false,
      quality: null,
      grade: null,
    },

    /** Attempt the next unit in the given hand; the margin may interrupt. */
    advance(handId) {
      if (s.done || s.pending) return s;
      s.currentHand = handId;
      // The distraction roll is always taken, pool or no pool, so the
      // stream stays regular and a seed replays identically.
      const stirred = rng.next() < distractionChance(john);
      if (stirred && pool.length) {
        s.pending = pool[Math.floor(rng.next() * pool.length) % pool.length];
      } else {
        completeUnit(handId, false);
      }
      return s;
    },

    holdFastCost() {
      return isScrupulous(john) ? 2 : 1;
    },

    canHoldFast() {
      return !!s.pending && john.resolve >= s.holdFastCost();
    },

    /** Spend resolve; the unit proceeds; the margin is refused. */
    holdFast() {
      if (!s.canHoldFast()) throw new Error('cannot hold fast');
      john.resolve -= s.holdFastCost();
      s.pending = null;
      completeUnit(s.currentHand, false);
      return s;
    },

    /** Read the distraction: its effects land, and the hand it leaves
     *  behind is unsteady — the unit's error chance doubles. */
    attend() {
      if (!s.pending) throw new Error('nothing pending');
      const record = s.pending;
      s.pending = null;
      s.lapses++;
      addPressure(john, record.effects.pressure);
      addDespair(john, record.effects.despair);
      completeUnit(s.currentHand, true);
      return record;
    },

    quality() {
      const total = s.layout.length + s.lapses;
      return total === 0 ? 1 : s.layout.length / total;
    },

    grade() {
      const q = s.quality();
      if (q >= 0.9) return 'recollected';
      if (q >= 0.6) return 'distracted';
      return 'scattered';
    },
  };

  function completeUnit(handId, distracted) {
    const hand = HANDS[handId];
    const unit = s.layout[s.unitIndex];
    s.fingerFatigue += hand.fingerCost;

    // Inherited faults descend unless a construing hand catches them.
    // Verba ignota can never be caught: sense cannot rescue what has none.
    if (unit.inherited) {
      const catchable = hand.construes && unit.inherited !== 'verba_ignota';
      if (catchable && rng.next() < hand.catchInherited) {
        s.events.push({ type: 'caught', class: unit.inherited, unit: s.unitIndex });
      } else {
        s.copy.faults.push({
          class: unit.inherited, unit: s.unitIndex,
          visible: unit.inherited === 'dittography',
          inherited: true, corrected: false,
        });
      }
    }

    // Fresh errors, by hand, fatigue, and what the unit is made of.
    let chance = errorChance(hand, s.fingerFatigue, john);
    if (unit.kind === 'verba') chance = Math.min(0.9, chance * VERBA_ERROR_MULT);
    if (distracted) chance = Math.min(0.9, chance * 2);
    if (rng.next() < chance) {
      const cls = unit.kind === 'verba'
        ? 'verba_ignota'
        : (rng.next() < EYESKIP_SHARE ? 'eyeskip' : 'dittography');
      s.copy.faults.push({
        class: cls, unit: s.unitIndex,
        visible: cls === 'dittography',
        inherited: false, corrected: false,
      });
    }

    // Light: plentiful and public, or scarce and worse.
    if (s.light === 'day') {
      if ((exemplar.hot || !exemplar.sim.assigned) && rng.next() < NOTICE_CHANCE) {
        addSuspicion(john, 1);
        s.events.push({ type: 'noticed', unit: s.unitIndex });
      }
    } else {
      if (rng.next() < FIRE_CHANCE) s.events.push({ type: 'fire', unit: s.unitIndex });
      if (rng.next() < SEEN_CHANCE) {
        addSuspicion(john, SEEN_SUSPICION);
        s.events.push({ type: 'seen', unit: s.unitIndex });
      }
    }

    s.unitIndex++;
    if (s.unitIndex >= s.layout.length) {
      s.done = true;
      s.copy.complete = true;
      s.copy.quality = s.quality();
      s.copy.grade = s.grade();
    }
  }

  return s;
}

// ── emendatio ────────────────────────────────────────────────

/**
 * Collation requires *having* another witness — the first copy of
 * anything is unverifiable. Reveals the hidden faults; what can then be
 * mended is a separate question.
 */
export function collate(copy, other) {
  if (!other) throw new Error('collation requires another witness');
  copy.collated = true;
  return copy.faults.filter(f => !f.visible && !f.corrected);
}

export function correctableMethods(copy, fault) {
  if (fault.corrected || DAMAGE_CLASSES.includes(fault.class)) return [];
  if (fault.class === 'dittography' && fault.visible) return ['expunctuation'];
  if (fault.class === 'eyeskip') return copy.collated ? ['marginal-insertion'] : [];
  return []; // verba_ignota: never — correction is gated on understanding
}

export function correctFault(copy, fault, method) {
  if (!correctableMethods(copy, fault).includes(method)) {
    throw new Error(`cannot correct ${fault.class} by ${method}`);
  }
  fault.corrected = true;
  fault.method = method;
  return fault;
}

export function activeFaults(copy) {
  return copy.faults.filter(f => !f.corrected);
}

// ── figures ──────────────────────────────────────────────────

/**
 * The figure check (§3.4): geometry, proportion, the inscribed words in
 * their compartments. Failure is SILENT — the copy looks finished, the
 * result does not confess, and the rot surfaces at the reckoning.
 */
export function drawFigure(rng, john, copy) {
  const chance = Math.max(0.2, FIGURE_BASE - 0.04 * john.fatigue - 0.04 * john.despair);
  copy.figures.drawn++;
  if (rng.next() >= chance) {
    copy.corrupt = true;
    john.procedure.corrupt = true;
  }
  return { drawn: true }; // success and failure wear the same face
}

// ── materials ────────────────────────────────────────────────

/**
 * Grind and lay a pigment (or gold) on the copy. The hazards are the
 * period's own chemistry: orpiment taxes the grinder and blackens on
 * lead- and copper-made colors; verdigris starts its slow clock; gold is
 * refused without the licence, whose color it is.
 */
export function grindAndApply(rng, john, copy, material) {
  const events = [];
  if (material.sim.licentiaMark && !john.procedure.licentia) {
    return { applied: false, refused: true, events };
  }

  if (material.sim.sickensOnGrind && rng.next() < material.sim.sickensOnGrind) {
    addFatigue(john, 2);
    events.push({ type: 'sickened', material: material.id });
  }

  const reacts = (material.sim.reactsWith ?? []).some(id => copy.pigments.includes(id))
    || copy.reactive.includes(material.id);
  if (reacts) {
    copy.faults.push({ class: 'blackened', unit: null, visible: true, inherited: false, corrected: false });
    events.push({ type: 'reaction', material: material.id });
  }

  copy.pigments.push(material.id);
  copy.reactive.push(...(material.sim.reactsWith ?? []));
  if (material.sim.corrodesAfterDays && copy.corrodeAt == null) {
    copy.corrodeAt = copy.ageDays + material.sim.corrodesAfterDays;
  }
  if (material.sim.conspicuous) copy.conspicuous = true;
  if (material.sim.licentiaMark) copy.gilded = true;

  return { applied: true, events };
}

/** Sim-time passes over a finished copy; verdigris keeps its promise. */
export function ageCopy(copy, days) {
  copy.ageDays += days;
  if (copy.corrodeAt != null && copy.ageDays >= copy.corrodeAt
    && !copy.faults.some(f => f.class === 'corrosion')) {
    copy.faults.push({ class: 'corrosion', unit: null, visible: true, inherited: false, corrected: false });
  }
  return copy;
}

// ── concealment ──────────────────────────────────────────────

/** Where a copy lives decides how it dies (§3.6). */
export function conceal(copy, state) {
  if (!CONCEALMENTS.includes(state)) throw new Error(`unknown concealment: ${state}`);
  copy.concealment = state;
  if (state === 'given') copy.given = true;
  return copy;
}

export function inventoryFinds(rng, copy) {
  const chance = CONCEALMENT_FOUND_CHANCE[copy.concealment] ?? CONCEALMENT_FOUND_CHANCE.loose;
  if (chance === 0) return false;   // given: 1323 cannot reach what was already elsewhere
  if (chance === 1) return true;    // shelved: the open shelf hides nothing
  return rng.next() < chance;
}

/** The rented piece has a clock (§3.1); his own book waits forever. */
export function deadlineExceeded(exemplar, daysHeld) {
  const dl = exemplar.sim.deadlineDays;
  return dl != null && daysHeld > dl;
}

// ── palimpsest (§3.5; INTERFACE.md §Motion — "never deleted, only
// overwritten and still legible") ───────────────────────────────

/**
 * Scrape a leaf for reuse: pull one real fault from the player's own
 * save history (not invented flavor — the ghost is literally a past
 * mistake, this browser's `loadWitnesses(storage())`). Pure: the caller
 * supplies the witness list. Never mends what it finds — see
 * docs/DECISIONS_AND_FORKS.md (palimpsest never mends, only haunts,
 * same logic as verba ignota: sense cannot rescue what it touches).
 */
export function scrapeLeaf(rng, witnesses) {
  const candidates = (witnesses ?? [])
    .flatMap(w => (w.copies ?? []).map(c => ({ exemplarId: c.exemplarId, faults: c.faults ?? [] })))
    .filter(c => c.faults.length);
  if (!candidates.length) return null;
  const pick = candidates[Math.floor(rng.next() * candidates.length) % candidates.length];
  const fault = pick.faults[Math.floor(rng.next() * pick.faults.length) % pick.faults.length];
  return { exemplarId: pick.exemplarId, faultClass: fault.class };
}

/** Assembles the distraction record's shape; `text` is composed by the
 *  caller (content.js supplies the words per fault class) — the engine
 *  never embeds prose. */
export function undertextDistraction(undertext, text) {
  if (!undertext) return null;
  return {
    id: `undertext-${undertext.faultClass}`,
    kind: 'undertext',
    text,
    effects: { pressure: 1, despair: 0 },
    sources: [{ work: 'INTERFACE.md §Motion (the palimpsest verb)', locus: 'under-text, always legible' }],
    status: 'invented',
  };
}
