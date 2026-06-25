FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.33.2 --activate

FROM base AS pruner
WORKDIR /app
COPY . .
RUN npx turbo prune @sea/api --docker

FROM base AS builder
WORKDIR /app
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
# Copy .npmrc so shamefully-hoist=true applies — packages land in root node_modules
COPY --from=pruner /app/.npmrc ./.npmrc
RUN pnpm install --frozen-lockfile
COPY --from=pruner /app/out/full/ .
COPY --from=pruner /app/tsconfig.base.json ./tsconfig.base.json
RUN pnpm build --filter=@sea/api

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3001
CMD ["node", "dist/main"]
