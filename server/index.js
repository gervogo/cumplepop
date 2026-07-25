import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { readFileSync } from 'fs'
import { createServer } from 'http'
import { WebSocketServer } from 'ws'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.static(join(__dirname, '..', 'public')))

app.get('/preguntas', (req, res) => {
  res.sendFile(join(__dirname, '..', 'public', 'preguntas.html'))
})

app.get('/arbitro', (req, res) => {
  res.sendFile(join(__dirname, '..', 'public', 'arbitro.html'))
})

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '..', 'public', 'index.html'))
})

const questions = JSON.parse(
  readFileSync(join(__dirname, '..', 'public', 'data', 'preguntas.json'), 'utf8')
)

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

let currentState = {
  type: 'question',
  questionIndex: 0,
  revealAnswer: false,
  order: shuffle(questions.map((_, i) => i)),
}

const server = createServer(app)
const wss = new WebSocketServer({ server })

wss.on('connection', (ws) => {
  ws.send(JSON.stringify(currentState))

  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw)

      if (msg.action === 'shuffle') {
        currentState.order = shuffle(questions.map((_, i) => i))
        currentState.questionIndex = 0
        currentState.revealAnswer = false
      } else {
        currentState = { ...currentState, ...msg }
      }

      for (const client of wss.clients) {
        if (client.readyState === 1) {
          client.send(JSON.stringify(currentState))
        }
      }
    } catch (e) {
      console.error('WS message error:', e)
    }
  })
})

server.listen(PORT, () => {
  console.log(`🎈 CUMPLE POP server running at http://localhost:${PORT}`)
  console.log(`📺 TV: http://localhost:${PORT}/preguntas`)
  console.log(`🎤 Arbitro: http://localhost:${PORT}/arbitro`)
})
