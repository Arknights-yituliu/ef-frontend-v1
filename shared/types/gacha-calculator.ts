

export interface SingleModuleResourceStatus {
  /** 衍质源石 */
  originiumRecharge: number;
  /** 嵌晶玉数量 */
  diamond: number;
  /** 	基础寻访凭证 */
  ticketgachaStandardSingle: number;
  /** 特许寻访凭证 */
  ticketgachaSpecialSingle: number;
  /** 十连基础寻访凭证 */
  ticketgachaStandardTen: number;
  /** 十连特许寻访凭证 */
  ticketgachaSpecialTen: number;
  /** 抽卡资源总量（所有资源换算后的总抽数） */
  totalGachaResources: number;
}

//全部抽卡资源统计
export interface AllGachaResourceStatus {
  existing: SingleModuleResourceStatus;
  daily: SingleModuleResourceStatus;
  activity: SingleModuleResourceStatus;
  potential: SingleModuleResourceStatus;
  whale: SingleModuleResourceStatus;
  other: SingleModuleResourceStatus;
  originiumRecharge: number;
  diamond: number;
  ticketgachaStandardSingle: number;
  ticketgachaSpecialSingle: number;
  ticketgachaStandardTen: number;
  ticketgachaSpecialTen: number;
  totalGachaResources: number;
  whaleAmount: number;
}

export const allGachaResourceStatus: AllGachaResourceStatus = {
  existing: {
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    ticketgachaStandardTen: 0,
    ticketgachaSpecialTen: 0,
    totalGachaResources: 0,
  },
  daily: {
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    ticketgachaStandardTen: 0,
    ticketgachaSpecialTen: 0,
    totalGachaResources: 0,
  },
  activity: {
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    ticketgachaStandardTen: 0,
    ticketgachaSpecialTen: 0,
    totalGachaResources: 0,
  },
  potential: {
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    ticketgachaStandardTen: 0,
    ticketgachaSpecialTen: 0,
    totalGachaResources: 0,
  },
  whale: {
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    ticketgachaStandardTen: 0,
    ticketgachaSpecialTen: 0,
    totalGachaResources: 0,
  },
  other: {
    originiumRecharge: 0,
    diamond: 0,
    ticketgachaStandardSingle: 0,
    ticketgachaSpecialSingle: 0,
    ticketgachaStandardTen: 0,
    ticketgachaSpecialTen: 0,
    totalGachaResources: 0,
  },
  originiumRecharge: 0,
  diamond: 0,
  ticketgachaStandardSingle: 0,
  ticketgachaSpecialSingle: 0,
  ticketgachaStandardTen: 0,
  ticketgachaSpecialTen: 0,
  totalGachaResources: 0,
  whaleAmount: 0,
};

export interface PieChartData {
  value: number;
  name: string;
}
