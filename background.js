// StudySocial Background Service Worker (Manifest V3)

const SOCIAL_DOMAINS = {
  'youtube.com': { name: 'YouTube', icon: '📺', category: 'video' },
  'reddit.com': { name: 'Reddit', icon: '🤖', category: 'community' },
  'instagram.com': { name: 'Instagram', icon: '📷', category: 'social' },
  'twitter.com': { name: 'Twitter / X', icon: '🐦', category: 'social' },
  'x.com': { name: 'Twitter / X', icon: '🐦', category: 'social' },
  'facebook.com': { name: 'Facebook', icon: '👥', category: 'social' },
  'tiktok.com': { name: 'TikTok', icon: '🎵', category: 'entertainment' },
  'linkedin.com': { name: 'LinkedIn', icon: '💼', category: 'professional' },
  'pinterest.com': { name: 'Pinterest', icon: '📌', category: 'creative' }
};

let activeTabInfo = {
  tabId: null,
  domain: null,
  startTime: null
};

// Get today's date string YYYY-MM-DD
function getTodayString() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

// Extract matching social domain if present
function getSocialDomain(url) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();
    for (const domain in SOCIAL_DOMAINS) {
      if (hostname === domain || hostname.endsWith('.' + domain)) {
        // Normalize x.com to twitter.com for unified statistics
        return domain === 'x.com' ? 'twitter.com' : domain;
      }
    }
  } catch (e) {
    // Ignore invalid URLs (chrome://, etc.)
  }
  return null;
}

// Flush accumulated time for the previously active tab
async function flushActiveTabTime() {
  if (!activeTabInfo.domain || !activeTabInfo.startTime) return;

  const now = Date.now();
  const elapsedSeconds = Math.max(0, Math.round((now - activeTabInfo.startTime) / 1000));
  const domain = activeTabInfo.domain;
  activeTabInfo.startTime = now; // reset to now

  if (elapsedSeconds <= 0) return;

  const today = getTodayString();
  const data = await chrome.storage.local.get(['timeStats']);
  const timeStats = data.timeStats || {};
  if (!timeStats[today]) {
    timeStats[today] = {
      domains: {},
      totalSocialSeconds: 0,
      totalFocusSeconds: 0
    };
  }

  const dayStats = timeStats[today];
  dayStats.domains[domain] = (dayStats.domains[domain] || 0) + elapsedSeconds;
  dayStats.totalSocialSeconds = (dayStats.totalSocialSeconds || 0) + elapsedSeconds;

  await chrome.storage.local.set({ timeStats });
}

// Track active tab changes
async function checkActiveTab() {
  await flushActiveTabTime();

  try {
    const tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    if (tabs && tabs.length > 0 && tabs[0].url) {
      const socialDomain = getSocialDomain(tabs[0].url);
      activeTabInfo = {
        tabId: tabs[0].id,
        domain: socialDomain,
        startTime: socialDomain ? Date.now() : null
      };
    } else {
      activeTabInfo = { tabId: null, domain: null, startTime: null };
    }
  } catch (err) {
    console.error('Error querying active tab:', err);
  }
}

// Chrome Tab Listeners
chrome.tabs.onActivated.addListener(() => {
  checkActiveTab();
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.url) {
    checkActiveTab();
  }
});

chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    flushActiveTabTime();
    activeTabInfo = { tabId: null, domain: null, startTime: null };
  } else {
    checkActiveTab();
  }
});

// Periodic timer to flush time and update focus countdown
chrome.alarms.create('heartbeat_flush', { periodInMinutes: 0.5 });

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'heartbeat_flush') {
    await flushActiveTabTime();
    await updateFocusStatePeriodic();
  } else if (alarm.name === 'focus_session_done') {
    await completeFocusSession();
  }
});

// Update Focus State and badge
async function updateFocusStatePeriodic() {
  const result = await chrome.storage.local.get(['focusState']);
  const focus = result.focusState;
  if (!focus || !focus.isActive) {
    chrome.action.setBadgeText({ text: '' });
    return;
  }

  const now = Date.now();
  const elapsedSec = Math.floor((now - focus.startTime) / 1000);
  const remainingSec = Math.max(0, focus.durationMinutes * 60 - elapsedSec);

  if (remainingSec <= 0) {
    await completeFocusSession();
  } else {
    const remainingMins = Math.ceil(remainingSec / 60);
    chrome.action.setBadgeText({ text: `${remainingMins}m` });
    chrome.action.setBadgeBackgroundColor({ color: '#4f46e5' });
  }
}

