export enum 决策空间类 {
  抽取铭牌 = '抽取铭牌',
  放弃 = '放弃',
  开始演算 = '开始演算',
  翻倍 = '选择翻倍',
}

export enum 吸收态 {
  已结束 = '已结束',
}

export enum 数据溢出模式 {
  不接受 = '不接受',
  接受1次 = '接受1次',
  接受1至2次 = '接受1至2次',
}

export interface 过渡态类 {
  剩余演算次数: number;
  剩余放弃次数: number;
  剩余翻倍次数: number;
  是否翻倍: boolean;
  已抽到的铭牌数量元组: number[];
}

export type 状态类 = 过渡态类 | 吸收态;

export interface MDPResult {
  价值函数: number[];
  最优策略: (决策空间类 | null)[];
  状态列表: 状态类[];
  状态索引: Map<string, number>;
  状态数量: number;
}

export function 状态键(状态: 状态类): string {
  if (状态 === 吸收态.已结束) return 'END';
  const s = 状态 as 过渡态类;
  return `${s.剩余演算次数},${s.剩余放弃次数},${s.剩余翻倍次数},${s.是否翻倍},${s.已抽到的铭牌数量元组.join(',')}`;
}

export function 计算总分(已抽到的铭牌数量元组: number[]): number {
  let sum = 0;
  for (const [i, count] of 已抽到的铭牌数量元组.entries()) {
    sum += (i + 1) * count;
  }
  return sum;
}

export function 计算战力点(已抽到的铭牌数量元组: number[]): number {
  return 计算总分(已抽到的铭牌数量元组) % 11;
}

export class 求解器类 {
  牌库数量元组: number[];
  演算奖励元组: number[];
  翻倍次数上限: number;
  数据溢出模式: 数据溢出模式;

  状态列表: 状态类[] = [];
  状态索引: Map<string, number> = new Map();
  状态数量: number = 0;
  状态容许决策列表: 决策空间类[][] = [];

  constructor(
    牌库数量元组: number[],
    演算奖励元组: number[],
    翻倍次数上限: number,
    溢出模式: 数据溢出模式,
  ) {
    this.牌库数量元组 = 牌库数量元组;
    this.演算奖励元组 = 演算奖励元组;
    this.翻倍次数上限 = 翻倍次数上限;
    this.数据溢出模式 = 溢出模式;
  }

  已抽到的铭牌数量组合(): number[][] {
    const results: number[][] = [];
    const 牌库 = this.牌库数量元组;
    function 递归(索引: number, 当前: number[], 总数: number): void {
      if (索引 === 牌库.length) {
        if (总数 <= 5) results.push([...当前]);
        return;
      }
      for (let i = 0; i <= 牌库[索引]! && 总数 + i <= 5; i++) {
        当前.push(i);
        递归(索引 + 1, 当前, 总数 + i);
        当前.pop();
      }
    }
    递归(0, [], 0);
    return results;
  }

  计算演算奖励(已抽到的铭牌数量元组: number[], 是否翻倍: boolean): number {
    const 总点数 = 计算总分(已抽到的铭牌数量元组);

    // 根据数据溢出模式检查是否溢出归零
    if (this.数据溢出模式 === 数据溢出模式.不接受 && 总点数 >= 11) {
      return 0;
    }
    if (this.数据溢出模式 === 数据溢出模式.接受1次 && 总点数 >= 22) {
      return 0;
    }
    // 接受1至2次：无上限限制

    const 战力点 = 计算战力点(已抽到的铭牌数量元组);
    let 演算奖励 = this.演算奖励元组[战力点] ?? 0;
    if (是否翻倍) {
      演算奖励 *= 2;
    }
    return 演算奖励;
  }

  获取状态(
    剩余演算次数: number,
    剩余放弃次数: number,
    剩余翻倍次数: number,
    是否翻倍: boolean,
    已抽到的铭牌数量元组: number[],
  ): 状态类 {
    if (剩余演算次数 === 0) return 吸收态.已结束;
    return {
      剩余演算次数,
      剩余放弃次数,
      剩余翻倍次数,
      是否翻倍,
      已抽到的铭牌数量元组: [...已抽到的铭牌数量元组],
    };
  }

