/* =============================
   EchoAI Script - script.js
   Fully Functional with Online Music & Stories
============================= */

const chatWindow = document.getElementById('chatWindow');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const voiceBtn = document.getElementById('voiceBtn');
const glowBubble = document.getElementById('glowBubble');
const storyFeature = document.getElementById('storyFeature');
const musicFeature = document.getElementById('musicFeature');
const controlFeature = document.getElementById('controlFeature');

const backgroundMusic = document.getElementById('backgroundMusic');
const storyAudio = document.getElementById('storyAudio');

/* ----------------------------
   AI Response Database
---------------------------- */
const responses = {
    greetings: [
        "Hello! How’s your day going?",
        "Hey there! Ready to explore?",
        "Hi! I’m EchoAI, your companion."
    ],
    farewell: [
        "Goodbye! Talk soon.",
        "See you later! Stay awesome.",
        "Catch you later!"
    ],
    stories: [
        {
            title: "Calm Forest",
            audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
            text: "Close your eyes and imagine walking through a calm forest..."
        },
        {
            title: "Stormy Adventure",
            audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
            text: "Thunder rumbles as you step into the stormy mountains..."
        },
        {
            title: "Ocean Escape",
            audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
            text: "Waves crash gently as you drift into the endless blue ocean..."
        },
        {
            title: "Magical Night",
            audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
            text: "Stars twinkle as magic fills the night sky..."
        },
        {
            title: "Anger Release",
            audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
            text: "Take a deep breath and imagine releasing all your anger..."
        },
        {
            title: "Joyful Meadow",
            audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
            text: "Birds chirp as sunlight floods the vibrant meadow..."
        }
    ],
    music: [
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3"
    ],
    unknown: [
        "Hmm, I’m not sure about that. Can you rephrase?",
        "Interesting... I need to think more about that!",
        "Sorry, I don't know that yet."
    ],
    phoneControl: {
        call: "Simulating a call...",
        sms: "Pretending to send a message...",
        toggleData: "Toggling mobile data..."
    }
};

/* ----------------------------
   Helper Functions
---------------------------- */
function addMessage(content, sender = 'system') {
    const msg = document.createElement('div');
    msg.classList.add('message');
    msg.classList.add(sender);
    msg.textContent = content;
    chatWindow.appendChild(msg);
    chatWindow.scrollTop = chatWindow.scrollHeight;
    animateGlowBubble();
}

function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function animateGlowBubble() {
    glowBubble.style.transform = 'scale(1.3)';
    setTimeout(() => {
        glowBubble.style.transform = 'scale(1)';
    }, 300);
}

/* ----------------------------
   Text Input Handling
---------------------------- */
sendBtn.addEventListener('click', () => {
    const text = userInput.value.trim();
    if (text === "") return;
    addMessage(text, 'user');
    userInput.value = '';
    processInput(text);
});

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendBtn.click();
    }
});

/* ----------------------------
   Voice Input Handling
---------------------------- */
let recognition;
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => {
        addMessage("🎤 Listening...", "system");
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        addMessage(transcript, 'user');
        processInput(transcript);
    };

    recognition.onerror = (event) => {
        addMessage("Voice recognition error, please try again.", "system");
    };
} else {
    voiceBtn.disabled = true;
    voiceBtn.textContent = "Voice not supported";
}

voiceBtn.addEventListener('click', () => {
    if (recognition) recognition.start();
});

/* ----------------------------
   Input Processing
---------------------------- */
function processInput(text) {
    text = text.toLowerCase();

    if (text.includes("hello") || text.includes("hi")) {
        addMessage(randomChoice(responses.greetings));
    } else if (text.includes("bye") || text.includes("goodbye")) {
        addMessage(randomChoice(responses.farewell));
    } else if (text.includes("story")) {
        tellRandomStory();
    } else if (text.includes("music")) {
        playRandomMusic();
    } else if (text.includes("call") || text.includes("message") || text.includes("data")) {
        controlPhone(text);
    } else {
        addMessage(randomChoice(responses.unknown));
    }
}

/* ----------------------------
   Story Feature
---------------------------- */
function tellRandomStory() {
    const story = randomChoice(responses.stories);
    addMessage(`🎬 ${story.title}: ${story.text}`);
    storyAudio.src = story.audio;
    storyAudio.play();
}

/* ----------------------------
   Music Feature
---------------------------- */
function playRandomMusic() {
    const music = randomChoice(responses.music);
    backgroundMusic.src = music;
    backgroundMusic.play();
    addMessage("🎵 Playing music for you...");
}

/* ----------------------------
   Phone Control Simulation
---------------------------- */
function controlPhone(command) {
    let response = "";
    if (command.includes("call")) response = responses.phoneControl.call;
    else if (command.includes("message")) response = responses.phoneControl.sms;
    else if (command.includes("data")) response = responses.phoneControl.toggleData;
    else response = "Cannot control this feature yet.";

    addMessage(`📱 ${response}`);
}

/* ----------------------------
   Feature Button Events
---------------------------- */
storyFeature.addEventListener('click', () => {
    tellRandomStory();
});

musicFeature.addEventListener('click', () => {
    playRandomMusic();
});

controlFeature.addEventListener('click', () => {
    addMessage("📱 Phone control feature clicked. Use voice commands to interact.");
});

/* ----------------------------
   Glow Bubble Interaction
---------------------------- */
glowBubble.addEventListener('click', () => {
    addMessage("💡 You clicked the EchoAI bubble! What shall we do?");
});

/* ----------------------------
   Background Music Controls
---------------------------- */
backgroundMusic.addEventListener('ended', () => {
    addMessage("🎵 Music ended. Want me to play another track?");
});

/* ----------------------------
   Story Audio Controls
---------------------------- */
storyAudio.addEventListener('ended', () => {
    addMessage("📖 Story finished. Do you want another one?");
});

/* ----------------------------
   Auto-Greeting on Load
---------------------------- */
window.addEventListener('load', () => {
    setTimeout(() => {
        addMessage("✨ EchoAI is online! Speak or type to start...");
    }, 500);
});

/* ----------------------------
   Extra Feature: Typing Simulation
---------------------------- */
function typeMessage(msg, sender='system') {
    const msgEl = document.createElement('div');
    msgEl.classList.add('message', sender);
    chatWindow.appendChild(msgEl);
    let i = 0;
    function typeChar() {
        if (i < msg.length) {
            msgEl.textContent += msg[i];
            i++;
            chatWindow.scrollTop = chatWindow.scrollHeight;
            setTimeout(typeChar, 30);
        }
    }
    typeChar();
}
