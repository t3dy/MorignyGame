/**
 * MORIGNY — slice controller: one seeded day in the codex, driven by the
 * command alphabet (morigny/COMMANDS.md). Engine is pure and tested; this
 * file is presentation, keyboard dispatch, and flow.
 */

import {
  createJohn, pressureTier, isScrupulous,
  addFatigue, addResolve, addSuspicion, addPressure, addDespair,
} from './engine/state.js';
import { buildDay, stageRng } from './engine/day.js';
import { createRecitation } from './engine/recitation.js';
import { nightThreatens, resolveNight, successChance } from './engine/struggle.js';
import { dreamEligible, createVision, judge, reckonCorruption } from './engine/vision.js';
import { COMMANDS, LETTERS, NIGHT_KEYS } from './engine/commands.js';
import { confess } from './engine/struggle.js';
import { HOURS } from './data/hours.js';
import {
  HOUR_TEXT, VERSICLE, PROCEDURE_PRAYER, COMPLINE_PRAYER, DISTRACTIONS,
  TIER_TEXT, NIGHT_DELIBERATION, NIGHT_CHOICES, NIGHT_OUTCOMES, CONFESSION, VISION_SCENE,
  DREAM_SHUT, DISCERNMENT_OUTCOMES, PENCIL_NOTES, BIBLIO, DAYLIGHT, CONTENT_NOTE,
  JOURNEY, DRUGGED_DREAM, RADICAL_NOTE,
  SUMMONS, ROAD_TO_PARIS, EXAMINATION, EXAMINATION_ENVELOPE, VERDICTS,
  VERDICT_ENVELOPE, DEPARTURE_NOTE, READING_ROOM, TRANSMISSION_ENDINGS, transmissionEndingText,
} from './content/content.js';
import {
  loadChronicle, saveChronicle, recordDay, summonsDue,
  createExamination, answerQuestion, verdict,
} from './engine/chronicle.js';
import {
  loadWitnesses, saveWitness as pushWitness, buildStemma, survivingWitness, corruptionsOf,
  receivedCopy, faultPhrase,
} from './engine/stemma.js';
import {
  MAPS, createWorld, move, keepOffice, missedOffices, adjacentNpc, npcAt, tileAt,
} from './engine/world.js';
import { startTalk, ask, knownKeywords } from './engine/talk.js';
import { NPCS, CLOISTER_NPCS, KIN_NPCS } from './data/npcs.js';
import {
  createCopySession, drawFigure, grindAndApply,
  correctableMethods, correctFault, activeFaults, HANDS,
  CONCEALMENT_FOUND_CHANCE, conceal, inventoryFinds, scrapeLeaf, undertextDistraction,
} from './engine/scriptorium.js';
import { exemplarById } from './data/exemplars.js';
import { materialById } from './data/materials.js';
import {
  SCRIPTORIUM_TEXT, COPY_DISTRACTIONS, SCRIPTORIUM_NOTES, UNDERTEXT_TEXT,
} from './content/content.js';
import { SIGNPOST_TEXT } from './data/worldmap.js';
import { TILE, PAINTERS, paintFigure, paintNpc } from './ui/tiles.js';

const $ = id => document.getElementById(id);
const el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
};

function provenance(record) {
  const bits = (record.sources ?? [])
    .map(s => `${s.work}${s.locus ? `, ${s.locus}` : ''}`)
    .join('; ');
  return `[${record.status}${bits ? ` — ${bits}` : ''}]`;
}

// ── the apparatus (collapsible pencil-hand drawer) ─────────────
// Citations and scholarly notes live here, not inline in the reading
// column — a passage with real sources gets a small superscript marker;
// plain invented narration (no sources) gets none. Cleared per witness,
// same as the old footnote footer was.
let apparatus = [];

function apparatusLabel() {
  return $('hour-name')?.textContent || '';
}

function renderApparatus() {
  const body = $('apparatus-body');
  const count = $('apparatus-tab-count');
  body.replaceChildren();
  if (!apparatus.length) {
    body.appendChild(el('p', 'empty', 'Nothing cited yet this witness. As sourced passages and scholarly notes appear, they will collect here.'));
  } else {
    for (const entry of apparatus) {
      const d = el('div', 'apparatus-entry');
      if (entry.context) d.appendChild(el('span', 'context', entry.context));
      d.appendChild(el('span', 'note-text', entry.text));
      if (entry.citeLines) {
        for (const line of entry.citeLines) d.appendChild(el('cite', null, line));
      } else {
        for (const s of entry.record.sources ?? []) {
          d.appendChild(el('cite', null, `${s.work}${s.locus ? `, ${s.locus}` : ''}`));
        }
      }
      d.appendChild(el('span', 'status-tag', entry.record.status));
      body.appendChild(d);
    }
  }
  count.textContent = String(apparatus.length);
  count.hidden = apparatus.length === 0;
}

function resetApparatus() {
  apparatus = [];
  renderApparatus();
}

/** Push a citation entry; returns its 1-based marker number, or null if
 *  the record carries no real sources (nothing worth surfacing). */
function pushCitation(record, text) {
  if (!record.sources?.length) return null;
  apparatus.push({ context: apparatusLabel(), record, text });
  renderApparatus();
  return apparatus.length;
}

function openApparatus() {
  $('apparatus').hidden = false;
  $('apparatus-tab').setAttribute('aria-expanded', 'true');
}
function closeApparatus() {
  $('apparatus').hidden = true;
  $('apparatus-tab').setAttribute('aria-expanded', 'false');
}

function passage(record, text = record.body, cls = null) {
  const p = el('p', cls, text);
  const n = pushCitation(record, text);
  if (n) {
    const marker = el('sup', 'cite-marker', String(n));
    marker.title = provenance(record);
    marker.onclick = openApparatus;
    p.appendChild(marker);
  }
  return p;
}

/**
 * The narrator + John's-hand monologue pair (STYLE_GUIDE.md §The Four
 * Hands). A scene record with `{ narrator, monologue }` renders both in
 * order; a legacy single-voice `{ body }` record still renders through
 * `passage()` directly for scenes that were never given the split.
 */
function deliberation(scene) {
  const nodes = [];
  if (scene.narrator) nodes.push(passage(scene.narrator, scene.narrator.text, 'narrator'));
  if (scene.monologue) nodes.push(passage(scene.monologue, scene.monologue.text, 'monologue'));
  return nodes;
}

/** Renders either shape through one call site. */
function sceneBody(record) {
  return record.narrator || record.monologue ? deliberation(record) : [passage(record)];
}

// ── message scroll ────────────────────────────────────────────
function log(text, cls) {
  const line = el('div', cls, text);
  $('log').appendChild(line);
  $('log').scrollTop = $('log').scrollHeight;
}

