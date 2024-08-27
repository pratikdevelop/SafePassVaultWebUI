# Step 1: Build the Angular application
FROM node:latest AS builder

WORKDIR /app
RUN pwd # Logs the current directory

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application code
COPY . .
RUN pwd # Logs the current directory
RUN ls -la # Lists all files and directories in the current directory

# Build the Angular application
RUN npm run build --prod

# Step 2: Serve the Angular application with Nginx
FROM nginx:alpine

# Copy the build output to the Nginx html directory
COPY --from=builder /app/dist/password-app/browser /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
