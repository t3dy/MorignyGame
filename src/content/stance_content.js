/**
 * MORIGNY — stance-system writing (v4, docs/V4_LOOP_REDESIGN.md §1–2).
 * The stance choice's deliberation (narrator + monologue), the option
 * labels (rubricator register, stakes legible per CLAUDE.md rule 10),
 * and the outcome passages for every kind × stance × grade — the
 * narrator now unbound (D-19 reversed D-16's cap): it explains the
 * monastic context and the stakes at length; John answers in his own
 * idiom beneath it.
 *
 * Every record carries the envelope. The narrator's claims about
 * custodia oculorum, the guard of the senses, and attention as
 * monastic labor are adapted framing (Carruthers on trained attention;
 * the Rule's own liturgical discipline); John's interior lines are
 * invented and say so.
 */

const CARRUTHERS = [{ work: 'Carruthers, The Book of Memory', locus: 'trained attention / memoria as craft (frame)' }];
const RB = [{ work: 'RB 1980 (Rule of St Benedict)', locus: 'RB 19–20, discipline of psalmody (frame)' }];
const FANGER = [{ work: 'Fanger, Rewriting Magic', locus: 'scrupulosity and attention (frame; loci on Research Queue)' }];
const INV = { sources: [], status: 'invented' };

// ── The stance choice (one input; the whole block follows from it) ──────

export const STANCE_CHOICE = {
  office: {
    rubric: '¶ In what manner shall the hour be kept?',
    narrator: {
      text:
        'What he decides now is not whether to be present — the Rule has already decided ' +
        'that — but how much of himself to spend on being present. Monastic writers had a ' +
        'technical vocabulary for this: custodia oculorum, the guard of the eyes, attention ' +
        'held against the pull of everything that is not the psalm. It was understood to be ' +
        'work, as real as carrying stone, and like any labor it could be done well, done ' +
        'adequately, or scamped. The choice is a real one because the will he spends here ' +
        'is the same will the night will ask for later.',
      sources: [...CARRUTHERS, ...RB], status: 'adapted',
    },
    monologue: {
      ...INV,
      text:
        'Here is the hour again, asking what I will give it. Guard every gate and be poorer ' +
        'for it by nightfall; keep the common discipline and let the small birds in; or let ' +
        'the mouth run by rote and keep my strength — for what, John? Keep it for what?',
    },
  },
  copy: {
    rubric: '¶ In what manner shall the leaf be taken?',
    narrator: {
      text:
        'A scribe chose his pace the way a mason chose his stroke, and the choice was ' +
        'understood by everyone in the room. The formal book-hand meant slowness and ' +
        'scrutiny — a copyist construing sense as he went could catch an exemplar\'s fault ' +
        'before it bred. A quicker cursive traded some of that scrutiny for time. And a ' +
        'tired or hurried man could simply trust the exemplar and let his hand run — which ' +
        'is, the textual scholars will tell you seven centuries later, exactly how most ' +
        'corruption enters a tradition: not by malice but by haste. The stance he takes ' +
        'toward this leaf is the stance his copy will take toward the truth.',
      sources: [{ work: 'SCRIPTORIUM.md working notes (Fanger–Watson edition apparatus, frame)', locus: 'hands, error, transmission' }],
      status: 'adapted',
    },
    monologue: {
      ...INV,
      text:
        'The leaf is patient; it will receive whatever I am. A careful hand and the day is ' +
        'gone into it. A quick hand and God knows what rides along. The appetite votes for ' +
        'haste. It always votes for haste.',
    },
  },
};

/**
 * Option labels: rubricator register, the lean and the price in the
 * label itself (rule 10). The live resolve pool is quoted by the
 * game-state voice beside these, not hand-authored into them.
 */
export const STANCE_OPTIONS = {
  vigilant: {
    label: 'Vigilant: guard every gate.',
    why: 'The margin is refused at each pull — 1 resolve per refusal (2 when scrupulous), while resolve lasts.',
  },
  routine: {
    label: 'The common discipline.',
    why: 'The appetite is fought at the same price; the lesser wanderings are let in, and cost only what they cost.',
  },
  hasty: {
    label: 'By rote, sparing yourself.',
    why: 'No resolve spent; every pull gets its hearing, and the hour bears the marks.',
  },
};
export const STANCE_OPTIONS_ENVELOPE = { sources: [...RB], status: 'adapted' };

