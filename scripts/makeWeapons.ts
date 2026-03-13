import fs from 'node:fs';
import {
  gemTable,
  gemTagIdTable,
  getTranslation,
  itemTable,
  skillPatchTable,
  weaponBasicTable,
  worldEnergyPointGroupTable,
  worldEnergyPointTable,
} from './gameData.ts';

export interface EssenceStat {
  attribute: string | null;
  secondary: string | null;
  skill: string | null;
}

export interface Weapon {
  weaponId: string;
  weaponName: string;
  weaponType: string;
  rarity: number;
  stats: EssenceStat;
}

export function getItemName(itemId: string, language: string): string {
  if (itemTable[itemId] === undefined) {
    throw new Error(`无法找到物品数据，itemId=${itemId}`);
  }
  return getTranslation(itemTable[itemId].name, language);
}

export function getWeaponTypeName(weaponId: string): string {
  const weaponTypeToTypeName = new Map<number, string>([
    [1, '单手剑'],
    [2, '施术单元'],
    [3, '双手剑'],
    [5, '长柄武器'],
    [6, '手铳'],
  ]);
  return weaponTypeToTypeName.get(weaponBasicTable[weaponId]!.weaponType)!;
}

export function getEmptyStat(): EssenceStat {
  return {
    attribute: null,
    secondary: null,
    skill: null,
  };
}

export function getGemTagName(gemTermId: string, language: string): string {
  const gem = gemTable[gemTermId];
  if (gem === undefined) {
    return gemTermId;
  }
  return getTranslation(gem.tagName, language);
}

export function getGameName(gameGroupId: string): string {
  const worldLevel2GameMechanicsIdMap =
    worldEnergyPointGroupTable[gameGroupId]!.worldLevel2GameMechanicsIdMap;
  const lastGameMechanicsId =
    worldLevel2GameMechanicsIdMap[
      Math.max(...Object.keys(worldLevel2GameMechanicsIdMap).map(Number))
    ]!;
  const worldEnergyPoint = worldEnergyPointTable[lastGameMechanicsId]!;
  return getTranslation(worldEnergyPoint.gameName, 'CN');
}

export function getStatsForWeapon(weaponId: string, language: string): EssenceStat {
  const weapon = weaponBasicTable[weaponId];
  if (!weapon) {
    throw new Error(`无法找到武器数据，weaponId=${weaponId}`);
  }

  const result = getEmptyStat();
  for (const weaponSkill of weapon.weaponSkillList) {
    const skillPatch = skillPatchTable[weaponSkill]!;
    const tagId = skillPatch.SkillPatchDataBundle[0]!.tagId;
    const gemStat = gemTagIdTable[tagId]!;
    const gem = gemTable[gemStat]!;
    switch (gem.termType) {
      case 0: {
        result.attribute = getGemTagName(gem.gemTermId, language);
        break;
      }
      case 1: {
        result.secondary = getGemTagName(gem.gemTermId, language);
        break;
      }
      case 2: {
        result.skill = getGemTagName(gem.gemTermId, language);
        break;
      }
    }
  }
  return result;
}

export function makeWeapons(): Record<string, Weapon> {
  return Object.fromEntries(
    Object.keys(weaponBasicTable)
      .toSorted() // 按字典序排序，保证 diff 最小
      .map((weaponId) => [
        weaponId,
        {
          weaponId,
          weaponName: getItemName(weaponId, 'CN'),
          weaponType: getWeaponTypeName(weaponId),
          rarity: weaponBasicTable[weaponId].rarity,
          stats: getStatsForWeapon(weaponId, 'CN'),
        },
      ]),
  );
}

fs.writeFileSync('custom/core/weapons.json', JSON.stringify(makeWeapons(), null, 2), 'utf8');
