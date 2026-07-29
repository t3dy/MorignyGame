/**
 * MORIGNY — canonical hours (seed data).
 * Record envelope per morigny/CLAUDE.md: historical fields cite sources;
 * the `sim` block is game math and cites nothing.
 */

export const HOURS = [
  {
    id: 'matins',
    names: ['Matins', 'Vigils', 'the night office'],
    clock: 'deep night; before first light (seasonal)',
    sources: [{ work: 'RB 1980 (Rule of St Benedict)', locus: 'chs. 8-11, 16' }],
    status: 'attested',
    verify: false,
    sim: { attentionCost: 3, fatigueCost: 2, struggleWindow: true },
  },
  {
    id: 'lauds',
    names: ['Lauds'],
    clock: 'daybreak',
    sources: [{ work: 'RB 1980', locus: 'chs. 12-13, 16' }],
    status: 'attested',
    verify: false,
    sim: { attentionCost: 2, fatigueCost: 1, struggleWindow: false },
  },
  {
    id: 'prime',
    names: ['Prime'],
    clock: 'first hour of daylight',
    sources: [{ work: 'RB 1980', locus: 'chs. 16-18' }],
    status: 'attested',
    verify: false,
    sim: { attentionCost: 1, fatigueCost: 1, struggleWindow: false },
  },
  {
    id: 'terce',
    names: ['Terce'],
    clock: 'third hour',
    sources: [{ work: 'RB 1980', locus: 'chs. 16-18' }],
    status: 'attested',
    verify: false,
    sim: { attentionCost: 1, fatigueCost: 0, struggleWindow: false },
  },
  {
    id: 'sext',
    names: ['Sext'],
    clock: 'sixth hour, midday',
    sources: [{ work: 'RB 1980', locus: 'chs. 16-18' }],
    status: 'attested',
    verify: false,
    sim: { attentionCost: 1, fatigueCost: 0, struggleWindow: false },
  },
  {
    id: 'none',
    names: ['None'],
    clock: 'ninth hour, mid-afternoon',
    sources: [{ work: 'RB 1980', locus: 'chs. 16-18' }],
    status: 'attested',
    verify: false,
    sim: { attentionCost: 1, fatigueCost: 1, struggleWindow: false },
  },
  {
    id: 'vespers',
    names: ['Vespers'],
    clock: 'evening, before dark',
    sources: [{ work: 'RB 1980', locus: 'chs. 16-18' }],
    status: 'attested',
    verify: false,
    sim: { attentionCost: 2, fatigueCost: 1, struggleWindow: false },
  },
  {
    id: 'compline',
    names: ['Compline'],
    clock: 'before sleep; the Great Silence follows',
    sources: [{ work: 'RB 1980', locus: 'chs. 16-18, 42' }],
    status: 'attested',
    verify: false,
    sim: { attentionCost: 2, fatigueCost: 0, struggleWindow: true },
  },
];

/** Canonical order for legality checks. */
export const HOUR_ORDER = HOURS.map(h => h.id);
