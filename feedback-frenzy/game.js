/* ═══════════════════════════════════════════════════════════════
   FEEDBACK-FRENZY: BJÖRN'S DEVELOPER AKADEMIE  v2.0
   Core Game Engine — game.js
   ═══════════════════════════════════════════════════════════════ */

'use strict';

let TILE=32; const COLS=25, ROWS=17; let CANVAS_W=800, CANVAS_H=640;

const AVATAR_IMAGES = {
  bjoern: { img: new Image(), loaded: false }
};
AVATAR_IMAGES.bjoern.img.onload = () => { AVATAR_IMAGES.bjoern.loaded = true; };
AVATAR_IMAGES.bjoern.img.onerror = () => { AVATAR_IMAGES.bjoern.loaded = false; };
AVATAR_IMAGES.bjoern.img.src = encodeURI('assets/avatar/björn-avatar.png');

/* ── Echte DA-Projekte (mit projekt-spezifischen Björn-Sprüchen) ── */
const DA_PROJECTS = [
  {
    name: "Sakura Ramen", student: "Kevin",
    description: "Preisliste für chinesischen Nudelladen – Frontend",
    quality: "ok",
    bjoernFeedback: [
      { intro: "Jaaaa mega! Also dann sind wir da auch fertig.",
        critique: null, points: 55, type: "praise" },
      { intro: "Ja, richtig solide!",
        critique: "Weißt du – die Filterlogik für die Speisekarte, da wär's schön wenn du sprechende Variablen hast statt 'x' und 'tmp'. Was ist das? Ich weiß es nicht.",
        points: 38, type: "coach" },
      { intro: "Ehm, ja, also das Ding ist…",
        critique: "Hier fehlen überall noch die Kommentare. Und auf dem Handy bricht das Layout komplett weg – kein Media Query, kein Plan.",
        points: 12, type: "roast-kind" },
    ]
  },
  {
    name: "Bookstore", student: "Lena",
    description: "Online-Buchhandlung – Frontend",
    quality: "ok",
    bjoernFeedback: [
      { intro: "Jaaaa, mega sauber! Dann sind wir hier fertig. Also ja, Top Projekt!",
        critique: null, points: 58, type: "praise" },
      { intro: "Ja, sehr solide!",
        critique: "Weißt du was mich stört? Die Suche – jeder Tastendruck feuert einen Fetch. Pack da eine DEBOUNCE_DELAY Variable rein, 300ms, dann sparst du dir 50 unnötige API-Calls.",
        points: 42, type: "coach" },
      { intro: "Ehm ja aber weißt du, ehm, also das Ding ist…",
        critique: "Der Warenkorb verliert alles beim Reload. localStorage wäre hier wirklich dein Freund. Das ist eine Zeile Code.",
        points: 10, type: "roast-kind" },
    ]
  },
  {
    name: "Bestellapp", student: "Max",
    description: "Lieferando-Klon – Frontend",
    quality: "chaos",
    bjoernFeedback: [
      { intro: "Alter, das ist so geil! Dann sind wir da fertig. Ja, also ja, Top Projekt!",
        critique: null, points: 60, type: "praise" },
      { intro: "Ja, guter Ansatz!",
        critique: "Die Lieferzeit ist hardgecodet als 45. Mach daraus eine MAX_DELIVERY_TIME Konstante – und lass die konfigurierbar sein.",
        points: 30, type: "coach" },
      { intro: "Ehm ja, also das Ding ist…",
        critique: "Ich kann beim Checkout minus-drei Portionen bestellen. Kein Minimum, keine Validierung. Viel Spaß mit dem Lager.",
        points: 8, type: "roast-kind" },
    ]
  },
  {
    name: "Pokedex", student: "Tim",
    description: "Pokémon-Enzyklopädie mit PokéAPI – Frontend",
    quality: "clean",
    bjoernFeedback: [
      { intro: "Jaaaa mega! Das läuft richtig smooth. Also ja, Top Projekt und viel Spaß weiterhin!",
        critique: null, points: 62, type: "praise" },
      { intro: "Richtig schick!",
        critique: "Du fetchst bei jeder Suche fresh von der API. Pack eine POKEMON_CACHE Variable als Map rein – Pikachu muss nicht jedes Mal neu laden.",
        points: 45, type: "coach" },
      { intro: "Ehm ja, also das Ding ist…",
        critique: "Hier fehlen überall noch die Kommentare. Und wenn die API offline ist, passiert einfach nichts. Ein einfaches try/catch wär schön.",
        points: 18, type: "roast-kind" },
    ]
  },
  {
    name: "El Polo Loco", student: "Pascal",
    description: "Jump-'n'-Run Browsergame – Vanilla JS",
    quality: "clean",
    bjoernFeedback: [
      { intro: "Jaaaa mega! Ein Browser-Game – dann sind wir da auch fertig. Ja, also ja, absolute Top-Leistung!",
        critique: null, points: 68, type: "praise" },
      { intro: "Richtig cool!",
        critique: "Schau mal – die Spielgeschwindigkeit ist hardgecodet. Eine GAME_SPEED Konstante, und du kannst Schwierigkeitsgrade einbauen ohne im Code zu graben.",
        points: 48, type: "coach" },
      { intro: "Ehm ja aber weißt du, also das Ding ist…",
        critique: "Bei 144Hz fliegt der Spieler doppelt so schnell. deltaTime in der Gameloop, du kennst das – oder kennst du's noch nicht? Schau's dir an.",
        points: 20, type: "roast-kind" },
    ]
  },
  {
    name: "Portfolio", student: "Julia",
    description: "Persönliche Portfolio-Seite – Frontend",
    quality: "ok",
    bjoernFeedback: [
      { intro: "Jaaaa, mega schön geworden! Dann sind wir hier fertig. Ja, also ja, Top Projekt!",
        critique: null, points: 55, type: "praise" },
      { intro: "Ja, sehr schön!",
        critique: "Die Projekte-Sektion ist hardgecodet im HTML. Pack die in ein PROJECTS_DATA Array in JavaScript – dann kannst du neue Projekte adden ohne im Markup zu wühlen.",
        points: 40, type: "coach" },
      { intro: "Ehm ja, also das Ding ist…",
        critique: "Der Dark-Mode Toggle funktioniert nur auf der Startseite. Und hier fehlen überall noch die CSS-Kommentare – was macht dieser Block eigentlich?",
        points: 14, type: "roast-kind" },
    ]
  },
  {
    name: "JOIN", student: "Emma",
    description: "Kanban-Board – Fullstack",
    quality: "clean",
    bjoernFeedback: [
      { intro: "Jaaaa, mega geil! Fullstack-Kanban – dann sind wir hier definitiv fertig. Absolut Top!",
        critique: null, points: 70, type: "praise" },
      { intro: "Sehr stark!",
        critique: "Die Task-Prioritäten als Magic Strings 'low', 'medium', 'high' – mach daraus ein PRIORITY_LEVELS Objekt. Dann tippst du dich nicht mehr zu Tode.",
        points: 50, type: "coach" },
      { intro: "Ehm ja aber weißt du, ehm, also das Ding ist…",
        critique: "Hier fehlen überall noch die Kommentare, vor allem im Backend. Was macht dieser Middleware-Block? Ich rate jetzt einfach mal.",
        points: 22, type: "roast-kind" },
    ]
  },
  {
    name: "Coderr", student: "Sarah",
    description: "Freelancer-Plattform – Backend",
    quality: "clean",
    bjoernFeedback: [
      { intro: "Jaaaa mega! Eine Freelancer-Plattform, das ist schon fast production-ready. Ja, also ja, Top!",
        critique: null, points: 65, type: "praise" },
      { intro: "Richtig sauber!",
        critique: "Die Bewerbungs-Logik – pack da eine MAX_APPLICATIONS_PER_USER Konstante rein. Sonst flutet ein User alles und du weißt warum das ein Problem ist.",
        points: 46, type: "coach" },
      { intro: "Ehm ja, also das Ding ist…",
        critique: "Ich lese den Serializer und verstehe nicht was der validiert. Kommentare! Hier fehlen überall noch die Kommentare.",
        points: 18, type: "roast-kind" },
    ]
  },
  {
    name: "Quizly", student: "Max",
    description: "KI-generierte Quizzes aus YouTube-Videos",
    quality: "clean",
    bjoernFeedback: [
      { intro: "Jaaaa mega innovativ! KI plus YouTube – dann sind wir da fertig. Ja, also ja, wirklich Top!",
        critique: null, points: 72, type: "praise" },
      { intro: "Super Idee!",
        critique: "Die Anzahl generierter Fragen ist hardgecodet als 5. Mach daraus eine QUIZ_QUESTION_COUNT Variable – dann ist das konfigurierbar per Userwunsch.",
        points: 52, type: "coach" },
      { intro: "Ehm ja aber weißt du, also das Ding ist…",
        critique: "Der API-Key steckt direkt im Frontend-Code. Den sieht jetzt jeder im DevTools. Move das sofort ins Backend, da gehört das hin.",
        points: 6, type: "roast-kind" },
    ]
  },
  {
    name: "Videoflix", student: "Lena",
    description: "Netflix-Klon – Backend",
    quality: "chaos",
    bjoernFeedback: [
      { intro: "Jaaaa mega! Ein Netflix-Backend, das ist wirklich geil. Ja, also ja, Top Projekt!",
        critique: null, points: 65, type: "praise" },
      { intro: "Ja, sehr stark!",
        critique: "Die Video-Auflösungen sind hardgecodet. Pack die in ein AVAILABLE_RESOLUTIONS Array – dann ist das konfigurierbar und du musst nicht im Code graben.",
        points: 44, type: "coach" },
      { intro: "Ehm ja, also das Ding ist…",
        critique: "Byte-Range-Requests sind nicht implementiert. Das heißt: kein Scrubben im Video, kein Skip. Das ist kein Streaming, das ist ein langer Download.",
        points: 16, type: "roast-kind" },
    ]
  },
];

