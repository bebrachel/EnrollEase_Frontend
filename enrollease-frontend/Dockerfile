# Сначала устанавливаем зависимости и собираем статические файлы приложения
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

# Затем настраиваем Nginx для обслуживания собранных статических файлов
FROM nginx:alpine

# Копируем скомпилированные статические файлы из предыдущего этапа сборки
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Копируем конфигурационный файл nginx.conf
COPY nginx.conf /etc/nginx/nginx.conf

# Указываем порт, на котором будет работать Nginx
EXPOSE 80

# Запускаем Nginx в фоновом режиме при запуске контейнера
CMD ["nginx", "-g", "daemon off;"]
