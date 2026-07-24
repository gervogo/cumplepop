import express from 'express'
import { createServer } from 'http'
import { WebSocketServer } from 'ws'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const server = createServer(app)
const wss = new WebSocketServer({ server, path: '/game' })

const PORT = process.env.PORT || 3000

// Servir archivos estáticos
app.use(express.static(join(__dirname, '..', 'public')))

// Rutas
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '..', 'public', 'index.html'))
})

app.get('/mobile', (req, res) => {
  res.sendFile(join(__dirname, '..', 'public', 'mobile.html'))
})

app.get('/tv', (req, res) => {
  res.sendFile(join(__dirname, '..', 'public', 'tv.html'))
})

// WebSocket
const rooms = new Map()

wss.on('connection', (ws) => {
  console.log('Cliente conectado')

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data)
      handleMessage(ws, message)
    } catch (error) {
      console.error('Error parsing message:', error)
    }
  })

  ws.on('close', () => {
    console.log('Cliente desconectado')
  })
})

function handleMessage(ws, message) {
  const { type, payload } = message

  switch (type) {
    case 'join_game':
      // TODO: Implementar unión a sala
      console.log('Join game:', payload)
      break
    case 'submit_answer':
      // TODO: Implementar envío de respuesta
      console.log('Submit answer:', payload)
      break
    case 'next_question':
      // TODO: Implementar siguiente pregunta
      console.log('Next question')
      break
    default:
      console.log('Unknown message type:', type)
  }
}

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`🎈 CumplePop server running at http://localhost:${PORT}`)
})
