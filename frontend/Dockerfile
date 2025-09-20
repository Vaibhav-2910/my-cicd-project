# Stage 1: Build the Angular app
#FROM node:18 AS builder
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration production

RUN ls -la /app/dist
# Stage 2: Serve the app from Nginx
FROM nginx:alpine
COPY --from=builder /app/dist/frontend/browser  /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf



