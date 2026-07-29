# MORIGNY

*A monastic life & practice simulator.*

**▶ Play the prototype in your browser:** https://t3dy.github.io/MorignyGame/
*(deployed automatically from `main` by GitHub Actions — see
`.github/workflows/deploy.yml`)*

**John of Morigny** (fl. c. 1300–1323) was a Benedictine monk who practiced
the *ars notoria* — a Solomonic ritual art promising infused knowledge —
came to believe it had contaminated him with demonic visions, and then did
something stranger than abandoning it: he **rewrote it**. The *Liber florum
celestis doctrine* was his purified system, authorized (he says) by the
Virgin herself. In 1323 a monk of Morigny's book was burned at Paris. The
text survived anyway, in copies, and was rediscovered by modern scholarship
in the 1990s.

This game simulates his life hour by hour: keeping the Rule while secretly
working the procedures, and the interior struggles he recorded so exactly —
temptation, scrupulosity, the discernment of spirits — with a modern
scholar's hand annotating the manuscript in the margin.

Grounded in **Claire Fanger's** *Rewriting Magic* and the Fanger–Watson
critical edition. Her reflexive method — the scholar written into the
narrative — is the model for the game's fourth wall.

```bash
npm install
npm run dev     # http://localhost:5176
npm test
```

**B** begins a day inside the walls · **E** begins a road day to Étampes.
Keyboard-first, 26 single-key commands in the Ultima V manner; arrow keys
walk the world map; **T** talks; **Z** shows the state of the soul.

## What's here

- **The day**: Matins through Compline, the night, the sought dream, the reckoning.
- **Recitation** as *custodia oculorum* — distractions pull at the margin
  while you pray; holding fast costs resolve.
- **The Struggle** — pressure, vigilance, gradient outcomes, and the
  confession asymmetry: a lapse recovers in a day, scrupulosity lingers.
- **Discernment of spirits** — visions with ambiguous tells; accepting a
  counterfeit corrupts the Work silently.
- **The world** — a tile map to Étampes, road offices, keyword conversation.
- **1323** — the summons, the examination, three endings, and a **stemma**
  of your witnesses: the run the modern scholar finally receives is not the
  best copy, but the one that got out.

## Documents

Read `CLAUDE.md` and `STYLE_GUIDE.md` before contributing — their scholarly
rules are binding and enforced by tests: no unsourced content, no fabricated
quotations, the temptation material stays interior and never depicted, and
fixed history stays fixed. `HANDOVER.md` has the current state and what's next.

## Content note

This game simulates the inner life of a real fourteenth-century monk as
recorded in his own visionary autobiography: his religious practice, and his
struggles with sexual temptation and scrupulosity, in the confessional
language of his time. Nothing is explicitly depicted. The historical John is
treated throughout with the dignity owed to the dead.
