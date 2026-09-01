/**
 * MORIGNY — the branch map: every moment the game stops and waits.
 * (CLAUDE.md rule 13; audited by tests/branches.test.js; method in
 * docs/BRANCH_AUDIT.md.)
 *
 * Enumerating them is the point. Choices used to be inline strings at
 * eighty-odd call sites, which is why nobody noticed the game opening
 * with a bare "Take up the day again." A branch that is not in this
 * file is a branch nobody is reviewing.
 *
 * `kind: 'decision'` owes the reader four things — third-person
 * orientation, an interior voice, scholarly grounding where a claim is
 * made, and a plain statement of what pressing each key will do.
 * `kind: 'continue'` owes only a label that says where it goes.
 */

import { INCIPIT, RETURNING } from './incipit.js';
import { STANCE_CHOICE, STANCE_OPTIONS } from './stance_content.js';
import { LIFEPATH } from './lifepath.js';
import { MEMORIES } from './memories.js';
import { ENCOUNTERS } from './encounters.js';
import {
  COMPOSE_SCENE, COMPOSE_OPTIONS, COMPOSE_ADDRESS, ADDRESS_OPTIONS,
  GLOSS_SCENE, GLOSS_OPTIONS, ASCENT_SCENE,
} from './liberflorum_content.js';
import {
  BRIDGET_ASKS, TEACH_OPTIONS, BRIDGET_NIGHT, BRIDGET_NIGHT_OPTIONS,
} from './bridget_content.js';
import { NIGHT_DELIBERATION, NIGHT_CHOICES, CONFESSION, VISION_SCENE } from './content.js';
import { GIFTS } from '../engine/ascent.js';
import { PLACES, PLACE_IDS } from '../data/places.js';
import { LEGITIMATIONS } from '../engine/address.js';
import {
  DAYLIGHT_PLACES, DESK_AFTER, CONCEALMENT_CHOICE, LEGITIMATION_SCENE,
  RECKONING_SCENE, RECKONING_OPTIONS,
} from './day_content.js';
import { LEGITIMATION_OPTIONS as LEGIT_OPTS } from './liberflorum_content.js';

/** Shape an options object into the list the auditor reads. */
const opts = (source, extra = {}) =>
  Object.entries(source).map(([id, o]) => ({ id, key: o.key, label: o.label, why: o.why, ...extra[id] }));

