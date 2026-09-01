/**
 * MORIGNY — the house has opinions, plural
 * (docs/LOOP_SYNTHESIS.md §6; decided 2026-09-01).
 *
 * The research is emphatic that a monastery was not one attitude toward
 * magic. Page's St Augustine's was neither a disciplined house nor an
 * occult laboratory: rules were relaxed, monks drank illicit wine, and
 * senior brothers collected magical manuscripts, all at once. So the
 * community holds at least seven positions simultaneously, and the same
 * act pleases one and alarms another.
 *
 * The most useful of them for drama is THE ASCETIC, who does not think
 * John is a witch — he thinks John is not pure enough to be doing what
 * he is doing. That is a far better antagonist, and it is historically
 * exact: the magical texts themselves demanded fasting and purity
 * before invocation. Piety is a prerequisite for dangerous magic, not
 * its opposite.
 *
 * Scalar `john.suspicion` SURVIVES as the derived summary — the
 * chronicle, the summons threshold and the examination all read it —
 * and is computed from the factions that have actually turned
 * (`ecclesiasticalPressure`). Factions add resolution beneath it rather
 * than replacing it.
 */

export const FACTIONS = {
  reformer: {
    id: 'reformer', label: 'the reformers',
    position: 'Magic is corrupting our discipline. Burn the books.',
    // What each faction reads as alarming, per address rung.
    alarmedBy: level => (level >= 2 ? 2 : 0),
  },
  conservative: {
    id: 'conservative', label: 'the disciplined readers',
    position: 'These books are dangerous, and therefore only a disciplined monk should study them.',
    alarmedBy: level => (level >= 5 ? 2 : 0),
  },
  intellectual: {
    id: 'intellectual', label: 'the schoolmen',
    position: 'Some of this is natural philosophy. The terminology misleads.',
    alarmedBy: level => (level >= 4 ? 1 : -1),
  },
  devotional: {
    id: 'devotional', label: 'the devout',
    position: 'The technique is acceptable if it is directed toward God.',
    alarmedBy: level => (level >= 4 ? 2 : -1),
  },
  pragmatist: {
    id: 'pragmatist', label: 'the practical men',
    position: 'It works. That is sufficient.',
    alarmedBy: () => 0,
  },
  administrator: {
    id: 'administrator', label: 'the obedientiaries',
    position: 'Study what you like. Do not let it embarrass the abbey.',
    // The administrator does not care what you did. He cares who saw.
    alarmedBy: () => 0,
  },
  ascetic: {
    id: 'ascetic', label: 'the ascetics',
    position: 'You cannot safely invoke spirits unless your soul has first been purified.',
    alarmedBy: () => 0, // judges purity, not address — see `judgePurity`
  },
};

export const FACTION_IDS = Object.keys(FACTIONS);

export function createFactions() {
  return Object.fromEntries(FACTION_IDS.map(id => [id, 0]));
}

export function loadFactions(saved) {
  const f = createFactions();
  if (saved) for (const id of FACTION_IDS) if (Number.isFinite(saved[id])) f[id] = saved[id];
  return f;
}

const clamp = v => Math.max(-10, Math.min(10, v));

export function adjust(factions, id, n) {
  if (!(id in factions)) throw new Error(`unknown faction: ${id}`);
  factions[id] = clamp(factions[id] + n);
  return factions;
}

/**
 * An operation becomes known (or is guessed at). Each faction reacts by
 * its own lights. `exposure` is the legitimacy gap — how recognisable
 * the act was — and the administrator reacts to that alone.
 */
export function reactTo(factions, { address, exposure = 0, purity = true }) {
  const moved = {};
  for (const id of FACTION_IDS) {
    let delta = -FACTIONS[id].alarmedBy(address);
    if (id === 'administrator') delta = -exposure * 2;
    if (id === 'ascetic') delta = judgePurity(address, purity);
    if (delta) {
      adjust(factions, id, delta);
      moved[id] = delta;
    }
  }
  return moved;
}

/**
 * The ascetic's peculiar judgement: he approves of a man who does
 * dangerous work from a purified state, and is appalled by one who does
 * it unclean. He is the only faction that can be pleased by a high
 * address.
 */
export function judgePurity(address, pure) {
  if (address < 2) return 0;
  return pure ? 1 : -2;
}

/**
 * Ecclesiastical pressure — what the scalar suspicion track reads. Only
 * factions that have actually turned against him contribute; goodwill
 * elsewhere does not buy silence from a man who has decided.
 */
export function ecclesiasticalPressure(factions) {
  return FACTION_IDS.reduce((sum, id) => sum + Math.max(0, -factions[id]), 0);
}

/** Who is most for him and most against him, for the sidebar. */
export function poles(factions) {
  const sorted = [...FACTION_IDS].sort((a, b) => factions[b] - factions[a]);
  return { friend: sorted[0], enemy: sorted[sorted.length - 1] };
}
