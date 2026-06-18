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
  /** 空白按钮 - 不显示该按钮 */
  Blank = 'blank',
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
  /** 复制成功后的提示文本（仅 copy 类型有效） */
  copySuccessText?: string;
  /** 弹出提示文本 */
  popupText?: string;
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
    i18nKey: 'launchRedemptionCodes',
    icon: '/images/icon/hg.png',
    image: 'https://cos.yituliu.cn/endfield/home/endfieldofficial.jpg',
    descriptionKey: 'description',
    tagTypes: [CardTagType.Official],
    buttons: [
      // {
      //   i18nKey: 'buttons.returnofall',
      //   buttonType: ButtonType.Text,
      //   action: ButtonActionType.Copy,
      //   actionData: 'RETURNOFALL',
      //   icon: 'mdi-content-copy',
      // },
      // {
      //   i18nKey: 'buttons.allfield',
      //   buttonType: ButtonType.Text,
      //   action: ButtonActionType.Copy,
      //   actionData: 'ALLFIELD',
      //   icon: 'mdi-content-copy',
      // },
      {
        i18nKey: 'buttons.endfieldgift',
        buttonType: ButtonType.Text,
        action: ButtonActionType.Copy,
        actionData: 'ENDFIELDGIFT',
        icon: 'mdi-content-copy',
      },
      {
        i18nKey: 'buttons.endfield4pc',
        buttonType: ButtonType.Text,
        action: ButtonActionType.Copy,
        actionData: 'ENDFIELD4PC',
        icon: 'mdi-monitor',
        popupText: 'common.PCOnly',
        copySuccessText: 'common.copyCodePCOnly',
      },
    ],
  },
  {
    i18nKey: 'officialWebsite',
    icon: '/images/icon/hg.png',
    image: 'https://cos.yituliu.cn/endfield/home/endfieldofficial.jpg',
    descriptionKey: 'description',
    tagTypes: [CardTagType.Official],
    buttons: [
      {
        i18nKey: 'buttons.website',
        buttonType: ButtonType.Main,
        action: ButtonActionType.Link,
        actionData: 'https://endfield.hypergryph.com/',
        target: true,
        icon: 'mdi-web',
        color: 'primary',
      },
      {
        i18nKey: 'buttons.news',
        buttonType: ButtonType.Blank,
        action: ButtonActionType.Link,
        actionData: 'https://endfield.hypergryph.com/news',
        target: true,
        icon: 'mdi-open-in-new',
      },
      {
        i18nKey: 'buttons.chargeReward',
        buttonType: ButtonType.Link,
        action: ButtonActionType.Link,
        actionData: 'https://endfield.hypergryph.com/chargeReward?source_from=yituliu',
        target: true,
        icon: 'mdi-open-in-new',
      },
    ],
  },
  {
    i18nKey: 'chargeReward',
    icon: '/images/icon/hg.png',
    image: 'https://cos.yituliu.cn/endfield/home/充值返还查询.png',
    descriptionKey: 'description',
    visible: false,
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
    image: 'https://cos.yituliu.cn/endfield/home/充值返还查询.jpg',
    descriptionKey: 'description',
    visible: false,
    tagTypes: [CardTagType.Official],
    buttons: [
      {
        i18nKey: 'buttons.main',
        buttonType: ButtonType.Main,
        action: ButtonActionType.Link,
        actionData:
          'https://endfield.hypergryph.com/activity/final-prep-orders?source_from=yituliu',
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
    i18nKey: 'endfieldMaterialProfit',
    icon: 'https://ef.yituliu.cn/favicon-32x32.png',
    image: 'https://cos.yituliu.cn/endfield/home/ytl-packs.jpg',
    descriptionKey: 'description',
    tagTypes: [CardTagType.YiTuLiu],
    buttons: [
      {
        i18nKey: 'buttons.shopValue',
        buttonType: ButtonType.Text,
        action: ButtonActionType.Link,
        actionData: '/material-profit/shop-value',
        target: false,
        icon: 'mdi-store',
      },
      {
        i18nKey: 'buttons.packageValue',
        buttonType: ButtonType.Text,
        action: ButtonActionType.Link,
        actionData: '/material-profit/package-value',
        target: false,
        icon: 'mdi-gift',
      },
      {
        i18nKey: 'buttons.itemValueTable',
        buttonType: ButtonType.Text,
        action: ButtonActionType.Link,
        actionData: '/material-profit/item-value-table',
        target: false,
        icon: 'mdi-table',
      },
    ],
  },
  {
    i18nKey: 'endfieldTools',
    icon: 'https://ef.yituliu.cn/favicon-32x32.png',
    image: '/images/ytl-gachacal.png',
    descriptionKey: 'description',
    tagTypes: [CardTagType.YiTuLiu],
    buttons: [
      {
        i18nKey: 'buttons.gachaCalculator',
        buttonType: ButtonType.Text,
        action: ButtonActionType.Link,
        actionData: '/tools/gacha-calculator',
        target: false,
        icon: 'mdi-wallet',
      },
      {
        i18nKey: 'buttons.essenceCalculator',
        buttonType: ButtonType.Text,
        action: ButtonActionType.Link,
        actionData: '/tools/essence-calculator',
        target: false,
        icon: '$essence',
      },
      {
        i18nKey: 'buttons.batterySplitCalculator',
        buttonType: ButtonType.Text,
        action: ButtonActionType.Link,
        actionData: '/tools/power-calc',
        target: false,
        icon: 'mdi-lightning-bolt',
      },
    ],
  },
  {
    i18nKey: 'endfieldResources',
    icon: 'https://ef.yituliu.cn/favicon-32x32.png',
    image: 'https://cos.yituliu.cn/endfield/home/ytl-gem.jpg',
    descriptionKey: 'description',
    tagTypes: [CardTagType.YiTuLiu],
    buttons: [
      {
        i18nKey: 'buttons.essenceRecognizer',
        buttonType: ButtonType.Text,
        action: ButtonActionType.Link,
        actionData: '/resources/essence-recognizer',
        target: false,
        icon: 'mdi-chart-line',
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
        i18nKey: 'buttons.endfieldLab',
        buttonType: ButtonType.Main,
        action: ButtonActionType.Link,
        actionData: 'https://factory.ef.yituliu.cn/',
        target: true,
        icon: 'mdi-web',
        color: 'primary',
      },
      {
        i18nKey: 'buttons.wulingGraduate',
        buttonType: ButtonType.Link,
        action: ButtonActionType.Link,
        actionData:
          'https://factory.ef.yituliu.cn/aef/list?o=jinlong_coupon***2&o=originium_ore*360**3&o=quartz_sand*0**3&o=iron_ore*90**3&o=xiranite_powder*2*3*3*xiranite_oven_1&o=power_proc_battery_4*2*3**power_sta_1&omt=0&loc=A&v=11',
        target: true,
        icon: 'mdi-open-in-new',
      },
      {
        i18nKey: 'buttons.factory4Graduate',
        buttonType: ButtonType.Text,
        action: ButtonActionType.Link,
        actionData:
          'https://factory.ef.yituliu.cn/aef/flow?z=eJwtxqEKgEAQBNC.2TAg7N15YpmyyWA02cSqTBGDXy.ivfTEWAFkEzfUwYFioiP3rQuSj-0dKgowmfigfA0T69.ZdF50O7Qz7GZKL9NzFbY_&v=11',
        target: true,
        icon: 'mdi-open-in-new',
      },
    ],
  },
  {
    i18nKey: 'opendfieldmap',
    icon: '/images/icon/oem.webp',
    image: 'https://cos.yituliu.cn/endfield/home/OEM.jpg',
    descriptionKey: 'description',
    tagTypes: [CardTagType.ThirdParty],
    buttons: [
      {
        i18nKey: 'buttons.openAllMap',
        buttonType: ButtonType.Main,
        action: ButtonActionType.Link,
        actionData: 'https://opendfieldmap.cn/',
        target: true,
        icon: 'mdi-web',
        color: 'primary',
      },
      {
        i18nKey: 'buttons.devLog',
        buttonType: ButtonType.Text,
        action: ButtonActionType.Link,
        actionData: 'https://www.bilibili.com/opus/1158382718783848448',
        target: true,
        icon: 'mdi-open-in-new',
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
        i18nKey: 'buttons.saveDelta',
        buttonType: ButtonType.Main,
        action: ButtonActionType.Link,
        actionData: 'https://ak-endfield-puzzle.sihenzhang.com/',
        target: true,
        icon: 'mdi-web',
        color: 'primary',
      },
    ],
  },
  {
    i18nKey: 'endfieldprtschat',
    icon: '/images/icon/ef-prtschat.png',
    image: '/images/ef-prtschat.png',
    descriptionKey: 'description',
    tagTypes: [CardTagType.ThirdParty],
    buttons: [
      {
        i18nKey: 'buttons.searchEndfield',
        buttonType: ButtonType.Main,
        action: ButtonActionType.Link,
        actionData: 'https://endfield.prts.chat/',
        target: true,
        icon: 'mdi-web',
        color: 'primary',
      },
      {
        i18nKey: 'buttons.searchArknights',
        buttonType: ButtonType.Text,
        action: ButtonActionType.Link,
        actionData: 'https://prts.chat/',
        target: true,
        icon: 'mdi-open-in-new',
      },
    ],
  },
  {
    i18nKey: 'endAxis',
    icon: '/images/icon/endaxis.png',
    image: 'https://cos.yituliu.cn/endfield/home/endaxis.png',
    descriptionKey: 'description',
    tagTypes: [CardTagType.ThirdParty],
    buttons: [
      {
        i18nKey: 'buttons.main',
        buttonType: ButtonType.Main,
        action: ButtonActionType.Link,
        actionData: 'https://www.end-axis.com/timeline',
        target: true,
        icon: 'mdi-web',
        color: 'primary',
      },
    ],
  },
  {
    i18nKey: 'gachaRecordAnalysis',
    icon: 'https://cdn.ceobecanteen.top/images/tool-avatar/4e935096-f334-437a-91f0-48621a67d570',
    image: 'https://cos.yituliu.cn/endfield/home/endgacha.jpg',
    descriptionKey: 'description',
    tagTypes: [CardTagType.ThirdParty],
    buttons: [
      {
        i18nKey: 'buttons.endfieldGachaRecord',
        buttonType: ButtonType.Main,
        action: ButtonActionType.Link,
        actionData: 'https://endgacha.kwer.top/',
        target: true,
        icon: 'mdi-web',
        color: 'primary',
      },
      {
        i18nKey: 'buttons.arknightsGachaRecord',
        buttonType: ButtonType.Text,
        action: ButtonActionType.Link,
        actionData: 'https://arkgacha.kwer.top/',
        target: true,
        icon: 'mdi-open-in-new',
      },
    ],
  },
  {
    i18nKey: 'dige',
    icon: 'https://cos.yituliu.cn/endfield/icons/DIGEicon.png',
    image: 'https://cos.yituliu.cn/endfield/home/DIGE.png',
    descriptionKey: 'description',
    tagTypes: [CardTagType.ThirdParty],
    buttons: [
      {
        i18nKey: 'buttons.startUsing',
        buttonType: ButtonType.Main,
        action: ButtonActionType.Link,
        actionData: 'https://dige.aunly.cn/',
        target: true,
        icon: 'mdi-web',
        color: 'primary',
      },
    ],
  },
  {
    i18nKey: 'warfarinWiki',
    icon: '/images/icon/warfarinwiki.png',
    image: 'https://cos.yituliu.cn/endfield/home/warfarinwiki.jpg',
    descriptionKey: 'description',
    tagTypes: [CardTagType.ThirdParty],
    buttons: [
      {
        i18nKey: 'buttons.visitWiki',
        buttonType: ButtonType.Main,
        action: ButtonActionType.Link,
        actionData: 'https://warfarin.wiki/cn',
        target: true,
        icon: 'mdi-web',
        color: 'primary',
      },
    ],
  },
  {
    i18nKey: 'talosPioneers',
    icon: '/images/icon/talospioneers.png',
    image: 'https://cos.yituliu.cn/endfield/home/talospioneers.jpg',
    descriptionKey: 'description',
    tagTypes: [CardTagType.ThirdParty],
    buttons: [
      {
        i18nKey: 'buttons.visitBlueprintStation',
        buttonType: ButtonType.Main,
        action: ButtonActionType.Link,
        actionData: 'https://talospioneers.com/zh-CN',
        target: true,
        icon: 'mdi-web',
        color: 'primary',
      },
    ],
  },
  {
    i18nKey: 'yiTuLiu',
    icon: 'https://cos.yituliu.cn/endfield/icons/yituliu-icon.png',
    image: 'https://cos.yituliu.cn/endfield/home/明日方舟一图流.jpg',
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
        i18nKey: 'buttons.gachaCalculator',
        buttonType: ButtonType.Link,
        action: ButtonActionType.Link,
        actionData: 'https://ark.yituliu.cn/tools/gachaCalc',
        target: true,
        icon: 'mdi-wallet',
      },
      {
        i18nKey: 'buttons.packageValue',
        buttonType: ButtonType.Text,
        action: ButtonActionType.Link,
        actionData: 'https://ark.yituliu.cn/material/pack',
        target: true,
        icon: 'mdi-gift',
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
        i18nKey: 'buttons.ioMirror',
        buttonType: ButtonType.Link,
        action: ButtonActionType.Link,
        actionData: 'https://penguin-stats.io/',
        target: true,
        icon: 'mdi-open-in-new',
      },
    ],
  },
  {
    i18nKey: 'followUs',
    icon: '/images/icon/bytelogo.webp',
    image: 'https://cos.yituliu.cn/endfield/home/lbc.jpg',
    descriptionKey: 'description',
    tagTypes: [CardTagType.YiTuLiu, CardTagType.Other],
    buttons: [
      {
        i18nKey: 'buttons.qq',
        buttonType: ButtonType.Text,
        action: ButtonActionType.Link,
        actionData: 'https://qm.qq.com/q/pWVuNp3VSM',
        target: true,
        icon: 'mdi-open-in-new',
      },
      {
        i18nKey: 'buttons.douyin',
        buttonType: ButtonType.Text,
        action: ButtonActionType.Link,
        actionData: 'https://v.douyin.com/xv9ONpQ8Xsw/',
        target: true,
        icon: 'mdi-open-in-new',
      },
      {
        i18nKey: 'buttons.skland',
        buttonType: ButtonType.Text,
        action: ButtonActionType.Link,
        actionData: 'https://www.skland.com/profile?id=3679911155887',
        target: true,
        icon: 'mdi-open-in-new',
      },
      {
        i18nKey: 'buttons.bilibili',
        buttonType: ButtonType.Text,
        action: ButtonActionType.Link,
        actionData: 'https://space.bilibili.com/688411531',
        target: true,
        icon: 'mdi-open-in-new',
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
        i18nKey: 'buttons.github',
        buttonType: ButtonType.Main,
        action: ButtonActionType.Link,
        actionData: 'https://github.com/Arknights-yituliu/',
        target: true,
        icon: 'mdi-github',
        color: 'primary',
      },
      {
        i18nKey: 'buttons.frontendRepo',
        buttonType: ButtonType.Text,
        action: ButtonActionType.Link,
        actionData: 'https://github.com/Arknights-yituliu/ef-frontend-v1',
        target: true,
        icon: 'mdi-open-in-new',
      },
      {
        i18nKey: 'buttons.devGroup',
        buttonType: ButtonType.Text,
        action: ButtonActionType.Link,
        actionData: 'https://qm.qq.com/q/Y1ZDdgYAa6',
        target: true,
        icon: 'mdi-open-in-new',
      },
    ],
  },
];
