/**
 * MORIGNY beat-log tests — the day as rendered, captured for the day
 * review and the future website log page (v4 §7).
 */

import { strict as assert } from 'assert';
import { createBeatLog } from '../src/engine/beatlog.js';

describe('The beat log', () => {
  test('lines and choices group into beats by hour', () => {
    const b = createBeatLog();
    b.begin('matins', 'Matins');
    b.line('narrator', 'It is the dead of night.', { status: 'invented' });
    b.line('monologue', 'I woke before the bell again.');
    b.choice('P', 'Pray the Work', ['O', 'V', 'H', 'P']);
    b.begin('lauds', 'Lauds');
    b.line('scroll', 'The bell.');
    const beats = b.beats();
    assert.equal(beats.length, 2);
    assert.equal(beats[0].hour, 'Matins');
    assert.equal(beats[0].lines.length, 2);
    assert.equal(beats[0].lines[0].status, 'invented', 'the envelope status rides along');
    assert.equal(beats[0].lines[1].status, undefined, 'absent meta stays absent');
    assert.deepEqual(beats[0].choices[0], { letter: 'P', label: 'Pray the Work', offered: ['O', 'V', 'H', 'P'] });
    assert.equal(beats[1].lines.length, 1);
  });

  test('lines before any beat are dropped, not crashed on (the incipit is not the day)', () => {
    const b = createBeatLog();
    b.line('narrator', 'pre-day chrome');
    b.choice('B', 'Begin', ['B', 'E']);
    assert.equal(b.beats().length, 0);
  });

  test('drain closes the day and empties the log', () => {
    const b = createBeatLog();
    b.begin('matins', 'Matins');
    b.line('narrator', 'a line');
    const drained = b.drain();
    assert.equal(drained.length, 1);
    assert.equal(b.beats().length, 0, 'the log is empty after drain');
    b.line('narrator', 'after drain');
    assert.equal(b.beats().length, 0, 'no current beat after drain — the line is dropped');
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
