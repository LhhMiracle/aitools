# LWU AI Clone - AI Creative Suite Landing Page

一个类似 lwu.ai 的现代化 AI 创意工具平台落地页。使用 Next.js 14、TypeScript、Tailwind CSS 和 Framer Motion 构建。

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.0-ff0055)

## 特性

- ✨ **现代化暗色主题** - 精美的渐变色和毛玻璃效果
- 🎨 **响应式设计** - 完美适配所有设备尺寸
- ⚡ **流畅动画** - 使用 Framer Motion 实现的丝滑动画效果
- 🚀 **高性能** - 基于 Next.js 14 和 Turbopack
- 📱 **移动优先** - 优秀的移动端体验
- 🎯 **SEO 优化** - 预渲染和优化的元数据

## 页面组件

### 🏠 主要板块

1. **Hero 区域**
   - 引人注目的大标题和副标题
   - 渐变文字效果
   - 行动号召按钮
   - 统计数据展示
   - 动画背景渐变

2. **功能展示 (Features)**
   - 9个 AI 工具卡片
   - 悬停动画效果
   - 图标和渐变色
   - 响应式网格布局

3. **作品画廊 (Gallery)**
   - 分类筛选功能
   - 瀑布流布局
   - 悬停展示详情
   - 渐变占位图

4. **定价方案 (Pricing)**
   - 三个订阅层级
   - 特色标记（Most Popular）
   - 功能列表对比
   - CTA 按钮

5. **页头和页脚**
   - 固定顶部导航
   - 毛玻璃效果
   - 社交媒体链接
   - 多列链接布局

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **图标**: Lucide React
- **工具**: clsx (条件类名)

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看效果

### 构建生产版本

```bash
npm run build
npm start
```

## 项目结构

```
lwu-ai-clone/
├── app/
│   ├── globals.css          # 全局样式和主题变量
│   ├── layout.tsx            # 根布局
│   └── page.tsx              # 首页
├── components/
│   ├── Header.tsx            # 顶部导航
│   ├── Hero.tsx              # 英雄区域
│   ├── Features.tsx          # 功能展示
│   ├── Gallery.tsx           # 作品画廊
│   ├── Pricing.tsx           # 定价方案
│   └── Footer.tsx            # 页脚
├── public/                   # 静态资源
└── package.json              # 依赖配置
```

## 自定义配置

### 主题颜色

在 `app/globals.css` 中修改 CSS 变量：

```css
:root {
  --background: #0a0a0a;
  --foreground: #ededed;
  --primary: #6366f1;      /* 主色调 */
  --primary-dark: #4f46e5;
  --card-bg: #121212;
  --card-border: #1f1f1f;
}
```

### 添加新功能

在 `components/Features.tsx` 的 `features` 数组中添加新项：

```typescript
{
  icon: YourIcon,
  title: '功能名称',
  description: '功能描述',
  color: 'from-blue-500 to-cyan-500',
}
```

### 修改定价方案

在 `components/Pricing.tsx` 的 `plans` 数组中修改：

```typescript
{
  name: '方案名',
  price: 19,
  credits: 500,
  features: ['功能1', '功能2'],
  ...
}
```

## 部署

### Vercel (推荐)

1. 推送代码到 GitHub
2. 在 Vercel 导入项目
3. 点击部署

### 其他平台

```bash
npm run build
# 将 .next 文件夹和 node_modules 部署到服务器
```

## 后续优化建议

### 功能增强
- [ ] 添加用户认证系统（NextAuth.js）
- [ ] 集成真实的 AI API（Replicate, Stability AI）
- [ ] 实现文件上传功能
- [ ] 添加支付集成（Stripe）
- [ ] 创建用户仪表板
- [ ] 实现作品保存和分享

### 性能优化
- [ ] 添加图片懒加载
- [ ] 优化 Framer Motion 动画性能
- [ ] 实现 ISR (增量静态再生成)
- [ ] 添加 PWA 支持
- [ ] 优化 SEO 元数据

### UI/UX 改进
- [ ] 添加深色/浅色主题切换
- [ ] 实现更多微交互
- [ ] 添加加载骨架屏
- [ ] 优化移动端导航
- [ ] 添加多语言支持

## 许可证

MIT License

## 作者

Built with ❤️ using Next.js and AI

---

**注意**: 这是一个演示项目，用于学习和展示目的。实际的 AI 功能需要集成相应的 AI 服务 API。
