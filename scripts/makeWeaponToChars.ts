import fs from 'node:fs';
import { charWpnRecommendTable, weaponBasicTable } from './gameData.ts';

// 没有头像的特殊干员 ID 列表，不包含在推荐中
const noAvatarCharIds = new Set(['chr_9000_endmin']);

/**
 * 从武器推荐表中生成 weaponId -> charId[] 的映射。
 * 仅取每位干员的第一推荐武器（weaponIds1[0]）。
 * 所有武器均会包含在结果中，无干员推荐的武器对应空列表。
 */
function makeWeaponToChars(): Record<string, string[]> {
  // 以 weaponBasicTable 为基底，确保所有武器都在结果中
  const weaponToChars: Map<string, string[]> = new Map(
    Object.keys(weaponBasicTable).map((weaponId) => [weaponId, []]),
  );

  for (const [charId, entry] of Object.entries(charWpnRecommendTable)) {
    // 跳过没有头像的干员
    if (noAvatarCharIds.has(charId)) {
      continue;
    }

    // 取第一推荐武器
    const firstWeapon = entry.weaponIds1[0];

    // 检查是否存在第一推荐武器
    if (firstWeapon === undefined) {
      console.warn(`Char ${charId} has no recommended weapons in weaponIds1.`);
      continue;
    }

    // 检查该武器是否存在于 weaponBasicTable 中
    if (!weaponToChars.has(firstWeapon)) {
      console.warn(
        `Weapon ${firstWeapon} recommended by char ${charId} not found in weaponBasicTable.`,
      );
      continue;
    }

    // 将 charId 添加到对应武器的推荐列表中
    weaponToChars.get(firstWeapon)!.push(charId);
  }

  // 对结果进行排序，确保输出稳定
  return sortWeaponToChars(weaponToChars);
}

/**
 * 对 weaponId -> charId[] 映射的键和值分别按字典序排序，
 * 确保每次生成的 diff 最小。
 */
function sortWeaponToChars(map: Map<string, string[]>): Record<string, string[]> {
  const sortedEntries = Array.from(map.entries())
    .toSorted(([weaponIdA], [weaponIdB]) => weaponIdA.localeCompare(weaponIdB)) // 先按 weaponId 排序
    .map(([weaponId, charIds]) => [weaponId, charIds.toSorted((a, b) => a.localeCompare(b))]); // 再对 charId 列表排序
  return Object.fromEntries(sortedEntries);
}

fs.writeFileSync(
  'custom/core/weaponToChars.json',
  JSON.stringify(makeWeaponToChars(), null, 2),
  'utf8',
);
