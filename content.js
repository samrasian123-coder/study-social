// StudySocial Content Script: Focus Shield & Mindful Learning Nudge

(function() {
  let overlayElement = null;
  let timerInterval = null;
  let bypassUntil = 0;

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  function removeShield() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    if (overlayElement) {
      overlayElement.remove();
      overlayElement = null;
      document.body.style.overflow = '';
    }
  }

  function showShield(focusState) {
    if (overlayElement || Date.now() < bypassUntil) return;

    overlayElement = document.createElement('div');
    overlayElement.id = 'studysocial-shield-overlay';

    const goalText = focusState.goalText || 'Focused Study Sprint';

    overlayElement.innerHTML = `
      <div class="studysocial-card">
        <div class="studysocial-badge">
          <span>🎯</span> Study Focus Mode Active
        </div>
        <h2 class="studysocial-title">Hold on, Scholar!</h2>
        <p style="color: #cbd5e1; font-size: 14px; margin: 0 0 14px 0;">
          You set a goal to focus. Don't let algorithmic distraction steal your momentum.
        </p>

        <div class="studysocial-goal-box">
          <div class="studysocial-goal-label">Current Study Target</div>
          <div class="studysocial-goal-text">${escapeHtml(goalText)}</div>
        </div>

        <div class="studysocial-timer" id="studysocial-timer-display">--:--</div>

        <p class="studysocial-tip">
          💡 Tip: "Active recall and deep focus for 25 minutes yields more retention than 3 hours of distracted multitasking."
        </p>

        <div class="studysocial-actions">
          <button class="studysocial-btn studysocial-btn-primary" id="studysocial-back-btn">
            ⬅️ Close Tab & Return to Study
          </button>
          <button class="studysocial-btn studysocial-btn-secondary" id="studysocial-hub-btn">
            🎓 Open Learning Resources Hub
          </button>
          <button class="studysocial-bypass-link" id="studysocial-bypass-btn">
            I need this tab for academic research (Pause shield for 5 mins)
          </button>
        </div>
      </div>
    `;

    document.documentElement.appendChild(overlayElement);
    document.body.style.overflow = 'hidden';

    // Hook events
    const backBtn = overlayElement.querySelector('#studysocial-back-btn');
    backBtn.addEventListener('click', () => {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.close();
      }
    });

    const hubBtn = overlayElement.querySelector('#studysocial-hub-btn');
    hubBtn.addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'OPEN_DASHBOARD' });
      removeShield();
    });

    const bypassBtn = overlayElement.querySelector('#studysocial-bypass-btn');
    bypassBtn.addEventListener('click', () => {
      bypassUntil = Date.now() + 5 * 60 * 1000;
      removeShield();
    });

    // Start local countdown update
    const updateCountdown = () => {
      const now = Date.now();
      const elapsed = Math.floor((now - focusState.startTime) / 1000);
      const totalSec = focusState.durationMinutes * 60;
      const remaining = Math.max(0, totalSec - elapsed);

      const timerDisplay = document.getElementById('studysocial-timer-display');
      if (timerDisplay) {
        timerDisplay.textContent = formatTime(remaining);
      }

      if (remaining <= 0) {
        removeShield();
      }
    };

    updateCountdown();
    timerInterval = setInterval(updateCountdown, 1000);
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function checkShieldStatus() {
    chrome.storage.local.get(['focusState'], (data) => {
      const focus = data.focusState;
      if (focus && focus.isActive && focus.shieldEnabled) {
        showShield(focus);
      } else {
        removeShield();
      }
    });
  }

  // Initial check
  checkShieldStatus();

  // Listen for storage changes
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && changes.focusState) {
      const newFocus = changes.focusState.newValue;
      if (newFocus && newFocus.isActive && newFocus.shieldEnabled) {
        showShield(newFocus);
      } else {
        removeShield();
      }
    }
  });

})();
