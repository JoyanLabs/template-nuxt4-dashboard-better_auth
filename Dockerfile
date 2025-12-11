FROM node:22-alpine3.21 AS base

ENV DIR=/app
WORKDIR $DIR
# ARG NPM_TOKEN  # Descomenta esta línea si necesitas instalar paquetes privados de npm

FROM base AS build

ENV CI=true

RUN apk update && apk add --no-cache dumb-init=1.2.5-r3 && npm install -g pnpm@10.23.0

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

RUN pnpm run build && \
    pnpm prune --prod --ignore-scripts

FROM base AS production

ENV NODE_ENV=production
ENV USER=node

COPY --from=build /usr/bin/dumb-init /usr/bin/dumb-init
COPY --from=build $DIR/package.json .
COPY --from=build $DIR/pnpm-lock.yaml .
COPY --from=build $DIR/node_modules node_modules
COPY --from=build $DIR/.output .output

USER $USER
EXPOSE 3000
CMD ["dumb-init", "node", ".output/server/index.mjs"]

