import type { 牌库数据类 } from './trialOfSwordmancy';
import { 牌库配置, 轮换起始Ms, 轮换间隔Ms } from '@/custom/core/trialOfSwordmancy';

export const 牌库数据存储Key = 'trial-swordmancy-deck-data';
const 旧牌库周期确认存储Key = 'trial-swordmancy-deck-cycle-confirmed';

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

export function 格式化东八区时间(timeMs: number): string {
  const parts = new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
    .formatToParts(new Date(timeMs))
    .reduce<Record<string, string>>((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {});

  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}`;
}

export function 牌库数据快照(deck: number[]): string {
  return JSON.stringify(deck);
}

export function 是有效牌库数据(value: unknown, deckLength: number = 5): value is 牌库数据类 {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const data = value as Partial<牌库数据类>;
  return (
    Array.isArray(data.deck) &&
    data.deck.length === deckLength &&
    data.deck.every((n) => Number.isFinite(n)) &&
    Number.isFinite(data.updatedAt)
  );
}

/**
 * 读取本地牌库数据，若牌库已轮换则自动更新为当前牌库的 deck
 */
export function 读取本地牌库数据(storage: Storage): 牌库数据类 {
  const 当前deck = 获取当前牌库Deck();
  const 当前时间戳 = Date.now();

  try {
    const saved = storage.getItem(牌库数据存储Key);
    if (saved) {
      const data: unknown = JSON.parse(saved);
      if (是有效牌库数据(data)) {
        // 检查保存的数据是否属于当前牌库
        const 保存时的牌库索引 = 计算当前牌库索引(data.updatedAt);
        const 当前牌库索引 = 计算当前牌库索引();

        if (保存时的牌库索引 === 当前牌库索引) {
          // 同一牌库，保留用户的手动调整
          const result = {
            deck: [...data.deck],
            updatedAt: 当前时间戳,
          };
          写入本地牌库数据(storage, result);
          return result;
        }

        // 牌库已轮换，自动更新为新牌库
        const result = {
          deck: [...当前deck],
          updatedAt: 当前时间戳,
        };
        写入本地牌库数据(storage, result);
        return result;
      }
    }
  } catch {
    // Ignore malformed local data and fall back to the bundled deck.
  }

  // 无有效本地数据，使用当前牌库
  const fallback = {
    deck: [...当前deck],
    updatedAt: 当前时间戳,
  };
  写入本地牌库数据(storage, fallback);
  storage.removeItem(旧牌库周期确认存储Key);
  return fallback;
}

export function 写入本地牌库数据(storage: Storage, data: 牌库数据类): void {
  storage.setItem(
    牌库数据存储Key,
    JSON.stringify({
      deck: [...data.deck],
      updatedAt: data.updatedAt,
    }),
  );
}
