import slugify from 'slugify';
import type { PostFrontmatter } from '@/types/config';
import { getConfig } from './config';

export interface OutlineSection {
  heading: string;
  points: string[];
}

export interface ContentOutline {
  title: string;
  metaDescription: string;
  sections: OutlineSection[];
  relatedEntities: string[];
  faqQuestions: string[];
}

export interface GeneratedContent {
  frontmatter: PostFrontmatter;
  content: string;
  outline: ContentOutline;
}

export interface KeywordInput {
  keyword: string;
  searchIntent: 'informational' | 'transactional' | 'navigational';
  targetAudience?: string;
  category?: string;
}

export class ContentGenerator {
  private config = getConfig();

  async generateOutline(input: KeywordInput): Promise<ContentOutline> {
    const { keyword, searchIntent, targetAudience = '初学者' } = input;
    
    const title = this.generateTitle(keyword);
    const metaDescription = this.generateMetaDescription(keyword, searchIntent);
    
    const sections = this.generateSections(keyword, searchIntent);
    const relatedEntities = this.generateRelatedEntities(keyword);
    const faqQuestions = this.generateFAQQuestions(keyword, searchIntent);

    return {
      title,
      metaDescription,
      sections,
      relatedEntities,
      faqQuestions
    };
  }

  async generateContent(outline: ContentOutline, input: KeywordInput): Promise<GeneratedContent> {
    const { keyword, category = '技术教程' } = input;
    const config = this.config;
    
    const slug = this.generateSlug(outline.title);
    const today = new Date().toISOString().split('T')[0];
    
    const frontmatter: PostFrontmatter = {
      slug,
      date: today,
      title: outline.title,
      description: outline.metaDescription,
      keywords: [keyword, ...outline.relatedEntities.slice(0, 7)],
      category,
      tags: outline.relatedEntities.slice(0, 5),
      readingTime: this.estimateReadingTime(config.content.minWords),
      canonical: `${config.site.domain}/${slug}`,
      references: []
    };

    let content = this.generateIntroduction(keyword, outline);
    
    if (config.content.addTOC) {
      content += this.generateTOC(outline);
    }
    
    for (const section of outline.sections) {
      content += this.generateSectionContent(section, keyword);
    }
    
    content += this.generateConclusion(keyword, outline);
    
    if (config.content.addFAQ) {
      content += this.generateFAQ(outline.faqQuestions, keyword);
    }

    return {
      frontmatter,
      content,
      outline
    };
  }

