# CumplePop 🎈

Juego de trivia de cumpleaños con estética Superpop — neón/pastel, stickers, animaciones suaves.

## Concepto

Un jugador sostiene el móvil (vibración + giroscopio) mientras la TV muestra preguntas con un botón "siguiente". Un globo/patata 3D se infla peligrosamente hasta explotar cuando se acaba el tiempo.

## Features

- 🎈 Globo 3D que se infla y explota (Three.js)
- 📱 Control por giroscopio y vibración
- 🖥️ Pantalla dual: móvil + TV
- ⏱️ Timer global que se acelera
- 🎨 Estética Superpop: neón, pastel, stickers
- 🎬 Intro animada (HyperFrames)
- 💥 Sistema de partículas
- 🏆 Sistema de scoring

## Quick Start

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Abrir en navegador
open http://localhost:3000
```

## Tech Stack

| Componente | Tecnología |
|------------|-----------|
| Frontend | HTML5 + CSS3 + Vanilla JS |
| 3D Engine | Three.js (CDN) |
| Backend | Node.js + Express |
| WebSocket | ws |
| Testing | Vitest + Playwright |
| Skills | Impeccable + HyperFrames |

## Estructura

```
patata-caliente/
├── public/          # Frontend estático
│   ├── css/         # Estilos
│   ├── js/          # Lógica del juego
│   ├── assets/      # Imágenes, fuentes, videos
│   └── data/        # Preguntas JSON
├── server/          # Backend
├── tests/           # Tests
├── docs/            # Documentación
└── scripts/         # Utilidades
```

## Desarrollo

Ver [DEVELOPMENT.md](./DEVELOPMENT.md) para guía completa.

```bash
npm run dev          # Servidor con hot reload
npm run test:all     # Ejecutar todos los tests
npm run build        # Build de producción
```

## Documentación

- [AGENTS.md](./AGENTS.md) — Guía para agentes de IA
- [DEVELOPMENT.md](./DEVELOPMENT.md) — Flujo de trabajo
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) — Arquitectura técnica
- [docs/PROTOCOL.md](./docs/PROTOCOL.md) — Protocolo WebSocket
- [docs/TESTING.md](./docs/TESTING.md) — Guía de testing
- [prd.md](./prd.md) — Product Requirements Document

## Licencia

MIT

## Créditos

- Diseño: Estética Superpop
- Stack: Three.js, Express, ws
