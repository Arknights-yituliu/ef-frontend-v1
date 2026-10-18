---
name: scripts-convention
description: 'scripts/ 目录的编码规范。用于在 scripts 中添加新的 model、task、或在 gameData.ts 中加载新的解包数据时遵循项目既有的结构和约定。'
user-invocable: false
---

# Scripts 编码规范

## 何时使用

- 在 `scripts/models/` 中添加新的解包数据 schema（TypeScript interface）
- 在 `scripts/tasks/` 中添加新的数据处理任务
- 在 `scripts/utils/` 中添加公共工具函数
- 在 `scripts/gameData.ts` 中加载新的解包 JSON 文件
- 修改 `scripts/makeAllData.ts` 入口脚本
- 审查或理解 `scripts/` 目录下的代码结构

## 目录结构

```
scripts/
├── gameData.ts        # 加载所有解包 JSON 文件，原样导出数据表
├── makeAllData.ts     # 统一入口脚本，依次运行所有 make* 任务并写入 JSON
├── tsconfig.json      # TypeScript 配置（extends .nuxt/tsconfig.node.json）
├── derived/           # 由解包表派生的集合/索引（供多个 task 复用）
│   └── weaponIds.ts   # wikiWeaponIds / foresightWeaponIds
├── models/            # 解包数据的 TypeScript schema（interface）
│   ├── common.ts      # 定义 TranslationKey 等通用类型
│   ├── index.ts       # 重新导出所有 model interface
│   └── *.ts           # 一个解包 JSON 文件对应一个 model 文件（PascalCase → 小驼峰）
├── tasks/             # 数据处理任务
│   └── make*.ts       # 每个任务尽可能独立，减少耦合
└── utils/             # 公共工具函数（不加载解包数据表）
    ├── env.ts         # 读取 ENDFIELD_DATA_DIR 环境变量
    ├── json.ts        # readJSONWithBigInt / parseJSONWithBigInt
    ├── i18n.ts        # 语言常量与类型、I18nTextTable 路径
    └── translation.ts # getTranslation / getLocalizedValue（读取 gameData 的 i18nTextTables）
```

## 详细规范

### Model 文件 (`scripts/models/*.ts`)

- **一个解包 JSON 文件对应一个 model 文件**，解包 JSON 为 PascalCase（如 `ItemTable.json`），model 文件使用小驼峰命名（如 `itemTable.ts`）。
- 定义 interface 并使用 `export type` 导出。
- 对于 `{ id: number | string; text: string; }` 格式的多语言键值对字段，**必须从 `./common` 导入 `TranslationKey`**。
- 解包数据中的 64 位整数 ID 在 JSON 解析时已转为 `string`（见 `scripts/utils/json.ts` 中的 `parseJSONWithBigInt`），model 中 `id` 字段请使用 `string` 类型。

### Interface 命名规则

- **表示整个表的 interface 必须与解包文件名完全一致**（如 `ItemTable.json` → `ItemTable`）。
- **表中单条数据的 interface** 的命名应来自于解包文件名去掉 `Table` 后缀的部分（如 `ItemTable.json` → `Item`，`RewardTable.json` → `Reward`），不要使用 `ItemEntry`、`RewardItem` 等复合名称。

```typescript
import type { TranslationKey } from './common';

// itemTable.ts —— 对应 ItemTable.json

export interface Item {
  id: string;
  name: TranslationKey;
  rarity: number;
  // ...
}

export type ItemTable = Record<string, Item>;
```

### Model 索引 (`scripts/models/index.ts`)

- 所有 model interface **必须**在 `index.ts` 中重新导出：

```typescript
export type { Item, ItemTable } from './itemTable';
export type { TranslationKey } from './common';
```

- 使用 `export type` 而非 `export`，因为 models 仅在类型层面使用。

### 数据加载 (`scripts/gameData.ts`)

- **所有解包数据表必须从 `gameData.ts` 加载**，task 文件不得直接读取 JSON 文件。
- 使用 `scripts/utils/json.ts` 提供的 `readJSONWithBigInt(relativePath)` 读取 JSON，自动处理大整数精度问题。
- 加载后的数据作为带类型标注的 `export const` 导出：

