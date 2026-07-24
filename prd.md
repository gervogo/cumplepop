# 🎈 CUMPLE POP — Product Requirements Document (PRD)
## Juego de Cultura Pop Milenial Española con Globo 3D Hiperrealista

**Versión:** 1.0  
**Fecha:** 2026-07-24  
**Autor:** Generado por Kimi Chat  
**Stack:** HTML5 + CSS3 + Vanilla JS + Three.js (CDN)

---

## 1. RESUMEN EJECUTIVO

CUMPLE POP es un juego web single-page donde el jugador debe responder 10 preguntas de cultura pop milenial española antes de que un globo 3D hiperrealista explote. El globo se infla progresivamente en un tiempo aleatorio (60–180 segundos), cambia de color, vibra y finalmente estalla en partículas. El globo responde al giroscopio del dispositivo (o al ratón en desktop) con físicas de péndulo suave.

**Estética:** Scrapbook / coquette / Y2K español. Washi tape, flores, corazones, bordes dashed, paleta pastel rosa-amarillo-lila.

---

## 2. OBJETIVOS Y ALCANCE

### 2.1 Objetivos
- Entretener con trivia de cultura pop española de los años 2000.
- Crear tensión mediante el globo que explota como timer visual.
- Ofrecer una experiencia táctil inmersiva con giroscopio.

### 2.2 Alcance (IN)
- Globo 3D hiperrealista con PBR (MeshPhysicalMaterial).
- Físicas de inclinación por giroscopio + ratón fallback.
- 10 preguntas de cultura pop milenial española, barajadas.
- Sistema de puntuación, timer, explosión con partículas.
- Estética scrapbook completa.
- Pantallas: Juego, Victoria, Derrota (explosión).
- Botón reiniciar.

### 2.3 Fuera de alcance (OUT)
- Backend / servidor.
- Base de datos de usuarios.
- Multijugador.
- Sonido (opcional futuro).
- PWA / Service Worker (opcional futuro).

---

## 3. ARQUITECTURA TÉCNICA

### 3.1 Stack
| Capa | Tecnología | Versión |
|------|-----------|---------|
| Renderizado 3D | Three.js | 0.160.0 (CDN) |
| Lógica | Vanilla JavaScript | ES6+ |
| Estilos | CSS3 | Custom Properties + animaciones |
| Fuentes | Google Fonts | Fredoka |
| Hosting | Single HTML file | Autocontenido |

### 3.2 Estructura de archivos (entrega final)
```
/cumple-pop/
├── index.html          # SPA completa (HTML+CSS+JS inline)
├── assets/             # (opcional) si se externalizan recursos
│   └── (vacío — todo inline)
└── README.md
```

> **NOTA:** La versión de entrega es un único archivo `.html` autocontenido. Three.js se carga vía CDN (`https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js`). Todo el CSS y JS va inline dentro del HTML.

### 3.3 Dependencias externas
```html
<script src="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js"></script>
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&display=swap" rel="stylesheet">
```

---

## 4. DISEÑO Y ESTÉTICA

### 4.1 Paleta de colores
| Token | Hex | Uso |
|-------|-----|-----|
| `--pink-primary` | `#E91E63` | Títulos, acentos, botones primarios |
| `--pink-light` | `#FF80AB` | Highlights del globo (inicio) |
| `--pink-pale` | `#FFF0F5` | Fondos, cards |
| `--lilac` | `#F0E6FF` | Gradientes de fondo |
| `--cream` | `#FFFACD` | Gradientes de fondo |
| `--purple-accent` | `#8E24AA` | Botón siguiente |
| `--yellow-accent` | `#FF8F00` | Botón reiniciar |
| `--danger` | `#C62828` | Timer crítico, explosión |
| `--success` | `#2E7D32` | Respuesta correcta |
| `--text-primary` | `#4A4A4A` | Texto de preguntas |
| `--text-secondary` | `#888888` | Subtítulos |

### 4.2 Tipografía
- **Display / Títulos:** Fredoka, 700, letter-spacing: 2px
- **Cuerpo:** Fredoka, 400–600
- **Números:** Fredoka con `font-variant-numeric: tabular-nums`

