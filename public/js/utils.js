// Utility functions for CumplePop - Enhanced Version

export function shuffle(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function formatTime(seconds) {
  if (seconds < 60) {
    return `${seconds}s`
  }
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function calculateScore(timeRemaining, streak) {
  const baseScore = 100
  const timeBonus = timeRemaining * 10
  let streakBonus = 0

  if (streak >= 5) {
    streakBonus = 100
  } else if (streak >= 3) {
    streakBonus = 50
  }

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

export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export function throttle(func, limit) {
  let inThrottle
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

export function randomRange(min, max) {
  return Math.random() * (max - min) + min
}

export function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3)
}

export function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}
