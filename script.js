let appState = {
  status: "Idle",
  active: false,
  lastResponse: null
};

const statusEl = document.getElementById("status");
const screenEl = document.getElementById("screen");
const powerBtn = document.getElementById("powerBtn");
const helpBtn = document.getElementById("helpBtn");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

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
  ],
  voiceReply: [
    "I heard you clearly!",
    "Got it, processing...",
    "Thanks for speaking, I’m ready to respond.",
    "Interesting, tell me more!",
    "Okay, I understand."
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
   SPEECH FUNCTION
========================= */
function speak(text) {
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel(); // Stop any current speech
  }

  const synth = window.speechSynthesis;
  const utter = new SpeechSynthesisUtterance(text);

  // Pick a default English voice
  const voices = synth.getVoices();
  const enVoice = voices.find(v => v.lang.startsWith("en")) || voices[0];
  if(enVoice) utter.voice = enVoice;

  utter.lang = 'en-US';
  utter.rate = 1;
  utter.pitch = 1;

  synth.speak(utter);
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

function showHelp() {
  setStatus("Help");
  screenEl.innerHTML = `<p>${randomFrom(responses.help)}</p>`;
}

/* =========================
   VOICE RECOGNITION + GLOW
========================= */
let recognition;
function startVoice() {
  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    alert("Your browser does not support voice recognition.");
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  // Glow + expand effect
  powerBtn.classList.add("glow");
  setStatus("Listening...");
  screenEl.innerHTML = `<p>${randomFrom(responses.active)}</p>`;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    const reply = randomFrom(responses.voiceReply);

    screenEl.innerHTML = `
      <p>🗣 You said: "${transcript}"</p>
      <p>${reply}</p>
    `;

    speak(reply); // Speak aloud

    setStatus("Active");
  };

  recognition.onerror = (event) => {
    screenEl.innerHTML = `<p>⚠️ Error occurred: ${event.error}</p>`;
    setStatus("Idle");
  };

  recognition.onend = () => {
    powerBtn.classList.remove("glow");
    if (appState.active) setStatus("Active");
    else setStatus("Idle");
  };
}

/* =========================
   EVENT LISTENERS
========================= */
powerBtn.addEventListener("click", () => {
  appState.active = true;
  startVoice();
});

helpBtn.addEventListener("click", showHelp);

sendBtn.addEventListener("click", () => {
  const msg = userInput.value.trim();
  if (msg === "") return;

  const reply = randomFrom(responses.voiceReply);

  screenEl.innerHTML = `
    <p>📝 You typed: "${msg}"</p>
    <p>${reply}</p>
  `;

  speak(reply); // Speak aloud

  userInput.value = "";
  setStatus("Active");
});

/* =========================
   INIT
========================= */
window.onload = () => {
  setStatus("Idle");
  showWelcome();
};