### 4.3 Decoraciones scrapbook
- **Washi tape:** 4 cintas en esquinas, `repeating-linear-gradient`, rotación ±8°, opacidad 0.55.
- **Flores:** Emojis 🌸🌼🌷🌺💐🌻 posicionados absolutamente, opacidad 0.25, rotaciones aleatorias.
- **Corazones flotantes:** Emojis 💖💜💛 con animación CSS `float` (translateY ±6px, 3s ease-in-out infinite).
- **Bordes dashed:** `#E91E63` o `#CE93D8`, 2px, en tarjetas y barras de progreso.
- **Sombras suaves:** `box-shadow: 0 4px 16px rgba(0,0,0,0.06)`
- **Glassmorphism ligero:** `background: rgba(255,255,255,0.8); backdrop-filter: blur(6px)`

### 4.4 Layout general
```
┌─────────────────────────────────────┐
│  [Washi tape corners]               │
│  🌸                    🌼          │
│  ┌─────────────────────────────┐   │
│  │  🎈 CUMPLE POP              │   │
│  │  responde antes de que...   │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │                             │   │
│  │     [CANVAS THREE.JS]       │   │
│  │      Globo 3D               │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                                     │
│  ⏱️ 120s                          │
│  ━━━━━━━━━━━━━━━━━━━ (barra)      │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ ✿ Pregunta aquí...          │   │
│  │ [_____] [Validar] [Siguiente]│   │
│  │ ¡Correcto! 🎉               │   │
│  └─────────────────────────────┘   │
│                                     │
│  ⭐ Aciertos: 0    📋 Preg: 1/10 │
│                                     │
│  💐                    🌻          │
└─────────────────────────────────────┘
```

---

## 5. EL GLOBO 3D — ESPECIFICACIÓN TÉCNICA COMPLETA

### 5.1 Geometría
```javascript
// Esfera de alta resolución para silueta suave
const balloonGeo = new THREE.SphereGeometry(1, 128, 128);
```

### 5.2 Material PBR (MeshPhysicalMaterial)
```javascript
const balloonMat = new THREE.MeshPhysicalMaterial({
  color: 0xFF3366,              // Rosa inicial
  roughness: 0.18,              // Superficie lisa de látex
  metalness: 0.0,               // No metálico
  clearcoat: 1.0,               // Capa brillante superficial
  clearcoatRoughness: 0.08,     // Muy pulida
  sheen: 1.0,                   // Brillo tipo tela/látex
  sheenRoughness: 0.3,
  sheenColor: new THREE.Color(0xFF80AB),
  transmission: 0.08,           // Ligera translucidez
  thickness: 0.5,
  ior: 1.45,                    // Índice de refracción del látex
  specularIntensity: 1.2,
  envMapIntensity: 1.0,
  side: THREE.DoubleSide
});
```

### 5.3 Sistema de iluminación
| Luz | Tipo | Color | Intensidad | Posición | Sombra |
|-----|------|-------|-----------|----------|--------|
| Ambient | AmbientLight | `#FFE4EC` | 0.6 | — | No |
| Key | DirectionalLight | `#FFF0E0` | 2.0 | (3, 5, 4) | Sí, 2048×2048, radius 4 |
| Fill | DirectionalLight | `#E0F0FF` | 0.8 | (-4, 2, 3) | No |
| Rim | DirectionalLight | `#FFFFFF` | 1.2 | (0, 3, -5) | No |
| Point | PointLight | `#FF80AB` | 1.5 | (-1.5, 1, 2) | No |

**Renderer settings:**
- `antialias: true`
- `shadowMap.enabled: true`
- `shadowMap.type: THREE.PCFSoftShadowMap`
- `toneMapping: THREE.ACESFilmicToneMapping`
- `toneMappingExposure: 1.1`
- `outputColorSpace: THREE.SRGBColorSpace`

### 5.4 Environment Map (procedural)
Crear una escena auxiliar con 2 DirectionalLights y generar PMREM:
```javascript
const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();
const envScene = new THREE.Scene();
envScene.background = new THREE.Color(0xFFF0F5);
// + 2 luces direccionales
const envEnvMap = pmremGenerator.fromScene(envScene, 0.04).texture;
scene.environment = envEnvMap;
```

