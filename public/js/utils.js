// Utility functions for CumplePop

export function shuffle(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function formatTime(seconds) {
  return `${seconds}s`
}

export function calculateScore(timeRemaining, streak) {
  const baseScore = 100
  const timeBonus = timeRemaining * 10
  let streakBonus = 0

  if (streak >= 5) streakBonus = 100
  else if (streak >= 3) streakBonus = 50

  return baseScore + timeBonus + streakBonus
}

export function getRandomDuration(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function lerp(start, end, factor) {
  return start + (end - start) * factor
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}
