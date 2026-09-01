/**
 * MORIGNY scriptorium tests — the copy loop, its errors, and their
 * afterlives (SCRIPTORIUM.md §2–4). Coverage per AUDIT.md: all error
 * classes × all hands, all correction scenarios, figure success/fail,
 * daylight public/night, all pigment hazard outcomes — plus the
 * provenance lint on the new data files.
 */

import { strict as assert } from 'assert';
import { SeededRandom } from '../src/engine/random.js';
import { createJohn } from '../src/engine/state.js';
import { EXEMPLARS, EXEMPLAR_SOURCES, exemplarById } from '../src/data/exemplars.js';
import { MATERIALS, PIGMENTS, materialById } from '../src/data/materials.js';
import {
  HANDS, ERROR_CLASSES, DAMAGE_CLASSES, VERBA_ERROR_MULT, CONCEALMENTS,
  CONCEALMENT_FOUND_CHANCE,
  createCopySession, collate, correctableMethods, correctFault, activeFaults,
  drawFigure, grindAndApply, ageCopy, conceal, inventoryFinds, deadlineExceeded,
  scrapeLeaf, undertextDistraction,
} from '../src/engine/scriptorium.js';
import {
  SCRIPTORIUM_TEXT, COPY_DISTRACTIONS, SCRIPTORIUM_NOTES, BIBLIO,
  UNDERTEXT_TEXT, TRANSMISSION_ENDINGS, transmissionEndingText, RECIPIENT_NAMES,
} from '../src/content/content.js';
import { faultPhrase, FAULT_PHRASE } from '../src/engine/stemma.js';

const STATUSES = ['attested', 'adapted', 'invented'];

function lint(record, label) {
  assert.ok(STATUSES.includes(record.status), `${label}: status must be marked`);
  assert.ok(Array.isArray(record.sources), `${label}: sources array required`);
  if (record.status === 'attested' || record.status === 'adapted') {
    assert.ok(record.sources.length > 0, `${label}: ${record.status} needs sources`);
    for (const s of record.sources) {
      assert.ok(s.work && s.work.length > 0, `${label}: source needs a work`);
      assert.ok(s.locus && s.locus.length > 0, `${label}: source needs a locus`);
    }
  }
}

/**
 * A queue-driven rng: hands out scripted values, then a high default
 * (0.99 = "nothing happens"). Lets a test force one exact branch.
 */
function fakeRng(...values) {
  const queue = [...values];
  return { next: () => (queue.length ? queue.shift() : 0.99) };
}

/** A minimal exemplar fixture the tests can shape precisely. */
function fixture(sim = {}, extra = {}) {
  return {
    id: 'fixture', title: 'a fixture', source: 'armarium',
    hot: false, completeness: 1, status: 'invented', sources: [],
    sim: {
      units: 4, verbaShare: 0, figures: 0, faults: [],
      coin: 0, favorOwed: false, assigned: true,
      deadlineDays: null, suspicionOnAcquire: 0,
      ...sim,
    },
    ...extra,
  };
}

const POOL = [
  { id: 'd1', kind: 'mundane', text: 'a fly on the wet ink', effects: { pressure: 0, despair: 0 }, status: 'invented', sources: [] },
  { id: 'd2', kind: 'appetite', text: 'the margin stirs', effects: { pressure: 2, despair: 1 }, status: 'invented', sources: [] },
];

// ── data contract ────────────────────────────────────────────

