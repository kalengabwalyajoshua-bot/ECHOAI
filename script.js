/* =============================
   EchoAI Script.js
   Fully Functional
   Structured as 10 Chunks internally
============================= */

/* -------- Chunk 1: Element References -------- */
const chatWindow = document.getElementById('chatWindow');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const voiceBtn = document.getElementById('voiceBtn');
const storyFeature = document.getElementById('storyFeature');
const musicFeature = document.getElementById('musicFeature');
const controlFeature = document.getElementById('controlFeature');
const backgroundMusic = document.getElementById('backgroundMusic');
const storyAudio = document.getElementById('storyAudio');

/* -------- Chunk 2: Responses & Data -------- */
const responses = {
    greetings: ["Hello! How’s your day?", "Hey there! Ready to explore?", "Hi! I’m EchoAI."],
    farewell: ["Goodbye! Talk soon.", "See you later! Stay awesome.", "Catch you later!"],
    stories: [
        {title:"Calm Forest", audio:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", text:"Imagine walking through a calm forest..."},
        {title:"Stormy Adventure", audio:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", text:"Thunder rumbles as you step into stormy mountains..."},
        {title:"Ocean Escape", audio:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", text:"Waves crash gently as you drift into the endless ocean..."}
    ],
    music: [
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
    ],
    unknown: ["Hmm, I’m not sure. Can you rephrase?", "Interesting... I need to think more!", "Sorry, I don't know that yet."],
    phoneControl: {call:"Simulating a call...", sms:"Pretending to send a message...", toggleData:"Toggling mobile data..."}
};

/* -------- Chunk 3: Utility Functions -------- */
function addMessage(content, sender='system') {
    const msg = document.createElement('div');
    msg.classList.add('message', sender);
    msg.textContent = content;
    chatWindow.appendChild(msg);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function randomChoice(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

/* -------- Chunk 4: Input Processing -------- */
function processInput(text) {
    text = text.toLowerCase();
    if (text.includes("hello") || text.includes("hi")) addMessage(randomChoice(responses.greetings));
    else if (text.includes("bye") || text.includes("goodbye")) addMessage(randomChoice(responses.farewell));
    else if (text.includes("story")) tellRandomStory();
    else if (text.includes("music")) playRandomMusic();
    else if (text.includes("call") || text.includes("message") || text.includes("data")) controlPhone(text);
    else addMessage(randomChoice(responses.unknown));
}

/* -------- Chunk 5: Story Feature -------- */
function tellRandomStory() {
    const story = randomChoice(responses.stories);
    addMessage(`🎬 ${story.title}: ${story.text}`);
    storyAudio.src = story.audio;
    storyAudio.play();
}

/* -------- Chunk 6: Music Feature -------- */
function playRandomMusic() {
    const music = randomChoice(responses.music);
    backgroundMusic.src = music;
    backgroundMusic.play();
    addMessage("🎵 Playing music for you...");
}

/* -------- Chunk 7: Phone Control Feature -------- */
function controlPhone(cmd) {
    let resp = "";
    if(cmd.includes("call")) resp = responses.phoneControl.call;
    else if(cmd.includes("message")) resp = responses.phoneControl.sms;
    else if(cmd.includes("data")) resp = responses.phoneControl.toggleData;
    else resp = "Cannot control this feature yet.";
    addMessage(`📱 ${resp}`);
}

/* -------- Chunk 8: Event Listeners for Chat -------- */
sendBtn.addEventListener('click', () => {
    const t = userInput.value.trim();
    if(t === "") return;
    addMessage(t, 'user');
    userInput.value = '';
    processInput(t);
});

userInput.addEventListener('keypress', (e) => {
    if(e.key === 'Enter') sendBtn.click();
});

/* -------- Chunk 9: Event Listeners for Features -------- */
storyFeature.addEventListener('click', tellRandomStory);
musicFeature.addEventListener('click', playRandomMusic);
controlFeature.addEventListener('click', () => {
    addMessage("📱 Phone control clicked. Use commands.");
});

/* -------- Chunk 10: Voice Recognition & Initialization -------- */
let recognition;
if('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => { addMessage("🎤 Listening...", 'system'); }
    recognition.onresult = (e) => { const t = e.results[0][0].transcript; addMessage(t, 'user'); processInput(t); }
    recognition.onerror = () => { addMessage("Voice recognition error. Try again.", 'system'); }

    voiceBtn.addEventListener('click', () => { if(recognition) recognition.start(); });
} else {
    voiceBtn.disabled = true;
    voiceBtn.textContent = "Voice not supported";
}

window.addEventListener('load', () => { 
    setTimeout(() => { addMessage("✨ EchoAI is online! Speak or type to start..."); }, 500); 
});
