// Main App for CumplePop - Potato Logic Only

import { GameEngine } from './game-engine.js'
import { initBalloon } from './balloon.js'
import { showScreen } from './ui.js'
import { particleSystem } from './particles.js'

const game = new GameEngine()
let isInitialized = false

async function init() {
  if (isInitialized) return
  
  console.log('🥔 Initializing CumplePop...')
  
  try {
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
  
  // Touch/haptic feedback
  setupHapticFeedback()
}

function setupHapticFeedback() {
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', () => {
      if (navigator.vibrate) {
        navigator.vibrate(10)
      }
    })
  })
}

function startGame() {
  console.log('🎮 Starting potato...')
  particleSystem.clear()
  game.start()
}

function restartGame() {
  console.log('🔄 Restarting potato...')
  particleSystem.clear()
  game.reset()
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
