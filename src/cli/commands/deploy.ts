import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';
import { loadConfig } from '@/lib/config';

interface DeployOptions {
  target: string;
  token?: string;
}

export async function deploySite(options: DeployOptions): Promise<void> {
  console.log(`🚀 开始部署到 ${options.target}...`);

  const config = loadConfig();
  const target = options.target || config.build.target;
  const distDir = join(process.cwd(), 'dist');

  // 检查构建输出是否存在
  if (!existsSync(distDir)) {
    console.error('❌ 错误: 未找到构建输出');
    console.log('请先运行: k2site build');
    process.exit(1);
  }

  try {
    switch (target) {
      case 'vercel':
        await deployToVercel(options.token);
        break;
      case 'cloudflare':
        await deployToCloudflare(options.token);
        break;
      default:
        throw new Error(`不支持的部署目标: ${target}`);
    }

    console.log('✅ 部署成功！');
    console.log('🌐 您的网站已经上线');
    
  } catch (error) {
    console.error('❌ 部署失败:', error);
    process.exit(1);
  }
}

async function deployToVercel(token?: string): Promise<void> {
  console.log('📦 正在部署到 Vercel...');

  const args = ['vercel', '--prod'];
  if (token) {
    args.push('--token', token);
  }

  return new Promise((resolve, reject) => {
    const process = spawn('npx', args, {
      stdio: 'inherit',
      shell: true
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Vercel 部署失败，退出码: ${code}`));
      }
    });

    process.on('error', (error) => {
      reject(error);
    });
  });
}

async function deployToCloudflare(token?: string): Promise<void> {
  console.log('📦 正在部署到 Cloudflare Pages...');

  // 检查是否已安装 wrangler
  try {
    await runCommand('npx', ['wrangler', '--version']);
  } catch {
    console.log('📥 安装 Cloudflare Wrangler...');
    await runCommand('npm', ['install', '-g', 'wrangler']);
  }

  const args = ['wrangler', 'pages', 'publish', 'dist'];
  if (token) {
    // 设置环境变量
    process.env.CLOUDFLARE_API_TOKEN = token;
  }

  return runCommand('npx', args);
}

function runCommand(command: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, {
      stdio: 'inherit',
      shell: true
    });

    process.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`命令 ${command} ${args.join(' ')} 执行失败，退出码: ${code}`));
      }
    });

    process.on('error', (error) => {
      reject(error);
    });
  });
}