// ── Outcomes: kind × stance × grade, narrator + monologue ───────────────

export const STANCE_OUTCOME = {
  office: {
    vigilant: {
      recollected: {
        narrator: {
          text:
            'He held it. The whole hour, every verse under guard, and nothing got past him ' +
            '— what the tradition calls a recollected office, the mind gathered into the ' +
            'words rather than scattered behind them. It is worth saying plainly what this ' +
            'costs: vigilance is not a mood but an expenditure, and a monk who prays like ' +
            'this every hour of every day does not exist, because he cannot.',
          sources: [...CARRUTHERS], status: 'adapted',
        },
        monologue: {
          ...INV,
          text: 'I set a watch at every gate and the watch held. The words were mine the whole way through. It is a clean feeling, and it is bought.',
        },
      },
      distracted: {
        narrator: {
          text:
            'He meant to guard the whole hour and mostly did. But vigilance runs on a ' +
            'finite store, and somewhere in the psalmody the store ran short — the guard ' +
            'stood down and the margin got its hearing after all. The hour still counts; ' +
            'the Rule asks for presence, not perfection. What lingers is the ledger: he ' +
            'spent himself early and still did not buy the whole hour.',
          sources: [...RB], status: 'adapted',
        },
        monologue: {
          ...INV,
          text: 'The watch held while the coin held. Then the gate stood open and I stood watching it stand open. Half a guarded hour — is that vigilance, or its epitaph?',
        },
      },
      scattered: {
        narrator: {
          text:
            'The stance failed. He came to the hour meaning to hold it and had nothing left ' +
            'to hold it with — an exhausted will makes vigilance a posture, not a practice, ' +
            'and the hour ran through his fingers verse by verse. The confessional writers ' +
            'know this figure well: the man most anxious to pray perfectly is often the one ' +
            'least able to pray at all. Someone in choir will have noticed the absence ' +
            'behind his moving mouth.',
          sources: [...FANGER], status: 'adapted',
        },
        monologue: {
          ...INV,
          text: 'I meant to keep it entire, and kept nothing. The wanting-to was the whole of my strength, and wanting is not a wall.',
        },
      },
    },
    routine: {
      recollected: {
        narrator: {
          text:
            'The ordinary discipline was enough. He kept the hour the way the house keeps ' +
            'it — attention settled into the groove worn by thousands of repetitions — and ' +
            'today the groove held; nothing pressed hard enough to test it. This is what ' +
            'most monastic prayer actually was: not ecstasy and not siege, but a craft ' +
            'practiced at a sustainable pace. The record only mentions the other kind of ' +
            'hour because nobody chronicles a quiet one.',
          sources: [...RB], status: 'adapted',
        },
        monologue: {
          ...INV,
          text: 'The common way, and it sufficed. The psalms carried me as much as I carried them. A day of such hours would be a good life, and no one would write it down.',
        },
      },
      distracted: {
        narrator: {
          text:
            'He fought where the discipline says to fight and yielded where it permits ' +
            'yielding. The flesh, when it pressed, was answered; the lesser wanderings — a ' +
            'noise, a memory, an itch of thought — were let through, and each one took a ' +
            'verse with it. This is the honest middle of monastic practice, and its price ' +
            'is honest too: an hour part-present, part-elsewhere, adding up in a way only ' +
            'the reckoning will total.',
          sources: [...RB], status: 'adapted',
        },
        monologue: {
          ...INV,
          text: 'I held the one gate that matters and left the small doors on the latch. Small birds came in at them. They always do; the question is only what they carry off.',
        },
      },
      scattered: {
        narrator: {
          text:
            'The ordinary discipline met an extraordinary hour and lost. The pulls came ' +
            'too many and too hard for a settled routine to answer, and by the end the ' +
            'office was a scaffold of words around an absence. The Rule\'s own writers ' +
            'were unsurprised by such hours — their remedy was always the same, begin ' +
            'again tomorrow — but a monk seen praying like this is a monk the house begins ' +
            'to watch.',
          sources: [...RB], status: 'adapted',
        },
        monologue: {
          ...INV,
          text: 'The groove I trusted was a channel for the flood. Every verse arrived and found me gone. Tomorrow, the same bell; Lord, let it find more of me.',
        },
      },
    },
    hasty: {
      recollected: {
        narrator: {
          text:
            'He raced it, and got away with it. The verses ran by rote and nothing rose up ' +
            'to interrupt them — so the hour stands, technically clean, a recollected grade ' +
            'earned by a mouth on autopilot. The moralists would have a word for prayer ' +
            'like this, and the word is not a compliment; but the ledger records what held, ' +
            'not what it weighed, and today the gamble held.',
          sources: [...RB], status: 'adapted',
        },
        monologue: {
          ...INV,
          text: 'Said quick and said whole, and no one the wiser, myself included. What I saved I will spend elsewhere. That is the arithmetic, and I notice I keep the books now like a merchant.',
        },
      },
      distracted: {
        narrator: {
          text:
            'Rote is a door left unbarred. He spent nothing on the hour and the hour ' +
            'collected anyway — the margin came and went as it pleased, each visitation ' +
            'landing its small weight of pressure or gloom, and the psalmody closed ' +
            'part-said, part-abandoned. He kept his strength. Everything else about the ' +
            'hour, he lent to whatever wanted it.',
          sources: [...RB], status: 'adapted',
        },
        monologue: {
          ...INV,
          text: 'I gave the hour my voice and kept my will in my purse. The purse is full and the hour is picked over. A fair trade, I tell myself, in the voice of a man who suspects it was not.',
        },
      },
      scattered: {
        narrator: {
          text:
            'The unguarded hour was ransacked. Every pull found the door open; the office ' +
            'dissolved into its interruptions until the words were a rumor under the noise. ' +
            'He saved his resolve entire — that was the plan and it worked — and stood up ' +
            'from a prayer that never happened, in full view of a community that counts ' +
            'attendance with its eyes.',
          sources: [...RB], status: 'adapted',
        },
        monologue: {
          ...INV,
          text: 'What did I spare myself for? The hoarded coin sits whole in a robbed house. If the Work asks tonight what I gave the day, I have my answer ready, and it shames me.',
        },
      },
    },
  },
  copy: {
    vigilant: {
      recollected: {
        narrator: {
          text:
            'A day\'s work in the formal hand, and the formal hand earned its slowness: ' +
            'construing as he copied, he read the exemplar the way an editor reads, and ' +
            'what tried to pass from its page into his was inspected at the border. This is ' +
            'the copying the colophons boast of — labor offered up whole — and it produces ' +
            'the kind of witness textual scholars centuries later will quietly bless ' +
            'without knowing whom to thank.',
          sources: [{ work: 'SCRIPTORIUM.md working notes', locus: 'colophon tradition; hands and error (frame)' }],
          status: 'adapted',
        },
        monologue: {
          ...INV,
          text: 'Letter by letter, sense by sense, the leaf and I kept faith with each other. My shoulders know the price of it. Scribere est orare — today I believe it.',
        },
      },
      distracted: {
        narrator: {
          text:
            'The careful hand did careful work until the guard ran short, and then the ' +
            'margin bought its interruptions at the usual rate. A vigilant copyist ' +
            'interrupted is a particular kind of danger to his own page: the hand that ' +
            'resumes after a pull is unsteadier than the hand that never stopped, and ' +
            'whatever entered the copy in those unsteady stretches did not announce itself. ' +
            'The leaf looks finished. Leaves always do.',
          sources: [{ work: 'SCRIPTORIUM.md working notes', locus: 'silent error; the unverifiable first copy (frame)' }],
          status: 'adapted',
        },
        monologue: {
          ...INV,
          text: 'I watched the text like a shepherd and still the day got its teeth in. What slipped past me in those moments I cannot say — which is the exact shape of the fear.',
        },
      },
      scattered: {
        narrator: {
          text:
            'Care without the means to sustain it. He worked in the exacting hand while ' +
            'his attention was dragged elsewhere over and over, and the combination is ' +
            'crueler than honest haste: slow AND besieged, the worst bargain the desk ' +
            'offers. The quire that results carries a day of labor and no confidence at ' +
            'all, and the fatigue he banked into it will be waiting for him at Vespers.',
          sources: [{ work: 'SCRIPTORIUM.md working notes', locus: 'error under fatigue (frame)' }],
          status: 'adapted',
        },
        monologue: {
          ...INV,
          text: 'The careful hand, and nothing left to be careful with. I gave the leaf my slowness and the margin took my mind. Between them they have divided me fairly.',
        },
      },
    },
    routine: {
      recollected: {
        narrator: {
          text:
            'The working cursive, the working pace, and a day that let him keep both. The ' +
            'quick hand construes less than the formal one — some of the exemplar passed ' +
            'through him unread — but nothing pressed hard, the line count climbed, and the ' +
            'quire closed clean by every test a scribe can apply at his own desk. Which is, ' +
            'it bears repeating, not every test there is.',
          sources: [{ work: 'SCRIPTORIUM.md working notes', locus: 'hands; the unverifiable first copy (frame)' }],
          status: 'adapted',
        },
        monologue: {
          ...INV,
          text: 'An honest day at the honest pace. The leaf filled the way a field fills, row on row. I will not swear to every letter; I will swear to the day.',
        },
      },
      distracted: {
        narrator: {
          text:
            'A workmanlike day, interrupted the workmanlike amount. He fought off what ' +
            'most needed fighting and paid out verses of attention for the rest, and the ' +
            'cursive hand kept moving through all of it — which is its virtue and its ' +
            'risk, since a hand that keeps moving keeps recording, and it records the ' +
            'wobble along with the words.',
          sources: [{ work: 'SCRIPTORIUM.md working notes', locus: 'error under distraction (frame)' }],
          status: 'adapted',
        },
        monologue: {
          ...INV,
          text: 'The pen went on while I came and went. Somewhere in the going the leaf and I were strangers for a line or two. We are reconciled now, and it keeps our secrets.',
        },
      },
      scattered: {
        narrator: {
          text:
            'The ordinary pace in an extraordinary siege. Too much got through; the copy ' +
            'grew in fits between interruptions, and a quire made in fits is a quire whose ' +
            'faults are distributed like buried stones — invisible, load-bearing, and ' +
            'discovered by whoever builds on it next. In a tradition where every copy is ' +
            'someone\'s exemplar tomorrow, a day like this has descendants.',
          sources: [{ work: 'SCRIPTORIUM.md working notes', locus: 'transmission of error (frame)' }],
          status: 'adapted',
        },
        monologue: {
          ...INV,
          text: 'The day was a road with more bandits than milestones. What I carried through them I carried badly. God grant the next hands are kinder to it than mine were.',
        },
      },
    },
    hasty: {
      recollected: {
        narrator: {
          text:
            'He trusted the exemplar and ran, and the road was clear. Trusting is the ' +
            'fastest stance there is because it construes nothing: whatever the exemplar ' +
            'says, the copy says, fault and truth alike at full gallop. Today the gallop ' +
            'met no interruptions and the grade stands clean — with the one caveat the ' +
            'stance itself writes into every leaf it touches: he has no idea what he just ' +
            'copied. Neither, yet, does anyone.',
          sources: [{ work: 'SCRIPTORIUM.md working notes', locus: 'trusting the exemplar; inherited faults (frame)' }],
          status: 'adapted',
        },
        monologue: {
          ...INV,
          text: 'The hand flew and the day is bought back for other uses. If the exemplar lied to me, I have sworn to its lie in a fair copy. Speed is a kind of faith. I am not sure in what.',
        },
      },
      distracted: {
        narrator: {
          text:
            'Haste plus interruption: the pen ran unconstruing and the margin came and ' +
            'went unopposed, and each visitation doubled the error-chance of the unit it ' +
            'landed on. The quire is done — haste always finishes — and what it contains ' +
            'is a question with a long fuse. He saved his will and spent his witness.',
          sources: [{ work: 'SCRIPTORIUM.md working notes', locus: 'error under distraction and haste (frame)' }],
          status: 'adapted',
        },
        monologue: {
          ...INV,
          text: 'Quick work, and company the whole way — none of it invited, none of it refused. The leaf is full. Of what, exactly, the leaf declines to say.',
        },
      },
      scattered: {
        narrator: {
          text:
            'The worst hour the desk can produce: full speed, no guard, constant siege. ' +
            'The copy that survives it is a fair-looking artifact with an unknowable ' +
            'interior — errors bred at haste\'s base rate, doubled under each distraction, ' +
            'inherited faults waved through unread. If this quire ever becomes an ' +
            'exemplar, its children will inherit a fortune of flaws; and the day\'s only ' +
            'mercy is that none of this is visible tonight.',
          sources: [{ work: 'SCRIPTORIUM.md working notes', locus: 'transmission of error (frame)' }],
          status: 'adapted',
        },
        monologue: {
          ...INV,
          text: 'I fled through the leaf with the margin at my heels, and what I dropped in the running is scattered where I cannot find it. The copy smiles like a finished thing. It is not lying, exactly. It is waiting.',
        },
      },
    },
  },
};

