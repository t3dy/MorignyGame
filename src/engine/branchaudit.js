/**
 * MORIGNY — the branch auditor (CLAUDE.md rule 13;
 * docs/BRANCH_AUDIT.md).
 *
 * WHY THIS EXISTS. Choices in this game were written inline, one
 * `act('B', 'To Vespers.', '', next)` at a time, across eighty-odd call
 * sites in main.js. Nobody could review them as a set, so nobody did,
 * and the game shipped an opening that offered a returning player
 * "Take up the day again." with no narration, no orientation, and no
 * indication of what he was taking up. That is not a writing slip. It
 * is what happens when the most important text in a game is not data.
 *
 * So every branch of the loop is now DECLARED (src/content/branches.js)
 * and audited mechanically. A branch is any moment the game stops and
 * waits for the player.
 *
 * THE FOUR THINGS A BRANCH OWES THE READER
 *
 *   narrator    third-person orientation: where he is, what is
 *               happening, what is at stake in this world's terms.
 *   monologue   John's own voice, so the reader is inside a person and
 *               not reading a menu. (Or Bridget's, in her interludes.)
 *   pencil      the scholarly hand: what the sources say, what we made
 *               up, why this moment is shaped the way it is. Rationed —
 *               required only where a claim is being made.
 *   interaction what the player actually does: which keys, what each
 *               will cost, and what happens next.
 *
 * A DECISION (two or more live options) owes all four, with `pencil`
 * required only when `cites` is declared. A CONTINUE (a single button
 * that turns the page) owes only that its label says where it goes.
 *
 * A SURFACE is the third kind: a moment where the player acts by moving
 * or typing rather than choosing from a list — the road, and the Talk
 * keyword line. A surface owes orientation and an interior voice like
 * any scene, and it owes `interaction` MORE strictly than a menu does,
 * not less: with no options on screen, the instructions are the only
 * affordance the player has. A surface with no stated controls is a
 * blank room with an invisible door.
 */

export const VOICES = ['narrator', 'monologue', 'pencil', 'interaction'];
export const BRANCH_KINDS = ['decision', 'continue', 'surface'];

/** Length below which a passage is not doing its job. */
const MIN_NARRATOR = 120;
const MIN_MONOLOGUE = 40;
const MIN_LABEL = 8;

/**
 * A continue's label must say where it goes — not merely that it goes.
 * "To Vespers." passes; "Onward." does not.
 */
const VAGUE_CONTINUES = [
  /^(onward|continue|next|proceed|go on|and then)\.?$/i,
  /^(ok|okay|yes|b)\.?$/i,
];

function textOf(record) {
  if (!record) return '';
  if (typeof record === 'string') return record;
  return record.text ?? record.body ?? '';
}

/**
 * Audit one declared branch. Returns { id, where, kind, findings[] };
 * an empty findings array is a branch in good standing.
 */
