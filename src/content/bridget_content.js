/**
 * MORIGNY — Bridget's writing (decided 2026-09-01).
 *
 * REGISTER NOTE, binding for this file. Bridget's interludes are the
 * one place the game leaves John's head. She gets her own monologue
 * voice — younger, plainer, less Latinate than his, and not
 * confessional, because she is not writing a book about herself. The
 * narrator stays the same scholarly voice it is everywhere else, but
 * has to be unusually careful here: almost everything we know about
 * Bridget comes through her brother, who was proud of her and
 * responsible for what happened to her. The narrator says so.
 *
 * What the sources give: she is John's younger sister, fifteen; she
 * asked him repeatedly to teach her to read; he thought fifteen too old
 * to make a good reader and put her through the ars notoria anyway;
 * within six months she read AND wrote; she sang an Alleluia in church
 * unassisted and he boasts of it; then a spirit pressed on her in bed,
 * threatening her, stopping her speech and movement; John could not see
 * it, only hear her; ordinary prayers failed; on his instruction she
 * renounced the art before the Virgin, the demon withdrew, and
 * afterwards she could trample it whenever it came.
 *
 * All of it arrives through the digests, so the records carry `verify`
 * (CLAUDE.md rule 11).
 */

const FANGER_FAMILY = [{ work: 'Fanger, "The Magician at Home with his Family" (2017)', locus: 'John and Bridget; magic inside kinship and obligation (frame; verify)' }];
const FANGER = [{ work: 'Fanger, Rewriting Magic', locus: 'Bridget: the teaching, the Alleluia, the demon, the renunciation (frame; verify)' }];
const VERONESE = [{ work: 'Véronèse, editions and studies of the ars notoria', locus: 'the art as a programme of prayer and figure (frame)' }];
const INV = { sources: [], status: 'invented' };

// ── The asking ─────────────────────────────────────────────────────────

export const BRIDGET_ASKS = {
  rubric: '¶ Of his sister, who wants to read.',
  narrator: {
    text:
      'His younger sister has asked him again to teach her letters. She is fifteen, which ' +
      'John considers late — he says so, and the saying is one of the few places his own ' +
      'book lets us hear what he thought of her before any of this happened. It is worth ' +
      'being clear about whose account this is: nearly everything we know of Bridget comes ' +
      'through a brother who was proud of her and who was also responsible for what came ' +
      'next. Girls did commonly learn to read from prayer books, missals, and Hours of the ' +
      'Virgin, so what she is asking for is entirely ordinary. What he is about to consider ' +
      'giving her is not.',
    sources: [...FANGER, ...FANGER_FAMILY], status: 'adapted', verify: true,
  },
  monologue: {
    ...INV,
    text:
      'She has asked me four times. Fifteen is late for it — the boys begin at seven and ' +
      'even they weep over it — and she knows I know a shorter road, because I have never ' +
      'been able to keep my mouth shut about anything I am proud of.',
  },
};

export const TEACH_OPTIONS = {
  scholastic: {
    label: 'Teach her the way you were taught: letters, psalter, and years.',
    why: 'Six months becomes six years, and it is visible — a girl at her letters is talked about. Costs suspicion and nothing else. (Discretio +1 per lesson.)',
  },
  notory: {
    label: 'Put her through the art.',
    why: 'She will read within the year. Every lesson presses the art on her, and every Solomonic node you hold presses harder. Leans Radical. (Learning +1, discretio −1, her burden rises.)',
  },
  refuse: {
    label: 'Tell her no, and mean it.',
    why: 'She stays illiterate and safe, and she will not ask a fifth time.',
  },
};
export const TEACH_OPTIONS_ENVELOPE = { sources: FANGER, status: 'adapted', verify: true };

