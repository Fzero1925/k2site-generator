import { spawn } from 'child_process';
import { existsSync, rmSync } from 'fs';
import { join } from 'path';
import { sitemapGenerator, robotsGenerator } from '@/lib/sitemap';
import { rssGenerator } from '@/lib/rss';

interface BuildOptions {
  clean: boolean;
  verbose: boolean;
}

export async function buildSite(options: BuildOptions): Promise<void> {
  console.log('🏗️  开始构建站点...');

  try {
    // 清理构建缓存
    if (options.clean) {
      console.log('🧹 清理构建缓存...');
      const cacheDirs = ['dist', '.astro', 'node_modules/.astro'];
      
      cacheDirs.forEach(dir => {
        const dirPath = join(process.cwd(), dir);
        if (existsSync(dirPath)) {
          rmSync(dirPath, { recursive: true, force: true });
          console.log(`   已删除: ${dir}`);
        }
      });
    }

    // 生成SEO和合规文件
    console.log('🔍 生成SEO和合规文件...');
    await generateSEOFiles();

    // 类型检查
    console.log('🔍 执行TypeScript类型检查...');
    await runTypeCheck();

    // 构建Astro项目
    console.log('⚡ 构建Astro站点...');
    await runAstroBuild(options.verbose);

    // 验证构建结果
    await validateBuild();

    console.log('');
    console.log('✅ 站点构建完成！');
    console.log('');
    console.log('📦 构建结果:');
    console.log(`   输出目录: dist/`);
    console.log('   包含文件: HTML, CSS, JS, 图片资源');
    console.log('   SEO文件: sitemap.xml, robots.txt, rss.xml');
    console.log('');
    console.log('🚀 下一步操作:');
    console.log('   k2site preview  # 预览构建结果');
    console.log('   k2site deploy   # 部署到生产环境');

  } catch (error) {
    console.error('❌ 构建失败:', error);
    process.exit(1);
  }
}

async function generateSEOFiles(): Promise<void> {
  try {
    // 生成sitemap.xml
    await sitemapGenerator.saveSitemap();
    console.log('   ✅ sitemap.xml');

    // 生成robots.txt
    robotsGenerator.saveRobots();
    console.log('   ✅ robots.txt');

    // 生成RSS feed
    await rssGenerator.saveRSS();
    console.log('   ✅ rss.xml');

  } catch (error) {
    console.error('   ❌ 生成SEO文件时发生错误:', error);
    throw error;
  }
}

async function runTypeCheck(): Promise<void> {
  return new Promise((resolve, reject) => {
    const process = spawn('npx', ['astro', 'check'], {
      stdio: 'pipe',
      shell: true
    });

    let output = '';
    let errorOutput = '';

    process.stdout?.on('data', (data) => {
      output += data.toString();
    });

    process.stderr?.on('data', (data) => {
      errorOutput += data.toString();
    });

    process.on('close', (code) => {
      if (code === 0) {
        console.log('   ✅ TypeScript检查通过');
        resolve();
      } else {
        console.error('   ❌ TypeScript检查失败:');
        console.error(errorOutput || output);
        reject(new Error('TypeScript类型检查失败'));
      }
    });

    process.on('error', (error) => {
      reject(error);
    });
  });
}

async function runAstroBuild(verbose: boolean): Promise<void> {
  return new Promise((resolve, reject) => {
    const args = ['astro', 'build'];
    
    const buildProcess = spawn('npx', args, {
      stdio: verbose ? 'inherit' : 'pipe',
      shell: true
    });

    if (!verbose) {
      let output = '';
      let errorOutput = '';

      buildProcess.stdout?.on('data', (data) => {
        output += data.toString();
      });

      buildProcess.stderr?.on('data', (data) => {
        errorOutput += data.toString();
      });

      buildProcess.on('close', (code) => {
        if (code === 0) {
          console.log('   ✅ Astro构建完成');
          resolve();
        } else {
          console.error('   ❌ Astro构建失败:');
          console.error(errorOutput || output);
          reject(new Error('Astro构建失败'));
        }
      });
    } else {
      buildProcess.on('close', (code) => {
        if (code === 0) {
          console.log('   ✅ Astro构建完成');
          resolve();
        } else {
          reject(new Error('Astro构建失败'));
        }
      });
    }

    buildProcess.on('error', (error) => {
      reject(error);
    });
  });
}

async function validateBuild(): Promise<void> {
  const distDir = join(process.cwd(), 'dist');
  
  if (!existsSync(distDir)) {
    throw new Error('构建输出目录不存在');
  }

  // 检查关键文件是否存在
  const requiredFiles = ['index.html', 'sitemap.xml', 'robots.txt'];
  const missingFiles: string[] = [];

  requiredFiles.forEach(file => {
    if (!existsSync(join(distDir, file))) {
      missingFiles.push(file);
    }
  });

  if (missingFiles.length > 0) {
    console.warn(`⚠️  警告: 以下文件未找到: ${missingFiles.join(', ')}`);
  }

  console.log('   ✅ 构建验证通过');
}