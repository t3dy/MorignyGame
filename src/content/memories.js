/**
 * MORIGNY — the memory vignettes (v4 §4). Childhood, Orléans, the
 * renunciation, the first teaching: the life behind the day, fired at
 * the adult decision each one explains, and echoed forward when that
 * decision comes round again.
 *
 * Sourcing discipline: John's autobiography records the ARC — Orléans,
 * the ars notoria, the visions read as contamination, the rewriting,
 * the teaching of his sister Bridget — but not the interior moments
 * dramatized here. So the narrator (which may be analytical about the
 * record) states what is documented and what is reconstruction, and
 * every interior line in John's voice is `invented`, per CLAUDE.md
 * rules 1 and 2. Loci stay on the Research Queue until the
 * Fanger–Watson edition is on the desk.
 */

const FANGER = [{ work: 'Fanger, Rewriting Magic', locus: 'John\'s biography and the Book of Visions (frame; loci on Research Queue)' }];
const WATSON = [{ work: 'Watson, "John the Monk\'s Book of Visions" (Conjuring Spirits, 1998)', locus: 'the modern recovery; John\'s account of his Orléans years (frame)' }];
const KIECKHEFER = [{ work: 'Kieckhefer, Magic in the Middle Ages', locus: 'the "clerical underworld" at the schools (frame)' }];
const INV = { sources: [], status: 'invented' };

