// StudySocial - Popup Logic (Universal: Works in Extension & Web/Vercel)

// Storage helper: Chrome extension storage with localStorage fallback
const storage = {
  async get(keys) {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      return new Promise((resolve) => chrome.storage.local.get(keys, resolve));
    }
    const res = {};
    const keyList = Array.isArray(keys) ? keys : [keys];
    keyList.forEach((k) => {
      try {
        const item = localStorage.getItem(k);
        if (item !== null) res[k] = JSON.parse(item);
      } catch (e) {
        console.error('Storage parse error:', e);
      }
    });
    return res;
  },
  async set(items) {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      return new Promise((resolve) => chrome.storage.local.set(items, resolve));
    }
    for (const [k, v] of Object.entries(items)) {
      try {
        localStorage.setItem(k, JSON.stringify(v));
      } catch (e) {
        console.error('Storage set error:', e);
      }
    }
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  initTabs();
  initDailyTips();
  initPillars();
  initFocusTimer();
  await initGoals();
  await initNotes();
  await initStats();
});

// --- Theme Management ---
function initTheme() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  const savedTheme = localStorage.getItem('study_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('study_theme', next);
      updateThemeIcon(next);
    });
  }
}

function updateThemeIcon(theme) {
  const icon = document.querySelector('#themeToggleBtn .theme-icon');
  if (icon) {
    icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

// --- Tabs Navigation ---
function initTabs() {
  const navButtons = document.querySelectorAll('.nav-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  navButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');
      navButtons.forEach((b) => b.classList.remove('active'));
      tabPanes.forEach((p) => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');
    });
  });

  const exploreAllBtn = document.getElementById('viewAllPillarsBtn');
  if (exploreAllBtn) {
    exploreAllBtn.addEventListener('click', () => {
      const goalsTabBtn = document.querySelector('[data-tab="tab-goals"]');
      if (goalsTabBtn) goalsTabBtn.click();
    });
  }
}

// --- Daily Tips ---
let currentTipIndex = 0;
function initDailyTips() {
  const tips = (typeof DAILY_TIPS !== 'undefined' && DAILY_TIPS.length) ? DAILY_TIPS : [
    {
      category: 'Focus Mindset',
      tip: 'Curate your digital feeds to inspire, educate, and energize your daily ambitions.',
      action: 'Follow 3 educational creators in your study domain today.'
    }
  ];

  function renderTip(index) {
    const tip = tips[index % tips.length];
    const catEl = document.getElementById('dailyTipCategory');
    const textEl = document.getElementById('dailyTipText');
    const actEl = document.getElementById('dailyTipAction');

    if (catEl) catEl.textContent = tip.category || 'Positive Tip';
    if (textEl) textEl.textContent = `"${tip.tip}"`;
    if (actEl) actEl.textContent = tip.action || 'Take a positive step today.';
  }

  renderTip(currentTipIndex);

  const nextBtn = document.getElementById('nextTipBtn');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentTipIndex = (currentTipIndex + 1) % tips.length;
      renderTip(currentTipIndex);
    });
  }
}

// --- Positive Pillars Preview ---
function initPillars() {
  const container = document.getElementById('pillarsMiniList');
  if (!container) return;

  const pillars = (typeof POSITIVE_PILLARS !== 'undefined' && POSITIVE_PILLARS.length) ? POSITIVE_PILLARS : [
    { icon: '🎓', title: 'Education', badge: 'Learn', summary: 'Curated knowledge feeds' },
    { icon: '💬', title: 'Community', badge: 'Connect', summary: 'Constructive student networks' },
    { icon: '💼', title: 'Career', badge: 'Grow', summary: 'Internships and portfolio showcase' }
  ];

  container.innerHTML = pillars.slice(0, 3).map((p) => `
    <div class="pillar-mini-card" style="display: flex; align-items: center; gap: 10px; padding: 10px; margin-bottom: 8px; background: var(--bg-card); border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
      <div style="font-size: 1.4rem;">${p.icon}</div>
      <div style="flex: 1;">
        <div style="font-weight: 600; font-size: 0.9rem;">${p.title}</div>
        <div style="font-size: 0.78rem; color: var(--text-muted);">${p.summary}</div>
      </div>
      <span class="badge" style="background: var(--primary-light); color: var(--primary); font-size: 0.7rem; padding: 2px 8px; border-radius: 999px;">${p.badge || 'Active'}</span>
    </div>
  `).join('');
}

// --- Focus Timer ---
let timerInterval = null;
let timerDuration = 25 * 60; // seconds
let timeRemaining = 25 * 60;
let isTimerRunning = false;

