import type { RecoverApItem } from '../models';
import { getTranslation, itemTable, lTItemTable, recoverApItemTable } from '../gameData';

/** 恢复 AP 道具输出（在解包数据基础上增加中文名，方便开发者阅读） */
export interface RecoverApItemOutput extends RecoverApItem {
  itemName: string;
}

function getItemName(itemId: string): string {
  const itemData = itemTable[itemId];
  return itemData ? getTranslation(itemData.name, 'CN') : itemId;
}

/**
 * 生成恢复 AP 道具数据
 * 将解包数据按原样输出到一图流使用的 JSON 中，并附带中文名。
 * 同时将 LTItemTable 中关联到 RecoverApItemTable 的条目也一并输出。
 */
export function makeRecoverApItems(): Record<string, RecoverApItemOutput> {
  const entries: Array<[string, RecoverApItemOutput]> = [];

  // 1. 从 RecoverApItemTable 取数据
  for (const key of Object.keys(recoverApItemTable).toSorted()) {
    const item = recoverApItemTable[key]!;
    entries.push([key, { ...item, itemName: getItemName(item.id) }]);
  }

  // 2. 从 LTItemTable 补充 — 若 ltItem.itemId 在 RecoverApItemTable 中，则继承其 AP 值
  for (const key of Object.keys(lTItemTable).toSorted()) {
    const ltItem = lTItemTable[key]!;
    if (recoverApItemTable[ltItem.itemId]) {
      const original = recoverApItemTable[ltItem.itemId]!;
      entries.push([
        key,
        {
          apRecoverValue: original.apRecoverValue,
          id: key,
          itemName: getItemName(key),
        },
      ]);
    }
  }

  // 全部按字典序排序
  entries.sort(([a], [b]) => a.localeCompare(b));
  return Object.fromEntries(entries);
}
