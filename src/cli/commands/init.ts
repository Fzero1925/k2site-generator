import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

interface InitOptions {
  name: string;
  domain: string;
  language: string;
}

export async function initProject(options: InitOptions): Promise<void> {
  const { name, domain, language } = options;
  const projectPath = join(process.cwd(), name);

  console.log(`🚀 正在初始化 K2Site 项目: ${name}`);

  // 检查项目目录是否已存在
  if (existsSync(projectPath)) {
    console.error(`❌ 错误: 目录 ${name} 已存在`);
    process.exit(1);
  }

  try {
    // 创建项目目录结构
    createDirectoryStructure(projectPath);
    
    // 生成配置文件
    generateConfigFile(projectPath, { name, domain, language });
    
    // 生成示例内容
    generateSampleContent(projectPath);
    
    // 生成 package.json
    generatePackageJson(projectPath, name);
    
    console.log(`✅ 项目 ${name} 初始化完成！`);
    console.log(`\n下一步操作:`);
    console.log(`  cd ${name}`);
    console.log(`  pnpm install`);
    console.log(`  k2site generate -k "你的关键词"`);
    console.log(`  k2site dev`);
    
  } catch (error) {
    console.error('❌ 初始化项目时发生错误:', error);
    process.exit(1);
  }
}

function createDirectoryStructure(projectPath: string): void {
  const directories = [
    'src/components',
    'src/layouts',
    'src/pages',
    'src/lib',
    'src/styles',
    'content/posts',
    'content/pages',
    'public/images',
    '.github/workflows'
  ];

  mkdirSync(projectPath, { recursive: true });
  
  directories.forEach(dir => {
    mkdirSync(join(projectPath, dir), { recursive: true });
  });
  
  console.log('📁 创建目录结构完成');
}

function generateConfigFile(projectPath: string, options: { name: string; domain: string; language: string }): void {
  const config = `site:
  name: "${options.name}"
  domain: "${options.domain}"
  language: "${options.language}"
  author:
    name: "K2Site Generator"
    url: "/about"
  themeColor: "#0ea5e9"

seo:
  brand: "${options.name}"
  ogDefaultImage: "/og-default.jpg"
  twitterHandle: "@${options.name.toLowerCase()}"

monetization:
  adsense:
    enabled: false
    clientId: ""
    slots:
      article_top: ""
      article_middle: ""
      sidebar_sticky: ""
  consent:
    mode: "basic"
    cmpProvider: ""

content:
  minWords: 1200
  addTOC: true
  addFAQ: true
  images:
    source: "unsplash"
    numPerPost: 2

build:
  target: "cloudflare"
`;

  writeFileSync(join(projectPath, 'k2.config.yaml'), config);
  console.log('⚙️  生成配置文件完成');
}

function generateSampleContent(projectPath: string): void {
  const samplePost = `---
title: "欢迎使用 K2Site"
description: "这是您的第一篇文章，介绍如何使用 K2Site 快速生成内容网站"
slug: "welcome-to-k2site"
date: "${new Date().toISOString().split('T')[0]}"
category: "教程"
tags: ["K2Site", "入门指南", "网站生成"]
---

# 欢迎使用 K2Site

恭喜您成功创建了第一个 K2Site 项目！这是一个功能强大的内容生成平台，可以帮助您快速创建SEO优化的网站。

## 快速开始

1. **生成内容**: 使用 \`k2site generate\` 命令从关键词生成文章
2. **预览网站**: 使用 \`k2site dev\` 启动开发服务器
3. **构建部署**: 使用 \`k2site build\` 和 \`k2site deploy\` 发布网站

## 主要特性

- 🚀 快速生成高质量内容
- 🔍 自动SEO优化
- 💰 AdSense集成
- 🌐 多平台部署
- 📱 响应式设计

## 下一步

编辑 \`k2.config.yaml\` 文件来自定义您的网站设置，然后开始生成内容吧！

祝您使用愉快！
`;

  writeFileSync(join(projectPath, 'content/posts/welcome.mdx'), samplePost);
  console.log('📝 生成示例内容完成');
}

function generatePackageJson(projectPath: string, name: string): void {
  const packageJson = {
    name: name.toLowerCase().replace(/\s+/g, '-'),
    version: "1.0.0",
    type: "module",
    scripts: {
      "dev": "astro dev",
      "build": "astro build",
      "preview": "astro preview",
      "k2site": "k2site"
    },
    dependencies: {
      "@astrojs/check": "^0.7.0",
      "@astrojs/mdx": "^3.0.0",
      "@astrojs/sitemap": "^3.1.4",
      "@astrojs/tailwind": "^5.1.0",
      "astro": "^4.11.0",
      "k2site": "^1.0.0"
    },
    devDependencies: {
      "typescript": "^5.5.2"
    }
  };

  writeFileSync(
    join(projectPath, 'package.json'), 
    JSON.stringify(packageJson, null, 2)
  );
  
  console.log('📦 生成 package.json 完成');
}