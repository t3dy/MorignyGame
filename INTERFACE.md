# MORIGNY — Interface & Art Direction

The entire game is a **codex opening**: two pages, verso and recto. There is
no HUD in the modern sense. Every interface element is a manuscript
convention doing mechanical work. All imagery is sourced from digitized
historical material (`ART_SOURCES.md`) — nothing is drawn in a modern hand
except the pencil apparatus, which is *supposed* to look modern.

---

## The Opening (screen layout)

```
┌────────────────────────────┬────────────────────────────┐
│  VERSO — the miniature     │  RECTO — the text block    │
│                            │                            │
│  Scene: choir, cloister,   │  Rubric (vermilion):       │
│  scriptorium, dormitory,   │   the hour, the obligation │
│  vision-space. Grisaille   │  Text (iron-gall):         │
│  with earned color.        │   John's narration; choices│
│                            │   as rubricated incipits   │
│  Bas-de-page: drolleries   │  Historiated initials =    │
│  (the Struggle's pressure  │   the interaction points   │
│  made visible, obliquely)  │  Line-fillers = progress   │
├────────────────────────────┴────────────────────────────┤
│  MARGINS (both pages): glosses, distractions, and the   │
│  modern hand's penciled footnotes                       │
└─────────────────────────────────────────────────────────┘
```

- **Verso miniature**: the current scene, assembled from sourced Gothic
  imagery (c. 1280–1330, northern France preferred), unified by grisaille
  treatment (see Palette).
- **Recto text block**: the readable game. Choices are **rubricated
  incipits** ("¶ Of rising to the night office"); hovering an incipit raises
  an **interlinear gloss** — the tooltip as a period practice.
- **Historiated initials as buttons**: each actionable initial is cut from a
  sourced initial and carries its provenance in the manifest.
- **Line-fillers as progress bars**: pen-flourish fillers lengthen as a
  prayer, labor, or copying task completes. A period device doing HUD work.
- **The volvelle**: the hour wheel (a real instrument of medieval books) sits
  at the top of the gutter; turning it is the pass-time verb. Its pointer,
  not a clock face, tells the horarium.
- **Bells and chant** mark the hours in audio before the volvelle confirms
  them — the monastery is heard before it is seen.

## State Without Numerals

| State | Manuscript convention |
|---|---|
| Fatigue / sleep debt | The candle beside the text block burns down; wax pools |
| Attention | The text block stays crisp; distraction blurs and *browns* the leaf edges as the eye wanders |
| Purity / confession current | A litany in the lower margin: checked stations; a broken line where a fast or confession lapsed |
| Temptation pressure | Bas-de-page drolleries multiply, creep upward, grow bolder; never explicit — hybrids, apes, hares (the Gothic margin's own idiom) |
| Suspicion | Another hand's *nota bene* marks accumulate against John's passages — the community reading him |
| Procedure progress | A calendar page with wound thread; *licentia* moments gilded |
| Save / run identity | Ex libris + quire signatures; each run is a distinct witness |

## Palette — color is semantic and *earned*

Base register is **grisaille** (anchor: Jean Pucelle's Parisian grisaille,
1320s — period-exact, and gorgeous on modern screens because it reads as a
disciplined limited palette rather than a pastiche).

- **Iron-gall brown** — John's hand. The default ink of the world.
- **Vermilion** — the rubricator: instructions, hours, actionable incipits.
  The only "UI accent color," and it never means anything else.
- **Ultramarine** — *reserved*: the Virgin, and true visionary presence.
  If blue appears, it matters. Demonic counterfeits get *almost*-blue —
  a discernment tell the attentive player learns to distrust.
- **Gold leaf** — *licentia* only: divine authorization moments. Rendered
  with real burnished-gold behavior (angle-dependent shimmer on page turn).
- **Graphite** — the modern hand. Matte, thin, unmistakably 21st-century.

Rule: **no other hues in core play.** The whitening epilogue may open the
palette toward the fifteenth century — the color shift *is* the historical
argument.

## Typography

- **Display / rubrics**: a textualis-inspired blackletter face, used at
  large sizes only (readability discipline).
- **Body**: a readable oldstyle with medieval abbreviation marks used
  *decoratively, sparingly*; expandable on hover (the gloss mechanic again).
- **Drop caps**: sourced initials, never a font.
- **Pencil hand**: a humanist italic rendered as graphite texture.
- Accessibility: a "study copy" mode swaps display blackletter for the body
  face throughout, raises contrast ("reading light"), honors reduced-motion,
  and keeps all glosses keyboard-reachable.

## Motion & Sound

- **Page turn** is the master transition; the codex has weight and vellum
  translucency (the *next* scene ghosts through the leaf before it turns —
  usable for foreshadowing and for dread).
- **Scraping** (palimpsest) is the rewriting interaction: the knife lifts the
  old reading, which remains faintly visible forever — Old Compilation under
  New. Mechanically: prior choices are never deleted, only overwritten and
  still legible to the apparatus.
- Candlelight breathes; nothing else animates in the world layer. Restraint
  is the aesthetic.
- Audio: plainchant and bells. **Sourcing note:** recordings of chant are
  modern performances with their own rights even when the chant is ancient —
  use CC-licensed or newly recorded/synthesized performance only, logged in
  the asset manifest like any image.

## The Pencil Apparatus (fourth wall, concretely)

- Footnote cues are superscript graphite numerals in the text block; the
  note unfolds in the margin. Notes cite real scholarship (from
  `BIBLIOGRAPHY.md` data) and can disclose the record's `attested /
  adapted / invented` tag — the provenance database surfacing *in the UI*.
- Occasional longer pencil passages: the designer-scholar on reading Fanger,
  on what could not be known, on the strangeness of building systems out of
  a man's recorded suffering — the *Rewriting Magic* move, made playable.
- Immersion toggle hides the pencil layer; default is visible.

## Content Note (shown once, first launch)

Plain, unsensational: the game simulates a medieval monk's recorded
struggles with sexual temptation and religious scrupulosity in his own
confessional idiom; nothing is depicted; the historical subject is treated
with dignity. Exact wording in `STYLE_GUIDE.md`.
