// Questions module for CumplePop - Enhanced Version

import { shuffle } from './utils.js'

let questions = []
let isLoaded = false

export async function loadQuestions() {
  if (isLoaded) return questions
  
  try {
    const response = await fetch('/data/questions.json')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    questions = await response.json()
    isLoaded = true
    console.log(`📚 Loaded ${questions.length} questions`)
    return questions
  } catch (error) {
    console.error('Error loading questions:', error)
    // Fallback to empty array
    questions = []
    return questions
  }
}

export async function selectQuestions(count = 10) {
  if (!isLoaded) {
    await loadQuestions()
  }
  
  // Shuffle and select
  const shuffled = shuffle([...questions])
  return shuffled.slice(0, Math.min(count, questions.length))
}

export function validateAnswer(selectedIndex, correctIndex) {
  return selectedIndex === correctIndex
}

export function getQuestion(index) {
  return questions[index] || null
}

export function getTotalQuestions() {
  return questions.length
}

export function isQuestionsLoaded() {
  return isLoaded
}
