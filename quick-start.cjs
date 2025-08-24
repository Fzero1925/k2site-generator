#!/usr/bin/env node

/**
 * K2Site 一键启动脚本
 * 自动化项目初始化、依赖安装、内容生成和开发服务器启动
 */

const { execSync, spawn } = require('child_process');
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

// Promise化的question
const question = (query) => new Promise((resolve) => rl.question(query, resolve));

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
    log.success(description || '命令执行完成');
    return result;
  } catch (error) {
    log.error(`命令执行失败: ${error.message}`);
    if (!options.optional) {
      process.exit(1);
    }
    return null;
  }
}

// 检查必要的工具
function checkPrerequisites() {
  log.step('检查系统环境');
  
  const requirements = [
    { cmd: 'node --version', name: 'Node.js', required: true },
    { cmd: 'npm --version', name: 'npm', required: true },
    { cmd: 'pnpm --version', name: 'pnpm', required: false }
  ];

  let hasPnpm = false;
  
  for (const req of requirements) {
    try {
      const version = execSync(req.cmd, { stdio: 'pipe', encoding: 'utf8' }).trim();
      log.success(`${req.name}: ${version}`);
      if (req.name === 'pnpm') hasPnpm = true;
    } catch (error) {
      if (req.required) {
        log.error(`未找到必需的工具: ${req.name}`);
        log.error('请安装Node.js和npm后重试');
        process.exit(1);
      } else if (req.name === 'pnpm') {
        log.warning('未找到pnpm，将使用npm安装依赖');
      }
    }
  }

  return { hasPnpm };
}

// 安装依赖
function installDependencies(hasPnpm) {
  log.step('安装项目依赖');
  
  if (!fs.existsSync('package.json')) {
    log.error('未找到package.json文件');
    process.exit(1);
  }

  const packageManager = hasPnpm ? 'pnpm' : 'npm';
  const installCommand = hasPnpm ? 'pnpm install' : 'npm install';
  
  log.info(`使用 ${packageManager} 安装依赖...`);
  execCommand(installCommand, '依赖安装完成');
}

// 检查配置文件
async function checkConfiguration() {
  log.step('检查项目配置');
  
  const configFile = 'k2.config.yaml';
  if (!fs.existsSync(configFile)) {
    log.warning('未找到配置文件k2.config.yaml');
    
    const createConfig = await question('是否创建默认配置？(y/n): ');
    if (createConfig.toLowerCase() === 'y' || createConfig.toLowerCase() === 'yes') {
      const defaultConfig = `# K2Site 配置文件
site:
  name: "我的K2站点"
  domain: "https://example.com"
  description: "基于K2Site构建的智能内容站点"
  language: "zh-CN"

seo:
  defaultTitle: "我的K2站点"
  defaultDescription: "发现高质量内容，学习前沿知识"
  keywords: ["内容聚合", "知识分享", "学习资源"]
  author: "K2Site"
  twitterSite: "@k2site"

monetization:
  adsense:
    enabled: false
    clientId: "ca-pub-xxxxxxxxxxxxxxxx"
    autoAds: true

content:
  postsPerPage: 10
  generateSitemap: true
  generateRSS: true

build:
  outputDir: "dist"
  publicPath: "/"
`;
      
      fs.writeFileSync(configFile, defaultConfig);
      log.success('已创建默认配置文件');
    }
  } else {
    log.success('配置文件检查完成');
  }
}

// 生成示例内容
async function generateSampleContent() {
  log.step('生成示例内容');
  
  const contentDir = 'src/content/posts';
  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
  }

  const hasContent = fs.readdirSync(contentDir).filter(f => f.endsWith('.md')).length > 0;
  
  if (!hasContent) {
    log.info('检测到无内容，生成示例文章...');
    
    const generateContent = await question('是否生成示例内容？(y/n): ');
    if (generateContent.toLowerCase() === 'y' || generateContent.toLowerCase() === 'yes') {
      if (fs.existsSync('generate-sample.cjs')) {
        execCommand('node generate-sample.cjs', '示例内容生成完成', { optional: true });
      } else {
        log.warning('未找到内容生成脚本，请手动创建内容');
      }
    }
  } else {
    log.success('发现现有内容，跳过内容生成');
  }
}

