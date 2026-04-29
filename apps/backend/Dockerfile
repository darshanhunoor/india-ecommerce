# Use Node 20 Alpine as the base image for a smaller footprint
FROM node:20-alpine AS builder

# Create app directory
WORKDIR /app

# Copy the root package.json and package-lock.json
COPY package*.json ./

# Copy the entire backend directory
COPY apps/backend ./apps/backend

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Switch to backend directory
WORKDIR /app/apps/backend

# Generate Prisma client
RUN npx prisma generate

# Build the NestJS application
RUN npm run build

# --- Production Image ---
FROM node:20-alpine AS runner

WORKDIR /app

# Set to production
ENV NODE_ENV=production

# Copy root package files
COPY --from=builder /app/package*.json ./

# Copy built artifacts and necessary files from the builder stage
COPY --from=builder /app/apps/backend/package*.json ./apps/backend/
COPY --from=builder /app/apps/backend/prisma.config.ts ./apps/backend/
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/prisma ./apps/backend/prisma

# Note: We are copying the entire node_modules from the builder to ensure workspace dependencies are linked.
# In a highly optimized setup, you might prune dev dependencies, but for npm workspaces this is the safest approach.
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/node_modules ./apps/backend/node_modules

# Expose the application port (3001 as defined in main.ts)
EXPOSE 3001

# Set the working directory to the backend folder
WORKDIR /app/apps/backend

# Run migrations and start the application
# Run db push instead of migrate deploy because we don't use migrations yet
CMD npx prisma db push --accept-data-loss && node dist/main.js
