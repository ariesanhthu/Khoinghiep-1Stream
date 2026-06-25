FROM node:20-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.33.2 --activate

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/web-v2/package.json ./apps/web-v2/
COPY packages/contracts/package.json ./packages/contracts/

RUN pnpm install --frozen-lockfile

COPY apps/web-v2 ./apps/web-v2
COPY packages/contracts ./packages/contracts
COPY tsconfig.base.json ./

RUN pnpm --filter=web-v2 run build

FROM nginx:alpine
COPY --from=builder /app/apps/web-v2/dist /usr/share/nginx/html
COPY docker/web-v2.nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
