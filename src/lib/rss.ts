import { readdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { join, extname } from 'path';
import matter from 'gray-matter';
import { getConfig } from './config';
import type { PostFrontmatter } from '@/types/config';

export interface RSSItem {
  title: string;
  description: string;
  link: string;
  guid: string;
  pubDate: string;
  category?: string;
  author?: string;
}

export class RSSGenerator {
  private config = getConfig();

  async generateRSS(): Promise<string> {
    const posts = this.getPostsForRSS();
    
    const rssItems = posts.map(post => this.postToRSSItem(post));
    
    return this.generateRSSXML(rssItems);
  }

  private getPostsForRSS(): PostFrontmatter[] {
    const contentDir = join(process.cwd(), 'content', 'posts');
    const posts: PostFrontmatter[] = [];
    
    if (!existsSync(contentDir)) {
      return posts;
    }
    
    const files = readdirSync(contentDir).filter(file => 
      extname(file) === '.md' || extname(file) === '.mdx'
    );
    
    for (const file of files) {
      try {
        const filePath = join(contentDir, file);
        const fileContent = readFileSync(filePath, 'utf8');
        const { data } = matter(fileContent) as { data: PostFrontmatter };
        posts.push(data);
      } catch (error) {
        console.warn(`Error processing ${file} for RSS:`, error);
      }
    }
    
    return posts
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 20);
  }

  private postToRSSItem(post: PostFrontmatter): RSSItem {
    const pubDate = new Date(post.date).toUTCString();
    const link = `${this.config.site.domain}/${post.slug}`;
    
    return {
      title: post.title,
      description: post.description,
      link,
      guid: link,
      pubDate,
      category: post.category,
      author: this.config.site.author.name
    };
  }

  private generateRSSXML(items: RSSItem[]): string {
    const buildDate = new Date().toUTCString();
    
    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
      '  <channel>',
      `    <title>${this.escapeXML(this.config.site.name)}</title>`,
      `    <description>${this.escapeXML(this.config.seo.brand)} - 高质量内容聚合</description>`,
      `    <link>${this.config.site.domain}</link>`,
      `    <atom:link href="${this.config.site.domain}/rss.xml" rel="self" type="application/rss+xml"/>`,
      `    <language>${this.config.site.language}</language>`,
      `    <lastBuildDate>${buildDate}</lastBuildDate>`,
      `    <managingEditor>${this.config.site.author.name}</managingEditor>`,
      `    <webMaster>${this.config.site.author.name}</webMaster>`,
      '    <ttl>1440</ttl>',
      ''
    ];
    
    for (const item of items) {
      xml.push('    <item>');
      xml.push(`      <title>${this.escapeXML(item.title)}</title>`);
      xml.push(`      <description>${this.escapeXML(item.description)}</description>`);
      xml.push(`      <link>${item.link}</link>`);
      xml.push(`      <guid isPermaLink="true">${item.guid}</guid>`);
      xml.push(`      <pubDate>${item.pubDate}</pubDate>`);
      
      if (item.category) {
        xml.push(`      <category>${this.escapeXML(item.category)}</category>`);
      }
      
      if (item.author) {
        xml.push(`      <author>${this.escapeXML(item.author)}</author>`);
      }
      
      xml.push('    </item>');
      xml.push('');
    }
    
    xml.push('  </channel>');
    xml.push('</rss>');
    
    return xml.join('\n');
  }

  private escapeXML(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  async saveRSS(outputPath?: string): Promise<void> {
    const rss = await this.generateRSS();
    const filePath = outputPath || join(process.cwd(), 'public', 'rss.xml');
    writeFileSync(filePath, rss, 'utf8');
    console.log(`RSS feed已生成: ${filePath}`);
  }
}

export const rssGenerator = new RSSGenerator();