import * as fs from 'node:fs';
import path from 'node:path';
import { endfieldDataDir } from './env';

/** 解析带有大整数的 JSON 的辅助函数 */
export function parseJSONWithBigInt(text: string): any {
  // 将看起来像 ID 的数值（长整数）替换为字符串，避免 JSON.parse 时丢失精度
  // 目前的实现方法是简单地将所有 "id": <number> 替换为 "id": "<number>"
  const stringified = text.replace(/"id":\s*(-?\d+)/g, '"id": "$1"');
  return JSON.parse(stringified);
}

/** 读取解包目录下指定相对路径的 JSON 文件，并自动处理大整数精度问题 */
export function readJSONWithBigInt(relativePath: string): any {
  const fullPath = path.join(endfieldDataDir, relativePath);
  const text = fs.readFileSync(fullPath, 'utf8');
  return parseJSONWithBigInt(text);
}
