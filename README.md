# K2Site - 关键词到网站自动生成器

<div align="center">

![K2Site Logo](https://img.shields.io/badge/K2Site-v1.0.0-blue?style=for-the-badge&logo=astro)

**从关键词到网站，一键生成SEO优化的内容平台**

[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9+-blue.svg)](https://www.typescriptlang.org/)
[![Astro](https://img.shields.io/badge/Astro-4.11+-orange.svg)](https://astro.build/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4+-06B6D4.svg)](https://tailwindcss.com/)

[快速开始](#快速开始) • [功能特性](#功能特性) • [文档](#文档) • [示例](#示例) • [贡献](#贡献)

</div>

---

## 📖 简介

K2Site 是一个革命性的网站生成器，能够从简单的关键词自动创建完整的、SEO优化的静态网站。它专为内容创作者、SEO专家和开发者设计，让任何人都能快速搭建专业的内容平台。

### 🎯 一句话目标

输入关键词 → 自动选题 → 生成结构化内容 → 创建静态站点 → 内置SEO与合规 → 预配置AdSense → 一键部署

### 🌟 为什么选择 K2Site

- **⚡ 极速生成**: 从关键词到完整网站，仅需几分钟
- **🔍 SEO优先**: 自动生成结构化数据、sitemap、robots.txt
- **💰 变现就绪**: 预配置AdSense广告位和合规设置
- **📱 响应式**: 针对所有设备优化的现代化设计
- **🚀 性能优化**: Core Web Vitals友好，Lighthouse评分90+
- **⚖️ 合规完整**: 自动生成隐私政策、使用条款等法务页面

---

## 🚀 快速开始

### ⚡ 5分钟快速体验

```bash
# 1. 克隆项目
git clone https://github.com/your-org/k2site.git
cd k2site

# 2. 一键启动（自动安装依赖、生成内容、启动服务器）
node quick-start.cjs
```

🎉 就是这么简单！脚本会自动检查环境、安装依赖、生成演示内容并启动开发服务器。

### 🎬 演示模式

```bash
# 快速查看项目所有功能
node demo.cjs
```

### 🔧 配置向导

```bash
# 交互式配置项目设置
node setup-wizard.cjs
```

### 系统要求

- Node.js 18+ 
- pnpm (推荐) 或 npm
- Git

### 安装

```bash
# 1. 克隆项目
git clone https://github.com/your-org/k2site.git
cd k2site

# 2. 安装依赖
pnpm install

# 3. 全局安装CLI (可选)
pnpm link --global
```

### 一键启动体验

```bash
# 方式1: 使用一键启动脚本（推荐新手）
node quick-start.cjs

# 方式2: 使用配置向导
node setup-wizard.cjs

# 方式3: 快速演示
node demo.cjs
```

### 传统方式创建站点

```bash
# 1. 安装依赖
pnpm install

# 2. 生成演示内容
node test-generate.cjs

# 3. 启动开发服务器
pnpm dev

# 4. 构建生产版本
pnpm build
```

🎉 打开浏览器访问 `http://localhost:4321` 查看您的网站！

### 🛠️ 实用脚本

| 脚本 | 功能 | 使用场景 |
|------|------|----------|
| `quick-start.cjs` | 一键启动项目 | 新用户快速上手 |
| `setup-wizard.cjs` | 交互式配置向导 | 自定义项目设置 |
| `demo.cjs` | 快速演示 | 查看所有功能 |
| `auto-deploy.cjs` | 自动部署 | 生产环境部署 |
| `test-generate.cjs` | 生成测试内容 | 内容测试 |

---

## ✨ 功能特性

### 🤖 智能内容生成

- **关键词驱动**: 输入关键词自动生成高质量文章
- **搜索意图识别**: 自动识别信息型、交易型、导航型搜索意图
- **内容去重**: 智能避免重复内容生成
- **多格式支持**: Markdown/MDX，支持组件嵌入

### 🔍 SEO 全方位优化

- **结构化数据**: 自动生成 WebSite、Article、BreadcrumbList、FAQ Schema
- **元标签优化**: 自动生成 title、description、keywords
- **Open Graph**: 完整的社交媒体分享优化
- **站点地图**: 自动生成和更新 sitemap.xml
- **Robots.txt**: 智能搜索引擎爬虫配置
- **RSS Feed**: 自动生成 RSS 订阅源

### 💰 AdSense 集成

- **广告位预配置**: 文章顶部、中间、侧边栏广告位
- **延迟加载**: 不影响首屏加载性能
- **合规支持**: GDPR/CCPA 兼容的 Cookie 同意管理
- **Consent Mode**: Google Consent Mode v2 支持

### ⚡ 性能优化

- **静态生成**: 基于 Astro 的静态站点生成
- **图片优化**: 自动压缩、懒加载、WebP 转换
- **代码分割**: 按需加载，减少包体积
- **缓存策略**: 智能缓存配置
- **Core Web Vitals**: 针对性能指标优化

### 🎨 现代化设计

- **TailwindCSS**: 现代化的样式系统
- **响应式**: 完美适配桌面、平板、手机
- **暗色模式**: 支持明暗主题切换
- **无障碍性**: WCAG 2.1 AA 级别支持

### 🚀 一键部署

- **多平台支持**: Vercel、Cloudflare Pages、Netlify
- **CI/CD**: GitHub Actions 自动化部署
- **性能监控**: Lighthouse CI 集成
- **错误追踪**: 内置错误监控

---

## 📁 项目结构

```
k2site/
├── 📁 .github/          # GitHub Actions CI/CD
├── 📁 content/          # 内容文件
│   ├── 📁 posts/        # 文章内容 (.mdx)
│   └── 📁 pages/        # 静态页面
├── 📁 public/           # 静态资源
├── 📁 src/              # 源代码
│   ├── 📁 components/   # Astro 组件
│   ├── 📁 layouts/      # 页面布局
│   ├── 📁 lib/          # 工具库
│   ├── 📁 pages/        # 路由页面
│   ├── 📁 cli/          # CLI 命令
│   └── 📁 styles/       # 样式文件
├── 📁 tests/            # 测试文件
├── ⚙️ k2.config.yaml    # 配置文件
├── ⚙️ astro.config.mjs  # Astro 配置
├── ⚙️ tailwind.config.mjs # Tailwind 配置
└── 📄 package.json      # 项目配置
```

---

## ⚙️ 配置

### 基本配置 (k2.config.yaml)

```yaml
site:
  name: "我的内容站"
  domain: "https://mysite.com"
  language: "zh-CN"
  author:
    name: "作者名称"
    url: "/about"
  themeColor: "#0ea5e9"

seo:
  brand: "我的内容站"
  ogDefaultImage: "/og-default.jpg"
  twitterHandle: "@mysite"

monetization:
  adsense:
    enabled: false           # 生产环境设置为 true
    clientId: "ca-pub-xxx"   # AdSense 发布商ID
    slots:
      article_top: "xxx"
      article_middle: "xxx"
      sidebar_sticky: "xxx"
  consent:
    mode: "basic"            # basic | cmp | off

content:
  minWords: 1200             # 最少字数
  addTOC: true              # 添加目录
  addFAQ: true              # 添加常见问题
  images:
    source: "unsplash"      # 图片来源
    numPerPost: 2           # 每篇文章图片数

build:
  target: "cloudflare"      # vercel | cloudflare
```

### 环境变量

```bash
# .env.local
PUBLIC_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxx
PUBLIC_GA_ID=G-XXXXXXXXXX

# 部署相关
CLOUDFLARE_API_TOKEN=xxx
CLOUDFLARE_ACCOUNT_ID=xxx
VERCEL_TOKEN=xxx
```

---

## 🔧 CLI 命令

### 项目管理

```bash
# 初始化新项目
k2site init [项目名]

# 查看版本信息
k2site version
```

### 内容生成

```bash
# 从关键词生成内容
k2site generate -k "关键词1" "关键词2" "关键词3"

# 指定分类和数量
k2site generate -k "Vue.js" -c "前端开发" -n 5

# 启用关键词聚类
k2site generate -k "React" "Vue" "Angular" --cluster
```

### 开发与构建

```bash
# 启动开发服务器
k2site dev

# 构建生产版本
k2site build

# 预览构建结果
k2site preview

# 生成SEO文件
k2site sitemap
```

### 部署

```bash
# 一键自动部署（支持多平台）
node auto-deploy.cjs

# 指定平台部署
node auto-deploy.cjs --platform vercel
node auto-deploy.cjs --platform netlify
node auto-deploy.cjs --platform cloudflare

# 手动部署
node deploy-manual.cjs
```

---

## 📝 内容创作

### Frontmatter 格式

```yaml
---
slug: "react-hooks-guide"
date: "2024-01-15"
updated: "2024-01-20"
title: "React Hooks 完全指南"
description: "深入学习 React Hooks，从基础到高级用法的完整教程"
keywords: ["React", "Hooks", "useState", "useEffect"]
category: "前端开发"
tags: ["React", "JavaScript", "Hooks"]
image: "/images/react-hooks.jpg"
readingTime: 8
canonical: "https://mysite.com/react-hooks-guide"
references:
  - title: "React 官方文档"
    url: "https://react.dev"
---
```

### 内容结构

```markdown
# 标题 (H1)

简介段落，描述文章内容和目标读者...

## 目录

## 什么是 React Hooks (H2)

### useState 基础用法 (H3)

内容段落...

## 高级 Hooks 用法 (H2)

### 自定义 Hooks (H3)

## 总结

## 常见问题 FAQ

### React Hooks 有什么优势？

答案内容...
```

---

## 🎨 样式定制

### 主题配置

```css
/* src/styles/global.css */
:root {
  --color-primary: #0ea5e9;
  --color-secondary: #64748b;
  --color-accent: #f59e0b;
}

/* 自定义组件样式 */
.custom-component {
  @apply bg-primary text-white rounded-lg p-4;
}
```

### TailwindCSS 定制

```javascript
// tailwind.config.mjs
export default {
  theme: {
    extend: {
      colors: {
        primary: '#0ea5e9',
        secondary: '#64748b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
}
```

---

## 🔍 SEO 最佳实践

### 自动优化特性

- **标题优化**: 自动生成符合搜索引擎要求的标题
- **元描述**: 155-160字符的优化描述
- **结构化数据**: 完整的Schema.org标记
- **图片SEO**: 自动生成alt文本和优化文件名
- **内链建设**: 基于内容相关性的智能内链

### 手动优化建议

1. **关键词策略**: 使用长尾关键词，关注搜索意图
2. **内容质量**: 确保原创性和价值性
3. **更新频率**: 定期更新内容保持新鲜度
4. **外链建设**: 积极获取高质量外部链接

---

## 💰 AdSense 优化

### 准备工作

1. **内容准备**: 确保有足够的原创、高质量内容
2. **网站完善**: 添加必要的法务页面
3. **流量积累**: 建议有稳定的日访问量后再申请

### 广告位配置

```yaml
# k2.config.yaml
monetization:
  adsense:
    enabled: true
    clientId: "ca-pub-xxxxxxxxxxxxxxxx"
    slots:
      article_top: "1234567890"      # 文章顶部
      article_middle: "1234567891"   # 文章中间  
      sidebar_sticky: "1234567892"   # 侧边栏固定
```

### 合规设置

- **Cookie同意**: 自动处理EU用户的Cookie同意
- **Consent Mode**: Google Consent Mode v2集成
- **隐私政策**: 自动生成符合GDPR的隐私政策

---

## 🚀 部署指南

### Cloudflare Pages

1. **连接仓库**: 在Cloudflare Pages中连接GitHub仓库
2. **构建设置**:
   - 构建命令: `pnpm build`
   - 输出目录: `dist`
   - Node.js版本: `20`
3. **环境变量**: 设置必要的环境变量
4. **自定义域名**: 配置自定义域名和SSL

### Vercel

1. **导入项目**: 从GitHub导入项目
2. **构建设置**: Vercel会自动识别Astro项目
3. **环境变量**: 在项目设置中添加环境变量
4. **域名配置**: 添加自定义域名

### GitHub Actions 自动部署

项目包含完整的CI/CD配置，推送到main分支即可自动部署：

```yaml
# .github/workflows/deploy.yml
# 完整的CI/CD配置已包含：
# - 类型检查
# - 代码检查
# - 测试运行
# - 构建优化
# - 自动部署
# - 性能审核
```

---

## 🧪 测试

### 单元测试

```bash
# 运行所有测试
pnpm test

# 监听模式
pnpm test --watch

# 覆盖率报告
pnpm test --coverage
```

### E2E 测试

```bash
# 运行E2E测试
pnpm test:e2e

# 交互模式
pnpm test:e2e --ui

# 特定浏览器
pnpm test:e2e --project=chromium
```

### 性能测试

```bash
# Lighthouse CI
pnpm test:lighthouse

# 构建分析
pnpm build --analyze
```

---

## 📊 项目状态

### 完成度: 95% ✅

本项目已基本完成，所有核心功能都已实现并通过测试。

#### 已完成功能

- ✅ **核心架构**: Astro + TypeScript + TailwindCSS
- ✅ **智能内容生成**: 关键词驱动的内容生成系统
- ✅ **SEO优化套件**: Meta标签、结构化数据、sitemap
- ✅ **AdSense集成**: 广告位组件、GDPR合规
- ✅ **现代化UI**: 响应式设计、暗色模式
- ✅ **CLI工具**: 完整的命令行工具集
- ✅ **一键部署**: 支持Vercel、Cloudflare、Netlify
- ✅ **自动化脚本**: 简化项目启动和部署流程

### Core Web Vitals 优化

K2Site 针对 Google Core Web Vitals 进行了深度优化：

- **LCP (Largest Contentful Paint)**: < 2.5s ✅
- **FID (First Input Delay)**: < 100ms ✅
- **CLS (Cumulative Layout Shift)**: < 0.1 ✅

### 优化策略

1. **图片优化**: WebP格式、懒加载、尺寸优化 ✅
2. **代码分割**: 按路由和组件分割 ✅
3. **缓存策略**: 静态资源长期缓存 ✅
4. **预加载**: 关键资源预加载 ✅
5. **压缩**: Gzip/Brotli压缩 ✅

---

## 🔒 安全性

### 内置安全特性

- **CSP (内容安全策略)**: 防止XSS攻击
- **HTTPS强制**: 自动重定向到HTTPS  
- **依赖安全**: 定期安全扫描
- **输入验证**: 严格的输入过滤
- **敏感信息**: 环境变量安全管理

### 安全检查清单

- [ ] 敏感信息不在代码中硬编码
- [ ] 定期更新依赖包
- [ ] 使用HTTPS访问
- [ ] 配置适当的HTTP安全头
- [ ] 定期安全审计

---

## 🤝 贡献指南

### 开发环境

```bash
# 克隆项目
git clone https://github.com/your-org/k2site.git
cd k2site

# 安装依赖
pnpm install

# 启动开发
pnpm dev
```

### 提交规范

```bash
# 格式: type(scope): description
git commit -m "feat(cli): add new generate command"
git commit -m "fix(seo): correct meta description length"
git commit -m "docs(readme): update installation guide"
```

### Pull Request

1. Fork 项目
2. 创建功能分支: `git checkout -b feature/amazing-feature`
3. 提交更改: `git commit -m 'Add amazing feature'`
4. 推送分支: `git push origin feature/amazing-feature`
5. 创建 Pull Request

---

## 📋 路线图

### v1.1.0 (计划中)

- [ ] 多语言内容生成支持
- [ ] 图片自动生成和优化
- [ ] 内容模板系统
- [ ] 批量关键词处理

### v1.2.0 (计划中)

- [ ] 可视化内容编辑器
- [ ] A/B测试功能
- [ ] 高级分析面板
- [ ] 社交媒体集成

### v2.0.0 (远期规划)

- [ ] AI驱动的内容优化建议
- [ ] 多站点管理
- [ ] 企业级功能
- [ ] 插件系统

---

## 🆘 常见问题

### 🚀 快速解决方案

**Q: 如何最快上手项目？**
```bash
# 使用一键启动脚本
node quick-start.cjs
```

**Q: 如何自定义配置？**
```bash
# 运行交互式配置向导
node setup-wizard.cjs
```

**Q: 如何查看所有功能？**
```bash
# 运行演示脚本
node demo.cjs
```

**Q: 如何部署到生产环境？**
```bash
# 使用自动部署脚本
node auto-deploy.cjs
```

### 常见问题

**Q: 安装依赖时报错怎么办？**
```bash
# 使用一键启动脚本会自动处理
node quick-start.cjs

# 或手动清理缓存重试
pnpm store prune
rm -rf node_modules
pnpm install
```

**Q: Node.js版本不兼容？**
```bash
# 一键启动脚本会检查版本
node quick-start.cjs

# 或使用nvm切换Node.js版本
nvm install 20
nvm use 20
```

**Q: 生成的内容质量不满意？**
A: 可以通过以下方式优化：
- 使用更具体的长尾关键词
- 在配置中调整 `minWords` 参数
- 指定更精确的 `category` 分类
- 使用配置向导重新设置内容生成参数

**Q: 部署失败怎么办？**
```bash
# 使用自动部署脚本，它会检查所有必要条件
node auto-deploy.cjs

# 或使用手动部署获取详细指导
node deploy-manual.cjs
```

---

## 📄 许可证

本项目基于 [MIT License](LICENSE) 开源。

---

## 🙏 致谢

感谢以下开源项目的贡献：

- [Astro](https://astro.build/) - 现代化静态站点生成器
- [TailwindCSS](https://tailwindcss.com/) - 实用优先的CSS框架
- [TypeScript](https://www.typescriptlang.org/) - JavaScript的类型化超集
- [Vite](https://vitejs.dev/) - 下一代前端构建工具

---

## 📞 获取支持

### 🆘 遇到问题？

1. **查看项目状态**: 运行 `cat PROJECT_STATUS.md` 了解项目当前状态
2. **使用自动脚本**: 大多数问题可以通过自动化脚本解决
3. **查看配置**: 检查 `k2.config.yaml` 配置文件
4. **重新配置**: 运行 `node setup-wizard.cjs` 重新配置项目

### 💡 快速帮助

| 问题类型 | 解决方案 |
|----------|----------|
| 安装问题 | `node quick-start.cjs` |
| 配置问题 | `node setup-wizard.cjs` |
| 部署问题 | `node auto-deploy.cjs` |
| 功能演示 | `node demo.cjs` |
| 内容生成 | `node test-generate.cjs` |

### 📬 联系方式

- **Issues**: [GitHub Issues](https://github.com/your-org/k2site/issues)
- **讨论**: [GitHub Discussions](https://github.com/your-org/k2site/discussions)
- **邮箱**: support@k2site.com

---

<div align="center">

**⭐ 如果这个项目对您有帮助，请给我们一个星标！**

[⬆ 回到顶部](#k2site---关键词到网站自动生成器)

---

Made with ❤️ by the K2Site Team

</div>