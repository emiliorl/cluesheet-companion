/**
 * Cluesheet Companion - Core Application Logic
 * Detective Board Game Tracker (Clue 2010 Edition Reference)
 */

// --- 1. Game Data & Translations ---
const GAME_DATA = {
  suspects: [
    { id: 'entrenador_mostaza', es: 'Entrenador Mostaza', en: 'Coach Mustard', icon: '🟡' },
    { id: 'profesor_moradillo', es: 'Profesor Moradillo', en: 'Professor Plum', icon: '🟣' },
    { id: 'sr_verdi', es: 'Sr. Verdi', en: 'Mr. Green', icon: '🟢' },
    { id: 'sra_azulino', es: 'Sra. Azulino', en: 'Mrs. Peacock', icon: '🔵' },
    { id: 'srita_escarlata', es: 'Srita. Escarlata', en: 'Miss Scarlet', icon: '🔴' },
    { id: 'sra_blanco', es: 'Sra. Blanco', en: 'Mrs. White', icon: '⚪' }
  ],
  rooms: [
    { id: 'vestibulo', es: 'Vestíbulo', en: 'Hall', icon: '🏛️' },
    { id: 'comedor', es: 'Comedor', en: 'Dining Room', icon: '🍷' },
    { id: 'cocina', es: 'Cocina', en: 'Kitchen', icon: '🍳' },
    { id: 'patio', es: 'Patio', en: 'Patio', icon: '🌿' },
    { id: 'observatorio', es: 'Observatorio', en: 'Observatory', icon: '🔭' },
    { id: 'teatro', es: 'Teatro', en: 'Theater', icon: '🎭' },
    { id: 'sala', es: 'Sala', en: 'Living Room', icon: '🛋️' },
    { id: 'spa', es: 'Spa', en: 'Spa', icon: '🧖' },
    { id: 'habitacion_huespedes', es: 'Habitación de huéspedes', en: 'Guest House', icon: '🛏️' }
  ],
  weapons: [
    { id: 'cuchillo', es: 'Cuchillo', en: 'Knife / Dagger', icon: '🔪' },
    { id: 'candelabro', es: 'Candelabro', en: 'Candlestick', icon: '🕯️' },
    { id: 'pistola', es: 'Pistola', en: 'Pistol / Revolver', icon: '🔫' },
    { id: 'veneno', es: 'Veneno', en: 'Poison', icon: '🧪' },
    { id: 'trofeo', es: 'Trofeo', en: 'Trophy', icon: '🏆' },
    { id: 'cuerda', es: 'Cuerda', en: 'Rope', icon: '🪢' },
    { id: 'bate', es: 'Bate', en: 'Bat', icon: '🏏' },
    { id: 'hacha', es: 'Hacha', en: 'Axe', icon: '🪓' },
    { id: 'pesas', es: 'Pesas', en: 'Dumbbell', icon: '🏋️' }
  ]
};

const MARK_CYCLE = ['none', 'eliminated', 'hand', 'envelope', 'question'];
const MARK_ICONS = {
  none: '⬜',
  eliminated: '❌',
  hand: '🖐️',
  envelope: '👑',
  question: '❓'
};

