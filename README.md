# OpenRouter Key Monitor

这是一个使用 Next.js、React 和 Tauri 构建的 OpenRouter API Key 使用状况监控网页。UI 简洁美观，提供实时的密钥使用情况监控。

## 功能特性

- ✅ 通过 Provisioning Key 获取 OpenRouter 的 Key List
- ✅ 密钥信息以卡片形式展示，每行 4 个卡片
- ✅ 进度条显示使用量/限额百分比
- ✅ 鼠标悬停显示详细使用信息
- ✅ 显示请求次数限制 (rate_limit)
- ✅ 显示密钥失效时间
- ✅ 安全的后端 API 调用，避免前端暴露 Provisioning Key
- ✅ 本地存储 Provisioning Key，无需重复输入

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

复制 `.env.example` 文件为 `.env.local` 并填入您的 OpenRouter Provisioning Key：

```bash
cp .env.example .env.local
```

然后在 `.env.local` 中设置：

```env
OPENROUTER_PROVISIONING_KEY=sk-or-v1-your-provisioning-key-here
```

### 3. 运行开发服务器

```bash
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 4. 配置 Provisioning Key

首次使用时，点击页面右上角的"配置"按钮，输入您的 OpenRouter Provisioning Key 并保存。Key 会存储在浏览器的 localStorage 中。

## 部署说明

### 环境变量配置

在生产环境中，确保在部署平台（如 Vercel、Netlify 等）的环境变量中设置：

- `OPENROUTER_PROVISIONING_KEY`: 您的 OpenRouter Provisioning Key

### Tauri 桌面应用

如需构建为桌面应用：

```bash
pnpm tauri build
```

## API 说明

### 后端 API 端点

- `GET /api/provisioning-key`: 获取 OpenRouter Key 信息
- `POST /api/provisioning-key`: 验证并保存 Provisioning Key

### OpenRouter API

应用使用 OpenRouter 的 `/api/v1/key` 端点获取密钥信息。

## 数据结构

### Key 信息

```typescript
{
  "label": "sk-or-v1-8a5...d1a",           // Key 标识
  "is_provisioning_key": false,            // 是否为 Provisioning Key
  "limit": 10,                             // 限额（美元）
  "limit_reset": "daily",                  // 重置周期：daily/weekly/monthly
  "limit_remaining": 4.487273,             // 剩余额度
  "usage": 5.5130091,                      // 已使用量（美元）
  "usage_daily": 5.512727,                 // 日使用量
  "usage_weekly": 5.512727,                // 周使用量
  "usage_monthly": 5.5130091,              // 月使用量
  "expires_at": null,                      // 失效时间（null 表示永久有效）
  "rate_limit": {
    "requests": -1,                        // 请求次数限制（-1 表示无限制）
    "interval": "10s"                      // 限制时间间隔
  }
}
```

## 技术栈

- **前端框架**: Next.js 16.1.4, React 19.2.3
- **UI 样式**: Tailwind CSS 4
- **类型检查**: TypeScript 5
- **桌面应用**: Tauri 2.9
- **图标库**: Lucide React
- **工具类**: clsx, tailwind-merge

## 项目结构

```
app/
├── api/
│   └── provisioning-key/
│       └── route.ts          # 后端 API 路由
├── globals.css               # 全局样式
├── layout.tsx                # 根布局
└── page.tsx                  # 主页面
src/
├── components/
│   └── KeyCard.tsx           # 密钥卡片组件
└── lib/
    └── openrouter.ts         # OpenRouter API 工具函数
```

## 安全说明

- Provisioning Key 存储在后端环境变量中，不会在前端暴露
- 用户输入的 Provisioning Key 存储在浏览器 localStorage 中
- 所有 API 调用都通过后端代理，确保密钥安全

## 许可证

MIT License

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
