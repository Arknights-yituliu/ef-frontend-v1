// 单模块抽卡统计
export interface SingleModuleResourceStatus  {
  "衍质源石": number,
  "嵌晶玉": number,
  "基础寻访凭证": number,
  "特许寻访凭证": number,
  "行火留烬寻访凭证": number,
  "行火留烬十连凭证": number,
  totalGachaResources: number
}

//全部抽卡资源统计
export interface AllGachaResourceStatus  {
  existing :SingleModuleResourceStatus
  daily: SingleModuleResourceStatus,
  activity: SingleModuleResourceStatus,
  potential: SingleModuleResourceStatus,
  whale: SingleModuleResourceStatus,
  other: SingleModuleResourceStatus,
  "衍质源石": number,
  "嵌晶玉": number,
  "基础寻访凭证": number,
  "特许寻访凭证": number,
  "行火留烬寻访凭证": number,
  "行火留烬十连凭证": number,
  totalGachaResources: number,
  whaleAmount: number
}

export const allGachaResourceStatus: AllGachaResourceStatus = {
  existing: {
    "衍质源石": 0,
    "嵌晶玉": 0,
    "基础寻访凭证": 0,
    "特许寻访凭证": 0,
    "行火留烬寻访凭证": 0,
    "行火留烬十连凭证": 0,
    totalGachaResources: 0
  },
  daily: {
    "衍质源石": 0,
    "嵌晶玉": 0,
    "基础寻访凭证": 0,
    "特许寻访凭证": 0,
    "行火留烬寻访凭证": 0,
    "行火留烬十连凭证": 0,
    totalGachaResources: 0
  },
  activity: {
    "衍质源石": 0,
    "嵌晶玉": 0,
    "基础寻访凭证": 0,
    "特许寻访凭证": 0,
    "行火留烬寻访凭证": 0,
    "行火留烬十连凭证": 0,
    totalGachaResources: 0
  },
  potential: {
    "衍质源石": 0,
    "嵌晶玉": 0,
    "基础寻访凭证": 0,
    "特许寻访凭证": 0,
    "行火留烬寻访凭证": 0,
    "行火留烬十连凭证": 0,
    totalGachaResources: 0
  },
  whale: {
    "衍质源石": 0,
    "嵌晶玉": 0,
    "基础寻访凭证": 0,
    "特许寻访凭证": 0,
    "行火留烬寻访凭证": 0,
    "行火留烬十连凭证": 0,
    totalGachaResources: 0
  },
  other: {
    "衍质源石": 0,
    "嵌晶玉": 0,
    "基础寻访凭证": 0,
    "特许寻访凭证": 0,
    "行火留烬寻访凭证": 0,
    "行火留烬十连凭证": 0,
    totalGachaResources: 0
  },
  "衍质源石": 0,
  "嵌晶玉": 0,
  "基础寻访凭证": 0,
  "特许寻访凭证": 0,
  "行火留烬寻访凭证": 0,
  "行火留烬十连凭证": 0,
  totalGachaResources: 0,
  whaleAmount: 0
}

export interface PieChartData {
  value: number;
  name: string;
}
