/**
 * MORIGNY — the beat log (v4 step 3, docs/V4_LOOP_REDESIGN.md §7).
 * A structured record of the day as it was actually rendered: every
 * voice line, every choice offered and taken, grouped into beats by
 * hour. The same data drives the in-game day review now and the
 * website's permanent, player-editable log page later — where player
 * emendations will render as their own hand beside these.
 *
 * Pure collector: main.js instruments its render helpers to feed it;
 * nothing here touches the DOM. Beats persist into the witness record
 * (journal.beats → stemma storage), so a playthrough's narrative
 * survives the day it was played.
 */

export function createBeatLog() {
  const beats = [];
  let current = null;

  return {
    /** Open a new beat (called at each hour change). */
    begin(stageId, hour) {
      current = { stageId, hour, lines: [], choices: [] };
      beats.push(current);
    },

    /** One rendered line, tagged by voice. `meta` may carry the
     *  envelope's status for the apparatus-minded reader. */
    line(voice, text, meta = null) {
      if (!current) return; // pre-day chrome (incipit) is not the day
      const entry = { voice, text };
      if (meta?.status) entry.status = meta.status;
      current.lines.push(entry);
    },

    /** A choice the player actually took, with what was on offer. */
    choice(letter, label, offered) {
      if (!current) return;
      current.choices.push({ letter, label, offered });
    },

    /** The day so far (live view — do not mutate). */
    beats() {
      return beats;
    },

    /** Close out and return the day's beats for persistence. */
    drain() {
      current = null;
      return beats.splice(0, beats.length);
    },
  };
}
