// Game Room Manager para CumplePop

import { MessageTypes, createMessage } from './protocol.js'

const ROOM_SIZE = 8
const TOTAL_QUESTIONS = 10

export class GameRoom {
  constructor(id) {
    this.id = id
    this.players = new Map()
    this.state = 'IDLE'
    this.questions = []
    this.currentQuestionIndex = 0
    this.timer = 0
    this.timerInterval = null
  }

  addPlayer(player) {
    if (this.players.size >= ROOM_SIZE) {
      return false
    }
    this.players.set(player.id, player)
    return true
  }

  removePlayer(playerId) {
    this.players.delete(playerId)
  }

  startGame(questions) {
    this.questions = this.shuffleQuestions(questions).slice(0, TOTAL_QUESTIONS)
    this.state = 'PLAYING'
    this.currentQuestionIndex = 0
    this.startTimer()
    this.broadcastGameState()
  }

  shuffleQuestions(questions) {
    const shuffled = [...questions]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  startTimer() {
    const duration = Math.floor(Math.random() * 120) + 60 // 60-180s
    this.timer = duration

    this.timerInterval = setInterval(() => {
      this.timer--
      this.broadcast({
        type: MessageTypes.TIMER_UPDATE,
        payload: {
          remaining: this.timer,
          total: duration,
          percentage: (this.timer / duration) * 100
        }
      })

      if (this.timer <= 0) {
        this.explode()
      }
    }, 1000)
  }

  explode() {
    clearInterval(this.timerInterval)
    this.state = 'GAME_OVER'
    this.broadcast({
      type: MessageTypes.EXPLOSION,
      payload: {
        reason: 'timeout',
        finalScores: this.getScores()
      }
    })
  }

  submitAnswer(playerId, questionId, answerIndex) {
    const question = this.questions[this.currentQuestionIndex]
    if (!question) return false

    const correct = answerIndex === question.correctIndex
    const player = this.players.get(playerId)
    
    if (player && correct) {
      player.score += 100 + (this.timer * 10)
    }

    return correct
  }

  nextQuestion() {
    this.currentQuestionIndex++
    
    if (this.currentQuestionIndex >= this.questions.length) {
      this.endGame()
      return false
    }

    this.broadcastNewQuestion()
    return true
  }

  broadcastNewQuestion() {
    const question = this.questions[this.currentQuestionIndex]
    this.broadcast({
      type: MessageTypes.NEW_QUESTION,
      payload: {
        questionId: question.id,
        text: question.text,
        options: question.options,
        timerDuration: this.timer
      }
    })
  }

  endGame() {
    clearInterval(this.timerInterval)
    this.state = 'GAME_OVER'
    
    const scores = this.getScores()
    const winner = scores[0]

    this.broadcast({
      type: MessageTypes.GAME_OVER,
      payload: {
        winner,
        players: scores,
        stats: {
          totalQuestions: this.questions.length,
          averageTime: 0,
          longestStreak: 0
        }
      }
    })
  }

  getScores() {
    return Array.from(this.players.values())
      .sort((a, b) => b.score - a.score)
  }

  broadcastGameState() {
    this.broadcast({
      type: MessageTypes.GAME_STATE,
      payload: {
        state: this.state,
        players: this.getScores(),
        currentQuestion: this.currentQuestionIndex,
        totalQuestions: this.questions.length,
        timer: this.timer
      }
    })
  }

  broadcast(message) {
    const data = createMessage(message.type, message.payload)
    this.players.forEach(player => {
      if (player.ws.readyState === 1) {
        player.ws.send(data)
      }
    })
  }
}

export class GameRoomManager {
  constructor() {
    this.rooms = new Map()
  }

  createRoom() {
    const id = this.generateRoomId()
    const room = new GameRoom(id)
    this.rooms.set(id, room)
    return room
  }

  getRoom(id) {
    return this.rooms.get(id)
  }

  deleteRoom(id) {
    this.rooms.delete(id)
  }

  generateRoomId() {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }
}
