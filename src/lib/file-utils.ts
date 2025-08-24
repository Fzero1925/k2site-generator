import { writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import matter from 'gray-matter';
import type { PostFrontmatter } from '@/types/config';

export function ensureDirectoryExists(filePath: string): void {
  const dir = dirname(filePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

export function writeMarkdownFile(
  filePath: string, 
  frontmatter: PostFrontmatter, 
  content: string
): void {
  ensureDirectoryExists(filePath);
  
  const fileContent = matter.stringify(content, frontmatter);
  writeFileSync(filePath, fileContent, 'utf8');
}

export function getExistingPosts(contentDir: string): string[] {
  if (!existsSync(contentDir)) {
    return [];
  }
  
  return readdirSync(contentDir)
    .filter(file => file.endsWith('.mdx') || file.endsWith('.md'))
    .map(file => file.replace(/\.(mdx?|md)$/, ''));
}

export function generateFileName(title: string, index?: number): string {
  const slug = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
    
  return index !== undefined ? `${slug}-${index}.mdx` : `${slug}.mdx`;
}

export function checkContentSimilarity(title1: string, title2: string): number {
  const words1 = title1.toLowerCase().split(/\s+/);
  const words2 = title2.toLowerCase().split(/\s+/);
  
  const intersection = words1.filter(word => words2.includes(word));
  const union = [...new Set([...words1, ...words2])];
  
  return intersection.length / union.length;
}

export function isDuplicateContent(newTitle: string, existingTitles: string[], threshold: number = 0.8): boolean {
  return existingTitles.some(existing => 
    checkContentSimilarity(newTitle, existing) >= threshold
  );
}