/**
 * =============================================
 * ROCK PAPER SCISSORS GAME - JAVASCRIPT FILE
 * =============================================
 * This file contains all the game logic and interactivity.
 * 
 * Sections:
 * 1. Global Variables & State
 * 2. DOM Element References
 * 3. Utility Functions
 * 4. Game Logic Functions
 * 5. Screen Management Functions
 * 6. Event Handlers
 * 7. Initialization
 * 
 * Author: Created with Lovable
 * =============================================
 */

// =============================================
// SECTION 1: GLOBAL VARIABLES & STATE
// =============================================

/**
 * Game Settings Object
 * Stores all configurable game settings.
 * Can be modified through the settings modal.
 */
const gameSettings = {
    soundEnabled: true,      // Whether sound effects are on
    timerDuration: 10,       // Seconds per round
    winningScore: 5          // Score needed to win the game
};

/**
 * Game State Object
 * Tracks the current state of the game.
 * Reset when starting a new game.
 */
let gameState = {
    playerScore: 0,          // Current player score
    aiScore: 0,              // Current AI score
    totalPoints: 0,          // Total points accumulated
    currentTimer: 10,        // Current countdown value
    timerInterval: null,     // Reference to timer interval
    playerChoice: null,      // Player's choice this round
    aiChoice: null,          // AI's choice this round
    isRoundActive: false     // Whether a round is in progress
};

/**
 * Possible Choices Array
 * The three options a player can choose from.
 */
const CHOICES = ['rock', 'paper', 'scissors'];

/**
 * Choice Icons Mapping
 * Maps each choice to its corresponding emoji.
 */
const CHOICE_ICONS = {
    rock: '✊',
    paper: '🖐️',
    scissors: '✌️'
};

// =============================================
// SECTION 2: DOM ELEMENT REFERENCES
// =============================================

/**
 * Screen Elements
 * References to each game screen container.
 */
const screens = {
    loading: document.getElementById('loading-screen'),
    start: document.getElementById('start-screen'),
    game: document.getElementById('game-screen'),
    result: document.getElementById('result-screen'),
    gameOver: document.getElementById('game-over-screen'),
    rulesModal: document.getElementById('rules-modal'),
    settingsModal: document.getElementById('settings-modal')
};

/**
 * Loading Screen Elements
 */
const loadingElements = {
    progressBar: document.getElementById('progress-bar'),
    progressText: document.getElementById('progress-text'),
    circleProgress: document.getElementById('loading-circle-progress')
};

/**
 * Game Screen Elements
 */
const gameElements = {
    playerScore: document.getElementById('player-score'),
    aiScore: document.getElementById('ai-score'),
    timer: document.getElementById('timer'),
    choiceCards: document.querySelectorAll('.choice-card')
};

/**
 * Result Screen Elements
 */
const resultElements = {
    title: document.getElementById('result-title'),
    message: document.getElementById('result-message'),
    playerChoiceIcon: document.getElementById('player-choice-icon'),
    aiChoiceIcon: document.getElementById('ai-choice-icon'),
    sparklesContainer: document.getElementById('sparkles-container'),
    nextRoundBtn: document.getElementById('next-round-btn')
};

/**
 * Game Over Screen Elements
 */
const gameOverElements = {
    finalPlayerScore: document.getElementById('final-player-score'),
    finalAiScore: document.getElementById('final-ai-score'),
    totalPoints: document.getElementById('total-points')
};

/**
 * Button Elements
 */
const buttons = {
    startGame: document.getElementById('start-game-btn'),
    rules: document.getElementById('rules-btn'),
    settings: document.getElementById('settings-btn'),
    nextRound: document.getElementById('next-round-btn'),
    playAgain: document.getElementById('play-again-btn'),
    exit: document.getElementById('exit-btn'),
    rulesClose: document.getElementById('rules-close-btn'),
    rulesGotIt: document.getElementById('rules-got-it-btn'),
    settingsClose: document.getElementById('settings-close-btn'),
    settingsSave: document.getElementById('settings-save-btn'),
    soundToggle: document.getElementById('sound-toggle')
};

// =============================================
// SECTION 3: UTILITY FUNCTIONS
// =============================================

