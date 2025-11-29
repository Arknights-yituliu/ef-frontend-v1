// 礼包数据类型定义


export interface PackValueMetrics {
  stoneEquivalent: number
  pricePerStone: number
  totalPulls: number
  pricePerPull: number
}

export interface ComparisonBar {
  labelZH: string
  labelEN: string
  percentage: number
  widthPx: number
  display?: boolean
}

export interface PackContent {
  name: string
  id: string
  quantity: number
  totalValue: number
  percentage: number
  iconClass: string
}

export interface PackData {
  packDisplayNameZH: string
  packDisplayNameEN: string
  descriptionZH?: string
  descriptionEN?: string
  price: number
  imageUrl: string
  valueMetrics: PackValueMetrics
  comparisonBars: ComparisonBar[]
  contents: PackContent[]
  start: number,
  end: number
}


export interface PackDataDTO {
  packDisplayNameZH: string
  packDisplayNameEN: string
  descriptionZH?: string
  descriptionEN?: string
  price: number
  imageUrl: string
  contents: PackContent[]
  start: number,
  end: number
}

