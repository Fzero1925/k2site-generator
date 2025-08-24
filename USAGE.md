# K2Site 使用指南

## 🚀 快速上手

### 新用户推荐流程

```bash
# 1. 克隆项目
git clone https://github.com/your-org/k2site.git
cd k2site

# 2. 一键启动（推荐新用户）
node quick-start.cjs
```

这个脚本会自动：
- 检查系统环境（Node.js、npm/pnpm）
- 安装项目依赖
- 检查和创建配置文件
- 生成示例内容
- 构建项目
- 启动开发服务器

### 自定义配置流程

```bash
# 运行交互式配置向导
node setup-wizard.cjs
```

配置向导会帮你设置：
- 站点基本信息（名称、域名、描述）
- SEO设置（关键词、作者、社交媒体）
- AdSense配置（客户端ID、GDPR合规）
- 内容设置（每页文章数、评论系统）
- 构建和部署选项

## 🎬 功能演示

### 查看所有功能
```bash
node demo.cjs
```

演示脚本包含：
- 自动生成5篇高质量示例文章
- 完整的SEO优化展示
- 响应式设计演示
- AdSense集成示例
- 法律页面模板

## 📝 内容管理

### 生成测试内容
```bash
node test-generate.cjs
```

### 手动创建内容
在 `src/content/posts/` 目录下创建 `.md` 文件：

```markdown
---
title: "文章标题"
description: "文章描述"
date: 2024-01-15
category: "分类"
tags: ["标签1", "标签2"]
author: "作者"
image: "封面图片URL"
---

# 文章内容

这里是文章正文...
```

## 🔧 开发流程

### 标准开发流程
```bash
# 1. 安装依赖
pnpm install

# 2. 启动开发服务器
pnpm dev

# 3. 构建项目
pnpm build

# 4. 预览构建结果
pnpm preview
```

### 测试
```bash
# 运行单元测试
pnpm test

# 运行E2E测试
pnpm test:e2e

# 生成覆盖率报告
pnpm test --coverage
```

## 🚀 部署指南

### 一键自动部署
```bash
node auto-deploy.cjs
```

支持的平台：
- ✅ Vercel - 零配置，自动HTTPS
- ✅ Netlify - 全功能JAMstack托管
- ✅ Cloudflare Pages - 全球CDN，高性能
- ✅ GitHub Pages - 免费静态托管

### 指定平台部署
```bash
# 部署到Vercel
node auto-deploy.cjs --platform vercel

# 部署到Netlify
node auto-deploy.cjs --platform netlify

# 部署到Cloudflare Pages
node auto-deploy.cjs --platform cloudflare

# 部署到GitHub Pages
node auto-deploy.cjs --platform github
```

### 手动部署指导
```bash
node deploy-manual.cjs
```

## ⚙️ 配置详解

### 主配置文件 (k2.config.yaml)

```yaml
# 站点基本信息
site:
  name: "站点名称"
  domain: "https://yourdomain.com"
  description: "站点描述"
  language: "zh-CN"

# SEO设置
seo:
  defaultTitle: "默认标题"
  defaultDescription: "默认描述"
  keywords: ["关键词1", "关键词2"]
  author: "作者"
  openGraph: true
  twitterSite: "@twitter_handle"

# 广告变现
monetization:
  adsense:
    enabled: false  # 生产环境设为true
    clientId: "ca-pub-xxxxxxxxxxxxxxxx"
    autoAds: true
    gdpr:
      enabled: true
      consentMode: true

# 内容设置
content:
  postsPerPage: 10
  generateSitemap: true
  generateRSS: true
  comments:
    enabled: false
    provider: "Disqus"

# 构建设置
build:
  outputDir: "dist"
  publicPath: "/"
  compression: true
  pwa: false
```

### 环境变量 (.env)

```bash
# 必要的环境变量
SITE_NAME="你的站点名称"
SITE_DOMAIN="https://yourdomain.com"

# AdSense配置（如果启用）
ADSENSE_CLIENT_ID="ca-pub-xxxxxxxxxxxxxxxx"

# Google Analytics（可选）
GA_ID="G-XXXXXXXXXX"

# 构建优化
NODE_ENV="production"
```

## 🛠️ 实用工具

### 可用脚本概览