// ── Lectio: the study hour (v4 §5) ──────────────────────────────────────

export const STUDY_SCENE = {
  rubric: '¶ Of the hour given to the book.',
  narrator: {
    text:
      'The Rule reserves hours for lectio divina — reading as a discipline, not a leisure — ' +
      'and the same hours are where every other kind of learning a monk possesses actually ' +
      'came from: the Latin that will one day answer an examiner, the discernment ' +
      'literature that trains an eye for spirits, the exemplars studied until the hand ' +
      'knows letterforms the way feet know stairs. An hour spent here is an hour the desk ' +
      'and the Work both wanted. That is the whole economics of a monastic education: ' +
      'everything is bought out of the same daylight.',
    sources: [{ work: 'RB 1980 (Rule of St Benedict)', locus: 'RB 48, lectio divina (frame)' }],
    status: 'adapted',
  },
  monologue: {
    sources: [], status: 'invented',
    text:
      'An hour with the book, and nothing to show for it tonight but what I carry away ' +
      'inside. Slow money. But it is the only coin that no inventory can find and no fire ' +
      'can burn.',
  },
};

/** Per-faculty study beats: what an hour's reading felt like. */
export const STUDY_TEXT = {
  learning: {
    sources: [], status: 'invented',
    text: 'The commentary again, and the grammar under it. Each argument I can follow to its end is a step some future questioner will not be able to push me down.',
  },
  discretio: {
    sources: [{ work: 'Newman, Speculum 80 (2005)', locus: 'discernment literature as training (frame)' }],
    status: 'adapted',
    text: 'The treatises on the discerning of spirits, read slowly: the tells, the counterfeits, the honest ambiguities. The eye is a student like any other.',
  },
  craft: {
    sources: [], status: 'invented',
    text: 'An hour over a master\'s leaf, the knife and the rule beside me — not copying, studying: how the minims keep their feet, where the eye rests, why his line never wanders. My hand is quieter already.',
  },
  worldliness: {
    sources: [], status: 'invented',
    text: 'The talk of the guest-house and the accounts of the cellarer: how the world prices things, and what it thinks a monk is for. Knowledge the cloister pretends not to need, until the day it needs it.',
  },
};

