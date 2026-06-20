# 진성레이져 사이트 — Next.js 16 + Payload 3 (SQLite)
# 안정성 우선: standalone 트레이싱 대신 빌드된 .next + node_modules로 `next start` 실행.

FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
# 한글(UTF-8) 로케일
ENV LANG=C.UTF-8 LC_ALL=C.UTF-8
WORKDIR /app

# 1) 의존성 설치
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# 2) 빌드
FROM base AS build
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# 빌드 시점에만 필요한 더미 값 (런타임엔 compose의 env로 대체됨)
ENV PAYLOAD_SECRET=build-time-only
ENV DATABASE_URI=file:./data/jinsung.db
RUN npm run build

# 3) 런타임
FROM base AS runtime
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/src ./src
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/next.config.ts ./next.config.ts
COPY --from=build /app/tsconfig.json ./tsconfig.json
# 데이터(SQLite)·업로드(미디어) 디렉터리 — compose에서 볼륨 마운트
RUN mkdir -p /app/data /app/media

EXPOSE 3000
CMD ["npm", "run", "start"]