export function auditBranch(branch) {
  const findings = [];
  const add = (severity, message) => findings.push({ severity, message });

  const content = typeof branch.content === 'function' ? branch.content() : branch.content;
  if (!content) {
    add('error', 'declares no content — the branch map points at nothing');
    return { id: branch.id, where: branch.where, kind: branch.kind, findings };
  }

  if (!BRANCH_KINDS.includes(branch.kind)) {
    add('error', `unknown kind "${branch.kind}"`);
  }

  // ── continues: only that the label says where it goes ──────────────
  if (branch.kind === 'continue') {
    const label = content.label ?? '';
    if (label.length < MIN_LABEL) add('error', 'the continue has no label worth reading');
    if (VAGUE_CONTINUES.some(re => re.test(label.trim()))) {
      add('error', `"${label}" does not say where it goes`);
    }
    return { id: branch.id, where: branch.where, kind: branch.kind, findings };
  }

  // ── surfaces: no menu, so the controls must be spelled out ─────────
  if (branch.kind === 'surface') {
    const narrator = textOf(content.narrator);
    if (!narrator) add('error', 'no narrator: the reader is not told where he is');
    else if (narrator.length < MIN_NARRATOR) add('warn', 'narrator is too thin to orient anybody');
    if (!textOf(content.monologue)) add('error', 'no interior voice: this is a control scheme, not a place');
    const how = textOf(content.interaction);
    if (!how) {
      add('error', 'a surface MUST state its controls — there is no menu to read them off');
    } else if (!/\b(key|keys|arrow|type|press|click|walk)\b/i.test(how)) {
      add('error', 'the interaction line names no actual control');
    }
    return { id: branch.id, where: branch.where, kind: branch.kind, findings };
  }

  // ── decisions: all four voices ─────────────────────────────────────
  const narrator = textOf(content.narrator);
  if (!narrator) add('error', 'no narrator: the reader is not told where he is or what is happening');
  else if (narrator.length < MIN_NARRATOR) {
    add('warn', `narrator is ${narrator.length} chars — too thin to orient anybody`);
  }

  const monologue = textOf(content.monologue ?? content.bridget);
  if (!monologue) add('error', 'no interior voice: this is a menu, not a person');
  else if (monologue.length < MIN_MONOLOGUE) add('warn', 'the interior voice is a fragment');

  const options = content.options ?? content.choices ?? [];
  if (options.length < 2) add('error', 'a decision with fewer than two live options is a continue');

  for (const o of options) {
    const label = o.label ?? '';
    const why = o.why ?? '';
    if (label.length < MIN_LABEL) add('error', `option "${o.id ?? o.key}": no real label`);
    if (!why) {
      add('error', `option "${o.id ?? o.key}": no stakes line — rule 10 requires the price and the lean at the point of choosing`);
    }
    if (o.key !== undefined && !/^[A-Z0-9]$/.test(o.key)) {
      add('error', `option "${o.id ?? o.key}": key must be a single letter or digit the player can press`);
    }
    // Axis-moving choices say so, in the choice (WORLD_DESIGN §4.5).
    if (o.effect?.disposition && !/Radical|Obedient/i.test(why)) {
      add('error', `option "${o.id ?? o.key}": moves the axis without naming its lean`);
    }
  }

  const keys = options.map(o => o.key).filter(Boolean);
  if (new Set(keys).size !== keys.length) add('error', `option keys collide: ${keys.join(',')}`);

  // Interaction clarity: the player must be able to tell what pressing
  // a key will do. A stakes line that never mentions a consequence is
  // atmosphere, not instruction.
  // A consequence may be quantified ("costs 2 resolve", "50% found"),
  // directional ("leans Radical"), or conditional ("if wrong, the rot
  // rides in"). All three tell the player what pressing the key does;
  // a bare percentage is the clearest of the lot.
  const CONSEQUENCE = /\(|\bcosts?\b|\+\d|−|\d+%|\bleans\b|\bif (you|wrong|right)\b|\brisks?\b|\bwill\b/i;
  const anyConsequence = options.some(o => CONSEQUENCE.test(o.why ?? ''));
  if (options.length && !anyConsequence) {
    add('warn', 'no option states a consequence: the player is choosing blind');
  }

  if (branch.cites && !content.pencil && !content.narrator?.sources?.length) {
    add('warn', 'declares a scholarly claim but carries no citation or pencil note');
  }

  return { id: branch.id, where: branch.where, kind: branch.kind, findings };
}

/** Audit the whole declared map. */
export function auditAll(branches) {
  return branches.map(auditBranch);
}

export function errors(results) {
  return results.filter(r => r.findings.some(f => f.severity === 'error'));
}

export function warnings(results) {
  return results.filter(r => r.findings.some(f => f.severity === 'warn'));
}

/** A printable coverage report, for `npm test`. */
export function report(results) {
  const lines = [];
  const decisions = results.filter(r => r.kind === 'decision').length;
  const continues = results.filter(r => r.kind === 'continue').length;
  const surfaces = results.filter(r => r.kind === 'surface').length;
  const clean = results.filter(r => !r.findings.length).length;
  lines.push(`${results.length} declared branches (${decisions} decisions, ${continues} continues, ${surfaces} surfaces)`);
  lines.push(`${clean} clean · ${errors(results).length} with errors · ${warnings(results).length} with warnings`);
  for (const r of results) {
    if (!r.findings.length) continue;
    lines.push(`  ${r.where} — ${r.id}`);
    for (const f of r.findings) lines.push(`    [${f.severity}] ${f.message}`);
  }
  return lines;
}
