/**
 * MORIGNY stemma tests — witnesses as a tree of descent, corruptions
 * inherited down the line, and which copy the modern scholar receives.
 * Transmission beats quality: what got out, not what was kept.
 */

import { strict as assert } from 'assert';
import {
  siglumFor, loadWitnesses, saveWitness, corruptionsOf, buildStemma, survivingWitness,
} from '../src/engine/stemma.js';
import { EXAMINATION, VERDICTS, VERDICT_ENVELOPE, DEPARTURE_NOTE, READING_ROOM, SUMMONS, BIBLIO } from '../src/content/content.js';
import { STANCES } from '../src/engine/chronicle.js';

function fakeStorage() {
  const m = new Map();
  return { getItem: k => m.get(k) ?? null, setItem: (k, v) => m.set(k, v) };
}

const clean = { prayed: true, dream: 'licentia', licentia: true, night: { outcome: 'mastery' } };
const faulty = { prayed: false, dream: 'shut', corrupt: true, night: { outcome: 'lapse' } };

describe('Sigla', () => {
  test('editorial letters, then doubled', () => {
    assert.equal(siglumFor(0), 'A');
    assert.equal(siglumFor(25), 'Z');
    assert.equal(siglumFor(26), 'AA');
    assert.equal(siglumFor(27), 'AB');
  });
});

describe('Witness storage', () => {
  test('round-trips, and a broken store reads as empty', () => {
    const s = fakeStorage();
    assert.deepEqual(loadWitnesses(s), []);
    saveWitness(s, clean);
    assert.equal(loadWitnesses(s).length, 1);
    assert.deepEqual(loadWitnesses({ getItem: () => 'not json', setItem: () => {} }), []);
  });

  test('a non-array payload does not poison the stemma', () => {
    const s = { getItem: () => '{"nope":true}', setItem: () => {} };
    assert.deepEqual(loadWitnesses(s), []);
  });
});

describe('Corruptions are the day, read as a manuscript', () => {
  test('a good day leaves no new faults', () => {
    assert.deepEqual(corruptionsOf(clean), []);
  });

  test('each failure names its own textual fault', () => {
    const faults = corruptionsOf(faulty);
    assert.ok(faults.some(f => /figure copied wrong/.test(f)));
    assert.ok(faults.some(f => /lacuna/.test(f)));
    assert.ok(faults.some(f => /scraped and rewritten/.test(f)));
    assert.ok(faults.some(f => /prayer wanting/.test(f)));
  });

  test('the scruple-wheel and the poppy each mark the page', () => {
    assert.ok(corruptionsOf({ prayed: true, confession: 'scruple' })
      .some(f => /corrected four times/.test(f)));
    assert.ok(corruptionsOf({ prayed: true, dream: 'drugged' })
      .some(f => /blank under poppy/.test(f)));
  });
});

describe('The stemma', () => {
  test('descent is linear and corruptions accumulate downstream', () => {
    const nodes = buildStemma([clean, faulty, clean]);
    assert.equal(nodes[0].parent, null, 'the archetype has no parent');
    assert.equal(nodes[1].parent, 'A');
    assert.equal(nodes[2].parent, 'B');
    assert.equal(nodes[0].total, 0);
    assert.ok(nodes[1].total > 0);
    assert.equal(nodes[2].inherited.length, nodes[1].own.length + nodes[0].own.length,
      'a late copy inherits every fault above it');
    assert.ok(nodes[2].total >= nodes[1].total, 'transmission only degrades');
  });

  test('a departed witness is lowercased and marked contaminated', () => {
    const nodes = buildStemma([clean, { ...clean, departed: true }]);
    assert.equal(nodes[1].siglum, 'b');
    assert.equal(nodes[1].contaminated, true);
  });

  test('the scholar receives what got out, preferring a licensed copy', () => {
    const nodes = buildStemma([faulty, clean]);
    const got = survivingWitness(nodes);
    assert.equal(got.siglum, 'B', 'the licentia-bearing witness is received');
  });

  test('with no licence, the least corrupt survives', () => {
    const plain = { prayed: true, dream: 'delayed' };
    const nodes = buildStemma([plain, faulty]);
    assert.equal(survivingWitness(nodes).siglum, 'A');
  });

  test('a contaminated witness is never received as authentic', () => {
    const nodes = buildStemma([{ ...clean, departed: true }]);
    assert.equal(survivingWitness(nodes), null, 'nothing comes up from the stacks');
  });

  test('an empty chronicle yields no manuscript', () => {
    assert.equal(survivingWitness(buildStemma([])), null);
  });
});

describe('1323 content coverage', () => {
  test('three questions, each answerable in all three stances', () => {
    assert.equal(EXAMINATION.length, 3);
    for (const q of EXAMINATION) {
      assert.ok(q.rubric?.length > 10, `${q.id} rubric`);
      assert.ok(q.question?.length > 60, `${q.id} question`);
      for (const stance of STANCES) {
        assert.ok(q.stances[stance]?.length > 40, `${q.id}.${stance} must be written`);
      }
    }
  });

  test('every verdict is authored and enveloped', () => {
    for (const key of ['submitted', 'defiant', 'departed']) {
      assert.ok(VERDICTS[key].body.length > 100, `${key} ending`);
      assert.ok(VERDICTS[key].rubric.length > 10, `${key} rubric`);
      assert.ok(VERDICT_ENVELOPE[key].status, `${key} envelope`);
    }
  });

  test('the departure annotation is mandatory, cited, and names the real ending', () => {
    assert.equal(VERDICTS.departed.rubric, '¶ Here the witness departs from the record.');
    assert.ok(/did not happen/.test(DEPARTURE_NOTE.text));
    assert.ok(/New Compilation/.test(DEPARTURE_NOTE.text), 'it must say what really followed');
    for (const c of DEPARTURE_NOTE.cites) assert.ok(BIBLIO[c], `unknown citation ${c}`);
  });

  test('the summons and the reading room cite their sources', () => {
    assert.ok(SUMMONS.sources.length > 0);
    assert.ok(READING_ROOM.sources.length > 0);
    assert.equal(READING_ROOM.status, 'attested');
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
