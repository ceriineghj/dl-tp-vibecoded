/**
 * =============================================
 * ROCK PAPER SCISSORS GAME - JAVASCRIPT FILE
 * =============================================
 */

// =============================================
// GLOBAL VARIABLES & STATE
// =============================================

const gameSettings = {
    soundEnabled: true,
    timerDuration: 10,
    winningScore: 5
};

let gameState = {
    playerScore: 0,
    aiScore: 0,
    totalPoints: 0,
    currentTimer: 10,
    timerInterval: null,
    playerChoice: null,
    aiChoice: null,
    isRoundActive: false
};

const CHOICES = ['rock', 'paper', 'scissors'];

const CHOICE_ICONS = {
    rock: '✊',
    paper: '🖐️',
    scissors: '✌️'
};

// =============================================
// DOM REFERENCES
// =============================================

const screens = {
    loading: document.getElementById('loading-screen'),
    start: document.getElementById('start-screen'),
    game: document.getElementById('game-screen'),
    result: document.getElementById('result-screen'),
    gameOver: document.getElementById('game-over-screen'),
    rulesModal: document.getElementById('rules-modal'),
    settingsModal: document.getElementById('settings-modal')
};

const gameElements = {
    playerScore: document.getElementById('player-score'),
    aiScore: document.getElementById('ai-score'),
    timer: document.getElementById('timer'),
    choiceCards: document.querySelectorAll('.choice-card')
};

const resultElements = {
    title: document.getElementById('result-title'),
    message: document.getElementById('result-message'),
    playerChoiceIcon: document.getElementById('player-choice-icon'),
    aiChoiceIcon: document.getElementById('ai-choice-icon'),
    sparklesContainer: document.getElementById('sparkles-container'),
    nextRoundBtn: document.getElementById('next-round-btn')
};

const gameOverElements = {
    finalPlayerScore: document.getElementById('final-player-score'),
    finalAiScore: document.getElementById('final-ai-score'),
    totalPoints: document.getElementById('total-points')
};

const buttons = {
    startGame: document.getElementById('start-game-btn'),
    rules: document.getElementById('rules-btn'),
    settings: document.getElementById('settings-btn'),
    playAgain: document.getElementById('play-again-btn'),
    exit: document.getElementById('exit-btn'),
    rulesClose: document.getElementById('rules-close-btn'),
    rulesGotIt: document.getElementById('rules-got-it-btn'),
    settingsClose: document.getElementById('settings-close-btn'),
    settingsSave: document.getElementById('settings-save-btn'),
    soundToggle: document.getElementById('sound-toggle')
};

// =============================================
// UTILITIES
// =============================================

const formatScore = s => s.toString().padStart(2, '0');
const formatPoints = p => p.toLocaleString();
const getRandomChoice = () => CHOICES[Math.floor(Math.random() * 3)];

// =============================================
// GAME LOGIC
// =============================================

function determineWinner(p, a) {
    if (p === a) return 'tie';
    if (
        (p === 'rock' && a === 'scissors') ||
        (p === 'paper' && a === 'rock') ||
        (p === 'scissors' && a === 'paper')
    ) return 'win';
    return 'lose';
}

function calculatePoints(result) {
    return result === 'win' ? 500 : result === 'tie' ? 100 : 0;
}

// =============================================
// STATE RESETS
// =============================================

function resetGameState() {
    gameState.playerScore = 0;
    gameState.aiScore = 0;
    gameState.totalPoints = 0;
    resetRound();
}

function resetRound() {
    gameState.playerChoice = null;
    gameState.aiChoice = null;
    gameState.currentTimer = gameSettings.timerDuration;
    gameState.isRoundActive = true;

    gameElements.choiceCards.forEach(c =>
        c.classList.remove('selected', 'disabled')
    );

    updateTimerDisplay();
}

// =============================================
// SCREEN HANDLING
// =============================================

