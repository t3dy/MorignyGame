/**
 * MORIGNY — the branch audit, enforced (CLAUDE.md rule 13;
 * docs/BRANCH_AUDIT.md).
 *
 * Every moment the game stops and waits for the player is declared in
 * src/content/branches.js and checked here: does it orient the reader,
 * does it sound like a person, does it ground its claims, and does it
 * say what pressing a key will actually do. This test exists because
 * the game shipped an opening that read, in its entirety, "Take up the
 * day again."
 */

import { strict as assert } from 'assert';
import { BRANCHES, CONTINUES, ALL_BRANCHES } from '../src/content/branches.js';
import {
  VOICES, BRANCH_KINDS, auditBranch, auditAll, errors, warnings, report,
} from '../src/engine/branchaudit.js';
import { INCIPIT, RETURNING } from '../src/content/incipit.js';

describe('The auditor itself', () => {
  test('it names the four things a branch owes the reader', () => {
    assert.deepEqual(VOICES, ['narrator', 'monologue', 'pencil', 'interaction']);
    assert.deepEqual(BRANCH_KINDS, ['decision', 'continue']);
  });

  test('it catches a menu pretending to be a scene', () => {
    const bare = auditBranch({
      id: 'bare', where: 'nowhere', kind: 'decision',
      content: { options: [{ id: 'a', key: 'A', label: 'Take up the day again.' }] },
    });
    const messages = bare.findings.map(f => f.message).join(' | ');
    assert.match(messages, /no narrator/, 'the reader is not oriented');
    assert.match(messages, /no interior voice/, 'nobody is speaking');
    assert.match(messages, /fewer than two live options/);
    assert.match(messages, /no stakes line/);
  });

  test('it catches an axis-moving choice that hides its lean', () => {
    const sneaky = auditBranch({
      id: 'sneaky', where: 'nowhere', kind: 'decision',
      content: {
        narrator: { text: 'x'.repeat(200) },
        monologue: { text: 'y'.repeat(80) },
        options: [
          { id: 'a', key: 'A', label: 'A real label here', why: 'Costs nothing.', effect: { disposition: 1 } },
          { id: 'b', key: 'B', label: 'Another real label', why: 'Costs nothing.' },
        ],
      },
    });
    assert.match(sneaky.findings.map(f => f.message).join(' '), /without naming its lean/);
  });

  test('it catches colliding keys and unpressable ones', () => {
    const bad = auditBranch({
      id: 'bad', where: 'nowhere', kind: 'decision',
      content: {
        narrator: { text: 'x'.repeat(200) },
        monologue: { text: 'y'.repeat(80) },
        options: [
          { id: 'a', key: 'A', label: 'A real label here', why: '(Costs 1.)' },
          { id: 'b', key: 'A', label: 'Another real label', why: '(Costs 2.)' },
          { id: 'c', key: 'go', label: 'A third real label', why: '(Costs 3.)' },
        ],
      },
    });
    const m = bad.findings.map(f => f.message).join(' | ');
    assert.match(m, /keys collide/);
    assert.match(m, /single letter or digit/);
  });

  test('it lets a continue be short, but not vague', () => {
    assert.equal(auditBranch({ id: 'c', where: 'x', kind: 'continue', content: { label: 'To Vespers.' } }).findings.length, 0);
    const vague = auditBranch({ id: 'c', where: 'x', kind: 'continue', content: { label: 'Onward.' } });
    assert.match(vague.findings.map(f => f.message).join(' '), /does not say where it goes/);
  });
});

describe('The opening, which is what this audit was built for', () => {
  test('it orients, speaks, cites, and explains how to play', () => {
    assert.ok(INCIPIT.narrator.text.length > 500, 'the narrator introduces the actual man');
    assert.ok(INCIPIT.monologue.text.length > 100, 'and John speaks before anything is asked');
    assert.ok(INCIPIT.pencil.text.length > 100, 'the scholarly hand says what this is');
    assert.ok(INCIPIT.interaction.text.length > 200, 'and the reader is told HOW TO PLAY');
    assert.match(INCIPIT.interaction.text, /press it, or click it/i, 'plainly');
    assert.match(INCIPIT.interaction.text, /four voices/i, 'including who is speaking to them');
    assert.match(INCIPIT.interaction.text, /cannot win|1323 arrives/i, 'and what kind of game it is');
  });

  test('the opening names the real man, not a vague monk', () => {
    for (const fact of [/canon law/i, /provost/i, /ars notoria/i, /1323/, /Liber florum/]) {
      assert.match(INCIPIT.narrator.text, fact, `the opening states ${fact}`);
    }
  });

  test('the first choice is childhood', () => {
    assert.match(INCIPIT.options[0].label, /Chartres|boy of thirteen/i);
    assert.ok(INCIPIT.options[0].why.length > 60, 'and says what that stretch of the game is');
  });

  test('a returning player is told what they are returning TO', () => {
    // This branch used to read, in its entirety, "Take up the day again."
    assert.ok(RETURNING.narrator.text.length > 400);
    assert.match(RETURNING.narrator.text, /days the record kept|already under way/i);
    assert.ok(RETURNING.interaction.text.length > 100, 'and how to read the screen');
    for (const o of RETURNING.options) {
      assert.ok(o.why.length > 40, `"${o.label}" must say what it leads to`);
    }
  });
});

describe('Every declared branch passes the audit', () => {
  const results = auditAll(ALL_BRANCHES);

  test('the map covers the loop, decisions and page-turns alike', () => {
    assert.ok(BRANCHES.length >= 25, `only ${BRANCHES.length} decisions declared`);
    assert.ok(CONTINUES.length >= 8);
    const ids = ALL_BRANCHES.map(b => b.id);
    assert.equal(new Set(ids).size, ids.length, 'duplicate branch id');
    for (const b of ALL_BRANCHES) {
      assert.ok(b.where && b.where.length > 3, `${b.id}: says where in the game it happens`);
    }
  });

  test('no branch leaves the reader unoriented, unvoiced, or choosing blind', () => {
    const failing = errors(results);
    const detail = failing.map(r =>
      `\n  ${r.where} — ${r.id}\n` + r.findings.filter(f => f.severity === 'error').map(f => `    ${f.message}`).join('\n')
    ).join('');
    assert.equal(failing.length, 0,
      `${failing.length} branch(es) fail the audit:${detail}\n\nSee docs/BRANCH_AUDIT.md.`);
  });

  test('REPORT — branch coverage', () => {
    for (const line of report(results)) console.log(`    ${line}`);
    const clean = results.filter(r => !r.findings.length).length;
    console.log(`    (warnings are work to do, not failures)`);
    assert.ok(clean > 0);
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
