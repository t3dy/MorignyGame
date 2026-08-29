/**
 * MORIGNY content tests — the provenance lint and writing coverage.
 * These enforce morigny/CLAUDE.md rules 1-3 mechanically: no unsourced
 * content, invention always marked, every state has writing.
 */

import { strict as assert } from 'assert';
import { HOURS, HOUR_ORDER } from '../src/data/hours.js';
import {
  BIBLIO, HOUR_TEXT, VERSICLE, PROCEDURE_PRAYER, COMPLINE_PRAYER,
  DISTRACTIONS, TIER_TEXT, NIGHT_DELIBERATION, NIGHT_CHOICES, NIGHT_OUTCOMES, CONFESSION,
  VISION_TELLS, VISION_SCENE, DREAM_SHUT, DISCERNMENT_OUTCOMES,
  PENCIL_NOTES, DAYLIGHT, CONTENT_NOTE,
} from '../src/content/content.js';
import { COMMANDS, LETTERS, NIGHT_KEYS } from '../src/engine/commands.js';
import { NIGHT_VERBS } from '../src/engine/struggle.js';

const STATUSES = ['attested', 'adapted', 'invented'];

/** The envelope lint: morigny/CLAUDE.md rule 1. */
function lint(record, label) {
  assert.ok(STATUSES.includes(record.status), `${label}: status must be marked`);
  assert.ok(Array.isArray(record.sources), `${label}: sources array required`);
  if (record.status === 'attested' || record.status === 'adapted') {
    assert.ok(record.sources.length > 0, `${label}: ${record.status} needs sources`);
    for (const s of record.sources) {
      assert.ok(s.work && s.work.length > 0, `${label}: source needs a work`);
      assert.ok(s.locus && s.locus.length > 0, `${label}: source needs a locus`);
    }
  }
}

/** A scene record is either legacy single-voice ({body,...}) or the
 *  narrator+monologue split (STYLE_GUIDE.md §The Four Hands); lint
 *  whichever sub-records actually carry an envelope. */
function lintScene(record, label) {
  if (record.narrator || record.monologue) {
    if (record.narrator) lint(record.narrator, `${label}.narrator`);
    if (record.monologue) lint(record.monologue, `${label}.monologue`);
  } else {
    lint(record, label);
  }
}

function sceneText(record) {
  if (record.narrator || record.monologue) {
    return [record.narrator?.text, record.monologue?.text].filter(Boolean).join(' ');
  }
  return record.body ?? '';
}

describe('Provenance lint (no unsourced content)', () => {
  test('hours data carries the envelope', () => {
    for (const h of HOURS) lint(h, `hours.${h.id}`);
  });

  test('hour texts, prayers, scenes, distractions, notes all pass', () => {
    for (const [id, t] of Object.entries(HOUR_TEXT)) lintScene(t, `HOUR_TEXT.${id}`);
    lint(VERSICLE, 'VERSICLE');
    lint(PROCEDURE_PRAYER, 'PROCEDURE_PRAYER');
    lint(COMPLINE_PRAYER, 'COMPLINE_PRAYER');
    lint(VISION_SCENE, 'VISION_SCENE');
    lint(DREAM_SHUT, 'DREAM_SHUT');
    lintScene(DAYLIGHT, 'DAYLIGHT');
    for (const [tier, t] of Object.entries(NIGHT_DELIBERATION)) lintScene(t, `NIGHT_DELIBERATION.${tier}`);
    for (const k of ['offerPolluted', 'offerClean']) lintScene(CONFESSION[k], `CONFESSION.${k}`);
    for (const d of DISTRACTIONS) lint(d, `DISTRACTIONS.${d.id}`);
    for (const n of PENCIL_NOTES) lint(n, `PENCIL_NOTES.${n.id}`);
  });

  test('the liturgy we attest is real and cited; John\'s prayer is honestly invented', () => {
    assert.equal(VERSICLE.status, 'attested');
    assert.ok(VERSICLE.sources.some(s => /Vulgate/.test(s.work)));
    assert.equal(COMPLINE_PRAYER.status, 'attested');
    // Until the Fanger-Watson edition is verified against, the procedure
    // prayer MUST NOT claim attestation (CLAUDE.md rule 2).
    assert.equal(PROCEDURE_PRAYER.status, 'invented');
  });

  test('pencil notes cite real bibliography entries', () => {
    for (const n of PENCIL_NOTES) {
      assert.ok(n.cites?.length > 0, `${n.id} must cite`);
      for (const c of n.cites) assert.ok(BIBLIO[c], `${n.id} cites unknown key ${c}`);
    }
  });
});

