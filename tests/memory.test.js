/**
 * MORIGNY memory tests — the flashback vignettes (v4 §4): trigger
 * once, apply a capped step, echo forward. Plus the writing coverage
 * and provenance lint every content file answers to.
 */

import { strict as assert } from 'assert';
import { createJohn } from '../src/engine/state.js';
import { createFaculties } from '../src/engine/faculties.js';
import {
  MEMORY_DISPOSITION_CAP, loadMemories, hasFired, memoryOf, memoryDue, fireMemory, echoFor,
} from '../src/engine/memory.js';
import { MEMORIES, MEMORY_TRIGGERS } from '../src/content/memories.js';

const STATUSES = ['attested', 'adapted', 'invented'];

function lint(record, label) {
  assert.ok(STATUSES.includes(record.status), `${label}: status must be marked`);
  assert.ok(Array.isArray(record.sources), `${label}: sources array required`);
  if (record.status !== 'invented') {
    assert.ok(record.sources.length > 0, `${label}: ${record.status} needs sources`);
    for (const s of record.sources) {
      assert.ok(s.work && s.locus, `${label}: source needs work and locus`);
    }
  }
}

function johnWithFaculties() {
  const john = createJohn();
  john.faculties = createFaculties();
  return john;
}

describe('Memories fire once, at their moment', () => {
  test('a memory is due on its trigger, and only until it fires', () => {
    const memories = loadMemories();
    const due = memoryDue(memories, MEMORIES, 'first-work-hour');
    assert.equal(due.id, 'orleans-art');
    fireMemory(memories, johnWithFaculties(), due, due.choices[0]);
    assert.equal(memoryDue(memories, MEMORIES, 'first-work-hour'), null,
      'a life does not have the same memory twice');
    assert.equal(hasFired(memories, 'orleans-art'), true);
  });

  test('an unknown event is due nothing; firing twice throws', () => {
    const memories = loadMemories();
    assert.equal(memoryDue(memories, MEMORIES, 'first-tournament'), null);
    const v = MEMORIES['boyhood-letters'];
    fireMemory(memories, johnWithFaculties(), v, v.choices[0]);
    assert.throws(() => fireMemory(memories, johnWithFaculties(), v, v.choices[0]), /already fired/);
  });

  test('old saves load as an empty life, not a crash', () => {
    assert.deepEqual(loadMemories(undefined), []);
    assert.deepEqual(loadMemories(null), []);
    assert.deepEqual(loadMemories('corrupt'), []);
    assert.equal(loadMemories([{ id: 'x', choice: 'y' }])[0].id, 'x');
  });
});

describe('Effects: youth colors, the adult record decides (D-21)', () => {
  test('a faculty choice advances that faculty by one', () => {
    const memories = loadMemories();
    const john = johnWithFaculties();
    const v = MEMORIES['boyhood-letters'];
    const beauty = v.choices.find(c => c.id === 'beauty');
    const applied = fireMemory(memories, john, v, beauty);
    assert.equal(john.faculties.craft, 1);
    assert.equal(applied.faculty, 'craft');
  });

  test('disposition moves at most one step, whatever the content asks', () => {
    const memories = loadMemories();
    const john = johnWithFaculties();
    const greedy = { id: 'greedy', effect: { disposition: 5 } };
    const applied = fireMemory(memories, john, MEMORIES['orleans-art'], greedy);
    assert.equal(applied.disposition, MEMORY_DISPOSITION_CAP);
    assert.equal(john.disposition, MEMORY_DISPOSITION_CAP, 'youth explains; it does not determine');
  });

  test('every authored disposition effect already respects the cap', () => {
    for (const v of Object.values(MEMORIES)) {
      for (const c of v.choices) {
        const d = Math.abs(c.effect?.disposition ?? 0);
        assert.ok(d <= MEMORY_DISPOSITION_CAP, `${v.id}/${c.id} asks for ${d}`);
      }
    }
  });
});

describe('Echoes forward', () => {
  test('an unfired memory echoes nothing — scenes must handle null', () => {
    assert.equal(echoFor(loadMemories(), MEMORIES, 'orleans-art'), null);
    assert.equal(memoryOf(loadMemories(), 'orleans-art'), null);
  });

  test('a fired memory echoes the line for the choice actually taken', () => {
    const memories = loadMemories();
    const v = MEMORIES['orleans-art'];
    const company = v.choices.find(c => c.id === 'company');
    fireMemory(memories, johnWithFaculties(), v, company);
    assert.equal(echoFor(memories, MEMORIES, 'orleans-art'), company.echo);
    assert.notEqual(company.echo, v.choices[0].echo, 'the two roads remember differently');
  });
});

describe('Memory writing coverage', () => {
  test('every vignette: rubric, both voices, a real trigger, ≥2 choices', () => {
    for (const v of Object.values(MEMORIES)) {
      assert.ok(v.rubric.startsWith('¶'), `${v.id}: rubricated`);
      assert.ok(MEMORY_TRIGGERS.includes(v.trigger), `${v.id}: trigger is a declared event`);
      lint(v.narrator, `${v.id} narrator`);
      lint(v.monologue, `${v.id} monologue`);
      assert.ok(v.choices.length >= 2, `${v.id}: a vignette with one road is a cutscene`);
    }
  });

  test('choice keys are explicit and unique within a vignette', () => {
    // Derived letters collided in play — two labels beginning "He came…"
    // both claimed H, and the second silently ate the first.
    for (const v of Object.values(MEMORIES)) {
      const keys = v.choices.map(c => c.key);
      assert.ok(keys.every(k => /^[A-Z]$/.test(k ?? '')), `${v.id}: every choice declares a single-letter key`);
      assert.equal(new Set(keys).size, keys.length, `${v.id}: keys collide — ${keys.join(',')}`);
    }
  });

  test('every choice: legible stakes, an outcome in both voices, an echo', () => {
    for (const v of Object.values(MEMORIES)) {
      for (const c of v.choices) {
        assert.ok(c.label && c.why, `${v.id}/${c.id}: label and why (rule 10)`);
        lint(c.outcome.narrator, `${v.id}/${c.id} outcome narrator`);
        lint(c.outcome.monologue, `${v.id}/${c.id} outcome monologue`);
        assert.ok(c.echo && c.echo.length > 20, `${v.id}/${c.id}: echoes forward`);
      }
    }
  });

  test('a disposition-bearing choice names its lean in the choice itself', () => {
    for (const v of Object.values(MEMORIES)) {
      for (const c of v.choices) {
        if (c.effect?.disposition) {
          assert.match(c.why, /Radical|Obedient/,
            `${v.id}/${c.id}: axis-moving choices say so at the point of choice (WORLD_DESIGN §4.5)`);
        }
      }
    }
  });

  test('every trigger has at least one vignette waiting for it', () => {
    for (const t of MEMORY_TRIGGERS) {
      assert.ok(Object.values(MEMORIES).some(v => v.trigger === t), `no vignette for "${t}"`);
    }
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
