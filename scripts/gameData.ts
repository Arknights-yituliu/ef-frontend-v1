import type {
  CharWpnRecommendTable,
  I18nTextTable,
  ItemListByTypeTable,
  ItemTable,
  ItemTypeTable,
  TranslationKey,
} from './models.ts';
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
export const endfieldDataDir: string = process.env.ENDFIELD_DATA_DIR;

/** 获取指定语言的国际化文本表路径 */
export function getI18nTextTablePath(language: string) {
  const I18nDir = path.join(endfieldDataDir, 'I18n');
  return path.join(I18nDir, `I18nTextTable_${language}.json`);
}

/** 解析带有大整数的 JSON 的辅助函数 */
export function parseJSONWithBigInt(text: string) {
  // 将看起来像 ID 的数值（长整数）替换为字符串，避免 JSON.parse 时丢失精度
  // 目前的实现方法是简单地将所有 "id": <number> 替换为 "id": "<number>"
  const stringified = text.replace(/"id":\s*(-?\d+)/g, '"id": "$1"');
  return JSON.parse(stringified);
}

export function readJSONWithBigInt(relativePath: string) {
  const fullPath = path.join(endfieldDataDir, relativePath);
  const text = fs.readFileSync(fullPath, 'utf8');
  return parseJSONWithBigInt(text);
}

/**
 * 获取指定语言的文本内容
 * 如果找不到翻译或翻译为空，返回原始文本
 */
export function getTranslation({ id, text }: TranslationKey, language: string): string {
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
export function getLocalizedValue({ id, text }: TranslationKey): Record<string, string> {
  const result: Record<string, string> = {};
  for (const lang of usedLanguages) {
    result[languageToLocaleMap[lang]] = getTranslation({ id, text }, lang);
  }
  return result;
}

export const i18nLanguages = ['CN', 'EN', 'JP', 'KR', 'MX', 'RU', 'TC'];
export const languageToLocaleMap: Record<string, string> = {
  CN: 'zh-CN',
  EN: 'en-US',
  JP: 'ja-JP',
  KR: 'ko-KR',
  MX: 'es-MX',
  RU: 'ru-RU',
  TC: 'zh-TW',
};
// 一图流只使用中英双语
export const usedLanguages = ['CN', 'EN'];

// 读取文件
export const gemTable = readJSONWithBigInt('TableCfg/GemTable.json');
export const gemTagIdTable = readJSONWithBigInt('TableCfg/GemTagIdTable.json');
export const itemListByTypeTable: ItemListByTypeTable = readJSONWithBigInt(
  'TableCfg/ItemListByTypeTable.json',
);
export const itemTable: ItemTable = readJSONWithBigInt('TableCfg/ItemTable.json');
export const itemTypeTable: ItemTypeTable = readJSONWithBigInt('TableCfg/ItemTypeTable.json');
export const levelLoadingTable = readJSONWithBigInt('TableCfg/LevelLoadingTable.json');
export const skillPatchTable = readJSONWithBigInt('TableCfg/SkillPatchTable.json');
export const textTable = readJSONWithBigInt('TableCfg/TextTable.json');
export const weaponBasicTable = readJSONWithBigInt('TableCfg/WeaponBasicTable.json');
export const worldEnergyPointGroupTable = readJSONWithBigInt(
  'TableCfg/WorldEnergyPointGroupTable.json',
);
export const worldEnergyPointTable = readJSONWithBigInt('TableCfg/WorldEnergyPointTable.json');
export const charWpnRecommendTable: CharWpnRecommendTable = readJSONWithBigInt(
  'TableCfg_Mapped/CharWpnRecommendTable.json',
);

export const i18nTextTables: Map<string, I18nTextTable> = new Map(
  i18nLanguages.map((lang) => [
    lang,
    JSON.parse(fs.readFileSync(getI18nTextTablePath(lang), 'utf8')),
  ]),
);
