---
name: scripts-convention
description: 'scripts/ 目录的编码规范。用于在 scripts 中添加新的 model、task、或在 gameData.ts 中加载新的解包数据时遵循项目既有的结构和约定。'
user-invocable: false
---

# Scripts 编码规范

## 何时使用

- 在 `scripts/models/` 中添加新的解包数据 schema（TypeScript interface）
- 在 `scripts/tasks/` 中添加新的数据处理任务
- 在 `scripts/gameData.ts` 中加载新的解包 JSON 文件
- 修改 `scripts/makeAllData.ts` 入口脚本
- 审查或理解 `scripts/` 目录下的代码结构

## 目录结构

```
scripts/
├── gameData.ts        # 加载所有解包 JSON 文件，导出数据和辅助函数
├── makeAllData.ts     # 统一入口脚本，依次运行所有 make* 任务并写入 JSON
├── tsconfig.json      # TypeScript 配置（extends .nuxt/tsconfig.node.json）
├── models/            # 解包数据的 TypeScript schema（interface）
│   ├── common.ts      # 定义 TranslationKey 等通用类型
│   ├── index.ts       # 重新导出所有 model interface
│   └── *.ts           # 一个解包 JSON 文件对应一个 model 文件（PascalCase → 小驼峰）
└── tasks/             # 数据处理任务
    └── make*.ts       # 每个任务尽可能独立，减少耦合
```

## 详细规范

### Model 文件 (`scripts/models/*.ts`)

- **一个解包 JSON 文件对应一个 model 文件**，解包 JSON 为 PascalCase（如 `ItemTable.json`），model 文件使用小驼峰命名（如 `itemTable.ts`）。
- 定义 interface 并使用 `export type` 导出。
- 对于 `{ id: number | string; text: string; }` 格式的多语言键值对字段，**必须从 `./common` 导入 `TranslationKey`**。
- 解包数据中的 64 位整数 ID 在 JSON 解析时已转为 `string`（见 `gameData.ts` 中的 `parseJSONWithBigInt`），model 中 `id` 字段请使用 `string` 类型。

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

- **所有解包文件必须从 `gameData.ts` 加载**，task 文件不得直接读取 JSON 文件。
- 使用 `readJSONWithBigInt(relativePath)` 读取 JSON，自动处理大整数精度问题。
- 加载后的数据作为带类型标注的 `export const` 导出：

```typescript
import type { ItemTable } from './models';

export const itemTable: ItemTable = readJSONWithBigInt('TableCfg/ItemTable.json');
```

- 从 models 导入的类型关联在 `gameData.ts` 顶部的 `import type` 块中。
- **`import type` 和 `export const` 两个部分各自按字典序排序**，方便定位和维护。
- `i18nTextTables` 在 `gameData.ts` 中统一加载，供 `getTranslation()` / `getLocalizedValue()` 使用。

### 辅助函数 (`scripts/gameData.ts` 提供)

| 函数                                     | 用途                                                       |
| ---------------------------------------- | ---------------------------------------------------------- |
| `getTranslation({ id, text }, language)` | 获取指定语言的文本内容                                     |
| `getLocalizedValue({ id, text })`        | 获取 `{ 'zh-CN': "...", 'en-US': "..." }` 格式的多语言对象 |

在 task 中通过这些函数处理多语言字段。

### Task 文件 (`scripts/tasks/make*.ts`)

- **从 `../gameData` 导入所需数据**，不直接读取任何 JSON 文件。
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
