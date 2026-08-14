// custom/core/gacha-pool-info.ts

// 定义卡池数据的接口
interface GachaPool {
  poolId: string;
  poolName: string;
  upCharName: string;
}

// 卡池列表
const gachaPools: GachaPool[] = [
  {
    poolId: 'special_1_0_1',
    poolName: '熔火灼痕',
    upCharName: '莱万汀',
  },
  {
    poolId: 'weponbox_1_0_1',
    poolName: '熔铸申领',
    upCharName: '熔铸火焰',
  },

  {
    poolId: 'special_1_0_2',
    poolName: '热烈色彩',
    upCharName: '伊冯',
  },
  {
    poolId: 'weponbox_1_0_2',
    poolName: '绘涂申领',
    upCharName: '艺术暴君',
  },

  {
    poolId: 'special_1_0_3',
    poolName: '轻飘飘的信使',
    upCharName: '洁尔佩塔',
  },
  {
    poolId: 'weponbox_1_0_3',
    poolName: '迅行申领',
    upCharName: '使命必达',
  },
  {
    poolId: 'special_1_1_1',
    poolName: '河流的女儿',
    upCharName: '汤汤',
  },
  {
    poolId: 'weponbox_1_1_1',
    poolName: '新芽申领',
    upCharName: '落草',
  },
  {
    poolId: 'special_1_1_2',
    poolName: '狼珀',
    upCharName: '洛茜',
  },
  {
    poolId: 'weponbox_1_1_2',
    poolName: '绯珀申领',
    upCharName: '狼之绯',
  },
  {
    poolId: 'special_1_2_1',
    poolName: '春雷动，万物生',
    upCharName: '庄方宜',
  },
  {
    poolId: 'weponbox_1_2_1',
    poolName: '行舟申领',
    upCharName: '孤舟',
  },
  {
    poolId: 'special_1_3_1',
    poolName: '拳出无悔',
    upCharName: '弭弗',
  },
  {
    poolId: 'weponbox_1_3_1',
    poolName: '绛结申领',
    upCharName: '赤缨',
  },
  {
    poolId: 'special_1_3_2',
    poolName: '逐罪者',
    upCharName: '卡缪',
  },
  {
    poolId: 'weponbox_1_3_2',
    poolName: '染赤申领',
    upCharName: '镀红祝福',
  },
  {
    poolId: 'special_1_4_1',
    poolName: '临渊望北',
    upCharName: '诀',
  },
  {
    poolId: 'weponbox_1_4_1',
    poolName: '军列申领',
    upCharName: '四二式·肃阵',
  },
    {
    poolId: 'special_1_4_2',
    poolName: '晨星于此闪耀',
    upCharName: '梨诺',
  },
  {
    poolId: 'weponbox_1_4_2',
    poolName: '星曜申领',
    upCharName: '曜夜的首演',
  },
];
// 卡池命名逻辑 special_「大版本号」_「小版本号」_「第n个卡池」
export { gachaPools };
