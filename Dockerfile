# 构建阶段 (builder stage)
# 使用 Node.js 20 的 Alpine 版本作为基础镜像
FROM node:20-alpine AS builder

# 设置工作目录
WORKDIR /app

# 全局安装 pnpm
RUN npm install -g pnpm

# 首先只复制依赖相关文件，利用 Docker 层缓存
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./

# 安装项目依赖
RUN pnpm install --frozen-lockfile

# 复制所有项目文件
COPY . .

# 构建 Next.js 应用
# Next.js 默认构建输出到 .next 目录
RUN pnpm build

# 生产阶段 (production stage)
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制 standalone 构建产物
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 启动 Next.js 应用
CMD ["node", "server.js"]
