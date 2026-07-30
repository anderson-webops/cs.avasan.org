FROM node:22.22.2-alpine3.22@sha256:b77017c37f430e4466ff497058948a2f16e8b59779600d53711eeb7b999b0f4e AS build-stage

WORKDIR /app
RUN npm install --global npm@11.11.1

COPY package.json package-lock.json ./
COPY front-end/package.json ./front-end/package.json
COPY back-end/package.json ./back-end/package.json
RUN npm ci

COPY . .
ARG VITE_CLASSROOM_PRIVACY_APPROVED=false
ARG VITE_CLASSROOM_USAGE_ENABLED=false
ARG VITE_SCHOOL_PRIVACY_CONTACT=
ARG VITE_STUDENT_ACCOUNTS_ENABLED=false
ARG VITE_STUDENT_OAUTH_ENABLED=false
ENV VITE_CLASSROOM_PRIVACY_APPROVED=$VITE_CLASSROOM_PRIVACY_APPROVED
ENV VITE_CLASSROOM_USAGE_ENABLED=$VITE_CLASSROOM_USAGE_ENABLED
ENV VITE_SCHOOL_PRIVACY_CONTACT=$VITE_SCHOOL_PRIVACY_CONTACT
ENV VITE_STUDENT_ACCOUNTS_ENABLED=$VITE_STUDENT_ACCOUNTS_ENABLED
ENV VITE_STUDENT_OAUTH_ENABLED=$VITE_STUDENT_OAUTH_ENABLED
RUN npm run -w front-end build

FROM nginxinc/nginx-unprivileged:stable-alpine@sha256:44e36330f74d4f3a1d4e222acca9e23b401fb87811a7597024502bb759c4dd49 AS production-stage

COPY --from=build-stage /app/front-end/dist /usr/share/nginx/html
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
	CMD wget -q -O - http://127.0.0.1:8080/ >/dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
