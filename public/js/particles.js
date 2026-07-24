// Particles module for CumplePop - Enhanced Version

export class ParticleSystem {
  constructor() {
    this.particles = []
    this.confettiPieces = []
  }

  createExplosion(x, y, count = 50) {
    const colors = [
      '#FF1493', '#00BFFF', '#00FF7F', '#FFD700', 
      '#FF69B4', '#00FFFF', '#FF6347', '#7B68EE'
    ]
    
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div')
      particle.className = 'particle'
      particle.style.left = `${x}px`
      particle.style.top = `${y}px`
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
      particle.style.width = `${5 + Math.random() * 15}px`
      particle.style.height = particle.style.width
      
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5
      const velocity = 80 + Math.random() * 150
      const tx = Math.cos(angle) * velocity
      const ty = Math.sin(angle) * velocity - 50 // bias upward
      
      particle.style.setProperty('--tx', `${tx}px`)
      particle.style.setProperty('--ty', `${ty}px`)
      particle.style.animationDuration = `${0.8 + Math.random() * 0.5}s`
      
      document.body.appendChild(particle)
      this.particles.push(particle)
      
      setTimeout(() => {
        particle.remove()
        this.particles = this.particles.filter(p => p !== particle)
      }, 1500)
    }
  }

  createConfetti(count = 100) {
    const colors = [
      '#FF1493', '#00BFFF', '#00FF7F', '#FFD700', 
      '#FF69B4', '#00FFFF', '#FF6347', '#7B68EE'
    ]
    
    for (let i = 0; i < count; i++) {
      const confetti = document.createElement('div')
      confetti.className = 'confetti'
      confetti.style.left = `${Math.random() * 100}vw`
      confetti.style.top = `-20px`
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
      confetti.style.width = `${8 + Math.random() * 12}px`
      confetti.style.height = `${4 + Math.random() * 8}px`
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px'
      
      const rotation = Math.random() * 360
      const duration = 2 + Math.random() * 3
      const delay = Math.random() * 2
      
      confetti.style.transform = `rotate(${rotation}deg)`
      confetti.style.animationDuration = `${duration}s`
      confetti.style.animationDelay = `${delay}s`
      
      document.body.appendChild(confetti)
      this.confettiPieces.push(confetti)
      
      setTimeout(() => {
        confetti.remove()
        this.confettiPieces = this.confettiPieces.filter(c => c !== confetti)
      }, (duration + delay) * 1000 + 500)
    }
  }

  createStickerExplosion(x, y) {
    const stickers = ['🌸', '💖', '🎉', '⭐', '🎈', '✨', '🎀', '💫']
    
    for (let i = 0; i < 12; i++) {
      const sticker = document.createElement('div')
      sticker.className = 'sticker-particle'
      sticker.textContent = stickers[Math.floor(Math.random() * stickers.length)]
      sticker.style.left = `${x}px`
      sticker.style.top = `${y}px`
      sticker.style.fontSize = `${20 + Math.random() * 20}px`
      
      const angle = (Math.PI * 2 * i) / 12
      const velocity = 100 + Math.random() * 100
      const tx = Math.cos(angle) * velocity
      const ty = Math.sin(angle) * velocity - 80
      
      sticker.style.setProperty('--tx', `${tx}px`)
      sticker.style.setProperty('--ty', `${ty}px`)
      
      document.body.appendChild(sticker)
      this.particles.push(sticker)
      
      setTimeout(() => {
        sticker.remove()
        this.particles = this.particles.filter(p => p !== sticker)
      }, 1200)
    }
  }

  createScorePopup(x, y, score, isBonus = false) {
    const popup = document.createElement('div')
    popup.className = 'score-popup'
    popup.textContent = isBonus ? `+${score} BONUS!` : `+${score}`
    popup.style.left = `${x}px`
    popup.style.top = `${y}px`
    popup.style.color = isBonus ? '#FFD700' : '#00FF7F'
    
    document.body.appendChild(popup)
    this.particles.push(popup)
    
    setTimeout(() => {
      popup.remove()
      this.particles = this.particles.filter(p => p !== popup)
    }, 1500)
  }

  clear() {
    this.particles.forEach(p => p.remove())
    this.confettiPieces.forEach(c => c.remove())
    this.particles = []
    this.confettiPieces = []
  }
}

export const particleSystem = new ParticleSystem()
