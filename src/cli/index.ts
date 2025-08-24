#!/usr/bin/env node

import { program } from 'commander';
import { initProject } from './commands/init';
import { generateContent } from './commands/generate';
import { buildSite } from './commands/build';
import { deploySite } from './commands/deploy';
import { previewSite } from './commands/preview';
import { generateSitemap } from './commands/sitemap';

import { readFileSync } from 'fs';
import { join } from 'path';
const packageJson = JSON.parse(readFileSync(join(__dirname, '../../package.json'), 'utf8'));

program
  .name('k2site')
  .description('关键词到网站自动生成器 - 从关键词快速生成SEO优化的静态站点')
  .version(packageJson.version);

// 初始化项目
program
  .command('init')
  .description('初始化一个新的 K2Site 项目')
  .option('-n, --name <name>', '项目名称', 'my-k2site')
  .option('-d, --domain <domain>', '网站域名', 'https://example.com')
  .option('-l, --language <language>', '网站语言', 'zh-CN')
  .action(initProject);

// 生成内容
program
  .command('generate')
  .description('从关键词生成内容')
  .requiredOption('-k, --keywords <keywords...>', '关键词列表')
  .option('-c, --category <category>', '内容分类', '技术教程')
  .option('-n, --number <number>', '生成文章数量', '5')
  .option('--cluster', '启用关键词聚类', false)
  .option('-l, --language <language>', '内容语言', 'zh-CN')
  .action(generateContent);

// 构建站点
program
  .command('build')
  .description('构建静态站点')
  .option('--clean', '清理构建缓存', false)
  .option('--verbose', '显示详细输出', false)
  .action(buildSite);

// 预览站点
program
  .command('preview')
  .description('预览构建后的站点')
  .option('-p, --port <port>', '预览端口', '4321')
  .option('-h, --host <host>', '预览主机', 'localhost')
  .action(previewSite);

// 部署站点
program
  .command('deploy')
  .description('部署站点到托管平台')
  .option('-t, --target <target>', '部署目标', 'cloudflare')
  .option('--token <token>', 'API Token')
  .action(deploySite);

// 生成站点地图
program
  .command('sitemap')
  .description('生成 sitemap.xml 和 robots.txt')
  .option('--force', '强制重新生成', false)
  .action(generateSitemap);

// 开发服务器
program
  .command('dev')
  .description('启动开发服务器')
  .option('-p, --port <port>', '开发服务器端口', '4321')
  .option('-h, --host <host>', '开发服务器主机', 'localhost')
  .action(async (options) => {
    const { spawn } = await import('child_process');
    const astroProcess = spawn('npx', ['astro', 'dev', '--port', options.port, '--host', options.host], {
      stdio: 'inherit',
      shell: true
    });
    
    astroProcess.on('close', (code) => {
      process.exit(code || 0);
    });
  });

// 版本检查
program
  .command('version')
  .description('显示版本信息')
  .action(() => {
    console.log(`K2Site CLI v${packageJson.version}`);
    console.log('Node.js:', process.version);
    console.log('Platform:', process.platform);
    console.log('Architecture:', process.arch);
  });

program.parse();