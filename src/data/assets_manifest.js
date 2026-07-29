/**
 * MORIGNY — asset provenance manifest (morigny/CLAUDE.md rule 6,
 * schema in morigny/ART_SOURCES.md). Nothing visual or audible ships
 * without an entry. The provenance lint walks this file.
 */

export const ASSETS_MANIFEST = [
  {
    id: 'tileset-world-v1',
    role: 'tile set (procedural, drawn in code: src/ui/tiles.js)',
    institution: 'original work, this project',
    shelfmark: 'n/a',
    folio: 'n/a',
    source_url: 'n/a',
    license: 'project license',
    date: '2026',
    region: 'n/a',
    status: 'invented',
    processing: [],
    notes:
      'U5-era plainness in the grisaille palette; no external imagery. ' +
      'References for silhouettes (walls, church, market) are common-knowledge ' +
      'period forms; a sourced city leaf for Étampes (Notre-Dame-du-Fort) is ' +
      'on the Research Queue in BIBLIOGRAPHY.md.',
  },
];
