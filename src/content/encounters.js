/**
 * MORIGNY — the encounter pool (v4 §6b), across the three registers
 * and the three tiers of the escalation ladder. The deck outlasts a run
 * by design: no witness meets all of these.
 *
 * AFFORDANCES decide where an encounter can happen at all, and they are
 * the tags the places carry (src/data/places.js) plus the road's own.
 * An encounter tagged 'seals' happens in the workshop or nowhere; one
 * tagged 'town' happens on the errand to Étampes or never. Until the
 * world stage drew a rider, every encounter said 'cloister' and a road
 * day met nothing at all.
 *
 * REGISTER is load-bearing (D-21): `cloister` is Sophie Page's
 * sociology — professed brothers in good standing, acquiring and
 * shelving what they were curious about; `underworld` is Kieckhefer's
 * milieu apart, the Orléans traffic; `court` is the ecclesiastical and
 * political surface, which per PACING §4 mostly arrives as paperwork.
 * John moves between all three, and the game says which room he is in.
 *
 * Sourcing: each record cites the scholarship its situation is built
 * from (see docs/scholarship/). Situations are `adapted` — extrapolated
 * from what the field says such encounters looked like — never
 * attributed to John's own record unless the record has it. Interior
 * lines in John's voice are `invented`.
 */

const PAGE = [{ work: 'Page, Magic in the Cloister', locus: 'monastic acquisition and ownership of magic texts (frame)' }];
const KIECKHEFER = [{ work: 'Kieckhefer, Magic in the Middle Ages', locus: 'the "clerical underworld" (frame)' }];
const RB = [{ work: 'RB 1980 (Rule of St Benedict)', locus: 'RB 32–33, 48, 55 — the armarius, property, the annual inventory (frame)' }];
const BAILEY = [{ work: 'Bailey, on the boundaries of magic, religion, and science', locus: 'boundary-work as institutional practice (frame)' }];
const PETERS = [{ work: 'Peters, The Magician, the Witch, and the Law', locus: 'accusation documents as arguments, not windows (frame)' }];
const FANGER = [{ work: 'Fanger, Rewriting Magic', locus: 'John\'s practice and its reception (frame; loci on Research Queue)' }];
const KLAASSEN = [{ work: 'Klaassen, The Transformations of Magic', locus: 'the reframing of ritual magic across owners (frame)' }];
const INV = { sources: [], status: 'invented' };