// ── keyboard dispatch ─────────────────────────────────────────
// sceneKeys: letters live for the current scene. globalKeys: always live.
let sceneKeys = {};
let prompt = null; // sub-prompt override: {text, keys:{K:fn}}

function setKeys(map) {
  sceneKeys = map;
  renderCommands();
}

function act(letter, label, why, fn) {
  sceneKeys[letter] = fn;
  const b = el('button');
  b.appendChild(el('span', null, `${letter} — ${label}`));
  if (why) b.appendChild(el('span', 'why', why));
  b.onclick = fn;
  $('choices').appendChild(b);
  renderCommands();
  return b;
}

function clearActs() {
  sceneKeys = {};
  $('choices').replaceChildren();
  renderCommands();
}

document.addEventListener('keydown', e => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.target?.tagName === 'INPUT') return; // the Talk line owns its keys
  if (worldCtl && e.key.startsWith('Arrow')) {
    e.preventDefault();
    const d = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }[e.key];
    if (d) worldCtl.step(d[0], d[1]);
    return;
  }
  const letter = e.key.length === 1 ? e.key.toUpperCase() : e.key;
  if (prompt) {
    const fn = prompt.keys[letter];
    if (fn) { prompt = null; fn(); }
    return;
  }
  if (sceneKeys[letter]) return void sceneKeys[letter]();
  if (globalKeys[letter]) {
    // soul-verbs need a living run; before Matins the book only waits
    if (!john && letter !== 'Q') {
      return log('The book lies open at its first leaf. Begin, and the alphabet will live.', 'refused');
    }
    return void globalKeys[letter]();
  }
  if (COMMANDS[letter]) log(`${COMMANDS[letter].verb} — ${COMMANDS[letter].refusal}`, 'refused');
});

function subPrompt(text, keys) {
  prompt = { text, keys };
  log(text, 'bell');
}

// ── sidebar ───────────────────────────────────────────────────
const pips = (v, max) => '●'.repeat(v) + '○'.repeat(max - v);

function renderStatus() {
  if (!john) return;
  const s = $('status');
  s.replaceChildren(el('h3', null, 'zelus animae'));
  const rows = [
    ['fatigue', pips(john.fatigue, 10)],
    ['resolve', pips(john.resolve, 5)],
    ['pressure', pips(john.pressure, 10)],
    ['despair', pips(john.despair, 5)],
    ['suspicion', pips(john.suspicion, 10)],
  ];
  for (const [k, v] of rows) {
    const row = el('div', 'stat');
    row.appendChild(el('span', null, k));
    row.appendChild(el('span', 'pips', v));
    s.appendChild(row);
  }
  if (john.purity.polluted) s.appendChild(el('div', 'flag bad', 'unclean — the Work is shut'));
  if (isScrupulous(john)) s.appendChild(el('div', 'flag bad', 'scrupulous — holding fast costs double'));
  if (john.procedure.licentia) s.appendChild(el('div', 'flag gold', 'LICENTIA'));
  $('tier').textContent = pressureTier(john.pressure).toLowerCase();
}

function renderCommands() {
  const c = $('commands');
  c.replaceChildren(el('h3', null, 'the alphabet'));
  for (const letter of LETTERS) {
    const live = !!(sceneKeys[letter] || globalKeys[letter]);
    const d = el('div', `cmd${live ? ' live' : ''}`);
    d.appendChild(el('span', 'key', letter));
    d.appendChild(el('span', null, COMMANDS[letter].verb));
    c.appendChild(d);
  }
}

// ── always-on verbs ───────────────────────────────────────────
let stageFlags = {}; // per-stage once-limits (K, X)

const globalKeys = {
  L: () => log(currentLook || COMMANDS.L.refusal),
  Z: () => {
    log(`Fatigue ${john.fatigue}/10 · Resolve ${john.resolve}/5 · Pressure ${john.pressure}/10 ` +
      `· Despair ${john.despair}/5 · Suspicion ${john.suspicion}/10 · ` +
      `${john.purity.polluted ? 'unclean' : 'clean'} · prayer ${john.procedure.prayed ? john.procedure.quality : 'unsaid'}`);
  },
  K: () => {
    if (stageFlags.knelt) return log(COMMANDS.K.refusal, 'refused');
    stageFlags.knelt = true;
    addPressure(john, -1);
    log('You kneel where you are. A little of the weight sets itself down.');
    renderStatus();
  },
  X: () => {
    stageFlags.crossed = (stageFlags.crossed ?? 0) + 1;
    if (stageFlags.crossed === 1) {
      addPressure(john, -1);
      log('You make the sign of the cross, once, and mean it.');
    } else if (stageFlags.crossed === 2) {
      log(COMMANDS.X.refusal, 'refused');
    } else {
      addDespair(john, 1);
      log('Again the sign, and again — and each repetition believes itself less. The wheel turns.', 'refused');
    }
    renderStatus();
  },
  N: () => {
    addPressure(john, 1);
    log('You let the old wheels turn behind your eyes: notae, nested and shining. You know things a monk of Morigny should not. The knowing has a rent, and it is now due.');
    renderStatus();
  },
  Q: () => {
    if (journal) saveWitness();
    log('The book is closed. The witness is saved, such as it is.', 'bell');
    incipit();
  },
};

// ── run state ─────────────────────────────────────────────────
let john, day, stageIdx, journal, currentLook = '';
let worldCtl = null;   // live only during the world stage (arrow keys)
let chronicle = null;  // what accumulates across witnesses, toward 1323
let exam = null;       // the examination in progress

function start(seed, opts = {}) {
  john = createJohn();
  chronicle = loadChronicle(storage());
  journal = {
    seed, journey: !!opts.journey,
    prayed: false, night: null, dream: null, confession: null,
    officesKept: null, talked: [], copies: [],
  };
  resetApparatus();

  if (summonsDue(chronicle)) {
    // 1323. The day the letter comes is not an ordinary day.
    day = { seed, journey: false, stages: [
      { id: 'summons', kind: 'summons' },
      { id: 'examination', kind: 'examination' },
      { id: 'verdict', kind: 'verdict' },
      { id: 'stemma', kind: 'stemma' },
    ] };
    log('— A letter has come from Paris. —', 'bell');
  } else {
    day = buildDay(seed, opts);
    log(`— A new witness begins. seed: ${seed}${opts.journey ? ' · a road day' : ''} —`, 'bell');
  }
  stageIdx = 0;
  runStage();
}

function storage() {
  try {
    return window.localStorage;
  } catch {
    return { getItem: () => null, setItem: () => {} };
  }
}

function next() {
  stageIdx++;
  runStage();
}

function runStage() {
  const stage = day.stages[stageIdx];
  if (!stage) return;
  stageFlags = {};
  renderStatus();
  const handlers = {
    'office-full': officeFull, 'office-brief': officeBrief, chapter,
    daylight, world: worldStage, night, dream, reckoning,
    summons, examination, verdict: verdictStage, stemma: stemmaStage,
  };
  if (stage.kind !== 'world') worldCtl = null;
  handlers[stage.kind](stage);
}

