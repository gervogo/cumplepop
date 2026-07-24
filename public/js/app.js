// Main App for CumplePop

import { GameEngine } from './game-engine.js'
import { loadQuestions } from './questions.js'
import { initBalloon } from './balloon.js'
import { showScreen, selectOption } from './ui.js'

const game = new GameEngine()

async function init() {
  console.log('🎈 Initializing CumplePop...')
  
  // Load questions
  await loadQuestions()
  
  // Initialize 3D balloon
  initBalloon()
  
  // Event listeners
  document.getElementById('btn-start').addEventListener('click', startGame)
  document.getElementById('btn-restart').addEventListener('click', restartGame)
  document.getElementById('btn-validate').addEventListener('click', validateAnswer)
  
  // Option buttons
  document.getElementById('options-grid').addEventListener('click', (e) => {
    if (e.target.classList.contains('option-btn')) {
      const index = parseInt(e.target.dataset.index)
      selectOption(index)
      game.selectAnswer(index)
    }
  })
  
  console.log('✅ CumplePop ready!')
}

function startGame() {
  game.start()
}

function restartGame() {
  game.reset()
}

function validateAnswer() {
  game.validate()
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init)
