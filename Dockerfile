# ==========================================
# STAGE 1: Build React Frontend Client
# ==========================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# ==========================================
# STAGE 2: Setup Node Express Backend Modules
# ==========================================
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm ci --omit=dev

# ==========================================
# STAGE 3: Production Runner Image (Non-Root)
# ==========================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Copy backend files and pre-installed production dependencies
COPY --from=backend-builder /app/backend/node_modules ./node_modules
COPY backend/package.json ./package.json
COPY backend/server.js ./server.js
COPY backend/routes ./routes
COPY backend/services ./services

# Copy compiled frontend assets to backend static folder
COPY --from=frontend-builder /app/frontend/dist ./public

# Secure file permissions and switch to standard non-root 'node' user
RUN chown -R node:node /app
USER node

EXPOSE 8080

CMD ["node", "server.js"]
