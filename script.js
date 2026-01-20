// ====== Elements ======
const messages = document.getElementById('messages');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const voiceBtn = document.getElementById('voiceBtn');
const musicPlayer = document.getElementById('music');
const nowPlaying = document.getElementById('nowPlaying');
const aiOrb = document.getElementById('aiOrb');
const synth = window.speechSynthesis;

// ====== Initial Magical Messages ======
const magicalGreetings = [
  "🌟 Welcome to EchoAI, your magical companion!",
  "✨ The stars are listening… ask anything!",
  "💫 Your emotions guide my music and words."
];
magicalGreetings.forEach(msg => addMessage(msg,'ai'));

// ====== Add Message Function ======
function addMessage(text,sender){
  const div=document.createElement('div');
  div.classList.add('message',sender);
  div.textContent=text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

// ====== Text-to-Speech ======
function speak(text){
  if(synth.speaking) synth.cancel(); // Stop previous
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'en-US';
  synth.speak(utter);
}

// ====== Emotion Detection ======
function detectEmotion(text){
  text = text.toLowerCase();
  if(/happy|good|great|awesome|yay|fantastic|amazing/.test(text)) return 'happy';
  if(/sad|unhappy|lonely|bad|upset|depressed/.test(text)) return 'sad';
  if(/angry|mad|hate|annoyed|frustrated/.test(text)) return 'angry';
  return 'neutral';
}

// ====== Mood Music ======
function playMoodMusic(emotion){
  let url="";
  switch(emotion){
    case 'happy': url="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"; break;
    case 'sad': url="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"; break;
    case 'angry': url="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"; break;
    default: url="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"; break;
  }
  musicPlayer.src=url;
  musicPlayer.play();
  nowPlaying.textContent = `Playing ${emotion} music 🎵`;
  updateOrbColor(emotion);
}

// ====== AI Response ======
function aiResponse(text){
  const emotion = detectEmotion(text);
  let response="";
  switch(emotion){
    case 'happy':
      response="😄 You sound happy! Let's keep the good vibes flowing!";
      playMoodMusic('happy'); break;
    case 'sad':
      response="😢 It's okay to feel sad. I'm here with you.";
      playMoodMusic('sad'); break;
    case 'angry':
      response="😡 Take a deep breath. Let's calm down together.";
      playMoodMusic('angry'); break;
    default:
      response="🙂 I hear you. Tell me more.";
      playMoodMusic('neutral'); break;
  }
  speak(response);
  return response;
}

// ====== Update Orb Color Based on Mood ======
function updateOrbColor(emotion){
  switch(emotion){
    case 'happy': aiOrb.style.background='radial-gradient(circle, #fffa65, #4ade80)'; break;
    case 'sad': aiOrb.style.background='radial-gradient(circle, #3b82f6, #4ade80)'; break;
    case 'angry': aiOrb.style.background='radial-gradient(circle, #f87171, #7f5af0)'; break;
    default: aiOrb.style.background='radial-gradient(circle, #7f5af0, #4ade80)'; break;
  }
}

// ====== Detect Commands (Simulation) ======
function detectCommand(text){
  text = text.toLowerCase();
  if(/call (\d+)/.test(text)){
    const num = text.match(/call (\d+)/)[1];
    addMessage(`⚡ Calling ${num}... (Simulation)`, 'ai');
    speak(`Calling ${num}`);
    return true;
  }
  if(/open whatsapp/.test(text)){
    addMessage(`⚡ Opening WhatsApp... (Simulation)`, 'ai');
    speak(`Opening WhatsApp`);
    return true;
  }
  if(/turn on wifi/.test(text)){
    addMessage(`⚡ Turning Wi-Fi on... (Simulation)`, 'ai');
    speak(`Turning Wi-Fi on`);
    return true;
  }
  if(/turn off wifi/.test(text)){
    addMessage(`⚡ Turning Wi-Fi off... (Simulation)`, 'ai');
    speak(`Turning Wi-Fi off`);
    return true;
  }
  return false;
}

// ====== Handle User Input ======
function handleUserInput(text){
  addMessage(text,'user');
  if(!detectCommand(text)){
    const reply = aiResponse(text);
    addMessage(reply,'ai');
  }
}

// ====== Send Button ======
sendBtn.addEventListener('click',()=>{
  const text = userInput.value.trim();
  if(!text) return;
  handleUserInput(text);
  userInput.value="";
});

// ====== Voice Input ======
voiceBtn.addEventListener('click',()=>{
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang='en-US';
  recognition.start();
  recognition.onresult = (event)=>{
    const text = event.results[0][0].transcript;
    handleUserInput(text);
  };
});

// ====== Magical Periodic Messages ======
setInterval(()=>{
  const magicals = [
    "🌌 The stars whisper secrets to those who ask.",
    "🔮 EchoAI senses your feelings and responds.",
    "✨ Music flows with your mood like a magic river.",
    "💫 The AI orb glows brighter when you are excited.",
    "🌠 Your words ripple through the digital cosmos."
  ];
  const msg = magicals[Math.floor(Math.random()*magicals.length)];
  addMessage(msg,'ai');
}, 20000);

// ====== Dynamic Emotion Feedback While Typing ======
userInput.addEventListener('input',()=>{
  const text = userInput.value.trim();
  if(text.length > 5){
    const emotion = detectEmotion(text);
    if(emotion !== 'neutral'){
      nowPlaying.textContent = `Detected mood: ${emotion} 🎵`;
      playMoodMusic(emotion);
    }
  }
});

// ====== Orb Animation Sync with Music ======
setInterval(()=>{
  const scale = 1 + Math.random() * 0.3;
  aiOrb.style.transform = `scale(${scale})`;
}, 1000);

// ====== Extra: Magical Typing Simulation ======
function aiThinkingSim(text){
  addMessage("🤖 EchoAI is thinking...", 'ai');
  setTimeout(()=>handleUserInput(text),1200);
}
