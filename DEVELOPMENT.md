# Guía de Desarrollo — CumplePop

## Requisitos Previos

- Node.js ≥ 18 (recomendado: 22+)
- npm o yarn
- Git
- Homebrew (macOS)
- gh CLI (GitHub CLI)

## Instalación

```bash
# 1. Clonar el repo
git clone https://github.com/USUARIO/cumplepop.git
cd cumplepop

# 2. Instalar dependencias
npm install

# 3. Instalar Playwright browsers
npx playwright install chromium

# 4. Copiar preguntas de ejemplo
npm run convert-questions

# 5. Iniciar servidor de desarrollo
npm run dev
```

El juego estará disponible en `http://localhost:3000`

## Estructura de Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor con hot reload |
| `npm run build` | Build de producción |
| `npm run start` | Iniciar en modo producción |
| `npm run test:unit` | Ejecutar tests unitarios |
| `npm run test:smoke` | Ejecutar tests E2E |
| `npm run test:all` | Ejecutar todos los tests |
| `npm run test:coverage` | Tests con cobertura de código |
| `npm run convert-questions` | Convertir preguntas .md → .json |

## Flujo de Trabajo

### 1. Crear Feature Branch

```bash
git checkout develop
git pull origin develop
git checkout -b feature/nombre-feature
```

### 2. Desarrollar

- Escribir código siguiendo convenciones (ver AGENTS.md)
- Agregar tests unitarios para lógica nueva
- Verificar que no se rompan tests existentes

### 3. Testear

```bash
npm run test:unit      # Unit tests
npm run test:smoke     # E2E tests
```

### 4. Commit

```bash
git add .
git commit -m "feat: descripción corta del cambio"
```

Convención de commits:
- `feat:` nueva funcionalidad
- `fix:` corrección de bug
- `docs:` documentación
- `test:` tests
- `refactor:` refactoring sin cambio de funcionalidad
- `style:` formato de código
- `chore:` tareas de mantenimiento

### 5. Push y PR

```bash
git push origin feature/nombre-feature
```

Crear PR en GitHub:
- **Base:** `develop`
- **Compare:** `feature/nombre-feature`
- **Title:** Descripción clara del cambio
- **Description:** Qué cambió, por qué, cómo probar

### 6. Review y Merge

- Esperar a que pasen todos los tests (CI)
- Revisar código
- Squash merge a `develop`

## Ambientes

| Ambiente | URL | Descripción |
|----------|-----|-------------|
| Development | localhost:3000 | Local, hot reload |
| Staging | [pendiente] | Para testing antes de producción |
| Production | [pendiente] | Juego final |

## Debugging

### Chrome DevTools
- Abrir DevTools (F12)
- Pestaña Console: errores de JS
- Pestaña Network: requests WebSocket
- Pestaña Application: localStorage

### WebSocket
```javascript
// En consola del navegador
const ws = new WebSocket('ws://localhost:3000')
ws.onmessage = (e) => console.log(JSON.parse(e.data))
```

### Three.js
```javascript
// En consola
window.scene  // Acceder a la escena
window.camera // Acceder a la cámara
```

## Performance

- **FPS objetivo:** ≥ 30 FPS en móvil
- **Load time:** < 3 segundos
- **Bundle size:** < 500KB total (sin CDN)

## Troubleshooting

| Problema | Solución |
|----------|----------|
| `EADDRINUSE` | Cambiar puerto en `.env` o matar proceso |
| Canvas negro | Verificar WebGL soportado |
| WebSocket no conecta | Verificar CORS y puerto |
| Tests fallan | Verificar que el servidor esté corriendo |
