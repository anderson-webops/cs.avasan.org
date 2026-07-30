FROM node:22.22.2-alpine3.22@sha256:b77017c37f430e4466ff497058948a2f16e8b59779600d53711eeb7b999b0f4e AS npm-stage

RUN npm install --global npm@11.11.1

FROM npm-stage AS build-stage

WORKDIR /app
COPY package.json package-lock.json ./
COPY front-end/package.json ./front-end/package.json
COPY back-end/package.json ./back-end/package.json
RUN npm ci

COPY tsconfig.base.json ./
COPY back-end/tsconfig.json ./back-end/tsconfig.json
COPY back-end/src ./back-end/src
RUN npm run -w back-end build

FROM npm-stage AS admin-stage

WORKDIR /app
COPY package.json package-lock.json ./
COPY front-end/package.json ./front-end/package.json
COPY back-end/package.json ./back-end/package.json
RUN npm ci

ENV NODE_ENV=production
COPY tsconfig.base.json ./
COPY back-end/tsconfig.json ./back-end/tsconfig.json
COPY back-end/src ./back-end/src
USER node
CMD ["npm", "run", "-w", "back-end", "create-admin-ts"]

FROM npm-stage AS production-stage

ENV NODE_ENV=production
WORKDIR /app
COPY package.json package-lock.json ./
COPY front-end/package.json ./front-end/package.json
COPY back-end/package.json ./back-end/package.json
RUN npm ci --omit=dev --workspace back-end --include-workspace-root=false \
	&& npm cache clean --force

COPY --from=build-stage /app/back-end/dist ./back-end/dist
USER node
EXPOSE 3008
CMD ["node", "back-end/dist/server.js"]