export const TEACH_OUTCOME = {
  scholastic: {
    narrator: {
      text:
        'He teaches her the slow way, which is the way everyone was taught: letters, then ' +
        'syllables, then the psalter she already half knows by ear. It will take years and ' +
        'it will work, and nothing about it will ever have to be explained to anybody. The ' +
        'only cost is that it happens in daylight, where a house full of people can see a ' +
        'monk teaching his sister to read and form opinions about the use of his time.',
      sources: [{ work: 'RB 1980 (Rule of St Benedict)', locus: 'RB 38, 48 — reading and its discipline (frame)' }],
      status: 'adapted',
    },
    monologue: { ...INV, text: 'A is for nothing; A is a shape. We did an hour and she has the shape of six letters and I am tired in a way I recognise from being seven.' },
    bridget: { ...INV, text: 'He makes me say it back and say it back. My brother is not a patient man and he is being patient, which I think is his way of being sorry about something.' },
  },
  notory: {
    narrator: {
      text:
        'He gives her the art\'s own programme: the prayers, the figures to be gazed at, the ' +
        'fasts, the appointed hours. This is the ars notoria doing exactly what it advertised ' +
        '— not handing over facts but reforming the person until knowledge can be received — ' +
        'and it is the clearest possible evidence of how John actually understood it. He is ' +
        'not conjuring a spirit to tutor his sister. He is running a devotional technology on ' +
        'a fifteen-year-old because he believes it works, and it does.',
      sources: [...VERONESE, ...FANGER_FAMILY], status: 'adapted', verify: true,
    },
    monologue: { ...INV, text: 'The prayers first, then the figure, and she is to look at it and not at me. She learns them faster than I did. I have not decided whether that is a comfort.' },
    bridget: { ...INV, text: 'The words are not words. He says say them anyway and I say them anyway and afterwards the letters are easier, the way a room is easier once someone has lit it.' },
  },
  refuse: {
    narrator: {
      text:
        'He refuses her, and the historical John did not. It is the safest thing anyone does ' +
        'in this entire story: she stays illiterate, she stays unafflicted, and she stays ' +
        'exactly as able to make her own way in 1310 as any woman who cannot read.',
      sources: FANGER, status: 'adapted', verify: true,
    },
    monologue: { ...INV, text: 'I said no and gave her a reason that was true and was not the reason. She did not argue. She has never once argued with me and I would rather she did.' },
    bridget: { ...INV, text: 'He said no. He had the look he has when he is deciding something about himself and calling it a decision about me.' },
  },
};

// ── The Alleluia ───────────────────────────────────────────────────────

export const ALLELUIA = {
  rubric: '¶ Of an Alleluia sung in church by a girl who could not read.',
  narrator: {
    text:
      'She sings it in church, unassisted, and John boasts about it — the boast is in the ' +
      'record, and it is one of the warmest things in his book. To the house it is a small ' +
      'marvel: a girl who could not read six months ago, singing from the page. To John it ' +
      'is proof. The art works, the art is holy, and the shortest way to demonstrate the ' +
      'safety of a thing is to show what it did for someone you love.',
    sources: [...FANGER, ...FANGER_FAMILY], status: 'adapted', verify: true,
  },
  monologue: {
    ...INV,
    text: 'She sang it straight through with the book open and I stood at the back like a fool with my eyes stinging. Six months. Six months, from nothing.',
  },
  bridget: {
    ...INV,
    text: 'The page held still for me. That is the only way I can say it: the page held still, and the sound came off it into my mouth, and I was not frightened at all until afterwards.',
  },
};

export const ALLELUIA_AFTER = {
  narrator: {
    text:
      'And then the nights begin. The sequence matters and John records it in this order: ' +
      'the success first, the affliction after. A spirit comes to her in bed, holds her ' +
      'down, threatens her, and stops her speaking or moving. He cannot see it. He can only ' +
      'hear her, from the next room, and that — a brother listening to his sister being ' +
      'terrified by something he cannot see and did give her — is the engine of everything ' +
      'he does for the rest of his life.',
    sources: FANGER, status: 'adapted', verify: true,
  },
  monologue: {
    ...INV,
    text: 'I heard her through the wall and could not get the door and when I got the door there was nothing in the room. Nothing in the room. She could not say my name.',
  },
};

// ── Her nights (played from her side) ──────────────────────────────────

