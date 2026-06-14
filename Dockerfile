# ==========================================
# STAGE 1: Build React Frontend Client
# ==========================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

# Leverage layer caching by copying package manifests first
COPY frontend/package*.json ./

# Install development and production dependencies
RUN npm ci

# Copy the rest of the frontend source files and compile
COPY frontend/ ./
RUN npm run build

# ==========================================
# STAGE 2: Setup Node Express Backend Modules
# ==========================================
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend

# Leverage layer caching by copying package manifests first
COPY backend/package*.json ./

# Install ONLY production dependencies
RUN npm ci --omit=dev

# ==========================================
# STAGE 3: Production Runner Image (Non-Root)
# ==========================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Copy pre-installed production backend modules with owner permissions
COPY --from=backend-builder --chown=node:node /app/backend/node_modules ./node_modules
COPY --chown=node:node backend/package.json ./package.json
COPY --chown=node:node backend/server.js ./server.js
COPY --chown=node:node backend/routes ./routes
COPY --chown=node:node backend/services ./services

# Copy compiled frontend assets to backend static folder
COPY --from=frontend-builder --chown=node:node /app/frontend/dist ./public

# Switch to the standard non-root 'node' user for security compliance
USER node

EXPOSE 8080

CMD ["node", "server.js"]
