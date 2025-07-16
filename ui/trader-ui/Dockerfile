# Stage 1: Build the React application
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the static files with Nginx
FROM nginx:1.27-alpine
# Copy the built assets from the 'build' stage
COPY --from=build /app/build /usr/share/nginx/html
COPY ./env.template.js /usr/share/nginx/html/env.js
COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
# Nginx listens on port 80 by default
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]