export const ENCOUNTERS = {
  // ══ CLOISTER — minor ═════════════════════════════════════════════════
  'armarius-count': {
    id: 'armarius-count',
    register: 'cloister',
    tier: 'minor',
    affordances: ['cloister'],
    once: true,
    rubric: '¶ Of the armarius, and his list.',
    narrator: {
      text:
        'Brother Denis is counting the books again. The Rule requires it — an annual ' +
        'reckoning of what the house owns, read out so that everyone hears what everyone ' +
        'has — and it is the single most ordinary thing in monastic life that could ruin ' +
        'John. Sophie Page\'s work on monastic libraries makes the texture clear: houses ' +
        'like this one did own strange books, catalogued them, and were not scandalised by ' +
        'them. What gets a monk in trouble is not the odd volume on the shelf. It is the ' +
        'quire that is not on the list.',
      sources: [...RB, ...PAGE], status: 'adapted',
    },
    monologue: {
      ...INV,
      text: 'He reads the titles out like a man calling roll for the dead. And I stand here doing sums about what is under my mattress.',
    },
    options: [
      {
        id: 'volunteer', key: 'H',
        label: 'Help him count.',
        why: 'Be seen being useful; learn exactly what he knows. (Suspicion −1.)',
        effect: { suspicion: -1 },
        outcome: {
          narrator: {
            text:
              'The safest place to stand during an inventory is beside the man taking it. He ' +
              'reads, John writes, and by Vespers John knows precisely which shelves Denis ' +
              'has looked behind — information no amount of hiding could have bought.',
            sources: PAGE, status: 'adapted',
          },
          monologue: { ...INV, text: 'I held the list and wrote in my own hand what the house admits to owning. It is a strange comfort, being the one who writes the list.' },
        },
      },
      {
        id: 'requisition', key: 'R',
        label: 'Use the moment: ask for parchment while he is in a giving mood.',
        why: 'Materials now; a name on his ledger. Leans Radical. (+1 exposure risk.)',
        effect: { risk: { exposure: 1 } },
        outcome: {
          narrator: {
            text:
              'The requisition is granted — armarii exist to grant them — and written down, ' +
              'because armarii also exist to write things down. The parchment is real and so ' +
              'is the line in the ledger recording that Brother John asked for more than his ' +
              'assigned work required. Threat, in this institution, is expressed as ' +
              'paperwork.',
            sources: [...RB, ...PAGE], status: 'adapted',
          },
          monologue: { ...INV, text: 'Four leaves, and he wrote my name beside the number. Everything in this house is written down. That is what a house like this IS.' },
        },
      },
      {
        id: 'absent', key: 'A',
        label: 'Find work elsewhere until it is over.',
        why: 'Nothing gained; nothing entered against you.',
        effect: {},
        outcome: {
          narrator: {
            text:
              'He absents himself, which is neither suspicious nor useful. The count happens ' +
              'without him, as counts do.',
            sources: [], status: 'invented',
          },
          monologue: { ...INV, text: 'I was in the garden. There was nothing in the garden that needed me. There rarely is.' },
        },
      },
    ],
  },

  'novice-asks': {
    id: 'novice-asks',
    register: 'cloister',
    tier: 'minor',
    affordances: ['cloister'],
    once: true,
    rubric: '¶ Of a young brother, and a question he should not have.',
    narrator: {
      text:
        'A novice has noticed something, and has done the worst possible thing with what he ' +
        'noticed: he has asked the person it concerns. This is how information actually ' +
        'moved in a closed community — not through denunciation but through curiosity, ' +
        'which is slower and far harder to stop. What John says now decides whether the boy ' +
        'becomes a reader of the Work or a witness about it.',
      sources: PAGE, status: 'adapted',
    },
    monologue: {
      ...INV,
      text: 'He asked what the figures were for. He is sixteen and he asked kindly, which is worse than if he had sneered.',
    },
    options: [
      {
        id: 'teach', key: 'T',
        label: 'Tell him the truth, in the smallest safe dose.',
        why: 'A reader is worth more than a silence. Leans Radical. (+1 heresy risk, disposition +1.)',
        effect: { disposition: 1, risk: { heresy: 1 } },
        outcome: {
          narrator: {
            text:
              'John gives him something true and incomplete, which is how every teacher of ' +
              'anything dangerous has ever begun. The boy leaves satisfied. Satisfied boys ' +
              'talk to other boys — and a practice with pupils, as the 1323 commission will ' +
              'eventually demonstrate, is a different legal object from a practice with one ' +
              'practitioner.',
            sources: FANGER, status: 'adapted',
          },
          monologue: { ...INV, text: 'I told him it was prayer, which is true. I did not tell him what it asks, which is also true, and the omission is mine to carry.' },
        },
      },
      {
        id: 'deflect', key: 'D',
        label: 'Give him a dull, plausible answer.',
        why: 'The curiosity dies; so does nothing else. (Suspicion +0.)',
        effect: {},
        outcome: {
          narrator: {
            text:
              'Boredom is the most reliable seal there is. John gives him an answer with no ' +
              'handle on it and the boy\'s interest slides off and finds something livelier.',
            sources: [], status: 'invented',
          },
          monologue: { ...INV, text: 'I made it sound like grammar. His eyes went somewhere else while I was still speaking, and I was glad, and a little insulted.' },
        },
      },
      {
        id: 'rebuke', key: 'R',
        label: 'Rebuke him for looking where he was not sent.',
        why: 'Safe, and remembered. Leans Obedient. (Suspicion +1, disposition −1.)',
        effect: { suspicion: 1, disposition: -1 },
        outcome: {
          narrator: {
            text:
              'The rebuke works and costs. A novice publicly corrected tells the story of ' +
              'his correction, and the story contains the detail that Brother John was sharp ' +
              'about his own desk. In a community this size that is a fact now, filed.',
            sources: [], status: 'invented',
          },
          monologue: { ...INV, text: 'I used the voice they use on us and watched it land on him, and hated the ease of it. He will remember. So will whoever he tells.' },
        },
      },
    ],
  },

  'dying-brother': {
    id: 'dying-brother',
    register: 'cloister',
    tier: 'minor',
    affordances: ['cloister'],
    once: true,
    rubric: '¶ Of the infirmary, and a brother going out of the world.',
    narrator: {
      text:
        'An old monk is dying in the infirmary and the house is taking turns sitting with ' +
        'him. This is not a magic problem or a political one. It is the ordinary weight of ' +
        'the life — and it is worth including precisely because a game about a monk who ' +
        'practiced ritual magic could easily forget that most of his hours went to things ' +
        'like this: sitting with someone, saying the psalms, being tired.',
      sources: [{ work: 'RB 1980 (Rule of St Benedict)', locus: 'RB 36, the care of the sick (frame)' }],
      status: 'adapted',
    },
    monologue: {
      ...INV,
      text: 'Brother Warin, who taught me to rule a page. He does not know me tonight. The hands still move as if ruling something.',
    },
    options: [
      {
        id: 'sit', key: 'S',
        label: 'Sit the whole watch.',
        why: 'Costs the night\'s rest. (Fatigue +2, despair −1.)',
        effect: { fatigue: 2, despair: -1 },
        outcome: {
          narrator: {
            text:
              'He sits it out. Nothing is achieved and something is done. The literature on ' +
              'monastic despair is consistent that the cure for the scrupulous man was never ' +
              'introspection — it was work, obedience, and the company of other people, ' +
              'preferably all three at once.',
            sources: [{ work: 'Fanger, Rewriting Magic', locus: 'scrupulosity and its remedies (frame)' }],
            status: 'adapted',
          },
          monologue: { ...INV, text: 'I said the psalms to a man who could not hear them and found, somewhere near the end, that they were for me.' },
        },
      },
      {
        id: 'ask', key: 'A',
        label: 'Ask him, while he can still answer, what he knows about the old books.',
        why: 'He was armarius forty years. Leans Radical. (+1 exposure risk, disposition +1.)',
        requires: { faculty: { learning: 1 } },
        effect: { disposition: 1, risk: { exposure: 1 } },
        outcome: {
          narrator: {
            text:
              'A deathbed is a terrible place to conduct research and an unrepeatable one. ' +
              'The old man surfaces briefly, names two volumes and a shelf, and goes under ' +
              'again — and the infirmarian, who was in the room, now knows what Brother John ' +
              'asked a dying man about.',
            sources: PAGE, status: 'adapted',
          },
          monologue: { ...INV, text: 'I asked. God forgive me, I asked, and he answered, and I wrote it down afterward in the dark like a thief pricing a house.' },
        },
      },
    ],
  },

  // ══ CLOISTER — major ═════════════════════════════════════════════════
  'abbots-commission': {
    id: 'abbots-commission',
    register: 'cloister',
    tier: 'major',
    affordances: ['cloister'],
    once: true,
    requires: { minDays: 2 },
    rubric: '¶ Of a book the abbot wants, and who is to make it.',
    narrator: {
      text:
        'The abbot wants a presentation copy made — a gift, for someone whose goodwill the ' +
        'house needs — and John\'s hand has been noticed. This is the cloister register at ' +
        'its most double-edged: recognition is protection, and it is also visibility, and ' +
        'in a house where everyone knows everyone\'s hand, being the best scribe means your ' +
        'work is identifiable at a glance, forever, by anyone who later has cause to look.',
      sources: [...RB, ...PAGE], status: 'adapted',
    },
    monologue: {
      ...INV,
      text: 'He asked for me by name. I have wanted that for eleven years and I find I am doing arithmetic instead of rejoicing.',
    },
    options: [
      {
        id: 'accept', key: 'A',
        label: 'Accept, and make it the best thing you have ever made.',
        why: 'The abbot\'s favour is a wall. (Suspicion −2, fatigue +2.)',
        requires: { faculty: { craft: 1 } },
        effect: { suspicion: -2, fatigue: 2 },
        outcome: {
          narrator: {
            text:
              'He does the work and it is very good, and the house adjusts its picture of ' +
              'him accordingly: Brother John, who is useful. A reputation for usefulness is ' +
              'the cheapest armour available to a man in his position, and he has just ' +
              'bought a suit of it with three weeks of his eyes.',
            sources: [], status: 'invented',
          },
          monologue: { ...INV, text: 'I gave it everything, and it is beautiful, and no one will ever know how much of what I know went into a book about nothing.' },
        },
      },
      {
        id: 'accept-slowly', key: 'S',
        label: 'Accept, and keep the Work\'s hours out of it.',
        why: 'Protect your own nights; the copy will show it. (Suspicion −1.)',
        effect: { suspicion: -1 },
        outcome: {
          narrator: {
            text:
              'A competent job, delivered on time, remarkable to nobody — which is itself a ' +
              'decision about what his hands are for. The abbot is satisfied and does not ' +
              'think of him again, which is exactly half of what John wanted.',
            sources: [], status: 'invented',
          },
          monologue: { ...INV, text: 'Good enough. I have never in my life made a thing that was good enough on purpose, and it sits badly.' },
        },
      },
      {
        id: 'refuse', key: 'R',
        label: 'Plead the assigned work and decline.',
        why: 'Nobody refuses an abbot for free. (Suspicion +2.)',
        effect: { suspicion: 2 },
        outcome: {
          narrator: {
            text:
              'The refusal is accepted with the particular graciousness that means it has ' +
              'been noted. In a community organised around obedience, declining a request ' +
              'from the man to whom you have vowed obedience is data — and the question it ' +
              'raises is not "is he lazy" but "what is he doing instead."',
            sources: RB, status: 'adapted',
          },
          monologue: { ...INV, text: 'He said of course, of course, and smiled, and I have been in this house long enough to know exactly what that smile is for.' },
        },
      },
    ],
  },

  // ══ UNDERWORLD — minor ═══════════════════════════════════════════════
  'stationers-quire': {
    id: 'stationers-quire',
    register: 'underworld',
    tier: 'minor',
    affordances: ['cloister'],
    once: true,
    rubric: '¶ Of a stationer, and a quire he ought not to have.',
    narrator: {
      text:
        'A stationer\'s man at the gate has something in his pack he is not offering to ' +
        'everyone. This is the underworld register in its most banal and most historically ' +
        'accurate form: not a robed conspiracy, but the book trade doing what the book trade ' +
        'always did, which is sell people what they want and price the risk in. Kieckhefer\'s ' +
        '"clerical underworld" ran on exactly this — literate men, portable quires, and ' +
        'discretion available at a markup.',
      sources: KIECKHEFER, status: 'adapted',
    },
    monologue: {
      ...INV,
      text: 'He did not say what it was. He said "you would know what it is," which is the oldest hook in the trade and I felt it go in.',
    },
    options: [
      {
        id: 'buy', key: 'B',
        label: 'Buy the quire, unread.',
        why: 'You do not know what it is yet. Leans Radical. (+1 exposure, +1 debt, disposition +1.)',
        effect: { disposition: 1, risk: { exposure: 1, debt: 1 } },
        outcome: {
          narrator: {
            text:
              'The transaction is small, ordinary, and the kind of thing that turns up in ' +
              'depositions decades later phrased much more dramatically than it deserves. ' +
              'John now owns something whose provenance he cannot account for and whose ' +
              'contents he has not read.',
            sources: [...KIECKHEFER, ...PETERS], status: 'adapted',
          },
          monologue: { ...INV, text: 'Paid, and hid it before I read it, which tells me what I already knew about myself and did not want written down.' },
        },
      },
      {
        id: 'look', key: 'L',
        label: 'Look, but do not buy.',
        why: 'Knowing what exists costs nothing but the looking. (+1 exposure risk.)',
        requires: { faculty: { learning: 1 } },
        effect: { risk: { exposure: 1 } },
        outcome: {
          narrator: {
            text:
              'He reads enough to place it — a competent copy of something he half ' +
              'recognises — and hands it back. The stationer\'s man now knows something ' +
              'valuable: that this monk can read that, and did not flinch. That knowledge ' +
              'has a market of its own.',
            sources: KIECKHEFER, status: 'adapted',
          },
          monologue: { ...INV, text: 'I knew the hand of it at once, which is its own confession, and he watched me know it.' },
        },
      },
      {
        id: 'refuse', key: 'R',
        label: 'Send him away.',
        why: 'Leans Obedient. (Disposition −1.)',
        effect: { disposition: -1 },
        outcome: {
          narrator: {
            text:
              'He sends the man off, and the man goes without argument — there are other ' +
              'houses and other monks. Nothing happens, which is what refusing correctly ' +
              'looks like and why it so rarely makes the record.',
            sources: [], status: 'invented',
          },
          monologue: { ...INV, text: 'I said no. I said it quickly, before the other voice could finish its sentence, and I have been arguing with that voice ever since.' },
        },
      },
    ],
  },

  // ══ UNDERWORLD — major ═══════════════════════════════════════════════
  'old-companion': {
    id: 'old-companion',
    register: 'underworld',
    tier: 'major',
    affordances: ['cloister'],
    once: true,
    requires: { minDays: 2 },
    rubric: '¶ Of a face from Orléans, at the abbey gate.',
    narrator: {
      text:
        'Someone from the old life has found him. The historical point worth making here is ' +
        'that the "underworld" was a network of PEOPLE, and people do not stay in the past ' +
        'because you have repented of them — they turn up, older, with the same laugh and ' +
        'new debts. A man who left that circle did not thereby stop being someone the ' +
        'circle knew.',
      sources: [...KIECKHEFER, ...PAGE], status: 'adapted',
    },
    monologue: {
      ...INV,
      text: 'Guibert. Fatter, and the same eyes. He said my name the way he said it when we were twenty and I felt twenty, which frightened me more than he did.',
    },
    options: [
      {
        id: 'welcome', key: 'W',
        label: 'Take him in, feed him, hear what he wants.',
        why: 'The Rule commands hospitality; the past comes in with him. Leans Radical. (+1 exposure, disposition +1.)',
        effect: { disposition: 1, risk: { exposure: 1 } },
        outcome: {
          narrator: {
            text:
              'The Rule\'s chapter on guests is unambiguous and John is on solid ground ' +
              'obeying it — which is precisely what makes this dangerous. Everything about ' +
              'the visit is defensible, and it puts a man who knew him at Orléans inside the ' +
              'walls, talking, in front of witnesses who will remember him when they are ' +
              'asked to.',
            sources: [{ work: 'RB 1980 (Rule of St Benedict)', locus: 'RB 53, the reception of guests (frame)' }, ...PETERS],
            status: 'adapted',
          },
          monologue: { ...INV, text: 'I washed his feet because the Rule says to, and he let me, and neither of us said what we were both thinking about the last time we sat that close.' },
        },
      },
      {
        id: 'brief', key: 'B',
        label: 'Meet him at the gate, briefly, and send him on with bread.',
        why: 'Charity without a witness list. (Suspicion +1.)',
        effect: { suspicion: 1 },
        outcome: {
          narrator: {
            text:
              'A short conversation at a gate, observed by a porter with a good memory. Less ' +
              'exposure and not none: the porter saw a layman ask for Brother John by name, ' +
              'and porters are the most systematically underestimated witnesses in monastic ' +
              'history.',
            sources: [], status: 'invented',
          },
          monologue: { ...INV, text: 'Bread and a blessing and go. He looked at me for a moment as if deciding whether to be hurt, and decided not to bother, which was worse.' },
        },
      },
      {
        id: 'refuse', key: 'R',
        label: 'Have the porter turn him away unseen.',
        why: 'Leans Obedient, and costs something else. (Despair +1, disposition −1.)',
        effect: { despair: 1, disposition: -1 },
        outcome: {
          narrator: {
            text:
              'He does not go down. The man is turned away and John spends the afternoon ' +
              'discovering that safety and peace are different commodities and he has ' +
              'purchased only one of them.',
            sources: [], status: 'invented',
          },
          monologue: { ...INV, text: 'I did not go down. I know what he came for and I did not go down, and I have said the office three times since without hearing a word of it.' },
        },
      },
    ],
  },

  'the-commission': {
    id: 'the-commission',
    register: 'underworld',
    tier: 'major',
    affordances: ['cloister'],
    once: true,
    requires: { minDays: 3, risk: { exposure: 1 } },
    rubric: '¶ Of an offer of money, for work of a particular kind.',
    narrator: {
      text:
        'Word has travelled that there is a monk here who can read the difficult books, and ' +
        'now someone with money would like something done. This is the moment the game has ' +
        'been carefully keeping rare, because the sources keep it rare: the necromantic ' +
        'commission was real, it was a market, and it was also the thing John of Morigny ' +
        'spent his entire adult life NOT being. What is offered is not a bargain with a ' +
        'devil. It is freelance work.',
      sources: [...KIECKHEFER, ...FANGER], status: 'adapted',
    },
    monologue: {
      ...INV,
      text: 'He wants a thing found that was lost, and he thinks I know how, and the worst of it is that once I did.',
    },
    options: [
      {
        id: 'refuse-plainly', key: 'R',
        label: 'Refuse, plainly, and say why.',
        why: 'The refusal the whole rewriting exists to make possible. Leans Obedient. (Disposition −1, resolve +1.)',
        effect: { disposition: -1, resolve: 1 },
        outcome: {
          narrator: {
            text:
              'He says no, and says the reason: that the art he practices is not that art, ' +
              'and that the difference is the whole of his work. Whether the theologians of ' +
              '1323 will accept that distinction is a separate question — but it is his ' +
              'distinction, he has bled for it, and this is the first time anyone has made ' +
              'him state it out loud to a stranger.',
            sources: FANGER, status: 'adapted',
          },
          monologue: { ...INV, text: 'I told him what I do is not what he wants and watched him fail to hear a difference. Nobody hears the difference. I will spend my life on this sentence.' },
        },
      },
      {
        id: 'refuse-quietly', key: 'Q',
        label: 'Refuse without explaining anything.',
        why: 'Give him nothing to repeat. (+1 scandal risk.)',
        effect: { risk: { scandal: 1 } },
        outcome: {
          narrator: {
            text:
              'An unexplained refusal leaves the story entirely in the other man\'s hands, ' +
              'and he will tell it as a monk who could have and would not — which, ' +
              'repeated in the wrong room, is nearly the same shape as a monk who does.',
            sources: PETERS, status: 'adapted',
          },
          monologue: { ...INV, text: 'I said only no. Let him make of it what he makes. God knows what he will make of it.' },
        },
      },
      {
        id: 'take', key: 'T',
        label: 'Take the work.',
        why: 'The road out of the record. Leans Radical, hard. (+2 heresy, +1 debt, disposition +1.)',
        requires: { minDisposition: 2 },
        effect: { disposition: 1, risk: { heresy: 2, debt: 1 } },
        outcome: {
          narrator: {
            text:
              'He takes it — and the historian has to say clearly that this is where the ' +
              'game leaves what John actually did. He did not do this. The Radical Axis ' +
              '(WORLD_DESIGN.md §4) permits the witness to depart from the record, but it ' +
              'pays for the departure with an annotation, and this is the first instalment: ' +
              'from here the man in this book is answering a question the real John answered ' +
              'the other way, every time he was asked.',
            sources: [...FANGER, ...BAILEY], status: 'adapted',
          },
          monologue: { ...INV, text: 'I said yes. I have written down that I said yes, because if I am going to damn myself I will at least not lie about the date.' },
        },
      },
    ],
  },

  // ══ COURT — minor ════════════════════════════════════════════════════
  'archdeacons-clerk': {
    id: 'archdeacons-clerk',
    register: 'court',
    tier: 'minor',
    affordances: ['cloister'],
    once: true,
    rubric: '¶ Of a clerk with friendly questions.',
    narrator: {
      text:
        'The archdeacon\'s clerk is visiting on ordinary business and has been pleasant to ' +
        'everyone. He is also, in the most literal sense, taking notes. Ecclesiastical ' +
        'pressure in this period almost never arrives as confrontation; it arrives as ' +
        'administration, conducted by agreeable men with good handwriting, and it is far ' +
        'more frightening for it.',
      sources: [...PETERS, ...BAILEY], status: 'adapted',
    },
    monologue: {
      ...INV,
      text: 'He asked how many are in the house and what we read at table and whether we are well. He wrote all three answers down.',
    },
    options: [
      {
        id: 'charm', key: 'C',
        label: 'Be interesting to him.',
        why: 'A clerk who likes you writes softer. Needs worldliness. (Suspicion −1.)',
        requires: { faculty: { worldliness: 1 } },
        effect: { suspicion: -1 },
        outcome: {
          narrator: {
            text:
              'John gives him a good hour — the sort of talk that makes a travelling clerk\'s ' +
              'week — and is written into the report as sound, learned, and unremarkable. ' +
              'Being liked by the man holding the pen is not corruption. It is how the ' +
              'system was survived.',
            sources: [], status: 'invented',
          },
          monologue: { ...INV, text: 'I made him laugh about Orléans wine. He will remember a pleasant monk and not a careful one, which was the whole object.' },
        },
      },
      {
        id: 'brief', key: 'B',
        label: 'Answer exactly what is asked and nothing beyond.',
        why: 'Correct, colourless, and slightly cold. (Suspicion +1.)',
        effect: { suspicion: 1 },
        outcome: {
          narrator: {
            text:
              'Minimal answers are not neutral. A man who gives a friendly clerk nothing to ' +
              'write is a man the clerk writes a sentence about.',
            sources: PETERS, status: 'adapted',
          },
          monologue: { ...INV, text: 'Yes. No. Twenty-three. He waited for more and I gave him the silence, and he wrote in it.' },
        },
      },
    ],
  },

  // ══ COURT — major ════════════════════════════════════════════════════
  'patron-interest': {
    id: 'patron-interest',
    register: 'court',
    tier: 'major',
    affordances: ['cloister'],
    once: true,
    requires: { minDays: 3 },
    rubric: '¶ Of a lady of the county, and her interest in the book.',
    narrator: {
      text:
        'Someone with money and standing has heard that a monk at Morigny is writing ' +
        'something remarkable, and would like to be its friend. Patronage in this period is ' +
        'a weather system, not a gift: it brings resources, protection, and an obligation ' +
        'whose terms are never written down. And it does the one thing most fatal to a ' +
        'secret devotional practice — it makes the book a known object, in circles that ' +
        'talk.',
      sources: [...FANGER, ...KLAASSEN], status: 'adapted',
    },
    monologue: {
      ...INV,
      text: 'She sent a servant with wine and a question, and the question was better than the wine, which is how I know she is dangerous.',
    },
    options: [
      {
        id: 'court-her', key: 'A',
        label: 'Accept the interest, and let the book be known.',
        why: 'Protection now; a famous book later. Leans Radical. (Suspicion −2, +2 scandal risk, disposition +1.)',
        requires: { faculty: { worldliness: 1 } },
        effect: { suspicion: -2, disposition: 1, risk: { scandal: 2 } },
        outcome: {
          narrator: {
            text:
              'She becomes, for a while, a wall between John and the ordinary suspicions of ' +
              'his own house — and simultaneously the reason his book will be discussed in ' +
              'rooms he will never enter. Klaassen\'s work on how ritual magic travelled ' +
              'makes the pattern plain: texts that acquire patrons acquire readers, and ' +
              'readers are how a manuscript survives AND how it gets denounced.',
            sources: KLAASSEN, status: 'adapted',
          },
          monologue: { ...INV, text: 'I let her have a sight of it. She is powerful and she is kind and I have just made my book into a thing that exists in the world.' },
        },
      },
      {
        id: 'deflect', key: 'D',
        label: 'Thank her, and give her a devotional trifle instead.',
        why: 'Keep the friendship, withhold the book. (+1 scandal risk.)',
        effect: { risk: { scandal: 1 } },
        outcome: {
          narrator: {
            text:
              'He gives her something pious and slight. She is not deceived — women who ' +
              'patronise scholars are rarely deceived about scholars — but she is not ' +
              'offended either, and files the refusal for later use.',
            sources: [], status: 'invented',
          },
          monologue: { ...INV, text: 'A little prayer, prettily made, and she thanked me for it exactly as much as it deserved.' },
        },
      },
      {
        id: 'refuse', key: 'R',
        label: 'Refuse the connection entirely.',
        why: 'Leans Obedient; you will need a wall later and will not have this one. (Disposition −1.)',
        effect: { disposition: -1 },
        outcome: {
          narrator: {
            text:
              'He declines to be anybody\'s discovery. It is the safest answer available and ' +
              'it forecloses the one form of protection that could have outranked his own ' +
              'abbot when the letter from Paris finally comes.',
            sources: [], status: 'invented',
          },
          monologue: { ...INV, text: 'I sent the wine back. Pride, probably. I will call it prudence in the journal and God can sort out which it was.' },
        },
      },
    ],
  },

  // ══ GRAVE — the ladder's floor ═══════════════════════════════════════
  'chapter-accusation': {
    id: 'chapter-accusation',
    register: 'cloister',
    tier: 'grave',
    affordances: ['cloister'],
    once: true,
    requires: { minDays: 4, risk: { exposure: 2 } },
    rubric: '¶ Of a fault proclaimed against him, in chapter.',
    narrator: {
      text:
        'Someone has proclaimed a fault against him in front of the community. The ' +
        'chapter of faults was ordinary machinery — brothers accused each other constantly, ' +
        'usually about lateness and broken crockery — which is exactly what makes this ' +
        'dangerous: the accusation arrives wearing the clothes of routine discipline, and ' +
        'the whole house is already assembled and listening.',
      sources: [{ work: 'RB 1980 (Rule of St Benedict)', locus: 'RB 44–46, the chapter of faults (frame)' }, ...PETERS],
      status: 'adapted',
    },
    monologue: {
      ...INV,
      text: 'He said I keep a light after Compline and write what is not assigned. Both true. He said it kindly. Sixty faces turned.',
    },
    options: [
      {
        id: 'submit', key: 'S',
        label: 'Prostrate, accept the penance, say nothing else.',
        why: 'The Rule\'s own answer; it ends here. Leans Obedient. (Suspicion −2, despair +1, disposition −1.)',
        effect: { suspicion: -2, despair: 1, disposition: -1 },
        outcome: {
          narrator: {
            text:
              'Submission works — it is designed to work, and a community that sees a ' +
              'brother take his correction properly stops thinking about him within a week. ' +
              'It costs him the small private thing that satisfaction always costs: the ' +
              'admission, in front of everyone, that the accusation was true.',
            sources: RB, status: 'adapted',
          },
          monologue: { ...INV, text: 'I lay on the stones and said the words and meant about half of them. The half I meant was about the light. The other half God and I are still negotiating.' },
        },
      },
      {
        id: 'explain', key: 'E',
        label: 'Explain what the writing is: devotion, not disobedience.',
        why: 'Argue inside their frame. Needs learning. (Suspicion +1, +1 heresy risk.)',
        requires: { faculty: { learning: 2 } },
        effect: { suspicion: 1, risk: { heresy: 1 } },
        outcome: {
          narrator: {
            text:
              'He makes the argument, and makes it well, and the room half accepts it — ' +
              'which is the most dangerous outcome available, because now the community has ' +
              'a description of what he is doing, in his own words, that can be repeated to ' +
              'someone with authority to disagree.',
            sources: [...BAILEY, ...FANGER], status: 'adapted',
          },
          monologue: { ...INV, text: 'I told them it was prayer and I told them why, and I saw two of them believe me, and I do not yet know whether that helps.' },
        },
      },
      {
        id: 'contest', key: 'C',
        label: 'Deny that the chapter has any business judging the Work at all.',
        why: 'Contest their authority to draw the line. Leans Radical, hard. (Suspicion +3, +2 heresy risk, disposition +1.)',
        requires: { minDisposition: 1 },
        effect: { suspicion: 3, disposition: 1, risk: { heresy: 2 } },
        outcome: {
          narrator: {
            text:
              'This is the Radical Axis in its precise form (D-21, after Michael Bailey): ' +
              'not "I have not sinned" but "you are not the ones who decide what this is." ' +
              'It is a claim about jurisdiction, made by a monk under vow of obedience, in ' +
              'the room specifically constituted to exercise that obedience. The house will ' +
              'not forget it, and neither will the record.',
            sources: BAILEY, status: 'adapted',
          },
          monologue: { ...INV, text: 'I said: this was given me, and not by you, and you cannot unmake what you did not make. The silence afterward went on a long time. I have not slept since.' },
        },
      },
    ],
  },

  'denunciation': {
    id: 'denunciation',
    register: 'underworld',
    tier: 'grave',
    affordances: ['cloister'],
    once: true,
    requires: { minDays: 4, risk: { heresy: 2 } },
    rubric: '¶ Of a letter someone else has written.',
    narrator: {
      text:
        'Someone has put something in writing about him, to somebody who matters. Edward ' +
        'Peters\'s caution is the one to hold here: a document accusing a man of magic is ' +
        'never a window onto what he did. It is an argument, made by a person with motives, ' +
        'for an audience with interests. What John is facing is not the truth about himself. ' +
        'It is a text about him, and texts about people have their own careers.',
      sources: PETERS, status: 'adapted',
    },
    monologue: {
      ...INV,
      text: 'A letter. I have not seen it and I know its shape: everything in it true, arranged so that the truth is a lie.',
    },
    options: [
      {
        id: 'preempt', key: 'P',
        label: 'Go to the abbot first, and tell it your way.',
        why: 'The first version told is the one everyone reads. (Suspicion −1, −1 heresy risk.)',
        requires: { faculty: { learning: 1 } },
        effect: { suspicion: -1, risk: { heresy: -1 } },
        outcome: {
          narrator: {
            text:
              'Getting there first genuinely works, and for a reason that has nothing to do ' +
              'with merit: institutions process the first coherent account they receive and ' +
              'measure later ones against it. He has not disproved the letter. He has made ' +
              'it a reply.',
            sources: PETERS, status: 'adapted',
          },
          monologue: { ...INV, text: 'I told him before it came. He listened with his hands folded and I could not tell, and cannot now, whether I saved myself or confessed.' },
        },
      },
      {
        id: 'silence', key: 'S',
        label: 'Say nothing, and let it arrive.',
        why: 'Dignity, or paralysis. (+1 scandal risk, despair +1.)',
        effect: { despair: 1, risk: { scandal: 1 } },
        outcome: {
          narrator: {
            text:
              'Silence is a legitimate strategy against an accusation whose contents you ' +
              'cannot see, and it is also how a man spends four weeks unable to eat. The ' +
              'letter arrives when it arrives.',
            sources: [], status: 'invented',
          },
          monologue: { ...INV, text: 'Nothing. I will say nothing. I have said nothing now for eleven days and I can feel it curdling into something that looks like guilt.' },
        },
      },
      {
        id: 'find-author', key: 'F',
        label: 'Find out who wrote it.',
        why: 'Needs worldliness; what you learn cannot be unlearned. Leans Radical. (+1 scandal risk, disposition +1.)',
        requires: { faculty: { worldliness: 2 } },
        effect: { disposition: 1, risk: { scandal: 1 } },
        outcome: {
          narrator: {
            text:
              'He finds out. It is someone close, and the reason is petty, and knowing this ' +
              'helps him not at all with the ecclesiastical machinery already in motion — ' +
              'but it does change permanently what it feels like to sing the Office beside ' +
              'sixty men.',
            sources: [], status: 'invented',
          },
          monologue: { ...INV, text: 'I know who. I will keep singing next to him twice a day for the rest of my life and he knows that I know, and neither of us will ever say it.' },
        },
      },
    ],
  },

  'commission-of-inquiry': {
    id: 'commission-of-inquiry',
    register: 'court',
    tier: 'grave',
    affordances: ['cloister'],
    once: true,
    requires: { minDays: 5, risk: { scandal: 2 } },
    rubric: '¶ Of men sent to ask, with authority to ask.',
    narrator: {
      text:
        'Two men have arrived with a commission, which is to say with the authority to ' +
        'require answers. This is the shape the 1323 condemnation will eventually take, in ' +
        'miniature and in advance — and the thing to notice, following Bailey, is that they ' +
        'are not applying a settled rule to a clear case. They are doing boundary-work: ' +
        'deciding, in the room, with John in front of them, which side of a line his ' +
        'practice falls on. The line is being drawn now. That is what the interview is for.',
      sources: [...BAILEY, ...PETERS], status: 'adapted',
    },
    monologue: {
      ...INV,
      text: 'They were courteous and they did not take off their travelling cloaks, which told me how long they expect this to take.',
    },
    options: [
      {
        id: 'submit', key: 'S',
        label: 'Answer as a son of the Church, and let them judge.',
        why: 'The record\'s own shape. Leans Obedient. (Suspicion −2, −1 scandal risk, disposition −1.)',
        effect: { suspicion: -2, disposition: -1, risk: { scandal: -1 } },
        outcome: {
          narrator: {
            text:
              'Submission at this stage buys real time — the commission goes away with an ' +
              'answer it can file, and filing is what commissions are for. It also concedes ' +
              'the point that will matter most later: that these men are the ones entitled ' +
              'to ask.',
            sources: BAILEY, status: 'adapted',
          },
          monologue: { ...INV, text: 'I answered everything and answered it humbly, and they went away satisfied, and I have given away something I will want back.' },
        },
      },
      {
        id: 'defend', key: 'D',
        label: 'Defend the Work on its merits, in their own vocabulary.',
        why: 'Argue inside their frame, expertly. Needs learning 2. (+1 heresy risk.)',
        requires: { faculty: { learning: 2 } },
        effect: { risk: { heresy: 1 } },
        outcome: {
          narrator: {
            text:
              'He argues it as a theologian would, and they engage him as one — which is ' +
              'flattering, and means the conversation is now on the record in technical ' +
              'language that other theologians, elsewhere, will be able to evaluate without ' +
              'ever meeting him.',
            sources: [...BAILEY, ...FANGER], status: 'adapted',
          },
          monologue: { ...INV, text: 'We argued for three hours like men at the schools and I enjoyed it, God help me, I enjoyed it, and every word is written down.' },
        },
      },
      {
        id: 'jurisdiction', key: 'J',
        label: 'Tell them the Virgin\'s authorization outranks their commission.',
        why: 'Refuse the frame itself. The Radical road. (Suspicion +3, +2 heresy risk, disposition +2.)',
        requires: { minDisposition: 2 },
        effect: { suspicion: 3, disposition: 2, risk: { heresy: 2 } },
        outcome: {
          narrator: {
            text:
              'The claim is not that they are wrong about the doctrine. The claim is that ' +
              'they lack standing — that a licence given in a vision is a higher warrant ' +
              'than a bishop\'s letter. It is, in 1315 terms, an extraordinary thing to say ' +
              'out loud, it follows logically from everything John actually believed, and ' +
              'it is the exact hinge on which the Radical Axis turns from audacity into ' +
              'departure.',
            sources: [...BAILEY, ...FANGER], status: 'adapted',
          },
          monologue: { ...INV, text: 'I said: she gave it to me, and you were not there. One of them started writing before I had finished the sentence.' },
        },
      },
    ],
  },

  // ══ ROAD & TOWN — the errand to Étampes ══════════════════════════════
  'apothecary-question': {
    id: 'apothecary-question',
    register: 'cloister',
    tier: 'minor',
    affordances: ['town'],
    once: true,
    rubric: '¶ Of the apothecary at Étampes, and a question about weights.',
    narrator: {
      text:
        'The infirmary sent him for poppy, and the apothecary wants to talk shop. This is the ' +
        'ordinary traffic that made monastic houses part of a wider knowledge economy: a ' +
        'monk who can read Latin and handle a balance is useful to a townsman, and a townsman ' +
        'with a stockroom is useful right back. Page\'s point about the cloister as a ' +
        'production environment does not stop at the gate — half the materials came through ' +
        'exactly this sort of conversation.',
      sources: PAGE, status: 'adapted',
    },
    monologue: {
      ...INV,
      text: 'He wanted to know whether the book he cannot read says two drachms or three. I can read it. I am aware of how pleasant that is, and of what pleasant things cost.',
    },
    options: [
      {
        id: 'help', key: 'H',
        label: 'Read it for him, and correct the dose.',
        why: 'A useful man is remembered kindly. (Worldliness +1.)',
        effect: {},
        outcome: {
          narrator: {
            text:
              'He reads the passage, corrects a dose that would have done real harm, and is ' +
              'thanked in the coin such men have: he will be recognised in this town, and ' +
              'spoken well of, and that is worth more on a road than money.',
            sources: [], status: 'invented',
          },
          monologue: { ...INV, text: 'Two drachms. He wrote it on the jar in charcoal and thanked me twice, and I walked out taller than a man should over a jar.' },
        },
      },
      {
        id: 'trade', key: 'T',
        label: 'Read it, and ask what he has under the counter.',
        why: 'The trade in materials runs both ways. Leans Radical. (+1 exposure risk.)',
        effect: { disposition: 1, risk: { exposure: 1 } },
        outcome: {
          narrator: {
            text:
              'The transaction turns. An apothecary\'s back shelf held things a physic garden ' +
              'does not: imported resins, minerals, the odd book of recipes that came north ' +
              'with the goods. None of it is illegal. All of it is the sort of thing an ' +
              'inventory later describes badly.',
            sources: [...PAGE, ...KIECKHEFER], status: 'adapted',
          },
          monologue: { ...INV, text: 'He has more than poppy and he knew that I knew. Neither of us said a forbidden word and we both understood the whole conversation.' },
        },
      },
      {
        id: 'brief', key: 'B',
        label: 'Take the poppy and go.',
        why: 'The errand, and nothing but the errand.',
        effect: {},
        outcome: {
          narrator: {
            text: 'He buys what he was sent for and leaves, which is what the prior had in mind.',
            sources: [], status: 'invented',
          },
          monologue: { ...INV, text: 'Poppy, and the road home. I have been good today in the small way that nobody notices, which is the only way that counts.' },
        },
      },
    ],
  },

  'the-bell-in-the-market': {
    id: 'the-bell-in-the-market',
    register: 'cloister',
    tier: 'minor',
    affordances: ['town'],
    once: true,
    rubric: '¶ Of an hour falling due in a public square.',
    narrator: {
      text:
        'Sext rings from the collegiate church while he is standing among fishmongers. The ' +
        'Rule expects brethren working at a distance to keep the hours where they are, which ' +
        'sounds simple and is not: an office kept in the open is a performance, whether or ' +
        'not he intends one. Medieval townspeople were entirely capable of reading a monk\'s ' +
        'devotion as sanctity, as reproach, or as a man making a point.',
      sources: [{ work: 'RB 1980 (Rule of St Benedict)', locus: 'RB 50, brethren working at a distance (frame)' }],
      status: 'adapted',
    },
    monologue: {
      ...INV,
      text: 'The bell, and forty people between me and any wall to face. I have never once minded saying the hours. I mind being watched saying them, which is a fault and I know its name.',
    },
    options: [
      {
        id: 'keep', key: 'K',
        label: 'Keep it where you stand, aloud.',
        why: 'The Rule satisfied, in front of everyone. (Suspicion −1; the town remembers a devout monk.)',
        effect: { suspicion: -1 },
        outcome: {
          narrator: {
            text:
              'He says it plainly in the middle of a market and the market makes room for ' +
              'him, because that is what markets did. Nothing is gained that can be counted, ' +
              'and a story about him now exists in a town where he has no other reputation.',
            sources: [], status: 'invented',
          },
          monologue: { ...INV, text: 'I said it and a woman selling eels said the responses with me, which I did not expect, and which undid me rather.' },
        },
      },
      {
        id: 'defer', key: 'D',
        label: 'Find a doorway and say it quietly.',
        why: 'Kept, and unobserved. Nothing gained either way.',
        effect: {},
        outcome: {
          narrator: {
            text:
              'He steps out of the current and keeps the hour against a wall. The Rule is ' +
              'satisfied and nobody knows, which is precisely the outcome most monks in most ' +
              'centuries would have chosen.',
            sources: [], status: 'invented',
          },
          monologue: { ...INV, text: 'A doorway and the smell of fish, and the hour kept. God is not fastidious about doorways. I am, apparently.' },
        },
      },
      {
        id: 'skip', key: 'S',
        label: 'Let it go. The errand is not finished.',
        why: 'An hour missed on the road costs the same as one missed in choir. (Pressure +1.)',
        effect: { pressure: 1 },
        outcome: {
          narrator: {
            text:
              'He lets it pass, for a good reason, which is how most observance actually ' +
              'erodes — not by decision but by errand. The pressure of a thing undone is its ' +
              'own weather, and he will carry it back through the gate.',
            sources: [], status: 'invented',
          },
          monologue: { ...INV, text: 'I told myself I would say it doubled at Vespers. I have made that bargain before and I do not remember ever paying it.' },
        },
      },
    ],
  },

  'the-pardoner': {
    id: 'the-pardoner',
    register: 'underworld',
    tier: 'major',
    affordances: ['town'],
    once: true,
    requires: { minDays: 2 },
    rubric: '¶ Of a man selling what he does not own.',
    narrator: {
      text:
        'A pardoner is working the square with a relic and a sheaf of letters, and John — a ' +
        'priest, a canon lawyer, and a man who has thought harder than most about what makes ' +
        'a ritual legitimate — is standing in the crowd. The interesting thing is not that ' +
        'the pardoner may be a fraud. It is that the question he raises is the same one John ' +
        'is spending his life on: what makes an efficacious sign efficacious, and who is ' +
        'entitled to say so.',
      sources: [...BAILEY, ...PETERS], status: 'adapted',
    },
    monologue: {
      ...INV,
      text: 'He has a bone in a box and a letter with a seal I could pick apart in an afternoon. The crowd is not wrong to want what he is selling. That is the part I cannot get past.',
    },
    options: [
      {
        id: 'expose', key: 'E',
        label: 'Take the letter apart in front of the crowd.',
        why: 'You are the best-qualified man in this square. Needs learning. Leans Obedient. (Suspicion −1, disposition −1.)',
        requires: { faculty: { learning: 2 } },
        effect: { suspicion: -1, disposition: -1 },
        outcome: {
          narrator: {
            text:
              'He does it properly — seal, formula, the authority claimed and the authority ' +
              'that could actually grant it — and the crowd turns. It is a genuinely good ' +
              'act, and it is also a public demonstration that this monk knows exactly how ' +
              'documents of authorization work. People remember that about a man.',
            sources: PETERS, status: 'adapted',
          },
          monologue: { ...INV, text: 'I dismantled him in four sentences and enjoyed three of them. Afterwards a man asked me whether MY letters were in order, meaning it kindly, and I did not sleep on it well.' },
        },
      },
      {
        id: 'watch', key: 'W',
        label: 'Watch how he does it.',
        why: 'The mechanics of a persuasive sign, studied at no cost. (Worldliness +1.)',
        effect: {},
        outcome: {
          narrator: {
            text:
              'He watches a professional work a crowd with a sign, a story, and a warrant — ' +
              'and takes notes he would not admit to taking. Everything the pardoner does, ' +
              'the Liber florum also does; the difference John insists on is where the ' +
              'authority comes from, and he is watching a man who insists on the same thing.',
            sources: BAILEY, status: 'adapted',
          },
          monologue: { ...INV, text: 'He is very good. He knows to pause before the naming. God forgive me, I learned something.' },
        },
      },
      {
        id: 'buy', key: 'B',
        label: 'Buy a letter, and say nothing.',
        why: 'Cheap, and it makes you complicit in exactly the thing you argue you are not doing. Leans Radical. (+1 scandal risk.)',
        effect: { disposition: 1, risk: { scandal: 1 } },
        outcome: {
          narrator: {
            text:
              'He buys one. Whatever else it is, it is a purchase of unauthorised remission ' +
              'by a man who claims his own unauthorised practice is legitimate — and if he ' +
              'is ever asked to explain the difference, he will have to do it with this in ' +
              'his history.',
            sources: PETERS, status: 'adapted',
          },
          monologue: { ...INV, text: 'A penny for a paper. I do not believe in it and I have it in my scrip, and I have not worked out yet which of those facts is worse.' },
        },
      },
    ],
  },

  // ══ THE ROOMS — encounters that only happen where they happen ═════════
  'the-dying-armarius': {
    id: 'the-dying-armarius',
    register: 'cloister',
    tier: 'major',
    affordances: ['bodies'],
    once: true,
    requires: { minDays: 2 },
    rubric: '¶ Of a man who kept the books for forty years, and is going.',
    narrator: {
      text:
        'The old armarius is dying, and he knows what is on every shelf in the house, ' +
        'including the ones nobody reads from at table. Page\'s work is full of exactly this ' +
        'figure: the senior monk whose personal interests shaped a collection over decades, ' +
        'and whose knowledge of it dies with him unless somebody sits down and asks. Sitting ' +
        'with him is a work of mercy the Rule commands. Asking him is something else, and ' +
        'both are available in the same hour.',
      sources: [...PAGE, { work: 'RB 1980 (Rule of St Benedict)', locus: 'RB 36, the care of the sick (frame)' }],
      status: 'adapted', verify: true,
    },
    monologue: {
      ...INV,
      text: 'He taught me to rule a page. He is eighty and frightened and he keeps asking whether the psalter is put away properly, and I keep saying yes.',
    },
    options: [
      {
        id: 'sit', key: 'S',
        label: 'Sit with him, and let the shelves keep their secrets.',
        why: 'The work of mercy, and nothing else. (Fatigue +1, despair −1.)',
        effect: { fatigue: 1, despair: -1 },
        outcome: {
          narrator: {
            text:
              'He stays until it is over, or until the bell, and asks nothing. What he has ' +
              'done is what the Rule asked for and what the man needed, and the collection\'s ' +
              'history goes into the ground with its keeper.',
            sources: [], status: 'invented',
          },
          monologue: { ...INV, text: 'I held his hand and said the psalms and did not ask, and I will not pretend that cost me nothing, and I will also not pretend I regret it.' },
        },
      },
      {
        id: 'ask', key: 'A',
        label: 'Ask him what is behind the cupboard, while he can still say.',
        why: 'Forty years of the collection, or nothing, forever. Leans Radical. (+1 exposure risk, learning +1.)',
        effect: { disposition: 1, risk: { exposure: 1 } },
        outcome: {
          narrator: {
            text:
              'He asks, and the old man — lucid for a quarter of an hour — tells him: what ' +
              'came from where, which volumes were bound together to keep them quiet, what ' +
              'the house owns that the catalogue describes as something else. It is ' +
              'irreplaceable, and the infirmarian was in the room.',
            sources: PAGE, status: 'adapted', verify: true,
          },
          monologue: { ...INV, text: 'He told me everything and was glad to. He has wanted for years to tell somebody. I have written it down and I feel like a man who robbed a church very gently.' },
        },
      },
    ],
  },

  'the-seal': {
    id: 'the-seal',
    register: 'cloister',
    tier: 'major',
    affordances: ['seals'],
    once: true,
    rubric: '¶ Of a press that makes things official.',
    narrator: {
      text:
        'The sealing press is in the workshop because an abbey is a corporation and its ' +
        'documents need authenticating. It is also, in physical terms, a device for making a ' +
        'piece of wax say that the house stands behind whatever is written above it. John is ' +
        'the provost. He has legitimate access. Page found presses and metalworking in ' +
        'exactly such houses, and the point is not that they were used for magic — it is ' +
        'that the same equipment served the licit and the illicit without knowing the ' +
        'difference.',
      sources: PAGE, status: 'adapted', verify: true,
    },
    monologue: {
      ...INV,
      text: 'Wax, and a die, and my own office. Everything I might do with this in the next hour is something I am entitled to do, which is the trouble with entitlement.',
    },
    options: [
      {
        id: 'business', key: 'B',
        label: 'Seal the abbey\'s business, and put it away.',
        why: 'The office done properly. (Suspicion −1.)',
        effect: { suspicion: -1 },
        outcome: {
          narrator: {
            text:
              'Rents, a receipt, a letter to a tenant. He does the provost\'s work and the ' +
              'house is fractionally better run for it, and being visibly good at the office ' +
              'is the cheapest protection he has.',
            sources: [], status: 'invented',
          },
          monologue: { ...INV, text: 'Four documents and the press away in its box. A man who does his office well is a man nobody looks at twice.' },
        },
      },
      {
        id: 'figure', key: 'F',
        label: 'Cast a figure in lead, and seal it.',
        why: 'A drawing becomes an object that exists in the world. Leans Radical. (+1 exposure risk, address rises.)',
        effect: { disposition: 1, risk: { exposure: 1 } },
        outcome: {
          narrator: {
            text:
              'The figure stops being a page and becomes a thing: cast, impressed, portable, ' +
              'findable. This is where image magic and devotional practice become physically ' +
              'indistinguishable — the object does not carry its own intention, and a man ' +
              'holding it up in a room in Paris will supply one.',
            sources: [...PAGE, ...KLAASSEN], status: 'adapted', verify: true,
          },
          monologue: { ...INV, text: 'It has a weight. I did not expect the weight to change the argument and it changes the whole argument.' },
        },
      },
    ],
  },

  'the-garden-hour': {
    id: 'the-garden-hour',
    register: 'cloister',
    tier: 'minor',
    affordances: ['quiet'],
    once: true,
    rubric: '¶ Of an hour in the beds, and a brother who wants to talk.',
    narrator: {
      text:
        'Another monk is working the same row and evidently wants conversation. Communities ' +
        'run on this — the unstructured hour where things get said that would never be said ' +
        'in chapter — and it is also where a man learns what the house actually thinks of ' +
        'him, which no formal proceeding will ever tell him.',
      sources: [{ work: 'RB 1980 (Rule of St Benedict)', locus: 'RB 48, the ordering of labour (frame)' }],
      status: 'adapted',
    },
    monologue: {
      ...INV,
      text: 'Brother Aymon, and half a row of beans, and the particular silence of a man working up to something.',
    },
    options: [
      {
        id: 'listen', key: 'L',
        label: 'Let him talk, and listen properly.',
        why: 'You will learn what the house says about you. (Worldliness +1, despair −1.)',
        effect: { despair: -1 },
        outcome: {
          narrator: {
            text:
              'He listens, and gets more than he gave: the ordinary gossip of a closed house, ' +
              'including a sentence about himself that he was not meant to hear and cannot ' +
              'now unhear. This is how anyone in such a place learns their own standing.',
            sources: [], status: 'invented',
          },
          monologue: { ...INV, text: 'He talked for an hour and said one thing about me near the end, sideways, and kindly, and it has been going round in me since.' },
        },
      },
      {
        id: 'work', key: 'W',
        label: 'Work in silence, as the hour intends.',
        why: 'The Rule\'s own preference. Restores what the day has spent. (Fatigue −2.)',
        effect: { fatigue: -2 },
        outcome: {
          narrator: {
            text:
              'They work the row without speaking, which is what the hour was for, and John ' +
              'comes back to the Office with something restored that neither the Rule nor the ' +
              'Work has any way of giving him.',
            sources: [], status: 'invented',
          },
          monologue: { ...INV, text: 'Beans, and no words. I came back able to think again and I am not going to write down why that is remarkable.' },
        },
      },
    ],
  },
};
