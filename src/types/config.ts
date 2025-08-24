export interface SiteConfig {
  name: string;
  domain: string;
  language: string;
  author: {
    name: string;
    url: string;
  };
  themeColor: string;
}

export interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export interface SEOConfig {
  brand: string;
  ogDefaultImage: string;
  twitterHandle: string;
}

export interface AdSenseConfig {
  enabled: boolean;
  clientId: string;
  slots: {
    article_top: string;
    article_middle: string;
    sidebar_sticky: string;
  };
}

export interface ConsentConfig {
  mode: 'basic' | 'cmp' | 'off';
  cmpProvider?: string;
}

export interface MonetizationConfig {
  adsense: AdSenseConfig;
  consent: ConsentConfig;
}

export interface ContentConfig {
  minWords: number;
  addTOC: boolean;
  addFAQ: boolean;
  images: {
    source: 'unsplash' | 'local' | 'none';
    numPerPost: number;
  };
}

export interface BuildConfig {
  target: 'vercel' | 'cloudflare';
}

export interface K2Config {
  site: SiteConfig;
  seo: SEOConfig;
  monetization: MonetizationConfig;
  content: ContentConfig;
  build: BuildConfig;
}

export interface PostFrontmatter {
  slug: string;
  date: string;
  updated?: string;
  title: string;
  description: string;
  keywords: string[];
  category: string;
  tags: string[];
  image?: string;
  readingTime?: number;
  canonical?: string;
  references?: Array<{
    title: string;
    url: string;
  }>;
}