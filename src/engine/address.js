/**
 * MORIGNY — ADDRESS: the spine (docs/LOOP_SYNTHESIS.md §2, §3).
 *
 * The question the sources say actually mattered was never "is this
 * good magic or evil magic." It was **whom are you addressing, and do
 * you know.** Every operation in the game declares a rung on this
 * ladder, and the whole design hangs off it.
 *
 *   0 NATURAL     "this stone has a hidden virtue"
 *   1 SYMBOLIC    "this figure corresponds to the celestial order"
 *   2 AMBIGUOUS   "I use this name, but I do not know whom it addresses"
 *   3 TACIT       "something intelligent seems to be answering"
 *   4 INVOCATION  "I knowingly call a spirit"
 *   5 COMMAND     "I compel this spirit to act"
 *   6 PACT        "I give something in exchange for its service"
 *
 * THE CENTRAL DESIGN RULE: **the operator does not always know which
 * rung he is on.** Rungs 2–3 are the historical middle where John
 * actually lived — the *tacit pact* problem, where ambiguous characters
 * and figures could constitute demonic commerce with nobody
 * consciously summoning anything. `resolveAddress` therefore
 * distinguishes the address the operator INTENDED from the one the
 * operation actually reached, and the game does not always tell him.
 *
 * LEGITIMACY (§3): an operation also carries the frame it is presented
 * under. Suspicion accrues from the GAP between what an act was and how
 * recognisable as magic it looked — "hidden in plain sight." A
 * nine-week devotional programme and a conjuration can share a rung;
 * only one of them looks like magic to a man walking past the door.
 * And the practitioner often sincerely believes the legitimation, which
 * is why this is not a stealth stat with a moustache.
 *
 * Digest-sourced (docs/research/page-cloister-2026-09-01.txt); the
 * mechanics are ours, the structure carries `verify` (rule 11).
 */

export const ADDRESSES = [
  { level: 0, id: 'natural', label: 'natural operation', line: 'A hidden virtue in the thing itself. Nobody is being spoken to.' },
  { level: 1, id: 'symbolic', label: 'symbolic operation', line: 'The figure answers to the order of the heavens. Still nobody is being spoken to.' },
  { level: 2, id: 'ambiguous', label: 'ambiguous address', line: 'The name is used because the art gives it. Whom it names, the art does not say.' },
  { level: 3, id: 'tacit', label: 'tacit address', line: 'Something is answering. You did not call anything.' },
  { level: 4, id: 'invocation', label: 'invocation', line: 'You call, knowing that you are calling, and knowing what you call.' },
  { level: 5, id: 'command', label: 'command', line: 'You bind it and it obeys, and the obedience is the proof.' },
  { level: 6, id: 'pact', label: 'pact', line: 'Something is given for something. Both parties understand the terms.' },
];

export const ADDRESS_IDS = ADDRESSES.map(a => a.id);
/** Above this rung, the operator is knowingly dealing with a person. */
export const KNOWING_FROM = 4;

export function addressByLevel(level) {
  return ADDRESSES.find(a => a.level === level) ?? null;
}
export function addressById(id) {
  return ADDRESSES.find(a => a.id === id) ?? null;
}

/**
 * The frames an operation can be presented under, and how well each
 * conceals it. `cover` is how much address a frame can plausibly
 * account for before anybody starts asking questions.
 */
export const LEGITIMATIONS = {
  liturgy: { id: 'liturgy', label: 'the liturgy', cover: 3, line: 'It is prayer. It is said at the appointed hour, in the appointed words.' },
  devotion: { id: 'devotion', label: 'private devotion', cover: 3, line: 'A monk at his own prayers is the least remarkable thing in the house.' },
  medicine: { id: 'medicine', label: 'medicine', cover: 2, line: 'The infirmary needs what the infirmary needs, and nobody reads a leechbook twice.' },
  philosophy: { id: 'philosophy', label: 'natural philosophy', cover: 2, line: 'The virtues of stones and stars are a licit study, and the terminology misleads.' },
  astronomy: { id: 'astronomy', label: 'astronomy', cover: 2, line: 'The tables, the sphere, the astrolabe: a quadrivial science with a calendar to compute.' },
  authority: { id: 'authority', label: 'an ancient authority', cover: 1, line: 'Solomon wrote it, or somebody did, and the name has carried it this far.' },
  revelation: { id: 'revelation', label: 'personal revelation', cover: 1, line: 'She told him to. This is either the strongest warrant there is or none at all.' },
  none: { id: 'none', label: 'nothing at all', cover: 0, line: 'It is what it looks like, and it looks like what it is.' },
};

