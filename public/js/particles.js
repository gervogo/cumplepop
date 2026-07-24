// Particles module for CumplePop

export class ParticleSystem {
  constructor() {
    this.particles = []
  }

  createExplosion(x, y, count = 30) {
    const colors = ['#FF1493', '#00BFFF', '#00FF7F', '#FFD700', '#FF69B4']
    
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div')
      particle.className = 'particle'
      particle.style.left = `${x}px`
      particle.style.top = `${y}px`
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
      
      const angle = (Math.PI * 2 * i) / count
      const velocity = 50 + Math.random() * 100
      const tx = Math.cos(angle) * velocity
      const ty = Math.sin(angle) * velocity
      
      particle.style.setProperty('--tx', `${tx}px`)
      particle.style.setProperty('--ty', `${ty}px`)
      
      document.body.appendChild(particle)
      this.particles.push(particle)
      
      setTimeout(() => {
        particle.remove()
        this.particles = this.particles.filter(p => p !== particle)
      }, 1000)
    }
  }

  clear() {
    this.particles.forEach(p => p.remove())
    this.particles = []
  }
}

export const particleSystem = new ParticleSystem()
