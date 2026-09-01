/**
 * MORIGNY — the lifepath: John's early life, played (rebuilt on the
 * real biography, 2026-09-01, replacing a draft that had him as a poor
 * anonymous student).
 *
 * WHAT THE SOURCES ACTUALLY GIVE, and what the old draft got wrong:
 * John was a Benedictine of Morigny near Étampes, a PRIEST, and held an
 * advanced degree in CANON LAW from Orléans. He had a vision at about
 * thirteen at Chartres in which the devil threatened him and the Virgin
 * rescued him — the foundational scene of his religious identity. He
 * obtained a book of "nefarious things of the necromantic art" from a
 * cleric and copied as much of it as he could. He then sought advice
 * from JACOB OF BOLOGNA, a Lombard medical expert, who directed him to
 * the ars notoria as the holy alternative to nigromancia, promising not
 * only the knowledge he sought but "all forms of knowledge." He got his
 * copy through the university library. After 1308 he was PROVOST of
 * Morigny, administering rents and tithes.
 *
 * STRUCTURAL CONSEQUENCE (decided 2026-09-01): the prologue ends with
 * the art in his hands, NOT with the renunciation. The campaign now
 * opens during the ars notoria years, so that teaching Bridget, her
 * affliction, her renunciation and then his own all happen in play —
 * which is the order the sources put them in, and which is what
 * `practice.renounced` was always gating for.
 *
 * Every scene cites what it is grounded in and carries `verify`,
 * because it all arrives through the digests (CLAUDE.md rule 11).
 * Interior lines in John's voice are `invented`, always.
 */

const FANGER = [{ work: 'Fanger, Rewriting Magic', locus: 'John\'s biography: Chartres, Orléans, the necromantic book, Jacob of Bologna (frame; verify)' }];
const WATSON = [{ work: 'Watson, "John the Monk\'s Book of Visions" (Conjuring Spirits, 1998)', locus: 'John\'s account of his Orléans years (frame; verify)' }];
const KIECKHEFER = [{ work: 'Kieckhefer, Magic in the Middle Ages', locus: 'the "clerical underworld" at the schools (frame)' }];
const VERONESE = [{ work: 'Véronèse, editions and studies of the ars notoria', locus: 'the art\'s promise of infused knowledge; its prayers and notae (frame)' }];
const RB = [{ work: 'RB 1980 (Rule of St Benedict)', locus: 'RB 58–59, entry into the monastery (frame)' }];
const INV = { sources: [], status: 'invented' };