export const LEGITIMATION_IDS = Object.keys(LEGITIMATIONS);

/**
 * What an operation actually reached, given what was intended.
 *
 * The uncertainty is the point. An operation intended at `symbolic` or
 * `ambiguous` can slip a rung — the art's own names may be addressing
 * somebody, and John's whole crisis was discovering that. Slippage is
 * likelier when the operator is poorly disposed and when he has taken
 * the notory road, and it CANNOT happen above KNOWING_FROM: a man who
 * knowingly commands a spirit is not confused about what he is doing.
 *
 * @returns { intended, actual, slipped, knowing }
 */
export function resolveAddress(rng, intendedLevel, { disposition = 2, solomonic = 0 } = {}) {
  const intended = Math.max(0, Math.min(6, intendedLevel));
  if (intended >= KNOWING_FROM) {
    return { intended, actual: intended, slipped: false, knowing: true };
  }
  // Poor disposition and the notory road both widen the crack.
  const chance = Math.min(0.6, 0.08 + 0.06 * Math.max(0, 2 - disposition) + 0.04 * solomonic);
  const slipped = rng.next() < chance;
  const actual = slipped ? Math.min(KNOWING_FROM - 1, intended + 1) : intended;
  return { intended, actual, slipped, knowing: false };
}

/**
 * How much a legitimation fails to cover. Zero when the frame plausibly
 * accounts for the act; positive when it does not.
 */
export function legitimacyGap(actualLevel, legitimationId) {
  const frame = LEGITIMATIONS[legitimationId];
  if (!frame) throw new Error(`unknown legitimation: ${legitimationId}`);
  return Math.max(0, actualLevel - frame.cover);
}

/**
 * Suspicion from an operation. It tracks RECOGNISABILITY, not
 * wickedness: a high address well framed is quiet, and a low address
 * with no frame at all is merely odd.
 */
export function suspicionFor(actualLevel, legitimationId) {
  return legitimacyGap(actualLevel, legitimationId);
}

/**
 * Whether the operator can tell what he did. He can always see his own
 * intention; he sees the truth only when he was knowingly operating, or
 * when his discretio is good enough to catch the slip.
 */
export function operatorPerceives(resolved, discretio = 0) {
  if (resolved.knowing || !resolved.slipped) return resolved.actual;
  return discretio >= 3 ? resolved.actual : resolved.intended;
}

/**
 * The running account of a life's operations. This replaces counting
 * `performances` separately: what a man did is the tally of the rungs
 * he stood on (LOOP_SYNTHESIS §9).
 */
export function createLedger() {
  return { counts: ADDRESSES.map(() => 0), gap: 0, slips: 0 };
}

export function loadLedger(saved) {
  const l = createLedger();
  if (!saved) return l;
  if (Array.isArray(saved.counts) && saved.counts.length === ADDRESSES.length) {
    l.counts = saved.counts.map(n => (Number.isFinite(n) ? n : 0));
  }
  if (Number.isFinite(saved.gap)) l.gap = saved.gap;
  if (Number.isFinite(saved.slips)) l.slips = saved.slips;
  return l;
}

export function record(ledger, resolved, legitimationId) {
  ledger.counts[resolved.actual] += 1;
  ledger.gap += legitimacyGap(resolved.actual, legitimationId);
  if (resolved.slipped) ledger.slips += 1;
  return ledger;
}

/** Operations knowingly conducted with a person on the other end. */
export function knowingOperations(ledger) {
  return ledger.counts.slice(KNOWING_FROM).reduce((a, b) => a + b, 0);
}

/** The highest rung ever stood on. */
export function highWater(ledger) {
  for (let i = ADDRESSES.length - 1; i >= 0; i--) if (ledger.counts[i]) return i;
  return 0;
}