/**
 * formatScore Function
 * Formats a number to always show two digits (e.g., 5 -> "05").
 * 
 * @param {number} score - The score to format
 * @returns {string} The formatted score string
 */
function formatScore(score) {
    return score.toString().padStart(2, '0');
}

/**
 * formatPoints Function
 * Formats points with comma separators (e.g., 2500 -> "2,500").
 * 
 * @param {number} points - The points to format
 * @returns {string} The formatted points string
 */
function formatPoints(points) {
    return points.toLocaleString();
}

/**
 * getRandomChoice Function
 * Generates a random choice for the AI opponent.
 * Uses Math.random() to select rock, paper, or scissors.
 * 
 * @returns {string} A random choice: 'rock', 'paper', or 'scissors'
 */
function getRandomChoice() {
    const randomIndex = Math.floor(Math.random() * CHOICES.length);
    return CHOICES[randomIndex];
}

// =============================================
// SECTION 4: GAME LOGIC FUNCTIONS
// =============================================

/**
 * determineWinner Function
 * Compares player and AI choices to determine the round winner.
 * 
 * Game Rules:
 * - Rock beats Scissors
 * - Paper beats Rock
 * - Scissors beats Paper
 * - Same choices = Tie
 * 
 * @param {string} playerChoice - The player's choice
 * @param {string} aiChoice - The AI's choice
 * @returns {string} The result: 'win', 'lose', or 'tie'
 */
function determineWinner(playerChoice, aiChoice) {
    // If both chose the same, it's a tie
    if (playerChoice === aiChoice) {
        return 'tie';
    }
    
    // Check all winning conditions for the player
    const playerWins = (
        (playerChoice === 'rock' && aiChoice === 'scissors') ||
        (playerChoice === 'paper' && aiChoice === 'rock') ||
        (playerChoice === 'scissors' && aiChoice === 'paper')
    );
    
    // Return 'win' if player wins, otherwise 'lose'
    return playerWins ? 'win' : 'lose';
}

/**
 * calculatePoints Function
 * Calculates points earned based on the round result.
 * 
 * Point System:
 * - Win: 500 points
 * - Tie: 100 points
 * - Lose: 0 points
 * 
 * @param {string} result - The round result
 * @returns {number} Points earned
 */
function calculatePoints(result) {
    switch (result) {
        case 'win':
            return 500;
        case 'tie':
            return 100;
        case 'lose':
            return 0;
        default:
            return 0;
    }
}

/**
 * resetGameState Function
 * Resets all game state variables to their initial values.
 * Called when starting a new game.
 */
function resetGameState() {
    gameState = {
        playerScore: 0,
        aiScore: 0,
        totalPoints: 0,
        currentTimer: gameSettings.timerDuration,
        timerInterval: null,
        playerChoice: null,
        aiChoice: null,
        isRoundActive: false
    };
}

/**
 * resetRound Function
 * Resets state for a new round while keeping scores.
 * Called after each round completes.
 */
function resetRound() {
    gameState.playerChoice = null;
    gameState.aiChoice = null;
    gameState.currentTimer = gameSettings.timerDuration;
    gameState.isRoundActive = false;
    
    // Reset choice card states
    gameElements.choiceCards.forEach(card => {
        card.classList.remove('selected', 'disabled');
    });
}

// =============================================
// SECTION 5: SCREEN MANAGEMENT FUNCTIONS
// =============================================

/**
 * showScreen Function
 * Shows the specified screen and hides all others.
 * Manages the 'active' class on screen elements.
 * 
 * @param {string} screenName - The name of the screen to show
 */
function showScreen(screenName) {
    // Hide all screens by removing 'active' class
    Object.values(screens).forEach(screen => {
        if (screen) {
            screen.classList.remove('active');
        }
    });
    
    // Show the requested screen by adding 'active' class
    if (screens[screenName]) {
        screens[screenName].classList.add('active');
    }
}

/**
 * showModal Function
 * Shows a modal overlay (rules or settings).
 * 
 * @param {string} modalName - The name of the modal to show
 */
function showModal(modalName) {
    const modal = screens[modalName];
    if (modal) {
        modal.classList.add('active');
    }
}

