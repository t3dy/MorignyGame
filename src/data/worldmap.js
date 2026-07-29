/**
 * MORIGNY — the world layer maps (hand-authored, validated by tests:
 * uniform width, and a walkable road Morigny → Étampes gate).
 *
 * The region is real: the abbey of Morigny sits on the Juine just
 * northeast of Étampes; the road between them was John's actual errand
 * distance. The tile arrangement is ours.
 * envelope: { status: 'adapted', sources: [geography of Étampes/Morigny] }
 */

export const WORLD_ENVELOPE = {
  status: 'adapted',
  sources: [
    { work: 'Regional geography: Morigny abbey and Étampes on the Juine', locus: 'frame (verify against Fanger’s account of the abbey)' },
  ],
};

/**
 * Legend:
 *  f forest (blocked)   . grass        h hill        F field
 *  ~ water (blocked)    = bridge       r road        s signpost (blocked, readable)
 *  A the abbey of Morigny (enter)      T Étampes gate (enter)
 */
export const WORLD_MAP = [
  'ffffffffffffffffffffffffffffffffffffffff',
  'ffhhhhhhhhffffffffff~~ffffhhhhhhhhhhffff',
  'ffhhhh........ffff..~~....hhhh....hhhfff',
  'ffhh....................~~.....FF....fff',
  'ffh.....................~~.AA..FF.....ff',
  'ff......................~~.rr.FFFF....ff',
  'ff.......fff............~~.r..FFFF....ff',
  'ff......fffff...........~~.r..........ff',
  'ff.......fff............~~.r......fF..ff',
  'ff.......................~~r.......F..ff',
  'ff........................~r..........ff',
  'ffs.rrrrrrrrrrrrrrrrrr.==.rr..........ff',
  'ff..r.....................~~..........ff',
  'ff..r......FFF.............~~....fff..ff',
  'ff..r......FFF..............~~..fffff.ff',
  'ff..r.......F................~~..fff..ff',
  'ff..r........................~~.......ff',
  'ff..T.......................~~~.......ff',
  'ff..........................~~........ff',
  'ffff....hhh.................~~....ffffff',
  'ffffffffhhhhfffffffffffffff~~fffffffffff',
  'ffffffffffffffffffffffffffffffffffffffff',
];

/**
 * Étampes, inside the walls — a leaf of it: the market square below the
 * collegiate church of Notre-Dame-du-Fort (real, 12th c., attested; its
 * fortified silhouette is on the Research Queue for a sourced city leaf).
 *
 * Legend: # wall  . cobbles  C church front  m market stall  G gate
 */
export const ETAMPES_MAP = [
  '########################',
  '#......CCCC............#',
  '#......C..C............#',
  '#......................#',
  '#...m.m.m..............#',
  '#...m...m..............#',
  '#......................#',
  '#......................#',
  '#..........m.m........##',
  '#......................#',
  '###########GG###########',
];

export const ETAMPES_ENVELOPE = {
  status: 'adapted',
  sources: [
    { work: 'Notre-Dame-du-Fort, Étampes (12th-c. collegiate church)', locus: 'existence attested; layout ours' },
  ],
};

/** Where entering each map puts you. */
export const SPAWNS = {
  world: { x: 28, y: 5 },        // the abbey road, just outside the gate
  etampes: { x: 11, y: 9 },      // inside the town gate
  worldFromTown: { x: 4, y: 16 },// on the road, outside Étampes
  worldAtAbbey: { x: 28, y: 5 },
};

/** Special tiles. */
export const ENTER_TILES = { A: 'abbey', T: 'etampes' };
export const BLOCKED = new Set(['f', '~', '#', 's', 'C', 'm']);

/** The bell schedule on the road, in steps taken since departure. */
export const ROAD_BELLS = [
  { hourId: 'terce', afterSteps: 18 },
  { hourId: 'sext', afterSteps: 55 },
  { hourId: 'none', afterSteps: 110 },
];

export const SIGNPOST_TEXT =
  'The stone finger points down the west road: ORLIENS · PARIS. ' +
  '(Those roads are a later chapter of this book.)';