### 5.5 Cuello y nudo
```javascript
// Cuello
const neckGeo = new THREE.CylinderGeometry(0.12, 0.18, 0.35, 32);
const neckMat = new THREE.MeshPhysicalMaterial({
  color: 0xCC1144, roughness: 0.25, clearcoat: 0.8, clearcoatRoughness: 0.15
});
const neck = new THREE.Mesh(neckGeo, neckMat);
neck.position.y = -1.05;

// Nudo
const knotGeo = new THREE.SphereGeometry(0.1, 16, 16);
const knot = new THREE.Mesh(knotGeo, neckMat);
knot.position.y = -1.25;
knot.scale.set(1.3, 0.7, 1.3);
```

### 5.6 Cuerda (dinámica)
La cuerda se regenera cada frame como una curva Catmull-Rom que cuelga del nudo:
```javascript
function updateString() {
  // Obtener posición mundial del nudo
  const knotWorld = new THREE.Vector3(0, -1.3, 0);
  knotWorld.applyMatrix4(balloon.matrixWorld);

  const points = [];
  const segments = 20;
  const stringLen = 2.5;
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const swayX = Math.sin(t * 3 + Date.now() * 0.002) * 0.05 * t;
    const swayZ = Math.cos(t * 2.5 + Date.now() * 0.0015) * 0.05 * t;
    const x = knotWorld.x * (1 - t * 0.3) + swayX;
    const y = knotWorld.y - t * stringLen;
    const z = knotWorld.z * (1 - t * 0.3) + swayZ;
    points.push(new THREE.Vector3(x, y, z));
  }
  const curve = new THREE.CatmullRomCurve3(points);
  const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.012, 8, false);
  // Material: color #DDDDDD, roughness 0.4, metalness 0.1, clearcoat 0.3
}
```
> **Optimización:** Reutilizar geometría/mesh si es posible, o destruir/recrear. Para 60fps, considerar buffer geometry manual en lugar de TubeGeometry.

### 5.7 Inflado progresivo
```javascript
function getInflationScale() {
  const progress = 1 - (timeLeft / TOTAL_TIME);
  const base = 0.35;
  const max = 1.15;
  return base + (max - base) * progress;
}

function getBalloonColor() {
  const progress = 1 - (timeLeft / TOTAL_TIME);
  const c1 = new THREE.Color(0xFF3366); // pink
  const c2 = new THREE.Color(0xFF0000); // red
  const c3 = new THREE.Color(0x880000); // dark red
  if (progress < 0.5) return c1.clone().lerp(c2, progress * 2);
  else return c2.clone().lerp(c3, (progress - 0.5) * 2);
}
```

### 5.8 Squash & Stretch
Según la escala de inflado:
```javascript
const stretch = 1 + (scale - 0.35) * 0.03;
const squash = 1 - (scale - 0.35) * 0.02;
balloon.scale.y *= stretch;
balloon.scale.x *= squash;
balloon.scale.z *= squash;
```

### 5.9 Sistema de partículas (explosión)
- **Cantidad:** 300 partículas
- **Geometría:** `THREE.BufferGeometry` con atributos `position`, `color`, `size`
- **Material:** `THREE.PointsMaterial` con `AdditiveBlending`, `transparent: true`, `depthWrite: false`
- **Física por partícula:** velocidad inicial radial aleatoria, gravedad (-3.0 y/s²), fricción (0.985), vida decreciente, tamaño decreciente.
- **Paleta de colores:** `#FF1744`, `#FF5252`, `#FF80AB`, `#F50057`, `#FFEB3B`, `#FFFFFF`, `#E91E63`
- **Flash:** Overlay blanco con `opacity: 0 → 0.6 → 0` en 150ms al explotar.

---

## 6. FÍSICAS DEL GLOBO

### 6.1 Variables de estado
```javascript
const physics = {
  targetTiltX: 0,      // Objetivo de inclinación X (del giroscopio/ratón)
  targetTiltZ: 0,      // Objetivo de inclinación Z
  currentTiltX: 0,     // Inclinación actual (suavizada)
  currentTiltZ: 0,
  floatPhase: 0,       // Fase de la oscilación vertical
  floatSpeed: 1.2,     // Velocidad de flotación
  floatAmp: 0.15,      // Amplitud de flotación (unidades Three.js)
  baseY: 0,            // Posición Y base
  velX: 0,             // Velocidad angular X
  velZ: 0,             // Velocidad angular Z
  damping: 0.92,       // Amortiguación
  spring: 0.04,        // Constante del resorte
  maxTilt: 0.6         // Máxima inclinación en radianes
};
```