export const BRANCHES = [
  // ── The opening ────────────────────────────────────────────────────
  {
    id: 'incipit',
    where: 'the opening',
    kind: 'decision',
    cites: true,
    content: () => INCIPIT,
  },
  {
    id: 'incipit-returning',
    where: 'the opening, on a life already begun',
    kind: 'decision',
    cites: true,
    content: () => RETURNING,
  },

  // ── The prologue: one branch per scene ─────────────────────────────
  ...LIFEPATH.map(scene => ({
    id: `lifepath:${scene.id}`,
    where: `the prologue — ${scene.age}`,
    kind: 'decision',
    cites: true,
    content: () => scene,
  })),

  // ── The day ────────────────────────────────────────────────────────
  {
    id: 'stance:office',
    where: 'any full office',
    kind: 'decision',
    content: () => ({ ...STANCE_CHOICE.office, options: opts(STANCE_OPTIONS) }),
  },
  {
    id: 'stance:copy',
    where: 'the copy desk',
    kind: 'decision',
    content: () => ({ ...STANCE_CHOICE.copy, options: opts(STANCE_OPTIONS) }),
  },
  {
    id: 'chapter:confession',
    where: 'chapter, with matter to confess',
    kind: 'decision',
    cites: true,
    content: () => ({
      ...CONFESSION.offerPolluted,
      options: [
        { id: 'confess', key: 'C', label: 'Confess it, plainly.', why: 'The saying aloud is the whole medicine and the whole price. (Despair −1; the Work opens again.)' },
        { id: 'delay', key: 'B', label: 'Say nothing. Not today.', why: 'The Work stays shut, and the fault rides along. (Despair +1.)' },
      ],
    }),
  },
  {
    id: 'chapter:scruple',
    where: 'chapter, with nothing grave to say',
    kind: 'decision',
    cites: true,
    content: () => ({
      ...CONFESSION.offerClean,
      options: [
        { id: 'silence', key: 'B', label: 'You have nothing grave to say. Keep silence.', why: 'Nothing spent, nothing spiralled.' },
        { id: 'scruple', key: 'C', label: 'Confess anyway. Everything. Be safe.', why: 'The scrupulous wheel turns, and it grinds finer than sin. (Despair +1.)' },
      ],
    }),
  },
  {
    id: 'night:struggle',
    where: 'the dormitory, besieged',
    kind: 'decision',
    cites: true,
    content: () => ({
      ...NIGHT_DELIBERATION.BESIEGED,
      options: [
        { id: 'vigil', key: 'V', label: NIGHT_CHOICES.vigil, why: 'Outlast it on your knees. (Costs 2 fatigue; the chance is quoted live.)' },
        { id: 'prayer', key: 'K', label: NIGHT_CHOICES.prayer, why: 'Your resolve is part of that number. (The chance is quoted live.)' },
        { id: 'remove', key: 'M', label: NIGHT_CHOICES.remove, why: 'Distance instead of will. (Costs 1 fatigue.)' },
        { id: 'endure', key: 'W', label: NIGHT_CHOICES.endure, why: 'Cheapest, and the likeliest to fail. (The chance is quoted live.)' },
      ],
    }),
  },
  {
    id: 'dream:discern',
    where: 'the sought vision',
    kind: 'decision',
    cites: true,
    content: () => ({
      ...VISION_SCENE,
      narrator: VISION_SCENE,
      monologue: { text: 'Everything now depends on reading the marks right, and the marks are what I have.' },
      options: [
        { id: 'accept', key: 'G', label: 'Judge it of God.', why: 'If you are right, the licence; if wrong, the rot rides in silently.' },
        { id: 'refuse', key: 'X', label: 'Make the Cross against it.', why: 'If you are right, mastery; if wrong, the licence is delayed and the fault is yours.' },
      ],
    }),
  },

  // ── The writing ────────────────────────────────────────────────────
  {
    id: 'compose:whether',
    where: 'after a vision — whether to write it',
    kind: 'decision',
    cites: true,
    content: () => ({ ...COMPOSE_SCENE, options: opts(COMPOSE_OPTIONS, { compose: { key: 'W' }, withhold: { key: 'N' } }) }),
  },
  {
    id: 'compose:address',
    where: 'the writing — at what address',
    kind: 'decision',
    cites: true,
    content: () => ({ ...COMPOSE_ADDRESS, options: opts(ADDRESS_OPTIONS) }),
  },
  {
    id: 'book:gloss',
    where: 'reading the book, on finding a fault',
    kind: 'decision',
    cites: true,
    content: () => ({ ...GLOSS_SCENE, options: opts(GLOSS_OPTIONS, { gloss: { key: 'G' }, scrape: { key: 'S' } }) }),
  },
  {
    id: 'ascent:petition',
    where: 'the cell, at a degree of the ascent',
    kind: 'decision',
    cites: true,
    content: () => ({
      ...ASCENT_SCENE,
      options: Object.entries(GIFTS).map(([id, g]) => ({
        id,
        key: { memory: 'M', eloquence: 'E', understanding: 'U', perseverance: 'P' }[id],
        label: `Ask for ${g.label}.`,
        why: `${g.line} (Petitioned, never compelled — you may be refused.)`,
      })),
    }),
  },

  // ── Bridget ────────────────────────────────────────────────────────
  {
    id: 'bridget:teach',
    where: 'the gate — his sister asks to be taught',
    kind: 'decision',
    cites: true,
    content: () => ({
      ...BRIDGET_ASKS,
      options: opts(TEACH_OPTIONS, { scholastic: { key: 'S' }, notory: { key: 'N' }, refuse: { key: 'R' } }),
    }),
  },
  {
    id: 'bridget:night',
    where: 'her room, played from her side',
    kind: 'decision',
    cites: true,
    content: () => ({
      ...BRIDGET_NIGHT,
      options: opts(BRIDGET_NIGHT_OPTIONS, { endure: { key: 'W' }, tell: { key: 'T' }, renounce: { key: 'G' } }),
    }),
  },

  // ── The day's rooms and desks (declared 2026-09-01) ────────────────
  {
    id: 'daylight:places',
    where: 'the daylight hour — which room',
    kind: 'decision',
    cites: true,
    content: () => ({
      ...DAYLIGHT_PLACES,
      options: PLACE_IDS.map(id => ({
        id, key: PLACES[id].key, label: PLACES[id].label + '.',
        why: PLACES[id].line + ' (Choosing a room does not yet spend the hour.)',
      })),
    }),
  },
  {
    id: 'desk:after',
    where: 'the desk, a copy finished',
    kind: 'decision',
    cites: true,
    content: () => ({
      ...DESK_AFTER,
      options: [
        { id: 'examine', key: 'E', label: 'Examine: read the leaf over.', why: 'Mends what reading can show. The silent faults stay silent. (Repeatable.)' },
        { id: 'figure', key: 'G', label: 'Gaze: draw the figure.', why: 'Geometry, proportion, the words in their houses. Failure is silent and surfaces at the reckoning.' },
        { id: 'rubricate', key: 'R', label: 'Rubricate: lay a colour on the leaf.', why: 'The colours keep accounts of their own — orpiment sickens, verdigris corrodes, gold needs a licence.' },
        { id: 'rest', key: 'B', label: 'Where does the leaf rest, tonight?', why: 'Ends the hour, and decides what an inventory can reach. (Cannot be undone.)' },
      ],
    }),
  },
  {
    id: 'desk:concealment',
    where: 'the desk — where the quire sleeps',
    kind: 'decision',
    cites: true,
    content: () => ({
      ...CONCEALMENT_CHOICE,
      options: [
        { id: 'loose', key: 'L', label: 'Leave the quires loose.', why: 'Movable, scatterable. 50% found if the house is ever searched.' },
        { id: 'bound', key: 'D', label: 'Bind them into a licit codex.', why: 'It looks like a book and is read as one. 15% found.' },
        { id: 'shelved', key: 'S', label: 'Shelve them openly in the armarium.', why: 'Safest from suspicion, and an inventory is a list of exactly this. Always found.' },
      ],
    }),
  },
  {
    id: 'compose:legitimation',
    where: 'the writing — under what frame',
    kind: 'decision',
    cites: true,
    content: () => ({
      ...LEGITIMATION_SCENE,
      options: Object.entries(LEGIT_OPTS).map(([id, o]) => ({
        id, key: o.key, label: o.label,
        why: `${LEGITIMATIONS[id].line} (Covers up to ${LEGITIMATIONS[id].cover}.)`,
      })),
    }),
  },
  {
    id: 'reckoning',
    where: 'the end of every day',
    kind: 'decision',
    cites: true,
    content: () => ({ ...RECKONING_SCENE, options: opts(RECKONING_OPTIONS) }),
  },

  // ── Memories and encounters ────────────────────────────────────────
  ...Object.values(MEMORIES).map(v => ({
    id: `memory:${v.id}`,
    where: `a memory — ${v.rubric.replace(/^¶ /, '')}`,
    kind: 'decision',
    cites: true,
    content: () => v,
  })),
  ...Object.values(ENCOUNTERS).map(e => ({
    id: `encounter:${e.id}`,
    where: `${e.register}, ${e.tier}`,
    kind: 'decision',
    cites: true,
    content: () => ({ ...e, options: e.options }),
  })),
];

