/**
 * MORIGNY — Bridget, the calendar, and the three practices.
 * Her arc is the empirical proof of what John's practice actually is,
 * and it is HERS: she reaches the renunciation before he does, and the
 * power afterwards belongs to her (decided 2026-09-01).
 */

import { strict as assert } from 'assert';
import { SeededRandom } from '../src/engine/random.js';
import {
  METHODS, METHOD, CRISIS_AT, RENUNCIATION_AVAILABLE_AT,
  createBridget, loadBridget, teach, inCrisis, renunciationAvailable,
  renounce, analyse, literate,
} from '../src/engine/bridget.js';
import {
  EPOCH_YEAR, FIRE_YEAR, HISTORICAL_BEATS,
  createCalendar, loadCalendar, stride, advance, weeks, season, format, yearsToFire,
} from '../src/engine/calendar.js';
import {
  TREES, TREE_IDS, CHARACTERS, createPractice, loadPractice, canInvest,
  invest, renounce as renouncePractice, resacralise, perform, bookCharacter,
} from '../src/engine/practice.js';
import { createLiberFlorum, composePrayer, scrapePrayer } from '../src/engine/liberflorum.js';

describe('Sim-time: a life, not a week', () => {
  test('the campaign opens after the renunciation and runs to the fire', () => {
    const cal = createCalendar();
    assert.equal(cal.year, EPOCH_YEAR);
    assert.ok(EPOCH_YEAR < 1308, 'the campaign begins before the provostship');
    assert.equal(yearsToFire(cal), FIRE_YEAR - EPOCH_YEAR);
    assert.ok(HISTORICAL_BEATS.some(b => b.year === FIRE_YEAR), '1323 is pinned');
    assert.ok(HISTORICAL_BEATS.some(b => b.year === 1308), 'so is the provostship');
  });

  test('a played day carries weeks or a season, seeded', () => {
    const rng = new SeededRandom('stride');
    const strides = Array.from({ length: 30 }, () => stride(rng));
    assert.ok(strides.every(s => s >= 14 && s <= 210), 'weeks at least, a long silence at most');
    assert.ok(new Set(strides).size > 5, 'and they vary');
    const a = stride(new SeededRandom('same'));
    const b = stride(new SeededRandom('same'));
    assert.equal(a, b, 'same seed, same stride');
  });

  test('advancing rolls the year and reports the beats crossed', () => {
    const cal = createCalendar();
    const none = advance(cal, 30);
    assert.deepEqual(none, [], 'a month crosses nothing');
    const crossed = advance(cal, 365 * 8);
    assert.ok(crossed.some(b => b.id === 'provost'), '1308 was crossed and reported');
    assert.equal(cal.year, EPOCH_YEAR + 8);
  });

  test('the date reads in the house\'s own idiom', () => {
    const cal = createCalendar();
    assert.match(format(cal), new RegExp(String(EPOCH_YEAR)));
    assert.ok(season(cal).length > 3);
    advance(cal, 100);
    assert.match(format(cal), /Lent|Eastertide|winter|Pentecost/i);
  });

  test('an old save loads; weeks convert honestly', () => {
    assert.equal(loadCalendar(undefined).year, EPOCH_YEAR);
    assert.equal(loadCalendar({ year: 1315, dayOfYear: 200, elapsed: 4000 }).year, 1315);
    assert.equal(weeks(28), 4);
    assert.equal(weeks(3), 1, 'never less than a week');
  });
});