### 6.2 Algoritmo de integración (por frame)
```javascript
// 1. Aplicar fuerza de resorte hacia el target
const ax = (physics.targetTiltX - physics.currentTiltX) * physics.spring;
const az = (physics.targetTiltZ - physics.currentTiltZ) * physics.spring;

// 2. Integrar velocidad
physics.velX += ax;
physics.velZ += az;

// 3. Aplicar amortiguación
physics.velX *= physics.damping;
physics.velZ *= physics.damping;

// 4. Actualizar posición angular
physics.currentTiltX += physics.velX;
physics.currentTiltZ += physics.velZ;

// 5. Aplicar rotación al mesh
balloon.rotation.x = physics.currentTiltX;
balloon.rotation.z = physics.currentTiltZ;

// 6. Flotación vertical
physics.floatPhase += dt * physics.floatSpeed;
balloon.position.y = physics.baseY + Math.sin(physics.floatPhase) * physics.floatAmp;

// 7. Deriva lateral por inclinación
balloon.position.x = physics.currentTiltZ * 0.5;
balloon.position.z = -physics.currentTiltX * 0.3;
```

### 6.3 Vibración pre-explosión
Cuando `progress > 0.75`:
```javascript
const wobble = (progress - 0.75) / 0.25;
balloon.rotation.x += Math.sin(now * 0.02) * wobble * 0.08;
balloon.rotation.z += Math.cos(now * 0.015) * wobble * 0.08;
```

---

## 7. GIROSCOPIO Y CONTROLES

### 7.1 Evento deviceorientation
```javascript
function handleOrientation(e) {
  if (!gyroActive) return;
  const beta = THREE.MathUtils.clamp(e.beta || 0, -45, 45);   // front-back
  const gamma = THREE.MathUtils.clamp(e.gamma || 0, -45, 45); // left-right
  physics.targetTiltX = (beta / 45) * physics.maxTilt;
  physics.targetTiltZ = (gamma / 45) * physics.maxTilt;
}
```

### 7.2 Permisos iOS 13+
```javascript
if (typeof DeviceOrientationEvent.requestPermission === 'function') {
  DeviceOrientationEvent.requestPermission().then(state => {
    if (state === 'granted') {
      window.addEventListener('deviceorientation', handleOrientation);
    }
  });
} else {
  // Android / desktop: auto-activar
  window.addEventListener('deviceorientation', handleOrientation);
}
```

### 7.3 Fallback ratón (desktop)
```javascript
document.addEventListener('mousemove', (e) => {
  if (gyroActive) return;
  const nx = (e.clientX / window.innerWidth) * 2 - 1;
  const ny = -(e.clientY / window.innerHeight) * 2 + 1;
  physics.targetTiltZ = nx * physics.maxTilt;
  physics.targetTiltX = ny * physics.maxTilt * 0.5;
});
```

### 7.4 Estados del sensor (UI)
| Estado | Badge | Color |
|--------|-------|-------|
| Esperando | "Esperando sensor…" | Gris |
| Activo (giroscopio) | "Giroscopio activo" | Verde |
| Activo (ratón) | "Modo ratón activo" | Verde |
| Explosión | "💥 ¡BOOM!" | Rojo |

---

## 8. SISTEMA DE PREGUNTAS

### 8.1 Estructura de datos
```javascript
const questions = [
  { q: "¿En qué año se estrenó la serie 'Aquí no hay quien viva'?", a: 2003 },
  { q: "¿Cuántas temporadas tuvo 'Física o Química'?", a: 7 },
  { q: "¿En qué año se estrenó 'Operación Triunfo' (OT1) en España?", a: 2001 },
  { q: "¿Cuántos miembros tenía el grupo original Hombres G?", a: 4 },
  { q: "¿En qué año falleció Rocío Jurado?", a: 2006 },
  { q: "¿Cuántos discos de estudio publicó Mecano?", a: 7 },
  { q: "¿En qué año se estrenó la película 'El Orfanato'?", a: 2007 },
  { q: "¿En qué año empezó la serie 'Cuéntame cómo pasó'?", a: 2001 },
  { q: "¿Cuántas películas hay de la saga 'Torrente'?", a: 5 },
  { q: "¿En qué año se estrenó 'Los Serrano'?", a: 2003 }
];
```

