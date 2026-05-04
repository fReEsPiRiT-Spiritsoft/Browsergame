/* ═══════════════════════════════════════════════════════════════
   FEEDBACK-FRENZY: BJÖRN'S MAINFRAME
   Core Game Engine  —  game.js
   ═══════════════════════════════════════════════════════════════ */

'use strict';

// ─── Constants ────────────────────────────────────────────────
const TILE   = 32;
const COLS   = 25;
const ROWS   = 17;   // canvas 800x560, top 80px used by HUD
const CANVAS_W = 800;
const CANVAS_H = 560;

// ─── Feedback Quotes Database ─────────────────────────────────
const FEEDBACK_POOL = [
  // [text, points, type, reaction]
  ["Saubere Doku! Ich bin stolz auf dich.", 50, "positive", "🎉 Exzellent!"],
  ["Das Kommentieren war hier wirklich durchdacht.", 45, "positive", "💚 Top Arbeit!"],
  ["Lesbar, wartbar, solid. Weiter so!", 40, "positive", "✅ Sehr gut!"],
  ["Code-Stil: 404 Not Found.", 30, "neutral", "🤔 Überdenk das…"],
  ["Das riecht nach ChatGPT. Aber… es funktioniert.", 20, "neutral", "😐 Hm…"],
  ["Guter Ansatz, aber die Namensgebung weint.", 25, "neutral", "🤷 Geht so."],
  ["Spaghetti-Code? Das ist ein Kunstwerk!", -10, "negative", "🍝 Uff."],
  ["Mein Hamster hätte das besser eingerückt.", -15, "negative", "❌ Nochmal!"],
  ["Wo sind die Tests?! KEINE TESTS?!", -5, "negative", "😤 Oh nein…"],
  ["DRY steht für 'Don't Repeat Yourself'. Du wiederholst alles.", -10, "negative", "🔁 Ugh."],
  ["Variable 'x'? 'y'? 'temp'? Bin ich ein Mathematiker?!", 15, "neutral", "🧮 Na ja…"],
  ["Ich hab schon schlechtere Commits gesehen. In 2009.", 35, "positive", "📦 Solide!"],
  ["Git Commit: 'fixed stuff' – ich weine.", -5, "negative", "😢 Ernsthaft?"],
  ["README existiert! Ich glaube an das Gute.", 42, "positive", "📖 Danke!"],
  ["Edge Cases? Noch nie gehört? Okay.", 10, "neutral", "⚠️ Aufpassen."],
];

// ─── Student Names & Personalities ───────────────────────────
const STUDENTS = [
  { name: "Max",    color: "#4488ff", emoji: "😅", files: ["ToDo-App (React)", "Node-Backend (fast)"] },
  { name: "Lena",   color: "#ff88cc", emoji: "🤓", files: ["REST-API (sauber)", "Unit-Tests (!!!)"] },
  { name: "Kevin",  color: "#ff8844", emoji: "😬", files: ["Copy-Paste von StackOverflow", "Halbfertiges Projekt"] },
  { name: "Sarah",  color: "#88ffcc", emoji: "🙂", files: ["Dokumentiertes Modul", "Refactored Code"] },
  { name: "Tim",    color: "#ffcc44", emoji: "😤", files: ["500 Zeilen in einer Datei", "Keine Kommentare"] },
  { name: "Julia",  color: "#cc88ff", emoji: "😊", files: ["Clean Architecture", "Durchdachtes Design"] },
  { name: "Pascal", color: "#44ffff", emoji: "🤔", files: ["Mysteriöse Funktion 'doStuff()'", "Magic Numbers überall"] },
  { name: "Emma",   color: "#ff4488", emoji: "💪", files: ["Vollständige Test-Suite", "CI/CD Pipeline (wow)"] },
];

