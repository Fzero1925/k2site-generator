import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import yaml from 'js-yaml';
import type { K2Config } from '@/types/config';

const DEFAULT_CONFIG: K2Config = {
  site: {
    name: 'K2Site Demo',
    domain: 'https://example.com',
    language: 'zh-CN',
    author: {
      name: 'K2Site Generator',
      url: '/about'
    },
    themeColor: '#0ea5e9'
  },
  seo: {
    brand: 'K2Site Demo',
    ogDefaultImage: '/og-default.jpg',
    twitterHandle: '@k2site'
  },
  monetization: {
    adsense: {
      enabled: false,
      clientId: '',
      slots: {
        article_top: '',
        article_middle: '',
        sidebar_sticky: ''
      }
    },
    consent: {
      mode: 'basic'
    }
  },
  content: {
    minWords: 1200,
    addTOC: true,
    addFAQ: true,
    images: {
      source: 'unsplash',
      numPerPost: 2
    }
  },
  build: {
    target: 'cloudflare'
  }
};

let cachedConfig: K2Config | null = null;

export function loadConfig(configPath?: string): K2Config {
  if (cachedConfig) {
    return cachedConfig;
  }

  const defaultPath = join(process.cwd(), 'k2.config.yaml');
  const finalPath = configPath || defaultPath;

  if (!existsSync(finalPath)) {
    console.warn(`配置文件 ${finalPath} 不存在，使用默认配置`);
    cachedConfig = DEFAULT_CONFIG;
    return DEFAULT_CONFIG;
  }

  try {
    const fileContent = readFileSync(finalPath, 'utf8');
    const userConfig = yaml.load(fileContent) as Partial<K2Config>;
    
    cachedConfig = mergeConfig(DEFAULT_CONFIG, userConfig);
    return cachedConfig;
  } catch (error) {
    console.error(`读取配置文件失败: ${error}`);
    console.warn('使用默认配置');
    cachedConfig = DEFAULT_CONFIG;
    return DEFAULT_CONFIG;
  }
}

function mergeConfig(defaultConfig: K2Config, userConfig: Partial<K2Config>): K2Config {
  const merged = { ...defaultConfig };
  
  if (userConfig.site) {
    merged.site = { ...defaultConfig.site, ...userConfig.site };
    if (userConfig.site.author) {
      merged.site.author = { ...defaultConfig.site.author, ...userConfig.site.author };
    }
  }
  
  if (userConfig.seo) {
    merged.seo = { ...defaultConfig.seo, ...userConfig.seo };
  }
  
  if (userConfig.monetization) {
    merged.monetization = { ...defaultConfig.monetization, ...userConfig.monetization };
    if (userConfig.monetization.adsense) {
      merged.monetization.adsense = { ...defaultConfig.monetization.adsense, ...userConfig.monetization.adsense };
      if (userConfig.monetization.adsense.slots) {
        merged.monetization.adsense.slots = { 
          ...defaultConfig.monetization.adsense.slots, 
          ...userConfig.monetization.adsense.slots 
        };
      }
    }
    if (userConfig.monetization.consent) {
      merged.monetization.consent = { ...defaultConfig.monetization.consent, ...userConfig.monetization.consent };
    }
  }
  
  if (userConfig.content) {
    merged.content = { ...defaultConfig.content, ...userConfig.content };
    if (userConfig.content.images) {
      merged.content.images = { ...defaultConfig.content.images, ...userConfig.content.images };
    }
  }
  
  if (userConfig.build) {
    merged.build = { ...defaultConfig.build, ...userConfig.build };
  }
  
  return merged;
}

export function getConfig(): K2Config {
  return loadConfig();
}

export function clearConfigCache(): void {
  cachedConfig = null;
}