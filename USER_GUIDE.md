# 🚀 K2Site 用户完整指南

## 📍 K2Site 是什么？

K2Site 是一个**关键词驱动的网站自动生成器**，能够：
- 🎯 基于您的关键词自动生成高质量内容
- 🎨 创建SEO优化的专业网站  
- 🚀 一键部署到GitHub Pages等平台
- 💰 内置AdSense变现功能

## 🎯 正确的使用流程

### 作为新用户，您有两种方式开始：

---

## 🌟 方式一：使用K2Site创建个人网站（推荐）

这是为**想要创建自己网站**的用户准备的完整流程：

### 第一步：安装K2Site CLI
```bash
# 全局安装K2Site命令行工具
npm install -g https://github.com/Fzero1925/k2site-generator.git

# 验证安装
k2site --version
```

### 第二步：创建您的网站项目
```bash
# 创建新项目（推荐方式）
k2site create my-awesome-blog

# 或者使用交互式创建
node create-user-site.cjs
```

这会启动**网站创建向导**，询问您：
- ✅ 项目名称和网站信息
- ✅ 您想要的关键词（如"编程教程"、"健康生活"等）
- ✅ 网站分类和风格设置
- ✅ 作者信息和品牌设置

### 第三步：生成个性化内容
```bash
cd my-awesome-blog

# 基于您的关键词生成更多内容
k2site generate -k "机器学习" "深度学习" "AI应用" -c "技术教程"

# 或生成特定数量的文章
k2site generate -k "React" "Vue" "Angular" -n 5
```

### 第四步：预览和调试
```bash
# 安装依赖
npm install

# 启动开发服务器
k2site dev
# 或
npm run dev
```

访问 `http://localhost:4321` 查看您的网站！

### 第五步：部署上线
```bash
# 一键部署到GitHub Pages
k2site deploy github
# 或
npm run deploy:github

# 部署到其他平台
k2site deploy  # 会显示平台选择菜单
```

---

## 🛠️ 方式二：体验和学习K2Site功能

如果您想**先了解K2Site功能**再决定是否使用：

### 获取源码和演示
```bash
# 克隆项目查看源码
git clone https://github.com/Fzero1925/k2site-generator.git
cd k2site-generator

# 快速体验演示
node demo.cjs

# 或完整的开发流程体验
node quick-start.cjs
```

---

## 💡 K2Site CLI 完整命令

安装K2Site后，您可以使用以下命令：

### 项目管理
```bash
k2site create <name>              # 创建新项目
k2site init                       # 在当前目录初始化
k2site --version                  # 查看版本
k2site --help                     # 查看帮助
```

### 内容生成
```bash
k2site generate -k "keyword1" "keyword2"     # 生成内容
k2site g -k "React" -c "编程" -n 3           # 简写形式
```

参数说明：
- `-k, --keywords`: 关键词列表
- `-c, --category`: 内容分类
- `-n, --number`: 生成数量

### 开发和构建
```bash
k2site dev                        # 启动开发服务器
k2site build                      # 构建生产版本
k2site preview                    # 预览构建结果
```

### 部署
```bash
k2site deploy                     # 交互式部署选择
k2site deploy github              # 直接部署到GitHub Pages
```

---

## 🎨 自定义您的网站

### 1. 修改网站配置
编辑 `k2.config.yaml` 文件：

```yaml
site:
  name: "我的技术博客"
  domain: "https://myblog.com"
  description: "分享编程和技术经验"

seo:
  keywords: ["编程", "技术", "教程"]
  author: "您的姓名"

content:
  generation:
    keywords: ["您的关键词"]
    defaultCategory: "技术教程"
```

### 2. 自定义样式
编辑 `src/styles/global.css`：

```css
:root {
  --primary-color: #your-color;
  --secondary-color: #your-secondary-color;
}
```

### 3. 修改布局
- 编辑 `src/layouts/BaseLayout.astro`
- 自定义 `src/components/` 中的组件

### 4. 添加页面
在 `src/pages/` 目录下创建新页面：

```astro
---
// src/pages/services.astro
---
<BaseLayout title="我们的服务">
  <main>
    <h1>我们的服务</h1>
    <p>服务内容...</p>
  </main>
</BaseLayout>
```

---

## 🚀 生产部署选项

### GitHub Pages（推荐新手）
```bash
k2site deploy github
```
- ✅ 完全免费
- ✅ 自动HTTPS
- ✅ 自动CI/CD

### 其他平台
```bash
k2site deploy
```
然后选择：
- Vercel - 零配置
- Netlify - 功能丰富
- Cloudflare Pages - 全球CDN

---

## 🎯 实际使用示例

### 创建技术博客
```bash
k2site create tech-blog
cd tech-blog
k2site generate -k "JavaScript" "React" "Node.js" -c "前端开发"
npm run dev
```

### 创建生活分享网站
```bash
k2site create lifestyle-blog  
cd lifestyle-blog
k2site generate -k "健康生活" "美食分享" "旅行攻略" -c "生活分享"
npm run dev
```

### 创建商业网站
```bash
k2site create business-site
cd business-site
k2site generate -k "数字营销" "创业指南" "商业策略" -c "商业管理"
npm run dev
```

---

## 🆘 常见问题解决

### Q: k2site命令无法识别？
```bash
# 确保正确安装
npm list -g k2site

# 重新全局安装
npm install -g https://github.com/Fzero1925/k2site-generator.git

# 或使用npx
npx k2site create my-site
```

### Q: 如何添加更多关键词？
```bash
# 在项目目录中运行
k2site generate -k "新关键词1" "新关键词2"
```

### Q: 如何更改网站主题？
编辑 `tailwind.config.mjs` 和 `src/styles/global.css` 文件。

### Q: 部署失败怎么办？
```bash
# 检查构建是否成功
npm run build

# 使用手动部署
npm run deploy

# 查看详细错误信息
DEBUG=* npm run deploy
```

---

## 💎 高级功能

### 1. 自定义内容模板
在 `src/lib/content-templates.js` 中添加自定义模板。

### 2. SEO优化
K2Site自动优化：
- Meta标签
- 结构化数据
- 站点地图
- RSS订阅

### 3. 性能监控
使用内置的Lighthouse CI进行性能监控。

### 4. A/B测试
配置不同的内容版本进行测试。

---

## 🎊 总结

K2Site的正确使用流程：

1. **安装CLI**: `npm install -g k2site`
2. **创建项目**: `k2site create my-site`
3. **生成内容**: `k2site generate -k "你的关键词"`
4. **开发调试**: `k2site dev`
5. **部署上线**: `k2site deploy`

这样您就能快速创建一个**基于您关键词的专业网站**，而不仅仅是一个演示站！

---

## 📞 获取帮助

- 🆘 命令帮助: `k2site --help`
- 📚 项目文档: `README.md`
- 🐛 问题反馈: GitHub Issues
- 💬 社区讨论: GitHub Discussions

**开始创建您的专属网站吧！** 🚀