// ─── Map layout (0=floor, 1=wall/chip, 2=ram, 3=capacitor, 4=trace) ──────
function generateMap() {
  const map = [];
  for (let r = 0; r < ROWS; r++) {
    map.push(new Array(COLS).fill(0));
  }
  // PCB border
  for (let c = 0; c < COLS; c++) { map[0][c] = 1; map[ROWS-1][c] = 1; }
  for (let r = 0; r < ROWS; r++) { map[r][0] = 1; map[r][COLS-1] = 1; }

  // RAM modules (big blocks)
  [[1,1],[1,10],[1,19],[7,3],[7,14],[12,7],[12,18]] .forEach(([r,c]) => {
    for (let dr = 0; dr < 2; dr++)
      for (let dc = 0; dc < 3; dc++)
        if (r+dr < ROWS-1 && c+dc < COLS-1) map[r+dr][c+dc] = 2;
  });

  // Capacitors
  [[4,6],[4,13],[8,2],[8,20],[13,4],[13,12],[15,8],[15,20]].forEach(([r,c]) => {
    if (r < ROWS-1 && c < COLS-1) map[r][c] = 3;
  });

  // Trace paths (horizontal & vertical power lines)
  [3,6,9,12,15].forEach(r => {
    for (let c = 1; c < COLS-1; c++) if (map[r][c] === 0) map[r][c] = 4;
  });
  [4,8,12,16,20].forEach(c => {
    for (let r = 1; r < ROWS-1; r++) if (map[r][c] === 0) map[r][c] = 4;
  });

  return map;
}

// ─── Tile Rendering ───────────────────────────────────────────
const tileRenderers = {
  // Flat PCB floor — green substrate
  0: (ctx, x, y) => {
    ctx.fillStyle = '#0a1a0d';
    ctx.fillRect(x, y, TILE, TILE);
    // subtle grid
    ctx.strokeStyle = 'rgba(0,80,30,0.3)';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(x+0.5, y+0.5, TILE-1, TILE-1);
  },
  // Wall / chip package
  1: (ctx, x, y) => {
    ctx.fillStyle = '#0d1a0e';
    ctx.fillRect(x, y, TILE, TILE);
    ctx.fillStyle = '#1a2e1b';
    ctx.fillRect(x+3, y+3, TILE-6, TILE-6);
    ctx.strokeStyle = '#00ff8866';
    ctx.lineWidth = 1;
    ctx.strokeRect(x+3, y+3, TILE-6, TILE-6);
    // chip label lines
    ctx.fillStyle = '#003310';
    for (let i = 0; i < 3; i++) ctx.fillRect(x+6, y+9+i*6, TILE-12, 2);
  },
  // RAM module
  2: (ctx, x, y) => {
    ctx.fillStyle = '#0c1f12';
    ctx.fillRect(x, y, TILE, TILE);
    ctx.fillStyle = '#153d1e';
    ctx.fillRect(x+2, y+2, TILE-4, TILE-4);
    ctx.strokeStyle = '#00ff88aa';
    ctx.lineWidth = 1;
    ctx.strokeRect(x+2, y+2, TILE-4, TILE-4);
    // ram pins
    ctx.fillStyle = '#00cc5588';
    for (let i = 0; i < 5; i++) {
      ctx.fillRect(x+4+i*5, y+TILE-5, 3, 4);
      ctx.fillRect(x+4+i*5, y+1, 3, 4);
    }
    ctx.shadowBlur = 6; ctx.shadowColor = '#00ff88';
    ctx.strokeStyle = '#00ff8844';
    ctx.strokeRect(x+2, y+2, TILE-4, TILE-4);
    ctx.shadowBlur = 0;
  },
  // Capacitor
  3: (ctx, x, y) => {
    ctx.fillStyle = '#0a1a0d';
    ctx.fillRect(x, y, TILE, TILE);
    const cx = x + TILE/2, cy = y + TILE/2, r = 9;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2);
    ctx.fillStyle = '#1a3322'; ctx.fill();
    ctx.strokeStyle = '#00ff88'; ctx.lineWidth = 1.5;
    ctx.shadowBlur = 8; ctx.shadowColor = '#00ff88';
    ctx.stroke(); ctx.shadowBlur = 0;
    // + mark
    ctx.fillStyle = '#00ff88aa';
    ctx.fillRect(cx-1, cy-5, 2, 10);
    ctx.fillRect(cx-5, cy-1, 10, 2);
  },
  // Trace / power line
  4: (ctx, x, y) => {
    ctx.fillStyle = '#081508';
    ctx.fillRect(x, y, TILE, TILE);
    ctx.shadowBlur = 12; ctx.shadowColor = '#00ff44';
    ctx.fillStyle = '#00aa44';
    ctx.fillRect(x+13, y, 6, TILE);   // vertical trace
    ctx.fillRect(x, y+13, TILE, 6);   // horizontal trace
    ctx.fillStyle = '#00ff88';
    ctx.fillRect(x+14, y, 4, TILE);
    ctx.fillRect(x, y+14, TILE, 4);
    ctx.shadowBlur = 0;
  },
};

