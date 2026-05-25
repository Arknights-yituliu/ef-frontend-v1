export interface LocalizedText {
  'zh-CN': string;
  'en-US': string;
}

export interface PackContent {
  itemId: string;
  name: LocalizedText;
  quantity: number;
}

export type PackCategory = string;

export interface PackData {
  packId: string;
  displayName: LocalizedText;
  category: PackCategory; // 这里存储 cashShopId (二级分类)
  description?: LocalizedText;
  price: number;
  imageUrl: string;
  backgroundImageUrl?: string;
  contents: PackContent[];
  startTimestamp?: number;
  endTimestamp?: number;
}

export interface PackShopData {
  shopId: string;
  displayName: LocalizedText;
  goodsIds: string[];
}

export interface PackGroupData {
  groupId: string;
  displayName: LocalizedText;
  shopIds: string[];
}

export type Packs = Record<string, PackData>;
export type PackShops = Record<string, PackShopData>;
export type PackGroups = Record<string, PackGroupData>;
