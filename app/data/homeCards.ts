/**
 * 首页卡片链接配置
 */
export interface CardLink {
  i18nKey: string;
  href: string;
}

/**
 * 首页按钮动作类型
 */
export enum ButtonActionType {
  /** 跳转链接 */
  Link = 'link',
  /** 复制文本 */
  Copy = 'copy',
}

/**
 * 按钮显示类型
 */
export enum ButtonType {
  /** 主按钮 - 突出显示，通常用于主要操作 */
  Main = 'main',
  /** 链接按钮 - 用于跳转链接，样式较轻 */
  Link = 'link',
  /** 文本按钮 - 用于复制文本，样式最轻 */
  Text = 'text',
}

/**
 * 首页卡片内按钮配置
 */
export interface CardButton {
  /** 国际化键名，用于从 i18n 文件中获取按钮文本内容 */
  i18nKey: string;
  /** 按钮显示类型 */
  buttonType: ButtonType;
  /** 按钮动作类型 */
  action: ButtonActionType;
  /** 动作参数 */
  actionData: string;
  /** 是否在新标签页打开（仅 link 类型有效），默认为 true */
  target?: boolean;
  /** 按钮图标 (Material Design Icons 图标名) */
  icon?: string;
  /** 按钮颜色 (可选) */
  color?: string;
}

/**
 * 首页底部按钮配置
 */
export interface FooterButton {
  /** 国际化键名，用于从 i18n 文件中获取按钮文本内容 */
  i18nKey: string;
  /** 按钮动作类型 */
  action: ButtonActionType;
  /** 动作参数 */
  actionData: string;
  /** 是否在新标签页打开（仅 link 类型有效），默认为 true */
  target?: boolean;
  /** 按钮图标 (Material Design Icons 图标名) */
  icon?: string;
  /** 是否显示按钮，默认为 true */
  visible?: boolean;
  /** 复制成功后的提示文本（仅 copy 类型有效） */
  copySuccessText?: string;
}

/**
 * 标签类型枚举
 */
export enum CardTagType {
  /** 官方 - 黄色 */
  Official = 'official',
  /** 一图流 - 青色 */
  YiTuLiu = 'yituliu',
  /** 一图流托管 - 青色 */
  YiTuLiu3rd = 'yituliu3rd',
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
  /** 卡片图片 URL */
  image?: string;
  /** 描述文本的国际化键名 */
  descriptionKey?: string;
  /** 是否显示卡片，默认为 true，设置为 false 时隐藏该卡片 */
  visible?: boolean;
  /** 标签类型列表，决定标签颜色（支持多个标签） */
  tagTypes?: CardTagType[];
  /** 卡片内按钮列表（可选） */
  buttons?: CardButton[];
}

/**
 * 首页卡片列表
 */

/**
 * 首页底部按钮列表
 */
export const homeFooterButtons: FooterButton[] = [
  {
    i18nKey: 'buttons.github',
    action: ButtonActionType.Link,
    actionData: 'https://github.com/Arknights-yituliu/ef-frontend-v1',
    target: true,
    icon: 'mdi-github',
    visible: true,
  },
  {
    i18nKey: 'buttons.discord',
    action: ButtonActionType.Link,
    actionData: 'https://discord.gg/your-discord-link',
    target: true,
    icon: 'mdi-discord',
    visible: true,
  },
  {
    i18nKey: 'buttons.copyContact',
    action: ButtonActionType.Copy,
    actionData: 'contact@example.com',
    icon: 'mdi-content-copy',
    visible: true,
    copySuccessText: '已复制联系邮箱',
  },
];