function isSolid(map, col, row) {
  if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return true;
  const t = map[row][col];
  return t === 1 || t === 2 || t === 3;
}

// ─── Particle System ──────────────────────────────────────────
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx    = canvas.getContext('2d');
    this.particles = [];
  }
  burst(wx, wy, count = 30) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 4;
      this.particles.push({
        x: wx, y: wy + 80,  // +80 for HUD offset
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        life: 1.0,
        decay: 0.015 + Math.random() * 0.02,
        char: Math.random() > 0.5 ? '1' : '0',
        size: 10 + Math.random() * 6,
        hue: 120 + Math.floor(Math.random() * 60),
      });
    }
  }
  update() {
    this.particles = this.particles.filter(p => p.life > 0);
    this.particles.forEach(p => {
      p.x  += p.vx;
      p.y  += p.vy;
      p.vy += 0.08;
      p.life -= p.decay;
    });
  }
  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles.forEach(p => {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = `hsl(${p.hue}, 100%, 60%)`;
      ctx.font = `bold ${p.size}px 'Share Tech Mono', monospace`;
      ctx.shadowBlur = 8; ctx.shadowColor = `hsl(${p.hue}, 100%, 70%)`;
      ctx.fillText(p.char, p.x, p.y);
    });
    ctx.globalAlpha = 1;
    ctx.shadowBlur  = 0;
  }
}

// ─── Player ───────────────────────────────────────────────────
class Player {
  constructor(col, row) {
    this.col = col; this.row = row;
    this.x   = col * TILE; this.y = row * TILE;
    this.tx  = this.x;     this.ty = this.y;
    this.moving   = false;
    this.moveTimer= 0;
    this.MOVE_DUR = 10;  // frames to slide one tile
    this.dir      = 2;   // 0=up,1=right,2=down,3=left (for sprite)
    this.animFrame= 0;
    this.animTimer= 0;
  }
  tryMove(dc, dr, map) {
    if (this.moving) return false;
    const nc = this.col + dc, nr = this.row + dr;
    if (isSolid(map, nc, nr)) return false;
    this.col = nc; this.row = nr;
    this.tx  = nc * TILE; this.ty = nr * TILE;
    this.moving = true; this.moveTimer = 0;
    if      (dr < 0) this.dir = 0;
    else if (dc > 0) this.dir = 1;
    else if (dr > 0) this.dir = 2;
    else if (dc < 0) this.dir = 3;
    return true;
  }
  update() {
    if (this.moving) {
      this.moveTimer++;
      const t = this.moveTimer / this.MOVE_DUR;
      this.x = lerp(this.x, this.tx, Math.min(t * 2, 1));
      this.y = lerp(this.y, this.ty, Math.min(t * 2, 1));
      if (this.moveTimer >= this.MOVE_DUR) {
        this.x = this.tx; this.y = this.ty;
        this.moving = false;
      }
      this.animTimer++;
      if (this.animTimer % 8 === 0) this.animFrame = (this.animFrame + 1) % 4;
    }
  }
  drawOn(ctx, img) {
    const px = Math.round(this.x), py = Math.round(this.y);
    ctx.save();
    // shadow / glow under sprite
    ctx.shadowBlur = 20; ctx.shadowColor = '#00ff88';
    if (img) {
      ctx.drawImage(img, px, py - 8, TILE, TILE + 8);
    } else {
      drawFallbackBjoern(ctx, px + TILE/2, py + TILE/2 - 4, this.dir, this.animFrame);
    }
    ctx.restore();
  }
}