// 构建项目
function buildProject() {
  log.step('构建项目');
  
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const buildScript = packageJson.scripts?.build;
  
  if (buildScript) {
    execCommand('pnpm build || npm run build', '项目构建完成');
  } else {
    log.warning('未找到构建脚本');
  }
}

// 启动开发服务器
async function startDevServer() {
  log.step('启动开发服务器');
  
  const startDev = await question('是否启动开发服务器？(y/n): ');
  if (startDev.toLowerCase() === 'y' || startDev.toLowerCase() === 'yes') {
    log.info('启动开发服务器...');
    log.info('服务器将在 http://localhost:4321 运行');
    log.info('按 Ctrl+C 停止服务器');
    
    // 使用spawn启动开发服务器
    const devProcess = spawn('pnpm', ['dev'], {
      stdio: 'inherit',
      shell: true
    });
    
    // 如果pnpm失败，尝试npm
    devProcess.on('error', (error) => {
      if (error.code === 'ENOENT') {
        log.warning('pnpm未找到，尝试使用npm...');
        const npmDevProcess = spawn('npm', ['run', 'dev'], {
          stdio: 'inherit',
          shell: true
        });
        
        npmDevProcess.on('error', (npmError) => {
          log.error(`无法启动开发服务器: ${npmError.message}`);
          process.exit(1);
        });
      } else {
        log.error(`启动开发服务器失败: ${error.message}`);
        process.exit(1);
      }
    });
    
    // 处理退出信号
    process.on('SIGINT', () => {
      log.info('\n正在关闭开发服务器...');
      devProcess.kill('SIGINT');
      process.exit(0);
    });
  }
}

// 显示使用帮助
function showHelp() {
  console.log(`
${colors.cyan}${colors.bold}K2Site 一键启动脚本${colors.reset}

${colors.yellow}功能：${colors.reset}
• 自动检查系统环境
• 安装项目依赖
• 检查和创建配置文件
• 生成示例内容（可选）
• 构建项目
• 启动开发服务器（可选）

${colors.yellow}使用方法：${colors.reset}
  node quick-start.cjs [选项]

${colors.yellow}选项：${colors.reset}
  --help, -h     显示帮助信息
  --build-only   仅构建项目，不启动开发服务器
  --no-install   跳过依赖安装
  --no-content   跳过内容生成

${colors.yellow}示例：${colors.reset}
  node quick-start.cjs                 # 完整流程
  node quick-start.cjs --build-only    # 仅构建
  node quick-start.cjs --no-install    # 跳过安装依赖
`);
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }
  
  log.header('K2Site 一键启动');
  
  try {
    // 1. 检查环境
    const { hasPnpm } = checkPrerequisites();
    
    // 2. 安装依赖（除非跳过）
    if (!args.includes('--no-install')) {
      installDependencies(hasPnpm);
    }
    
    // 3. 检查配置
    await checkConfiguration();
    
    // 4. 生成内容（除非跳过）
    if (!args.includes('--no-content')) {
      await generateSampleContent();
    }
    
    // 5. 构建项目
    buildProject();
    
    // 6. 启动开发服务器（除非仅构建）
    if (!args.includes('--build-only')) {
      await startDevServer();
    } else {
      log.success('项目构建完成！');
      log.info('运行 pnpm dev 或 npm run dev 启动开发服务器');
      log.info('运行 pnpm preview 或 npm run preview 预览构建结果');
    }
    
  } catch (error) {
    log.error(`启动过程出错: ${error.message}`);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// 执行主函数
main().catch((error) => {
  log.error(`未处理的错误: ${error.message}`);
  process.exit(1);
});