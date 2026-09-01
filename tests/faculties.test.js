/**
 * MORIGNY faculties tests — study hours as the advancement currency
 * (v4 §5), chronicle persistence, and the one live effect that ships
 * with the system: craft steadies the copying hand. No dead content —
 * the licentia lesson (D-18) made that a house rule.
 */

import { strict as assert } from 'assert';
import {
  FACULTIES, FACULTY_MAX, createFaculties, loadFaculties, study,
  reach, dispositionOf,
} from '../src/engine/faculties.js';
import { errorChance, HANDS } from '../src/engine/scriptorium.js';
import { createJohn } from '../src/engine/state.js';
import { STUDY_SCENE, STUDY_TEXT, STUDY_LEVELED } from '../src/content/stance_content.js';

const STATUSES = ['attested', 'adapted', 'invented'];

function lint(record, label) {
  assert.ok(STATUSES.includes(record.status), `${label}: status must be marked`);
  assert.ok(Array.isArray(record.sources), `${label}: sources array required`);
  if (record.status !== 'invented') {
    assert.ok(record.sources.length > 0, `${label}: ${record.status} needs sources`);
  }
}

describe('Faculties advance by study hours', () => {
  test('the four faculties, each with a line the UI can quote', () => {
    assert.deepEqual(Object.keys(FACULTIES), ['learning', 'discretio', 'craft', 'worldliness']);
    for (const meta of Object.values(FACULTIES)) assert.ok(meta.label && meta.line);
  });

  test('each level costs level+1 hours: the deep end is the slow end', () => {
    const f = createFaculties();
    assert.deepEqual(study(f, 'craft'), { leveled: true, level: 1, toNext: 2 });
    assert.equal(study(f, 'craft').leveled, false, 'one hour is not enough for level 2');
    assert.equal(study(f, 'craft').leveled, true, 'two hours are');
    assert.equal(f.craft, 2);
  });

  test('the ceiling holds, and unknown faculties are refused', () => {
    const f = createFaculties();
    f.learning = FACULTY_MAX;
    assert.deepEqual(study(f, 'learning'), { leveled: false, level: FACULTY_MAX, toNext: 0 });
    assert.throws(() => study(f, 'necromancy'), /unknown faculty/);
  });

  test('persistence: an old chronicle yields fresh faculties; a saved block reads through', () => {
    assert.equal(loadFaculties(undefined).craft, 0);
    const restored = loadFaculties({ craft: 3, progress: { craft: 1 } });
    assert.equal(restored.craft, 3);
    assert.equal(restored.progress.craft, 1);
    assert.equal(restored.worldliness, 0, 'missing ids default');
  });
});

describe('Craft steadies the hand (the live effect)', () => {
  test('a trained hand errs less; an untrained john is exactly the old math', () => {
    const raw = createJohn(); // no faculties block at all — engine-made johns
    const trained = createJohn();
    trained.faculties = loadFaculties({ craft: 5 });
    const untrainedChance = errorChance(HANDS.textualis, 0, raw);
    const trainedChance = errorChance(HANDS.textualis, 0, trained);
    assert.ok(trainedChance < untrainedChance, 'craft lowers the error rate');
    assert.ok(trainedChance >= untrainedChance * 0.5 - 1e-9, 'but never below half — craft is not magic');
  });
});

describe('Disposition gates capacity (NEWDIRECTIONS §2 — John, not Hugh)', () => {
  const learned = () => {
    const john = createJohn();
    john.faculties = loadFaculties({ learning: 4 });
    return john;
  };

  test('a well-disposed knower reaches everything he has trained', () => {
    const john = learned();
    john.procedure.prayed = true;          // disposition 3 → full reach
    assert.equal(reach(john, 'learning'), 4);
  });

  test('disposition can never invent learning he does not have', () => {
    const john = createJohn();
    john.faculties = loadFaculties({});
    john.procedure.prayed = true;
    assert.equal(reach(john, 'learning'), 0, 'grace does not hand out a degree');
  });

  test('a learned man out of order cannot reach his own learning', () => {
    const john = learned();
    john.purity.polluted = true;           // observance broken
    john.purity.confessed = false;         // and not yet confessed
    assert.ok(reach(john, 'learning') < 4, 'the knower is narrowed, not the knowledge lost');
    john.purity.polluted = false;
    john.purity.confessed = true;
    john.procedure.prayed = true;
    assert.equal(reach(john, 'learning'), 4, 'and restored when he is restored');
  });

  test('from a bare observance, the scruple-wheel and exhaustion each narrow him', () => {
    // Baseline: clean and confessed, but the Work's prayer unsaid.
    const scrupulous = learned(); scrupulous.despair = 4;
    const spent = learned(); spent.fatigue = 8;
    assert.equal(reach(learned(), 'learning'), 4, 'a bare observance still reaches everything');
    assert.equal(reach(scrupulous, 'learning'), 3, 'despair narrows the knower');
    assert.equal(reach(spent, 'learning'), 3, 'so does a spent body');
  });

  test('a surplus of disposition is a BUFFER — good order absorbs one bad thing', () => {
    // This is the design, not an accident of the formula: a man who
    // has kept the observance and said the Work's prayer has reserve,
    // and reserve is what a bad night spends instead of his capacity.
    const devout = learned(); devout.procedure.prayed = true;
    const devoutAndScrupulous = learned();
    devoutAndScrupulous.procedure.prayed = true;
    devoutAndScrupulous.despair = 4;
    assert.equal(reach(devout, 'learning'), 4);
    assert.equal(reach(devoutAndScrupulous, 'learning'), 4, 'the surplus took the hit');
    // But the reserve is finite: two bad things get through.
    devoutAndScrupulous.fatigue = 8;
    assert.equal(reach(devoutAndScrupulous, 'learning'), 3);
  });

  test('dispositionOf reads the state a player can actually see', () => {
    const john = learned();
    const bare = dispositionOf(john);
    john.procedure.prayed = true;
    assert.ok(dispositionOf(john) > bare, 'saying the Work\'s prayer disposes him');
    john.purity.polluted = true;
    assert.ok(dispositionOf(john) < dispositionOf(learned()) + 1, 'breaking the observance costs');
  });

  test('his own book disposes him too, and its influence is bounded', () => {
    const john = learned(); john.procedure.prayed = true;
    const sound = reach(john, 'learning', { book: 5 });
    const corrupt = reach(john, 'learning', { book: -5 });
    assert.equal(sound, 4, 'a good book cannot exceed his training');
    assert.ok(corrupt < 4, 'a corrupt book narrows him');
    assert.ok(corrupt >= 0);
  });

  test('reach never goes negative', () => {
    const john = learned();
    john.purity.polluted = true; john.purity.confessed = false;
    john.despair = 5; john.fatigue = 10;
    assert.ok(reach(john, 'learning', { book: -5 }) >= 0);
  });
});

describe('Study writing coverage', () => {
  test('the scene, every faculty beat, and the leveling line are enveloped', () => {
    lint(STUDY_SCENE.narrator, 'study scene narrator');
    lint(STUDY_SCENE.monologue, 'study scene monologue');
    for (const id of Object.keys(FACULTIES)) {
      assert.ok(STUDY_TEXT[id], `${id} has its study beat`);
      lint(STUDY_TEXT[id], `study ${id}`);
    }
    lint(STUDY_LEVELED, 'study leveled');
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
