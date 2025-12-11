<p align="center">
  <a href="https://nuxt.com/" target="blank"><img src="https://nuxt.com/assets/design-kit/logo-green-black.svg" alt="Nuxt Logo" width="280" /></a>
</p>

<h1 align="center">🚀 Nuxt Dashboard Template | Joyan Labs</h1>

<p align="center">
  A high-performance, production-ready Nuxt 4 dashboard template with Nuxt UI, Tailwind CSS 4, and Docker.
</p>

<p align="center">
  <a href="https://nodejs.org/docs/latest-v22.x/api/index.html"><img src="https://img.shields.io/badge/node-22.x-green.svg" alt="node"/></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/typescript-5.x-blue.svg" alt="typescript"/></a>
  <a href="https://pnpm.io/"><img src="https://img.shields.io/badge/pnpm-10.x-orange.svg" alt="pnpm"/></a>
  <a href="https://nuxt.com/"><img src="https://img.shields.io/badge/Nuxt-4.x-00DC82.svg" alt="nuxt"/></a>
  <a href="https://ui.nuxt.com/"><img src="https://img.shields.io/badge/Nuxt_UI-4.x-00DC82.svg" alt="nuxt-ui"/></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-4.x-38BDF8.svg" alt="tailwind"/></a>
  <a href="https://www.docker.com/"><img src="https://img.shields.io/badge/Dockerized_🐳-blue.svg" alt="docker"/></a>
</p>

---

## 🎯 About The Project

This template provides a solid foundation for building modern, scalable dashboard applications using Nuxt 4. It incorporates best practices, modern tooling, and a fully dockerized environment.

### Key Features

- ⚡️ **Nuxt 4**: Latest version with improved performance and DX.
- 🎨 **Nuxt UI 4**: Beautiful, accessible components out of the box.
- 🌊 **Tailwind CSS 4**: Next-gen utility-first CSS framework.
- 🐳 **Dockerized**: Ready for development and production.
- 🧪 **Testing**: Nuxt Test Utils integration.
- 🐶 **Husky**: Git hooks for code quality.
- 📦 **pnpm**: Efficient package manager.
- 🔍 **ESLint**: Code linting with Nuxt ESLint module.

---

## 🌟 What's Included?

1. **🐳 Fully Dockerized**: Optimized multi-stage Dockerfile for production.
2. **🎨 Nuxt UI Components**: Pre-built dashboard layout, sidebar, modals, tables, and more.
3. **🌙 Dark Mode**: Light & dark theme support built-in.
4. **⌨️ Keyboard Shortcuts**: Navigation and actions via keyboard.
5. **🐶 Husky Integration**:
   - Linting on commit
   - Conventional commits
   - Type checking
   - Spell checking
6. **📱 Responsive Design**: Mobile-first, works on all devices.
7. **🚀 CI/CD**: GitHub Actions workflows included.
8. **🔄 Renovate**: Automated dependency updates.

---

## 🧑‍💻 Development

### Initial Setup

Install `pnpm` globally (if not installed):

```bash
npm install -g pnpm@10.23.0
```

Install dependencies:

```bash
pnpm install
```

### Development Mode

Start the application in **development mode** with hot-reload:

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`.

### Production Mode (Docker)

Build the Docker image:

```bash
pnpm run docker:build
```

Run the production container:

```bash
pnpm run docker:prod
```

Or using docker-compose:

```bash
docker-compose up -d
```

---

## ⚙️ Build

Build for production:

```bash
pnpm run build
```

Preview production build locally:

```bash
pnpm run preview
```

---

## ✅ Testing

### Type Check

```bash
pnpm run typecheck
```

---

## 💅 Linting

### Check Code

```bash
pnpm run lint
```

### Fix Issues (auto-fix)

```bash
pnpm run lint --fix
```

---

## 📁 Project Structure

```
├── app/
│   ├── assets/css/       # Global styles
│   ├── components/       # Vue components
│   ├── composables/      # Vue composables
│   ├── layouts/          # Page layouts
│   ├── pages/            # File-based routing
│   ├── types/            # TypeScript types
│   └── utils/            # Utility functions
├── server/
│   └── api/              # API routes
├── public/               # Static assets
├── Dockerfile            # Production Docker config
├── docker-compose.yml    # Docker Compose config
└── nuxt.config.ts        # Nuxt configuration
```

---

## 🐳 Docker Commands

| Command | Description |
|---------|-------------|
| `pnpm run docker:build` | Build production Docker image |
| `pnpm run docker:prod` | Run production container |

---

## 📝 License

Developed with ❤️ by **Joyan Labs**
