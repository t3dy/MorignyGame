/**
 * MORIGNY — writing for the Liber florum: the composition act, the
 * incipits, the glosses, and the Barking Dogs (NEWDIRECTIONS.md §4, §8, §9).
 *
 * Pipeline note (CLAUDE.md rule 11): the shape of what follows comes
 * through the digests in docs/research/, so the historical claims cite
 * the works those digests summarise and carry `verify: true`. John's
 * own words are invented, always, and marked so.
 */

const FANGER = [{ work: 'Fanger, Rewriting Magic', locus: 'vision becomes prayer; the book as a record of its own knowledge process (frame; verify)' }];
const DREAMWORK = [{ work: 'Fanger, "Divine Dreamwork" (2018)', locus: 'the interpretation half of the practice — reflecting on what was seen (frame; verify)' }];
const INV = { sources: [], status: 'invented' };

// ── The composition act ────────────────────────────────────────────────

export const COMPOSE_SCENE = {
  rubric: '¶ Of the writing down, which is the other half of the seeing.',
  narrator: {
    text:
      'Here is the part of John\'s practice that is easiest to overlook and hardest to ' +
      'overstate. The vision is not the work; it is the raw material. What he does next — ' +
      'sitting down while it is still legible to him and turning it into a prayer another ' +
      'person could perform — is the actual technology. Fanger is emphatic that soliciting ' +
      'the dream was only half the story; the other half was the continuing practice of ' +
      'reflecting on and interpreting what had been seen. A vision becomes a prayer, the ' +
      'prayer becomes a visualization, the visualization becomes a procedure, and the ' +
      'procedure produces the next vision. The book grows by eating his own experience, ' +
      'and every prayer in it changes what he is able to receive afterwards.',
    sources: [...FANGER, ...DREAMWORK], status: 'adapted', verify: true,
  },
  monologue: {
    ...INV,
    text:
      'Write it now, while the shape of it is still on me. In a week I will have only the ' +
      'words about it, which are not it. This is the discipline nobody warned me of: not ' +
      'the fasting, not the waiting — the sitting down afterward with a cold hand.',
  },
};

/** The choice to write, or not. Stakes legible per rule 10. */
export const COMPOSE_OPTIONS = {
  compose: {
    label: 'Write it into the book, in the form of a prayer.',
    why: 'The book gains a prayer, and the prayer disposes you for what comes next. Costs the evening. (Fatigue +1.)',
  },
  withhold: {
    label: 'Leave it unwritten. Not everything seen is to be published.',
    why: 'Nothing added, nothing risked. What you saw stays yours, and dies with your memory of it.',
  },
};

/**
 * How the prayer is to be framed (docs/LOOP_SYNTHESIS.md §2–3). This is
 * the spine touching play: the same vision can be written up as a
 * meditation on a figure, as a petition to a named intelligence, or as
 * an instrument that binds one — and the operator does not always end
 * up where he aimed.
 */
export const COMPOSE_ADDRESS = {
  rubric: '¶ In what manner shall it be written?',
  narrator: {
    text:
      'The question underneath every operation in this world is not whether it is holy but ' +
      'whom it addresses — and the rungs are close together. A figure contemplated is not a ' +
      'name invoked; a name invoked is not a spirit bound. What John has to decide, tonight ' +
      'and every night, is which of those he is writing down. He will not always be right ' +
      'about the answer. That is not a flaw in his method; it is the actual condition of the ' +
      'work, and the reason his critics and his defenders could look at the same page and ' +
      'see different things.',
    sources: [{ work: 'Fanger (ed.), Invoking Angels', locus: 'adjuration against conjuration; the tacit pact (frame; verify)' }],
    status: 'adapted', verify: true,
  },
  monologue: {
    sources: [], status: 'invented',
    text: 'Set it down as contemplation and it is safe and it is slow. Set it down as a petition and something may answer. Set it down as a binding and something will.',
  },
};

