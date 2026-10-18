import path from 'node:path';
import { endfieldDataDir } from './env';

export const i18nLanguages = [
  'CN',
  'TC',
  'DE',
  'EN',
  'MX',
  'FR',
  'ID',
  'IT',
  'JP',
  'KR',
  'BR',
  'RU',
  'TH',
  'VN',
] as const;
export const languageToLocaleMap = {
  CN: 'zh-CN',
  TC: 'zh-TW',
  DE: 'de-DE',
  EN: 'en-US',
  MX: 'es-MX',
  FR: 'fr-FR',
  ID: 'id-ID',
  IT: 'it-IT',
  JP: 'ja-JP',
  KR: 'ko-KR',
  BR: 'pt-BR',
  RU: 'ru-RU',
  TH: 'th-TH',
  VN: 'vi-VN',
} as const;

export type I18nLanguage = (typeof i18nLanguages)[number];
export type Locale = (typeof languageToLocaleMap)[I18nLanguage];

// 一图流只使用中英双语
export const usedLanguages = ['CN', 'EN'] as const;

/** 获取指定语言的国际化文本表路径 */
export function getI18nTextTablePath(language: I18nLanguage): string {
  const i18nDir = path.join(endfieldDataDir, 'TableCfg');
  return path.join(i18nDir, `I18nTextTable_${language}.json`);
}
