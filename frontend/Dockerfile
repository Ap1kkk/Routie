# Этап 1: Сборка приложения
FROM node:24-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci || npm install
COPY . ./
RUN npm run build

# Этап 2: Запуск с nginx
FROM nginx:stable-alpine3.23

# Копируем собранные файлы из этапа build
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]