/**
 * Continues — the page turns. They owe only a label that says where
 * they go, and they are listed so that a vague one cannot hide.
 */
export const CONTINUES = [
  { id: 'continue:office', where: 'end of an office', kind: 'continue', content: { label: 'So ends the hour.' } },
  { id: 'continue:brief', where: 'a brief office', kind: 'continue', content: { label: 'Let the bell carry the day onward.' } },
  { id: 'continue:vespers', where: 'leaving the daylight hour', kind: 'continue', content: { label: 'To Vespers.' } },
  { id: 'continue:matins', where: 'after the writing', kind: 'continue', content: { label: 'Toward Matins, and the reckoning.' } },
  { id: 'continue:night', where: 'after the Struggle', kind: 'continue', content: { label: 'Let the rest of the night pass.' } },
  { id: 'continue:present', where: 'after a memory', kind: 'continue', content: { label: 'Return to the present.' } },
  { id: 'continue:day', where: 'after an encounter', kind: 'continue', content: { label: 'And the day goes on.' } },
  { id: 'continue:elsewhere', where: 'leaving a room', kind: 'continue', content: { label: 'Somewhere else, then.' } },
  { id: 'continue:newday', where: 'the reckoning', kind: 'continue', content: { label: 'Begin another day. (A new witness.)' } },
];

export const ALL_BRANCHES = [...BRANCHES, ...CONTINUES];
