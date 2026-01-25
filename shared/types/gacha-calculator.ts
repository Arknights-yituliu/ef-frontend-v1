import { ref } from 'vue';

export interface PieChartData {
  value: number;
  name: string;
}

export type ItemDict = Record<string, string>

export type CollectReward  = Record<string, number>



export type ResourceStatisticsResultDetail ={
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

export type TotalPullsSingle = Record<string, number>


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

export type TotalPulls = Record<string,TotalPullsSingle>

export interface GachaResourceStatisticsResult {
  totalPulls: TotalPulls;
  rechargeAmount: number;
  originiumRecharge: number;
  diamond: number;
  ticketgachaStandardSingle: number;
  ticketgachaSpecialSingle: number;
}

export interface GachaCalculatorUserConfig  {
  existingResource: {
    [key: string]:number
  },
  buttonActive:{
    [key:string]:boolean
  },
  buttonGroupActive:{
    [key:string]:boolean
  }
  rangeSlider:{
    [key:string]:number[]
  }
  slider:{
    [key:string]:number
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
