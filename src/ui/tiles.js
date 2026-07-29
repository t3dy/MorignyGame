/**
 * MORIGNY — procedural tile painters, U5-era plainness in the grisaille
 * palette (INTERFACE.md: color is semantic and earned — the world layer
 * stays in ink and paper tones; no ultramarine, no gold out here).
 *
 * These are original drawings-in-code; no external imagery. Logged in
 * data/assets_manifest.js per morigny/CLAUDE.md rule 6.
 */

export const TILE = 16;

const INK = '#3b3226';
const PAPER = '#ddd3bc';
const FADE = '#a99c80';
const DARK = '#6b5f4d';
const SLATE = '#57606b';
const ROAD = '#c2b394';
const RED = '#a63a22';

function base(ctx, x, y, color = PAPER) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, TILE, TILE);
}

export const PAINTERS = {
  '.': (ctx, x, y) => {
    base(ctx, x, y);
    ctx.fillStyle = FADE;
    ctx.fillRect(x + 4, y + 11, 1, 2);
    ctx.fillRect(x + 11, y + 5, 1, 2);
  },
  f: (ctx, x, y) => {
    base(ctx, x, y, '#cfc3a6');
    ctx.fillStyle = DARK;
    ctx.fillRect(x + 7, y + 9, 2, 5);            // trunk
    ctx.fillStyle = INK;
    ctx.beginPath();                              // canopy
    ctx.moveTo(x + 8, y + 1);
    ctx.lineTo(x + 13, y + 10);
    ctx.lineTo(x + 3, y + 10);
    ctx.closePath();
    ctx.fill();
  },
  h: (ctx, x, y) => {
    base(ctx, x, y);
    ctx.strokeStyle = DARK;
    ctx.beginPath();
    ctx.moveTo(x + 2, y + 12);
    ctx.quadraticCurveTo(x + 8, y + 4, x + 14, y + 12);
    ctx.stroke();
  },
  F: (ctx, x, y) => {
    base(ctx, x, y, '#d6c9a8');
    ctx.strokeStyle = FADE;
    for (let i = 3; i < TILE; i += 4) {
      ctx.beginPath();
      ctx.moveTo(x + 1, y + i);
      ctx.lineTo(x + 15, y + i);
      ctx.stroke();
    }
  },
  '~': (ctx, x, y) => {
    base(ctx, x, y, SLATE);
    ctx.strokeStyle = '#6e7883';
    ctx.beginPath();
    ctx.moveTo(x + 2, y + 6);
    ctx.quadraticCurveTo(x + 5, y + 4, x + 8, y + 6);
    ctx.quadraticCurveTo(x + 11, y + 8, x + 14, y + 6);
    ctx.stroke();
  },
  '=': (ctx, x, y) => {
    base(ctx, x, y, SLATE);
    ctx.fillStyle = ROAD;
    ctx.fillRect(x, y + 5, TILE, 6);
    ctx.strokeStyle = DARK;
    ctx.strokeRect(x, y + 5, TILE, 6);
  },
  r: (ctx, x, y) => {
    base(ctx, x, y, ROAD);
    ctx.fillStyle = FADE;
    ctx.fillRect(x + 6, y + 3, 1, 1);
    ctx.fillRect(x + 10, y + 9, 1, 1);
  },
  s: (ctx, x, y) => {
    base(ctx, x, y);
    ctx.fillStyle = DARK;
    ctx.fillRect(x + 7, y + 4, 2, 10);
    ctx.fillRect(x + 4, y + 5, 9, 2);
  },
  A: (ctx, x, y) => {
    base(ctx, x, y, '#cfc3a6');
    ctx.fillStyle = INK;
    ctx.fillRect(x + 2, y + 7, 12, 8);            // nave
    ctx.fillStyle = DARK;
    ctx.fillRect(x + 6, y + 3, 4, 4);             // tower
    ctx.fillStyle = RED;
    ctx.fillRect(x + 7, y + 1, 2, 2);             // the cross catches light
  },
  T: (ctx, x, y) => {
    base(ctx, x, y, '#cfc3a6');
    ctx.fillStyle = DARK;
    ctx.fillRect(x + 1, y + 6, 14, 9);            // walls
    ctx.fillStyle = INK;
    ctx.fillRect(x + 6, y + 9, 4, 6);             // gate
    ctx.fillStyle = DARK;
    ctx.fillRect(x + 1, y + 4, 3, 3);             // towers
    ctx.fillRect(x + 12, y + 4, 3, 3);
  },
  '#': (ctx, x, y) => {
    base(ctx, x, y, DARK);
    ctx.strokeStyle = INK;
    ctx.strokeRect(x + 0.5, y + 0.5, TILE - 1, TILE - 1);
    ctx.beginPath();
    ctx.moveTo(x, y + 8);
    ctx.lineTo(x + 16, y + 8);
    ctx.stroke();
  },
  C: (ctx, x, y) => {
    base(ctx, x, y, '#cfc3a6');
    ctx.fillStyle = INK;
    ctx.fillRect(x + 3, y + 5, 10, 10);
    ctx.fillStyle = RED;
    ctx.fillRect(x + 7, y + 1, 2, 4);             // rubricated cross
    ctx.fillRect(x + 6, y + 2, 4, 1);
  },
  m: (ctx, x, y) => {
    base(ctx, x, y);
    ctx.fillStyle = ROAD;
    ctx.fillRect(x + 2, y + 6, 12, 7);
    ctx.strokeStyle = INK;
    ctx.strokeRect(x + 2, y + 6, 12, 7);
    ctx.fillStyle = RED;
    ctx.fillRect(x + 2, y + 4, 12, 2);            // awning
  },
  G: (ctx, x, y) => {
    base(ctx, x, y, DARK);
    ctx.fillStyle = ROAD;
    ctx.fillRect(x + 4, y + 3, 8, 13);
    ctx.strokeStyle = INK;
    ctx.strokeRect(x + 4, y + 3, 8, 13);
  },
};

export function paintFigure(ctx, x, y, { hood = INK } = {}) {
  ctx.fillStyle = hood;
  ctx.fillRect(x + 6, y + 3, 4, 4);               // hooded head
  ctx.fillRect(x + 5, y + 7, 6, 6);               // habit
  ctx.fillRect(x + 6, y + 13, 1, 2);              // feet
  ctx.fillRect(x + 9, y + 13, 1, 2);
}

export function paintNpc(ctx, x, y) {
  paintFigure(ctx, x, y, { hood: '#7a4a3a' });    // townsfolk in madder
}
