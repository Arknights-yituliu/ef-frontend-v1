export interface PackContent {
  itemId: string;
  itemName?: string;
  quantity: number;
}

export type PackCategory = string;

export interface PackData {
  packId: string;
  packDisplayNameZH: string;
  packDisplayNameEN: string;
  category: PackCategory; // 这里存储 cashShopId (二级分类)
  descriptionZH?: string;
  descriptionEN?: string;
  price: number;
  imageUrl: string;
  contents: PackContent[];
  startTimestamp?: number;
  endTimestamp?: number;
}

export interface PackShopData {
  shopId: string;
  shopNameZH: string;
  shopNameEN: string;
  goodsIds: string[];
}

export interface PackGroupData {
  groupId: string;
  groupNameZH: string;
  groupNameEN: string;
  shopIds: string[];
}

export type Packs = Record<string, PackData>;
export type PackShops = Record<string, PackShopData>;
export type PackGroups = Record<string, PackGroupData>;
