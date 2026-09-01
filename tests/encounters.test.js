/**
 * MORIGNY encounter-pool tests (v4 §6b) — the escalation ladder, the
 * risk bag, faculty×affordance gating, and the property that matters
 * most: no two runs meet the same world.
 */

import { strict as assert } from 'assert';
import { SeededRandom } from '../src/engine/random.js';
import { createJohn } from '../src/engine/state.js';
import { createFaculties } from '../src/engine/faculties.js';
import {
  REGISTERS, TIERS, RISK_TOKENS,
  createRiskBag, loadRiskBag, addRisk,
  buildEncounterDeck, eligible, drawEncounter, spendEncounter,
  optionAvailable, availableOptions, applyOption,
} from '../src/engine/encounters.js';
import { ENCOUNTERS } from '../src/content/encounters.js';

const STATUSES = ['attested', 'adapted', 'invented'];

function lint(record, label) {
  assert.ok(STATUSES.includes(record.status), `${label}: status must be marked`);
  assert.ok(Array.isArray(record.sources), `${label}: sources array required`);
  if (record.status !== 'invented') {
    assert.ok(record.sources.length > 0, `${label}: ${record.status} needs sources`);
    for (const s of record.sources) assert.ok(s.work && s.locus, `${label}: work and locus`);
  }
}

const ctx = (over = {}) => ({
  affordances: ['cloister'],
  faculties: createFaculties(),
  disposition: 0,
  risk: createRiskBag(),
  days: 10,
  fired: [],
  ...over,
});

describe('The risk bag', () => {
  test('tokens start empty, accumulate, and never go negative', () => {
    const bag = createRiskBag();
    assert.deepEqual(Object.keys(bag).sort(), [...RISK_TOKENS].sort());
    addRisk(bag, 'heresy', 2);
    assert.equal(bag.heresy, 2);
    addRisk(bag, 'heresy', -5);
    assert.equal(bag.heresy, 0, 'a bag cannot owe risk');
    assert.throws(() => addRisk(bag, 'hubris'), /unknown risk token/);
  });

  test('an old save loads as an empty bag', () => {
    assert.deepEqual(loadRiskBag(undefined), createRiskBag());
    assert.equal(loadRiskBag({ heresy: 3 }).heresy, 3);
  });
});

describe('The escalation ladder', () => {
  test('the deck is shuffled within tier and ordered across tiers', () => {
    const deck = buildEncounterDeck(new SeededRandom('ladder'), ENCOUNTERS);
    const tiers = deck.map(id => ENCOUNTERS[id].tier);
    const firstGrave = tiers.indexOf('grave');
    const lastMinor = tiers.lastIndexOf('minor');
    assert.ok(lastMinor < firstGrave, 'no grave card sits above a minor one');
    assert.equal(deck.length, Object.keys(ENCOUNTERS).length, 'every encounter is in the deck');
  });

  test('different seeds order the same tier differently', () => {
    const a = buildEncounterDeck(new SeededRandom('seed-a'), ENCOUNTERS).join();
    const b = buildEncounterDeck(new SeededRandom('seed-b'), ENCOUNTERS).join();
    assert.notEqual(a, b, 'two runs do not meet the world in the same order');
  });

  test('the same seed replays exactly', () => {
    const a = buildEncounterDeck(new SeededRandom('same'), ENCOUNTERS).join();
    const b = buildEncounterDeck(new SeededRandom('same'), ENCOUNTERS).join();
    assert.equal(a, b);
  });
});

describe('Eligibility', () => {
  test('affordances gate: a cloister encounter does not fire on the road', () => {
    const enc = ENCOUNTERS['armarius-count'];
    assert.equal(eligible(enc, ctx()), true);
    assert.equal(eligible(enc, ctx({ affordances: ['road'] })), false);
  });

  test('a one-shot already fired is never eligible again', () => {
    const enc = ENCOUNTERS['armarius-count'];
    assert.equal(eligible(enc, ctx({ fired: ['armarius-count'] })), false);
  });

  test('grave encounters wait for the risk the player actually accrued', () => {
    const enc = ENCOUNTERS['denunciation'];
    assert.equal(eligible(enc, ctx()), false, 'no heresy risk, no denunciation');
    const risk = createRiskBag();
    addRisk(risk, 'heresy', 2);
    assert.equal(eligible(enc, ctx({ risk })), true, 'the letter is a consequence, not weather');
  });

  test('day requirements hold the majors back from day one', () => {
    assert.equal(eligible(ENCOUNTERS['abbots-commission'], ctx({ days: 1 })), false);
    assert.equal(eligible(ENCOUNTERS['abbots-commission'], ctx({ days: 2 })), true);
  });
});

describe('Drawing and spending', () => {
  test('the draw takes the first eligible card and leaves the rest in place', () => {
    const deck = buildEncounterDeck(new SeededRandom('draw'), ENCOUNTERS);
    const before = deck.length;
    const drawn = drawEncounter(deck, ENCOUNTERS, ctx({ days: 1 }));
    assert.ok(drawn, 'something is always available on an ordinary day');
    assert.equal(drawn.encounter.tier, 'minor', 'day one meets the shallow end');
    const fired = [];
    spendEncounter(deck, fired, drawn.encounter, drawn.index);
    assert.equal(deck.length, before - 1);
    assert.deepEqual(fired, [drawn.encounter.id]);
    assert.equal(deck.includes(drawn.encounter.id), false);
  });

  test('an ineligible card is skipped, not discarded — it waits for its run', () => {
    const deck = ['denunciation', 'armarius-count'];
    const drawn = drawEncounter(deck, ENCOUNTERS, ctx({ days: 1 }));
    assert.equal(drawn.encounter.id, 'armarius-count');
    assert.equal(deck.includes('denunciation'), true, 'the grave card is still there for later');
  });

  test('an exhausted deck draws nothing rather than throwing', () => {
    assert.equal(drawEncounter([], ENCOUNTERS, ctx()), null);
  });

  test('no single run can meet the whole pool: the deck outlasts the days', () => {
    // A generous run: 8 days, at most one encounter each.
    const deck = buildEncounterDeck(new SeededRandom('run'), ENCOUNTERS);
    const fired = [];
    const risk = createRiskBag();
    for (const t of RISK_TOKENS) addRisk(risk, t, 5); // maximally exposed
    for (let day = 1; day <= 8; day++) {
      const drawn = drawEncounter(deck, ENCOUNTERS, ctx({ days: day, fired, risk, disposition: 3 }));
      if (drawn) spendEncounter(deck, fired, drawn.encounter, drawn.index);
    }
    assert.ok(deck.length > 0, 'content is left unseen by design');
    assert.ok(fired.length <= 8);
  });
});

