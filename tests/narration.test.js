/**
 * MORIGNY narration tests — v4's five-voice stance narration.
 * Writing coverage (every kind × stance × grade has narrator +
 * monologue, enveloped), siege composition from real facts, and the
 * binding discipline that the game-state voice never discloses a
 * silent failure (docs/NARRATIVE_DESIGN_REPORT.md §4).
 */

import { strict as assert } from 'assert';
import { SeededRandom } from '../src/engine/random.js';
import { createJohn } from '../src/engine/state.js';
import { STANCES, runCopyBlock, runRecitationBlock } from '../src/engine/stance.js';
import {
  snapshotJohn, stancePassages, composeSiege, composeGameState, composeStanceNarration,
} from '../src/engine/narration.js';
import {
  STANCE_CHOICE, STANCE_OPTIONS, STANCE_OPTIONS_ENVELOPE, STANCE_OUTCOME, SIEGE_TEXT,
} from '../src/content/stance_content.js';

const STATUSES = ['attested', 'adapted', 'invented'];
const GRADES = ['recollected', 'distracted', 'scattered'];

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

const mundane = { id: 'd-m', kind: 'mundane', text: 'a fly', effects: { pressure: 0, despair: 0 } };
const flesh = { id: 'd-f', kind: 'flesh', text: 'the flesh', effects: { pressure: 1, despair: 0 } };

function fakeRng(...values) {
  const queue = [...values];
  return { next: () => (queue.length ? queue.shift() : 0.99) };
}

function fixture(sim = {}) {
  return {
    id: 'fixture', title: 'a fixture', source: 'armarium',
    hot: false, completeness: 1, status: 'invented', sources: [],
    sim: {
      units: 1, verbaShare: 0, figures: 0, faults: [],
      coin: 0, favorOwed: false, assigned: true,
      deadlineDays: null, suspicionOnAcquire: 0,
      ...sim,
    },
  };
}

describe('Stance writing coverage (every state has writing)', () => {
  test('the choice deliberations: both kinds, both voices, enveloped', () => {
    for (const kind of ['office', 'copy']) {
      const c = STANCE_CHOICE[kind];
      assert.ok(c.rubric.startsWith('¶'), `${kind}: rubricated`);
      lint(c.narrator, `${kind} choice narrator`);
      lint(c.monologue, `${kind} choice monologue`);
      assert.ok(c.narrator.text.length > 200,
        `${kind}: the narrator is unbound now (D-19) — it explains, at length`);
      assert.ok(c.monologue.text.length > 0);
    }
  });

  test('every option label carries its lean and price (rule 10)', () => {
    for (const s of STANCES) {
      const o = STANCE_OPTIONS[s];
      assert.ok(o.label && o.why, `${s}: label and why`);
    }
    assert.match(STANCE_OPTIONS.vigilant.why, /resolve/, 'the spend is named at the point of choice');
    assert.match(STANCE_OPTIONS.hasty.why, /[Nn]o resolve/, 'the non-spend is named too');
    lint(STANCE_OPTIONS_ENVELOPE, 'options envelope');
  });

  test('every kind × stance × grade outcome: narrator + monologue, enveloped', () => {
    for (const kind of ['office', 'copy']) {
      for (const s of STANCES) {
        for (const g of GRADES) {
          const rec = STANCE_OUTCOME[kind][s][g];
          assert.ok(rec, `${kind}/${s}/${g} exists`);
          lint(rec.narrator, `${kind}/${s}/${g} narrator`);
          lint(rec.monologue, `${kind}/${s}/${g} monologue`);
          assert.ok(rec.narrator.text.length > 150, `${kind}/${s}/${g}: narrator has room to explain`);
        }
      }
    }
  });

  test('stancePassages resolves both engine kinds onto the content keys', () => {
    assert.ok(stancePassages({ kind: 'recitation', stance: 'routine', grade: 'distracted' }));
    assert.ok(stancePassages({ kind: 'copy', stance: 'hasty', grade: 'scattered' }));
    assert.throws(() => stancePassages({ kind: 'copy', stance: 'hasty', grade: 'sublime' }), /no stance outcome/);
  });
});

describe('The siege, composed from real facts', () => {
  test('a quiet block says so, once', () => {
    const { lines } = composeSiege({ distractions: [], firstBreak: null });
    assert.deepEqual(lines, [SIEGE_TEXT.quiet()]);
  });

  test('held, broken, flesh, and wanderings each get their clause', () => {
    const outcome = {
      firstBreak: 2,
      distractions: [
        { record: flesh, action: 'held' },
        { record: mundane, action: 'attended' },
        { record: flesh, action: 'attended' },
      ],
    };
    const { lines } = composeSiege(outcome);
    assert.equal(lines.length, 4);
    assert.match(lines[0], /Once the margin pulled/);
    assert.match(lines[1], /second pull, and there it broke/);
    assert.match(lines[2], /flesh got its hearing once/);
    assert.match(lines[3], /One lesser wandering/);
  });
});

describe('The game-state voice', () => {
  test('it states the stance, the grade, the spend, and the deltas', () => {
    const john = createJohn();
    const before = snapshotJohn(john);
    const rng = fakeRng(0.1, 0.5, 0.9);
    const out = runRecitationBlock(rng, john, { verses: ['a', 'b'], pool: [mundane], stance: 'vigilant' });
    const lines = composeGameState(out, before, snapshotJohn(john));
    assert.match(lines[0], /Stance: vigilant\. Grade: recollected/);
    assert.ok(lines.some(l => /Distractions: 1 \(1 held at 1 resolve, 0 attended\)/.test(l)));
    assert.ok(lines.some(l => /Resolve 3→2/.test(l)));
  });

  test('it NEVER discloses a silent failure — invisible faults stay invisible', () => {
    const john = createJohn();
    const before = snapshotJohn(john);
    // hasty/trusting: the inherited eyeskip descends, invisible.
    const rng = fakeRng(0.5, 0.99, 0.99);
    const out = runCopyBlock(rng, john, {
      exemplar: fixture({ faults: ['eyeskip'] }), pool: [], stance: 'hasty',
    });
    assert.equal(out.copy.faults.length, 1, 'the fault is really there');
    assert.equal(out.copy.faults[0].visible, false, 'and really invisible');
    const lines = composeGameState(out, before, snapshotJohn(john));
    assert.ok(lines.some(l => /Visible faults on the leaf: 0\./.test(l)),
      'the ledger reports what the scribe can see: nothing');
    assert.ok(!lines.some(l => /eyeskip|inherited|corrupt/i.test(l)),
      'the hidden fault is not named anywhere');
  });

  test('the full bundle assembles: narrator, monologue, siege, ledger', () => {
    const john = createJohn();
    const before = snapshotJohn(john);
    const out = runCopyBlock(new SeededRandom('bundle'), john, {
      exemplar: fixture({ units: 6 }), pool: [mundane, flesh], stance: 'routine',
    });
    const n = composeStanceNarration(out, before, snapshotJohn(john));
    assert.ok(n.narrator.text && n.monologue.text);
    assert.ok(Array.isArray(n.siege.lines) && n.siege.lines.length >= 1);
    assert.ok(n.gameState.length >= 1);
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