/* ── Gadgets

/* ── Gadgets ──────────────────────────────────────────────────── */
const GADGETS = [
  { name: "Kaffee-Thermobecher ☕",            effect: "Björn ist hyper fokussiert! +20 Bonus auf nächstes Feedback.", bonus: 20 },
  { name: "Post-it 'Done > perfect' 📝",       effect: "Erinnerung aktiviert! +15 Bonus auf nächstes Feedback.",       bonus: 15 },
  { name: "Clean-Code-Buch 📖",               effect: "Du erkennst sofort Code-Smells! +25 Bonus.",                    bonus: 25 },
  { name: "Kahootquiz 📝",                   effect: "Björn hat ein neues Kahoot quiz gebaut! +10 Bonus.",                   bonus: 10 },
  { name: "Laptop-Aufkleber-Set 💻",          effect: "Schüler sind begeistert! +18 Bonus.",                           bonus: 18 },
  { name: "Extra Kreide 🖊",                   effect: "Björn erklärt nochmal an der Tafel. +12 Bonus.",                bonus: 12 },
];

/* ── Students ─────────────────────────────────────────────────── */
const STUDENTS = [
  { name: "Daniel",    color: "#4488ff", skinTone: "#f5c5a3", hairColor: "#3a2010", shirtColor: "#4488ff", emoji: "😅" },
  { name: "Adam",   color: "#ff88cc", skinTone: "#f5d0a9", hairColor: "#5c3317", shirtColor: "#cc55aa", emoji: "🤓" },
  { name: "Patrick",  color: "#ff8844", skinTone: "#f5e0c8", hairColor: "#222222", shirtColor: "#cc4400", emoji: "😬" },
  { name: "Yunus",  color: "#88ffcc", skinTone: "#c8a87a", hairColor: "#1a0a00", shirtColor: "#229966", emoji: "🙂" },
  { name: "Sascha",    color: "#ffcc44", skinTone: "#f5d0a9", hairColor: "#8b5e3c", shirtColor: "#cc9900", emoji: "😤" },
  { name: "Mo",  color: "#cc88ff", skinTone: "#f5d0a9", hairColor: "#2c1a0e", shirtColor: "#8844dd", emoji: "😊" },
  { name: "Manu", color: "#44ffff", skinTone: "#f0c8a0", hairColor: "#1a1a1a", shirtColor: "#008888", emoji: "🤔" },
  { name: "Kaja",   color: "#ff4488", skinTone: "#f5e8d5", hairColor: "#6b3a1f", shirtColor: "#cc2266", emoji: "💪" },
];

/* ── Buildings ────────────────────────────────────────────────── */
const BUILDINGS = [
  { id: 'cafe',    name: "☕ Kaffee-Ecke",    col: 2,  row: 2,  w: 4, h: 3, color: "#5c3317", roofColor: "#8b4513", doorCol: 4,  doorRow: 4  },
  { id: 'campus',  name: "📚 Campus - DA",     col: 10, row: 1,  w: 5, h: 3, color: "#1a3355", roofColor: "#234488", doorCol: 12, doorRow: 3  },
  { id: 'lab',     name: "💻 Code-Lab",        col: 18, row: 2,  w: 4, h: 3, color: "#0a2a0a", roofColor: "#1a5c1a", doorCol: 20, doorRow: 4  },
  { id: 'lounge',  name: "� DA-Discord",       col: 3,  row: 10, w: 4, h: 3, color: "#5865F2", roofColor: "#4752c4", doorCol: 5,  doorRow: 12 },
  { id: 'server',  name: "🖥 Server-Raum",     col: 18, row: 11, w: 4, h: 3, color: "#001a1a", roofColor: "#004444", doorCol: 20, doorRow: 13 },
];
let buildingGadgets = {};

/* ── Map (0=floor 1=wall 2=RAM 3=cap 4=trace 5=building 6=door) ── */
function generateMap() {
  const map = [];
  for (let r = 0; r < ROWS; r++) map.push(new Array(COLS).fill(0));
  for (let c = 0; c < COLS; c++) { map[0][c] = 1; map[ROWS-1][c] = 1; }
  for (let r = 0; r < ROWS; r++) { map[r][0] = 1; map[r][COLS-1] = 1; }
  [[1,1],[1,10],[1,19],[7,3],[7,14],[12,7],[12,18]].forEach(([r,c]) => {
    for (let dr = 0; dr < 2; dr++)
      for (let dc = 0; dc < 3; dc++)
        if (r+dr < ROWS-1 && c+dc < COLS-1) map[r+dr][c+dc] = 2;
  });
  [[4,6],[4,13],[8,2],[8,20],[13,4],[13,12],[15,8],[15,20]].forEach(([r,c]) => {
    if (r < ROWS-1 && c < COLS-1) map[r][c] = 3;
  });
  [3,6,9,12,15].forEach(r => { for (let c=1;c<COLS-1;c++) if(map[r][c]===0) map[r][c]=4; });
  [4,8,12,16,20].forEach(c => { for (let r=1;r<ROWS-1;r++) if(map[r][c]===0) map[r][c]=4; });
  BUILDINGS.forEach(b => {
    for (let dr=0;dr<b.h;dr++) for (let dc=0;dc<b.w;dc++) { const r=b.row+dr,c=b.col+dc; if(r<ROWS&&c<COLS) map[r][c]=5; }
    if (b.doorRow<ROWS&&b.doorCol<COLS) map[b.doorRow][b.doorCol]=6;
  });
  return map;
}

