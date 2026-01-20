/**
 * 首页卡片链接配置
 */
export interface CardLink {
  i18nKey: string;
  href: string;
}

/**
 * 标签类型枚举
 */
export enum CardTagType {
  /** 官方 - 黄色 */
  Official = 'official',
  /** 一图流 - 青色 */
  YiTuLiu = 'yituliu',
  /** 第三方 - 红色 */
  ThirdParty = 'thirdparty',
  /** 其他 - 灰色 */
  Other = 'other',
}

/**
 * 首页卡片数据配置
 */
export interface CardData {
  /** 国际化键名，用于从 i18n 文件中获取卡片文本内容 */
  i18nKey: string;
  /** 卡片图标 URL */
  icon?: string;
  /** 卡片链接配置 */
  link?: {
    i18nKey: string;
    href: string;
  };
  /** 卡片图片 URL */
  image?: string;
  /** 描述文本的国际化键名 */
  descriptionKey?: string;
  /** 是否显示卡片，默认为 true，设置为 false 时隐藏该卡片 */
  visible?: boolean;
  /** 标签类型列表，决定标签颜色（支持多个标签） */
  tagTypes?: CardTagType[];
}

/**
 * 首页卡片列表
 */

export const homeCards: CardData[] = [
  {
    i18nKey: 'chargeReward',
    icon: 'https://cos.yituliu.cn/endfield/other/test-kv.jpg',
    link: {
      i18nKey: 'linkText',
      href: 'https://endfield.hypergryph.com/chargeReward?source_from=yituliu',
    },
    image: '/images/充值返还查询.png',
    tagTypes: [CardTagType.Official],
  },
  {
    i18nKey: 'checkAccess',
    icon: 'https://cos.yituliu.cn/endfield/other/test-kv.jpg',
    link: {
      i18nKey: 'linkText',
      href: 'https://endfield.hypergryph.com/checkAccess',
    },
    image: 'https://cos.yituliu.cn/endfield/other/test-kv.jpg',
    visible: false,
    tagTypes: [CardTagType.Official],
  },
  {
    i18nKey: 'endfieldLab',
    icon: 'https://factory.ef.yituliu.cn/favicon-32x32.png',
    link: {
      i18nKey: 'linkText',
      href: 'https://factory.ef.yituliu.cn/',
    },
    descriptionKey: 'description',
    tagTypes: [CardTagType.YiTuLiu, CardTagType.Official],
  },
  {
    i18nKey: 'yiTuLiu',
    icon: 'https://cos.yituliu.cn/endfield/icons/yituliu-icon.png',
    link: {
      i18nKey: 'linkText',
      href: 'https://ark.yituliu.cn/',
    },
    descriptionKey: 'description',
    tagTypes: [CardTagType.YiTuLiu],
  },
  {
    i18nKey: 'penguinStatistics',
    icon: 'https://cos.yituliu.cn/endfield/icons/penguin_stats_logo.png',
    link: {
      i18nKey: 'linkText',
      href: 'https://penguin-stats.cn/',
    },
    descriptionKey: 'description',
    tagTypes: [CardTagType.ThirdParty],
  },
  {
    i18nKey: 'contribute',
    icon: 'https://ef.yituliu.cn/favicon-32x32.png',
    link: {
      i18nKey: 'linkText',
      href: 'https://github.com/Arknights-yituliu/ef-frontend-v1',
    },
    descriptionKey: 'description',
    tagTypes: [CardTagType.YiTuLiu, CardTagType.Other],
  },
];