```typescript
import type { ItemTable } from './models';
import { readJSONWithBigInt } from './utils/json';

export const itemTable: ItemTable = readJSONWithBigInt('TableCfg/ItemTable.json');
```

- 从 models 导入的类型关联在 `gameData.ts` 顶部的 `import type` 块中。
- **`import type` 和 `export const` 两个部分各自按字典序排序**，方便定位和维护。
- `gameData.ts` 只做一件事：**原样加载并导出解包数据表**，不放置通用工具函数，也不做数据加工。
- `i18nTextTables`（各语言的 `I18nTextTable_*.json`）同样属于解包数据，在 `gameData.ts` 中统一加载；`getTranslation()` / `getLocalizedValue()` 等翻译函数则在 `scripts/utils/translation.ts` 中读取它。

### 派生数据 (`scripts/derived/*.ts`)

- 解包表之外的**派生集合/索引**（不是单独的解包文件）放在 `scripts/derived/`，按领域拆文件（如 `weaponIds.ts`）。
- 直接从 `../gameData` 导入源表计算，供多个 task 复用，避免各 task 重复实现同一份过滤逻辑。
- 新增派生数据时**不要**塞回 `gameData.ts`。

### 工具函数 (`scripts/utils/` 提供)

| 文件             | 主要导出                                                          | 用途                                    |
| ---------------- | ----------------------------------------------------------------- | --------------------------------------- |
| `env.ts`         | `endfieldDataDir`                                                 | 解包数据根目录                          |
| `json.ts`        | `readJSONWithBigInt`、`parseJSONWithBigInt`                       | 读取/解析 JSON，处理大整数精度          |
| `i18n.ts`        | `i18nLanguages`、`I18nLanguage`、`Locale`、`getI18nTextTablePath` | 语言常量/类型与文本表路径（不读取数据） |
| `translation.ts` | `getTranslation`、`getLocalizedValue`                             | 多语言文本处理（读取 `i18nTextTables`） |

- **不要**为 `scripts/utils/` 建立 `index.ts` 之类的重导出（桶文件），使用方直接从具体文件导入，例如：
  `import { getLocalizedValue } from '../utils/translation';`
- `getTranslation({ id, text }, language)` 获取指定语言的文本内容；`getLocalizedValue({ id, text })` 获取 `{ 'zh-CN': "...", 'en-US': "..." }` 格式的多语言对象。
- 新增通用工具函数时按职责新建文件（如 `number.ts`），使用方直接从该文件导入；**不要**把工具函数塞回 `gameData.ts`，也不要新增重导出文件。

### Task 文件 (`scripts/tasks/make*.ts`)

- **从 `../gameData` 导入所需数据表，从 `../derived/*` 导入派生集合，从 `../utils/*` 导入工具函数**，不直接读取任何 JSON 文件。
- 每个 task 导出 `make*()` 函数，函数内部完成数据转换逻辑。
- 尽可能保持 task 独立，减少 task 之间的耦合。
- 如需依赖其他 task 的输出，通过参数传递而非直接引用：

```typescript
// ✅ 好的做法：通过参数传递依赖
export function makePacks(): Record<string, Pack> { ... }
export function makePackShops(packs: Record<string, Pack>): Record<string, PackShop> { ... }
```

### 入口脚本 (`scripts/makeAllData.ts`)

- 导入所有 task 的 `make*()` 函数。
- 依次调用每个 task，将结果写入 `custom/core/` 下的 JSON 文件。
- 执行方式：`yarn makedata`（在 `package.json` 中定义）。
- 每个写入操作后打印确认日志。

### 输出规范

- 导出的 JSON 文件中的**键按字典序排序**，确保每次生成的 diff 最小：

```typescript
Object.keys(data)
  .toSorted()
  .map((key) => [key, data[key]]);
```

- 对于映射类型（`Record<string, SomeType>`），使用 `Object.fromEntries()` + `toSorted()` 组合来保证稳定输出。
