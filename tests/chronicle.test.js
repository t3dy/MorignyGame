/**
 * MORIGNY chronicle tests — what accumulates across witnesses, the
 * summons threshold, and the examination's three registers.
 * Fixed history: every verdict burns the book (CLAUDE.md rule 5).
 */

import { strict as assert } from 'assert';
import {
  loadChronicle, saveChronicle, resetChronicle, recordDay, summonsDue,
  createExamination, answerQuestion, verdict, STANCES, QUESTION_COUNT, SUMMONS_AT,
} from '../src/engine/chronicle.js';

function fakeStorage() {
  const m = new Map();
  return { getItem: k => m.get(k) ?? null, setItem: (k, v) => m.set(k, v) };
}

describe('The chronicle accumulates', () => {
  test('an empty chronicle starts at the center of the record', () => {
    const c = loadChronicle(fakeStorage());
    assert.deepEqual(c, {
      days: 0, renown: 0, disposition: 0, examined: false, custody: [], everCopied: false,
    });
  });

  test('an old save with neither field still loads, custody defaulted empty', () => {
    const old = { getItem: () => JSON.stringify({ days: 3, renown: 5, disposition: 1, examined: false }), setItem: () => {} };
    const c = loadChronicle(old);
    assert.deepEqual(c.custody, []);
    assert.equal(c.everCopied, false);
    assert.equal(c.days, 3, 'existing fields still read through');
  });

  test('unreadable storage yields an empty chronicle, not a crash', () => {
    const broken = { getItem: () => '{{{not json', setItem: () => {} };
    assert.deepEqual(loadChronicle(broken).days, 0);
  });

  test('it round-trips through storage', () => {
    const s = fakeStorage();
    const c = recordDay(loadChronicle(s), { suspicion: 3, prayed: true });
    saveChronicle(s, c);
    assert.deepEqual(loadChronicle(s), c);
    assert.equal(resetChronicle(s).days, 0);
  });

  test('the book gets talked about: suspicion, audacity, licence', () => {
    const quiet = recordDay(loadChronicle(fakeStorage()), { suspicion: 1 });
    assert.equal(quiet.renown, 1);
    const loud = recordDay(loadChronicle(fakeStorage()),
      { suspicion: 2, disposition: 1, prayed: true, licentia: true });
    assert.equal(loud.renown, 2 + 2 + 1 + 2);
    assert.equal(loud.disposition, 1, 'the lean is carried, not just counted');
    assert.ok(loud.renown > quiet.renown, 'audacity carries further than gossip');
  });

  test('days always tick, even on a quiet witness', () => {
    let c = loadChronicle(fakeStorage());
    c = recordDay(c, {});
    c = recordDay(c, {});
    assert.equal(c.days, 2);
    assert.equal(c.renown, 0, 'a hidden life leaves no talk');
  });
});

describe('The summons', () => {
  test('comes at the threshold, and only once', () => {
    const c = loadChronicle(fakeStorage());
    c.renown = SUMMONS_AT - 1;
    assert.equal(summonsDue(c), false);
    c.renown = SUMMONS_AT;
    assert.equal(summonsDue(c), true);
    c.examined = true;
    assert.equal(summonsDue(c), false, 'history does not summon twice');
  });
});

describe('The examination at Paris', () => {
  const run = (stances, disposition = 0) => {
    const exam = createExamination({ disposition });
    for (const s of stances) answerQuestion(exam, s);
    return exam;
  };

  test('it takes exactly three answers and then closes', () => {
    const exam = createExamination({ disposition: 0 });
    assert.equal(exam.done, false);
    for (let i = 0; i < QUESTION_COUNT; i++) answerQuestion(exam, 'submit');
    assert.equal(exam.done, true);
    assert.throws(() => answerQuestion(exam, 'submit'), /over/);
  });

  test('unknown stances are refused; the verdict waits for the end', () => {
    const exam = createExamination({ disposition: 0 });
    assert.throws(() => answerQuestion(exam, 'flee'), /unknown stance/);
    assert.throws(() => verdict(exam), /have not finished/);
    assert.deepEqual(STANCES, ['submit', 'defend', 'scorn']);
  });

  test('submission is the record’s own shape', () => {
    assert.equal(verdict(run(['submit', 'submit', 'submit'])), 'submitted');
    assert.equal(verdict(run(['submit', 'defend', 'submit'])), 'submitted',
      'one defense is still a man defending his orthodoxy');
  });

  test('defiance lives inside the record’s silence', () => {
    assert.equal(verdict(run(['defend', 'defend', 'submit'])), 'defiant');
    assert.equal(verdict(run(['scorn', 'defend', 'submit'])), 'defiant');
  });

  test('departure must be earned across days, not improvised at the bar', () => {
    assert.equal(verdict(run(['scorn', 'scorn', 'scorn'], 0)), 'defiant',
      'a sudden hot temper is not a different life');
    assert.equal(verdict(run(['scorn', 'scorn', 'submit'], 2)), 'departed',
      'a witness already leaning, and scornful under examination, leaves the record');
    assert.equal(verdict(run(['scorn', 'submit', 'submit'], 5)), 'submitted',
      'a leaning witness who folds at the bar has folded — the lean does not answer for him');
  });

  test('every road burns the book — no verdict escapes 1323', () => {
    const outcomes = new Set();
    for (const a of STANCES) for (const b of STANCES) for (const c of STANCES) {
      for (const disposition of [0, 3, 6]) {
        outcomes.add(verdict(run([a, b, c], disposition)));
      }
    }
    assert.deepEqual([...outcomes].sort(), ['defiant', 'departed', 'submitted']);
    assert.ok(!outcomes.has('acquitted'), 'fixed history stays fixed');
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
