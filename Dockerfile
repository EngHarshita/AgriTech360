# AgriTech360 - Frontend Production Dockerfile
# Stage 1: Build React/Vite application
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build production bundle with client-side environment configured
ARG VITE_API_BASE_URL=http://localhost:5000/api/v1
ARG VITE_USE_MOCK_DATA=false
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_USE_MOCK_DATA=$VITE_USE_MOCK_DATA

RUN npm run build

# Stage 2: Serve static bundle via Nginx
FROM nginx:alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -q --spider http://localhost:80 || exit 1

CMD ["nginx", "-g", "daemon off;"]
