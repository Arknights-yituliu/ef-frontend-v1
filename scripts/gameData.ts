import type {
  I18nTextTable,
  ItemListByTypeTable,
  ItemTable,
  ItemTypeTable,
  TranslationKey,
} from './models';
import * as fs from 'node:fs';
import path from 'node:path';

import dotenv from 'dotenv';

// 从环境变量加载数据目录，避免硬编码路径
dotenv.config();
if (!process.env.ENDFIELD_DATA_DIR) {
  throw new Error(
    '请设置环境变量 ENDFIELD_DATA_DIR，指向数据的根目录（即 TableCfg 文件夹的父目录）。',
  );
}
const endfieldDataDir: string = process.env.ENDFIELD_DATA_DIR;

/** 获取指定语言的国际化文本表路径 */
function getI18nTextTablePath(language: string) {
  const I18nDir = path.join(endfieldDataDir, 'I18n');
  return path.join(I18nDir, `I18nTextTable_${language}.json`);
}

/** 解析带有大整数的 JSON 的辅助函数 */
function parseJSONWithBigInt(text: string) {
  // 将看起来像 ID 的数值（长整数）替换为字符串，避免 JSON.parse 时丢失精度
  // 目前的实现方法是简单地将所有 "id": <number> 替换为 "id": "<number>"
  const stringified = text.replace(/"id":\s*(-?\d+)/g, '"id": "$1"');
  return JSON.parse(stringified);
}

function readJSONWithBigInt(relativePath: string) {
  const fullPath = path.join(endfieldDataDir, relativePath);
  const text = fs.readFileSync(fullPath, 'utf8');
  return parseJSONWithBigInt(text);
}

/**
 * 获取指定语言的文本内容
 * 如果找不到翻译或翻译为空，返回原始文本
 */
function getTranslation({ id, text }: TranslationKey, language: string): string {
  const translation = i18nTextTables.get(language)?.[String(id)];
  if (translation !== undefined) {
    return translation.trim();
  } else {
    return text;
  }
}

/**
 * 获取多语言文本对象
 * @example
 * Input: { id: 114514, text: "" }
 * Output: { 'zh-CN': "测试文本", 'en-US': "Test Text", ... }
 */
function getLocalizedValue({ id, text }: TranslationKey): Record<string, string> {
  const result: Record<string, string> = {};
  for (const lang of usedLanguages) {
    result[languageToLocaleMap[lang]] = getTranslation({ id, text }, lang);
  }
  return result;
}

const i18nLanguages = ['CN', 'EN', 'JP', 'KR', 'MX', 'RU', 'TC'];
const languageToLocaleMap: Record<string, string> = {
  CN: 'zh-CN',
  EN: 'en-US',
  JP: 'ja-JP',
  KR: 'ko-KR',
  MX: 'es-MX',
  RU: 'ru-RU',
  TC: 'zh-TW',
};
// 一图流只使用中英双语
const usedLanguages = ['CN', 'EN'];

// 读取文件
const gemTable = readJSONWithBigInt('TableCfg/GemTable.json');
const gemTagIdTable = readJSONWithBigInt('TableCfg/GemTagIdTable.json');
const itemListByTypeTable: ItemListByTypeTable = readJSONWithBigInt(
  'TableCfg/ItemListByTypeTable.json',
);
const itemTable: ItemTable = readJSONWithBigInt('TableCfg/ItemTable.json');
const itemTypeTable: ItemTypeTable = readJSONWithBigInt('TableCfg/ItemTypeTable.json');
const skillPatchTable = readJSONWithBigInt('TableCfg/SkillPatchTable.json');
const textTable = readJSONWithBigInt('TableCfg/TextTable.json');
const weaponBasicTable = readJSONWithBigInt('TableCfg/WeaponBasicTable.json');
const worldEnergyPointGroupTable = readJSONWithBigInt('TableCfg/WorldEnergyPointGroupTable.json');
const worldEnergyPointTable = readJSONWithBigInt('TableCfg/WorldEnergyPointTable.json');

const i18nTextTables: Map<string, I18nTextTable> = new Map(
  i18nLanguages.map((lang) => [
    lang,
    JSON.parse(fs.readFileSync(getI18nTextTablePath(lang), 'utf8')),
  ]),
);

