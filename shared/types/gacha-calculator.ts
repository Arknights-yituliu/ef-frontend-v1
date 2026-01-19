import { ref } from 'vue';

export interface PieChartData {
  value: number;
  name: string;
}

export type ItemDict = Record<string,string>



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

export interface Reward {
  id: number;
  name: {
    en: string;
    zh: string;
  };
  start: string;
  end: string;
  type: string;
  module: string;
  active: boolean;
  content: {
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
  };
}

export interface CurrentVersionRemainingTime {
  day: number;
  week: number;
  month: number;
}

//全部抽卡资源统计
export interface AllGachaResource {
  existing: SingleModuleResourceStatus;
  daily: SingleModuleResourceStatus;
  task: SingleModuleResourceStatus;
  activity: SingleModuleResourceStatus;
  permanent: SingleModuleResourceStatus;
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