export const MEMORIES = {
  // ── Childhood: the letters ──────────────────────────────────────────
  'boyhood-letters': {
    id: 'boyhood-letters',
    trigger: 'first-study',
    rubric: '¶ Of a boy, and the first letters he was given.',
    narrator: {
      text:
        'A word about what follows. John\'s own book tells us a great deal about his ' +
        'visions and almost nothing about his childhood — we do not have his boyhood, and ' +
        'anyone who hands it to you is reconstructing. What we do know is structural: he ' +
        'entered a Benedictine house, and Benedictine houses made readers of their boys ' +
        'because the Office is unsayable otherwise. Somewhere behind the man at this desk ' +
        'is a child being taught letters by an adult with a switch and a schedule, and ' +
        'learning — as such children did — that marks on skin could hold a voice. What that ' +
        'felt like to him is the invention here. That it happened is not.',
      sources: [{ work: 'RB 1980 (Rule of St Benedict)', locus: 'RB 38, 48 — reading and the oblate (frame)' }],
      status: 'adapted',
      verify: true,
    },
    monologue: {
      ...INV,
      text:
        'I was small and the psalter was not. They set my finger on the line and said: this ' +
        'is a word, and it is not yours, and you will carry it anyway.',
    },
    choices: [
      {
        id: 'beauty',
        key: 'B',
        label: 'He loved the letters for their beauty.',
        why: 'The hand remembers what the eye loved. (Craft +1.)',
        effect: { faculty: 'craft' },
        outcome: {
          narrator: {
            text:
              'He fell in love with the shapes before he understood the sense — which is, as ' +
              'it happens, how most scribes are made. The child who watches the ascenders ' +
              'stand in rank becomes the adult whose own line does not wander.',
            sources: [], status: 'invented',
          },
          monologue: {
            ...INV,
            text: 'The great initial had a beast in it, and gold. I wanted to make one. God forgive me, I think I wanted it before I wanted Him.',
          },
        },
        echo: 'He has loved letterforms since he was small enough to be struck for loving them.',
      },
      {
        id: 'power',
        key: 'P',
        label: 'He loved the letters for what they could do.',
        why: 'A word said rightly changes something. (Learning +1.)',
        effect: { faculty: 'learning' },
        outcome: {
          narrator: {
            text:
              'He noticed early that words were not decoration but instruments — that the ' +
              'right formula in the right mouth at the right hour was understood by everyone ' +
              'around him to DO something. It is worth sitting with how short the distance ' +
              'is, from there, to the art he would later learn at Orléans. The boy who ' +
              'learns that a sentence can consecrate has already learned the grammar of a ' +
              'thing the Church will one day burn his book for.',
            sources: KIECKHEFER, status: 'adapted',
          },
          monologue: {
            ...INV,
            text: 'They said the words over the bread and the bread was not bread. I asked what made it work and was told not to ask. So I asked silently, for years.',
          },
        },
        echo: 'He has wanted to know how the words work since before he could read them.',
      },
    ],
  },

  // ── Orléans: the art ────────────────────────────────────────────────
  'orleans-art': {
    id: 'orleans-art',
    trigger: 'first-work-hour',
    rubric: '¶ Of Orléans, and how the art came into his hands.',
    narrator: {
      text:
        'This part is in the record. John studied at Orléans, and Orléans in his lifetime ' +
        'was one of the places where the traffic Richard Kieckhefer named the "clerical ' +
        'underworld" actually happened: literate men in minor orders, with Latin and time, ' +
        'passing around texts nobody would admit to owning. What John acquired there was ' +
        'the ars notoria — a Solomonic art promising infused knowledge of the liberal arts ' +
        'through prayers, fasts, and the inspection of diagrams — and, by his own account, ' +
        'contact with frankly necromantic material besides. He was not a dabbler and he was ' +
        'not deceived. He was a bright young man being handed the thing he most wanted.',
      sources: [...WATSON, ...KIECKHEFER],
      status: 'adapted',
      verify: true,
    },
    monologue: {
      ...INV,
      text:
        'They had a book. That is the whole of it, and the whole of what came after: they ' +
        'had a book, and they were willing to let me see it, and I have never in my life ' +
        'been able to walk away from that sentence.',
    },
    choices: [
      {
        id: 'knowledge',
        key: 'K',
        label: 'He came to the art for what it promised to teach.',
        why: 'The scholar\'s hunger — leans toward the Rule\'s own reasons. (Learning +1.)',
        effect: { faculty: 'learning' },
        outcome: {
          narrator: {
            text:
              'His motive was, in the most literal sense, academic: the ars notoria ' +
              'advertised the arts themselves — grammar, rhetoric, the whole quadrivium — ' +
              'poured into a prepared mind without the years. For a student watching richer ' +
              'men buy books he could not, that is not an exotic temptation. It is the ' +
              'ordinary one, wearing a Solomonic coat.',
            sources: [{ work: 'Véronèse, editions and studies of the ars notoria', locus: 'the art\'s promise of infused knowledge (frame)' }],
            status: 'adapted',
          },
          monologue: {
            ...INV,
            text: 'I wanted to know things. I have tried since to find a worse motive in myself and I keep finding that one, sitting where I left it.',
          },
        },
        echo: 'He first came to this art hungry for what it taught, not for whom it let him sit with.',
      },
      {
        id: 'company',
        key: 'C',
        label: 'He came because they let him in.',
        why: 'The transgression was the door. Leans Radical. (Disposition +1.)',
        effect: { disposition: 1 },
        outcome: {
          narrator: {
            text:
              'The underworld Kieckhefer describes was, before it was anything doctrinal, a ' +
              'social fact: a circle you were let into. Historians of these networks keep ' +
              'finding that the operative pull is belonging — the book is the token, the ' +
              'company is the draw. A man who came in that way has a different thing to give ' +
              'up later, and gives it up harder.',
            sources: [...KIECKHEFER, { work: 'Page, Magic in the Cloister', locus: 'social circulation of magic texts (frame)' }],
            status: 'adapted',
          },
          monologue: {
            ...INV,
            text: 'They were older and they were laughing and they made room for me on the bench. I would have read anything they put in front of me. I did.',
          },
        },
        echo: 'He came to this art through men, not through books, and he has never entirely stopped wanting the room they made for him.',
      },
    ],
  },

  // ── The renunciation ────────────────────────────────────────────────
  'the-renouncing': {
    id: 'the-renouncing',
    trigger: 'first-discernment',
    rubric: '¶ Of the night he decided what the visions were.',
    narrator: {
      text:
        'The hinge of his whole life, and it is documented: John came to read his ' +
        'visionary experiences under the ars notoria as demonic contamination — and did ' +
        'not, as the moralists would have wanted, stop. He rewrote. The Liber florum is a ' +
        'purified system claiming the Virgin\'s own authorization, which is a far stranger ' +
        'and more audacious response than repentance. Note what it implies about this ' +
        'moment: whatever he renounced, he retained enough of the old art to rebuild its ' +
        'architecture from memory. You cannot purify what you have genuinely forgotten.',
      sources: FANGER,
      status: 'adapted',
      verify: true,
    },
    monologue: {
      ...INV,
      text:
        'Something came to me wearing light and I knew, the way you know a bad coin in the ' +
        'dark, that it was not what it said. And I thought: then the art is poisoned. And ' +
        'then I thought — God help me, in the same breath — then the art can be cleaned.',
    },
    choices: [
      {
        id: 'burned',
        key: 'B',
        label: 'He gave up the books entire, and kept only the wound.',
        why: 'The renunciation the Church would recognize. Leans Obedient. (Disposition −1.)',
        effect: { disposition: -1 },
        outcome: {
          narrator: {
            text:
              'He made it a clean break, in his own telling — and then spent the rest of his ' +
              'life reconstructing, in a form he could defend, the thing he had broken with. ' +
              'The scholarship is careful here, and so should we be: a man can renounce a ' +
              'practice sincerely and rebuild its substance sincerely, and never once feel ' +
              'himself a hypocrite. That is not a failure of logic. It is what conversion ' +
              'actually looks like from inside.',
            sources: FANGER, status: 'adapted',
          },
          monologue: {
            ...INV,
            text: 'I let it all go, and my hands stayed shut for a year afterward, and what came back came back from above and not from the shelf. I hold to that. Ask me at Matins and I will still hold to it.',
          },
        },
        echo: 'He gave the old art up entire once, and what he does now he insists is a different thing.',
      },
      {
        id: 'kept',
        key: 'K',
        label: 'He kept what he had learned, and told himself that was not the same as keeping the books.',
        why: 'The distinction that lets the Work exist. Leans Radical. (Disposition +1.)',
        effect: { disposition: 1 },
        outcome: {
          narrator: {
            text:
              'A distinction with real weight in canon law and real convenience for the man ' +
              'drawing it — and the honest historical point is that he must have drawn ' +
              'something like it, because the Liber florum could not otherwise exist. What ' +
              'this choice makes explicit is a tension his own book keeps quiet: the ' +
              'authorized new work is built from an unauthorized old memory, and the memory ' +
              'never went to the fire.',
            sources: FANGER, status: 'adapted',
          },
          monologue: {
            ...INV,
            text: 'The books are gone. What I know is not a book. I have made that argument to my confessor, and to God, and to myself at three in the morning, and only the last one keeps asking follow-up questions.',
          },
        },
        echo: 'He has always known the old art was never really burned — it went on living in the only place a fire cannot reach.',
      },
    ],
  },

  // ── The first teaching ──────────────────────────────────────────────
  'teaching-bridget': {
    id: 'teaching-bridget',
    trigger: 'first-transmission',
    rubric: '¶ Of his sister, and the first hands that were not his own.',
    narrator: {
      text:
        'John taught the practice to others, and the record names his sister Bridget among ' +
        'them — which is worth pausing over, because it moves the Liber florum out of the ' +
        'category of private devotion and into the category of things that get transmitted, ' +
        'and transmission is what the 1323 condemnation was actually about. A book one monk ' +
        'prays over is a pastoral problem. A book with students is a movement. Whatever ' +
        'else this memory is, it is the moment his work acquired a second reader.',
      sources: [...FANGER, { work: 'Fanger & Watson (eds.), Liber florum celestis doctrine', locus: 'Bridget; the practice taught to others (frame; verify)' }],
      status: 'adapted',
      verify: true,
    },
    monologue: {
      ...INV,
      text:
        'She asked me what I did at night. I could have said prayers and been telling the ' +
        'truth and been lying. She is not a fool, and she is my sister, and she was already ' +
        'holding out her hands.',
    },
    choices: [
      {
        id: 'plainly',
        key: 'P',
        label: 'He taught her plainly, as one teaches a thing one believes is licit.',
        why: 'If it is lawful, it can be said aloud. Leans Radical. (Disposition +1.)',
        effect: { disposition: 1 },
        outcome: {
          narrator: {
            text:
              'To teach openly is to make a claim: that this is devotion, not contraband, ' +
              'and needs no shadow. It is also the single most dangerous thing he can do ' +
              'with it, and he is not naïve about that — a practice with pupils leaves ' +
              'witnesses, and witnesses are what a commission of theologians deposes.',
            sources: FANGER, status: 'adapted',
          },
          monologue: {
            ...INV,
            text: 'I told her what it was and what it asks and what it costs, and I did not lower my voice, because a thing given by the Mother of God does not need to be whispered.',
          },
        },
        echo: 'He taught this openly to his own sister, and has never been able to pretend since that it is a private thing.',
      },
      {
        id: 'guarded',
        key: 'G',
        label: 'He taught her carefully, and left parts out.',
        why: 'Protection, or prudence, or both. Leans Obedient. (Disposition −1.)',
        effect: { disposition: -1 },
        outcome: {
          narrator: {
            text:
              'He gave her the practice and withheld its edges — and the reader who wants to ' +
              'call that cowardice should remember what a woman in 1310 stood to lose if her ' +
              'brother\'s book went bad. Selective transmission is also a form of care. It ' +
              'is, incidentally, one of the ways textual traditions actually fork: not from ' +
              'error, but from an author deciding which reader gets which text.',
            sources: [{ work: 'Fanger, Rewriting Magic', locus: 'the Old and New Compilations as redaction (frame)' }],
            status: 'adapted',
          },
          monologue: {
            ...INV,
            text: 'I gave her the prayers and not the figures. If it is safe, I have cheated her. If it is not safe, I have saved her. I will not know which until someone comes asking, and then it will be too late to have chosen differently.',
          },
        },
        echo: 'He has given this away before with pieces held back, and knows exactly what that costs a text.',
      },
    ],
  },
};

/** The event names the day loop fires memories on. */
export const MEMORY_TRIGGERS = [
  'first-study', 'first-work-hour', 'first-discernment', 'first-transmission',
];
