/**
 * 游戏数据模块 - 礼包相关工具函数
 * 提供礼包价值计算、抽卡数量计算和效率分析等功能
 */
import type { PackContent, PackData } from '@/shared/types/pack';
import { getItemPulls, getItemValue } from '@/shared/utils/gameData/item';

/**
 * 计算单个物品包的总价值
 * @param {PackContent} packContent - 包含物品ID和数量的物品包
 * @returns {number} 物品包的总价值
 */
export function getItemBundleValue({ itemId, quantity }: PackContent) {
  return getItemValue(itemId) * quantity;
}

/**
 * 计算单个物品包的总抽卡次数
 * @param {PackContent} packContent - 包含物品ID和数量的物品包
 * @returns {number} 物品包提供的总抽卡次数
 */
export function getItemBundlePulls({ itemId, quantity }: PackContent) {
  return getItemPulls(itemId) * quantity;
}

/**
 * 计算物品包价值占礼包总价的百分比
 * 基于648元礼包的理智成本效率基准进行归一化
 * @param {PackContent} packContent - 要分析的物品包
 * @param {PackData} pack - 包含该物品包的礼包
 * @returns {number} 物品包价值占礼包总价的百分比
 */
export function getItemBundleValuePercentage(packContent: PackContent, pack: PackData) {
  return getItemBundleValue(packContent) / pack.price / pack648SanityCostEffectiveness;
}

/**
 * 计算礼包中所有内容的总价值
 * @param {PackData} pack - 要分析的礼包
 * @returns {number} 礼包中所有物品的总价值
 */
export function getPackTotalValue(pack: PackData) {
  return pack.contents.reduce((sum, content) => sum + getItemBundleValue(content), 0);
}

/**
 * 计算礼包中所有内容提供的总抽卡次数
 * @param {PackData} pack - 要分析的礼包
 * @returns {number} 礼包中所有物品提供的总抽卡次数
 */
export function getPackTotalPulls(pack: PackData) {
  return pack.contents.reduce((sum, content) => sum + getItemBundlePulls(content), 0);
}

/**
 * 计算礼包的石头等值价值
 * 基于1石头 = 40价值单位的假设
 * @param {PackData} pack - 要分析的礼包
 * @returns {number} 礼包的石头等值价值
 */
export function getPackStoneEquivalent(pack: PackData) {
  return getPackTotalValue(pack) / 40;
}

/**
 * 计算礼包的每石头价格
 * @param {PackData} pack - 要分析的礼包
 * @returns {number} 每石头的价格
 */
export function getPackPricePerStone(pack: PackData) {
  return pack.price / getPackStoneEquivalent(pack);
}

/**
 * 计算礼包的每抽价格
 * @param {PackData} pack - 要分析的礼包
 * @returns {number} 每抽卡的价格
 */
export function getPackPricePerPull(pack: PackData) {
  return pack.price / getPackTotalPulls(pack);
}

/**
 * 基于648元礼包的理智成本效率基准
 * 表示标准648元礼包的单位货币价值
 * (350个源石充能道具售价648元)
 */
export const pack648SanityCostEffectiveness =
  getItemBundleValue({ itemId: 'item_originium_recharge', quantity: 350 }) / 648;

/**
 * 基于648元礼包的抽卡成本效率基准
 * 表示标准648元礼包的单位货币抽卡次数
 * (350个源石充能道具售价648元)
 */
export const pack648PullCostEffectiveness =
  getItemBundlePulls({ itemId: 'item_originium_recharge', quantity: 350 }) / 648;

/**
 * 计算礼包相对于648元礼包的理智效率
 * 数值为1.0表示与648元礼包效率相同
 * 数值大于1.0表示比648元礼包更高效
 * @param {PackData} pack - 要分析的礼包
 * @returns {number} 理智效率评分
 */
export function getPackSanityEfficiency(pack: PackData) {
  return getPackTotalValue(pack) / pack.price / pack648SanityCostEffectiveness;
}

/**
 * 计算礼包相对于648元礼包的抽卡效率
 * 数值为1.0表示与648元礼包效率相同
 * 数值大于1.0表示比648元礼包更高效
 * @param {PackData} pack - 要分析的礼包
 * @returns {number} 抽卡效率评分
 */
export function getPackPullsEfficiency(pack: PackData) {
  return getPackTotalPulls(pack) / pack.price / pack648PullCostEffectiveness;
}
