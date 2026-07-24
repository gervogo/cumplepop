// Game Engine for CumplePop - Complete Version

import { selectQuestions, validateAnswer } from './questions.js'
import { inflateBalloon, explodeBalloon, resetBalloon } from './balloon.js'
import { 
  showScreen, showQuestion, updateTimer, showExplosion, 
  showResult, updateScore, updateStreak, highlightOption,
  showRoundResult, disableOptions
} from './ui.js'
import { calculateScore, getRandomDuration, shuffle } from './utils.js'
import { particleSystem } from './particles.js'

const STATES = {
  IDLE: 'IDLE',
  COUNTDOWN: 'COUNTDOWN',
  PLAYING: 'PLAYING',
  ROUND_END: 'ROUND_END',
  GAME_OVER: 'GAME_OVER'
}

const GAME_CONFIG = {
  questionsPerGame: 10,
  minTime: 60,
  maxTime: 180,
  countdownDuration: 3,
  roundEndDelay: 2000
}

export class GameEngine {
  constructor() {
    this.state = STATES.IDLE
    this.questions = []
    this.currentQuestionIndex = 0
    this.score = 0
    this.streak = 0
    this.bestStreak = 0
    this.timer = 0
    this.totalTime = 0
    this.timerInterval = null
    this.selectedOption = null
    this.correctAnswers = 0
    this.startTime = null
  }

  async start() {
    this.state = STATES.COUNTDOWN
    this.questions = await selectQuestions(GAME_CONFIG.questionsPerGame)
    this.currentQuestionIndex = 0
    this.score = 0
    this.streak = 0
    this.bestStreak = 0
    this.correctAnswers = 0
    this.totalTime = getRandomDuration(GAME_CONFIG.minTime, GAME_CONFIG.maxTime)
    this.timer = this.totalTime
    this.startTime = Date.now()
    
    resetBalloon()
    showScreen('game-screen')
    updateScore(0)
    updateStreak(0)
    
    await this.showCountdown()
    this.startGame()
  }

  async showCountdown() {
    const countdownEl = document.getElementById('countdown')
    if (!countdownEl) {
      this.startGame()
      return
    }

    for (let i = GAME_CONFIG.countdownDuration; i > 0; i--) {
      countdownEl.textContent = i
      countdownEl.classList.add('active')
      await this.sleep(1000)
      countdownEl.classList.remove('active')
    }

    countdownEl.textContent = '¡YA!'
    countdownEl.classList.add('active')
    await this.sleep(500)
    countdownEl.classList.remove('active')
    countdownEl.style.display = 'none'
  }

  startGame() {
    this.state = STATES.PLAYING
    this.showCurrentQuestion()
    this.startTimer()
  }

  showCurrentQuestion() {
    if (this.currentQuestionIndex >= this.questions.length) {
      this.endGame(true)
      return
    }
    
    const question = this.questions[this.currentQuestionIndex]
    showQuestion(question, this.currentQuestionIndex + 1, this.questions.length)
    this.selectedOption = null
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timer--
      updateTimer(this.timer, this.totalTime)
      
      const progress = 1 - (this.timer / this.totalTime)
      inflateBalloon(progress)
      
      // Vibrate when danger zone
      if (this.timer <= 10 && navigator.vibrate) {
        navigator.vibrate([100, 50, 100])
      }
      
      if (this.timer <= 0) {
        this.explode()
      }
    }, 1000)
  }

  selectAnswer(index) {
    if (this.state !== STATES.PLAYING) return
    
    this.selectedOption = index
    highlightOption(index)
  }

  validate() {
    if (this.selectedOption === null || this.state !== STATES.PLAYING) return false
    
    this.state = STATES.ROUND_END
    clearInterval(this.timerInterval)
    
    const question = this.questions[this.currentQuestionIndex]
    const correct = validateAnswer(this.selectedOption, question.correctIndex)
    
    // Disable options and show correct answer
    disableOptions()
    showRoundResult(correct, question.correctIndex)
    
    if (correct) {
      this.streak++
      this.correctAnswers++
      if (this.streak > this.bestStreak) {
        this.bestStreak = this.streak
      }
      
      const points = calculateScore(this.timer, this.streak)
      this.score += points
      
      // Show score popup
      const optionBtn = document.querySelector(`.option-btn[data-index="${this.selectedOption}"]`)
      if (optionBtn) {
        const rect = optionBtn.getBoundingClientRect()
        const isBonus = this.streak >= 3
        particleSystem.createScorePopup(
          rect.left + rect.width / 2,
          rect.top,
          points,
          isBonus
        )
      }
      
      updateScore(this.score)
      updateStreak(this.streak)
      
      // Confetti for streaks
      if (this.streak >= 3) {
        particleSystem.createConfetti(30)
      }
    } else {
      this.streak = 0
      updateStreak(0)
    }
    
    // Move to next question after delay
    setTimeout(() => {
      this.currentQuestionIndex++
      this.state = STATES.PLAYING
      this.showCurrentQuestion()
    }, GAME_CONFIG.roundEndDelay)
    
    return correct
  }

  explode() {
    clearInterval(this.timerInterval)
    this.state = STATES.GAME_OVER
    
    // Create explosion effects
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2
    particleSystem.createExplosion(centerX, centerY, 80)
    particleSystem.createStickerExplosion(centerX, centerY)
    
    explodeBalloon()
    
    setTimeout(() => {
      showExplosion()
      this.showGameOverStats()
    }, 1000)
  }

  endGame(completed = false) {
    clearInterval(this.timerInterval)
    this.state = STATES.GAME_OVER
    
    if (completed) {
      particleSystem.createConfetti(100)
    }
    
    showResult(completed, this.score)
    this.showGameOverStats()
  }

  showGameOverStats() {
    const statsEl = document.getElementById('game-stats')
    if (!statsEl) return
    
    const timePlayed = this.totalTime - this.timer
    const avgTime = this.correctAnswers > 0 ? (timePlayed / this.correctAnswers).toFixed(1) : 0
    
    statsEl.innerHTML = `
      <div class="stat-item">
        <span class="stat-label">Preguntas correctas</span>
        <span class="stat-value">${this.correctAnswers}/${this.questions.length}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Mejor racha</span>
        <span class="stat-value">${this.bestStreak} 🔥</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Tiempo jugado</span>
        <span class="stat-value">${timePlayed}s</span>
      </div>
    `
  }

  reset() {
    clearInterval(this.timerInterval)
    this.state = STATES.IDLE
    this.score = 0
    this.streak = 0
    this.bestStreak = 0
    this.correctAnswers = 0
    this.timer = 0
    this.selectedOption = null
    particleSystem.clear()
    
    const countdownEl = document.getElementById('countdown')
    if (countdownEl) {
      countdownEl.style.display = 'flex'
    }
    
    showScreen('splash-screen')
  }

  getState() {
    return {
      state: this.state,
      score: this.score,
      streak: this.streak,
      bestStreak: this.bestStreak,
      timer: this.timer,
      totalTime: this.totalTime,
      currentQuestion: this.currentQuestionIndex,
      totalQuestions: this.questions.length,
      correctAnswers: this.correctAnswers
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