### 8.2 Barajado (Fisher-Yates)
```javascript
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
```

### 8.3 Flujo de una pregunta
```
[Mostrar pregunta] → [Jugador escribe número] → [Pulsa Validar]
    ↓
┌──────────────┐    ┌──────────────┐
│  CORRECTO    │    │  INCORRECTO  │
│  +1 punto    │    │  Reintentar  │
│  Mostrar     │    │  Borrar      │
│  "Siguiente" │    │  input       │
└──────────────┘    └──────────────┘
```

### 8.4 Reglas
- Solo respuestas numéricas enteras (type="number").
- No hay límite de intentos por pregunta.
- Al acertar, el input se deshabilita y aparece botón "Siguiente".
- Al fallar, se borra el input y se enfoca automáticamente.
- Tecla Enter valida (si no respondida) o pasa a siguiente (si ya respondida).

---

## 9. ESTADOS DEL JUEGO Y MÁQUINA DE ESTADOS

### 9.1 Estados
```
┌─────────────┐
│   INIT      │ ← Carga, barajar preguntas, resetear timer
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐
│   PLAYING   │────→│  EXPLODED   │ (timeLeft <= 0)
│  (pregunta) │     │  (derrota)  │
└──────┬──────┘     └─────────────┘
       │
       │ todas respondidas
       ▼
┌─────────────┐
│   VICTORY   │ (respondió las 10 antes de explotar)
└─────────────┘
```

### 9.2 Estado del juego (gameState)
```javascript
let gameState = {
  totalTime: 0,        // 60–180s, aleatorio por partida
  timeLeft: 0,
  score: 0,            // 0–10
  currentQ: 0,         // índice 0–9
  qOrder: [],          // array de índices barajados
  exploded: false,
  answered: false,     // ¿la pregunta actual ya fue acertada?
  particles: []          // partículas de explosión (Three.js)
};
```

---

## 10. PANTALLAS Y COMPONENTES UI

### 10.1 Pantalla de Juego (principal)
- **Canvas Three.js:** Ocupa el centro, ~400×260px (responsive).
- **Timer:** Texto "⏱️ 120s" + barra de progreso con gradiente.
  - >50% tiempo: gradiente rosa→rojo
  - 10–30s: gradiente naranja→rojo
  - ≤10s: gradiente rojo→rojo oscuro
- **Tarjeta de pregunta:** Fondo blanco translúcido, borde dashed lila, emoji ✿ decorativo.
- **Input + botones:** Input numérico centrado, botón Validar (rosa), botón Siguiente (morado, oculto por defecto).
- **Feedback:** Texto debajo del input. Verde para correcto, rojo para incorrecto.
- **Score pills:** "⭐ Aciertos: X" y "📋 Pregunta: Y/10".

### 10.2 Pantalla de Victoria
- Overlay con fondo `rgba(255,240,245,0.92)`
- Emoji: 🎉🏆🎉
- Título: "¡VICTORIA!"
- Subtítulo: "¡Respondiste todas las preguntas antes de que explotara! 🎈✨"
- Puntuación final: "Aciertos: X / 10"
- Botón: "🔄 Jugar otra vez"

### 10.3 Pantalla de Derrota (explosión)
- Overlay con fondo `rgba(255,240,245,0.92)`
- Emoji: 💥🎈💥
- Título: "¡EL GLOBO EXPLOTÓ!"
- Subtítulo: "Se acabó el tiempo..."
- Puntuación final: "Aciertos: X / 10"
- Mensaje motivacional según puntuación:
  - ≥8: "¡Eres un auténtico milenial español! 🏆"
  - 5–7: "¡Bien jugado! Nivel fan de los 2000 📺"
  - 2–4: "Necesitas ver más tele de los 2000 😅"
  - 0–1: "¿Seguro que viviste los 2000? 🤔"
- Botón: "🔄 Jugar otra vez"

