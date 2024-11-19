# Stage 1: Build the Angular application
FROM node:20 AS builder

# Set the working directory inside the container
WORKDIR /app

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Copy package.json and package-lock.json first for faster cache invalidation
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the source code of the Angular app to the container
COPY . .

# Build the Angular app in production mode
RUN npm run build --prod

# Stage 2: Serve the Angular application with NGINX
FROM nginx:alpine

# Copy the built Angular application from the builder stage
COPY --from=builder /app/dist/safePassVault/browser /usr/share/nginx/html

# Copy the custom NGINX configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 4800 (useful for self-hosted environments)
EXPOSE 4800

# Start NGINX in the foreground
CMD ["nginx", "-g", "daemon off;"]
