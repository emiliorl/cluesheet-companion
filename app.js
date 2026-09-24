/**
 * Cluesheet Companion - Core Application Logic
 * Detective Board Game Tracker (Clue 2010 Edition Reference)
 */

// --- 1. Game Data & Translations ---
const GAME_DATA = {
  suspects: [
    { id: 'entrenador_mostaza', es: 'Entrenador Mostaza', en: 'Coach Mustard', short: { es: 'Mostaza', en: 'Mustard' }, color: '#c9a227' },
    { id: 'profesor_moradillo', es: 'Profesor Moradillo', en: 'Professor Plum', short: { es: 'Moradillo', en: 'Plum' }, color: '#6d3b6b' },
    { id: 'sr_verdi', es: 'Sr. Verdi', en: 'Mr. Green', short: { es: 'Verdi', en: 'Green' }, color: '#3f6e3c' },
    { id: 'sra_azulino', es: 'Sra. Azulino', en: 'Mrs. Peacock', short: { es: 'Azulino', en: 'Peacock' }, color: '#2c5282' },
    { id: 'srita_escarlata', es: 'Srita. Escarlata', en: 'Miss Scarlet', short: { es: 'Escarlata', en: 'Scarlet' }, color: '#a3262a' },
    { id: 'sra_blanco', es: 'Sra. Blanco', en: 'Mrs. White', short: { es: 'Blanco', en: 'White' }, color: '#f4f1ea' }
  ],
  rooms: [
    { id: 'vestibulo', es: 'Vestíbulo', en: 'Hall' },
    { id: 'comedor', es: 'Comedor', en: 'Dining Room', short: { es: 'Comedor', en: 'Dining' } },
    { id: 'cocina', es: 'Cocina', en: 'Kitchen' },
    { id: 'patio', es: 'Patio', en: 'Patio' },
    { id: 'observatorio', es: 'Observatorio', en: 'Observatory', short: { es: 'Observat.', en: 'Observat.' } },
    { id: 'teatro', es: 'Teatro', en: 'Theater' },
    { id: 'sala', es: 'Sala', en: 'Living Room', short: { es: 'Sala', en: 'Living' } },
    { id: 'spa', es: 'Spa', en: 'Spa' },
    { id: 'habitacion_huespedes', es: 'Habitación de huéspedes', en: 'Guest House', short: { es: 'Huéspedes', en: 'Guest House' } }
  ],
  weapons: [
    { id: 'cuchillo', es: 'Cuchillo', en: 'Knife' },
    { id: 'candelabro', es: 'Candelabro', en: 'Candlestick', short: { es: 'Candelabro', en: 'Candle' } },
    { id: 'pistola', es: 'Pistola', en: 'Pistol' },
    { id: 'veneno', es: 'Veneno', en: 'Poison' },
    { id: 'trofeo', es: 'Trofeo', en: 'Trophy' },
    { id: 'cuerda', es: 'Cuerda', en: 'Rope' },
    { id: 'bate', es: 'Bate', en: 'Bat' },
    { id: 'hacha', es: 'Hacha', en: 'Axe' },
    { id: 'pesas', es: 'Pesas', en: 'Dumbbell' }
  ]
};
const CATEGORIES = ['suspects', 'rooms', 'weapons'];

// Player columns (index 0 is me): 'has' = holds the card, 'maybe' = might hold it.
// My column toggles ✓; opponents rotate ✕ (has it) → ? → blank.
const MY_CYCLE = ['none', 'has'];
const OPPONENT_CYCLE = ['none', 'has', 'maybe'];
// Guess column, when no one is known to hold the card
const GUESS_CYCLE = ['none', 'question', 'envelope'];

const MAX_PLAYERS = { standard: 6, master: 10 };

