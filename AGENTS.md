# AGENTS.md

## The One Percent Principle

If you feel that the part you want to modify has even the slightest possibility of being related to a document, read the relevant document first before making any changes.

## Verification Commands

After editing code, run these commands in order to verify correctness:

```bash
# Lint + format in one pass
yarn lint:format

# Generate static site (SSG build)
yarn generate

# Generate game data from scripts (If relevant files are modified)
yarn makedata
```

## Important Requirements

- **Keep README in sync**: If you add, remove, or restructure directories/files, update the `项目结构` section in `README.md` accordingly.
- **Reuse before write**: Before writing new utility/tool functions, check `shared/utils/` (see index below) — if a reusable function already exists, use it instead of duplicating.

## Documentation Index (content/introduction/)

| File (en) | File (zh) | Core Description |
|-----------|-----------|------------------|
| `project-structure-en.md` | `project-structure-zh.md` | Project tech stack, directory layout, and purpose of every file/folder. Read when you need to understand how the project is organized or where to place new code. |
| `format-specification-en.md` | `format-specification-zh.md` | IDE-agnostic formatting rules (ESLint, Prettier) to keep code style consistent and diffs readable. Read before making any edits to ensure your environment matches project conventions. |
| `route-setting-en.md` | `route-setting-zh.md` | How routing works — configuring page routes, sidebar menu, and navigation structure. Read when adding or modifying pages. |
| `docs-setting-en.md` | `docs-setting-zh.md` | How to create, organize, and internationalize documentation pages (file creation, nav config, i18n). Read when adding documentation content. |
| `contributor-setting-en.md` | `contributor-setting-zh.md` | How to add your information to the project's contributor list. Read when onboarding new contributors. |
| `common-questions-en.md` | `common-questions-zh.md` | Troubleshooting common development issues (e.g., `better-sqlite3` build failures). Read when encountering setup or build problems. |

## Shared Utils Index (shared/utils/)

| File | Core Description |
|------|------------------|
| `autoFontSizing.ts` | Auto-resize font to fit container width |
| `combinatoricUtil.ts` | Combinatorial generation (k-combinations from array) |
| `dateUtil.ts` | Date/time formatting with custom template strings |
| `debounce.ts` | Debounce wrapper for rate-limiting function calls |
| `domUtil.ts` | DOM helpers — get real element from component ref, scroll, position |
| `gacha-calculator.ts` | Gacha reward statistics engine (simulation, probability, resource统计) |
| `numberUtil.ts` | Number rounding, formatting utilities |
| `trialOfSwordmancy.ts` | Trial of Swordmancy game logic types, enums, constants |
| `trialOfSwordmancyDeck.ts` | Trial of Swordmancy deck persistence (localStorage) |
| `trialOfSwordmancyPageState.ts` | Trial of Swordmancy page input/state management types |
| `urlUtil.ts` | URL parsing, avatar image URL resolution |
| `gameData/item.ts` | Item display helpers (icon, color, name lookup from game data) |
| `gameData/pack.ts` | Pack value calculation, gacha count estimation, efficiency analysis |