  状态转移(起始状态: 状态类, 决策: 决策空间类): [状态类, number][] {
    const 转移概率列表: [状态类, number][] = [];

    if (起始状态 === 吸收态.已结束) {
      转移概率列表.push([起始状态, 1]);
      return 转移概率列表;
    }

    const {
      剩余演算次数: 起始剩余演算次数,
      剩余放弃次数: 起始剩余放弃次数,
      剩余翻倍次数: 起始剩余翻倍次数,
      是否翻倍: 起始是否翻倍,
      已抽到的铭牌数量元组: 起始已抽到的铭牌数量元组,
    } = 起始状态 as 过渡态类;

    switch (决策) {
      case 决策空间类.抽取铭牌: {
        const 剩余铭牌数量元组 = this.牌库数量元组.map((n, i) => n - 起始已抽到的铭牌数量元组[i]!);
        const 总剩余铭牌数量 = 剩余铭牌数量元组.reduce((a, b) => a + b, 0);
        for (const [i, count] of 剩余铭牌数量元组.entries()) {
          if (count > 0) {
            const 概率 = count / 总剩余铭牌数量;
            const 目标已抽到的铭牌数量元组 = [...起始已抽到的铭牌数量元组];
            目标已抽到的铭牌数量元组[i]!++;
            const 目标状态 = this.获取状态(
              起始剩余演算次数,
              起始剩余放弃次数,
              起始剩余翻倍次数,
              起始是否翻倍,
              目标已抽到的铭牌数量元组,
            );
            转移概率列表.push([目标状态, 概率]);
          }
        }
        break;
      }

      case 决策空间类.放弃: {
        if (起始剩余放弃次数 > 0) {
          const 目标状态 = this.获取状态(
            起始剩余演算次数,
            起始剩余放弃次数 - 1,
            起始剩余翻倍次数,
            false,
            [0, 0, 0, 0, 0],
          );
          转移概率列表.push([目标状态, 1]);
        } else {
          const 目标状态 = this.获取状态(
            起始剩余演算次数 - 1,
            起始剩余放弃次数,
            起始剩余翻倍次数,
            false,
            [0, 0, 0, 0, 0],
          );
          转移概率列表.push([目标状态, 1]);
        }
        break;
      }

      case 决策空间类.开始演算: {
        const 目标状态 = this.获取状态(
          起始剩余演算次数 - 1,
          起始剩余放弃次数,
          起始剩余翻倍次数 - (起始是否翻倍 ? 1 : 0),
          false,
          [0, 0, 0, 0, 0],
        );
        转移概率列表.push([目标状态, 1]);
        break;
      }

      case 决策空间类.翻倍: {
        const 目标状态 = this.获取状态(
          起始剩余演算次数,
          起始剩余放弃次数,
          起始剩余翻倍次数,
          true,
          起始已抽到的铭牌数量元组,
        );
        转移概率列表.push([目标状态, 1]);
        break;
      }
    }

    return 转移概率列表.filter(([, p]) => p > 0);
  }

  状态容许决策(状态: 状态类): 决策空间类[] {
    if (状态 === 吸收态.已结束) return [];

    const s = 状态 as 过渡态类;
    const 已抽到的铭牌总数量 = s.已抽到的铭牌数量元组.reduce((a, b) => a + b, 0);

    if (已抽到的铭牌总数量 === 5) {
      return [决策空间类.开始演算, 决策空间类.放弃];
    }

    const 基础决策 = [决策空间类.抽取铭牌, 决策空间类.放弃, 决策空间类.开始演算];

    if (已抽到的铭牌总数量 === 2 && !s.是否翻倍 && s.剩余翻倍次数 > 0) {
      return [...基础决策, 决策空间类.翻倍];
    }

    return 基础决策;
  }

  行动奖励(状态: 状态类, 决策: 决策空间类): number {
    if (状态 === 吸收态.已结束) return 0;
    if (决策 === 决策空间类.开始演算) {
      const s = 状态 as 过渡态类;
      return this.计算演算奖励(s.已抽到的铭牌数量元组, s.是否翻倍);
    }
    return 0;
  }

  是需要考虑的状态(状态: 过渡态类): boolean {
    if (!(状态.剩余演算次数 >= 1 && 状态.剩余演算次数 <= 3)) return false;
    if (!(状态.剩余放弃次数 >= 0 && 状态.剩余放弃次数 <= 3)) return false;
    if (
      !(
        状态.剩余演算次数 - 3 + this.翻倍次数上限 <= 状态.剩余翻倍次数 &&
        状态.剩余翻倍次数 <= this.翻倍次数上限
      )
    )
      return false;

    const 已抽到的铭牌总数量 = 状态.已抽到的铭牌数量元组.reduce((a, b) => a + b, 0);
    if (已抽到的铭牌总数量 <= 1 && 状态.是否翻倍) return false;
    if (状态.是否翻倍 && 状态.剩余翻倍次数 === 0) return false;

    return true;
  }