const I18N = {
  es: {
    appTitle: 'Hoja de Pistas',
    appSubtitle: 'Compañero Digital • Clue 2010',
    suspectsTitle: 'SOSPECHOSOS',
    roomsTitle: 'HABITACIONES',
    weaponsTitle: 'ARMAS',
    turnLogTitle: 'REGISTRO DE PREGUNTAS EN MESA',
    remaining: 'restantes',
    readyToAccuse: '¡Listo para Acusar!',
    btnSolve: 'Acusar',
    btnUndo: 'Deshacer',
    btnNote: 'Nota',
    btnAddLog: 'Anotar Turno',
    savedAuto: 'Guardado automáticamente',
    colItem: 'Elemento',
    colStatus: 'Estado',
    playerMe: 'Yo',
    privacyTitle: 'MODO CONFIDENCIAL ACTIVO',
    privacyDesc: 'Tu hoja de detective está oculta para que nadie en la mesa pueda espiar tus pistas.',
    privacyHold: 'Mantén pulsado para ver',
    privacyExit: 'Desactivar Modo Privacidad',
    confirmReset: '¿Estás seguro de que quieres borrar toda la hoja y empezar una nueva partida?',
    emptyLog: 'No hay notas registradas. Usa el registro para anotar quién preguntó a quién y qué mostraron.'
  },
  en: {
    appTitle: 'Cluesheet Companion',
    appSubtitle: 'Digital Detective • Clue 2010',
    suspectsTitle: 'SUSPECTS',
    roomsTitle: 'ROOMS',
    weaponsTitle: 'WEAPONS',
    turnLogTitle: 'TABLE INQUIRY LOG',
    remaining: 'remaining',
    readyToAccuse: 'Ready to Accuse!',
    btnSolve: 'Accuse',
    btnUndo: 'Undo',
    btnNote: 'Note',
    btnAddLog: 'Log Turn',
    savedAuto: 'Automatically saved',
    colItem: 'Clue',
    colStatus: 'Status',
    playerMe: 'Me',
    privacyTitle: 'CONFIDENTIAL PRIVACY SHIELD',
    privacyDesc: 'Your cluesheet is concealed so table neighbors cannot peek at your deductions.',
    privacyHold: 'Press & hold to reveal',
    privacyExit: 'Exit Privacy Mode',
    confirmReset: 'Are you sure you want to reset the cluesheet and start a new game?',
    emptyLog: 'No notes logged yet. Use the inquiry log to record who questioned whom and what was revealed.'
  }
};

// --- 2. State Management ---
const STORAGE_KEY = 'cluesheet_companion_state_v2';

let state = {
  lang: 'es',
  soundEnabled: true,
  privacyActive: false,
  players: ['Yo'], // 'Yo' / 'Me' is default
  marks: {}, // { [itemId]: { status: 'none', notes: '', playerMarks: { [player]: 'none' } } }
  history: [], // For undo
  turnLogs: [] // [ { id, timestamp, text } ]
};

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
    const statusDot = document.querySelector('.status-dot');
    if (statusDot) statusDot.classList.add('saving');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    setTimeout(() => {
      if (statusDot) statusDot.classList.remove('saving');
    }, 300);
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
        state.players = [state.lang === 'es' ? 'Yo' : 'Me'];
      }
      return;
    }
  } catch (e) {
    console.error('Failed to load state:', e);
  }
  initDefaultMarks();
}

function initDefaultMarks() {
  const allItems = [...GAME_DATA.suspects, ...GAME_DATA.rooms, ...GAME_DATA.weapons];
  allItems.forEach(item => {
    if (!state.marks[item.id]) {
      state.marks[item.id] = {
        status: 'none',
        notes: '',
        playerMarks: {}
      };
    }
  });
}

function pushHistory() {
  // Keep last 15 actions
  state.history.push(JSON.stringify(state.marks));
  if (state.history.length > 15) state.history.shift();
}