/** Address options offered at composition, by rung. */
export const ADDRESS_OPTIONS = {
  symbolic: {
    key: 'C',
    label: 'As a figure to be contemplated.',
    why: 'Nobody is addressed. Slow, safe, and the least likely to be answered. (Address: symbolic.)',
  },
  ambiguous: {
    key: 'P',
    label: 'As a petition, in the names the art gives.',
    why: 'You use the names because the art gives them; whom they name, the art does not say. Where John actually worked. (Address: ambiguous.)',
  },
  invocation: {
    key: 'I',
    label: 'As a calling, knowing what you call.',
    why: 'No confusion and no cover. Leans Radical, and the house notices what it cannot explain. (Address: invocation.)',
  },
  command: {
    key: 'B',
    label: 'As a binding, that it may not refuse.',
    why: 'Efficacy moves into your own hands, which is the whole of the transgression. Leans Radical, hard. (Address: command.)',
  },
};

/** How the prayer is presented — the frame that conceals or exposes it. */
export const LEGITIMATION_OPTIONS = {
  liturgy: { key: '1', label: 'Frame it in the liturgy.' },
  devotion: { key: '2', label: 'Frame it as private devotion.' },
  philosophy: { key: '3', label: 'Frame it as natural philosophy.' },
  revelation: { key: '4', label: 'Frame it on her authority alone.' },
  none: { key: '5', label: 'Frame it as nothing but itself.' },
};

export const ADDRESS_ENVELOPE = {
  sources: [{ work: 'Fanger (ed.), Invoking Angels', locus: 'the ladder of address; legitimation and concealment (frame; verify)' }],
  status: 'adapted', verify: true,
};

/** What he notices afterwards, when the operation slipped past him. */
export const SLIPPED = {
  caught: {
    sources: [], status: 'invented',
    text:
      'And he catches it, which is the whole use of a trained eye: he meant to set down a ' +
      'figure and finds he has written a petition. The names did more than name. He knows ' +
      'because he has learned to know, and knowing is the only defence there is.',
  },
  unnoticed: {
    sources: [], status: 'invented',
    text:
      'He sets down what he meant to set down, and is satisfied with it, and closes the book.',
  },
};
export const COMPOSE_OPTIONS_ENVELOPE = { sources: FANGER, status: 'adapted', verify: true };

/**
 * Incipits, keyed by the discernment outcome the prayer was born from.
 * A composed prayer takes its opening from what John believed he saw —
 * which is why an accepted counterfeit produces a perfectly beautiful
 * prayer with a lie inside it.
 */
export const INCIPITS = {
  licentia: [
    'Ave, salve — hail and be whole, who is patient with slow students',
    'O Rex regum — king of kings, prince of princes, born of a virgin',
    'Illuminatrix — she who lights the lamp before the reader comes',
  ],
  corrupted: [
    'Lux vera — the true light, which I named rightly and read wrongly',
    'O speculum — mirror, in which I saw a face and called it yours',
    'Vox clara — the clear voice, and I did not ask whose',
  ],
  delayed: [
    'De profundis rogo — out of the depths I ask again, having refused once',
    'Miserere tarditatis — pity my slowness, who mistrusted a true thing',
  ],
  mastery: [
    'Contra fallacem — against the counterfeit, which cannot abide examination',
    'Scutum noctis — shield of the night, in which the naming broke it',
  ],
};
export const INCIPITS_ENVELOPE = {
  sources: [{ work: 'Fanger, Rewriting Magic', locus: 'Ave salve and O Rex regum as prayers composed from Visions 8 and 9 (frame; the incipits here are ours, not John\'s text)' }],
  status: 'adapted',
  verify: true,
};