// Handle focus session completion
async function completeFocusSession() {
  chrome.alarms.clear('focus_session_done');
  chrome.action.setBadgeText({ text: 'DONE' });
  chrome.action.setBadgeBackgroundColor({ color: '#10b981' });

  const result = await chrome.storage.local.get(['focusState', 'progressData', 'timeStats']);
  const focus = result.focusState || {};
  const progress = result.progressData || {
    streakDays: 1,
    lastActiveDate: getTodayString(),
    completedSessions: 0,
    totalFocusMinutes: 0,
    completedGoals: 0
  };

  const minutesToAdd = focus.durationMinutes || 25;
  progress.completedSessions = (progress.completedSessions || 0) + 1;
  progress.totalFocusMinutes = (progress.totalFocusMinutes || 0) + minutesToAdd;

  // Update streak if needed
  const today = getTodayString();
  if (progress.lastActiveDate !== today) {
    const lastDate = new Date(progress.lastActiveDate);
    const currentDate = new Date(today);
    const dayDiff = Math.round((currentDate - lastDate) / (1000 * 60 * 60 * 24));
    if (dayDiff === 1) {
      progress.streakDays = (progress.streakDays || 0) + 1;
    } else if (dayDiff > 1) {
      progress.streakDays = 1;
    }
    progress.lastActiveDate = today;
  }

  // Update today's total focus seconds
  const timeStats = result.timeStats || {};
  if (!timeStats[today]) {
    timeStats[today] = { domains: {}, totalSocialSeconds: 0, totalFocusSeconds: 0 };
  }
  timeStats[today].totalFocusSeconds = (timeStats[today].totalFocusSeconds || 0) + minutesToAdd * 60;

  await chrome.storage.local.set({
    focusState: {
      isActive: false,
      startTime: null,
      durationMinutes: 0,
      goalText: '',
      shieldEnabled: false
    },
    progressData: progress,
    timeStats: timeStats
  });

  // Desktop Notification
  try {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: '🎉 Focus Session Completed!',
      message: `Great job! You completed ${minutesToAdd} minutes of focused study. Time for a well-deserved mindful break.`,
      priority: 2
    });
  } catch (e) {
    console.log('Notification skipped or unsupported:', e);
  }
}

// Runtime message handler for popup, dashboard and content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'START_FOCUS') {
    const { durationMinutes, goalText, shieldEnabled } = request;
    const now = Date.now();

    chrome.storage.local.set({
      focusState: {
        isActive: true,
        startTime: now,
        durationMinutes: durationMinutes,
        goalText: goalText || 'Focused Study',
        shieldEnabled: shieldEnabled !== false
      }
    }, () => {
      chrome.alarms.create('focus_session_done', { delayInMinutes: durationMinutes });
      chrome.action.setBadgeText({ text: `${durationMinutes}m` });
      chrome.action.setBadgeBackgroundColor({ color: '#4f46e5' });
      sendResponse({ success: true });
    });
    return true; // async sendResponse
  }

  if (request.action === 'STOP_FOCUS') {
    chrome.alarms.clear('focus_session_done');
    chrome.action.setBadgeText({ text: '' });
    chrome.storage.local.set({
      focusState: {
        isActive: false,
        startTime: null,
        durationMinutes: 0,
        goalText: '',
        shieldEnabled: false
      }
    }, () => {
      sendResponse({ success: true });
    });
    return true;
  }

  if (request.action === 'GET_STATE') {
    chrome.storage.local.get(['focusState', 'timeStats', 'progressData', 'goals', 'notes', 'theme'], (data) => {
      sendResponse(data);
    });
    return true;
  }

  if (request.action === 'OPEN_DASHBOARD') {
    chrome.tabs.create({ url: chrome.runtime.getURL('dashboard.html') });
    sendResponse({ success: true });
    return true;
  }
});

// Initialization on install
chrome.runtime.onInstalled.addListener(async () => {
  const existing = await chrome.storage.local.get(['progressData', 'goals', 'notes', 'theme', 'userInterests']);
  const today = getTodayString();

  if (!existing.progressData) {
    await chrome.storage.local.set({
      progressData: {
        streakDays: 1,
        lastActiveDate: today,
        completedSessions: 0,
        totalFocusMinutes: 0,
        completedGoals: 0
      }
    });
  }

  if (!existing.goals) {
    await chrome.storage.local.set({
      goals: [
        { id: 1, text: "Complete 25 min focused study sprint", category: "Focus", completed: false, date: today },
        { id: 2, text: "Read 1 educational article / watch 1 lecture", category: "Learning", completed: false, date: today },
        { id: 3, text: "Audit social media feed & follow 2 mentor accounts", category: "Growth", completed: false, date: today }
      ]
    });
  }

  if (!existing.notes) {
    await chrome.storage.local.set({
      notes: [
        {
          id: 1,
          title: "Welcome to StudySocial! 🌟",
          content: "Use this notepad to save interesting concepts, research citations, and insights you discover while browsing educational channels.",
          url: "https://studysocial.app",
          date: new Date().toLocaleDateString()
        }
      ]
    });
  }

  if (!existing.theme) {
    await chrome.storage.local.set({ theme: 'light' });
  }

  if (!existing.userInterests) {
    await chrome.storage.local.set({
      userInterests: ['Programming', 'English', 'Science']
    });
  }

  checkActiveTab();
});
