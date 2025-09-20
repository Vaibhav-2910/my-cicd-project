## Stage 1: Build the Angular app
##FROM node:18 AS builder
#FROM node:22-alpine AS builder#
#WORKDIR /app
#COPY package*.json ./
#RUN npm install
#COPY . .
#RUN npm run build -- --configuration production

#RUN ls -la /app/dist
## Stage 2: Serve the app from Nginx
#FROM nginx:alpine
#COPY --from=builder /app/dist/frontend /usr/share/nginx/html
#COPY nginx.conf /etc/nginx/conf.d/default.conf



# Stage 1: Build Angular app
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration production

# Stage 2: Serve with Nginx
FROM nginx:alpine
# Angular v17+ build folder 'browser' ko Nginx html me copy karo
COPY --from=builder /app/dist/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
