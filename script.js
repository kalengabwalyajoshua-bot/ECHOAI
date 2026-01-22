let appState = {
  status: "Idle",
  active: false
};

const statusEl = document.getElementById("status");
const screenEl = document.getElementById("screen");
const powerBtn = document.getElementById("powerBtn");
const helpBtn = document.getElementById("helpBtn");

function setStatus(text) {
  appState.status = text;
  statusEl.innerText = text;
}

function showWelcome() {
  screenEl.innerHTML = `
    <h2>👋 Welcome</h2>
    <p>This is <b>EchoAI</b>, your intelligent assistant.</p>
    <p>Tap the ⚡ button to activate.</p>
  `;
}

function activateEchoAI() {
  appState.active = true;
  setStatus("Listening");

  screenEl.innerHTML = `
    <h2>🎧 EchoAI Active</h2>
    <p>I am now listening and ready to help you.</p>
    <p>More intelligence and features will be added soon.</p>
  `;
}

function showHelp() {
  setStatus("Help");

  screenEl.innerHTML = `
    <h2>ℹ️ Help</h2>
    <p>⚡ Activate EchoAI</p>
    <p>❓ View instructions</p>
    <p>This is the foundation version of EchoAI.</p>
  `;
}

powerBtn.addEventListener("click", () => {
  if (!appState.active) {
    activateEchoAI();
  } else {
    setStatus("Active");
  }
});

helpBtn.addEventListener("click", showHelp);

window.onload = () => {
  setStatus("Idle");
  showWelcome();
};