const MARK_SVG = {
  none: '',
  eliminated: '<svg class="m m-eliminated" viewBox="0 0 20 20"><path d="M5 5l10 10M15 5L5 15"/></svg>',
  hand: '<svg class="m m-hand" viewBox="0 0 20 20"><path d="M4 10.5l4 4L16 5.5"/></svg>',
  envelope: '<svg class="m m-envelope" viewBox="0 0 20 20"><circle cx="10" cy="10" r="6"/></svg>',
  question: '<span class="m m-question">?</span>'
};

const I18N = {
  es: {
    appTitlePrefix: 'Hoja de ',
    appTitleMain: 'Pistas',
    suspectsTitle: 'Sospechosos',
    roomsTitle: 'Habitaciones',
    weaponsTitle: 'Armas',
    suspect: 'Sospechoso',
    room: 'Habitación',
    weapon: 'Arma',
    btnSolve: 'Acusar',
    btnUndo: 'Deshacer',
    btnLogRumor: 'Anotar',
    logTitle: 'Registro',
    settingsTitle: 'Ajustes',
    privacyTitle: 'Ocultar hoja',
    privacyEyebrow: 'Confidencial',
    privacyHeading: 'Hoja oculta',
    privacyDesc: 'Nadie en la mesa puede ver tus pistas.',
    privacyHold: 'Mantén pulsado para ver',
    privacyExit: 'Mostrar hoja',
    playersTitle: 'Jugadores',
    playersDesc: 'Cada jugador, tú incluido, tiene su columna. En la tuya marca ✓ tus cartas; en la de los rivales ✕ si la tienen o ? si podrían tenerla.',
    editionLabel: 'Versión',
    editionStandard: 'Estándar · 6',
    editionMaster: 'Master · 10',
    maxPlayers: 'Máximo {n} jugadores en esta versión.',
    editionTooMany: 'Quita jugadores para volver a la versión estándar (máx. 6).',
    playerPlaceholder: 'Nombre del jugador',
    btnAdd: 'Añadir',
    languageLabel: 'Idioma',
    soundLabel: 'Sonido al marcar',
    noteHint: 'Toca nombres para armar tu rumor. Mantén pulsado un nombre para añadirle una nota.',
    btnNewGame: 'Nueva partida',
    btnDone: 'Listo',
    lblAsker: 'Preguntó',
    lblResponder: 'Mostró carta',
    lblResult: 'Nota',
    resultPlaceholder: 'Ej. me enseñó la Cuerda',
    btnSaveLog: 'Guardar en registro',
    emptyLog: 'Aún no hay turnos anotados.',
    nobody: 'Nadie',
    accTitle: 'Acusación',
    accDesc: 'Candidatos que siguen sin descartar:',
    accWho: 'Quién',
    accWhere: 'Dónde',
    accWhat: 'Con qué',
    accNone: 'Ninguno',
    btnClose: 'Cerrar',
    confirmReset: '¿Borrar toda la hoja y empezar de nuevo? No se puede deshacer.',
    btnCancel: 'Cancelar',
    btnConfirmReset: 'Sí, borrar',
    legendHand: 'la tengo',
    legendElim: 'la tiene otro',
    legendQues: 'quizás',
    legendEnv: 'sobre',
    notePrompt: 'Nota para',
    logAsked: 'preguntó por',
    logShowed: 'mostró carta',
    logNobody: 'Nadie mostró carta',
    playerMe: 'Yo'
  },
  en: {
    appTitlePrefix: 'Detective ',
    appTitleMain: 'Notes',
    suspectsTitle: 'Suspects',
    roomsTitle: 'Rooms',
    weaponsTitle: 'Weapons',
    suspect: 'Suspect',
    room: 'Room',
    weapon: 'Weapon',
    btnSolve: 'Accuse',
    btnUndo: 'Undo',
    btnLogRumor: 'Log',
    logTitle: 'Log',
    settingsTitle: 'Settings',
    privacyTitle: 'Hide sheet',
    privacyEyebrow: 'Confidential',
    privacyHeading: 'Sheet hidden',
    privacyDesc: 'Nobody at the table can see your clues.',
    privacyHold: 'Press and hold to peek',
    privacyExit: 'Show sheet',
    playersTitle: 'Players',
    playersDesc: 'Every player, you included, gets a column. Mark ✓ on your own cards; on opponents mark ✕ if they have it or ? if they might.',
    editionLabel: 'Version',
    editionStandard: 'Standard · 6',
    editionMaster: 'Master · 10',
    maxPlayers: 'Up to {n} players in this version.',
    editionTooMany: 'Remove players to switch back to standard (max 6).',
    playerPlaceholder: 'Player name',
    btnAdd: 'Add',
    languageLabel: 'Language',
    soundLabel: 'Sound on tap',
    noteHint: 'Tap names to build your rumor. Press and hold a name to add a note.',
    btnNewGame: 'New game',
    btnDone: 'Done',
    lblAsker: 'Asked',
    lblResponder: 'Showed a card',
    lblResult: 'Note',
    resultPlaceholder: 'e.g. showed me the Rope',
    btnSaveLog: 'Save to log',
    emptyLog: 'No turns logged yet.',
    nobody: 'Nobody',
    accTitle: 'Accusation',
    accDesc: 'Candidates not yet ruled out:',
    accWho: 'Who',
    accWhere: 'Where',
    accWhat: 'With what',
    accNone: 'None',
    btnClose: 'Close',
    confirmReset: 'Erase the whole sheet and start over? This can’t be undone.',
    btnCancel: 'Cancel',
    btnConfirmReset: 'Yes, erase',
    legendHand: 'mine',
    legendElim: 'someone has it',
    legendQues: 'maybe',
    legendEnv: 'envelope',
    notePrompt: 'Note for',
    logAsked: 'asked about',
    logShowed: 'showed a card',
    logNobody: 'Nobody showed a card',
    playerMe: 'Me'
  }
};

