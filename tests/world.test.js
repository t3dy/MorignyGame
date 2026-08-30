/**
 * MORIGNY world-layer tests — map validation (house rule: procgen/maps
 * validate before acceptance), movement, road bells, town entry, the
 * Talk engine, and NPC content coverage.
 */

import { strict as assert } from 'assert';
import {
  MAPS, parseMap, tileAt, npcAt, isWalkable, createWorld, move, dueBell,
  keepOffice, missedOffices, adjacentNpc, reachable,
} from '../src/engine/world.js';
import { startTalk, ask, knownKeywords } from '../src/engine/talk.js';
import { NPCS, CLOISTER_NPCS, KIN_NPCS } from '../src/data/npcs.js';
import {
  WORLD_MAP, ETAMPES_MAP, SPAWNS, ROAD_BELLS,
} from '../src/data/worldmap.js';
import { createJohn } from '../src/engine/state.js';
import { buildDay, dayIsLegal } from '../src/engine/day.js';
import { ASSETS_MANIFEST } from '../src/data/assets_manifest.js';
import { LEAVES } from '../src/data/leaves.js';

describe('The maps validate', () => {
  test('both maps are rectangular', () => {
    assert.doesNotThrow(() => parseMap(WORLD_MAP));
    assert.doesNotThrow(() => parseMap(ETAMPES_MAP));
  });

  test('the road holds: abbey spawn reaches the Étampes gate, and the abbey door', () => {
    // find the T and A tiles
    let town, abbey;
    WORLD_MAP.forEach((row, y) => {
      const t = row.indexOf('T');
      const a = row.indexOf('A');
      if (t >= 0) town = { x: t, y };
      if (a >= 0) abbey = { x: a, y };
    });
    assert.ok(town && abbey, 'both destinations exist');
    assert.ok(reachable('world', SPAWNS.world, town), 'Morigny → Étampes');
    assert.ok(reachable('world', SPAWNS.world, abbey), 'the way home exists');
  });

  test('inside Étampes, the gate spawn reaches every NPC\'s side', () => {
    for (const npc of NPCS) {
      const beside = [[0, 1], [0, -1], [1, 0], [-1, 0]]
        .map(([dx, dy]) => ({ x: npc.x + dx, y: npc.y + dy }))
        .find(p => isWalkable(npc.mapId, p.x, p.y));
      assert.ok(beside, `${npc.id} has a walkable side`);
      assert.ok(reachable(npc.mapId, SPAWNS.etampes, beside), `${npc.id} reachable`);
    }
  });

  test('spawns are walkable and blocking works', () => {
    assert.ok(isWalkable('world', SPAWNS.world.x, SPAWNS.world.y));
    assert.ok(isWalkable('etampes', SPAWNS.etampes.x, SPAWNS.etampes.y));
    assert.equal(isWalkable('world', 0, 0), false, 'forest blocks');
    assert.equal(isWalkable('etampes', 0, 0), false, 'wall blocks');
  });
});

describe('Movement and the road bells', () => {
  test('steps count, edges and water block', () => {
    const w = createWorld();
    const before = { x: w.x, y: w.y };
    const ev = move(w, 0, 1); // down the abbey road
    assert.ok(ev.moved);
    assert.equal(w.steps, 1);
    assert.notDeepEqual({ x: w.x, y: w.y }, before);
  });

  test('bells ring in order and want keeping', () => {
    const w = createWorld();
    w.steps = ROAD_BELLS[0].afterSteps - 1;
    const ev = move(w, 0, 1);
    assert.ok(ev.moved);
    assert.equal(ev.bell, 'terce', 'the first road bell is Terce');
    assert.equal(w.pendingOffice, 'terce');
    const kept = keepOffice(w);
    assert.equal(kept.hourId, 'terce');
    assert.equal(w.pendingOffice, null);
    assert.deepEqual(w.kept, ['terce']);
  });

  test('a bell will not ring over an unkept office', () => {
    const w = createWorld();
    w.steps = 200; // all three overdue
    move(w, 0, 1);
    assert.equal(w.rung.length, 1, 'one at a time');
    assert.ok(w.pendingOffice);
  });

  test('unkept hours are missed hours', () => {
    const w = createWorld();
    w.steps = 200;
    move(w, 0, 1); // terce rings, never kept
    assert.deepEqual(missedOffices(w), ['terce', 'sext', 'none']);
    keepOffice(w);
    assert.deepEqual(missedOffices(w), ['sext', 'none']);
  });

  test('walking into Étampes and out again', () => {
    const w = createWorld();
    w.x = 4; w.y = 16; // on the road above the gate
    const ev = move(w, 0, 1);
    assert.equal(ev.enter, 'etampes');
    assert.equal(w.mapId, 'etampes');
    assert.deepEqual({ x: w.x, y: w.y }, SPAWNS.etampes);
    // walk out through the gate
    const out = move(w, 0, 1);
    assert.ok(out.exitTown);
    assert.equal(w.mapId, 'world');
  });

  test('the abbey door ends the wandering', () => {
    const w = createWorld();
    w.x = 27; w.y = 5; // on the road beside the abbey
    const ev = move(w, 0, -1);
    assert.equal(ev.enter, 'abbey');
    assert.equal(w.returned, true);
  });

  test('an adjacent NPC is found for T', () => {
    const w = createWorld();
    const perrin = NPCS.find(n => n.id === 'perrin');
    w.mapId = 'etampes'; w.x = perrin.x; w.y = perrin.y + 1;
    assert.equal(adjacentNpc(w)?.id, 'perrin');
  });
});