/**
 * hideModal Function
 * Hides a modal overlay.
 * 
 * @param {string} modalName - The name of the modal to hide
 */
function hideModal(modalName) {
    const modal = screens[modalName];
    if (modal) {
        modal.classList.remove('active');
    }
}

/**
 * updateScoreDisplay Function
 * Updates the score display elements on the game screen.
 * Called after each round.
 */
function updateScoreDisplay() {
    gameElements.playerScore.textContent = formatScore(gameState.playerScore);
    gameElements.aiScore.textContent = formatScore(gameState.aiScore);
}

/**
 * updateTimerDisplay Function
 * Updates the timer display element.
 * Adds warning class when time is low.
 */
function updateTimerDisplay() {
    gameElements.timer.textContent = gameState.currentTimer;
    
    // Add warning animation when 3 seconds or less remain
    if (gameState.currentTimer <= 3) {
        gameElements.timer.classList.add('warning');
    } else {
        gameElements.timer.classList.remove('warning');
    }
}

// =============================================
// SECTION 6: EVENT HANDLERS
// =============================================

/**
 * handleStartGame Function
 * Called when the player clicks "Start Game".
 * Initializes a new game and shows the game screen.
 */
function handleStartGame() {
    // Reset all game state for a fresh start
    resetGameState();
    
    // Update the display
    updateScoreDisplay();
    
    // Show the game screen
    showScreen('game');
    
    // Start the first round
    startRound();
}

/**
 * handleChoiceClick Function
 * Called when a player clicks on a choice card.
 * Processes the player's selection and determines the round outcome.
 * 
 * @param {Event} event - The click event
 */
function handleChoiceClick(event) {
    // Ignore clicks if round is not active or already made a choice
    if (!gameState.isRoundActive || gameState.playerChoice !== null) {
        return;
    }
    
    // Get the clicked card element
    const card = event.currentTarget;
    
    // Get the choice from the data attribute
    const choice = card.dataset.choice;
    
    // Store the player's choice
    gameState.playerChoice = choice;
    
    // Stop the timer
    stopTimer();
    
    // Visual feedback - highlight selected card, dim others
    gameElements.choiceCards.forEach(c => {
        if (c === card) {
            c.classList.add('selected');
        } else {
            c.classList.add('disabled');
        }
    });
    
    // Small delay before showing result for dramatic effect
    setTimeout(() => {
        processRound();
    }, 500);
}

/**
 * handleNextRound Function
 * Called when the player clicks "Next Round".
 * Either continues to the next round or shows game over.
 */
function handleNextRound() {
    // Check if either player has reached the winning score
    if (gameState.playerScore >= gameSettings.winningScore || 
        gameState.aiScore >= gameSettings.winningScore) {
        // Show game over screen
        showGameOver();
    } else {
        // Reset for next round and continue playing
        resetRound();
        showScreen('game');
        startRound();
    }
}

/**
 * handlePlayAgain Function
 * Called when the player clicks "Play Again" on game over screen.
 * Starts a completely new game.
 */
function handlePlayAgain() {
    handleStartGame();
}

/**
 * handleExit Function
 * Called when the player clicks "Exit" on game over screen.
 * Returns to the main menu.
 */
function handleExit() {
    showScreen('start');
}

/**
 * handleSoundToggle Function
 * Toggles the sound setting on/off.
 */
function handleSoundToggle() {
    gameSettings.soundEnabled = !gameSettings.soundEnabled;
    
    // Update toggle button appearance
    buttons.soundToggle.classList.toggle('active', gameSettings.soundEnabled);
    
    // Update sound icon
    const soundIcon = document.getElementById('sound-icon');
    soundIcon.textContent = gameSettings.soundEnabled ? '🔊' : '🔇';
}

/**
 * handleTimerOptionClick Function
 * Handles clicks on timer duration option buttons.
 * 
 * @param {Event} event - The click event
 */
function handleTimerOptionClick(event) {
    const button = event.target;
    const value = parseInt(button.dataset.value);
    
    // Update setting
    gameSettings.timerDuration = value;
    
    // Update button states
    const timerOptions = document.querySelectorAll('#timer-options .option-btn');
    timerOptions.forEach(btn => {
        btn.classList.toggle('active', btn === button);
    });
}

