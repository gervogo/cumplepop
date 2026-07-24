# Guía para Agentes de IA — CumplePop

## Visión General

CumplePop es un juego de trivia de cumpleaños con estética Superpop (neón/pastel, stickers, animaciones suaves). El jugador sostiene el móvil (vibración + giroscopio) mientras la TV muestra preguntas con botón "siguiente".

## Arquitectura

- **Frontend:** HTML5 + CSS3 + Vanilla JS + Three.js (CDN)
- **Backend:** Node.js + Express + WebSocket (`ws`)
- **Testing:** Vitest (unit) + Playwright (smoke/E2E)
- **Skills:** Impeccable (design) + HyperFrames (HTML→video)

## Convenciones de Código

### JavaScript
- **Estilo:** ES Modules (`import/export`)
- **Formato:** 2 espacios, sin punto y coma al final
- **Variables:** `camelCase` para variables y funciones
- **Constantes:** `UPPER_SNAKE_CASE`
- **Nombres de archivos:** `kebab-case.js`

### CSS
- **Formato:** 2 espacios
- **Nombres de clases:** `kebab-case`
- **Propiedades:** Ordenar alfabéticamente
- **Variables CSS:** Definir en `:root` en `main.css`

### HTML
- **Indentación:** 2 espacios
- **Atributos:** Un atributo por línea si hay muchos
- **IDs:** `kebab-case` (`#balloon-canvas`, `#timer-fill`)

## Estructura del Proyecto

```
patata-caliente/
├── public/          # Archivos estáticos servidos por Express
│   ├── css/         # Hojas de estilo
│   ├── js/          # JavaScript del cliente
│   ├── assets/      # Imágenes, fuentes, videos
│   └── data/        # JSON de preguntas
├── server/          # Backend Node.js
├── tests/           # Unit + Smoke tests
├── docs/            # Documentación técnica
└── scripts/         # Scripts de utilidad
```

## Flujo de Desarrollo

1. **Nueva feature:** Crear rama `feature/nombre`
2. **Desarrollar:** Implementar con tests
3. **Tests:** Ejecutar `npm run test:all`
4. **PR:** Crear pull request a `develop`
5. **Review:** Revisar + tests pasan
6. **Merge:** Squash merge a `develop`
7. **Release:** `develop` → `main` con tag

## Comandos Útiles

```bash
# Desarrollo
npm run dev              # Iniciar servidor con hot reload

# Testing
npm run test:unit        # Tests unitarios
npm run test:smoke       # Tests E2E
npm run test:all         # Todos los tests

# Building
npm run build            # Build de producción (si aplica)
```

## Reglas Importantes

1. **No commitear** `node_modules/`, `.env`, archivos de video generados
2. **Siempre correr tests** antes de hacer push
3. **Usar branches** — nunca trabajar directamente en `main` o `develop`
4. **Documentar** cambios importantes en el PR description
5. **Separar concerns** — lógica del juego ≠ UI ≠ WebSocket

## Contacto

- **Repo:** [CumplePop en GitHub]
- **Issues:** Usar para bug reports y feature requests
