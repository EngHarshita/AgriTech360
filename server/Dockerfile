# AgriTech360 - Node.js Backend API Dockerfile
# Stage 1: Build TypeScript source code
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json tsconfig.json ./
RUN npm ci

COPY src/ ./src/
RUN npm run build

# Stage 2: Production runtime image
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production

# Copy compiled JavaScript output and runtime assets
COPY --from=builder /app/dist ./dist

# Expose backend port
EXPOSE 5000

# Health check using node
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://localhost:5000/api/v1/health').then(r => { if (![200, 503].includes(r.status)) process.exit(1); }).catch(() => process.exit(1))"

# Start Express server
CMD ["node", "dist/server.js"]
