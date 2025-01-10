FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and lock file
COPY package*.json ./

# Clean and install dependencies
RUN rm -rf node_modules package-lock.json && npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Build the application (if needed)
RUN npm run build

# Expose the application port
EXPOSE 8080

# Start the development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]