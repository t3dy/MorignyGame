/**
 * MORIGNY stance-engine tests — v4's stance-up-front blocks
 * (docs/V4_LOOP_REDESIGN.md §1). The policies are deterministic, the
 * seeds replay, and each stance's promise is kept: vigilance spends,
 * routine fights the flesh only, haste spends nothing and eats it all.
 */

import { strict as assert } from 'assert';
import { SeededRandom } from '../src/engine/random.js';
import { createJohn, addDespair } from '../src/engine/state.js';
import {
  STANCES, STANCE_HANDS, stanceDecision, runRecitationBlock, runCopyBlock,
} from '../src/engine/stance.js';
import { HANDS } from '../src/engine/scriptorium.js';
import { buildDay } from '../src/engine/day.js';

function fakeRng(...values) {
  const queue = [...values];
  return { next: () => (queue.length ? queue.shift() : 0.99) };
}

const mundane = { id: 'd-mundane', kind: 'mundane', text: 'a fly', effects: { pressure: 0, despair: 0 } };
const appetite = { id: 'd-appetite', kind: 'appetite', text: 'the want to know', effects: { pressure: 1, despair: 0 } };

/** A minimal exemplar fixture, same shape scriptorium.test.js uses. */
function fixture(sim = {}) {
  return {
    id: 'fixture', title: 'a fixture', source: 'armarium',
    hot: false, completeness: 1, status: 'invented', sources: [],
    sim: {
      units: 1, verbaShare: 0, figures: 0, faults: [],
      coin: 0, favorOwed: false, assigned: true,
      deadlineDays: null, suspicionOnAcquire: 0,
      ...sim,
    },
  };
}

describe('Stance policies', () => {
  test('the three stances, and their hands, are the ones the plan names', () => {
    assert.deepEqual(STANCES, ['vigilant', 'routine', 'hasty']);
    for (const s of STANCES) assert.ok(HANDS[STANCE_HANDS[s]], `${s} maps to a real hand`);
    assert.equal(STANCE_HANDS.vigilant, 'textualis', 'vigilance is the careful hand');
    assert.equal(STANCE_HANDS.hasty, 'trusting', 'haste trusts the exemplar');
  });

  test('vigilant holds fast while resolve allows; the spend is counted', () => {
    const john = createJohn(); // resolve 3, fatigue 2, pressure 3 → spawn 0.33
    // spawn(0.1) + pick(0.5) → mundane pending; hold; spawn(0.9) → verse
    const rng = fakeRng(0.1, 0.5, 0.9);
    const out = runRecitationBlock(rng, john, { verses: ['a', 'b'], pool: [mundane], stance: 'vigilant' });
    assert.deepEqual(out.distractions.map(d => d.action), ['held']);
    assert.equal(out.resolveSpent, 1);
    assert.equal(john.resolve, 2);
    assert.equal(out.lapses, 0);
    assert.equal(out.grade, 'recollected');
    assert.equal(out.firstBreak, null, 'the guard never broke');
  });

  test('hasty attends everything, spends nothing, and the effects land', () => {
    const john = createJohn();
    const before = john.pressure;
    const rng = fakeRng(0.1, 0.5, 0.9);
    const out = runRecitationBlock(rng, john, { verses: ['a', 'b'], pool: [appetite], stance: 'hasty' });
    assert.equal(out.resolveSpent, 0);
    assert.equal(john.resolve, 3, 'not a point of resolve was spent');
    assert.ok(out.lapses >= 1);
    assert.ok(john.pressure > before, 'the flesh got its hearing, and it cost');
    assert.equal(out.firstBreak, null, 'haste never meant to resist — nothing "broke"');
    assert.ok(out.distractions.every(d => d.action === 'attended'));
  });

  test('routine fights the appetite and lets the rest of the margin in', () => {
    const john = createJohn(); // pressure 3 → weights: mundane 3, flesh 3.8
    // spawn(0.1)+pick(0.5→flesh): held. spawn(0.1)+pick(0.1→mundane): attended.
    const rng = fakeRng(0.1, 0.5, 0.1, 0.1, 0.99);
    const out = runRecitationBlock(rng, john, { verses: ['a', 'b'], pool: [mundane, appetite], stance: 'routine' });
    assert.deepEqual(out.distractions.map(d => [d.record.kind, d.action]),
      [['appetite', 'held'], ['mundane', 'attended']]);
    assert.equal(out.firstBreak, 2, 'the break is the attended one, by ordinal');
  });

  test('a stance that means to resist breaks when resolve runs out', () => {
    const john = createJohn();
    john.resolve = 0;
    const rng = fakeRng(0.1, 0.5, 0.9);
    const out = runRecitationBlock(rng, john, { verses: ['a', 'b'], pool: [mundane], stance: 'vigilant' });
    assert.equal(out.firstBreak, 1);
    assert.deepEqual(out.distractions.map(d => d.action), ['attended']);
  });

  test('scrupulosity prices routine out of the fight sooner (doubled cost, same policy)', () => {
    const john = createJohn();
    addDespair(john, 3); // scrupulous: hold-fast costs 2
    john.resolve = 1;    // can no longer afford to hold
    const session = { canHoldFast: () => false, holdFastCost: () => 2 };
    assert.equal(stanceDecision('routine', session, appetite), 'attend',
      'the will is willing; the purse is empty');
  });
});

