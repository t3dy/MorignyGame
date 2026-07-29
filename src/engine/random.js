/**
 * MORIGNY — seeded RNG. A Lehmer/Park-Miller LCG: small, deterministic,
 * and dependency-free, so a witness plays back identically from its seed.
 *
 * Adapted from the SnakeAB/DungeonAB implementation this project grew out of.
 */

export class SeededRandom {
  constructor(seed) {
    this.seed = this.hashCode(String(seed)) % 2147483647;
    if (this.seed <= 0) this.seed += 2147483646;
    // Warm up: similar seed strings hash to nearby states, and an
    // LCG's first draw barely separates them. Three spins decorrelate.
    for (let i = 0; i < 3; i++) this.next();
  }

  hashCode(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (h << 5) - h + str.charCodeAt(i);
      h = h & h;
    }
    return Math.abs(h);
  }

  next() {
    this.seed = (this.seed * 16807) % 2147483647;
    return (this.seed - 1) / 2147483646;
  }

  pick(arr) {
    return arr[Math.floor(this.next() * arr.length)];
  }

  int(min, max) {
    return min + Math.floor(this.next() * (max - min + 1));
  }
}