export const BRIDGET_NIGHT = {
  rubric: '¶ Of the nights, told by her.',
  narrator: {
    text:
      'What she describes is recognisable to anyone who has had sleep paralysis: a weight ' +
      'on the chest, a presence in the room, the whole body locked, the voice gone. Naming ' +
      'it that does not explain it away — she and her brother both understood it as a ' +
      'spirit, and the fourteenth century had better vocabulary for the terror of it than ' +
      'we do. This section is hers. John is asleep, or awake and useless, on the other side ' +
      'of a wall.',
    sources: FANGER, status: 'adapted', verify: true,
  },
  bridget: {
    ...INV,
    text:
      'It comes when the lamp is out. It stands where the door is so I cannot look at the ' +
      'door. My arms are somewhere else. I say the Ave in my head because my mouth is not ' +
      'mine, and it waits until I am finished, politely, the way you wait for someone to ' +
      'stop talking.',
  },
};

export const BRIDGET_NIGHT_OPTIONS = {
  endure: {
    label: 'Wait it out. It goes eventually.',
    why: 'It always has. Nothing changes, and it will come again tomorrow.',
  },
  tell: {
    label: 'Tell John what it says.',
    why: 'He is the one who gave you the prayers. Let him carry some of it. (His discretio is tested; the burden becomes his problem too.)',
  },
  renounce: {
    label: 'Give the art up. Say so to the Virgin, and mean it.',
    why: 'Your decision, not his — and you reach it before he does. The burden lifts entirely, and what it leaves behind is yours.',
  },
};
export const BRIDGET_NIGHT_OPTIONS_ENVELOPE = { sources: FANGER, status: 'adapted', verify: true };

export const BRIDGET_NIGHT_OUTCOME = {
  endure: {
    narrator: {
      text:
        'She endures it, which is what people do, and it costs her the thing enduring always ' +
        'costs: it becomes normal. The burden does not lift because nothing has changed about ' +
        'why it is there.',
      sources: [], status: 'invented',
    },
    bridget: { ...INV, text: 'I have got better at it. That is not the same as it being better. I know the shape of the hour now and I can tell when it is nearly over.' },
  },
  tell: {
    narrator: {
      text:
        'She tells him, and this is the moment his own account turns: the affliction stops ' +
        'being something happening to his sister and becomes evidence about his art. Fanger ' +
        'reads Bridget\'s experience as externalising John\'s conversion — he taught her, so ' +
        'what happens to her is a fact about what he taught. He tries ordinary prayers first. ' +
        'They do not work.',
      sources: FANGER, status: 'adapted', verify: true,
    },
    bridget: { ...INV, text: 'I told him what it says to me. He went the colour of the wall. He said we would pray and we prayed and it came back the next night exactly on time.' },
  },
  renounce: {
    narrator: {
      text:
        'She renounces the art before the Virgin — and the sources are unambiguous that she ' +
        'does this decisively, and that her brother does not. His own conversion was partial ' +
        'for a long while afterwards; he put the art aside "somewhat, but not entirely." She ' +
        'simply stops. The demon withdraws, and from then on she can defeat and trample it ' +
        'whenever it appears, which is the single most striking sentence anyone writes about ' +
        'her in the whole book.',
      sources: FANGER, status: 'adapted', verify: true,
    },
    bridget: {
      ...INV,
      text:
        'I said it out loud to her, in the plainest words I have: I will not use it again, ' +
        'not for reading, not for anything. And it went. And the next time it came to the ' +
        'door I found I was not afraid of it, and I told it so, and that was that.',
    },
  },
};

/** After: the power is hers, and she keeps her letters. */
export const TRAMPLE = {
  narrator: {
    text:
      'She keeps the literacy. That is the part worth sitting with: she gave up the art and ' +
      'did not give back what it taught her, and nobody in the account suggests she should ' +
      'have. And she has something John does not — an unambiguous, tested authority over ' +
      'the thing that frightened them both. He spends decades constructing a theology to ' +
      'get where his sister got in a night.',
    sources: FANGER, status: 'adapted', verify: true,
  },
  bridget: { ...INV, text: 'I can read. It cannot come in. Both of those are true and I did not have to choose between them, whatever he thinks.' },
};
