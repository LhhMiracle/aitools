# LWU AI Clone - Full-Stack AI Creative Suite

一个功能完整的 AI 创意工具平台，类似 lwu.ai。包含用户认证、AI 工具、支付系统和作品管理等完整功能。

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.0-ff0055)
![Zustand](https://img.shields.io/badge/Zustand-State-orange)
![Stripe](https://img.shields.io/badge/Stripe-Payment-purple)

## ✨ 核心功能

### 🎨 前端功能
- **现代化 UI** - 暗色主题、渐变色、毛玻璃效果
- **响应式设计** - 完美适配所有设备
- **流畅动画** - Framer Motion 实现的丝滑过渡
- **SEO 优化** - 完整的元数据和 Open Graph 标签

### 🔐 用户系统
- **完整认证流程** - 注册、登录、登出
- **用户状态管理** - Zustand 状态持久化
- **用户仪表板** - 统计数据、快速操作
- **个人资料** - 积分管理、订阅信息

### 🤖 AI 工具
- **图像生成** - 文本转图像（5 积分）
- **背景移除** - 精确去除背景（2 积分）
- **人脸增强** - 自动美化人像（3 积分）
- **风格迁移** - 艺术风格转换（4 积分）
- **图像放大** - 提升分辨率（3 积分）
- **物体移除** - 无缝移除对象（3 积分）

### 📁 文件管理
- **拖拽上传** - React Dropzone 集成
- **文件预览** - 即时预览上传内容
- **格式支持** - PNG, JPG, JPEG, WebP
- **大小限制** - 最大 10MB

### 💳 支付系统
- **Stripe 集成** - 安全支付处理
- **订阅管理** - 三个订阅层级
  - Free: 10 积分/月
  - Pro: 500 积分/月 ($19)
  - Enterprise: 3000 积分/月 ($99)
- **积分系统** - 自动扣除和充值

### 📊 作品管理
- **创作历史** - 所有作品列表
- **状态追踪** - 处理中/完成/失败
- **下载功能** - 一键下载结果
- **删除管理** - 作品管理功能

## 📦 技术栈

### 前端
- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **状态管理**: Zustand
- **图标**: Lucide React

### 功能库
- **文件上传**: React Dropzone
- **支付**: Stripe
- **表单**: React Hook Form (可选)

### 开发工具
- **包管理**: npm
- **代码规范**: ESLint
- **类型检查**: TypeScript

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd lwu-ai-clone
```

### 2. 安装依赖

```bash
npm install
```

### 3. 环境变量配置

复制 `.env.local.example` 为 `.env.local`:

```bash
cp .env.local.example .env.local
```

配置以下环境变量：

```env
# Stripe Keys (从 https://dashboard.stripe.com/apikeys 获取)
STRIPE_SECRET_KEY=sk_test_your_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here

# Stripe Price IDs (在 Stripe 创建产品后获取)
STRIPE_PRO_PRICE_ID=price_xxx
STRIPE_ENTERPRISE_PRICE_ID=price_xxx

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

### 5. 构建生产版本

```bash
npm run build
npm start
```

## 📂 项目结构

```
lwu-ai-clone/
├── app/                          # Next.js App Router
│   ├── api/                      # API 路由
│   │   └── stripe/              # Stripe 支付 API
│   ├── dashboard/               # 用户仪表板
│   │   └── history/             # 创作历史
│   ├── tools/                   # AI 工具页面
│   ├── layout.tsx               # 根布局
│   ├── page.tsx                 # 首页
│   └── globals.css              # 全局样式
├── components/                  # React 组件
│   ├── AuthModal.tsx            # 认证模态框
│   ├── Header.tsx               # 导航栏
│   ├── Hero.tsx                 # 英雄区域
│   ├── Features.tsx             # 功能展示
│   ├── Gallery.tsx              # 作品画廊
│   ├── Pricing.tsx              # 定价方案
│   ├── Footer.tsx               # 页脚
│   └── FileUpload.tsx           # 文件上传
├── store/                       # 状态管理
│   └── useStore.ts              # Zustand Store
├── types/                       # TypeScript 类型
│   └── index.ts                 # 类型定义
├── lib/                         # 工具函数
│   └── stripe.ts                # Stripe 配置
└── public/                      # 静态资源
```

## 🎯 功能使用指南

### 用户注册/登录

1. 点击 "Get Started" 或 "Sign In"
2. 填写信息（演示模式存储在 localStorage）
3. 自动登录并跳转到仪表板

### 使用 AI 工具

1. 登录后访问 `/tools`
2. 选择想要使用的 AI 工具
3. 上传图片或输入提示词
4. 点击生成（消耗相应积分）
5. 查看结果并下载

### 升级订阅

1. 访问首页的 Pricing 部分
2. 选择合适的计划
3. 点击升级按钮
4. 在演示模式下会显示提示信息
5. 生产环境会跳转到 Stripe Checkout

### 查看历史

1. 访问 `/dashboard/history`
2. 查看所有创作记录
3. 下载或删除作品

## 🎨 自定义配置

### 修改主题颜色

编辑 `app/globals.css`:

```css
:root {
  --background: #0a0a0a;
  --primary: #6366f1;       /* 主色调 */
  --primary-dark: #4f46e5;
}
```

### 添加新 AI 工具

编辑 `app/tools/page.tsx` 中的 `aiTools` 数组：

```typescript
{
  id: 'your-tool',
  name: 'Your Tool',
  description: 'Tool description',
  icon: YourIcon,
  color: 'from-blue-500 to-cyan-500',
  credits: 3,
  requiresUpload: true,
}
```

### 修改定价方案

编辑 `components/Pricing.tsx` 中的 `plans` 数组。

## 🔧 集成真实 AI API

当前版本使用模拟数据。要集成真实 AI API：

### 1. 图像生成 (Replicate/Stability AI)

```typescript
// app/api/generate/route.ts
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const output = await replicate.run(
    "stability-ai/sdxl:...",
    { input: { prompt } }
  );

  return Response.json({ imageUrl: output });
}
```

### 2. 背景移除 (Remove.bg)

```typescript
import FormData from 'form-data';
import fetch from 'node-fetch';

const formData = new FormData();
formData.append('image_file', imageBuffer, 'image.png');
formData.append('size', 'auto');

const response = await fetch('https://api.remove.bg/v1.0/removebg', {
  method: 'POST',
  headers: { 'X-Api-Key': process.env.REMOVEBG_API_KEY },
  body: formData,
});
```

## 📈 生产部署

### Vercel (推荐)

1. 推送代码到 GitHub
2. 在 Vercel 导入项目
3. 配置环境变量
4. 点击部署

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

### 环境变量检查清单

- [x] `STRIPE_SECRET_KEY`
- [x] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [x] `STRIPE_PRO_PRICE_ID`
- [x] `STRIPE_ENTERPRISE_PRICE_ID`
- [x] `NEXT_PUBLIC_APP_URL`

## 🧪 测试

### 测试账号

演示模式下，创建任意账号即可：

- Email: test@example.com
- Password: password123
- Name: Test User

### 测试支付

使用 Stripe 测试卡：

- 卡号: 4242 4242 4242 4242
- 日期: 任意未来日期
- CVC: 任意 3 位数字

## 🚧 已知限制

- **演示模式**: 当前使用 localStorage 存储数据
- **AI 功能**: 使用占位图片模拟 AI 处理
- **文件存储**: 需要集成 S3/Cloudflare R2
- **数据库**: 需要添加 PostgreSQL/MongoDB

## 🗺️ 路线图

### Phase 1 ✅ (已完成)
- [x] 基础 UI 和落地页
- [x] 用户认证系统
- [x] AI 工具界面
- [x] 积分系统
- [x] Stripe 集成准备

### Phase 2 🚧 (进行中)
- [ ] 真实 AI API 集成
- [ ] 数据库集成 (Prisma + PostgreSQL)
- [ ] 文件存储 (AWS S3)
- [ ] Email 通知
- [ ] 管理员仪表板

### Phase 3 📅 (计划中)
- [ ] API 访问
- [ ] Webhook 处理
- [ ] 批量处理
- [ ] 团队功能
- [ ] 高级分析

## 📄 许可证

MIT License

## 👨‍💻 作者

Built with ❤️ using Next.js, TypeScript, and AI

---

## 🤝 贡献

欢迎提交 Issues 和 Pull Requests!

## 📞 支持

如有问题，请提交 Issue 或联系开发团队。

---

**注意**: 这是一个功能完整的演示项目。生产环境使用需要：
1. 配置真实的 AI API
2. 集成数据库
3. 设置文件存储
4. 配置 Stripe webhook
5. 添加错误监控
