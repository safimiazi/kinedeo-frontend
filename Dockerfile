# ─────────────────────────────────────────────
# Stage 1: deps — install dependencies
# ─────────────────────────────────────────────
FROM node:24-alpine AS deps
WORKDIR /app

COPY package*.json ./
RUN npm ci

# ─────────────────────────────────────────────
# Stage 2: builder — compile Next.js app
# ─────────────────────────────────────────────
FROM node:24-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time env var — needed for next build to embed API URL
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_APP_URL=https://kinedeo.com
ENV NODE_ENV=production

RUN npm run build

# ─────────────────────────────────────────────
# Stage 3: production — lean runtime image
# ─────────────────────────────────────────────
FROM node:24-alpine AS production
WORKDIR /app

ENV NODE_ENV=production

# Copy only what Next.js needs to run in standalone mode
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