// --- 2. State Management ---
const STORAGE_KEY = 'cluesheet_companion_state_v2';

let state = {
  lang: 'es',
  soundEnabled: true,
  schema: 3,
  edition: 'standard', // 'standard' (max 6 players) | 'master' (max 10)
  players: ['Yo'], // players[0] is always me ('Yo' / 'Me')
  // status is my manual guess (GUESS_CYCLE); playerMarks values are 'has' | 'maybe'
  marks: {}, // { [itemId]: { status: 'none', notes: '', playerMarks: { [player]: 'has' } } }
  history: [], // For undo
  turnLogs: [], // [ { id, time, text } ]
  rumor: { suspects: null, rooms: null, weapons: null }
};

const t = (key) => I18N[state.lang][key] ?? key;
const nameOf = (item) => item[state.lang] || item.es;
const shortNameOf = (item) => (item.short && item.short[state.lang]) || nameOf(item);
const maxPlayers = () => MAX_PLAYERS[state.edition] || MAX_PLAYERS.standard;
const findItem = (cat, id) => GAME_DATA[cat].find(i => i.id === id);

// --- 3. Audio & Haptics Feedback ---
class SoundManager {
  constructor() {
    this.ctx = null;
  }
  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }
  playTap(type = 'click') {
    if (!state.soundEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      const now = this.ctx.currentTime;
      if (type === 'click') {
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'stamp') {
        osc.frequency.setValueAtTime(250, now);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.08);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      }
    } catch (e) {
      // Audio not supported or allowed yet
    }
  }
  vibrate(ms = 15) {
    if (navigator.vibrate) {
      navigator.vibrate(ms);
    }
  }
}
const sounds = new SoundManager();

// --- 4. Persistence ---
function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const loaded = JSON.parse(raw);
      state = { ...state, ...loaded };
      if (!state.players || state.players.length === 0) {
        state.players = [t('playerMe')];
      }
      if (!state.rumor) state.rumor = { suspects: null, rooms: null, weapons: null };
      if ((loaded.schema || 0) < 3) migrateMarks();
    }
  } catch (e) {
    console.error('Failed to load state:', e);
  }
  initDefaultMarks();
}