function initFocusTimer() {
  const clockEl = document.getElementById('timerClock');
  const statusLabel = document.getElementById('timerStatusLabel');
  const startBtn = document.getElementById('startFocusBtn');
  const stopBtn = document.getElementById('stopFocusBtn');
  const chips = document.querySelectorAll('.duration-chip');

  function updateClockDisplay() {
    const mins = Math.floor(timeRemaining / 60);
    const secs = timeRemaining % 60;
    if (clockEl) {
      clockEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
  }

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      if (isTimerRunning) return;
      chips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      const mins = parseInt(chip.getAttribute('data-mins'), 10) || 25;
      timerDuration = mins * 60;
      timeRemaining = timerDuration;
      updateClockDisplay();
    });
  });

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      isTimerRunning = true;
      startBtn.classList.add('hidden');
      if (stopBtn) stopBtn.classList.remove('hidden');
      if (statusLabel) statusLabel.textContent = 'Focus Sprint in Progress...';

      timerInterval = setInterval(() => {
        if (timeRemaining > 0) {
          timeRemaining--;
          updateClockDisplay();
        } else {
          clearInterval(timerInterval);
          isTimerRunning = false;
          if (statusLabel) statusLabel.textContent = 'Sprint Complete! Great Job! 🎉';
          startBtn.classList.remove('hidden');
          if (stopBtn) stopBtn.classList.add('hidden');
          timeRemaining = timerDuration;
          updateClockDisplay();
          recordFocusTime(Math.round(timerDuration / 60));
        }
      }, 1000);
    });
  }

  if (stopBtn) {
    stopBtn.addEventListener('click', () => {
      clearInterval(timerInterval);
      isTimerRunning = false;
      if (statusLabel) statusLabel.textContent = 'Sprint Paused / Reset';
      startBtn.classList.remove('hidden');
      stopBtn.classList.add('hidden');
      timeRemaining = timerDuration;
      updateClockDisplay();
    });
  }

  updateClockDisplay();
}

async function recordFocusTime(mins) {
  const data = await storage.get(['focusMinutes']);
  const current = Number(data.focusMinutes || 0);
  await storage.set({ focusMinutes: current + mins });
  await initStats();
}

// --- Goals Management ---
async function initGoals() {
  const form = document.getElementById('addGoalForm');
  const input = document.getElementById('newGoalInput');
  const categorySelect = document.getElementById('newGoalCategory');
  const listEl = document.getElementById('goalsList');
  const badgeEl = document.getElementById('goalsCounterBadge');
  const statBadge = document.getElementById('completedGoalsStat');

  let data = await storage.get(['studyGoals']);
  let goals = data.studyGoals || [
    { id: 1, title: 'Review 3 chapters of biology notes', category: 'Focus', done: false },
    { id: 2, title: 'Watch 1 Python tutorial video', category: 'Learning', done: true }
  ];

  function renderGoals() {
    if (!listEl) return;
    listEl.innerHTML = '';
    const completed = goals.filter((g) => g.done).length;

    if (badgeEl) badgeEl.textContent = `${completed} of ${goals.length} Completed`;
    if (statBadge) statBadge.textContent = `${completed}/${goals.length}`;

    if (goals.length === 0) {
      listEl.innerHTML = `<li style="text-align: center; color: var(--text-muted); padding: 15px;">No goals added yet. Add one above!</li>`;
      return;
    }

    goals.forEach((g) => {
      const li = document.createElement('li');
      li.className = `goal-item ${g.done ? 'completed' : ''}`;
      li.style.cssText = 'display: flex; align-items: center; justify-content: space-between; padding: 10px; margin-bottom: 6px; background: var(--bg-card); border-radius: var(--radius-sm); border: 1px solid var(--border-color);';
      li.innerHTML = `
        <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; flex: 1;">
          <input type="checkbox" ${g.done ? 'checked' : ''} data-id="${g.id}">
          <span style="${g.done ? 'text-decoration: line-through; color: var(--text-muted);' : 'font-weight: 500;'}">${g.title}</span>
        </label>
        <span class="badge" style="font-size: 0.72rem; padding: 2px 6px; background: var(--bg-subtle); border-radius: 4px; margin-right: 8px;">${g.category || 'Study'}</span>
        <button class="delete-goal-btn" data-id="${g.id}" style="background: transparent; border: none; cursor: pointer; color: var(--accent-rose); font-size: 0.9rem;">✕</button>
      `;
      listEl.appendChild(li);
    });

    listEl.querySelectorAll('input[type="checkbox"]').forEach((chk) => {
      chk.addEventListener('change', async (e) => {
        const id = Number(e.target.getAttribute('data-id'));
        const goal = goals.find((item) => item.id === id);
        if (goal) goal.done = e.target.checked;
        await storage.set({ studyGoals: goals });
        renderGoals();
      });
    });

    listEl.querySelectorAll('.delete-goal-btn').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const id = Number(e.target.getAttribute('data-id'));
        goals = goals.filter((item) => item.id !== id);
        await storage.set({ studyGoals: goals });
        renderGoals();
      });
    });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const val = input.value.trim();
      if (!val) return;
      goals.push({
        id: Date.now(),
        title: val,
        category: categorySelect ? categorySelect.value : 'Focus',
        done: false
      });
      input.value = '';
      await storage.set({ studyGoals: goals });
      renderGoals();
    });
  }

  renderGoals();
}

