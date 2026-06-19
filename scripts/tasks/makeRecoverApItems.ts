import type { RecoverApItem } from '../models';
import { recoverApItemTable } from '../gameData';

/**
 * 生成恢复 AP 道具数据
 * 将解包数据按原样输出到一图流使用的 JSON 中
 */
export function makeRecoverApItems(): Record<string, RecoverApItem> {
  // 按字典序排序键，保证 diff 最小
  return Object.fromEntries(
    Object.keys(recoverApItemTable)
      .toSorted()
      .map((key) => [key, recoverApItemTable[key]!]),
  );
}
