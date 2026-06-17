# AGENTS.md

## Verification Commands

After editing code, run these commands in order to verify correctness:

```bash
# Lint check
yarn lint

# Auto-fix lint issues
yarn lint:fix

# Format code
yarn format

# Check formatting only
yarn format:check

# Lint + format in one pass
yarn lint:format

# Generate static site (SSG build)
yarn generate

# Dev server
yarn dev

# Preview production build
yarn preview

# Generate game data from scripts
yarn makedata
```

## Documentation Index (content/introduction/)

| File (en) | File (zh) | Core Description |
|-----------|-----------|------------------|
| `project-structure-en.md` | `project-structure-zh.md` | Project tech stack, directory layout, and purpose of every file/folder. Read when you need to understand how the project is organized or where to place new code. |
| `format-specification-en.md` | `format-specification-zh.md` | IDE-agnostic formatting rules (ESLint, Prettier) to keep code style consistent and diffs readable. Read before making any edits to ensure your environment matches project conventions. |
| `route-setting-en.md` | `route-setting-zh.md` | How routing works — configuring page routes, sidebar menu, and navigation structure. Read when adding or modifying pages. |
| `docs-setting-en.md` | `docs-setting-zh.md` | How to create, organize, and internationalize documentation pages (file creation, nav config, i18n). Read when adding documentation content. |
| `contributor-setting-en.md` | `contributor-setting-zh.md` | How to add your information to the project's contributor list. Read when onboarding new contributors. |
| `common-questions-en.md` | `common-questions-zh.md` | Troubleshooting common development issues (e.g., `better-sqlite3` build failures). Read when encountering setup or build problems. |