function showScreen(name) {
    Object.entries(screens).forEach(([key, el]) => {
        if (!key.includes('Modal')) el.classList.remove('active');
    });
    screens[name]?.classList.add('active');
}

const showModal = m => screens[m]?.classList.add('active');
const hideModal = m => screens[m]?.classList.remove('active');

// =============================================
// UI UPDATES
// =============================================

function updateScoreDisplay() {
    gameElements.playerScore.textContent = formatScore(gameState.playerScore);
    gameElements.aiScore.textContent = formatScore(gameState.aiScore);
    gameOverElements.totalPoints.textContent = formatPoints(gameState.totalPoints);
}

function updateTimerDisplay() {
    gameElements.timer.textContent = gameState.currentTimer;
    gameElements.timer.classList.toggle('warning', gameState.currentTimer <= 3);
}

// =============================================
// TIMER
// =============================================

function startTimer() {
    clearInterval(gameState.timerInterval);

    gameState.timerInterval = setInterval(() => {
        gameState.currentTimer--;
        updateTimerDisplay();

        if (gameState.currentTimer <= 0) {
            clearInterval(gameState.timerInterval);
            if (!gameState.playerChoice) {
                gameState.playerChoice = getRandomChoice();
                processRound();
            }
        }
    }, 1000);
}

// =============================================
// ROUND FLOW
// =============================================

function startRound() {
    resetRound();
    startTimer();
}

function processRound() {
    gameState.isRoundActive = false;
    gameState.aiChoice = getRandomChoice();

    const result = determineWinner(gameState.playerChoice, gameState.aiChoice);

    if (result === 'win') gameState.playerScore++;
    if (result === 'lose') gameState.aiScore++;

    gameState.totalPoints += calculatePoints(result);
    updateScoreDisplay();
    showResult(result);
}

function showResult(result) {
    resultElements.title.textContent =
        result === 'win' ? 'YOU WIN!' :
        result === 'lose' ? 'YOU LOSE!' :
        "IT'S A TIE!";

    resultElements.playerChoiceIcon.textContent = CHOICE_ICONS[gameState.playerChoice];
    resultElements.aiChoiceIcon.textContent = CHOICE_ICONS[gameState.aiChoice];

    showScreen('result');
}

// =============================================
// GAME OVER
// =============================================

function showGameOver() {
    gameOverElements.finalPlayerScore.textContent = gameState.playerScore;
    gameOverElements.finalAiScore.textContent = gameState.aiScore;
    showScreen('gameOver');
}

// =============================================
// EVENTS
// =============================================

function initEvents() {
    buttons.startGame.onclick = () => {
        resetGameState();
        updateScoreDisplay();
        showScreen('game');
        startRound();
    };

    gameElements.choiceCards.forEach(card =>
        card.onclick = () => {
            if (!gameState.isRoundActive) return;
            gameState.playerChoice = card.dataset.choice;
            processRound();
        }
    );

    resultElements.nextRoundBtn.onclick = () => {
        if (
            gameState.playerScore >= gameSettings.winningScore ||
            gameState.aiScore >= gameSettings.winningScore
        ) showGameOver();
        else {
            showScreen('game');
            startRound();
        }
    };

    buttons.playAgain.onclick = () => buttons.startGame.click();
    buttons.exit.onclick = () => showScreen('start');

    buttons.rules.onclick = () => showModal('rulesModal');
    buttons.settings.onclick = () => showModal('settingsModal');
    buttons.rulesClose.onclick = () => hideModal('rulesModal');
    buttons.rulesGotIt.onclick = () => hideModal('rulesModal');
    buttons.settingsClose.onclick = () => hideModal('settingsModal');
    buttons.settingsSave.onclick = () => hideModal('settingsModal');
}

// =============================================
// INIT
// =============================================

document.addEventListener('DOMContentLoaded', () => {
    initEvents();
    setTimeout(() => showScreen('start'), 1200);
});
