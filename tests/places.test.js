/**
 * MORIGNY — the abbey as production environment, and the house's
 * several minds (docs/LOOP_SYNTHESIS.md §5–6).
 */

import { strict as assert } from 'assert';
import { PLACES, PLACE_IDS, placeById, allAffordances } from '../src/data/places.js';
import {
  FACTIONS, FACTION_IDS, createFactions, loadFactions, adjust,
  reactTo, judgePurity, ecclesiasticalPressure, poles,
} from '../src/engine/factions.js';

const STATUSES = ['attested', 'adapted', 'invented'];

describe('The abbey is a plant, not a backdrop', () => {
  test('every place declares affordances, a line, and its provenance', () => {
    assert.ok(PLACE_IDS.length >= 6, 'Page gives us more room than a scriptorium');
    for (const id of PLACE_IDS) {
      const p = PLACES[id];
      assert.ok(/^[A-Z]$/.test(p.key), `${id}: a daylight letter`);
      assert.ok(p.label && p.line.length > 25, `${id}: a line the UI can quote`);
      assert.ok(p.affords.length >= 1, `${id}: affords something`);
      assert.ok(STATUSES.includes(p.status), `${id}: status marked`);
      assert.ok(p.sources.length > 0, `${id}: sourced`);
    }
  });

  test('place keys are unique — two rooms cannot share a letter', () => {
    const keys = PLACE_IDS.map(id => PLACES[id].key);
    assert.equal(new Set(keys).size, keys.length, `keys collide: ${keys.join(',')}`);
  });

  test('the material infrastructure Page describes is actually present', () => {
    const affords = allAffordances();
    for (const need of ['books', 'restricted', 'herbs', 'metal', 'lead', 'seals', 'private', 'world']) {
      assert.ok(affords.includes(need), `nothing affords "${need}"`);
    }
  });

  test('lookup works, and unknown rooms are null not undefined-ish', () => {
    assert.equal(placeById('workshop').id, 'workshop');
    assert.equal(placeById('crypt'), null);
  });

  test('the private cell exists, because a door that closes is the point', () => {
    assert.ok(PLACES.cell.affords.includes('private'));
  });
});

describe('The house holds several positions at once', () => {
  test('seven factions, each with a stated position', () => {
    assert.equal(FACTION_IDS.length, 7);
    for (const id of FACTION_IDS) {
      assert.ok(FACTIONS[id].label && FACTIONS[id].position.length > 20, id);
      assert.equal(typeof FACTIONS[id].alarmedBy, 'function', id);
    }
  });

  test('the same act divides the house rather than moving one meter', () => {
    const f = createFactions();
    const moved = reactTo(f, { address: 5, exposure: 0, purity: true });
    assert.ok(Object.keys(moved).length >= 2, 'more than one mind changed');
    assert.ok(f.reformer < 0, 'the reformers are alarmed by a command');
    assert.ok(f.ascetic > 0, 'and the ascetic approves of danger undertaken purely');
  });

  test('the ascetic judges purity, not transgression — the good antagonist', () => {
    assert.equal(judgePurity(0, false), 0, 'he does not care what you do at natural rungs');
    assert.equal(judgePurity(4, true), 1, 'dangerous work from a clean state: approval');
    assert.equal(judgePurity(4, false), -2, 'the same work unclean: appalled');
    const pure = createFactions();
    const unclean = createFactions();
    reactTo(pure, { address: 4, purity: true });
    reactTo(unclean, { address: 4, purity: false });
    assert.ok(pure.ascetic > unclean.ascetic);
  });

  test('the administrator reacts to exposure alone — who saw, not what you did', () => {
    const quiet = createFactions();
    const loud = createFactions();
    reactTo(quiet, { address: 6, exposure: 0 });
    reactTo(loud, { address: 1, exposure: 3 });
    assert.equal(quiet.administrator, 0, 'a pact nobody could recognise does not trouble him');
    assert.ok(loud.administrator < 0, 'a trivial act everyone can see does');
  });

  test('the schoolmen and the devout are pleased by low-rung work', () => {
    const f = createFactions();
    reactTo(f, { address: 1, exposure: 0 });
    assert.ok(f.intellectual > 0, 'natural philosophy is a licit study');
    assert.ok(f.devotional > 0);
  });

  test('the pragmatist never moves, which is the joke and the point', () => {
    const f = createFactions();
    reactTo(f, { address: 6, exposure: 3, purity: false });
    assert.equal(f.pragmatist, 0, '"It works. That is sufficient."');
  });

  test('pressure counts only the factions that actually turned', () => {
    const f = createFactions();
    assert.equal(ecclesiasticalPressure(f), 0);
    adjust(f, 'reformer', -4);
    adjust(f, 'devotional', 6);
    assert.equal(ecclesiasticalPressure(f), 4,
      'goodwill elsewhere buys no silence from a man who has decided');
  });

  test('standing is bounded, persists, and unknown factions throw', () => {
    const f = createFactions();
    adjust(f, 'reformer', -99);
    assert.equal(f.reformer, -10);
    adjust(f, 'reformer', 999);
    assert.equal(f.reformer, 10);
    assert.throws(() => adjust(f, 'templars', 1), /unknown faction/);
    assert.equal(loadFactions(JSON.parse(JSON.stringify(f))).reformer, 10);
    assert.equal(loadFactions(undefined).reformer, 0);
  });

  test('poles name a friend and an enemy for the sidebar', () => {
    const f = createFactions();
    adjust(f, 'devotional', 5);
    adjust(f, 'reformer', -5);
    const { friend, enemy } = poles(f);
    assert.equal(friend, 'devotional');
    assert.equal(enemy, 'reformer');
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
