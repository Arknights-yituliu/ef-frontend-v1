import { 数据溢出模式 } from './trialOfSwordmancy';

export interface 选剑演武输入状态数据 {
  剩余演算次数: number;
  剩余放弃次数: number;
  剩余翻倍次数: number;
  是否翻倍: boolean;
}

export interface 选剑演武页面状态数据 {
  version: 1;
  演武平台等级: number;
  数据溢出模式值: 数据溢出模式;
  输入: 选剑演武输入状态数据;
  手牌插槽: number[];
}

export const 选剑演武页面状态存储Key = 'trial-swordmancy-page-state';

export const 默认选剑演武页面状态: 选剑演武页面状态数据 = {
  version: 1,
  演武平台等级: 4,
  数据溢出模式值: 数据溢出模式.接受1至2次,
  输入: {
    剩余演算次数: 3,
    剩余放弃次数: 3,
    剩余翻倍次数: 2,
    是否翻倍: false,
  },
  手牌插槽: [0, 0, 0, 0, 0],
};

function 规范化整数(value: unknown, fallback: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, Math.trunc(value as number)));
}

function 复制页面状态(data: 选剑演武页面状态数据): 选剑演武页面状态数据 {
  return {
    version: 1,
    演武平台等级: data.演武平台等级,
    数据溢出模式值: data.数据溢出模式值,
    输入: { ...data.输入 },
    手牌插槽: [...data.手牌插槽],
  };
}

function 规范化页面状态(value: unknown): 选剑演武页面状态数据 | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const data = value as Partial<选剑演武页面状态数据>;
  const 输入 = data.输入;
  if (!输入 || typeof 输入 !== 'object') {
    return null;
  }

  const 溢出模式列表 = Object.values(数据溢出模式);
  const 数据溢出模式值 = 溢出模式列表.includes(data.数据溢出模式值 as 数据溢出模式)
    ? (data.数据溢出模式值 as 数据溢出模式)
    : 默认选剑演武页面状态.数据溢出模式值;

  const 手牌插槽 = Array.isArray(data.手牌插槽)
    ? Array.from({ length: 5 }, (_, i) => 规范化整数(data.手牌插槽![i], 0, 0, 5))
    : [...默认选剑演武页面状态.手牌插槽];

  return {
    version: 1,
    演武平台等级: 规范化整数(data.演武平台等级, 默认选剑演武页面状态.演武平台等级, 1, 4),
    数据溢出模式值,
    输入: {
      剩余演算次数: 规范化整数(输入.剩余演算次数, 默认选剑演武页面状态.输入.剩余演算次数, 0, 3),
      剩余放弃次数: 规范化整数(输入.剩余放弃次数, 默认选剑演武页面状态.输入.剩余放弃次数, 0, 3),
      剩余翻倍次数: 规范化整数(输入.剩余翻倍次数, 默认选剑演武页面状态.输入.剩余翻倍次数, 0, 3),
      是否翻倍: 输入.是否翻倍 === true,
    },
    手牌插槽,
  };
}

export function 读取选剑演武页面状态(storage: Storage): 选剑演武页面状态数据 {
  try {
    const saved = storage.getItem(选剑演武页面状态存储Key);
    if (saved) {
      const data = 规范化页面状态(JSON.parse(saved));
      if (data) {
        return data;
      }
    }
  } catch {
    // Ignore malformed local data and fall back to defaults.
  }

  const fallback = 复制页面状态(默认选剑演武页面状态);
  写入选剑演武页面状态(storage, fallback);
  return fallback;
}

export function 写入选剑演武页面状态(storage: Storage, data: 选剑演武页面状态数据): void {
  storage.setItem(选剑演武页面状态存储Key, JSON.stringify(复制页面状态(data)));
}