function undo() {
  if (state.history.length === 0) return;
  const previousMarks = state.history.pop();
  try {
    state.marks = JSON.parse(previousMarks);
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
  renderTable('suspects', GAME_DATA.suspects);
  renderTable('rooms', GAME_DATA.rooms);
  renderTable('weapons', GAME_DATA.weapons);
  updateMeter();
  renderLogList();
  renderPlayersModalList();
  populateLogSelects();
}

function renderLanguageLabels() {
  const t = I18N[state.lang];
  document.getElementById('txt-app-title').textContent = t.appTitle;
  document.getElementById('txt-app-subtitle').textContent = t.appSubtitle;
  document.getElementById('title-suspects').textContent = t.suspectsTitle;
  document.getElementById('title-rooms').textContent = t.roomsTitle;
  document.getElementById('title-weapons').textContent = t.weaponsTitle;
  document.getElementById('title-turn-log').textContent = t.turnLogTitle;
  document.getElementById('txt-undo').textContent = t.btnUndo;
  document.getElementById('txt-footer-note').textContent = t.btnNote;
  document.getElementById('txt-btn-add-log').textContent = t.btnAddLog;
  document.getElementById('save-status-text').textContent = t.savedAuto;
  document.getElementById('txt-privacy-title').textContent = t.privacyTitle;
  document.getElementById('txt-privacy-desc').textContent = t.privacyDesc;
  document.getElementById('txt-privacy-hold').textContent = t.privacyHold;
  document.getElementById('txt-privacy-exit').textContent = t.privacyExit;
  document.getElementById('lang-indicator').textContent = state.lang.toUpperCase();
  document.getElementById('players-badge').textContent = state.players.length;
}

function renderTable(categoryKey, items) {
  const t = I18N[state.lang];
  const thead = document.getElementById(`thead-${categoryKey}`);
  const tbody = document.getElementById(`tbody-${categoryKey}`);
  if (!thead || !tbody) return;

  // Render Table Header
  let headerHtml = `
    <tr>
      <th class="col-item">${t.colItem}</th>
      <th class="col-state">${t.colStatus}</th>
  `;

  // If more than 1 player, show opponent columns
  if (state.players.length > 1) {
    state.players.forEach(p => {
      headerHtml += `<th class="col-player">${escapeHtml(p)}</th>`;
    });
  }

  headerHtml += `</tr>`;
  thead.innerHTML = headerHtml;

  // Render Table Rows
  let bodyHtml = '';
  items.forEach(item => {
    const itemData = state.marks[item.id] || { status: 'none', notes: '', playerMarks: {} };
    const itemName = state.lang === 'es' ? item.es : item.en;
    const isEliminated = itemData.status === 'eliminated' || itemData.status === 'hand';
    const isEnvelope = itemData.status === 'envelope';
    const isHand = itemData.status === 'hand';

    let rowClass = 'clue-row';
    if (isEliminated) rowClass += ' is-eliminated';
    if (isEnvelope) rowClass += ' is-envelope';
    if (isHand) rowClass += ' is-hand';

    bodyHtml += `
      <tr class="${rowClass}" data-item-id="${item.id}">
        <td class="item-cell" onclick="handleItemClick('${item.id}')">
          <div class="item-info">
            <span class="item-name">${item.icon} ${itemName}</span>
            ${itemData.notes ? `<span class="item-notes">📝 ${escapeHtml(itemData.notes)}</span>` : ''}
          </div>
          <button class="btn-note-indicator ${itemData.notes ? 'has-note' : ''}" 
                  onclick="event.stopPropagation(); promptNote('${item.id}', '${escapeHtml(itemName)}')"
                  title="Añadir nota">
            ✏️
          </button>
        </td>
        <td class="mark-cell">
          <button class="mark-btn" data-mark="${itemData.status}" 
                  onclick="event.stopPropagation(); cycleMark('${item.id}')"
                  title="Cambiar estado">
            ${MARK_ICONS[itemData.status] || '⬜'}
          </button>
        </td>
    `;

    // Opponent player cells
    if (state.players.length > 1) {
      state.players.forEach(p => {
        const pMark = (itemData.playerMarks && itemData.playerMarks[p]) || 'none';
        bodyHtml += `
          <td class="mark-cell">
            <button class="mark-btn" data-mark="${pMark}" 
                    onclick="event.stopPropagation(); cyclePlayerMark('${item.id}', '${escapeHtml(p)}')">
              ${MARK_ICONS[pMark] || '⬜'}
            </button>
          </td>
        `;
      });
    }

    bodyHtml += `</tr>`;
  });

  tbody.innerHTML = bodyHtml;
}

function updateMeter() {
  const t = I18N[state.lang];
  const countRemaining = (items) => {
    return items.filter(item => {
      const mark = state.marks[item.id]?.status;
      return mark !== 'eliminated' && mark !== 'hand';
    }).length;
  };

  const remSuspects = countRemaining(GAME_DATA.suspects);
  const remRooms = countRemaining(GAME_DATA.rooms);
  const remWeapons = countRemaining(GAME_DATA.weapons);

  document.getElementById('count-suspects').textContent = `${remSuspects} / ${GAME_DATA.suspects.length}`;
  document.getElementById('count-rooms').textContent = `${remRooms} / ${GAME_DATA.rooms.length}`;
  document.getElementById('count-weapons').textContent = `${remWeapons} / ${GAME_DATA.weapons.length}`;

  document.getElementById('badge-suspects').textContent = `${remSuspects} ${t.remaining}`;
  document.getElementById('badge-rooms').textContent = `${remRooms} ${t.remaining}`;
  document.getElementById('badge-weapons').textContent = `${remWeapons} ${t.remaining}`;

  // Meter highlighting if solved to 1 remaining
  const elSus = document.getElementById('count-suspects');
  const elRoom = document.getElementById('count-rooms');
  const elWeap = document.getElementById('count-weapons');
  const btnSolve = document.getElementById('btn-solve-case');

  remSuspects === 1 ? elSus.classList.add('solved') : elSus.classList.remove('solved');
  remRooms === 1 ? elRoom.classList.add('solved') : elRoom.classList.remove('solved');
  remWeapons === 1 ? elWeap.classList.add('solved') : elWeap.classList.remove('solved');

  if (remSuspects === 1 && remRooms === 1 && remWeapons === 1) {
    btnSolve.classList.add('ready');
    document.getElementById('txt-btn-solve').textContent = t.readyToAccuse;
  } else {
    btnSolve.classList.remove('ready');
    document.getElementById('txt-btn-solve').textContent = t.btnSolve;
  }
}

// --- 6. Mark Actions ---
window.cycleMark = function(itemId) {
  pushHistory();
  sounds.vibrate(12);
  sounds.playTap('stamp');

  if (!state.marks[itemId]) {
    state.marks[itemId] = { status: 'none', notes: '', playerMarks: {} };
  }

  const current = state.marks[itemId].status || 'none';
  const nextIdx = (MARK_CYCLE.indexOf(current) + 1) % MARK_CYCLE.length;
  state.marks[itemId].status = MARK_CYCLE[nextIdx];

  renderAll();
  saveState();
};

window.cyclePlayerMark = function(itemId, player) {
  pushHistory();
  sounds.vibrate(12);
  sounds.playTap('click');

  if (!state.marks[itemId]) {
    state.marks[itemId] = { status: 'none', notes: '', playerMarks: {} };
  }
  if (!state.marks[itemId].playerMarks) {
    state.marks[itemId].playerMarks = {};
  }

  const current = state.marks[itemId].playerMarks[player] || 'none';
  const nextIdx = (MARK_CYCLE.indexOf(current) + 1) % MARK_CYCLE.length;
  state.marks[itemId].playerMarks[player] = MARK_CYCLE[nextIdx];

  // If this player showed the card, it can't be in the envelope
  if (MARK_CYCLE[nextIdx] === 'hand' || MARK_CYCLE[nextIdx] === 'eliminated') {
    // If player has it, we know it's not in envelope
    if (state.marks[itemId].status === 'none') {
      state.marks[itemId].status = 'eliminated';
    }
  }

  renderAll();
  saveState();
};

window.handleItemClick = function(itemId) {
  window.cycleMark(itemId);
};

window.promptNote = function(itemId, itemName) {
  const current = state.marks[itemId]?.notes || '';
  const note = prompt(`Nota para ${itemName}:`, current);
  if (note !== null) {
    pushHistory();
    if (!state.marks[itemId]) state.marks[itemId] = { status: 'none', notes: '', playerMarks: {} };
    state.marks[itemId].notes = note.trim();
    renderAll();
    saveState();
  }
};

// --- 7. Modals & Turn Log ---
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('hidden');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('hidden');
}