describe('Scriptorium data (envelope + contract)', () => {
  test('exemplars carry the envelope and legal fault classes', () => {
    assert.equal(EXEMPLARS.length, 5, 'five sources, five characters');
    for (const e of EXEMPLARS) {
      lint(e, `exemplars.${e.id}`);
      assert.ok(EXEMPLAR_SOURCES.includes(e.source), `${e.id} source kind`);
      assert.ok(e.sim.units > 0, `${e.id} has units`);
      for (const f of e.sim.faults) {
        assert.ok(ERROR_CLASSES.includes(f), `${e.id} fault class ${f}`);
      }
    }
    const kinds = new Set(EXEMPLARS.map(e => e.source));
    assert.equal(kinds.size, 5, 'every acquisition channel is present');
  });

  test('the sources table has its characters: deadline, heat, the free inheritance', () => {
    const pecia = exemplarById('pecia-orleans');
    assert.equal(pecia.sim.deadlineDays, 3, 'the rented piece has a clock');
    assert.ok(pecia.verify, 'pecia at Orléans stays on the Research Queue');
    assert.equal(pecia.status, 'adapted', 'pecia at Orléans is adapted, not asserted');
    const own = exemplarById('old-compilation');
    assert.equal(own.sim.coin, 0, 'his own redaction costs nothing');
    assert.ok(own.sim.faults.length > 0, 'and every fault in it is his');
    assert.ok(EXEMPLARS.some(e => e.hot), 'some texts are matter for a court');
    assert.ok(EXEMPLARS.some(e => !e.hot), 'and some are only work');
  });

  test('materials carry the envelope; the hazards are wired', () => {
    for (const m of MATERIALS) lint(m, `materials.${m.id}`);
    const orpiment = materialById('orpiment');
    assert.ok(orpiment.sim.sickensOnGrind > 0, 'orpiment sickens the careless grinder');
    assert.ok(orpiment.sim.reactsWith.includes('lead-white'), 'blackens on lead');
    assert.ok(orpiment.sim.reactsWith.includes('verdigris'), 'and on copper');
    assert.ok(materialById('verdigris').sim.corrodesAfterDays > 0, 'verdigris carries its slow clock');
    assert.ok(materialById('ultramarine').sim.conspicuous, 'ultramarine is a question someone may ask');
    assert.ok(materialById('gold-leaf').sim.licentiaMark, 'gold is the licence\'s color');
    assert.ok(materialById('palimpsest').sim.undertext, 'the scraped leaf keeps its ghost');
    assert.ok(PIGMENTS.length >= 5, 'a palette, not a swatch');
  });
});

// ── the copy loop ────────────────────────────────────────────

describe('The copy loop (scribere est orare)', () => {
  test('three hands, priced against each other', () => {
    assert.deepEqual(Object.keys(HANDS).sort(), ['cursive', 'textualis', 'trusting']);
    assert.ok(HANDS.textualis.errBase < HANDS.cursive.errBase, 'careful errs less than quick');
    assert.ok(HANDS.trusting.speed > HANDS.cursive.speed && HANDS.cursive.speed > HANDS.textualis.speed, 'speed orders the hands');
    assert.ok(HANDS.textualis.fingerCost > HANDS.trusting.fingerCost, 'care costs the fingers');
    assert.equal(HANDS.trusting.construes, false, 'trusting does not read the sense');
    assert.equal(HANDS.trusting.catchInherited, 0, 'and so cannot catch inherited errors');
  });

  test('same seed, same choices → the identical copy (determinism)', () => {
    const run = () => {
      const john = createJohn();
      john.resolve = 5;
      const s = createCopySession(new SeededRandom('quire-7'), john, {
        exemplar: exemplarById('pecia-orleans'), light: 'day', pool: POOL,
      });
      while (!s.done) {
        s.advance('cursive');
        if (s.pending) (s.canHoldFast() ? s.holdFast() : s.attend());
      }
      return s;
    };
    const a = run(); const b = run();
    assert.deepEqual(a.copy.faults, b.copy.faults);
    assert.deepEqual(a.copy.grade, b.copy.grade);
    assert.equal(a.lapses, b.lapses);
  });

  test('the layout honors the exemplar: verba units in their share', () => {
    const ex = fixture({ units: 10, verbaShare: 0.3 });
    const s = createCopySession(new SeededRandom('layout'), createJohn(), { exemplar: ex, pool: [] });
    const verba = s.layout.filter(u => u.kind === 'verba').length;
    assert.equal(verba, 3, 'round(share × units)');
    assert.equal(s.layout.length, 10);
  });

  test('trusting the exemplar copies its faults through, silently', () => {
    const ex = fixture({ units: 2, faults: ['dittography'] });
    const s = createCopySession(fakeRng(), createJohn(), { exemplar: ex, pool: [] });
    while (!s.done) s.advance('trusting');
    const inherited = s.copy.faults.filter(f => f.inherited);
    assert.equal(inherited.length, 1, 'the parent\'s fault is now yours');
    assert.equal(inherited[0].class, 'dittography');
  });

  test('a construing hand can catch an inherited fault', () => {
    const ex = fixture({ units: 2, faults: ['dittography'] });
    // creation: 1 placement draw (0.0 → unit 0);
    // unit 0: no distraction (0.99), catch roll 0.0 < 0.8 → caught.
    const s = createCopySession(fakeRng(0.0, 0.99, 0.0), createJohn(), { exemplar: ex, pool: [] });
    while (!s.done) s.advance('textualis');
    assert.equal(s.copy.faults.filter(f => f.inherited).length, 0, 'caught, not copied');
    assert.ok(s.events.some(e => e.type === 'caught'), 'and the catch is recorded');
  });

  test('an inherited verba ignota garble cannot be caught by any hand', () => {
    const ex = fixture({ units: 2, faults: ['verba_ignota'] });
    const s = createCopySession(fakeRng(0.0), createJohn(), { exemplar: ex, pool: [] });
    while (!s.done) s.advance('textualis');
    const inherited = s.copy.faults.filter(f => f.inherited);
    assert.equal(inherited.length, 1, 'sense cannot rescue what has none');
    assert.equal(inherited[0].class, 'verba_ignota');
  });

  test('fresh errors: eyeskip is silent, dittography shows', () => {
    // creation: no draws (no verba, no faults).
    // unit 0: no distraction, error roll 0.0 → error; class roll 0.3 < 0.4 → eyeskip.
    let s = createCopySession(fakeRng(0.99, 0.0, 0.3), createJohn(), { exemplar: fixture(), pool: [] });
    s.advance('cursive');
    assert.equal(s.copy.faults[0].class, 'eyeskip');
    assert.equal(s.copy.faults[0].visible, false, 'the player is not told');
    // class roll 0.5 ≥ 0.4 → dittography, visible.
    s = createCopySession(fakeRng(0.99, 0.0, 0.5), createJohn(), { exemplar: fixture(), pool: [] });
    s.advance('cursive');
    assert.equal(s.copy.faults[0].class, 'dittography');
    assert.equal(s.copy.faults[0].visible, true);
  });

  test('verba ignota garble at double rate, and the class is its own', () => {
    assert.equal(VERBA_ERROR_MULT, 2);
    // all-verba fixture: textualis on a fresh john gives chance ≈ 0.055;
    // doubled ≈ 0.111. A 0.08 roll errs on a verba unit…
    const exV = fixture({ units: 1, verbaShare: 1 });
    let s = createCopySession(fakeRng(0.0, 0.99, 0.08), createJohn(), { exemplar: exV, pool: [] });
    s.advance('textualis');
    assert.equal(s.copy.faults.length, 1, 'the unknown words doubled the danger');
    assert.equal(s.copy.faults[0].class, 'verba_ignota');
    // …and the same roll passes clean on a text unit.
    s = createCopySession(fakeRng(0.99, 0.08), createJohn(), { exemplar: fixture({ units: 1 }), pool: [] });
    s.advance('textualis');
    assert.equal(s.copy.faults.length, 0);
  });

  test('distractions: hold fast spends resolve (doubled when scrupulous); attending unsteadies the hand', () => {
    // spawn: distraction roll 0.0, pick 0.0 → POOL[0].
    const john = createJohn();
    let s = createCopySession(fakeRng(0.0, 0.0), john, { exemplar: fixture(), pool: POOL });
    s.advance('textualis');
    assert.ok(s.pending, 'the margin interrupts');
    const before = john.resolve;
    s.holdFast();
    assert.equal(john.resolve, before - 1, 'held fast at the plain price');
    assert.equal(s.unitIndex, 1, 'and the unit proceeds');

    // scrupulous: cost 2.
    const j2 = createJohn(); j2.despair = 3;
    s = createCopySession(fakeRng(0.0, 0.0), j2, { exemplar: fixture(), pool: POOL });
    s.advance('textualis');
    s.holdFast();
    assert.equal(j2.resolve, 1, 'scrupulosity doubles the price of attention');

    // attend: lapse lands its effects and doubles the unit's error chance.
    // cursive on fresh john: chance ≈ 0.13; doubled ≈ 0.26. Roll 0.2 errs
    // only for the distracted hand.
    const j3 = createJohn();
    s = createCopySession(fakeRng(0.0, 0.99, 0.2, 0.5), j3, { exemplar: fixture({ units: 1 }), pool: [POOL[1]] });
    s.advance('cursive');
    const rec = s.attend();
    assert.equal(rec.id, 'd2');
    assert.equal(s.lapses, 1);
    assert.equal(j3.pressure, 5, 'the record\'s effects land');
    assert.equal(s.copy.faults.length, 1, 'a distracted hand errs');
    const j4 = createJohn();
    const s2 = createCopySession(fakeRng(0.99, 0.2, 0.5), j4, { exemplar: fixture({ units: 1 }), pool: [] });
    s2.advance('cursive');
    assert.equal(s2.copy.faults.length, 0, 'the same roll, recollected, passes clean');
  });

  test('grades keep the recitation thresholds — it is the same attention economy', () => {
    const s = createCopySession(fakeRng(), createJohn(), { exemplar: fixture({ units: 9 }), pool: [] });
    while (!s.done) s.advance('trusting');
    assert.equal(s.lapses, 0);
    assert.equal(s.copy.grade, 'recollected');
    assert.equal(s.copy.quality, 1);
  });
});

