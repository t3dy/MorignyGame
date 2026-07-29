/**
 * MORIGNY engine tests — day legality, recitation math, the Struggle's
 * confession asymmetry, discernment's four cells, seeded determinism.
 * Spec: morigny/SLICE_SPEC.md.
 */

import { strict as assert } from 'assert';
import { SeededRandom } from '../src/engine/random.js';
import {
  createJohn, pressureTier, isScrupulous, clamp,
} from '../src/engine/state.js';
import { buildDay, dayIsLegal, dayHourIds, stageRng } from '../src/engine/day.js';
import { createRecitation, distractionChance } from '../src/engine/recitation.js';
import {
  nightThreatens, successChance, resolveNight, confess, NIGHT_VERBS,
} from '../src/engine/struggle.js';
import {
  dreamEligible, createVision, judge, reckonCorruption, TELL_CATEGORIES,
} from '../src/engine/vision.js';
import { HOUR_ORDER } from '../src/data/hours.js';
import { DISTRACTIONS, PROCEDURE_PRAYER } from '../src/content/content.js';

describe('The day', () => {
  test('all eight offices, canonical order, always legal', () => {
    const day = buildDay('witness-1');
    assert.equal(dayIsLegal(day), true);
    assert.deepEqual(dayHourIds(day), HOUR_ORDER);
  });

  test('same seed → same day, same rng streams', () => {
    const a = buildDay('witness-2');
    const b = buildDay('witness-2');
    assert.deepEqual(a.stages, b.stages);
    const ra = stageRng(a, 'matins');
    const rb = stageRng(b, 'matins');
    for (let i = 0; i < 20; i++) assert.equal(ra.next(), rb.next());
  });

  test('stage streams are decorrelated from each other', () => {
    const day = buildDay('witness-3');
    const a = stageRng(day, 'matins').next();
    const b = stageRng(day, 'night').next();
    assert.notEqual(a, b);
  });
});

describe('Recitation (custodia oculorum)', () => {
  test('distraction chance grows with fatigue and pressure, capped', () => {
    const calm = createJohn();
    const wracked = createJohn();
    wracked.fatigue = 10; wracked.pressure = 10;
    assert.ok(distractionChance(calm) < distractionChance(wracked));
    assert.ok(distractionChance(wracked) <= 0.6);
  });

  test('holding fast spends resolve and keeps the verse; attending loses it', () => {
    const john = createJohn();
    john.pressure = 10; john.fatigue = 10; // force distractions quickly
    const rng = new SeededRandom('recite-1');
    const rec = createRecitation(rng, john, {
      verses: PROCEDURE_PRAYER.verses, pool: DISTRACTIONS,
    });
    // run to the first distraction
    while (!rec.pending && !rec.done) rec.advance();
    assert.ok(rec.pending, 'a wracked john gets distracted');
    const resolveBefore = john.resolve;
    const verseBefore = rec.verse;
    rec.holdFast();
    assert.equal(john.resolve, resolveBefore - 1);
    assert.equal(rec.verse, verseBefore + 1);
    while (!rec.pending && !rec.done) rec.advance();
    if (rec.pending) {
      const lapsesBefore = rec.lapses;
      rec.attend();
      assert.equal(rec.lapses, lapsesBefore + 1);
    }
  });

  test('grades map to quality thresholds', () => {
    const john = createJohn();
    const rec = createRecitation(new SeededRandom('x'), john, { verses: ['a'], pool: DISTRACTIONS });
    rec.lapses = 0; assert.equal(rec.grade(), 'recollected');
    rec.lapses = Math.ceil(1 / 0.6) ; // 1 verse, 2 lapses → 0.33 scattered
    assert.equal(rec.grade(), 'scattered');
  });

  test('scrupulosity doubles the cost of holding fast', () => {
    const john = createJohn();
    const rec = createRecitation(new SeededRandom('x'), john, { verses: ['a'], pool: DISTRACTIONS });
    assert.equal(rec.holdFastCost(), 1);
    john.despair = 3;
    assert.ok(isScrupulous(john));
    assert.equal(rec.holdFastCost(), 2);
  });
});

