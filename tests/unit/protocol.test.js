import { describe, it, expect } from 'vitest'
import { MessageTypes, ErrorCodes, createMessage, parseMessage } from '../../server/protocol.js'

describe('MessageTypes', () => {
  it('tiene todos los tipos de mensaje', () => {
    expect(MessageTypes.JOIN_GAME).toBe('join_game')
    expect(MessageTypes.SUBMIT_ANSWER).toBe('submit_answer')
    expect(MessageTypes.NEXT_QUESTION).toBe('next_question')
    expect(MessageTypes.PING).toBe('ping')
    expect(MessageTypes.GAME_STATE).toBe('game_state')
    expect(MessageTypes.NEW_QUESTION).toBe('new_question')
    expect(MessageTypes.ANSWER_RESULT).toBe('answer_result')
    expect(MessageTypes.TIMER_UPDATE).toBe('timer_update')
    expect(MessageTypes.EXPLOSION).toBe('explosion')
    expect(MessageTypes.GAME_OVER).toBe('game_over')
    expect(MessageTypes.ERROR).toBe('error')
  })
})

describe('ErrorCodes', () => {
  it('tiene todos los códigos de error', () => {
    expect(ErrorCodes.ROOM_NOT_FOUND).toBe('ROOM_NOT_FOUND')
    expect(ErrorCodes.ROOM_FULL).toBe('ROOM_FULL')
    expect(ErrorCodes.INVALID_ANSWER).toBe('INVALID_ANSWER')
    expect(ErrorCodes.GAME_IN_PROGRESS).toBe('GAME_IN_PROGRESS')
    expect(ErrorCodes.NOT_YOUR_TURN).toBe('NOT_YOUR_TURN')
    expect(ErrorCodes.TIMEOUT).toBe('TIMEOUT')
  })
})

describe('createMessage', () => {
  it('crea un mensaje con tipo y payload', () => {
    const message = createMessage('test', { foo: 'bar' })
    const parsed = JSON.parse(message)
    
    expect(parsed.type).toBe('test')
    expect(parsed.payload.foo).toBe('bar')
    expect(parsed.timestamp).toBeDefined()
  })
  
  it('crea un mensaje con payload vacío por defecto', () => {
    const message = createMessage('test')
    const parsed = JSON.parse(message)
    
    expect(parsed.payload).toEqual({})
  })
})

describe('parseMessage', () => {
  it('parsea un JSON válido', () => {
    const data = JSON.stringify({ type: 'test', payload: {} })
    const result = parseMessage(data)
    
    expect(result).toEqual({ type: 'test', payload: {} })
  })
  
  it('retorna null para JSON inválido', () => {
    const result = parseMessage('invalid json')
    expect(result).toBeNull()
  })
})
