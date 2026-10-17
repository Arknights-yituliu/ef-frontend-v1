/**
 * 从多语言文本字典中取出目标语言对应的文本。
 * 取不到时依次回退到中文、英文、第一个非空值。
 *
 * locale 必须由调用方显式传入：此函数常被 computed 或模板渲染调用，
 * 而 useI18n() 只能在 setup 顶层调用，在渲染阶段调用会抛出 MUST_BE_CALL_SETUP_TOP。
 */
export function getLocalizedText(text: Record<string, string> | undefined, locale: string): string {
  if (!text) {
    return '';
  }

  return text[locale] || text['zh-CN'] || text['en-US'] || Object.values(text)[0] || '';
}
