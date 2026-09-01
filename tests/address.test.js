/**
 * MORIGNY — the address ladder, legitimacy, and bad information.
 * The spine (docs/LOOP_SYNTHESIS.md §2–4): what matters is whom you
 * addressed, whether you knew, and how recognisable it looked.
 */

import { strict as assert } from 'assert';
import { SeededRandom } from '../src/engine/random.js';
import {
  ADDRESSES, ADDRESS_IDS, KNOWING_FROM, LEGITIMATIONS, LEGITIMATION_IDS,
  addressByLevel, addressById, resolveAddress, legitimacyGap, suspicionFor,
  operatorPerceives, createLedger, loadLedger, record, knowingOperations, highWater,
} from '../src/engine/address.js';
import { createVision, TELL_CATEGORIES } from '../src/engine/vision.js';

const alwaysRng = v => ({ next: () => v });

describe('The address ladder', () => {
  test('seven rungs, natural to pact, each with a line the UI can quote', () => {
    assert.equal(ADDRESSES.length, 7);
    assert.deepEqual(ADDRESS_IDS, ['natural', 'symbolic', 'ambiguous', 'tacit', 'invocation', 'command', 'pact']);
    for (const a of ADDRESSES) assert.ok(a.label && a.line.length > 20, a.id);
    assert.equal(addressByLevel(3).id, 'tacit');
    assert.equal(addressById('pact').level, 6);
    assert.equal(addressByLevel(99), null);
  });

  test('the knowing threshold sits where the operator stops being confused', () => {
    assert.equal(KNOWING_FROM, 4);
    assert.equal(addressByLevel(KNOWING_FROM).id, 'invocation');
  });
});

describe('Slippage: the tacit-pact problem', () => {
  test('an operation can reach a rung the operator did not intend', () => {
    const slipped = resolveAddress(alwaysRng(0), 1, { disposition: 2 });
    assert.equal(slipped.intended, 1);
    assert.equal(slipped.actual, 2, 'the symbolic operation addressed somebody after all');
    assert.equal(slipped.slipped, true);
  });

  test('a steady operator usually reaches exactly what he intended', () => {
    const steady = resolveAddress(alwaysRng(0.99), 1, { disposition: 4 });
    assert.equal(steady.actual, 1);
    assert.equal(steady.slipped, false);
  });

  test('poor disposition and the notory road widen the crack', () => {
    const rng = () => new SeededRandom('slip');
    const count = (opts) => {
      const r = rng();
      let n = 0;
      for (let i = 0; i < 200; i++) if (resolveAddress(r, 1, opts).slipped) n++;
      return n;
    };
    const composed = count({ disposition: 2, solomonic: 0 });
    const narrowed = count({ disposition: -2, solomonic: 4 });
    assert.ok(narrowed > composed, 'a narrowed knower on the notory road slips oftener');
  });

  test('a man who knowingly commands is never confused about it', () => {
    for (const level of [4, 5, 6]) {
      const r = resolveAddress(alwaysRng(0), level, { disposition: -4, solomonic: 9 });
      assert.equal(r.slipped, false, `${level} cannot slip`);
      assert.equal(r.knowing, true);
      assert.equal(r.actual, level);
    }
  });

  test('slippage never carries him across the knowing threshold unawares', () => {
    const r = resolveAddress(alwaysRng(0), 3, { disposition: -4, solomonic: 9 });
    assert.ok(r.actual < KNOWING_FROM,
      'nobody wakes up having knowingly invoked something — that rung must be chosen');
  });
});

describe('Legitimacy: suspicion tracks recognisability, not wickedness', () => {
  test('a strong frame covers a high address quietly', () => {
    assert.equal(suspicionFor(3, 'liturgy'), 0, 'a tacit address inside the Office looks like the Office');
    assert.ok(LEGITIMATIONS.liturgy.cover >= 3);
  });

  test('a bare operation is noisy even at a low rung', () => {
    assert.ok(suspicionFor(2, 'none') > suspicionFor(2, 'devotion'),
      'the same act, framed or unframed, is not equally visible');
  });

  test('nothing conceals a pact for long', () => {
    assert.ok(suspicionFor(6, 'liturgy') > 0);
    assert.ok(suspicionFor(6, 'none') > suspicionFor(6, 'liturgy'));
  });

  test('every legitimation declares a cover and a line; unknown frames throw', () => {
    for (const id of LEGITIMATION_IDS) {
      const f = LEGITIMATIONS[id];
      assert.ok(f.label && f.line.length > 20, id);
      assert.ok(Number.isInteger(f.cover) && f.cover >= 0, id);
    }
    assert.throws(() => legitimacyGap(2, 'vibes'), /unknown legitimation/);
  });
});

