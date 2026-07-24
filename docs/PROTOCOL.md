# Protocolo WebSocket — CumplePop

## Conexión

```
ws://localhost:3000/game
```

## Formato de Mensajes

Todos los mensajes son JSON con la siguiente estructura:

```javascript
{
  type: "nombre_del_mensaje",
  payload: { ... },
  timestamp: 1234567890
}
```

## Mensajes Cliente → Servidor

### `join_game`
Unirse a una sala de juego.

```javascript
{
  type: "join_game",
  payload: {
    playerName: "Gerson",
    roomCode: "ABC123"
  }
}
```

### `submit_answer`
Enviar respuesta a una pregunta.

```javascript
{
  type: "submit_answer",
  payload: {
    questionId: 1,
    answerIndex: 2,
    timestamp: 1234567890
  }
}
```

### `next_question`
Solicitar siguiente pregunta (solo desde TV).

```javascript
{
  type: "next_question",
  payload: {}
}
```

### `ping`
Keep-alive.

```javascript
{
  type: "ping",
  payload: {}
}
```

## Mensajes Servidor → Cliente

### `game_state`
Estado completo del juego.

```javascript
{
  type: "game_state",
  payload: {
    state: "PLAYING",
    players: [
      { id: "player-1", name: "Gerson", score: 150 }
    ],
    currentQuestion: 3,
    totalQuestions: 10,
    timer: 45
  }
}
```

### `new_question`
Nueva pregunta disponible.

```javascript
{
  type: "new_question",
  payload: {
    questionId: 3,
    text: "¿En qué año se graduó [NAME]?",
    options: ["2001", "2002", "2003", "2004"],
    timerDuration: 90
  }
}
```

### `answer_result`
Resultado de la respuesta enviada.

```javascript
{
  type: "answer_result",
  payload: {
    correct: true,
    correctAnswer: 2,
    pointsEarned: 180,
    totalScore: 330,
    streak: 2
  }
}
```

### `timer_update`
Actualización periódica del timer.

```javascript
{
  type: "timer_update",
  payload: {
    remaining: 45,
    total: 90,
    percentage: 50
  }
}
```

### `explosion`
El globo/patata explotó.

```javascript
{
  type: "explosion",
  payload: {
    reason: "timeout",
    finalScores: [...]
  }
}
```

### `game_over`
El juego terminó.

```javascript
{
  type: "game_over",
  payload: {
    winner: { id: "player-1", name: "Gerson", score: 1250 },
    players: [...],
    stats: {
      totalQuestions: 10,
      averageTime: 12.5,
      longestStreak: 5
    }
  }
}
```

### `error`
Error del servidor.

```javascript
{
  type: "error",
  payload: {
    code: "ROOM_FULL",
    message: "La sala está llena"
  }
}
```

## Código de Errores

| Código | Descripción |
|--------|------------|
| `ROOM_NOT_FOUND` | Sala no existe |
| `ROOM_FULL` | Sala llena (máx 8 jugadores) |
| `INVALID_ANSWER` | Respuesta fuera de rango |
| `GAME_IN_PROGRESS` | Juego ya empezó |
| `NOT_YOUR_TURN` | No es tu turno |
| `TIMEOUT` | Conexión expirada |

## Heartbeat

El servidor envía `ping` cada 30 segundos. El cliente debe responder con `pong`. Si no hay respuesta en 10 segundos, se cierra la conexión.

## Reconexión

El cliente debe intentar reconexión automática con backoff exponencial:

1. Primer intento: 1 segundo
2. Segundo intento: 2 segundos
3. Tercer intento: 4 segundos
4. Máximo: 30 segundos

Al reconectar, enviar `join_game` con el mismo `roomCode`.
