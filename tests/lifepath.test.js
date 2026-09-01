/**
 * MORIGNY — the lifepath prologue (rebuilt 2026-09-01).
 * The opening is now John's actual early life, and it ends with the art
 * in his hands rather than with the renunciation, so the campaign plays
 * the ars notoria years in the order the sources put them.
 */

import { strict as assert } from 'assert';
import { LIFEPATH, LIFEPATH_CODA } from '../src/content/lifepath.js';
import {
  LIFEPATH_IDS, createLifepath, loadLifepath, currentScene,
  chooseLifepath, asMemories, lifepathCatalog,
} from '../src/engine/lifepath.js';
import { createJohn } from '../src/engine/state.js';
import { createFaculties } from '../src/engine/faculties.js';
import { createPractice } from '../src/engine/practice.js';
import { echoFor } from '../src/engine/memory.js';

const STATUSES = ['attested', 'adapted', 'invented'];

function lint(record, label) {
  assert.ok(STATUSES.includes(record.status), `${label}: status marked`);
  assert.ok(Array.isArray(record.sources), `${label}: sources array`);
  if (record.status !== 'invented') {
    assert.ok(record.sources.length > 0, `${label}: ${record.status} needs sources`);
    for (const s of record.sources) assert.ok(s.work && s.locus, `${label}: work and locus`);
  }
}

const freshJohn = () => {
  const j = createJohn();
  j.faculties = createFaculties();
  return j;
};

describe('The prologue is the real biography', () => {
  test('it opens at Chartres and ends with the art in his hands', () => {
    assert.equal(LIFEPATH[0].id, 'chartres-boy',
      'the vision at about thirteen is the foundational scene');
    assert.equal(LIFEPATH[LIFEPATH.length - 1].id, 'the-practice');
    assert.ok(!LIFEPATH_IDS.includes('the-renouncing'),
      'the renunciation is played in-campaign now, not narrated away in a prologue');
  });

  test('the facts the old draft got wrong are present', () => {
    const all = LIFEPATH.map(s => s.narrator.text).join(' ');
    assert.match(all, /canon law/i, 'he held a degree in canon law');
    assert.match(all, /Jacob of Bologna/, 'a Lombard physician steered him to the art');
    assert.match(all, /necromantic art|necromancy/i, 'the necromantic book came first');
    assert.match(all, /provost/i, 'and he became provost of Morigny');
    assert.match(LIFEPATH[0].narrator.text, /thirteen/,
      'the Chartres vision is dated as the sources date it');
  });

  test('every scene: rubric, both voices, two real choices, all enveloped', () => {
    for (const s of LIFEPATH) {
      assert.ok(s.rubric.startsWith('¶'), `${s.id}: rubricated`);
      assert.ok(s.age, `${s.id}: says when in his life this is`);
      lint(s.narrator, `${s.id} narrator`);
      lint(s.monologue, `${s.id} monologue`);
      assert.ok(s.choices.length >= 2, `${s.id}: a scene with one road is a cutscene`);
      const keys = s.choices.map(c => c.key);
      assert.equal(new Set(keys).size, keys.length, `${s.id}: choice keys collide`);
      for (const c of s.choices) {
        assert.ok(/^[A-Z]$/.test(c.key), `${s.id}/${c.id}: single-letter key`);
        assert.ok(c.label && c.why, `${s.id}/${c.id}: legible stakes (rule 10)`);
        lint(c.outcome.narrator, `${s.id}/${c.id} outcome narrator`);
        lint(c.outcome.monologue, `${s.id}/${c.id} outcome monologue`);
        assert.ok(c.echo && c.echo.length > 20, `${s.id}/${c.id}: echoes forward`);
        if (c.effect?.disposition) {
          assert.match(c.why, /Radical|Obedient/, `${s.id}/${c.id}: names its lean`);
        }
      }
    }
    lint(LIFEPATH_CODA.narrator, 'coda narrator');
    lint(LIFEPATH_CODA.monologue, 'coda monologue');
  });

  test('the narrator says plainly where reconstruction ends and record begins', () => {
    const verified = LIFEPATH.filter(s => s.narrator.verify === true).length;
    assert.ok(verified >= 4, 'digest-sourced claims carry verify (rule 11)');
  });
});

describe('Playing the prologue', () => {
  test('it walks the scenes in order and then closes', () => {
    const l = createLifepath();
    const john = freshJohn();
    const practice = createPractice();
    assert.equal(currentScene(l).id, 'chartres-boy');
    for (const scene of LIFEPATH) {
      assert.equal(currentScene(l).id, scene.id);
      chooseLifepath(l, john, practice, scene, scene.choices[0]);
    }
    assert.equal(l.done, true);
    assert.equal(currentScene(l), null);
    assert.throws(() => chooseLifepath(l, john, practice, LIFEPATH[0], LIFEPATH[0].choices[0]), /over/);
  });

  test('choices write into the systems the campaign actually reads', () => {
    const l = createLifepath();
    const john = freshJohn();
    const practice = createPractice();
    const scene = LIFEPATH.find(s => s.id === 'the-necromancy-book');
    // Walk to it.
    for (const s of LIFEPATH) {
      if (s.id === scene.id) break;
      chooseLifepath(l, john, practice, s, s.choices[0]);
    }
    const thorough = scene.choices.find(c => c.id === 'thorough');
    const applied = chooseLifepath(l, john, practice, scene, thorough);
    assert.equal(practice.exceptive, 1, 'he begins already one step into the exceptive arts');
    assert.ok(applied.practice.length > 0);
    assert.ok(john.faculties.learning > 0);
  });

  test('a scene played out of order is refused', () => {
    const l = createLifepath();
    assert.throws(
      () => chooseLifepath(l, freshJohn(), createPractice(), LIFEPATH[3], LIFEPATH[3].choices[0]),
      /not the current scene/);
  });

  test('disposition moves at most one step per scene, whatever content asks', () => {
    const l = createLifepath();
    const john = freshJohn();
    const practice = createPractice();
    const greedy = { id: 'greedy', effect: { disposition: 5 } };
    chooseLifepath(l, john, practice, LIFEPATH[0], greedy);
    assert.equal(john.disposition, 1, 'youth colours the man; it does not decide him');
  });

  test('the prologue persists, and its choices echo during play', () => {
    const l = createLifepath();
    const john = freshJohn();
    const practice = createPractice();
    const scene = LIFEPATH[0];
    const chosen = scene.choices[1];
    chooseLifepath(l, john, practice, scene, chosen);

    const restored = loadLifepath(JSON.parse(JSON.stringify(l)));
    assert.equal(restored.choices.length, 1);
    assert.equal(loadLifepath(undefined).index, 0);

    // The existing echo machinery reads it without a second mechanism.
    assert.equal(echoFor(asMemories(l), lifepathCatalog(), scene.id), chosen.echo);
    assert.equal(echoFor(asMemories(createLifepath()), lifepathCatalog(), scene.id), null);
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
