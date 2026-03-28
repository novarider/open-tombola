# Multi-stage build for Tombola API
# Build stage
FROM node:lts-alpine as builder

WORKDIR /app

# Copy package files
COPY dist/ ./

# Security: Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
# Change ownership
RUN chown -R nodejs:nodejs /app
# Switch to non-root user
USER nodejs

RUN npm ci --only=production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3333/health || exit 1

# Expose port
EXPOSE 3333

# Run application
CMD ["node", "main.js"]
