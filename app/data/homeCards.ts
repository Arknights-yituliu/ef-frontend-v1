export interface CardLink {
  i18nKey: string;
  href: string;
}

export interface CardData {
  i18nKey: string;
  icon?: string;
  link?: {
    i18nKey: string;
    href: string;
  };
  image?: string;
  descriptionKey?: string;
  visible?: boolean;
}

export const homeCards: CardData[] = [
  {
    i18nKey: 'checkAccess',
    icon: 'https://cos.yituliu.cn/endfield/other/test-kv.jpg',
    link: {
      i18nKey: 'linkText',
      href: 'https://endfield.hypergryph.com/checkAccess',
    },
    image: 'https://cos.yituliu.cn/endfield/other/test-kv.jpg',
    visible: false,
  },
  {
    i18nKey: 'endfieldLab',
    icon: 'https://factory.ef.yituliu.cn/favicon-32x32.png',
    link: {
      i18nKey: 'linkText',
      href: 'https://factory.ef.yituliu.cn/',
    },
    descriptionKey: 'description',
  },
  {
    i18nKey: 'yiTuLiu',
    icon: 'https://cos.yituliu.cn/endfield/icons/yituliu-icon.png',
    link: {
      i18nKey: 'linkText',
      href: 'https://ark.yituliu.cn/',
    },
    descriptionKey: 'description',
  },
  {
    i18nKey: 'penguinStatistics',
    icon: 'https://cos.yituliu.cn/endfield/icons/penguin_stats_logo.png',
    link: {
      i18nKey: 'linkText',
      href: 'https://penguin-stats.cn/',
    },
    descriptionKey: 'description',
  },
  {
    i18nKey: 'contribute',
    icon: 'https://ef.yituliu.cn/favicon-32x32.png',
    link: {
      i18nKey: 'linkText',
      href: 'https://github.com/Arknights-yituliu/ef-frontend-v1',
    },
    descriptionKey: 'description',
  },
];
