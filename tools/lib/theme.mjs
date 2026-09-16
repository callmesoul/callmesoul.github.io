import { createHash } from 'node:crypto'
import { cpSync, existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import yaml from 'js-yaml'
import { extract } from 'tar'

export const required = ['_config.yml', 'layout/layout.ejs', 'scripts/about.js', 'source/js/main.js', 'source/css/hexo.css', 'source/images', 'source/audio']
export const checksum = bytes => createHash('sha256').update(bytes).digest('hex')

export function validateRevision(rev) {
  if (!/^[\w.-]+\/[\w.-]+$/.test(rev.repo)) throw new Error('主题 repo 必须为 owner/repo')
  if (!/^v\d+\.\d+\.\d+$/.test(rev.tag)) throw new Error('主题 tag 必须为 vX.Y.Z')
  if (!/^[a-f0-9]{40}$/.test(rev.sha)) throw new Error('主题 sha 必须是完整提交 SHA')
  if (!['source', 'release'].includes(rev.distribution)) throw new Error('distribution 必须为 source 或 release')
  if (rev.distribution === 'release' && !/^[a-f0-9]{64}$/.test(rev.sha256)) throw new Error('发布包必须锁定 sha256')
  return rev
}

export function readRevision(root) {
  return validateRevision(yaml.load(readFileSync(join(root, 'THEME_REVISION'), 'utf8')))
}

export function mergeConfig(defaults, overrides) {
  if (!overrides || typeof overrides !== 'object' || Array.isArray(overrides)) return overrides
  const result = { ...(defaults && typeof defaults === 'object' && !Array.isArray(defaults) ? defaults : {}) }
  for (const [key, value] of Object.entries(overrides)) {
    if (['__proto__', 'constructor', 'prototype'].includes(key)) throw new Error(`不支持配置键 ${key}`)
    result[key] = mergeConfig(result[key], value)
  }
  return result
}

export function loadConfig(file) {
  const value = yaml.load(readFileSync(file, 'utf8')) ?? {}
  if (typeof value !== 'object' || Array.isArray(value)) throw new Error(`${file} 必须是配置对象`)
  return value
}

export function assertConfigLocation(root) {
  const siteConfig = join(root, '_config.yml')
  if (existsSync(join(root, '_config.hexo.yml')) || existsSync(join(root, '_config.hexo.json')) || (existsSync(siteConfig) && Object.hasOwn(loadConfig(siteConfig), 'theme_config'))) {
    throw new Error('请将个人主题配置统一放在 theme/config.yml，移除 _config.hexo.yml/json 和 theme_config')
  }
}

export function treeDigest(dir, exclude = []) {
  const hash = createHash('sha256')
  function visit(current, prefix = '') {
    for (const name of readdirSync(current).sort()) {
      const relative = prefix + name
      if (exclude.includes(relative)) continue
      const file = join(current, name)
      const stat = lstatSync(file)
      if (stat.isSymbolicLink()) throw new Error(`资源不能为软链接：${file}`)
      hash.update(relative + '\0')
      if (stat.isDirectory()) visit(file, relative + '/')
      else if (stat.isFile()) hash.update(readFileSync(file))
      else throw new Error(`不支持的资源类型：${file}`)
    }
  }
  if (existsSync(dir)) visit(dir)
  return hash.digest('hex')
}

export function inputDigest(root, revision) {
  return checksum(JSON.stringify(revision) + readFileSync(join(root, 'theme/config.yml'), 'utf8') + treeDigest(join(root, 'theme/assets')))
}

export function isCurrent(root, revision) {
  const target = join(root, 'themes/hexo')
  try {
    const state = JSON.parse(readFileSync(join(target, '.sync-state.json'), 'utf8'))
    return state.input === inputDigest(root, revision) && state.output === treeDigest(target, ['.sync-state.json'])
  } catch { return false }
}

export function validateTheme(theme, revision, local = false) {
  for (const path of required) {
    if (!existsSync(join(theme, path))) throw new Error(`主题包缺少 ${path}`)
  }
  const metadata = JSON.parse(readFileSync(join(theme, 'theme.json'), 'utf8'))
  if (metadata.schema !== 1 || metadata.sha !== revision.sha || metadata.tag !== revision.tag || metadata.version !== revision.tag.slice(1)) throw new Error('主题包版本/提交与版本记录不一致')
  if (metadata.dirty && !local) throw new Error('发布包包含未提交的源码')
  return metadata
}

export async function unpack(file, stage, revision, local = false) {
  if (revision.sha256 && checksum(readFileSync(file)) !== revision.sha256) throw new Error('发布包 SHA256 不一致，旧主题保持原样')
  let invalid = false
  await extract({
    file, cwd: stage, strict: true,
    filter(path, entry) {
      const valid = path.startsWith('hexo/') && !path.includes('\\') && !path.split('/').includes('..') && ['File', 'Directory'].includes(entry.type)
      if (!valid) invalid = true
      return valid
    },
  })
  if (invalid) throw new Error('主题包包含无效路径或软链接')
  return validateTheme(join(stage, 'hexo'), revision, local)
}

export function installTheme(root, prepared, revision, writeRevision = false) {
  assertConfigLocation(root)
  const target = join(root, 'themes/hexo')
  if (existsSync(target) && lstatSync(target).isSymbolicLink()) throw new Error('themes/hexo 是软链接，不能替换')
  // 在替换旧目录前，先完成配置解析、资源拷贝和校验。
  const config = mergeConfig(loadConfig(join(prepared, '_config.yml')), loadConfig(join(root, 'theme/config.yml')))
  writeFileSync(join(prepared, '_config.yml'), yaml.dump(config, { lineWidth: -1, noRefs: true }))
  const assets = join(root, 'theme/assets')
  if (existsSync(assets)) {
    treeDigest(assets)
    for (const entry of readdirSync(assets)) {
      if (!['images', 'audio'].includes(entry)) throw new Error(`个人资源只支持 images/audio：${entry}`)
    }
    cpSync(assets, join(prepared, 'source'), { recursive: true })
  }
  const state = { input: inputDigest(root, revision), output: treeDigest(prepared, ['.sync-state.json']) }
  writeFileSync(join(prepared, '.sync-state.json'), JSON.stringify(state) + '\n')
  mkdirSync(dirname(target), { recursive: true })
  const backupRoot = mkdtempSync(join(dirname(target), '.hexo-backup-'))
  const backup = join(backupRoot, 'hexo')
  const hadTarget = existsSync(target)
  let installed = false
  let completed = false
  try {
    if (hadTarget) renameSync(target, backup)
    renameSync(prepared, target)
    installed = true
    if (writeRevision) {
      const pending = join(root, 'THEME_REVISION.tmp')
      writeFileSync(pending, yaml.dump(revision, { lineWidth: -1 }))
      renameSync(pending, join(root, 'THEME_REVISION'))
    }
    completed = true
  } catch (error) {
    if (installed) rmSync(target, { recursive: true, force: true })
    if (hadTarget && existsSync(backup)) renameSync(backup, target)
    throw error
  } finally {
    // 若恢复旧目录也失败，保留备份以便恢复，不能清理旧主题。
    if (completed || !existsSync(backup)) rmSync(backupRoot, { recursive: true, force: true })
  }
}

export async function download(url, target) {
  const response = await fetch(url, { signal: AbortSignal.timeout(120000) })
  if (!response.ok) throw new Error(`下载失败 HTTP ${response.status}：${url}`)
  writeFileSync(target, Buffer.from(await response.arrayBuffer()))
}

export const releaseBase = rev => `https://github.com/${rev.repo}/releases/download/${rev.tag}`
export const archiveName = rev => `soul-blog-hexo-${rev.tag}.tar.gz`
