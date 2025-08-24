import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

interface PreviewOptions {
  port: string;
  host: string;
}

export async function previewSite(options: PreviewOptions): Promise<void> {
  const distDir = join(process.cwd(), 'dist');

  // 检查构建输出是否存在
  if (!existsSync(distDir)) {
    console.error('❌ 错误: 未找到构建输出');
    console.log('请先运行: k2site build');
    process.exit(1);
  }

  console.log('🔍 启动预览服务器...');
  console.log(`📍 地址: http://${options.host}:${options.port}`);
  console.log('按 Ctrl+C 停止服务器\n');

  const previewProcess = spawn('npx', [
    'astro',
    'preview',
    '--port',
    options.port,
    '--host',
    options.host
  ], {
    stdio: 'inherit',
    shell: true
  });

  previewProcess.on('close', (code) => {
    console.log('\n👋 预览服务器已停止');
    process.exit(code || 0);
  });

  previewProcess.on('error', (error) => {
    console.error('❌ 启动预览服务器时发生错误:', error);
    process.exit(1);
  });

  // 处理进程终止信号
  process.on('SIGINT', () => {
    console.log('\n⏹️  正在停止预览服务器...');
    previewProcess.kill('SIGTERM');
  });

  process.on('SIGTERM', () => {
    previewProcess.kill('SIGTERM');
  });
}