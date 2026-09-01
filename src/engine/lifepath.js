/**
 * MORIGNY — the lifepath engine: the prologue that makes the man
 * (rebuilt 2026-09-01 on the real biography).
 *
 * Replaces the old incipit's "Begin at Matins — a day within the walls"
 * / "a road day", which was a mode-select menu wearing a choice's
 * clothes. What a player meets first is now John's early life: Chartres
 * at thirteen, the schools and the canon law, the necromantic book, the
 * physician who steered him to the ars notoria, and the years of
 * keeping it.
 *
 * The prologue ENDS WITH THE ART IN HIS HANDS, not with the
 * renunciation — the campaign then plays the ars notoria years, so
 * teaching Bridget, her affliction, her renunciation and finally his
 * own all happen in play, in the order the sources put them.
 *
 * Choices write into exactly the systems the campaign already reads:
 * faculties, practice, disposition, and the body's starting state. And
 * they are recorded as memories, so the existing echo machinery
 * (engine/memory.js) cites the boy when the man faces the same thing.
 */

import { LIFEPATH } from '../content/lifepath.js';

export const LIFEPATH_IDS = LIFEPATH.map(s => s.id);

/** Where in the prologue a chronicle is; -1 once it is finished. */
export function createLifepath() {
  return { index: 0, done: false, choices: [] };
}

export function loadLifepath(saved) {
  const l = createLifepath();
  if (!saved) return l;
  if (Number.isFinite(saved.index)) l.index = saved.index;
  l.done = !!saved.done;
  if (Array.isArray(saved.choices)) l.choices = saved.choices.map(c => ({ ...c }));
  return l;
}

export function currentScene(lifepath) {
  return lifepath.done ? null : (LIFEPATH[lifepath.index] ?? null);
}

/**
 * Apply a choice and advance. Mutates `john`, `practice` and the
 * lifepath; returns what was applied, for the game-state voice.
 *
 * Disposition from the prologue is capped exactly as memory choices are
 * (one step per scene): youth colours the man, it does not decide him.
 */
export function chooseLifepath(lifepath, john, practice, scene, choice) {
  if (lifepath.done) throw new Error('the prologue is over');
  if (LIFEPATH[lifepath.index]?.id !== scene.id) throw new Error(`not the current scene: ${scene.id}`);

  const applied = { faculty: [], practice: [], state: {} };
  const e = choice.effect ?? {};

  for (const [id, n] of Object.entries(e.faculty ?? {})) {
    if (john.faculties && id in john.faculties) {
      john.faculties[id] += n;
      applied.faculty.push([id, n]);
    }
  }
  for (const [id, n] of Object.entries(e.practice ?? {})) {
    if (id in practice) {
      practice[id] += n;
      applied.practice.push([id, n]);
    }
  }
  for (const field of ['resolve', 'despair', 'pressure', 'fatigue']) {
    if (e[field]) {
      john[field] = Math.max(0, john[field] + e[field]);
      applied.state[field] = e[field];
    }
  }
  if (e.disposition) {
    const step = Math.sign(e.disposition); // one step, always
    john.disposition += step;
    applied.state.disposition = step;
  }

  lifepath.choices.push({ id: scene.id, choice: choice.id });
  lifepath.index += 1;
  if (lifepath.index >= LIFEPATH.length) {
    lifepath.done = true;
    lifepath.index = LIFEPATH.length;
  }
  return applied;
}

/**
 * The prologue's choices in the shape engine/memory.js already
 * understands, so `echoFor` can cite them during play without a second
 * mechanism.
 */
export function asMemories(lifepath) {
  return lifepath.choices.map(c => ({ id: c.id, choice: c.choice }));
}

/** The catalog echoes resolve against. */
export function lifepathCatalog() {
  return Object.fromEntries(LIFEPATH.map(s => [s.id, s]));
}
