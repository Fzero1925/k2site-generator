#!/usr/bin/env node

/**
 * K2Site 示例内容生成脚本
 * 为新用户提供快速体验内容
 */

const fs = require('fs');
const path = require('path');

// 颜色输出函数
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.magenta}${colors.bold}═══ ${msg} ═══${colors.reset}`)
};

// 示例文章模板
const sampleArticles = [
  {
    title: 'K2Site快速入门指南',
    slug: 'k2site-quick-start',
    description: '学习如何使用K2Site从关键词快速生成高质量网站',
    category: '使用指南',
    tags: ['K2Site', '快速入门', '网站生成'],
    content: `# K2Site快速入门指南

## 什么是K2Site

K2Site是一个革命性的网站生成工具，能够根据关键词自动生成SEO优化的静态网站。无论您是个人博主、企业主还是内容创作者，K2Site都能帮助您快速搭建专业网站。

## 核心特性

### 🚀 一键生成
- 输入关键词，自动生成结构化内容
- 智能SEO优化，提升搜索排名
- 响应式设计，适配所有设备

### 💰 变现就绪
- 预配置Google AdSense广告位
- GDPR/CCPA合规支持
- 自动生成法务页面

### ⚡ 高性能
- 基于Astro静态生成
- Core Web Vitals优化
- 全球CDN部署

## 快速开始

只需几个步骤即可上线您的网站：

