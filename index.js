// Get DOM elements for timer display and control buttons
const timerEL = document.getElementById("timer");
const startButtonEl = document.getElementById("start");
const stopButtonEl = document.getElementById("stop");
const resetButtonEl = document.getElementById("reset");

// Timer Variables
let startTime = 0; // Stores the timestamp when timer starts
let elapsedTime = 0; // Accumulates total elapsed time in milliseconds
let timerInterval; // Stores the interval ID for the running timer

/**
 * Starts the timer by:
 * 1. Calculating the adjusted start time (accounting for any previous elapsed time)
 * 2. Setting up a recurring interval to update the timer display every 10ms
 * 3. Updating button states (disable start, enable stop)
 */
function startTimer() {
  startTime = Date.now() - elapsedTime;
  timerInterval = setInterval(() => {
    elapsedTime = Date.now() - startTime;
    timerEL.textContent = formatTime(elapsedTime);
  }, 10);

  startButtonEl.disabled = true;
  stopButtonEl.disabled = false;
}

/**
 * Formats elapsed time in milliseconds into HH:MM:SS.SS format
 * @param {number} elapsedTime - Time in milliseconds
 * @returns {string} Formatted time string
 *
 */
function formatTime(elapsedTime) {
  const milliseconds = Math.floor((elapsedTime % 1000) / 10);
  const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
  const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
  const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
  return (
    (hours ? (hours > 9 ? hours : "0" + hours) : "00") +
    ":" +
    (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") +
    ":" +
    (seconds ? (seconds > 9 ? seconds : "0" + seconds) : "00") +
    "." +
    (milliseconds > 9 ? milliseconds : "0" + milliseconds)
  );
}

/**
 * Stops the timer by:
 * 1. Clearing the update interval
 * 2. Updating button states (enable start, disable stop)
 */
function stopTimer() {
  clearInterval(timerInterval);
  startButtonEl.disabled = false;
  stopButtonEl.disabled = true;
}

/**
 * Resets the timer by:
 * 1. Clearing the interval (if running)
 * 2. Resetting elapsed time to 0
 * 3. Resetting the display to 00:00:00
 * 4. Resetting button states to initial condition
 */
function resetTimer() {
  clearInterval(timerInterval);
  elapsedTime = 0;
  timerEL.textContent = "00:00:00";

  startButtonEl.disabled = false;
  stopButtonEl.disabled = true;
}
// Add event listeners to control buttons
startButtonEl.addEventListener("click", startTimer);
stopButtonEl.addEventListener("click", stopTimer);
resetButtonEl.addEventListener("click", resetTimer);
