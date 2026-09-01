/**
 * MORIGNY — the memory system (v4 step 5, docs/V4_LOOP_REDESIGN.md §4).
 * Vignettes of John's childhood, youth at Orléans, and earlier
 * adulthood, fired at the adult decision points they explain. Each is
 * mostly narrated and carries ONE real choice, which shifts the run a
 * step and is then ECHOED FORWARD: when the adult decision arrives
 * again, the narrator can cite what the boy did.
 *
 * Persisted in `chronicle.memories` — a life remembers across days
 * (the custody/licentia/faculties pattern). Each vignette fires once
 * per chronicle: a memory that recurred every week would be a tic, not
 * a life.
 *
 * Disposition rule (D-21): flashback choices shift disposition by at
 * most one step. Youth explains; the adult record decides. The
 * `MEMORY_DISPOSITION_CAP` is enforced here, not left to the content.
 */

export const MEMORY_DISPOSITION_CAP = 1;

/** Additive load, like every other chronicle block. */
export function loadMemories(saved) {
  return Array.isArray(saved) ? saved.map(m => ({ ...m })) : [];
}

export function hasFired(memories, id) {
  return memories.some(m => m.id === id);
}

/** What the player chose, when the memory fired — null if it never did. */
export function memoryOf(memories, id) {
  return memories.find(m => m.id === id) ?? null;
}

/**
 * The vignette due on this event, or null. First unfired vignette whose
 * trigger matches; content order is priority order.
 */
export function memoryDue(memories, catalog, event) {
  for (const vignette of Object.values(catalog)) {
    if (vignette.trigger === event && !hasFired(memories, vignette.id)) return vignette;
  }
  return null;
}

/**
 * Record the choice and apply its effect. Mutates `memories` and
 * `john`; returns the applied effect for the game-state voice.
 * Disposition is clamped to the cap regardless of what content asks.
 */
export function fireMemory(memories, john, vignette, choice) {
  if (hasFired(memories, vignette.id)) throw new Error(`memory already fired: ${vignette.id}`);
  const applied = {};
  const effect = choice.effect ?? {};

  if (effect.disposition) {
    const step = Math.sign(effect.disposition) * Math.min(Math.abs(effect.disposition), MEMORY_DISPOSITION_CAP);
    john.disposition += step;
    applied.disposition = step;
  }
  if (effect.faculty && john.faculties && effect.faculty in john.faculties) {
    john.faculties[effect.faculty] += 1;
    applied.faculty = effect.faculty;
  }
  memories.push({ id: vignette.id, choice: choice.id });
  return applied;
}

/**
 * The echo: the line a later scene may quote, given what was chosen.
 * Null when the memory never fired or the choice carried no echo —
 * callers must handle null, so a scene never depends on a memory the
 * player was never shown.
 */
export function echoFor(memories, catalog, id) {
  const fired = memoryOf(memories, id);
  if (!fired) return null;
  const vignette = catalog[id];
  const choice = vignette?.choices.find(c => c.id === fired.choice);
  return choice?.echo ?? null;
}
