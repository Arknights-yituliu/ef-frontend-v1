// 礼包数据类型定义

export interface PackContent {
  itemId: string;
  itemName?: string;
  quantity: number;
}

export interface PackData {
  packDisplayNameZH: string;
  packDisplayNameEN: string;
  price: number;
  imageUrl: string;
  countdownDays?: number;
  countdownZH?: string;
  countdownEN?: string;
  contents: PackContent[];
}