// ── light ────────────────────────────────────────────────────

describe('Light is the master constraint', () => {
  test('by day, an unassigned leaf on the desk draws eyes', () => {
    const john = createJohn();
    const ex = fixture({ assigned: false });
    // unit 0: no distraction, no error, light roll 0.05 < 0.1 → noticed.
    const s = createCopySession(fakeRng(0.99, 0.99, 0.05), john, { exemplar: ex, light: 'day', pool: [] });
    s.advance('trusting');
    assert.equal(john.suspicion, 1);
    assert.ok(s.events.some(e => e.type === 'noticed'));
  });

  test('assigned licit work by day draws none', () => {
    const john = createJohn();
    const s = createCopySession(fakeRng(0.99, 0.99, 0.0), john, { exemplar: fixture(), light: 'day', pool: [] });
    s.advance('trusting');
    assert.equal(john.suspicion, 0, 'the leaf on the desk is the leaf assigned');
  });

  test('the candle: fire risk, and the worst suspicion in the game', () => {
    const john = createJohn();
    // unit 0: no distraction, no error, fire roll 0.01 → fire; seen roll 0.02 → seen.
    const s = createCopySession(fakeRng(0.99, 0.99, 0.01, 0.02), john, { exemplar: fixture(), light: 'candle', pool: [] });
    s.advance('trusting');
    assert.ok(s.events.some(e => e.type === 'fire'), 'the risk was existential');
    assert.ok(s.events.some(e => e.type === 'seen'));
    assert.equal(john.suspicion, 3, 'no single act is watched harder');
  });

  test('the rented piece has a clock', () => {
    const pecia = exemplarById('pecia-orleans');
    assert.equal(deadlineExceeded(pecia, 3), false);
    assert.equal(deadlineExceeded(pecia, 4), true);
    assert.equal(deadlineExceeded(exemplarById('old-compilation'), 40), false, 'his own book waits forever');
  });
});

// ── correction ───────────────────────────────────────────────

