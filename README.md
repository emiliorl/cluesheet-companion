# 🔍 Cluesheet Companion

> A modern, mobile-friendly digital tracker designed to replace traditional paper-and-pencil cluesheets for detective board games like **Clue / Cluedo**.

---

## 📌 Overview

A cluesheet companion website is a digital tool designed to enhance puzzle-based games, mystery rooms, or detective board games by replacing or upgrading traditional paper-and-pencil trackers. 

In physical board games like **Clue**, players rely on tiny paper tear-off sheets and stubby pencils to cross off suspects, weapons, and rooms. These sheets easily run out, tear, get smudged, or allow other players at the table to peek at your deductions. 

**Cluesheet Companion** eliminates these problems by providing an elegant, interactive, and completely offline-capable web application tailored for smartphones and tablets right at the gaming table.

---

## 🎯 Target Reference (Clue 2010 Edition)

Based on the physical reference sheet (*© 2010 Hasbro 16912*), the application provides built-in tracking for:

### 👤 Sospechosos (Suspects)
- **Entrenador Mostaza** *(Coach/Colonel Mustard)*
- **Profesor Moradillo** *(Professor Plum)*
- **Sr. Verdi** *(Mr. Green)*
- **Sra. Azulino** *(Mrs. Peacock)*
- **Srita. Escarlata** *(Miss Scarlet)*
- **Sra. Blanco** *(Mrs. White)*

### 🚪 Habitaciones (Rooms)
- **Vestíbulo** *(Hall)*
- **Comedor** *(Dining Room)*
- **Cocina** *(Kitchen)*
- **Patio** *(Patio)*
- **Observatorio** *(Observatory)*
- **Teatro** *(Theater)*
- **Sala** *(Lounge / Living Room)*
- **Spa** *(Spa)*
- **Habitación de huéspedes** *(Guest House)*

### 🔪 Armas (Weapons)
- **Cuchillo** *(Knife)*
- **Candelabro** *(Candlestick)*
- **Pistola** *(Pistol / Revolver)*
- **Veneno** *(Poison)*
- **Trofeo** *(Trophy)*
- **Cuerda** *(Rope)*
- **Bate** *(Bat)*
- **Hacha** *(Axe)*
- **Pesas** *(Dumbbell)*

*(Supports quick switching between Spanish and English, as well as classic 6-room/6-weapon editions).*

---

## 🚀 Key Functional Plan & Feature Roadmap

Instead of the 4 static paper columns printed on traditional notepads (which were designed only to save paper across multiple games), **Cluesheet Companion** focuses on a single active, rich game state with the following functions:

### 1. 📱 Mobile-First Ergonomic Interaction
- **One-Thumb Touch Controls**: Sized touch targets designed for holding a phone in one hand at the game table.
- **Smart Cycle Marks**: Tapping a row or cell smoothly cycles through deduction states:
  - ⬜ **Unchecked / Unknown**
  - ❌ **Eliminated** (Proven not in the envelope)
  - ✔️ **My Card / Envelope Confirmed** (Direct evidence)
  - ❓ **Suspect / Clue** (Under observation)
- **Visual Strike-Throughs**: Eliminating an item dims and applies a sleek strikethrough for instantaneous cognitive scanning.
- **Notes per Item**: Quick expandable note field per suspect, room, or weapon to record who showed what.

### 2. 💾 Zero Data-Loss & Offline-First Persistence
- **Local Storage Auto-Save**: Every click and note automatically saves to browser `localStorage` in real time.
- **Accidental Refresh / Disconnection Proof**: Refreshing the page, switching browser tabs, receiving phone calls, or losing internet connection will **never** lose your current game's progress.
- **Offline PWA (Progressive Web App)**: Installable to the home screen with instant loading even with zero cellular service or Wi-Fi.

### 3. 🕵️ Table Privacy Mode ("Anti-Peeking")
- **Privacy Shield / Dim Mode**: A quick toggle or touch-to-reveal button that dims or obfuscates the screen so curious players sitting directly next to you cannot read your notes.
- **Discreet Dark Mode**: Sleek dark theme that saves battery and avoids shining a bright screen in dim dinner/party environments.

### 4. 👥 Detective Deduction Helper (Optional Player Columns)
- Instead of tracking separate games, the columns can optionally represent **Opponents at the Table** (e.g., Player 1, Player 2, Player 3).
- Track which opponent has or doesn't have a card when suggestions are made during the game.

### 5. ⚡ Game Management
- **New Game / Clear Sheet**: Protected with a confirmation modal so you never accidentally erase a game in progress.
- **Undo / Redo**: Quick buttons to undo accidental taps.
- **End Game Summary / Accusation Helper**: Highlights remaining uncrossed items when you are ready to make your final accusation.

---

## 🛠️ Recommended Tech Stack

- **Frontend**: HTML5, Vanilla CSS3 (Custom Properties & Responsive Grid/Flexbox), Vanilla Modern JavaScript (ES6+).
- **Storage**: Browser `localStorage` API + Service Worker (PWA cache).
- **Styling**: Sleek detective dark theme with modern typography and haptic/micro-animation feedback.
- **Zero Heavy Dependencies**: Instant load time with no external framework overhead required.
