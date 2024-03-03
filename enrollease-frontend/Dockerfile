# Указываем базовый образ для сборки приложения
FROM node:latest as build-stage

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код приложения
COPY . .

# Собираем статические файлы
RUN npm run build

# Указываем базовый образ, который содержит Nginx
FROM nginx:latest

# Копируем скомпилированные статические файлы из предыдущего этапа сборки
COPY --from=build-stage /app/dist/ /usr/share/nginx/html