  构建状态列表(): void {
    this.状态列表 = [吸收态.已结束];
    this.状态索引 = new Map();
    this.状态索引.set(状态键(吸收态.已结束), 0);

    const 所有组合 = this.已抽到的铭牌数量组合();

    for (let 剩余演算次数 = 1; 剩余演算次数 <= 3; 剩余演算次数++) {
      for (let 剩余放弃次数 = 0; 剩余放弃次数 <= 3; 剩余放弃次数++) {
        for (let 剩余翻倍次数 = 0; 剩余翻倍次数 <= this.翻倍次数上限; 剩余翻倍次数++) {
          for (const 是否翻倍 of [false, true]) {
            for (const 已抽到的铭牌数量元组 of 所有组合) {
              const 状态: 过渡态类 = {
                剩余演算次数,
                剩余放弃次数,
                剩余翻倍次数,
                是否翻倍,
                已抽到的铭牌数量元组: [...已抽到的铭牌数量元组],
              };
              if (this.是需要考虑的状态(状态)) {
                const key = 状态键(状态);
                if (!this.状态索引.has(key)) {
                  this.状态索引.set(key, this.状态列表.length);
                  this.状态列表.push(状态);
                }
              }
            }
          }
        }
      }
    }

    this.状态数量 = this.状态列表.length;
  }

  构建状态容许决策列表(): void {
    this.状态容许决策列表 = this.状态列表.map((s) => this.状态容许决策(s));
  }

  求解MDP(): MDPResult {
    this.构建状态列表();
    this.构建状态容许决策列表();

    const N = this.状态数量;
    const 状态列表 = this.状态列表;
    const 状态索引 = this.状态索引;

    const 反向边: number[][] = Array.from({ length: N }, () => []);
    for (let 起始序号 = 0; 起始序号 < N; 起始序号++) {
      const 状态 = 状态列表[起始序号]!;
      for (const 决策 of this.状态容许决策列表[起始序号]!) {
        const 转移 = this.状态转移(状态, 决策);
        for (const [目标状态] of 转移) {
          反向边[状态索引.get(状态键(目标状态))!]!.push(起始序号);
        }
      }
    }

    const 吸收态序号列表 = [状态索引.get(状态键(吸收态.已结束))!];
    const 距离: number[] = Array.from({ length: N }, () => -1);
    const q: number[] = [];
    for (const idx of 吸收态序号列表) {
      距离[idx] = 0;
      q.push(idx);
    }
    while (q.length > 0) {
      const 目标 = q.shift()!;
      for (const 源 of 反向边[目标]!) {
        if (距离[源]! < 距离[目标]! + 1) {
          距离[源] = 距离[目标]! + 1;
          q.push(源);
        }
      }
    }

    const 排序序号 = Array.from({ length: N }, (_, i) => i).toSorted((a, b) => 距离[a]! - 距离[b]!);
    const 价值函数: number[] = Array.from({ length: N }, () => 0);
    const 最优策略: (决策空间类 | null)[] = Array.from({ length: N }, () => null);

    for (const 序号 of 排序序号) {
      const 状态 = 状态列表[序号]!;
      if (状态 === 吸收态.已结束) {
        价值函数[序号] = 0;
        最优策略[序号] = null;
        continue;
      }

      let 最佳价值 = -Infinity;
      let 最佳决策: 决策空间类 | null = null;
      for (const 决策 of this.状态容许决策列表[序号]!) {
        const 即时奖励 = this.行动奖励(状态, 决策);
        let 期望未来价值 = 0;
        for (const [目标状态, 概率] of this.状态转移(状态, 决策)) {
          期望未来价值 += 概率 * 价值函数[状态索引.get(状态键(目标状态))!]!;
        }
        const 总价值 = 即时奖励 + 期望未来价值;
        if (总价值 > 最佳价值 + 1e-10) {
          最佳价值 = 总价值;
          最佳决策 = 决策;
        }
      }

      价值函数[序号] = 最佳价值;
      最优策略[序号] = 最佳决策;
    }

    return {
      价值函数,
      最优策略,
      状态列表,
      状态索引,
      状态数量: this.状态数量,
    };
  }
}

export interface 牌库数据类 {
  deck: number[];
  updatedAt: number;
}

export const 默认牌库数据: 牌库数据类 = {
  deck: [5, 5, 5, 8, 6],
  updatedAt: Date.UTC(2026, 5, 11, 12, 0, 0),
};

export const 默认牌库数量元组 = 默认牌库数据.deck;
export const 默认演算奖励元组 = [
  0, 1000, 2000, 4000, 7500, 12_000, 20_000, 36_000, 60_000, 100_000, 160_000,
];

export const 演武平台等级表 = [
  {
    等级: 1,
    双倍次数: 0,
    演算奖励元组: [0, 500, 800, 1200, 2000, 3000, 5000, 8000, 12_000, 20_000, 30_000],
  },
  {
    等级: 2,
    双倍次数: 1,
    演算奖励元组: [0, 750, 1500, 2400, 3600, 6000, 10_000, 16_000, 24_000, 40_000, 60_000],
  },
  {
    等级: 3,
    双倍次数: 2,
    演算奖励元组: [0, 1000, 2000, 4000, 6000, 10_000, 15_000, 25_000, 40_000, 60_000, 100_000],
  },
  {
    等级: 4,
    双倍次数: 2,
    演算奖励元组: [0, 1000, 2000, 4000, 7500, 12_000, 20_000, 36_000, 60_000, 100_000, 160_000],
  },
];
