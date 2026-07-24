// Three.js Balloon module for CumplePop - Scale-based inflation

let scene, camera, renderer, balloon, balloonGroup
let currentScale = 1
let targetScale = 1
let currentHue = 0.85
let wobbleTime = 0
let isExploding = false
let animationFrameId = null

const BALLOON_CONFIG = {
  initialColor: 0xFF1493,
  segments: 64,
  maxScale: 2.5,
  wobbleSpeed: 2,
  wobbleAmount: 0.02,
  scaleSmoothing: 0.1
}

export function initBalloon() {
  const canvas = document.getElementById('balloon-canvas')
  if (!canvas) return

  scene = new THREE.Scene()
  
  camera = new THREE.PerspectiveCamera(
    60, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000
  )
  camera.position.z = 5
  camera.position.y = 0.3

  renderer = new THREE.WebGLRenderer({ 
    canvas, 
    alpha: true, 
    antialias: true 
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x000000, 0)

  // Create balloon group
  balloonGroup = new THREE.Group()
  scene.add(balloonGroup)

  // Balloon body - elongated sphere
  const geometry = new THREE.SphereGeometry(1, BALLOON_CONFIG.segments, BALLOON_CONFIG.segments)
  
  // Stretch vertically
  const positions = geometry.attributes.position
  for (let i = 0; i < positions.count; i++) {
    const y = positions.getY(i)
    positions.setY(i, y * 1.3)
  }
  geometry.computeVertexNormals()

  const material = new THREE.MeshPhysicalMaterial({
    color: BALLOON_CONFIG.initialColor,
    metalness: 0.1,
    roughness: 0.15,
    transmission: 0.2,
    thickness: 0.5,
    clearcoat: 0.8,
    clearcoatRoughness: 0.1,
    side: THREE.DoubleSide
  })

  balloon = new THREE.Mesh(geometry, material)
  balloonGroup.add(balloon)

  // Knot at bottom
  const knotGeometry = new THREE.ConeGeometry(0.08, 0.15, 16)
  const knotMaterial = new THREE.MeshPhysicalMaterial({
    color: BALLOON_CONFIG.initialColor,
    metalness: 0.1,
    roughness: 0.2
  })
  const knot = new THREE.Mesh(knotGeometry, knotMaterial)
  knot.position.y = -1.35
  knot.rotation.x = Math.PI
  balloonGroup.add(knot)

  // String
  const stringGeometry = new THREE.BufferGeometry()
  const stringPoints = []
  for (let i = 0; i <= 20; i++) {
    const t = i / 20
    stringPoints.push(
      Math.sin(t * Math.PI * 2) * 0.02,
      -1.4 - t * 1.5,
      0
    )
  }
  stringGeometry.setAttribute('position', 
    new THREE.Float32BufferAttribute(stringPoints, 3)
  )
  const stringMaterial = new THREE.LineBasicMaterial({ color: 0xCCCCCC })
  const string = new THREE.Line(stringGeometry, stringMaterial)
  balloonGroup.add(string)

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)

  const mainLight = new THREE.DirectionalLight(0xffffff, 1.2)
  mainLight.position.set(5, 8, 5)
  scene.add(mainLight)

  const fillLight = new THREE.DirectionalLight(0x8888ff, 0.4)
  fillLight.position.set(-5, 3, -5)
  scene.add(fillLight)

  const rimLight = new THREE.PointLight(0xFF1493, 0.6)
  rimLight.position.set(0, 2, 4)
  scene.add(rimLight)

  // Start animation loop
  animate()
}

function animate() {
  animationFrameId = requestAnimationFrame(animate)

  if (!balloon || !balloonGroup) return

  // Smooth scale interpolation
  currentScale += (targetScale - currentScale) * BALLOON_CONFIG.scaleSmoothing
  balloonGroup.scale.set(currentScale, currentScale, currentScale)

  // Wobble effect - increases with size
  wobbleTime += 0.016
  const wobbleIntensity = Math.min((currentScale - 1) * 0.5, 0.15)
  const wobbleX = Math.sin(wobbleTime * BALLOON_CONFIG.wobbleSpeed) * wobbleIntensity
  const wobbleZ = Math.cos(wobbleTime * BALLOON_CONFIG.wobbleSpeed * 0.7) * wobbleIntensity
  balloonGroup.rotation.x = wobbleX
  balloonGroup.rotation.z = wobbleZ

  // Gentle rotation
  balloon.rotation.y += 0.003

  // Color interpolation
  if (balloon.material) {
    balloon.material.color.setHSL(currentHue, 0.9, 0.5)
  }

  // Vibration when close to exploding
  if (currentScale > 2) {
    const vibration = (currentScale - 2) * 0.05
    balloonGroup.position.x = (Math.random() - 0.5) * vibration
    balloonGroup.position.z = (Math.random() - 0.5) * vibration
  }

  renderer.render(scene, camera)
}

