/**
 * 多语言文本，键为 locale 代码（当前支持 zh-CN / en-US）。
 * 使用 type 而非 interface，以便直接作为 Record<string, string> 传入工具函数。
 */
export type LocalizedText = {
  'zh-CN': string;
  'en-US': string;
};
