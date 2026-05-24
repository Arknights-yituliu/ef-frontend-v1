export interface PackContent {
  itemId: string;
  itemName?: string;
  quantity: number;
}

export type PackCategory =
  | 'seasonal'
  | 'newbie'
  | 'monthly'
  | 'weekly'
  | 'weapon'
  | 'monthly_card'
  | 'bp'
  | 'originium';

export interface PackData {
  packId: string;
  packDisplayNameZH: string;
  packDisplayNameEN: string;
  category: PackCategory;
  descriptionZH?: string;
  descriptionEN?: string;
  price: number;
  imageUrl: string;
  contents: PackContent[];
  startTimestamp?: number;
  endTimestamp?: number;
}

export type Packs = Record<string, PackData>;
