# Use official Node.js LTS image
FROM node:18

# Create app directory
WORKDIR /BookingService

# Create logs directory 
RUN mkdir -p /logs

# Copy package.json and package-lock.json first (for caching npm install)
COPY package*.json ./

# Install dependencies (without dev dependencies)
RUN npm ci --omit=dev

# Copy rest of the app source code
COPY . .

# Expose your app port
EXPOSE 4000

# Start the app
CMD ["node", "src/index.js"]