/* ── Tile Renderers ───────────────────────────────────────────── */
const tileRenderers = {
  0: (ctx,x,y) => { ctx.fillStyle='#0a1a0d'; ctx.fillRect(x,y,TILE,TILE); ctx.strokeStyle='rgba(0,80,30,0.3)'; ctx.lineWidth=0.5; ctx.strokeRect(x+.5,y+.5,TILE-1,TILE-1); },
  1: (ctx,x,y) => { ctx.fillStyle='#0d1a0e'; ctx.fillRect(x,y,TILE,TILE); ctx.fillStyle='#1a2e1b'; ctx.fillRect(x+3,y+3,TILE-6,TILE-6); ctx.strokeStyle='#00ff8866'; ctx.lineWidth=1; ctx.strokeRect(x+3,y+3,TILE-6,TILE-6); ctx.fillStyle='#003310'; for(let i=0;i<3;i++) ctx.fillRect(x+6,y+9+i*6,TILE-12,2); },
  2: (ctx,x,y) => { ctx.fillStyle='#0c1f12'; ctx.fillRect(x,y,TILE,TILE); ctx.fillStyle='#153d1e'; ctx.fillRect(x+2,y+2,TILE-4,TILE-4); ctx.strokeStyle='#00ff88aa'; ctx.lineWidth=1; ctx.strokeRect(x+2,y+2,TILE-4,TILE-4); ctx.fillStyle='#00cc5588'; for(let i=0;i<5;i++){ctx.fillRect(x+4+i*5,y+TILE-5,3,4);ctx.fillRect(x+4+i*5,y+1,3,4);} ctx.shadowBlur=6; ctx.shadowColor='#00ff88'; ctx.strokeStyle='#00ff8844'; ctx.strokeRect(x+2,y+2,TILE-4,TILE-4); ctx.shadowBlur=0; },
  3: (ctx,x,y) => { ctx.fillStyle='#0a1a0d'; ctx.fillRect(x,y,TILE,TILE); const cx=x+TILE/2,cy=y+TILE/2; ctx.beginPath(); ctx.arc(cx,cy,9,0,Math.PI*2); ctx.fillStyle='#1a3322'; ctx.fill(); ctx.strokeStyle='#00ff88'; ctx.lineWidth=1.5; ctx.shadowBlur=8; ctx.shadowColor='#00ff88'; ctx.stroke(); ctx.shadowBlur=0; ctx.fillStyle='#00ff88aa'; ctx.fillRect(cx-1,cy-5,2,10); ctx.fillRect(cx-5,cy-1,10,2); },
  4: (ctx,x,y) => { ctx.fillStyle='#081508'; ctx.fillRect(x,y,TILE,TILE); ctx.shadowBlur=12; ctx.shadowColor='#00ff44'; ctx.fillStyle='#00aa44'; ctx.fillRect(x+13,y,6,TILE); ctx.fillRect(x,y+13,TILE,6); ctx.fillStyle='#00ff88'; ctx.fillRect(x+14,y,4,TILE); ctx.fillRect(x,y+14,TILE,4); ctx.shadowBlur=0; },
  5: (ctx,x,y) => { ctx.fillStyle='#050d08'; ctx.fillRect(x,y,TILE,TILE); },
  6: (ctx,x,y) => {
    ctx.fillStyle='#0a1a0d'; ctx.fillRect(x,y,TILE,TILE);
    ctx.shadowBlur=10; ctx.shadowColor='#ffcc00'; ctx.strokeStyle='#ffcc0099'; ctx.lineWidth=2; ctx.strokeRect(x+6,y+4,TILE-12,TILE-6); ctx.shadowBlur=0;
    ctx.fillStyle='#332200'; ctx.fillRect(x+7,y+5,TILE-14,TILE-8);
    ctx.fillStyle='#ffcc00'; ctx.beginPath(); ctx.arc(x+TILE-10,y+TILE/2,2,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#ffcc00aa'; ctx.font='7px monospace'; ctx.fillText('▶',x+TILE/2-4,y+TILE-6);
  },
};

function drawBuildings(ctx) {
  BUILDINGS.forEach(b => {
    const x=b.col*TILE, y=b.row*TILE, w=b.w*TILE, h=b.h*TILE;
    ctx.fillStyle='rgba(0,0,0,0.4)'; ctx.fillRect(x+4,y+4,w,h);
    ctx.fillStyle=b.color; ctx.fillRect(x,y,w,h);
    ctx.fillStyle=b.roofColor; ctx.fillRect(x,y,w,8);
    ctx.shadowBlur=15; ctx.shadowColor=b.color; ctx.strokeStyle=b.color+'cc'; ctx.lineWidth=2; ctx.strokeRect(x+1,y+1,w-2,h-2); ctx.shadowBlur=0;
    ctx.fillStyle='#ffffaa22';
    for (let wi=0;wi<b.w-1;wi++) { ctx.fillRect(x+6+wi*TILE,y+12,TILE-10,10); ctx.strokeStyle='#ffff8844'; ctx.lineWidth=1; ctx.strokeRect(x+6+wi*TILE,y+12,TILE-10,10); }
    ctx.fillStyle='#ffffffcc'; ctx.font="bold 8px 'Share Tech Mono',monospace"; ctx.textAlign='center'; ctx.fillText(b.name,x+w/2,y+h/2+3); ctx.textAlign='left';
    if (buildingGadgets[b.id]) { ctx.shadowBlur=8; ctx.shadowColor='#ffdd00'; ctx.font='12px serif'; ctx.fillText('💎',x+w-14,y+10); ctx.shadowBlur=0; }
  });
}

function isSolid(map,col,row) { if(col<0||col>=COLS||row<0||row>=ROWS) return true; const t=map[row][col]; return t===1||t===2||t===3||t===5; }
function getBuildingAtDoor(col,row) { return BUILDINGS.find(b=>b.doorCol===col&&b.doorRow===row)||null; }

/* ── Particles ────────────────────────────────────────────────── */
class ParticleSystem {
  constructor(canvas) { this.canvas=canvas; this.ctx=canvas.getContext('2d'); this.particles=[]; }
  burst(wx,wy,count=30,color=null) {
    for (let i=0;i<count;i++) {
      const angle=Math.random()*Math.PI*2, speed=1+Math.random()*4;
      this.particles.push({ x:wx, y:wy+TILE*2.5, vx:Math.cos(angle)*speed, vy:Math.sin(angle)*speed-2,
        life:1, decay:.015+Math.random()*.02, char:Math.random()>.5?'1':'0',
        size:10+Math.random()*6, hue:color?null:(120+Math.floor(Math.random()*60)), color });
    }
  }
  update() { this.particles=this.particles.filter(p=>p.life>0); this.particles.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.08;p.life-=p.decay;}); }
  draw() {
    const ctx=this.ctx; ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    this.particles.forEach(p=>{ctx.globalAlpha=p.life;ctx.fillStyle=p.color||`hsl(${p.hue},100%,60%)`;ctx.font=`bold ${p.size}px monospace`;ctx.shadowBlur=8;ctx.shadowColor=p.color||`hsl(${p.hue},100%,70%)`;ctx.fillText(p.char,p.x,p.y);});
    ctx.globalAlpha=1; ctx.shadowBlur=0;
  }
}

/* ── Player ───────────────────────────────────────────────────── */
class Player {
  constructor(col,row) { this.col=col;this.row=row;this.x=col*TILE;this.y=row*TILE;this.tx=this.x;this.ty=this.y;this.moving=false;this.moveTimer=0;this.MOVE_DUR=10;this.dir=2;this.animFrame=0;this.animTimer=0; }
  tryMove(dc,dr,map) {
    if (this.moving) return false;
    const nc=this.col+dc, nr=this.row+dr;
    if (isSolid(map,nc,nr)) return false;
    this.col=nc; this.row=nr; this.tx=nc*TILE; this.ty=nr*TILE; this.moving=true; this.moveTimer=0;
    if(dr<0)this.dir=0; else if(dc>0)this.dir=1; else if(dr>0)this.dir=2; else if(dc<0)this.dir=3;
    return true;
  }
  update() {
    if (this.moving) {
      this.moveTimer++; const t=this.moveTimer/this.MOVE_DUR;
      this.x=lerp(this.x,this.tx,Math.min(t*2,1)); this.y=lerp(this.y,this.ty,Math.min(t*2,1));
      if(this.moveTimer>=this.MOVE_DUR){this.x=this.tx;this.y=this.ty;this.moving=false;}
      this.animTimer++; if(this.animTimer%8===0) this.animFrame=(this.animFrame+1)%4;
    }
  }
  drawOn(ctx) {
    const px=Math.round(this.x), py=Math.round(this.y);
    const cx=px+TILE/2, cy=py+TILE/2;
    ctx.save(); ctx.shadowBlur=20; ctx.shadowColor='#00ff88';
    drawBjoernSprite(ctx, cx, cy-4, this.dir, this.animFrame);
    ctx.restore();
    if (AVATAR_IMAGES.bjoern.loaded) {
      const img=AVATAR_IMAGES.bjoern.img;
      const s=TILE/32, r=Math.round(10*s);
      const hx=cx, hy=cy-4-12*s;
      ctx.save();
      ctx.beginPath(); ctx.arc(hx, hy, r, 0, Math.PI*2); ctx.clip();
      const imgSc=Math.max(r*2/img.width, r*2/img.height);
      ctx.drawImage(img, hx-img.width*imgSc/2, hy-img.height*imgSc/2, img.width*imgSc, img.height*imgSc);
      ctx.restore();
    }
  }
}

