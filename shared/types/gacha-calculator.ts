import { ref } from 'vue';

export interface SingleModuleResourceStatus {
  /** 衍质源石 */
  originiumRecharge: number;
  /** 嵌晶玉数量 */
  diamond: number;
  /**  基础寻访凭证 */
  ticketgachaStandardSingle: number;
  /** 特许寻访凭证 */
  ticketgachaSpecialSingle: number;
  /** 十连基础寻访凭证 */
  ticketgachaStandardTen: number;
  /** 十连特许寻访凭证 */
  ticketgachaSpecialTen: number;
}

//全部抽卡资源统计
export interface AllGachaResource {
  existing: SingleModuleResourceStatus;
  daily: SingleModuleResourceStatus;
  activity: SingleModuleResourceStatus;
  potential: SingleModuleResourceStatus;
  recharge: SingleModuleResourceStatus;
  other: SingleModuleResourceStatus;
}

export interface GachaResourceStatisticsResult {
  totalPulls: {
    existingResources: number;
    dailyResources: number;
    activityResources: number;
    potentialResources: number;
    rechargeResources: number;
    otherResources: number;
    allResources: number;
  };
  rechargeAmount: number;
  originiumRecharge: number;
  diamond: number;
  ticketgachaStandardSingle: number;
  ticketgachaSpecialSingle: number;
  ticketgachaStandardTen: number;
  ticketgachaSpecialTen: number;
}

export const gachaResourceStatisticsResult = ref<GachaResourceStatisticsResult>({
  totalPulls: {
    existingResources: 0,
    dailyResources: 0,
    activityResources: 0,
    potentialResources: 0,
    rechargeResources: 0,
    otherResources: 0,
    allResources: 0,
  },
  rechargeAmount: 0,
  originiumRecharge: 0,
  diamond: 0,
  ticketgachaStandardSingle: 0,
  ticketgachaSpecialSingle: 0,
  ticketgachaStandardTen: 0,
  ticketgachaSpecialTen: 0,
});

export const allGachaResource = ref<AllGachaResource>({
  existing: {
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    ticketgachaStandardTen: 0,
    ticketgachaSpecialTen: 0,
  },
  daily: {
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    ticketgachaStandardTen: 0,
    ticketgachaSpecialTen: 0,
  },
  activity: {
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    ticketgachaStandardTen: 0,
    ticketgachaSpecialTen: 0,
  },
  potential: {
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    ticketgachaStandardTen: 0,
    ticketgachaSpecialTen: 0,
  },
  recharge: {
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    ticketgachaStandardTen: 0,
    ticketgachaSpecialTen: 0,
  },
  other: {
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    ticketgachaStandardTen: 0,
    ticketgachaSpecialTen: 0,
  },
});

export interface PieChartData {
  value: number;
  name: string;
}
