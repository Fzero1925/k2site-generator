#!/usr/bin/env node

/**
 * K2Site CLI 入口点
 * 全局可执行命令
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// 检查是否在K2Site项目目录中
function isInK2SiteProject() {
  return fs.existsSync('k2.config.yaml') || fs.existsSync('package.json');
}

// 获取项目根目录
function getProjectRoot() {
  let currentDir = process.cwd();
  
  while (currentDir !== path.dirname(currentDir)) {
    if (fs.existsSync(path.join(currentDir, 'k2.config.yaml'))) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }
  
  return null;
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  // 如果没有命令或者是help，显示帮助
  if (!command || command === 'help' || command === '--help' || command === '-h') {
    showHelp();
    return;
  }
  
  // 版本命令
  if (command === 'version' || command === '--version' || command === '-v') {
    showVersion();
    return;
  }
  
  // init命令可以在任何地方运行
  if (command === 'init') {
    await handleInit(args.slice(1));
    return;
  }
  
  // create命令创建新项目
  if (command === 'create') {
    await handleCreate(args.slice(1));
    return;
  }
  
  // 其他命令需要在K2Site项目目录中运行
  const projectRoot = getProjectRoot();
  if (!projectRoot) {
    console.error('❌ 错误: 当前目录不是K2Site项目');
    console.log('');
    console.log('请在K2Site项目目录中运行此命令，或使用以下命令创建新项目:');
    console.log('  k2site create <project-name>');
    console.log('  k2site init');
    process.exit(1);
  }
  
  // 切换到项目根目录
  process.chdir(projectRoot);
  
  // 执行具体命令
  switch (command) {
    case 'generate':
    case 'g':
      await handleGenerate(args.slice(1));
      break;
    case 'build':
      await handleBuild();
      break;
    case 'dev':
    case 'serve':
      await handleDev(args.slice(1));
      break;
    case 'preview':
      await handlePreview(args.slice(1));
      break;
    case 'deploy':
      await handleDeploy(args.slice(1));
      break;
    default:
      console.error(`❌ 未知命令: ${command}`);
      showHelp();
      process.exit(1);
  }
}

// 显示帮助信息
function showHelp() {
  console.log(`
🚀 K2Site CLI - 关键词到网站自动生成器

使用方法:
  k2site <command> [options]

命令:
  create <name>              创建新的K2Site项目
  init                      在当前目录初始化K2Site项目
  generate -k <keywords...>  从关键词生成内容
  build                     构建静态站点
  dev                       启动开发服务器
  preview                   预览构建后的站点
  deploy                    部署站点

生成内容:
  k2site generate -k "React教程" "JavaScript入门"
  k2site g -k "Vue.js" -c "前端开发" -n 3

项目管理:
  k2site create my-blog     # 创建新项目
  k2site build             # 构建站点
  k2site dev               # 开发服务器
  k2site deploy            # 部署站点

选项:
  -h, --help               显示帮助信息
  -v, --version            显示版本信息
  -k, --keywords           关键词列表
  -c, --category           内容分类
  -n, --number             生成数量

示例:
  k2site create my-awesome-blog
  cd my-awesome-blog
  k2site generate -k "机器学习" "深度学习" "AI应用"
  k2site build
  k2site deploy
`);
}

// 显示版本信息
function showVersion() {
  const packagePath = path.join(__dirname, '..', 'package.json');
  try {
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    console.log(`K2Site CLI v${pkg.version}`);
    console.log(`Node.js ${process.version}`);
    console.log(`Platform: ${process.platform} ${process.arch}`);
  } catch (error) {
    console.log('K2Site CLI v1.0.0');
  }
}

// 处理create命令
async function handleCreate(args) {
  const projectName = args[0];
  if (!projectName) {
    console.error('❌ 错误: 请指定项目名称');
    console.log('使用方法: k2site create <project-name>');
    process.exit(1);
  }
  
  console.log(`🚀 创建新项目: ${projectName}`);
  
  // 创建项目目录
  const projectPath = path.join(process.cwd(), projectName);
  if (fs.existsSync(projectPath)) {
    console.error(`❌ 错误: 目录 "${projectName}" 已存在`);
    process.exit(1);
  }
  
  // 克隆模板
  try {
    console.log('📦 下载K2Site模板...');
    execSync(`git clone https://github.com/Fzero1925/k2site-generator.git "${projectPath}"`, {
      stdio: 'inherit'
    });
    
    // 进入项目目录
    process.chdir(projectPath);
    
    // 清理git历史
    console.log('🧹 清理模板...');
    if (fs.existsSync('.git')) {
      fs.rmSync('.git', { recursive: true });
    }
    
    // 初始化新的git仓库
    execSync('git init', { stdio: 'pipe' });
    
    // 运行设置向导
    console.log('⚙️  启动配置向导...');
    execSync('node setup-wizard.cjs', { stdio: 'inherit' });
    
    console.log(`
✅ 项目创建成功！

下一步:
  cd ${projectName}
  k2site generate -k "你的关键词1" "你的关键词2"
  k2site dev
  k2site deploy

💡 更多帮助: k2site --help
`);
    
  } catch (error) {
    console.error('❌ 创建项目失败:', error.message);
    process.exit(1);
  }
}

// 处理init命令
async function handleInit(args) {
  console.log('🔧 初始化K2Site项目...');
  
  if (!fs.existsSync('package.json') && !fs.existsSync('k2.config.yaml')) {
    console.log('📦 设置项目结构...');
    
    // 克隆模板到临时目录
    const tempDir = path.join(process.cwd(), '.k2site-temp');
    execSync(`git clone https://github.com/Fzero1925/k2site-generator.git "${tempDir}"`, {
      stdio: 'pipe'
    });
    
    // 复制文件到当前目录
    const filesToCopy = [
      'package.json',
      'astro.config.mjs',
      'tailwind.config.mjs',
      'tsconfig.json',
      'k2.config.yaml',
      'src',
      'public',
      'setup-wizard.cjs',
      'quick-start.cjs',
      'auto-deploy.cjs',
      'deploy-github-pages.cjs'
    ];
    
    filesToCopy.forEach(file => {
      const source = path.join(tempDir, file);
      const dest = path.join(process.cwd(), file);
      if (fs.existsSync(source)) {
        execSync(`cp -r "${source}" "${dest}"`, { shell: true });
      }
    });
    
    // 清理临时目录
    fs.rmSync(tempDir, { recursive: true });
    
    console.log('✅ 项目结构设置完成');
  }
  
  // 运行设置向导
  if (fs.existsSync('setup-wizard.cjs')) {
    console.log('⚙️  启动配置向导...');
    execSync('node setup-wizard.cjs', { stdio: 'inherit' });
  }
  
  console.log('✅ K2Site项目初始化完成！');
}

// 处理generate命令
async function handleGenerate(args) {
  const keywords = [];
  let category = '技术教程';
  let number = 5;
  
  // 解析参数
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '-k' || arg === '--keywords') {
      // 收集所有后续的关键词，直到遇到下一个选项
      i++;
      while (i < args.length && !args[i].startsWith('-')) {
        keywords.push(args[i]);
        i++;
      }
      i--; // 回退一个，因为外层循环会自动增加
    } else if (arg === '-c' || arg === '--category') {
      category = args[++i];
    } else if (arg === '-n' || arg === '--number') {
      number = parseInt(args[++i]);
    }
  }
  
  if (keywords.length === 0) {
    console.error('❌ 错误: 请指定关键词');
    console.log('使用方法: k2site generate -k "关键词1" "关键词2"');
    process.exit(1);
  }
  
  console.log(`🎯 开始生成内容...`);
  console.log(`📝 关键词: ${keywords.join(', ')}`);
  console.log(`📂 分类: ${category}`);
  console.log(`📊 数量: ${Math.min(keywords.length, number)}`);
  console.log('');
  
  // 使用现有的内容生成脚本
  if (fs.existsSync('generate-sample.cjs')) {
    console.log('使用内置内容生成器...');
    execSync('node generate-sample.cjs', { stdio: 'inherit' });
  } else {
    // 创建基于关键词的内容
    await generateKeywordContent(keywords, category, number);
  }
}

// 生成基于关键词的内容
async function generateKeywordContent(keywords, category, maxNumber) {
  const contentDir = 'src/content/posts';
  
  // 确保内容目录存在
  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
  }
  
  const templates = {
    "教程": "完全指南",
    "技巧": "实用技巧",
    "对比": "全面对比", 
    "入门": "快速入门"
  };
  
  let count = 0;
  for (const keyword of keywords.slice(0, maxNumber)) {
    const template = Object.keys(templates)[count % Object.keys(templates).length];
    const suffix = templates[template];
    
    const article = {
      title: `${keyword}${suffix}：从基础到实践`,
      slug: keyword.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, ''),
      description: `深入学习${keyword}，从基础概念到实际应用的完整指南`,
      category: category,
      tags: [keyword, template, category],
      content: generateArticleContent(keyword, template)
    };
    
    const frontmatter = `---
title: "${article.title}"
description: "${article.description}"
date: ${new Date().toISOString()}
category: "${article.category}"
tags: ${JSON.stringify(article.tags)}
author: "K2Site"
image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=400&fit=crop&crop=entropy"
featured: ${count === 0}
draft: false
---

${article.content}`;
    
    const filePath = path.join(contentDir, `${article.slug}.md`);
    fs.writeFileSync(filePath, frontmatter);
    console.log(`✅ 生成文章: ${article.title}`);
    count++;
  }
  
  console.log(`\n🎉 成功生成 ${count} 篇文章！`);
  console.log('\n下一步:');
  console.log('  k2site build   # 构建站点');
  console.log('  k2site dev     # 启动开发服务器');
}

// 生成文章内容
function generateArticleContent(keyword, template) {
  return `# ${keyword}${template === "教程" ? "完全指南" : template}

## 简介

${keyword}是一个重要的主题，本文将为您提供全面深入的讲解。无论您是初学者还是有经验的开发者，都能从中获得有价值的知识。

## 核心概念

### 什么是${keyword}

${keyword}是...（这里应该有对核心概念的详细解释）

### 为什么重要

在现代技术栈中，${keyword}扮演着重要角色，主要体现在：

1. **提高效率** - 帮助开发者更快完成任务
2. **优化性能** - 提供更好的用户体验
3. **简化流程** - 减少重复工作和复杂性

## 实践应用

### 基础使用

以下是${keyword}的基础使用示例：

\`\`\`javascript
// ${keyword}示例代码
const example = {
  concept: '${keyword}',
  usage: 'practical application'
};

console.log('学习', example.concept);
\`\`\`

### 高级技巧

对于更复杂的场景，我们可以：

1. **优化策略** - 使用最佳实践
2. **性能调优** - 提升执行效率
3. **错误处理** - 增强稳定性

## 最佳实践

在使用${keyword}时，建议遵循以下最佳实践：

- ✅ 保持代码简洁清晰
- ✅ 添加适当的注释说明
- ✅ 进行充分的测试验证
- ✅ 考虑性能和可维护性

## 常见问题

### 如何开始学习${keyword}？

建议按以下步骤循序渐进：

1. 理解基础概念
2. 动手实践简单示例
3. 学习最佳实践
4. 应用到实际项目中

### 遇到问题怎么办？

- 查阅官方文档
- 参考社区资源
- 寻求技术支持
- 持续学习更新

## 总结

${keyword}是一个值得深入学习的重要主题。通过本文的介绍，相信您已经对其有了基本了解。

继续学习和实践，您将能够更好地掌握${keyword}，并在实际项目中发挥其价值。

---

*本文由K2Site自动生成，内容仅供参考学习使用。*`;
}

// 处理其他命令
async function handleBuild() {
  console.log('🔨 构建静态站点...');
  execSync('npm run build', { stdio: 'inherit' });
}

async function handleDev(args) {
  console.log('🚀 启动开发服务器...');
  const port = args.includes('-p') ? args[args.indexOf('-p') + 1] : '4321';
  execSync(`npm run dev -- --port ${port}`, { stdio: 'inherit' });
}

async function handlePreview(args) {
  console.log('👀 预览构建站点...');
  const port = args.includes('-p') ? args[args.indexOf('-p') + 1] : '4321';
  execSync(`npm run preview -- --port ${port}`, { stdio: 'inherit' });
}

async function handleDeploy(args) {
  console.log('🚀 部署站点...');
  
  if (args.includes('github') || args.includes('gh')) {
    execSync('node deploy-github-pages.cjs', { stdio: 'inherit' });
  } else {
    execSync('node auto-deploy.cjs', { stdio: 'inherit' });
  }
}

// 错误处理
process.on('uncaughtException', (error) => {
  console.error('❌ 未处理的错误:', error.message);
  process.exit(1);
});

// 运行主函数
main().catch((error) => {
  console.error('❌ 执行失败:', error.message);
  process.exit(1);
});