describe('Teaching Bridget', () => {
  test('the art is fast and costly; schooling is slow and clean', () => {
    assert.deepEqual(METHODS, ['scholastic', 'notory']);
    assert.ok(METHOD.notory.weeksToLiterate < METHOD.scholastic.weeksToLiterate);
    assert.ok(METHOD.notory.burdenPerLesson > 0);
    assert.equal(METHOD.scholastic.burdenPerLesson, 0);
    assert.ok(METHOD.notory.johnDiscretio < 0, 'the shortcut narrows his discernment');
    assert.ok(METHOD.scholastic.suspicionPerLesson > 0,
      'a girl openly at her letters is talked about');
  });

  test('a notory lesson advances her fast and presses on her', () => {
    const b = createBridget();
    const r = teach(b, 'notory', 4);
    assert.ok(r.gained.literacy > 0);
    assert.ok(r.gained.burden > 0);
    assert.equal(r.john.discretio, -1, 'and the caller is told what it costs John');
  });

  test('every Solomonic node John has taken makes the art press harder on her', () => {
    const plain = createBridget();
    const withNodes = createBridget();
    teach(plain, 'notory', 4, { solomonicNodes: 0 });
    teach(withNodes, 'notory', 4, { solomonicNodes: 4 });
    assert.ok(withNodes.burden > plain.burden,
      'his experiment has consequences for somebody else — that is the point');
  });

  test('the Alleluia fires once, and via the art it spikes her burden', () => {
    const viaArt = createBridget();
    let events = [];
    for (let i = 0; i < 12 && viaArt.literacy < 100; i++) {
      events = teach(viaArt, 'notory', 4).events;
    }
    assert.equal(viaArt.alleluia, true);
    assert.ok(events.some(e => e.type === 'alleluia' && e.viaArt));
    assert.throws(() => teach(viaArt, 'notory', 4), /nothing left to teach/);

    const bySchool = createBridget();
    for (let i = 0; i < 40 && bySchool.literacy < 100; i++) teach(bySchool, 'scholastic', 4);
    assert.equal(bySchool.alleluia, true);
    assert.equal(bySchool.burden, 0, 'the slow road sings the same Alleluia and costs her nothing');
  });

  test('at fifty she can be a second pair of hands — if she chooses', () => {
    const b = createBridget();
    assert.equal(literate(b), false);
    b.literacy = 60;
    assert.equal(literate(b), true);
  });
});

describe('The Renunciation is hers', () => {
  test('crisis and availability track her burden, not John\'s convenience', () => {
    const b = createBridget();
    b.burden = RENUNCIATION_AVAILABLE_AT - 1;
    assert.equal(renunciationAvailable(b), false);
    b.burden = RENUNCIATION_AVAILABLE_AT;
    assert.equal(renunciationAvailable(b), true);
    assert.equal(inCrisis(b), false);
    b.burden = CRISIS_AT;
    assert.equal(inCrisis(b), true);
  });

  test('when she renounces, the burden lifts and the power is HERS', () => {
    const b = createBridget();
    b.burden = 90;
    renounce(b);
    assert.equal(b.burden, 0);
    assert.equal(b.trample, true, 'she can trample the demon whenever it appears');
    assert.equal(b.renounced, true);
    assert.throws(() => renounce(b), /already renounced/);
    assert.equal(inCrisis(b), false);
  });

  test('the other road leaves her surviving, fragile, and without her power', () => {
    const b = createBridget();
    b.burden = 90;
    analyse(b);
    assert.ok(b.burden > 0, 'the burden never fully lifts');
    assert.equal(b.trample, false, 'and she never gets the power the sources give her');
    assert.equal(b.fragile, true);
  });

  test('her state survives the day boundary', () => {
    const b = createBridget();
    b.literacy = 70; b.burden = 40; b.method = 'notory'; b.alleluia = true;
    const restored = loadBridget(JSON.parse(JSON.stringify(b)));
    assert.equal(restored.literacy, 70);
    assert.equal(restored.alleluia, true);
    assert.equal(loadBridget(undefined).literacy, 0);
  });
});

describe('The three practices', () => {
  test('the Marian road is shut until he has actually renounced', () => {
    const p = createPractice();
    assert.deepEqual(TREE_IDS, ['solomonic', 'exceptive', 'marian']);
    assert.equal(canInvest(p, 'marian'), false);
    assert.equal(canInvest(p, 'solomonic'), true);
    assert.throws(() => invest(p, 'marian'), /not open/);
    renouncePractice(p);
    assert.equal(canInvest(p, 'marian'), true);
    assert.equal(canInvest(p, 'solomonic'), false, 'renouncing means giving it up, not deprecating it');
  });

  test('investment reports its couplings rather than reaching into other systems', () => {
    const p = createPractice();
    assert.deepEqual(invest(p, 'solomonic'), { burdenRate: 1, discretio: -1 });
    assert.deepEqual(invest(p, 'exceptive'), { suspicionPerDay: 1 });
    assert.equal(p.solomonic, 1);
    assert.throws(() => canInvest(p, 'alchemy'), /unknown tree/);
  });

  test('the Renunciation banks what he spent on the shortcut as penitential matter', () => {
    const p = createPractice();
    invest(p, 'solomonic'); invest(p, 'solomonic'); invest(p, 'solomonic');
    renouncePractice(p);
    assert.equal(p.penitential, 3, 'the old road becomes the material of the new');
    resacralise(p, 2);
    assert.equal(p.penitential, 1);
    assert.throws(() => resacralise(p, 5), /not enough penitential/);
  });

  test('every tree has a label and a line the UI can quote', () => {
    for (const id of TREE_IDS) {
      assert.ok(TREES[id].label && TREES[id].line.length > 20, id);
    }
  });
});

