FROM node:24.18.0-alpine@sha256:a0b9bf06e4e6193cf7a0f58816cc935ff8c2a908f81e6f1a95432d679c54fbfd AS npm-stage

RUN npm install --global npm@11.16.0

FROM npm-stage AS build-stage

WORKDIR /app
COPY package.json package-lock.json ./
COPY front-end/package.json ./front-end/package.json
COPY back-end/package.json ./back-end/package.json
RUN CYPRESS_INSTALL_BINARY=0 PUPPETEER_SKIP_DOWNLOAD=true \
	npm ci --include=optional --strict-allow-scripts

COPY tsconfig.base.json ./
COPY back-end/tsconfig.json ./back-end/tsconfig.json
COPY back-end/src ./back-end/src
RUN npm run -w back-end build

FROM npm-stage AS admin-stage

WORKDIR /app
COPY package.json package-lock.json ./
COPY front-end/package.json ./front-end/package.json
COPY back-end/package.json ./back-end/package.json
RUN CYPRESS_INSTALL_BINARY=0 PUPPETEER_SKIP_DOWNLOAD=true \
	npm ci --include=optional --strict-allow-scripts

ENV NODE_ENV=production
COPY tsconfig.base.json ./
COPY back-end/tsconfig.json ./back-end/tsconfig.json
COPY back-end/src ./back-end/src
USER node
CMD ["npm", "run", "-w", "back-end", "create-admin-ts"]

FROM npm-stage AS production-stage

ARG CS_RELEASE_VERSION=2.7.102
ARG SOURCE_REVISION=unknown
ENV CS_RELEASE_VERSION=$CS_RELEASE_VERSION
ENV NODE_ENV=production
ENV SOURCE_REVISION=$SOURCE_REVISION
WORKDIR /app
COPY package.json package-lock.json ./
COPY front-end/package.json ./front-end/package.json
COPY back-end/package.json ./back-end/package.json
RUN npm ci --omit=dev --workspace back-end --include-workspace-root=false \
	--include=optional --strict-allow-scripts \
	&& npm cache clean --force

COPY --from=build-stage /app/back-end/dist ./back-end/dist
USER node
EXPOSE 3008
CMD ["node", "back-end/dist/server.js"]
