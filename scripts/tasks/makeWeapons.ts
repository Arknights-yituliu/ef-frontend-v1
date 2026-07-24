import type { I18nLanguage } from '../gameData';
import {
  gemTable,
  gemTagIdTable,
  getTranslation,
  itemTable,
  levelLoadingTable,
  skillPatchTable,
  weaponBasicTable,
  worldEnergyPointGroupTable,
  worldEnergyPointTable,
} from '../gameData';

export interface EssenceStat {
  attribute: string | null;
  secondary: string | null;
  skill: string | null;
}

export interface Weapon {
  weaponId: string;
  weaponType: string;
  rarity: number;
  stats: EssenceStat;
}

export interface WeaponLocalization {
  weapon: {
    type: Record<string, string>,
    stat: Record<string, string>,
  },
  energyAlluviums: Record<string, string>,
}

export function getItemName(itemId: string, language: I18nLanguage): string {
  if (itemTable[itemId] === undefined) {
    throw new Error(`无法找到物品数据，itemId=${itemId}`);
  }
  return getTranslation(itemTable[itemId].name, language);
}

export function getWeaponTypeName(weaponId: string): string {
  const weaponTypeToTypeName = new Map<number, string>([
    [1, 'weapon.type.wpn_sword'],
    [2, 'weapon.type.wpn_funnel'],
    [3, 'weapon.type.wpn_claym'],
    [5, 'weapon.type.wpn_lance'],
    [6, 'weapon.type.wpn_pistol'],
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

export function getGemTagName(gemTermId: string, language: I18nLanguage): string {
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

export function getStatsForWeapon(weaponId: string): EssenceStat {
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
        result.attribute = `weapon.stat.${gem.gemTermId}`;
        break;
      }
      case 1: {
        result.secondary = `weapon.stat.${gem.gemTermId}`;
        break;
      }
      case 2: {
        result.skill = `weapon.stat.${gem.gemTermId}`;
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
          weaponType: getWeaponTypeName(weaponId),
          rarity: weaponBasicTable[weaponId]!.rarity,
          stats: getStatsForWeapon(weaponId),
        },
      ]),
  );
}

export interface EnergyAlluvium {
  battleId: string;
  battleName: string;
  imageUrl: string;
  secondaryStats: string[];
  skillStats: string[];
}

/**
 * 从 WorldEnergyPointGroupTable 中自动生成能量淤积点数据。
 * 每个 group 取其最高世界等级对应的 gameName 作为 battleName，
 * 并将其 secAttrTermIds / skillTermIds 通过 GemTable 翻译为中文。
 */
export function makeEnergyAlluviums(): Record<string, EnergyAlluvium> {
  const result: Record<string, EnergyAlluvium> = {};

  // 按 group ID 排序，保证输出稳定
  const groupIds = Object.keys(worldEnergyPointGroupTable).toSorted();

  for (const groupId of groupIds) {
    const group = worldEnergyPointGroupTable[groupId]!;
    const worldLevelMap = group.worldLevel2GameMechanicsIdMap;

    // 取最高世界等级对应的 mechanicsId，其 gameName 即为"重度能量淤积点·xxx"
    const maxWorldLevel = Math.max(...Object.keys(worldLevelMap).map(Number));
    const lastMechanicsId = worldLevelMap[String(maxWorldLevel)]!;
    const energyPoint = worldEnergyPointTable[lastMechanicsId]!;

    const secondaryStats = group.secAttrTermIds.map((termId: string) => `weapon.stat.${termId}`);
    const skillStats = group.skillTermIds.map((termId: string) => `weapon.stat.${termId}`);

    // 通过 levelId 从 LevelLoadingTable 获取背景图文件名
    const levelId = energyPoint.levelId;
    const loadingEntry = levelLoadingTable[levelId];
    const bgName = loadingEntry?.bgNameGroup?.[0] ?? '';
    const imageUrl = bgName
      ? `https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/loading/${bgName}.webp`
      : '';

    result[groupId] = {
      battleId: groupId,
      battleName: `energyAlluviums.${groupId}`,
      imageUrl,
      secondaryStats,
      skillStats,
    };
  }

  return result;
}

export function getWeaponTypesLocalized(language: I18nLanguage): Record<string, string> {
  switch(language) {
    case 'CN':
    default: {
      return {
        wpn_sword: "单手剑",
        wpn_funnel: "施术单元",
        wpn_claym: "双手剑",
        wpn_lance: "长柄武器",
        wpn_pistol: "手铳",
      }
    }

    case 'EN': {
      return {
        wpn_sword: "Sword",
        wpn_funnel: "Arts Unit",
        wpn_claym: "Greatsword",
        wpn_lance: "Polearm",
        wpn_pistol: "Handcannon",
      }
    }
  }
}

export function makeWeaponLocalizations(language: I18nLanguage): WeaponLocalization {
  const weaponLocalization: WeaponLocalization = {
    weapon: {
      type: getWeaponTypesLocalized(language),
      stat: {}
    },
    energyAlluviums: {}
  };

  for (const attrId of Object.keys(gemTable)
    .toSorted()) {
      weaponLocalization.weapon.stat[attrId] = getGemTagName(attrId, language);
  }
  
  for (const groupId of Object.keys(worldEnergyPointGroupTable)
    .toSorted()) {
      const group = worldEnergyPointGroupTable[groupId]!;
      const worldLevelMap = group.worldLevel2GameMechanicsIdMap;

      // 取最高世界等级对应的 mechanicsId，其 gameName 即为"重度能量淤积点·xxx"
      const maxWorldLevel = Math.max(...Object.keys(worldLevelMap).map(Number));
      const lastMechanicsId = worldLevelMap[String(maxWorldLevel)]!;
      const energyPoint = worldEnergyPointTable[lastMechanicsId]!;

      weaponLocalization.energyAlluviums[groupId] = getTranslation(energyPoint.gameName, language);
    }

  return weaponLocalization;
}
