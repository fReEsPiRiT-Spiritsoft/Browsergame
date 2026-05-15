# 🎮 Feedback-Frenzy: Björn's Developer Akademie

Ein browserbasiertes Top-Down-Spiel im Retro-Matrix-Stil. Du spielst Björn, den Kursleiter der Developer Akademie. Laufe durch den Campus, gib deinen Studenten Feedback auf ihre Projekte, sammle Gadgets für Bonuspunkte – und pass auf Kevin auf.

---

## 🕹️ Steuerung

| Taste | Aktion |
|---|---|
| `↑` / `W` | Nach oben laufen |
| `↓` / `S` | Nach unten laufen |
| `←` / `A` | Nach links laufen |
| `→` / `D` | Nach rechts laufen |
| `E` | Gebäude betreten (wenn man vor einer Tür steht) |

> Türen leuchten gelb auf, wenn du in der Nähe bist – dann erscheint auch der `[E] Betreten`-Hinweis.

---

## 🗺️ Die Karte

Der Campus besteht aus **5 Gebäuden**, die alle betreten werden können:

| Gebäude | Inhalt |
|---|---|
| ☕ Kaffee-Ecke | Gadget-Fundort |
| 📚 Campus - DA | Gadget-Fundort |
| 💻 Code-Lab | Gadget-Fundort |
| 🎧 DA-Discord | Discord-Simulation mit Voice-Channels |
| 🖥️ Server-Raum | Gadget-Fundort |

---

## 👩‍💻 Studenten

Alle **8 Studenten** spawnen zufällig auf der Karte:

**Daniel, Adam, Patrick, Yunus, Sascha, Mo, Manu, Kaja**

Jeder Student hat ein eigenes Projekt. Laufe neben einen Studenten, um das Feedback-Gespräch zu starten.

---

## 💬 Das Feedback-System

Wenn du einen Studenten triffst, siehst du dessen Projekt und drei Feedback-Optionen:

| Typ | Symbol | Beschreibung | Punkte |
|---|---|---|---|
| **Praise** | 🌟 | Volles Lob, keine Kritik | 55–72 |
| **Coach** | 🎯 | Konstruktive Anmerkung | 30–52 |
| **Roast (kind)** | 😅 | Ehrliche, direkte Kritik | 6–22 |

Nach der Auswahl zeigt Björn seine Reaktion und du erhältst deine Sympathiepunkte.

---

## 💎 Gadgets

In Gebäuden (außer Discord) können Gadgets versteckt sein – erkennbar am **💎-Symbol** an der Gebäudeecke. Betritt das Gebäude, um das Gadget einzusammeln. Der Bonus wird automatisch auf dein nächstes positives Feedback aufgeschlagen:

| Gadget | Bonus |
|---|---|
| Kaffee-Thermobecher ☕ | +20 |
| Post-it „Done > perfect" 📝 | +15 |
| Clean-Code-Buch 📖 | +25 |
| Kahootquiz 📝 | +10 |
| Laptop-Aufkleber-Set 💻 | +18 |
| Extra Kreide 🖊 | +12 |

> Der aktive Bonus wird unten links auf der Karte als ⚡ angezeigt.

---

## 🤖 Discord & KI-Bonus

Das **DA-Discord**-Gebäude ist ein vollständig simulierter Discord-Server mit Text- und Voice-Channels.

**So funktioniert der KI-Bonus:**

1. Betritt den DA-Discord (`E` an der Tür)
2. Klicke auf einen Voice-Kanal, um dem Gespräch beizuwohnen
3. **40 % Chance**: Das Gespräch enthält ein KI-relevantes Thema (Copilot, Prompts, AI etc.)
4. Wenn ein KI-Gespräch erkannt wird, werden die anwesenden Studenten intern markiert
5. Beim nächsten Feedback eines dieser Studenten: **+12 Sympathiepunkte Bonus**
6. Das Feedback-Fenster zeigt dann: *„BONUS: Björn schätzt ehrliches Feedback – trotz KI-Einsatz!"*

> Der Bonus gilt nur für Praise- und Coach-Feedback, nicht für Roast.

---

## 🍌 Kevin – Der Endgegner

Irgendwo auf der Karte liegt eine **pulsierende Banane** (mit `???`-Label). Betritt du das Tile mit der Banane, wird **Kevin** beschworen.

**Kevin-Mechanik:**
- Kevin erscheint in der Ecke, die am weitesten von dir entfernt ist
- Er verfolgt Studenten per intelligentem BFS-Pathfinding (findet immer den kürzesten Weg)
- Erreicht Kevin einen Studenten, **frisst er ihn** – der Student verschwindet von der Karte
- Wirft unterwegs Bananen auf Studenten (Fernkampf-Treffer)
- Werden alle Studenten gefressen oder haben alle Feedback bekommen → **Game Over**

**Neue Bananen:**
- Alle **30 Sekunden** spawnt automatisch eine neue Banane an einer zufälligen freien Stelle
- Ein Toast-Hinweis erscheint: *„Eine neue Banane ist irgendwo auf der Karte aufgetaucht..."*
- Solange Kevin aktiv ist, spawnt keine neue Banane

> **Tipp:** Wenn du eine Banane siehst – lauf weg oder ignoriere sie, solange Kevin noch unterwegs ist.

---

## 🏆 Rangsystem

Das Spiel endet, wenn alle Studenten entweder Feedback bekommen haben oder von Kevin gefressen wurden. Dein Endrang:

| Punkte | Rang |
|---|---|
| 300+ | 🏆 BJÖRN-LEGENDE — Die Akademie verneigt sich! |
| 200–299 | 🌟 SENIOR FEEDBACK-GOTT |
| 150–199 | ✅ SOLID INSTRUCTOR — Gut gemacht! |
| 80–149 | 📖 LEARNING BY DOING… |
| 0–79 | 🍝 SPAGHETTI-FEEDBACK — Nochmal! |

---

## 🚀 Starten

Einfach `index.html` im Browser öffnen – kein Build-Schritt, keine Dependencies. Vanilla JS, Canvas 2D.

```
feedback-frenzy/
├── index.html
├── game.js
├── style.css
└── assets/
    └── avatar/
        ├── björn-avatar.png
        ├── daniel-avatar.png
        ├── patrick-avatar.png
        └── kevin-avatar.png
```
