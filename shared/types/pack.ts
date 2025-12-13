export interface PackContent {
  itemId: string;
  itemName?: string;
  quantity: number;
}

export interface PackData {
  packId: string;
  packDisplayNameZH: string;
  packDisplayNameEN: string;
  descriptionZH?: string;
  descriptionEN?: string;
  price: number;
  imageUrl: string;
  contents: PackContent[];
  startTimestamp?: number;
  endTimestamp?: number;
}

export type Packs = Record<string, PackData>;
