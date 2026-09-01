/**
 * MORIGNY — the angelic ascent (docs/LOOP_SYNTHESIS.md §7).
 * The pious road's payoff, and the three things that keep it honest:
 * nothing is compelled, every gift must still be discerned, and it is
 * the road with the strangest content on it.
 */

import { strict as assert } from 'assert';
import { SeededRandom } from '../src/engine/random.js';
import {
  GIFTS, GIFT_IDS, ORDERS, createAscent, loadAscent, ascentOpen,
  currentOrder, complete, petition, trueGifts, giftBonus,
} from '../src/engine/ascent.js';
import { createPractice, renounce, invest } from '../src/engine/practice.js';
import { ASCENT_SCENE, ASCENT_OUTCOME } from '../src/content/liberflorum_content.js';

const alwaysRng = (...v) => { const q = [...v]; return { next: () => (q.length ? q.shift() : 0.01) }; };

describe('The ascent opens only to a man who rebuilt', () => {
  test('it is shut before the renunciation, and before there is a Work', () => {
    const p = createPractice();
    assert.equal(ascentOpen(p), false);
    renounce(p);
    assert.equal(ascentOpen(p), false, 'renouncing alone is not a Work');
    invest(p, 'marian'); invest(p, 'marian');
    assert.equal(ascentOpen(p), true);
  });

  test('four gifts, four orders, and the gifts are the ones his figures name', () => {
    assert.deepEqual(GIFT_IDS, ['memory', 'eloquence', 'understanding', 'perseverance']);
    assert.equal(ORDERS.length, 4);
    for (const id of GIFT_IDS) assert.ok(GIFTS[id].label && GIFTS[id].line.length > 20, id);
  });
});

describe('Nothing is compelled', () => {
  test('a petition can simply not be answered, and that is the practice working', () => {
    const a = createAscent();
    const r = petition(alwaysRng(0.99), a, 'memory', { disposition: 2 });
    assert.equal(r.outcome, 'delayed');
    assert.equal(a.stage, 0, 'he has not ascended');
    assert.equal(a.refused, 1);
    assert.equal(a.granted.length, 0);
  });

  test('good disposition raises the chance of an answer and never guarantees it', () => {
    const count = d => {
      const rng = new SeededRandom('ask');
      let granted = 0;
      for (let i = 0; i < 120; i++) {
        const a = createAscent();
        if (petition(rng, a, 'memory', { disposition: d }).outcome === 'granted') granted++;
      }
      return granted;
    };
    const composed = count(4);
    const narrowed = count(-2);
    assert.ok(composed > narrowed, 'disposition helps');
    assert.ok(composed < 120, 'and never compels — God may still say nothing');
  });

  test('a granted gift advances the ascent through the orders in turn', () => {
    const a = createAscent();
    assert.equal(currentOrder(a), 'angels');
    petition(alwaysRng(0.01, 0.99), a, 'memory', { disposition: 4 });
    assert.equal(a.stage, 1);
    assert.equal(currentOrder(a), 'archangels');
  });

  test('the ascent finishes, and cannot be walked twice', () => {
    const a = createAscent();
    const rng = alwaysRng();
    for (const g of GIFT_IDS) petition(rng, a, g, { disposition: 4 });
    assert.equal(complete(a), true);
    assert.equal(currentOrder(a), null);
    assert.throws(() => petition(rng, a, 'memory', {}), /finished/);
  });

  test('a gift already given is not given again; unknown gifts throw', () => {
    const a = createAscent();
    petition(alwaysRng(0.01, 0.99), a, 'memory', { disposition: 4 });
    assert.throws(() => petition(alwaysRng(0.01), a, 'memory', {}), /already given/);
    assert.throws(() => petition(alwaysRng(0.01), a, 'flight', {}), /unknown gift/);
  });
});

describe('Even here, the gift must be discerned', () => {
  test('a narrowed knower can be given something counterfeit, silently', () => {
    const a = createAscent();
    const r = petition(alwaysRng(0.01, 0.01), a, 'memory', { disposition: -1 });
    assert.equal(r.outcome, 'granted');
    assert.equal(r.counterfeit, true, 'the ascent does not exempt him from his own subject');
    assert.equal(a.granted[0].counterfeit, true);
  });

  test('a well-disposed operator is never handed a counterfeit', () => {
    const a = createAscent();
    const r = petition(alwaysRng(0.01, 0.0), a, 'memory', { disposition: 3 });
    assert.equal(r.counterfeit, false);
  });

  test('counterfeit gifts give nothing, and he believes he has them', () => {
    const a = createAscent();
    petition(alwaysRng(0.01, 0.01), a, 'memory', { disposition: -1 });   // counterfeit
    petition(alwaysRng(0.01, 0.99), a, 'understanding', { disposition: 4 }); // true
    assert.equal(a.granted.length, 2, 'he holds two, by his own reckoning');
    assert.equal(trueGifts(a).length, 1, 'and one of them is nothing');
    assert.equal(giftBonus(a, 'learning'), 0, 'the counterfeit memory adds nothing');
    assert.equal(giftBonus(a, 'discretio'), 1, 'the true understanding does');
  });

  test('gifts map onto faculties the campaign already reads', () => {
    const a = createAscent();
    petition(alwaysRng(0.01, 0.99), a, 'eloquence', { disposition: 4 });
    assert.equal(giftBonus(a, 'worldliness'), 1);
    assert.equal(giftBonus(a, 'craft'), 0);
  });

  test('it persists across days', () => {
    const a = createAscent();
    petition(alwaysRng(0.01, 0.99), a, 'memory', { disposition: 4 });
    const restored = loadAscent(JSON.parse(JSON.stringify(a)));
    assert.equal(restored.stage, 1);
    assert.equal(restored.granted[0].gift, 'memory');
    assert.equal(loadAscent(undefined).stage, 0);
  });
});

describe('The pious road is not the boring one', () => {
  test('its writing says so, and cites the tradition it comes from', () => {
    assert.ok(ASCENT_SCENE.rubric.startsWith('¶'));
    assert.ok(ASCENT_SCENE.narrator.text.length > 300, 'the narrator has room to make the case');
    assert.equal(ASCENT_SCENE.narrator.verify, true);
    assert.ok(ASCENT_SCENE.narrator.sources.length > 0);
    for (const k of ['granted', 'delayed']) {
      assert.ok(ASCENT_OUTCOME[k].narrator.text.length > 200, k);
      assert.ok(ASCENT_OUTCOME[k].monologue.text.length > 40, k);
    }
  });

  test('refusal is written as the practice working, not as failure', () => {
    assert.match(ASCENT_OUTCOME.delayed.narrator.text, /free to refuse|not a mechanism failing/i);
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
