#!/usr/bin/env node

/**
 * K2Site 交互式配置向导
 * 帮助用户快速配置项目设置
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const yaml = require('js-yaml');

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
  step: (msg) => console.log(`\n${colors.cyan}${colors.bold}🔧 ${msg}${colors.reset}`),
  header: (msg) => console.log(`\n${colors.magenta}${colors.bold}═══ ${msg} ═══${colors.reset}`)
};

// 创建readline接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Promise化的question
const question = (query) => new Promise((resolve) => rl.question(query, resolve));

// 验证函数
const validators = {
  required: (value) => value.trim() !== '',
  url: (value) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  adsenseId: (value) => /^ca-pub-\d{16}$/.test(value)
};

// 询问带验证的问题
async function askWithValidation(prompt, validator, defaultValue = '') {
  while (true) {
    const answer = await question(`${prompt}${defaultValue ? ` (${defaultValue})` : ''}: `);
    const value = answer.trim() || defaultValue;
    
    if (!validator || validator(value)) {
      return value;
    }
    
    log.error('输入格式不正确，请重试');
  }
}

// 询问是否问题
async function askYesNo(prompt, defaultValue = false) {
  const answer = await question(`${prompt} ${defaultValue ? '(Y/n)' : '(y/N)'}: `);
  const normalized = answer.toLowerCase().trim();
  
  if (normalized === '') return defaultValue;
  return ['y', 'yes', '是', '1', 'true'].includes(normalized);
}

// 选择列表
async function askChoice(prompt, choices, defaultIndex = 0) {
  console.log(`\n${prompt}`);
  choices.forEach((choice, index) => {
    const marker = index === defaultIndex ? '●' : '○';
    console.log(`  ${marker} ${index + 1}. ${choice}`);
  });
  
  while (true) {
    const answer = await question(`请选择 (1-${choices.length}, 默认: ${defaultIndex + 1}): `);
    const index = parseInt(answer) - 1;
    
    if (answer === '') return defaultIndex;
    if (index >= 0 && index < choices.length) return index;
    
    log.error('无效选择，请重试');
  }
}

// 站点基本信息配置
async function configureSiteInfo() {
  log.step('配置站点基本信息');
  
  const siteName = await askWithValidation(
    '站点名称',
    validators.required,
    'K2Site 演示站'
  );
  
  const siteDomain = await askWithValidation(
    '站点域名 (包含协议)',
    validators.url,
    'https://example.com'
  );
  
  const siteDescription = await askWithValidation(
    '站点描述',
    validators.required,
    '基于K2Site构建的智能内容站点'
  );
  
  const languages = ['zh-CN', 'en-US', 'ja-JP', 'ko-KR'];
  const languageIndex = await askChoice('选择站点语言', languages, 0);
  
  return {
    name: siteName,
    domain: siteDomain,
    description: siteDescription,
    language: languages[languageIndex]
  };
}

// SEO配置
async function configureSEO(siteInfo) {
  log.step('配置SEO设置');
  
  const defaultTitle = await askWithValidation(
    '默认页面标题',
    validators.required,
    siteInfo.name
  );
  
  const defaultDescription = await askWithValidation(
    '默认页面描述',
    validators.required,
    siteInfo.description
  );
  
  const keywords = await askWithValidation(
    '关键词 (用逗号分隔)',
    null,
    '内容聚合,知识分享,学习资源'
  );
  
  const author = await askWithValidation(
    '作者',
    validators.required,
    'K2Site'
  );
  
  const enableOG = await askYesNo('启用Open Graph社交分享优化', true);
  
  let twitterSite = '';
  if (enableOG) {
    twitterSite = await askWithValidation(
      'Twitter用户名 (可选，以@开头)',
      null,
      '@k2site'
    );
  }
  
  return {
    defaultTitle,
    defaultDescription,
    keywords: keywords.split(',').map(k => k.trim()),
    author,
    enableOG,
    twitterSite
  };
}

// AdSense配置
async function configureAdsense() {
  log.step('配置AdSense广告');
  
  const enableAdsense = await askYesNo('启用Google AdSense', false);
  
  if (!enableAdsense) {
    return { enabled: false };
  }
  
  const clientId = await askWithValidation(
    'AdSense客户端ID (ca-pub-xxxxxxxxxxxxxxxx)',
    validators.adsenseId,
    'ca-pub-0000000000000000'
  );
  
  const autoAds = await askYesNo('启用自动广告', true);
  
  const enableGDPR = await askYesNo('启用GDPR合规支持', true);
  
  let consentMode = false;
  if (enableGDPR) {
    consentMode = await askYesNo('启用Google Consent Mode v2', true);
  }
  
  return {
    enabled: true,
    clientId,
    autoAds,
    gdpr: {
      enabled: enableGDPR,
      consentMode
    }
  };
}

// 内容配置
async function configureContent() {
  log.step('配置内容设置');
  
  const postsPerPage = await askWithValidation(
    '每页文章数量',
    (v) => !isNaN(v) && parseInt(v) > 0,
    '10'
  );
  
  const generateSitemap = await askYesNo('生成XML站点地图', true);
  const generateRSS = await askYesNo('生成RSS订阅', true);
  
  const enableComments = await askYesNo('启用评论系统', false);
  
  let commentProvider = null;
  if (enableComments) {
    const providers = ['Disqus', 'Giscus (GitHub)', 'Utterances (GitHub)'];
    const providerIndex = await askChoice('选择评论系统', providers, 1);
    commentProvider = providers[providerIndex];
  }
  
  return {
    postsPerPage: parseInt(postsPerPage),
    generateSitemap,
    generateRSS,
    comments: {
      enabled: enableComments,
      provider: commentProvider
    }
  };
}

// 构建配置
async function configureBuild() {
  log.step('配置构建设置');
  
  const outputDir = await askWithValidation(
    '构建输出目录',
    validators.required,
    'dist'
  );
  
  const publicPath = await askWithValidation(
    '公共路径',
    null,
    '/'
  );
  
  const enableCompression = await askYesNo('启用Gzip压缩', true);
  const enablePWA = await askYesNo('启用PWA功能', false);
  
  return {
    outputDir,
    publicPath,
    compression: enableCompression,
    pwa: enablePWA
  };
}

// 部署配置
async function configureDeployment() {
  log.step('配置部署设置');
  
  const platforms = [
    'Vercel (推荐)',
    'Netlify',
    'Cloudflare Pages',
    'GitHub Pages',
    '自定义服务器'
  ];
  
  const platformIndex = await askChoice('选择主要部署平台', platforms, 0);
  const selectedPlatform = platforms[platformIndex];
  
  let deployConfig = {
    platform: selectedPlatform.split(' ')[0].toLowerCase()
  };
  
  if (deployConfig.platform === 'github') {
    const autoCI = await askYesNo('自动设置GitHub Actions CI/CD', true);
    deployConfig.autoCI = autoCI;
  }
  
  return deployConfig;
}

// 生成配置文件
function generateConfig(configs) {
  const { siteInfo, seo, adsense, content, build, deployment } = configs;
  
  const config = {
    site: {
      name: siteInfo.name,
      domain: siteInfo.domain,
      description: siteInfo.description,
      language: siteInfo.language
    },
    seo: {
      defaultTitle: seo.defaultTitle,
      defaultDescription: seo.defaultDescription,
      keywords: seo.keywords,
      author: seo.author,
      openGraph: seo.enableOG,
      twitterSite: seo.twitterSite
    },
    monetization: {
      adsense: adsense
    },
    content: {
      postsPerPage: content.postsPerPage,
      generateSitemap: content.generateSitemap,
      generateRSS: content.generateRSS,
      comments: content.comments
    },
    build: {
      outputDir: build.outputDir,
      publicPath: build.publicPath,
      compression: build.compression,
      pwa: build.pwa
    },
    deployment: deployment
  };
  
  return config;
}

// 保存配置文件
function saveConfig(config) {
  try {
    const yamlContent = yaml.dump(config, {
      indent: 2,
      lineWidth: -1,
      noRefs: true
    });
    
    fs.writeFileSync('k2.config.yaml', yamlContent);
    log.success('配置文件已保存到 k2.config.yaml');
    return true;
  } catch (error) {
    log.error(`保存配置文件失败: ${error.message}`);
    return false;
  }
}

// 生成package.json脚本
function updatePackageJson(config) {
  try {
    if (fs.existsSync('package.json')) {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      
      // 添加有用的脚本
      packageJson.scripts = {
        ...packageJson.scripts,
        'setup': 'node setup-wizard.cjs',
        'quick-start': 'node quick-start.cjs',
        'auto-deploy': 'node auto-deploy.cjs'
      };
      
      fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
      log.success('已更新package.json脚本');
    }
  } catch (error) {
    log.warning(`更新package.json失败: ${error.message}`);
  }
}

// 生成环境变量模板
function generateEnvTemplate(config) {
  const envContent = `# K2Site 环境变量配置
# 复制到 .env 文件并填写实际值

# 站点配置
SITE_NAME="${config.site.name}"
SITE_DOMAIN="${config.site.domain}"

# SEO配置
SEO_AUTHOR="${config.seo.author}"

# AdSense配置
${config.monetization.adsense.enabled ? 
  `ADSENSE_CLIENT_ID="${config.monetization.adsense.clientId}"` : 
  '# ADSENSE_CLIENT_ID="ca-pub-xxxxxxxxxxxxxxxx"'
}

# 评论系统配置
${config.content.comments.enabled ? 
  `# 根据选择的评论系统填写相应配置
# DISQUS_SHORTNAME="your-disqus-shortname"
# GISCUS_REPO="your-username/your-repo"
# GISCUS_REPO_ID="your-repo-id"
# GISCUS_CATEGORY_ID="your-category-id"` :
  '# 评论系统未启用'
}

# 开发环境配置
NODE_ENV="development"
`;
  
  fs.writeFileSync('.env.template', envContent);
  log.success('已生成环境变量模板 .env.template');
}

// 显示完成信息
function showCompletionInfo(config) {
  log.header('配置完成');
  
  console.log(`${colors.green}✓ 配置向导已完成！${colors.reset}
  
${colors.yellow}下一步：${colors.reset}
1. 运行快速启动脚本：
   ${colors.cyan}node quick-start.cjs${colors.reset}

2. 或者手动启动：
   ${colors.cyan}pnpm install${colors.reset}
   ${colors.cyan}pnpm dev${colors.reset}

3. 生成内容：
   ${colors.cyan}node test-generate.cjs${colors.reset}

4. 部署到生产环境：
   ${colors.cyan}node auto-deploy.cjs${colors.reset}

${colors.yellow}配置文件：${colors.reset}
• k2.config.yaml - 主配置文件
• .env.template - 环境变量模板

${colors.yellow}有用的脚本：${colors.reset}
• npm run setup - 重新运行配置向导
• npm run quick-start - 一键启动项目
• npm run auto-deploy - 自动部署

${colors.green}享受使用K2Site！${colors.reset} 🚀`);
}

// 主函数
async function main() {
  log.header('K2Site 配置向导');
  
  console.log(`${colors.cyan}欢迎使用K2Site配置向导！${colors.reset}
这将帮助您快速设置项目的各项配置。
${colors.yellow}提示：直接按回车使用默认值${colors.reset}
`);
  
  try {
    // 检查是否存在现有配置
    if (fs.existsSync('k2.config.yaml')) {
      const overwrite = await askYesNo('检测到现有配置文件，是否覆盖', false);
      if (!overwrite) {
        log.info('配置向导已取消');
        return;
      }
    }
    
    // 收集各项配置
    const siteInfo = await configureSiteInfo();
    const seo = await configureSEO(siteInfo);
    const adsense = await configureAdsense();
    const content = await configureContent();
    const build = await configureBuild();
    const deployment = await configureDeployment();
    
    // 生成和保存配置
    const config = generateConfig({
      siteInfo,
      seo,
      adsense,
      content,
      build,
      deployment
    });
    
    log.step('保存配置文件');
    if (saveConfig(config)) {
      updatePackageJson(config);
      generateEnvTemplate(config);
      showCompletionInfo(config);
    }
    
  } catch (error) {
    log.error(`配置过程出错: ${error.message}`);
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
  configureSiteInfo,
  configureSEO,
  configureAdsense,
  configureContent,
  generateConfig,
  saveConfig
};