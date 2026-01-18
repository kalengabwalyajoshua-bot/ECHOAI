/* =============================================
   CORE APP LOGIC
============================================= */

document.addEventListener("DOMContentLoaded", () => {

    // ----------------------------
    // 1️⃣ Variables
    // ----------------------------
    const screens = document.querySelectorAll(".screen");
    const navButtons = document.querySelectorAll("#bottom-navigation button");
    let currentScreen = "home";

    // ----------------------------
    // 2️⃣ Function: Show Screen
    // ----------------------------
    function showScreen(screenId) {
        screens.forEach(screen => {
            if(screen.dataset.screen === screenId){
                screen.classList.add("screen-active");
            } else {
                screen.classList.remove("screen-active");
            }
        });

        // Update nav active state
        navButtons.forEach(btn => {
            btn.classList.toggle("active", btn.dataset.nav === screenId);
        });

        currentScreen = screenId;
    }

    // ----------------------------
    // 3️⃣ Bottom Navigation Clicks
    // ----------------------------
    navButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const target = btn.dataset.nav;
            showScreen(target);
        });
    });

    // ----------------------------
    // 4️⃣ Android Back Button Handling
    // ----------------------------
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", () => {
        // Go back to home if not already there
        if(currentScreen !== "home") {
            showScreen("home");
            window.history.pushState(null, "", window.location.href);
        }
    });

    // ----------------------------
    // 5️⃣ Initial Load
    // ----------------------------
    showScreen("home");

});
/* =============================================
   VOICE OVERLAY, CHAT, MODALS
============================================= */

document.addEventListener("DOMContentLoaded", () => {

    // ----------------------------
    // 1️⃣ Voice Overlay Toggle
    // ----------------------------
    const voiceBtn = document.getElementById("chat-voice-btn");
    const voiceOverlay = document.getElementById("voice-overlay");

    if(voiceBtn && voiceOverlay){
        voiceBtn.addEventListener("click", () => {
            voiceOverlay.classList.toggle("active");
        });
    }

    // ----------------------------
    // 2️⃣ Chat Input Send
    // ----------------------------
    const chatInput = document.getElementById("chat-input");
    const chatSendBtn = document.getElementById("chat-send-btn");
    const chatLog = document.getElementById("chat-log");

    function sendMessage() {
        if(!chatInput.value.trim()) return;

        // User message
        const userMsg = document.createElement("div");
        userMsg.classList.add("message","user");
        userMsg.textContent = chatInput.value.trim();
        chatLog.appendChild(userMsg);

        chatLog.scrollTop = chatLog.scrollHeight;
        chatInput.value = "";

        // Echo placeholder response
        const echoMsg = document.createElement("div");
        echoMsg.classList.add("message","echo");
        echoMsg.textContent = "EchoAI will respond here...";
        chatLog.appendChild(echoMsg);

        chatLog.scrollTop = chatLog.scrollHeight;
    }

    if(chatSendBtn){
        chatSendBtn.addEventListener("click", sendMessage);
    }

    if(chatInput){
        chatInput.addEventListener("keydown", (e) => {
            if(e.key === "Enter") sendMessage();
        });
    }

    // ----------------------------
    // 3️⃣ Permission Modal Buttons
    // ----------------------------
    const permissionModal = document.getElementById("permission-modal");
    const permissionAllowBtn = document.querySelector("[data-permission='allow']");
    const permissionDenyBtn = document.querySelector("[data-permission='deny']");

    if(permissionAllowBtn){
        permissionAllowBtn.addEventListener("click", () => {
            permissionModal.classList.remove("active");
            console.log("Permission allowed");
        });
    }

    if(permissionDenyBtn){
        permissionDenyBtn.addEventListener("click", () => {
            permissionModal.classList.remove("active");
            console.log("Permission denied");
        });
    }

    // ----------------------------
    // 4️⃣ Recovery Screen Restart
    // ----------------------------
    const recoveryBtn = document.querySelector("#screen-recovery [data-recovery='restart']");
    const recoveryScreen = document.getElementById("screen-recovery");

    if(recoveryBtn && recoveryScreen){
        recoveryBtn.addEventListener("click", () => {
            recoveryScreen.classList.remove("active");
            showScreen("home");
        });
    }

});
/* =============================================
   BOOT SCREEN & BACKGROUND HEARTBEAT
============================================= */

document.addEventListener("DOMContentLoaded", () => {

    const bootScreen = document.getElementById("screen-boot");
    const bootProgress = document.querySelector(".boot-progress");
    const backgroundHeartbeat = document.getElementById("background-heartbeat");

    // ----------------------------
    // 1️⃣ Boot Screen Loader Simulation
    // ----------------------------
    if(bootScreen && bootProgress){
        let progress = 0;
        bootScreen.classList.add("screen-active");

        const bootInterval = setInterval(() => {
            progress += Math.random() * 5;
            if(progress >= 100){
                progress = 100;
                clearInterval(bootInterval);
                bootScreen.classList.remove("screen-active");
                // Show home after boot
                showScreen("home");
            }
            bootProgress.style.width = `${progress}%`;
        }, 100);
    }

    // ----------------------------
    // 2️⃣ Background Heartbeat
    // ----------------------------
    if(backgroundHeartbeat){
        setInterval(() => {
            backgroundHeartbeat.dataset.heartbeat = Date.now();
        }, 2000); // every 2s
    }

    // ----------------------------
    // 3️⃣ Developer Hooks (Optional)
    // ----------------------------
    window.devEchoAI = {
        showScreen: showScreen,
        toggleVoice: () => voiceOverlay.classList.toggle("active"),
        sendMessage: sendMessage,
        showRecovery: () => recoveryScreen.classList.add("active")
    };

});
