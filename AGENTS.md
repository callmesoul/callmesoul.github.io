# Repository Guidelines

This repository contains the CallMeSoul Hexo blog. Pushing `dev` triggers
`.github/workflows/pages.yml` and publishes to GitHub Pages.

## Commands

- Install: `npm ci` (Node 24).
- Develop: `npm run dev` (http://localhost:4000/).
- Generate: `npm run build`.
- Clear output/cache: `npm run clean`.
- Update theme: `npm run theme:update -- vX.Y.Z`.
- Verify updater: `npm run test:theme`.

`dev`, `server`, and `build` automatically run `theme:sync` first. Identical
version/configuration/assets and intact generated files skip regeneration.
Run `npm run test:theme`, `npm run build`, and `git diff --check` before committing.

## Theme ownership and updates

- `_config.yml`: Hexo site configuration; keep `theme: hexo`.
- `source/`: site posts and authored content.
- `theme/config.yml`: personal theme overrides. Objects merge recursively,
  arrays replace entirely (including `[]`), omitted fields inherit new defaults.
- `theme/assets/images/` and `theme/assets/audio/`: personal assets only;
  matching paths override the package defaults. Do not copy unchanged defaults here.
- `THEME_REVISION`: sole version lock (repo, tag, sha, distribution, sha256).
- `themes/hexo/`: generated runtime theme. Do not edit or commit this directory.
- `.theme-cache/`, `.theme-upstream/`, `public/`: ignored generated/cache directories.

Normal upgrades download the complete runtime release, verify its SHA256 and
embedded version/commit, prepare all files and personal overrides in a temporary
directory, then replace the entire theme. No file-by-file comparison is required.
Only a successful installation updates `THEME_REVISION`. The previous theme is
restored if replacement or writing the version lock fails.

The site currently uses v1.9.1 with `distribution: release`. Historical v1.8.0
has no runtime release and uses `distribution: source`.
This legacy path requires pnpm 11.13.1, validates tag against sha, builds Core and
Hexo, and includes upstream `assets/images` and `assets/audio`. New packaged
versions installed with `theme:update` automatically switch to `release`, which
requires no theme checkout or pnpm in the site. Do not silently fall back to a
source build if a packaged release cannot be downloaded or verified.

Use `npm run theme:sync -- --force` to regenerate the pinned version, or
`npm run theme:sync -- --archive /absolute/path/to/package.tar.gz` to preview a
locally built package matching the pinned tag/sha. Local packages do not change
the version lock and must not be treated as published releases.

Preserve site content and personal configuration during upgrades. Do not overwrite
unrelated user changes in a dirty worktree. Use Conventional Commits. Publishing
happens by pushing the intended commit to `dev`; verify build and deploy jobs.
