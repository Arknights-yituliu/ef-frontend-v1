export interface GachaItem {
  id: string;
  name: string;
  pulls: number;
}

export interface GachaItemMap {
  [key: string]: GachaItem;
}