/**
 * handleScoreOptionClick Function
 * Handles clicks on winning score option buttons.
 * 
 * @param {Event} event - The click event
 */
function handleScoreOptionClick(event) {
    const button = event.target;
    const value = parseInt(button.dataset.value);
    
    // Update setting
    gameSettings.winningScore = value;
    
    // Update button states
    const scoreOptions = document.querySelectorAll('#score-options .option-btn');
    scoreOptions.forEach(btn => {
        btn.classList.toggle('active', btn === button);
    });
}

// =============================================
// GAME FLOW FUNCTIONS
// =============================================

/**
 * startRound Function
 * Initializes and starts a new round.
 * Starts the countdown timer.
 */
function startRound() {
    // Mark round as active
    gameState.isRoundActive = true;
    
    // Reset timer to configured duration
    gameState.currentTimer = gameSettings.timerDuration;
    updateTimerDisplay();
    
    // Start countdown timer
    startTimer();
}

/**
 * startTimer Function
 * Starts the countdown timer for the round.
 * Decrements every second until 0.
 */
function startTimer() {
    // Clear any existing timer
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    
    // Start new interval - runs every 1000ms (1 second)
    gameState.timerInterval = setInterval(() => {
        // Decrement timer
        gameState.currentTimer--;
        
        // Update display
        updateTimerDisplay();
        
        // Check if time ran out
        if (gameState.currentTimer <= 0) {
            // Stop the timer
            stopTimer();
            
            // If no choice was made, pick randomly for the player
            if (gameState.playerChoice === null) {
                gameState.playerChoice = getRandomChoice();
                
                // Highlight the randomly selected card
                gameElements.choiceCards.forEach(card => {
                    if (card.dataset.choice === gameState.playerChoice) {
                        card.classList.add('selected');
                    } else {
                        card.classList.add('disabled');
                    }
                });
                
                // Process the round
                setTimeout(() => {
                    processRound();
                }, 500);
            }
        }
    }, 1000);
}

/**
 * stopTimer Function
 * Stops the countdown timer.
 */
function stopTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
}

/**
 * processRound Function
 * Processes the round after both choices are made.
 * Determines winner, updates scores, and shows result.
 */
function processRound() {
    // Generate AI's choice
    gameState.aiChoice = getRandomChoice();
    
    // Determine the winner
    const result = determineWinner(gameState.playerChoice, gameState.aiChoice);
    
    // Update scores based on result
    if (result === 'win') {
        gameState.playerScore++;
    } else if (result === 'lose') {
        gameState.aiScore++;
    }
    
    // Add points to total
    gameState.totalPoints += calculatePoints(result);
    
    // Show the result screen
    showResult(result);
}

/**
 * showResult Function
 * Displays the result screen with appropriate styling.
 * 
 * @param {string} result - The round result: 'win', 'lose', or 'tie'
 */
function showResult(result) {
    // Update result title and styling based on outcome
    const resultTitle = resultElements.title;
    resultTitle.className = 'result-title'; // Reset classes
    
    if (result === 'win') {
        resultTitle.textContent = 'YOU WIN!';
        resultTitle.classList.add('win');
        
        // Show sparkles for wins
        resultElements.sparklesContainer.classList.add('active');
    } else if (result === 'lose') {
        resultTitle.textContent = 'YOU LOSE!';
        resultTitle.classList.add('lose');
        resultElements.sparklesContainer.classList.remove('active');
    } else {
        resultTitle.textContent = "IT'S A TIE!";
        resultTitle.classList.add('tie');
        resultElements.sparklesContainer.classList.remove('active');
    }
    
    // Update result message
    if (result === 'tie') {
        resultElements.message.textContent = `BOTH CHOSE ${gameState.playerChoice.toUpperCase()}`;
    } else if (result === 'win') {
        resultElements.message.textContent = `${gameState.playerChoice.toUpperCase()} BEATS ${gameState.aiChoice.toUpperCase()}`;
    } else {
        resultElements.message.textContent = `${gameState.aiChoice.toUpperCase()} BEATS ${gameState.playerChoice.toUpperCase()}`;
    }
    
    // Update choice icons
    resultElements.playerChoiceIcon.textContent = CHOICE_ICONS[gameState.playerChoice];
    resultElements.aiChoiceIcon.textContent = CHOICE_ICONS[gameState.aiChoice];
    
    // Show the result screen
    showScreen('result');
}

