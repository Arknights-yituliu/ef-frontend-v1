/**
 * 从线上数据源下载最新版解包数据到本地缓存
 * 执行方式: yarn fetch-data（yarn makedata 会先执行本脚本）
 * 缓存按版本号分目录，同一版本已有缓存时直接复用；加 --force 可强制重新下载。
 */
import fs from 'node:fs';
import path from 'node:path';
import { cachedDataRoot, currentVersionFile, localDataDir, manifestUrl } from './utils/env';
import { usedLanguages } from './utils/i18n';

/** 需要下载的解包数据表 */
const tableFiles = [
  'BattlePassLevelTable.json',
  'BattlePassOverrideLevelTable.json',
  'BattlePassSeasonTable.json',
  'BattlePassTrackTable.json',
  'CashShopGoodsTable.json',
  'CashShopGroupTable.json',
  'CashShopHideInGameTable.json',
  'CashShopTable.json',
  'CharWpnRecommendTable.json',
  'ForesightCharGrowthTable.json',
  'ForesightWeaponTable.json',
  'GemTable.json',
  'GemTagIdTable.json',
  'GiftpackCashShopGoodsDataTable.json',
  'ItemListByTypeTable.json',
  'ItemTable.json',
  'ItemTypeTable.json',
  'LevelLoadingTable.json',
  'LTItemTable.json',
  'RarityColorTable.json',
  'RecoverApItemTable.json',
  'RewardTable.json',
  'ShopChannelDevelopmentTable.json',
  'ShopGoodsTable.json',
  'ShopGroupTable.json',
  'ShopTable.json',
  'SimulationTrainingCardPoolTable.json',
  'SimulationTrainingCardTable.json',
  'SimulationTrainingConst.json',
  'SimulationTrainingLevelTable.json',
  'SkillPatchTable.json',
  'TextTable.json',
  'WeaponBasicTable.json',
  'WikiEntryDataTable.json',
  'WikiEntryTable.json',
  'WikiGroupTable.json',
  'WorldEnergyPointGroupTable.json',
  'WorldEnergyPointTable.json',
  ...usedLanguages.map((lang) => `I18nTextTable_${lang}.json`),
];

interface ManifestVersion {
  id: string;
  tableCfgPath: string;
}

interface Manifest {
  latest: string;
  versions: ManifestVersion[];
}

const force = process.argv.includes('--force');

async function resolveLatest(): Promise<{ baseUrl: string; version: ManifestVersion }> {
  const response = await fetch(manifestUrl);
  if (!response.ok) {
    throw new Error(`获取版本清单失败 ${manifestUrl}: ${response.status} ${response.statusText}`);
  }
  const manifest = (await response.json()) as Manifest;
  const version = manifest.versions.find((item) => item.id === manifest.latest);
  if (!version) {
    throw new Error(`版本清单中找不到最新版本 ${manifest.latest}`);
  }
  return { baseUrl: new URL(manifestUrl).origin, version };
}

async function download(fileName: string, tableCfgUrl: string, tableCfgDir: string): Promise<void> {
  const dest = path.join(tableCfgDir, fileName);
  if (!force && fs.existsSync(dest)) {
    console.log(`· ${fileName}（已缓存）`);
    return;
  }

  const url = `${tableCfgUrl}/${fileName}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`下载失败 ${url}: ${response.status} ${response.statusText}`);
  }
  const text = await response.text();
  JSON.parse(text);

  fs.mkdirSync(tableCfgDir, { recursive: true });
  fs.writeFileSync(dest, text, 'utf8');
  console.log(`✓ ${fileName}`);
}

async function main(): Promise<void> {
  if (localDataDir) {
    console.log(`· 使用本地解包数据目录：${localDataDir}`);
    return;
  }

  const { baseUrl, version } = await resolveLatest();
  console.log(`· 最新数据版本：${version.id}`);

  const tableCfgUrl = `${baseUrl}/${version.tableCfgPath}`;
  const tableCfgDir = path.join(cachedDataRoot, version.id, 'TableCfg');

  const pending = [...tableFiles];
  await Promise.all(
    Array.from({ length: 6 }, async () => {
      while (pending.length > 0) {
        await download(pending.pop()!, tableCfgUrl, tableCfgDir);
      }
    }),
  );

  fs.writeFileSync(currentVersionFile, JSON.stringify({ version: version.id }, null, 2), 'utf8');
  console.log(`✓ 解包数据已就绪：${tableCfgDir}`);
}

await main();
