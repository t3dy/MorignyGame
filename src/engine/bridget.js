/**
 * MORIGNY — Bridget (Bridget spec, adapted; decided 2026-09-01).
 *
 * WHAT THE SOURCES ACTUALLY GIVE US. She is John's younger sister,
 * fifteen. She asked him, repeatedly, to teach her to read. He thought
 * fifteen was too old to make a good reader and put her through the ars
 * notoria's learning process anyway. Within about six months she could
 * read AND write, and she sang an Alleluia in church unassisted; he
 * boasts about it. Then a spirit began pressing on her in bed at night,
 * threatening her, preventing her from speaking or moving. John could
 * not see it — he heard and watched her terror. Ordinary prayers did
 * not end it. When he told her to renounce the art before the Virgin,
 * the demon withdrew; she renounced the next day, and afterwards she
 * could defeat and trample the demon whenever it appeared.
 *
 * TWO DESIGN COMMITMENTS follow from that, both decided 2026-09-01:
 *
 * 1. **She is the empirical proof, not a resource.** Her burden is what
 *    tells the player what John's practice actually is. Fanger's point
 *    is that her experience externalises his conversion — his
 *    experiment produced consequences for somebody else, and that is
 *    what finally moved him.
 *
 * 2. **She is a person with her own arc.** She gets there before he
 *    does: the sources say his conversion was partial and hers was
 *    decisive. So the Renunciation is HER decision, played from her
 *    side, and `trample` is her power — not a shield stat bolted onto
 *    John. The game may not reduce her ending to a crafting bonus.
 *
 * Every claim above comes through the digests (docs/research/), so the
 * content records built on this carry `verify` (CLAUDE.md rule 11).
 */

export const METHODS = ['scholastic', 'notory'];

/** Weeks of sim-time per lesson, and what each lesson does. */
export const METHOD = {
  scholastic: {
    id: 'scholastic',
    label: 'Teach her the way you were taught.',
    weeksToLiterate: 24,
    literacyPerWeek: 1 / 24,
    burdenPerLesson: 0,
    suspicionPerLesson: 1,   // her studies are visible; a girl reading is talked about
    johnLearning: 0,
    johnDiscretio: 1,
  },
  notory: {
    id: 'notory',
    label: 'Put her through the art.',
    weeksToLiterate: 6,
    literacyPerWeek: 1 / 6,
    burdenPerLesson: 15,
    suspicionPerLesson: -1,  // done quietly, in closed rooms
    johnLearning: 1,
    johnDiscretio: -1,
  },
};

export const ALLELUIA_BURDEN_SPIKE = 20;
export const CRISIS_AT = 80;
export const RENUNCIATION_AVAILABLE_AT = 50;

export function createBridget() {
  return {
    /** She has asked. The game starts with her asking. */
    asked: true,
    literacy: 0,        // 0..100
    burden: 0,          // 0..100
    method: null,       // whichever he committed to
    alleluia: false,    // the public milestone, once
    renounced: false,   // HER decision
    trample: false,     // her power afterwards
    lessons: 0,
  };
}

export function loadBridget(saved) {
  const b = createBridget();
  if (!saved) return b;
  for (const k of ['literacy', 'burden', 'lessons']) {
    if (Number.isFinite(saved[k])) b[k] = saved[k];
  }
  if (METHODS.includes(saved.method)) b.method = saved.method;
  for (const k of ['asked', 'alleluia', 'renounced', 'trample']) {
    if (typeof saved[k] === 'boolean') b[k] = saved[k];
  }
  return b;
}

const clamp100 = v => Math.max(0, Math.min(100, v));

/**
 * One teaching block, covering `weeksElapsed` of sim-time.
 * Returns what changed, including the events the caller must narrate.
 * Mutates bridget only — John's stats are the caller's to apply, so the
 * coupling stays visible at the call site.
 */
export function teach(bridget, methodId, weeksElapsed, { solomonicNodes = 0 } = {}) {
  const method = METHOD[methodId];
  if (!method) throw new Error(`unknown method: ${methodId}`);
  if (bridget.literacy >= 100) throw new Error('she can read; there is nothing left to teach her this way');
  bridget.method = methodId;
  bridget.lessons += 1;

  const before = { literacy: bridget.literacy, burden: bridget.burden };
  bridget.literacy = clamp100(bridget.literacy + method.literacyPerWeek * 100 * weeksElapsed / 4);

  // Every Solomonic node John has taken makes the art press harder on
  // her — the trap in the spec, and the mechanical form of "his
  // experiment has consequences for somebody else".
  const burden = method.burdenPerLesson * (1 + 0.25 * solomonicNodes);
  bridget.burden = clamp100(bridget.burden + burden);

  const events = [];
  if (bridget.literacy >= 100 && !bridget.alleluia) {
    bridget.alleluia = true;
    bridget.burden = clamp100(bridget.burden + (methodId === 'notory' ? ALLELUIA_BURDEN_SPIKE : 0));
    events.push({ type: 'alleluia', viaArt: methodId === 'notory' });
  }
  if (before.burden < CRISIS_AT && bridget.burden >= CRISIS_AT) {
    events.push({ type: 'crisis' });
  }
  return {
    method: methodId,
    literacy: bridget.literacy,
    burden: bridget.burden,
    gained: { literacy: bridget.literacy - before.literacy, burden: bridget.burden - before.burden },
    john: { learning: method.johnLearning, discretio: method.johnDiscretio, suspicion: method.suspicionPerLesson },
    events,
  };
}

export function inCrisis(bridget) {
  return bridget.burden >= CRISIS_AT && !bridget.renounced;
}

export function renunciationAvailable(bridget) {
  return bridget.burden >= RENUNCIATION_AVAILABLE_AT && !bridget.renounced;
}

/**
 * She renounces the art before the Virgin. This is HER act — the caller
 * plays it from her side. The demon withdraws, and she keeps the power
 * over it afterwards, which is what the sources say happened.
 */
export function renounce(bridget) {
  if (bridget.renounced) throw new Error('she has already renounced');
  bridget.renounced = true;
  bridget.burden = 0;
  bridget.trample = true;
  return bridget;
}

/**
 * The other road: John analyses the demon by the art's own memory
 * prayer instead of letting her renounce. It works, after a fashion.
 * She survives; the burden never fully lifts; she never gets her power.
 */
export function analyse(bridget) {
  if (bridget.renounced) throw new Error('she has already renounced');
  bridget.burden = Math.max(30, bridget.burden - 30);
  bridget.trample = false;
  bridget.fragile = true;
  return bridget;
}

/** Whether she can read well enough to be a second pair of hands — if she chooses. */
export function literate(bridget) {
  return bridget.literacy >= 50;
}