const ui = {
  setHour(name) { $('hour-name').textContent = name; log(`✝ ${name}`, 'bell'); },
  scene({ rubric = '', verso = '' } = {}) {
    $('rubric').textContent = rubric;
    $('verso-body').textContent = verso;
    $('body').replaceChildren();
    $('verse').replaceChildren();
    $('margin').replaceChildren();
    clearActs();
    currentLook = verso || rubric;
  },
  body(node) {
    if (Array.isArray(node)) { for (const n of node) $('body').appendChild(n); return; }
    $('body').appendChild(node);
  },
  margin(node) { $('margin').appendChild(node); },
  footnote(note) {
    apparatus.push({
      context: apparatusLabel(),
      record: note,
      text: note.text,
      citeLines: (note.cites ?? []).map(c => BIBLIO[c]),
    });
    renderApparatus();
  },
};

// ── stages ────────────────────────────────────────────────────

function officeBrief(stage) {
  const hour = HOURS.find(h => h.id === stage.hourId);
  const text = HOUR_TEXT[stage.hourId];
  ui.setHour(hour.names[0]);
  ui.scene({ rubric: text.rubric, verso: TIER_TEXT[pressureTier(john.pressure)] });
  ui.body(sceneBody(text));
  addFatigue(john, hour.sim.fatigueCost);
  renderStatus();
  act('B', 'Let the bell carry the day onward.', '', next);
}

function officeFull(stage) {
  const hour = HOURS.find(h => h.id === stage.hourId);
  const text = HOUR_TEXT[stage.hourId];
  ui.setHour(hour.names[0]);
  ui.scene({ rubric: text.rubric, verso: TIER_TEXT[pressureTier(john.pressure)] });
  ui.body(sceneBody(text));
  addFatigue(john, hour.sim.fatigueCost);
  renderStatus();

  if (stage.procedureSlot) {
    act('O', 'Obey: say the office only.', 'The Rule asks nothing else of you.', () =>
      recite(stage, [VERSICLE.latin, VERSICLE.english], false));
    act('P', 'Pray the Work — the office, and within it, the first prayer.',
      'If it is scattered, it is nothing; and the night will ask about it.', () =>
      recite(stage, [VERSICLE.latin, ...PROCEDURE_PRAYER.verses], true));
  } else {
    recite(stage, COMPLINE_PRAYER.verses, false);
  }
}

function recite(stage, verses, isProcedure) {
  clearActs();
  const rng = stageRng(day, stage.id);
  const rec = createRecitation(rng, john, { verses, pool: DISTRACTIONS });
  const verseBox = $('verse');

  const step = () => {
    verseBox.replaceChildren();
    renderStatus();
    if (rec.done) return finish();
    if (!rec.pending) rec.advance();

    if (rec.pending) {
      const d = rec.pending;
      const gloss = el('div', `gloss ${d.kind}`, d.text);
      gloss.appendChild(el('span', 'provenance', provenance(d)));
      ui.margin(gloss);
      log('Something pulls at the edge of the page.', 'refused');
      clearActs();
      if (rec.canHoldFast()) {
        act('H', 'Hold fast to the text.',
          `Costs ${rec.holdFastCost()} resolve (you have ${john.resolve}).`,
          () => { rec.holdFast(); step(); });
      }
      act('E', 'Examine it. Attend.', 'The verse is lost; the margin gets its hearing.',
        () => {
          const record = rec.attend();
          if (record.kind === 'pencil') log(record.text, 'pencil-log');
          step();
        });
      return;
    }

    verseBox.appendChild(el('div', 'latin', verses[Math.min(rec.verse, verses.length - 1)]));
    verseBox.appendChild(el('div', 'said', `verse ${rec.verse} of ${verses.length}`));
    const filler = el('span', 'line-filler');
    filler.style.setProperty('--fill', `${(rec.verse / verses.length) * 100}%`);
    verseBox.appendChild(filler);
    clearActs();
    act('O', rec.verse >= verses.length - 1 ? 'Finish the prayer.' : 'The next verse.', '', step);
  };

  const finish = () => {
    const grade = rec.grade();
    if (isProcedure) {
      john.procedure.prayed = grade !== 'scattered';
      john.procedure.quality = grade;
      journal.prayed = john.procedure.prayed;
    }
    if (grade === 'scattered' && stage.hourId !== 'compline') {
      addSuspicion(john, 1);
      log('Your absence from your own mouth was noticed.', 'refused');
    }
    log(`The recitation was ${grade}.`);
    verseBox.replaceChildren(el('div', 'said',
      `The recitation was ${grade}.` +
      (isProcedure && !john.procedure.prayed ? ' The Work’s prayer did not hold.' : '')));
    clearActs();
    act('B', 'So ends the hour.', '', next);
  };

  step();
}

function chapter(stage) {
  const text = HOUR_TEXT[stage.hourId];
  ui.setHour('Prime · Chapter');
  ui.scene({ rubric: text.rubric, verso: TIER_TEXT[pressureTier(john.pressure)] });
  ui.body(sceneBody(text));
  const env = { sources: CONFESSION_SOURCES, status: 'adapted' };

  const say = (textStr, after) => {
    ui.body(passage({ ...env, body: textStr }, textStr));
    clearActs();
    act('B', after, '', next);
  };

  if (john.purity.polluted) {
    ui.body(deliberation(CONFESSION.offerPolluted));
    act('C', 'Confess it, plainly.', 'The saying aloud is the whole medicine and the whole price.', () => {
      confess(john, 'confess'); journal.confession = 'confess'; renderStatus();
      say(CONFESSION.confess, 'Go out to the day.');
    });
    act('B', 'Say nothing. Not today.', 'The Work stays shut, and the fault rides along.', () => {
      confess(john, 'delay'); journal.confession = 'delay'; renderStatus();
      say(CONFESSION.delay, 'Go out to the day.');
    });
  } else {
    ui.body(deliberation(CONFESSION.offerClean));
    act('B', 'You have nothing grave to say. Keep silence.', '', next);
    act('C', 'Confess anyway. Everything. Be safe.', 'The scrupulous wheel turns.', () => {
      confess(john, 'scruple'); journal.confession = 'scruple'; renderStatus();
      say(CONFESSION.scruple, 'Go out to the day, smaller.');
    });
  }
}

const CONFESSION_SOURCES = [
  { work: 'Fanger, Rewriting Magic', locus: 'scrupulosity (frame; verify loci)' },
];

// ── the scriptorium (daylight stage, v3c) ─────────────────────
// Spec: docs/SCRIPTORIUM_STAGE_SPEC.md. Silent failures keep success's
// face on screen by design (docs/NARRATIVE_DESIGN_REPORT.md §4).