// Pre-v3 sheets: 'hand' in the main column meant my card; player columns used ✓/✕/? differently
function migrateMarks() {
  const me = state.players[0];
  Object.values(state.marks).forEach(mark => {
    const pm = {};
    Object.entries(mark.playerMarks || {}).forEach(([p, v]) => {
      if (v === 'hand') pm[p] = 'has';
      else if (v === 'question') pm[p] = 'maybe';
    });
    if (mark.status === 'hand') {
      pm[me] = 'has';
      mark.status = 'none';
    }
    mark.playerMarks = pm;
  });
  if (state.players.length > MAX_PLAYERS.standard) state.edition = 'master';
  state.players = state.players.slice(0, MAX_PLAYERS.master);
  state.history = [];
  state.schema = 3;
}

function initDefaultMarks() {
  CATEGORIES.forEach(cat => GAME_DATA[cat].forEach(item => {
    if (!state.marks[item.id]) {
      state.marks[item.id] = { status: 'none', notes: '', playerMarks: {} };
    }
  }));
}

function pushHistory() {
  // Keep last 30 actions
  state.history.push(JSON.stringify(state.marks));
  if (state.history.length > 30) state.history.shift();
}

function undo() {
  if (state.history.length === 0) return;
  try {
    state.marks = JSON.parse(state.history.pop());
    renderAll();
    saveState();
    sounds.playTap('click');
  } catch (e) {
    console.error('Undo failed', e);
  }
}

// --- 5. UI Rendering ---
function renderAll() {
  renderLanguageLabels();
  CATEGORIES.forEach(renderCategory);
  updateLayout();
  renderRumorBar();
  updateCounts();
  renderLogList();
  renderSettings();
  document.getElementById('btn-undo').disabled = state.history.length === 0;
}

function renderLanguageLabels() {
  document.documentElement.lang = state.lang;
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-title]').forEach(el => { el.title = t(el.dataset.i18nTitle); });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { el.placeholder = t(el.dataset.i18nPlaceholder); });

  const legend = `
    <span>${MARK_SVG.hand} ${t('legendHand')}</span>
    <span>${MARK_SVG.eliminated} ${t('legendElim')}</span>
    <span>${MARK_SVG.question} ${t('legendQues')}</span>
    <span>${MARK_SVG.envelope} ${t('legendEnv')}</span>`;
  document.getElementById('legend').innerHTML = legend;
  document.getElementById('legend-settings').innerHTML = legend;
}

// --- Deduction: the guess column follows the player notes ---
function holderOf(itemId) {
  const pm = state.marks[itemId]?.playerMarks || {};
  return state.players.find(p => pm[p] === 'has') || null;
}

// 'eliminated' is a legacy manual cross from older saved games
function isRuledOut(itemId) {
  return !!holderOf(itemId) || state.marks[itemId]?.status === 'eliminated';
}

function remaining(cat) {
  return GAME_DATA[cat].filter(item => !isRuledOut(item.id));
}

// Returns { mark, auto }: auto marks come from the notes and can't be changed by hand
function guessOf(cat, itemId) {
  if (isRuledOut(itemId)) return { mark: 'eliminated', auto: true };
  if (remaining(cat).length === 1) return { mark: 'envelope', auto: true };
  return { mark: state.marks[itemId]?.status || 'none', auto: false };
}

function playerMarkSvg(idx, value) {
  if (value === 'has') return idx === 0 ? MARK_SVG.hand : MARK_SVG.eliminated;
  if (value === 'maybe') return MARK_SVG.question;
  return '';
}

function cellWidth(cols) {
  return cols <= 5 ? 36 : cols <= 7 ? 30 : 25;
}