describe('Writing coverage (every state has writing)', () => {
  test('every canonical hour has rubric and body', () => {
    for (const id of HOUR_ORDER) {
      assert.ok(HOUR_TEXT[id]?.rubric?.length > 0, `${id} rubric`);
      assert.ok(sceneText(HOUR_TEXT[id]).length > 20, `${id} body`);
    }
  });

  test('every pressure tier has interiority', () => {
    for (const tier of ['QUIET', 'STIRRED', 'BESIEGED', 'CRISIS']) {
      assert.ok(TIER_TEXT[tier]?.length > 20, tier);
    }
  });

  test('the night deliberation narrates and thinks, per tier, in the right register', () => {
    for (const tier of ['QUIET', 'STIRRED', 'BESIEGED', 'CRISIS']) {
      const scene = NIGHT_DELIBERATION[tier];
      assert.ok(scene.narrator?.text?.length > 20, `${tier} narrator`);
      assert.ok(scene.monologue?.text?.length > 20, `${tier} monologue`);
    }
    // STYLE_GUIDE.md's binding split: the narrator may be direct, John's
    // own words never go clinical, no matter what the narrator just said.
    const besieged = NIGHT_DELIBERATION.BESIEGED;
    assert.ok(!/masturbat|arous|sex/i.test(besieged.monologue.text),
      "John's own monologue must stay in period idiom, even at BESIEGED");
    assert.ok(/flesh|enemy|siege|temptation/i.test(besieged.monologue.text),
      'and it should actually use that idiom, not just avoid modern words');
  });

  test('the daylight fork (obedience vs. the Work) states both roads and their feel', () => {
    assert.ok(DAYLIGHT.narrator.text.length > 20);
    assert.ok(DAYLIGHT.monologue.text.length > 20);
    assert.ok(/commentary|Matthew|assigned/i.test(DAYLIGHT.narrator.text), 'names the safe task');
    assert.ok(/Work/i.test(DAYLIGHT.monologue.text), 'and the monologue names the risk');
  });

  test('every night verb has a choice line and all three outcomes', () => {
    for (const verb of NIGHT_VERBS) {
      assert.ok(NIGHT_CHOICES[verb]?.length > 0, `${verb} choice`);
      for (const outcome of ['mastery', 'endured', 'lapse']) {
        assert.ok(NIGHT_OUTCOMES[verb]?.[outcome]?.length > 20, `${verb}.${outcome}`);
      }
    }
  });

  test('confession has all five beats', () => {
    for (const k of ['offerPolluted', 'offerClean']) {
      assert.ok(sceneText(CONFESSION[k]).length > 20, k);
    }
    for (const k of ['confess', 'delay', 'scruple']) {
      assert.ok(CONFESSION[k]?.length > 20, k);
    }
  });

  test('discernment: all tells (true/false/ambiguous) and all four outcomes', () => {
    for (const cat of ['color', 'speech', 'affect']) {
      for (const variant of ['true_', 'false_', 'ambiguous']) {
        assert.ok(VISION_TELLS[cat]?.[variant]?.length > 20, `${cat}.${variant}`);
      }
    }
    for (const k of ['licentia', 'delayed', 'corrupted', 'mastery']) {
      assert.ok(DISCERNMENT_OUTCOMES[k]?.length > 20, k);
    }
  });

  test('every distraction speaks, in a known register', () => {
    const kinds = ['mundane', 'memory', 'flesh', 'pencil'];
    assert.ok(DISTRACTIONS.length >= 8, 'a margin needs a population');
    for (const d of DISTRACTIONS) {
      assert.ok(kinds.includes(d.kind), `${d.id} kind`);
      assert.ok(d.text.length > 10, `${d.id} text`);
      assert.ok(Number.isFinite(d.effects.pressure) && Number.isFinite(d.effects.despair), `${d.id} effects`);
    }
    assert.ok(DISTRACTIONS.some(d => d.kind === 'pencil'), 'the scholarship must also tempt');
  });

  test('the content note holds its canonical commitments', () => {
    assert.ok(/Nothing is explicitly depicted/.test(CONTENT_NOTE));
    assert.ok(/dignity/.test(CONTENT_NOTE));
  });
});

describe('The command alphabet', () => {
  test('all 26 letters, each with verb, gloss, and a refusal in voice', () => {
    assert.equal(LETTERS.length, 26);
    assert.deepEqual([...LETTERS].sort().join(''), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    for (const letter of LETTERS) {
      const c = COMMANDS[letter];
      assert.ok(c.verb?.length > 0, `${letter} verb`);
      assert.ok(c.gloss?.length > 0, `${letter} gloss`);
      assert.ok(c.refusal?.length > 10, `${letter} refusal — the "Not here!" is worldbuilding`);
    }
  });

  test('night keys cover the struggle verbs (Y stands apart, as consent must)', () => {
    assert.deepEqual(Object.values(NIGHT_KEYS).sort(), [...NIGHT_VERBS].sort());
    assert.ok(!Object.keys(NIGHT_KEYS).includes('Y'));
    assert.equal(COMMANDS.Y.verb, 'Yield');
  });

  test('A-Attack exists and its refusal promises the day that may come', () => {
    assert.equal(COMMANDS.A.verb, 'Attack');
    assert.ok(/psalter/.test(COMMANDS.A.refusal));
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
