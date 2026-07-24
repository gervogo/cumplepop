// Protocolo WebSocket para CumplePop

export const MessageTypes = {
  // Cliente → Servidor
  JOIN_GAME: 'join_game',
  SUBMIT_ANSWER: 'submit_answer',
  NEXT_QUESTION: 'next_question',
  PING: 'ping',

  // Servidor → Cliente
  GAME_STATE: 'game_state',
  NEW_QUESTION: 'new_question',
  ANSWER_RESULT: 'answer_result',
  TIMER_UPDATE: 'timer_update',
  EXPLOSION: 'explosion',
  GAME_OVER: 'game_over',
  ERROR: 'error'
}

export const ErrorCodes = {
  ROOM_NOT_FOUND: 'ROOM_NOT_FOUND',
  ROOM_FULL: 'ROOM_FULL',
  INVALID_ANSWER: 'INVALID_ANSWER',
  GAME_IN_PROGRESS: 'GAME_IN_PROGRESS',
  NOT_YOUR_TURN: 'NOT_YOUR_TURN',
  TIMEOUT: 'TIMEOUT'
}

export function createMessage(type, payload = {}) {
  return JSON.stringify({
    type,
    payload,
    timestamp: Date.now()
  })
}

export function parseMessage(data) {
  try {
    return JSON.parse(data)
  } catch {
    return null
  }
}