describe('Stance copy blocks', () => {
  test('vigilant copies in textualis and catches the inherited fault', () => {
    const john = createJohn();
    // layout: fault idx(0.5). unit: spawn(0.99 no), catch(0.1 < 0.8), error(0.99 no)
    const rng = fakeRng(0.5, 0.99, 0.1, 0.99);
    const out = runCopyBlock(rng, john, {
      exemplar: fixture({ faults: ['eyeskip'] }), pool: [], stance: 'vigilant',
    });
    assert.equal(out.hand, 'textualis');
    assert.equal(out.copy.faults.length, 0, 'the construing hand caught it');
    assert.ok(out.events.some(e => e.type === 'caught'));
  });

  test('hasty trusts the exemplar; the inherited fault descends unexamined', () => {
    const john = createJohn();
    // layout: fault idx(0.5). unit: spawn(0.99 no), NO catch roll (trusting), error(0.99 no)
    const rng = fakeRng(0.5, 0.99, 0.99);
    const out = runCopyBlock(rng, john, {
      exemplar: fixture({ faults: ['eyeskip'] }), pool: [], stance: 'hasty',
    });
    assert.equal(out.hand, 'trusting');
    assert.equal(out.copy.faults.length, 1);
    assert.equal(out.copy.faults[0].inherited, true);
  });

  test('the block runs to completion with zero external decisions', () => {
    const john = createJohn();
    const out = runCopyBlock(new SeededRandom('zero-input'), john, {
      exemplar: fixture({ units: 8 }), pool: [mundane, appetite], stance: 'routine',
    });
    assert.equal(out.copy.complete, true);
    assert.ok(out.grade, 'a grade was reached without a single prompt');
  });
});

describe('The input budget (docs/V4_LOOP_REDESIGN.md §1: ≤10 decisions/day)', () => {
  // Worst-case DECISIONS per stage kind on the canonical within-walls
  // day — choices among ≥2 options, not page-turning B presses.
  // Anyone adding a stage kind or a decision surface must declare it
  // here and stay inside the budget.
  const DECISIONS_PER_KIND = {
    'office-full': 1, // the stance (Matins adds P, still one choice)
    'office-brief': 0,
    chapter: 1,       // confess / keep silence
    daylight: 3,      // allocation + copy stance + concealment
    world: 3,         // the road's equivalent surface
    night: 1,         // the Struggle verb
    dream: 1,         // judge G/X
    reckoning: 1,     // journal or begin anew
  };

  test('a within-walls day fits the budget', () => {
    const day = buildDay('budget-check');
    let total = 0;
    for (const stage of day.stages) {
      assert.ok(stage.kind in DECISIONS_PER_KIND,
        `stage kind "${stage.kind}" must declare its decision count`);
      total += DECISIONS_PER_KIND[stage.kind];
    }
    assert.ok(total <= 10, `a day asks ${total} decisions; the budget is 10`);
  });

  test('a road day fits the budget too', () => {
    const day = buildDay('budget-road', { journey: true });
    const total = day.stages.reduce((a, s) => a + DECISIONS_PER_KIND[s.kind], 0);
    assert.ok(total <= 10, `a road day asks ${total} decisions; the budget is 10`);
  });
});

describe('Stance determinism', () => {
  test('same seed, same stance → the identical outcome', () => {
    for (const stance of STANCES) {
      const run = () => {
        const john = createJohn();
        return runRecitationBlock(new SeededRandom('det-1'), john, {
          verses: ['a', 'b', 'c', 'd'], pool: [mundane, appetite], stance,
        });
      };
      assert.deepEqual(JSON.parse(JSON.stringify(run())), JSON.parse(JSON.stringify(run())),
        `${stance} replays exactly`);
    }
  });

  test('same seed, different stances → the day actually differs', () => {
    const outcomes = STANCES.map(stance => {
      const john = createJohn();
      const out = runCopyBlock(new SeededRandom('det-2'), john, {
        exemplar: fixture({ units: 12, faults: ['eyeskip', 'dittography'] }),
        pool: [mundane, appetite], stance,
      });
      return `${out.hand}:${out.resolveSpent}:${out.lapses}`;
    });
    assert.equal(new Set(outcomes).size, STANCES.length,
      'the stances are not cosmetic — each leaves a different day behind');
  });
});

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (err) {
    console.error(`✗ ${name}`);
    console.error(`  ${err.message}`);
    throw err;
  }
}

function describe(name, fn) {
  console.log(`\n${name}`);
  fn();
}