describe('Emendatio (correction, and its limits)', () => {
  function copyWith(...faults) {
    const s = createCopySession(fakeRng(), createJohn(), { exemplar: fixture({ units: 1 }), pool: [] });
    s.advance('trusting');
    s.copy.faults.push(...faults.map((cls, i) => ({
      id: `f${i}`, class: cls, unit: 0,
      visible: cls === 'dittography', inherited: false, corrected: false,
    })));
    return s.copy;
  }

  test('a visible dittography yields to expunctuation', () => {
    const copy = copyWith('dittography');
    assert.deepEqual(correctableMethods(copy, copy.faults[0]), ['expunctuation']);
    correctFault(copy, copy.faults[0], 'expunctuation');
    assert.equal(activeFaults(copy).length, 0);
    assert.equal(copy.faults[0].corrected, true, 'the dots stand under the cancelled letters');
  });

  test('eyeskip is invisible until collation — and the first copy is unverifiable', () => {
    const copy = copyWith('eyeskip');
    assert.deepEqual(correctableMethods(copy, copy.faults[0]), [], 'nothing to see');
    assert.throws(() => collate(copy, null), /witness/, 'collation requires having another witness');
    const other = copyWith();
    const revealed = collate(copy, other);
    assert.equal(revealed.length, 1);
    assert.deepEqual(correctableMethods(copy, copy.faults[0]), ['marginal-insertion']);
    correctFault(copy, copy.faults[0], 'marginal-insertion');
    assert.equal(activeFaults(copy).length, 0);
  });

  test('verba ignota are never correctable — sense cannot rescue them', () => {
    const copy = copyWith('verba_ignota');
    assert.deepEqual(correctableMethods(copy, copy.faults[0]), []);
    collate(copy, copyWith());
    assert.deepEqual(correctableMethods(copy, copy.faults[0]), [], 'not even collation redeems them here');
    assert.throws(() => correctFault(copy, copy.faults[0], 'expunctuation'), /cannot/);
  });

  test('damage is not an error: blackening and corrosion stand uncorrected', () => {
    const copy = copyWith();
    copy.faults.push({ id: 'dmg', class: 'blackened', unit: null, visible: true, inherited: false, corrected: false });
    assert.ok(DAMAGE_CLASSES.includes('blackened') && DAMAGE_CLASSES.includes('corrosion'));
    assert.deepEqual(correctableMethods(copy, copy.faults[0]), []);
  });
});

// ── figures ──────────────────────────────────────────────────

describe('The figure check (silent invalidity)', () => {
  function finished() {
    const john = createJohn();
    const s = createCopySession(fakeRng(), john, { exemplar: fixture({ units: 1, figures: 1 }), pool: [] });
    s.advance('trusting');
    return { john, copy: s.copy };
  }

  test('a failed figure corrupts silently — the result does not confess', () => {
    const { john, copy } = finished();
    const fail = drawFigure(fakeRng(0.9), john, copy);
    assert.equal(copy.corrupt, true, 'the rot is in');
    assert.equal(john.procedure.corrupt, true, 'and the procedure worked from it is void');
    const { john: j2, copy: c2 } = finished();
    const ok = drawFigure(fakeRng(0.1), j2, c2);
    assert.equal(c2.corrupt, false);
    assert.equal(j2.procedure.corrupt, false);
    assert.deepEqual(Object.keys(fail).sort(), Object.keys(ok).sort(), 'success and failure wear the same face');
    assert.equal(fail.drawn, true, 'the copy looks finished either way');
  });

  test('figures are counted against the exemplar\'s program', () => {
    const { john, copy } = finished();
    drawFigure(fakeRng(0.1), john, copy);
    assert.equal(copy.figures.drawn, 1);
    assert.equal(copy.figures.needed, 1);
  });
});

// ── pigments ─────────────────────────────────────────────────

