import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

// 从环境变量加载配置，避免硬编码路径
dotenv.config();

/** 版本清单地址，用于解析最新数据版本 */
export const manifestUrl: string =
  process.env.ENDFIELD_DATA_MANIFEST_URL ?? 'https://data.akedata.wiki/manifest.json';

/** 下载数据的缓存根目录，按版本号分子目录 */
export const cachedDataRoot: string = path.resolve(process.cwd(), '.cache/endfield-data');

/** 当前使用的缓存版本记录 */
export const currentVersionFile: string = path.join(cachedDataRoot, 'current.json');

/** 本地解包数据目录；设置后直接使用该目录，不再访问线上数据源 */
export const localDataDir: string | undefined = process.env.ENDFIELD_LOCAL_DATA_DIR;

/** 获取解包数据的根目录（即 TableCfg 文件夹的父目录） */
export function getEndfieldDataDir(): string {
  if (localDataDir) {
    return localDataDir;
  }
  if (!fs.existsSync(currentVersionFile)) {
    throw new Error('本地尚无解包数据缓存，请先运行 yarn fetch-data');
  }
  const { version } = JSON.parse(fs.readFileSync(currentVersionFile, 'utf8')) as {
    version: string;
  };
  return path.join(cachedDataRoot, version);
}
