let gradientPreview = document.getElementById('gradient-preview');
let gradientMenu = document.getElementById('gradient-menu');
let gradientOptions = document.getElementsByClassName('gradient-option');
let startButton = document.getElementById('start-button');
let stopButton = document.getElementById('stop-button');
let timerDisplay = document.getElementById('timer');
let studyInput = document.getElementById('study-time');
let shortBreakInput = document.getElementById('short-break');
let longBreakInput = document.getElementById('long-break');

// Preselected gradient options
const gradients = [
    { startColor: '#ffc0cb', endColor: '#800080' },
    { startColor: '#ff46ef', endColor: '#7029ff' },
    { startColor: '#44c1ae', endColor: '#009436' },
    { startColor: '#e89b00', endColor: '#d90000' },
    { startColor: '#433dff', endColor: '#60feff' },
    { startColor: '#006cff', endColor: '#030037' },
    { startColor: '#006cff', endColor: '#680085' },
    { startColor: '#46ad00', endColor: '#006db3' }
];

// Update background gradient and circle preview
function updateGradient(startColor, endColor) {
    document.body.style.background = `linear-gradient(135deg, ${startColor}, ${endColor})`;
    gradientPreview.style.background = `linear-gradient(135deg, ${startColor}, ${endColor})`;
}

// Show gradient selection menu when clicking on the preview circle
gradientPreview.addEventListener('click', () => {
    gradientMenu.classList.toggle('visible');
});

// Set selected gradient from the menu
function setGradient(index) {
    const selectedGradient = gradients[index];
    updateGradient(selectedGradient.startColor, selectedGradient.endColor);
    gradientMenu.classList.remove('visible'); // Hide menu after selection
}

// Generate gradient options dynamically from the hardcoded list
function generateGradientOptions() {
    gradients.forEach((gradient, index) => {
        let option = document.createElement('div');
        option.classList.add('gradient-option');
        option.dataset.index = index;
        option.style.background = `linear-gradient(135deg, ${gradient.startColor}, ${gradient.endColor})`;
        option.addEventListener('click', () => setGradient(index)); // Click event to set gradient
        gradientMenu.appendChild(option);
    });
}

generateGradientOptions();

// Timer functionality
let currentMode = 'study';
let interval;
let studyDuration, shortBreakDuration, longBreakDuration;
let cycleCount = 0;

function startTimer(duration) {
    let timeRemaining = duration * 60;
    clearInterval(interval);
    interval = setInterval(() => {
        let minutes = Math.floor(timeRemaining / 60);
        let seconds = timeRemaining % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        if (timeRemaining <= 0) {
            clearInterval(interval);
            switchMode();
        }
        timeRemaining--;
    }, 1000);
}

function switchMode() {
    if (currentMode === 'study') {
        currentMode = 'short-break';
        cycleCount++;
        if (cycleCount % 4 === 0) {
            currentMode = 'long-break';
            startTimer(longBreakDuration);
        } else {
            startTimer(shortBreakDuration);
        }
    } else {
        currentMode = 'study';
        startTimer(studyDuration);
    }
}

startButton.addEventListener('click', () => {
    studyDuration = parseInt(studyInput.value) || 25;
    shortBreakDuration = parseInt(shortBreakInput.value) || 5;
    longBreakDuration = parseInt(longBreakInput.value) || 15;
    currentMode = 'study';

    // Hide inputs and start button, show stop button, enlarge timer
    document.getElementById('inputs-container').classList.add('hidden');
    startButton.classList.add('hidden');
    gradientPreview.classList.add('hidden');
    stopButton.style.display = 'block';
    document.getElementById('main-container').classList.add('timer-running'); // Add class to enlarge timer

    // Enter fullscreen mode
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) { // Firefox
        document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari, and Opera
        document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) { // Internet Explorer/Edge
        document.documentElement.msRequestFullscreen();
    }

    startTimer(studyDuration);
});

stopButton.addEventListener('click', () => {
    clearInterval(interval);
    timerDisplay.textContent = '00:00';

    // Show inputs, start button, and circle preview
    document.getElementById('inputs-container').classList.remove('hidden');
    startButton.classList.remove('hidden');
    gradientPreview.classList.remove('hidden');

    // Hide stop button and revert timer font size
    stopButton.style.display = 'none';
    document.getElementById('main-container').classList.remove('timer-running'); // Revert timer font size

    // Exit fullscreen mode
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { // Chrome, Safari, and Opera
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { // Internet Explorer/Edge
        document.msExitFullscreen();
    }
});
