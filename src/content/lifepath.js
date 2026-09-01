/**
 * MORIGNY — the lifepath: John's early life, played (v5, replacing the
 * old "Begin at Matins" mode-select, which was a menu pretending to be
 * a choice). Six scenes from the schoolroom to the renunciation, each
 * with the scholarly narrator setting the historical ground, young
 * John's own voice inside it, and a decision that shapes the man who
 * walks into the first Matins: his faculties, his lean, and what his
 * nerves are made of.
 *
 * ═══ THE HONESTY PROBLEM, AND HOW THIS FILE HANDLES IT ═══
 *
 * John's autobiography is unusually forthcoming about his visions and
 * nearly silent about his childhood. So a prologue about his early life
 * is, unavoidably, mostly reconstruction — and the temptation is to
 * write it as though we knew. We do not, and the narrator says so, per
 * scene, in the scene itself.
 *
 * The move that makes this work: where the record is silent, the game
 * does not invent a fact — it offers the roads a boy of his time and
 * place ACTUALLY took, and lets the player choose which one this John
 * walked. That is a different kind of claim from "John was an oblate."
 * It is "boys entered religion in these ways; pick one, and the game
 * will remember." The uncertainty becomes the mechanic instead of being
 * papered over, which is the same trick the apparatus plays everywhere
 * else in this project.
 *
 * Every scene therefore carries `verify: true` on its narrator and
 * cites what it IS grounded in (the Rule, the schools, the scholarship
 * on how such lives went), never John's own book for a claim John's own
 * book does not make. Interior lines are `invented`, always.
 *
 * Pipeline: citations here resolve against src/data/works.js
 * (docs/RESEARCH_PIPELINE.md; CLAUDE.md rule 11).
 */

const FANGER = [{ work: 'Fanger, Rewriting Magic', locus: 'John\'s biography and the shape of his early life (frame; loci on Research Queue)' }];
const WATSON = [{ work: 'Watson, "John the Monk\'s Book of Visions" (Conjuring Spirits, 1998)', locus: 'John\'s account of his Orléans years (frame)' }];
const KIECKHEFER = [{ work: 'Kieckhefer, Magic in the Middle Ages', locus: 'the "clerical underworld" at the schools (frame)' }];
const VERONESE = [{ work: 'Véronèse, editions and studies of the ars notoria', locus: 'the art\'s prayers, notae, and ritual demands (frame)' }];
const RB = [{ work: 'RB 1980 (Rule of St Benedict)', locus: 'RB 58–59, entry into the monastery; RB 38, 48, reading (frame)' }];
const PAGE = [{ work: 'Page, Magic in the Cloister', locus: 'the intellectual life of a house that owned strange books (frame)' }];
const CARRUTHERS = [{ work: 'Carruthers, The Book of Memory', locus: 'trained memory and the schoolroom (frame)' }];
const INV = { sources: [], status: 'invented' };

/**
 * Scenes play in this order. `effect` fields:
 *   faculty: { learning: 1 }   — starting faculty levels
 *   disposition, resolve, despair, pressure — starting statistics
 *   (applied to the baseline in engine/lifepath.js, which clamps)
 */
