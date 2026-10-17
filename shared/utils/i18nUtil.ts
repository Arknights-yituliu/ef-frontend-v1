import { useI18n } from 'vue-i18n';

/**
 * 从多语言文本字典中取出目标语言对应的文本。
 * 未显式传入 locale 时取当前 i18n 语言；取不到时依次回退到中文、英文、第一个非空值。
 */
export function getLocalizedText(
  text: Record<string, string> | undefined,
  locale?: string,
): string {
  if (!text) {
    return '';
  }

  const targetLocale = locale ?? useI18n().locale.value;
  return text[targetLocale] || text['zh-CN'] || text['en-US'] || Object.values(text)[0] || '';
}