| 脚本文件 | 功能 | 使用场景 |
|---------|------|----------|
| `quick-start.cjs` | 一键启动项目 | 新用户快速上手 |
| `setup-wizard.cjs` | 交互式配置 | 自定义项目设置 |
| `demo.cjs` | 功能演示 | 查看所有功能 |
| `auto-deploy.cjs` | 自动部署 | 生产环境部署 |
| `deploy-manual.cjs` | 手动部署指导 | 自定义部署流程 |
| `test-generate.cjs` | 生成测试内容 | 内容测试和演示 |

### Package.json 脚本

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "test": "vitest",
    "test:e2e": "playwright test",
    "lint": "eslint . --fix",
    "format": "prettier --write .",
    "setup": "node setup-wizard.cjs",
    "quick-start": "node quick-start.cjs",
    "demo": "node demo.cjs",
    "deploy": "node auto-deploy.cjs"
  }
}
```

## 🔍 故障排除

### 常见问题解决

#### 依赖安装失败
```bash
# 清理缓存重新安装
pnpm store prune
rm -rf node_modules
pnpm install

# 或使用一键启动脚本
node quick-start.cjs
```

#### 构建失败
```bash
# 检查TypeScript错误
pnpm build

# 查看详细错误信息
pnpm build --verbose
```

#### 开发服务器启动失败
```bash
# 检查端口占用
lsof -i :4321

# 使用不同端口
pnpm dev --port 3000
```

#### 部署失败
```bash
# 使用自动部署脚本诊断
node auto-deploy.cjs

# 查看手动部署指导
node deploy-manual.cjs
```

### 性能问题

#### 构建速度慢
```bash
# 增加Node.js内存限制
export NODE_OPTIONS="--max-old-space-size=4096"
pnpm build
```

#### 开发服务器慢
```bash
# 清理.astro目录
rm -rf .astro
pnpm dev
```

## 📊 项目监控

### 构建分析
```bash
# 分析构建大小
pnpm build --analyze

# 查看依赖大小
npx bundle-analyzer dist
```

### 性能测试
```bash
# Lighthouse测试
npx lighthouse http://localhost:4321

# Core Web Vitals
npx web-vitals-measure http://localhost:4321
```

## 🎯 高级用法

### 自定义组件
在 `src/components/` 目录下创建 `.astro` 文件：

```astro
---
// MyComponent.astro
export interface Props {
  title: string;
}

const { title } = Astro.props;
---

<div class="my-component">
  <h2>{title}</h2>
  <slot />
</div>

<style>
.my-component {
  @apply bg-white p-4 rounded-lg shadow-md;
}
</style>
```

### 添加新页面
在 `src/pages/` 目录下创建文件：

```astro
---
// src/pages/about.astro
import BaseLayout from '@/layouts/BaseLayout.astro';
---

<BaseLayout title="关于我们">
  <main>
    <h1>关于我们</h1>
    <p>这是关于页面的内容。</p>
  </main>
</BaseLayout>
```

### 自定义样式
在 `src/styles/global.css` 中添加全局样式：

```css
/* 自定义CSS变量 */
:root {
  --primary-color: #0ea5e9;
  --secondary-color: #64748b;
}

/* 自定义组件样式 */
.custom-button {
  @apply bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors;
}
```

## 🔄 更新和维护

### 项目更新
```bash
# 拉取最新代码
git pull origin main

# 更新依赖
pnpm update

# 重新构建
pnpm build
```

### 内容更新
```bash
# 添加新内容后重新构建
pnpm build

# 重新生成sitemap
pnpm build
```

### 备份重要数据
- 配置文件：`k2.config.yaml`
- 内容目录：`src/content/`
- 自定义组件：`src/components/`
- 样式文件：`src/styles/`

## 📚 学习资源

### 官方文档
- [Astro 文档](https://docs.astro.build/)
- [TailwindCSS 文档](https://tailwindcss.com/docs)
- [TypeScript 文档](https://www.typescriptlang.org/docs/)

### 相关技术
- [Vite 构建工具](https://vitejs.dev/guide/)
- [Vitest 测试框架](https://vitest.dev/guide/)
- [Playwright E2E测试](https://playwright.dev/docs/intro)

---

**💡 提示**: 如果你是新用户，建议从 `node quick-start.cjs` 开始，它会引导你完成整个设置过程。如果需要自定义配置，可以运行 `node setup-wizard.cjs`。