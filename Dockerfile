# Geordin Zolliecoffer portfolio — multi-stage build.
#
#  Stage 1 (build) : install deps, run `vite build` → static `dist/`
#  Stage 2 (serve) : nginx alpine serving the static `dist/` with SPA fallback
#
# Final image is ~25MB and serves the entire site from RAM.

# ------------------------------------------------------------------------------
FROM node:22-alpine AS build

WORKDIR /app

# Install deps using package-lock for reproducibility.
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# Copy the rest of the source.
COPY . .

# Ensure the production build serves images from /public (not R2) until
# the R2 bucket is wired up.
ENV VITE_USE_LOCAL_MEDIA=1
ENV VITE_MEDIA_URL=""

RUN npm run build

# ------------------------------------------------------------------------------
FROM nginx:1.27-alpine AS serve

# Custom nginx config — SPA fallback so client-side routes work.
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built static site.
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# Healthcheck — nginx is up if curl gets a 200 on root.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O - http://127.0.0.1/ > /dev/null 2>&1 || exit 1