function daylight(stage) {
  ui.setHour('Terce · Sext · None');
  ui.scene({ rubric: DAYLIGHT.rubric, verso: TIER_TEXT[pressureTier(john.pressure)] });
  ui.body(deliberation(DAYLIGHT));
  act('S', 'Scribe: the assigned leaf.', 'Obedience is a wall, and walls also shelter.',
    () => beginCopy(stage, exemplarById('armarium-lectionary'), true));
  act('I', 'Illuminate: steal the hour for the Work.', 'The light is where you are watched.',
    () => chooseWorkExemplar(stage));
  const undertext = scrapeLeaf(stageRng(day, `${stage.id}-scrape`), loadWitnesses(storage()));
  if (undertext) {
    const ghostExemplar = exemplarById(undertext.exemplarId) ?? exemplarById('armarium-lectionary');
    act('U', 'Use the knife: scrape an old leaf.',
      'The ghost of an old fault will ride along, and cost a little pressure to face.',
      () => beginCopy(stage, ghostExemplar, ghostExemplar.id === 'armarium-lectionary', undertext));
  }
  const canGiveAway = chronicle.custody.some(c => !c.given);
  act('T', 'Talk: the armarius, the sacrist' + (canGiveAway ? ', Bridget, or Brother Anseau' : '') + '.',
    canGiveAway ? 'Requisitions, warnings — or a copy, if you trust someone with it.' : 'Requisitions, and warnings.', () => {
      const keys = {
        A: () => openTalk(CLOISTER_NPCS.find(n => n.id === 'denis')),
        S: () => openTalk(CLOISTER_NPCS.find(n => n.id === 'maur')),
      };
      let prompt = 'Speak with: the armarius (A), or the sacrist (S)';
      if (canGiveAway) {
        keys.K = () => openTalk(KIN_NPCS.find(n => n.id === 'bridget'));
        keys.N = () => openTalk(CLOISTER_NPCS.find(n => n.id === 'anseau'));
        prompt += ', Bridget (K), or Brother Anseau (N)';
      }
      subPrompt(prompt + '?', keys);
    });
  act('B', 'Let the hour pass in choir and garden.', 'Nothing gained, nothing risked.', next);
}

function chooseWorkExemplar(stage) {
  const held = john.items.exemplars.map(exemplarById).filter(Boolean);
  if (held.length === 1) return beginCopy(stage, held[0], false);
  clearActs();
  held.forEach((ex, i) =>
    act(String(i + 1), ex.title, ex.hot ? 'Matter for a court, if found.' : '',
      () => beginCopy(stage, ex, false)));
}

function beginCopy(stage, exemplar, assigned, undertext = null) {
  clearActs();
  const intro = assigned ? SCRIPTORIUM_TEXT.sceneAssigned : SCRIPTORIUM_TEXT.sceneIllicit;
  $('rubric').textContent = intro.rubric;
  ui.body(passage(intro));
  if (!assigned) {
    const acq = SCRIPTORIUM_TEXT.acquire[exemplar.id];
    if (acq) ui.body(passage(acq, acq.text));
  }

  const rng = stageRng(day, `${stage.id}-copy-${exemplar.id}`);
  const pool = [...COPY_DISTRACTIONS, ...DISTRACTIONS.filter(d => d.kind === 'flesh')];
  if (undertext) {
    const phrase = faultPhrase(undertext.faultClass);
    const text = (UNDERTEXT_TEXT[undertext.faultClass] ?? UNDERTEXT_TEXT.eyeskip)(phrase);
    pool.push(undertextDistraction(undertext, text));
  }
  const session = createCopySession(rng, john, { exemplar, light: 'day', pool });
  if (undertext) session.copy.support = 'palimpsest';
  let hand = 'textualis';
  let seenEvents = 0;
  const verseBox = $('verse');

  const drainEvents = () => {
    for (; seenEvents < session.events.length; seenEvents++) {
      const ev = session.events[seenEvents];
      if (ev.type === 'noticed') { log(SCRIPTORIUM_TEXT.light.noticed.text, 'refused'); }
      if (ev.type === 'caught') { log(SCRIPTORIUM_TEXT.caught.text); }
      if (ev.type === 'fire') { log(SCRIPTORIUM_TEXT.light.fire.text, 'refused'); }
      if (ev.type === 'seen') { log(SCRIPTORIUM_TEXT.light.seen.text, 'refused'); }
    }
  };

  const showUnit = () => {
    verseBox.replaceChildren();
    renderStatus();
    const unit = session.layout[session.unitIndex];
    verseBox.appendChild(el('div', 'latin', unit.kind === 'verba'
      ? 'A line of the unknown words, letter by letter, construing nothing.'
      : 'The line under the eye, and the line under the pen.'));
    verseBox.appendChild(el('div', 'said',
      `unit ${session.unitIndex + 1} of ${session.layout.length} · ` +
      `units of light remaining: ${session.layout.length - session.unitIndex} · ` +
      `${SCRIPTORIUM_TEXT.hands[hand].name}`));
    clearActs();
    act('O', 'Copy the unit.', `In ${SCRIPTORIUM_TEXT.hands[hand].name}.`, () => {
      session.advance(hand);
      after();
    });
    for (const [key, id] of [['S', 'textualis'], ['C', 'cursive'], ['F', 'trusting']]) {
      if (id !== hand) {
        act(key, `Change hand: ${SCRIPTORIUM_TEXT.hands[id].name}.`,
          SCRIPTORIUM_TEXT.hands[id].line, () => { hand = id; showUnit(); });
      }
    }
  };

  const showDistraction = () => {
    const d = session.pending;
    const gloss = el('div', `gloss ${d.kind}`, d.text);
    gloss.appendChild(el('span', 'provenance', provenance(d)));
    ui.margin(gloss);
    log('Something pulls at the edge of the page.', 'refused');
    clearActs();
    if (session.canHoldFast()) {
      act('H', 'Hold fast to the leaf.',
        `Costs ${session.holdFastCost()} resolve (you have ${john.resolve}).`,
        () => { session.holdFast(); after(); });
    }
    act('E', 'Examine it. Attend.', 'The hand it leaves behind is unsteady.', () => {
      const record = session.attend();
      if (record.kind === 'pencil') log(record.text, 'pencil-log');
      after();
    });
  };

  const after = () => {
    drainEvents();
    renderStatus();
    if (session.pending) return showDistraction();
    if (session.done) return finishCopy();
    showUnit();
  };

  const finishCopy = () => {
    const copy = session.copy;
    verseBox.replaceChildren(el('div', 'said', `The copying was ${copy.grade}.`));
    const gradeText = SCRIPTORIUM_TEXT.grades[copy.grade];
    ui.body(passage(gradeText, gradeText.text));
    if (assigned) { addResolve(john, 1); renderStatus(); }
    afterWork(stage, exemplar, assigned, copy, { examined: false });
  };

  showUnit();
}

