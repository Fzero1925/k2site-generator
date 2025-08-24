#!/usr/bin/env node

/**
 * K2Site 用户网站创建脚本
 * 为用户创建基于关键词的个人/商业网站
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

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
  step: (msg) => console.log(`\n${colors.cyan}${colors.bold}🚀 ${msg}${colors.reset}`),
  header: (msg) => console.log(`\n${colors.magenta}${colors.bold}═══ ${msg} ═══${colors.reset}`)
};

// 创建readline接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

// 主函数
async function main() {
  log.header('K2Site 用户网站创建向导');
  
  console.log(`
${colors.cyan}欢迎使用K2Site！${colors.reset}

这个向导将帮助您：
• 创建个性化网站项目
• 基于您的关键词生成内容
• 配置网站设置和品牌信息
• 一键部署到生产环境

让我们开始吧！ 🎉
`);

  try {
    // 1. 收集项目信息
    const projectInfo = await collectProjectInfo();
    
    // 2. 收集关键词
    const keywords = await collectKeywords();
    
    // 3. 创建项目
    await createProject(projectInfo, keywords);
    
    // 4. 生成内容
    await generateContent(keywords, projectInfo);
    
    // 5. 显示完成信息
    showCompletionInfo(projectInfo);
    
  } catch (error) {
    log.error(`创建过程出错: ${error.message}`);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// 收集项目信息
async function collectProjectInfo() {
  log.step('项目基本信息');
  
  const projectName = await question('项目名称 (例: my-awesome-blog): ');
  const siteName = await question('网站名称 (例: 我的技术博客): ');
  const siteDescription = await question('网站描述 (例: 分享技术知识和经验): ');
  const authorName = await question('作者姓名: ');
  const siteDomain = await question('网站域名 (例: https://myblog.com): ') || 'https://example.com';
  
  return {
    projectName: projectName || 'my-k2site',
    siteName: siteName || 'K2Site 生成站',
    siteDescription: siteDescription || '基于关键词自动生成的专业网站',
    authorName: authorName || 'K2Site 用户',
    siteDomain
  };
}

// 收集关键词
async function collectKeywords() {
  log.step('内容关键词设置');
  
  console.log(`
请输入您想要生成内容的关键词。
这些关键词将用来自动生成网站文章内容。

示例:
• 技术类: "React教程", "JavaScript入门", "Node.js开发"
• 生活类: "健康饮食", "运动健身", "旅行攻略"  
• 商业类: "数字营销", "创业指南", "电子商务"
`);
  
  const keywordsInput = await question('请输入关键词 (用逗号分隔): ');
  const keywords = keywordsInput.split(',').map(k => k.trim()).filter(k => k.length > 0);
  
  if (keywords.length === 0) {
    log.warning('未输入关键词，将使用默认示例关键词');
    return ['技术教程', '实用指南', '最佳实践'];
  }
  
  const category = await question(`内容分类 (默认: ${detectCategory(keywords[0])}): `) || detectCategory(keywords[0]);
  
  log.success(`收集到 ${keywords.length} 个关键词: ${keywords.join(', ')}`);
  log.success(`内容分类: ${category}`);
  
  return { keywords, category };
}

// 智能检测分类
function detectCategory(keyword) {
  const categoryMap = {
    '技术|开发|编程|代码': '技术开发',
    '健康|运动|健身|养生': '健康生活', 
    '旅行|旅游|景点|攻略': '旅行攻略',
    '美食|菜谱|烹饪|食谱': '美食生活',
    '投资|理财|金融|股票': '投资理财',
    '教育|学习|考试|培训': '教育学习',
    '创业|商业|营销|管理': '商业管理'
  };
  
  for (const [pattern, category] of Object.entries(categoryMap)) {
    if (new RegExp(pattern).test(keyword)) {
      return category;
    }
  }
  
  return '实用教程';
}

// 创建项目
async function createProject(projectInfo, keywordData) {
  log.step('创建项目结构');
  
  const projectPath = path.join(process.cwd(), projectInfo.projectName);
  
  // 检查目录是否存在
  if (fs.existsSync(projectPath)) {
    const overwrite = await question(`目录 "${projectInfo.projectName}" 已存在，是否覆盖？ (y/N): `);
    if (overwrite.toLowerCase() !== 'y') {
      log.error('项目创建已取消');
      process.exit(1);
    }
    fs.rmSync(projectPath, { recursive: true });
  }
  
  // 创建项目目录
  fs.mkdirSync(projectPath, { recursive: true });
  process.chdir(projectPath);
  
  // 复制模板文件
  log.info('复制项目模板...');
  const templatePath = path.dirname(__dirname);
  
  const filesToCopy = [
    'package.json',
    'astro.config.mjs', 
    'tailwind.config.mjs',
    'tsconfig.json',
    'src',
    'public'
  ];
  
  filesToCopy.forEach(file => {
    const source = path.join(templatePath, file);
    const dest = path.join(projectPath, file);
    if (fs.existsSync(source)) {
      if (fs.lstatSync(source).isDirectory()) {
        copyDir(source, dest);
      } else {
        fs.copyFileSync(source, dest);
      }
    }
  });
  
  // 创建自定义配置
  log.info('生成项目配置...');
  createCustomConfig(projectInfo, keywordData);
  
  // 初始化git
  log.info('初始化Git仓库...');
  execSync('git init', { stdio: 'pipe' });
  
  log.success('项目结构创建完成');
}

// 递归复制目录
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src);
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry);
    const destPath = path.join(dest, entry);
    
    if (fs.lstatSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 创建自定义配置
function createCustomConfig(projectInfo, keywordData) {
  const config = `# K2Site 配置文件
site:
  name: "${projectInfo.siteName}"
  domain: "${projectInfo.siteDomain}"
  description: "${projectInfo.siteDescription}"
  language: "zh-CN"
  
author:
  name: "${projectInfo.authorName}"
  url: "/about"

seo:
  defaultTitle: "${projectInfo.siteName}"
  defaultDescription: "${projectInfo.siteDescription}"
  keywords: ${JSON.stringify(keywordData.keywords)}
  author: "${projectInfo.authorName}"
  openGraph: true
  twitterSite: "@${projectInfo.projectName}"

monetization:
  adsense:
    enabled: false
    clientId: "ca-pub-xxxxxxxxxxxxxxxx"
    autoAds: false
    gdpr:
      enabled: true
      consentMode: true

content:
  postsPerPage: 10
  generateSitemap: true
  generateRSS: true
  comments:
    enabled: false
    provider: "Disqus"
  
  # 内容生成设置
  generation:
    defaultCategory: "${keywordData.category}"
    keywords: ${JSON.stringify(keywordData.keywords)}
    minWords: 1500
    includeImages: true

build:
  outputDir: "dist"
  publicPath: "/"
  compression: true
  pwa: false

deployment:
  platform: "github"
  autoCI: true
`;
  
  fs.writeFileSync('k2.config.yaml', config);
  
  // 创建环境变量模板
  const envTemplate = `# K2Site 环境变量配置
SITE_NAME="${projectInfo.siteName}"
SITE_DOMAIN="${projectInfo.siteDomain}"
SEO_AUTHOR="${projectInfo.authorName}"

# AdSense配置（如果启用）
# ADSENSE_CLIENT_ID="ca-pub-xxxxxxxxxxxxxxxx"

# 开发环境配置
NODE_ENV="development"
`;
  
  fs.writeFileSync('.env.template', envTemplate);
  
  // 更新package.json
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  packageJson.name = projectInfo.projectName;
  packageJson.description = projectInfo.siteDescription;
  packageJson.author = projectInfo.authorName;
  
  fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
}

// 生成内容
async function generateContent(keywordData, projectInfo) {
  log.step('生成网站内容');
  
  const contentDir = 'src/content/posts';
  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
  }
  
  log.info(`基于 ${keywordData.keywords.length} 个关键词生成内容...`);
  
  // 为每个关键词生成文章
  const articles = keywordData.keywords.map((keyword, index) => {
    return generateArticle(keyword, keywordData.category, projectInfo, index);
  });
  
  // 写入文章文件
  articles.forEach((article, index) => {
    const filename = `${article.slug}.md`;
    const filepath = path.join(contentDir, filename);
    
    const frontmatter = `---
title: "${article.title}"
description: "${article.description}"
date: ${new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toISOString()}
category: "${keywordData.category}"
tags: ${JSON.stringify(article.tags)}
author: "${projectInfo.authorName}"
image: "${article.image}"
featured: ${index === 0}
draft: false
---

${article.content}`;
    
    fs.writeFileSync(filepath, frontmatter);
    log.success(`生成文章: ${article.title}`);
  });
  
  // 生成关于页面
  generateAboutPage(projectInfo);
  
  log.success(`成功生成 ${articles.length + 1} 个页面`);
}

// 生成文章
function generateArticle(keyword, category, projectInfo, index) {
  const templates = [
    { suffix: '完全指南', type: '教程' },
    { suffix: '实用技巧', type: '技巧' },
    { suffix: '最佳实践', type: '实践' },
    { suffix: '深度解析', type: '分析' },
    { suffix: '入门教程', type: '入门' }
  ];
  
  const template = templates[index % templates.length];
  const title = `${keyword}${template.suffix}`;
  const slug = keyword.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
  
  const images = [
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=400&fit=crop'
  ];
  
  return {
    title,
    slug,
    description: `全面深入的${keyword}指南，从基础概念到实际应用，帮助您掌握核心要点和最佳实践。`,
    tags: [keyword, template.type, category, '教程'],
    image: images[index % images.length],
    content: generateDetailedContent(keyword, template.type, category)
  };
}

// 生成详细内容
function generateDetailedContent(keyword, type, category) {
  const content = `# ${keyword}${type === '教程' ? '完全指南' : '实用' + type}

## 📖 概述

${keyword}是${category}领域的重要主题。无论您是初学者还是有经验的实践者，本文都将为您提供全面深入的见解和实用指导。

## 🎯 核心要点

### 什么是${keyword}？

${keyword}是一个${category}相关的概念/技术/方法，它具有以下特点：

- **实用性强** - 可以直接应用到实际工作中
- **学习价值高** - 掌握后能显著提升能力
- **应用广泛** - 在多个场景中都有用武之地

### 为什么重要？

在现代${category}实践中，${keyword}的重要性体现在：

1. **效率提升** - 帮助您更快速地完成任务
2. **质量保证** - 确保输出结果的专业性
3. **竞争优势** - 在同行中脱颖而出的关键技能

## 🚀 实际应用

### 基础应用

对于初学者，建议从以下基础应用开始：

#### 步骤1：理解基础
- 学习核心概念和原理
- 掌握基本术语和定义
- 了解应用场景和价值

#### 步骤2：动手实践  
- 从简单的示例开始
- 逐步增加复杂度
- 记录学习过程和心得

#### 步骤3：深入学习
- 探索高级功能和技巧
- 学习最佳实践和经验
- 参与社区讨论和交流

### 高级技巧

对于有经验的用户，这里分享一些高级技巧：

#### 优化策略
\`\`\`
// ${keyword}优化示例
const optimized = {
  efficiency: '提高执行效率',
  maintainability: '增强可维护性', 
  scalability: '支持规模扩展'
};
\`\`\`

#### 常见陷阱
需要注意避免以下常见问题：

- ❌ 过度复杂化设计
- ❌ 忽视性能影响
- ❌ 缺少错误处理

### 实践案例

以下是一个实际应用${keyword}的完整案例：

#### 背景
某${category}项目需要...[具体需求描述]

#### 解决方案
通过应用${keyword}相关技术，我们：
1. 分析问题根源
2. 设计解决方案
3. 实施和验证
4. 优化和改进

#### 效果
- 📈 效率提升 50%
- 🎯 准确率达到 95%
- 💰 成本降低 30%

## 📚 学习资源

### 推荐阅读
- 📖 《${keyword}权威指南》
- 📖 《${category}最佳实践》
- 📖 《现代${keyword}应用》

### 在线资源
- 🔗 官方文档和教程
- 🔗 社区论坛和讨论区
- 🔗 开源项目和代码示例

### 实践工具
- 🛠️ 专业开发工具
- 🛠️ 在线练习平台  
- 🛠️ 测试和验证工具

## ❓ 常见问题

### Q: 初学者如何快速上手${keyword}？

A: 建议按照以下路径学习：
1. 先理解基础概念和原理
2. 通过简单示例动手实践
3. 逐步尝试更复杂的应用
4. 参与社区交流和讨论

### Q: ${keyword}的学习难点是什么？

A: 主要难点包括：
- 概念理解：需要时间消化核心概念
- 实践应用：从理论到实践的转化
- 持续学习：技术不断发展需要跟上

### Q: 如何保持对${keyword}的持续学习？

A: 推荐以下方法：
- 关注行业动态和最新发展
- 参与相关项目和实践
- 与同行交流经验和心得
- 定期回顾和总结学习成果

## 🎯 总结

${keyword}是${category}领域不可忽视的重要主题。通过系统学习和持续实践，您将能够：

✅ **掌握核心概念** - 深度理解${keyword}的本质和原理  
✅ **应用实际项目** - 在工作中有效运用相关技能  
✅ **持续改进** - 不断优化和提升应用效果  
✅ **分享经验** - 帮助他人共同成长进步  

记住，学习是一个持续的过程。保持好奇心，勇于实践，相信您一定能够在${keyword}领域取得优异成果！

---

## 📞 互动交流

如果您在学习${keyword}过程中遇到问题，或者有经验想要分享，欢迎在评论区留言讨论。我们相信通过交流分享，大家都能获得更好的学习效果。

**相关文章推荐：**
- [${category}基础入门指南]
- [${keyword}进阶技巧分享]  
- [实战项目案例分析]

感谢您的阅读！记得关注我们获取更多优质内容。`;

  return content;
}

// 生成关于页面
function generateAboutPage(projectInfo) {
  const aboutContent = `---
title: "关于我们"
description: "了解${projectInfo.siteName}和我们的使命"
layout: "@/layouts/PageLayout.astro"
---

# 关于${projectInfo.siteName}

## 👋 欢迎来到我们的网站

${projectInfo.siteName}是由${projectInfo.authorName}创建的专业内容平台。我们致力于为读者提供高质量、有价值的内容和知识。

## 🎯 我们的使命

- **分享知识** - 传播有用的信息和经验
- **帮助成长** - 助力读者个人和专业发展  
- **建立社区** - 连接志同道合的学习者
- **持续创新** - 不断改进内容质量和用户体验

## ✨ 网站特色

### 高质量内容
所有内容都经过精心策划和创作，确保准确性和实用性。

### 用户体验优先
我们重视每一位访问者的体验，持续优化网站性能和可用性。

### 持续更新
定期发布新内容，保持信息的时效性和相关性。

## 📧 联系我们

有任何问题、建议或合作意向，欢迎与我们联系：

- **邮箱**: contact@${projectInfo.projectName}.com
- **作者**: ${projectInfo.authorName}
- **网站**: ${projectInfo.siteDomain}

## 🚀 技术支持

本网站使用K2Site技术构建，具有：
- 快速的页面加载速度
- 优秀的SEO优化
- 响应式设计
- 现代化的用户界面

感谢您访问${projectInfo.siteName}，希望您在这里找到有价值的内容！`;

  const aboutPath = 'src/pages/about.md';
  fs.writeFileSync(aboutPath, aboutContent);
  log.success('生成关于页面');
}

// 显示完成信息
function showCompletionInfo(projectInfo) {
  log.header('🎉 网站创建完成');
  
  console.log(`
${colors.green}✅ 恭喜！您的K2Site网站已成功创建！${colors.reset}

${colors.cyan}📁 项目信息：${colors.reset}
• 项目名称：${projectInfo.projectName}
• 网站名称：${projectInfo.siteName}
• 项目路径：${process.cwd()}

${colors.cyan}🚀 下一步操作：${colors.reset}

1. 安装依赖并启动开发服务器：
   ${colors.yellow}npm install${colors.reset}
   ${colors.yellow}npm run dev${colors.reset}

2. 查看您的网站：
   ${colors.blue}http://localhost:4321${colors.reset}

3. 构建生产版本：
   ${colors.yellow}npm run build${colors.reset}

4. 部署到GitHub Pages：
   ${colors.yellow}npm run deploy:github${colors.reset}

${colors.cyan}📝 管理内容：${colors.reset}
• 文章文件位置：${colors.blue}src/content/posts/${colors.reset}
• 配置文件：${colors.blue}k2.config.yaml${colors.reset}
• 自定义样式：${colors.blue}src/styles/global.css${colors.reset}

${colors.cyan}🛠️ 有用的命令：${colors.reset}
• ${colors.yellow}npm run generate${colors.reset} - 生成更多示例内容
• ${colors.yellow}npm run setup${colors.reset} - 重新配置网站设置
• ${colors.yellow}npm run deploy${colors.reset} - 部署到多个平台

${colors.green}🎊 开始您的内容创作之旅吧！${colors.reset}
`);
}

// 执行主函数
if (require.main === module) {
  main().catch((error) => {
    log.error(`创建失败: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { main };