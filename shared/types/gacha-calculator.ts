import { ref } from 'vue';

export interface PieChartData {
  value: number;
  name: string;
}

export type ItemDict = Record<string, string>

export interface CollectReward {
  /** 衍质源石 */
  originiumRecharge: number;
  stage: number;
}


export interface ResourceStatisticsResultDetail {
  name: string;
  /** 衍质源石 */
  originiumRecharge: number;
  /** 嵌晶玉数量 */
  diamond: number;
  /**  基础寻访凭证 */
  ticketgachaStandardSingle: number;
  /** 特许寻访凭证 */
  ticketgachaSpecialSingle: number;
}

export type TotalPull = {
  ticketgachaStandardSingle: number,
  ticketgachaSpecialSingle: number
}


// export type ResourceStatisticsResultDetail =  Record<string,{
//   name:string
//   /** 衍质源石 */
//   originiumRecharge: number;
//   /** 嵌晶玉数量 */
//   diamond: number;
//   /**  基础寻访凭证 */
//   ticketgachaStandardSingle: number;
//   /** 特许寻访凭证 */
//   ticketgachaSpecialSingle: number;
// }>


export interface Reward {
  id: string;
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
  };
}

export interface CurrentVersionRemainingTime {
  day: number;
  week: number;
  month: number;
}



export interface GachaResourceStatisticsResult {
  totalPulls: {
    existing: TotalPull;
    dailyTask: TotalPull;
    activity: TotalPull;
    potential: TotalPull;
    recharge: TotalPull;
    permanent: TotalPull;
    regional:TotalPull;
    total:TotalPull;
  };
  rechargeAmount: number;
  originiumRecharge: number;
  diamond: number;
  ticketgachaStandardSingle: number;
  ticketgachaSpecialSingle: number;
}


