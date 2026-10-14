# Lightweight, secure Node.js Alpine container
FROM node:20-alpine AS runner

WORKDIR /app

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Copy application files
COPY package.json ./
COPY server.js ./
COPY index.html about.html services.html contact.html track.html portal.html api-docs.html ./
COPY css/ ./css/
COPY js/ ./js/
COPY data/ ./data/

# Run as non-root user
USER node

# Expose production port
EXPOSE 3000

# Health check validation
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start the high-performance static + API server
CMD ["node", "server.js"]
