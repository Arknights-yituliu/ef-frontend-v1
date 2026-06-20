import type { ItemValueMap } from '@/shared/types/itemValue';
import rawApItems from '@/custom/core/apItems.json';

// 本文件的 itemName 字段仅作为备注使用，请勿依赖其值进行逻辑处理

export const itemValueMap: ItemValueMap = {
  // 从 apItems.json 注入理智药价值
  ...Object.fromEntries(
    Object.entries(rawApItems).map(([key, item]) => [
      key,
      { itemId: item.id, value: item.apRecoverValue },
    ]),
  ),

  // 氪金资源
  item_originium_recharge: {
    itemId: 'item_originium_recharge',
    itemName: '衍质源石',
    value: 40, // 衍质源石的价值根据每日前 2 次源石兑换理智来计算
  },
  item_diamond: {
    itemId: 'item_diamond',
    itemName: '嵌晶玉',
    value: 40 / 75,
  },
  item_gachabyproducts_weapongold: {
    itemId: 'item_gachabyproducts_weapongold',
    itemName: '武库配额',
    value: 40 / 25, // 武库配额的价值根据 非首充 648 元源石礼包兑换武库配额计算
  },

  // 养成材料
  item_gold: {
    itemId: 'item_gold',
    itemName: '折金票',
    value: 80 / 34_000,
  },
  干员作战记录经验: {
    itemId: '干员作战记录经验',
    itemName: '干员作战记录经验',
    value: 80 / 170_000,
  },
  item_expcard_stage1_low: {
    itemId: 'item_expcard_stage1_low',
    itemName: '初级作战记录',
    value: (80 / 170_000) * 200,
  },
  item_expcard_stage1_mid: {
    itemId: 'item_expcard_stage1_mid',
    itemName: '中级作战记录',
    value: (80 / 170_000) * 1000,
  },
  item_expcard_stage1_high: {
    itemId: 'item_expcard_stage1_high',
    itemName: '高级作战记录',
    value: (80 / 170_000) * 10_000,
  },
  干员认知载体经验: {
    itemId: '干员认知载体经验',
    itemName: '干员认知载体经验',
    value: 80 / 68_000,
  },
  item_expcard_stage2_low: {
    itemId: 'item_expcard_stage2_low',
    itemName: '初级认知载体',
    value: (80 / 68_000) * 1000,
  },
  item_expcard_stage2_high: {
    itemId: 'item_expcard_stage2_high',
    itemName: '高级认知载体',
    value: (80 / 68_000) * 10_000,
  },
  item_char_break_stage_1_2: {
    itemId: 'item_char_break_stage_1_2',
    itemName: '协议圆盘',
    value: 80 / 34,
  },
  item_char_break_stage_3_4: {
    itemId: 'item_char_break_stage_3_4',
    itemName: '协议圆盘组',
    value: 80 / 14,
  },
  武器经验: {
    itemId: '武器经验',
    itemName: '武器经验',
    value: 80 / 170_000,
  },
  item_weapon_expcard_low: {
    itemId: 'item_weapon_expcard_low',
    itemName: '武器检查单元',
    value: (80 / 170_000) * 200,
  },
  item_weapon_expcard_mid: {
    itemId: 'item_weapon_expcard_mid',
    itemName: '武器检查装置',
    value: (80 / 170_000) * 1000,
  },
  item_weapon_expcard_high: {
    itemId: 'item_weapon_expcard_high',
    itemName: '武器检查套组',
    value: (80 / 170_000) * 10_000,
  },
  item_weapon_break_low: {
    itemId: 'item_weapon_break_low',
    itemName: '强固模具',
    value: 80 / 34,
  },
  item_weapon_break_high: {
    itemId: 'item_weapon_break_high',
    itemName: '重型强固模具',
    value: 80 / 14,
  },
  item_char_skill_level_1_6: {
    itemId: 'item_char_skill_level_1_6',
    itemName: '协议棱柱',
    value: 80 / 85,
  },
  item_char_skill_level_7_12: {
    itemId: 'item_char_skill_level_7_12',
    itemName: '协议棱柱组',
    value: 80 / 17,
  },

  // 高阶培养素材
  item_char_skill_specialize_1: {
    itemId: 'item_char_skill_specialize_1',
    itemName: '超距辉映管',
    value: 80 / 6.8, // 估测每次作战掉落 6.8 个
  },
  item_char_skill_specialize_2: {
    itemId: 'item_char_skill_specialize_2',
    itemName: 'D96钢样品四',
    value: 80 / 6.8,
  },
  item_char_skill_specialize_3: {
    itemId: 'item_char_skill_specialize_3',
    itemName: '快子遴捡晶格',
    value: 80 / 6.8,
  },
  item_char_skill_specialize_4: {
    itemId: 'item_char_skill_specialize_4',
    itemName: '象限拟合液',
    value: 80 / 6.8,
  },
  item_char_skill_specialize_5: {
    itemId: 'item_char_skill_specialize_5',
    itemName: '三相纳米片',
    value: 80 / 6.8,
  },

  // 存续的痕迹
  item_char_skill_crown: {
    itemId: 'item_char_skill_crown',
    itemName: '存续的痕迹',
    value: 800 / 3, // 存续的痕迹的价值根据保障凭证购买存续的痕迹与购买特需寻访凭证的性价比相同来计算
  },

  // 武器基质
  wpn_sword_0021: {
    itemId: 'wpn_sword_0021',
    itemName: '宏愿',
    value: (112 / 81) * 2480, // 宏愿的价值等于 2480 武器配额
  },
  item_gem_rarity_5: {
    itemId: 'item_gem_rarity_5',
    itemName: '无瑕基质',
    value: 80 / 3,
  },
  item_wpngem_enhance_dust: {
    itemId: 'item_wpngem_enhance_dust',
    itemName: '冷却脂',
    value: 80 / 3 / 22, // 按每个基质等于 22 冷却脂来计算
  },

  // 寻访凭证
  item_ticketgacha_standard_single: {
    itemId: 'item_ticketgacha_standard_single',
    itemName: '基础寻访凭证',
    value: (40 / 75) * 500,
  },
  item_ticketgacha_special_single: {
    itemId: 'item_ticketgacha_special_single',
    itemName: '特许寻访凭证',
    value: (40 / 75) * 500,
  },
  item_ticketgacha_special_single_lt_1_0_1: {
    itemId: 'item_ticketgacha_special_single_lt_1_0_1',
    itemName: '行火留烬寻访凭证',
    value: (40 / 75) * 500,
  },
  ticketgacha_special_single_lt_1_0_1: {
    itemId: 'ticketgacha_special_single_lt_1_0_1',
    itemName: '行火留烬寻访凭证',
    value: (40 / 75) * 500,
  },
  item_ticketgacha_special_ten_lt_1_0_1: {
    itemId: 'item_ticketgacha_special_ten_lt_1_0_1',
    itemName: '行火留烬十连凭证',
    value: (40 / 75) * 500 * 10,
  },
  ticketgacha_special_ten_lt_1_0_1: {
    itemId: 'ticketgacha_special_ten_lt_1_0_1',
    itemName: '行火留烬十连凭证',
    value: (40 / 75) * 500 * 10,
  },

  // 物资箱
  item_case_bp_selfselect_skillsp_1: {
    itemId: 'item_case_bp_selfselect_skillsp_1',
    itemName: '高阶培养自选箱Ⅰ',
    value: (80 / 6.8) * 2,
  },
  item_case_bp_selfselect_exp: {
    itemId: 'item_case_bp_selfselect_exp',
    itemName: '多用经验自选箱',
    value: 400 / 17,
  },
  item_case_bp_selfselect_break: {
    itemId: 'item_case_bp_selfselect_break',
    itemName: '多用进阶自选箱',
    value: 400 / 17,
  },
  item_case_bp_selfselect_skill: {
    itemId: 'item_case_bp_selfselect_skill',
    itemName: '技能提升自选箱',
    value: 400 / 17,
  },
};
