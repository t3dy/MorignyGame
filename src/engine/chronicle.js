/**
 * MORIGNY — the chronicle: what accumulates across witnesses (days played)
 * until history arrives. The talk of the book grows with suspicion and
 * audacity; at the threshold, the summons to Paris comes, and the
 * examination decides which register 1323 happens in.
 *
 * Fixed history stays fixed (morigny/CLAUDE.md rule 5): every verdict
 * burns the book. What varies is John's stance, the manner of the ending,
 * and — only through the marked departure — whether the witness leaves
 * the record entirely.
 */

const KEY = 'morigny-chronicle';

/** Renown ≥ this and the next day opens with the summons. */
export const SUMMONS_AT = 12;

/**
 * `custody`: copies finished but not yet given away — the physical
 * things 1323 can still reach. `everCopied`: set the moment any copy is
 * ever finished, independent of what's still in custody, so the ending
 * can tell "never tried" from "tried, and lost it all" (docs/DECISIONS_
 * AND_FORKS.md F-8). `licentia`: a licence earned in one night's dream
 * but not yet spent on a gilding — the Procedure runs on its own clock
 * of weeks and months (DESIGN.md §3), so a licence earned after that
 * day's scriptorium has already closed carries forward into the next
 * witness's day, until `grindAndApply` spends it on gold (D-18). All
 * three are additive and backward-compatible: an old save with none of
 * them still loads, just with the empty/false defaults.
 */
export function loadChronicle(storage) {
  try {
    const raw = storage.getItem(KEY);
    if (raw) {
      const c = JSON.parse(raw);
      return { custody: [], everCopied: false, licentia: false, ...c };
    }
  } catch { /* an unreadable chronicle is an empty one */ }
  return { days: 0, renown: 0, disposition: 0, examined: false, custody: [], everCopied: false, licentia: false };
}

export function saveChronicle(storage, chronicle) {
  try { storage.setItem(KEY, JSON.stringify(chronicle)); } catch { /* lost */ }
}

export function resetChronicle(storage) {
  const fresh = { days: 0, renown: 0, disposition: 0, examined: false, custody: [], everCopied: false, licentia: false };
  saveChronicle(storage, fresh);
  return fresh;
}

/**
 * Fold a finished day into the chronicle. The book gets talked about
 * through suspicion; audacity carries further than gossip; a prayer said
 * (and above all a licence received) is a thing that exists to be found.
 */
export function recordDay(chronicle, { suspicion = 0, disposition = 0, prayed = false, licentia = false }) {
  chronicle.days += 1;
  chronicle.disposition += disposition;
  chronicle.renown += suspicion + disposition * 2 + (prayed ? 1 : 0) + (licentia ? 2 : 0);
  return chronicle;
}

export function summonsDue(chronicle) {
  return !chronicle.examined && chronicle.renown >= SUMMONS_AT;
}

// ── the examination at Paris ──────────────────────────────────

export const STANCES = ['submit', 'defend', 'scorn'];
export const QUESTION_COUNT = 3;

export function createExamination(chronicle) {
  return { index: 0, answers: [], disposition: chronicle.disposition, done: false };
}

export function answerQuestion(exam, stance) {
  if (exam.done) throw new Error('the examination is over');
  if (!STANCES.includes(stance)) throw new Error(`unknown stance: ${stance}`);
  exam.answers.push(stance);
  exam.index += 1;
  if (exam.answers.length >= QUESTION_COUNT) exam.done = true;
  return exam;
}

/**
 * The verdict. All roads burn the book; the register differs:
 *  'submitted' — the record's own shape: condemnation received, satisfaction
 *                made, the rewriting already elsewhere.
 *  'defiant'   — inside the record's silence: burned, and watched harder.
 *  'departed'  — the marked counterfactual (WORLD_DESIGN.md §4): sustained
 *                scorn on top of an already-leaning witness. Requires the
 *                lean to be earned across days, not improvised at the bar.
 */
export function verdict(exam) {
  if (!exam.done) throw new Error('the examiners have not finished');
  const scorn = exam.answers.filter(a => a === 'scorn').length;
  const defend = exam.answers.filter(a => a === 'defend').length;
  if (scorn >= 2 && exam.disposition + scorn >= 4) return 'departed';
  if (scorn + defend >= 2) return 'defiant';
  return 'submitted';
}