function afterWork(stage, exemplar, assigned, copy, flags) {
  clearActs();

  act('E', 'Examine: read the leaf over.', 'What reading can show, mend.', () => {
    const visible = activeFaults(copy)
      .filter(f => correctableMethods(copy, f).includes('expunctuation'));
    if (visible.length) {
      for (const f of visible) correctFault(copy, f, 'expunctuation');
      log(SCRIPTORIUM_TEXT.correction.expunctuation.text);
    } else {
      log(SCRIPTORIUM_TEXT.correction.cleanLie.text);
    }
    if (exemplar.sim.verbaShare > 0) log(SCRIPTORIUM_TEXT.correction.verbaRefused.text);
    if (!flags.examined) {
      log(SCRIPTORIUM_TEXT.correction.firstCopy.text);
      ui.footnote(SCRIPTORIUM_NOTES.find(n => n.id === 'note-first-copy'));
      flags.examined = true;
    }
    afterWork(stage, exemplar, assigned, copy, flags);
  });

  if (copy.figures.drawn < copy.figures.needed) {
    act('G', 'Gaze: draw the figure.', 'Geometry, proportion, the words in their houses.', () => {
      const rng = stageRng(day, `${stage.id}-figure-${exemplar.id}-${copy.figures.drawn}`);
      drawFigure(rng, john, copy);
      log((copy.gilded ? SCRIPTORIUM_TEXT.figure.gilded : SCRIPTORIUM_TEXT.figure.drawn).text,
        copy.gilded ? 'pencil-log' : undefined);
      if (!flags.figureNoted) {
        ui.footnote(SCRIPTORIUM_NOTES.find(n => n.id === 'note-verba-ignota'));
        flags.figureNoted = true;
      }
      renderStatus();
      afterWork(stage, exemplar, assigned, copy, flags);
    });
  }

  act('R', 'Rubricate: lay a color on the leaf.', 'The sacrist counts; the colors keep accounts of their own.', () => {
    subPrompt('Lay which color? V vermilion · U ultramarine · G verdigris · O orpiment · A gold', {
      V: () => layPigment(stage, exemplar, assigned, copy, flags, 'vermilion'),
      U: () => layPigment(stage, exemplar, assigned, copy, flags, 'ultramarine'),
      G: () => layPigment(stage, exemplar, assigned, copy, flags, 'verdigris'),
      O: () => layPigment(stage, exemplar, assigned, copy, flags, 'orpiment'),
      A: () => layPigment(stage, exemplar, assigned, copy, flags, 'gold-leaf'),
    });
  });

  act('B', 'Where does the leaf rest, tonight?', 'A copy is found or not by where it lives.', () => {
    clearActs();
    const stakes = state => `${Math.round(CONCEALMENT_FOUND_CHANCE[state] * 100)}% found, if the house is ever searched.`;
    act('L', 'Leave the quires loose.', stakes('loose'), () => settleConcealment(exemplar, assigned, copy, 'loose'));
    act('D', 'Bind them into a licit codex.', stakes('bound'), () => settleConcealment(exemplar, assigned, copy, 'bound'));
    act('S', 'Shelve them openly in the armarium.', stakes('shelved'), () => settleConcealment(exemplar, assigned, copy, 'shelved'));
  });
}

function settleConcealment(exemplar, assigned, copy, state) {
  conceal(copy, state);
  const record = {
    id: `${day.seed}-${exemplar.id}-${journal.copies.length}`,
    exemplarId: exemplar.id,
    assigned,
    grade: copy.grade,
    quality: copy.quality,
    faults: activeFaults(copy).map(f => ({ class: f.class, visible: f.visible, inherited: f.inherited })),
    faultsVisible: copy.faults.filter(f => !f.corrected && f.visible).length,
    faultsTotal: activeFaults(copy).length,
    corrupt: copy.corrupt,
    gilded: copy.gilded,
    conspicuous: copy.conspicuous,
    pigments: [...copy.pigments],
    support: copy.support ?? 'parchment',
    concealment: copy.concealment,
    given: false,
  };
  journal.copies.push(record);
  chronicle.everCopied = true;
  chronicle.custody.push(record);
  saveChronicle(storage(), chronicle);
  ui.body(deliberation(SCRIPTORIUM_TEXT.concealment[state]));
  ui.footnote(SCRIPTORIUM_NOTES.find(n => n.id === 'note-scribere'));
  clearActs();
  act('B', 'To Vespers.', '', next);
}

const PIGMENT_LINES = {
  'vermilion': 'vermilion', 'ultramarine': 'ultramarine', 'verdigris': 'verdigris',
  'orpiment': 'orpiment', 'gold-leaf': 'goldLaid',
};

function layPigment(stage, exemplar, assigned, copy, flags, materialId) {
  const mat = materialById(materialId);
  const rng = stageRng(day, `${stage.id}-pigment-${exemplar.id}-${copy.pigments.length}-${materialId}`);
  const res = grindAndApply(rng, john, copy, mat);
  if (!res.applied) {
    log(SCRIPTORIUM_TEXT.pigment.goldRefused.text, 'refused');
  } else {
    log(SCRIPTORIUM_TEXT.pigment[PIGMENT_LINES[materialId]].text,
      materialId === 'gold-leaf' ? 'pencil-log' : undefined);
    for (const ev of res.events) {
      if (ev.type === 'sickened') log(SCRIPTORIUM_TEXT.pigment.sickened.text, 'refused');
      if (ev.type === 'reaction') log(SCRIPTORIUM_TEXT.pigment.reaction.text, 'refused');
    }
  }
  renderStatus();
  afterWork(stage, exemplar, assigned, copy, flags);
}

// ── the world stage (journey day) ────────────────────────────
const VIEW_W = 15, VIEW_H = 11;
let talkOpen = false;

function worldStage() {
  ui.setHour('The Road');
  ui.scene({ rubric: JOURNEY.depart.rubric, verso: '' });
  ui.body(passage(JOURNEY.depart));
  ui.body(el('p', 'said',
    'Walk with the arrow keys. T talks to a neighbor; K keeps a rung hour where you stand; ' +
    'the abbey door ends the day’s wandering.'));

  const world = createWorld();
  const canvas = el('canvas', 'worldmap');
  canvas.width = VIEW_W * TILE;
  canvas.height = VIEW_H * TILE;
  $('verso-body').replaceChildren(canvas);
  const ctx = canvas.getContext('2d');

  const render = () => {
    const ox = world.x - Math.floor(VIEW_W / 2);
    const oy = world.y - Math.floor(VIEW_H / 2);
    ctx.fillStyle = '#22201b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let vy = 0; vy < VIEW_H; vy++) {
      for (let vx = 0; vx < VIEW_W; vx++) {
        const t = tileAt(world.mapId, ox + vx, oy + vy);
        if (t === null) continue;
        (PAINTERS[t] ?? PAINTERS['.'])(ctx, vx * TILE, vy * TILE);
        if (npcAt(world.mapId, ox + vx, oy + vy)) paintNpc(ctx, vx * TILE, vy * TILE);
      }
    }
    paintFigure(ctx, Math.floor(VIEW_W / 2) * TILE, Math.floor(VIEW_H / 2) * TILE);
  };

  const endStage = () => {
    worldCtl = null;
    const missed = missedOffices(world);
    journal.officesKept = world.kept.length;
    for (const _ of missed) addPressure(john, 1);
    if (missed.length) log(JOURNEY.officeMissedLine, 'refused');
    renderStatus();
    next();
  };

  worldCtl = {
    world,
    step(dx, dy) {
      if (talkOpen) return;
      const ev = move(world, dx, dy);
      if (ev.sign) log(SIGNPOST_TEXT);
      if (ev.blocked) log(JOURNEY.blocked[world.steps % JOURNEY.blocked.length], 'refused');
      if (ev.bell) {
        const name = ev.bell[0].toUpperCase() + ev.bell.slice(1);
        log(`✝ The hour of ${name} rings in you. (K to keep it where you stand.)`, 'bell');
      }
      if (ev.enter === 'etampes') {
        log('You pass under the gate of Étampes. The town smells of tallow, mud, and argument.', 'bell');
      }
      if (ev.exitTown) log('The gate lets you out with less ceremony than it let you in.');
      if (ev.enter === 'abbey') {
        log('The abbey takes you back like a breath drawn in.', 'bell');
        return endStage();
      }
      render();
    },
  };

  sceneKeys.T = () => {
    const npc = adjacentNpc(world);
    if (!npc) return log(COMMANDS.T.refusal, 'refused');
    openTalk(npc);
  };
  sceneKeys.K = () => {
    const kept = keepOffice(world);
    if (!kept) return log('No hour stands rung and unkept.', 'refused');
    addPressure(john, -1);
    if (kept.inTown) {
      addSuspicion(john, 1);
      log(JOURNEY.officeTown.text);
    } else {
      log(JOURNEY.officeWild.text);
    }
    renderStatus();
  };
  renderCommands();
  render();
}

function openTalk(npc) {
  talkOpen = true;
  if (!journal.talked.includes(npc.id)) journal.talked.push(npc.id);
  const convo = startTalk(npc);
  log(`You speak with ${npc.label}.`, 'bell');
  log(npc.greeting);

  const input = el('input');
  input.type = 'text';
  input.placeholder = 'ask a word… (name, job, bye)';
  input.className = 'talk-input';
  $('choices').appendChild(input);
  input.focus();

  const finish = () => {
    talkOpen = false;
    input.remove();
    log('You part ways.', 'bell');
  };

  input.addEventListener('keydown', e => {
    e.stopPropagation();
    if (e.key === 'Escape') return finish();
    if (e.key !== 'Enter') return;
    const word = input.value;
    input.value = '';
    log(`» ${word.trim().toLowerCase()}`);
    const res = ask(convo, word);
    log(res.text);
    if (res.unlocked.length) log(`(you might ask: ${res.unlocked.join(', ')})`, 'pencil-log');
    if (res.effect) applyTalkEffect(res.effect);
    if (res.ended) finish();
    else input.placeholder = `ask… (${knownKeywords(convo).join(', ')})`;
  });
}

function applyTalkEffect(effect) {
  if (effect && typeof effect === 'object' && effect.key === 'transmit-copy') {
    return transmitCopy(effect.recipient);
  }
  switch (effect) {
    case 'give-draught':
      john.items.draught++;
      log('(The poppy draught is in your scrip. U, on a bad night — at a price.)', 'pencil-log');
      break;
    case 'give-quire':
      john.items.quire++;
      log('(A ruled quire, wrapped. The Work has paper now.)', 'pencil-log');
      break;
    case 'suspicion':
      addSuspicion(john, 1);
      break;
    case 'lie':
      addPressure(john, 1);
      break;
    case 'honesty':
      addSuspicion(john, 1);
      addDespair(john, -1);
      break;
    case 'alms':
      addDespair(john, -1);
      break;
    case 'radical':
      john.disposition++;
      addSuspicion(john, 2);
      log('The pencil hand writes small and fast in the margin.', 'pencil-log');
      ui.footnote(RADICAL_NOTE);
      break;
    case 'give-exemplar-sewn': {
      const ex = exemplarById('isabel-sewn-quires');
      if (!john.items.exemplars.includes(ex.id)) {
        john.items.exemplars.push(ex.id);
        addSuspicion(john, ex.sim.suspicionOnAcquire);
        log(SCRIPTORIUM_TEXT.acquire[ex.id].text);
        log(SCRIPTORIUM_TEXT.sewnFirstLook.text);
        log('(The sewn quires ride in your scrip. I, on a cloister day, to copy from them.)', 'pencil-log');
      } else {
        log('(You already carry the sewn quires. One story of theirs is enough.)', 'pencil-log');
      }
      break;
    }
  }
  renderStatus();
}

/** The transmission itself (SCRIPTORIUM.md §3.7) — the offer's own words
 *  already fired via the NPC's keyword text (openTalk logs res.text
 *  first); this only resolves the mechanical fact of what changed hands,
 *  or didn't. FIFO: the first not-yet-given custody copy (D-style
 *  decision, docs/DECISIONS_AND_FORKS.md — a choose-which-copy menu
 *  would blur dialogue into inventory management). */
function transmitCopy(recipient) {
  const c = chronicle.custody.find(x => !x.given);
  if (!c) {
    log('(There is nothing yet in your keeping to give. The words were only words.)', 'pencil-log');
    return;
  }
  conceal(c, 'given');
  c.recipient = recipient;
  saveChronicle(storage(), chronicle);
  const hasFault = c.corrupt || (c.faults?.length ?? 0) > 0;
  log((hasFault ? SCRIPTORIUM_TEXT.transmission.corrupt : SCRIPTORIUM_TEXT.transmission.clean).text, 'pencil-log');
  renderStatus();
}

/** Legible stakes for a night verb (CLAUDE.md rule 10): the exact chance
 *  to hold, what it costs, and — for the two verbs that draw on it —
 *  that resolve is part of the number, so the willpower economy reads
 *  as a economy and not a mood. */
function nightStakes(verb) {
  const pct = Math.round(successChance(john, verb) * 100);
  const cost = { vigil: ' · costs 2 fatigue', cold: ' · costs 1 fatigue' }[verb] ?? '';
  const resolveNote = (verb === 'prayer' || verb === 'endure')
    ? ` (your resolve, ${john.resolve}/5, is part of that number)`
    : '';
  return `${pct}% to hold the night${resolveNote}${cost}.`;
}