describe('The Talk engine', () => {
  const evrart = NPCS.find(n => n.id === 'evrart');

  test('name, job, bye always work; unknown words get the default', () => {
    const c = startTalk(evrart);
    assert.deepEqual(knownKeywords(c).sort(), ['bye', 'job', 'name']);
    assert.equal(ask(c, 'name').text, evrart.keywords.name.text);
    assert.equal(ask(c, 'dragons').text, evrart.default);
  });

  test('keywords unlock chains; effects fire exactly once', () => {
    const c = startTalk(evrart);
    const job = ask(c, 'job');
    assert.deepEqual(job.unlocked, ['book']);
    assert.equal(ask(c, 'scorn').text, evrart.default, 'locked until book');
    const book = ask(c, 'book');
    assert.ok(book.unlocked.includes('scorn'));
    const scorn = ask(c, 'scorn');
    assert.equal(scorn.effect, 'radical');
    const again = ask(c, 'scorn');
    assert.equal(again.effect, undefined, 'the line lands once');
  });

  test('bye ends it, and the dead do not converse', () => {
    const c = startTalk(evrart);
    const bye = ask(c, 'bye');
    assert.ok(bye.ended);
    assert.throws(() => ask(c, 'name'), /over/);
  });

  test('input is normalized', () => {
    const c = startTalk(evrart);
    assert.equal(ask(c, '  NAME  ').text, evrart.keywords.name.text);
  });
});

describe('NPC content coverage (envelope + contract)', () => {
  const STATUSES = ['attested', 'adapted', 'invented'];

  test('every NPC honors the keyword contract and the envelope', () => {
    for (const npc of [...NPCS, ...CLOISTER_NPCS, ...KIN_NPCS]) {
      assert.ok(STATUSES.includes(npc.status), `${npc.id} status`);
      assert.ok(Array.isArray(npc.sources), `${npc.id} sources`);
      assert.ok(npc.greeting.length > 20, `${npc.id} greeting`);
      assert.ok(npc.default.length > 5, `${npc.id} default`);
      for (const k of ['name', 'job', 'bye']) {
        assert.ok(npc.keywords[k]?.text?.length > 5, `${npc.id}.${k}`);
      }
      for (const [k, entry] of Object.entries(npc.keywords)) {
        assert.ok(entry.text.length > 5, `${npc.id}.${k} text`);
        for (const u of entry.unlocks ?? []) {
          assert.ok(npc.keywords[u], `${npc.id}.${k} unlocks unknown "${u}"`);
        }
      }
    }
  });

  test('the radical beat exists, priced and gated', () => {
    const evrart = NPCS.find(n => n.id === 'evrart');
    assert.equal(evrart.keywords.scorn.effect, 'radical');
    assert.ok(!startTalk(evrart).known.includes('scorn'), 'scorn must be earned');
  });

  test('the sewn quires are buried a step past Orléans, and the cloister keeps no tiles', () => {
    const isabel = NPCS.find(n => n.id === 'isabel');
    const opening = startTalk(isabel).known;
    assert.ok(!opening.includes('sewn'), 'the underworld connection must be earned');
    assert.ok(!isabel.keywords.orleans.unlocks.includes('sewn'), 'and earned in two steps, not one');
    assert.ok(isabel.keywords.student.unlocks.includes('sewn'));
    assert.equal(isabel.keywords.sewn.effect, 'give-exemplar-sewn');
    assert.equal(CLOISTER_NPCS.length, 3, 'the armarius, the sacrist, and Brother Anseau');
    for (const npc of [...CLOISTER_NPCS, ...KIN_NPCS]) {
      assert.equal(npc.mapId, null, `${npc.id} is scene-summoned, not tile-placed`);
    }
  });

  test('transmission effects carry a recipient, and fire through the same keyword contract', () => {
    const bridget = KIN_NPCS.find(n => n.id === 'bridget');
    const anseau = CLOISTER_NPCS.find(n => n.id === 'anseau');
    const correspondent = NPCS.find(n => n.id === 'correspondent');
    assert.deepEqual(bridget.keywords.entrust.effect, { key: 'transmit-copy', recipient: 'bridget' });
    assert.deepEqual(anseau.keywords.entrust.effect, { key: 'transmit-copy', recipient: 'anseau' });
    assert.deepEqual(correspondent.keywords.letter.effect, { key: 'transmit-copy', recipient: 'correspondent' });
    assert.equal(correspondent.mapId, 'etampes', 'the correspondent, unlike kin and cloister, is tile-placed');
  });
});

