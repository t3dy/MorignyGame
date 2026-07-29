# MORIGNY — The Command Alphabet (Ultima V homage)

Single-key verbs, A–Z, in the manner of Ultima V. The deep compatibility:
Ultima's interface is a *vocabulary of life* (Attack, Board, Klimb, Mix,
Yell…), and a monastery is a *regulated* vocabulary of life. So in MORIGNY
most letters are refused most of the time — and the refusal line, in period
voice, is worldbuilding. Ultima's "Not here!" becomes the Rule speaking.
Canonical data: `src/engine/commands.js` (each command ships with
verb, gloss, and refusal; coverage-tested).

| Key | Verb | When it lives |
|---|---|---|
| A | **Attack** | Almost never. See below. |
| B | **Bell** | Pass time; continue the day's order. The master "proceed" key. |
| C | **Confess** | At chapter or a confessor. Clean of matter, C is the *scruple* — confessing anyway. The letter itself models the spiral. |
| D | **Discern** | Judging a sought vision (then: of God **G**, or make the Cross against it **X**). |
| E | **Examine** | The margin gloss (attending a distraction), the vision's tells, the conscience. |
| F | **Fast** | At meals; keeps the purity the Work requires. |
| G | **Gaze** | Upon the Work's figure — procedure advancement at a desk. |
| H | **Hold fast** | Refuse a distraction mid-recitation (costs resolve; doubled when scrupulous). |
| I | **Illuminate** | Steal the hour to copy the Work's leaf. |
| J | **Journal** | Write the visions down — the *Liber visionum* itself as a verb; despair relief; feeds the witness. |
| K | **Kneel** | A moment's prayer anywhere (small relief, once an hour); the *prayer* verb at night. |
| L | **Look** | Always. The scene, again, in words — this is a game of reading. |
| M | **Mortify** | The cold-stone remedy, at night. |
| N | **Notae** | Deliberately recall the old art's wheels: insight now, pressure always. The tempting shortcut key. |
| O | **Obey** | Do the Rule's next thing: the office, the labor. The default virtue key; recitation advances on O. |
| P | **Pray the Work** | The procedure prayer, in its appointed slot. Forcing it elsewhere is refused *as doctrine*. |
| Q | **Quit** | Close the book; the witness is saved. |
| R | **Rest** | Sleep when sleep is assigned. |
| S | **Scribe** | The assigned copying (obedience's version of I). |
| T | **Talk** | Brothers, confessor, travelers — the Pentiment surface (see `WORLD_DESIGN.md`). Refused during silence. |
| U | **Use** | Objects: candle, knife (scraping = palimpsest), herbs. |
| V | **Vigil** | Outlast the siege kneeling; pay in fatigue tomorrow. |
| W | **Withstand** | Lie still and only hold. |
| X | **Cross** | Sign of the cross: small relief, once an hour — *repeating it feeds the scrupulous wheel* (the anti-spam mechanic is a spiritual diagnosis). |
| Y | **Yield** | Always present during the night siege. The game never chooses it for you; exhaustion argues for it. Consent by inches, honestly priced. |
| Z | **Zelus animae** | The state of the soul — Z-stats, as is right and traditional. |

## A — Attack, and why it is almost never live

Combat is vanishingly rare and never good. The letter exists so that its
refusal can be felt 500 times before the one scene where it goes live: the
day they come for the book (the 1323 layer). Even then, the historical
record shows no violent resistance — so on the historical path, pressing A
plays John's *own* refusal: the hand will not. A live, consequential A
belongs only to the marked-counterfactual radical arc (`WORLD_DESIGN.md`
§The Radical Axis), where the pencil hand notes, on screen, that the
witness has now left history.

## Interface frame

Ultima V's screen grammar around the codex viewport: main view (the
manuscript opening — later, the tile world map), right sidebar (state of
the soul + the command bar with live letters lit in vermilion), bottom
message scroll (the rubricator's log: commands, refusals, bells). Keyboard
first; every on-screen choice also shows its letter.
