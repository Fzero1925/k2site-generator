#!/usr/bin/env node

/**
 * K2Site 快速演示脚本
 * 一键生成演示内容、启动服务器并展示项目功能
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

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
  step: (msg) => console.log(`\n${colors.cyan}${colors.bold}🎬 ${msg}${colors.reset}`),
  header: (msg) => console.log(`\n${colors.magenta}${colors.bold}═══ ${msg} ═══${colors.reset}`)
};

// 执行命令并显示输出
function execCommand(command, description, options = {}) {
  try {
    log.info(`执行: ${command}`);
    const result = execSync(command, {
      stdio: options.silent ? 'pipe' : 'inherit',
      encoding: 'utf8',
      cwd: process.cwd(),
      ...options
    });
    if (description) log.success(description);
    return { success: true, output: result };
  } catch (error) {
    log.error(`命令执行失败: ${error.message}`);
    if (!options.optional) {
      process.exit(1);
    }
    return { success: false, error: error.message };
  }
}

// 等待端口可用
function waitForPort(port, maxAttempts = 30) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    
    const checkPort = () => {
      attempts++;
      const req = http.request({
        hostname: 'localhost',
        port: port,
        method: 'HEAD',
        timeout: 1000
      }, (res) => {
        resolve(true);
      });
      
      req.on('error', (err) => {
        if (attempts >= maxAttempts) {
          reject(new Error(`端口 ${port} 在 ${maxAttempts} 次尝试后仍不可用`));
        } else {
          setTimeout(checkPort, 1000);
        }
      });
      
      req.end();
    };
    
    checkPort();
  });
}

// 生成演示内容
function generateDemoContent() {
  log.step('生成演示内容');
  
  const contentDir = 'src/content/posts';
  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
  }
  
  const demoArticles = [
    {
      title: '什么是K2Site：新一代智能建站工具',
      slug: 'what-is-k2site',
      category: '产品介绍',
      tags: ['K2Site', '建站工具', '智能生成'],
      description: 'K2Site是一个基于关键词自动生成网站的智能建站工具，让您从想法到上线只需几分钟。',
      content: `# 什么是K2Site：新一代智能建站工具

## 简介

K2Site是一个革命性的智能建站工具，它能够根据您提供的关键词自动生成完整的、SEO优化的网站。无论您是创业者、内容创作者还是营销人员，K2Site都能帮助您在最短时间内构建专业的网站。

## 核心功能

### 1. 智能内容生成
- 基于关键词自动生成高质量文章
- 智能SEO优化，提升搜索排名
- 自动生成网站结构和导航

### 2. 现代化技术栈
- 基于Astro构建，性能卓越
- TypeScript保证代码质量
- TailwindCSS提供现代化样式

### 3. 商业化支持
- 集成Google AdSense
- GDPR/CCPA合规支持
- 多平台一键部署

## 使用场景

K2Site特别适合以下场景：
- 内容营销网站
- 行业资讯平台  
- 个人博客
- 企业官网

## 开始使用

只需几个简单步骤：
1. 运行配置向导：\`node setup-wizard.cjs\`
2. 生成内容：\`node test-generate.cjs\`
3. 启动服务：\`pnpm dev\`

立即体验K2Site的强大功能！`
    },
    {
      title: 'K2Site技术架构深度解析',
      slug: 'k2site-architecture',
      category: '技术分析',
      tags: ['Astro', 'TypeScript', 'TailwindCSS', '架构'],
      description: '深入了解K2Site的技术架构设计，包括前端框架选择、构建流程和性能优化策略。',
      content: `# K2Site技术架构深度解析

## 技术栈选择

### 前端框架：Astro
我们选择Astro作为核心框架的原因：
- **零JavaScript默认**：页面默认为静态HTML，性能极佳
- **组件岛架构**：按需加载JavaScript，优化用户体验
- **多框架支持**：可集成React、Vue等其他框架

### 类型安全：TypeScript
TypeScript为项目带来：
- 编译时错误检查
- 更好的代码提示和自动补全
- 大型项目的可维护性

### 样式方案：TailwindCSS
TailwindCSS的优势：
- 实用程序类，快速开发
- 响应式设计支持
- 高度可定制化

## 项目结构

\`\`\`
src/
├── components/     # 可复用组件
├── layouts/       # 页面布局
├── pages/         # 页面路由
├── content/       # 内容集合
├── lib/          # 工具库
└── styles/       # 样式文件
\`\`\`

## 性能优化策略

1. **静态生成**：构建时生成静态HTML
2. **图片优化**：自动压缩和格式转换
3. **代码分割**：按需加载JavaScript
4. **CDN集成**：支持多CDN平台部署

## SEO优化

- 自动生成meta标签
- 结构化数据支持
- sitemap和robots.txt生成
- RSS订阅支持

K2Site的技术架构确保了卓越的性能和用户体验！`
    },
    {
      title: 'SEO优化完全指南：让你的网站脱颖而出',
      slug: 'seo-optimization-guide',
      category: 'SEO优化',
      tags: ['SEO', '搜索优化', 'Google', '排名'],
      description: '全面的SEO优化指南，包含技术SEO、内容优化和用户体验优化的最佳实践。',
      content: `# SEO优化完全指南：让你的网站脱颖而出

## 什么是SEO？

SEO（搜索引擎优化）是提升网站在搜索引擎中排名的策略和技术。良好的SEO能够：
- 提高网站可见性
- 增加有机流量
- 提升用户体验
- 建立品牌权威

## 技术SEO基础

### 1. 页面加载速度
- 优化图片大小和格式
- 使用CDN加速
- 压缩CSS和JavaScript
- 启用Gzip压缩

### 2. 移动端适配
- 响应式设计
- 移动端性能优化
- 触控友好的界面

### 3. 网站结构
- 清晰的URL结构
- 合理的内链建设
- XML站点地图
- 面包屑导航

## 内容优化策略

### 关键词研究
1. 使用Google Keyword Planner
2. 分析竞争对手关键词
3. 关注长尾关键词
4. 考虑搜索意图

### 内容创作
- 高质量原创内容
- 合理的关键词密度
- 良好的内容结构
- 定期更新维护

## 用户体验优化

### Core Web Vitals
- **LCP**：最大内容绘制 < 2.5s
- **FID**：首次输入延迟 < 100ms
- **CLS**：累积布局偏移 < 0.1

### 用户行为指标
- 降低跳出率
- 增加页面停留时间
- 提高页面浏览深度

## K2Site的SEO优势

K2Site内置了完整的SEO优化功能：
- 自动生成优化的meta标签
- 结构化数据支持
- 自动站点地图生成
- 性能优化配置

让SEO优化变得简单高效！`
    },
    {
      title: 'Google AdSense变现攻略：最大化广告收益',
      slug: 'adsense-monetization-guide',
      category: '变现技巧',
      tags: ['AdSense', '广告变现', '收益优化', '网站盈利'],
      description: 'Google AdSense完整变现指南，从申请到优化，教你最大化广告收益。',
      content: `# Google AdSense变现攻略：最大化广告收益

## AdSense简介

Google AdSense是世界上最大的在线广告平台之一，为网站所有者提供简单的变现方式。

## AdSense申请准备

### 网站要求
- 高质量原创内容
- 清晰的网站导航
- 良好的用户体验
- 完整的法律页面（隐私政策、条款等）

### 内容标准
- 至少20-30篇高质量文章
- 每篇文章1000+字
- 定期更新内容
- 避免版权问题

## 广告位优化

### 最佳广告位置
1. **页面顶部**：首屏可见区域
2. **内容中间**：文章段落之间
3. **侧边栏**：持续可见区域
4. **页面底部**：阅读完成后

### 广告格式选择
- **响应式广告**：适应不同屏幕尺寸
- **原生广告**：与内容自然融合
- **自动广告**：Google自动优化位置

## 收益优化策略

### 1. 流量质量提升
- 专注SEO优化
- 社交媒体推广
- 内容营销策略
- 建立回访用户群

### 2. 用户体验平衡
- 控制广告密度
- 避免侵入性广告
- 优化页面加载速度
- 提供有价值内容

### 3. A/B测试
- 测试不同广告位置
- 比较广告格式效果
- 优化广告颜色和样式
- 分析用户行为数据

## 合规性要求

### GDPR合规
- 用户同意管理
- 数据收集透明度
- 用户权利保护

### 内容政策
- 避免敏感内容
- 确保内容质量
- 遵守广告政策

## K2Site的AdSense集成

K2Site提供开箱即用的AdSense支持：
- 自动广告代码注入
- GDPR合规组件
- 广告位组件
- 性能监控工具

开始您的广告变现之旅！`
    },
    {
      title: '网站部署完全指南：从开发到上线',
      slug: 'deployment-complete-guide',
      category: '部署运维',
      tags: ['网站部署', 'CI/CD', '自动化', '运维'],
      description: '完整的网站部署指南，涵盖多平台部署方案和自动化CI/CD流程。',
      content: `# 网站部署完全指南：从开发到上线

## 现代化部署概述

现代网站部署已经从手动FTP上传发展为自动化CI/CD流程，具有以下特点：
- 自动化构建和部署
- 版本控制集成
- 零停机部署
- 回滚能力

## 主流部署平台对比

### 1. Vercel
**优势**：
- 零配置部署
- 自动HTTPS
- 全球CDN
- 无服务器函数支持

**适用场景**：静态网站、JAMstack应用

### 2. Netlify
**优势**：
- 强大的构建系统
- 表单处理
- 函数计算
- A/B测试支持

**适用场景**：静态网站、渐进式Web应用

### 3. Cloudflare Pages
**优势**：
- 全球网络覆盖
- DDoS防护
- 边缘计算
- 免费套餐慷慨

**适用场景**：需要高性能和安全性的网站

### 4. GitHub Pages
**优势**：
- 完全免费
- GitHub深度集成
- Jekyll支持
- 自定义域名

**适用场景**：个人项目、开源项目文档

## CI/CD最佳实践

### GitHub Actions工作流
\`\`\`yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build
      - uses: actions/deploy-pages@v2
\`\`\`

### 部署策略
1. **蓝绿部署**：零停机切换
2. **滚动部署**：逐步替换实例
3. **金丝雀部署**：小流量测试

## 性能监控

### 关键指标
- **TTFB**：首字节时间
- **FCP**：首次内容绘制
- **LCP**：最大内容绘制
- **CLS**：累积布局偏移

### 监控工具
- Google Analytics
- Google Search Console
- Lighthouse CI
- 自定义监控脚本

## 安全配置

### HTTPS配置
- 强制HTTPS重定向
- HSTS头部设置
- SSL证书自动续期

### 安全头部
\`\`\`
Content-Security-Policy: default-src 'self'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
\`\`\`

## K2Site部署解决方案

K2Site提供一键部署脚本：
- 多平台支持
- 自动配置
- 性能优化
- 安全设置

\`\`\`bash
# 一键部署
node auto-deploy.cjs

# 指定平台部署
node auto-deploy.cjs --platform vercel
\`\`\`

让部署变得简单高效！`
    }
  ];
  
  // 生成文章文件
  demoArticles.forEach(article => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30)); // 随机30天内的日期
    
    const frontmatter = `---
title: "${article.title}"
description: "${article.description}"
date: ${date.toISOString()}
category: "${article.category}"
tags: ${JSON.stringify(article.tags)}
author: "K2Site团队"
image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop&crop=entropy"
featured: ${Math.random() > 0.7}
draft: false
---

${article.content}`;
    
    fs.writeFileSync(path.join(contentDir, `${article.slug}.md`), frontmatter);
  });
  
  log.success(`已生成 ${demoArticles.length} 篇演示文章`);
  
  // 生成RSS和sitemap等附加内容
  generateAdditionalContent();
}

// 生成附加内容
function generateAdditionalContent() {
  // 确保法律页面存在
  const legalPages = [
    {
      name: 'about.md',
      title: '关于我们',
      content: `---
title: "关于我们"
description: "了解K2Site团队和我们的使命"
layout: "@/layouts/PageLayout.astro"
---

# 关于K2Site

## 我们的使命

K2Site致力于让每个人都能轻松创建专业的网站。我们相信技术应该为创造力服务，而不是成为创造的障碍。

## 团队理念

- **简单至上**：复杂的功能，简单的操作
- **性能优先**：追求极致的用户体验
- **开放共享**：拥抱开源，分享知识

## 联系我们

有任何问题或建议，欢迎联系我们：
- 邮箱：hello@k2site.com
- GitHub：https://github.com/k2site
- 技术支持：support@k2site.com

让我们一起创造更好的网络世界！`
    },
    {
      name: 'privacy.md',
      title: '隐私政策',
      content: `---
title: "隐私政策"
description: "K2Site隐私政策和数据处理说明"
layout: "@/layouts/PageLayout.astro"
---

# 隐私政策

最后更新：2024年1月

## 信息收集

我们可能收集以下信息：
- 访问日志和使用统计
- Cookie和类似技术
- 您主动提供的信息

## 信息使用

收集的信息用于：
- 改善网站功能和性能
- 提供个性化体验
- 进行数据分析和统计

## 第三方服务

本网站可能使用以下第三方服务：
- Google Analytics（网站分析）
- Google AdSense（广告服务）

## 您的权利

根据GDPR，您有权：
- 访问您的个人数据
- 更正不准确的数据
- 删除您的数据
- 限制数据处理

## 联系我们

如有隐私相关问题，请联系：privacy@k2site.com`
    }
  ];
  
  const pagesDir = 'src/pages';
  legalPages.forEach(page => {
    const pagePath = path.join(pagesDir, page.name);
    if (!fs.existsSync(pagePath)) {
      fs.writeFileSync(pagePath, page.content);
    }
  });
  
  log.success('附加内容生成完成');
}

// 安装依赖
function installDependencies() {
  log.step('安装项目依赖');
  
  const result = execCommand('pnpm install || npm install', '依赖安装完成', { optional: true });
  if (!result.success) {
    log.warning('依赖安装失败，请手动运行 npm install');
  }
}

// 构建项目
function buildProject() {
  log.step('构建项目');
  
  const result = execCommand('pnpm build || npm run build', '项目构建完成', { optional: true });
  if (result.success) {
    log.success('项目构建成功');
    
    // 显示构建结果统计
    if (fs.existsSync('dist')) {
      const files = getAllFiles('dist');
      const totalSize = files.reduce((acc, file) => {
        try {
          return acc + fs.statSync(file).size;
        } catch {
          return acc;
        }
      }, 0);
      
      log.info(`构建结果：${files.length} 个文件，总大小 ${(totalSize / 1024).toFixed(1)} KB`);
    }
  }
}

// 获取目录下所有文件
function getAllFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  
  const dirFiles = fs.readdirSync(dir);
  for (const file of dirFiles) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, files);
    } else {
      files.push(filePath);
    }
  }
  return files;
}

// 启动开发服务器
async function startDevServer() {
  log.step('启动演示服务器');
  
  log.info('正在启动开发服务器...');
  
  // 启动开发服务器
  const devProcess = spawn('pnpm', ['dev'], {
    stdio: 'pipe',
    shell: true
  });
  
  let serverReady = false;
  
  // 监听输出
  devProcess.stdout.on('data', (data) => {
    const output = data.toString();
    process.stdout.write(output);
    
    if (output.includes('Local:') || output.includes('localhost:4321')) {
      serverReady = true;
    }
  });
  
  devProcess.stderr.on('data', (data) => {
    const output = data.toString();
    if (!output.includes('warn') && !output.includes('Watch mode')) {
      process.stderr.write(output);
    }
  });
  
  // 如果pnpm失败，尝试npm
  devProcess.on('error', (error) => {
    if (error.code === 'ENOENT') {
      log.warning('pnpm未找到，尝试使用npm...');
      const npmDevProcess = spawn('npm', ['run', 'dev'], {
        stdio: 'inherit',
        shell: true
      });
    } else {
      log.error(`启动开发服务器失败: ${error.message}`);
    }
  });
  
  // 等待服务器启动
  try {
    await waitForPort(4321);
    showDemoInfo();
  } catch (error) {
    log.error('服务器启动超时');
  }
  
  // 处理退出信号
  process.on('SIGINT', () => {
    log.info('\n正在关闭演示服务器...');
    devProcess.kill('SIGINT');
    process.exit(0);
  });
  
  return devProcess;
}

// 显示演示信息
function showDemoInfo() {
  console.log(`
${colors.green}${colors.bold}🎉 K2Site 演示已启动！${colors.reset}

${colors.cyan}📍 访问地址：${colors.reset}
• 本地服务器：${colors.yellow}http://localhost:4321${colors.reset}

${colors.cyan}🎯 演示内容：${colors.reset}
• 5篇高质量演示文章
• 完整的SEO优化示例
• 响应式设计展示
• AdSense集成示例

${colors.cyan}🔍 探索功能：${colors.reset}
• 首页：内容展示和导航
• 文章页：SEO优化的内容页面
• 关于页面：完整的页面布局
• 隐私政策：法律合规示例

${colors.cyan}⚡ 快速测试：${colors.reset}
1. 浏览不同页面体验响应式设计
2. 检查页面源码查看SEO优化
3. 使用浏览器开发者工具测试性能
4. 尝试修改 k2.config.yaml 配置

${colors.cyan}🚀 下一步：${colors.reset}
• 运行 ${colors.yellow}node setup-wizard.cjs${colors.reset} 自定义配置
• 运行 ${colors.yellow}node auto-deploy.cjs${colors.reset} 部署到生产环境
• 查看 README.md 了解更多功能

${colors.green}按 Ctrl+C 停止演示服务器${colors.reset}
${colors.magenta}享受K2Site带来的便捷体验！${colors.reset} ✨
`);
}

// 显示帮助
function showHelp() {
  console.log(`
${colors.cyan}${colors.bold}K2Site 快速演示脚本${colors.reset}

${colors.yellow}功能：${colors.reset}
• 生成完整的演示内容
• 自动安装和构建项目
• 启动开发服务器
• 展示项目所有功能

${colors.yellow}使用方法：${colors.reset}
  node demo.cjs [选项]

${colors.yellow}选项：${colors.reset}
  --help, -h           显示帮助信息
  --content-only       仅生成演示内容
  --no-install         跳过依赖安装
  --no-build          跳过项目构建
  --port <number>     指定服务器端口 (默认: 4321)

${colors.yellow}示例：${colors.reset}
  node demo.cjs                    # 完整演示流程
  node demo.cjs --content-only     # 仅生成内容
  node demo.cjs --no-install       # 跳过安装依赖
`);
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }
  
  log.header('K2Site 快速演示');
  
  try {
    // 1. 生成演示内容
    generateDemoContent();
    
    // 仅生成内容则退出
    if (args.includes('--content-only')) {
      log.success('演示内容生成完成！');
      log.info('运行 pnpm dev 启动开发服务器');
      return;
    }
    
    // 2. 安装依赖（除非跳过）
    if (!args.includes('--no-install')) {
      installDependencies();
    }
    
    // 3. 构建项目（除非跳过）
    if (!args.includes('--no-build')) {
      buildProject();
    }
    
    // 4. 启动开发服务器
    await startDevServer();
    
  } catch (error) {
    log.error(`演示启动失败: ${error.message}`);
    process.exit(1);
  }
}

// 执行主函数
if (require.main === module) {
  main().catch((error) => {
    log.error(`未处理的错误: ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  generateDemoContent,
  buildProject,
  startDevServer,
  showDemoInfo
};