function renderCategory(cat) {
  const section = document.getElementById(`cat-${cat}`);
  const cols = 1 + state.players.length;
  const dense = cols > 5;
  section.style.setProperty('--cols', cols);
  section.style.setProperty('--cell', `${cellWidth(cols)}px`);
  section.classList.toggle('dense', dense);
  const labelLen = cols > 7 ? 2 : 3;

  let html = `
    <div class="row cat-head">
      <h2>${t(`${cat}Title`)}</h2>
      <span class="col-label cat-count" id="count-${cat}"></span>
      ${state.players.map(name =>
        `<span class="col-label" title="${escapeHtml(name)}">${escapeHtml(name.slice(0, labelLen))}</span>`).join('')}
    </div>`;

  GAME_DATA[cat].forEach(item => {
    const data = state.marks[item.id] || { status: 'none', notes: '', playerMarks: {} };
    const guess = guessOf(cat, item.id);
    const cls = ['row', 'item'];
    if (guess.mark === 'eliminated') cls.push('is-out');
    if (guess.mark === 'envelope') cls.push('is-envelope');
    if (state.rumor[cat] === item.id) cls.push('is-picked');

    html += `
      <div class="${cls.join(' ')}">
        <button class="pick" data-act="pick" data-cat="${cat}" data-id="${item.id}">
          ${item.color ? `<span class="swatch" style="background:${item.color}"></span>` : ''}
          <span class="name">${escapeHtml(dense ? shortNameOf(item) : nameOf(item))}</span>
          ${data.notes ? `<span class="note">${escapeHtml(data.notes)}</span>` : ''}
        </button>
        <button class="mark status ${guess.auto ? 'auto' : ''}" data-act="mark" data-cat="${cat}" data-id="${item.id}" aria-label="${guess.mark}">${MARK_SVG[guess.mark] || ''}</button>
        ${state.players.map((name, idx) => {
          const pm = (data.playerMarks && data.playerMarks[name]) || 'none';
          return `<button class="mark" data-act="pmark" data-id="${item.id}" data-p="${idx}" aria-label="${escapeHtml(name)}: ${pm}">${playerMarkSvg(idx, pm)}</button>`;
        }).join('')}
      </div>`;
  });

  section.innerHTML = html;
}

function updateCounts() {
  let allSolved = true;
  CATEGORIES.forEach(cat => {
    const rem = remaining(cat).length;
    const el = document.getElementById(`count-${cat}`);
    el.textContent = `${rem}/${GAME_DATA[cat].length}`;
    el.classList.toggle('solved', rem === 1);
    if (rem !== 1) allSolved = false;
  });
  document.getElementById('btn-solve-case').classList.toggle('ready', allSolved);
}

// Three categories side by side only while each one still fits all its columns
function updateLayout() {
  const cols = 1 + state.players.length;
  const perCategory = (Math.min(window.innerWidth, 1100) - 88) / 3;
  document.getElementById('sheet').classList.toggle('stacked', cols * cellWidth(cols) + 130 > perCategory);
}

function renderRumorBar() {
  const placeholders = { suspects: t('suspect'), rooms: t('room'), weapons: t('weapon') };
  let any = false;
  document.querySelectorAll('.slot').forEach(slot => {
    const cat = slot.dataset.slot;
    const item = state.rumor[cat] && findItem(cat, state.rumor[cat]);
    slot.textContent = item ? nameOf(item) : placeholders[cat];
    slot.classList.toggle('filled', !!item);
    if (item) any = true;
  });
  document.getElementById('btn-rumor-log').disabled = !any;
}

// --- 6. Mark Actions ---
function cycleMark(cat, itemId) {
  if (guessOf(cat, itemId).auto) return;
  pushHistory();
  sounds.vibrate(12);
  sounds.playTap('stamp');

  const mark = state.marks[itemId];
  const nextIdx = (GUESS_CYCLE.indexOf(mark.status || 'none') + 1) % GUESS_CYCLE.length;
  mark.status = GUESS_CYCLE[nextIdx];

  renderAll();
  saveState();
}

