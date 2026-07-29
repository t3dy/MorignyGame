/**
 * MORIGNY — the Talk engine (U5 keyword conversation, Pentiment register).
 * Pure: start a conversation, ask keywords, collect effects for the
 * controller to apply. NAME, JOB, BYE always work; others unlock.
 */

const ALWAYS = ['name', 'job', 'bye'];

export function startTalk(npc) {
  return {
    npc,
    open: true,
    known: [...ALWAYS],
    asked: [],
  };
}

export function knownKeywords(convo) {
  return convo.known.filter(k => k !== 'bye').concat('bye');
}

/**
 * Ask a keyword. Returns {text, effect?, unlocked:[], ended?}.
 * Unknown words get the NPC's default line. Effects fire once only.
 */
export function ask(convo, word) {
  const key = String(word ?? '').trim().toLowerCase();
  if (!convo.open) throw new Error('conversation is over');
  if (!key) return { text: convo.npc.default, unlocked: [] };

  if (key === 'bye') {
    convo.open = false;
    return { text: convo.npc.keywords.bye.text, unlocked: [], ended: true };
  }

  const entry = convo.known.includes(key) ? convo.npc.keywords[key] : null;
  if (!entry) return { text: convo.npc.default, unlocked: [] };

  const firstTime = !convo.asked.includes(key);
  convo.asked.push(key);

  const unlocked = [];
  for (const u of entry.unlocks ?? []) {
    if (!convo.known.includes(u)) {
      convo.known.push(u);
      unlocked.push(u);
    }
  }

  return {
    text: entry.text,
    effect: firstTime ? entry.effect : undefined,
    unlocked,
  };
}
