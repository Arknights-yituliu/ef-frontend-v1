

export interface PieChartData {
  value: number;
  name: string;
}

export type ItemDict = Record<string, string>

export type CollectReward  = {
  originiumRecharge:number;
  stage: number;
  version: string;
}



export type RewardStatisticsResultDetail ={
  name: string;
  /** 衍质源石 */
  originiumRecharge: number;
  /** 嵌晶玉数量 */
  diamond: number;
  /**  基础寻访凭证 */
  ticketgachaStandardSingle: number;
  /** 特许寻访凭证 */
  ticketgachaSpecialSingle: number;
  /** 限时寻访凭证 */
  ticketgachaLimitedSingle: number;
  totalPulls?: number;
}

export interface TotalPullsSingle {
  /** 基础寻访凭证 */
  ticketgachaStandardSingle: number;
  /** 特许寻访凭证 */
  ticketgachaSpecialSingle: number;
  /** 限时寻访凭证 */
  ticketgachaLimitedSingle: number;
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
  start: string|Date;
  end: string|Date;
  type: string;
  module: string;
  regional?:string;
  active: boolean;
  version:string;
  content: RewardContent;
  tips?:string[];
}

export interface RewardContent{
  /** 衍质源石 */
  originiumRecharge: number;
  /** 嵌晶玉数量 */
  diamond: number;
  /**  基础寻访凭证 */
  ticketgachaStandardSingle: number;
  /** 特许寻访凭证 */
  ticketgachaSpecialSingle: number;

  ticketgachaLimitedSingle: number;
}

export interface CurrentVersionRemainingTime {
  day: number;
  week: number;
  month: number;
}

export type TotalPulls = Record<string,TotalPullsSingle>

export interface GachaResourceStatisticsResult {
  totalPulls: TotalPulls;
  rechargeAmount: number;
  originiumRecharge: number;
  diamond: number;
  ticketgachaStandardSingle: number;
  ticketgachaSpecialSingle: number;
  ticketgachaLimitedSingle: number;
}

export interface GachaCalculatorUserConfig {
  existingResource: {
    [key: string]: number;
  };
  buttonActive: {
    [key: string]: boolean;
  };
  buttonGroupActive: {
    [key: string]: boolean;
  };
  rangeSlider: {
    [key: string]: number[];
  };
  slider: {
    [key: string]: number;
  };
}

export type ModuleSelectedStatus = {
  [key: string]:{
    [key: string]:boolean
  }
}

export type PoolOption = {
  name:string,
  start: Date,
  end: Date,
  color:string,
  dateText:string,
  type:string,
  disabled: boolean
}
