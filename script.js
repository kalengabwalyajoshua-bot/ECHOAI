/* =============================================
   ECHOAI ULTRA-SAFE SCRIPT.JS
   Joshua Bwalya — Smooth Transitions + Blue Theme
============================================= */

function initApp() {

    /* =====================
       GET DOM ELEMENTS SAFELY
    ==================== */
    const getEl = (selector, desc) => {
        const el = document.querySelector(selector);
        if(!el) console.error(`Missing element: ${desc} (${selector})`);
        return el;
    };
    const getAll = (selector, desc) => {
        const els = document.querySelectorAll(selector);
        if(!els.length) console.error(`Missing elements: ${desc} (${selector})`);
        return els;
    };

    const screens = getAll(".screen", "Screens");
    const navButtons = getAll("#bottom-navigation button", "Bottom Nav Buttons");

    const chatInput = getEl("#chat-input", "Chat Input");
    const chatSendBtn = getEl("#chat-send-btn", "Chat Send Button");
    const chatLog = getEl("#chat-log", "Chat Log");

    const voiceBtn = getEl("#chat-voice-btn", "Voice Button");
    const voiceOverlay = getEl("#voice-overlay", "Voice Overlay");

    const recoveryScreen = getEl("#screen-recovery", "Recovery Screen");
    const recoveryBtn = recoveryScreen ? recoveryScreen.querySelector("[data-recovery='restart']") : null;

    const permissionModal = getEl("#permission-modal", "Permission Modal");
    const permissionAllowBtn = getEl("[data-permission='allow']", "Permission Allow");
    const permissionDenyBtn = getEl("[data-permission='deny']", "Permission Deny");

    const bootScreen = getEl("#screen-boot", "Boot Screen");
    const bootProgress = getEl(".boot-progress", "Boot Progress");

    /* =====================
       CORE FUNCTIONS
    ==================== */
    let currentScreen = "home";

    function showScreen(screenId){
        screens.forEach(screen => {
            if(!screen) return;
            if(screen.dataset.screen === screenId){
                screen.classList.add("screen-active");
                screen.style.opacity = 0;
                setTimeout(()=> screen.style.opacity = 1, 50); // fade in
                screen.setAttribute("aria-hidden", "false");
            } else {
                screen.style.opacity = 0;
                setTimeout(()=> screen.classList.remove("screen-active"), 200); // fade out
                screen.setAttribute("aria-hidden", "true");
            }
        });
        navButtons.forEach(btn => {
            if(btn) btn.classList.toggle("active", btn.dataset.nav === screenId);
        });
        currentScreen = screenId;
    }

    function sendMessage([userMsg, echoMsg].forEach(msg => {
    msg.style.opacity = 0;
    msg.style.transform = "translateX(20px)";
    setTimeout(()=>{
        msg.style.opacity = 1;
        msg.style.transform = "translateX(0)";
        msg.style.transition = "all 0.25s ease";
    }, 50);
});){
        if(!chatInput || !chatLog) return;
        if(!chatInput.value.trim()) return;

        // User message
        const userMsg = document.createElement("div");
        userMsg.className = "message user";
        userMsg.textContent = chatInput.value.trim();
        chatLog.appendChild(userMsg);
        chatLog.scrollTop = chatLog.scrollHeight;
        chatInput.value = "";

        // Echo “typing” animation
        const echoMsg = document.createElement("div");
        echoMsg.className = "message echo";
        echoMsg.textContent = "EchoAI is typing…";
        chatLog.appendChild(echoMsg);
        chatLog.scrollTop = chatLog.scrollHeight;

        setTimeout(()=>{
            echoMsg.textContent = "EchoAI will respond here...";
            chatLog.scrollTop = chatLog.scrollHeight;
        }, 800); // simulate typing
    }

    /* =====================
       EVENT LISTENERS
    ==================== */
    navButtons.forEach(btn => {
        if(btn) btn.addEventListener("click", ()=>showScreen(btn.dataset.nav));
    });

    if(chatSendBtn) chatSendBtn.addEventListener("click", sendMessage);
    if(chatInput) chatInput.addEventListener("keydown", e => { if(e.key==="Enter") sendMessage(); });

    if(voiceBtn && voiceOverlay){
        voiceBtn.addEventListener("click", ()=>{
            voiceOverlay.classList.toggle("active");
            voiceOverlay.style.transition = "opacity 0.4s";
        });
    }

    if(permissionAllowBtn && permissionModal) permissionAllowBtn.addEventListener("click", ()=>permissionModal.classList.remove("active"));
    if(permissionDenyBtn && permissionModal) permissionDenyBtn.addEventListener("click", ()=>permissionModal.classList.remove("active"));

    if(recoveryBtn && recoveryScreen){
        recoveryBtn.addEventListener("click", ()=>{
            recoveryScreen.classList.remove("screen-active");
            showScreen("home");
        });
    }

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", () => {
        if(currentScreen !== "home") {
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
        const bootInterval = setInterval(()=>{
            progress += Math.random()*5;
            if(progress>=100){
                progress=100;
                clearInterval(bootInterval);
                bootScreen.classList.remove("screen-active");
                showScreen("home");
            }
            bootProgress.style.width = `${progress}%`;
        },80); // slightly faster smooth loading
    }

    /* =====================
       DEVELOPER HOOKS
    ==================== */
    window.devEchoAI = {
        showScreen,
        sendMessage,
        toggleVoice: () => { if(voiceOverlay) voiceOverlay.classList.toggle("active"); },
        showRecovery: () => { if(recoveryScreen) recoveryScreen.classList.add("screen-active"); }
    };

    // Initial screen
    showScreen("home");
}

/* =====================
   SAFE APP START
===================== */
if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", initApp);
} else {
    initApp();
}
