import { simulationTrainingLevelTable } from '../gameData';

export interface LevelData {
  doubleLimit: number;
  pointAward: number[];
}

export type LevelTableData = Record<string, LevelData>;

export function makeTrialOfSwordmancyLevelTable(): LevelTableData {
  const result: LevelTableData = {};

  for (const [levelId, level] of Object.entries(simulationTrainingLevelTable)) {
    result[levelId] = {
      doubleLimit: level.doubleLimit,
      pointAward: level.pointAward,
    };
  }

  return result;
}