// ─── NPC / Student ────────────────────────────────────────────
class StudentNPC {
  constructor(col, row, data) {
    this.col    = col; this.row = row;
    this.x      = col * TILE; this.y = row * TILE;
    this.data   = data;
    this.animFrame = 0; this.animTimer = 0;
    this.bobPhase  = Math.random() * Math.PI * 2;
    this.interacted= false;
    this.exclamation = 0; // countdown for ! mark
  }
  update(playerCol, playerRow) {
    this.animTimer++;
    if (this.animTimer % 12 === 0) this.animFrame = (this.animFrame + 1) % 4;
    this.bobPhase += 0.05;
    // Show exclamation when adjacent
    const dist = Math.abs(this.col - playerCol) + Math.abs(this.row - playerRow);
    if (dist === 1 && !this.interacted) this.exclamation = 2;
    else if (this.exclamation > 0) this.exclamation = Math.max(0, this.exclamation - 0.05);
  }
  drawOn(ctx, img) {
    const px = Math.round(this.x);
    const py = Math.round(this.y) + Math.sin(this.bobPhase) * 2;

    ctx.save();
    ctx.shadowBlur  = this.exclamation > 0 ? 20 : 10;
    ctx.shadowColor = this.data.color;

    if (img) {
      ctx.drawImage(img, px, py - 8, TILE, TILE + 8);
    } else {
      drawFallbackStudent(ctx, px + TILE/2, py + TILE/2 - 4, this.data);
    }

    // Exclamation mark
    if (this.exclamation > 0.1) {
      ctx.globalAlpha = Math.min(1, this.exclamation);
      ctx.font = 'bold 16px monospace';
      ctx.fillStyle = '#ffdd00';
      ctx.shadowBlur = 10; ctx.shadowColor = '#ffdd00';
      ctx.fillText('!', px + TILE/2 - 4, py - 14);
    }

    ctx.restore();
  }
}

// ─── Fallback Sprite Drawers (no PNG needed) ──────────────────
function drawFallbackBjoern(ctx, cx, cy, dir, frame) {
  // Body
  ctx.fillStyle = '#1a4d2e';
  ctx.fillRect(cx-8, cy-4, 16, 14);
  // Shirt — teacher blue
  ctx.fillStyle = '#2255aa';
  ctx.fillRect(cx-6, cy-2, 12, 10);
  // Head
  ctx.fillStyle = '#f5d0a9';
  ctx.beginPath(); ctx.arc(cx, cy-12, 9, 0, Math.PI*2); ctx.fill();
  // Hair
  ctx.fillStyle = '#5a3010';
  ctx.fillRect(cx-9, cy-21, 18, 10);
  // Eyes
  ctx.fillStyle = '#222';
  const eyeOff = dir === 3 ? -2 : dir === 1 ? 2 : 0;
  ctx.fillRect(cx-4+eyeOff, cy-14, 2, 2);
  ctx.fillRect(cx+2+eyeOff, cy-14, 2, 2);
  // Glasses
  ctx.strokeStyle = '#888';
  ctx.lineWidth = 1;
  ctx.strokeRect(cx-5+eyeOff, cy-15, 4, 3);
  ctx.strokeRect(cx+1+eyeOff, cy-15, 4, 3);
  // Legs (walk animation)
  const legOff = frame % 2 === 0 ? 2 : -2;
  ctx.fillStyle = '#1a1a3a';
  ctx.fillRect(cx-6, cy+10, 5, 6 + legOff);
  ctx.fillRect(cx+1, cy+10, 5, 6 - legOff);
  // Tie
  ctx.fillStyle = '#cc2222';
  ctx.beginPath();
  ctx.moveTo(cx, cy-2); ctx.lineTo(cx-2, cy+4); ctx.lineTo(cx, cy+8); ctx.lineTo(cx+2, cy+4);
  ctx.closePath(); ctx.fill();
}

