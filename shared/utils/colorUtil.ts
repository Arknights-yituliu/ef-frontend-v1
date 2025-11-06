/**
 * 将十六进制颜色转换为RGB数组
 * @param hex 十六进制颜色值，如 '#000000' 或 '000000'
 * @returns RGB数组，如 [0, 0, 0]
 */
export const hexToRGB = (hex: string): number[] => {
  // 移除 # 符号（如果存在）
  const cleanHex = hex.replace('#', '');
  
  // 解析RGB值
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  
  return [r, g, b];
};

/**
 * 从CSS变量获取颜色值
 * @param cssVar CSS变量名，如 '--theme-accent-color'
 * @returns 十六进制颜色值
 */
export const getCSSVariableColor = (cssVar: string): string => {
  if (typeof window === 'undefined') return '#000000';
  
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(cssVar)
    .trim();
  
  // 如果已经是十六进制格式，直接返回
  if (value.startsWith('#')) {
    return value;
  }
  
  // 如果是var()格式，递归解析
  if (value.startsWith('var(')) {
    const match = value.match(/var\(([^)]+)\)/);
    const innerVar = match?.[1];
    if (innerVar) {
      return getCSSVariableColor(innerVar);
    }
  }
  
  // 如果是rgb/rgba格式，转换为hex
  if (value.startsWith('rgb')) {
    const matches = value.match(/\d+/g);
    if (matches && matches.length >= 3) {
      const r = parseInt(matches[0] || '0', 10);
      const g = parseInt(matches[1] || '0', 10);
      const b = parseInt(matches[2] || '0', 10);
      return `#${[r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      }).join('')}`;
    }
  }
  
  return value || '#000000';
};