/* ── NPC ──────────────────────────────────────────────────────── */
class StudentNPC {
  constructor(col,row,data) {
    this.col=col; this.row=row; this.x=col*TILE; this.y=row*TILE; this.data=data;
    this.animFrame=0; this.animTimer=0; this.bobPhase=Math.random()*Math.PI*2; this.interacted=false; this.exclamation=0;
    const myP=DA_PROJECTS.filter(p=>p.student===data.name);
    this.project=pickRandom(myP.length?myP:DA_PROJECTS);
  }
  update(pc,pr) {
    this.animTimer++; if(this.animTimer%12===0) this.animFrame=(this.animFrame+1)%4;
    this.bobPhase+=.05;
    const dist=Math.abs(this.col-pc)+Math.abs(this.row-pr);
    if(dist===1&&!this.interacted) this.exclamation=2;
    else if(this.exclamation>0) this.exclamation=Math.max(0,this.exclamation-.05);
  }
  drawOn(ctx) {
    const px=Math.round(this.x), py=Math.round(this.y)+Math.sin(this.bobPhase)*2;
    ctx.save(); ctx.shadowBlur=this.exclamation>0?20:10; ctx.shadowColor=this.data.color;
    drawStudentSprite(ctx,px+TILE/2,py+TILE/2-4,this.data);
    if(this.exclamation>.1){ctx.globalAlpha=Math.min(1,this.exclamation);ctx.font='bold 16px monospace';ctx.fillStyle='#ffdd00';ctx.shadowBlur=10;ctx.shadowColor='#ffdd00';ctx.fillText('!',px+TILE/2-4,py-14);}
    ctx.restore();
  }
}