// --- Quick Notes ---
async function initNotes() {
  const titleInput = document.getElementById('noteTitleInput');
  const contentInput = document.getElementById('noteContentInput');
  const saveBtn = document.getElementById('saveNoteBtn');
  const listEl = document.getElementById('savedNotesList');
  const captureBtn = document.getElementById('captureCurrentPageBtn');

  let data = await storage.get(['studyNotes']);
  let notes = data.studyNotes || [
    { id: 1, title: 'Feynman Technique', content: 'Explain concepts in plain terms as if teaching a child. Identifies true knowledge gaps.', date: 'Today' }
  ];

  function renderNotes() {
    if (!listEl) return;
    listEl.innerHTML = '';
    if (notes.length === 0) {
      listEl.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 15px; font-size: 0.85rem;">No saved notes yet. Capture ideas as you learn!</p>`;
      return;
    }

    notes.forEach((n) => {
      const card = document.createElement('div');
      card.className = 'note-card';
      card.style.cssText = 'padding: 10px; margin-bottom: 8px; background: var(--bg-card); border-radius: var(--radius-sm); border: 1px solid var(--border-color);';
      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
          <h4 style="font-size: 0.9rem; font-weight: 600;">${n.title}</h4>
          <button class="delete-note-btn" data-id="${n.id}" style="background: none; border: none; cursor: pointer; color: var(--accent-rose); font-size: 0.85rem;">✕</button>
        </div>
        <p style="font-size: 0.82rem; color: var(--text-secondary); white-space: pre-wrap;">${n.content}</p>
        <span style="font-size: 0.7rem; color: var(--text-muted); display: block; margin-top: 6px;">${n.date || 'Saved Note'}</span>
      `;
      listEl.appendChild(card);
    });

    listEl.querySelectorAll('.delete-note-btn').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const id = Number(e.target.getAttribute('data-id'));
        notes = notes.filter((n) => n.id !== id);
        await storage.set({ studyNotes: notes });
        renderNotes();
      });
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      const title = titleInput.value.trim();
      const content = contentInput.value.trim();
      if (!title && !content) return;

      notes.unshift({
        id: Date.now(),
        title: title || 'Quick Note',
        content: content,
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      titleInput.value = '';
      contentInput.value = '';
      await storage.set({ studyNotes: notes });
      renderNotes();
    });
  }

  if (captureBtn) {
    captureBtn.addEventListener('click', () => {
      if (titleInput) titleInput.value = document.title || 'Study Resource';
      if (contentInput) contentInput.value = `Captured from: ${window.location.href}\n`;
    });
  }

  renderNotes();
}

// --- Stats & Tracker ---
async function initStats() {
  const streakEl = document.getElementById('streakDisplay');
  const socialEl = document.getElementById('todaySocialTime');
  const focusEl = document.getElementById('todayFocusTime');
  const ratioFocus = document.getElementById('ratioFocusLabel');
  const ratioSocial = document.getElementById('ratioSocialLabel');
  const barFocus = document.getElementById('barFocus');
  const barSocial = document.getElementById('barSocial');
  const platformList = document.getElementById('platformTimeList');

  const data = await storage.get(['focusMinutes', 'socialMinutes', 'streakDays']);
  const focusMins = Number(data.focusMinutes || 25);
  const socialMins = Number(data.socialMinutes || 15);
  const streak = Number(data.streakDays || 1);

  if (streakEl) streakEl.textContent = `${streak} Day${streak > 1 ? 's' : ''}`;
  if (socialEl) socialEl.textContent = `${socialMins}m`;
  if (focusEl) focusEl.textContent = `${focusMins}m`;
  if (ratioFocus) ratioFocus.textContent = `${focusMins}m`;
  if (ratioSocial) ratioSocial.textContent = `${socialMins}m`;

  const total = focusMins + socialMins;
  if (total > 0 && barFocus && barSocial) {
    const focusPct = Math.round((focusMins / total) * 100);
    const socialPct = 100 - focusPct;
    barFocus.style.width = `${focusPct}%`;
    barSocial.style.width = `${socialPct}%`;
  }

  if (platformList) {
    const platforms = [
      { name: 'YouTube Education', icon: '📺', time: '10m', type: 'Productive' },
      { name: 'Reddit (r/learnprogramming)', icon: '🤖', time: '5m', type: 'Learning' }
    ];
    platformList.innerHTML = platforms.map((p) => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 0; border-bottom: 1px solid var(--border-color); font-size: 0.85rem;">
        <span>${p.icon} ${p.name}</span>
        <span style="font-weight: 600; color: var(--primary);">${p.time}</span>
      </div>
    `).join('');
  }
}
