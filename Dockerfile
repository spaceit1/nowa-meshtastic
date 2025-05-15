# Etap budowania
FROM node:20-alpine as build

WORKDIR /app

# Kopiowanie plików konfiguracyjnych
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./

# Instalacja zależności
RUN npm ci

# Kopiowanie kodu źródłowego
COPY . .

# Budowanie aplikacji
RUN npm run build

# Etap produkcyjny
FROM nginx:alpine

# Kopiowanie skonfigurowanego nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Kopiowanie zbudowanej aplikacji
COPY --from=build /app/dist /usr/share/nginx/html

# Ekspozycja portu
EXPOSE 80

# Uruchomienie nginx
CMD ["nginx", "-g", "daemon off;"] 