function night(stage) {
  ui.setHour('The Dormitory');
  const tier = pressureTier(john.pressure);
  ui.scene({ rubric: '¶ Of the night.', verso: TIER_TEXT[tier] });
  ui.body(deliberation(NIGHT_DELIBERATION[tier]));

  const sleep = () => { addFatigue(john, -3); next(); };

  if (john.items.draught > 0) {
    act('U', 'Use the poppy draught.',
      'It shutters the house of the mind entire — no siege, and no visitors. None at all.', () => {
        john.items.draught--;
        addPressure(john, -3);
        journal.night = { outcome: 'drugged' };
        renderStatus();
        clearActs();
        act('R', 'Sink into it.', '', () => { addFatigue(john, -4); next(); });
      });
  }

  if (!nightThreatens(john)) {
    journal.night = { outcome: 'quiet' };
    act('R', 'Rest, while sleep is simple.', '', sleep);
    return;
  }

  const rng = stageRng(day, stage.id);
  const settle = result => {
    journal.night = result;
    ui.body(passage({ sources: [], status: 'invented' },
      NIGHT_OUTCOMES[result.verb]?.[result.outcome] ?? NIGHT_OUTCOMES.endure.lapse));
    renderStatus();
    clearActs();
    act('R', 'Let the rest of the night pass.', '', sleep);
  };

  for (const [key, verb] of Object.entries(NIGHT_KEYS)) {
    act(key, NIGHT_CHOICES[verb], nightStakes(verb), () => settle(resolveNight(rng, john, verb)));
  }
  act('Y', 'Yield.',
    'The game will not choose this for you. This always ends the same way — pollution, and a day\'s despair.', () => {
    john.purity.polluted = true;
    john.purity.confessed = false;
    john.pressure = 2;
    addDespair(john, 1);
    settle({ verb: 'endure', outcome: 'lapse' });
  });
}

function dream(stage) {
  ui.setHour('The Dream');
  if (journal.night?.outcome === 'drugged') {
    ui.scene({ rubric: DRUGGED_DREAM.rubric, verso: '' });
    ui.body(passage(DRUGGED_DREAM));
    journal.dream = 'drugged';
    act('B', 'Toward Matins, and the reckoning.', '', next);
    return;
  }
  if (!dreamEligible(john)) {
    ui.scene({ rubric: DREAM_SHUT.rubric, verso: '' });
    ui.body(passage(DREAM_SHUT));
    journal.dream = 'shut';
    act('B', 'Toward Matins, and the reckoning.', '', next);
    return;
  }
  const rng = stageRng(day, stage.id);
  const vision = createVision(rng);
  ui.scene({ rubric: VISION_SCENE.rubric, verso: '' });
  ui.body(passage(VISION_SCENE));
  for (const tell of vision.tells) {
    const p = el('p', 'ultramarine', tell.text);
    p.appendChild(el('span', 'provenance', `[tell: ${tell.category}${tell.ambiguous ? ' — ambiguous' : ''}]`));
    ui.body(p);
  }
  const outcome = key => {
    journal.dream = key;
    ui.body(el('p', key === 'licentia' ? 'gold' : null, DISCERNMENT_OUTCOMES[key]));
    renderStatus();
    clearActs();
    act('B', 'Toward Matins, and the reckoning.', '', next);
  };
  act('D', 'Discern the visitation.', 'Everything now depends on reading the marks right.', () => {
    subPrompt('Judge: of God (G), or make the Cross against it (X)?', {
      G: () => outcome(judge(john, vision, true)),
      X: () => outcome(judge(john, vision, false)),
    });
  });
  act('E', 'Examine the tells once more.', '', () => {
    for (const t of vision.tells) log(`${t.category}: ${t.ambiguous ? '(ambiguous) ' : ''}${t.text}`);
  });
}

function reckoning() {
  ui.setHour('The Reckoning');
  ui.scene({ rubric: '¶ The examination of conscience, and the ledger of the day.', verso: '' });

  const corrupted = reckonCorruption(john);
  const lines = [
    `The Work's prayer: ${journal.prayed ? `said, ${john.procedure.quality}` : 'not said, or it did not hold'}.`,
    `The night: ${journal.night?.outcome ?? 'quiet'}.`,
    `Confession: ${journal.confession ?? 'no matter, no scruple'}.`,
    `The dream: ${journal.dream ?? 'none'}${john.procedure.licentia ? ' — LICENTIA' : ''}.`,
    corrupted ? 'And at the putting-on of weight, the beam spoke: the work was rotten. It must be begun again, and cleanly.' : null,
    journal.journey
      ? `The road: hours kept ${journal.officesKept ?? 0} of 3; souls spoken with, ${journal.talked.length}.`
      : null,
    ...(journal.copies ?? []).map(c => {
      const ex = exemplarById(c.exemplarId);
      return `The desk: ${ex?.title ?? c.exemplarId} — ${c.grade}` +
        `${c.faultsVisible ? `; ${c.faultsVisible} fault${c.faultsVisible === 1 ? '' : 's'} mended or marked` : ''}` +
        `${c.gilded ? '; gold laid' : ''}${c.conspicuous ? '; a color past your station' : ''}.`;
    }),
    john.disposition > 0
      ? `The witness leans. (Disposition +${john.disposition}. The pencil hand is watching.)`
      : null,
    `Suspicion in the house: ${john.suspicion} of 10. Despair: ${john.despair} of 5.`,
  ].filter(Boolean);

  const ul = el('ul', 'ledger');
  for (const l of lines) ul.appendChild(el('li', null, l));
  ui.body(ul);
  renderStatus();

  const notes = PENCIL_NOTES.filter(n =>
    (n.id !== 'note-invented-prayer' || journal.prayed) &&
    (n.id !== 'note-struggle' || journal.night?.outcome !== 'quiet') &&
    (n.id !== 'note-audit' || (journal.dream && journal.dream !== 'shut')));
  for (const n of notes) ui.footnote(n);

  saveWitness();
  chronicle = recordDay(chronicle, {
    suspicion: john.suspicion,
    disposition: john.disposition,
    prayed: journal.prayed,
    licentia: john.procedure.licentia,
  });
  saveChronicle(storage(), chronicle);
  if (summonsDue(chronicle)) {
    log('Word of the book has travelled further than the book has. Something will come of it.', 'refused');
  }

  act('J', 'Journal: write the day into the Liber.', 'He wrote it all down. That is why any of this exists.', () => {
    addDespair(john, -1); renderStatus();
    log('You write the day as it was, sparing no one, least of all yourself. The page holds it so you need not.', 'pencil-log');
    clearActs();
    act('B', 'Begin another day. (A new witness.)', '', () =>
      start(`${day.seed}-${Math.floor(Math.random() * 1e6)}`));
  });
  act('B', 'Begin another day. (A new witness.)', '', () =>
    start(`${day.seed}-${Math.floor(Math.random() * 1e6)}`));
}

