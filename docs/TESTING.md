# Guía de Testing — CumplePop

## Stack de Testing

| Capa | Herramienta | Propósito |
|------|------------|-----------|
| Unit | Vitest | Lógica pura: shuffle, scoring, states |
| Smoke/E2E | Playwright | Flujos de usuario en browser real |
| Visual | Playwright screenshots | Regression visual (futuro) |
| Performance | Playwright metrics | FPS, memory, load time |

## Instalación

```bash
npm install
npx playwright install chromium
```

## Ejecutar Tests

```bash
# Unit tests
npm run test:unit

# Unit tests en watch mode
npm run test:unit:watch

# Smoke tests
npm run test:smoke

# Smoke tests con UI
npm run test:smoke:ui

# Todos los tests
npm run test:all

# Con cobertura
npm run test:coverage
```

## Estructura de Tests

```
tests/
├── unit/                    # Tests unitarios
│   ├── questions.test.js    # Banco de preguntas
│   ├── game-engine.test.js  # Máquina de estados
│   ├── protocol.test.js     # WebSocket protocol
│   └── utils.test.js        # Helpers
│
├── smoke/                   # Smoke tests (E2E)
│   ├── game-load.spec.ts    # Página carga sin errores
│   ├── balloon-render.spec.ts # Canvas Three.js aparece
│   ├── question-flow.spec.ts # Flujo de preguntas
│   ├── timer-countdown.spec.ts # Timer decrementa
│   ├── explosion.spec.ts    # Explosión al llegar a 0
│   ├── victory.spec.ts      # Victoria al responder 10
│   └── mobile-tv-sync.spec.ts # WebSocket sync
│
└── visual/                  # Visual regression (futuro)
    └── screenshots/
```

## Tests Unitarios

### Archivos de ejemplo

**`tests/unit/questions.test.js`**
```javascript
import { describe, it, expect } from 'vitest'
import { shuffle, selectQuestions, validateAnswer } from '../../public/js/questions.js'

describe('shuffle', () => {
  it('baraja sin perder elementos', () => {
    const arr = [1,2,3,4,5]
    const shuffled = shuffle([...arr])
    expect(shuffled.sort()).toEqual(arr.sort())
  })
  
  it('no muta el array original', () => {
    const arr = [1,2,3]
    const original = [...arr]
    shuffle(arr)
    expect(arr).toEqual(original)
  })
})

describe('validateAnswer', () => {
  it('acepta respuesta correcta', () => {
    expect(validateAnswer(2003, 2003)).toBe(true)
  })
  
  it('rechaza respuesta incorrecta', () => {
    expect(validateAnswer(2003, 2004)).toBe(false)
  })
})
```

## Smoke Tests (E2E)

### Archivos de ejemplo

**`tests/smoke/game-load.spec.ts`**
```typescript
import { test, expect } from '@playwright/test'

test('la página carga sin errores de consola', async ({ page }) => {
  const errors = []
  page.on('pageerror', e => errors.push(e.message))
  page.on('console', msg => { 
    if (msg.type() === 'error') errors.push(msg.text()) 
  })
  
  await page.goto('/')
  await expect(page).toHaveTitle(/CumplePop/)
  await expect(errors).toEqual([])
})

test('el canvas de Three.js aparece', async ({ page }) => {
  await page.goto('/')
  const canvas = page.locator('canvas')
  await expect(canvas).toBeVisible({ timeout: 10000 })
})

test('el timer muestra segundos', async ({ page }) => {
  await page.goto('/')
  const timer = page.locator('#timer-text')
  await expect(timer).toBeVisible()
  const text = await timer.textContent()
  expect(text).toMatch(/\d+s/)
})
```

**`tests/smoke/question-flow.spec.ts`**
```typescript
import { test, expect } from '@playwright/test'

test('flujo completo: pregunta → validar → siguiente', async ({ page }) => {
  await page.goto('/')
  
  // Esperar a que aparezca la pregunta
  const question = page.locator('#question-text')
  await expect(question).toBeVisible({ timeout: 10000 })
  
  // Seleccionar una opción
  const option = page.locator('.option-btn').first()
  await option.click()
  
  // Click en validar
  const validateBtn = page.locator('#btn-validate')
  await validateBtn.click()
  
  // Verificar que aparece el resultado
  const result = page.locator('.answer-result')
  await expect(result).toBeVisible()
})
```

## Performance Testing

**`tests/smoke/performance.spec.ts`**
```typescript
import { test, expect } from '@playwright/test'

test('el juego carga en menos de 3 segundos', async ({ page }) => {
  const start = Date.now()
  await page.goto('/')
  await page.waitForSelector('canvas')
  const loadTime = Date.now() - start
  expect(loadTime).toBeLessThan(3000)
})

test('el canvas mantiene FPS acceptable', async ({ page }) => {
  await page.goto('/')
  await page.waitForTimeout(2000)
  
  const fps = await page.evaluate(() => {
    return new Promise(resolve => {
      let frames = 0
      const start = performance.now()
      function count() {
        frames++
        if (performance.now() - start < 1000) {
          requestAnimationFrame(count)
        } else {
          resolve(frames)
        }
      }
      requestAnimationFrame(count)
    })
  })
  
  expect(fps).toBeGreaterThan(30)
})
```

## Testing de WebSocket

**`tests/smoke/websocket-sync.spec.ts`**
```typescript
import { test, expect } from '@playwright/test'

test('mobile y tv se conectan y sincronizan', async ({ browser }) => {
  const mobileContext = await browser.newContext()
  const tvContext = await browser.newContext()
  
  const mobile = await mobileContext.newPage()
  const tv = await tvContext.newPage()
  
  await mobile.goto('/mobile.html')
  await tv.goto('/tv.html')
  
  // Ambas pantallas muestran estado de conexión
  await expect(mobile.locator('#connection-status')).toContainText('Conectado')
  await expect(tv.locator('#connection-status')).toContainText('Conectado')
  
  await mobileContext.close()
  await tvContext.close()
})
```

## CI/CD

### GitHub Actions

```yaml
# .github/workflows/smoke-test.yml
name: Smoke Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '22'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium
        
      - name: Run unit tests
        run: npm run test:unit
        
      - name: Run smoke tests
        run: npm run test:smoke
        
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

## Troubleshooting

| Problema | Solución |
|----------|----------|
| Tests no encuentran archivos | Verificar paths en `vitest.config.ts` y `playwright.config.ts` |
| Playwright falla al conectar | Asegurar que el servidor esté corriendo |
| Canvas no aparece | Verificar que Three.js esté cargado |
| WebSocket timeout | Verificar CORS y puerto |
| Flaky tests | Agregar `waitFor` o aumentar timeout |
