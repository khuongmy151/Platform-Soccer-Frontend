# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Nginx
FROM nginx:alpine

# Sao chép file build
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Khai báo cổng 80
EXPOSE 80

# Xử lý biến môi trường ENV
# Lệnh này sẽ tạo ra file env-config.js chứa biến ENV trước khi chạy Nginx
CMD ["/bin/sh", "-c", "echo \"window._env_ = { ENV: '$ENV' };\" > /usr/share/nginx/html/env-config.js && nginx -g 'daemon off;'"]