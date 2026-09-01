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
import { runRecitationBlock, runCopyBlock } from './engine/stance.js';
import { snapshotJohn, composeStanceNarration } from './engine/narration.js';
import {
  STANCE_CHOICE, STANCE_OPTIONS, STUDY_SCENE, STUDY_TEXT, STUDY_LEVELED,
} from './content/stance_content.js';
import { createBeatLog } from './engine/beatlog.js';
import { FACULTIES, loadFaculties, study, reach, dispositionOf } from './engine/faculties.js';
import { loadMemories, memoryDue, fireMemory, echoFor } from './engine/memory.js';
import { MEMORIES } from './content/memories.js';
import {
  loadRiskBag, buildEncounterDeck, drawEncounter, spendEncounter,
  availableOptions, applyOption,
} from './engine/encounters.js';
import { ENCOUNTERS } from './content/encounters.js';
import {
  loadLiberFlorum, composePrayer, disposition as bookDisposition,
  glossPrayer, scrapePrayer, unglossedCorruptions,
} from './engine/liberflorum.js';
import {
  COMPOSE_SCENE, COMPOSE_OPTIONS, INCIPITS, INCIPITS_ENVELOPE, COMPOSE_OUTCOME,
  INTERVAL_TEXT, INTERVAL_ENVELOPE, BEAT_ARRIVALS,
  BOOK_READING, BOOK_CHARACTER_NOTES, GLOSS_SCENE, GLOSS_OPTIONS, GLOSS_OUTCOME,
  COMPOSE_ADDRESS, ADDRESS_OPTIONS, LEGITIMATION_OPTIONS, ADDRESS_ENVELOPE, SLIPPED,
  RESTRICTED_SHELF, INFIRMARY_HOUR, WORKSHOP_HOUR, GARDEN_HOUR,
} from './content/liberflorum_content.js';
import { SeededRandom } from './engine/random.js';
import {
  loadCalendar, stride, advance as advanceTime, format as formatDate, weeks as toWeeks,
} from './engine/calendar.js';
import { loadPractice, bookCharacter, invest } from './engine/practice.js';
import {
  ADDRESSES, LEGITIMATIONS, resolveAddress, suspicionFor, operatorPerceives,
  loadLedger, record as recordAddress, addressByLevel, addressById,
} from './engine/address.js';
import { PLACES, PLACE_IDS } from './data/places.js';
import {
  FACTIONS, loadFactions, reactTo, ecclesiasticalPressure, poles,
} from './engine/factions.js';
import {
  loadBridget, METHOD, teach, inCrisis, renunciationAvailable,
  renounce as bridgetRenounce, analyse as bridgetAnalyse, literate,
} from './engine/bridget.js';
import {
  BRIDGET_ASKS, TEACH_OPTIONS, TEACH_OUTCOME, ALLELUIA, ALLELUIA_AFTER,
  BRIDGET_NIGHT, BRIDGET_NIGHT_OPTIONS, BRIDGET_NIGHT_OUTCOME, TRAMPLE,
} from './content/bridget_content.js';
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
  drawFigure, grindAndApply,
  correctableMethods, correctFault, activeFaults,
  CONCEALMENT_FOUND_CHANCE, conceal, inventoryFinds, scrapeLeaf, undertextDistraction,
} from './engine/scriptorium.js';
import { exemplarById } from './data/exemplars.js';
import { materialById } from './data/materials.js';
import {
  SCRIPTORIUM_TEXT, COPY_DISTRACTIONS, SCRIPTORIUM_NOTES, UNDERTEXT_TEXT,
} from './content/content.js';
import { SIGNPOST_TEXT } from './data/worldmap.js';
import { LEAVES } from './data/leaves.js';
import { ASSETS_MANIFEST } from './data/assets_manifest.js';
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
  beatlog.line(cls?.split(' ')[0] ?? 'text', text, record);
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

/** Bridget's own hand: her voice, not John's (bridget_content.js
 *  register note). Rendered in its own class so a reader always knows
 *  whose head they are in. */
function herVoice(record) {
  return passage(record, record.text, 'bridget');
}

/** Renders either shape through one call site. */
function sceneBody(record) {
  return record.narrator || record.monologue ? deliberation(record) : [passage(record)];
}

