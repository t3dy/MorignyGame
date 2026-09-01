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
