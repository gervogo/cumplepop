// Main App for CumplePop - Complete Version

import { GameEngine } from './game-engine.js'
import { loadQuestions } from './questions.js'
import { initBalloon } from './balloon.js'
import { showScreen, selectOption, resetUI } from './ui.js'
import { particleSystem } from './particles.js'

const game = new GameEngine()
let isInitialized = false

async function init() {
  if (isInitialized) return
  
  console.log('🎈 Initializing CumplePop...')
  
  try {
    // Load questions first
    await loadQuestions()
    
    // Initialize 3D balloon
    initBalloon()
    
    // Setup event listeners
    setupEventListeners()
    
    // Show splash screen
    showScreen('splash-screen')
    
    isInitialized = true
    console.log('✅ CumplePop ready!')
  } catch (error) {
    console.error('❌ Error initializing CumplePop:', error)
  }
}

function setupEventListeners() {
  // Start button
  const startBtn = document.getElementById('btn-start')
  if (startBtn) {
    startBtn.addEventListener('click', startGame)
  }
  
  // Restart button
  const restartBtn = document.getElementById('btn-restart')
  if (restartBtn) {
    restartBtn.addEventListener('click', restartGame)
  }
  
  // Validate button
  const validateBtn = document.getElementById('btn-validate')
  if (validateBtn) {
    validateBtn.addEventListener('click', validateAnswer)
  }
  
  // Options grid (event delegation)
  const optionsGrid = document.getElementById('options-grid')
  if (optionsGrid) {
    optionsGrid.addEventListener('click', (e) => {
      const optionBtn = e.target.closest('.option-btn')
      if (optionBtn && !optionBtn.disabled) {
        const index = parseInt(optionBtn.dataset.index)
        selectOption(index)
        game.selectAnswer(index)
      }
    })
  }
  
  // Keyboard controls
  document.addEventListener('keydown', handleKeyDown)
  
  // Touch/haptic feedback
  setupHapticFeedback()
}

function handleKeyDown(e) {
  if (game.getState().state !== 'PLAYING') return
  
  // Number keys 1-4 or A-D to select options
  const keyMap = {
    '1': 0, '2': 1, '3': 2, '4': 3,
    'a': 0, 'b': 1, 'c': 2, 'd': 3
  }
  
  const optionIndex = keyMap[e.key.toLowerCase()]
  if (optionIndex !== undefined) {
    selectOption(optionIndex)
    game.selectAnswer(optionIndex)
  }
  
  // Enter or Space to validate
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    validateAnswer()
  }
}

function setupHapticFeedback() {
  // Add haptic feedback to buttons
  document.querySelectorAll('.btn-primary, .option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (navigator.vibrate) {
        navigator.vibrate(10)
      }
    })
  })
}

function startGame() {
  console.log('🎮 Starting game...')
  particleSystem.clear()
  resetUI()
  game.start()
}

function restartGame() {
  console.log('🔄 Restarting game...')
  particleSystem.clear()
  resetUI()
  game.reset()
}

function validateAnswer() {
  console.log('✅ Validating answer...')
  game.validate()
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}

// Export for debugging
window.cumplepop = {
  game,
  getState: () => game.getState()
}
