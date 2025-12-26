# 🚀 Quick Start - Dashboard Template (Frontend)

Este repositorio es parte de la plantilla **Dashboard + Better Auth** de Joyan Labs.

## 🛠️ Requisitos previos

- **Node.js**: v22 o superior.
- **pnpm**: v10 o superior (`npm install -g pnpm`).

## 🏁 Pasos para iniciar

1. **Instalar dependencias**:
   ```bash
   pnpm install
   ```

2. **Configurar variables de entorno**:
   Copia `.env.example` a `.env` y asegúrate de que `BETTER_AUTH_URL` apunte a tu backend (por defecto `http://localhost:3001`).
   ```bash
   cp .env.example .env
   ```

3. **Iniciar en modo desarrollo**:
   ```bash
   pnpm run dev
   ```

---

## 🐳 Desarrollo con Docker

Si prefieres usar Docker para el frontend:
```bash
pnpm run docker:prod
```

---

## 🔗 Repositorios de la Plantilla
- [Frontend (Nuxt 4)](https://github.com/JoyanLabs/template-nuxt4-dashboard-better_auth)
- [Backend (NestJS)](https://github.com/JoyanLabs/template-nestjs-dashboard-better_auth)
