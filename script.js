/* ===========================
   GLOBAL VARIABLES
=========================== */
const messages = document.getElementById('messages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const voiceBtn = document.getElementById('voiceBtn');
const storyBtn = document.getElementById('storyBtn');
const storyOverlay = document.getElementById('storyOverlay');
const storyContent = document.getElementById('storyContent');
const closeStory = document.getElementById('closeStory');
const music = document.getElementById('music');
const nowPlaying = document.getElementById('nowPlaying');
const aiOrb = document.getElementById('aiOrb');
const floatingOrbs = document.querySelectorAll('.floating-orb');

/* ===========================
   CHAT RESPONSES
=========================== */
const responses = {
    hello: ["Hello there! How's your day going?", "Hi! I'm EchoAI, your magical companion!"],
    howareyou: ["I'm just a bunch of code, but feeling electric!", "Great! Excited to chat with you."],
    default: ["Interesting… tell me more.", "I see! Can you explain further?", "Hmm… fascinating!"]
};

function getResponse(text) {
    const cleanText = text.toLowerCase().replace(/[^a-zA-Z ]/g, '');
    if(cleanText.includes('hello') || cleanText.includes('hi')) return randomChoice(responses.hello);
    if(cleanText.includes('how are you')) return randomChoice(responses.howareyou);
    return randomChoice(responses.default);
}

function randomChoice(arr) {
    return arr[Math.floor(Math.random()*arr.length)];
}

/* ===========================
   SEND MESSAGE FUNCTION
=========================== */
function sendMessage() {
    const userText = userInput.value.trim();
    if(userText === '') return;
    appendMessage(userText, 'user');
    userInput.value = '';

    // AI response
    const aiText = getResponse(userText);
    setTimeout(() => {
        appendMessage(aiText, 'ai');
        speakText(aiText);
        animateOrb();
    }, 800);
}

function appendMessage(text, type) {
    const msg = document.createElement('div');
    msg.classList.add('message', type);
    msg.textContent = text;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
}

/* ===========================
   VOICE COMMANDS
=========================== */
let recognition;
if('webkitSpeechRecognition' in window){
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        userInput.value = transcript;
        sendMessage();
    }
}

voiceBtn.addEventListener('click', () => {
    if(recognition) recognition.start();
});

/* ===========================
   SPEECH SYNTHESIS
=========================== */
function speakText(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1;
    utterance.pitch = 1.2;
    speechSynthesis.speak(utterance);
}

/* ===========================
   AI ORB ANIMATION
=========================== */
function animateOrb() {
    aiOrb.style.transform = 'translate(-50%, -50%) scale(1.2)';
    setTimeout(() => {
        aiOrb.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 500);
}

/* ===========================
   FLOATING ORBS ANIMATION
=========================== */
function animateFloatingOrbs() {
    floatingOrbs.forEach((orb, index) => {
        const offset = Math.random() * 20;
        orb.style.transform = `translate(${offset}px, ${-offset}px)`;
        setTimeout(()=>{ orb.style.transform = 'translate(0,0)'; }, 3000 + index*100);
    });
}
setInterval(animateFloatingOrbs, 4000);

/* ===========================
   MUSIC PLAYER
=========================== */
music.addEventListener('play', () => {
    nowPlaying.textContent = "Playing: " + (music.currentSrc.split('/').pop() || "Unknown Track");
});

music.addEventListener('pause', () => {
    nowPlaying.textContent = "Music Paused 🎵";
});

music.addEventListener('ended', () => {
    nowPlaying.textContent = "No music playing 🎵";
});

/* ===========================
   STORY MODE
=========================== */
const bedtimeStories = [
    "Once upon a time in a mystical forest, the stars whispered secrets to the moon...",
    "Far away in a land of endless skies, a young magician learned the true power of kindness...",
    "In the depths of a glowing cave, creatures of light sang lullabies to the world..."
];

storyBtn.addEventListener('click', () => {
    storyOverlay.style.display = 'flex';
    showRandomStory();
});

closeStory.addEventListener('click', () => {
    storyOverlay.style.display = 'none';
    storyContent.innerHTML = '';
});

function showRandomStory() {
    const story = randomChoice(bedtimeStories);
    storyContent.innerHTML = '';
    let i = 0;
    const interval = setInterval(() => {
        if(i < story.length){
            storyContent.innerHTML += story[i];
            i++;
        } else {
            clearInterval(interval);
            speakText(story);
        }
    }, 50);
}

/* ===========================
   ENTER KEY SEND
=========================== */
userInput.addEventListener('keypress', (e) => {
    if(e.key === 'Enter') sendMessage();
});

/* ===========================
   BACKGROUND PARTICLES
=========================== */
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
for(let i=0;i<150;i++){
    particles.push({
        x: Math.random()*canvas.width,
        y: Math.random()*canvas.height,
        r: Math.random()*2+1,
        dx: (Math.random()-0.5)*0.5,
        dy: (Math.random()-0.5)*0.5
    });
}

function animateParticles(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle = 'rgba(0,255,255,0.6)';
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if(p.x<0||p.x>canvas.width) p.dx*=-1;
        if(p.y<0||p.y>canvas.height) p.dy*=-1;
    });
    requestAnimationFrame(animateParticles);
}
animateParticles();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