/** Outcome writing per judgement — what it feels like to have written it. */
export const COMPOSE_OUTCOME = {
  licentia: {
    narrator: {
      text:
        'He writes it while it is warm, and what goes onto the page is not a report of a ' +
        'vision but an instruction for producing one: enter the church, see her, be ' +
        'embraced, attend. This is exactly the move that makes the Liber florum what it is ' +
        '— John\'s private experience converted into a reproducible devotional procedure ' +
        'that a stranger could perform in a hundred years and in another country. Which, ' +
        'as it happens, is what strangers did.',
      sources: FANGER, status: 'adapted', verify: true,
    },
    monologue: {
      ...INV,
      text: 'Not "I saw." Let it say: you will see. It was never only mine — that is the point of writing it in the second person, and it took me four years to understand that.',
    },
  },
  corrupted: {
    narrator: {
      text:
        'He writes it up carefully, in good faith, and the prayer is beautiful. Nothing on ' +
        'the page announces the problem. The silent-failure logic that governs a mis-drawn ' +
        'figure governs this too, and with worse reach: a defective figure spoils one copy, ' +
        'while a defective prayer is performed, and performed again, and shapes every ' +
        'vision that comes after it.',
      sources: FANGER, status: 'adapted', verify: true,
    },
    monologue: {
      ...INV,
      text: 'A good night\'s work. I have set it down cleanly and I am pleased with the cadence of it. (There is nothing here to warn him. That is the whole cruelty of the thing.)',
    },
  },
  delayed: {
    narrator: {
      text:
        'He writes down the refusal, which takes a particular kind of nerve: the record of ' +
        'a true thing declined. John\'s book is full of this sort of entry, and it is one ' +
        'of the reasons the scholarship trusts it as far as it does. A man building a case ' +
        'for himself does not archive his own bad calls this carefully.',
      sources: FANGER, status: 'adapted', verify: true,
    },
    monologue: {
      ...INV,
      text: 'Let it stand against me: on this night I was offered something and would not have it. If the book is to be any use it must contain my refusals too.',
    },
  },
  mastery: {
    narrator: {
      text:
        'The prayer he writes is a defensive one — the shape of the counterfeit, recorded ' +
        'so it can be recognised again. This is discernment becoming transmissible: not ' +
        '"I was not deceived," but "here is how the deception was built, and here is the ' +
        'test that broke it."',
      sources: FANGER, status: 'adapted', verify: true,
    },
    monologue: {
      ...INV,
      text: 'Write down its face. Write down how it spoke. The next man will not have my night to learn from unless I give it to him.',
    },
  },
};

// ── Glossing: the error preserved ──────────────────────────────────────

export const GLOSS_SCENE = {
  rubric: '¶ Of a fault found in his own book, and what he did about it.',
  narrator: {
    text:
      'Something later has shown him that an earlier prayer is defective — and here John ' +
      'does the thing that makes his book so unusual as an object. He does not erase it. ' +
      'He leaves the mistaken material visible and writes a corrective gloss beside it, so ' +
      'that later operators will see both the error and its correction. In his own account ' +
      'the flowers and leaves drawn around such passages are the sign of the chastisement ' +
      'of his error. The book keeps his mistakes on purpose: they are part of its sacred ' +
      'history, and part of what it teaches.',
    sources: FANGER, status: 'adapted', verify: true,
  },
  monologue: {
    ...INV,
    text:
      'Scrape it out and no one will know. — And no one will learn, either. Leave it. ' +
      'Write beside it what I know now, and let whoever comes after see a man corrected ' +
      'rather than a man who was never wrong.',
  },
};

export const GLOSS_OPTIONS = {
  gloss: {
    label: 'Leave the error, and write the correction beside it.',
    why: 'The prayer stops harming your practice; the mistake stays in the book, visible, forever.',
  },
  scrape: {
    label: 'Scrape the leaf and write it clean.',
    why: 'Tidier, and the book forgets. Leans Radical: a book that hides its corrections is making a different claim about itself. (Disposition +1.)',
  },
};
export const GLOSS_OPTIONS_ENVELOPE = { sources: FANGER, status: 'adapted', verify: true };

export const GLOSS_OUTCOME = {
  gloss: {
    narrator: {
      text:
        'The correction goes in beside the fault, and the page becomes a small argument ' +
        'about how knowledge is supposed to work: not handed down finished, but arrived at, ' +
        'with the wrong turnings left legible so the road can be checked.',
      sources: FANGER, status: 'adapted', verify: true,
    },
    monologue: { ...INV, text: 'There. It is uglier and it is honest, and I have made my peace with that trade more times than I can count.' },
  },
  scrape: {
    narrator: {
      text:
        'The leaf comes clean and the book is tidier and something has quietly been lost — ' +
        'the record of a man being corrected. It is worth noticing that this is the more ' +
        'confident act, not the more humble one: a book that shows no corrections is ' +
        'claiming never to have needed any.',
      sources: FANGER, status: 'adapted', verify: true,
    },
    monologue: { ...INV, text: 'Let it be clean. They will judge the book, not my working. — And if the book is only my working, tidied? I will think about that another night.' },
  },
};