// Call this every 100ms from game engine
export function inflateBalloon(progress) {
  if (!balloon || isExploding) return

  // Set target scale based on progress (0 → 1)
  targetScale = 1 + progress * (BALLOON_CONFIG.maxScale - 1)

  // Color changes from pink to red
  currentHue = 0.85 - progress * 0.4

  // Wobble speed increases
  BALLOON_CONFIG.wobbleSpeed = 2 + progress * 6
}

export function explodeBalloon() {
  if (!balloon || isExploding) return

  isExploding = true

  // Create explosion particles
  createExplosionParticles()

  // Flash effect
  if (renderer) {
    renderer.setClearColor(0xFFFFFF, 0.3)
    setTimeout(() => {
      renderer.setClearColor(0x000000, 0)
    }, 100)
  }

  // Animate explosion
  const startScale = balloonGroup.scale.x
  const startTime = Date.now()
  const duration = 300

  function animateExplosion() {
    const elapsed = Date.now() - startTime
    const progress = elapsed / duration

    if (progress < 1) {
      balloonGroup.scale.set(
        startScale * (1 + progress * 0.5),
        startScale * (1 + progress * 0.5),
        startScale * (1 + progress * 0.5)
      )
      balloonGroup.rotation.z += 0.2
      requestAnimationFrame(animateExplosion)
    } else {
      scene.remove(balloonGroup)
      balloon = null
      balloonGroup = null
    }
  }

  animateExplosion()
}

function createExplosionParticles() {
  const particleCount = 80
  const colors = [0xFF1493, 0x00BFFF, 0x00FF7F, 0xFFD700, 0xFF69B4, 0x00FFFF]
  const particles = []

  for (let i = 0; i < particleCount; i++) {
    const geometry = new THREE.SphereGeometry(0.05 + Math.random() * 0.1, 8, 8)
    const material = new THREE.MeshBasicMaterial({ 
      color: colors[Math.floor(Math.random() * colors.length)],
      transparent: true,
      opacity: 1
    })
    const particle = new THREE.Mesh(geometry, material)

    particle.position.set(
      balloonGroup ? balloonGroup.position.x : 0,
      balloonGroup ? balloonGroup.position.y : 0,
      balloonGroup ? balloonGroup.position.z : 0
    )

    particle.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 0.4,
      Math.random() * 0.3 + 0.1,
      (Math.random() - 0.5) * 0.4
    )

    particle.rotationSpeed = new THREE.Vector3(
      (Math.random() - 0.5) * 0.2,
      (Math.random() - 0.5) * 0.2,
      (Math.random() - 0.5) * 0.2
    )

    scene.add(particle)
    particles.push(particle)
  }

  // Animate particles
  const startTime = Date.now()
  const duration = 1500

  function animateParticles() {
    const elapsed = Date.now() - startTime
    const progress = elapsed / duration

    if (progress < 1) {
      particles.forEach(particle => {
        particle.position.add(particle.velocity)
        particle.velocity.y -= 0.008
        particle.rotation.x += particle.rotationSpeed.x
        particle.rotation.y += particle.rotationSpeed.y
        particle.material.opacity = 1 - progress
        particle.scale.setScalar(1 - progress * 0.5)
      })
      requestAnimationFrame(animateParticles)
    } else {
      particles.forEach(p => scene.remove(p))
    }
  }

  animateParticles()
}

export function resetBalloon() {
  isExploding = false
  currentScale = 1
  targetScale = 1
  currentHue = 0.85
  
  if (balloonGroup) {
    scene.remove(balloonGroup)
  }

  initBalloon()
  
  if (balloonGroup) {
    balloonGroup.scale.set(1, 1, 1)
  }
}

export function getBalloonState() {
  return {
    exists: !!balloon,
    scale: currentScale,
    targetScale,
    hue: currentHue,
    isExploding
  }
}

// Handle window resize
if (typeof window !== 'undefined') {
  window.addEventListener('resize', () => {
    if (!camera || !renderer) return
    
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  })
}
