import type { WikiEntryDataTable } from '../../shared/types/endfielddata/TableCfg/WikiEntryDataTable';
import type { WikiEntryTable } from '../../shared/types/endfielddata/TableCfg/WikiEntryTable';
import type { WikiGroupTable } from '../../shared/types/endfielddata/TableCfg/WikiGroupTable';

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
 * 获取 Wiki 相关的三个数据表
 * 在构建阶段调用，将数据存储到 runtimeConfig 中
 */
export async function fetchWikiTables(): Promise<{
  wikiEntryDataTable: WikiEntryDataTable;
  wikiEntryTable: WikiEntryTable;
  wikiGroupTable: WikiGroupTable;
}> {
  const wikiEntryDataTablePath = 'endfielddata/TableCfg/WikiEntryDataTable.json';
  const wikiEntryTablePath = 'endfielddata/TableCfg/WikiEntryTable.json';
  const wikiGroupTablePath = 'endfielddata/TableCfg/WikiGroupTable.json';

  console.log('开始获取 Wiki 数据表...');

  const [wikiEntryDataTableText, wikiEntryTableText, wikiGroupTableText] = await Promise.all([
    fetch(getResourceUrl(wikiEntryDataTablePath)).then((res) => res.text()),
    fetch(getResourceUrl(wikiEntryTablePath)).then((res) => res.text()),
    fetch(getResourceUrl(wikiGroupTablePath)).then((res) => res.text()),
  ]);

  const wikiEntryDataTable = parseJSONWithBigInt(wikiEntryDataTableText) as WikiEntryDataTable;
  const wikiEntryTable = parseJSONWithBigInt(wikiEntryTableText) as WikiEntryTable;
  const wikiGroupTable = parseJSONWithBigInt(wikiGroupTableText) as WikiGroupTable;

  console.log('Wiki 数据表获取完成');

  return {
    wikiEntryDataTable,
    wikiEntryTable,
    wikiGroupTable,
  };
}