function populateLogSelects() {
  const askerSelect = document.getElementById('log-asker');
  const responderSelect = document.getElementById('log-responder');
  const suspectSelect = document.getElementById('log-suspect');
  const roomSelect = document.getElementById('log-room');
  const weaponSelect = document.getElementById('log-weapon');

  if (!askerSelect || !responderSelect) return;

  const playerOpts = state.players.map(p => `<option value="${escapeHtml(p)}">${escapeHtml(p)}</option>`).join('');
  askerSelect.innerHTML = playerOpts;
  responderSelect.innerHTML = `<option value="Nadie">Nadie mostró carta</option>` + playerOpts;

  suspectSelect.innerHTML = GAME_DATA.suspects.map(s => 
    `<option value="${state.lang === 'es' ? s.es : s.en}">${s.icon} ${state.lang === 'es' ? s.es : s.en}</option>`
  ).join('');

  roomSelect.innerHTML = GAME_DATA.rooms.map(r => 
    `<option value="${state.lang === 'es' ? r.es : r.en}">${r.icon} ${state.lang === 'es' ? r.es : r.en}</option>`
  ).join('');

  weaponSelect.innerHTML = GAME_DATA.weapons.map(w => 
    `<option value="${state.lang === 'es' ? w.es : w.en}">${w.icon} ${state.lang === 'es' ? w.es : w.en}</option>`
  ).join('');
}

