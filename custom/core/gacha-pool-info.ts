// custom/core/gacha-pool-info.ts

// 定义卡池数据的接口
interface GachaPool {
  poolId: string;
  poolName: string;
  upCharName: string;
}

// 卡池列表
const gachaPools: GachaPool[] = [
  {
    poolId: "special_1_0_1",
    poolName: "熔火灼痕",
    upCharName: "莱万汀",
  },
  {
    poolId: "special_1_0_2",
    poolName: "热烈色彩",
    upCharName: "伊冯",
  },
  {
    poolId: "special_1_0_3",
    poolName: "轻飘飘的信使",
    upCharName: "洁尔佩塔",
  },
];

export { gachaPools };