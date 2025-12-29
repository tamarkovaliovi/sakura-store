# --- AŞAMA 1: İNŞAAT (Build Stage) ---
# Node.js'in güncel sürümünü (alpine) temel alıyoruz
FROM node:22-alpine AS build-stage

# Konteyner içinde çalışma klasörünü belirliyoruz
WORKDIR /app

# Önce sadece paket listesini kopyalıyoruz
COPY package*.json ./

# Bağımlılıkları yüklüyoruz
RUN npm install

# Şimdi projenin geri kalan tüm dosyalarını kopyalıyoruz
COPY . .

# Vue projesini derliyoruz (dist klasörü oluşur)
RUN npm run build

# --- AŞAMA 2: SUNUM (Production Stage) ---
# Derlenmiş dosyaları sunmak için Nginx kullanıyoruz
FROM nginx:stable-alpine AS production-stage

# İlk aşamada oluşan 'dist' klasörünü, Nginx'in sunum klasörüne kopyalıyoruz
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 80 portunu dışarı açıyoruz
EXPOSE 80

# Nginx'i başlatıyoruz
CMD ["nginx", "-g", "daemon off;"]