function renderLogList() {
  const list = document.getElementById('log-list');
  const empty = document.getElementById('empty-log-msg');
  if (!list || !empty) return;

  if (state.turnLogs.length === 0) {
    empty.style.display = 'block';
    list.innerHTML = '';
    return;
  }

  empty.style.display = 'none';
  list.innerHTML = state.turnLogs.map((log, index) => `
    <li class="log-entry">
      <div>
        <div class="log-entry-text">${escapeHtml(log.text)}</div>
        <div class="log-entry-meta">${escapeHtml(log.time)}</div>
      </div>
      <button class="btn-delete-log" onclick="deleteLog(${index})" title="Borrar nota">&times;</button>
    </li>
  `).join('');
}

window.deleteLog = function(index) {
  state.turnLogs.splice(index, 1);
  renderLogList();
  saveState();
};

function renderPlayersModalList() {
  const container = document.getElementById('modal-players-list');
  if (!container) return;

  container.innerHTML = state.players.map((p, idx) => `
    <span class="player-chip">
      👤 ${escapeHtml(p)}
      ${state.players.length > 1 ? `<button class="player-chip-remove" onclick="removePlayer(${idx})" title="Eliminar">&times;</button>` : ''}
    </span>
  `).join('');
}

window.removePlayer = function(index) {
  if (state.players.length <= 1) return;
  state.players.splice(index, 1);
  renderAll();
  saveState();
};

function showAccusationModal() {
  const getCandidates = (items) => {
    return items.filter(item => {
      const mark = state.marks[item.id]?.status;
      return mark !== 'eliminated' && mark !== 'hand';
    }).map(item => {
      const isEnv = state.marks[item.id]?.status === 'envelope';
      const name = state.lang === 'es' ? item.es : item.en;
      return `<span class="candidate-tag ${isEnv ? 'winner' : ''}">${item.icon} ${name} ${isEnv ? '👑' : ''}</span>`;
    });
  };

  const susList = getCandidates(GAME_DATA.suspects);
  const roomList = getCandidates(GAME_DATA.rooms);
  const weapList = getCandidates(GAME_DATA.weapons);

  document.getElementById('acc-list-suspects').innerHTML = susList.length ? susList.join('') : '<em>Ninguno detectado</em>';
  document.getElementById('acc-list-rooms').innerHTML = roomList.length ? roomList.join('') : '<em>Ninguno detectado</em>';
  document.getElementById('acc-list-weapons').innerHTML = weapList.length ? weapList.join('') : '<em>Ninguno detectado</em>';

  openModal('modal-accusation');
}

