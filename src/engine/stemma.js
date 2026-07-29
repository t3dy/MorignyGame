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
