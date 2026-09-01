# MORIGNY — How It All Fits: the loop, synthesised

*2026-09-01. Written because we have been adding systems faster than we
have been articulating how they compose. This is the step back. It
names the spine, shows every existing system hanging off it, and says
what to cut, merge, or build next.*

Source for the reframing: `docs/research/page-cloister-2026-09-01.txt`
(digest tier — Page's *Magic in the Cloister*, Fanger, and the
Routledge history). Everything historical below carries `verify` until
pinned (rule 11).

---

## 1. The problem this document solves

Nine systems are live: John's body-state, faculties, the three
practices, the Liber florum, Bridget, the chronicle, the beat log, the
encounter pool, and memory/lifepath. Each is individually defensible.
Together they had no single question they were all answering, which is
how a game becomes a pile of good mechanics.

The research supplies the question, and it is much better than the one
we had.

## 2. THE SPINE: every operation declares an ADDRESS

The old spine was a morality axis — obedient to radical. The sources
say that is the wrong shape. What actually varied, what was actually
argued about, and what actually got men burned was **whom you were
addressing, and whether you knew.**

The ladder, straight from the research:

| # | Address | The operator says |
|---|---|---|
| 0 | **Natural** | "This stone has a hidden virtue." |
| 1 | **Symbolic** | "This figure corresponds to the celestial order." |
| 2 | **Ambiguous** | "I use this name, but I do not know precisely whom it addresses." |
| 3 | **Tacit** | "Something intelligent seems to be answering." |
| 4 | **Invocation** | "I knowingly call a spirit." |
| 5 | **Command** | "I compel this spirit to act." |
| 6 | **Pact** | "I give something in exchange for its service." |

**The design consequence that matters most: the player must often not
know which rung they are on.** Levels 2–3 are the historical middle
where John actually lived — the *tacit pact* problem, where ambiguous
characters and figures could constitute demonic commerce without anyone
consciously summoning anything. A game that pops up `DEMONIC MAGIC +10`
has thrown away the entire subject. What the player should be asking is
*"did I just summon something?"*

This single ladder absorbs almost everything we have built:

- **Adjure vs conjure** (rule 12) is not a binary after all. It is
  rungs 2–4 against 5–6. The fork stands; it gains resolution.
- **The three practices** locate cleanly: `marian` operates at 1–3 and
  refuses to go higher; `solomonic` lives at 2–3, which is *precisely
  why it deceived him*; `exceptive` is knowledge **about** 4–6 held
  without operating there.
- **The book's character** should derive from the addresses its prayers
  were obtained at, not from a separate score.
- **Discernment** is the address problem experienced from inside: the
  vision arrives and you cannot tell who sent it.
- **Bridget's burden** is what happens when you operate at a rung you
  believed was lower than it was, on somebody else's behalf.

## 3. LEGITIMACY replaces "how bad was it"

The second reframing. Suspicion should not track *how transgressive* an
act was. It should track **how recognisable as magic it was** — the
"hidden in plain sight" principle. A nine-week devotional programme and
an explicit conjuration can involve the same address; only one of them
looks like magic to a man walking past the door.

So an operation carries two things:

1. its **address** (what it actually was), and
2. its **legitimation** — the frame it is presented under: scripture,
   liturgy, saints, angels, divine names, natural philosophy,
   astrology, medicine, ancient authority, university learning,
   monastic discipline, personal revelation.

**Suspicion accrues from the gap between them.** A high address under a
strong legitimation is quiet and corrosive. A low address under none is
noisy and harmless. And — the historically crucial part — *the
practitioner often sincerely believes the legitimation.* This is not
cynical cover. St Augustine's monks shelved occult texts beside
orthodox ones, bound condemnations of magic into the same volumes, and
coded passages, and there is no reason to think they were lying to
themselves about all of it.

## 4. CORRUPTION PAYS IN BAD INFORMATION, not in points

The best single sentence in the research: *"A sinful magician doesn't
merely lose morality points. He may start receiving bad information."*

We already have every piece of this and have not connected them:

- `faculties.reach()` gates capacity on disposition
- `liberflorum.disposition()` makes a corrupt unglossed prayer worse
  than no prayer
- `vision.createVision()` builds tells, one always ambiguous

**Connect them.** Disposition should shape the *tells*, not just
eligibility: a well-disposed John gets a legible vision; a corrupt one
gets more ambiguity, and at the bottom gets tells that actively
mislead. The loop the sources describe then runs on its own:

```
sin → diminished capacity → unreliable visions → bad prayers written
    → a worse book → worse disposition → worse visions …
```

and its inverse, which is John's actual biography:

```
confession/penance → restored capacity → clearer visions
    → better prayers → a better book → deeper access
```

Recovery through penance is *in the sources* — John's system lets an
operator recover lost visionary capacity. We have `confess()` already.