1. **安装依赖**: \`npm install\`
2. **配置项目**: \`npm run setup\`
3. **生成内容**: \`npm run demo\`
4. **启动服务**: \`npm run dev\`
5. **部署上线**: \`npm run deploy\`

## 最佳实践

### 关键词选择
- 使用长尾关键词提高排名机会
- 关注用户搜索意图
- 保持关键词相关性

### 内容优化
- 确保内容原创性和价值性
- 定期更新维护内容
- 优化图片和媒体文件

### SEO策略
- 合理设置meta标签
- 构建内链体系
- 提高页面加载速度

开始使用K2Site，体验从关键词到网站的神奇转换！`
  },
  {
    title: '现代网站SEO优化完全攻略',
    slug: 'modern-seo-optimization',
    description: '2024年最新的网站SEO优化策略，从技术SEO到内容营销的完整指南',
    category: 'SEO优化',
    tags: ['SEO', '搜索优化', '网站排名', '流量增长'],
    content: `# 现代网站SEO优化完全攻略

## SEO的重要性

在数字化时代，SEO（搜索引擎优化）是网站成功的关键因素。良好的SEO能够：

- 提高网站在搜索结果中的排名
- 增加有机流量和用户访问
- 提升品牌知名度和权威性
- 降低营销成本，提高ROI

## 技术SEO基础

### 网站性能优化

#### Core Web Vitals
Google将用户体验作为排名因素，重点关注：
- **LCP (最大内容绘制)**: < 2.5秒
- **FID (首次输入延迟)**: < 100毫秒
- **CLS (累积布局偏移)**: < 0.1

#### 优化策略
1. **图片优化**: 使用WebP格式，启用懒加载
2. **代码压缩**: 最小化CSS、JavaScript文件
3. **缓存策略**: 配置浏览器和CDN缓存
4. **服务器优化**: 选择高性能主机服务

### 移动端优化

随着移动优先索引的普及：
- 确保网站完全响应式
- 优化移动端加载速度
- 简化移动端导航体验
- 测试移动端可用性

## 内容SEO策略

### 关键词研究

#### 工具推荐
- Google Keyword Planner
- SEMrush
- Ahrefs
- 长尾关键词工具

#### 关键词分类
1. **主关键词**: 核心业务词汇
2. **长尾关键词**: 具体、低竞争度词汇
3. **LSI关键词**: 语义相关词汇

### 内容创作原则

#### 用户价值第一
- 解决用户实际问题
- 提供独特见解和价值
- 保持内容新鲜度

#### 结构化写作
- 使用清晰的标题层次
- 添加目录和跳转链接
- 合理使用列表和表格

## 链接建设

### 内链优化
- 建立合理的站内链接结构
- 使用描述性锚文本
- 确保重要页面可访问性

### 外链策略
- 创建值得分享的优质内容
- 与行业相关网站建立关系
- 参与社区讨论和分享

## 技术实现

### 结构化数据
使用JSON-LD格式实现：
- 网站信息标记
- 文章内容标记
- 面包屑导航标记
- FAQ问答标记

### XML站点地图
- 自动生成并定期更新
- 提交到Google Search Console
- 包含最后修改时间

### Robots.txt
- 合理设置爬虫访问规则
- 避免重复内容被索引
- 指向XML站点地图

## 监控与分析

### 关键指标
- 有机流量增长
- 关键词排名变化
- 页面加载速度
- 用户行为数据

### 工具使用
- Google Analytics
- Google Search Console
- 第三方SEO工具

## K2Site的SEO优势

K2Site内置了完整的SEO优化功能：
- 自动生成优化的meta标签
- 结构化数据自动添加
- XML站点地图自动生成
- 性能优化配置
- 移动端友好设计

让SEO优化变得简单高效，专注于创造价值内容！`
  },
  {
    title: '静态网站生成器全面对比：Astro vs Next.js vs Gatsby',
    slug: 'static-site-generators-comparison',
    description: '深度对比主流静态网站生成器，帮你选择最适合的技术方案',
    category: '技术对比',
    tags: ['Astro', 'Next.js', 'Gatsby', '静态网站', '性能对比'],
    content: `# 静态网站生成器全面对比：Astro vs Next.js vs Gatsby

## 静态网站生成器的兴起

静态网站生成器(SSG)在现代Web开发中扮演着越来越重要的角色。它们能够在构建时预渲染页面，提供出色的性能、SEO友好性和安全性。

## 主流方案对比

### Astro - 现代化的岛屿架构

#### 核心特性
- **零JavaScript默认**: 页面默认为纯HTML
- **组件岛架构**: 按需加载交互组件
- **多框架支持**: 可混用React、Vue、Svelte等
- **优秀的开发体验**: 快速热重载，直观的文件路由

#### 适用场景
- 内容为主的网站
- 需要极致性能的场景
- 多技术栈团队
- SEO要求严格的项目

#### 优势
✅ 出色的性能表现
✅ 灵活的架构设计
✅ 优秀的开发者体验
✅ 内置优化功能

#### 劣势
❌ 生态相对较新
❌ 复杂交互需额外配置
❌ 学习曲线存在

### Next.js - 全栈React框架

#### 核心特性
- **多种渲染模式**: SSG、SSR、ISR
- **API Routes**: 全栈开发能力
- **图片优化**: 内置图片组件和优化
- **成熟生态**: 丰富的插件和社区资源

#### 适用场景
- React技术栈项目
- 需要服务端功能的应用
- 电商网站
- 企业级应用

#### 优势
✅ 功能完整全面
✅ 生态系统成熟
✅ Vercel深度集成
✅ 企业级支持

#### 劣势
❌ 包体积较大
❌ 配置复杂度高
❌ React绑定紧密

### Gatsby - GraphQL驱动

#### 核心特性
- **GraphQL数据层**: 统一的数据获取方式
- **丰富的插件系统**: 2000+插件生态
- **渐进式Web应用**: PWA功能内置
- **图片处理**: 强大的图片优化能力

#### 适用场景
- 数据源复杂的项目
- 需要PWA功能
- 营销网站
- 文档站点

#### 优势
✅ GraphQL强大数据层
✅ 插件生态丰富
✅ PWA支持完善
✅ 图片处理出色

#### 劣势
❌ 构建时间较长
❌ GraphQL学习成本
❌ 运行时性能一般

## 性能对比

### 构建速度
1. **Astro**: ⭐⭐⭐⭐⭐ (最快)
2. **Next.js**: ⭐⭐⭐⭐ (快)
3. **Gatsby**: ⭐⭐⭐ (中等)

### 运行时性能
1. **Astro**: ⭐⭐⭐⭐⭐ (零JS默认)
2. **Next.js**: ⭐⭐⭐⭐ (优化良好)
3. **Gatsby**: ⭐⭐⭐⭐ (PWA优化)

### Bundle大小
1. **Astro**: 最小（按需加载）
2. **Gatsby**: 中等（PWA增加体积）
3. **Next.js**: 较大（React运行时）

## 选择建议

### 选择Astro当你需要
- 极致的页面性能
- 内容驱动的网站
- 混合多种前端技术
- 简单直接的开发体验

### 选择Next.js当你需要
- React生态和工具链
- 服务端功能支持
- 企业级项目保障
- 复杂的应用逻辑

### 选择Gatsby当你需要
- 复杂的数据整合
- PWA功能支持
- 丰富的插件生态
- GraphQL数据查询

## K2Site的技术选择

K2Site选择Astro作为核心框架，原因包括：

1. **性能优先**: 零JavaScript默认，确保最快加载速度
2. **SEO友好**: 静态HTML生成，搜索引擎友好
3. **开发体验**: 简单直观，易于定制和扩展
4. **现代架构**: 岛屿架构支持按需交互

这使得K2Site能够生成高性能、SEO优化的网站，完美符合内容驱动型网站的需求。

选择合适的技术栈是成功的第一步，根据项目需求和团队技能做出明智选择！`
  }
];

function generateSampleContent() {
  log.header('生成示例内容');
  
  const contentDir = 'src/content/posts';
  
  // 确保内容目录存在
  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
    log.info('创建内容目录');
  }
  
  // 生成示例文章
  sampleArticles.forEach((article, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (index * 3)); // 每篇文章间隔3天
    
    const frontmatter = `---
title: "${article.title}"
description: "${article.description}"
date: ${date.toISOString()}
category: "${article.category}"
tags: ${JSON.stringify(article.tags)}
author: "K2Site Team"
image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=400&fit=crop&crop=entropy"
featured: ${index === 0}
draft: false
---

${article.content}`;
    
    const filePath = path.join(contentDir, `${article.slug}.md`);
    fs.writeFileSync(filePath, frontmatter);
    log.success(`生成文章: ${article.title}`);
  });
  
  log.success(`✨ 成功生成 ${sampleArticles.length} 篇示例文章`);
  log.info('现在可以运行 npm run dev 查看网站效果');
}

// 执行生成
if (require.main === module) {
  generateSampleContent();
}

module.exports = { generateSampleContent };