export const LIFEPATH = [
  // ── 1. How he came to religion ─────────────────────────────────────
  {
    id: 'entering',
    age: 'the beginning',
    rubric: '¶ Of how he came into religion, which the record does not say.',
    narrator: {
      text:
        'Begin with what is not known. John of Morigny tells us a great deal about what he ' +
        'saw and almost nothing about how he got there — no birth year we can pin, no ' +
        'family, no account of the day the door closed behind him. Any prologue that hands ' +
        'you those facts is making them up. So this one will not. What it offers instead is ' +
        'true in a different way: there were a small number of roads by which a boy of ' +
        'northern France in the late thirteenth century actually ended up a Benedictine, ' +
        'they had different consequences for the kind of monk he became, and you may choose ' +
        'which one this John walked. The game will remember your choice and treat it as ' +
        'settled. The record will go on not saying.',
      sources: [...RB, ...FANGER], status: 'adapted', verify: true,
    },
    monologue: {
      ...INV,
      text: 'I have told this story so many ways that I no longer trust my own version of it. Let it be told plainly for once.',
    },
    choices: [
      {
        id: 'oblate', key: 'O',
        label: 'Given as a child. He has never known anything else.',
        why: 'The house raised him; he can sing the psalter before he can doubt it. Leans Obedient. (Learning +1, disposition −1, resolve +1.)',
        effect: { faculty: { learning: 1 }, disposition: -1, resolve: 1 },
        outcome: {
          narrator: {
            text:
              'Child oblation — a family giving a son to a monastery, often with land — was ' +
              'ordinary and, by John\'s century, in decline but not gone. A boy raised this ' +
              'way has the Office in his body before he has opinions about it, and the ' +
              'consequence runs deep: obedience is not for him a thing he decided but the ' +
              'medium he thinks in. When he later does something audacious, he will do it ' +
              'in the grammar of a man who has never been outside.',
            sources: RB, status: 'adapted', verify: true,
          },
          monologue: { ...INV, text: 'I do not remember arriving. That is the truest thing I can say about it: there was no before.' },
        },
        echo: 'He has been inside these walls since before he could choose them.',
      },
      {
        id: 'adolescent', key: 'A',
        label: 'He entered as a youth, with some of the world already in him.',
        why: 'He remembers a life outside, and chose against it. (Worldliness +1, resolve +1, pressure +1.)',
        effect: { faculty: { worldliness: 1 }, resolve: 1, pressure: 1 },
        outcome: {
          narrator: {
            text:
              'The commoner path by 1300: a young man of some family entering by his own ' +
              'act, after enough of the world to know what he was declining. It leaves him ' +
              'two things the oblate lacks — a memory of the outside that will not go quiet, ' +
              'and a vow he can locate the exact day of. Both matter later, in opposite ' +
              'directions.',
            sources: RB, status: 'adapted', verify: true,
          },
          monologue: { ...INV, text: 'I chose this. I have to keep saying that to myself on the bad nights, because it is the only thing that makes the bad nights mine.' },
        },
        echo: 'He remembers the world he gave up, which the ones raised here cannot.',
      },
      {
        id: 'scholar', key: 'S',
        label: 'He came late, out of the schools, already lettered.',
        why: 'He arrived with a trained mind and a taste for questions. (Learning +1, worldliness +1, despair +1.)',
        effect: { faculty: { learning: 1, worldliness: 1 }, despair: 1 },
        outcome: {
          narrator: {
            text:
              'Men did arrive this way — trained at a cathedral school or a studium, taking ' +
              'the habit with a formed intellect and formed habits of enquiry. It buys real ' +
              'capacity and costs real peace: a man who has been taught to interrogate a ' +
              'text does not stop when the text is his own conscience, and the confessional ' +
              'literature is full of exactly this figure, examining himself to pieces.',
            sources: [...CARRUTHERS, ...FANGER], status: 'adapted', verify: true,
          },
          monologue: { ...INV, text: 'I came here with my learning under my arm like a man carrying his own furniture into a house that has plenty. They were kind about it. I have never quite put it down.' },
        },
        echo: 'He came to the cloister already lettered, and has never learned to stop examining things.',
      },
    ],
  },

  // ── 2. The letters ─────────────────────────────────────────────────
  {
    id: 'boyhood-letters',
    age: 'a boy',
    rubric: '¶ Of the first letters he was given.',
    narrator: {
      text:
        'Whatever road brought him, he was taught to read, because the Office is unsayable ' +
        'otherwise. This part is structural rather than biographical: Benedictine houses ' +
        'made readers of the boys in their care, by rote, with a switch to hand, until the ' +
        'psalter was in memory rather than in front of them. Somewhere in that process a ' +
        'particular child discovered that marks on skin could hold a voice — and what he ' +
        'made of that discovery is the first thing about him that was his own.',
      sources: [...RB, ...CARRUTHERS], status: 'adapted', verify: true,
    },
    monologue: {
      ...INV,
      text: 'I was small and the psalter was not. They set my finger on the line and said: this is a word, and it is not yours, and you will carry it anyway.',
    },
    choices: [
      {
        id: 'beauty', key: 'B',
        label: 'He loved the letters for their beauty.',
        why: 'The hand remembers what the eye loved. (Craft +1.)',
        effect: { faculty: { craft: 1 } },
        outcome: {
          narrator: {
            text:
              'He fell in love with the shapes before he understood the sense — which is, as ' +
              'it happens, how most scribes are made. The child who watches the ascenders ' +
              'stand in rank becomes the adult whose own line does not wander.',
            sources: [], status: 'invented',
          },
          monologue: { ...INV, text: 'The great initial had a beast in it, and gold. I wanted to make one. God forgive me, I think I wanted it before I wanted Him.' },
        },
        echo: 'He has loved letterforms since he was small enough to be struck for loving them.',
      },
      {
        id: 'power', key: 'P',
        label: 'He loved the letters for what they could do.',
        why: 'A word said rightly changes something. (Learning +1.)',
        effect: { faculty: { learning: 1 } },
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
          monologue: { ...INV, text: 'They said the words over the bread and the bread was not bread. I asked what made it work and was told not to ask. So I asked silently, for years.' },
        },
        echo: 'He has wanted to know how the words work since before he could read them.',
      },
      {
        id: 'duty', key: 'D',
        label: 'He learned them because he was told to, and was good at it.',
        why: 'No romance; competence, and an early lesson in doing as he is bid. Leans Obedient. (Craft +1, disposition −1.)',
        effect: { faculty: { craft: 1 }, disposition: -1 },
        outcome: {
          narrator: {
            text:
              'The least dramatic answer and probably the commonest. He learned because ' +
              'learning was the task, and did it well because doing tasks well was how a boy ' +
              'in that room stayed out of trouble. It leaves him competent and unexalted — ' +
              'and gives whatever seizes him later a much steeper hill to climb, which will ' +
              'tell us something when something does.',
            sources: RB, status: 'adapted',
          },
          monologue: { ...INV, text: 'I did what I was told and it turned out I was quick at it. That was the whole of my childhood ambition and I do not think it was a poor one.' },
        },
        echo: 'He came to letters through obedience, not appetite — whatever came later had to overcome that.',
      },
    ],
  },

  // ── 3. The hunger ──────────────────────────────────────────────────
  {
    id: 'adolescent-hunger',
    age: 'a young man',
    rubric: '¶ Of the years when the house stopped being enough.',
    narrator: {
      text:
        'Every account of a medieval intellectual life has this moment in it somewhere: the ' +
        'point at which the available teaching runs out and the student has to decide what ' +
        'to do about the silence past its edge. For a monk it was a genuinely dangerous ' +
        'juncture, because the Rule has a great deal to say about a brother who wants ' +
        'something his abbot has not assigned. The historical John does not narrate this ' +
        'moment for us. That he passed through some version of it is not in doubt: men who ' +
        'end up at Orléans with a forbidden book did not get there without first wanting ' +
        'something the cloister could not give them.',
      sources: [...RB, ...FANGER, ...PAGE], status: 'adapted', verify: true,
    },
    monologue: {
      ...INV,
      text: 'I had read everything in the armarium worth reading twice. I began to notice that I was bored in choir, and to be frightened of noticing.',
    },
    choices: [
      {
        id: 'ask', key: 'A',
        label: 'He asked to be sent to the schools, openly, through the proper channel.',
        why: 'The licit road. Slow, permitted, and it puts your ambition on the record. (Learning +1, worldliness +1.)',
        effect: { faculty: { learning: 1, worldliness: 1 } },
        outcome: {
          narrator: {
            text:
              'Houses did send men to study — it was an investment, and a monk with letters ' +
              'was useful to his abbey. Asking openly is the road that keeps him inside ' +
              'obedience, and it means everything that follows at Orléans happens to a man ' +
              'his superiors deliberately put there. That cuts both ways in an examination ' +
              'room, and he will find out which way in about twenty years.',
            sources: [...RB, ...PAGE], status: 'adapted',
          },
          monologue: { ...INV, text: 'I asked. He said yes more easily than I had prepared for, and I walked out of that room elated and obscurely disappointed that it had cost me nothing.' },
        },
        echo: 'He went to the schools with permission, which he will have cause to remember.',
      },
      {
        id: 'devour', key: 'V',
        label: 'He turned it inward: fasts, vigils, and prayer past what was asked.',
        why: 'Holiness as appetite. It works, and it leaves a mark. (Discretio +1, despair +1, resolve +1.)',
        effect: { faculty: { discretio: 1 }, despair: 1, resolve: 1 },
        outcome: {
          narrator: {
            text:
              'He answered intellectual hunger with ascetic effort, which the tradition both ' +
              'recommends and warns about — the same practices that train a man to discern ' +
              'spirits will, overdone, manufacture the experiences he is trying to discern. ' +
              'Fanger\'s reading of John keeps returning to this loop, and it is the deepest ' +
              'thing the sources give us about him: he is a man whose remedy and whose ' +
              'affliction are the same activity.',
            sources: FANGER, status: 'adapted', verify: true,
          },
          monologue: { ...INV, text: 'If the books would not fill me I would empty myself instead, and see what came into the room. Something always came into the room. That should have taught me sooner.' },
        },
        echo: 'He learned early to answer hunger with fasting, and to distrust what showed up afterward.',
      },
      {
        id: 'chafe', key: 'C',
        label: 'He kept it to himself and let it turn into resentment.',
        why: 'Nothing is spent and nothing is resolved. Leans Radical. (Disposition +1, pressure +1.)',
        effect: { disposition: 1, pressure: 1 },
        outcome: {
          narrator: {
            text:
              'The unspoken version, which leaves the least evidence and does the most ' +
              'damage. A man who wants and does not ask develops the habit of holding a ' +
              'private disagreement with the institution he lives inside — and that habit, ' +
              'not any doctrine, is what an examination is actually good at detecting.',
            sources: [...RB, ...FANGER], status: 'adapted',
          },
          monologue: { ...INV, text: 'I said nothing for three years. I said nothing so well that they thought me settled, and I learned in those years exactly how much a man can keep behind his face.' },
        },
        echo: 'He spent years wanting something he would not ask for, and it left him practised at concealment.',
      },
    ],
  },

  // ── 4. Orléans ─────────────────────────────────────────────────────
  {
    id: 'orleans-art',
    age: 'at the schools',
    rubric: '¶ Of Orléans, and how the art came into his hands.',
    narrator: {
      text:
        'Here the ground gets firm again: John studied at Orléans, and Orléans in his ' +
        'lifetime was one of the places where the traffic Richard Kieckhefer named the ' +
        '"clerical underworld" actually happened — literate men in minor orders, with Latin ' +
        'and time, passing around texts nobody would admit to owning. What John acquired ' +
        'there was the ars notoria: a Solomonic art promising infused knowledge of the ' +
        'liberal arts through prayers, fasts, and the inspection of diagrams. By his own ' +
        'account he also had contact with frankly necromantic material. He was not a ' +
        'dabbler and he was not deceived. He was a bright young man being handed the thing ' +
        'he most wanted.',
      sources: [...WATSON, ...KIECKHEFER, ...VERONESE], status: 'adapted', verify: true,
    },
    monologue: {
      ...INV,
      text: 'They had a book. That is the whole of it, and the whole of what came after: they had a book, and they were willing to let me see it, and I have never in my life been able to walk away from that sentence.',
    },
    choices: [
      {
        id: 'knowledge', key: 'K',
        label: 'He came to the art for what it promised to teach.',
        why: 'The scholar\'s hunger — the art\'s own advertised purpose. (Learning +1.)',
        effect: { faculty: { learning: 1 } },
        outcome: {
          narrator: {
            text:
              'His motive was, in the most literal sense, academic: the ars notoria ' +
              'advertised the arts themselves — grammar, rhetoric, the whole quadrivium — ' +
              'poured into a prepared mind without the years. For a student watching richer ' +
              'men buy books he could not, that is not an exotic temptation. It is the ' +
              'ordinary one, wearing a Solomonic coat.',
            sources: VERONESE, status: 'adapted',
          },
          monologue: { ...INV, text: 'I wanted to know things. I have tried since to find a worse motive in myself and I keep finding that one, sitting where I left it.' },
        },
        echo: 'He first came to this art hungry for what it taught, not for whom it let him sit with.',
      },
      {
        id: 'company', key: 'C',
        label: 'He came because they let him in.',
        why: 'The transgression was the door. Leans Radical. (Worldliness +1, disposition +1.)',
        effect: { faculty: { worldliness: 1 }, disposition: 1 },
        outcome: {
          narrator: {
            text:
              'The underworld Kieckhefer describes was, before it was anything doctrinal, a ' +
              'social fact: a circle you were let into. Historians of these networks keep ' +
              'finding that the operative pull is belonging — the book is the token, the ' +
              'company is the draw. A man who came in that way has a different thing to give ' +
              'up later, and gives it up harder.',
            sources: [...KIECKHEFER, ...PAGE], status: 'adapted',
          },
          monologue: { ...INV, text: 'They were older and they were laughing and they made room for me on the bench. I would have read anything they put in front of me. I did.' },
        },
        echo: 'He came to this art through men, not through books, and has never entirely stopped wanting the room they made for him.',
      },
      {
        id: 'fear', key: 'F',
        label: 'He came because he was afraid of what he could not do.',
        why: 'Not appetite — inadequacy. (Discretio +1, despair +1.)',
        effect: { faculty: { discretio: 1 }, despair: 1 },
        outcome: {
          narrator: {
            text:
              'The art promised infusion — knowledge without the grind — and the readiest ' +
              'customer for that promise has always been the student who suspects he is ' +
              'outmatched. It is a motive the sources on the ars notoria make room for, and ' +
              'it turns the whole practice into something closer to panic than to ambition. ' +
              'A man who took it up that way will be unusually good, later, at hearing what ' +
              'a spirit is actually offering him. He has been the mark before.',
            sources: [...VERONESE, ...FANGER], status: 'adapted',
          },
          monologue: { ...INV, text: 'The others were quicker than me. I have never told anyone that. The art said it could close the gap and I did not ask it a single hard question.' },
        },
        echo: 'He came to this art out of fear that he was not equal to the ordinary road.',
      },
    ],
  },

  // ── 5. The practice ────────────────────────────────────────────────
  {
    id: 'the-practice',
    age: 'the years of the art',
    rubric: '¶ Of how he kept the art, while he kept it.',
    narrator: {
      text:
        'The ars notoria was not a spell to be cast but a programme to be kept: sequences ' +
        'of prayers over days and weeks, keyed to hours, gated on ritual purity — ' +
        'confession current, fasts kept, continence held. This is the crucial structural ' +
        'fact about everything John did afterwards, because the Liber florum inherits the ' +
        'shape exactly: the body is a load-bearing component of the magic. How he kept the ' +
        'programme in these years set the habits he would still be keeping, in a purified ' +
        'form, decades later at Morigny.',
      sources: [...VERONESE, ...FANGER], status: 'adapted', verify: true,
    },
    monologue: {
      ...INV,
      text: 'Thirty days of it, and the fasting, and the hours. I kept a tally on the inside of the cover like a prisoner. I was not a prisoner. I was the most willing man in France.',
    },
    choices: [
      {
        id: 'scrupulous', key: 'S',
        label: 'Exactly, to the letter, terrified of invalidating it.',
        why: 'The observance holds; so does the anxiety, forever. (Discretio +1, resolve +1, despair +1.)',
        effect: { faculty: { discretio: 1 }, resolve: 1, despair: 1 },
        outcome: {
          narrator: {
            text:
              'Exactness is what the art demanded and exactness is what it got — along with ' +
              'the characteristic pathology of ritual-purity systems, which is that a man ' +
              'who believes an unnoticed fault silently voids the work will begin hunting ' +
              'himself for unnoticed faults. The scrupulosity that runs through John\'s later ' +
              'writing has a plausible origin here, in a discipline he kept too well.',
            sources: FANGER, status: 'adapted', verify: true,
          },
          monologue: { ...INV, text: 'If a word was wrong I began the day again. Twice I began the month again. I was not being holy; I was being afraid, in Latin.' },
        },
        echo: 'He kept the old art to the letter, and the fear of an unnoticed fault never left him.',
      },
      {
        id: 'hungry', key: 'H',
        label: 'Greedily — pressing for results, cutting where he could.',
        why: 'Faster, and it teaches you what haste costs a rite. Leans Radical. (Learning +1, disposition +1, pressure +1.)',
        effect: { faculty: { learning: 1 }, disposition: 1, pressure: 1 },
        outcome: {
          narrator: {
            text:
              'He pushed. The art\'s own literature is full of warnings against exactly this ' +
              'and full of practitioners who ignored them — and a man who has cut corners in ' +
              'a purity-gated rite has direct, unpleasant, personally-owned knowledge of ' +
              'what happens next. It is knowledge he will later put to use designing a ' +
              'system he considers safe.',
            sources: VERONESE, status: 'adapted',
          },
          monologue: { ...INV, text: 'I wanted it to work now. I shortened things. Something came anyway — that is the part nobody warns you about, that it still comes.' },
        },
        echo: 'He cut corners in the old art once, and knows from the inside what an invalid observance produces.',
      },
      {
        id: 'lapsing', key: 'L',
        label: 'Badly — beginning, breaking off, beginning again.',
        why: 'The commonest way anyone keeps anything. (Worldliness +1, despair +1, resolve −1.)',
        effect: { faculty: { worldliness: 1 }, despair: 1, resolve: -1 },
        outcome: {
          narrator: {
            text:
              'The realistic answer, and the one that leaves him with the least to show and ' +
              'the most self-knowledge. A programme kept badly for years teaches a man ' +
              'exactly where his will gives out — and a man who knows that about himself ' +
              'writes a very different kind of prayer book than one who does not.',
            sources: FANGER, status: 'adapted',
          },
          monologue: { ...INV, text: 'I kept it the way men keep anything: in bursts, with shame in between. I know the exact shape of my own weakness. It is the one thing I have never needed a vision to show me.' },
        },
        echo: 'He kept the old art badly, in bursts, and has never been able to pretend to himself about his own will.',
      },
    ],
  },

  // ── 6. The turn ────────────────────────────────────────────────────
  {
    id: 'the-renouncing',
    age: 'the hinge',
    rubric: '¶ Of the night he decided what the visions were.',
    narrator: {
      text:
        'The hinge of his whole life, and it is documented: John came to read his visionary ' +
        'experiences under the ars notoria as demonic contamination — and did not, as the ' +
        'moralists would have wanted, stop. He rewrote. The Liber florum is a purified ' +
        'system claiming the Virgin\'s own authorization, which is a far stranger and more ' +
        'audacious response than repentance. Note what it implies about this moment: ' +
        'whatever he renounced, he retained enough of the old art to rebuild its ' +
        'architecture from memory. You cannot purify what you have genuinely forgotten. ' +
        'From here the game begins, and the man who walks into Matins is the one these ' +
        'choices made.',
      sources: FANGER, status: 'adapted', verify: true,
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
        id: 'burned', key: 'B',
        label: 'He gave up the books entire, and kept only the wound.',
        why: 'The renunciation the Church would recognise. Leans Obedient. (Disposition −1, resolve +1.)',
        effect: { disposition: -1, resolve: 1 },
        outcome: {
          narrator: {
            text:
              'He made it a clean break, in his own telling — and then spent the rest of his ' +
              'life reconstructing, in a form he could defend, the thing he had broken with. ' +
              'The scholarship is careful here and so should we be: a man can renounce a ' +
              'practice sincerely and rebuild its substance sincerely, and never once feel ' +
              'himself a hypocrite. That is not a failure of logic. It is what conversion ' +
              'actually looks like from inside.',
            sources: FANGER, status: 'adapted',
          },
          monologue: { ...INV, text: 'I let it all go, and my hands stayed shut for a year afterward, and what came back came back from above and not from the shelf. I hold to that. Ask me at Matins and I will still hold to it.' },
        },
        echo: 'He gave the old art up entire once, and what he does now he insists is a different thing.',
      },
      {
        id: 'kept', key: 'K',
        label: 'He kept what he had learned, and told himself that was not the same as keeping the books.',
        why: 'The distinction that lets the Work exist. Leans Radical. (Disposition +1, learning +1.)',
        effect: { disposition: 1, faculty: { learning: 1 } },
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
          monologue: { ...INV, text: 'The books are gone. What I know is not a book. I have made that argument to my confessor, and to God, and to myself at three in the morning, and only the last one keeps asking follow-up questions.' },
        },
        echo: 'He has always known the old art was never really burned — it went on living in the only place a fire cannot reach.',
      },
      {
        id: 'commanded', key: 'C',
        label: 'He did not decide. He was told, in a vision, and obeyed.',
        why: 'The authorization is the whole claim, and he has staked everything on it. (Discretio +1, resolve +1, pressure +1.)',
        effect: { faculty: { discretio: 1 }, resolve: 1, pressure: 1 },
        outcome: {
          narrator: {
            text:
              'This is closest to what the Liber florum itself asserts: not that John ' +
              'cleverly reformed a suspect art, but that he was instructed to. The claim is ' +
              'load-bearing for everything he later does — it is what makes the new work ' +
              'licit in his own eyes, and it is precisely what an examining theologian ' +
              'cannot accept without conceding that a private vision outranks him. Choosing ' +
              'it means John\'s confidence and John\'s exposure are the same fact.',
            sources: [...FANGER, ...WATSON], status: 'adapted', verify: true,
          },
          monologue: { ...INV, text: 'I did not think my way to it. I was shown, and I wrote down what I was shown, and everything since has been obedience of a kind no one will credit me for.' },
        },
        echo: 'He did not reason his way to the new work — he was told to make it, and has never wavered on that point.',
      },
    ],
  },
];

/** The closing beat, after the last choice: into the life proper. */
export const LIFEPATH_CODA = {
  rubric: '¶ And so to Morigny, and the bell.',
  narrator: {
    text:
      'That is the man. He is a monk of Morigny now, in his thirties or thereabouts — the ' +
      'record will not be pinned closer — keeping a Rule that asks for all of him and a ' +
      'Work that asks for the same hours, the same body, and the same attention. Nothing ' +
      'ahead of him is a secret: the book he is writing will be condemned and burned at ' +
      'Paris in 1323, and no choice available to you will prevent that. What is still open ' +
      'is what kind of life he has until then, how much of the Work survives him, and in ' +
      'whose hands. The bell is about to go for Matins. It always is.',
    sources: [{ work: 'Grandes Chroniques de France', locus: 'the 1323 notice — a chronicle\'s claim, per docs/scholarship/peters.md' }],
    status: 'adapted',
  },
  monologue: {
    ...INV,
    text: 'Twenty years of this ahead of me, and I do not know the number, and it is as well that I do not. The bell. Get up, John.',
  },
};
