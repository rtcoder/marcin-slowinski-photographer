# Wybór obrazu z Node.js
FROM node:18-alpine AS builder

WORKDIR /app

# Kopiowanie plików i instalacja zależności
COPY package.json package-lock.json ./
RUN npm ci

# Kopiowanie kodu źródłowego
COPY . .

# Budowanie aplikacji
RUN npm run build

# Serwer dla aplikacji
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
#COPY nginx.conf /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf


EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
