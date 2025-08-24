#!/usr/bin/env node

/**
 * K2Site GitHub Pages 自动部署脚本
 * 为用户网站提供一键部署到GitHub Pages的功能
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

// 检查必要工具
function checkPrerequisites() {
  log.step('检查部署环境');
  
  const requirements = [
    { cmd: 'git --version', name: 'Git', required: true },
    { cmd: 'node --version', name: 'Node.js', required: true },
    { cmd: 'gh --version', name: 'GitHub CLI', required: false }
  ];
  
  let hasGitHubCLI = false;
  
  for (const req of requirements) {
    const result = execCommand(req.cmd, { silent: true });
    if (result.success) {
      const version = result.output.trim();
      log.success(`${req.name}: ${version}`);
      if (req.name === 'GitHub CLI') hasGitHubCLI = true;
    } else {
      if (req.required) {
        log.error(`缺少必需工具: ${req.name}`);
        log.error('请先安装后重试');
        process.exit(1);
      } else if (req.name === 'GitHub CLI') {
        log.warning('未找到GitHub CLI，将使用手动模式');
        log.info('建议安装GitHub CLI: https://cli.github.com/');
      }
    }
  }
  
  return { hasGitHubCLI };
}

// 获取用户仓库信息
async function getRepositoryInfo() {
  log.step('配置仓库信息');
  
  // 检查是否已经是Git仓库
  const gitResult = execCommand('git rev-parse --is-inside-work-tree', { silent: true });
  if (!gitResult.success) {
    log.info('初始化新的Git仓库...');
    execCommand('git init');
  }
  
  // 获取现有远程仓库信息
  const remoteResult = execCommand('git remote get-url origin', { silent: true });
  let currentRepo = '';
  if (remoteResult.success) {
    currentRepo = remoteResult.output.trim();
    log.info(`发现现有仓库: ${currentRepo}`);
  }
  
  const repoName = await question(currentRepo ? 
    `GitHub仓库名称 (${currentRepo.split('/').pop()?.replace('.git', '')}): ` : 
    'GitHub仓库名称 (例: my-awesome-site): '
  );
  
  const userName = await question('GitHub用户名: ');
  
  const isPrivate = await question('创建私有仓库？(y/N): ');
  const private = isPrivate.toLowerCase() === 'y' || isPrivate.toLowerCase() === 'yes';
  
  return {
    repoName: repoName || currentRepo.split('/').pop()?.replace('.git', ''),
    userName,
    private,
    fullRepoUrl: `https://github.com/${userName}/${repoName || currentRepo.split('/').pop()?.replace('.git', '')}`
  };
}

// 构建项目
function buildProject() {
  log.step('构建项目');
  
  // 先检查是否有内容
  const contentDir = 'src/content/posts';
  if (fs.existsSync(contentDir)) {
    const posts = fs.readdirSync(contentDir).filter(f => f.endsWith('.md') && !f.startsWith('.'));
    if (posts.length === 0) {
      log.warning('未找到内容文件');
      const hasGenerateScript = fs.existsSync('generate-sample.cjs');
      if (hasGenerateScript) {
        log.info('自动生成示例内容...');
        execCommand('node generate-sample.cjs');
      } else {
        log.warning('请先添加内容文件到 src/content/posts/ 目录');
      }
    }
  }
  
  // 清理旧构建
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true });
  }
  
  // 执行构建
  log.info('开始构建项目...');
  const buildResult = execCommand('pnpm build || npm run build');
  if (!buildResult.success) {
    log.error('项目构建失败');
    log.error('请检查错误信息并修复后重试');
    process.exit(1);
  }
  
  // 验证构建结果
  if (!fs.existsSync('dist/index.html')) {
    log.error('构建验证失败: 未找到dist/index.html');
    process.exit(1);
  }
  
  log.success('项目构建完成');
}

// 创建GitHub Actions工作流
function createGitHubActionsWorkflow() {
  log.step('配置GitHub Actions');
  
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
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: |
          if [ -f "pnpm-lock.yaml" ]; then
            npm install -g pnpm
            pnpm install
          else
            npm ci
          fi
      
      - name: Generate sample content if needed
        run: |
          if [ ! "$(ls -A src/content/posts/*.md 2>/dev/null)" ] && [ -f "generate-sample.cjs" ]; then
            node generate-sample.cjs
          fi
      
      - name: Build site
        run: |
          if [ -f "pnpm-lock.yaml" ]; then
            pnpm build
          else
            npm run build
          fi
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
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
        uses: actions/deploy-pages@v4
`;
  
  const workflowPath = path.join(workflowDir, 'deploy.yml');
  fs.writeFileSync(workflowPath, workflowContent);
  log.success('GitHub Actions工作流创建完成');
  
  return workflowPath;
}

// 使用GitHub CLI创建和部署
async function deployWithGitHubCLI(repoInfo) {
  log.step('使用GitHub CLI部署');
  
  try {
    // 检查登录状态
    const loginResult = execCommand('gh auth status', { silent: true });
    if (!loginResult.success) {
      log.info('需要登录GitHub账户...');
      execCommand('gh auth login');
    }
    
    // 检查仓库是否已存在
    const repoCheckResult = execCommand(`gh repo view ${repoInfo.userName}/${repoInfo.repoName}`, { silent: true });
    
    if (!repoCheckResult.success) {
      // 创建新仓库
      log.info('创建GitHub仓库...');
      const visibility = repoInfo.private ? '--private' : '--public';
      const createCmd = `gh repo create ${repoInfo.repoName} ${visibility} --description "我的K2Site生成网站" --source=. --remote=origin --push`;
      
      const createResult = execCommand(createCmd);
      if (!createResult.success) {
        throw new Error('仓库创建失败');
      }
    } else {
      // 推送到现有仓库
      log.info('推送到现有仓库...');
      const remoteResult = execCommand('git remote get-url origin', { silent: true });
      if (!remoteResult.success) {
        execCommand(`git remote add origin ${repoInfo.fullRepoUrl}.git`);
      }
      
      execCommand('git add .');
      execCommand('git commit -m "Deploy K2Site website to GitHub Pages" || true');
      execCommand('git branch -M main');
      execCommand('git push -u origin main');
    }
    
    // 启用GitHub Pages
    log.info('配置GitHub Pages...');
    const pagesCmd = `gh api repos/${repoInfo.userName}/${repoInfo.repoName}/pages -X POST -f source="{branch:main,path:/}" -f build_type=workflow`;
    execCommand(pagesCmd, { silent: true }); // 忽略错误，可能已经启用
    
    log.success('GitHub Pages配置完成！');
    log.info(`网站将在几分钟后可访问: https://${repoInfo.userName}.github.io/${repoInfo.repoName}`);
    
  } catch (error) {
    log.error(`GitHub CLI部署失败: ${error.message}`);
    return false;
  }
  
  return true;
}

// 手动部署模式
async function deployManually(repoInfo) {
  log.step('手动部署模式');
  
  // 提交代码
  execCommand('git add .');
  execCommand('git commit -m "Deploy K2Site website to GitHub Pages" || true');
  
  // 设置远程仓库
  const remoteResult = execCommand('git remote get-url origin', { silent: true });
  if (!remoteResult.success) {
    execCommand(`git remote add origin ${repoInfo.fullRepoUrl}.git`);
  }
  
  // 推送代码
  execCommand('git branch -M main');
  const pushResult = execCommand('git push -u origin main');
  if (!pushResult.success) {
    log.error('代码推送失败');
    log.info('请检查GitHub仓库是否存在，以及是否有推送权限');
    return false;
  }
  
  log.success('代码推送完成！');
  
  // 显示手动配置说明
  console.log(`
${colors.yellow}接下来请手动配置GitHub Pages：${colors.reset}

1. 访问仓库设置页面:
   ${colors.cyan}${repoInfo.fullRepoUrl}/settings/pages${colors.reset}

2. 在 "Source" 部分选择:
   • Source: ${colors.green}Deploy from a branch${colors.reset}
   • Branch: ${colors.green}main${colors.reset}
   • Folder: ${colors.green}/ (root)${colors.reset}

3. 或者选择 GitHub Actions 部署:
   • Source: ${colors.green}GitHub Actions${colors.reset}
   • 工作流文件已自动创建

4. 保存设置后，网站将在几分钟后可访问:
   ${colors.cyan}https://${repoInfo.userName}.github.io/${repoInfo.repoName}${colors.reset}

${colors.green}部署完成！${colors.reset}
`);
  
  return true;
}

// 显示部署结果
function showDeploymentResult(repoInfo) {
  console.log(`
${colors.green}${colors.bold}🎉 部署完成！${colors.reset}

${colors.cyan}📍 仓库地址：${colors.reset}
${repoInfo.fullRepoUrl}

${colors.cyan}🌐 网站地址：${colors.reset}
https://${repoInfo.userName}.github.io/${repoInfo.repoName}
${colors.yellow}(可能需要几分钟才能生效)${colors.reset}

${colors.cyan}⚙️ 管理设置：${colors.reset}
${repoInfo.fullRepoUrl}/settings/pages

${colors.cyan}📊 Actions状态：${colors.reset}
${repoInfo.fullRepoUrl}/actions

${colors.green}恭喜！你的K2Site网站已成功部署到GitHub Pages！${colors.reset}

${colors.yellow}提示：${colors.reset}
• 每次推送到main分支都会自动重新部署
• 如需修改内容，编辑src/content/posts/目录下的文件
• 运行 'node generate-sample.cjs' 可以生成更多示例内容
`);
}

// 显示帮助信息
function showHelp() {
  console.log(`
${colors.cyan}${colors.bold}K2Site GitHub Pages 部署脚本${colors.reset}

${colors.yellow}功能：${colors.reset}
• 自动构建K2Site项目
• 创建GitHub仓库（如果不存在）
• 配置GitHub Actions工作流
• 一键部署到GitHub Pages

${colors.yellow}使用方法：${colors.reset}
  node deploy-github-pages.cjs [选项]

${colors.yellow}选项：${colors.reset}
  --help, -h           显示帮助信息
  --manual            强制使用手动模式（不使用GitHub CLI）
  --private           创建私有仓库
  --repo-name <name>  指定仓库名称
  --username <name>   指定GitHub用户名

${colors.yellow}示例：${colors.reset}
  node deploy-github-pages.cjs                    # 交互式部署
  node deploy-github-pages.cjs --manual           # 手动模式
  node deploy-github-pages.cjs --repo-name my-site --username john

${colors.yellow}前置要求：${colors.reset}
• Git 已安装并配置
• Node.js 18+ 已安装
• GitHub账户和仓库访问权限
• GitHub CLI (推荐，可选)
`);
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }
  
  log.header('K2Site GitHub Pages 部署');
  
  try {
    // 1. 检查环境
    const { hasGitHubCLI } = checkPrerequisites();
    const useManualMode = args.includes('--manual') || !hasGitHubCLI;
    
    // 2. 构建项目
    buildProject();
    
    // 3. 获取仓库信息
    const repoInfo = await getRepositoryInfo();
    
    // 4. 创建GitHub Actions工作流
    createGitHubActionsWorkflow();
    
    // 5. 部署
    let deploySuccess = false;
    
    if (useManualMode) {
      log.info('使用手动部署模式');
      deploySuccess = await deployManually(repoInfo);
    } else {
      log.info('使用GitHub CLI自动部署');
      deploySuccess = await deployWithGitHubCLI(repoInfo);
      if (!deploySuccess) {
        log.warning('GitHub CLI部署失败，切换到手动模式');
        deploySuccess = await deployManually(repoInfo);
      }
    }
    
    // 6. 显示结果
    if (deploySuccess) {
      showDeploymentResult(repoInfo);
    } else {
      log.error('部署失败，请检查错误信息');
      process.exit(1);
    }
    
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
  buildProject,
  createGitHubActionsWorkflow,
  deployWithGitHubCLI,
  deployManually
};