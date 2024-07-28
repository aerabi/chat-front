# Builder container to compile the application
FROM node:22.5-alpine as builder
WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .
RUN npm ci

COPY . .
RUN npm run build

# Production container with the static files
FROM nginx:stable-alpine as production

COPY --from=builder /usr/src/app/dist/chat-front/browser /usr/share/nginx/html
COPY nginx.frontend.conf /etc/nginx/nginx.conf

EXPOSE 80
