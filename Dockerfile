FROM node:24-alpine3.21 AS base

ENV DIR=/app
WORKDIR $DIR
# ARG NPM_TOKEN  # Descomenta esta línea si necesitas instalar paquetes privados de npm

FROM base AS build

ENV CI=true

# Aumentar el límite de memoria de Node.js para el build
ENV NODE_OPTIONS=--max-old-space-size=4096

# ============================================================================
# BUILD ARGUMENTS - Pasar al construir con: docker build --build-arg VAR=value
# ============================================================================
# Estas variables se usan durante el BUILD de Nuxt para configurar el proxy
# y otras configuraciones que se "hornean" en el bundle final.
#
# Ejemplo de uso:
#   docker build --build-arg NUXT_PUBLIC_API_BASE_URL=https://api.example.com .
#
# En docker-compose:
#   build:
#     args:
#       - NUXT_PUBLIC_API_BASE_URL=https://api.example.com
# ============================================================================

ARG NUXT_PUBLIC_SITE_URL=http://localhost:3000
ARG NUXT_PUBLIC_API_BASE_URL=http://localhost:3001

# Convertir ARG a ENV para que estén disponibles durante pnpm run build
ENV NUXT_PUBLIC_SITE_URL=${NUXT_PUBLIC_SITE_URL}
ENV NUXT_PUBLIC_API_BASE_URL=${NUXT_PUBLIC_API_BASE_URL}
ENV NODE_ENV=production

RUN apk update && apk add --no-cache dumb-init=1.2.5-r3 && npm install -g pnpm@10.27.0

COPY package.json pnpm-lock.yaml ./
# Para paquetes privados de npm, descomenta las siguientes 3 líneas y comenta la línea simple:
# RUN echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > ".npmrc" && \
#     pnpm install --frozen-lockfile && \
#     rm -f .npmrc
RUN pnpm install --frozen-lockfile

COPY nuxt.config.ts .
COPY tsconfig.json .
COPY eslint.config.mjs .
COPY app app
COPY server server
COPY public public
COPY i18n i18n
COPY shared shared

RUN pnpm run build && \
    pnpm prune --prod --ignore-scripts

FROM base AS production

ARG PORT=3000
ENV NODE_ENV=production
ENV USER=node

COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init
COPY --from=build $DIR/package.json .
COPY --from=build $DIR/pnpm-lock.yaml .
COPY --from=build $DIR/node_modules node_modules
COPY --from=build $DIR/.output .output

USER $USER
EXPOSE $PORT
CMD ["dumb-init", "node", ".output/server/index.mjs"]
