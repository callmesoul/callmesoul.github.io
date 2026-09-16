#!/usr/bin/env node
import { execFileSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { archiveName, assertConfigLocation, checksum, download, installTheme, isCurrent, readRevision, releaseBase, unpack, validateTheme } from './lib/theme.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const archiveIndex = args.indexOf('--archive')
if (archiveIndex >= 0 && !args[archiveIndex + 1]) throw new Error('--archive 缺少文件路径')
const localArchive = archiveIndex >= 0 ? resolve(args[archiveIndex + 1]) : null
const force = args.includes('--force')
const revision = readRevision(root)
const log = message => console.log(`[theme-sync] ${message}`)
const run = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, stdio: 'inherit' })

async function sync() {
  assertConfigLocation(root)
  if (!localArchive && !force && isCurrent(root, revision)) {
    log(`${revision.tag} 与个人配置/资源一致，无需重建`)
    return
  }
  // 与目标目录放在同一文件系统，替换时可使用 rename 并回滚。
  mkdirSync(join(root, 'themes'), { recursive: true })
  const stage = mkdtempSync(join(root, 'themes/.hexo-stage-'))
  try {
    if (localArchive || revision.distribution === 'release') {
      let file = localArchive
      if (!file) {
        const cache = join(root, '.theme-cache')
        mkdirSync(cache, { recursive: true })
        file = join(cache, `${revision.sha256}.tar.gz`)
        if (!existsSync(file) || checksum(readFileSync(file)) !== revision.sha256) {
          log(`下载 ${revision.tag} 运行包`)
          await download(`${releaseBase(revision)}/${archiveName(revision)}`, file)
        }
      }
      await unpack(file, stage, revision, Boolean(localArchive))
    } else {
      // 兼容未提供运行包的旧版本；新版本通过 theme:update 切换到 release。
      const upstream = join(root, '.theme-upstream')
      const git = args => execFileSync('git', args, { cwd: upstream, encoding: 'utf8' }).trim()
      if (!existsSync(join(upstream, '.git'))) run('git', ['clone', '--filter=blob:none', `https://github.com/${revision.repo}.git`, upstream], root)
      if (git(['status', '--porcelain'])) throw new Error('.theme-upstream 有未提交修改，请先处理')
      try { git(['rev-parse', `${revision.tag}^{commit}`]) } catch { run('git', ['fetch', '--tags', 'origin'], upstream) }
      if (git(['rev-parse', `${revision.tag}^{commit}`]) !== revision.sha) throw new Error('旧版 tag 与锁定 SHA 不一致')
      run('git', ['checkout', '--detach', revision.sha], upstream)
      run('pnpm', ['install', '--frozen-lockfile'], upstream)
      for (const script of ['build:core', 'build:hexo']) run('pnpm', [script], upstream)
      const source = join(upstream, 'themes/hexo')
      const theme = join(stage, 'hexo')
      mkdirSync(theme)
      for (const path of ['layout', 'scripts', '_config.yml', 'source/js', 'source/css']) cpSync(join(source, path), join(theme, path), { recursive: true })
      // 旧版 Vite 不复制默认资源，从上游 assets 补齐。
      for (const dir of ['images', 'audio']) cpSync(join(upstream, 'assets', dir), join(theme, 'source', dir), { recursive: true })
      writeFileSync(join(theme, 'package.json'), JSON.stringify({ name: '@soul-blog/hexo', version: revision.tag.slice(1), private: true, type: 'commonjs' }) + '\n')
      writeFileSync(join(theme, 'theme.json'), JSON.stringify({ schema: 1, version: revision.tag.slice(1), tag: revision.tag, sha: revision.sha, dirty: false }) + '\n')
      validateTheme(theme, revision)
    }
    installTheme(root, join(stage, 'hexo'), revision)
    log(`${revision.tag} 已安装；新版默认配置和资源已应用，个人内容已保留`)
  } finally { rmSync(stage, { recursive: true, force: true }) }
}

try { await sync() } catch (error) {
  console.error(`[theme-sync] ${error.message}`)
  process.exitCode = 1
}
