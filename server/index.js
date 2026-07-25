import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

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

app.listen(PORT, () => {
  console.log(`🎈 CUMPLE POP running at http://localhost:${PORT}`)
  console.log(`📺 TV: http://localhost:${PORT}/preguntas`)
  console.log(`🎤 Arbitro: http://localhost:${PORT}/arbitro`)
})
