// ====================== EchoAI Script.js ======================

// ----------- Global Variables -----------
const responseContainer = document.getElementById("response-container");
const storyText = document.getElementById("story-text");
const storyMusic = document.getElementById("story-music");
const startStoryBtn = document.getElementById("start-story");
const stopStoryBtn = document.getElementById("stop-story");
const voiceBtn = document.getElementById("voice-btn");
const soundEffectsContainer = document.getElementById("sound-effects-container");

let currentStoryIndex = 0;
let storyPlaying = false;

// ----------- Bedtime Stories -----------
const stories = [
  {
    title: "Calm Forest",
    theme: "calm",
    text: `In a quiet forest, the trees whispered secrets. A gentle breeze carried the scent of wildflowers, and a small stream sang a soft lullaby. You feel your heartbeat slow as you sit by the water, letting the calm wash over you.`,
    music: "music/calm_forest.mp3",
    effects: ["sounds/water_stream.mp3", "sounds/birds_chirping.mp3"]
  },
  {
    title: "Firefly Night",
    theme: "curiosity",
    text: `The night is alive with twinkling fireflies. Each flicker feels like a tiny puzzle of the universe waiting for you to discover it. You follow their lights, laughing quietly, mesmerized by the tiny sparks of magic dancing around you.`,
    music: "music/firefly_night.mp3",
    effects: ["sounds/crickets.mp3", "sounds/wind_whisper.mp3"]
  },
  {
    title: "Stormy Adventure",
    theme: "excitement",
    text: `Dark clouds rumble overhead as you sail through uncharted waters. Lightning illuminates the waves, and the thrill of adventure fills your chest. Every crash of thunder makes your heart beat faster, alive with courage and excitement.`,
    music: "music/stormy_adventure.mp3",
    effects: ["sounds/thunder.mp3", "sounds/rain.mp3"]
  },
  {
    title: "Angry Volcano",
    theme: "anger",
    text: `The ground shakes and the volcano roars, fire and smoke bursting into the sky. Feel the power of nature's anger and let it remind you that strong emotions can be released and transformed. Breathe deeply as the molten energy flows around you.`,
    music: "music/angry_volcano.mp3",
    effects: ["sounds/eruption.mp3", "sounds/rumble.mp3"]
  },
  {
    title: "Joyful Meadow",
    theme: "joy",
    text: `A meadow filled with blooming flowers stretches as far as your eyes can see. Butterflies dance around, the sun warms your face, and laughter seems to rise from the earth itself. Joy bubbles inside you, unstoppable and radiant.`,
    music: "music/joyful_meadow.mp3",
    effects: ["sounds/birds_happy.mp3", "sounds/wind_soft.mp3"]
  }
];

// ----------- Sound Effects Handler -----------
function playSoundEffects(effects) {
  soundEffectsContainer.innerHTML = "";
  effects.forEach((effectSrc) => {
    const audio = document.createElement("audio");
    audio.src = effectSrc;
    audio.autoplay = true;
    audio.loop = true;
    soundEffectsContainer.appendChild(audio);
  });
}

// ----------- Story Control Functions -----------
function startStory() {
  if (storyPlaying) return;
  storyPlaying = true;
  const story = stories[currentStoryIndex];
  storyText.innerText = story.text;
  storyMusic.src = story.music;
  storyMusic.play();
  playSoundEffects(story.effects);
  responseContainer.innerText = `EchoAI: Now telling "${story.title}"... Enjoy the experience.`;
}

function stopStory() {
  storyPlaying = false;
  storyMusic.pause();
  storyMusic.currentTime = 0;
  soundEffectsContainer.innerHTML = "";
  storyText.innerText = "Press 'Start Story' to begin your adventure.";
  responseContainer.innerText = "EchoAI: Story stopped.";
}

// ----------- Cycle Stories -----------
function nextStory() {
  currentStoryIndex = (currentStoryIndex + 1) % stories.length;
  startStory();
}

// ----------- Voice Recognition -----------
let recognition;
if ("webkitSpeechRecognition" in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.lang = "en-US";
  recognition.interimResults = false;

  recognition.onstart = () => {
    document.getElementById("voice-status").classList.remove("hidden-screen");
    responseContainer.innerText = "EchoAI: Listening...";
  };

  recognition.onend = () => {
    document.getElementById("voice-status").classList.add("hidden-screen");
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase();
    responseContainer.innerText = `You: ${transcript}`;
    handleCommand(transcript);
  };

  voiceBtn.addEventListener("click", () => {
    recognition.start();
  });
}

// ----------- Human-Like Response Handler -----------
function handleCommand(input) {
  input = input.trim();
  let lower = input.toLowerCase();

  if (lower.includes("story") || lower.includes("bedtime")) {
    startStory();
  } else if (lower.includes("stop story")) {
    stopStory();
  } else if (lower.includes("next story")) {
    nextStory();
  } else if (lower.includes("send whatsapp")) {
    sendWhatsAppMessage();
  } else if (lower.includes("call me")) {
    makeCall();
  } else if (lower.includes("toggle data")) {
    toggleData();
  } else if (lower.includes("hello") || lower.includes("hi")) {
    responseContainer.innerText = "EchoAI: Hello! How’s your day going?";
  } else if (lower.includes("play music")) {
    responseContainer.innerText = "EchoAI: Playing ambient music...";
    playAmbientMusic();
  } else {
    responseContainer.innerText = `EchoAI: Hmm, I heard "${input}". Let's see... I'm always learning!`;
  }
}

// ----------- Ambient Music -----------
function playAmbientMusic() {
  const ambient = document.getElementById("ambient-music");
  ambient.src = "music/ambient.mp3";
  ambient.play();
}

// ----------- Phone Controls (Simulated) -----------
function sendWhatsAppMessage() {
  responseContainer.innerText = "EchoAI: Pretending to send a WhatsApp message... (simulation)";
}

function makeCall() {
  responseContainer.innerText = "EchoAI: Pretending to call you... (simulation)";
}

function toggleData() {
  responseContainer.innerText = "EchoAI: Toggling mobile data... (simulation)";
}

function stopAll() {
  stopStory();
  const ambient = document.getElementById("ambient-music");
  ambient.pause();
  ambient.currentTime = 0;
  responseContainer.innerText = "EchoAI: All activities stopped.";
}

// ----------- Dynamic Glow Effects (Canvas) -----------
const canvas = document.getElementById("glow-effects-canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let glowParticles = [];
for (let i = 0; i < 50; i++) {
  glowParticles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 3 + 1,
    dx: (Math.random() - 0.5) * 0.5,
    dy: (Math.random() - 0.5) * 0.5,
    alpha: Math.random()
  });
}

function animateGlow() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  glowParticles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2);
    ctx.fillStyle = `rgba(138,43,226,${p.alpha})`;
    ctx.fill();
    p.x += p.dx;
    p.y += p.dy;
    if (p.x < 0 || p.x > canvas.width) p.dx = -p.dx;
    if (p.y < 0 || p.y > canvas.height) p.dy = -p.dy;
  });
  requestAnimationFrame(animateGlow);
}
animateGlow();

// ----------- Keyboard Shortcuts -----------
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") nextStory();
  if (e.key === "Escape") stopAll();
});

// ----------- Auto Cycle Stories Every 5 Minutes -----------
setInterval(() => {
  if (!storyPlaying) return;
  nextStory();
}, 300000); // 5 minutes

// ====================== END OF SCRIPT ======================
