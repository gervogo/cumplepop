// Three.js Balloon module for CumplePop

let scene, camera, renderer, balloon, particles

export function initBalloon() {
  const canvas = document.getElementById('balloon-canvas')
  
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  
  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // Balloon geometry
  const geometry = new THREE.SphereGeometry(1, 32, 32)
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xFF1493,
    metalness: 0.1,
    roughness: 0.2,
    transmission: 0.3,
    thickness: 0.5
  })
  
  balloon = new THREE.Mesh(geometry, material)
  scene.add(balloon)

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  const pointLight = new THREE.PointLight(0xffffff, 1)
  pointLight.position.set(5, 5, 5)
  scene.add(pointLight)

  camera.position.z = 3

  animate()
}

function animate() {
  requestAnimationFrame(animate)
  
  if (balloon) {
    balloon.rotation.y += 0.005
    balloon.rotation.x += 0.002
  }
  
  renderer.render(scene, camera)
}

export function inflateBalloon(progress) {
  if (!balloon) return
  
  const scale = 1 + progress * 0.5
  balloon.scale.set(scale, scale, scale)
  
  // Color change based on progress
  const hue = 0.9 - progress * 0.3
  balloon.material.color.setHSL(hue, 1, 0.5)
}

export function explodeBalloon() {
  if (!balloon) return
  
  // Create explosion particles
  createExplosionParticles()
  
  // Remove balloon
  scene.remove(balloon)
  balloon = null
}

function createExplosionParticles() {
  const particleCount = 50
  const colors = [0xFF1493, 0x00BFFF, 0x00FF7F, 0xFFD700]
  
  for (let i = 0; i < particleCount; i++) {
    const geometry = new THREE.SphereGeometry(0.1, 8, 8)
    const material = new THREE.MeshBasicMaterial({ 
      color: colors[Math.floor(Math.random() * colors.length)] 
    })
    const particle = new THREE.Mesh(geometry, material)
    
    particle.position.copy(balloon.position)
    particle.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 0.5,
      (Math.random() - 0.5) * 0.5,
      (Math.random() - 0.5) * 0.5
    )
    
    scene.add(particle)
    
    // Animate particle
    setTimeout(() => {
      scene.remove(particle)
    }, 1000)
  }
}

export function resetBalloon() {
  if (balloon) {
    scene.remove(balloon)
  }
  
  const geometry = new THREE.SphereGeometry(1, 32, 32)
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xFF1493,
    metalness: 0.1,
    roughness: 0.2,
    transmission: 0.3,
    thickness: 0.5
  })
  
  balloon = new THREE.Mesh(geometry, material)
  scene.add(balloon)
}

window.addEventListener('resize', () => {
  if (!camera || !renderer) return
  
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})
