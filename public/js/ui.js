// UI module for CumplePop - Enhanced Version

let currentSelectedOption = null

export function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active')
  })
  
  const targetScreen = document.getElementById(screenId)
  if (targetScreen) {
    targetScreen.classList.add('active')
  }
}

export function showQuestion(question, questionNumber, totalQuestions) {
  const container = document.getElementById('question-container')
  const textEl = document.getElementById('question-text')
  const optionsEl = document.getElementById('options-grid')
  const progressEl = document.getElementById('question-progress')
  
  if (!container || !textEl || !optionsEl) return
  
  // Update progress
  if (progressEl) {
    progressEl.textContent = `${questionNumber} / ${totalQuestions}`
  }
  
  // Set question text with animation
  textEl.style.opacity = '0'
  textEl.textContent = question.text
  setTimeout(() => {
    textEl.style.opacity = '1'
  }, 50)
  
  // Clear and populate options
  optionsEl.innerHTML = ''
  
  question.options.forEach((option, index) => {
    const btn = document.createElement('button')
    btn.className = 'option-btn'
    btn.dataset.index = index
    btn.innerHTML = `
      <span class="option-letter">${String.fromCharCode(65 + index)}</span>
      <span class="option-text">${option}</span>
    `
    
    btn.addEventListener('click', () => {
      if (!btn.disabled) {
        selectOption(index)
      }
    })
    
    optionsEl.appendChild(btn)
  })
  
  // Reset validate button
  const validateBtn = document.getElementById('btn-validate')
  if (validateBtn) {
    validateBtn.disabled = true
    validateBtn.textContent = 'VALIDAR'
  }
  
  // Show container with animation
  container.classList.remove('hidden')
  container.style.opacity = '0'
  container.style.transform = 'translateY(20px)'
  setTimeout(() => {
    container.style.opacity = '1'
    container.style.transform = 'translateY(0)'
  }, 100)
}

export function selectOption(index) {
  currentSelectedOption = index
  
  // Update visual selection
  document.querySelectorAll('.option-btn').forEach((btn, i) => {
    btn.classList.toggle('selected', i === index)
  })
  
  // Enable validate button
  const validateBtn = document.getElementById('btn-validate')
  if (validateBtn) {
    validateBtn.disabled = false
    validateBtn.dataset.selectedIndex = index
  }
}

export function highlightOption(index) {
  document.querySelectorAll('.option-btn').forEach((btn, i) => {
    if (i === index) {
      btn.classList.add('selected')
    }
  })
}

export function disableOptions() {
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.disabled = true
  })
  
  const validateBtn = document.getElementById('btn-validate')
  if (validateBtn) {
    validateBtn.disabled = true
  }
}

export function showRoundResult(correct, correctIndex) {
  document.querySelectorAll('.option-btn').forEach((btn, i) => {
    if (i === correctIndex) {
      btn.classList.add('correct')
    } else if (btn.classList.contains('selected') && !correct) {
      btn.classList.add('incorrect')
    }
  })
  
  // Show feedback message
  const feedbackEl = document.getElementById('answer-feedback')
  if (feedbackEl) {
    feedbackEl.textContent = correct ? '¡Correcto! 🎉' : '¡Incorrecto! 😢'
    feedbackEl.className = `answer-feedback ${correct ? 'correct' : 'incorrect'}`
    feedbackEl.style.display = 'block'
    
    setTimeout(() => {
      feedbackEl.style.display = 'none'
    }, 1500)
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
  
  // Change color based on time
  if (remaining <= 10) {
    timerFill.style.background = 'linear-gradient(90deg, #FF1493 0%, #FF69B4 100%)'
    if (timerContainer) {
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

export function updateScore(score) {
  const scoreEl = document.getElementById('score-display')
  if (scoreEl) {
    scoreEl.textContent = score
    scoreEl.classList.add('pulse')
    setTimeout(() => {
      scoreEl.classList.remove('pulse')
    }, 300)
  }
}

export function updateStreak(streak) {
  const streakEl = document.getElementById('streak-display')
  if (streakEl) {
    if (streak >= 3) {
      streakEl.textContent = `${streak} 🔥`
      streakEl.classList.add('active')
    } else if (streak > 0) {
      streakEl.textContent = `${streak}`
      streakEl.classList.remove('active')
    } else {
      streakEl.textContent = ''
      streakEl.classList.remove('active')
    }
  }
}

export function showExplosion() {
  showScreen('result-screen')
  
  const resultTitle = document.getElementById('result-title')
  const resultSubtitle = document.getElementById('result-subtitle')
  const resultScore = document.getElementById('result-score')
  
  if (resultTitle) {
    resultTitle.textContent = '¡BOOM! 💥'
    resultTitle.style.color = '#FF1493'
  }
  
  if (resultSubtitle) {
    resultSubtitle.textContent = 'La patata ha explotado...'
  }
}

export function showResult(completed, score) {
  showScreen('result-screen')
  
  const resultTitle = document.getElementById('result-title')
  const resultSubtitle = document.getElementById('result-subtitle')
  const resultScore = document.getElementById('result-score')
  
  if (completed) {
    if (resultTitle) {
      resultTitle.textContent = '¡Completado! 🎉'
      resultTitle.style.color = '#00FF7F'
    }
    if (resultSubtitle) {
      resultSubtitle.textContent = '¡Has respondido todas las preguntas!'
    }
  } else {
    if (resultTitle) {
      resultTitle.textContent = '¡Tiempo! ⏰'
      resultTitle.style.color = '#FFD700'
    }
    if (resultSubtitle) {
      resultSubtitle.textContent = 'Se acabó el tiempo'
    }
  }
  
  if (resultScore) {
    resultScore.textContent = `Puntos: ${score}`
  }
}

export function showCorrectAnswer(correctIndex, options) {
  const optionBtns = document.querySelectorAll('.option-btn')
  optionBtns.forEach((btn, i) => {
    if (i === correctIndex) {
      btn.classList.add('correct')
    }
  })
}

export function resetUI() {
  currentSelectedOption = null
  
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.classList.remove('selected', 'correct', 'incorrect')
    btn.disabled = false
  })
  
  const validateBtn = document.getElementById('btn-validate')
  if (validateBtn) {
    validateBtn.disabled = true
    validateBtn.textContent = 'VALIDAR'
  }
  
  const feedbackEl = document.getElementById('answer-feedback')
  if (feedbackEl) {
    feedbackEl.style.display = 'none'
  }
  
  const timerContainer = document.getElementById('timer-container')
  if (timerContainer) {
    timerContainer.classList.remove('danger', 'warning')
  }
}