export const STUDY_LEVELED = {
  sources: [], status: 'invented',
  text: 'Something settled today that will not unsettle: the thing I have been circling is mine now.',
};

// ── Composed siege clauses (the narrator totals the margin's day) ───────
// Template functions composing from the outcome record's real facts —
// same precedent as transmissionEndingText. Envelope on the group.

export const SIEGE_ENVELOPE = { sources: [], status: 'invented' };

export const SIEGE_TEXT = {
  quiet: () => 'The margin, for once, kept to itself.',
  heldAll: n =>
    `${n === 1 ? 'Once' : n === 2 ? 'Twice' : `${n} times`} the margin pulled at him, and ` +
    `${n === 1 ? 'once' : 'each time'} he paid the toll and refused it.`,
  brokeAt: ordinal =>
    `His guard held to the ${['first', 'second', 'third', 'fourth', 'fifth', 'sixth'][ordinal - 1] ?? `${ordinal}th`} pull, and there it broke.`,
  appetiteAttended: n =>
    n === 1
      ? 'The appetite got its hearing once, and left its weight behind.'
      : `The appetite got its hearing ${n} times, and left its weight each time.`,
  wanderings: n =>
    n === 1
      ? 'One lesser wandering came and went, a verse the poorer.'
      : `${n} lesser wanderings came and went, each a verse the poorer.`,
};
