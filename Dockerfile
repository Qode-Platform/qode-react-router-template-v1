# Built by .github/workflows/deploy.yml (context ., file Dockerfile) and pushed
# to Artifact Registry. Adapted from the fleet's node stack pack.
#
# Deviations from the pack, and why:
#   - `npm install` when no lockfile is committed; the pack assumes `npm ci`.
#   - replaces the generator's Dockerfile, which COPYs package-lock.json and runs
#     `npm ci` - this template ships no lockfile, so that build fails outright.

FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi
COPY . .
RUN npm run build

FROM node:22-alpine AS runtime
ARG BUILD_ID=""
WORKDIR /app
ENV NODE_ENV=production PORT=3000 HOST=0.0.0.0 BUILD_ID=$BUILD_ID
RUN addgroup -S app && adduser -S app -G app
COPY --from=build --chown=app:app /app ./
USER app
EXPOSE 3000
CMD ["npm", "run", "start"]
