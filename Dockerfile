# Stage 1: Build the Angular application
FROM node:latest AS builder
WORKDIR /app

RUN npm install -g @angular/cli

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build --prod

# Stage 2: Serve the application
FROM nginx:alpine

# Copy the built Angular application from the previous stage
COPY --from=builder /app/dist/safePassVault/browser /usr/share/nginx/html

# Copy the custom nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 4800 instead of 80
EXPOSE 4800

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