### 10.4 Overlay de permisos (iOS)
- Fondo: `rgba(255,240,245,0.92)`
- Título: "🎈 CUMPLE POP"
- Texto: explicación del giroscopio
- Botón: "📱 Activar giroscopio"
- Nota: "En ordenador, mueve el ratón para inclinar el globo."

---

## 11. TIMER Y PROGRESO

### 11.1 Configuración
```javascript
gameState.totalTime = Math.floor(Math.random() * 121) + 60; // 60–180s
```

### 11.2 Actualización
- Intervalo: 1 segundo (setInterval).
- Decremento: `timeLeft--` cada segundo.
- Barra de progreso: `width = (timeLeft / totalTime) * 100%`
- Transición CSS: `width 1s linear`

### 11.3 Efectos visuales del timer
| Tiempo restante | Color barra | Color texto | Efecto globo |
|-----------------|-------------|-------------|--------------|
| > 30s | Rosa→Rojo | `#E91E63` | Normal |
| 10–30s | Naranja→Rojo | `#E65100` | Normal |
| ≤ 10s | Rojo→Rojo oscuro | `#C62828` | Vibración intensa |

---

## 12. ANIMACIONES Y TRANSICIONES

### 12.1 CSS
```css
/* Flotación de corazones */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

/* Transición de la barra de timer */
.timer-fill { transition: width 1s linear; }

/* Botón hover/active */
.btn { transition: transform 0.15s, box-shadow 0.15s; }
.btn:active { transform: scale(0.96); }

/* Flash de explosión */
.flash { transition: opacity 0.1s; }
.flash.bang { opacity: 0.6; }
```

### 12.2 Three.js (requestAnimationFrame)
- **Frecuencia:** 60fps objetivo.
- **Delta time:** `dt = min((now - lastTime) / 1000, 0.05)` para evitar saltos.
- **Orden por frame:**
  1. Actualizar timer
  2. Calcular escala de inflado
  3. Aplicar físicas (resorte + amortiguación)
  4. Aplicar flotación
  5. Aplicar squash & stretch
  6. Aplicar vibración pre-explosión
  7. Actualizar cuerda
  8. Actualizar partículas (si hay)
  9. Renderizar

---

## 13. RESPONSIVE DESIGN

### 13.1 Breakpoints
| Breakpoint | Ancho | Ajustes |
|-----------|-------|---------|
| Mobile | < 480px | Canvas 100% ancho, fuentes reducidas, botones apilados |
| Tablet | 480–768px | Canvas 400px, layout compacto |
| Desktop | > 768px | Canvas 400px, layout centrado con max-width 520px |

### 13.2 Canvas Three.js
```css
#balloonCanvas {
  width: 100%;
  max-width: 400px;
  height: 260px;
}
```
La cámara Three.js se ajusta al resize:
```javascript
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
```

---

## 14. PERFORMANCE

### 14.1 Targets
- **FPS:** ≥ 55 en móviles modernos, ≥ 60 en desktop.
- **Tiempo de carga:** < 3s en 4G.
- **Memoria:** < 100MB heap.

### 14.2 Optimizaciones
- Geometría de globo: 128×128 segmentos (balance calidad/performance).
- Shadow map: 2048×2048 con `radius: 4` para suavizado.
- Partículas: BufferGeometry con atributos, no instanciación.
- Cuerda: Considerar simplificar a `Line` en lugar de `TubeGeometry` si hay caídas de FPS.
- `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))` para evitar sobrecarga en pantallas 3x.

---

## 15. ACCESIBILIDAD

- Input numérico con `type="number"` para teclado numérico en móvil.
- Labels implícitos en botones (emojis + texto).
- Contraste mínimo 4.5:1 para texto principal.
- Focus visible en input (`outline` + `border-color` cambio).
- `autocomplete="off"` en input para evitar sugerencias.

---

## 16. EDGE CASES Y MANEJO DE ERRORES

| Escenario | Comportamiento |
|-----------|---------------|
| Giroscopio no disponible | Fallback automático a ratón. Badge indica "Modo ratón activo". |
| iOS deniega permiso | Mostrar badge "Permiso denegado", seguir con ratón. |
| Input vacío al validar | Feedback: "Escribe un número primero ✏️" |
| Input no numérico | HTML `type="number"` lo previene nativamente |
| Jugador responde las 10 antes de tiempo | Victoria inmediata, overlay de victoria. |
| Timer llega a 0 mientras respondiendo | Explosión inmediata, overlay de derrota. |
| Resize de ventana | Canvas y cámara se reajustan automáticamente. |
| Pestaña en background | Timer sigue corriendo (setInterval). Considerar Page Visibility API para pausar (opcional). |

