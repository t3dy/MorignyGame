/**
 * MORIGNY — the stance-outcome composer (v4). Pure: takes the stance
 * engine's outcome record plus before/after snapshots of John and
 * returns everything the UI renders — the narrator passage, John's
 * monologue, the composed siege clauses, and the game-state voice's
 * dry ledger lines.
 *
 * One binding discipline (docs/NARRATIVE_DESIGN_REPORT.md §4): the
 * game-state voice explains the MACHINE, not the hidden state. It
 * reports visible faults, public events, and spent resources; it never
 * discloses silent failures — invisible faults, a corrupted figure, a
 * counterfeit accepted — whose honesty lives at the reckoning. The
 * test suite holds this line.
 */

import {
  STANCE_OUTCOME, SIEGE_TEXT, SIEGE_ENVELOPE,
} from '../content/stance_content.js';

/** The fields the game-state voice ledgers, in reporting order. */
const LEDGER_FIELDS = ['fatigue', 'resolve', 'pressure', 'despair', 'suspicion'];

export function snapshotJohn(john) {
  return {
    fatigue: john.fatigue,
    resolve: john.resolve,
    pressure: john.pressure,
    despair: john.despair,
    suspicion: john.suspicion,
  };
}

/** The authored outcome passage for this block. */
export function stancePassages(outcome) {
  const kindKey = outcome.kind === 'recitation' ? 'office' : 'copy';
  const rec = STANCE_OUTCOME[kindKey]?.[outcome.stance]?.[outcome.grade];
  if (!rec) throw new Error(`no stance outcome writing for ${kindKey}/${outcome.stance}/${outcome.grade}`);
  return rec;
}

/** The narrator totals the margin's day, from the record's real facts. */
export function composeSiege(outcome) {
  const lines = [];
  const held = outcome.distractions.filter(d => d.action === 'held').length;
  const attended = outcome.distractions.filter(d => d.action === 'attended');
  const flesh = attended.filter(d => d.record.kind === 'flesh').length;
  const other = attended.length - flesh;

  if (!outcome.distractions.length) {
    lines.push(SIEGE_TEXT.quiet());
    return { lines, ...SIEGE_ENVELOPE };
  }
  if (held) lines.push(SIEGE_TEXT.heldAll(held));
  if (outcome.firstBreak != null) lines.push(SIEGE_TEXT.brokeAt(outcome.firstBreak));
  if (flesh) lines.push(SIEGE_TEXT.fleshAttended(flesh));
  if (other) lines.push(SIEGE_TEXT.wanderings(other));
  return { lines, ...SIEGE_ENVELOPE };
}

/**
 * The fifth voice: dry, technical, numerate — and honest about its own
 * limits. Reports the stance, the grade, the spend, the state deltas,
 * and only what a scribe could see on his own page tonight.
 */
export function composeGameState(outcome, before, after) {
  const lines = [];
  const gradeBit = outcome.quality != null
    ? `${outcome.grade} (quality ${outcome.quality.toFixed(2)})`
    : outcome.grade;
  lines.push(`Stance: ${outcome.stance}. Grade: ${gradeBit}.`);
  if (outcome.hand) lines.push(`Hand: ${outcome.hand}.`);

  const held = outcome.distractions.filter(d => d.action === 'held').length;
  const attended = outcome.distractions.length - held;
  if (outcome.distractions.length) {
    lines.push(
      `Distractions: ${outcome.distractions.length} (${held} held at ${outcome.resolveSpent} resolve, ${attended} attended).`,
    );
  }

  for (const f of LEDGER_FIELDS) {
    if (before[f] !== after[f]) lines.push(`${f[0].toUpperCase()}${f.slice(1)} ${before[f]}→${after[f]}.`);
  }

  if (outcome.copy) {
    // Visible knowledge only: what the scribe can see on his own page.
    const visible = outcome.copy.faults.filter(f => f.visible && !f.corrected).length;
    lines.push(`Visible faults on the leaf: ${visible}.`);
    const caught = outcome.events.filter(e => e.type === 'caught').length;
    if (caught) lines.push(`Exemplar faults caught while construing: ${caught}.`);
    const noticed = outcome.events.filter(e => e.type === 'noticed' || e.type === 'seen').length;
    if (noticed) lines.push(`Noticed at the desk: ${noticed} time${noticed === 1 ? '' : 's'}.`);
  }
  return lines;
}

/** Everything the UI needs to render one block's outcome. */
export function composeStanceNarration(outcome, before, after) {
  const passages = stancePassages(outcome);
  return {
    narrator: passages.narrator,
    monologue: passages.monologue,
    siege: composeSiege(outcome),
    gameState: composeGameState(outcome, before, after),
  };
}