function cyclePlayerMark(itemId, idx) {
  pushHistory();
  sounds.vibrate(12);
  sounds.playTap('click');

  const player = state.players[idx];
  const mark = state.marks[itemId];
  if (!mark.playerMarks) mark.playerMarks = {};
  const pm = mark.playerMarks;

  const cycle = idx === 0 ? MY_CYCLE : OPPONENT_CYCLE;
  const next = cycle[(cycle.indexOf(pm[player] || 'none') + 1) % cycle.length];
  if (next === 'none') delete pm[player];
  else pm[player] = next;

  // Only one player can hold a given card
  if (next === 'has') {
    state.players.forEach(p => { if (p !== player && pm[p] === 'has') delete pm[p]; });
  }

  renderAll();
  saveState();
}

function togglePick(cat, itemId) {
  state.rumor[cat] = state.rumor[cat] === itemId ? null : itemId;
  sounds.vibrate(8);
  sounds.playTap('click');
  renderAll();
  saveState();
}

function promptNote(itemId) {
  const item = CATEGORIES.map(cat => findItem(cat, itemId)).find(Boolean);
  const current = state.marks[itemId]?.notes || '';
  const note = prompt(`${t('notePrompt')} ${nameOf(item)}:`, current);
  if (note !== null) {
    pushHistory();
    state.marks[itemId].notes = note.trim();
    renderAll();
    saveState();
  }
}

// --- 7. Modals & Turn Log ---
function openModal(id) {
  document.getElementById(id)?.classList.remove('hidden');
}

function closeModal(id) {
  document.getElementById(id)?.classList.add('hidden');
}

function populateLogSelects() {
  const playerOpts = state.players.map(p => `<option value="${escapeHtml(p)}">${escapeHtml(p)}</option>`).join('');
  document.getElementById('log-asker').innerHTML = playerOpts;
  document.getElementById('log-responder').innerHTML = `<option value="">${t('nobody')}</option>` + playerOpts;

  CATEGORIES.forEach(cat => {
    const select = document.getElementById(`log-${cat}`);
    select.innerHTML = GAME_DATA[cat].map(i => `<option value="${i.id}">${escapeHtml(nameOf(i))}</option>`).join('');
    if (state.rumor[cat]) select.value = state.rumor[cat];
  });
}

function openLogModal() {
  populateLogSelects();
  openModal('modal-log');
}

function renderLogList() {
  const list = document.getElementById('log-list');
  document.getElementById('empty-log').classList.toggle('hidden', state.turnLogs.length > 0);
  const badge = document.getElementById('log-badge');
  badge.textContent = state.turnLogs.length;
  badge.classList.toggle('hidden', state.turnLogs.length === 0);

  list.innerHTML = state.turnLogs.map((log, index) => `
    <li class="log-entry">
      <div><span class="log-time">${escapeHtml(log.time)}</span>${escapeHtml(log.text)}</div>
      <button data-delete-log="${index}" aria-label="Delete">&times;</button>
    </li>
  `).join('');
}

function renderSettings() {
  // I'm always players[0] and can't be removed
  document.getElementById('players-list').innerHTML = state.players.map((p, idx) => `
    <span class="player-chip">
      ${escapeHtml(p)}
      ${idx > 0 ? `<button data-remove-player="${idx}" aria-label="Remove">&times;</button>` : ''}
    </span>
  `).join('');

  const full = state.players.length >= maxPlayers();
  document.getElementById('new-player-input').disabled = full;
  document.querySelector('#form-add-player button').disabled = full;
  document.getElementById('players-limit').textContent =
    `${state.players.length}/${maxPlayers()} · ${t('maxPlayers').replace('{n}', maxPlayers())}`;

  const tooManyForStandard = state.players.length > MAX_PLAYERS.standard;
  document.querySelectorAll('[data-edition]').forEach(b => {
    b.classList.toggle('active', b.dataset.edition === state.edition);
    b.disabled = b.dataset.edition === 'standard' && tooManyForStandard;
    b.title = b.disabled ? t('editionTooMany') : '';
  });
  document.querySelectorAll('[data-lang]').forEach(b => b.classList.toggle('active', b.dataset.lang === state.lang));
  document.getElementById('toggle-sound').checked = state.soundEnabled;
}

