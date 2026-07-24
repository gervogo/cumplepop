import { describe, it, expect } from 'vitest'
import { shuffle, calculateScore, formatTime, getRandomDuration, lerp, clamp } from '../../public/js/utils.js'

describe('shuffle', () => {
  it('baraja sin perder elementos', () => {
    const arr = [1, 2, 3, 4, 5]
    const shuffled = shuffle(arr)
    expect(shuffled.sort()).toEqual(arr.sort())
  })
  
  it('no muta el array original', () => {
    const arr = [1, 2, 3]
    const original = [...arr]
    shuffle(arr)
    expect(arr).toEqual(original)
  })
  
  it('retorna un nuevo array', () => {
    const arr = [1, 2, 3]
    const shuffled = shuffle(arr)
    expect(shuffled).not.toBe(arr)
  })
})

describe('calculateScore', () => {
  it('calcula puntos base', () => {
    const score = calculateScore(30, 0)
    expect(score).toBe(100 + 30 * 10)
  })
  
  it('incluye bonus de racha de 3', () => {
    const score = calculateScore(30, 3)
    expect(score).toBe(100 + 30 * 10 + 50)
  })
  
  it('incluye bonus de racha de 5', () => {
    const score = calculateScore(30, 5)
    expect(score).toBe(100 + 30 * 10 + 100)
  })
  
  it('no incluye bonus con racha menor a 3', () => {
    const score = calculateScore(30, 2)
    expect(score).toBe(100 + 30 * 10)
  })
})

describe('formatTime', () => {
  it('formatea segundos correctamente', () => {
    expect(formatTime(30)).toBe('30s')
    expect(formatTime(0)).toBe('0s')
    expect(formatTime(59)).toBe('59s')
  })
  
  it('formatea minutos y segundos correctamente', () => {
    expect(formatTime(60)).toBe('1:00')
    expect(formatTime(90)).toBe('1:30')
    expect(formatTime(120)).toBe('2:00')
  })
})

describe('getRandomDuration', () => {
  it('retorna un número entre min y max', () => {
    const duration = getRandomDuration(60, 180)
    expect(duration).toBeGreaterThanOrEqual(60)
    expect(duration).toBeLessThanOrEqual(180)
  })
  
  it('retorna diferentes valores', () => {
    const durations = new Set()
    for (let i = 0; i < 100; i++) {
      durations.add(getRandomDuration(60, 180))
    }
    expect(durations.size).toBeGreaterThan(1)
  })
})

describe('lerp', () => {
  it('interpola entre dos valores', () => {
    expect(lerp(0, 10, 0.5)).toBe(5)
    expect(lerp(0, 10, 0)).toBe(0)
    expect(lerp(0, 10, 1)).toBe(10)
  })
})

describe('clamp', () => {
  it('limita el valor al rango', () => {
    expect(clamp(5, 0, 10)).toBe(5)
    expect(clamp(-5, 0, 10)).toBe(0)
    expect(clamp(15, 0, 10)).toBe(10)
  })
})