// --- 8. Event Listeners & Setup ---
function setupEventListeners() {
  // Privacy Shield
  const shield = document.getElementById('privacy-shield');
  const btnPrivacy = document.getElementById('btn-privacy');
  const btnDisablePrivacy = document.getElementById('btn-disable-privacy');

  btnPrivacy.addEventListener('click', () => {
    shield.classList.remove('hidden');
    sounds.playTap('click');
  });

  btnDisablePrivacy.addEventListener('click', () => {
    shield.classList.add('hidden');
    sounds.playTap('click');
  });

  // Hold to peek
  const holdTrigger = shield.querySelector('.shield-instruction');
  const startPeek = () => shield.classList.add('peeking');
  const stopPeek = () => shield.classList.remove('peeking');

  holdTrigger.addEventListener('mousedown', startPeek);
  holdTrigger.addEventListener('mouseup', stopPeek);
  holdTrigger.addEventListener('mouseleave', stopPeek);
  holdTrigger.addEventListener('touchstart', (e) => { e.preventDefault(); startPeek(); }, { passive: false });
  holdTrigger.addEventListener('touchend', stopPeek);

  // Undo button
  document.getElementById('btn-undo').addEventListener('click', undo);

  // Sound toggle
  const btnSound = document.getElementById('btn-sound-toggle');
  btnSound.addEventListener('click', () => {
    state.soundEnabled = !state.soundEnabled;
    document.getElementById('sound-icon').textContent = state.soundEnabled ? '🔊' : '🔇';
    sounds.playTap('click');
    saveState();
  });

  // Language toggle
  document.getElementById('btn-lang').addEventListener('click', () => {
    state.lang = state.lang === 'es' ? 'en' : 'es';
    if (state.players.length === 1 && (state.players[0] === 'Yo' || state.players[0] === 'Me')) {
      state.players[0] = state.lang === 'es' ? 'Yo' : 'Me';
    }
    renderAll();
    saveState();
    sounds.playTap('click');
  });

  // Solve button
  document.getElementById('btn-solve-case').addEventListener('click', () => {
    showAccusationModal();
    sounds.playTap('stamp');
  });

  // New Game / Reset
  document.getElementById('btn-new-game').addEventListener('click', () => {
    openModal('modal-reset');
  });
  document.getElementById('btn-confirm-reset').addEventListener('click', () => {
    state.marks = {};
    state.history = [];
    state.turnLogs = [];
    initDefaultMarks();
    closeModal('modal-reset');
    renderAll();
    saveState();
    sounds.playTap('stamp');
  });

  // Players Modal
  document.getElementById('btn-players').addEventListener('click', () => {
    renderPlayersModalList();
    openModal('modal-players');
  });

  document.getElementById('btn-add-player').addEventListener('click', () => {
    const input = document.getElementById('new-player-input');
    const name = input.value.trim();
    if (name && !state.players.includes(name)) {
      state.players.push(name);
      input.value = '';
      renderPlayersModalList();
      renderAll();
      saveState();
      sounds.playTap('click');
    }
  });

  // Turn Log Modal
  const openLogModal = () => {
    populateLogSelects();
    openModal('modal-log');
  };
  document.getElementById('btn-add-log').addEventListener('click', openLogModal);
  document.getElementById('btn-quick-log').addEventListener('click', openLogModal);

  document.getElementById('form-log').addEventListener('submit', (e) => {
    e.preventDefault();
    const asker = document.getElementById('log-asker').value;
    const suspect = document.getElementById('log-suspect').value;
    const room = document.getElementById('log-room').value;
    const weapon = document.getElementById('log-weapon').value;
    const responder = document.getElementById('log-responder').value;
    const result = document.getElementById('log-result').value.trim();

    let text = `${asker} preguntó por [${suspect}, ${room}, ${weapon}].`;
    if (responder === 'Nadie') {
      text += ` Nadie mostró carta.`;
    } else {
      text += ` ${responder} mostró una carta.`;
    }
    if (result) text += ` (${result})`;

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    state.turnLogs.unshift({
      id: Date.now(),
      time: timeStr,
      text: text
    });

    closeModal('modal-log');
    document.getElementById('log-result').value = '';
    renderLogList();
    saveState();
    sounds.playTap('stamp');
  });

  // Generic modal close handlers
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-close');
      closeModal(modalId);
    });
  });

  // Close modals when clicking backdrop
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
      }
    });
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// --- 9. Service Worker & Boot ---
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(err => {
      console.log('SW registration note:', err);
    });
  });
}

// Init App
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  initDefaultMarks();
  setupEventListeners();
  renderAll();
});