describe('Pigment hazards (real chemistry, handed to the design)', () => {
  function blankCopy() {
    const s = createCopySession(fakeRng(), createJohn(), { exemplar: fixture({ units: 1 }), pool: [] });
    s.advance('trusting');
    return s.copy;
  }

  test('orpiment sickens the careless grinder', () => {
    const john = createJohn();
    const copy = blankCopy();
    const before = john.fatigue;
    const res = grindAndApply(fakeRng(0.1), john, copy, materialById('orpiment'));
    assert.ok(res.applied);
    assert.ok(john.fatigue > before, 'the arsenic takes its tax');
    assert.ok(res.events.some(e => e.type === 'sickened'));
  });

  test('orpiment blackens on lead — in either order', () => {
    const john = createJohn();
    let copy = blankCopy();
    grindAndApply(fakeRng(0.99), john, copy, materialById('lead-white'));
    grindAndApply(fakeRng(0.99), john, copy, materialById('orpiment'));
    assert.ok(activeFaults(copy).some(f => f.class === 'blackened'), 'lead first');
    copy = blankCopy();
    grindAndApply(fakeRng(0.99), john, copy, materialById('orpiment'));
    grindAndApply(fakeRng(0.99), john, copy, materialById('minium'));
    assert.ok(activeFaults(copy).some(f => f.class === 'blackened'), 'orpiment first');
  });

  test('verdigris eats through the leaf on its own slow clock', () => {
    const john = createJohn();
    const copy = blankCopy();
    grindAndApply(fakeRng(0.99), john, copy, materialById('verdigris'));
    const wait = materialById('verdigris').sim.corrodesAfterDays;
    ageCopy(copy, wait - 1);
    assert.ok(!copy.faults.some(f => f.class === 'corrosion'), 'not yet');
    ageCopy(copy, 1);
    assert.ok(copy.faults.some(f => f.class === 'corrosion'), 'a finished copy, corrupted after the scribe stopped checking');
  });

  test('ultramarine makes the book conspicuous', () => {
    const copy = blankCopy();
    grindAndApply(fakeRng(0.99), createJohn(), copy, materialById('ultramarine'));
    assert.equal(copy.conspicuous, true);
  });

  test('gold is refused without the licence, and marks the copy with it', () => {
    const john = createJohn();
    const copy = blankCopy();
    const refused = grindAndApply(fakeRng(0.99), john, copy, materialById('gold-leaf'));
    assert.equal(refused.applied, false);
    assert.equal(copy.gilded, false);
    john.procedure.licentia = true;
    const laid = grindAndApply(fakeRng(0.99), john, copy, materialById('gold-leaf'));
    assert.equal(laid.applied, true);
    assert.equal(copy.gilded, true, 'gold marks a licence-authorized copy');
  });
});

// ── concealment ──────────────────────────────────────────────

describe('Concealment decides how a copy dies', () => {
  function copy() {
    const s = createCopySession(fakeRng(), createJohn(), { exemplar: fixture({ units: 1 }), pool: [] });
    s.advance('trusting');
    return s.copy;
  }

  test('the four states, and no others', () => {
    assert.deepEqual([...CONCEALMENTS].sort(), ['bound', 'given', 'loose', 'shelved']);
    const c = copy();
    assert.equal(c.concealment, 'loose', 'quires start loose');
    assert.throws(() => conceal(c, 'buried'), /concealment/);
  });

  test('shelved is found; given is gone; bound and loose take their chances', () => {
    const shelved = copy(); conceal(shelved, 'shelved');
    assert.equal(inventoryFinds(fakeRng(0.99), shelved), true, 'the open shelf hides nothing');
    const given = copy(); conceal(given, 'given');
    assert.equal(given.given, true, 'it leaves your custody and your fate');
    assert.equal(inventoryFinds(fakeRng(0.0), given), false, '1323 cannot reach what was already elsewhere');
    const bound = copy(); conceal(bound, 'bound');
    assert.equal(inventoryFinds(fakeRng(0.5), bound), false, 'the spine lies for you, usually');
    assert.equal(inventoryFinds(fakeRng(0.1), bound), true, 'usually');
    const loose = copy(); conceal(loose, 'loose');
    assert.equal(inventoryFinds(fakeRng(0.4), loose), true, 'loose quires are a coin toss');
    assert.equal(inventoryFinds(fakeRng(0.6), loose), false);
  });

  test('the odds table is exported so the UI can quote it live (D-8 values unchanged)', () => {
    assert.deepEqual(CONCEALMENT_FOUND_CHANCE, { loose: 0.5, bound: 0.15, shelved: 1, given: 0 });
  });
});

// ── palimpsest ───────────────────────────────────────────────

describe('The palimpsest (a real prior fault, never mended)', () => {
  test('empty history yields nothing to scrape', () => {
    assert.equal(scrapeLeaf(fakeRng(), []), null);
    assert.equal(scrapeLeaf(fakeRng(), undefined), null);
  });

  test('a witness with copies but no faults yields nothing', () => {
    const clean = { copies: [{ exemplarId: 'armarium-lectionary', faults: [] }] };
    assert.equal(scrapeLeaf(fakeRng(), [clean]), null);
  });

  test('pulls a real fault, deterministically, under a seeded rng', () => {
    const witnesses = [{
      copies: [{ exemplarId: 'old-compilation', faults: [{ class: 'eyeskip' }, { class: 'dittography' }] }],
    }];
    const a = scrapeLeaf(new SeededRandom('scrape-1'), witnesses);
    const b = scrapeLeaf(new SeededRandom('scrape-1'), witnesses);
    assert.deepEqual(a, b, 'same seed, same ghost');
    assert.equal(a.exemplarId, 'old-compilation');
    assert.ok(['eyeskip', 'dittography'].includes(a.faultClass));
  });

  test('undertextDistraction assembles the shape but never the prose', () => {
    const undertext = { exemplarId: 'old-compilation', faultClass: 'eyeskip' };
    assert.equal(undertextDistraction(null, 'text'), null);
    const rec = undertextDistraction(undertext, 'a ghost of an old fault');
    assert.equal(rec.kind, 'undertext');
    assert.equal(rec.text, 'a ghost of an old fault');
    assert.equal(rec.status, 'invented');
    assert.ok(rec.sources.length > 0);
  });
});

