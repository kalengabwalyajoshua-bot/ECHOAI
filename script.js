// ===================== EchoAI script.js =====================

// DOM Elements
const voiceBtn = document.getElementById("voice-btn");
const responseContainer = document.getElementById("response-container");
const storyText = document.getElementById("story-text");
const startStoryBtn = document.getElementById("start-story");
const stopStoryBtn = document.getElementById("stop-story");
const nextStoryBtn = document.getElementById("next-story");
const storyMusic = document.getElementById("story-music");
const soundEffectsContainer = document.getElementById("sound-effects-container");
const voiceStatus = document.getElementById("voice-status");

// ======== Bedtime Stories Setup ========
const stories = [
    {
        title: "Calm River Adventure",
        text: "You step into a quiet forest, the gentle sound of a river guiding your path. Birds chirp softly as the sun filters through the leaves. You feel at peace as the water flows by, carrying away your worries.",
        music: "music/calm_river.mp3",
        soundEffect: "sounds/water_flow.mp3"
    },
    {
        title: "Angry Storm Journey",
        text: "Thunder crashes in the dark sky as wind lashes the trees. You brace yourself and run through the storm, feeling the raw power of nature. It's wild, intense, and thrilling all at once.",
        music: "music/storm.mp3",
        soundEffect: "sounds/thunder.mp3"
    },
    {
        title: "Exciting Treasure Hunt",
        text: "You find yourself on a tropical island, the treasure map in your hand. Each step brings a new challenge, but your excitement pushes you forward. The chest awaits, full of mysteries and gold.",
        music: "music/adventure.mp3",
        soundEffect: "sounds/coins.mp3"
    },
    {
        title: "Peaceful Night Sky",
        text: "Lying on soft grass, you watch the stars twinkle. A gentle breeze caresses your face. The universe feels infinite, and you are small, calm, and connected to everything around you.",
        music: "music/night_sky.mp3",
        soundEffect: "sounds/crickets.mp3"
    },
    {
        title: "Curious Forest Exploration",
        text: "You wander into a mysterious forest, discovering hidden paths and glowing flowers. Your curiosity guides you through unknown wonders, making each step an exciting discovery.",
        music: "music/forest_explore.mp3",
        soundEffect: "sounds/wind_chimes.mp3"
    }
];

let currentStoryIndex = 0;
let storyPlaying = false;

// ======== Story Controls ========
function startStory() {
    const story = stories[currentStoryIndex];
    storyText.textContent = story.text;
    storyMusic.src = story.music;
    storyMusic.play();
    playSoundEffect(story.soundEffect);
    storyPlaying = true;
}

function stopStory() {
    storyMusic.pause();
    storyMusic.currentTime = 0;
    storyPlaying = false;
}

function nextStory() {
    stopStory();
    currentStoryIndex = (currentStoryIndex + 1) % stories.length;
    startStory();
}

// ======== Sound Effects ========
function playSoundEffect(src) {
    const sound = document.createElement("audio");
    sound.src = src;
    sound.play();
    soundEffectsContainer.appendChild(sound);
    sound.addEventListener("ended", () => sound.remove());
}

// ======== Voice Recognition Setup ========
let recognition;
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
} else if ('SpeechRecognition' in window) {
    recognition = new SpeechRecognition();
}

if (recognition) {
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        voiceStatus.classList.remove("hidden-screen");
    };

    recognition.onend = () => {
        voiceStatus.classList.add("hidden-screen");
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        respondToVoice(transcript);
    };
}

// ======== Voice Command Responses ========
function respondToVoice(input) {
    let response = "";
    if (input.includes("story") || input.includes("bedtime")) {
        startStory();
        response = "Starting a story for you...";
    } else if (input.includes("stop story") || input.includes("pause")) {
        stopStory();
        response = "Story paused.";
    } else if (input.includes("next story") || input.includes("next")) {
        nextStory();
        response = "Moving to the next story...";
    } else {
        response = generateChatResponse(input);
    }
    responseContainer.textContent = response;
}

// ======== Simple Conversational Responses ========
function generateChatResponse(input) {
    input = input.toLowerCase();
    if (input.includes("hello") || input.includes("hi")) {
        return "Hello! How are you feeling today?";
    } else if (input.includes("happy")) {
        return "That's great! Let's make your day even better!";
    } else if (input.includes("sad")) {
        return "I’m here with you. Maybe a calming story will help?";
    } else if (input.includes("angry")) {
        return "Take a deep breath. I have an exciting story to redirect your energy!";
    } else if (input.includes("bored")) {
        return "I can tell you a story or play some relaxing music!";
    } else {
        return "Interesting! Tell me more...";
    }
}

// ======== Event Listeners ========
voiceBtn.addEventListener("click", () => {
    if (recognition) recognition.start();
});

startStoryBtn.addEventListener("click", startStory);
stopStoryBtn.addEventListener("click", stopStory);
nextStoryBtn.addEventListener("click", nextStory);

// ======== Background Canvas Glowing Effect ========
const canvas = document.getElementById("glow-effects-canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
for (let i = 0; i < 60; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        dx: (Math.random() - 0.5) * 0.7,
        dy: (Math.random() - 0.5) * 0.7
    });
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(138,43,226,0.6)";
        ctx.fill();
    });
    requestAnimationFrame(animateParticles);
}
animateParticles();
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
