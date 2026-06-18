import {
  simulationTrainingCardPoolTable,
  simulationTrainingCardTable,
  simulationTrainingConst,
} from '../gameData';

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

export function makeTrialOfSwordmancyPools(): 选剑演武牌库配置数据 {
  const { cardPoolOrder, rotationInterval } = simulationTrainingConst;

  // 起始时间：2026-06-12T04:00:00+08:00
  const startTime = '2026-06-12T04:00:00.000+08:00';

  const pools: 选剑演武牌库池数据[] = cardPoolOrder.map((poolId) => {
    const pool = simulationTrainingCardPoolTable[poolId];
    if (!pool) {
      throw new Error(`牌库 ${poolId} 在 SimulationTrainingCardPoolTable 中不存在`);
    }

    // 按 cardPoint 聚合
    const pointCounts: number[] = [0, 0, 0, 0, 0]; // index 0-4 对应 1-5 点

    for (const card of pool.list) {
      const cardEntry = simulationTrainingCardTable[card.enemyGroupId];
      if (!cardEntry) {
        throw new Error(`敌人组 ${card.enemyGroupId} 在 SimulationTrainingCardTable 中不存在`);
      }

      if (card.cardWeight !== 1) {
        throw new Error(
          `牌库 ${poolId} 中 ${card.enemyGroupId} 的 weight 不为 1（实际为 ${card.cardWeight}）`,
        );
      }

      const point = cardEntry.cardPoint;
      if (point < 1 || point > 5) {
        throw new Error(
          `牌库 ${poolId} 中 ${card.enemyGroupId} 的 cardPoint 为 ${point}，不在 1-5 范围内`,
        );
      }

      pointCounts[point - 1]! += card.cardNum;
    }

    return {
      poolId,
      deck: pointCounts,
    };
  });

  return {
    cardPoolOrder,
    rotationInterval,
    startTime,
    pools,
  };
}
