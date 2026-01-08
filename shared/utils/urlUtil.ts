/**
 * 解析头像图片 URL
 * @param source 头像源路径，可以是 HTTP/HTTPS URL 或本地文件路径
 * @param assets 本地资源映射对象（从 import.meta.glob 获取）
 * @returns 解析后的 URL 字符串，如果无法解析则返回 undefined
 */
export const resolvePictureUrl = (
  source: string,
  assets: Record<string, string>,
): string | undefined => {
  // 如果是 HTTP/HTTPS URL，直接返回
  if (/^https?:\/\//i.test(source)) {
    return source;
  }

  // 从路径中提取文件名
  const targetFileName = source.split('/').pop();

  if (targetFileName) {
    // 在资源映射中查找匹配的文件
    const matchedEntry = Object.entries(assets).find(([key]) => key.endsWith(targetFileName));

    if (matchedEntry) {
      return matchedEntry[1];
    }
  }

  return undefined;
};

