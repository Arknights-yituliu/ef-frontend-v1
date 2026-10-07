export interface PieChartData {
  value: number;
  name: string;
}

/**
 * 版本表条目类型
 */
export interface VersionTableItem {
  /** 版本开始日期 */
  start: Date;
  /** 版本结束日期 */
  end: Date;
  /** 主题色（rgba 格式） */
  primaryColor: string;
  /** 主题色半透明版（rgba 格式，用于渐变等场景） */
  colorOpacity: string;
  /** 重颜色（rgba 格式，比主题色更深的版本） */
  heavyColor: string;
  /** 版本名称 */
  version: string;
}

export type ItemDict = Record<string, string>;

export type CollectReward = {
  originiumRecharge: number;
  stage: number;
  version: string;
};

export type RewardStatisticsResultDetail = {
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
};

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
  start: string | Date;
  end: string | Date;
  gachaRewardDays?: number;
  type: string;
  module: string;
  regional?: string;
  active: boolean;
  version: string;
  content: RewardContent;
  tips?: string[];
}

export interface RewardContent {
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

export type TotalPulls = Record<string, TotalPullsSingle>;

export interface GachaResourceStatisticsResult {
  totalPulls: TotalPulls;
  rechargeAmount: number;
  originiumRecharge: number;
  diamond: number;
  ticketgachaStandardSingle: number;
  ticketgachaSpecialSingle: number;
  ticketgachaLimitedSingle: number;
}

export type GachaCalculatorRechargeResources = {
  monthlyPass: boolean;
  battlePass: boolean;
  protocolCustomization: boolean;
  monthlyPassDays: number;
  selectedPacks: Record<string, number>;
  selectedPoolPacks: Record<string, Record<string, number>>;
  originiumStones: Record<string, number>;
};

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
  versionVisible?: {
    [key: string]: boolean;
  };
  arsenalExistingQuota?: number;
  arsenalOriginiumAllocation?: number;
  currentPoolName?: string;
  displayPoolOptions?: string[];
  leftPartPanel?: string[];
  rechargeResources?: GachaCalculatorRechargeResources;
  rightPartPanel?: string[];
}

export type ModuleSelectedStatus = {
  [key: string]: {
    [key: string]: boolean;
  };
};

export type PoolMember = {
  poolName: string;
  character: string;
  packId?: string;
};

export type PoolOption = {
  name: string;
  start: Date;
  end: Date;
  dateText: string;
  type: string;
  poolMembers: PoolMember[];
  disabled: boolean;
};

/**
 * 卡池排期表（pool_info_table.json）中的单条记录结构
 * 每条记录直接对应攒抽计算器中的一个卡池选项
 */
export type PoolSchedule = {
  /** 卡池名称 */
  poolName: string;
  /** 卡池角色名 */
  character: string;
  /** 卡池开始时间 */
  poolStart: string;
  /** 卡池结束时间 */
  poolEnd: string;
  /** 卡池日期字符串 */
  poolDateStr: string;
  /** 所属版本开始时间 */
  versionStart: string;
  /** 所属版本结束时间 */
  versionEnd: string;
  /** 所属版本名称 */
  version: string;
  /** 是否生成作战演练奖励 */
  combatDrills?: boolean;
  /** 是否生成干员叙事奖励 */
  narrative?: boolean;
  /** 合池所引用的子卡池名称列表，未配置时该选项仅包含自身 */
  poolMembers?: string[];
  /** 卡池专属礼包 ID */
  poolPackId?: string;
  /** 生成动态奖励时是否跳过该条记录（合池等仅用于生成选项的记录） */
  skipReward?: boolean;
};
