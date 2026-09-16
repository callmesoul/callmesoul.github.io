import assert from 'node:assert/strict'
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import test from 'node:test'
import yaml from 'js-yaml'
import { create } from 'tar'
import { checksum, installTheme, isCurrent, loadConfig, readRevision, treeDigest, unpack } from './lib/theme.mjs'
import { update } from './theme-update.mjs'

const oldRevision = { repo: 'callmesoul/soul-blog-theme', tag: 'v1.8.0', sha: 'a'.repeat(40), distribution: 'source' }
const newRevision = { repo: oldRevision.repo, tag: 'v1.9.0', sha: 'b'.repeat(40), distribution: 'release' }
function write(file, text) { mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, text) }
function site(t) {
  const root = mkdtempSync(join(tmpdir(), 'hexo-updater-test-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  write(join(root, 'THEME_REVISION'), yaml.dump(oldRevision))
  write(join(root, 'themes/hexo/old-only.txt'), '旧版文件')
  write(join(root, 'theme/config.yml'), yaml.dump({ social: [{ name: '个人 GitHub', url: 'https://github.com/callmesoul' }], giscus: { repo: 'personal/blog', enabled: false }, friends: { links: [] } }))
  write(join(root, 'theme/assets/images/personal.png'), '个人图片')
  write(join(root, 'theme/assets/images/shared.png'), '个人覆盖')
  return root
}
async function bundle(root, revision = newRevision) {
  const source = join(root, 'bundle')
  const theme = join(source, 'hexo')
  write(join(theme, '_config.yml'), yaml.dump({ social: [{ name: '默认微信', qr: '/default-qr.png' }, { name: '默认QQ' }], giscus: { repo: 'upstream/theme', enabled: true, lang: 'zh-CN', new_option: true }, friends: { links: [{ name: '默认友链' }], new_option: 42 }, new_feature: { enabled: true } }))
  for (const path of ['layout/layout.ejs', 'scripts/about.js', 'source/js/main.js', 'source/css/hexo.css', 'source/images/shared.png', 'source/images/new-default.png', 'source/audio/new-default.mp3']) write(join(theme, path), '新版默认资源')
  write(join(theme, 'theme.json'), JSON.stringify({ schema: 1, ...revision, version: revision.tag.slice(1), dirty: false }))
  const file = join(root, `soul-blog-hexo-${revision.tag}.tar.gz`)
  await create({ file, cwd: source, gzip: true }, ['hexo'])
  return { file, theme, revision: { ...revision, sha256: checksum(readFileSync(file)) } }
}

test('完整发布升级：默认配置继承、数组缩减/清空、个人资源保留、旧文件删除、版本锁定', async t => {
  const root = site(t)
  const pkg = await bundle(root)
  const originalConfig = readFileSync(join(root, 'theme/config.yml'), 'utf8')
  const originalFetch = globalThis.fetch
  t.after(() => { globalThis.fetch = originalFetch })
  globalThis.fetch = async url => {
    if (url.endsWith('/hexo-release.json')) return new Response(JSON.stringify({ schema: 1, ...pkg.revision, version: '1.9.0', dirty: false, archive: 'soul-blog-hexo-v1.9.0.tar.gz' }))
    return new Response(readFileSync(pkg.file))
  }
  await update(root, 'v1.9.0')
  const config = loadConfig(join(root, 'themes/hexo/_config.yml'))
  assert.deepEqual(config.social, [{ name: '个人 GitHub', url: 'https://github.com/callmesoul' }])
  assert.deepEqual(config.friends.links, [])
  assert.equal(config.giscus.repo, 'personal/blog')
  assert.equal(config.giscus.enabled, false)
  assert.equal(config.giscus.new_option, true)
  assert.equal(config.new_feature.enabled, true)
  assert.equal(config.friends.new_option, 42)
  assert.equal(readFileSync(join(root, 'themes/hexo/source/images/shared.png'), 'utf8'), '个人覆盖')
  assert.equal(readFileSync(join(root, 'themes/hexo/source/images/new-default.png'), 'utf8'), '新版默认资源')
  assert.equal(readFileSync(join(root, 'themes/hexo/source/images/personal.png'), 'utf8'), '个人图片')
  assert.throws(() => readFileSync(join(root, 'themes/hexo/old-only.txt')))
  assert.deepEqual(readRevision(root), pkg.revision)
  assert.equal(readFileSync(join(root, 'theme/config.yml'), 'utf8'), originalConfig)
  assert.equal(isCurrent(root, pkg.revision), true)
  write(join(root, 'theme/config.yml'), originalConfig + '\n# 已修改个人配置\n')
  assert.equal(isCurrent(root, pkg.revision), false)
  write(join(root, 'theme/config.yml'), originalConfig)
  write(join(root, 'theme/assets/images/another-personal.png'), '新增个人资源')
  assert.equal(isCurrent(root, pkg.revision), false)
  rmSync(join(root, 'theme/assets/images/another-personal.png'))
  assert.equal(isCurrent(root, pkg.revision), true)
  write(join(root, 'themes/hexo/source/js/main.js'), '错误旧产物')
  assert.equal(isCurrent(root, pkg.revision), false)
})

test('下载、校验、缺失文件、错误提交及 YAML 失败均保留旧目录和版本', async t => {
  const root = site(t)
  const pkg = await bundle(root)
  const before = treeDigest(join(root, 'themes/hexo'))
  const lock = readFileSync(join(root, 'THEME_REVISION'), 'utf8')
  const stage = join(root, 'stage'); mkdirSync(stage)
  await assert.rejects(unpack(pkg.file, stage, { ...pkg.revision, sha256: '0'.repeat(64) }), /SHA256/)
  await assert.rejects(unpack(pkg.file, stage, { ...pkg.revision, sha: 'c'.repeat(40) }), /版本/)
  await unpack(pkg.file, stage, pkg.revision)
  write(join(root, 'theme/config.yml'), 'social: [')
  assert.throws(() => installTheme(root, join(stage, 'hexo'), pkg.revision, true))
  const originalFetch = globalThis.fetch
  t.after(() => { globalThis.fetch = originalFetch })
  globalThis.fetch = async () => new Response('not found', { status: 404 })
  await assert.rejects(update(root, 'v1.9.0'), /HTTP 404/)
  assert.equal(treeDigest(join(root, 'themes/hexo')), before)
  assert.equal(readFileSync(join(root, 'THEME_REVISION'), 'utf8'), lock)
  rmSync(join(pkg.theme, 'source/js/main.js'))
  const broken = join(root, 'broken.tar.gz')
  await create({ file: broken, cwd: join(root, 'bundle'), gzip: true }, ['hexo'])
  const brokenStage = join(root, 'broken-stage'); mkdirSync(brokenStage)
  await assert.rejects(unpack(broken, brokenStage, { ...pkg.revision, sha256: checksum(readFileSync(broken)) }), /缺少/)
})

test('写入版本记录失败时回滚目录；拒绝软链接覆盖和含软链接的包', async t => {
  const root = site(t)
  const pkg = await bundle(root)
  const before = treeDigest(join(root, 'themes/hexo'))
  const lock = readFileSync(join(root, 'THEME_REVISION'), 'utf8')
  const prepared = join(root, 'prepared'); cpSync(pkg.theme, prepared, { recursive: true })
  mkdirSync(join(root, 'THEME_REVISION.tmp'))
  assert.throws(() => installTheme(root, prepared, pkg.revision, true))
  assert.equal(treeDigest(join(root, 'themes/hexo')), before)
  assert.equal(readFileSync(join(root, 'THEME_REVISION'), 'utf8'), lock)
  symlinkSync('/tmp', join(pkg.theme, 'escape'))
  const linked = join(root, 'linked.tar.gz')
  await create({ file: linked, cwd: join(root, 'bundle'), gzip: true }, ['hexo'])
  const stage = join(root, 'stage'); mkdirSync(stage)
  await assert.rejects(unpack(linked, stage, { ...pkg.revision, sha256: checksum(readFileSync(linked)) }), /软链接/)
  rmSync(join(root, 'themes/hexo'), { recursive: true })
  symlinkSync(join(root, 'bundle'), join(root, 'themes/hexo'))
  assert.throws(() => installTheme(root, pkg.theme, pkg.revision), /软链接/)
})
