
═══ 生成示例内容 ═══
✓ 生成文章: K2Site快速入门指南
✓ 生成文章: 现代网站SEO优化完全攻略
✓ 生成文章: 静态网站生成器全面对比：Astro vs Next.js vs Gatsby
✓ ✨ 成功生成 3 篇示例文章
ℹ 现在可以运行 npm run dev 查看网站效果
✓ 示例内容生成完成

🚀 构建项目
ℹ 执行: pnpm build || npm run build

> k2site@1.0.0 build D:\Users\Fzero\project\my-website\k2site-generator
> astro build

✘ [ERROR] The build was canceled

11:31:41 [types] Generated 226ms
11:31:41 [build] output: "static"
11:31:41 [build] directory: D:\Users\Fzero\project\my-website\k2site-generator\dist\
11:31:41 [build] Collecting build info...
11:31:41 [build] ✓ Completed in 357ms.
11:31:41 [build] Building static entrypoints...
11:31:42 [ERROR] [vite] x Build failed in 329ms
[vite:load-fallback] Could not load /src/layouts/PageLayout.astro (imported by src/pages/about.md): ENOENT: no such file or directory, open 'D:\src\layouts\PageLayout.astro'
  Stack trace:
    at async open (node:internal/fs/promises:639:25)
    at async Object.load (file:///D:/Users/Fzero/project/my-website/k2site-generator/node_modules/.pnpm/vite@5.4.19_@types+node@20.19.11/node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:65341:25)
    at async file:///D:/Users/Fzero/project/my-website/k2site-generator/node_modules/.pnpm/rollup@4.48.0/node_modules/rollup/dist/es/shared/node-entry.js:21255:33
 ELIFECYCLE  Command failed with exit code 1.
系统找不到指定的路径。

> k2site@1.0.0 build
> astro build

✘ [ERROR] The build was canceled

11:31:46 [types] Generated 184ms
11:31:46 [build] output: "static"
11:31:46 [build] directory: D:\Users\Fzero\project\my-website\k2site-generator\dist\
11:31:46 [build] Collecting build info...
11:31:46 [build] ✓ Completed in 310ms.
11:31:46 [build] Building static entrypoints...
11:31:46 [ERROR] [vite] x Build failed in 314ms
[vite:load-fallback] Could not load /src/layouts/PageLayout.astro (imported by src/pages/about.md): ENOENT: no such file or directory, open 'D:\src\layouts\PageLayout.astro'
  Stack trace:
    at async open (node:internal/fs/promises:639:25)
    at async Object.load (file:///D:/Users/Fzero/project/my-website/k2site-generator/node_modules/.pnpm/vite@5.4.19_@types+node@20.19.11/node_modules/vite/dist/node/chunks/dep-C6uTJdX2.js:65341:25)
    at async file:///D:/Users/Fzero/project/my-website/k2site-generator/node_modules/.pnpm/rollup@4.48.0/node_modules/rollup/dist/es/shared/node-entry.js:21255:33
✗ 命令执行失败: Command failed: pnpm build || npm run build