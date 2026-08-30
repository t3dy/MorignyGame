/**
 * MORIGNY — the stemma codicum: witnesses (finished runs) arranged as a
 * tree of descent, the way editors reconstruct a text's transmission.
 *
 * Every run saves a witness. Each witness descends from the one before it
 * (John copying his own work forward), inherits its corruptions, and adds
 * its own. The siglum system is real editorial practice: A, B, C… for
 * manuscripts, with a lowercase letter for a contaminated witness.
 */

const KEY = 'morigny-witnesses';

/**
 * How an uncorrected copy fault reads as editorial prose. Shared across
 * the stemma (here), the palimpsest's under-text ghost, and the framing
 * ending — one vocabulary, so the apparatus never describes the same
 * fault two different ways depending on where it surfaces.
 */
export const FAULT_PHRASE = {
  eyeskip: 'a silent lacuna, undetected',
  dittography: 'a doubled line, visibly marked and left uncorrected',
  verba_ignota: 'the unknown words, garbled beyond any mending',
  blackened: 'a leaf blackened where two colors fought',
  corrosion: 'the green eating slowly through, a hole where a word was',
};

export function faultPhrase(faultClass) {
  return FAULT_PHRASE[faultClass] ?? `an uncatalogued fault (${faultClass})`;
}

/** Editorial sigla: A, B, … Z, then AA, AB, … */
export function siglumFor(index) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (index < 26) return letters[index];
  const first = Math.floor(index / 26) - 1;
  return letters[first] + letters[index % 26];
}

export function loadWitnesses(storage) {
  try {
    const raw = storage.getItem(KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function saveWitness(storage, witness) {
  const list = loadWitnesses(storage);
  list.push(witness);
  try { storage.setItem(KEY, JSON.stringify(list)); } catch { /* lost, as many were */ }
  return list;
}

/**
 * Corruptions a single run introduced. These are the *textual* consequences
 * of how the day went — the game's ledger read as a manuscript's faults.
 */
export function corruptionsOf(witness) {
  const faults = [];
  if (witness.corrupt) faults.push('a figure copied wrong; the procedure void');
  if (witness.dream === 'shut') faults.push('a lacuna where the vision should stand');
  if (witness.dream === 'drugged') faults.push('a leaf left blank under poppy');
  if (witness.night?.outcome === 'lapse') faults.push('the confession passage scraped and rewritten');
  if (witness.confession === 'delay') faults.push('an unabsolved reading, left standing');
  if (witness.confession === 'scruple') faults.push('the same passage corrected four times over');
  if (!witness.prayed) faults.push('the prayer wanting entirely');
  for (const copy of witness.copies ?? []) {
    for (const f of copy.faults ?? []) faults.push(faultPhrase(f.class));
  }
  return faults;
}

/**
 * Build the stemma. Witnesses descend in sequence; corruptions accumulate
 * down the line (inherited + own), which is exactly how real transmission
 * degrades a text.
 */
export function buildStemma(witnesses) {
  let inherited = [];
  return witnesses.map((w, i) => {
    const own = corruptionsOf(w);
    const node = {
      siglum: w.departed ? siglumFor(i).toLowerCase() : siglumFor(i),
      index: i,
      parent: i === 0 ? null : siglumFor(i - 1),
      witness: w,
      own,
      inherited: [...inherited],
      total: inherited.length + own.length,
      contaminated: !!w.departed,
      licentia: !!w.licentia,
    };
    inherited = [...inherited, ...own];
    return node;
  });
}

/**
 * The witness the modern scholar receives. Not the best copy — the one
 * that *got out*. Transmission beats quality: a licentia-bearing witness
 * that left custody is preferred, else the least corrupt that survives,
 * and a contaminated witness is never received as authentic.
 */
export function survivingWitness(stemma) {
  const candidates = stemma.filter(n => !n.contaminated);
  if (!candidates.length) return null;
  const blessed = candidates.filter(n => n.licentia);
  const pool = blessed.length ? blessed : candidates;
  return pool.reduce((best, n) => (n.total < best.total ? n : best), pool[0]);
}

/**
 * The physical object the modern scholar actually holds — a different
 * question from `survivingWitness` (which day's narrative is the
 * descent's best node). Answers "which copy got out of the room 1323
 * burned": preference is gilded (licentia-marked) over least-corrupt,
 * exactly mirroring `survivingWitness`'s logic at copy granularity.
 * `custody` is `chronicle.custody[]` — copies not yet given away are
 * resolved against `inventoryFinds()` at 1323's arrival; `found: true`
 * means 1323 reached it, `found: false` means it escaped (given away,
 * or simply missed).
 */
export function receivedCopy(custody) {
  const escaped = (custody ?? []).filter(c => !c.found);
  if (!escaped.length) return null;
  const gilded = escaped.filter(c => c.gilded);
  const pool = gilded.length ? gilded : escaped;
  return pool.reduce((best, c) =>
    ((c.faults?.length ?? 0) < (best.faults?.length ?? 0) ? c : best), pool[0]);
}
