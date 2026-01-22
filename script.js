let appState = {
  status: "Idle",
  active: false,
  lastResponse: null
};

const statusEl = document.getElementById("status");
const screenEl = document.getElementById("screen");
const powerBtn = document.getElementById("powerBtn");
const helpBtn = document.getElementById("helpBtn");

/* =========================
   RESPONSE BANK
========================= */
const responses = {
  welcome: [
    "👋 Hello, I’m EchoAI. Tap ⚡ to begin.",
    "Welcome. I’m here whenever you’re ready.",
    "Hi there. Activate me when you need help."
  ],
  active: [
    "🎧 I’m listening. What can I help you with?",
    "Ready and active. Go ahead.",
    "I’m here. Speak or tap anytime."
  ],
  help: [
    "Use ⚡ to activate me.",
    "I assist with information, guidance, and learning.",
    "More features will unlock soon."
  ]
};

/* =========================
   UTILITIES
========================= */
function randomFrom(list) {
  let choice;
  do {
    choice = list[Math.floor(Math.random() * list.length)];
  } while (choice === appState.lastResponse);

  appState.lastResponse = choice;
  return choice;
}

/* =========================
   CORE FUNCTIONS
========================= */
function setStatus(text) {
  appState.status = text;
  statusEl.innerText = text;
}

function showWelcome() {
  screenEl.innerHTML = `<p>${randomFrom(responses.welcome)}</p>`;
}

function activateEchoAI() {
  appState.active = true;
  setStatus("Listening");

  screenEl.innerHTML = `<p>${randomFrom(responses.active)}</p>`;
}

function showHelp() {
  setStatus("Help");

  screenEl.innerHTML = `<p>${randomFrom(responses.help)}</p>`;
}

/* =========================
   EVENTS
========================= */
powerBtn.addEventListener("click", () => {
  if (!appState.active) {
    activateEchoAI();
  } else {
    setStatus("Active");
    screenEl.innerHTML = `<p>${randomFrom(responses.active)}</p>`;
  }
});

helpBtn.addEventListener("click", showHelp);

/* =========================
   INIT
========================= */
window.onload = () => {
  setStatus("Idle");
  showWelcome();
};
