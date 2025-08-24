import { sitemapGenerator, robotsGenerator } from '@/lib/sitemap';
import { rssGenerator } from '@/lib/rss';

interface SitemapOptions {
  force: boolean;
}

export async function generateSitemap(_options: SitemapOptions): Promise<void> {
  console.log('🗺️  正在生成站点地图和SEO文件...');

  try {
    // 生成 sitemap.xml
    console.log('📋 生成 sitemap.xml...');
    await sitemapGenerator.saveSitemap();

    // 生成 robots.txt
    console.log('🤖 生成 robots.txt...');
    robotsGenerator.saveRobots();

    // 生成 RSS feed
    console.log('📡 生成 RSS feed...');
    await rssGenerator.saveRSS();

    console.log('');
    console.log('✅ 所有文件生成完成！');
    console.log('');
    console.log('生成的文件:');
    console.log('  📄 public/sitemap.xml - 站点地图');
    console.log('  🤖 public/robots.txt - 搜索引擎爬虫指令');
    console.log('  📡 public/rss.xml - RSS 订阅源');
    console.log('');
    console.log('💡 提示:');
    console.log('  • 这些文件会在构建时自动生成');
    console.log('  • sitemap.xml 包含所有页面的URL和更新时间');
    console.log('  • robots.txt 配置了搜索引擎爬取规则');
    console.log('  • RSS feed 包含最新的20篇文章');

  } catch (error) {
    console.error('❌ 生成SEO文件时发生错误:', error);
    process.exit(1);
  }
}