/* ── Björn Sprite ─────────────────────────────────────────────── */
function drawBjoernSprite(ctx,cx,cy,dir,frame,sOv) {
  const s=sOv!==undefined?sOv:TILE/32;
  ctx.save();
  ctx.translate(cx,cy); ctx.scale(s,s);
  ctx.globalAlpha=.25; ctx.fillStyle='#00ff88'; ctx.beginPath(); ctx.ellipse(0,14,10,4,0,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1;
  const lo=frame%2===0?3:-3;
  ctx.fillStyle='#1a1a3a'; ctx.fillRect(-6,8,5,8+lo); ctx.fillRect(1,8,5,8-lo);
  ctx.fillStyle='#111'; ctx.fillRect(-7,15+lo,7,3); ctx.fillRect(0,15-lo,7,3);
  ctx.fillStyle='#1a4480'; ctx.fillRect(-9,-2,18,12);
  ctx.fillStyle='#112255';
  ctx.beginPath(); ctx.moveTo(-9,-2); ctx.lineTo(-2,2); ctx.lineTo(-2,10); ctx.lineTo(-9,10); ctx.fill();
  ctx.beginPath(); ctx.moveTo(9,-2); ctx.lineTo(2,2); ctx.lineTo(2,10); ctx.lineTo(9,10); ctx.fill();
  ctx.fillStyle='#ffffff'; ctx.fillRect(-2,-2,4,5);
  ctx.fillStyle='#cc2222'; ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(-2,3); ctx.lineTo(0,9); ctx.lineTo(2,3); ctx.closePath(); ctx.fill();
  ctx.fillStyle='#f5c8a0'; ctx.beginPath(); ctx.arc(0,-12,10,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#d4a87866'; ctx.fillRect(-7,-7,14,5);
  ctx.fillStyle='#3a2010'; ctx.fillRect(-10,-22,20,12); ctx.fillRect(-11,-18,3,6); ctx.fillRect(8,-18,3,6); ctx.fillRect(-2,-24,4,4);
  ctx.fillStyle='#f5c8a0'; ctx.fillRect(-12,-14,3,5); ctx.fillRect(9,-14,3,5);
  const eo=dir===3?-2:dir===1?2:0;
  ctx.fillStyle='#1a1a1a'; ctx.fillRect(-5+eo,-14,3,3); ctx.fillRect(2+eo,-14,3,3);
  ctx.strokeStyle='#cccccc'; ctx.lineWidth=1.5; ctx.shadowBlur=4; ctx.shadowColor='#aaaaff';
  ctx.strokeRect(-6+eo,-15,5,4); ctx.strokeRect(1+eo,-15,5,4);
  ctx.beginPath(); ctx.moveTo(-1+eo,-13); ctx.lineTo(1+eo,-13); ctx.stroke(); ctx.shadowBlur=0;
  ctx.strokeStyle='#88442288'; ctx.lineWidth=1; ctx.beginPath(); ctx.arc(eo,-8,4,.1,Math.PI-.1); ctx.stroke();
  ctx.restore();
}

/* ── Student Sprite ───────────────────────────────────────────── */
function drawStudentSprite(ctx,cx,cy,data,sOv) {
  const s=sOv!==undefined?sOv:TILE/32;
  ctx.save();
  ctx.translate(cx,cy); ctx.scale(s,s);
  ctx.globalAlpha=.2; ctx.fillStyle=data.color; ctx.beginPath(); ctx.ellipse(0,14,9,3,0,0,Math.PI*2); ctx.fill(); ctx.globalAlpha=1;
  ctx.fillStyle='#222244'; ctx.fillRect(-5,8,4,8); ctx.fillRect(1,8,4,8);
  ctx.fillStyle='#111'; ctx.fillRect(-6,15,6,3); ctx.fillRect(0,15,6,3);
  ctx.fillStyle=data.shirtColor; ctx.fillRect(-8,-2,16,12);
  ctx.fillStyle=data.shirtColor+'88'; ctx.fillRect(-3,4,6,5);
  ctx.fillStyle=data.skinTone; ctx.beginPath(); ctx.arc(0,-11,9,0,Math.PI*2); ctx.fill();
  ctx.fillStyle=data.hairColor; ctx.fillRect(-9,-20,18,11); ctx.fillRect(-10,-16,3,5); ctx.fillRect(7,-16,3,5);
  ctx.fillStyle=data.skinTone; ctx.fillRect(-11,-13,3,5); ctx.fillRect(8,-13,3,5);
  ctx.fillStyle='#222'; ctx.fillRect(-4,-13,3,3); ctx.fillRect(1,-13,3,3);
  ctx.font='9px serif'; ctx.fillText(data.emoji,3,-6);
  ctx.restore();
}

/* ── Encounter Avatars ────────────────────────────────────────── */
function drawEncounterBjoern(canvas) {
  const ctx=canvas.getContext('2d'), w=canvas.width, h=canvas.height;
  ctx.clearRect(0,0,w,h);
  ctx.beginPath(); ctx.arc(w/2,h/2,52,0,Math.PI*2); ctx.fillStyle='#00ff8822'; ctx.fill();
  ctx.strokeStyle='#00ff88'; ctx.lineWidth=2; ctx.shadowBlur=20; ctx.shadowColor='#00ff88'; ctx.stroke(); ctx.shadowBlur=0;
  if (AVATAR_IMAGES.bjoern.loaded) {
    const img = AVATAR_IMAGES.bjoern.img;
    const size = 98;
    const dx = (w - size) / 2;
    const dy = (h - size) / 2;

    // Draw the avatar image as a centered circular portrait.
    ctx.save();
    ctx.beginPath();
    ctx.arc(w/2, h/2, size/2, 0, Math.PI*2);
    ctx.closePath();
    ctx.clip();

    const scale = Math.max(size / img.width, size / img.height);
    const sw = img.width * scale;
    const sh = img.height * scale;
    const sx = dx - (sw - size) / 2;
    const sy = dy - (sh - size) / 2;
    ctx.drawImage(img, sx, sy, sw, sh);
    ctx.restore();
  } else {
    drawBjoernSprite(ctx, w/2, h/2+4.4, 2, 0, 2.2);
  }
}
function drawEncounterStudent(canvas,data) {
  const ctx=canvas.getContext('2d'), w=canvas.width, h=canvas.height;
  ctx.clearRect(0,0,w,h);
  ctx.beginPath(); ctx.arc(w/2,h/2,52,0,Math.PI*2); ctx.fillStyle=data.color+'22'; ctx.fill();
  ctx.strokeStyle=data.color; ctx.lineWidth=2; ctx.shadowBlur=20; ctx.shadowColor=data.color; ctx.stroke(); ctx.shadowBlur=0;
  drawStudentSprite(ctx, w/2, h/2+4.4, data, 2.2);
}

/* ── Utility ──────────────────────────────────────────────────── */
function lerp(a,b,t){return a+(b-a)*t;}
function pickRandom(arr){return arr[Math.floor(Math.random()*arr.length)];}
function shuffleArray(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}

/* ── Matrix Rain ──────────────────────────────────────────────── */
class MatrixRain {
  constructor(el) {
    this.canvas=document.createElement('canvas');
    Object.assign(this.canvas.style,{position:'absolute',top:0,left:0,width:'100%',height:'100%'});
    el.appendChild(this.canvas); this.ctx=this.canvas.getContext('2d');
    this.chars='01アイウエオカキクケコ<>{}[]|\\/#@!?%&*';
    this.resize(window.innerWidth, window.innerHeight);
  }
  resize(w,h) {
    this.canvas.width=w; this.canvas.height=h;
    this.cols=Math.floor(w/14); this.drops=new Array(this.cols).fill(0).map(()=>Math.random()*-50);
  }
  tick() {
    const ctx=this.ctx, w=this.canvas.width, h=this.canvas.height;
    ctx.fillStyle='rgba(3,13,6,0.07)'; ctx.fillRect(0,0,w,h);
    ctx.fillStyle='#00ff44'; ctx.font='13px monospace';
    this.drops.forEach((y,i)=>{const ch=this.chars[Math.floor(Math.random()*this.chars.length)];ctx.fillText(ch,i*14,y*14);if(y*14>h&&Math.random()>.975)this.drops[i]=0;else this.drops[i]+=.6;});
  }
}

/* ═══════════════════════════════════════════════════════════════
   GAME STATE
   ═══════════════════════════════════════════════════════════════ */
let gameState='START', map=[], player=null, students=[], particles=null, matrixRain=null, animId=null;
let score=0, encounterCount=0, activeBonus=0, currentStudent=null, feedbackChoices=[], currentProject=null;
const keys={up:false,down:false,left:false,right:false};
let inputCooldown=0;

const gameCanvas     = document.getElementById('gameCanvas');
const particleCanvas = document.getElementById('particleCanvas');
const gCtx           = gameCanvas.getContext('2d');

/* ── Canvas Init / Resize ─────────────────────────────────────── */
function initCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const HUD_H = 80;
  const availW = window.innerWidth;
  const availH = window.innerHeight - HUD_H;
  TILE = Math.max(Math.min(Math.floor(availW / COLS), Math.floor(availH / ROWS)), 16);
  CANVAS_W = COLS * TILE;
  CANVAS_H = ROWS * TILE;
  const leftOff = Math.floor((availW - CANVAS_W) / 2);
  [gameCanvas, particleCanvas].forEach(c => {
    c.width  = CANVAS_W * dpr;
    c.height = CANVAS_H * dpr;
    c.style.width  = CANVAS_W + 'px';
    c.style.height = CANVAS_H + 'px';
    c.style.left   = leftOff + 'px';
  });
  gCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  if (particles) particles.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
function onResize() {
  initCanvas();
  if (matrixRain) matrixRain.resize(window.innerWidth, window.innerHeight);
  if (player) { player.x=player.col*TILE; player.y=player.row*TILE; player.tx=player.x; player.ty=player.y; }
  students.forEach(s=>{ s.x=s.col*TILE; s.y=s.row*TILE; });
}

/* ── Keyboard ─────────────────────────────────────────────────── */
document.addEventListener('keydown', e => {
  if (gameState==='BUILDING' && (e.key==='Escape'||e.key==='e'||e.key==='E')) { closeBuildingModal(); return; }
  if (gameState!=='WORLD') return;
  switch(e.key) {
    case 'ArrowUp':    case 'w': case 'W': keys.up=true;    e.preventDefault(); break;
    case 'ArrowDown':  case 's': case 'S': keys.down=true;  e.preventDefault(); break;
    case 'ArrowLeft':  case 'a': case 'A': keys.left=true;  e.preventDefault(); break;
    case 'ArrowRight': case 'd': case 'D': keys.right=true; e.preventDefault(); break;
    case 'Enter': case ' ': case 'e': case 'E': checkDoorInteraction(); e.preventDefault(); break;
  }
});
document.addEventListener('keyup', e => {
  switch(e.key) {
    case 'ArrowUp':    case 'w': case 'W': keys.up=false;    break;
    case 'ArrowDown':  case 's': case 'S': keys.down=false;  break;
    case 'ArrowLeft':  case 'a': case 'A': keys.left=false;  break;
    case 'ArrowRight': case 'd': case 'D': keys.right=false; break;
  }
});

/* ── Init ─────────────────────────────────────────────────────── */
function startGame() {
  document.getElementById('start-screen').classList.add('hidden');
  if (matrixRain) cancelAnimationFrame(matrixRain._id);
  map=generateMap(); player=new Player(12,8); particles=new ParticleSystem(particleCanvas);
  score=0; encounterCount=0; activeBonus=0; updateHUD();

  buildingGadgets={};
  const gadgetPool=shuffleArray([...GADGETS]);
  BUILDINGS.forEach((b,i) => { if(Math.random()>.3&&gadgetPool[i]) buildingGadgets[b.id]=gadgetPool[i]; });

  students=[]; const usedTiles=new Set(); usedTiles.add(`${player.col},${player.row}`);
  BUILDINGS.forEach(b => { for(let dr=0;dr<b.h;dr++) for(let dc=0;dc<b.w;dc++) usedTiles.add(`${b.col+dc},${b.row+dr}`); });
  const pool=shuffleArray([...STUDENTS]); let placed=0, attempts=0;
  while(placed<6 && attempts<1000) {
    attempts++; const c=1+Math.floor(Math.random()*(COLS-2)), r=1+Math.floor(Math.random()*(ROWS-2));
    const key=`${c},${r}`;
    if(isSolid(map,c,r)||map[r][c]===6||usedTiles.has(key)) continue;
    if(Math.abs(c-player.col)+Math.abs(r-player.row)<4) continue;
    usedTiles.add(key); students.push(new StudentNPC(c,r,pool[placed%pool.length])); placed++;
  }
  gameState='WORLD'; if(!animId) gameLoop();
}
function restartGame() { document.getElementById('gameover-screen').classList.add('hidden'); startGame(); }

/* ── Door Interaction ─────────────────────────────────────────── */
function checkDoorInteraction() {
  if (gameState!=='WORLD') return;
  const {col,row}=player;
  for (const [dc,dr] of [[0,0],[0,-1],[0,1],[-1,0],[1,0]]) { const b=getBuildingAtDoor(col+dc,row+dr); if(b){enterBuilding(b);return;} }
}
function enterBuilding(b) {
  gameState='BUILDING';
  const descs={
    cafe:    'Der Duft von Kaffee und Burnout liegt in der Luft. Tabs vs. Spaces wird heiß diskutiert.',
    campus:  'Willkommen am Campus der Developer Akademie. Hier liegen alle Module und Projekte – wenn die Seite denn lädt.',
    lab:     '4 Monitore, 3 Red Bulls, 2 Fehler, 1 Lösung. Das Code-Lab schläft nie.',
    lounge:  'Yeezy-Boxen, Sneakers auf dem Tisch. Jemand erklärt zum 5. Mal Promises.',
    server:  'Es summt. Es blinkt. Die Infrastruktur lebt. Bitte nicht anfassen.',
  };
  document.getElementById('building-name').textContent=b.name;
  document.getElementById('building-desc').textContent=descs[b.id]||'Ein mysteriöser Raum.';
  const el=document.getElementById('building-gadget');
  if (b.id==='campus') {
    if (Math.random()<0.4) { showCampusError(el, b); } else { showCampusContent(el, b); }
  } else if (b.id==='lounge') {
    showDiscordContent(el);
  } else {
    const gadget=buildingGadgets[b.id];
    if (gadget) {
      el.innerHTML=`<div class="gadget-found"><div class="gadget-icon">💎</div><div class="gadget-name">${gadget.name}</div><div class="gadget-effect">${gadget.effect}</div><button class="gadget-collect-btn" onclick="collectGadget('${b.id}')">EINSAMMELN!</button></div>`;
    } else {
      el.innerHTML=`<div class="gadget-empty">Hier gibt's nichts mehr zu holen.</div>`;
    }
  }
  document.getElementById('building-modal').classList.remove('hidden');
}
function collectGadget(buildingId) {
  const gadget=buildingGadgets[buildingId]; if(!gadget) return;
  activeBonus+=gadget.bonus; delete buildingGadgets[buildingId];
  showToast(`${gadget.name} eingesammelt! +${gadget.bonus} Bonus aktiviert!`,'#ffcc00');
  closeBuildingModal();
}
function closeBuildingModal() {
  document.getElementById('building-modal').classList.add('hidden');
  gameState='WORLD';
  const m=document.getElementById('fake-ctx-menu'); if(m) m.remove();
}

/* ── Campus DA ────────────────────────────────────────────────── */
function showCampusError(el, b) {
  el.innerHTML=`<div class="campus-error">
    <div class="campus-error-icon">⚠️</div>
    <div class="campus-error-title">Seitenladefehler</div>
    <div class="campus-error-msg">Die Verbindung zum DA-Campus wurde unterbrochen.<br>
      <code class="campus-err-code">ERR_CONNECTION_TIMED_OUT · campus.developerakademie.de</code></div>
    <button class="campus-reload-btn" id="campus-reload-btn">↻ Neu laden</button>
    <div class="campus-error-hint">💡 Tipp: Rechtsklick auf "Neu laden" → Clean Cache</div>
  </div>`;
  const btn=document.getElementById('campus-reload-btn');
  btn.addEventListener('click', ()=>{
    btn.textContent='⌛ Verbindung wird aufgebaut…'; btn.disabled=true;
    setTimeout(()=>{ btn.textContent='↻ Neu laden'; btn.disabled=false; }, 1800);
  });
  btn.addEventListener('contextmenu', e=>{
    e.preventDefault(); e.stopPropagation();
    showCampusContextMenu(e.clientX, e.clientY, b, el);
  });
}
function showCampusContextMenu(x, y, b, el) {
  const old=document.getElementById('fake-ctx-menu'); if(old) old.remove();
  const menu=document.createElement('div');
  menu.id='fake-ctx-menu'; menu.className='fake-ctx-menu';
  menu.innerHTML=`
    <div class="ctx-item ctx-disabled">In neuem Tab öffnen</div>
    <div class="ctx-item ctx-disabled">Seite speichern…</div>
    <div class="ctx-divider"></div>
    <div class="ctx-item ctx-disabled">Drucken…</div>
    <div class="ctx-item ctx-disabled">Element untersuchen</div>
    <div class="ctx-divider"></div>
    <div class="ctx-item ctx-highlight" id="ctx-clean-cache">🧹 Clean Cache</div>`;
  menu.style.cssText=`left:${x}px;top:${y}px`;
  document.body.appendChild(menu);
  document.getElementById('ctx-clean-cache').addEventListener('click', ()=>{
    menu.remove();
    el.innerHTML=`<div class="campus-loading">🔄 Cache wird geleert… Inhalte laden…<br><span class="campus-loading-sub">Verbinde mit campus.developerakademie.de</span></div>`;
    setTimeout(()=>showCampusContent(el, b), 1600);
  });
  setTimeout(()=>{ document.addEventListener('click', ()=>{ const m=document.getElementById('fake-ctx-menu'); if(m) m.remove(); }, {once:true}); }, 50);
}
function showCampusContent(el, b) {
  const modules=[
    {name:"HTML & CSS Grundlagen",     pct:100},
    {name:"JavaScript Essentials",     pct:100},
    {name:"Git & GitHub Workflows",    pct:95 },
    {name:"React – Components & State",pct:81 },
    {name:"Node.js & Express",         pct:70 },
    {name:"Datenbanken (SQL + NoSQL)", pct:57 },
    {name:"REST-APIs & Auth (JWT)",    pct:43 },
    {name:"Deployment & Docker",       pct:19 },
  ];
  const studentProg=STUDENTS.map(s=>({
    name:s.name, color:s.color,
    pct:35+Math.floor(Math.random()*60),
  })).sort((a,b)=>b.pct-a.pct);

  const modRows=modules.map(m=>`
    <div class="campus-module">
      <span class="campus-module-name">${m.name}</span>
      <div class="campus-pbar"><div class="campus-pbar-fill" style="width:${m.pct}%;background:${m.pct===100?'#00ff88':'#00aacc'}"></div></div>
      <span class="campus-pct${m.pct===100?' pct-done':''}">${m.pct}%</span>
    </div>`).join('');

  const stuRows=studentProg.map(s=>`
    <div class="campus-student-row">
      <span class="campus-stu-name">${s.name}</span>
      <div class="campus-pbar campus-pbar-sm"><div class="campus-pbar-fill" style="width:${s.pct}%;background:${s.pct>=80?'#00ff88':s.pct>=55?'#ffcc00':'#ff8844'}"></div></div>
      <span class="campus-pct">${s.pct}%</span>
    </div>`).join('');

  const recentProjects=DA_PROJECTS.slice(0,4).map(p=>`
    <div class="campus-project-row">
      <span class="campus-proj-name">${p.name}</span>
      <span class="campus-proj-student">${p.student}</span>
      <span class="campus-proj-badge quality-${p.quality}">${{clean:'✅',ok:'🤔',chaos:'🔥'}[p.quality]}</span>
    </div>`).join('');

  const gadget=buildingGadgets[b.id];
  el.innerHTML=`<div class="campus-content">
    <div class="campus-section-title">📋 Kursmodule — Klassenfortschritt</div>
    ${modRows}
    <div class="campus-section-title">👥 Lernfortschritt Schüler</div>
    ${stuRows}
    <div class="campus-section-title">📁 Zuletzt eingereichte Projekte</div>
    ${recentProjects}
    ${gadget?`<div class="gadget-found" style="margin-top:12px"><div class="gadget-icon">💎</div><div class="gadget-name">${gadget.name}</div><div class="gadget-effect">${gadget.effect}</div><button class="gadget-collect-btn" onclick="collectGadget('${b.id}')">EINSAMMELN!</button></div>`:''}
  </div>`;
}

/* ── DA-Discord Building ──────────────────────────────────────── */
function showDiscordContent(el) {
  const VOICE_CHANNELS = ['dev-meeting-1', 'dev-meeting-2', 'dev-meeting-3'];
  const TEXT_CHANNELS  = [
    { name: 'tickets',    emoji: '💡' },
    { name: 'allgemein',  emoji: '🌍' },
    { name: 'talk',       emoji: '🗣' },
  ];

  // randomly distribute students
  const slots = [...VOICE_CHANNELS, null, null]; // null = offline
  const dist  = { 'dev-meeting-1': [], 'dev-meeting-2': [], 'dev-meeting-3': [] };
  shuffleArray([...STUDENTS]).forEach(s => {
    const ch = slots[Math.floor(Math.random() * slots.length)];
    if (ch) dist[ch].push(s);
  });

  const textHtml = TEXT_CHANNELS.map(c => `
    <div class="dc-ch dc-text">
      <span class="dc-hash">#</span>
      <span class="dc-ch-emoji">${c.emoji}</span>
      <span class="dc-ch-name">${c.name}</span>
    </div>`).join('');

  const voiceHtml = VOICE_CHANNELS.map((ch,i) => {
    const members = dist[ch];
    const isActive = members.length > 0;
    const memberHtml = members.map(m => `
      <div class="dc-voice-member">
        <div class="dc-member-av" style="background:${m.color}">${m.emoji}</div>
        <span class="dc-member-name">${m.name}</span>
        <span class="dc-member-mic">🎤</span>
      </div>`).join('');
    return `
    <div class="dc-ch dc-voice ${isActive?'dc-voice-active':''}">
      <svg class="dc-voice-icon" viewBox="0 0 16 16" fill="currentColor" width="14" height="14"><path d="M12 8a4 4 0 0 1-4 4 4 4 0 0 1-4-4V4a4 4 0 0 1 4-4 4 4 0 0 1 4 4v4zm-1.5 0V4A2.5 2.5 0 0 0 8 1.5 2.5 2.5 0 0 0 5.5 4v4A2.5 2.5 0 0 0 8 10.5 2.5 2.5 0 0 0 10.5 8zM7 14.5v-1.52A6 6 0 0 1 2 7H3.5a4.5 4.5 0 0 0 9 0H14a6 6 0 0 1-5 5.98v1.52h-2z"/></svg>
      <span class="dc-ch-name">${ch}</span>
      ${isActive?`<span class="dc-vc-count">${members.length}</span>`:''}
    </div>
    ${memberHtml}`;
  }).join('');

  el.innerHTML = `
    <div class="dc-layout">
      <div class="dc-sidebar">
        <div class="dc-server-header">Intensivkurs-DA
          <span class="dc-chevron">&#8964;</span>
        </div>
        <div class="dc-section-label">TEXT-KANÄLE</div>
        ${textHtml}
        <div class="dc-section-label">SPRACHKANÄLE</div>
        ${voiceHtml}
      </div>
      <div class="dc-main">
        <div class="dc-main-header">
          <svg class="dc-voice-icon" viewBox="0 0 16 16" fill="currentColor" width="18" height="18"><path d="M12 8a4 4 0 0 1-4 4 4 4 0 0 1-4-4V4a4 4 0 0 1 4-4 4 4 0 0 1 4 4v4zm-1.5 0V4A2.5 2.5 0 0 0 8 1.5 2.5 2.5 0 0 0 5.5 4v4A2.5 2.5 0 0 0 8 10.5 2.5 2.5 0 0 0 10.5 8zM7 14.5v-1.52A6 6 0 0 1 2 7H3.5a4.5 4.5 0 0 0 9 0H14a6 6 0 0 1-5 5.98v1.52h-2z"/></svg>
          <span>dev-meetings</span>
        </div>
        <div class="dc-main-body">
          ${VOICE_CHANNELS.map(ch => `
            <div class="dc-vc-room ${dist[ch].length?'dc-vc-room-active':''}">
              <div class="dc-vc-room-title">🔊 ${ch}
                ${dist[ch].length===0?'<span class="dc-empty">(leer)</span>':''}
              </div>
              <div class="dc-vc-room-members">
                ${dist[ch].map(m=>`
                  <div class="dc-big-member">
                    <div class="dc-big-av" style="background:${m.color};box-shadow:0 0 10px ${m.color}88">${m.emoji}</div>
                    <div class="dc-big-name">${m.name}</div>
                    <div class="dc-big-status">🎤 spricht gerade</div>
                  </div>`).join('')}
              </div>
            </div>`).join('')}
        </div>
      </div>
    </div>`;
}

/* ── DA-Discord Building ─────────────────────────────────────── */
function showDiscordContent(el) {
  const VOICE_CHANNELS = ['dev-meeting-1', 'dev-meeting-2', 'dev-meeting-3'];
  const TEXT_CHANNELS  = [
    { name: 'tickets',   emoji: '💡' },
    { name: 'allgemein', emoji: '🌍' },
    { name: 'talk',      emoji: '🗣️' },
  ];

  // randomly distribute students — null = offline
  const slots = [...VOICE_CHANNELS, null, null];
  const dist  = { 'dev-meeting-1': [], 'dev-meeting-2': [], 'dev-meeting-3': [] };
  shuffleArray([...STUDENTS]).forEach(s => {
    const ch = slots[Math.floor(Math.random() * slots.length)];
    if (ch) dist[ch].push(s);
  });

  const textHtml = TEXT_CHANNELS.map(c => `
    <div class="dc-ch dc-text">
      <span class="dc-hash">#</span>
      <span class="dc-ch-name">${c.emoji} ${c.name}</span>
    </div>`).join('');

  const voiceHtml = VOICE_CHANNELS.map(ch => {
    const members = dist[ch];
    const memberHtml = members.map(m => `
      <div class="dc-voice-member">
        <div class="dc-member-av" style="background:${m.color}">${m.emoji}</div>
        <span class="dc-member-name">${m.name}</span>
        <span class="dc-member-mic">🎤</span>
      </div>`).join('');
    return `
    <div class="dc-ch dc-voice ${members.length ? 'dc-voice-active' : ''}">
      <span class="dc-voice-icon">🔊</span>
      <span class="dc-ch-name">${ch}</span>
      ${members.length ? `<span class="dc-vc-count">${members.length}</span>` : ''}
    </div>
    ${memberHtml}`;
  }).join('');

  el.innerHTML = `
    <div class="dc-layout">
      <div class="dc-sidebar">
        <div class="dc-server-header">Intensivkurs-DA &#8964;</div>
        <div class="dc-section-label">TEXT-KANÄLE</div>
        ${textHtml}
        <div class="dc-section-label">SPRACHKANÄLE</div>
        ${voiceHtml}
        <div class="dc-user-bar">
          <div class="dc-user-av">🧑‍💻</div>
          <span class="dc-user-name">björn_dev</span>
          <span class="dc-user-status">🟢</span>
        </div>
      </div>
      <div class="dc-main">
        <div class="dc-main-header">🔊 dev-meetings</div>
        <div class="dc-main-body">
          ${VOICE_CHANNELS.map(ch => `
            <div class="dc-vc-room ${dist[ch].length ? 'dc-vc-room-active' : ''}">
              <div class="dc-vc-room-title">🔊 ${ch}
                ${dist[ch].length === 0 ? '<span class="dc-empty">— leer</span>' : ''}
              </div>
              <div class="dc-vc-room-members">
                ${dist[ch].map(m => `
                  <div class="dc-big-member">
                    <div class="dc-big-av" style="background:${m.color};box-shadow:0 0 8px ${m.color}99">${m.emoji}</div>
                    <div class="dc-big-name">${m.name}</div>
                    <div class="dc-big-status">🎤 verbunden</div>
                  </div>`).join('')}
              </div>
            </div>`).join('')}
        </div>
      </div>
    </div>`;
}

function showToast(msg,color='#00ff88') {
  const t=document.getElementById('toast');
  t.textContent=msg; t.style.borderColor=color; t.style.color=color; t.style.textShadow=`0 0 10px ${color}`;
  t.classList.remove('hidden'); t.classList.add('toast-show');
  setTimeout(()=>{t.classList.remove('toast-show');t.classList.add('hidden');},2800);
}

/* ── Game Loop ────────────────────────────────────────────────── */
function gameLoop() {
  animId=requestAnimationFrame(gameLoop);
  if(gameState==='START'){if(matrixRain) matrixRain.tick(); return;}
  if(gameState!=='WORLD'){particles.update();particles.draw();return;}
  if(inputCooldown>0) inputCooldown--;
  if(!player.moving&&inputCooldown===0){
    let moved=false;
    if(keys.up)        moved=player.tryMove(0,-1,map);
    else if(keys.down) moved=player.tryMove(0,1,map);
    else if(keys.left) moved=player.tryMove(-1,0,map);
    else if(keys.right)moved=player.tryMove(1,0,map);
    if(moved) inputCooldown=4;
  }
  player.update();
  if(!player.moving){for(const s of students){if(s.interacted) continue;if(Math.abs(s.col-player.col)+Math.abs(s.row-player.row)===1){triggerEncounter(s);break;}}}
  students.forEach(s=>s.update(player.col,player.row));
  drawWorld(); particles.update(); particles.draw();
}

/* ── World Draw ───────────────────────────────────────────────── */
function drawWorld() {
  const ctx=gCtx; ctx.clearRect(0,0,CANVAS_W,CANVAS_H);
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++) tileRenderers[map[r][c]](ctx,c*TILE,r*TILE);
  drawBuildings(ctx);
  const sprites=[{y:player.y,draw:()=>player.drawOn(ctx)},...students.map(s=>({y:s.y,draw:()=>s.drawOn(ctx)}))];
  sprites.sort((a,b)=>a.y-b.y).forEach(s=>s.draw());
  // player glow
  ctx.save(); ctx.globalAlpha=.3; ctx.fillStyle='#00ff88'; ctx.beginPath(); ctx.ellipse(player.x+TILE/2,player.y+TILE-4,TILE/3,4,0,0,Math.PI*2); ctx.fill(); ctx.restore();
  // door hint
  const {col,row}=player;
  [[0,0],[0,-1],[0,1],[-1,0],[1,0]].forEach(([dc,dr])=>{
    const b=getBuildingAtDoor(col+dc,row+dr);
    if(b){ctx.save();ctx.shadowBlur=15;ctx.shadowColor='#ffcc00';ctx.strokeStyle='#ffcc0088';ctx.lineWidth=2;ctx.strokeRect(b.doorCol*TILE+2,b.doorRow*TILE+2,TILE-4,TILE-4);ctx.shadowBlur=0;ctx.fillStyle='#ffcc00cc';ctx.font="bold 9px 'Share Tech Mono'";ctx.textAlign='center';ctx.fillText('[E] Betreten',b.doorCol*TILE+TILE/2,b.doorRow*TILE+TILE+10);ctx.textAlign='left';ctx.restore();}
  });
  // bonus overlay
  if(activeBonus>0){ctx.fillStyle='#ffcc00';ctx.font="bold 10px 'Share Tech Mono'";ctx.shadowBlur=8;ctx.shadowColor='#ffcc00';ctx.fillText(`\u26a1 BONUS +${activeBonus}`,8,CANVAS_H-8);ctx.shadowBlur=0;}
}

/* ── Encounter ────────────────────────────────────────────────── */
function triggerEncounter(student) {
  if(gameState!=='WORLD') return;
  gameState='ENCOUNTER'; currentStudent=student; currentProject=student.project; student.interacted=true; encounterCount++;
  feedbackChoices=shuffleArray([...currentProject.bjoernFeedback]);
  document.getElementById('student-name-display').textContent=student.data.name;
  const qLabel={clean:'✅ Sauber',ok:'🤔 Solide',chaos:'🔥 Chaos-Code'}[currentProject.quality];
  document.getElementById('speech-text').innerHTML=`Hier mein <strong>${currentProject.name}</strong>!<br><span style="font-size:10px;opacity:.75">${currentProject.description}</span><br><span class="project-quality-badge quality-${currentProject.quality}">${qLabel}</span>`;
  feedbackChoices.forEach((f,i)=>{
    const btn=document.getElementById(`btn-${i}`);
    const pre=f.type==='praise'?'🌟 ':f.type==='coach'?'🎯 ':'😅 ';
    btn.innerHTML=`<span class="fb-intro">${pre}${f.intro}</span>${f.critique?`<span class="fb-critique">"${f.critique}"</span>`:''}`;
    btn.className=`feedback-btn fb-${f.type}`; btn.onclick=()=>selectFeedback(i);
  });
  drawEncounterStudent(document.getElementById('student-avatar'),student.data);
  drawEncounterBjoern(document.getElementById('bjoern-avatar'));
  document.getElementById('encounter-title').textContent=`\ud83d\udcc1 ${currentProject.name}`;
  document.getElementById('encounter-subtitle').textContent=`${student.data.name} braucht Björns Feedback!`;
  const ui=document.getElementById('encounter-ui'); ui.classList.remove('hidden');
  document.getElementById('feedback-options').classList.remove('hidden');
  document.getElementById('feedback-result').classList.add('hidden');
  updateHUD();
}

function selectFeedback(idx) {
  if(gameState!=='ENCOUNTER') return;
  const choice=feedbackChoices[idx]; let pts=choice.points;
  if(activeBonus>0&&pts>0){pts+=activeBonus;activeBonus=0;}
  score+=pts; if(score<0) score=0; updateHUD();
  if(pts>0) particles.burst(player.x+TILE/2,player.y+TILE/2,40);
  else particles.burst(player.x+TILE/2,player.y+TILE/2,20,'#ff4444');
  document.getElementById('feedback-options').classList.add('hidden');
  const result=document.getElementById('feedback-result'); result.classList.remove('hidden');
  const rText=pts>=40?'🔥 LEGENDÄRES FEEDBACK!':pts>=20?'💚 Gutes Feedback!':pts>=5?'😐 Na ja…':'❌ Das hätte besser sein können.';
  document.getElementById('result-text').innerHTML=`<div class="result-bjoern-quote"><strong>${choice.intro}</strong>${choice.critique?`<br><em>"${choice.critique}"</em>`:''}</div><div class="result-reaction">${rText}</div>`;
  const pEl=document.getElementById('points-gained');
  pEl.textContent=pts>0?`+${pts} Sympathiepunkte!`:`${pts} Sympathiepunkte`;
  pEl.style.color=pts>0?'var(--cyan)':'#ff4444'; pEl.style.textShadow=pts>0?'0 0 20px var(--cyan)':'0 0 20px #ff4444';
  setTimeout(closeEncounter,2400);
}
function closeEncounter(){document.getElementById('encounter-ui').classList.add('hidden');gameState='WORLD';if(students.filter(s=>!s.interacted).length===0) setTimeout(showGameOver,600);}

/* ── HUD ──────────────────────────────────────────────────────── */
function updateHUD(){
  document.getElementById('score-value').textContent=score;
  document.getElementById('encounter-count').textContent=encounterCount;
  document.getElementById('score-bar').style.width=Math.min(100,score/360*100)+'%';
  const bi=document.getElementById('bonus-indicator');
  if(bi){if(activeBonus>0){bi.textContent=`\u26a1 +${activeBonus} BONUS`;bi.classList.remove('hidden');}else bi.classList.add('hidden');}
}

/* ── Game Over ────────────────────────────────────────────────── */
function showGameOver(){
  gameState='GAMEOVER';
  document.getElementById('final-score').textContent=score;
  const rank=score>=300?'🏆 BJÖRN-LEGENDE — Die Akademie verneigt sich!':score>=200?'🌟 SENIOR FEEDBACK-GOTT':score>=150?'✅ SOLID INSTRUCTOR — Gut gemacht!':score>=80?'📖 LEARNING BY DOING…':'🍝 SPAGHETTI-FEEDBACK — Nochmal!';
  document.getElementById('gameover-rank').textContent=rank;
  document.getElementById('gameover-screen').classList.remove('hidden');
}

/* ── Start ────────────────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded',()=>{
  initCanvas();
  window.addEventListener('resize', onResize);
  const matrixEl=document.getElementById('matrix-bg');
  matrixRain=new MatrixRain(matrixEl);
  function rainLoop(){if(gameState==='START'){matrixRain.tick();matrixRain._id=requestAnimationFrame(rainLoop);}}
  rainLoop();
});
