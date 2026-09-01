# MORIGNY — The Branch Audit

*How every leaf of this game gets checked. Binding: `CLAUDE.md` rule 13.
Declared in `src/content/branches.js`, enforced by
`tests/branches.test.js`, implemented in `src/engine/branchaudit.js`.*

---

## 1. The failure this exists to prevent

Choices in this game were written inline — one
`act('B', 'To Vespers.', '', next)` at a time, across eighty-odd call
sites in `main.js`. Because they were code and not data, nobody could
review them as a set, so nobody did. The result shipped: a returning
player opened the game and was offered, in its entirety,

> **Take up the day again.**

No narration. No orientation. No statement of what he was taking up, how
long it had been, what his own book had become, or how the game is
played. The most important text in the project — the first thing a
reader sees — was a string nobody had ever read in context.

That is not a writing slip. It is what happens when choices are not
data. This document is the fix.

## 2. What a branch is

**A branch is any moment the game stops and waits for the player.**
Two kinds:

| Kind | What it is | What it owes |
|---|---|---|
| **decision** | two or more live options | all four voices (below) |
| **continue** | one button that turns the page | a label that says *where it goes* |

"To Vespers." is a good continue. "Onward." is not, and the auditor
rejects it: a page-turn must still tell the reader where the page
turns to.

## 3. The four things a decision owes the reader

Every decision must orient, voice, ground, and instruct.

### narrator — third-person orientation
Where he is, what is happening, what is at stake *in this world's
terms*. The unbound scholarly narrator (`STYLE_GUIDE.md`): it explains
the monastic and magical context and expects no prior knowledge. Under
about 120 characters it is not orienting anybody.

### monologue — the interior voice
John's own words, in his own idiom (or **Bridget's**, in her
interludes). Without this a scene is a menu with scenery. This is what
makes the reader feel they are inside a person rather than choosing
from a list.

### pencil — the scholarly hand
Where the history comes from, what is attested, what we invented, and
why the moment is shaped as it is. **Rationed** — required where the
branch declares `cites: true`, i.e. where a scholarly claim is actually
being made. A branch making claims without grounding them is exactly
the failure the research pipeline (rule 11) exists to catch, arriving
by a different door.

### interaction — how to play
What pressing each key will actually do. This is the voice the game
kept forgetting. It is required in full at the opening, where nothing
has taught the reader anything yet; elsewhere it lives inside each
option's `why` line, which must state a real consequence — quantified
("costs 2 resolve"), directional ("leans Radical"), or conditional
("if wrong, the rot rides in silently").

## 4. The mechanical checks

`tests/branches.test.js` fails the build on any of these:

- a decision with no narrator, no interior voice, or fewer than two
  live options
- an option with no label, or no `why` (rule 10: stakes at the point of
  choosing)
- an option key that is not a single pressable character
- **colliding keys** — two options on the same letter, which silently
  ate one of them in the memory vignettes once already
- an axis-moving choice that does not name its lean (`WORLD_DESIGN.md`
  §4.5)
- a vague continue

And it warns on:

- a thin narrator, or a fragmentary interior voice
- a decision where **no** option states a consequence — the player is
  choosing blind
- a branch declaring `cites` with nothing cited

`npm test` prints the coverage report every run.

## 5. The method, for a person or an agent

When you add or change any branch:

1. **Declare it** in `src/content/branches.js`. A branch that is not in
   the map is a branch nobody is reviewing. This is the step that
   actually matters; everything else follows from it.
2. **Write the content as data**, in a `content/` module — never as an
   inline string at an `act()` call site.
3. **Run `npm test`** and read the branch report, not just the pass/fail.
4. **Read the four voices aloud in order.** Orientation, interior,
   scholarly, instruction. If any is missing, a reader arriving cold at
   that moment is lost in a specific way, and the report will name it.
5. **Check the stakes are true.** The auditor confirms a consequence is
   *stated*; only you can confirm it is the *right* one. A `why` that
   promises "+1 resolve" and delivers −1 passes the machine and fails
   the reader.

### The cold-read test
The question behind the whole audit: **if a reader arrived at this
moment knowing nothing, would they know where they are, who is
speaking, what is being asked, and what each key will do?** If not, the
branch is not finished, whatever the tests say.

## 6. Migration status

The branch map is authoritative for the moments it declares. `main.js`
still renders many of them from inline strings; those are being moved
onto `renderBranch()` and the declared content module by module. Order
of work:

1. ~~the opening~~ — done, and it was the worst of them
2. the day's stances and the reckoning menus
3. the world layer and Talk
4. the 1323 sequence

Until a moment is declared, it is unaudited. That is the honest state
and the reason this file lists it.
