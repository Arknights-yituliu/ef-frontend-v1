import type { VersionTableItem } from '#shared/types/gacha-calculator';

/**
 * 版本信息表（单一数据源）
 *
 * 汇总各版本的时间区间与主题配色，供攒抽计算器、版本奖励表、版本资源作图等页面复用。
 * 新增版本时只需在本数组末尾追加一条记录，无需再维护独立的 JSON 数据文件。
 */
const versionTable: VersionTableItem[] = [
  {
    start: new Date('2026/01/22 12:00:00'),
    end: new Date('2026/03/12 12:00:00'),
    primaryColor: 'rgba(87, 224, 210,  1)',
    colorOpacity: 'rgba(187, 224, 210,  0.3)',

    version: '零号委托',
  },
  {
    start: new Date('2026/03/12 12:00:00'),
    end: new Date('2026/04/17 12:00:00'),
    primaryColor: 'rgba(87, 224, 210,  1)',
    colorOpacity: 'rgba(187, 224, 210,  0.3)',

    version: '新潮起·故渊离',
  },
  {
    start: new Date('2026/04/17 12:00:00'),
    end: new Date('2026/06/05 12:00:00'),
    primaryColor: 'rgba(87, 224, 210,  1)',
    colorOpacity: 'rgba(187, 224, 210,  0.3)',

    version: '春晓时',
  },
  {
    start: new Date('2026/06/05 12:00:00'),
    end: new Date('2026/07/16 12:00:00'),
    primaryColor: 'rgba(193, 56, 89, 1)',
    colorOpacity: 'rgba(193, 56, 89,  0.3)',

    version: '寻遗散记',
  },
  {
    start: new Date('2026/07/16 12:00:00'),
    end: new Date('2026/09/02 12:00:00'),
    primaryColor: 'rgba(106, 141, 150, 1)',
    colorOpacity: 'rgba(106, 141, 150, 0.3)',

    version: '向渊行',
  },
  {
    start: new Date('2026/09/02 12:00:00'),
    end: new Date('2026/10/15 12:00:00'),
    primaryColor: 'rgba(184, 136, 216, 1)',
    colorOpacity: 'rgba(184, 136, 216, 0.3)',

    version: '雪凇幽梦',
  },
  {
    start: new Date('2026/10/15 12:00:00'),
    end: new Date('2026/11/26 12:00:00'),
    // TODO: 待补充「丹青渡」官方主题色，当前暂用默认配色占位
    primaryColor: 'rgba(232, 216, 168, 1)',
    colorOpacity: 'rgba(232, 216, 168, 0.3)',

    version: '丹青渡',
  },
];

export { versionTable };
