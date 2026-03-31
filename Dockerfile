FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all files
COPY . .

# Expose ports for Vite and Express API
EXPOSE 5173
EXPOSE 3001

# Start the application concurrently
CMD ["npm", "start"]