function showAccusationModal() {
  CATEGORIES.forEach(cat => {
    const tags = remaining(cat).map(item => {
      const isEnv = guessOf(cat, item.id).mark === 'envelope';
      return `<span class="acc-tag ${isEnv ? 'winner' : ''}">${escapeHtml(nameOf(item))}</span>`;
    });
    document.getElementById(`acc-list-${cat}`).innerHTML =
      tags.length ? tags.join('') : `<span class="acc-none">${t('accNone')}</span>`;
  });
  openModal('modal-accusation');
}

// --- 8. Event Listeners & Setup ---
function setupSheetInteractions() {
  const sheet = document.getElementById('sheet');
  let pressTimer = null;
  let longPressed = false;

  // Long-press (or right-click) a name to edit its note
  sheet.addEventListener('pointerdown', (e) => {
    const pick = e.target.closest('[data-act="pick"]');
    if (!pick) return;
    longPressed = false;
    clearTimeout(pressTimer);
    pressTimer = setTimeout(() => {
      longPressed = true;
      sounds.vibrate(25);
      promptNote(pick.dataset.id);
    }, 550);
  });
  ['pointerup', 'pointerleave', 'pointercancel', 'scroll'].forEach(ev =>
    sheet.addEventListener(ev, () => clearTimeout(pressTimer), true));
  sheet.addEventListener('contextmenu', (e) => {
    const pick = e.target.closest('[data-act="pick"]');
    if (!pick) return;
    e.preventDefault();
    if (!longPressed) promptNote(pick.dataset.id);
  });

  sheet.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-act]');
    if (!btn) return;
    const { act, id } = btn.dataset;
    if (act === 'pick') {
      if (longPressed) { longPressed = false; return; }
      togglePick(btn.dataset.cat, id);
    } else if (act === 'mark') {
      cycleMark(btn.dataset.cat, id);
    } else if (act === 'pmark') {
      cyclePlayerMark(id, Number(btn.dataset.p));
    }
  });
}

