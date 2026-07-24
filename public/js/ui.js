// UI module for CumplePop

export function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active')
  })
  document.getElementById(screenId).classList.add('active')
}

export function showQuestion(question) {
  const container = document.getElementById('question-container')
  const textEl = document.getElementById('question-text')
  const optionsEl = document.getElementById('options-grid')
  
  textEl.textContent = question.text
  optionsEl.innerHTML = ''
  
  question.options.forEach((option, index) => {
    const btn = document.createElement('button')
    btn.className = 'option-btn'
    btn.textContent = option
    btn.dataset.index = index
    btn.addEventListener('click', () => selectOption(index))
    optionsEl.appendChild(btn)
  })
  
  container.classList.remove('hidden')
}

export function selectOption(index) {
  document.querySelectorAll('.option-btn').forEach((btn, i) => {
    btn.classList.toggle('selected', i === index)
  })
  
  const validateBtn = document.getElementById('btn-validate')
  validateBtn.disabled = false
  validateBtn.dataset.selectedIndex = index
}

export function showResult(correct, score) {
  const container = document.getElementById('question-container')
  const resultTitle = document.getElementById('result-title')
  const resultScore = document.getElementById('result-score')
  
  container.classList.add('hidden')
  
  if (correct) {
    resultTitle.textContent = '¡Correcto! 🎉'
    resultTitle.style.color = '#00FF7F'
  } else {
    resultTitle.textContent = '¡Incorrecto! 😢'
    resultTitle.style.color = '#FF1493'
  }
  
  resultScore.textContent = `Puntos: ${score}`
  showScreen('result-screen')
}

export function updateTimer(remaining, total) {
  const timerFill = document.getElementById('timer-fill')
  const timerText = document.getElementById('timer-text')
  
  const percentage = (remaining / total) * 100
  timerFill.style.width = `${percentage}%`
  timerText.textContent = `${remaining}s`
  
  // Change color based on time
  if (remaining <= 10) {
    timerFill.style.background = 'linear-gradient(90deg, #FF1493 0%, #FF69B4 100%)'
  } else if (remaining <= 30) {
    timerFill.style.background = 'linear-gradient(90deg, #FFD700 0%, #FFA500 100%)'
  } else {
    timerFill.style.background = 'linear-gradient(90deg, #00FF7F 0%, #FFD700 50%, #FF1493 100%)'
  }
}

export function showExplosion() {
  showScreen('result-screen')
  document.getElementById('result-title').textContent = '¡BOOM! 💥'
  document.getElementById('result-title').style.color = '#FF1493'
}
