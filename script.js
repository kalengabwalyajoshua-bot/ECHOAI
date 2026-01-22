// ============================
// EchoAI Fully Functional JS
// ============================

// ----------------------------
// Screen Navigation
// ----------------------------
const screens = document.querySelectorAll('#screen-wrapper .screen');
const backBtns = document.querySelectorAll('.back-btn');
const featureBtns = document.querySelectorAll('.feature-btn');

function showScreen(screenId) {
  screens.forEach(screen => screen.classList.remove('active'));
  const target = document.getElementById(screenId);
  if (target) target.classList.add('active');
}

// Back buttons
backBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const screenId = btn.getAttribute('data-screen');
    showScreen(screenId);
  });
});

// Quick Access Buttons
featureBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const screenId = btn.getAttribute('data-screen');
    showScreen(screenId);
  });
});

// ----------------------------
// FABs (Advanced Settings & Help)
// ----------------------------
const fabAdvanced = document.getElementById('fab-advanced');
const fabHelp = document.getElementById('fab-help');
const advancedScreen = document.getElementById('advanced-settings');
const helpPanel = document.getElementById('help-panel');

fabAdvanced.addEventListener('click', () => {
  advancedScreen.classList.toggle('hidden');
});

fabHelp.addEventListener('click', () => {
  helpPanel.classList.toggle('hidden');
});

// ----------------------------
// Tooltips
// ----------------------------
const tooltip = document.getElementById('tooltip');
const tooltipText = document.getElementById('tooltip-text');

function showTooltip(text) {
  tooltipText.textContent = text;
  tooltip.classList.remove('hidden');
  setTimeout(() => tooltip.classList.add('hidden'), 2500);
}

// ----------------------------
// Notifications
// ----------------------------
const notificationsPanel = document.getElementById('glow-notifications');
const notificationText = document.getElementById('notification-text');

function showNotification(text) {
  notificationText.textContent = text;
  notificationsPanel.classList.remove('hidden');
  setTimeout(() => notificationsPanel.classList.add('hidden'), 3000);
}

// ----------------------------
// AI Thought Bubble
// ----------------------------
const aiBubble = document.getElementById('ai-thought-bubble');
const aiBubbleText = document.getElementById('ai-thought-text');

function showAIThought(text) {
  aiBubbleText.textContent = text;
  aiBubble.classList.remove('hidden');
  setTimeout(() => aiBubble.classList.add('hidden'), 3000);
}

// ----------------------------
// Voice Commands
// ----------------------------
const voiceBtn = document.getElementById('voice-btn');
const voiceInput = document.getElementById('voice-search');
const voiceResponse = document.getElementById('voice-response');
const historyList = document.getElementById('history-list');

voiceBtn.addEventListener('click', () => {
  const command = voiceInput.value.trim();
  if (!command) return;

  // Add to history
  const li = document.createElement('li');
  li.textContent = command;
  historyList.appendChild(li);
  document.getElementById('voice-history').classList.remove('hidden');

  // Show AI Thinking
  showAIThought('🤖 Processing command...');

  // Simulate AI response
  setTimeout(() => {
    voiceResponse.textContent = `EchoAI Response: "${command}" received!`;
    showNotification(`Command "${command}" executed`);
  }, 1500);

  voiceInput.value = '';
});

// ----------------------------
// Video Analyzer Controls
// ----------------------------
const startAnalysis = document.getElementById('start-analysis');
const stopAnalysis = document.getElementById('stop-analysis');
const snapshotBtn = document.getElementById('snapshot');
const analysisResult = document.getElementById('analysis-result');

startAnalysis.addEventListener('click', () => {
  analysisResult.textContent = 'Analyzing video...';
  showNotification('Video analysis started');
});

stopAnalysis.addEventListener('click', () => {
  analysisResult.textContent = 'Analysis stopped';
  showNotification('Video analysis stopped');
});

snapshotBtn.addEventListener('click', () => {
  showNotification('Snapshot taken!');
});

// ----------------------------
// Status Bar Updates
// ----------------------------
const statusMode = document.getElementById('status-mode');
const statusTime = document.getElementById('status-time');

function updateStatus(mode) {
  statusMode.textContent = mode;
}

function updateTime() {
  const now = new Date();
  const time = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  statusTime.textContent = time;
}

setInterval(updateTime, 1000);

// ----------------------------
// Easter Egg Trigger
// ----------------------------
const easterEgg = document.getElementById('easter-egg-trigger');
easterEgg.addEventListener('click', () => {
  showAIThought('🎉 You found the Easter Egg!');
  showNotification('Easter Egg Activated!');
});

// ----------------------------
// Initialize App
// ----------------------------
document.addEventListener('DOMContentLoaded', () => {
  showScreen('home-screen');
  voiceResponse.textContent = 'Welcome to EchoAI! Say something or press 🎤';
  updateTime();
});
