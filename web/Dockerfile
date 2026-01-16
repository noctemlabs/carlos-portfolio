# syntax=docker/dockerfile:1.6

FROM --platform=$BUILDPLATFORM node:20-alpine AS build
WORKDIR /app

# Install deps first (cache-friendly)
COPY web/package*.json ./
# If you use pnpm/yarn, swap accordingly
RUN npm ci

# Copy source and build
COPY web/ .
RUN npm run build

# Runtime: nginx serving the built SPA + reverse proxy for /api + /actuator
FROM nginx:1.27-alpine

# Replace default site config
COPY web/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
