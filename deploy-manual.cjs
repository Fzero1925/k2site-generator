#!/usr/bin/env node

// 手动部署脚本
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function runCommand(command, description) {
  console.log(`🔧 ${description}...`);
  try {
    const output = execSync(command, { 
      stdio: 'inherit', 
      encoding: 'utf8',
      cwd: __dirname
    });
    console.log(`✅ ${description} 完成`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} 失败:`, error.message);
    return false;
  }
}

function checkPrerequisites() {
  console.log('🔍 检查部署前提条件...');
  
  // 检查dist目录是否存在
  const distPath = path.join(__dirname, 'dist');
  if (!fs.existsSync(distPath)) {
    console.error('❌ dist目录不存在，请先运行 pnpm build');
    return false;
  }
  
  // 检查是否有index.html
  const indexPath = path.join(distPath, 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.error('❌ index.html不存在，构建可能失败');
    return false;
  }
  
  console.log('✅ 前提条件检查通过');
  return true;
}

function displayDeploymentInstructions() {
  console.log('\\n🚀 手动部署指南:');
  console.log('==================');
  
  console.log('\\n📁 构建输出位置:');
  console.log(`   ${path.join(__dirname, 'dist')}`);
  
  console.log('\\n🌐 支持的部署平台:');
  
  console.log('\\n1️⃣ Vercel (推荐):');
  console.log('   - 安装: npm i -g vercel');
  console.log('   - 部署: cd dist && vercel --prod');
  console.log('   - 或者: 直接在 vercel.com 上传 dist 文件夹');
  
  console.log('\\n2️⃣ Cloudflare Pages:');
  console.log('   - 在 Cloudflare Pages 创建新项目');
  console.log('   - 上传 dist 文件夹内容');
  console.log('   - 或使用 wrangler: wrangler pages publish dist');
  
  console.log('\\n3️⃣ Netlify:');
  console.log('   - 拖拽 dist 文件夹到 netlify.com');
  console.log('   - 或使用 CLI: netlify deploy --prod --dir=dist');
  
  console.log('\\n4️⃣ GitHub Pages:');
  console.log('   - 将 dist 内容推送到 gh-pages 分支');
  console.log('   - 或使用 GitHub Actions 自动部署');
  
  console.log('\\n5️⃣ 传统主机:');
  console.log('   - 通过 FTP 上传 dist 文件夹内容');
  console.log('   - 确保上传到网站根目录');
}

async function main() {
  console.log('🎯 K2Site 手动部署工具');
  console.log('========================\\n');
  
  // 检查前提条件
  if (!checkPrerequisites()) {
    process.exit(1);
  }
  
  // 确保最新构建
  console.log('\\n🏗️  确保使用最新构建...');
  if (!runCommand('pnpm build', '构建项目')) {
    process.exit(1);
  }
  
  // 生成SEO文件
  console.log('\\n🔍 生成SEO文件...');
  try {
    // 创建简单的sitemap和robots
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
    
    const robotsContent = `User-agent: *
Allow: /

Sitemap: https://example.com/sitemap.xml`;
    
    fs.writeFileSync(path.join(__dirname, 'dist', 'sitemap.xml'), sitemapContent);
    fs.writeFileSync(path.join(__dirname, 'dist', 'robots.txt'), robotsContent);
    console.log('✅ SEO文件生成完成');
  } catch (error) {
    console.warn('⚠️  SEO文件生成失败，但不影响部署');
  }
  
  // 显示部署说明
  displayDeploymentInstructions();
  
  console.log('\\n🎊 准备就绪！选择上述任一方式进行部署。');
  console.log('\\n💡 提示: 部署前请确保在 k2.config.yaml 中设置正确的域名。');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { checkPrerequisites, runCommand };