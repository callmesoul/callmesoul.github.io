# callmesoul.github.io

CallMeSoul 的 Hexo 博客，使用 [soul-blog-theme](https://github.com/callmesoul/soul-blog-theme)。

## 本地开发

需要 Node 24，安装依赖后即可启动：

```bash
npm ci
npm run dev
```

开发服务为 http://localhost:4000/。`dev`、`server`、`build` 会先自动同步主题；版本、配置、资源及生成目录未变时跳过重建。无需手动准备 `themes/hexo/`。

## 更新主题

当前使用 **v1.9.0 发布包**。一条命令安装指定版本：

```bash
npm run theme:update -- v1.9.0
npm run clean
npm run build
```

更新会校验发布包 SHA256、内嵌版本与提交，完整替换主题，然后应用个人配置和资源。只有安装成功才更新 `THEME_REVISION`；下载、校验或配置解析失败会保留旧主题及版本记录。验证后提交站点改动，推送 `dev` 由 GitHub Pages CI 部署。

`THEME_REVISION` 是本地与 CI 共用的唯一版本来源。正常发布包模式包含 `repo`、`tag`、`sha`、`distribution: release` 和 `sha256`，由更新命令自动写入。回退时用相同命令安装旧的已打包版本，或恢复旧版本记录后重新同步。

历史版本 **v1.8.0 无运行包**，保留 `distribution: source` 兼容路径：该旧版模式首次生成需 pnpm 11.13.1，脚本拉取锁定提交、验证 tag，构建 Core 与 Hexo，并带上完整默认图片和音乐。新版本通过更新命令自动切换到 `release`，站点无需再安装 pnpm 或构建上游 monorepo。不会在发布包下载失败时静默切换源码。

## 个人配置与资源

- `theme/config.yml`：个人主题配置，包括社交链接、Giscus、关于我和友链。对象逐层覆盖、数组整体替换；未填写字段继承新版默认值，`social: []` 或 `friends.links: []` 可清空列表。
- `theme/assets/images/`、`theme/assets/audio/`：个人资源；同路径覆盖主题默认资源。未修改的默认图片、音乐由主题提供，避免旧副本阻止默认资源更新。
- `source/`：文章及站点内容。
- `themes/hexo/`：完整生成目录，已忽略；可整体删除重建，请勿直接编辑。
- `.theme-cache/`：经过校验的发布包缓存。
- `.theme-upstream/`：仅用于旧版源码构建的缓存。

主题配置只维护 `theme/config.yml`，不要同时填写站点 `_config.yml` 的 `theme_config` 或 `_config.hexo.yml`，避免 Hexo 原生数组合并改变结果。

## 验证与本地主题预览

```bash
npm run test:theme
npm run build
npm run theme:sync -- --force
```

静态输出位于 `public/`。本地主题开发可先在上游运行 `pnpm package:hexo`，再导入与当前锁定 tag/sha 一致的运行包：

```bash
npm run theme:sync -- --archive /home/callmesoul/code/soul-blog-theme/dist/hexo/soul-blog-hexo-v1.9.0.tar.gz
npm run dev
```

本地预览不修改版本记录。需要恢复正式版本时执行 `npm run theme:sync -- --force`。