describe('Faculty × affordance option gating', () => {
  test('an untrained John does not see the trained option, and is told why when he does', () => {
    const enc = ENCOUNTERS['archdeacons-clerk'];
    const charm = enc.options.find(o => o.id === 'charm');
    assert.equal(optionAvailable(charm, ctx()).available, false, 'worldliness 0 cannot charm');
    const faculties = createFaculties();
    faculties.worldliness = 1;
    const open = optionAvailable(charm, ctx({ faculties }));
    assert.equal(open.available, true);
    assert.equal(open.unlockedBy, 'worldliness', 'the UI can say which faculty opened this');
  });

  test('every encounter leaves at least one option open to a wholly untrained John', () => {
    for (const enc of Object.values(ENCOUNTERS)) {
      const open = availableOptions(enc, ctx({ disposition: 0 }));
      assert.ok(open.length >= 1, `${enc.id}: a raw novice must still be able to act`);
    }
  });

  test('the radical options are gated on a lean already earned', () => {
    const jurisdiction = ENCOUNTERS['commission-of-inquiry'].options.find(o => o.id === 'jurisdiction');
    assert.equal(optionAvailable(jurisdiction, ctx({ disposition: 0 })).available, false,
      'a sudden hot temper is not a different life (chronicle.test.js says the same)');
    assert.equal(optionAvailable(jurisdiction, ctx({ disposition: 2 })).available, true);
  });
});

describe('Applying an option', () => {
  test('state and risk both move, and the applied record reports both', () => {
    const john = createJohn();
    const risk = createRiskBag();
    const option = ENCOUNTERS['stationers-quire'].options.find(o => o.id === 'buy');
    const applied = applyOption(option, john, risk);
    assert.equal(john.disposition, 1);
    assert.equal(risk.exposure, 1);
    assert.equal(risk.debt, 1);
    assert.equal(applied.state.disposition, 1);
    assert.deepEqual(applied.risk, { exposure: 1, debt: 1 });
  });

  test('state fields never go negative', () => {
    const john = createJohn();
    john.suspicion = 1;
    applyOption({ effect: { suspicion: -5 } }, john, createRiskBag());
    assert.equal(john.suspicion, 0);
  });
});

describe('Encounter writing coverage and provenance', () => {
  test('every encounter: register, tier, rubric, both voices, ≥2 options', () => {
    for (const enc of Object.values(ENCOUNTERS)) {
      assert.ok(REGISTERS.includes(enc.register), `${enc.id}: declares a register (D-21)`);
      assert.ok(TIERS.includes(enc.tier), `${enc.id}: declares a tier`);
      assert.ok(enc.rubric.startsWith('¶'), `${enc.id}: rubricated`);
      lint(enc.narrator, `${enc.id} narrator`);
      lint(enc.monologue, `${enc.id} monologue`);
      assert.ok(enc.options.length >= 2, `${enc.id}: an encounter with one road is a cutscene`);
    }
  });

  test('every option: unique key, legible stakes, an outcome in both voices', () => {
    for (const enc of Object.values(ENCOUNTERS)) {
      const keys = enc.options.map(o => o.key);
      assert.ok(keys.every(k => /^[A-Z]$/.test(k ?? '')), `${enc.id}: single-letter keys`);
      assert.equal(new Set(keys).size, keys.length, `${enc.id}: keys collide — ${keys.join(',')}`);
      for (const o of enc.options) {
        assert.ok(o.label && o.why, `${enc.id}/${o.id}: label and why (rule 10)`);
        lint(o.outcome.narrator, `${enc.id}/${o.id} outcome narrator`);
        lint(o.outcome.monologue, `${enc.id}/${o.id} outcome monologue`);
      }
    }
  });

  test('axis-moving options name their lean at the point of choice', () => {
    for (const enc of Object.values(ENCOUNTERS)) {
      for (const o of enc.options) {
        if (o.effect?.disposition) {
          assert.match(o.why, /Radical|Obedient/,
            `${enc.id}/${o.id}: WORLD_DESIGN §4.5 — the lean is legible before committing`);
        }
      }
    }
  });

  test('all three registers are populated, and the ladder has every rung', () => {
    for (const r of REGISTERS) {
      assert.ok(Object.values(ENCOUNTERS).some(e => e.register === r), `no ${r} encounters`);
    }
    for (const t of TIERS) {
      assert.ok(Object.values(ENCOUNTERS).some(e => e.tier === t), `no ${t} encounters`);
    }
  });

  test('the underworld stays rare (PACING §1: the danger is in him, not down the road)', () => {
    const all = Object.values(ENCOUNTERS);
    const underworld = all.filter(e => e.register === 'underworld').length;
    assert.ok(underworld / all.length <= 0.4,
      `underworld is ${underworld}/${all.length} — it must not become a shop you visit`);
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
