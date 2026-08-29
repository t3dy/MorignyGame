# MORIGNY — Style Guide

The writing carries this game. Four voices, strict registers, and a set of
scholarly values adopted from Claire Fanger's practice and encoded here as
binding rules. `CLAUDE.md` makes these enforceable; this file makes
them writable.

---

## The Four Hands (voices)

### 1. The narrator — iron-gall brown, roman
*Added in the simplification pass, `docs/DECISIONS_AND_FORKS.md` D-16.*
An impersonal, third-person voice that orients the player quickly: where
John is, what he is nominally doing, what is pulling at him. It is
**modern in its clarity and analytical nerve** — closer to how Claire
Fanger herself writes about John in *Rewriting Magic* than to John's own
prose — willing to name a psychological dynamic plainly, occasionally to
gesture at what the scholarship makes of the moment. It is not John, and
it does not perform his confession for him; it sets the table, briefly,
and gets out of the way.

> *Sample:* "It's the hour between Terce and None. John is at his desk
> with a commentary on Matthew half-copied in front of him — dull,
> assigned, safe work — and his attention keeps sliding toward the other
> book, the one only he knows about."

- **One or two sentences, then stop.** The narrator's whole job is to
  make the situation legible fast; if it is still talking after two
  sentences, it has started doing John's job for him. This *replaces*
  the old "ground before you turn" instruction to open every scene with
  extended physical description in John's own first-person voice — that
  produced accurate but overlong passages. The narrator grounds; John's
  hand (below) now carries the interior weight, briefly and directly.
- It may be more clinical than John ever is — including, when the
  Struggle is the subject, naming the bodily fact plainly (arousal, the
  urge to masturbate) the way a scholarly reader would — because this is
  documentary framing, not John's own confession. See §The Struggle
  below for exactly where that line sits.
- It never becomes the pencil hand (§4): no citations, no first person,
  no talk of the game or its design. It describes John's *world*, in the
  present, not the apparatus built on top of it.
- Typographically: plain roman, the same iron-gall ink as John's hand —
  they are two modes of one pen, not two pigments (`INTERFACE.md`'s
  "no other hues" rule stays intact).

### 2. John's hand — iron-gall brown, italic
His own interior monologue: first-person, confessional, period-direct,
*never* clinical or modern, no matter how plainly the narrator just
named the situation. Short. This is where the deliberation actually
happens — the choice stated in his own words, including what it will
cost him to take the safer road.

> *Sample (invented, marked as such in data):* "My will is going soft
> again. I could hold to what I was given and finish the commentary —
> it costs me nothing but the boredom of it. Or I could set this aside
> and give the hour to the Work instead. God knows what that costs if
> I'm seen."

- Sentence rhythm: shorter and plainer than the old standalone John's-
  hand passages — this is a man thinking, in the moment, not composing
  a confession for the record. Save the long periods and scriptural
  cadence for the passages where he *is* writing something down (the
  Journal, the reckoning) rather than merely thinking.
- He narrates temptation as *combat* and *weather* — the enemy, the
  flesh, heat, siege — the idiom of confession literature, not of
  clinical or modern erotic description, **even when the narrator
  paragraph just above him used the modern term.** That gap between the
  two hands is not an inconsistency; it is the fourth wall's whole
  argument, made visible sentence by sentence.
- Nests inside the narrator's frame, visually offset (italic, per the
  `.monologue` CSS class) so a reader always knows which hand is
  speaking without needing a label.

### 3. The rubricator — vermilion
The medieval systemic voice: imperative, liturgical, brief. All UI text.
"¶ Of the night office." "Here begins the second prayer." "Let him keep
silence until Prime." No jokes, no modernity, no adjectives it can't cite.

The rubricator is also the voice of the **choice label** in a type-(a)
Rule choice (`PACING.md` §Legible stakes) — which means it carries the
stakes-legibility burden for the game's most frequent decisions. A
rubric that names an action without naming its lean or its price has
done half its job. Compare:

> Weak: *"S — Scribe."*
> Binding shape: *"S — Scribe: the assigned leaf. Obedience is a wall,
> and walls also shelter."*

The second line is still rubricator-terse — it does not become John's
hand, does not turn confessional — but it tells the player what kind
of choice this is before they take it.

### 4. The modern hand — graphite
The designer-scholar, in the reflexive first person that *Rewriting Magic*
models: transparent about sources, method, uncertainty, and feeling. It may
be moved; it may be unsure; it may describe the experience of designing this
very system. It cites precisely, it never condescends to John, and it is the
only voice permitted modern vocabulary — including the plain clinical terms
for what John suffered.