function drawFallbackStudent(ctx, cx, cy, data) {
  // Body
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(cx-7, cy-3, 14, 13);
  // Hoodie / shirt
  ctx.fillStyle = data.color + 'aa';
  ctx.fillRect(cx-5, cy-1, 10, 9);
  // Head
  ctx.fillStyle = '#f5d0a9';
  ctx.beginPath(); ctx.arc(cx, cy-11, 8, 0, Math.PI*2); ctx.fill();
  // Emoji face
  ctx.font = '10px serif';
  ctx.fillText(data.emoji, cx-6, cy-7);
  // Legs
  ctx.fillStyle = '#222244';
  ctx.fillRect(cx-5, cy+10, 4, 6);
  ctx.fillRect(cx+1, cy+10, 4, 6);
}

// ─── Utility ──────────────────────────────────────────────────
function lerp(a, b, t) { return a + (b - a) * t; }

function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Draw avatar on encounter canvas ──────────────────────────
function drawEncounterStudent(canvas, data) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  // Background circle
  ctx.beginPath(); ctx.arc(w/2, h/2, 50, 0, Math.PI*2);
  ctx.fillStyle = data.color + '22'; ctx.fill();
  ctx.strokeStyle = data.color; ctx.lineWidth = 2;
  ctx.shadowBlur = 15; ctx.shadowColor = data.color;
  ctx.stroke(); ctx.shadowBlur = 0;
  // Draw sprite
  drawFallbackStudent(ctx, w/2, h/2 + 5, data);
}

function drawEncounterBjoern(canvas) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.beginPath(); ctx.arc(w/2, h/2, 50, 0, Math.PI*2);
  ctx.fillStyle = '#00ff8822'; ctx.fill();
  ctx.strokeStyle = '#00ff88'; ctx.lineWidth = 2;
  ctx.shadowBlur = 15; ctx.shadowColor = '#00ff88';
  ctx.stroke(); ctx.shadowBlur = 0;
  drawFallbackBjoern(ctx, w/2, h/2 + 5, 2, 0);
}

// ─── Matrix Rain (start screen decoration) ────────────────────
class MatrixRain {
  constructor(el) {
    this.canvas = document.createElement('canvas');
    this.canvas.width  = 800;
    this.canvas.height = 640;
    Object.assign(this.canvas.style, { position:'absolute', top:0, left:0, width:'100%', height:'100%' });
    el.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.cols = Math.floor(800 / 14);
    this.drops = new Array(this.cols).fill(0).map(() => Math.random() * -50);
    this.chars = '01アイウエオカキクケコ<>{}[]|\\/#@!?%&*';
  }
  tick() {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(3,13,6,0.07)';
    ctx.fillRect(0, 0, 800, 640);
    ctx.fillStyle = '#00ff44';
    ctx.font = '13px monospace';
    this.drops.forEach((y, i) => {
      const ch = this.chars[Math.floor(Math.random() * this.chars.length)];
      ctx.fillText(ch, i * 14, y * 14);
      if (y * 14 > 640 && Math.random() > 0.975) this.drops[i] = 0;
      else this.drops[i] += 0.6;
    });
  }
}

// ══════════════════════════════════════════════════════════════
// GAME STATE
// ══════════════════════════════════════════════════════════════
let gameState   = 'START';  // START | WORLD | ENCOUNTER | GAMEOVER
let map         = [];
let player      = null;
let students    = [];
let particles   = null;
let matrixRain  = null;
let animId      = null;

let score       = 0;
let encounterCount = 0;
let currentStudent = null;
let feedbackChoices = [];

const keys = { up:false, down:false, left:false, right:false };
let   keyLock = false;

// DOM refs
const gameCanvas    = document.getElementById('gameCanvas');
const particleCanvas= document.getElementById('particleCanvas');
const gCtx          = gameCanvas.getContext('2d');

// ─── Keyboard ────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (gameState !== 'WORLD') return;
  switch (e.key) {
    case 'ArrowUp':    case 'w': case 'W': keys.up    = true; e.preventDefault(); break;
    case 'ArrowDown':  case 's': case 'S': keys.down  = true; e.preventDefault(); break;
    case 'ArrowLeft':  case 'a': case 'A': keys.left  = true; e.preventDefault(); break;
    case 'ArrowRight': case 'd': case 'D': keys.right = true; e.preventDefault(); break;
  }
});
document.addEventListener('keyup', e => {
  switch (e.key) {
    case 'ArrowUp':    case 'w': case 'W': keys.up    = false; break;
    case 'ArrowDown':  case 's': case 'S': keys.down  = false; break;
    case 'ArrowLeft':  case 'a': case 'A': keys.left  = false; break;
    case 'ArrowRight': case 'd': case 'D': keys.right = false; break;
  }
});

