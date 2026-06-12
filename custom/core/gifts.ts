import rawGifts from '@/custom/core/giftDatabase.json';

export interface GiftCategoryTag extends Record<string, string[]> {}
export interface GiftTag extends Record<string, string> {}
export interface OpName extends Record<string, string> {}

export interface Gift {
  id: string;
  rarity: number;
  isHot: boolean;
  isHotExpiring: boolean;
  favorCategory: string;
  favorHobby: string[];
}

export interface Operator {
  id: string;
  name: Record<string, string>;
  rarity: number;
  favorCategory: string[];
  favorHobby: string[];
}

export const gifts: {
  giftProps: {
    category: { [category: string]: GiftCategoryTag };
    hobby: { [hobby: string]: GiftTag };
  },
  gift: { [id: string]: Gift };
  operator: { [id: string]: Operator };
  gameVersion: {
    code: string;
    name: { [lang: string]: string };
    period?: { [lang: string]: string };
    color: string[];
    textColor: string;
  },
} = rawGifts;

export function getCategoryIcon(categoryId: string | undefined): string {
  return `https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/ship/${categoryId}.png`;
}

export function getOperatorIcon(opId: string): string {
  return `https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/dynamicassets/gameplay/ui/sprites/charicon/icon_${opId}.webp`;
}

export const hotIcon = `https://cos.yituliu.cn/endfield/endfielddata/assets/beyond/arts/ui/sprites/common/icon_common_hot.png`;