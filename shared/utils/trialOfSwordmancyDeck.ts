import { 牌库配置, 获取当前牌库Deck, 计算当前牌库索引 } from '@/custom/core/trialOfSwordmancyPools';
import { type 牌库数据类, 默认牌库数据 } from './trialOfSwordmancy';

export const 牌库数据存储Key = 'trial-swordmancy-deck-data';
const 旧牌库周期确认存储Key = 'trial-swordmancy-deck-cycle-confirmed';

export const 轮换起始Ms = new Date('2026-06-12T04:00:00.000+08:00').getTime();
export const 轮换间隔Ms = 牌库配置.rotationInterval * 24 * 60 * 60 * 1000;

/**
 * 计算某个时间戳所在的牌库索引
 * 与 计算当前牌库索引 一致，但接受任意时间戳（用于判断保存数据的牌库是否变化）
 */
export function 计算推移牌库索引(timestampMs: number): number {
  if (timestampMs < 轮换起始Ms) {
    return -1;
  }

  const elapsed = timestampMs - 轮换起始Ms;
  return Math.floor(elapsed / 轮换间隔Ms) % 牌库配置.cardPoolOrder.length;
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

export function 是有效牌库数据(
  value: unknown,
  deckLength: number = 默认牌库数据.deck.length,
): value is 牌库数据类 {
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
        const 保存时的牌库索引 = 计算推移牌库索引(data.updatedAt);
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
