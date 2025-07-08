// DOM Elements
const timerEl = document.getElementById("timer");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const lapButton = document.getElementById("lap");
const resetButton = document.getElementById("reset");
const lapsContainer = document.getElementById("laps");
const themeToggle = document.getElementById("theme-toggle");

// Audio Elements
const clickSound = document.getElementById("click-sound");
const startSound = document.getElementById("start-sound");
const stopSound = document.getElementById("stop-sound");

// Timer Variables
let startTime = 0;
let elapsedTime = 0;
let timerInterval;
let lapCount = 1;
let isRunning = false;

// Theme Management
const savedTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", savedTheme);
updateThemeIcon();

// Format time as HH:MM:SS.SS
function formatTime(time) {
  const date = new Date(time);
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  const seconds = date.getUTCSeconds().toString().padStart(2, "0");
  const milliseconds = Math.floor(date.getUTCMilliseconds() / 10)
    .toString()
    .padStart(2, "0");

  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}

// Start the timer
function startTimer() {
  if (!isRunning) {
    playSound(startSound);
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(() => {
      elapsedTime = Date.now() - startTime;
      timerEl.textContent = formatTime(elapsedTime);
    }, 10);

    isRunning = true;
    updateButtonStates();
  }
}

// Stop the timer
function stopTimer() {
  if (isRunning) {
    playSound(stopSound);
    clearInterval(timerInterval);
    isRunning = false;
    updateButtonStates();
  }
}

// Reset the timer
function resetTimer() {
  playSound(clickSound);
  stopTimer();
  elapsedTime = 0;
  timerEl.textContent = "00:00:00.00";
  lapCount = 1;
  lapsContainer.innerHTML = "";
  updateButtonStates();
}

// Record a lap time
function recordLap() {
  if (isRunning) {
    playSound(clickSound);
    const lapTime = elapsedTime;
    const lapItem = document.createElement("div");
    lapItem.className = "lap-item";
    lapItem.innerHTML = `
            <span class="lap-number">Lap ${lapCount}</span>
            <span class="lap-time">${formatTime(lapTime)}</span>
        `;

    // Insert new lap at the top
    if (lapsContainer.firstChild) {
      lapsContainer.insertBefore(lapItem, lapsContainer.firstChild);
    } else {
      lapsContainer.appendChild(lapItem);
    }

    lapCount++;
  }
}

// Update button states based on timer state
function updateButtonStates() {
  startButton.disabled = isRunning;
  stopButton.disabled = !isRunning;
  lapButton.disabled = !isRunning;
}

// Play sound effect
function playSound(sound) {
  sound.currentTime = 0;
  sound.play().catch((e) => console.log("Sound playback prevented:", e));
}

// Toggle between dark and light theme
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";

  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateThemeIcon();
  playSound(clickSound);
}

// Update theme toggle icon
function updateThemeIcon() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const icon = themeToggle.querySelector("i");

  if (currentTheme === "dark") {
    icon.className = "fas fa-sun";
  } else {
    icon.className = "fas fa-moon";
  }
}

// Event Listeners
startButton.addEventListener("click", startTimer);
stopButton.addEventListener("click", stopTimer);
lapButton.addEventListener("click", recordLap);
resetButton.addEventListener("click", resetTimer);
themeToggle.addEventListener("click", toggleTheme);

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    if (isRunning) stopTimer();
    else startTimer();
  } else if (e.code === "KeyL") {
    recordLap();
  } else if (e.code === "KeyR") {
    resetTimer();
  }
});
