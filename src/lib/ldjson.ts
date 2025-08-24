import type { PostFrontmatter } from '@/types/config';
import { getConfig } from './config';

export interface WebSiteSchema {
  '@context': string;
  '@type': 'WebSite';
  url: string;
  name: string;
  potentialAction?: {
    '@type': 'SearchAction';
    target: string;
    'query-input': string;
  };
}

export interface BreadcrumbSchema {
  '@context': string;
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }>;
}

export interface ArticleSchema {
  '@context': string;
  '@type': 'Article';
  headline: string;
  datePublished: string;
  dateModified?: string;
  author: {
    '@type': 'Person';
    name: string;
  };
  publisher: {
    '@type': 'Organization';
    name: string;
    logo?: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  image?: string[];
  mainEntityOfPage: string;
  description?: string;
  keywords?: string[];
  articleSection?: string;
}

export interface FAQSchema {
  '@context': string;
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }>;
}

export function generateWebSiteSchema(includeSearch: boolean = true): WebSiteSchema {
  const config = getConfig();
  
  const schema: WebSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: config.site.domain,
    name: config.site.name
  };
  
  if (includeSearch) {
    schema.potentialAction = {
      '@type': 'SearchAction',
      target: `${config.site.domain}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    };
  }
  
  return schema;
}

export function generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>): BreadcrumbSchema {
  const config = getConfig();
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${config.site.domain}${item.url}`
    }))
  };
}

export function generateArticleSchema(frontmatter: PostFrontmatter): ArticleSchema {
  const config = getConfig();
  
  const schema: ArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: frontmatter.title,
    datePublished: frontmatter.date,
    author: {
      '@type': 'Person',
      name: config.site.author.name
    },
    publisher: {
      '@type': 'Organization',
      name: config.site.name
    },
    mainEntityOfPage: frontmatter.canonical || `${config.site.domain}/${frontmatter.slug}`,
    description: frontmatter.description,
    keywords: frontmatter.keywords,
    articleSection: frontmatter.category
  };
  
  if (frontmatter.updated) {
    schema.dateModified = frontmatter.updated;
  }
  
  if (frontmatter.image) {
    schema.image = [frontmatter.image];
  }
  
  return schema;
}

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>): FAQSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

export function generateJSONLD(schema: any): string {
  return JSON.stringify(schema, null, 0);
}