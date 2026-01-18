/* =============================================
   ECHOAI FULL SCRIPT.JS
   Joshua Bwalya — Ready to paste
============================================= */

/* =====================
   GLOBAL VARIABLES & FUNCTIONS
===================== */
let currentScreen = "home";
let screens, navButtons, chatInput, chatSendBtn, chatLog;
let voiceOverlay, recoveryScreen;

function showScreen(screenId){
    screens.forEach(screen => {
        screen.classList.toggle("screen-active", screen.dataset.screen === screenId);
        screen.setAttribute("aria-hidden", screen.dataset.screen !== screenId);
    });
    navButtons.forEach(btn => {
        btn.classList.toggle("active", btn.dataset.nav === screenId);
    });
    currentScreen = screenId;
}

function sendMessage(){
    if(!chatInput.value.trim()) return;

    const userMsg = document.createElement("div");
    userMsg.className = "message user";
    userMsg.textContent = chatInput.value.trim();
    chatLog.appendChild(userMsg);

    chatLog.scrollTop = chatLog.scrollHeight;
    chatInput.value = "";

    const echoMsg = document.createElement("div");
    echoMsg.className = "message echo";
    echoMsg.textContent = "EchoAI will respond here...";
    chatLog.appendChild(echoMsg);

    chatLog.scrollTop = chatLog.scrollHeight;
}

/* =====================
   DOM CONTENT LOADED
===================== */
document.addEventListener("DOMContentLoaded", () => {

    /* ----------------------------
       1️⃣ Get DOM Elements
    ---------------------------- */
    screens = document.querySelectorAll(".screen");
    navButtons = document.querySelectorAll("#bottom-navigation button");

    chatInput = document.getElementById("chat-input");
    chatSendBtn = document.getElementById("chat-send-btn");
    chatLog = document.getElementById("chat-log");

    voiceOverlay = document.getElementById("voice-overlay");
    recoveryScreen = document.getElementById("screen-recovery");

    const permissionModal = document.getElementById("permission-modal");
    const permissionAllowBtn = document.querySelector("[data-permission='allow']");
    const permissionDenyBtn = document.querySelector("[data-permission='deny']");

    const bootScreen = document.getElementById("screen-boot");
    const bootProgress = document.querySelector(".boot-progress");
    const backgroundHeartbeat = document.getElementById("background-heartbeat");

    /* ----------------------------
       2️⃣ Bottom Navigation
    ---------------------------- */
    navButtons.forEach(btn => btn.addEventListener("click", () => {
        showScreen(btn.dataset.nav);
    }));

    /* ----------------------------
       3️⃣ Chat Input
    ---------------------------- */
    chatSendBtn.addEventListener("click", sendMessage);
    chatInput.addEventListener("keydown", e => { if(e.key==="Enter") sendMessage(); });

    /* ----------------------------
       4️⃣ Voice Overlay Toggle
    ---------------------------- */
    const voiceBtn = document.getElementById("chat-voice-btn");
    voiceBtn.addEventListener("click", () => voiceOverlay.classList.toggle("active"));

    /* ----------------------------
       5️⃣ Permission Modal
    ---------------------------- */
    permissionAllowBtn.addEventListener("click", () => permissionModal.classList.remove("active"));
    permissionDenyBtn.addEventListener("click", () => permissionModal.classList.remove("active"));

    /* ----------------------------
       6️⃣ Recovery Screen Restart
    ---------------------------- */
    recoveryScreen.querySelector("[data-recovery='restart']").addEventListener("click", () => {
        recoveryScreen.classList.remove("active");
        showScreen("home");
    });

    /* ----------------------------
       7️⃣ Boot Screen Loader
    ---------------------------- */
    if(bootScreen && bootProgress){
        let progress = 0;
        bootScreen.classList.add("screen-active");

        const bootInterval = setInterval(() => {
            progress += Math.random() * 5;
            if(progress >= 100){
                progress = 100;
                clearInterval(bootInterval);
                bootScreen.classList.remove("screen-active");
                showScreen("home"); // now works!
            }
            bootProgress.style.width = `${progress}%`;
        }, 100);
    }

    /* ----------------------------
       8️⃣ Background Heartbeat
    ---------------------------- */
    if(backgroundHeartbeat){
        setInterval(()=>{ backgroundHeartbeat.dataset.heartbeat = Date.now(); }, 2000);
    }

    /* ----------------------------
       9️⃣ Android Back Button Handling
    ---------------------------- */
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", () => {
        if(currentScreen !== "home") {
            showScreen("home");
            window.history.pushState(null, "", window.location.href);
        }
    });

    /* ----------------------------
       🔟 Developer Hooks
    ---------------------------- */
    window.devEchoAI = {
        showScreen,
        sendMessage,
        toggleVoice: ()=>voiceOverlay.classList.toggle("active"),
        showRecovery: ()=>recoveryScreen.classList.add("active")
    };

    /* ----------------------------
       1️⃣1️⃣ Initial Screen
    ---------------------------- */
    showScreen("home");

});
