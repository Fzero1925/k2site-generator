#!/usr/bin/env node

/**
 * K2Site 自动部署脚本
 * 支持多平台一键部署：Vercel、Cloudflare Pages、Netlify、GitHub Pages
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

// 执行命令并返回结果
function execCommand(command, options = {}) {
  try {
    const result = execSync(command, {
      stdio: options.silent ? 'pipe' : 'inherit',
      encoding: 'utf8',
      cwd: process.cwd(),
      ...options
    });
    return { success: true, output: result };
  } catch (error) {
    if (!options.silent) {
      log.error(`命令执行失败: ${error.message}`);
    }
    return { success: false, error: error.message, output: null };
  }
}

// 检查是否为Git仓库
function checkGitRepo() {
  const result = execCommand('git rev-parse --is-inside-work-tree', { silent: true });
  return result.success;
}

// 初始化Git仓库
async function initGitRepo() {
  log.step('初始化Git仓库');
  
  if (!checkGitRepo()) {
    log.info('初始化新的Git仓库...');
    execCommand('git init');
    
    // 创建.gitignore
    const gitignoreContent = `# Dependencies
node_modules/
.pnpm-store/

# Build outputs
dist/
.astro/

# Environment variables
.env
.env.local
.env.production

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
logs
*.log
npm-debug.log*
pnpm-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
node_modules/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache
`;
    
    if (!fs.existsSync('.gitignore')) {
      fs.writeFileSync('.gitignore', gitignoreContent);
      log.success('已创建.gitignore文件');
    }
    
    // 添加所有文件并提交
    execCommand('git add .');
    execCommand('git commit -m "Initial commit: K2Site project setup"');
    log.success('Git仓库初始化完成');
  } else {
    log.success('Git仓库已存在');
  }
}

// 检查并安装CLI工具
async function checkCLITools() {
  log.step('检查部署工具');
  
  const tools = {
    vercel: { cmd: 'vercel --version', install: 'npm i -g vercel', name: 'Vercel CLI' },
    netlify: { cmd: 'netlify --version', install: 'npm i -g netlify-cli', name: 'Netlify CLI' },
    wrangler: { cmd: 'wrangler --version', install: 'npm i -g wrangler', name: 'Cloudflare Wrangler' },
    gh: { cmd: 'gh --version', install: '请访问 https://cli.github.com/ 安装', name: 'GitHub CLI' }
  };
  
  const available = {};
  
  for (const [key, tool] of Object.entries(tools)) {
    const result = execCommand(tool.cmd, { silent: true });
    if (result.success) {
      available[key] = true;
      log.success(`${tool.name}: 已安装`);
    } else {
      available[key] = false;
      log.warning(`${tool.name}: 未安装`);
      log.info(`安装命令: ${tool.install}`);
    }
  }
  
  return available;
}

// 构建项目
function buildProject() {
  log.step('构建项目');
  
  log.info('清理旧构建文件...');
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true });
  }
  
  log.info('开始构建...');
  const result = execCommand('pnpm build || npm run build');
  if (!result.success) {
    log.error('项目构建失败');
    process.exit(1);
  }
  
  log.success('项目构建完成');
  
  // 验证构建结果
  if (!fs.existsSync('dist/index.html')) {
    log.error('构建结果验证失败：未找到dist/index.html');
    process.exit(1);
  }
  
  log.success('构建结果验证通过');
}

// Vercel部署
async function deployToVercel() {
  log.step('部署到Vercel');
  
  // 检查是否已登录
  const loginResult = execCommand('vercel whoami', { silent: true });
  if (!loginResult.success) {
    log.info('需要登录Vercel账户...');
    execCommand('vercel login');
  }
  
  // 创建vercel.json配置
  const vercelConfig = {
    "buildCommand": "pnpm build",
    "outputDirectory": "dist",
    "devCommand": "pnpm dev",
    "installCommand": "pnpm install",
    "framework": "astro"
  };
  
  if (!fs.existsSync('vercel.json')) {
    fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));
    log.success('已创建vercel.json配置');
  }
  
  // 部署
  log.info('开始部署到Vercel...');
  const deployResult = execCommand('vercel --prod --yes');
  if (deployResult.success) {
    log.success('Vercel部署完成！');
  } else {
    log.error('Vercel部署失败');
  }
}

// Netlify部署
async function deployToNetlify() {
  log.step('部署到Netlify');
  
  // 检查是否已登录
  const loginResult = execCommand('netlify status', { silent: true });
  if (!loginResult.success) {
    log.info('需要登录Netlify账户...');
    execCommand('netlify login');
  }
  
  // 创建netlify.toml配置
  const netlifyConfig = `[build]
  publish = "dist"
  command = "pnpm build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[dev]
  command = "pnpm dev"
  port = 4321
`;
  
  if (!fs.existsSync('netlify.toml')) {
    fs.writeFileSync('netlify.toml', netlifyConfig);
    log.success('已创建netlify.toml配置');
  }
  
  // 部署
  log.info('开始部署到Netlify...');
  const deployResult = execCommand('netlify deploy --prod --dir=dist');
  if (deployResult.success) {
    log.success('Netlify部署完成！');
  } else {
    log.error('Netlify部署失败');
  }
}

// Cloudflare Pages部署
async function deployToCloudflare() {
  log.step('部署到Cloudflare Pages');
  
  // 检查是否已登录
  const loginResult = execCommand('wrangler whoami', { silent: true });
  if (!loginResult.success) {
    log.info('需要登录Cloudflare账户...');
    execCommand('wrangler login');
  }
  
  // 创建wrangler.toml配置
  const wranglerConfig = `name = "k2site"
compatibility_date = "2023-12-01"

[env.production]
vars = { NODE_ENV = "production" }

[[env.production.routes]]
pattern = "*"
zone_name = "example.com"
`;
  
  if (!fs.existsSync('wrangler.toml')) {
    fs.writeFileSync('wrangler.toml', wranglerConfig);
    log.success('已创建wrangler.toml配置');
    log.warning('请编辑wrangler.toml文件设置正确的域名');
  }
  
  // 部署
  log.info('开始部署到Cloudflare Pages...');
  const deployResult = execCommand('wrangler pages deploy dist');
  if (deployResult.success) {
    log.success('Cloudflare Pages部署完成！');
  } else {
    log.error('Cloudflare Pages部署失败');
  }
}

// GitHub Pages部署
async function deployToGitHubPages() {
  log.step('部署到GitHub Pages');
  
  // 检查GitHub CLI
  const ghResult = execCommand('gh --version', { silent: true });
  if (!ghResult.success) {
    log.error('GitHub CLI未安装，请访问 https://cli.github.com/ 安装');
    return;
  }
  
  // 检查是否已登录
  const loginResult = execCommand('gh auth status', { silent: true });
  if (!loginResult.success) {
    log.info('需要登录GitHub账户...');
    execCommand('gh auth login');
  }
  
  // 创建GitHub Actions工作流
  const workflowDir = '.github/workflows';
  if (!fs.existsSync(workflowDir)) {
    fs.mkdirSync(workflowDir, { recursive: true });
  }
  
  const workflowContent = `name: Deploy to GitHub Pages

on:
  push:
    branches: [ main, master ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: latest
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build site
        run: pnpm build
      
      - name: Setup Pages
        uses: actions/configure-pages@v3
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
`;
  
  const workflowPath = path.join(workflowDir, 'deploy.yml');
  if (!fs.existsSync(workflowPath)) {
    fs.writeFileSync(workflowPath, workflowContent);
    log.success('已创建GitHub Actions工作流');
  }
  
  // 推送到GitHub
  log.info('推送代码到GitHub...');
  
  // 添加远程仓库（如果不存在）
  const remoteResult = execCommand('git remote get-url origin', { silent: true });
  if (!remoteResult.success) {
    const repoName = await question('请输入GitHub仓库名称 (例: my-k2site): ');
    execCommand(`gh repo create ${repoName} --public --push --source=.`);
  } else {
    execCommand('git add .');
    execCommand('git commit -m "Add GitHub Pages deployment workflow" || true');
    execCommand('git push origin main || git push origin master');
  }
  
  log.success('GitHub Pages部署工作流已设置完成！');
  log.info('请在GitHub仓库设置中启用Pages功能');
}

// 显示部署选项
async function showDeploymentOptions(availableTools) {
  console.log(`
${colors.yellow}选择部署平台：${colors.reset}

${availableTools.vercel ? '✓' : '✗'} 1. Vercel           ${colors.cyan}(推荐，零配置)${colors.reset}
${availableTools.netlify ? '✓' : '✗'} 2. Netlify          ${colors.cyan}(全功能托管)${colors.reset}
${availableTools.wrangler ? '✓' : '✗'} 3. Cloudflare Pages ${colors.cyan}(全球CDN)${colors.reset}
${availableTools.gh ? '✓' : '✗'} 4. GitHub Pages     ${colors.cyan}(免费托管)${colors.reset}
  5. 手动部署          ${colors.cyan}(使用现有脚本)${colors.reset}
  6. 全部平台          ${colors.cyan}(依次部署到所有平台)${colors.reset}
  0. 退出
`);
  
  const choice = await question('请选择部署平台 (0-6): ');
  return choice.trim();
}

// 主部署函数
async function deployToAll(availableTools) {
  const platforms = [
    { key: 'vercel', name: 'Vercel', deploy: deployToVercel },
    { key: 'netlify', name: 'Netlify', deploy: deployToNetlify },
    { key: 'wrangler', name: 'Cloudflare Pages', deploy: deployToCloudflare },
    { key: 'gh', name: 'GitHub Pages', deploy: deployToGitHubPages }
  ];
  
  log.header('全平台部署');
  
  for (const platform of platforms) {
    if (availableTools[platform.key]) {
      log.step(`部署到${platform.name}`);
      try {
        await platform.deploy();
      } catch (error) {
        log.error(`${platform.name}部署失败: ${error.message}`);
      }
    } else {
      log.warning(`跳过${platform.name}：CLI工具未安装`);
    }
  }
}

// 显示帮助
function showHelp() {
  console.log(`
${colors.cyan}${colors.bold}K2Site 自动部署脚本${colors.reset}

${colors.yellow}功能：${colors.reset}
• 自动构建项目
• 支持多平台一键部署
• 自动配置部署文件
• Git仓库管理

${colors.yellow}支持的平台：${colors.reset}
• Vercel - 零配置部署，自动HTTPS
• Netlify - 全功能JAMstack托管
• Cloudflare Pages - 全球CDN，高性能
• GitHub Pages - 免费静态托管

${colors.yellow}使用方法：${colors.reset}
  node auto-deploy.cjs [选项]

${colors.yellow}选项：${colors.reset}
  --help, -h        显示帮助信息
  --platform <name> 指定部署平台
  --build-only      仅构建，不部署
  --no-git          跳过Git操作

${colors.yellow}示例：${colors.reset}
  node auto-deploy.cjs                    # 交互式选择平台
  node auto-deploy.cjs --platform vercel # 直接部署到Vercel
  node auto-deploy.cjs --build-only       # 仅构建项目
`);
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }
  
  log.header('K2Site 自动部署');
  
  try {
    // 1. 初始化Git仓库
    if (!args.includes('--no-git')) {
      await initGitRepo();
    }
    
    // 2. 构建项目
    buildProject();
    
    // 如果只构建，直接返回
    if (args.includes('--build-only')) {
      log.success('项目构建完成！');
      return;
    }
    
    // 3. 检查CLI工具
    const availableTools = await checkCLITools();
    
    // 4. 处理指定平台部署
    const platformIndex = args.findIndex(arg => arg === '--platform');
    if (platformIndex !== -1 && args[platformIndex + 1]) {
      const platform = args[platformIndex + 1].toLowerCase();
      switch (platform) {
        case 'vercel':
          if (availableTools.vercel) await deployToVercel();
          else log.error('Vercel CLI未安装');
          break;
        case 'netlify':
          if (availableTools.netlify) await deployToNetlify();
          else log.error('Netlify CLI未安装');
          break;
        case 'cloudflare':
        case 'cf':
          if (availableTools.wrangler) await deployToCloudflare();
          else log.error('Wrangler未安装');
          break;
        case 'github':
        case 'gh':
          if (availableTools.gh) await deployToGitHubPages();
          else log.error('GitHub CLI未安装');
          break;
        default:
          log.error(`未知平台: ${platform}`);
      }
      return;
    }
    
    // 5. 交互式选择部署平台
    while (true) {
      const choice = await showDeploymentOptions(availableTools);
      
      switch (choice) {
        case '0':
          log.info('退出部署');
          return;
        case '1':
          if (availableTools.vercel) {
            await deployToVercel();
          } else {
            log.error('Vercel CLI未安装');
          }
          break;
        case '2':
          if (availableTools.netlify) {
            await deployToNetlify();
          } else {
            log.error('Netlify CLI未安装');
          }
          break;
        case '3':
          if (availableTools.wrangler) {
            await deployToCloudflare();
          } else {
            log.error('Wrangler未安装');
          }
          break;
        case '4':
          if (availableTools.gh) {
            await deployToGitHubPages();
          } else {
            log.error('GitHub CLI未安装');
          }
          break;
        case '5':
          log.info('使用手动部署脚本...');
          if (fs.existsSync('deploy-manual.cjs')) {
            execCommand('node deploy-manual.cjs');
          } else {
            log.error('未找到手动部署脚本');
          }
          break;
        case '6':
          await deployToAll(availableTools);
          break;
        default:
          log.warning('无效选择，请重试');
          continue;
      }
      
      const continueChoice = await question('\n是否继续部署到其他平台？(y/n): ');
      if (continueChoice.toLowerCase() !== 'y' && continueChoice.toLowerCase() !== 'yes') {
        break;
      }
    }
    
    log.success('部署流程完成！');
    
  } catch (error) {
    log.error(`部署过程出错: ${error.message}`);
    process.exit(1);
  } finally {
    rl.close();
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
  deployToVercel,
  deployToNetlify,
  deployToCloudflare,
  deployToGitHubPages,
  buildProject,
  checkGitRepo,
  initGitRepo
};