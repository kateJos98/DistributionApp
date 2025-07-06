FROM node:18 AS builder

WORKDIR /app

# Copy dependencies and code
COPY package*.json ./
COPY vite.config.js ./
COPY . .

# Install dependencies and build the app
RUN npm install
RUN npm run build

# Serving the app with nginx
FROM nginx:stable-alpine

# Copy the generated build to the nginx directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Delete the default configuration and copy the new one
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
