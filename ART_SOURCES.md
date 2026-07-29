# MORIGNY — Historical Image Sourcing

All game art is sourced from digitized historical material. **License first,
beauty second, and provenance is recorded before any pixel is touched.**
The provenance manifest is not paperwork — it feeds the in-game apparatus
(`INTERFACE.md` → Pencil Apparatus) and the provenance-lint test.

## Institutions (open-access first)

| Source | License posture | Why we need it |
|---|---|---|
| **The Met Open Access** | CC0 | *Hours of Jeanne d'Évreux* (Jean Pucelle, Paris, c. 1324–28) — the grisaille anchor for the whole art direction; period- and region-exact |
| **Walters Art Museum** | CC0 on much of the digitized collection | 13th–14th-c. French psalters and books of hours; initials, line-fillers, marginalia |
| **Yale Beinecke** | Open access | **Mellon MS 1 — a medieval *ars notoria* manuscript with *notae*** — the actual diagrammatic tradition John practiced and rewrote |
| **BnF Gallica** | Public domain images; check per-object conditions for reuse | *Grandes Chroniques de France* (the 1323 notice's own textual home); Parisian liturgical MSS; Villard de Honnecourt for linework |
| **Bodleian Digital** | CC-BY-NC on many; check per-object | Ashmole magical MSS (mostly later — apparatus layer only, dated on-screen) |
| **British Library** | PD marking on many digitized MSS; availability has fluctuated since the 2023 outage — cache what we clear | East Anglian marginalia c. 1310–40 (Gorleston, Luttrell circles): the drollery vocabulary of the bas-de-page |
| **e-codices (Switzerland)** | Generally CC | monastic liturgical books, calendars |
| **Morgan Library** | Image permissions vary — verify per object | Gothic devotional imagery |
| **Wellcome Collection** | CC-BY | later magical/alchemical diagrams for the whitening epilogue |

## Period Discipline

- **Core play imagery: c. 1280–1330, northern France** (Île-de-France /
  diocese of Sens ambit) strongly preferred; England/Flanders c. 1300–1340
  acceptable for marginalia vocabulary.
- **Forbidden in core play:** fifteenth-century and later imagery (including
  the famous necromantic handbooks like Munich Clm 849, and all Renaissance
  material). These are **welcome in the whitening epilogue and pencil
  apparatus**, always with their real dates displayed — honest anachronism
  is content; silent anachronism is a bug.
- Iconography shopping list: choir and office scenes; scriptorium and
  copying; dormitory (RB 22 staging); chapter house; cloister; Marian
  iconography (enthroned, Theotokos types, Miracles of the Virgin cycles);
  demons and temptation *from marginalia* (hybrids, apes, snares) — never
  from later witch-imagery; *ars notoria* *notae* (Mellon MS 1); calendars
  and computus wheels (volvelle source material); line-fillers, quire
  signatures, ex libris marks.

## Pipeline

1. **Acquire** at maximum resolution; save the institution's own metadata.
2. **Record provenance immediately** in `data/assets_manifest.json` — an
   asset without a manifest entry cannot be committed (lint).
3. **Process**: spot-cleaning, background knockout, unification toward the
   grisaille register (desaturation and tonal mapping are allowed).
   **Redrawing or compositing figures beyond cleanup demotes the asset's
   status from `attested` to `adapted`** — the manifest must say so, and the
   apparatus will say so on screen.
4. **Atlas** for the renderer; the atlas build re-verifies every tile maps to
   a manifest entry.

## Manifest Schema

```json
{
  "id": "initial_O_matins",
  "role": "historiated-initial",
  "institution": "Walters Art Museum",
  "shelfmark": "W.xxx",
  "folio": "23r",
  "source_url": "…",
  "license": "CC0",
  "date": "c. 1300–1310",
  "region": "northern France",
  "status": "attested | adapted",
  "processing": ["desaturated", "background knockout"],
  "notes": ""
}
```

Required fields: all of the above except `notes`. `status: adapted` requires
a non-empty `processing` list explaining why.