export const homeCards: CardData[] = [
  {
    i18nKey: 'chargeReward',
    icon: '/images/icon/hg.png',
    image: '/images/充值返还查询.png',
    descriptionKey: 'description',
    tagTypes: [CardTagType.Official],
    buttons: [
      {
        i18nKey: 'buttons.main',
        buttonType: ButtonType.Main,
        action: ButtonActionType.Link,
        actionData: 'https://endfield.hypergryph.com/chargeReward?source_from=yituliu',
        target: true,
        icon: 'mdi-web',
        color: 'primary',
      },
      {
        i18nKey: 'buttons.link',
        buttonType: ButtonType.Link,
        action: ButtonActionType.Link,
        actionData: 'https://endfield.hypergryph.com/chargeReward',
        target: false,
        icon: 'mdi-open-in-new',
      },
      {
        i18nKey: 'buttons.copyLink',
        buttonType: ButtonType.Text,
        action: ButtonActionType.Copy,
        actionData: 'https://endfield.hypergryph.com/chargeReward',
        icon: 'mdi-content-copy',
      },
    ],
  },
  {
    i18nKey: 'prepOrders',
    icon: '/images/icon/hg.png',
    image: '/images/充值返还查询.png',
    descriptionKey: 'description',
    tagTypes: [CardTagType.Official],
    buttons: [
      {
        i18nKey: 'buttons.main',
        buttonType: ButtonType.Main,
        action: ButtonActionType.Link,
        actionData: 'https://endfield.hypergryph.com/activity/final-prep-orders?source_from=yituliu',
        target: true,
        icon: 'mdi-web',
        color: 'primary',
      },
      {
        i18nKey: 'buttons.link',
        buttonType: ButtonType.Link,
        action: ButtonActionType.Link,
        actionData: 'https://endfield.hypergryph.com/activity/prep-orders',
        target: false,
        icon: 'mdi-open-in-new',
      },
      {
        i18nKey: 'buttons.copyLink',
        buttonType: ButtonType.Text,
        action: ButtonActionType.Copy,
        actionData: 'https://endfield.hypergryph.com/activity/prep-orders',
        icon: 'mdi-content-copy',
      },
    ],
  },
  {
    i18nKey: 'checkAccess',
    icon: 'https://cos.yituliu.cn/endfield/other/test-kv.jpg',
    image: 'https://cos.yituliu.cn/endfield/other/test-kv.jpg',
    descriptionKey: 'description',
    visible: false,
    tagTypes: [CardTagType.Official],
    buttons: [
      {
        i18nKey: 'buttons.main',
        buttonType: ButtonType.Main,
        action: ButtonActionType.Link,
        actionData: 'https://endfield.hypergryph.com/checkAccess',
        target: true,
        icon: 'mdi-web',
        color: 'primary',
      },
      {
        i18nKey: 'buttons.link',
        buttonType: ButtonType.Link,
        action: ButtonActionType.Link,
        actionData: 'https://endfield.hypergryph.com/checkAccess',
        target: false,
        icon: 'mdi-open-in-new',
      },
      {
        i18nKey: 'buttons.copyLink',
        buttonType: ButtonType.Text,
        action: ButtonActionType.Copy,
        actionData: 'https://endfield.hypergryph.com/checkAccess',
        icon: 'mdi-content-copy',
      },
    ],
  },
  {
    i18nKey: 'endfieldLab',
    icon: 'https://factory.ef.yituliu.cn/favicon-32x32.png',
    image: '/images/量化计算器.png',
    descriptionKey: 'description',
    tagTypes: [CardTagType.YiTuLiu3rd],
    buttons: [
      {
        i18nKey: 'buttons.main',
        buttonType: ButtonType.Main,
        action: ButtonActionType.Link,
        actionData: 'https://factory.ef.yituliu.cn/',
        target: true,
        icon: 'mdi-web',
        color: 'primary',
      },
      {
        i18nKey: 'buttons.link',
        buttonType: ButtonType.Link,
        action: ButtonActionType.Link,
        actionData: 'https://factory.ef.yituliu.cn/',
        target: false,
        icon: 'mdi-open-in-new',
      },
      {
        i18nKey: 'buttons.copyLink',
        buttonType: ButtonType.Text,
        action: ButtonActionType.Copy,
        actionData: 'https://factory.ef.yituliu.cn/',
        icon: 'mdi-content-copy',
      },
    ],
  },
  {
    i18nKey: 'opendfieldmap',
    icon: 'https://factory.ef.yituliu.cn/favicon-32x32.png',
    image: '/images/OEM.png',
    descriptionKey: 'description',
    tagTypes: [CardTagType.ThirdParty],
    buttons: [
      {
        i18nKey: 'buttons.main',
        buttonType: ButtonType.Main,
        action: ButtonActionType.Link,
        actionData: 'https://opendfieldmap.cn/',
        target: true,
        icon: 'mdi-web',
        color: 'primary',
      },
      {
        i18nKey: 'buttons.link',
        buttonType: ButtonType.Link,
        action: ButtonActionType.Link,
        actionData: 'https://opendfieldmap.cn/',
        target: false,
        icon: 'mdi-open-in-new',
      },
      {
        i18nKey: 'buttons.copyLink',
        buttonType: ButtonType.Text,
        action: ButtonActionType.Copy,
        actionData: 'https://opendfieldmap.cn/',
        icon: 'mdi-content-copy',
      },
    ],
  },
  {
    i18nKey: 'endfieldpuzzle',
    icon: 'https://factory.ef.yituliu.cn/favicon-32x32.png',
    image: '/images/endfieldpuzzle.png',
    descriptionKey: 'description',
    tagTypes: [CardTagType.ThirdParty],
    buttons: [
      {
        i18nKey: 'buttons.main',
        buttonType: ButtonType.Main,
        action: ButtonActionType.Link,
        actionData: 'https://ak-endfield-puzzle.sihenzhang.com/',
        target: true,
        icon: 'mdi-web',
        color: 'primary',
      },
      {
        i18nKey: 'buttons.link',
        buttonType: ButtonType.Link,
        action: ButtonActionType.Link,
        actionData: 'https://ak-endfield-puzzle.sihenzhang.com/',
        target: false,
        icon: 'mdi-open-in-new',
      },
      {
        i18nKey: 'buttons.copyLink',
        buttonType: ButtonType.Text,
        action: ButtonActionType.Copy,
        actionData: 'https://ak-endfield-puzzle.sihenzhang.com/',
        icon: 'mdi-content-copy',
      },
    ],
  },
  {
    i18nKey: 'endfieldprtschat',
    icon: 'https://factory.ef.yituliu.cn/favicon-32x32.png',
    image: '/images/dev.png',
    descriptionKey: 'description',
    tagTypes: [CardTagType.ThirdParty],
    buttons: [
      {
        i18nKey: 'buttons.main',
        buttonType: ButtonType.Main,
        action: ButtonActionType.Link,
        actionData: 'https://endfield.prts.chat/',
        target: true,
        icon: 'mdi-web',
        color: 'primary',
      },
      {
        i18nKey: 'buttons.link',
        buttonType: ButtonType.Link,
        action: ButtonActionType.Link,
        actionData: 'https://endfield.prts.chat/',
        target: false,
        icon: 'mdi-open-in-new',
      },
      {
        i18nKey: 'buttons.copyLink',
        buttonType: ButtonType.Text,
        action: ButtonActionType.Copy,
        actionData: 'https://endfield.prts.chat/',
        icon: 'mdi-content-copy',
      },
    ],
  },
  {
    i18nKey: 'yiTuLiu',
    icon: 'https://cos.yituliu.cn/endfield/icons/yituliu-icon.png',
    image: '/images/明日方舟一图流.png',
    descriptionKey: 'description',
    tagTypes: [CardTagType.YiTuLiu],
    buttons: [
      {
        i18nKey: 'buttons.main',
        buttonType: ButtonType.Main,
        action: ButtonActionType.Link,
        actionData: 'https://ark.yituliu.cn/',
        target: true,
        icon: 'mdi-web',
        color: 'primary',
      },
      {
        i18nKey: 'buttons.link',
        buttonType: ButtonType.Link,
        action: ButtonActionType.Link,
        actionData: 'https://ark.yituliu.cn/',
        target: false,
        icon: 'mdi-open-in-new',
      },
      {
        i18nKey: 'buttons.copyLink',
        buttonType: ButtonType.Text,
        action: ButtonActionType.Copy,
        actionData: 'https://ark.yituliu.cn/',
        icon: 'mdi-content-copy',
      },
    ],
  },
  {
    i18nKey: 'penguinStatistics',
    icon: 'https://cos.yituliu.cn/endfield/icons/penguin_stats_logo.png',
    image: '/images/企鹅物流数据统计.png',
    descriptionKey: 'description',
    tagTypes: [CardTagType.ThirdParty],
    buttons: [
      {
        i18nKey: 'buttons.main',
        buttonType: ButtonType.Main,
        action: ButtonActionType.Link,
        actionData: 'https://penguin-stats.cn/',
        target: true,
        icon: 'mdi-web',
        color: 'primary',
      },
      {
        i18nKey: 'buttons.link',
        buttonType: ButtonType.Link,
        action: ButtonActionType.Link,
        actionData: 'https://penguin-stats.cn/',
        target: false,
        icon: 'mdi-open-in-new',
      },
      {
        i18nKey: 'buttons.copyLink',
        buttonType: ButtonType.Text,
        action: ButtonActionType.Copy,
        actionData: 'https://penguin-stats.cn/',
        icon: 'mdi-content-copy',
      },
    ],
  },
  {
    i18nKey: 'contribute',
    icon: 'https://ef.yituliu.cn/favicon-32x32.png',
    image: '/images/dev.png',
    descriptionKey: 'description',
    tagTypes: [CardTagType.YiTuLiu, CardTagType.Other],
    buttons: [
      {
        i18nKey: 'buttons.main',
        buttonType: ButtonType.Main,
        action: ButtonActionType.Link,
        actionData: 'https://github.com/Arknights-yituliu/ef-frontend-v1',
        target: true,
        icon: 'mdi-github',
        color: 'primary',
      },
      {
        i18nKey: 'buttons.link',
        buttonType: ButtonType.Link,
        action: ButtonActionType.Link,
        actionData: 'https://github.com/Arknights-yituliu/ef-frontend-v1',
        target: false,
        icon: 'mdi-open-in-new',
      },
      {
        i18nKey: 'buttons.copyLink',
        buttonType: ButtonType.Text,
        action: ButtonActionType.Copy,
        actionData: 'https://github.com/Arknights-yituliu/ef-frontend-v1',
        icon: 'mdi-content-copy',
      },
    ],
  },
];
