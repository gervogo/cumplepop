// Game Engine for CumplePop - Potato Logic Only

import { startInflation, stopInflation, explodeBalloon, resetBalloon } from './balloon.js'
import { showScreen, updateTimer, showExplosion } from './ui.js'
import { getRandomDuration } from './utils.js'
import { particleSystem } from './particles.js'

const STATES = {
  IDLE: 'IDLE',
  COUNTDOWN: 'COUNTDOWN',
  PLAYING: 'PLAYING',
  GAME_OVER: 'GAME_OVER'
}

const GAME_CONFIG = {
  minTime: 60,
  maxTime: 180,
  countdownDuration: 3
}

export class GameEngine {
  constructor() {
    this.state = STATES.IDLE
    this.timer = 0
    this.totalTime = 0
    this.timerInterval = null
  }

  async start() {
    this.state = STATES.COUNTDOWN
    this.totalTime = getRandomDuration(GAME_CONFIG.minTime, GAME_CONFIG.maxTime)
    this.timer = this.totalTime
    
    resetBalloon()
    showScreen('game-screen')
    
    await this.showCountdown()
    this.startGame()
  }

  async showCountdown() {
    const countdownEl = document.getElementById('countdown')
    if (!countdownEl) {
      this.startGame()
      return
    }

    countdownEl.style.display = 'flex'

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
    this.startTimer()
    
    // Start smooth inflation - balloon handles timing internally
    startInflation(this.totalTime * 1000)
  }

  startTimer() {
    updateTimer(this.timer, this.totalTime)
    
    this.timerInterval = setInterval(() => {
      this.timer--
      updateTimer(this.timer, this.totalTime)
      
      if (this.timer <= 10 && navigator.vibrate) {
        navigator.vibrate([100, 50, 100])
      }
      
      if (this.timer <= 0) {
        this.explode()
      }
    }, 1000)
  }

  explode() {
    clearInterval(this.timerInterval)
    stopInflation()
    this.state = STATES.GAME_OVER
    
    const centerX = window.innerWidth / 2
    const centerY = window.innerHeight / 2
    particleSystem.createExplosion(centerX, centerY, 80)
    particleSystem.createStickerExplosion(centerX, centerY)
    
    explodeBalloon()
    
    setTimeout(() => {
      showExplosion()
    }, 1000)
  }

  reset() {
    clearInterval(this.timerInterval)
    stopInflation()
    this.state = STATES.IDLE
    this.timer = 0
    particleSystem.clear()
    
    showScreen('splash-screen')
  }

  getState() {
    return {
      state: this.state,
      timer: this.timer,
      totalTime: this.totalTime
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
