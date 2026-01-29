export interface TranslationKey {
  id: string | number; // 在解包数据中是 64 位有符号整数，解析时转换为 string 避免精度丢失
  text: string;
}

export interface Item {
  backpackCanDiscard: boolean;
  decoDesc: TranslationKey;
  desc: TranslationKey;
  iconCompositeId: string;
  iconId: string;
  id: string;
  maxBackpackStackCount: number;
  maxStackCount: number;
  modelKey: string;
  name: TranslationKey;
  noObtainWayConditionId: string[];
  noObtainWayHint: TranslationKey;
  noObtainWayId: string[];
  obtainWayIds: string[];
  outcomeItemIds: string[];
  rarity: number;
  showAllDepotCount: boolean;
  showingType: number;
  sortId1: number;
  sortId2: number;
  type: number;
  valuableTabType: number;
}

export interface ItemType {
  barkWhenGot: boolean;
  bgType: number;
  hideItemInBagToast: boolean;
  hideNewToast: boolean;
  itemType: number;
  name: TranslationKey;
  showCount: boolean;
  showCountInTips: boolean;
  storageSpace: number;
  unlockSystemType: number;
  valuableTabType: number;
}

export type ItemTable = Record<string, Item>;
export type ItemListByTypeTable = Record<string, { list: string[] }>;
export type I18nTextTable = Record<string, string>;
export type ItemTypeTable = Record<string, ItemType>;
