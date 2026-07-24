// Questions module for CumplePop

import { shuffle } from './utils.js'

let questions = []

export async function loadQuestions() {
  try {
    const response = await fetch('/data/questions.json')
    questions = await response.json()
    return questions
  } catch (error) {
    console.error('Error loading questions:', error)
    return []
  }
}

export function selectQuestions(count = 10) {
  return shuffle(questions).slice(0, count)
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