// ─── Init ─────────────────────────────────────────────────────
function startGame() {
  document.getElementById('start-screen').classList.add('hidden');
  if (matrixRain) cancelAnimationFrame(matrixRain._id);

  map      = generateMap();
  player   = new Player(12, 8);
  particles= new ParticleSystem(particleCanvas);
  score    = 0; encounterCount = 0;
  updateHUD();

  // Place students on walkable, non-overlapping tiles
  students = [];
  const usedTiles = new Set();
  usedTiles.add(`${player.col},${player.row}`);

  const pool = shuffleArray([...STUDENTS]);
  let placed = 0;
  let attempts = 0;
  while (placed < 6 && attempts < 1000) {
    attempts++;
    const c = 1 + Math.floor(Math.random() * (COLS-2));
    const r = 1 + Math.floor(Math.random() * (ROWS-2));
    const key = `${c},${r}`;
    if (isSolid(map, c, r)) continue;
    if (usedTiles.has(key)) continue;
    const dist = Math.abs(c - player.col) + Math.abs(r - player.row);
    if (dist < 4) continue;
    usedTiles.add(key);
    students.push(new StudentNPC(c, r, pool[placed % pool.length]));
    placed++;
  }

  gameState = 'WORLD';
  if (!animId) gameLoop();
}

function restartGame() {
  document.getElementById('gameover-screen').classList.add('hidden');
  startGame();
}

// ─── Main Loop ────────────────────────────────────────────────
let lastTime = 0;
let inputCooldown = 0;

function gameLoop(ts = 0) {
  animId = requestAnimationFrame(gameLoop);

  if (gameState === 'START') {
    if (matrixRain) matrixRain.tick();
    return;
  }

  if (gameState !== 'WORLD') {
    particles.update();
    particles.draw();
    return;
  }

  // Input
  if (inputCooldown > 0) inputCooldown--;
  if (!player.moving && inputCooldown === 0) {
    let moved = false;
    if      (keys.up)    moved = player.tryMove( 0,-1, map);
    else if (keys.down)  moved = player.tryMove( 0, 1, map);
    else if (keys.left)  moved = player.tryMove(-1, 0, map);
    else if (keys.right) moved = player.tryMove( 1, 0, map);
    if (moved) inputCooldown = 4;
  }

  player.update();

  // Check encounters (after player stops moving)
  if (!player.moving) {
    for (const s of students) {
      if (s.interacted) continue;
      const dist = Math.abs(s.col - player.col) + Math.abs(s.row - player.row);
      if (dist === 1) {
        // Face each other — small pause then encounter
        triggerEncounter(s);
        break;
      }
    }
  }

  students.forEach(s => s.update(player.col, player.row));

  // Draw world
  drawWorld();
  particles.update();
  particles.draw();
}

// ─── World Drawing ────────────────────────────────────────────
function drawWorld() {
  const ctx = gCtx;
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

  // Tile layer
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x = c * TILE, y = r * TILE;
      tileRenderers[map[r][c]](ctx, x, y);
    }
  }

  // Y-sort sprites
  const sprites = [
    { y: player.y, draw: () => player.drawOn(ctx, null) },
    ...students.map(s => ({ y: s.y, draw: () => s.drawOn(ctx, null) })),
  ];
  sprites.sort((a, b) => a.y - b.y).forEach(s => s.draw());

  // Mini-glow under player
  ctx.save();
  ctx.shadowBlur = 0;
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = '#00ff88';
  ctx.beginPath();
  ctx.ellipse(
    player.x + TILE/2, player.y + TILE - 4,
    TILE/3, 4, 0, 0, Math.PI*2
  );
  ctx.fill();
  ctx.restore();
}

