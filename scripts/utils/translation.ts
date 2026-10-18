import type { TranslationKey } from '../models';
import type { I18nLanguage, Locale } from './i18n';
import { i18nTextTables } from '../gameData';
import { languageToLocaleMap, usedLanguages } from './i18n';

/**
 * 获取指定语言的文本内容
 * 如果找不到翻译或翻译为空，返回原始文本
 */
export function getTranslation({ id, text }: TranslationKey, language: I18nLanguage): string {
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
export function getLocalizedValue({ id, text }: TranslationKey): Record<Locale, string> {
  const result: Record<Locale, string> = {} as Record<Locale, string>;
  for (const lang of usedLanguages) {
    result[languageToLocaleMap[lang]!] = getTranslation({ id, text }, lang);
  }
  return result;
}
