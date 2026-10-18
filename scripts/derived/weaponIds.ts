import { foresightWeaponTable, wikiEntryDataTable } from '../gameData';

/** wiki 档案中出现过的武器 ID 集合（groupId 以 wiki_group_weapon 开头），用于排除 wiki 里没有的武器 */
export const wikiWeaponIds: Set<string> = new Set(
  Object.values(wikiEntryDataTable)
    .filter((entry) => entry.groupId.startsWith('wiki_group_weapon') && entry.refItemId !== '')
    .map((entry) => entry.refItemId),
);

/** 前瞻武器 ID 集合（ForesightWeaponTable 中的武器），用于补录尚未正式上线的武器 */
export const foresightWeaponIds: Set<string> = new Set(Object.keys(foresightWeaponTable));
