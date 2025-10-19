# 1️⃣ Base
FROM node:20-alpine AS base
WORKDIR /app

# 2️⃣ Install dipendenze
COPY package*.json ./
RUN npm ci

# 3️⃣ Build app
COPY . .
RUN npm run build

# 4️⃣ Avvio
EXPOSE 3000
CMD ["npm", "run", "start"]
