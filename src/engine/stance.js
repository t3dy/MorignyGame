/**
 * MORIGNY — the stance engine (v4, docs/V4_LOOP_REDESIGN.md §1).
 * Stance up front, outcome narrated: the player commits to HOW John
 * will do a block of work; this module runs the whole session over the
 * existing pure loops (recitation.js, scriptorium.js — their math is
 * untouched), making the hold-fast/attend decisions by stance policy,
 * and returns a structured outcome record the five voices can narrate.
 *
 * The policies (all deterministic, so seeds still replay exactly):
 *   vigilant — custodia oculorum entire: hold fast against every
 *              distraction while resolve allows. The costly stance.
 *   routine  — the ordinary discipline: resist the FLESH (while
 *              affordable), let the mind wander otherwise. Pressure
 *              tilts the pool toward the flesh (recitation.js), so a
 *              besieged John finds routine expensive — and a scrupulous
 *              John's doubled cost makes him give in sooner. Both
 *              emergent, neither special-cased.
 *   hasty    — get through it: attend everything, spend nothing. The
 *              margin gets every hearing; the effects all land.
 *
 * In the scriptorium the stance also chooses the hand — vigilance IS
 * textualis, haste IS trusting the exemplar — folding the old per-unit
 * hand choice (docs/DECISIONS_AND_FORKS.md F-1, closed) into the one
 * commitment. Rule 3 check: haste saves resolve but eats every
 * distraction's pressure/despair and degrades the grade — lapse is
 * priced, not rewarded.
 */

import { createRecitation } from './recitation.js';
import { createCopySession } from './scriptorium.js';

export const STANCES = ['vigilant', 'routine', 'hasty'];

/** The stance's hand at the copy desk (HANDS in scriptorium.js). */
export const STANCE_HANDS = {
  vigilant: 'textualis',
  routine: 'cursive',
  hasty: 'trusting',
};

/** Guard against a broken session looping forever: fail loudly. */
const MAX_STEPS = 500;

/** The stance's answer to a pending distraction. */
export function stanceDecision(stance, session, pending) {
  if (stance === 'hasty') return 'attend';
  if (!session.canHoldFast()) return 'attend';
  if (stance === 'vigilant') return 'hold';
  // routine: the flesh is fought; the rest of the margin gets in.
  return pending.kind === 'flesh' ? 'hold' : 'attend';
}

function baseOutcome(kind, stance) {
  return {
    kind,
    stance,
    grade: null,
    quality: null,
    distractions: [],   // [{ record, action: 'held' | 'attended' }]
    resolveSpent: 0,
    lapses: 0,
    /** Ordinal (1-based) of the first ATTENDED distraction under a
     *  stance that meant to resist — null if the guard never broke.
     *  Narration hangs "his guard broke at the third pull" on this. */
    firstBreak: null,
    events: [],
    copy: null,
  };
}

function resolvePending(session, stance, outcome) {
  const pending = session.pending;
  const action = stanceDecision(stance, session, pending);
  const ordinal = outcome.distractions.length + 1;
  if (action === 'hold') {
    outcome.resolveSpent += session.holdFastCost();
    session.holdFast();
    outcome.distractions.push({ record: pending, action: 'held' });
  } else {
    session.attend();
    outcome.distractions.push({ record: pending, action: 'attended' });
    if (stance !== 'hasty' && outcome.firstBreak == null) {
      outcome.firstBreak = ordinal;
    }
  }
}

/**
 * Run a whole recitation in one stance.
 * @param rng   SeededRandom stream dedicated to this block
 * @param john  mutable state
 * @param opts  { verses, pool, stance }
 */
export function runRecitationBlock(rng, john, { verses, pool, stance }) {
  const rec = createRecitation(rng, john, { verses, pool });
  const outcome = baseOutcome('recitation', stance);
  for (let step = 0; !rec.done; step++) {
    if (step >= MAX_STEPS) throw new Error('recitation block did not converge');
    if (rec.pending) resolvePending(rec, stance, outcome);
    else rec.advance();
  }
  outcome.lapses = rec.lapses;
  outcome.quality = rec.quality();
  outcome.grade = rec.grade();
  return outcome;
}

/**
 * Run a whole copy session in one stance (hand chosen by the stance).
 * @param rng   SeededRandom stream dedicated to this block
 * @param john  mutable state
 * @param opts  { exemplar, light, pool, stance }
 */
export function runCopyBlock(rng, john, { exemplar, light = 'day', pool = [], stance }) {
  const session = createCopySession(rng, john, { exemplar, light, pool });
  const hand = STANCE_HANDS[stance];
  const outcome = baseOutcome('copy', stance);
  for (let step = 0; !session.done; step++) {
    if (step >= MAX_STEPS) throw new Error('copy block did not converge');
    if (session.pending) resolvePending(session, stance, outcome);
    else session.advance(hand);
  }
  outcome.lapses = session.lapses;
  outcome.quality = session.quality();
  outcome.grade = session.grade();
  outcome.events = session.events;
  outcome.copy = session.copy;
  outcome.hand = hand;
  return outcome;
}
