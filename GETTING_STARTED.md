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

## 🐳 Despliegue en Producción con Docker

### Variables de Entorno en Docker

Las variables de entorno se pueden configurar de varias formas para producción:

#### 1. **Archivo .env para producción**
```bash
# Copia el archivo de ejemplo y configura para producción
cp .env.example .env

# Edita las variables para tu entorno de producción
NUXT_PUBLIC_SITE_URL=https://miapp.com
NUXT_PUBLIC_API_BASE_URL=https://api.miapp.com
```

#### 2. **Variables en docker-compose (Recomendado)**
```bash
# Configurar variables y ejecutar
NUXT_PUBLIC_SITE_URL=https://miapp.com NUXT_PUBLIC_API_BASE_URL=https://api.miapp.com pnpm run docker:prod
```

#### 3. **Docker run con variables específicas**
```bash
docker run -e NUXT_PUBLIC_SITE_URL=https://produccion.com -e NUXT_PUBLIC_API_BASE_URL=https://api.produccion.com spp-frontend:latest
```

#### 4. **Script helper (Más fácil)**
```bash
# Producción con URLs específicas
pnpm run docker:env prod https://miapp.com https://api.miapp.com

# Staging
pnpm run docker:env staging https://staging.miapp.com https://api-staging.miapp.com
```

### Comandos Docker disponibles

```bash
# Construir imagen
pnpm run docker:build

# Ejecutar en producción
pnpm run docker:prod

# Ejecutar con configuración personalizada
pnpm run docker:env prod https://miapp.com https://api.miapp.com
```

### 💡 Desarrollo Local

Para desarrollo local, usa Nuxt directamente (sin Docker):
```bash
pnpm run dev
```

---

## 🔗 Repositorios de la Plantilla
- [Frontend (Nuxt 4)](https://github.com/JoyanLabs/template-nuxt4-dashboard-better_auth)
- [Backend (NestJS)](https://github.com/JoyanLabs/template-nestjs-dashboard-better_auth)
