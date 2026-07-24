// UI module for CumplePop - Potato Mode

export function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active')
  })
  
  const targetScreen = document.getElementById(screenId)
  if (targetScreen) {
    targetScreen.classList.add('active')
  }
}

export function updateTimer(remaining, total) {
  const timerFill = document.getElementById('timer-fill')
  const timerText = document.getElementById('timer-text')
  const timerContainer = document.getElementById('timer-container')
  
  if (!timerFill || !timerText) return
  
  const percentage = (remaining / total) * 100
  timerFill.style.width = `${percentage}%`
  timerText.textContent = `${remaining}s`
  
  // Change color and effects based on time
  if (remaining <= 10) {
    timerFill.style.background = 'linear-gradient(90deg, #FF1493 0%, #FF69B4 100%)'
    if (timerContainer) {
      timerContainer.classList.remove('warning')
      timerContainer.classList.add('danger')
    }
  } else if (remaining <= 30) {
    timerFill.style.background = 'linear-gradient(90deg, #FFD700 0%, #FFA500 100%)'
    if (timerContainer) {
      timerContainer.classList.remove('danger')
      timerContainer.classList.add('warning')
    }
  } else {
    timerFill.style.background = 'linear-gradient(90deg, #00FF7F 0%, #FFD700 50%, #FF1493 100%)'
    if (timerContainer) {
      timerContainer.classList.remove('danger', 'warning')
    }
  }
}

export function showExplosion() {
  showScreen('result-screen')
  
  const resultTitle = document.getElementById('result-title')
  const resultSubtitle = document.getElementById('result-subtitle')
  
  if (resultTitle) {
    resultTitle.textContent = '¡BOOM! 💥'
    resultTitle.style.color = '#FF1493'
  }
  
  if (resultSubtitle) {
    resultSubtitle.textContent = 'La patata ha explotado...'
  }
}

export function resetUI() {
  const timerContainer = document.getElementById('timer-container')
  if (timerContainer) {
    timerContainer.classList.remove('danger', 'warning')
  }
  
  const timerFill = document.getElementById('timer-fill')
  if (timerFill) {
    timerFill.style.width = '100%'
  }
  
  const timerText = document.getElementById('timer-text')
  if (timerText) {
    timerText.textContent = '60s'
  }
}
