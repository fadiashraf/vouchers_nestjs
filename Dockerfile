# Dockerfile
FROM node:16-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all other files
COPY . .

# Build the project
RUN npm run build

# Start the application
CMD ["npm", "run", "start:dev"]