// ── writing coverage (v3c stage) ─────────────────────────────

describe('Scriptorium writing coverage (every state has writing)', () => {
  test('scene intros, both registers of the same light', () => {
    for (const key of ['sceneAssigned', 'sceneIllicit']) {
      const rec = SCRIPTORIUM_TEXT[key];
      lint(rec, key);
      assert.ok(rec.rubric.startsWith('¶'), `${key} rubric`);
      assert.ok(rec.body.length > 40, `${key} body`);
    }
  });

  test('every exemplar has its acquisition felt in John\'s hand', () => {
    for (const e of EXEMPLARS) {
      const rec = SCRIPTORIUM_TEXT.acquire[e.id];
      assert.ok(rec, `${e.id} acquisition`);
      lint(rec, `acquire.${e.id}`);
      assert.ok(rec.text.length > 40, `${e.id} acquisition text`);
    }
    lint(SCRIPTORIUM_TEXT.sewnFirstLook, 'sewnFirstLook');
  });

  test('every hand has a name and a price in words', () => {
    for (const id of Object.keys(HANDS)) {
      const rec = SCRIPTORIUM_TEXT.hands[id];
      assert.ok(rec, `hand ${id}`);
      lint(rec, `hands.${id}`);
      assert.ok(rec.name.length > 3 && rec.line.length > 10, `hands.${id} words`);
    }
  });

  test('all three grades, all four correction beats', () => {
    for (const g of ['recollected', 'distracted', 'scattered']) {
      lint(SCRIPTORIUM_TEXT.grades[g], `grades.${g}`);
      assert.ok(SCRIPTORIUM_TEXT.grades[g].text.length > 40, g);
    }
    for (const c of ['cleanLie', 'expunctuation', 'firstCopy', 'verbaRefused']) {
      lint(SCRIPTORIUM_TEXT.correction[c], `correction.${c}`);
      assert.ok(SCRIPTORIUM_TEXT.correction[c].text.length > 40, c);
    }
  });

  test('the figure keeps one face; the clean-lie does not wink', () => {
    lint(SCRIPTORIUM_TEXT.figure.drawn, 'figure.drawn');
    lint(SCRIPTORIUM_TEXT.figure.gilded, 'figure.gilded');
    // D-7: no hedging tells in the silent-failure texts.
    assert.ok(!/\.\.\.|…|or does it/i.test(SCRIPTORIUM_TEXT.correction.cleanLie.text));
    assert.ok(!/but|yet|however/i.test(SCRIPTORIUM_TEXT.correction.cleanLie.text),
      'the lie must be perfect or it is a tell');
  });

  test('every pigment beat and hazard has writing', () => {
    for (const p of ['vermilion', 'ultramarine', 'verdigris', 'orpiment',
      'goldLaid', 'goldRefused', 'sickened', 'reaction']) {
      lint(SCRIPTORIUM_TEXT.pigment[p], `pigment.${p}`);
      assert.ok(SCRIPTORIUM_TEXT.pigment[p].text.length > 40, p);
    }
  });

  test('the light events speak, including the candle held for later', () => {
    for (const l of ['noticed', 'fire', 'seen']) {
      lint(SCRIPTORIUM_TEXT.light[l], `light.${l}`);
      assert.ok(SCRIPTORIUM_TEXT.light[l].text.length > 40, l);
    }
    lint(SCRIPTORIUM_TEXT.caught, 'caught');
  });

  test('the copy margin has a population, in known registers', () => {
    const kinds = ['mundane', 'memory', 'appetite', 'pencil'];
    assert.ok(COPY_DISTRACTIONS.length >= 10, 'a margin needs a population');
    for (const d of COPY_DISTRACTIONS) {
      lint(d, `COPY_DISTRACTIONS.${d.id}`);
      assert.ok(kinds.includes(d.kind), `${d.id} kind`);
      assert.ok(d.text.length > 10, `${d.id} text`);
      assert.ok(Number.isFinite(d.effects.pressure) && Number.isFinite(d.effects.despair), `${d.id} effects`);
    }
    assert.ok(COPY_DISTRACTIONS.some(d => d.kind === 'pencil'), 'the scholarship must also tempt at the desk');
  });

  test('the scriptorium pencil notes cite real bibliography', () => {
    assert.equal(SCRIPTORIUM_NOTES.length, 3);
    for (const n of SCRIPTORIUM_NOTES) {
      lint(n, n.id);
      assert.ok(n.text.length > 60, `${n.id} text`);
      assert.ok(n.cites?.length > 0, `${n.id} must cite`);
      for (const c of n.cites) assert.ok(BIBLIO[c], `${n.id} cites unknown key ${c}`);
    }
  });

  test('every concealment choice narrates and thinks (narrator + monologue)', () => {
    for (const state of ['loose', 'bound', 'shelved']) {
      const scene = SCRIPTORIUM_TEXT.concealment[state];
      lint(scene.narrator, `concealment.${state}.narrator`);
      lint(scene.monologue, `concealment.${state}.monologue`);
      assert.ok(scene.narrator.text.length > 20, `${state} narrator`);
      assert.ok(scene.monologue.text.length > 20, `${state} monologue`);
    }
  });

  test('transmission has both outcomes, and the recipient table covers all three channels', () => {
    for (const key of ['clean', 'corrupt']) {
      lint(SCRIPTORIUM_TEXT.transmission[key], `transmission.${key}`);
      assert.ok(SCRIPTORIUM_TEXT.transmission[key].text.length > 20, key);
    }
    for (const recipient of ['bridget', 'anseau', 'correspondent']) {
      assert.ok(RECIPIENT_NAMES[recipient]?.length > 5, `RECIPIENT_NAMES.${recipient}`);
    }
  });

  test('the framing ending: obedient/nothing-escaped are enveloped; the escaped variant composes from real facts', () => {
    lint(TRANSMISSION_ENDINGS.obedient, 'TRANSMISSION_ENDINGS.obedient');
    lint(TRANSMISSION_ENDINGS.nothingEscaped, 'TRANSMISSION_ENDINGS.nothingEscaped');
    const gilded = transmissionEndingText({ recipient: 'bridget', gilded: true, faults: [] }, []);
    assert.ok(/gold/.test(gilded), 'gilded takes precedence in the phrasing');
    const faulty = transmissionEndingText({ recipient: 'anseau', gilded: false, faults: [{ class: 'eyeskip' }] },
      [faultPhrase('eyeskip')]);
    assert.ok(/1 fault/.test(faulty) && /silent lacuna/.test(faulty));
    const clean = transmissionEndingText({ recipient: 'correspondent', gilded: false, faults: [] }, []);
    assert.ok(/clean, which almost never happens/.test(clean));
  });

  test('every under-text template produces real prose from the shared fault vocabulary', () => {
    for (const cls of Object.keys(FAULT_PHRASE)) {
      assert.ok(UNDERTEXT_TEXT[cls], `UNDERTEXT_TEXT.${cls}`);
      const text = UNDERTEXT_TEXT[cls](faultPhrase(cls));
      assert.ok(text.length > 30, `${cls} template`);
      const rec = undertextDistraction({ exemplarId: 'old-compilation', faultClass: cls }, text);
      lint(rec, `undertext.${cls}`);
    }
  });
});

// ── harness ──────────────────────────────────────────────────

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (err) {
    console.error(`✗ ${name}`);
    console.error(`  ${err.message}`);
    throw err;
  }
}

function describe(name, fn) {
  console.log(`\n${name}`);
  fn();
}
