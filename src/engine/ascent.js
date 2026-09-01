/**
 * MORIGNY — the angelic ascent: what the pious road actually gets
 * (docs/LOOP_SYNTHESIS.md §7; decided 2026-09-01).
 *
 * The standing risk in this design was that the Marian road became the
 * boring one. The research forbids it: the theurgic texts pursue access
 * to divine knowledge, celestial experience, revelation and spiritual
 * transformation. The difference between the roads is not boring-holy
 * versus cool-evil. It is **relationship versus exploitation.**
 *
 * So the Work, once he has renounced and rebuilt, opens an ascent
 * through the angelic orders, asking for the gifts John actually names
 * in his own figures — memory, eloquence, understanding, perseverance.
 * Three commitments keep it honest:
 *
 * 1. **Nothing is compelled.** Each stage is petitioned for and may be
 *    refused or delayed. God can say no; that is the whole theology
 *    (`ADDRESSES` never exceeds `ambiguous` on this road).
 * 2. **Every gift still has to be discerned.** The ascent does not
 *    exempt him from the problem his life is about. A stage reached in
 *    poor disposition can be counterfeit, and counterfeit gifts are
 *    silent, like everything else silent in this game.
 * 3. **It is spectacular.** This is the road with the strangest content
 *    on it, which is the design's answer to its own objection.
 */

/** The gifts John's figures actually ask for. */
export const GIFTS = {
  memory: {
    id: 'memory', label: 'memory', faculty: 'learning',
    line: 'That what is read once should be held, and held whole.',
  },
  eloquence: {
    id: 'eloquence', label: 'eloquence', faculty: 'worldliness',
    line: 'That the mouth should not betray the mind before strangers.',
  },
  understanding: {
    id: 'understanding', label: 'understanding', faculty: 'discretio',
    line: 'That the sense beneath the sense should open of itself.',
  },
  perseverance: {
    id: 'perseverance', label: 'perseverance', faculty: null,
    line: 'That he should not stop. Of the four, the one he asks for last and needs first.',
  },
};

export const GIFT_IDS = Object.keys(GIFTS);

/** The orders ascended through, in order. */
export const ORDERS = ['angels', 'archangels', 'principalities', 'powers'];

export function createAscent() {
  return { stage: 0, granted: [], refused: 0 };
}

export function loadAscent(saved) {
  const a = createAscent();
  if (!saved) return a;
  if (Number.isFinite(saved.stage)) a.stage = saved.stage;
  if (Array.isArray(saved.granted)) a.granted = saved.granted.map(g => ({ ...g }));
  if (Number.isFinite(saved.refused)) a.refused = saved.refused;
  return a;
}

/** The ascent opens only to a man who has renounced and rebuilt. */
export function ascentOpen(practice) {
  return !!practice.renounced && practice.marian >= 2;
}

export function currentOrder(ascent) {
  return ORDERS[ascent.stage] ?? null;
}

export function complete(ascent) {
  return ascent.stage >= ORDERS.length;
}

/**
 * Petition the next order for a gift. Nothing is compelled: a poorly
 * disposed operator is likelier to be delayed, and a gift received in
 * poor disposition may be counterfeit — silently.
 *
 * @returns { outcome: 'granted'|'delayed', order, gift, counterfeit }
 */
export function petition(rng, ascent, giftId, { disposition = 2 } = {}) {
  if (complete(ascent)) throw new Error('the ascent is finished');
  if (!GIFTS[giftId]) throw new Error(`unknown gift: ${giftId}`);
  if (ascent.granted.some(g => g.gift === giftId)) throw new Error(`already given: ${giftId}`);

  const order = currentOrder(ascent);
  // Disposition raises the chance of an answer; it never guarantees one.
  const chance = Math.max(0.25, Math.min(0.9, 0.45 + 0.12 * disposition));
  if (rng.next() >= chance) {
    ascent.refused += 1;
    return { outcome: 'delayed', order, gift: giftId, counterfeit: false };
  }
  // Granted — but a narrowed knower cannot tell a true gift from a false one.
  const counterfeitChance = disposition <= 0 ? 0.3 : disposition === 1 ? 0.12 : 0;
  const counterfeit = rng.next() < counterfeitChance;
  ascent.granted.push({ gift: giftId, order, counterfeit });
  ascent.stage += 1;
  return { outcome: 'granted', order, gift: giftId, counterfeit };
}

/** Gifts that are what they claim to be. */
export function trueGifts(ascent) {
  return ascent.granted.filter(g => !g.counterfeit);
}

/**
 * What the ascent adds to a faculty. Counterfeit gifts give nothing and
 * say nothing — the operator believes he has them.
 */
export function giftBonus(ascent, facultyId) {
  return trueGifts(ascent).filter(g => GIFTS[g.gift].faculty === facultyId).length;
}
