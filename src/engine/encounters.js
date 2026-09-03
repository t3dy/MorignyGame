/**
 * MORIGNY — the encounter pool (v4 §6b, docs/ENCOUNTER_SYSTEMS_STUDY.md).
 * A deck bigger than any run, so every witness meets a different
 * fraction of the world. Four adopted mechanisms:
 *
 *  1. FACULTY × AFFORDANCE gating (DungeonAB's capability engine): an
 *     option exists where what John can do meets what the situation
 *     offers. One encounter reads as several to differently-trained
 *     Johns, and adding a faculty touches one dictionary.
 *  2. RIDERS: encounters ride a block that already has a job, so the
 *     ordinary day gets richer without costing the input budget.
 *  3. ESCALATION LADDER: the deck is shuffled WITHIN tier and
 *     concatenated ACROSS tiers, so the arc (minor → major → grave)
 *     is a property of deck construction, not a weight table — and
 *     the deck outlasts the run by design.
 *  4. RISK BAG: the player's own choices seed tokens (heresy,
 *     exposure, debt…), and grave encounters require them. What
 *     arrives late is a consequence, not weather.
 *
 * Registers (D-21): every encounter declares `cloister` (Page's
 * insider sociology) or `underworld` (Kieckhefer's milieu apart) or
 * `court` — narrated as such, and read mechanically.
 */

export const REGISTERS = ['cloister', 'underworld', 'court'];
export const TIERS = ['minor', 'major', 'grave'];

// ── the risk bag ─────────────────────────────────────────────────────
export const RISK_TOKENS = ['heresy', 'exposure', 'debt', 'scandal'];

export function createRiskBag() {
  return Object.fromEntries(RISK_TOKENS.map(t => [t, 0]));
}

export function loadRiskBag(saved) {
  const bag = createRiskBag();
  if (saved) for (const t of RISK_TOKENS) if (typeof saved[t] === 'number') bag[t] = saved[t];
  return bag;
}

export function addRisk(bag, token, n = 1) {
  if (!RISK_TOKENS.includes(token)) throw new Error(`unknown risk token: ${token}`);
  bag[token] = Math.max(0, bag[token] + n);
  return bag;
}

// ── the deck ─────────────────────────────────────────────────────────

function shuffled(rng, ids) {
  const a = [...ids];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng.next() * (i + 1)) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Shuffle within tier, concatenate across: the arc is built into the
 * deck. A run that ends early simply never reaches the grave cards —
 * which is the design, not a shortfall.
 */
export function buildEncounterDeck(rng, catalog) {
  const all = Object.values(catalog);
  return TIERS.flatMap(tier => shuffled(rng, all.filter(e => e.tier === tier).map(e => e.id)));
}

// ── eligibility ──────────────────────────────────────────────────────

/** Does the context satisfy a `requires` block? */
function meetsRequirements(req, ctx) {
  if (!req) return true;
  if (req.minDays != null && (ctx.days ?? 0) < req.minDays) return false;
  if (req.minDisposition != null && (ctx.disposition ?? 0) < req.minDisposition) return false;
  if (req.maxDisposition != null && (ctx.disposition ?? 0) > req.maxDisposition) return false;
  for (const [id, level] of Object.entries(req.faculty ?? {})) {
    if ((ctx.faculties?.[id] ?? 0) < level) return false;
  }
  for (const [token, n] of Object.entries(req.risk ?? {})) {
    if ((ctx.risk?.[token] ?? 0) < n) return false;
  }
  return true;
}

/**
 * An encounter is eligible when the situation affords what it needs,
 * it has not already been spent, and its requirements are met.
 */
export function eligible(encounter, ctx) {
  if (encounter.once && (ctx.fired ?? []).includes(encounter.id)) return false;
  const afforded = ctx.affordances ?? [];
  if (!(encounter.affordances ?? []).every(a => afforded.includes(a))) return false;
  return meetsRequirements(encounter.requires, ctx);
}

/**
 * How specific an encounter's demands are. `cloister` is the tag every
 * room in the abbey carries, so it says nothing about WHERE; anything
 * else — `seals`, `bodies`, `quiet`, `town` — names a particular place.
 */
function specificity(encounter) {
  return (encounter.affordances ?? []).filter(a => a !== 'cloister').length;
}

/**
 * Draw the first eligible encounter from the deck head, skipping (but
 * NOT discarding) those whose moment has not come — an encounter gated
 * on a faculty John has not trained waits in place for the run where he
 * trains it.
 *
 * PLACE BEATS DECK POSITION, WITHIN A TIER. The deck's order is the
 * escalation ladder and must be respected across tiers, but inside the
 * tier that comes up, the most place-specific eligible encounter wins.
 * Without this the rooms are cosmetic: every room carries `cloister`,
 * so a generic cloister encounter always sat ahead of the one written
 * for the lead workshop, and the workshop encounter would essentially
 * never fire. Caught by verification, 2026-09-02.
 *
 * Returns { encounter, index } or null.
 */
export function drawEncounter(deck, catalog, ctx) {
  let best = null;
  for (let i = 0; i < deck.length; i++) {
    const encounter = catalog[deck[i]];
    if (!encounter || !eligible(encounter, ctx)) continue;
    if (!best) {
      best = { encounter, index: i };
      continue;
    }
    // Only ever trade up within the tier the ladder has reached.
    if (encounter.tier !== best.encounter.tier) break;
    if (specificity(encounter) > specificity(best.encounter)) best = { encounter, index: i };
  }
  return best;
}

/** Spend a drawn encounter: it leaves the deck, and one-shots are logged. */
export function spendEncounter(deck, fired, encounter, index) {
  deck.splice(index, 1);
  if (encounter.once && !fired.includes(encounter.id)) fired.push(encounter.id);
  return deck;
}

// ── options ──────────────────────────────────────────────────────────

/**
 * An option is available when John can actually do it. Returns
 * { available, unlockedBy } — `unlockedBy` names the faculty that
 * opened it, so the UI can say WHY a choice exists (rule 10).
 */
export function optionAvailable(option, ctx) {
  if (!meetsRequirements(option.requires, ctx)) return { available: false, unlockedBy: null };
  const faculty = Object.keys(option.requires?.faculty ?? {})[0] ?? null;
  return { available: true, unlockedBy: faculty };
}

export function availableOptions(encounter, ctx) {
  return encounter.options
    .map(option => ({ option, ...optionAvailable(option, ctx) }))
    .filter(o => o.available);
}

/**
 * Apply an option's effect. Mutates john and the risk bag; returns
 * what was applied, for the game-state voice.
 */
export function applyOption(option, john, risk) {
  const applied = { state: {}, risk: {} };
  const effect = option.effect ?? {};
  for (const field of ['suspicion', 'pressure', 'despair', 'resolve', 'fatigue', 'disposition']) {
    if (effect[field]) {
      john[field] = field === 'disposition' ? john[field] + effect[field]
        : Math.max(0, john[field] + effect[field]);
      applied.state[field] = effect[field];
    }
  }
  for (const [token, n] of Object.entries(effect.risk ?? {})) {
    addRisk(risk, token, n);
    applied.risk[token] = n;
  }
  return applied;
}