## 5. THE MONASTERY IS A PRODUCTION ENVIRONMENT

Page's St Augustine's is the model, and it is not "a place where magic
happens." It is an industrial plant for it: library and restricted
books, scriptorium, private cells, infirmary, gardens and medicinal
plants, metalworking and a plumber's workshop for lead, pigments, inks,
wax, parchment, seals and a sealing press, astronomical instruments,
liturgical objects, relics, the chapter house — plus townspeople,
university contacts, physicians, goldsmiths, craftsmen, travellers
carrying foreign books, and other monks with expertise.

Our daylight block currently offers scribe / illuminate / palimpsest /
study / talk / teach / pass. The above is the list of **places** the
world layer and the encounter pool should be built from. Magic becomes
partly an economy of materials, access, skills, and secrecy — which is
exactly what our scriptorium already models for parchment and pigment,
generalised.

## 6. THE HOUSE HAS FACTIONS, not one opinion

Seven positions, all attested as coexisting inside one abbey:

| Faction | Position |
|---|---|
| The reformer | "Magic is corrupting our discipline. Burn the books." |
| The conservative occultist | "These are dangerous, so only a disciplined monk should study them." |
| The intellectual | "Some of this is natural philosophy. The terminology misleads." |
| The devotional magician | "The technique is acceptable if directed toward God." |
| The pragmatist | "It works. That is sufficient." |
| The administrator | "Study what you like; do not let it embarrass the abbey." |
| The ascetic | "You cannot safely invoke spirits unless your soul is purified." |

This replaces "the community suspects you" with a **network**. The same
act raises one faction and lowers another. Denis the armarius is an
administrator; Evrart reads as a reformer; the ascetic is the one who
thinks John is not pure *enough* to be doing this — which is a far more
interesting antagonist than a man who thinks he is a witch.

And the ascetic's position gives us the mechanic the research explicitly
flags: **piety can be a prerequisite for dangerous magic, not its
opposite.** Magical texts themselves demanded fasting and purity before
invocation. Our purity gate already does this; it should be legible as
the double-edged thing it is.

## 7. WHAT THE PIOUS ROAD GETS

A standing risk in this design is that the Marian road becomes the
boring one. The research forbids it: the theurgic texts pursue *access
to divine knowledge, celestial experience, revelation, spiritual
transformation*. The difference is not boring-holy versus cool-evil. It
is **relationship versus exploitation.**

Concretely, the Marian tree should unlock the game's most spectacular
content: the ascent through the angelic orders, and the gifts John
actually asks for — memory, eloquence, understanding, perseverance.
Owed, and currently missing.

## 8. THE REVISED LOOP

**A day** (still ≤10 decisions):

| Beat | Decision | Spine |
|---|---|---|
| Matins | stance; and whether to say the Work's prayer — **at what address** | address declared |
| Chapter | confession, or the faction pressure of the morning | legitimacy, factions |
| Daylight | one allocation: scriptorium · the Work · study · teach Bridget · talk · workshop | production environment |
| (rider) | an encounter, gated on faculty × affordance × risk | world |
| Compline | stance | — |
| Night | the Struggle: the appetite for forbidden knowledge | temptation |
| Dream | judge the vision — **whose legibility depends on disposition** | bad information |
| The Writing | vision → prayer, **at an address, under a legitimation** | the book |
| Reckoning | the ledger; read the book; read the day | feedback |

**Across days:** sim-time carries weeks or a season. Faculties, practice,
book, Bridget, custody, risk, renown, factions persist. Pinned beats
fire (1308, 1315, 1323).

**The campaign question**, replacing "how radical are you": *what did
your addresses add up to, under what legitimations, and what does the
book you leave behind claim about the universe?*

## 9. What to cut or merge

- **`disposition` (the Radical Axis integer) is now doing two jobs** —
  it is both "how audacious" and an input to `reach()`. Split it: keep
  a body-state disposition for capacity, and derive the axis position
  from addresses + legitimations, which is more honest and needs no new
  number.
- **The risk bag and suspicion overlap.** Fold: suspicion becomes the
  ecclesiastical-attention face of the legitimacy gap; the risk bag
  keeps its distinct job of gating *which* grave encounter arrives.
- **`practice.performances`** should become "operations at address ≥ 4",
  derived rather than counted separately.

## 10. Build order from here

1. **The address system** (`engine/address.js`) — the ladder, the
   legitimations, the gap→suspicion rule, and the *uncertainty*: an
   operation may report an address the operator did not intend.
2. **Bad information** — disposition shapes vision tells.
3. **Factions** — replace scalar suspicion's narration with a small
   network; reuse existing NPCs as positions.
4. **The workshop** — the production environment as daylight options
   and encounter affordances.
5. **The angelic ascent** — the Marian road's payoff.
6. Still outstanding from before: the lifepath rebuilt on the real
   biography, provost duties, the player-as-scholar archive scenes.
