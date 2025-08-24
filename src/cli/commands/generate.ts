import { join } from 'path';
import { existsSync } from 'fs';
import { contentGenerator, type KeywordInput } from '@/lib/content-generator';
import { writeMarkdownFile, getExistingPosts, isDuplicateContent } from '@/lib/file-utils';
import { loadConfig } from '@/lib/config';

interface GenerateOptions {
  keywords: string[];
  category: string;
  number: string;
  cluster: boolean;
  language: string;
}

export async function generateContent(options: GenerateOptions): Promise<void> {
  console.log('🎯 开始生成内容...');
  
  const config = loadConfig();
  const keywords = options.keywords;
  const maxArticles = parseInt(options.number);
  const contentDir = join(process.cwd(), 'content', 'posts');
  
  if (!existsSync(contentDir)) {
    console.error('❌ 错误: content/posts 目录不存在');
    console.log('请先运行 k2site init 初始化项目');
    process.exit(1);
  }

  try {
    // 获取现有文章标题，用于去重
    const existingPosts = getExistingPosts(contentDir);
    let generatedCount = 0;
    const skippedKeywords: string[] = [];

    console.log(`📝 计划生成 ${Math.min(keywords.length, maxArticles)} 篇文章`);
    console.log(`📂 目标目录: ${contentDir}`);
    console.log('');

    for (let i = 0; i < Math.min(keywords.length, maxArticles); i++) {
      const keyword = keywords[i]?.trim();
      
      if (!keyword) continue;

      console.log(`[${i + 1}/${Math.min(keywords.length, maxArticles)}] 处理关键词: "${keyword}"`);

      try {
        // 创建关键词输入对象
        const keywordInput: KeywordInput = {
          keyword,
          searchIntent: detectSearchIntent(keyword),
          targetAudience: '初学者到进阶用户',
          category: options.category
        };

        // 生成大纲
        console.log('  📋 生成内容大纲...');
        const outline = await contentGenerator.generateOutline(keywordInput);

        // 检查是否与现有内容重复
        if (isDuplicateContent(outline.title, existingPosts.map(p => p))) {
          console.log(`  ⚠️  跳过重复内容: ${outline.title}`);
          skippedKeywords.push(keyword);
          continue;
        }

        // 生成完整内容
        console.log('  ✍️  生成文章内容...');
        const generatedContent = await contentGenerator.generateContent(outline, keywordInput);

        // 生成文件名
        const fileName = `${generatedContent.frontmatter.slug}.mdx`;
        const filePath = join(contentDir, fileName);

        // 检查文件是否已存在
        if (existsSync(filePath)) {
          console.log(`  ⚠️  文件已存在，跳过: ${fileName}`);
          skippedKeywords.push(keyword);
          continue;
        }

        // 写入文件
        writeMarkdownFile(filePath, generatedContent.frontmatter, generatedContent.content);
        
        console.log(`  ✅ 成功生成: ${fileName}`);
        console.log(`     标题: ${generatedContent.frontmatter.title}`);
        console.log(`     字数: ~${generatedContent.content.length} 字符`);
        console.log('');
        
        generatedCount++;

        // 添加延迟，避免过于频繁的请求
        if (i < keywords.length - 1) {
          await delay(1000);
        }

      } catch (error) {
        console.error(`  ❌ 生成 "${keyword}" 时发生错误:`, error);
        skippedKeywords.push(keyword);
        continue;
      }
    }

    // 输出生成结果摘要
    console.log('='.repeat(50));
    console.log('📊 生成完成摘要:');
    console.log(`✅ 成功生成: ${generatedCount} 篇文章`);
    
    if (skippedKeywords.length > 0) {
      console.log(`⚠️  跳过关键词: ${skippedKeywords.length} 个`);
      console.log('   跳过的关键词:', skippedKeywords.join(', '));
    }

    console.log('');
    console.log('🚀 下一步操作:');
    console.log('   k2site build     # 构建站点');
    console.log('   k2site dev       # 启动开发服务器');
    console.log('   k2site deploy    # 部署到生产环境');

  } catch (error) {
    console.error('❌ 生成内容时发生错误:', error);
    process.exit(1);
  }
}

function detectSearchIntent(keyword: string): 'informational' | 'transactional' | 'navigational' {
  const transactionalWords = ['购买', '下载', '注册', '订阅', '价格', '购物', '折扣'];
  const navigationalWords = ['官网', '登录', '网站', '首页', '平台'];
  
  const lowerKeyword = keyword.toLowerCase();
  
  if (transactionalWords.some(word => lowerKeyword.includes(word))) {
    return 'transactional';
  }
  
  if (navigationalWords.some(word => lowerKeyword.includes(word))) {
    return 'navigational';
  }
  
  return 'informational';
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}