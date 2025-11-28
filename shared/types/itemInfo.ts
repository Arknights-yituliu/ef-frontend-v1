export interface ItemInfo {
  id: string;
  name: string;
  value: number;
  pulls?: number;
}

export interface ItemInfoMap {
  [key: string]: ItemInfo;
}
