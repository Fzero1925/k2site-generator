import type { PostFrontmatter } from '@/types/config';
import { getConfig } from './config';

export interface SEOData {
  title: string;
  description: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType: 'website' | 'article';
  twitterCard: 'summary' | 'summary_large_image';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

export function generateSEOData(
  frontmatter?: PostFrontmatter,
  pageTitle?: string,
  pageDescription?: string
): SEOData {
  const config = getConfig();
  
  if (frontmatter) {
    return {
      title: `${frontmatter.title} | ${config.site.name}`,
      description: frontmatter.description,
      canonical: frontmatter.canonical,
      ogTitle: frontmatter.title,
      ogDescription: frontmatter.description,
      ogImage: frontmatter.image || config.seo.ogDefaultImage,
      ogType: 'article',
      twitterCard: 'summary_large_image',
      author: config.site.author.name,
      publishedTime: frontmatter.date,
      modifiedTime: frontmatter.updated,
      section: frontmatter.category,
      tags: frontmatter.tags
    };
  }
  
  return {
    title: pageTitle ? `${pageTitle} | ${config.site.name}` : config.site.name,
    description: pageDescription || `${config.site.name} - 高质量内容聚合站点`,
    canonical: config.site.domain,
    ogTitle: pageTitle || config.site.name,
    ogDescription: pageDescription || `${config.site.name} - 高质量内容聚合站点`,
    ogImage: config.seo.ogDefaultImage,
    ogType: 'website',
    twitterCard: 'summary_large_image'
  };
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  
  const truncated = text.substr(0, maxLength - 3);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > 0) {
    return truncated.substr(0, lastSpace) + '...';
  }
  
  return truncated + '...';
}

export function generatePageTitle(title: string, siteName: string): string {
  if (title.includes(siteName)) {
    return title;
  }
  return `${title} | ${siteName}`;
}

export function generateCanonicalUrl(path: string, domain: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const cleanDomain = domain.endsWith('/') ? domain.slice(0, -1) : domain;
  return `${cleanDomain}${cleanPath}`;
}