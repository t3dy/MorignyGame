/**
 * MORIGNY — the research pipeline, enforced (CLAUDE.md rule 11,
 * docs/RESEARCH_PIPELINE.md).
 *
 * The provenance lint in the other test files asks "does this record
 * cite SOMETHING?". This file asks the harder question: "does it cite
 * something REAL, and do we know what kind of claim we are making?"
 * Every citation string in every content module must resolve to the
 * works registry, and the registry itself must stay honest.
 */

import { strict as assert } from 'assert';
import {
  WORKS, WORK_KINDS, CITABLE_KINDS, resolveWork, workById, canonicalWorkStrings, citationReport,
} from '../src/data/works.js';

import * as content from '../src/content/content.js';
import * as stanceContent from '../src/content/stance_content.js';
import * as memories from '../src/content/memories.js';
import * as encounters from '../src/content/encounters.js';
import * as lifepath from '../src/content/lifepath.js';
import * as hours from '../src/data/hours.js';
import * as npcs from '../src/data/npcs.js';
import * as exemplars from '../src/data/exemplars.js';
import * as materials from '../src/data/materials.js';
import * as leaves from '../src/data/leaves.js';
import * as manifest from '../src/data/assets_manifest.js';
import * as worldmap from '../src/data/worldmap.js';

const MODULES = [
  content, stanceContent, memories, encounters, lifepath,
  hours, npcs, exemplars, materials, leaves, manifest, worldmap,
];

describe('The works registry is well-formed', () => {
  test('every entry declares a kind, a canonical string, and what it grounds', () => {
    for (const w of WORKS) {
      assert.ok(w.id, 'every work has an id');
      assert.ok(WORK_KINDS.includes(w.kind), `${w.id}: kind must be one of ${WORK_KINDS}`);
      assert.ok(w.work && w.work.length > 2, `${w.id}: canonical citation string`);
      assert.ok(w.grounds && w.grounds.length > 20,
        `${w.id}: must say what it grounds — a registry of titles nobody can use is a bibliography, not a pipeline`);
      assert.ok(Array.isArray(w.aliases), `${w.id}: aliases array (may be empty)`);
    }
  });

  test('ids and citation strings are unique — no work has two identities', () => {
    const ids = WORKS.map(w => w.id);
    assert.equal(new Set(ids).size, ids.length, 'duplicate work id');
    const strings = WORKS.flatMap(w => [w.work, ...w.aliases]);
    assert.equal(new Set(strings).size, strings.length,
      'a citation string maps to two works — resolution would be ambiguous');
  });

  test('every scholarship entry points at its brief in docs/scholarship/', () => {
    for (const w of WORKS.filter(w => w.kind === 'scholarship')) {
      assert.match(w.report ?? '', /^docs\/scholarship\/[a-z]+\.md$/,
        `${w.id}: scholarship must link the brief that summarises it`);
    }
  });

  test('lookup works by string, alias, and id', () => {
    assert.equal(resolveWork('Fanger, Rewriting Magic')?.id, 'fanger-rewriting');
    assert.equal(resolveWork('Sophie Page, Magic in the Cloister')?.id, 'page-cloister',
      'an alias resolves to the same work as its canonical string');
    assert.equal(resolveWork('Some Book I Just Invented'), null);
    assert.equal(workById('rb')?.kind, 'primary');
    assert.ok(canonicalWorkStrings().includes('Kieckhefer, Magic in the Middle Ages'));
  });
});

describe('Every citation in the game resolves to the registry', () => {
  const report = citationReport(MODULES);

  test('no unresolved citations anywhere in content or data', () => {
    assert.deepEqual(report.unresolved, [],
      'these citation strings are not in src/data/works.js. Add the work to the ' +
      'registry (which forces a decision about what kind of claim it is), then ' +
      'cite its canonical string — do not invent a citation in a content file.');
  });

  test('NO content cites a digest — a summary is a finding aid, not an authority', () => {
    // The rule that would have caught the sexual-temptation error
    // sooner (docs/RESEARCH_PIPELINE.md §5): a claim that arrives via a
    // summary gets traced to the work it summarises, and carries
    // verify:true until someone has seen it there.
    const digestIds = WORKS.filter(w => w.kind === 'digest').map(w => w.id);
    for (const id of digestIds) {
      assert.equal(report.byWork.get(id) ?? 0, 0,
        `content cites the digest "${id}". Cite the work it summarises instead, ` +
        'and mark the record verify:true (CLAUDE.md rule 11).');
    }
    assert.ok(digestIds.length > 0, 'the digests we actually worked from are registered');
    assert.ok(!CITABLE_KINDS.includes('digest'), 'digest is not a citable kind');
  });

  test('the game actually cites a substantial body of work', () => {
    assert.ok(report.total > 100, `only ${report.total} citations found — did a module fail to load?`);
    const cited = WORKS.filter(w => report.byWork.has(w.id)).length;
    assert.ok(cited >= 15, `only ${cited} registry works are cited`);
  });

  test('the pillars of the bibliography are load-bearing, not decorative', () => {
    // If the game stopped resting on Fanger, something has gone wrong
    // with its premises, not just its citations.
    assert.ok((report.byWork.get('fanger-rewriting') ?? 0) >= 10,
      'Fanger is the canonical interpretive source (DESIGN.md) and should be cited like it');
    assert.ok((report.byWork.get('rb') ?? 0) >= 10,
      'the Rule governs the horarium; it should be cited throughout');
    for (const id of ['kieckhefer-magic', 'page-cloister', 'bailey-boundaries', 'peters-magician']) {
      assert.ok((report.byWork.get(id) ?? 0) >= 1, `${id} is in the registry but grounds nothing`);
    }
  });

  test('scholarship outweighs our own design rationale', () => {
    const grounded = report.byKind.primary + report.byKind.scholarship;
    assert.ok(grounded > report.byKind.design,
      `design-only citations (${report.byKind.design}) must not outnumber pinned ones (${grounded}) — ` +
      'that would mean the game mostly rests on our own say-so');
  });

  test('the unpinned-practice debt is visible and bounded', () => {
    // period-practice is real knowledge that is not yet pinned to a
    // page. It is allowed, it is counted, and it is Research Queue
    // pressure (BIBLIOGRAPHY.md). If this ratio climbs, the game is
    // drifting from scholarship toward plausible-sounding assertion.
    const share = report.byKind['period-practice'] / report.total;
    assert.ok(share < 0.5,
      `${Math.round(share * 100)}% of citations are unpinned period practice; the cap is 50%. ` +
      'Pin some to real loci before adding more.');
  });

  test('REPORT — what this game rests on', () => {
    // Not an assertion so much as a printout: `npm test` should show,
    // every run, which scholarship is actually load-bearing.
    console.log(`    ${report.total} citations across ${MODULES.length} modules`);
    for (const kind of WORK_KINDS) {
      const pct = Math.round((report.byKind[kind] / report.total) * 100);
      console.log(`      ${kind.padEnd(16)} ${String(report.byKind[kind]).padStart(4)}  (${pct}%)`);
    }
    const top = [...report.byWork.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
    console.log('      most load-bearing:');
    for (const [id, n] of top) console.log(`        ${String(n).padStart(3)}  ${id}`);
    if (report.uncited.length) console.log(`      in the registry but uncited: ${report.uncited.join(', ')}`);
    assert.ok(true);
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
