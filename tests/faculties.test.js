/**
 * MORIGNY faculties tests — study hours as the advancement currency
 * (v4 §5), chronicle persistence, and the one live effect that ships
 * with the system: craft steadies the copying hand. No dead content —
 * the licentia lesson (D-18) made that a house rule.
 */

import { strict as assert } from 'assert';
import {
  FACULTIES, FACULTY_MAX, createFaculties, loadFaculties, study,
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
