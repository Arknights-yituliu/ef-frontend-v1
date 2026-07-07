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

// ==================== 演武平台等级 ====================

export interface LevelData {
  doubleLimit: number;
  pointAward: number[];
}

export type LevelTableData = Record<string, LevelData>;

export const 演武平台等级表数据 = rawLevelTable as LevelTableData;
