/**
 * MORIGNY — the Liber florum tests (NEWDIRECTIONS.md §4, §8).
 * The recursion (vision → prayer → disposition → next vision), the
 * silent corruption a misjudged vision writes into the book, and the
 * rule that makes John's book the object it is: errors are preserved,
 * never erased.
 */

import { strict as assert } from 'assert';
import {
  COMPILATIONS, PRAYER_MODES,
  createLiberFlorum, loadLiberFlorum, composePrayer, glossPrayer,
  unglossedCorruptions, disposition, beginNewCompilation, attackDue,
} from '../src/engine/liberflorum.js';
import {
  COMPOSE_SCENE, COMPOSE_OPTIONS, COMPOSE_OPTIONS_ENVELOPE, INCIPITS, INCIPITS_ENVELOPE,
  COMPOSE_OUTCOME, GLOSS_SCENE, GLOSS_OPTIONS, GLOSS_OPTIONS_ENVELOPE, GLOSS_OUTCOME,
  BARKING_DOGS, MILK_AND_MEAT,
} from '../src/content/liberflorum_content.js';

const STATUSES = ['attested', 'adapted', 'invented'];
const JUDGEMENTS = ['licentia', 'delayed', 'corrupted', 'mastery'];

function lint(record, label) {
  assert.ok(STATUSES.includes(record.status), `${label}: status must be marked`);
  assert.ok(Array.isArray(record.sources), `${label}: sources array`);
  if (record.status !== 'invented') {
    assert.ok(record.sources.length > 0, `${label}: ${record.status} needs sources`);
    for (const s of record.sources) assert.ok(s.work && s.locus, `${label}: work and locus`);
  }
}

const write = (book, judgement, extra = {}) =>
  composePrayer(book, { vision: {}, judgement, incipit: 'Test incipit', ...extra });

describe('The book grows from visions', () => {
  test('a prayer records the vision it came from, in order', () => {
    const book = createLiberFlorum();
    const p1 = write(book, 'licentia');
    const p2 = write(book, 'mastery');
    assert.equal(p1.ordinal, 1);
    assert.equal(p2.ordinal, 2);
    assert.equal(p1.fromJudgement, 'licentia');
    assert.equal(p1.compilation, 'old', 'early work belongs to the Old Compilation');
    assert.deepEqual(COMPILATIONS, ['old', 'new']);
    assert.deepEqual(PRAYER_MODES, ['adjuring', 'conjuring']);
  });

  test('an old save loads additively; a fresh one starts in the Old Compilation', () => {
    assert.equal(loadLiberFlorum(undefined).compilation, 'old');
    assert.equal(loadLiberFlorum(undefined).prayers.length, 0);
    const restored = loadLiberFlorum({ prayers: [{ id: 'prayer-1' }], compilation: 'new', attacked: true });
    assert.equal(restored.prayers.length, 1);
    assert.equal(restored.compilation, 'new');
    assert.equal(restored.attacked, true);
  });

  test('accepting a counterfeit writes the counterfeit into the book — silently', () => {
    const book = createLiberFlorum();
    const bad = write(book, 'corrupted');
    assert.equal(bad.corrupt, true, 'the prayer is defective');
    assert.equal(bad.glosses.length, 0, 'and nothing on the page says so');
    assert.equal(unglossedCorruptions(book).length, 1);
    // The narration must not leak it: same discipline as a failed figure.
    assert.ok(!/corrupt/i.test(COMPOSE_OUTCOME.corrupted.monologue.text.replace(/\(.*\)/s, '')),
      "John's own voice does not know the prayer is bad");
  });
});

describe('Disposition: the book shapes what comes next', () => {
  test('sound prayers dispose him; unglossed corruption hurts more than soundness helps', () => {
    const book = createLiberFlorum();
    assert.equal(disposition(book), 0, 'an empty book disposes nothing');
    write(book, 'licentia');
    write(book, 'mastery');
    assert.equal(disposition(book), 2);
    write(book, 'corrupted');
    assert.equal(disposition(book), 0,
      'a defective observance is worse than none — silent invalidity, SLICE_SPEC §Procedure');
  });

  test('glossing neutralises the corruption without deleting it', () => {
    const book = createLiberFlorum();
    const bad = write(book, 'corrupted');
    assert.equal(disposition(book), -2);
    glossPrayer(book, bad.id, { reason: 'a later vision showed the face was borrowed' });
    assert.equal(disposition(book), 0, 'a known error stops harming the practice');
    assert.equal(book.prayers.length, 1, 'and the prayer is STILL IN THE BOOK');
    assert.equal(book.prayers[0].corrupt, true, 'still marked corrupt — the record is not laundered');
    assert.equal(book.prayers[0].glosses.length, 1);
    assert.equal(unglossedCorruptions(book).length, 0);
  });

  test('glossing an unknown prayer throws rather than silently doing nothing', () => {
    assert.throws(() => glossPrayer(createLiberFlorum(), 'prayer-99', { reason: 'x' }), /no such prayer/);
  });
});

