import { readdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { join, extname } from 'path';
import matter from 'gray-matter';
import { getConfig } from './config';
import type { PostFrontmatter, SitemapEntry } from '@/types/config';

export class SitemapGenerator {
  private config = getConfig();

  async generateSitemap(): Promise<string> {
    const entries: SitemapEntry[] = [];
    
    entries.push({
      url: this.config.site.domain,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: 1.0
    });
    
    const posts = this.getPostEntries();
    entries.push(...posts);
    
    const staticPages = this.getStaticPageEntries();
    entries.push(...staticPages);
    
    return this.generateSitemapXML(entries);
  }

  private getPostEntries(): SitemapEntry[] {
    const contentDir = join(process.cwd(), 'content', 'posts');
    const entries: SitemapEntry[] = [];
    
    if (!existsSync(contentDir)) {
      return entries;
    }
    
    const files = readdirSync(contentDir).filter(file => 
      extname(file) === '.md' || extname(file) === '.mdx'
    );
    
    for (const file of files) {
      try {
        const filePath = join(contentDir, file);
        const fileContent = readFileSync(filePath, 'utf8');
        const { data } = matter(fileContent) as { data: PostFrontmatter };
        
        entries.push({
          url: `${this.config.site.domain}/${data.slug}`,
          lastmod: data.updated || data.date,
          changefreq: 'monthly',
          priority: 0.8
        });
      } catch (error) {
        console.warn(`Error processing ${file}:`, error);
      }
    }
    
    entries.sort((a, b) => {
      const dateA = a.lastmod || '';
      const dateB = b.lastmod || '';
      return dateB.localeCompare(dateA);
    });
    
    return entries;
  }

  private getStaticPageEntries(): SitemapEntry[] {
    const baseUrl = this.config.site.domain;
    const today = new Date().toISOString().split('T')[0];
    
    return [
      {
        url: `${baseUrl}/about`,
        lastmod: today,
        changefreq: 'monthly' as const,
        priority: 0.6
      },
      {
        url: `${baseUrl}/privacy`,
        lastmod: today,
        changefreq: 'yearly' as const,
        priority: 0.3
      },
      {
        url: `${baseUrl}/terms`,
        lastmod: today,
        changefreq: 'yearly' as const,
        priority: 0.3
      },
      {
        url: `${baseUrl}/contact`,
        lastmod: today,
        changefreq: 'monthly' as const,
        priority: 0.4
      }
    ];
  }

  private generateSitemapXML(entries: SitemapEntry[]): string {
    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    ];
    
    for (const entry of entries) {
      xml.push('  <url>');
      xml.push(`    <loc>${entry.url}</loc>`);
      
      if (entry.lastmod) {
        xml.push(`    <lastmod>${entry.lastmod}</lastmod>`);
      }
      
      if (entry.changefreq) {
        xml.push(`    <changefreq>${entry.changefreq}</changefreq>`);
      }
      
      if (entry.priority !== undefined) {
        xml.push(`    <priority>${entry.priority.toFixed(1)}</priority>`);
      }
      
      xml.push('  </url>');
    }
    
    xml.push('</urlset>');
    
    return xml.join('\n');
  }

  async saveSitemap(outputPath?: string): Promise<void> {
    const sitemap = await this.generateSitemap();
    const filePath = outputPath || join(process.cwd(), 'public', 'sitemap.xml');
    writeFileSync(filePath, sitemap, 'utf8');
    console.log(`站点地图已生成: ${filePath}`);
  }
}

export class RobotsGenerator {
  private config = getConfig();

  generateRobots(): string {
    const lines = [
      'User-agent: *',
      'Allow: /',
      '',
      'Disallow: /drafts/',
      'Disallow: /api/',
      'Disallow: /_astro/',
      'Disallow: /admin/',
      '',
      `Sitemap: ${this.config.site.domain}/sitemap.xml`
    ];
    
    if (this.config.monetization.adsense.enabled) {
      lines.push('');
      lines.push('# AdSense crawling allowed');
      lines.push('User-agent: Mediapartners-Google');
      lines.push('Allow: /');
    }
    
    return lines.join('\n');
  }

  saveRobots(outputPath?: string): void {
    const robots = this.generateRobots();
    const filePath = outputPath || join(process.cwd(), 'public', 'robots.txt');
    writeFileSync(filePath, robots, 'utf8');
    console.log(`robots.txt已生成: ${filePath}`);
  }
}

export const sitemapGenerator = new SitemapGenerator();
export const robotsGenerator = new RobotsGenerator();