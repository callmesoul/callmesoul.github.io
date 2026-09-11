---
title: '认识 soul-blog-theme：一套视觉系统，适配所有框架'
date: 2026-09-10 18:30:00
updated: 2026-09-11 00:00:00
description: soul-blog-theme 基于 Web Components，为原生 JavaScript、Vue、React 和 Hexo 提供一致的博客体验。
cover: /images/covers/soul-blog-theme.png
categories:
  - 开源
tags:
  - Hexo
  - Web Components
  - TypeScript
  - 开源
---

通常，要让同一个博客主题支持原生 JavaScript、Vue、React 和 Hexo，就意味着需要分别维护四套组件、样式与交互。随着功能不断增加，这些实现很容易逐渐演变成四个不同的产品。

[soul-blog-theme](https://github.com/callmesoul/soul-blog-theme) 选择了另一种方式：使用 Web Components 构建统一的 UI 核心，同时有意让各个框架的集成层保持轻量。每个目标平台既保留原生的开发体验，又能共享相同的视觉语言与交互方式。

## 一套 UI，四种运行方式

项目采用 monorepo 结构。`packages/core` 包含与框架无关的 `@soul-blog/wc` 组件库，`themes` 则分别提供原生 JavaScript、Vue 3、React 18 和 Hexo 的专用集成。

核心组件使用 TypeScript 编写，并通过 Shadow DOM 封装自身的结构与样式。Vue、React 和 Hexo 集成不会重新实现整套组件，而只负责准备各自环境所需的数据与页面入口。因此，修复与新功能可以从同一套源代码同步到所有主题。

```text
soul-blog-theme/
├── packages/core        # @soul-blog/wc，UI 的唯一事实来源
└── themes
    ├── vanilla          # 原生 JavaScript
    ├── vue              # Vue 3
    ├── react            # React 18
    └── hexo             # EJS 模板与 Vite 构建
```

## 不只是换一套外观

Soul 的特色并不只有深色视觉风格，它还汇集了读者对现代博客所期待的各种功能：

- 对标题、分类及文章内容进行全文模糊搜索，并支持键盘导航
- 使用 FLIP 动画，让文章卡片自然过渡到阅读器
- 常驻音乐播放器，支持播放列表、音量记忆和多种播放模式
- 按年、月和文章组织的时间线归档，并支持渐进加载
- 相互联动的标签云、文章标签与列表筛选器
- 由 Vercount 提供的站点 PV/UV 与单篇文章浏览量统计
- 将 Giscus 评论映射到稳定的文章标识，避免讨论内容在 SPA 路由之间发生冲突
- 由配置驱动的“关于”页面，无需修改模板
- 桌面端、平板和移动设备共享的响应式布局

目前，核心库已经包含网站背景、侧边栏、文章列表、文章阅读器、归档、“关于”页面、搜索面板、搜索结果、音乐播放器和登录面板等 Web Components。它们共享数据契约与设计令牌，每个组件也可以独立复用到其他宿主应用中。

## 为什么选择 Web Components？

Web Components 是浏览器原生的组件模型，它为这个项目带来了三个直接的好处。

首先，它与框架无关。组件注册后，就能像普通 HTML 元素一样用在 Hexo EJS 模板、Vue 模板或 React JSX 中。

其次，它能建立清晰的边界。Shadow DOM 会隔离组件的内部样式，减少主题与宿主应用之间意外发生样式冲突的可能。

最后，它能降低维护成本。交互逻辑、样式和无障碍体验的改进都可以集中在核心包中，各个集成层只需负责路由、状态或静态数据注入。

## Hexo 版本如何工作

Hexo 集成使用 EJS 序列化站点数据，然后加载由 Vite 打包的 Web Components。生成的 CSS 和 JavaScript 位于主题的 `source` 目录中。Hexo 生成静态站点时，会将这些文件连同所需的图片和音频资源一起发布。

本站在 Hexo 根配置中启用了该主题：

```yaml
theme: hexo
```

使用以下命令启动本地开发服务器或生成静态站点：

```bash
npm run dev
npm run build
```

开发服务器默认运行在 `http://localhost:4000/`。文章仍然是普通的 Markdown 文件，而首页、归档、文章详情和“关于”页面则由 Soul 的组件负责渲染。

## 通过配置打造专属博客

主题颜色、Logo、社交链接、页脚文字和“关于”页面内容都集中在 `themes/hexo/_config.yml` 中。将内容与组件代码分离，不仅让自定义更加直接，也让今后的主题升级更加轻松。

如果需要更深入的调整，核心设计令牌还开放了品牌色、页面与面板背景色、文字层级和边框颜色。只需更新这些令牌并重新构建核心库与 Hexo 主题，新设计就会应用到整个站点。

## ☕ 打赏

如果这个项目对你有用，可以请我喝杯奶茶 🧋

<div align="center">
  <img src="/images/payment.png" alt="打赏二维码" width="200">
</div>

## 写在最后

soul-blog-theme 是一次对有效复用的探索。它试图证明：一套独特而完整的博客体验，并不需要被锁定在某一个框架中。无论内容由 Hexo 静态生成，还是承载在 Vue 或 React 应用里，真正值得长期维护的，始终是共享的设计语言与交互核心。

项目仍在持续演进。欢迎访问 [GitHub 仓库](https://github.com/callmesoul/soul-blog-theme)，查看源代码、最新功能与使用文档。
