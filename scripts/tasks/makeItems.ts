import type { LocalizedText } from '../../shared/types/common';
import { foresightWeaponIds } from '../derived/weaponIds';
import { foresightWeaponTable, itemTable, itemTypeTable } from '../gameData';
import { getLocalizedValue } from '../utils/translation';

export interface Item {
  id: string;
  name: LocalizedText;
  rarity: number;
  type: number;
  typeName: LocalizedText;
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

/** 武器在 ItemTable 中的物品类型 ID */
const WEAPON_ITEM_TYPE = 5;

export function makeItems(): Record<string, Item> {
  const items: Record<string, Item> = Object.fromEntries(
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

  const weaponTypeName = getLocalizedValue(itemTypeTable[String(WEAPON_ITEM_TYPE)]!.name);

  // 前瞻武器：ItemTable 中尚未收录，需要手动补录以便前端展示图标与名称
  for (const weaponId of foresightWeaponIds) {
    if (items[weaponId] !== undefined) {
      continue;
    }
    const foresightWeapon = foresightWeaponTable[weaponId]!;
    items[weaponId] = {
      id: weaponId,
      name: getLocalizedValue(foresightWeapon.name),
      rarity: foresightWeapon.rarity,
      type: WEAPON_ITEM_TYPE,
      typeName: weaponTypeName,
      iconId: foresightWeapon.iconId,
    };
  }

  // 按字典序排序，保证 diff 最小
  return Object.fromEntries(
    Object.keys(items)
      .toSorted()
      .map((itemId) => [itemId, items[itemId]!]),
  );
}
