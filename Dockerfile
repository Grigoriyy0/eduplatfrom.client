# --- Build stage ---
FROM node:22-slim AS builder

WORKDIR /app

# Оставляем стандартные настройки npm, чтобы установились optional-зависимости (Rollup native)

# Копируем package files
COPY package.json package-lock.json* ./

# Устанавливаем зависимости (dev включены для сборки)
RUN npm ci

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

# --- Runtime stage ---
FROM nginx:alpine AS runtime

# Копируем nginx конфиг
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копируем собранное приложение
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]