> *Sample:* "Fanger reads this vision as John's own test of its authenticity
> — he is auditing his miracle while receiving it. I have made that audit a
> mechanic, and I am not sure he would forgive me. n. Cf. *Rewriting Magic*,
> ch. [verify]."

---

## The Struggle — binding register rules

The historical subject is real and named plainly *in the narrator and the
pencil hand*: John's recorded battles with sexual temptation — including
the urge to masturbate — nocturnal pollution, and the ritual-purity system
that made his body a component of his magic. The rules:

1. **Never depicted.** No explicit description or imagery, in any hand, ever.
   The simulation is interior: pressure, attention, pacing, resolve, lapse,
   confession, relief, despair. *Named plainly* is not the same as
   *depicted* — the narrator may say "he's aroused"; nothing ever shows
   or narrates the act itself, in any hand.
2. **John's voice uses John's idiom, always** — temptation, the flesh,
   pollution, the enemy, the siege — never clinical, never modern, no
   exceptions, including inside his own head at the exact moment the
   narrator paragraph above him just named the plain fact. **The narrator
   is the one hand permitted to be direct about what is happening**
   ("his body wants something his vows don't allow"); John's own
   monologue answers in his own terms ("the flesh will not be quiet
   tonight"). This split — clear naming outside him, period idiom
   inside him — *is* the fourth wall doing its historiographic work,
   made concrete at the game's single most sensitive moment. The pencil
   hand still does the citing ("what John calls pollution, we would
   call…"), but it no longer has to carry the whole burden of plain
   language alone.
3. **Never comic at his expense.** The Gothic margins may be wry — they
   historically were — but the drolleries pressure John; they do not mock
   him. The player should feel besieged with him, not amused at him.
4. **Scrupulosity is the deep subject.** The design treats over-confession,
   despair, and *acedia* as the graver danger, following the texture of the
   sources. Lapse text is quiet; despair text gets the full writing budget.
5. **No titillation loops.** Nothing in the reward structure may make the
   player *want* John to lapse. Failure is interesting, never spicy.

### Content note (first-launch copy, canonical wording)
> This game simulates the inner life of a real fourteenth-century monk,
> John of Morigny, as recorded in his own visionary autobiography: his
> religious practice, and his struggles with sexual temptation and
> scrupulosity, in the confessional language of his time. Nothing is
> explicitly depicted. The historical John is treated throughout with the
> dignity owed to the dead.

---

## Scholarly Values (from Fanger's practice, encoded)

1. **Take John seriously.** He is a devout, learned, suffering, *sincere*
   practitioner — never a charlatan, never a curiosity. The porous boundary
   between condemned magic and licit devotion is the game's subject, not a
   verdict the game hands down.
2. **Rewriting is devotion.** John's revisions, and ours, are acts of care.
   The palimpsest mechanic must feel like tending, not undo-stack.
3. **Cite everything; mark invention.** Every record: `sources` +
   `attested / adapted / invented`. The apparatus can always show its work.
4. **No fabricated quotations, ever.** From John, from Fanger, from anyone.
   Invented text in John's voice is labeled invented in data and available
   as such to the apparatus.
5. **Use the method, not the person.** The pencil hand is *our* voice,
   informed by Fanger's reflexive method. It is **not** Claire Fanger, does
   not bear her name, and puts no words in her mouth beyond quotation-with-
   citation. Gratitude and full credits in the bibliography and the game.
6. **Fixed history stays fixed.** No ending averts 1323. Agency lives in
   endurance, revision, and transmission.

## Terminology sheet

| Term | Usage |
|---|---|
| *ars notoria* | lowercase, italic; "the Notory Art" acceptable in the pencil hand |
| *Liber florum celestis doctrine* | italic; "the Liber florum" thereafter |
| *notae* | the diagrams of the ars notoria; do not call them sigils |
| *licentia* | visionary permission to proceed; gilded in UI |
| *discretio spirituum* | discernment of spirits; the vision-audit mechanic |
| Old / New Compilation | John's two major redactions; capitalized |
| "clerical underworld" | always in quotes with Kieckhefer credited on first use |
| horarium | the daily schedule of hours |
| Morigny | the abbey; "MORIGNY" the working title; the game's John is "John of Morigny" on first use, then "John" |
