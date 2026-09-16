#!/usr/bin/env node
import { mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { archiveName, download, installTheme, readRevision, releaseBase, unpack, validateRevision } from './lib/theme.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
export async function update(root, tag) {
  const current = readRevision(root)
  if (!/^v\d+\.\d+\.\d+$/.test(tag)) throw new Error('用法：npm run theme:update -- vX.Y.Z')
  mkdirSync(join(root, 'themes'), { recursive: true })
  const stage = mkdtempSync(join(root, 'themes/.hexo-stage-'))
  try {
    const release = { repo: current.repo, tag }
    const metadataFile = join(stage, 'hexo-release.json')
    await download(`${releaseBase(release)}/hexo-release.json`, metadataFile)
    const metadata = JSON.parse(readFileSync(metadataFile, 'utf8'))
    if (metadata.schema !== 1 || metadata.tag !== tag || metadata.version !== tag.slice(1) || metadata.dirty || metadata.archive !== archiveName(release)) throw new Error('发布元数据不匹配')
    const revision = validateRevision({ ...release, sha: metadata.sha, distribution: 'release', sha256: metadata.sha256 })
    const archive = join(stage, metadata.archive)
    await download(`${releaseBase(revision)}/${metadata.archive}`, archive)
    await unpack(archive, stage, revision)
    installTheme(root, join(stage, 'hexo'), revision, true)
    console.log(`[theme-update] 已更新到 ${tag}，THEME_REVISION 已锁定提交及发布包校验值`)
    console.log('[theme-update] 执行 npm run clean 和 npm run build 验证后提交')
  } finally { rmSync(stage, { recursive: true, force: true }) }
}
if (resolve(process.argv[1] || '') === fileURLToPath(import.meta.url)) {
  try { await update(root, process.argv[2]) } catch (error) {
    console.error(`[theme-update] ${error.message}；更新失败时保留旧主题及版本记录`)
    process.exitCode = 1
  }
}
