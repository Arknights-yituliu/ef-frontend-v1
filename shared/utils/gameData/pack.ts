/**
 * 游戏数据模块 - 礼包相关工具函数
 * 提供礼包价值计算、抽卡数量计算和效率分析等功能
 */
import type { PackContent, PackData, WeaponQuotaBaseline } from '@/shared/types/pack';
import { getItemPulls, getItemValue } from '@/shared/utils/gameData/item';

export const ORIGINIUM_WEAPON_QUOTA_RATE = 25;
export const WEAPON_QUOTA_PER_CLAIM = 1980;
export const pack648WeaponQuotaBaseline: WeaponQuotaBaseline = {
  totalQuota: 350 * ORIGINIUM_WEAPON_QUOTA_RATE,
  price: 648,
};

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
export function getItemBundlePulls({ itemId, quantity }: PackContent, includeOriginium = true) {
  if (!includeOriginium && itemId === 'item_originium_recharge') {
    return 0;
  }

  return getItemPulls(itemId) * quantity;
}

/**
 * Calculate the weapon quota available from a single pack content entry.
 * Originium can be exchanged at a rate of 1 originium to 25 weapon quota.
 */
export function getItemBundleWeaponQuota(
  { itemId, quantity }: PackContent,
  includeOriginium = true,
) {
  if (itemId === 'item_originium_recharge') {
    return includeOriginium ? quantity * ORIGINIUM_WEAPON_QUOTA_RATE : 0;
  }

  if (itemId === 'item_gachabyproducts_weapongold') {
    return quantity;
  }

  return 0;
}

/**
 * 计算物品包价值占礼包总价的百分比
 * 基于648元礼包的理智成本效率基准进行归一化
 * @param {PackContent} packContent - 要分析的物品包
 * @param {PackData} pack - 包含该物品包的礼包
 * @returns {number} 物品包价值占礼包总价的百分比
 */
export function getItemBundleValuePercentage(
  packContent: PackContent,
  pack: PackData,
  weaponQuotaBaseline = pack648WeaponQuotaBaseline,
) {
  return (
    getItemBundleAllItemsValue(packContent, weaponQuotaBaseline) /
    pack.price /
    pack648SanityCostEffectiveness
  );
}

/**
 * 计算礼包中所有内容的总价值
 * @param {PackData} pack - 要分析的礼包
 * @returns {number} 礼包中所有物品的总价值
 */
export function getPackTotalValue(
  pack: PackData,
  weaponQuotaBaseline = pack648WeaponQuotaBaseline,
) {
  return pack.contents.reduce(
    (sum, content) => sum + getItemBundleAllItemsValue(content, weaponQuotaBaseline),
    0,
  );
}

/**
 * 计算礼包中所有内容提供的总抽卡次数
 * @param {PackData} pack - 要分析的礼包
 * @returns {number} 礼包中所有物品提供的总抽卡次数
 */
export function getPackTotalPulls(pack: PackData, includeOriginium = true) {
  return pack.contents.reduce(
    (sum, content) => sum + getItemBundlePulls(content, includeOriginium),
    0,
  );
}

/**
 * Calculate the total weapon quota available from a pack.
 */
export function getPackTotalWeaponQuota(pack: PackData, includeOriginium = true) {
  return pack.contents.reduce(
    (sum, content) => sum + getItemBundleWeaponQuota(content, includeOriginium),
    0,
  );
}

/**
 * Calculate the number of weapon claims available from a pack.
 */
export function getPackTotalWeaponClaims(pack: PackData) {
  return getPackTotalWeaponQuota(pack) / WEAPON_QUOTA_PER_CLAIM;
}

/**
 * 计算礼包的石头等值价值
 * 基于1石头 = 40价值单位的假设
 * @param {PackData} pack - 要分析的礼包
 * @returns {number} 礼包的石头等值价值
 */
export function getPackStoneEquivalent(
  pack: PackData,
  weaponQuotaBaseline = pack648WeaponQuotaBaseline,
) {
  return getPackTotalValue(pack, weaponQuotaBaseline) / 40;
}

/**
 * 计算礼包的每石头价格
 * @param {PackData} pack - 要分析的礼包
 * @returns {number} 每石头的价格
 */
export function getPackPricePerStone(
  pack: PackData,
  weaponQuotaBaseline = pack648WeaponQuotaBaseline,
) {
  return pack.price / getPackStoneEquivalent(pack, weaponQuotaBaseline);
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
 * Calculate the price per weapon claim.
 */
export function getPackPricePerWeaponClaim(pack: PackData) {
  return pack.price / getPackTotalWeaponClaims(pack);
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
 * Weapon quota efficiency baseline of the non-first-charge 648 yuan pack.
 */
export function getWeaponQuotaCostEffectiveness(baseline: WeaponQuotaBaseline) {
  return baseline.totalQuota / baseline.price;
}

export const pack648WeaponQuotaCostEffectiveness = getWeaponQuotaCostEffectiveness(
  pack648WeaponQuotaBaseline,
);

/**
 * Convert weapon quota into the same value unit used by the all-items calculation.
 */
export function getWeaponQuotaValue(
  baseline: WeaponQuotaBaseline = pack648WeaponQuotaBaseline,
) {
  return pack648SanityCostEffectiveness / getWeaponQuotaCostEffectiveness(baseline);
}

/**
 * Calculate the all-items value of a single pack content entry.
 * Originium stays in the operator-pull value; explicit weapon quota uses the selected baseline.
 */
export function getItemBundleAllItemsValue(
  packContent: PackContent,
  weaponQuotaBaseline = pack648WeaponQuotaBaseline,
) {
  const baseValue = getItemBundleValue(packContent);

  if (packContent.itemId === 'item_gachabyproducts_weapongold') {
    return packContent.quantity * getWeaponQuotaValue(weaponQuotaBaseline);
  }

  return baseValue;
}

/**
 * 计算礼包相对于648元礼包的理智效率
 * 数值为1.0表示与648元礼包效率相同
 * 数值大于1.0表示比648元礼包更高效
 * @param {PackData} pack - 要分析的礼包
 * @returns {number} 理智效率评分
 */
export function getPackSanityEfficiency(
  pack: PackData,
  weaponQuotaBaseline = pack648WeaponQuotaBaseline,
) {
  return getPackTotalValue(pack, weaponQuotaBaseline) / pack.price / pack648SanityCostEffectiveness;
}

/**
 * 计算礼包相对于648元礼包的抽卡效率
 * 数值为1.0表示与648元礼包效率相同
 * 数值大于1.0表示比648元礼包更高效
 * @param {PackData} pack - 要分析的礼包
 * @returns {number} 抽卡效率评分
 */
export function getPackPullsEfficiency(pack: PackData, includeOriginium = true) {
  const totalPulls = getPackTotalPulls(pack, includeOriginium);
  return totalPulls === 0 ? 0 : totalPulls / pack.price / pack648PullCostEffectiveness;
}

/**
 * Calculate weapon quota efficiency relative to the non-first-charge 648 yuan pack.
 */
export function getPackWeaponEfficiency(
  pack: PackData,
  includeOriginium = true,
  baseline = pack648WeaponQuotaBaseline,
) {
  const totalWeaponQuota = getPackTotalWeaponQuota(pack, includeOriginium);
  return totalWeaponQuota === 0
    ? 0
    : totalWeaponQuota / pack.price / getWeaponQuotaCostEffectiveness(baseline);
}