// ── message scroll ────────────────────────────────────────────
function log(text, cls) {
  const line = el('div', cls, text);
  if (cls !== 'bell') beatlog.line(cls ?? 'scroll', text);
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
  const recorded = () => {
    beatlog.choice(letter, label, Object.keys(sceneKeys));
    fn();
  };
  sceneKeys[letter] = recorded;
  const b = el('button');
  b.appendChild(el('span', null, `${letter} — ${label}`));
  if (why) b.appendChild(el('span', 'why', why));
  b.onclick = recorded;
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
  const trained = Object.keys(FACULTIES).filter(id => john.faculties?.[id] > 0);
  if (trained.length) {
    const row = el('div', 'stat faculties');
    row.appendChild(el('span', null, 'lectio'));
    const bookD = chronicle?.liberFlorum ? bookDisposition(chronicle.liberFlorum) : 0;
    row.appendChild(el('span', 'pips',
      trained.map(id => {
        const have = john.faculties[id];
        const can = reach(john, id, { book: bookD });
        // Trained but out of reach shows as hollow: the knowledge is
        // his, and tonight he cannot get at it (NEWDIRECTIONS §2).
        return `${FACULTIES[id].label} ${'●'.repeat(can)}${'○'.repeat(have - can)}`;
      }).join(' · ')));
    s.appendChild(row);
  }
  if (chronicle?.factions) {
    // The house has several minds (LOOP_SYNTHESIS §6). Named, not numbered:
    // who is most for him and most against him this season.
    const { friend, enemy } = poles(chronicle.factions);
    if (chronicle.factions[friend] !== chronicle.factions[enemy]) {
      const row = el('div', 'stat faculties');
      row.appendChild(el('span', null, 'the house'));
      row.appendChild(el('span', 'pips', FACTIONS[friend].label + ' · against: ' + FACTIONS[enemy].label));
      s.appendChild(row);
    }
  }
  if (john.purity.polluted) s.appendChild(el('div', 'flag bad', 'the observance is broken — the Work is shut'));
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
let beatlog = createBeatLog(); // the day as rendered (v4 §7)
let pendingMemory = null;      // a vignette owed, to be paid at the reckoning
/** At most one special beat per day — a memory OR an encounter, never
 *  both. Keeps the input budget at 10 and the pacing readable. */
let specialFiredToday = false;
let currentPlace = null;      // the room the daylight hour is being spent in
let pendingUndertext = null;  // a scrapeable old fault, computed once per day
let lastStride = 0;       // days of sim-time this witness stands after
let crossedBeats = [];    // historical beats the stride carried us past
let worldCtl = null;   // live only during the world stage (arrow keys)
let chronicle = null;  // what accumulates across witnesses, toward 1323
let exam = null;       // the examination in progress

function start(seed, opts = {}) {
  chronicle = loadChronicle(storage());
  beatlog = createBeatLog();
  pendingMemory = null;
  john = createJohn();
  // A licence earned in a prior night's dream outlives the day it was
  // granted (D-18): it carries forward until spent on a gilding.
  john.procedure.licentia = chronicle.licentia;
  // Faculties are a life's accretion, not a day's mood (v4 §5).
  john.faculties = loadFaculties(chronicle.faculties);
  chronicle.memories = loadMemories(chronicle.memories); // the life behind the day (v4 §4)
  // The encounter deck is built once per chronicle and outlasts the run
  // (v4 §6b): a witness meets a fraction of the world, never all of it.
  chronicle.risk = loadRiskBag(chronicle.risk);
  // The book he is writing, which outlives every day (NEWDIRECTIONS §4).
  chronicle.liberFlorum = loadLiberFlorum(chronicle.liberFlorum);
  chronicle.calendar = loadCalendar(chronicle.calendar);
  chronicle.practice = loadPractice(chronicle.practice);
  chronicle.bridget = loadBridget(chronicle.bridget);
  chronicle.addresses = loadLedger(chronicle.addresses);
  chronicle.factions = loadFactions(chronicle.factions);
  // Sim-time: a played day is a day the record remembers, and the
  // calendar moves weeks or a season between them (engine/calendar.js).
  if (chronicle.days > 0) {
    lastStride = stride(new SeededRandom(`${seed}-stride`));
    crossedBeats = advanceTime(chronicle.calendar, lastStride);
  } else { lastStride = 0; crossedBeats = []; }
  saveChronicle(storage(), chronicle);
  chronicle.encountersFired = chronicle.encountersFired ?? [];
  if (!Array.isArray(chronicle.deck) || !chronicle.deck.length) {
    chronicle.deck = buildEncounterDeck(
      new SeededRandom(chronicle.deckSeed ?? (chronicle.deckSeed = `deck-${seed}`)),
      ENCOUNTERS,
    );
  }
  specialFiredToday = false;
  currentPlace = null;
  pendingUndertext = scrapeLeaf(new SeededRandom(`${seed}-scrape`), loadWitnesses(storage()));
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
    log(`— ${formatDate(chronicle.calendar)}. A new witness begins.${opts.journey ? ' A road day.' : ''} —`, 'bell');
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
  setHour(name) {
    $('hour-name').textContent = name;
    if (chronicle?.calendar) $('dateline').textContent = formatDate(chronicle.calendar);
    beatlog.begin(day?.stages?.[stageIdx]?.id ?? null, name);
    log(`✝ ${name}`, 'bell');
  },
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
  /** A sourced historical image (ART_SOURCES.md pipeline; CLAUDE.md
   *  rule 7: date visible on screen, always — never just in the
   *  apparatus). Grisaille by default; `leaf.color` is the vision's
   *  earned exception. Full provenance still reaches the apparatus
   *  drawer, for the reader who wants the institution and shelfmark. */
  leaf(leaf) {
    const asset = ASSETS_MANIFEST.find(a => a.id === leaf.assetId);
    const fig = el('figure', `leaf${leaf.color ? '' : ' grisaille'}`);
    const img = document.createElement('img');
    img.src = `${import.meta.env.BASE_URL}${leaf.src}`;
    img.alt = leaf.alt;
    img.loading = 'lazy';
    fig.appendChild(img);
    fig.appendChild(el('div', 'leaf-dateline', leaf.dateline));
    $('body').appendChild(fig);
    if (asset) {
      const n = pushCitation(
        { sources: [{ work: asset.institution, locus: [asset.shelfmark, asset.folio].filter(Boolean).join(', ') }], status: asset.status },
        leaf.caption,
      );
      const cap = el('p', 'pencil-note leaf-caption', leaf.caption);
      if (n) {
        const marker = el('sup', 'cite-marker', String(n));
        marker.title = `[${asset.status} — ${asset.institution}, ${asset.shelfmark}]`;
        marker.onclick = openApparatus;
        cap.appendChild(marker);
      }
      $('body').appendChild(cap);
    }
  },
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

/** The stretch of unremembered life since the last played day, and any
 *  historical beat it carried us past (engine/calendar.js). */
function renderInterval() {
  if (!lastStride) return;
  const w = toWeeks(lastStride);
  const text = w <= 6 ? INTERVAL_TEXT.short(w) : w <= 20 ? INTERVAL_TEXT.season(w) : INTERVAL_TEXT.long(w);
  ui.body(passage(INTERVAL_ENVELOPE, text, 'narrator interval'));
  for (const beat of crossedBeats) {
    const arrival = BEAT_ARRIVALS[beat.id];
    if (arrival) ui.body(deliberation(arrival));
  }
  lastStride = 0;
  crossedBeats = [];
}

function officeFull(stage) {
  const hour = HOURS.find(h => h.id === stage.hourId);
  const text = HOUR_TEXT[stage.hourId];
  ui.setHour(hour.names[0]);
  ui.scene({ rubric: text.rubric, verso: TIER_TEXT[pressureTier(john.pressure)] });
  ui.body(sceneBody(text));
  if (stage.procedureSlot) renderInterval(); // Matins opens the day, and the year
  addFatigue(john, hour.sim.fatigueCost);
  renderStatus();

  // v4 (docs/V4_LOOP_REDESIGN.md §1): stance up front, outcome narrated.
  ui.body(deliberation(STANCE_CHOICE.office));
  const officeVerses = stage.procedureSlot
    ? [VERSICLE.latin, VERSICLE.english]
    : COMPLINE_PRAYER.verses;
  stanceActs(stance => recite(stage, officeVerses, false, stance));
  if (stage.procedureSlot) {
    act('P', 'Pray the Work — the office, and within it, the first prayer. Vigilant, as it must be.',
      `If it is scattered, it is nothing; and the night will ask about it. ${resolveQuote()}`, () =>
      recite(stage, [VERSICLE.latin, ...PROCEDURE_PRAYER.verses], true, 'vigilant'));
  }
}

/** The three stance options, stakes legible, live pool quoted (rule 10). */
function stanceActs(onChoose) {
  const spendNote = s => (s === 'hasty' ? '' : ` ${resolveQuote()}`);
  const keys = { routine: 'O', vigilant: 'V', hasty: 'H' };
  for (const s of ['routine', 'vigilant', 'hasty']) {
    act(keys[s], STANCE_OPTIONS[s].label, STANCE_OPTIONS[s].why + spendNote(s), () => onChoose(s));
  }
}

function resolveQuote() {
  return `(You have ${john.resolve} resolve.)`;
}

/** Render one block's five-voice outcome: narrator, siege, monologue,
 *  and the game-state voice's dry ledger underneath. */
function renderStanceOutcome(narration) {
  ui.body(passage(narration.narrator, narration.narrator.text, 'narrator'));
  for (const line of narration.siege.lines) {
    ui.body(passage({ sources: narration.siege.sources, status: narration.siege.status }, line, 'narrator siege'));
  }
  ui.body(passage(narration.monologue, narration.monologue.text, 'monologue'));
  const gs = el('div', 'gamestate');
  for (const line of narration.gameState) {
    gs.appendChild(el('div', null, line));
    beatlog.line('gamestate', line);
  }
  ui.body(gs);
}

/** Attended pencil distractions still cost their verse aloud — the
 *  scholarship got its hearing, so the reader gets the note. */
function surfaceAttendedPencil(outcome) {
  for (const d of outcome.distractions) {
    if (d.action === 'attended' && d.record.kind === 'pencil') log(d.record.text, 'pencil-log');
  }
}

function recite(stage, verses, isProcedure, stance) {
  clearActs();
  const rng = stageRng(day, stage.id);
  const before = snapshotJohn(john);
  const outcome = runRecitationBlock(rng, john, { verses, pool: DISTRACTIONS, stance });
  const grade = outcome.grade;
  if (isProcedure) {
    john.procedure.prayed = grade !== 'scattered';
    john.procedure.quality = grade;
    journal.prayed = john.procedure.prayed;
  }
  if (grade === 'scattered' && stage.hourId !== 'compline') {
    addSuspicion(john, 1);
    log('Your absence from your own mouth was noticed.', 'refused');
  }
  const narration = composeStanceNarration(outcome, before, snapshotJohn(john));
  renderStanceOutcome(narration);
  surfaceAttendedPencil(outcome);
  log(`The recitation was ${grade}.`);
  $('verse').replaceChildren(el('div', 'said',
    `The recitation was ${grade}.` +
    (isProcedure && !john.procedure.prayed ? ' The Work’s prayer did not hold.' : '')));
  renderStatus();
  act('B', 'So ends the hour.', '', next);
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

/**
 * The daylight hour, in two questions (docs/LOOP_SYNTHESIS.md §5):
 * WHERE does he spend it, and WHAT does he do there. Page's monastery
 * is a production environment — books, private doors, herbs, lead,
 * seals, and a gate the world comes through — so the room he chooses
 * decides what is even possible, and gives encounters somewhere to
 * happen.
 */
function daylight(stage) {
  ui.setHour('Terce · Sext · None');
  ui.scene({ rubric: DAYLIGHT.rubric, verso: TIER_TEXT[pressureTier(john.pressure)] });
  if (chronicle.days === 0) ui.leaf(LEAVES.scriptorium);
  ui.body(deliberation(DAYLIGHT));
  memoryEcho('orleans-art');
  for (const id of PLACE_IDS) {
    const place = PLACES[id];
    act(place.key, place.label + '.', place.line, () => enterPlace(stage, id));
  }
  act('B', 'Let the hour pass in choir and garden.', 'Nothing gained, nothing risked.', leaveDaylight);
}

/** What each room affords, once he is standing in it. */
function enterPlace(stage, placeId) {
  const place = PLACES[placeId];
  clearActs();
  currentPlace = placeId;
  $('rubric').textContent = '¶ ' + place.label + '.';
  ui.body(passage({ sources: place.sources, status: place.status }, place.line, 'narrator'));
  for (const a of (PLACE_ACTIONS[placeId] ?? [])) {
    if (a.when && !a.when()) continue;
    act(a.key, a.label, a.why(), () => a.go(stage));
  }
  act('B', 'Somewhere else, then.', '', () => daylight(stage));
}

/**
 * Actions by room. Each keeps its own gate, so the menu never offers
 * something the state cannot honour.
 */
const PLACE_ACTIONS = {
  scriptorium: [
    { key: 'S', label: 'Scribe: the assigned leaf.',
      why: () => 'Obedience is a wall, and walls also shelter.',
      go: stage => beginCopy(stage, exemplarById('armarium-lectionary'), true) },
    { key: 'I', label: 'Illuminate: steal the hour for the Work.',
      why: () => 'The light is where you are watched.',
      go: stage => maybeMemory('first-work-hour', () => chooseWorkExemplar(stage)) },
    { key: 'U', label: 'Use the knife: scrape an old leaf.',
      when: () => !!pendingUndertext,
      why: () => 'The ghost of an old fault will ride along, and cost a little pressure to face.',
      go: stage => {
        const ghost = exemplarById(pendingUndertext.exemplarId) ?? exemplarById('armarium-lectionary');
        beginCopy(stage, ghost, ghost.id === 'armarium-lectionary', pendingUndertext);
      } },
  ],
  armarium: [
    { key: 'L', label: 'Lectio: give the hour to study.',
      why: () => 'Slow coin — a faculty advanced, and nothing the desk can show tonight.',
      go: () => {
        const keys = {};
        let promptText = 'Study what?';
        const letters = { learning: 'G', discretio: 'D', craft: 'C', worldliness: 'W' };
        for (const [id, meta] of Object.entries(FACULTIES)) {
          promptText += ' ' + letters[id] + ' ' + meta.label + ' ·';
          keys[letters[id]] = () => maybeMemory('first-study', () => studyHour(id));
        }
        subPrompt(promptText.replace(/·$/, '?'), keys);
      } },
    { key: 'R', label: 'The shelf that is not read from at table.',
      why: () => 'To know the exceptive arts is licit, and John says so himself. Keeping the books is what costs. (+1 suspicion.)',
      go: () => studyRestricted() },
  ],
  cell: [
    { key: 'P', label: 'The Work, behind a closed door.',
      why: () => 'The one hour nobody can account for. The house sees nothing.',
      go: stage => maybeMemory('first-work-hour', () => chooseWorkExemplar(stage)) },
  ],
  infirmary: [
    { key: 'N', label: 'Sit with the sick.',
      why: () => 'Nothing is gained and something is done. (Fatigue +1, despair −1.)',
      go: () => tendSick() },
  ],
  workshop: [
    { key: 'M', label: 'Cast and seal: give a figure a body.',
      why: () => 'Lead, solder, the press. A drawing becomes an object, and objects can be found. (+1 suspicion.)',
      go: () => workshopHour() },
  ],
  garden: [
    { key: 'Q', label: 'The beds, and an hour of quiet.',
      why: () => 'Restores what the Rule and the Work have both been spending. (Fatigue −2.)',
      go: () => gardenHour() },
  ],
  gate: [
    { key: 'T', label: 'Speak with whoever the day has brought.',
      why: () => (chronicle.custody.some(c => !c.given)
        ? 'Requisitions, warnings — or a copy, if you trust someone with it.'
        : 'Requisitions, and warnings.'),
      go: () => {
        const canGive = chronicle.custody.some(c => !c.given);
        const keys = {
          A: () => openTalk(CLOISTER_NPCS.find(n => n.id === 'denis')),
          S: () => openTalk(CLOISTER_NPCS.find(n => n.id === 'maur')),
        };
        let prompt = 'Speak with: the armarius (A), or the sacrist (S)';
        if (canGive) {
          keys.K = () => openTalk(KIN_NPCS.find(n => n.id === 'bridget'));
          keys.N = () => openTalk(CLOISTER_NPCS.find(n => n.id === 'anseau'));
          prompt += ', Bridget (K), or Brother Anseau (N)';
        }
        subPrompt(prompt + '?', keys);
      } },
    { key: 'K', label: 'Your sister has asked again to be taught her letters.',
      when: () => chronicle.bridget.asked && !chronicle.bridget.method && chronicle.bridget.literacy < 100,
      why: () => 'Fifteen, and late for it. There is a slow road and a short one.',
      go: () => bridgetTeachStage() },
    { key: 'J', label: 'Another lesson with your sister.',
      when: () => chronicle.bridget.method && chronicle.bridget.literacy < 100 && !inCrisis(chronicle.bridget),
      why: () => Math.round(chronicle.bridget.literacy) + ' of 100. ' + METHOD[chronicle.bridget.method].label,
      go: () => bridgetLesson(chronicle.bridget.method) },
    { key: 'K', label: 'Go to your sister. She has not slept in nine days.',
      when: () => inCrisis(chronicle.bridget),
      why: () => 'The nights have become constant. This will not keep.',
      go: () => bridgetNightStage() },
  ],
};

/** Knowing the forbidden arts is licit; keeping the books is what costs. */
function studyRestricted() {
  clearActs();
  const applied = invest(chronicle.practice, 'exceptive');
  addSuspicion(john, applied.suspicionPerDay ?? 1);
  reactTo(chronicle.factions, { address: 0, exposure: 1, purity: !john.purity.polluted });
  saveChronicle(storage(), chronicle);
  ui.body(deliberation(RESTRICTED_SHELF));
  const gs = el('div', 'gamestate');
  const line = 'The exceptive arts, known and not performed: ' + chronicle.practice.exceptive + '. Suspicion +1.';
  gs.appendChild(el('div', null, line));
  beatlog.line('gamestate', line);
  ui.body(gs);
  renderStatus();
  act('B', 'To Vespers.', '', leaveDaylight);
}

function tendSick() {
  clearActs();
  addFatigue(john, 1);
  addDespair(john, -1);
  saveChronicle(storage(), chronicle);
  ui.body(deliberation(INFIRMARY_HOUR));
  renderStatus();
  act('B', 'To Vespers.', '', leaveDaylight);
}

function workshopHour() {
  clearActs();
  addSuspicion(john, 1);
  addFatigue(john, 1);
  reactTo(chronicle.factions, { address: 1, exposure: 1, purity: !john.purity.polluted });
  saveChronicle(storage(), chronicle);
  ui.body(deliberation(WORKSHOP_HOUR));
  renderStatus();
  act('B', 'To Vespers.', '', leaveDaylight);
}

function gardenHour() {
  clearActs();
  addFatigue(john, -2);
  saveChronicle(storage(), chronicle);
  ui.body(deliberation(GARDEN_HOUR));
  renderStatus();
  act('B', 'To Vespers.', '', leaveDaylight);
}

// ── Bridget (decided 2026-09-01: a person with her own arc) ────────────

function bridgetTeachStage() {
  clearActs();
  $('rubric').textContent = BRIDGET_ASKS.rubric;
  ui.body(deliberation(BRIDGET_ASKS));
  for (const [id, key] of [['scholastic', 'S'], ['notory', 'N'], ['refuse', 'R']]) {
    act(key, TEACH_OPTIONS[id].label, TEACH_OPTIONS[id].why, () => {
      if (id === 'refuse') {
        chronicle.bridget.asked = false;
        saveChronicle(storage(), chronicle);
        clearActs();
        ui.body(deliberation(TEACH_OUTCOME.refuse));
        ui.body(herVoice(TEACH_OUTCOME.refuse.bridget));
        act('B', 'To Vespers.', '', leaveDaylight);
        return;
      }
      bridgetLesson(id, true);
    });
  }
}

function bridgetLesson(methodId, first = false) {
  clearActs();
  const b = chronicle.bridget;
  const result = teach(b, methodId, toWeeks(lastStrideForLesson()), {
    solomonicNodes: chronicle.practice.solomonic,
  });
  // The couplings the engine reported, applied where they belong.
  if (result.john.learning) john.faculties.learning += result.john.learning;
  if (result.john.discretio) {
    john.faculties.discretio = Math.max(0, john.faculties.discretio + result.john.discretio);
  }
  addSuspicion(john, result.john.suspicion);
  saveChronicle(storage(), chronicle);

  if (first) ui.body(deliberation(TEACH_OUTCOME[methodId]));
  ui.body(herVoice(TEACH_OUTCOME[methodId].bridget));

  for (const ev of result.events) {
    if (ev.type === 'alleluia') {
      $('rubric').textContent = ALLELUIA.rubric;
      ui.body(deliberation(ALLELUIA));
      ui.body(herVoice(ALLELUIA.bridget));
      if (ev.viaArt) ui.body(deliberation(ALLELUIA_AFTER));
      addSuspicion(john, -2); // the house reads it as a small marvel
    }
  }
  const gs = el('div', 'gamestate');
  const line = `Bridget: letters ${Math.round(result.literacy)} of 100` +
    (result.gained.burden ? `; what the art presses on her, up ${Math.round(result.gained.burden)}` : '') +
    `. Method: ${methodId}.`;
  gs.appendChild(el('div', null, line));
  beatlog.line('gamestate', line);
  ui.body(gs);
  renderStatus();
  act('B', 'To Vespers.', '', leaveDaylight);
}

/** Played from her side: John is on the other side of a wall. */
function bridgetNightStage() {
  clearActs();
  const b = chronicle.bridget;
  $('rubric').textContent = BRIDGET_NIGHT.rubric;
  ui.body(passage(BRIDGET_NIGHT.narrator, BRIDGET_NIGHT.narrator.text, 'narrator'));
  ui.body(herVoice(BRIDGET_NIGHT.bridget));

  const finish = (id) => {
    clearActs();
    ui.body(deliberation(BRIDGET_NIGHT_OUTCOME[id]));
    ui.body(herVoice(BRIDGET_NIGHT_OUTCOME[id].bridget));
    if (id === 'renounce') {
      bridgetRenounce(b);
      if (!chronicle.practice.renounced) {
        // She gets there first. His own renunciation is a separate act.
        log('She reached it before you did. You have not yet.', 'pencil-log');
      }
      ui.body(deliberation(TRAMPLE));
      ui.body(herVoice(TRAMPLE.bridget));
    }
    saveChronicle(storage(), chronicle);
    const gs = el('div', 'gamestate');
    const line = id === 'renounce'
      ? 'Bridget renounced the art. The weight is gone, and the power over it is hers.'
      : `Bridget: ${id}. The nights continue.`;
    gs.appendChild(el('div', null, line));
    beatlog.line('gamestate', line);
    ui.body(gs);
    renderStatus();
    act('B', 'To Vespers.', '', leaveDaylight);
  };

  act('W', BRIDGET_NIGHT_OPTIONS.endure.label, BRIDGET_NIGHT_OPTIONS.endure.why, () => finish('endure'));
  act('T', BRIDGET_NIGHT_OPTIONS.tell.label, BRIDGET_NIGHT_OPTIONS.tell.why, () => finish('tell'));
  if (renunciationAvailable(b)) {
    act('G', BRIDGET_NIGHT_OPTIONS.renounce.label, BRIDGET_NIGHT_OPTIONS.renounce.why, () => finish('renounce'));
  }
}

/** Sim-time since the last played day, in weeks, for a lesson block. */
function lastStrideForLesson() {
  return Math.max(14, chronicle.calendar.elapsed > 0 ? 28 : 14);
}

/**
 * Interpose a memory vignette (v4 §4) if one is due on this event,
 * else continue straight on. The vignette is mostly narrated and
 * carries one real choice; afterwards the day resumes where it was.
 */
/** Every road out of the daylight block passes here: the world gets its
 *  chance to ride the hour before Vespers takes it (v4 §6b). */
function leaveDaylight() {
  maybeEncounter(next);
}

function maybeMemory(event, then) {
  const vignette = memoryDue(chronicle.memories, MEMORIES, event);
  if (!vignette) return then();
  specialFiredToday = true; // a memory is the day's one special beat
  clearActs();
  $('rubric').textContent = vignette.rubric;
  ui.body(deliberation(vignette));
  for (const choice of vignette.choices) {
    act(choice.key, choice.label, choice.why, () => {
      const applied = fireMemory(chronicle.memories, john, vignette, choice);
      saveChronicle(storage(), chronicle);
      clearActs();
      ui.body(deliberation(choice.outcome));
      const gs = el('div', 'gamestate');
      const bits = [];
      if (applied.disposition) bits.push(`Disposition ${applied.disposition > 0 ? '+' : ''}${applied.disposition}.`);
      if (applied.faculty) bits.push(`${FACULTIES[applied.faculty].label} +1.`);
      bits.push('This will be remembered.');
      const line = `Memory: ${vignette.id}. ${bits.join(' ')}`;
      gs.appendChild(el('div', null, line));
      beatlog.line('gamestate', line);
      ui.body(gs);
      renderStatus();
      act('B', 'Return to the present.', '', then);
    });
  }
}

/**
 * An encounter RIDES a block that already has a job (v4 §6b): after the
 * day's labor resolves, the world may put something in front of him.
 * At most one special beat per day, memories taking precedence — they
 * are rarer and tied to specific moments.
 */
function maybeEncounter(then) {
  if (specialFiredToday) return then();
  const ctx = {
    affordances: ['cloister'],
    faculties: john.faculties,
    disposition: john.disposition,
    risk: chronicle.risk,
    days: chronicle.days,
    fired: chronicle.encountersFired,
  };
  const drawn = drawEncounter(chronicle.deck, ENCOUNTERS, ctx);
  if (!drawn) return then();
  specialFiredToday = true;
  spendEncounter(chronicle.deck, chronicle.encountersFired, drawn.encounter, drawn.index);
  saveChronicle(storage(), chronicle);

  const enc = drawn.encounter;
  clearActs();
  $('rubric').textContent = enc.rubric;
  ui.body(deliberation(enc));
  const gsIn = el('div', 'gamestate');
  const label = `Encounter: ${enc.id} · ${enc.register} · ${enc.tier}.`;
  gsIn.appendChild(el('div', null, label));
  beatlog.line('gamestate', label);
  ui.body(gsIn);

  for (const { option, unlockedBy } of availableOptions(enc, ctx)) {
    const why = unlockedBy ? `${option.why} [open to you: ${FACULTIES[unlockedBy].label}]` : option.why;
    act(option.key, option.label, why, () => {
      const applied = applyOption(option, john, chronicle.risk);
      saveChronicle(storage(), chronicle);
      clearActs();
      ui.body(deliberation(option.outcome));
      const gs = el('div', 'gamestate');
      const bits = Object.entries(applied.state).map(([k, v]) => `${k} ${v > 0 ? '+' : ''}${v}`);
      const risks = Object.entries(applied.risk).map(([k, v]) => `${k} ${v > 0 ? '+' : ''}${v}`);
      const line = `${enc.id}/${option.id}. ${bits.length ? bits.join(', ') + '.' : 'Nothing measurable changed.'}` +
        (risks.length ? ` Risk: ${risks.join(', ')}.` : '');
      gs.appendChild(el('div', null, line));
      beatlog.line('gamestate', line);
      ui.body(gs);
      renderStatus();
      act('B', 'And the day goes on.', '', then);
    });
  }
}

/** A memory's echo, if it fired and had one — the narrator citing the boy. */
function memoryEcho(id) {
  const text = echoFor(chronicle.memories, MEMORIES, id);
  if (text) ui.body(passage({ sources: [], status: 'invented' }, text, 'narrator echo'));
}

/** The study hour (v4 §5): one hour, one faculty, honest fatigue. */
function studyHour(facultyId) {
  clearActs();
  ui.body(deliberation(STUDY_SCENE));
  const result = study(john.faculties, facultyId);
  addFatigue(john, 1);
  ui.body(passage(STUDY_TEXT[facultyId], STUDY_TEXT[facultyId].text, 'monologue'));
  if (result.leveled) ui.body(passage(STUDY_LEVELED, STUDY_LEVELED.text, 'monologue'));
  const gs = el('div', 'gamestate');
  const line = result.leveled
    ? `${FACULTIES[facultyId].label} ${result.level - 1}→${result.level}.`
    : `${FACULTIES[facultyId].label} ${result.level} (${result.toNext} more hour${result.toNext === 1 ? '' : 's'} to advance).`;
  gs.appendChild(el('div', null, `Study: ${FACULTIES[facultyId].label}. ${line} Fatigue +1.`));
  beatlog.line('gamestate', `Study: ${FACULTIES[facultyId].label}. ${line}`);
  ui.body(gs);
  journal.studied = facultyId;
  renderStatus();
  act('B', 'To Vespers.', '', leaveDaylight);
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

  const pool = [...COPY_DISTRACTIONS, ...DISTRACTIONS.filter(d => d.kind === 'appetite')];
  if (undertext) {
    const phrase = faultPhrase(undertext.faultClass);
    const text = (UNDERTEXT_TEXT[undertext.faultClass] ?? UNDERTEXT_TEXT.eyeskip)(phrase);
    pool.push(undertextDistraction(undertext, text));
  }

  // v4: the stance chooses the hand and the whole session runs on it.
  ui.body(deliberation(STANCE_CHOICE.copy));
  stanceActs(stance => {
    clearActs();
    const rng = stageRng(day, `${stage.id}-copy-${exemplar.id}`);
    const before = snapshotJohn(john);
    const outcome = runCopyBlock(rng, john, { exemplar, light: 'day', pool, stance });
    const copy = outcome.copy;
    if (undertext) copy.support = 'palimpsest';

    for (const ev of outcome.events) {
      if (ev.type === 'noticed') { log(SCRIPTORIUM_TEXT.light.noticed.text, 'refused'); }
      if (ev.type === 'caught') { log(SCRIPTORIUM_TEXT.caught.text); }
      if (ev.type === 'fire') { log(SCRIPTORIUM_TEXT.light.fire.text, 'refused'); }
      if (ev.type === 'seen') { log(SCRIPTORIUM_TEXT.light.seen.text, 'refused'); }
    }
    const narration = composeStanceNarration(outcome, before, snapshotJohn(john));
    renderStanceOutcome(narration);
    surfaceAttendedPencil(outcome);

    $('verse').replaceChildren(el('div', 'said', `The copying was ${copy.grade}.`));
    const gradeText = SCRIPTORIUM_TEXT.grades[copy.grade];
    ui.body(passage(gradeText, gradeText.text));
    if (assigned) addResolve(john, 1);
    renderStatus();
    afterWork(stage, exemplar, assigned, copy, { examined: false });
  });
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
      if (copy.gilded && !flags.gildedLeafShown) {
        ui.leaf(LEAVES.figureGilded);
        flags.gildedLeafShown = true;
      } else if (!copy.gilded && !flags.figureNoted) {
        ui.leaf(LEAVES.figure);
      }
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
  if (copy.gilded) {
    // The licence is spent the moment gold is actually laid on a copy
    // that leaves the desk, not merely earned.
    john.procedure.licentia = false;
    chronicle.licentia = false;
  }
  saveChronicle(storage(), chronicle);
  ui.body(deliberation(SCRIPTORIUM_TEXT.concealment[state]));
  ui.footnote(SCRIPTORIUM_NOTES.find(n => n.id === 'note-scribere'));
  clearActs();
  act('B', 'To Vespers.', '', leaveDaylight);
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
  // The first time anything of his leaves his hands, he remembers the
  // first hands that were not his own (v4 §4) — but not mid-conversation:
  // a vignette that seized the screen would break the Talk surface, so
  // it waits for the reckoning, where the day is being weighed anyway.
  pendingMemory = 'first-transmission';
}

/** Legible stakes for a night verb (CLAUDE.md rule 10): the exact chance
 *  to hold, what it costs, and — for the two verbs that draw on it —
 *  that resolve is part of the number, so the willpower economy reads
 *  as a economy and not a mood. */
function nightStakes(verb) {
  const pct = Math.round(successChance(john, verb) * 100);
  const cost = { vigil: ' · costs 2 fatigue', remove: ' · costs 1 fatigue' }[verb] ?? '';
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
  act('Y', 'Get up and go to the book.',
    'The game will not choose this for you. It always ends the same way — the observance broken, the Work shut until you confess it, and a day\'s despair.', () => {
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
  // Bad information (docs/LOOP_SYNTHESIS.md §4): disposition governs
  // how legible the vision is, not merely whether it comes.
  const vision = createVision(rng, {
    disposition: dispositionOf(john, { book: bookDisposition(chronicle.liberFlorum) }),
  });
  ui.scene({ rubric: VISION_SCENE.rubric, verso: '' });
  ui.body(passage(VISION_SCENE));
  ui.leaf(LEAVES.vision);
  for (const tell of vision.tells) {
    const p = el('p', 'ultramarine', tell.text);
    p.appendChild(el('span', 'provenance', `[tell: ${tell.category}${tell.ambiguous ? ' — ambiguous' : ''}]`));
    ui.body(p);
  }
  const outcome = key => {
    journal.dream = key;
    if (key === 'licentia') {
      // Too late for today's scriptorium — it carries to the next witness.
      chronicle.licentia = true;
      saveChronicle(storage(), chronicle);
    }
    ui.body(el('p', key === 'licentia' ? 'gold' : null, DISCERNMENT_OUTCOMES[key]));
    renderStatus();
    clearActs();
    // The other half of the practice (NEWDIRECTIONS §4): the vision is
    // raw material until it is written up as a prayer.
    act('B', 'Toward Matins, and the reckoning.', '', () => composeStage(vision, key));
  };
  memoryEcho('the-renouncing'); // the night he first decided what a vision was
  act('G', 'Judge it of God.', 'If you are right, the licence; if wrong, the rot rides in silently.', () =>
    maybeMemory('first-discernment', () => outcome(judge(john, vision, true))));
  act('X', 'Make the Cross against it.', 'If you are right, mastery; if wrong, the licence is delayed and the fault is yours.', () =>
    maybeMemory('first-discernment', () => outcome(judge(john, vision, false))));
  act('E', 'Examine the tells once more.', '', () => {
    for (const t of vision.tells) log(`${t.category}: ${t.ambiguous ? '(ambiguous) ' : ''}${t.text}`);
  });
}

/**
 * The composition stage (NEWDIRECTIONS.md §4): a vision becomes a
 * prayer, the prayer enters the book, and the book disposes him for
 * what comes next. This is the recursion Fanger identifies as the
 * engine of John's whole project — and the reason the Liber florum
 * "tries to reproduce the process by which John himself came to know."
 */
function composeStage(vision, judgement) {
  ui.setHour('The Writing');
  ui.scene({ rubric: COMPOSE_SCENE.rubric, verso: '' });
  ui.body(deliberation(COMPOSE_SCENE));
  clearActs();

  const book = chronicle.liberFlorum;
  act('W', COMPOSE_OPTIONS.compose.label, COMPOSE_OPTIONS.compose.why,
    () => chooseAddress(vision, judgement));
  act('N', COMPOSE_OPTIONS.withhold.label, COMPOSE_OPTIONS.withhold.why, () => {
    clearActs();
    log('It stays in you, and you will not have it long. Nothing that is not written is kept.', 'pencil-log');
    act('B', 'Toward Matins, and the reckoning.', '', next);
  });
}

/**
 * The spine touching play (docs/LOOP_SYNTHESIS.md §2–3): at what address
 * is the prayer written, and under what frame is it presented? The
 * operator picks both; the operation does not always land where he
 * aimed, and he only notices if his discernment is good enough.
 */
function chooseAddress(vision, judgement) {
  clearActs();
  $('rubric').textContent = COMPOSE_ADDRESS.rubric;
  ui.body(deliberation(COMPOSE_ADDRESS));
  const open = chronicle.practice.renounced
    ? ['symbolic', 'ambiguous']              // renouncing means giving it up
    : ['symbolic', 'ambiguous', 'invocation', 'command'];
  for (const id of open) {
    const o = ADDRESS_OPTIONS[id];
    act(o.key, o.label, o.why, () => chooseLegitimation(vision, judgement, id));
  }
}

function chooseLegitimation(vision, judgement, addressId) {
  clearActs();
  ui.body(passage(ADDRESS_ENVELOPE,
    `${addressById(addressId).label}: ${addressById(addressId).line}`, 'narrator'));
  for (const [id, o] of Object.entries(LEGITIMATION_OPTIONS)) {
    const frame = LEGITIMATIONS[id];
    act(o.key, o.label, `${frame.line} (Covers up to ${frame.label === 'nothing at all' ? 'nothing' : frame.cover}.)`,
      () => writePrayer(vision, judgement, addressId, id));
  }
}

function writePrayer(vision, judgement, addressId, legitimationId) {
  const book = chronicle.liberFlorum;
  const rng = stageRng(day, `${day.seed}-compose-${book.prayers.length}`);
  const intended = ADDRESSES.find(a => a.id === addressId).level;
  const resolved = resolveAddress(rng, intended, {
    disposition: dispositionOf(john, { book: bookDisposition(book) }),
    solomonic: chronicle.practice.solomonic,
  });
  const perceived = operatorPerceives(resolved, reach(john, 'discretio'));
  const mode = resolved.actual >= 5 ? 'conjuring' : 'adjuring';

  const pool = INCIPITS[judgement] ?? INCIPITS.mastery;
  const incipit = pool[Math.floor(rng.next() * pool.length) % pool.length];
  const prayer = composePrayer(book, {
    vision, judgement, mode, incipit, day: chronicle.days,
  });
  prayer.address = resolved.actual;
  prayer.legitimation = legitimationId;
  recordAddress(chronicle.addresses, resolved, legitimationId);
  addSuspicion(john, suspicionFor(resolved.actual, legitimationId));
  addFatigue(john, 1);
  saveChronicle(storage(), chronicle);

  clearActs();
  ui.body(deliberation(COMPOSE_OUTCOME[judgement] ?? COMPOSE_OUTCOME.mastery));
  ui.body(passage(INCIPITS_ENVELOPE, `${prayer.ordinal}. ${incipit}…`, 'incipit'));
  if (resolved.slipped) {
    ui.body(passage(perceived === resolved.actual ? SLIPPED.caught : SLIPPED.unnoticed,
      (perceived === resolved.actual ? SLIPPED.caught : SLIPPED.unnoticed).text, 'narrator'));
  }
  const gs = el('div', 'gamestate');
  // Reports what the OPERATOR can tell, never the hidden truth — the
  // standing rule (engine/narration.js).
  const line = `Liber florum: prayer ${prayer.ordinal}, written as ` +
    `${addressByLevel(perceived).label}, framed in ${LEGITIMATIONS[legitimationId].label}. ` +
    `The book disposes you ${bookDisposition(book) >= 0 ? '+' : ''}${bookDisposition(book)}.`;
  gs.appendChild(el('div', null, line));
  beatlog.line('gamestate', line);
  ui.body(gs);
  renderStatus();
  act('B', 'Toward Matins, and the reckoning.', '', next);
}

function reckoning() {
  ui.setHour('The Reckoning');
  ui.scene({ rubric: '¶ The examination of conscience, and the ledger of the day.', verso: '' });
  // A vignette owed from mid-day (transmission) is paid here, before
  // the ledger — then the reckoning proper resumes.
  if (pendingMemory) {
    const owed = pendingMemory;
    pendingMemory = null;
    return maybeMemory(owed, () => { ui.scene({ rubric: '¶ The examination of conscience, and the ledger of the day.', verso: '' }); reckoningLedger(); });
  }
  reckoningLedger();
}

function reckoningLedger() {

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
    // Renown for the news of a fresh licence, not for one merely still
    // held over from an earlier night (that already earned its renown).
    licentia: journal.dream === 'licentia',
  });
  chronicle.faculties = john.faculties; // the life's accretion (v4 §5)
  saveChronicle(storage(), chronicle);
  if (summonsDue(chronicle)) {
    log('Word of the book has travelled further than the book has. Something will come of it.', 'refused');
  }

  act('J', 'Journal: write the day into the Liber.', 'He wrote it all down. That is why any of this exists.', () => {
    addDespair(john, -1); renderStatus();
    log('You write the day as it was, sparing no one, least of all yourself. The page holds it so you need not.', 'pencil-log');
    clearActs();
    act('L', 'Read the day as it was written.', 'The whole leaf, every hand.', () => renderDayReview());
    offerBookReading();
    act('B', 'Begin another day. (A new witness.)', '', () =>
      start(`${day.seed}-${Math.floor(Math.random() * 1e6)}`));
  });
  act('L', 'Read the day as it was written.', 'The whole leaf, every hand.', () => renderDayReview());
  offerBookReading();
  act('B', 'Begin another day. (A new witness.)', '', () =>
    start(`${day.seed}-${Math.floor(Math.random() * 1e6)}`));
}

/** Offered wherever the reckoning re-renders its menu, so journaling
 *  first never hides the book (caught in play, 2026-09-01). */
function offerBookReading() {
  if (!chronicle.liberFlorum.prayers.length) return;
  act('F', 'Read the Liber florum over from the beginning.',
    'What you have actually been making, which is not always what you meant.', () => renderBookReading());
}

/**
 * Reading the book over (NEWDIRECTIONS §11; decided 2026-09-01): the
 * drift is legible by READING, never as a meter. The prayers are shown
 * as they stand — incipit, how it was obtained, whether an error was
 * glossed or scraped — and the pencil hand names the character only
 * once it is unmistakable.
 */
function renderBookReading() {
  const book = chronicle.liberFlorum;
  clearActs();
  $('rubric').textContent = BOOK_READING.rubric;
  ui.body(deliberation(BOOK_READING));

  const list = el('div', 'book-reading');
  for (const p of book.prayers) {
    const line = el('p', 'incipit', `${p.ordinal}. ${p.incipit}…`);
    const marks = [];
    if (p.mode === 'conjuring') marks.push('commanded');
    if (p.corrupt && p.glosses.length) marks.push('glossed: the error stands, and the correction beside it');
    if (p.corrupt && !p.glosses.length) marks.push('unmarked');
    if (marks.length) line.appendChild(el('span', 'provenance', ` [${marks.join(' · ')}]`));
    list.appendChild(line);
  }
  ui.body(list);

  const { character, scores } = bookCharacter(chronicle.practice, book);
  // Only name it once the reading is not ambiguous.
  const sorted = Object.values(scores).sort((a, b) => b - a);
  if (book.prayers.length >= 3 && sorted[0] > sorted[1]) {
    const note = BOOK_CHARACTER_NOTES[character];
    ui.body(passage(note, note.text, 'pencil-note'));
    ui.footnote(note);
  }

  const corrupt = unglossedCorruptions(book);
  if (corrupt.length) {
    ui.body(deliberation(GLOSS_SCENE));
    const target = corrupt[0];
    act('G', GLOSS_OPTIONS.gloss.label, GLOSS_OPTIONS.gloss.why, () => {
      glossPrayer(book, target.id, { reason: 'read over, and found wanting', day: chronicle.days });
      saveChronicle(storage(), chronicle);
      clearActs();
      ui.body(deliberation(GLOSS_OUTCOME.gloss));
      act('B', 'Close the book.', '', () => renderBookReading());
    });
    act('S', GLOSS_OPTIONS.scrape.label, GLOSS_OPTIONS.scrape.why, () => {
      scrapePrayer(book, target.id);
      john.disposition += 1;
      saveChronicle(storage(), chronicle);
      clearActs();
      ui.body(deliberation(GLOSS_OUTCOME.scrape));
      act('B', 'Close the book.', '', () => renderBookReading());
    });
  }
  act('B', 'Begin another day. (A new witness.)', '', () =>
    start(`${day.seed}-${Math.floor(Math.random() * 1e6)}`));
}

/** The day review (v4 §7): the beat log rendered back as one reading —
 *  the same data the website's editable log page will consume. Reads
 *  the just-saved witness's beats (drained into the journal). */
function renderDayReview() {
  const beats = journal.beats ?? [];
  const VOICE_CLS = {
    narrator: 'narrator', siege: 'narrator siege', monologue: 'monologue',
    gamestate: 'gamestate-line', 'pencil-log': 'pencil-note', text: null,
  };
  const box = el('div', 'day-review');
  for (const beat of beats) {
    box.appendChild(el('h4', 'review-hour', `✝ ${beat.hour}`));
    for (const line of beat.lines) {
      box.appendChild(el('p', VOICE_CLS[line.voice] ?? 'review-scroll', line.text));
    }
    for (const c of beat.choices) {
      box.appendChild(el('p', 'review-choice', `» ${c.letter} — ${c.label}`));
    }
  }
  ui.body(box);
  clearActs();
  act('B', 'Begin another day. (A new witness.)', '', () =>
    start(`${day.seed}-${Math.floor(Math.random() * 1e6)}`));
}

function saveWitness(extra = {}) {
  journal.beats = beatlog.drain(); // the day as written (v4 §7)
  pushWitness(storage(), {
    ...journal,
    // The witness's own claim to grace is what it earned tonight, not a
    // licence merely carried over unspent from an earlier witness.
    licentia: journal.dream === 'licentia',
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
  if (exam.index === 0) ui.leaf(LEAVES.examination);
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
  ui.leaf(LEAVES.readingRoom);

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
  ui.leaf(LEAVES.incipit);
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
