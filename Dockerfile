FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json ./

# Install dependencies (none required currently, but future-proof)
RUN npm install --production 2>/dev/null || true

# Copy all website files
COPY . .

# Expose port
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