---

## 17. CHECKLIST DE IMPLEMENTACIÓN

### Fase 1: Estructura base
- [ ] HTML5 boilerplate con meta viewport
- [ ] Cargar Three.js CDN + Google Fonts
- [ ] Layout CSS con estética scrapbook
- [ ] Canvas Three.js integrado en layout

### Fase 2: Globo 3D
- [ ] Escena, cámara, renderer configurados
- [ ] Iluminación completa (4 luces + ambient)
- [ ] Environment map procedural (PMREM)
- [ ] Geometría esfera + material PBR
- [ ] Cuello + nudo
- [ ] Cuerda dinámica (Catmull-Rom)
- [ ] Sistema de partículas para explosión

### Fase 3: Físicas
- [ ] Integración de resorte-amortiguador
- [ ] Flotación sinusoidal
- [ ] Squash & stretch
- [ ] Vibración pre-explosión
- [ ] Giroscopio (deviceorientation)
- [ ] Fallback ratón
- [ ] Permisos iOS

### Fase 4: Juego
- [ ] Banco de 10 preguntas
- [ ] Sistema de barajado
- [ ] Timer aleatorio (60–180s)
- [ ] Barra de progreso visual
- [ ] Validación de respuestas
- [ ] Puntuación
- [ ] Pantallas de victoria/derrota
- [ ] Botón reiniciar

### Fase 5: Polish
- [ ] Decoraciones scrapbook (washi tape, flores, corazones)
- [ ] Animaciones CSS
- [ ] Responsive
- [ ] Performance testing en móvil
- [ ] Test de giroscopio en iOS y Android

---

## 18. GLOSARIO

| Término | Definición |
|---------|-----------|
| **PBR** | Physically Based Rendering — renderizado basado en propiedades físicas reales de materiales. |
| **PMREM** | Prefiltered Mipmapped Radiance Environment Map — técnica para generar environment maps en tiempo real. |
| **Clearcoat** | Capa transparente brillante sobre el material (como barniz). |
| **Sheen** | Brillo difuso en ángulos rasante, típico de telas y látex. |
| **Squash & Stretch** | Principio de animación: deformación elástica según movimiento. |
| **Washi tape** | Cinta adhesiva decorativa japonesa, estética scrapbook. |
| **Coquette** | Estética romántica, delicada, con flores y tonos pastel. |

---

## 19. APÉNDICE: CÓDIGO DE REFERENCIA COMPLETO

> Este PRD describe una aplicación que se implementa en un único archivo `index.html`. Todo el código CSS y JavaScript va inline. Three.js se carga desde CDN.

### 19.1 Orden de carga en el HTML
```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
  <title>🎈 CUMPLE POP</title>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&display=swap" rel="stylesheet">
  <style>/* TODO: Todo el CSS */</style>
  <script src="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js"></script>
</head>
<body>
  <!-- TODO: Todo el HTML de la UI -->
  <script>
    // TODO: Todo el JavaScript
  </script>
</body>
</html>
```

### 19.2 Estructura del script JS
```javascript
// 1. CONFIGURACIÓN
const questions = [/* 10 preguntas */];
const TOTAL_TIME_MIN = 60;
const TOTAL_TIME_MAX = 180;

// 2. ESTADO
gameState = { /* ver sección 9.2 */ };
physics = { /* ver sección 6.1 */ };

// 3. THREE.JS — Setup
// scene, camera, renderer, lights, envMap, balloon mesh, neck, knot

// 4. THREE.JS — Animation loop
// requestAnimationFrame → updateTimer → updatePhysics → updateBalloon → updateString → render

// 5. GIROSCOPIO
// handleOrientation, requestPermission, mouse fallback

// 6. JUEGO
// initGame, showQuestion, validateAnswer, nextQuestion, explodeBalloon, restart

// 7. EVENT LISTENERS
// validateBtn, nextBtn, restartBtn, answerInput keydown, window resize

// 8. INICIO
initGame();
```

---

*Fin del documento.*