// ── The interval: what the record does not remember ────────────────────

export const INTERVAL_ENVELOPE = {
  sources: [{ work: 'Fanger, Rewriting Magic', locus: 'the Book of Visions as retrospectively constructed and selective (frame; verify)' }],
  status: 'adapted', verify: true,
};

/**
 * The narrator on the stretch of ordinary life between two remembered
 * days. Composed from the real interval, so a fortnight and a lost year
 * read differently — and the apparatus can be honest that the gap is
 * the shape of John's own selective record, not a loading screen.
 */
export const INTERVAL_TEXT = {
  short: n =>
    `${n} weeks pass in the ordinary way — offices, meals, the same forty faces — and ` +
    'leave nothing behind that anyone thought worth writing down.',
  season: n =>
    `A season turns. ${n} weeks of the Office kept and the desk attended, none of which ` +
    'John records, because a life is mostly the part nobody records.',
  long: n =>
    `The better part of a year goes by — ${n} weeks of it — and the book gains nothing, ` +
    'and neither does the record. What survives of a man is not evenly spaced.',
};

export const BEAT_ARRIVALS = {
  provost: {
    narrator: {
      text:
        'The house makes him provost. It is a real office with real teeth — rents, tithes, ' +
        'the practical administration of the abbey\'s property — and it means the community ' +
        'has decided he is trustworthy with money, which is a harder trust than most. Two ' +
        'things follow. He is now protected in a way an ordinary choir monk is not, and he ' +
        'is now visible in a way an ordinary choir monk is not. Both of those will matter ' +
        'when somebody eventually asks what else he has been writing.',
      sources: [{ work: 'Fanger, Rewriting Magic', locus: 'John as provost of Morigny after 1308 (frame; verify)' }],
      status: 'adapted', verify: true,
    },
    monologue: {
      sources: [], status: 'invented',
      text: 'They have given me the rents. I know what it means and I took it anyway: a man who holds the accounts is a man nobody searches first.',
    },
  },
  'new-compilation': {
    narrator: {
      text:
        'The year the record puts the New Compilation at: begun in August, finished within ' +
        'months. Whatever John has been building until now, this is where he rebuilds it — ' +
        'simplified, resacralised, with the old errors left visible and glossed rather than ' +
        'scraped away.',
      sources: [{ work: 'Fanger, Rewriting Magic', locus: 'the New Compilation begun August 1315 (frame; verify)' }],
      status: 'adapted', verify: true,
    },
    monologue: {
      sources: [], status: 'invented',
      text: 'Again, then. Not because the first was false — because I was a child when I made it, and children are not wrong to be children.',
    },
  },
};

// ── Reading your own book (the drift, made legible) ────────────────────

/**
 * The book's character is never a meter (decided 2026-09-01). The
 * player learns what the Liber florum is becoming by READING it: the
 * incipits, which prayers adjure and which command, what was glossed
 * and what was scraped away. These are the pencil hand's summations,
 * shown only once the drift is unmistakable.
 */
export const BOOK_READING = {
  rubric: '¶ Of reading over what you have made.',
  narrator: {
    text:
      'He reads it through from the beginning, which he does not often do. A book assembled ' +
      'this way — prayer by prayer, each one written out of a night — has a character its ' +
      'author does not choose all at once and cannot see while he is inside it. Reading it ' +
      'entire is the only way to find out what he has actually been making.',
    sources: [{ work: 'Fanger, Rewriting Magic', locus: 'the Liber florum as a record of its own knowledge process (frame; verify)' }],
    status: 'adapted', verify: true,
  },
  monologue: {
    sources: [], status: 'invented',
    text: 'Twenty leaves and I do not recognise the man on the first of them. That is either growth or drift and I would very much like to be told which.',
  },
};