export const LIFEPATH = [
  // ── 1. Chartres, at about thirteen ─────────────────────────────────
  {
    id: 'chartres-boy',
    age: 'about thirteen',
    rubric: '¶ Of the devil at Chartres, and who came between.',
    narrator: {
      text:
        'Begin where his own book begins its account of him: at Chartres, at about thirteen, ' +
        'with a vision of the devil, from whom the Virgin Mary rescued him. This is not our ' +
        'invention and it is not a flourish — it is the foundational scene of his religious ' +
        'identity, and everything he builds for the next forty years rests on the ' +
        'proposition established here, that she intervenes on his behalf specifically. A boy ' +
        'who has been rescued once by the Mother of God grows into a man for whom her ' +
        'authorization is not an abstraction. It is a memory.',
      sources: FANGER, status: 'adapted', verify: true,
    },
    monologue: {
      ...INV,
      text:
        'I was thirteen and something came for me in that church and something else came ' +
        'between. I have told it so many times that I no longer know which parts I saw. I ' +
        'know that she was there. Everything since has been an argument with people who were ' +
        'not.',
    },
    choices: [
      {
        id: 'certainty', key: 'C',
        label: 'He came away certain, and never revisited it.',
        why: 'The rescue is bedrock: unexamined, unshakeable, and load-bearing. (Resolve +1, discretio +1.)',
        effect: { faculty: { discretio: 1 }, resolve: 1 },
        outcome: {
          narrator: {
            text:
              'The certainty holds, and it will hold under examination, which is the point of ' +
              'it. A man whose foundational experience is not up for discussion is very hard ' +
              'to argue out of his own life — and correspondingly hard to correct when he is ' +
              'wrong.',
            sources: FANGER, status: 'adapted', verify: true,
          },
          monologue: { ...INV, text: 'She was there. I do not argue about it and I do not examine it. Some things you build on and some things you dig up, and a man cannot do both to the same stone.' },
        },
        echo: 'He has never once doubted what happened at Chartres, and he does not intend to start.',
      },
      {
        id: 'question', key: 'Q',
        label: 'He has been turning it over ever since.',
        why: 'The trained eye starts here — with a boy asking how he knows what he saw. (Discretio +1, despair +1.)',
        effect: { faculty: { discretio: 1 }, despair: 1 },
        outcome: {
          narrator: {
            text:
              'He examines it, and keeps examining it, and this is where his real gift comes ' +
              'from: the discernment of spirits is not a talent but a habit, and the habit ' +
              'begins with a boy who cannot leave his own miracle alone. The cost is the one ' +
              'that always attaches — a man who audits his own experiences will audit them at ' +
              'three in the morning too.',
            sources: [{ work: 'Newman, Speculum 80 (2005)', locus: 'discernment as a cultivated practice (frame)' }],
            status: 'adapted',
          },
          monologue: { ...INV, text: 'How does a boy know what he saw? He does not. He decides, and then spends his life finding out what he decided. I have been finding out ever since.' },
        },
        echo: 'He has been auditing that first vision since he was thirteen, which is where the trained eye came from.',
      },
    ],
  },

  // ── 2. The schools ─────────────────────────────────────────────────
  {
    id: 'the-schools',
    age: 'a student at Orléans',
    rubric: '¶ Of Orléans, and a degree in the law of the Church.',
    narrator: {
      text:
        'He goes to Orléans and takes an advanced degree in canon law. This matters more than ' +
        'it sounds, and the old picture of John as a dreamy cloistered visionary gets it ' +
        'wrong twice over: he is a trained lawyer of the Church, and he will later be ' +
        'provost of his abbey, administering rents and tithes. When he eventually argues that ' +
        'his practice rests on a divine covenant rather than a demonic pact, he is not ' +
        'improvising — he is a canon lawyer making a canon lawyer\'s distinction. He also ' +
        'arrives poor, wanting books he cannot buy, in a town where books circulate.',
      sources: [...FANGER, ...WATSON], status: 'adapted', verify: true,
    },
    monologue: {
      ...INV,
      text:
        'Law, then. The Church\'s own law: what may be done, by whom, on whose authority, and ' +
        'how a thing is proved. I did not know I was learning the language I would spend my ' +
        'life defending myself in.',
    },
    choices: [
      {
        id: 'lawyer', key: 'L',
        label: 'He was very good at the law, and knew it.',
        why: 'The distinctions that will one day defend the Work. (Learning +2.)',
        effect: { faculty: { learning: 2 } },
        outcome: {
          narrator: {
            text:
              'He masters the instrument: jurisdiction, authority, what constitutes a pact and ' +
              'what constitutes a covenant, and the difference between a thing being ' +
              'forbidden and a thing being wrong. Every one of those will be load-bearing in ' +
              'about twenty years, in a room in Paris.',
            sources: FANGER, status: 'adapted', verify: true,
          },
          monologue: { ...INV, text: 'I could take a case apart. I liked the feeling and I have never entirely stopped liking it, which my confessor has views about.' },
        },
        echo: 'He is a canon lawyer, and it shows in every defence he has ever mounted.',
      },
      {
        id: 'hungry', key: 'H',
        label: 'He spent the years hungry for books he could not afford.',
        why: 'Poverty at the schools is how men meet the wrong company. Leans Radical. (Worldliness +1, disposition +1.)',
        effect: { faculty: { worldliness: 1 }, disposition: 1 },
        outcome: {
          narrator: {
            text:
              'His own account connects the intellectual hunger to the poverty plainly: he ' +
              'wanted books, and books cost money he did not have. That is the ordinary road ' +
              'into the extraordinary trouble, and it is worth noticing that it is an ' +
              'economic road before it is a moral one.',
            sources: [...WATSON, ...KIECKHEFER], status: 'adapted', verify: true,
          },
          monologue: { ...INV, text: 'Other men owned what I had to borrow, and borrowed it back from me at their leisure. I learned to be lent things. It is a skill with a price.' },
        },
        echo: 'He learned at Orléans how to get at books he had no right to, and the habit has not left him.',
      },
    ],
  },

  // ── 3. The necromantic book ────────────────────────────────────────
  {
    id: 'the-necromancy-book',
    age: 'a young monk',
    rubric: '¶ Of a book got from a cleric, and how much of it he copied.',
    narrator: {
      text:
        'Here is the fact that the tidier versions of this story leave out. Before the ars ' +
        'notoria — before any of the Marian material — John obtained from a cleric a book ' +
        'containing what he himself calls "nefarious things of the necromantic art," and he ' +
        'copied as much of it as he could. That is his own testimony about his own conduct, ' +
        'and it is not the testimony of a man being seduced. It is the testimony of a man ' +
        'who found a source and worked fast.',
      sources: FANGER, status: 'adapted', verify: true,
    },
    monologue: {
      ...INV,
      text:
        'He lent it for a fortnight and I did not sleep much in the fortnight. I copied what ' +
        'I could and left what I could not and I have never been able to say honestly that I ' +
        'regretted the fortnight, only what came of it.',
    },
    choices: [
      {
        id: 'thorough', key: 'T',
        label: 'He copied it thoroughly, and understood what he copied.',
        why: 'The knowledge is real, and it never leaves. (Learning +1, starts you one step into the exceptive arts.)',
        effect: { faculty: { learning: 1 }, practice: { exceptive: 1 } },
        outcome: {
          narrator: {
            text:
              'He takes it seriously as a text, which is the scholar\'s reflex and the exact ' +
              'thing that makes his later position so difficult: he cannot un-know it. Years ' +
              'afterwards he will still be worrying about the necromantic books in his ' +
              'keeping, and will never quite tell us what became of them.',
            sources: [{ work: 'Fanger, "Libri Nigromantici" (2012)', locus: 'John\'s necromantic books after his conversion (frame; verify)' }],
            status: 'adapted', verify: true,
          },
          monologue: { ...INV, text: 'I understood it. That is the part I cannot confess away: not that I held it, but that I followed it, and that it was not difficult.' },
        },
        echo: 'He copied a necromantic book once, thoroughly, and has never been able to un-know it.',
      },
      {
        id: 'frightened', key: 'F',
        label: 'He copied it in a hurry, frightened, and half-understood.',
        why: 'Enough to be dangerous, not enough to be confident. Leans Obedient. (Despair +1, disposition −1.)',
        effect: { despair: 1, disposition: -1 },
        outcome: {
          narrator: {
            text:
              'He takes what he can and is frightened while taking it — which leaves him with ' +
              'the worst of both: material he cannot fully use and cannot honestly claim to ' +
              'have refused. Half-knowledge of a forbidden thing is its own kind of ' +
              'possession.',
            sources: FANGER, status: 'adapted', verify: true,
          },
          monologue: { ...INV, text: 'I wrote fast and badly with the candle wrong and my hand shaking, and what I have is a bad copy of a bad thing, and I kept it.' },
        },
        echo: 'What he took from that book he took badly and in fear, and he has never trusted his own copy of it.',
      },
    ],
  },

  // ── 4. Jacob of Bologna ────────────────────────────────────────────
  {
    id: 'jacob-of-bologna',
    age: 'the turn toward the art',
    rubric: '¶ Of Jacob of Bologna, who recommended something safer.',
    narrator: {
      text:
        'He seeks advice — and this is the detail that reframes everything — from Jacob of ' +
        'Bologna, a Lombard medical expert, who directs him AWAY from necromancy and TOWARD ' +
        'the ars notoria, telling him that through it he will discover not only the ' +
        'particular knowledge he wants but all forms of knowledge. John obtains his copy ' +
        'through the university library. Sit with the shape of that: he does not fall into ' +
        'the art. He is steered into it, by a physician, as the responsible alternative to ' +
        'the thing he was already doing. It looked holy, it came recommended, and it was ' +
        'available from the library.',
      sources: [...FANGER, ...VERONESE], status: 'adapted', verify: true,
    },
    monologue: {
      ...INV,
      text:
        'He said: not that, this. He said it the way a physician says take the other draught ' +
        '— not as a man tempting me, as a man correcting a course. I have thought about his ' +
        'face for twenty years and I still cannot find malice in it.',
    },
    choices: [
      {
        id: 'knowledge', key: 'K',
        label: 'He took it for the promise: all forms of knowledge.',
        why: 'The art\'s own advertised purpose, and the ordinary temptation in a Solomonic coat. (Learning +1, one step into the art.)',
        effect: { faculty: { learning: 1 }, practice: { solomonic: 1 } },
        outcome: {
          narrator: {
            text:
              'The promise was infusion: grammar, rhetoric, the whole quadrivium, philosophy, ' +
              'theology — poured into a prepared mind without the years. For a poor student ' +
              'watching richer men buy books, that is not an exotic temptation. It is the ' +
              'ordinary one, wearing a Solomonic coat.',
            sources: VERONESE, status: 'adapted',
          },
          monologue: { ...INV, text: 'All of it. Not a spell, not a trick — all the arts, entire, from the source of the arts. I have never been offered anything else that I wanted so plainly.' },
        },
        echo: 'He took up the art for what it promised to teach, on a physician\'s recommendation.',
      },
      {
        id: 'safety', key: 'S',
        label: 'He took it because it was the safe road out of the other one.',
        why: 'He was already in trouble and this was the way out. Leans Obedient. (Discretio +1, disposition −1.)',
        effect: { faculty: { discretio: 1 }, disposition: -1 },
        outcome: {
          narrator: {
            text:
              'He takes it as a remedy, which is very close to how it was offered — and it ' +
              'means his entry into the ars notoria is, in his own understanding, an act of ' +
              'repentance. That is the cruelty waiting at the end of this road: the thing he ' +
              'chose in order to stop doing something dangerous turns out to be the thing ' +
              'that nearly destroys him, and he chose it responsibly.',
            sources: FANGER, status: 'adapted', verify: true,
          },
          monologue: { ...INV, text: 'I meant to get out. That is the whole of my defence and it is a true defence and it has never once helped me.' },
        },
        echo: 'He came to the art trying to get OUT of something worse, which is the part nobody believes afterwards.',
      },
    ],
  },

  // ── 5. How he kept it ──────────────────────────────────────────────
  {
    id: 'the-practice',
    age: 'the years of the art',
    rubric: '¶ Of how he kept the art, in the years when he kept it.',
    narrator: {
      text:
        'The ars notoria is not a spell but a programme: sequences of prayers over days and ' +
        'weeks, keyed to hours, gated on ritual purity — confession current, fasts kept, ' +
        'continence held. This is the structural fact that governs everything he does ' +
        'afterwards, because the Liber florum will inherit the shape exactly. The body is a ' +
        'load-bearing component of the work. How he keeps the programme in these years sets ' +
        'the habits he will still be keeping, in a purified form, decades later.',
      sources: [...VERONESE, ...FANGER], status: 'adapted', verify: true,
    },
    monologue: {
      ...INV,
      text:
        'Thirty days of it, and the fasting, and the hours. I kept a tally on the inside of ' +
        'the cover like a prisoner. I was not a prisoner. I was the most willing man in ' +
        'France.',
    },
    choices: [
      {
        id: 'scrupulous', key: 'X',
        label: 'Exactly, to the letter, terrified of invalidating it.',
        why: 'The observance holds; so does the anxiety, permanently. (Discretio +1, resolve +1, despair +1.)',
        effect: { faculty: { discretio: 1 }, resolve: 1, despair: 1 },
        outcome: {
          narrator: {
            text:
              'Exactness is what the art demanded and exactness is what it got — along with ' +
              'the characteristic pathology of ritual-purity systems, which is that a man who ' +
              'believes an unnoticed fault silently voids the work will begin hunting himself ' +
              'for unnoticed faults. The scrupulosity that runs through his later writing has ' +
              'a plausible origin here, in a discipline he kept too well.',
            sources: FANGER, status: 'adapted', verify: true,
          },
          monologue: { ...INV, text: 'If a word was wrong I began the day again. Twice I began the month again. I was not being holy; I was being afraid, in Latin.' },
        },
        echo: 'He kept the old art to the letter, and the fear of an unnoticed fault never left him.',
      },
      {
        id: 'hungry', key: 'G',
        label: 'Greedily — pressing for results, cutting where he could.',
        why: 'Faster, and it teaches you what haste costs a rite. Leans Radical. (One further step into the art, pressure +1, disposition +1.)',
        effect: { practice: { solomonic: 1 }, pressure: 1, disposition: 1 },
        outcome: {
          narrator: {
            text:
              'He pushed. The art\'s own literature warns against exactly this and is full of ' +
              'practitioners who ignored the warning — and a man who has cut corners in a ' +
              'purity-gated rite has direct, unpleasant, personally-owned knowledge of what ' +
              'happens next. It is knowledge he will later put to use designing a system he ' +
              'considers safe.',
            sources: VERONESE, status: 'adapted',
          },
          monologue: { ...INV, text: 'I wanted it to work now. I shortened things. Something came anyway — that is the part nobody warns you about, that it still comes.' },
        },
        echo: 'He cut corners in the old art once, and knows from the inside what an invalid observance produces.',
      },
    ],
  },
];

/** The closing beat: the art in his hands, and the life about to be played. */
export const LIFEPATH_CODA = {
  rubric: '¶ And so to Morigny, and the bell.',
  narrator: {
    text:
      'That is the man, and this is where the playing begins. He is a monk of Morigny, a ' +
      'priest, a canon lawyer; he has a necromantic book he has not destroyed and an art he ' +
      'believes is holy; he has a younger sister who keeps asking him to teach her to read. ' +
      'Ahead of him, and not yet: the provostship in 1308, the figures, the critics he will ' +
      'call the Barking Dogs, the New Compilation of 1315, and a fire at Paris in 1323 that ' +
      'no choice available to you will prevent. What is open is what kind of life he has ' +
      'until then, what the book becomes, how much of it survives him, and in whose hands. ' +
      'The bell is about to go for Matins. It always is.',
    sources: [{ work: 'Grandes Chroniques de France', locus: 'the 1323 notice — a chronicle\'s claim, per docs/scholarship/peters.md' }],
    status: 'adapted', verify: true,
  },
  monologue: {
    ...INV,
    text: 'Twenty years of this ahead of me, and I do not know the number, and it is as well that I do not. The bell. Get up, John.',
  },
};
