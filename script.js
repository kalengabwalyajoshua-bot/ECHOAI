/* =============================================
   ECHOAI FULL SCRIPT.JS (INITAPP VERSION)
============================================= */

function initApp() {

    /* =====================
       GLOBAL VARIABLES
    ==================== */
    let currentScreen = "home";
    const screens = document.querySelectorAll(".screen");
    const navButtons = document.querySelectorAll("#bottom-navigation button");
    const chatInput = document.getElementById("chat-input");
    const chatSendBtn = document.getElementById("chat-send-btn");
    const chatLog = document.getElementById("chat-log");
    const voiceOverlay = document.getElementById("voice-overlay");
    const recoveryScreen = document.getElementById("screen-recovery");

    const permissionModal = document.getElementById("permission-modal");
    const permissionAllowBtn = document.querySelector("[data-permission='allow']");
    const permissionDenyBtn = document.querySelector("[data-permission='deny']");

    const bootScreen = document.getElementById("screen-boot");
    const bootProgress = document.querySelector(".boot-progress");
    const backgroundHeartbeat = document.getElementById("background-heartbeat");

    /* =====================
       FUNCTIONS
    ==================== */
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

        // User message
        const userMsg = document.createElement("div");
        userMsg.className = "message user";
        userMsg.textContent = chatInput.value.trim();
        chatLog.appendChild(userMsg);

        chatLog.scrollTop = chatLog.scrollHeight;
        chatInput.value = "";

        // EchoAI placeholder response
        const echoMsg = document.createElement("div");
        echoMsg.className = "message echo";
        echoMsg.textContent = "EchoAI will respond here...";
        chatLog.appendChild(echoMsg);

        chatLog.scrollTop = chatLog.scrollHeight;
    }

    /* =====================
       INITIAL SETUP
    ==================== */

    // Bottom navigation clicks
    navButtons.forEach(btn => {
        btn.addEventListener("click", () => showScreen(btn.dataset.nav));
    });

    // Chat input
    chatSendBtn.addEventListener("click", sendMessage);
    chatInput.addEventListener("keydown", e => {
        if(e.key === "Enter") sendMessage();
    });

    // Voice overlay toggle
    const voiceBtn = document.getElementById("chat-voice-btn");
    voiceBtn.addEventListener("click", () => voiceOverlay.classList.toggle("active"));

    // Permission modal buttons
    if(permissionAllowBtn){
        permissionAllowBtn.addEventListener("click", () => permissionModal.classList.remove("active"));
    }
    if(permissionDenyBtn){
        permissionDenyBtn.addEventListener("click", () => permissionModal.classList.remove("active"));
    }

    // Recovery screen restart
    const recoveryBtn = recoveryScreen.querySelector("[data-recovery='restart']");
    recoveryBtn.addEventListener("click", () => {
        recoveryScreen.classList.remove("active");
        showScreen("home");
    });

    // Android back button handling
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", () => {
        if(currentScreen !== "home"){
            showScreen("home");
            window.history.pushState(null, "", window.location.href);
        }
    });

    /* =====================
       BOOT SCREEN LOADER
    ==================== */
    if(bootScreen && bootProgress){
        let progress = 0;
        bootScreen.classList.add("screen-active");

        const bootInterval = setInterval(() => {
            progress += Math.random() * 5;
            if(progress >= 100){
                progress = 100;
                clearInterval(bootInterval);
                bootScreen.classList.remove("screen-active");
                showScreen("home");
            }
            bootProgress.style.width = `${progress}%`;
        }, 100);
    }

    /* =====================
       BACKGROUND HEARTBEAT
    ==================== */
    if(backgroundHeartbeat){
        setInterval(() => {
            backgroundHeartbeat.dataset.heartbeat = Date.now();
        }, 2000);
    }

    /* =====================
       DEVELOPER HOOKS
    ==================== */
    window.devEchoAI = {
        showScreen,
        sendMessage,
        toggleVoice: () => voiceOverlay.classList.toggle("active"),
        showRecovery: () => recoveryScreen.classList.add("active")
    };

    // Initial screen
    showScreen("home");
}

/* =====================
   START APP
===================== */
if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", initApp);
} else {
    initApp();
}
