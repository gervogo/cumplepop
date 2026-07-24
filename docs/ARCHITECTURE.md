# Arquitectura Técnica — CumplePop

## Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTE                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Mobile    │  │     TV      │  │   Intro Video       │ │
│  │  (Phone)    │  │  (Screen)   │  │  (HyperFrames)      │ │
│  └──────┬──────┘  └──────┬──────┘  └─────────────────────┘ │
│         │                │                                  │
│         └────────┬───────┘                                  │
│                  │ WebSocket                                │
└──────────────────┼──────────────────────────────────────────┘
                   │
┌──────────────────┼──────────────────────────────────────────┐
│                  │       SERVIDOR                           │
│  ┌───────────────┴───────────────────────────────────────┐  │
│  │                  Express + ws                         │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌───────────────┐ │  │
│  │  │  Game Room  │  │  Questions  │  │   Scoring     │ │  │
│  │  │   Manager   │  │   Bank      │  │    Engine     │ │  │
│  │  └─────────────┘  └─────────────┘  └───────────────┘ │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Arquitectura de Pantalla Dual

### Mobile (Phone)
- Recibe input del usuario (gyroscope, vibration)
- Envía eventos al servidor
- Muestra feedback local (vibración, sonido)
- **NO** muestra preguntas

### TV (Screen)
- Muestra preguntas y opciones
- Muestra timer global
- Muestra botón "Siguiente"
- Muestra leaderboard
- **NO** recibe input del usuario

### Servidor
- Coordina estado del juego
- Sincroniza ambos clientes
- Valida respuestas
- Calcula puntuaciones

## Máquina de Estados

```
IDLE → COUNTDOWN → PLAYING → ROUND_END → GAME_OVER → IDLE
  │                                        │
  └────────────────────────────────────────┘
```

### Estados

| Estado | Descripción |
|--------|------------|
| `IDLE` | Esperando jugadores |
| `COUNTDOWN` | 3-2-1 antes de empezar |
| `PLAYING` | Juego activo, pregunta en curso |
| `ROUND_END` | Pregunta terminada, mostrando resultado |
| `GAME_OVER` | Juego terminado, mostrando ganador |

## Protocolo WebSocket

Ver [PROTOCOL.md](./PROTOCOL.md) para detalles.

### Mensajes Cliente → Servidor
- `join_game` — Unirse a la sala
- `submit_answer` — Enviar respuesta
- `next_question` — Solicitar siguiente pregunta

### Mensajes Servidor → Cliente
- `game_state` — Estado actual del juego
- `new_question` — Nueva pregunta
- `answer_result` — Resultado de la respuesta
- `timer_update` — Actualización del timer
- `game_over` — Fin del juego

## Modelo de Datos

### Game Room
```javascript
{
  id: "room-123",
  state: "PLAYING",
  players: [
    { id: "player-1", name: "Gerson", score: 150 }
  ],
  currentQuestion: 3,
  questions: [...],
  timer: 45,
  createdAt: "2025-01-01T00:00:00Z"
}
```

### Question
```javascript
{
  id: 1,
  text: "¿En qué año se graduó [NAME]?",
  options: ["2001", "2002", "2003", "2004"],
  correctIndex: 2,
  year: 2003
}
```

## Flujo de una Ronda

```
1. Servidor envía new_question
2. TV muestra pregunta
3. Timer inicia (60-180s random)
4. Globo se infla progresivamente
5. Mobile vibra cuando se acerca el fin
6. Jugador responde en mobile
7. Servidor valida respuesta
8. TV muestra resultado (correcto/incorrecto)
9. Actualiza score
10. Repite hasta 10 preguntas o tiempo agota
```

## Sistema de Scoring

| Evento | Puntos |
|--------|--------|
| Respuesta correcta | +100 |
| Bonus de tiempo | + (tiempoRestante × 10) |
| Racha de 3 correctas | +50 bonus |
| Racha de 5 correctas | +100 bonus |
| Respuesta incorrecta | 0 |

## Seguridad

- No almacenar datos sensibles
- Rate limiting en WebSocket
- Validación server-side de todas las respuestas
- No exponer internamente el juego
