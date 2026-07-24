// Game Engine for CumplePop

import { selectQuestions, validateAnswer } from './questions.js'
import { inflateBalloon, explodeBalloon, resetBalloon } from './balloon.js'
import { showScreen, showQuestion, updateTimer, showExplosion, showResult } from './ui.js'
import { calculateScore, getRandomDuration } from './utils.js'

const STATES = {
  IDLE: 'IDLE',
  PLAYING: 'PLAYING',
  GAME_OVER: 'GAME_OVER'
}

export class GameEngine {
  constructor() {
    this.state = STATES.IDLE
    this.questions = []
    this.currentQuestionIndex = 0
    this.score = 0
    this.streak = 0
    this.timer = 0
    this.timerInterval = null
    this.totalTime = 0
    this.selectedOption = null
  }

  start() {
    this.state = STATES.PLAYING
    this.questions = selectQuestions(10)
    this.currentQuestionIndex = 0
    this.score = 0
    this.streak = 0
    this.totalTime = getRandomDuration(60, 180)
    this.timer = this.totalTime
    
    resetBalloon()
    showScreen('game-screen')
    this.showCurrentQuestion()
    this.startTimer()
  }

  showCurrentQuestion() {
    if (this.currentQuestionIndex >= this.questions.length) {
      this.endGame()
      return
    }
    
    const question = this.questions[this.currentQuestionIndex]
    showQuestion(question)
    this.selectedOption = null
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timer--
      updateTimer(this.timer, this.totalTime)
      
      const progress = 1 - (this.timer / this.totalTime)
      inflateBalloon(progress)
      
      if (this.timer <= 0) {
        this.explode()
      }
    }, 1000)
  }

  selectAnswer(index) {
    this.selectedOption = index
  }

  validate() {
    if (this.selectedOption === null) return false
    
    const question = this.questions[this.currentQuestionIndex]
    const correct = validateAnswer(this.selectedOption, question.correctIndex)
    
    if (correct) {
      this.streak++
      this.score += calculateScore(this.timer, this.streak)
    } else {
      this.streak = 0
    }
    
    this.currentQuestionIndex++
    
    setTimeout(() => {
      if (this.currentQuestionIndex >= this.questions.length) {
        this.endGame()
      } else {
        this.showCurrentQuestion()
      }
    }, 1500)
    
    return correct
  }

  explode() {
    clearInterval(this.timerInterval)
    this.state = STATES.GAME_OVER
    explodeBalloon()
    showExplosion()
  }

  endGame() {
    clearInterval(this.timerInterval)
    this.state = STATES.GAME_OVER
    showResult(true, this.score)
  }

  reset() {
    clearInterval(this.timerInterval)
    this.state = STATES.IDLE
    this.score = 0
    this.streak = 0
    this.timer = 0
    showScreen('splash-screen')
  }

  getState() {
    return {
      state: this.state,
      score: this.score,
      streak: this.streak,
      timer: this.timer,
      currentQuestion: this.currentQuestionIndex,
      totalQuestions: this.questions.length
    }
  }
}
