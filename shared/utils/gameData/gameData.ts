import type { TranslationKey } from '@/shared/types/common';
import type { GemTable } from '@/shared/types/endfielddata/TableCfg/GemTable';
import type { I18nTextTable } from '@/shared/types/endfielddata/TableCfg/I18nTextTable';
import type { ItemTable } from '@/shared/types/endfielddata/TableCfg/ItemTable';
import type { WorldEnergyPointGroupTable } from '@/shared/types/endfielddata/TableCfg/WorldEnergyPointGroupTable';
import type { WorldEnergyPointTable } from '@/shared/types/endfielddata/TableCfg/WorldEnergyPointTable';
import { useI18n } from 'vue-i18n';

/** 获取指定语言的国际化文本表路径 */
function getI18nTextTablePath(language: string) {
  return `endfielddata/TableCfg/I18nTextTable_${language}.json`;
}

/** 获取资源的完整 URL */
function getResourceUrl(resourcePath: string): string {
  return `https://cos.yituliu.cn/endfield/${resourcePath}`;
}

/**
 * 解析带有大整数的 JSON 的辅助函数
 * 将看起来像 ID 的数值（长整数）替换为字符串，避免 JSON.parse 时丢失精度
 * 目前的实现方法是简单地将所有 "id": <number> 替换为 "id": "<number>"
 */
function parseJSONWithBigInt(text: string) {
  const replaced = text.replace(/"id":\s*(-?\d+)/g, '"id": "$1"');
  return JSON.parse(replaced);
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
 * 获取指定 locale 的文本内容
 * 如果找不到翻译或翻译为空，返回原始文本
 * 如果未指定 locale，则使用当前的应用 locale
 */
export function getLocalizedText({ id, text }: TranslationKey, locale?: string): string {
  if (locale === undefined) {
    locale = useI18n().locale.value;
  }
  const language = localeToLanguageMap.get(locale);
  if (language === undefined) {
    return text;
  }
  return getTranslation({ id, text }, language);
}

const gemTablePath = 'endfielddata/TableCfg/GemTable.json';
const itemTablePath = 'endfielddata/TableCfg/ItemTable.json';
const skillPatchTablePath = 'endfielddata/TableCfg/SkillPatchTable.json';
const weaponBasicTablePath = 'endfielddata/TableCfg/WeaponBasicTable.json';
const worldEnergyPointGroupTablePath = 'endfielddata/TableCfg/WorldEnergyPointGroupTable.json';
const worldEnergyPointTablePath = 'endfielddata/TableCfg/WorldEnergyPointTable.json';
const i18nLanguages = ['CN', 'EN', 'JP', 'KR', 'MX', 'RU', 'TC'];

const languageToLocaleMap: Map<string, string> = new Map([
  ['CN', 'zh-CN'],
  ['EN', 'en-US'],
  ['JP', 'ja-JP'],
  ['KR', 'ko-KR'],
  ['MX', 'es-MX'],
  ['RU', 'ru-RU'],
  ['TC', 'zh-TW'],
]);
const localeToLanguageMap: Map<string, string> = new Map(
  languageToLocaleMap.entries().map(([language, locale]) => [locale, language]),
);

// 一图流只使用中英双语
const usedLanguages = ['CN', 'EN'];

// TODO: 从 CDN 上 fetch 数据肯定得做错误处理
// 并行加载所有需要的解包数据
const [
  gemTableData,
  itemTableData,
  skillPatchTableData,
  weaponBasicTableData,
  worldEnergyPointGroupTableData,
  worldEnergyPointTableData,
  ...i18nTextTablesData
] = await Promise.all([
  fetch(getResourceUrl(gemTablePath)).then((res) => res.text()),
  fetch(getResourceUrl(itemTablePath)).then((res) => res.text()),
  fetch(getResourceUrl(skillPatchTablePath)).then((res) => res.text()),
  fetch(getResourceUrl(weaponBasicTablePath)).then((res) => res.text()),
  fetch(getResourceUrl(worldEnergyPointGroupTablePath)).then((res) => res.text()),
  fetch(getResourceUrl(worldEnergyPointTablePath)).then((res) => res.text()),
  ...usedLanguages.map((language) =>
    fetch(getResourceUrl(getI18nTextTablePath(language))).then((res) => res.text()),
  ),
]);

// 解析加载的数据
export const gemTable: GemTable = parseJSONWithBigInt(gemTableData);
export const itemTable: ItemTable = parseJSONWithBigInt(itemTableData);
export const skillPatchTable: any = parseJSONWithBigInt(skillPatchTableData);
export const weaponBasicTable: any = parseJSONWithBigInt(weaponBasicTableData);
export const worldEnergyPointGroupTable: WorldEnergyPointGroupTable = parseJSONWithBigInt(
  worldEnergyPointGroupTableData,
);
export const worldEnergyPointTable: WorldEnergyPointTable =
  parseJSONWithBigInt(worldEnergyPointTableData);
// 解析 i18nTable，这里不需要考虑大整数
export const i18nTextTables: Map<string, I18nTextTable> = new Map(
  usedLanguages.map((language, index) => [language, JSON.parse(i18nTextTablesData[index]!)]),
);