describe('What the operator can see', () => {
  test('he always knows his own intention', () => {
    const r = resolveAddress(alwaysRng(0), 1);
    assert.equal(operatorPerceives(r, 0), r.intended, 'and not the truth, without discernment');
  });

  test('trained discretio catches the slip', () => {
    const r = resolveAddress(alwaysRng(0), 1);
    assert.equal(operatorPerceives(r, 3), r.actual);
  });

  test('an unslipped operation is perceived correctly by anyone', () => {
    const r = resolveAddress(alwaysRng(0.99), 1);
    assert.equal(operatorPerceives(r, 0), 1);
  });
});

describe('The ledger of a life', () => {
  test('it tallies rungs stood on, the legitimacy gap, and the slips', () => {
    const l = createLedger();
    record(l, resolveAddress(alwaysRng(0.99), 1), 'devotion');
    record(l, resolveAddress(alwaysRng(0.99), 5), 'none');
    assert.equal(l.counts[1], 1);
    assert.equal(l.counts[5], 1);
    assert.equal(l.gap, suspicionFor(5, 'none'));
    assert.equal(knowingOperations(l), 1, 'the command counts; the symbolic one does not');
    assert.equal(highWater(l), 5);
  });

  test('an empty life has stood nowhere', () => {
    const l = createLedger();
    assert.equal(highWater(l), 0);
    assert.equal(knowingOperations(l), 0);
  });

  test('it survives the day boundary, and an old save loads', () => {
    const l = createLedger();
    record(l, resolveAddress(alwaysRng(0.99), 4), 'authority');
    const restored = loadLedger(JSON.parse(JSON.stringify(l)));
    assert.deepEqual(restored.counts, l.counts);
    assert.equal(restored.gap, l.gap);
    assert.equal(loadLedger(undefined).counts[0], 0);
    assert.equal(loadLedger({ counts: 'nonsense' }).counts.length, ADDRESSES.length);
  });
});

describe('Bad information: corruption is paid in unreliable visions', () => {
  const tellsOf = (seed, disposition) =>
    createVision(new SeededRandom(seed), { disposition }).tells;

  test('a well-disposed operator reads a clean vision', () => {
    const tells = tellsOf('clean', 4);
    assert.equal(tells.length, TELL_CATEGORIES.length);
    assert.equal(tells.filter(t => t.ambiguous).length, 1, 'exactly one ambiguous tell');
    assert.equal(tells.filter(t => t.lying).length, 0, 'and none of them lie');
  });

  test('a narrowed knower reads more ambiguity, across many nights', () => {
    const ambiguity = d => {
      let n = 0;
      for (let i = 0; i < 60; i++) n += tellsOf(`night-${i}`, d).filter(t => t.ambiguous).length;
      return n;
    };
    assert.ok(ambiguity(-2) > ambiguity(4), 'the vision stops being legible before it stops coming');
  });

  test('at the bottom, a tell can actively mislead', () => {
    let lies = 0;
    for (let i = 0; i < 80; i++) lies += tellsOf(`bad-${i}`, -3).filter(t => t.lying).length;
    assert.ok(lies > 0, 'he is shown the wrong mark and nothing announces it');
    let honest = 0;
    for (let i = 0; i < 80; i++) honest += tellsOf(`bad-${i}`, 2).filter(t => t.lying).length;
    assert.equal(honest, 0, 'an ordinary observance is never actively lied to');
  });

  test('the vision still carries its own truth — the lie is in the reading', () => {
    const v = createVision(new SeededRandom('truth'), { disposition: -3 });
    assert.equal(typeof v.authentic, 'boolean',
      'whether it was of God is a fact; what he can tell about it is the variable');
  });

  test('an old caller with no options gets the ordinary disposition', () => {
    const v = createVision(new SeededRandom('legacy'));
    assert.equal(v.tells.filter(t => t.lying).length, 0);
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