function getItemName(itemId: string, language: string): string {
  if (itemTable[itemId] === undefined) {
    throw new Error(`无法找到物品数据，itemId=${itemId}`);
  }
  return getTranslation(itemTable[itemId].name, language);
}

function makeItemTableSimplified() {
  const itemTableSimplified: Record<string, Record<string, any>> = {};
  for (const [itemId, itemData] of Object.entries(itemTable)) {
    itemTableSimplified[itemId] = {
      id: itemId,
      name: getLocalizedValue(itemData.name),
      rarity: itemData.rarity,
      type: itemData.type,
      typeName: getLocalizedValue(itemTypeTable[String(itemData.type)]!.name),
      iconId: itemData.iconId,

      // backpackCanDiscard: itemData.backpackCanDiscard,
      // decoDesc: getLocalizedValue(itemData.decoDesc),
      // desc: getLocalizedValue(itemData.desc),
      // iconCompositeId: itemData.iconCompositeId,
      // maxBackpackStackCount: itemData.maxBackpackStackCount,
      // maxStackCount: itemData.maxStackCount,
      // modelKey: itemData.modelKey,
      // noObtainWayHint: getLocalizedValue(itemData.noObtainWayHint),
      // showAllDepotCount: itemData.showAllDepotCount,
      // showingType: itemData.showingType,
      // sortId1: itemData.sortId1,
      // sortId2: itemData.sortId2,
      // valuableTabType: itemData.valuableTabType,
      // iconUrl: `~/assets/images/items/${itemName}.png`,
    };
  }

  const itemTypeTableSheet: Map<string, any> = new Map();
  for (const [itemTypeId, itemTypeData] of Object.entries(itemTypeTable)) {
    itemTypeTableSheet.set(itemTypeId, {
      itemType: itemTypeData.itemType,
      itemTypeName: getTranslation(itemTypeData.name, 'CN'),
      barkWhenGot: itemTypeData.barkWhenGot,
      bgType: itemTypeData.bgType,
      hideItemInBagToast: itemTypeData.hideItemInBagToast,
      hideNewToast: itemTypeData.hideNewToast,
      showCount: itemTypeData.showCount,
      showCountInTips: itemTypeData.showCountInTips,
      storageSpace: itemTypeData.storageSpace,
      unlockSystemType: itemTypeData.unlockSystemType,
      valuableTabType: itemTypeData.valuableTabType,
    });
  }

  fs.writeFileSync('custom/core/items.json', JSON.stringify(itemTableSimplified, null, 2), 'utf-8');
}

function makeWeapons() {
  interface EssenceStat {
    attribute: string | null;
    secondary: string | null;
    skill: string | null;
  }

  function getWeaponTypeName(weaponId: string): string {
    const weaponTypeToTypeName = new Map<number, string>([
      [1, '单手剑'],
      [2, '施术单元'],
      [3, '双手剑'],
      [5, '长柄武器'],
      [6, '手铳'],
    ]);
    return weaponTypeToTypeName.get(weaponBasicTable[weaponId]!.weaponType)!;
  }

  function getEmptyStat(): EssenceStat {
    return {
      attribute: null,
      secondary: null,
      skill: null,
    };
  }

  function getGemTagName(gemTermId: string, language: string): string {
    const gem = gemTable[gemTermId];
    if (gem === undefined) {
      return gemTermId;
    }
    return getTranslation(gem.tagName, language);
  }

  function getGameName(gameGroupId: string): string {
    const worldLevel2GameMechanicsIdMap =
      worldEnergyPointGroupTable[gameGroupId]!.worldLevel2GameMechanicsIdMap;
    const lastGameMechanicsId =
      worldLevel2GameMechanicsIdMap[
        Math.max(...Object.keys(worldLevel2GameMechanicsIdMap).map(Number))
      ]!;
    const worldEnergyPoint = worldEnergyPointTable[lastGameMechanicsId]!;
    return getTranslation(worldEnergyPoint.gameName, 'CN');
  }

  function getStatsForWeapon(weaponId: string, language: string): EssenceStat {
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

  const statsForWeapon: Record<
    string,
    {
      weaponId: string;
      weaponName: string;
      weaponType: string;
      rarity: number;
      stats: EssenceStat;
    }
  > = Object.fromEntries(
    Object.keys(weaponBasicTable).map((weaponId) => [
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

  console.log(JSON.stringify(statsForWeapon, null, 2));
}

// main
// makeItemTableSimplified();
makeWeapons();