describe('The Struggle', () => {
  test('night threatens only at BESIEGED and CRISIS', () => {
    const john = createJohn();
    john.pressure = 5; assert.equal(nightThreatens(john), false);
    john.pressure = 6; assert.equal(nightThreatens(john), true);
    assert.equal(pressureTier(9), 'CRISIS');
  });

  test('gradient outcomes: mastery, endured, lapse', () => {
    const mastered = createJohn(); mastered.pressure = 7;
    let r = resolveNight({ next: () => 0.01 }, mastered, 'prayer');
    assert.equal(r.outcome, 'mastery');
    assert.equal(mastered.pressure, 3);

    const held = createJohn(); held.pressure = 7;
    r = resolveNight({ next: () => 0.5 }, held, 'prayer'); // success .75: 0.5 ∈ [.375,.75)
    assert.equal(r.outcome, 'endured');

    const fallen = createJohn(); fallen.pressure = 7;
    r = resolveNight({ next: () => 0.99 }, fallen, 'prayer');
    assert.equal(r.outcome, 'lapse');
    assert.equal(fallen.purity.polluted, true);
    assert.equal(fallen.pressure, 2, 'the quiet after is part of it');
    assert.equal(fallen.despair, 1);
  });

  test('vigil costs fatigue regardless of outcome; all verbs have a chance', () => {
    const john = createJohn();
    const before = john.fatigue;
    resolveNight({ next: () => 0.5 }, john, 'vigil');
    assert.equal(john.fatigue, before + 2);
    for (const verb of NIGHT_VERBS) {
      const c = successChance(createJohn(), verb);
      assert.ok(c > 0 && c < 1, `${verb} chance in (0,1)`);
    }
  });

  test('confession asymmetry: lapse recovers in a day, scruple lingers', () => {
    const john = createJohn();
    john.purity.polluted = true; john.despair = 2;
    confess(john, 'confess');
    assert.equal(john.purity.polluted, false);
    assert.equal(john.despair, 1, 'plain confession eases despair');

    const delayer = createJohn(); delayer.purity.polluted = true;
    confess(delayer, 'delay');
    assert.equal(delayer.purity.polluted, true, 'the Work stays shut');
    assert.equal(delayer.despair, 1);

    const scrupulous = createJohn();
    assert.throws(() => confess(scrupulous, 'confess'), /nothing to confess/);
    confess(scrupulous, 'scruple');
    assert.equal(scrupulous.despair, 1, 'confessing without matter feeds the wheel');
  });
});

describe('Discernment (discretio spirituum)', () => {
  test('eligibility gates: prayer quality, purity, corruption', () => {
    const john = createJohn();
    assert.equal(dreamEligible(john), false, 'no prayer, no dream');
    john.procedure.prayed = true; john.procedure.quality = 'distracted';
    assert.equal(dreamEligible(john), true);
    john.purity.polluted = true;
    assert.equal(dreamEligible(john), false, 'pollution shuts the Work');
    john.purity.polluted = false; john.procedure.corrupt = true;
    assert.equal(dreamEligible(john), false, 'rot admits no license');
  });

  test('vision is seeded-deterministic with exactly one ambiguous tell', () => {
    const a = createVision(new SeededRandom('vis-1'));
    const b = createVision(new SeededRandom('vis-1'));
    assert.deepEqual(a, b);
    assert.equal(a.tells.length, TELL_CATEGORIES.length);
    assert.equal(a.tells.filter(t => t.ambiguous).length, 1);
  });

  test('the four cells, asymmetrically priced', () => {
    // accept true → licentia
    let john = createJohn();
    assert.equal(judge(john, { authentic: true }, true), 'licentia');
    assert.equal(john.procedure.licentia, true);

    // reject true → delayed, despair
    john = createJohn();
    assert.equal(judge(john, { authentic: true }, false), 'delayed');
    assert.equal(john.despair, 1);

    // accept false → silent corruption, revealed only at reckoning
    john = createJohn();
    assert.equal(judge(john, { authentic: false }, true), 'corrupted');
    assert.equal(john.procedure.corrupt, true);
    const pressureBefore = john.pressure;
    assert.equal(reckonCorruption(john), true);
    assert.equal(john.pressure, clamp(pressureBefore + 2, 0, 10), 'the demon feeds');

    // reject false → mastery
    john = createJohn();
    const p = john.pressure;
    assert.equal(judge(john, { authentic: false }, false), 'mastery');
    assert.equal(john.pressure, p - 2);
    assert.equal(reckonCorruption(john), false);
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