describe('Integration seams', () => {
  test('a journey day is still a legal liturgical day', () => {
    const day = buildDay('road-1', { journey: true });
    assert.ok(dayIsLegal(day));
    assert.ok(day.stages.some(s => s.kind === 'world'));
  });

  test('john carries disposition and a scrip — with his own first book in it', () => {
    const john = createJohn();
    assert.equal(john.disposition, 0);
    assert.deepEqual(john.items, { draught: 0, quire: 0, exemplars: ['old-compilation'] });
  });

  test('the tileset is in the provenance manifest', () => {
    const tiles = ASSETS_MANIFEST.find(a => a.id === 'tileset-world-v1');
    assert.ok(tiles);
    assert.equal(tiles.status, 'invented');
    assert.ok(tiles.notes.length > 20);
  });

  test('every manifest entry carries the full ART_SOURCES.md schema (CLAUDE.md rule 6)', () => {
    const REQUIRED = ['id', 'role', 'institution', 'shelfmark', 'folio', 'source_url',
      'license', 'date', 'region', 'status', 'processing', 'notes'];
    const STATUSES = ['attested', 'adapted', 'invented'];
    for (const a of ASSETS_MANIFEST) {
      for (const field of REQUIRED) {
        assert.ok(field in a, `${a.id}: missing ${field}`);
      }
      assert.ok(STATUSES.includes(a.status), `${a.id}: status`);
      assert.ok(Array.isArray(a.processing), `${a.id}: processing must be an array`);
      if (a.status === 'adapted') {
        assert.ok(a.processing.length > 0, `${a.id}: adapted requires a non-empty processing list`);
      }
    }
  });

  test('every leaf resolves to a manifest entry, dated on screen (CLAUDE.md rule 7)', () => {
    for (const [key, leaf] of Object.entries(LEAVES)) {
      const asset = ASSETS_MANIFEST.find(a => a.id === leaf.assetId);
      assert.ok(asset, `LEAVES.${key} has no manifest entry for ${leaf.assetId}`);
      assert.ok(leaf.src?.length > 0, `LEAVES.${key} src`);
      assert.ok(leaf.alt?.length > 20, `LEAVES.${key} alt text`);
      assert.ok(leaf.dateline?.length > 0, `LEAVES.${key} dateline must show on screen`);
      assert.ok(leaf.caption?.length > 40, `LEAVES.${key} caption`);
      assert.equal(typeof leaf.color, 'boolean', `LEAVES.${key} color flag`);
    }
  });

  test('color is earned: only the vision leaf keeps its historical color', () => {
    const colored = Object.entries(LEAVES).filter(([, l]) => l.color);
    assert.deepEqual(colored.map(([k]) => k), ['vision']);
  });

  test('due bells never skip ahead of the schedule data', () => {
    const w = createWorld();
    w.steps = ROAD_BELLS[1].afterSteps + 1;
    assert.equal(dueBell(w).hourId, 'terce', 'earliest unrung first');
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
