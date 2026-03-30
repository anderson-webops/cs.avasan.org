FROM node:20-alpine AS build-stage

WORKDIR /app

COPY package.json package-lock.json ./
COPY front-end/package.json ./front-end/package.json
COPY back-end/package.json ./back-end/package.json
RUN npm ci

COPY . .
RUN npm run -w front-end build

FROM nginx:stable-alpine AS production-stage

COPY --from=build-stage /app/front-end/dist /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