export const BOOK_CHARACTER_NOTES = {
  devotional: {
    text:
      'What is taking shape here is a prayer book. A good one, orthodox, unremarkable — the ' +
      'sort of thing a hundred houses owned and nobody burned. If it goes on like this it ' +
      'will be safe, and it will not be the Liber florum: John\'s book was condemned because ' +
      'it claimed something, and this one so far claims very little.',
    cites: ['fanger-rewriting'],
    sources: [{ work: 'Fanger, Rewriting Magic', locus: 'the audacity of the Liber florum\'s claim (frame; verify)' }],
    status: 'adapted', verify: true,
  },
  'liber-florum': {
    text:
      'This is recognisably the book Fanger describes: audacious within obedience. It keeps ' +
      'the condemned art\'s central promise — supernatural access to knowledge — and relocates ' +
      'the mechanism into a Marian and sacramental economy, petitioning rather than ' +
      'commanding, with its own errors left visible and glossed. It is the version that gets ' +
      'burned in 1323 and survives anyway, in copies, in houses its author never saw.',
    cites: ['fanger-rewriting'],
    sources: [{ work: 'Fanger, Rewriting Magic', locus: 'the Liber florum as a Christian reconstruction of the ars notoria (frame; verify)' }],
    status: 'adapted', verify: true,
  },
  dirty: {
    text:
      'Here the witness has drifted out of the book John wrote. The prayers command where his ' +
      'petitioned; the exceptive arts have been performed and not merely known; corrections ' +
      'have been scraped away rather than glossed. Frances Yates\'s phrase for the type is ' +
      'the "dirty" magician [verify], and whatever this book is becoming, it is no longer ' +
      'making the claim that the historical Liber florum made — that its efficacy came from ' +
      'somewhere other than its operator.',
    cites: ['kieckhefer-magic'],
    sources: [{ work: 'Kieckhefer, Magic in the Middle Ages', locus: 'coercive necromancy against petitionary practice (frame)' }],
    status: 'adapted', verify: true,
  },
};

// ── The Barking Dogs ───────────────────────────────────────────────────

export const BARKING_DOGS = {
  rubric: '¶ Of the barking dogs, and what they said of the figures.',
  narrator: {
    text:
      'The attack, when it comes, is not from an inquisitor. It is from other religious — ' +
      'men John calls the "Barking Dogs" — and their objection is technical: the figures ' +
      'look like necromantic figures. They have crosses and circles in them; they are keyed ' +
      'to planetary and daily cycles. John is genuinely distressed, because he believes the ' +
      'figures were developed under the Virgin\'s own guidance and confirmation. What he ' +
      'concludes is the interesting part, and it is not that they were right about the ' +
      'demons. It is that HE ACTED BEFORE THE PROMISED INSTRUCTION CAME — Mary had told him ' +
      'not yet to alter the figures, and he proceeded anyway. He defines his error as a ' +
      'failure of obedience and discernment, not of doctrine.',
    sources: [{ work: 'Fanger, Rewriting Magic', locus: 'the Barking Dogs; the error redefined as premature action (frame; verify)' }],
    status: 'adapted', verify: true,
  },
  monologue: {
    ...INV,
    text:
      'They say my figures look like the necromancers\' figures. They are not wrong about ' +
      'the crosses and the circles; they are wrong about what a cross in a circle is FOR. ' +
      'And underneath their barking there is a thing I cannot answer, which is that she ' +
      'told me to wait, and I did not wait.',
  },
};

/** Milk and meat: the two compilations, named at the hinge. */
export const MILK_AND_MEAT = {
  narrator: {
    text:
      'John reads the change through a figure he takes from his own visions. In the early ' +
      'years he slept at Mary\'s breast and drank her milk, played with the infant Christ, ' +
      'and made figures freely. Afterwards she gives him solid food instead, and he must ' +
      'stretch out his arms and be girded and led where he does not choose to go. The Old ' +
      'Compilation is spiritual childhood, with its liberty; the New is maturity, and ' +
      'maturity means receiving the forms rather than inventing them. He does not conclude ' +
      'the old work was false. He concludes it was a child\'s work, and that the child was ' +
      'not wrong to be a child.',
    sources: [{ work: 'Fanger, Rewriting Magic', locus: 'the milk-and-meat vision; Old and New Compilations as childhood and maturity (frame; verify)' }],
    status: 'adapted', verify: true,
  },
  monologue: {
    ...INV,
    text: 'I was given milk and I have been given meat, and the meat is harder, and I asked for it. Somewhere in that sentence is my whole life, and I do not entirely like the look of it.',
  },
};

