# Etapa 1: Compilación
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration=production

# Etapa 2: Servidor Web (Nginx)
FROM nginx:alpine
# Copiamos los archivos compilados desde la etapa anterior
# IMPORTANTE: Revisa en tu angular.json el "outputPath". 
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Copiamos una configuración de Nginx para que las rutas de Angular funcionen (Deep linking)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]