import rawLevelTable from './trialOfSwordmancyLevelTable.json';
import rawPools from './trialOfSwordmancyPools.json';

// ==================== 牌库轮换 ====================

export interface 选剑演武牌库池数据 {
  poolId: string;
  deck: number[];
}

export interface 选剑演武牌库配置数据 {
  cardPoolOrder: string[];
  rotationInterval: number;
  startTime: string;
  pools: 选剑演武牌库池数据[];
}

export const 牌库配置 = rawPools as 选剑演武牌库配置数据;

/** 轮换起始时间（UTC 毫秒） */
export const 轮换起始Ms = new Date('2026-06-12T04:00:00.000+08:00').getTime();
/** 轮换间隔（毫秒） */
export const 轮换间隔Ms = 牌库配置.rotationInterval * 24 * 60 * 60 * 1000;

/**
 * 计算当前时间所在的卡池索引
 * @param nowMs 当前时间（毫秒），默认 Date.now()
 * @returns 卡池索引（0-based），如果当前时间在起始时间之前则返回 -1
 */
export function 计算当前牌库索引(nowMs: number = Date.now()): number {
  if (nowMs < 轮换起始Ms) {
    return -1;
  }

  const elapsed = nowMs - 轮换起始Ms;
  const index = Math.floor(elapsed / 轮换间隔Ms);
  return index % 牌库配置.cardPoolOrder.length;
}

/**
 * 获取当前牌库的 deck 数据
 * @param nowMs 当前时间（毫秒），默认 Date.now()
 * @returns deck 数组 [point1, point2, point3, point4, point5]
 */
export function 获取当前牌库Deck(nowMs: number = Date.now()): number[] {
  const index = 计算当前牌库索引(nowMs);
  if (index < 0) {
    return 牌库配置.pools[0]!.deck;
  }

  return 牌库配置.pools[index]!.deck;
}

// ==================== 演武平台等级 ====================

export interface LevelData {
  doubleLimit: number;
  pointAward: number[];
}

export type LevelTableData = Record<string, LevelData>;

export const 演武平台等级表数据 = rawLevelTable as LevelTableData;