function saveWitness(extra = {}) {
  pushWitness(storage(), {
    ...journal,
    licentia: john.procedure.licentia,
    corrupt: john.procedure.corrupt,
    suspicion: john.suspicion,
    despair: john.despair,
    disposition: john.disposition,
    at: Date.now(),
    ...extra,
  });
}

// ── 1323 ──────────────────────────────────────────────────────

function summons() {
  ui.setHour('The Letter');
  ui.scene({ rubric: SUMMONS.rubric, verso: '' });
  ui.body(passage(SUMMONS));
  act('B', 'Take the road to Paris.', 'Three days, with the Work against your ribs.', () => {
    ui.body(passage(ROAD_TO_PARIS, ROAD_TO_PARIS.text));
    clearActs();
    act('B', 'Enter the room where they are waiting.', '', next);
  });
}

function examination() {
  exam = createExamination(chronicle);
  ui.setHour('The Examination');
  askQuestion();
}

function askQuestion() {
  const q = EXAMINATION[exam.index];
  ui.scene({ rubric: q.rubric, verso: `Question ${exam.index + 1} of ${EXAMINATION.length}.` });
  ui.body(passage(EXAMINATION_ENVELOPE, q.question));

  const answer = stance => {
    ui.body(passage(EXAMINATION_ENVELOPE, q.stances[stance]));
    if (stance === 'scorn') { john.disposition++; renderStatus(); }
    answerQuestion(exam, stance);
    clearActs();
    if (exam.done) {
      act('B', 'They confer. It does not take long.', '', next);
    } else {
      act('B', 'The next question.', '', askQuestion);
    }
  };

  act('O', 'Submit. Hold what the Church holds.', 'Obedience is not the opposite of the Work.',
    () => answer('submit'));
  act('D', 'Defend it. Reasonably, and to the point.', 'The fruits, the authorization, the asking.',
    () => answer('defend'));
  act('W', 'Answer them as they deserve.', 'This road, walked far enough, leaves the record.',
    () => answer('scorn'));
}

function verdictStage() {
  const key = verdict(exam);
  const v = VERDICTS[key];
  ui.setHour('The Verdict');
  ui.scene({ rubric: v.rubric, verso: 'They burn it. Every road burns it.' });
  ui.body(passage(VERDICT_ENVELOPE[key], v.body));

  // 1323 destroys what is in the room — resolved once, mechanically real,
  // against the engine's own tested odds (SCRIPTORIUM.md §3.6-3.7).
  const inventoryRng = stageRng(day, 'verdict-inventory');
  for (const c of chronicle.custody) c.found = inventoryFinds(inventoryRng, c);

  chronicle.examined = true;
  saveChronicle(storage(), chronicle);
  journal.verdict = key;
  saveWitness({ departed: key === 'departed' });

  if (key === 'departed') {
    ui.footnote(DEPARTURE_NOTE);
    log('The pencil hand writes across the margin, and does not stop at the edge.', 'pencil-log');
  }
  act('B', 'And then, a long time afterward…', '', next);
}

function stemmaStage() {
  ui.setHour('The Stemma');
  ui.scene({ rubric: READING_ROOM.rubric, verso: '' });
  ui.body(passage(READING_ROOM));

  const nodes = buildStemma(loadWitnesses(storage()));
  const received = survivingWitness(nodes);

  const tree = el('div', 'stemma');
  for (const n of nodes) {
    const row = el('div', `stemma-node${n.contaminated ? ' contaminated' : ''}${received && n.index === received.index ? ' received' : ''}`);
    const head = n.parent ? `${n.parent} → ${n.siglum}` : `${n.siglum} (archetype)`;
    row.appendChild(el('span', 'siglum', head));
    const faults = n.own.length ? n.own.join('; ') : 'no new faults';
    row.appendChild(el('span', 'faults',
      `${faults}${n.inherited.length ? ` · inherits ${n.inherited.length}` : ''}` +
      `${n.licentia ? ' · LICENTIA' : ''}${n.contaminated ? ' · contaminated' : ''}`));
    tree.appendChild(row);
  }
  ui.body(tree);

  // The physical object, not the day's narrative: what the scriptorium
  // actually produced and whether custody or 1323 got to it first
  // (docs/DECISIONS_AND_FORKS.md F-8; SCRIPTORIUM.md §3.7).
  const copy = receivedCopy(chronicle.custody);
  if (!chronicle.everCopied) {
    ui.body(passage(TRANSMISSION_ENDINGS.obedient, TRANSMISSION_ENDINGS.obedient.text));
  } else if (!copy) {
    ui.body(passage(TRANSMISSION_ENDINGS.nothingEscaped, TRANSMISSION_ENDINGS.nothingEscaped.text));
  } else {
    const faultPhrases = (copy.faults ?? []).map(f => faultPhrase(f.class));
    ui.body(el('p', 'gold', transmissionEndingText(copy, faultPhrases)));
  }

  // The per-day descent (a different, complementary question — which
  // day's narrative is the stemma's best node) still gets its own line.
  if (received) {
    ui.body(el('p', null,
      `Among the days themselves, witness ${received.siglum} is the one the record would ` +
      `keep, if records kept days instead of leaves.`));
  }

  for (const n of PENCIL_NOTES.filter(p => p.id === 'note-witness')) ui.footnote(n);

  act('Q', 'Close the book.', 'The chronicle is spent; a new one begins after this.', () => {
    incipit();
  });
}

// ── incipit ──────────────────────────────────────────────────

$('apparatus-tab').onclick = () =>
  ($('apparatus').hidden ? openApparatus() : closeApparatus());
$('apparatus-close').onclick = closeApparatus;
renderApparatus();

function incipit() {
  john = null; day = null; journal = null;
  ui.setHour('Incipit');
  ui.scene({ rubric: '¶ Here begins the book of the flowers of heavenly teaching.', verso: '' });
  ui.body(el('p', null,
    'MORIGNY — one day and one night in the life of Brother John, monk of Morigny, ' +
    'who practiced a forbidden art, repented of it, and rebuilt it in the Virgin’s name; ' +
    'and who wrote down his temptations so exactly that we can, seven centuries on, attempt this.'));
  ui.body(el('p', 'pencil-note', CONTENT_NOTE));
  const seed = `witness-${Math.floor(Math.random() * 1e6)}`;
  act('B', 'Begin at Matins — a day within the walls.', `seed: ${seed}`, () => start(seed));
  act('E', 'Begin at Matins — a road day: the errand to Étampes.',
    'The world, with witnesses. Arrow keys walk; T talks.', () => start(seed, { journey: true }));
  renderCommands();
}

incipit();
