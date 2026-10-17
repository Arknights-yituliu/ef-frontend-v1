import {
  charWpnRecommendTable,
  foresightCharGrowthTable,
  foresightWeaponIds,
  weaponBasicTable,
  wikiWeaponIds,
} from '../gameData';

// 没有头像的特殊干员 ID 列表，不包含在推荐中
const noAvatarCharIds = new Set(['chr_9000_endmin']);

/**
 * 从武器推荐表中生成 weaponId -> charId[] 的映射。
 * 仅取每位干员的第一推荐武器（weaponIds1[0]）。
 * 仅包含 wiki 中存在的武器（与 weapons.json 保持一致），无干员推荐的武器对应空列表。
 * 前瞻武器（尚未正式上线）则从 ForesightCharGrowthTable 中补充推荐干员。
 */
export function makeWeaponToChars(): Record<string, string[]> {
  // 以 weaponBasicTable 中 wiki 存在的武器为基底，确保结果与武器表一致
  const weaponToChars: Map<string, string[]> = new Map(
    Object.keys(weaponBasicTable)
      .filter((weaponId) => wikiWeaponIds.has(weaponId))
      .map((weaponId) => [weaponId, []]),
  );

  // 前瞻武器同样需要出现在结果中，保证与 weapons.json 一致
  for (const weaponId of foresightWeaponIds) {
    if (!weaponToChars.has(weaponId)) {
      weaponToChars.set(weaponId, []);
    }
  }

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

    // 检查该武器是否存在（wiki 中存在的武器集合）
    if (!weaponToChars.has(firstWeapon)) {
      console.warn(
        `Weapon ${firstWeapon} recommended by char ${charId} not found in wiki weapon list.`,
      );
      continue;
    }

    // 将 charId 添加到对应武器的推荐列表中
    weaponToChars.get(firstWeapon)!.push(charId);
  }

  // 前瞻武器：从 ForesightCharGrowthTable 中补充推荐干员（仅针对尚未正式上线的前瞻武器）
  for (const [charId, entry] of Object.entries(foresightCharGrowthTable)) {
    // 跳过没有头像的干员
    if (noAvatarCharIds.has(charId)) {
      continue;
    }

    // 取第一推荐武器
    const firstWeapon = entry.weaponIds[0];
    if (firstWeapon === undefined) {
      continue;
    }

    // 仅处理尚未收录进正式武器表的前瞻武器
    if (!foresightWeaponIds.has(firstWeapon) || wikiWeaponIds.has(firstWeapon)) {
      continue;
    }

    const charIds = weaponToChars.get(firstWeapon);
    if (charIds === undefined) {
      console.warn(`Foresight weapon ${firstWeapon} from char ${charId} not found in weapon list.`);
      continue;
    }

    // 去重后添加
    if (!charIds.includes(charId)) {
      charIds.push(charId);
    }
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
