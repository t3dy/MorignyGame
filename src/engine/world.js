/**
 * MORIGNY — world layer engine: tile maps, movement, town entry, and the
 * bells that keep the horarium running on the road. Pure and tested.
 */

import {
  WORLD_MAP, ETAMPES_MAP, SPAWNS, ENTER_TILES, BLOCKED, ROAD_BELLS,
} from '../data/worldmap.js';
import { NPCS } from '../data/npcs.js';

export const MAPS = { world: WORLD_MAP, etampes: ETAMPES_MAP };

export function parseMap(rows) {
  const width = rows[0].length;
  for (const row of rows) {
    if (row.length !== width) throw new Error('ragged map row');
  }
  return { rows, width, height: rows.length };
}

export function tileAt(mapId, x, y) {
  const rows = MAPS[mapId];
  if (y < 0 || y >= rows.length || x < 0 || x >= rows[0].length) return null;
  return rows[y][x];
}

export function npcAt(mapId, x, y) {
  return NPCS.find(n => n.mapId === mapId && n.x === x && n.y === y) ?? null;
}

export function isWalkable(mapId, x, y) {
  const t = tileAt(mapId, x, y);
  if (t === null || BLOCKED.has(t)) return false;
  if (npcAt(mapId, x, y)) return false;
  return true;
}

export function createWorld() {
  return {
    mapId: 'world',
    x: SPAWNS.world.x,
    y: SPAWNS.world.y,
    steps: 0,
    rung: [],            // road offices whose bells have sounded
    kept: [],            // road offices actually said (K)
    pendingOffice: null, // a bell waiting on the monk's knees
    returned: false,     // stage over: back inside the abbey
  };
}

/** The next road bell due at this step count, if any. */
export function dueBell(world) {
  return ROAD_BELLS.find(b => world.steps >= b.afterSteps && !world.rung.includes(b.hourId)) ?? null;
}

/**
 * Attempt a move. Returns an event descriptor:
 *  {moved} | {blocked, tile} | {sign} | {enter: 'abbey'|'etampes'} |
 *  {exitTown} | plus bell? when a road office comes due.
 */
export function move(world, dx, dy) {
  const nx = world.x + dx;
  const ny = world.y + dy;
  const t = tileAt(world.mapId, nx, ny);
  const result = {};

  if (t === null) return { blocked: true, tile: 'edge' };
  if (t === 's') return { sign: true };

  if (world.mapId === 'world' && ENTER_TILES[t]) {
    result.enter = ENTER_TILES[t];
    if (result.enter === 'etampes') {
      world.mapId = 'etampes';
      world.x = SPAWNS.etampes.x;
      world.y = SPAWNS.etampes.y;
    } else {
      world.returned = true; // the abbey closes the stage
    }
    return result;
  }

  if (world.mapId === 'etampes' && t === 'G') {
    world.mapId = 'world';
    world.x = SPAWNS.worldFromTown.x;
    world.y = SPAWNS.worldFromTown.y;
    return { exitTown: true };
  }

  if (!isWalkable(world.mapId, nx, ny)) return { blocked: true, tile: t };

  world.x = nx;
  world.y = ny;
  world.steps++;
  result.moved = true;

  const bell = dueBell(world);
  if (bell && !world.pendingOffice) {
    world.rung.push(bell.hourId);
    world.pendingOffice = bell.hourId;
    result.bell = bell.hourId;
  }
  return result;
}

/** Say the pending office where you stand. Returns context for effects. */
export function keepOffice(world) {
  if (!world.pendingOffice) return null;
  const hourId = world.pendingOffice;
  world.pendingOffice = null;
  world.kept.push(hourId);
  return { hourId, inTown: world.mapId === 'etampes' };
}

/** Offices whose bells never rang or were rung and never kept. */
export function missedOffices(world) {
  return ROAD_BELLS.map(b => b.hourId).filter(h => !world.kept.includes(h));
}

/** An adjacent NPC to talk to (T), if any. */
export function adjacentNpc(world) {
  for (const [dx, dy] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
    const n = npcAt(world.mapId, world.x + dx, world.y + dy);
    if (n) return n;
  }
  return null;
}

/** Validation used by tests: BFS walkability between two points. */
export function reachable(mapId, from, to) {
  const rows = MAPS[mapId];
  const seen = new Set([`${from.x},${from.y}`]);
  const queue = [from];
  while (queue.length) {
    const { x, y } = queue.shift();
    if (x === to.x && y === to.y) return true;
    for (const [dx, dy] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
      const nx = x + dx, ny = y + dy;
      const key = `${nx},${ny}`;
      if (seen.has(key)) continue;
      const t = tileAt(mapId, nx, ny);
      // targets (A, T, G) count as reachable destinations even though
      // stepping on them triggers transitions rather than occupancy
      const isTarget = nx === to.x && ny === to.y;
      if (t !== null && (isTarget || (!BLOCKED.has(t) && !npcAt(mapId, nx, ny)))) {
        seen.add(key);
        queue.push({ x: nx, y: ny });
      }
    }
  }
  return false;
}