// ─── Encounter Trigger ────────────────────────────────────────
function triggerEncounter(student) {
  if (gameState !== 'WORLD') return;
  gameState = 'ENCOUNTER';
  currentStudent = student;
  student.interacted = true;
  encounterCount++;

  // Pick 3 random feedback options
  const shuffled = shuffleArray(FEEDBACK_POOL);
  feedbackChoices = shuffled.slice(0, 3);

  // Update encounter UI
  document.getElementById('student-name-display').textContent = student.data.name;
  const file = pickRandom(student.data.files);
  document.getElementById('speech-text').textContent = `Hier ist mein ${file}! 📁`;

  feedbackChoices.forEach((f, i) => {
    const btn = document.getElementById(`btn-${i}`);
    btn.textContent = f[0];
    btn.className   = `feedback-btn ${f[2]}`;
  });

  drawEncounterStudent(document.getElementById('student-avatar'), student.data);
  drawEncounterBjoern(document.getElementById('bjoern-avatar'));

  // Show UI
  const ui = document.getElementById('encounter-ui');
  ui.classList.remove('hidden');
  ui.classList.add('appearing');
  document.getElementById('feedback-options').classList.remove('hidden');
  document.getElementById('feedback-result').classList.add('hidden');

  updateHUD();
}

// ─── Feedback Selection ───────────────────────────────────────
function selectFeedback(idx) {
  if (gameState !== 'ENCOUNTER') return;
  const choice = feedbackChoices[idx];
  const pts    = choice[1];
  const react  = choice[3];

  score += pts;
  if (score < 0) score = 0;
  updateHUD();

  // Particle burst at player position
  if (pts > 0) {
    particles.burst(player.x + TILE/2, player.y + TILE/2, 40);
  }

  // Show result
  document.getElementById('feedback-options').classList.add('hidden');
  const result = document.getElementById('feedback-result');
  result.classList.remove('hidden');
  document.getElementById('result-text').textContent = react;
  const pEl = document.getElementById('points-gained');
  pEl.textContent = pts > 0 ? `+${pts} Sympathiepunkte!` : `${pts} Sympathiepunkte`;
  pEl.style.color = pts > 0 ? 'var(--cyan)' : '#ff4444';
  pEl.style.textShadow = pts > 0 ? '0 0 20px var(--cyan)' : '0 0 20px #ff4444';

  // Auto-close after 1.8s
  setTimeout(closeEncounter, 1800);
}

function closeEncounter() {
  document.getElementById('encounter-ui').classList.add('hidden');
  gameState = 'WORLD';

  // Check if all students interacted
  const remaining = students.filter(s => !s.interacted).length;
  if (remaining === 0) {
    setTimeout(showGameOver, 600);
  }
}

// ─── HUD Update ───────────────────────────────────────────────
function updateHUD() {
  document.getElementById('score-value').textContent   = score;
  document.getElementById('encounter-count').textContent = encounterCount;
  const maxScore = FEEDBACK_POOL.reduce((s, f) => s + Math.max(0, f[1]), 0) * 0.6;
  const pct = Math.min(100, (score / maxScore) * 100);
  document.getElementById('score-bar').style.width = pct + '%';
}

// ─── Game Over ────────────────────────────────────────────────
function showGameOver() {
  gameState = 'GAMEOVER';
  document.getElementById('final-score').textContent = score;

  let rank = '';
  if      (score >= 200) rank = '🏆 LEGENDARY TEACHER';
  else if (score >= 150) rank = '⭐ SENIOR DEVELOPER';
  else if (score >= 100) rank = '✅ SOLID INSTRUCTOR';
  else if (score >= 50)  rank = '📖 LEARNING...';
  else                   rank = '🍝 SPAGHETTI-FEEDBACK';

  document.getElementById('gameover-rank').textContent = rank;
  document.getElementById('gameover-screen').classList.remove('hidden');
}

// ─── Start Screen Matrix ──────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  const matrixEl = document.getElementById('matrix-bg');
  matrixRain = new MatrixRain(matrixEl);

  // Animate start screen matrix
  function rainLoop() {
    if (gameState === 'START') {
      matrixRain.tick();
      matrixRain._id = requestAnimationFrame(rainLoop);
    }
  }
  rainLoop();
});