  private generateTitle(keyword: string): string {
    const templates = [
      `${keyword}完全指南：从入门到精通`,
      `${keyword}最佳实践：专家级教程`,
      `${keyword}详解：你需要知道的一切`,
      `掌握${keyword}：实用技巧和方法`,
      `${keyword}终极教程：步骤详解`
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
  }

  private generateMetaDescription(keyword: string, intent: string): string {
    const templates = {
      informational: `深入了解${keyword}，包括基础概念、实用技巧和最佳实践。本指南适合初学者和进阶用户，助您快速掌握${keyword}。`,
      transactional: `寻找最佳${keyword}解决方案？我们为您详细比较和推荐，帮您做出明智选择。`,
      navigational: `${keyword}官方指南和资源汇总，包含最新信息、使用方法和常见问题解答。`
    };
    
    return templates[intent as keyof typeof templates] || templates.informational;
  }

  private generateSections(keyword: string, intent: string): OutlineSection[] {
    const baseSections = [
      {
        heading: `什么是${keyword}`,
        points: [
          `${keyword}的基本定义和概念`,
          `${keyword}的历史和发展`,
          `为什么${keyword}很重要`
        ]
      },
      {
        heading: `${keyword}的核心特性`,
        points: [
          `主要功能和优势`,
          `与其他解决方案的比较`,
          `适用场景和限制`
        ]
      },
      {
        heading: `如何使用${keyword}`,
        points: [
          `入门准备工作`,
          `步骤详解`,
          `常见配置选项`
        ]
      },
      {
        heading: `${keyword}最佳实践`,
        points: [
          `性能优化技巧`,
          `安全注意事项`,
          `维护和监控`
        ]
      },
      {
        heading: `常见问题和解决方案`,
        points: [
          `典型错误和修复方法`,
          `故障排除指南`,
          `专家建议`
        ]
      }
    ];

    return baseSections;
  }

  private generateRelatedEntities(keyword: string): string[] {
    return [
      `${keyword}教程`,
      `${keyword}指南`,
      `${keyword}最佳实践`,
      `${keyword}工具`,
      `${keyword}技巧`,
      `${keyword}优化`,
      `${keyword}配置`,
      `${keyword}问题解决`
    ];
  }

  private generateFAQQuestions(keyword: string, intent: string): string[] {
    return [
      `什么是${keyword}？`,
      `${keyword}有什么优势？`,
      `如何开始使用${keyword}？`,
      `${keyword}适合哪些场景？`,
      `${keyword}有哪些常见问题？`
    ];
  }

  private generateSlug(title: string): string {
    return slugify(title, {
      lower: true,
      strict: true,
      locale: 'zh'
    });
  }

  private estimateReadingTime(wordCount: number): number {
    return Math.ceil(wordCount / 200);
  }

  private generateTOC(outline: ContentOutline): string {
    let toc = '\n## 目录\n\n';
    outline.sections.forEach((section, index) => {
      toc += `${index + 1}. [${section.heading}](#${this.generateSlug(section.heading)})\n`;
    });
    toc += '\n';
    return toc;
  }

  private generateIntroduction(keyword: string, outline: ContentOutline): string {
    return `
在当今数字化时代，${keyword}已经成为不可或缺的重要工具。无论您是初学者还是有经验的用户，本文都将为您提供关于${keyword}的全面指南。

我们将深入探讨${keyword}的核心概念、实用技巧和最佳实践，帮助您充分发挥其潜力。通过本文，您将学会：

${outline.sections.map(section => `- ${section.heading}`).join('\n')}

让我们开始这个精彩的学习之旅吧！

`;
  }

  private generateSectionContent(section: OutlineSection, keyword: string): string {
    const sectionId = this.generateSlug(section.heading);
    
    let content = `\n## ${section.heading} {#${sectionId}}\n\n`;
    
    content += `${section.heading}是理解${keyword}的关键部分。在这一节中，我们将详细介绍相关概念和实践方法。\n\n`;
    
    section.points.forEach((point, index) => {
      content += `### ${index + 1}. ${point}\n\n`;
      content += `${point}涉及多个重要方面。让我们逐一分析：\n\n`;
      content += `- **核心要点**：这里是关键信息的详细说明\n`;
      content += `- **实际应用**：在实际场景中的具体运用方法\n`;
      content += `- **注意事项**：需要特别关注的重要细节\n\n`;
    });
    
    content += `通过以上内容，您应该对${section.heading}有了深入的理解。接下来让我们继续下一个重要主题。\n\n`;
    
    return content;
  }

  private generateConclusion(keyword: string, outline: ContentOutline): string {
    return `
## 总结

通过本文的详细介绍，我们全面探讨了${keyword}的各个方面。从基础概念到高级应用，从理论知识到实践技巧，相信您已经对${keyword}有了深入的理解。

### 关键要点回顾

${outline.sections.map((section, index) => `${index + 1}. **${section.heading}**：掌握了相关的核心概念和实践方法`).join('\n')}

### 下一步行动

现在您已经具备了使用${keyword}的基础知识，建议您：

1. **实践应用**：将所学知识应用到实际项目中
2. **持续学习**：关注${keyword}的最新发展和更新
3. **分享交流**：与其他用户分享经验和心得
4. **深入研究**：探索更高级的功能和技巧

记住，掌握${keyword}是一个持续的过程。保持学习的热情，不断实践和改进，您将在这个领域取得更大的成功。

`;
  }

  private generateFAQ(questions: string[], keyword: string): string {
    let faq = '\n## 常见问题 FAQ\n\n';
    
    questions.forEach((question) => {
      faq += `### ${question}\n\n`;
      faq += `这是关于${keyword}的一个常见问题。简单来说，答案包含以下几个要点：\n\n`;
      faq += `- 核心概念的解释\n`;
      faq += `- 实际应用的建议\n`;
      faq += `- 相关的注意事项\n\n`;
    });
    
    return faq;
  }
}

export const contentGenerator = new ContentGenerator();