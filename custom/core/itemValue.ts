import type { ItemValueMap } from '@/shared/types/itemValue';

export const itemValueMap: ItemValueMap = {
  衍质源石: {
    itemId: '衍质源石',
    itemName: '衍质源石',
    value: 40, // 衍质源石的价值根据每日前 2 次源石兑换理智来计算
  },
  嵌晶玉: {
    itemId: '嵌晶玉',
    itemName: '嵌晶玉',
    value: 40 / 75,
  },
  武库配额: {
    itemId: '武库配额',
    itemName: '武库配额',
    value: 112 / 81, // 武库配额的价值根据 非首充 648 元源石礼包 与 128 元武库配额礼包 性价比相同来计算
  },

  // 养成材料
  折金票: {
    itemId: '折金票',
    itemName: '折金票',
    value: 80 / 34000,
  },
  干员作战记录经验: {
    itemId: '干员作战记录经验',
    itemName: '干员作战记录经验',
    value: 80 / 170000,
  },
  初级作战记录: {
    itemId: '初级作战记录',
    itemName: '初级作战记录',
    value: (80 / 170000) * 200,
  },
  中级作战记录: {
    itemId: '中级作战记录',
    itemName: '中级作战记录',
    value: (80 / 170000) * 1000,
  },
  高级作战记录: {
    itemId: '高级作战记录',
    itemName: '高级作战记录',
    value: (80 / 170000) * 10000,
  },
  干员认知载体经验: {
    itemId: '干员认知载体经验',
    itemName: '干员认知载体经验',
    value: 80 / 68000,
  },
  初级认知载体: {
    itemId: '初级认知载体',
    itemName: '初级认知载体',
    value: (80 / 68000) * 1000,
  },
  高级认知载体: {
    itemId: '高级认知载体',
    itemName: '高级认知载体',
    value: (80 / 68000) * 10000,
  },
  协议圆盘: {
    itemId: '协议圆盘',
    itemName: '协议圆盘',
    value: 80 / 34,
  },
  协议圆盘组: {
    itemId: '协议圆盘组',
    itemName: '协议圆盘组',
    value: 80 / 14,
  },
  武器经验: {
    itemId: '武器经验',
    itemName: '武器经验',
    value: 80 / 170000,
  },
  武器检查单元: {
    itemId: '武器检查单元',
    itemName: '武器检查单元',
    value: (80 / 170000) * 200,
  },
  武器检查装置: {
    itemId: '武器检查装置',
    itemName: '武器检查装置',
    value: (80 / 170000) * 1000,
  },
  武器检查套组: {
    itemId: '武器检查套组',
    itemName: '武器检查套组',
    value: (80 / 170000) * 10000,
  },
  强固模具: {
    itemId: '强固模具',
    itemName: '强固模具',
    value: 80 / 34,
  },
  重型强固模具: {
    itemId: '重型强固模具',
    itemName: '重型强固模具',
    value: 80 / 14,
  },
  协议棱柱: {
    itemId: '协议棱柱',
    itemName: '协议棱柱',
    value: 80 / 85,
  },
  协议棱柱组: {
    itemId: '协议棱柱组',
    itemName: '协议棱柱组',
    value: 80 / 17,
  },

  // 高阶培养素材
  超距辉映管: {
    itemId: '超距辉映管',
    itemName: '超距辉映管',
    value: 80 / 6.5, // 估测每次作战掉落 6.5 个
  },
  D96钢样品四: {
    itemId: 'D96钢样品四',
    itemName: 'D96钢样品四',
    value: 80 / 6.5,
  },
  快子遴捡晶格: {
    itemId: '快子遴捡晶格',
    itemName: '快子遴捡晶格',
    value: 80 / 6.5,
  },
  象限拟合液: {
    itemId: '象限拟合液',
    itemName: '象限拟合液',
    value: 80 / 6.5,
  },
  三相纳米片: {
    itemId: '三相纳米片',
    itemName: '三相纳米片',
    value: 80 / 6.5,
  },

  // 存续的痕迹
  存续的痕迹: {
    itemId: '存续的痕迹',
    itemName: '存续的痕迹',
    value: 800 / 3, // 存续的痕迹的价值根据保障凭证购买存续的痕迹与购买特需寻访凭证的性价比相同来计算
  },

  // 武器基质
  无暇基质: {
    itemId: '无暇基质',
    itemName: '无暇基质',
    value: 80 / 4, // 估测每次作战掉落 4 个
  },

  // 寻访凭证
  基础寻访凭证: {
    itemId: '基础寻访凭证',
    itemName: '基础寻访凭证',
    value: (40 / 75) * 500,
  },
  特许寻访凭证: {
    itemId: '特许寻访凭证',
    itemName: '特许寻访凭证',
    value: (40 / 75) * 500,
  },
  行火留烬寻访凭证: {
    itemId: '行火留烬寻访凭证',
    itemName: '行火留烬寻访凭证',
    value: (40 / 75) * 500,
  },
  行火留烬十连凭证: {
    itemId: '行火留烬十连凭证',
    itemName: '行火留烬十连凭证',
    value: (40 / 75) * 500 * 10,
  },

  // 理智物品
  应急理智加强剂: {
    itemId: '应急理智加强剂',
    itemName: '应急理智加强剂',
    value: 40,
  },
  海盐冰淇淋: {
    itemId: '海盐冰淇淋',
    itemName: '海盐冰淇淋',
    value: 40,
  },
  草莓可丽饼: {
    itemId: '草莓可丽饼',
    itemName: '草莓可丽饼',
    value: 40,
  },
  栗花蜜: {
    itemId: '栗花蜜',
    itemName: '栗花蜜',
    value: 40,
  },

  // 物资箱
  高阶培养自选箱I: {
    itemId: '高阶培养自选箱I',
    itemName: '高阶培养自选箱I',
    value: (80 / 6.5) * 2,
  },
  多用经验自选箱: {
    itemId: '多用经验自选箱',
    itemName: '多用经验自选箱',
    value: 400 / 17,
  },
  多用进阶自选箱: {
    itemId: '多用进阶自选箱',
    itemName: '多用进阶自选箱',
    value: 400 / 17,
  },
  技能提升自选箱: {
    itemId: '技能提升自选箱',
    itemName: '技能提升自选箱',
    value: 400 / 17,
  },
};