/**
 * showGameOver Function
 * Displays the game over modal with final scores.
 */
function showGameOver() {
    // Update final scores
    gameOverElements.finalPlayerScore.textContent = gameState.playerScore;
    gameOverElements.finalAiScore.textContent = gameState.aiScore;
    
    // Highlight winner's score
    if (gameState.playerScore > gameState.aiScore) {
        gameOverElements.finalPlayerScore.classList.add('winner');
        gameOverElements.finalAiScore.classList.remove('winner');
    } else {
        gameOverElements.finalAiScore.classList.add('winner');
        gameOverElements.finalPlayerScore.classList.remove('winner');
    }
    
    // Update total points
    gameOverElements.totalPoints.textContent = formatPoints(gameState.totalPoints);
    
    // Show the game over screen
    showScreen('gameOver');
}

// =============================================
// LOADING SCREEN FUNCTIONS
// =============================================

/**
 * runLoadingAnimation Function
 * Animates the loading screen progress bar.
 * Transitions to start screen when complete.
 */
function runLoadingAnimation() {
    let progress = 0;
    
    // Update progress every 30ms
    const loadingInterval = setInterval(() => {
        progress++;
        
        // Update progress bar width
        loadingElements.progressBar.style.width = `${progress}%`;
        
        // Update progress text
        loadingElements.progressText.textContent = `${progress}%`;
        
        // Update circular progress (stroke-dashoffset)
        // Circumference = 2 * PI * radius (40) = 251.2
        const circumference = 251.2;
        const offset = circumference - (circumference * progress / 100);
        loadingElements.circleProgress.style.strokeDashoffset = offset;
        
        // Check if loading is complete
        if (progress >= 100) {
            clearInterval(loadingInterval);
            
            // Wait a moment before transitioning
            setTimeout(() => {
                showScreen('start');
            }, 500);
        }
    }, 30);
}

// =============================================
// SECTION 7: INITIALIZATION
// =============================================

/**
 * initializeEventListeners Function
 * Sets up all event listeners for buttons and interactive elements.
 * Called once when the page loads.
 */
function initializeEventListeners() {
    // Start screen buttons
    buttons.startGame.addEventListener('click', handleStartGame);
    buttons.rules.addEventListener('click', () => showModal('rulesModal'));
    buttons.settings.addEventListener('click', () => showModal('settingsModal'));
    
    // Choice cards
    gameElements.choiceCards.forEach(card => {
        card.addEventListener('click', handleChoiceClick);
    });
    
    // Result screen
    buttons.nextRound.addEventListener('click', handleNextRound);
    
    // Game over screen
    buttons.playAgain.addEventListener('click', handlePlayAgain);
    buttons.exit.addEventListener('click', handleExit);
    
    // Rules modal
    buttons.rulesClose.addEventListener('click', () => hideModal('rulesModal'));
    buttons.rulesGotIt.addEventListener('click', () => hideModal('rulesModal'));
    
    // Settings modal
    buttons.settingsClose.addEventListener('click', () => hideModal('settingsModal'));
    buttons.settingsSave.addEventListener('click', () => hideModal('settingsModal'));
    buttons.soundToggle.addEventListener('click', handleSoundToggle);
    
    // Timer option buttons
    const timerOptions = document.querySelectorAll('#timer-options .option-btn');
    timerOptions.forEach(btn => {
        btn.addEventListener('click', handleTimerOptionClick);
    });
    
    // Score option buttons
    const scoreOptions = document.querySelectorAll('#score-options .option-btn');
    scoreOptions.forEach(btn => {
        btn.addEventListener('click', handleScoreOptionClick);
    });
}

/**
 * Initialize the game when the page loads.
 * Sets up event listeners and starts the loading animation.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Set up all event listeners
    initializeEventListeners();
    
    // Start the loading animation
    runLoadingAnimation();
});