describe('What the book becomes', () => {
  const write = (book, n, mode = 'adjuring') => {
    for (let i = 0; i < n; i++) {
      composePrayer(book, { vision: {}, judgement: 'licentia', mode, incipit: 'x' });
    }
  };

  test('a cautious life produces a conventional prayer book', () => {
    const { character } = bookCharacter(createPractice(), createLiberFlorum());
    assert.equal(character, 'devotional', 'a man who risked nothing wrote something safe');
  });

  test('the historical road produces the Liber florum', () => {
    const p = createPractice();
    invest(p, 'solomonic'); invest(p, 'solomonic');
    renouncePractice(p);
    invest(p, 'marian'); invest(p, 'marian'); invest(p, 'marian');
    const book = createLiberFlorum();
    write(book, 5, 'adjuring');
    const { character } = bookCharacter(p, book);
    assert.equal(character, 'liber-florum',
      'audacious within obedience: he rebuilt the thing he renounced, under authorization');
  });

  test('performing the forbidden arts drags the book toward dirty magic', () => {
    const p = createPractice();
    invest(p, 'exceptive'); invest(p, 'exceptive');
    perform(p); perform(p); perform(p);
    const book = createLiberFlorum();
    write(book, 3, 'conjuring');
    const { character, scores } = bookCharacter(p, book);
    assert.equal(character, 'dirty');
    assert.ok(scores.dirty > scores['liber-florum']);
  });

  test('knowing is not doing: the exceptive arts alone do not damn the book', () => {
    // John's own compromise — "may I know and understand necromancy,
    // but not perform it" — must remain mechanically real (§3).
    const knowing = createPractice();
    invest(knowing, 'exceptive'); invest(knowing, 'exceptive');
    renouncePractice(knowing);
    invest(knowing, 'marian'); invest(knowing, 'marian'); invest(knowing, 'marian');
    const book = createLiberFlorum();
    write(book, 4, 'adjuring');
    assert.equal(bookCharacter(knowing, book).character, 'liber-florum');

    const doing = loadPractice(JSON.parse(JSON.stringify(knowing)));
    for (let i = 0; i < 5; i++) perform(doing);
    assert.equal(bookCharacter(doing, book).character, 'dirty',
      'the same knowledge, performed, is a different book');
  });

  test('scraping errors instead of glossing them pulls toward the dirty pole', () => {
    const p = createPractice();
    const glossed = createLiberFlorum();
    const scraped = createLiberFlorum();
    for (const book of [glossed, scraped]) {
      composePrayer(book, { vision: {}, judgement: 'corrupted', mode: 'adjuring', incipit: 'x' });
    }
    glossed.prayers[0].glosses.push({ reason: 'a later vision showed it' });
    assert.ok(bookCharacter(p, scraped).scores.dirty > bookCharacter(p, glossed).scores.dirty,
      'a book that hides its corrections is making a different claim about itself');
  });

  test('an ACTUALLY scraped leaf still counts, though the prayer is gone', () => {
    // Caught in wiring: scraping removes the prayer from the book, so
    // counting only surviving prayers would let the act erase the
    // evidence of itself. The scrape is tallied on the book.
    const p = createPractice();
    const book = createLiberFlorum();
    const bad = composePrayer(book, { vision: {}, judgement: 'corrupted', mode: 'adjuring', incipit: 'x' });
    const before = bookCharacter(p, book).scores.dirty;
    scrapePrayer(book, bad.id);
    assert.equal(book.prayers.length, 0, 'the leaf is reused; the prayer is gone');
    assert.equal(book.scraped, 1);
    assert.equal(bookCharacter(p, book).scores.dirty, before,
      'and the book still remembers that something was scraped out of it');
    assert.throws(() => scrapePrayer(book, 'prayer-99'), /no such prayer/);
  });

  test('the three characters are the ones we promised', () => {
    assert.deepEqual(CHARACTERS, ['devotional', 'liber-florum', 'dirty']);
  });
});

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (err) {
    console.error(`✗ ${name}`);
    console.error(`  ${err.message}`);
    throw err;
  }
}

function describe(name, fn) {
  console.log(`\n${name}`);
  fn();
}
