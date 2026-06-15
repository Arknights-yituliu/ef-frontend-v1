import { type 牌库数据类, 默认牌库数据 } from './trialOfSwordmancy';

export const 牌库数据存储Key = 'trial-swordmancy-deck-data';
const 旧牌库周期确认存储Key = 'trial-swordmancy-deck-cycle-confirmed';

export const 牌库刷新起点Ms = Date.UTC(2026, 5, 8, 20, 0, 0);
export const 牌库刷新周期Ms = 72 * 60 * 60 * 1000;

export function 计算牌库刷新周期(nowMs: number = Date.now()): number {
  if (nowMs < 牌库刷新起点Ms) {
    return -1;
  }

  return Math.floor((nowMs - 牌库刷新起点Ms) / 牌库刷新周期Ms);
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

export function 牌库周期范围文本(cycle: number | null): string {
  if (cycle === null || cycle < 0) {
    return '刷新周期尚未开始';
  }

  const start = 牌库刷新起点Ms + cycle * 牌库刷新周期Ms;
  const end = start + 牌库刷新周期Ms;
  return `${格式化东八区时间(start)} - ${格式化东八区时间(end)}`;
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

export function 读取本地牌库数据(storage: Storage): 牌库数据类 {
  try {
    const saved = storage.getItem(牌库数据存储Key);
    if (saved) {
      const data: unknown = JSON.parse(saved);
      if (是有效牌库数据(data)) {
        const savedData = {
          deck: [...data.deck],
          updatedAt: data.updatedAt,
        };
        const presetData = {
          deck: [...默认牌库数据.deck],
          updatedAt: 默认牌库数据.updatedAt,
        };
        const newerData = savedData.updatedAt >= presetData.updatedAt ? savedData : presetData;
        写入本地牌库数据(storage, newerData);
        return newerData;
      }
    }
  } catch {
    // Ignore malformed local data and fall back to the bundled deck.
  }

  const fallback = {
    deck: [...默认牌库数据.deck],
    updatedAt: 默认牌库数据.updatedAt,
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

export function 牌库数据需要更新(data: 牌库数据类, nowMs: number = Date.now()): boolean {
  const currentCycle = 计算牌库刷新周期(nowMs);
  if (currentCycle < 0) {
    return false;
  }

  return 计算牌库刷新周期(data.updatedAt) !== currentCycle;
}