function setupEventListeners() {
  setupSheetInteractions();

  // Privacy Shield
  const shield = document.getElementById('privacy-shield');
  document.getElementById('btn-privacy').addEventListener('click', () => {
    shield.classList.remove('hidden');
    sounds.playTap('click');
  });
  document.getElementById('btn-disable-privacy').addEventListener('click', () => {
    shield.classList.add('hidden');
    sounds.playTap('click');
  });

  // Hold to peek
  const holdTrigger = shield.querySelector('.hold-to-peek');
  const startPeek = () => shield.classList.add('peeking');
  const stopPeek = () => shield.classList.remove('peeking');
  holdTrigger.addEventListener('mousedown', startPeek);
  holdTrigger.addEventListener('mouseup', stopPeek);
  holdTrigger.addEventListener('mouseleave', stopPeek);
  holdTrigger.addEventListener('touchstart', (e) => { e.preventDefault(); startPeek(); }, { passive: false });
  holdTrigger.addEventListener('touchend', stopPeek);

  document.getElementById('btn-undo').addEventListener('click', undo);

  document.getElementById('btn-solve-case').addEventListener('click', () => {
    showAccusationModal();
    sounds.playTap('stamp');
  });

  // Rumor bar: tap a filled slot to clear it
  document.querySelectorAll('.slot').forEach(slot => {
    slot.addEventListener('click', () => {
      if (!state.rumor[slot.dataset.slot]) return;
      state.rumor[slot.dataset.slot] = null;
      renderAll();
      saveState();
    });
  });
  document.getElementById('btn-rumor-log').addEventListener('click', openLogModal);
  document.getElementById('btn-log').addEventListener('click', openLogModal);

  // Settings
  document.getElementById('btn-settings').addEventListener('click', () => {
    renderSettings();
    openModal('modal-settings');
  });

  document.getElementById('form-add-player').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('new-player-input');
    const name = input.value.trim();
    if (name && !state.players.includes(name) && state.players.length < maxPlayers()) {
      state.players.push(name);
      input.value = '';
      renderAll();
      saveState();
      sounds.playTap('click');
    }
  });

  document.getElementById('players-list').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-remove-player]');
    const idx = Number(btn?.dataset.removePlayer);
    if (!btn || idx === 0) return;
    const [removed] = state.players.splice(idx, 1);
    // Drop their marks so a card they held is no longer ruled out
    Object.values(state.marks).forEach(mark => { if (mark.playerMarks) delete mark.playerMarks[removed]; });
    renderAll();
    saveState();
  });

  document.querySelectorAll('[data-lang]').forEach(btn => {
    btn.addEventListener('click', () => {
      const oldMe = state.players[0];
      const wasDefaultMe = oldMe === t('playerMe');
      state.lang = btn.dataset.lang;
      if (wasDefaultMe && !state.players.includes(t('playerMe'))) {
        const newMe = t('playerMe');
        state.players[0] = newMe;
        // Marks are keyed by player name, so carry mine over
        Object.values(state.marks).forEach(mark => {
          if (mark.playerMarks && oldMe in mark.playerMarks) {
            mark.playerMarks[newMe] = mark.playerMarks[oldMe];
            delete mark.playerMarks[oldMe];
          }
        });
      }
      renderAll();
      saveState();
    });
  });

  document.querySelectorAll('[data-edition]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.edition === 'standard' && state.players.length > MAX_PLAYERS.standard) return;
      state.edition = btn.dataset.edition;
      renderAll();
      saveState();
    });
  });

  window.addEventListener('resize', updateLayout);

  document.getElementById('toggle-sound').addEventListener('change', (e) => {
    state.soundEnabled = e.target.checked;
    sounds.playTap('click');
    saveState();
  });

  // New Game / Reset
  document.getElementById('btn-new-game').addEventListener('click', () => {
    closeModal('modal-settings');
    openModal('modal-reset');
  });
  document.getElementById('btn-confirm-reset').addEventListener('click', () => {
    state.marks = {};
    state.history = [];
    state.turnLogs = [];
    state.rumor = { suspects: null, rooms: null, weapons: null };
    initDefaultMarks();
    closeModal('modal-reset');
    renderAll();
    saveState();
    sounds.playTap('stamp');
  });

  // Turn log
  document.getElementById('form-log').addEventListener('submit', (e) => {
    e.preventDefault();
    const asker = document.getElementById('log-asker').value;
    const responder = document.getElementById('log-responder').value;
    const result = document.getElementById('log-result').value.trim();
    const cards = CATEGORIES.map(cat => nameOf(findItem(cat, document.getElementById(`log-${cat}`).value)));

    let text = `${asker} ${t('logAsked')} ${cards.join(', ')}. `;
    text += responder ? `${responder} ${t('logShowed')}.` : `${t('logNobody')}.`;
    if (result) text += ` (${result})`;

    const now = new Date();
    state.turnLogs.unshift({
      id: Date.now(),
      time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
      text
    });
    state.rumor = { suspects: null, rooms: null, weapons: null };

    document.getElementById('log-result').value = '';
    closeModal('modal-log');
    renderAll();
    saveState();
    sounds.playTap('stamp');
  });

  document.getElementById('log-list').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-delete-log]');
    if (!btn) return;
    state.turnLogs.splice(Number(btn.dataset.deleteLog), 1);
    renderLogList();
    saveState();
  });

  // Generic modal close handlers
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.getAttribute('data-close')));
  });
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.add('hidden');
    });
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// --- 9. Service Worker & Boot ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(err => {
      console.log('SW registration note:', err);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadState();
  setupEventListeners();
  renderAll();
});
