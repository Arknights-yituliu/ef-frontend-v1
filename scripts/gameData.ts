import type {
  BattlePassLevelTable,
  BattlePassOverrideLevelTable,
  BattlePassSeasonTable,
  BattlePassTrackTable,
  CashShopGoodsTable,
  CashShopGroupTable,
  CashShopHideInGameTable,
  CashShopTable,
  CharWpnRecommendTable,
  ForesightCharGrowthTable,
  ForesightWeaponTable,
  GemTable,
  GemTagIdTable,
  GiftpackCashShopGoodsDataTable,
  I18nTextTable,
  ItemListByTypeTable,
  ItemTable,
  ItemTypeTable,
  LevelLoadingTable,
  LTItemTable,
  RecoverApItemTable,
  RewardTable,
  ShopChannelDevelopmentTable,
  ShopGoodsTable,
  ShopGroupTable,
  ShopTable,
  SimulationTrainingCardPoolTable,
  SimulationTrainingCardTable,
  SimulationTrainingConst,
  SimulationTrainingLevelTable,
  SkillPatchTable,
  TextTable,
  WeaponBasicTable,
  WikiEntryDataTable,
  WorldEnergyPointGroupTable,
  WorldEnergyPointTable,
} from './models';
import type { I18nLanguage } from './utils/i18n';
import * as fs from 'node:fs';
import { getI18nTextTablePath, i18nLanguages } from './utils/i18n';
import { readJSONWithBigInt } from './utils/json';

// 读取文件
export const battlePassLevelTable: BattlePassLevelTable = readJSONWithBigInt(
  'TableCfg/BattlePassLevelTable.json',
);
export const battlePassOverrideLevelTable: BattlePassOverrideLevelTable = readJSONWithBigInt(
  'TableCfg/BattlePassOverrideLevelTable.json',
);
export const battlePassSeasonTable: BattlePassSeasonTable = readJSONWithBigInt(
  'TableCfg/BattlePassSeasonTable.json',
);
export const battlePassTrackTable: BattlePassTrackTable = readJSONWithBigInt(
  'TableCfg/BattlePassTrackTable.json',
);
export const cashShopGoodsTable: CashShopGoodsTable = readJSONWithBigInt(
  'TableCfg/CashShopGoodsTable.json',
);
export const cashShopGroupTable: CashShopGroupTable = readJSONWithBigInt(
  'TableCfg/CashShopGroupTable.json',
);
export const cashShopHideInGameTable: CashShopHideInGameTable = readJSONWithBigInt(
  'TableCfg/CashShopHideInGameTable.json',
);
export const cashShopTable: CashShopTable = readJSONWithBigInt('TableCfg/CashShopTable.json');
export const charWpnRecommendTable: CharWpnRecommendTable = readJSONWithBigInt(
  'TableCfg/CharWpnRecommendTable.json',
);
export const foresightCharGrowthTable: ForesightCharGrowthTable = readJSONWithBigInt(
  'TableCfg/ForesightCharGrowthTable.json',
);
export const foresightWeaponTable: ForesightWeaponTable = readJSONWithBigInt(
  'TableCfg/ForesightWeaponTable.json',
);
export const gemTable: GemTable = readJSONWithBigInt('TableCfg/GemTable.json');
export const gemTagIdTable: GemTagIdTable = readJSONWithBigInt('TableCfg/GemTagIdTable.json');
export const giftpackCashShopGoodsDataTable: GiftpackCashShopGoodsDataTable = readJSONWithBigInt(
  'TableCfg/GiftpackCashShopGoodsDataTable.json',
);
export const itemListByTypeTable: ItemListByTypeTable = readJSONWithBigInt(
  'TableCfg/ItemListByTypeTable.json',
);
export const itemTable: ItemTable = readJSONWithBigInt('TableCfg/ItemTable.json');
export const itemTypeTable: ItemTypeTable = readJSONWithBigInt('TableCfg/ItemTypeTable.json');
export const levelLoadingTable: LevelLoadingTable = readJSONWithBigInt(
  'TableCfg/LevelLoadingTable.json',
);
export const lTItemTable: LTItemTable = readJSONWithBigInt('TableCfg/LTItemTable.json');
export const recoverApItemTable: RecoverApItemTable = readJSONWithBigInt(
  'TableCfg/RecoverApItemTable.json',
);
export const rewardTable: RewardTable = readJSONWithBigInt('TableCfg/RewardTable.json');
export const shopChannelDevelopmentTable: ShopChannelDevelopmentTable = readJSONWithBigInt(
  'TableCfg/ShopChannelDevelopmentTable.json',
);
export const shopGoodsTable: ShopGoodsTable = readJSONWithBigInt('TableCfg/ShopGoodsTable.json');
export const shopGroupTable: ShopGroupTable = readJSONWithBigInt('TableCfg/ShopGroupTable.json');
export const shopTable: ShopTable = readJSONWithBigInt('TableCfg/ShopTable.json');
export const simulationTrainingCardPoolTable: SimulationTrainingCardPoolTable = readJSONWithBigInt(
  'TableCfg/SimulationTrainingCardPoolTable.json',
);
export const simulationTrainingCardTable: SimulationTrainingCardTable = readJSONWithBigInt(
  'TableCfg/SimulationTrainingCardTable.json',
);
export const simulationTrainingConst: SimulationTrainingConst = readJSONWithBigInt(
  'TableCfg/SimulationTrainingConst.json',
);
export const simulationTrainingLevelTable: SimulationTrainingLevelTable = readJSONWithBigInt(
  'TableCfg/SimulationTrainingLevelTable.json',
);
export const skillPatchTable: SkillPatchTable = readJSONWithBigInt('TableCfg/SkillPatchTable.json');
export const textTable: TextTable = readJSONWithBigInt('TableCfg/TextTable.json');
export const weaponBasicTable: WeaponBasicTable = readJSONWithBigInt(
  'TableCfg/WeaponBasicTable.json',
);
export const wikiEntryDataTable: WikiEntryDataTable = readJSONWithBigInt(
  'TableCfg/WikiEntryDataTable.json',
);
export const worldEnergyPointGroupTable: WorldEnergyPointGroupTable = readJSONWithBigInt(
  'TableCfg/WorldEnergyPointGroupTable.json',
);
export const worldEnergyPointTable: WorldEnergyPointTable = readJSONWithBigInt(
  'TableCfg/WorldEnergyPointTable.json',
);

/** 所有语言的国际化文本表，key 为语言，value 为「文本 ID → 翻译」的映射 */
export const i18nTextTables: Map<I18nLanguage, I18nTextTable> = new Map(
  i18nLanguages.map((lang) => [
    lang,
    JSON.parse(fs.readFileSync(getI18nTextTablePath(lang), 'utf8')),
  ]),
);
