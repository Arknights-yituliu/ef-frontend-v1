import type { TranslationKey } from '@/shared/types/common';
import type { GemTable } from '@/shared/types/endfielddata/TableCfg/GemTable';
import type { GemTagIdTable } from '@/shared/types/endfielddata/TableCfg/GemTagIdTable';
import type { I18nTextTable } from '@/shared/types/endfielddata/TableCfg/I18nTextTable';
import type { ItemTable } from '@/shared/types/endfielddata/TableCfg/ItemTable';
import type { TextTable } from '@/shared/types/endfielddata/TableCfg/TextTable';
import type { WeaponBasicTable } from '@/shared/types/endfielddata/TableCfg/WeaponBasicTable';
import type { WorldEnergyPointGroupTable } from '@/shared/types/endfielddata/TableCfg/WorldEnergyPointGroupTable';
import type { WorldEnergyPointTable } from '@/shared/types/endfielddata/TableCfg/WorldEnergyPointTable';
import type { SkillPatchTable } from '@/shared/types/endfielddata/TableCfg/SkillPatchTable';
import type { WikiEntryDataTable } from '@/shared/types/endfielddata/TableCfg/WikiEntryDataTable';
import type { WikiEntryTable } from '@/shared/types/endfielddata/TableCfg/WikiEntryTable';
import type { WikiGroupTable } from '@/shared/types/endfielddata/TableCfg/WikiGroupTable';
import { ref } from 'vue';
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
  const translation = i18nTextTables.value.get(language)?.[String(id)];
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
const gemTagIdTablePath = 'endfielddata/TableCfg/GemTagIdTable.json';
const itemTablePath = 'endfielddata/TableCfg/ItemTable.json';
const skillPatchTablePath = 'endfielddata/TableCfg/SkillPatchTable.json';
const textTablePath = 'endfielddata/TableCfg/TextTable.json';
const weaponBasicTablePath = 'endfielddata/TableCfg/WeaponBasicTable.json';
const wikiEntryDataTablePath = 'endfielddata/TableCfg/WikiEntryDataTable.json';
const wikiEntryTablePath = 'endfielddata/TableCfg/WikiEntryTable.json';
const wikiGroupTablePath = 'endfielddata/TableCfg/WikiGroupTable.json';
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

export const gemTable = ref<GemTable>({});
export const gemTagIdTable = ref<GemTagIdTable>({});
export const itemTable = ref<ItemTable>({});
export const skillPatchTable = ref<SkillPatchTable>({});
export const textTable = ref<TextTable>({});
export const weaponBasicTable = ref<WeaponBasicTable>({});
export const wikiEntryDataTable = ref<WikiEntryDataTable>({});
export const wikiEntryTable = ref<WikiEntryTable>({});
export const wikiGroupTable = ref<WikiGroupTable>({});
export const worldEnergyPointGroupTable = ref<WorldEnergyPointGroupTable>({});
export const worldEnergyPointTable = ref<WorldEnergyPointTable>({});
export const i18nTextTables = ref<Map<string, I18nTextTable>>(new Map());
export const isLoaded = ref(false);

// TODO: 从 CDN 上 fetch 数据肯定得做错误处理
// 并行加载所有需要的解包数据
export const initGameData = async () => {
  if (isLoaded.value) return;

  console.log('Initializing game data...');

  await Promise.all([
    fetch(getResourceUrl(gemTablePath))
      .then((res) => res.text())
      .then((text) => {
        gemTable.value = parseJSONWithBigInt(text);
      }),
    fetch(getResourceUrl(gemTagIdTablePath))
      .then((res) => res.text())
      .then((text) => {
        gemTagIdTable.value = parseJSONWithBigInt(text);
      }),
    fetch(getResourceUrl(itemTablePath))
      .then((res) => res.text())
      .then((text) => {
        itemTable.value = parseJSONWithBigInt(text);
      }),
    fetch(getResourceUrl(skillPatchTablePath))
      .then((res) => res.text())
      .then((text) => {
        skillPatchTable.value = parseJSONWithBigInt(text);
      }),
    fetch(getResourceUrl(textTablePath))
      .then((res) => res.text())
      .then((text) => {
        textTable.value = parseJSONWithBigInt(text);
      }),
    fetch(getResourceUrl(weaponBasicTablePath))
      .then((res) => res.text())
      .then((text) => {
        weaponBasicTable.value = parseJSONWithBigInt(text);
      }),
    fetch(getResourceUrl(wikiEntryDataTablePath))
      .then((res) => res.text())
      .then((text) => {
        wikiEntryDataTable.value = parseJSONWithBigInt(text);
      }),
    fetch(getResourceUrl(wikiEntryTablePath))
      .then((res) => res.text())
      .then((text) => {
        wikiEntryTable.value = parseJSONWithBigInt(text);
      }),
    fetch(getResourceUrl(wikiGroupTablePath))
      .then((res) => res.text())
      .then((text) => {
        wikiGroupTable.value = parseJSONWithBigInt(text);
      }),
    fetch(getResourceUrl(worldEnergyPointGroupTablePath))
      .then((res) => res.text())
      .then((text) => {
        worldEnergyPointGroupTable.value = parseJSONWithBigInt(text);
      }),
    fetch(getResourceUrl(worldEnergyPointTablePath))
      .then((res) => res.text())
      .then((text) => {
        worldEnergyPointTable.value = parseJSONWithBigInt(text);
      }),
    ...usedLanguages.map((language) =>
      fetch(getResourceUrl(getI18nTextTablePath(language)))
        .then((res) => res.text())
        .then((text) => {
          const table = JSON.parse(text);
          i18nTextTables.value.set(language, table);
        }),
    ),
  ]);

  isLoaded.value = true;
};