// ── The rooms of the abbey (docs/LOOP_SYNTHESIS.md §5) ─────────────────

const PAGE_INFRA = [{ work: 'Page, Magic in the Cloister', locus: 'the monastic material infrastructure of occult practice (frame; verify)' }];

export const RESTRICTED_SHELF = {
  narrator: {
    text:
      'The shelf behind the armarium door. Sophie Page\'s Canterbury monks owned more than ' +
      'thirty magical texts and were not obviously ashamed of it: they shelved them beside ' +
      'orthodox works, bound condemnations of illicit magic into the same volumes, and ' +
      'occasionally coded a passage. That is not a conspiracy. It is a reading community ' +
      'making a claim about what kind of knowledge this is. John reads here on his own ' +
      'principle, which he states plainly in his own book: he may know the exceptive arts, ' +
      'and he may not perform them. The knowing is licit. What costs him is that the books ' +
      'are physically in his keeping, and an inventory does not record intentions.',
    sources: PAGE_INFRA, status: 'adapted', verify: true,
  },
  monologue: {
    sources: [], status: 'invented',
    text: 'To know a thing is not to do it. I have written that down and I believe it, and I notice that I check the door before I believe it.',
  },
};

export const INFIRMARY_HOUR = {
  narrator: {
    text:
      'The infirmary is the one room in the abbey where a man may handle strange substances ' +
      'and be thanked for it. It is also where the house keeps its dying. Both facts are ' +
      'true at once, and a monk who spends his hours here is simultaneously doing the most ' +
      'ordinary charity the Rule asks for and standing next to the herbal, the still, and ' +
      'the cupboard nobody questions him for opening.',
    sources: [...PAGE_INFRA, { work: 'RB 1980 (Rule of St Benedict)', locus: 'RB 36, the care of the sick (frame)' }],
    status: 'adapted', verify: true,
  },
  monologue: {
    sources: [], status: 'invented',
    text: 'I sat with him and said the psalms and did not once think about the cupboard. That is not true. I thought about it twice.',
  },
};

export const WORKSHOP_HOUR = {
  narrator: {
    text:
      'Lead, solder, casting sand, and a press for seals. Page found all of it at St ' +
      'Augustine\'s — a plumber\'s workshop, metal casting, connections to Canterbury ' +
      'craftsmen — and it is exactly what separates a figure drawn on parchment from a ' +
      'figure that exists as an object in the world. The difference matters more than it ' +
      'sounds. A drawing can be a meditation. A cast and sealed thing has been MADE, on a ' +
      'chosen day, by somebody, for a purpose, and it can be picked up and shown to a ' +
      'bishop.',
    sources: PAGE_INFRA, status: 'adapted', verify: true,
  },
  monologue: {
    sources: [], status: 'invented',
    text: 'It has a weight now. I did not expect the weight to change anything and it changes everything: a thing you can drop is a thing you can be found holding.',
  },
};

export const GARDEN_HOUR = {
  narrator: {
    text:
      'Beds of physic and pot-herbs, and an hour the horarium does not account for closely. ' +
      'The most underrated resource in a monastery is unwatched time in a permitted place. ' +
      'Nothing happens here, which is the whole of its value: he comes back to the Office ' +
      'with something restored that neither the Rule nor the Work has any way of giving him.',
    sources: [{ work: 'RB 1980 (Rule of St Benedict)', locus: 'RB 48, the ordering of labour (frame)' }],
    status: 'adapted', verify: true,
  },
  monologue: {
    sources: [], status: 'invented',
    text: 'An hour among the beans. I thought about nothing whatever and came back able to think again, which I will not be putting in the book.',
  },
};
