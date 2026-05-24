import { getLocalizedValue, itemTable, itemTypeTable } from './gameData';

export interface Item {
  id: string;
  name: Record<string, string>;
  rarity: number;
  type: number;
  typeName: Record<string, string>;
  iconId: string;

  // backpackCanDiscard: boolean;
  // decoDesc: Record<string, string>;
  // desc: Record<string, string>;
  // iconCompositeId: string;
  // maxBackpackStackCount: number;
  // maxStackCount: number;
  // modelKey: string;
  // noObtainWayHint: Record<string, string>;
  // showAllDepotCount: boolean;
  // showingType: number;
  // sortId1: number;
  // sortId2: number;
  // valuableTabType: number;
}

export function makeItems(): Record<string, Item> {
  return Object.fromEntries(
    Object.keys(itemTable)
      .toSorted() // 按字典序排序，保证 diff 最小
      .map((itemId) => {
        const itemData = itemTable[itemId]!;
        return [
          itemId,
          {
            id: itemId,
            name: getLocalizedValue(itemData.name),
            rarity: itemData.rarity,
            type: itemData.type,
            typeName: getLocalizedValue(itemTypeTable[String(itemData.type)]!.name),
            iconId: itemData.iconId,

            // backpackCanDiscard: itemData.backpackCanDiscard,
            // decoDesc: getLocalizedValue(itemData.decoDesc),
            // desc: getLocalizedValue(itemData.desc),
            // iconCompositeId: itemData.iconCompositeId,
            // maxBackpackStackCount: itemData.maxBackpackStackCount,
            // maxStackCount: itemData.maxStackCount,
            // modelKey: itemData.modelKey,
            // noObtainWayHint: getLocalizedValue(itemData.noObtainWayHint),
            // showAllDepotCount: itemData.showAllDepotCount,
            // showingType: itemData.showingType,
            // sortId1: itemData.sortId1,
            // sortId2: itemData.sortId2,
            // valuableTabType: itemData.valuableTabType,
            // iconUrl: `~/assets/images/items/${itemName}.png`,
          },
        ];
      }),
  );
}
