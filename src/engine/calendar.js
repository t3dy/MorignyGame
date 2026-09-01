/**
 * MORIGNY — sim-time: the campaign as a life, not a week
 * (NEWDIRECTIONS.md; decided 2026-09-01).
 *
 * THE CONCEIT, which is also the formal argument: you do not play every
 * day of John's life. You play **the days the record remembers**. Each
 * played day advances the calendar by a seeded stretch — weeks, or a
 * season — so a chronicle of twenty-odd played days spans the two
 * decades between the renunciation and the fire.
 *
 * That is not a compression hack. Fanger is explicit that the Book of
 * Visions is retrospectively constructed: John selected, arranged, and
 * reinterpreted. A game whose record is likewise selective is doing the
 * same thing its source does, and the beat log (engine/beatlog.js) is
 * the artifact that results.
 *
 * Dates are shown in the period's own idiom — liturgical season and
 * year — because that is how the house actually knew what day it was.
 * The seasons here are approximate (fixed month ranges rather than a
 * computus), which is why every date record carries `verify`.
 */

/** The playable campaign opens during the ars notoria years — before his
 * own renunciation, so that Bridget's teaching, her affliction, her
 * renunciation and finally his all happen in play — and runs to the fire. */
export const EPOCH_YEAR = 1301;
export const FIRE_YEAR = 1323;

const DAYS_PER_YEAR = 365;

/** Pinned historical beats, by year. Fired when sim-time reaches them. */
export const HISTORICAL_BEATS = [
  { id: 'provost', year: 1308, label: 'the provostship' },
  { id: 'new-compilation', year: 1315, label: 'the New Compilation' },
  { id: 'summons', year: FIRE_YEAR, label: '1323' },
];

export function createCalendar() {
  return { year: EPOCH_YEAR, dayOfYear: 1, elapsed: 0 };
}

export function loadCalendar(saved) {
  const c = createCalendar();
  if (!saved) return c;
  if (Number.isFinite(saved.year)) c.year = saved.year;
  if (Number.isFinite(saved.dayOfYear)) c.dayOfYear = saved.dayOfYear;
  if (Number.isFinite(saved.elapsed)) c.elapsed = saved.elapsed;
  return c;
}

/**
 * How far a played day carries the calendar. Most days are a few weeks
 * apart; some are a season. Seeded, so a chronicle replays.
 */
export function stride(rng) {
  const roll = rng.next();
  if (roll < 0.45) return 14 + Math.floor(rng.next() * 21);   // a few weeks
  if (roll < 0.85) return 35 + Math.floor(rng.next() * 42);   // a season's corner
  return 90 + Math.floor(rng.next() * 120);                   // a long silence
}

/** Advance sim-time. Returns the beats crossed, in order. */
export function advance(cal, days) {
  const before = cal.year;
  cal.elapsed += days;
  cal.dayOfYear += days;
  while (cal.dayOfYear > DAYS_PER_YEAR) {
    cal.dayOfYear -= DAYS_PER_YEAR;
    cal.year += 1;
  }
  return HISTORICAL_BEATS.filter(b => b.year > before && b.year <= cal.year);
}

/** Weeks of sim-time elapsed — the unit Bridget's lessons are counted in. */
export function weeks(days) {
  return Math.max(1, Math.round(days / 7));
}

/**
 * The liturgical seasons, approximately. Real medieval reckoning is a
 * computus keyed to Easter; these are fixed ranges, honest about it.
 */
const SEASONS = [
  { until: 5, name: 'Christmastide' },
  { until: 45, name: 'the winter hours' },
  { until: 90, name: 'Lent' },
  { until: 135, name: 'Eastertide' },
  { until: 180, name: 'the weeks after Pentecost' },
  { until: 270, name: 'the long summer of the Office' },
  { until: 334, name: 'the autumn hours' },
  { until: 365, name: 'Advent' },
];

export function season(cal) {
  return (SEASONS.find(s => cal.dayOfYear <= s.until) ?? SEASONS[SEASONS.length - 1]).name;
}

/** "Lent, 1312" — how the house would have said it. */
export function format(cal) {
  return `${season(cal)}, ${cal.year}`;
}

/** How old the book's author is getting, in years since the epoch. */
export function yearsElapsed(cal) {
  return cal.year - EPOCH_YEAR;
}

/** Years remaining before the fire — never shown to John, only the apparatus. */
export function yearsToFire(cal) {
  return Math.max(0, FIRE_YEAR - cal.year);
}