describe('The two compilations: milk and meat', () => {
  test('the attack comes only once there is a book to attack', () => {
    const book = createLiberFlorum();
    assert.equal(attackDue(book), false, 'nobody barks at an empty desk');
    write(book, 'licentia'); write(book, 'licentia'); write(book, 'licentia');
    assert.equal(attackDue(book), true);
    beginNewCompilation(book);
    assert.equal(book.compilation, 'new');
    assert.equal(attackDue(book), false, 'and it does not come twice');
  });

  test('after the attack he receives the forms rather than devising them', () => {
    const book = createLiberFlorum();
    // In the Old Compilation he invents freely — the milk.
    assert.ok(write(book, 'licentia', { mode: 'conjuring' }));
    beginNewCompilation(book);
    // In the New he is girded and led where he does not choose to go.
    assert.throws(() => write(book, 'licentia', { mode: 'conjuring' }), /received, not devised/);
    assert.ok(write(book, 'licentia', { mode: 'adjuring' }), 'adjuring still works, and only adjuring');
  });

  test('an unknown mode is refused', () => {
    assert.throws(() => write(createLiberFlorum(), 'licentia', { mode: 'commanding' }), /unknown mode/);
  });
});

describe('Composition writing coverage', () => {
  test('the scene, the options, and every judgement outcome are enveloped', () => {
    assert.ok(COMPOSE_SCENE.rubric.startsWith('¶'));
    lint(COMPOSE_SCENE.narrator, 'compose narrator');
    lint(COMPOSE_SCENE.monologue, 'compose monologue');
    lint(COMPOSE_OPTIONS_ENVELOPE, 'compose options');
    for (const k of ['compose', 'withhold']) {
      assert.ok(COMPOSE_OPTIONS[k].label && COMPOSE_OPTIONS[k].why, `${k}: label and why (rule 10)`);
    }
    for (const j of JUDGEMENTS) {
      assert.ok(INCIPITS[j]?.length >= 2, `${j}: at least two incipits, so a run varies`);
      lint(COMPOSE_OUTCOME[j].narrator, `${j} outcome narrator`);
      lint(COMPOSE_OUTCOME[j].monologue, `${j} outcome monologue`);
    }
    lint(INCIPITS_ENVELOPE, 'incipits');
  });

  test('the incipits are marked as ours, not quoted from John (rule 2)', () => {
    assert.match(INCIPITS_ENVELOPE.sources[0].locus, /ours, not John/i,
      'we never fabricate a quotation; the envelope must say the incipits are invented');
    assert.equal(INCIPITS_ENVELOPE.verify, true);
  });

  test('glossing and the Barking Dogs have their writing', () => {
    lint(GLOSS_SCENE.narrator, 'gloss narrator');
    lint(GLOSS_SCENE.monologue, 'gloss monologue');
    lint(GLOSS_OPTIONS_ENVELOPE, 'gloss options');
    for (const k of ['gloss', 'scrape']) {
      assert.ok(GLOSS_OPTIONS[k].label && GLOSS_OPTIONS[k].why, `${k}: legible stakes`);
      lint(GLOSS_OUTCOME[k].narrator, `${k} outcome narrator`);
      lint(GLOSS_OUTCOME[k].monologue, `${k} outcome monologue`);
    }
    assert.match(GLOSS_OPTIONS.scrape.why, /Radical/, 'axis-moving choice names its lean');
    lint(BARKING_DOGS.narrator, 'barking dogs narrator');
    lint(BARKING_DOGS.monologue, 'barking dogs monologue');
    lint(MILK_AND_MEAT.narrator, 'milk and meat narrator');
    lint(MILK_AND_MEAT.monologue, 'milk and meat monologue');
  });

  test('the Barking Dogs name the error as premature action, not doctrine', () => {
    // The historically interesting point, and easy to get wrong:
    // John concludes he acted before the promised instruction came.
    assert.match(BARKING_DOGS.narrator.text, /before the promised instruction|not wait/i);
    assert.match(BARKING_DOGS.narrator.text, /obedience and discernment/i);
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
