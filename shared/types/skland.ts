/**
 * 森空岛（Skland）终末地数据接口类型定义
 *
 * 说明：zonai 接口统一返回 `{ code, message, data }`，`code === 0` 表示成功，
 * 其中 `10000` 为未授权、`10002` 为登录失效；角色卡片字段较多且可能随版本变化，
 * 故内部字段一律声明为可选，渲染层需自行兜底。
 */

/** zonai 统一响应结构 */
export interface SklandResponse<T = unknown> {
  /** 0 表示成功，其余为业务错误码 */
  code: number;
  message?: string;
  data: T;
}

/** GET /api/v1/auth/refresh 返回的 data */
export interface SklandRefreshData {
  /** 新的签名密钥 */
  token: string;
}

/** 终末地角色（bindingList[].roles[]） */
export interface SklandEndfieldRole {
  /** 服务器 ID */
  serverId: string;
  /** 游戏内角色 UID，终末地后续接口都用它 */
  roleId: string;
  nickname: string;
  level?: number;
  isDefault?: boolean;
  isBanned?: boolean;
  serverType?: string;
  serverName?: string;
}

/** 绑定条目（bindingList[]） */
export interface SklandBindingEntry {
  /** 森空岛绑定维度下的账号级角色 ID */
  uid: string;
  nickName?: string;
  isDefault?: boolean;
  isDelete?: boolean;
  gameId?: number;
  gameName?: string;
  channelMasterId?: string;
  channelName?: string;
  roles?: SklandEndfieldRole[];
  defaultRole?: SklandEndfieldRole | null;
}

/** 游戏分组（data.list[]） */
export interface SklandBindingGroup {
  /** 游戏标识，终末地为 `endfield`，方舟为 `arknights` */
  appCode: string;
  appName?: string;
  defaultUid?: string;
  bindingList?: SklandBindingEntry[];
}

/** GET /api/v1/game/player/binding 的 data */
export interface SklandPlayerBindingData {
  list?: SklandBindingGroup[];
}

/** GET /api/v1/user/teenager 的 data */
export interface SklandTeenagerData {
  teenager?: {
    /** 角色卡片接口所需的账号级 userId */
    userId?: string | number;
    [key: string]: unknown;
  };
}

/** 角色卡片基础信息（detail.base） */
export interface SklandCardBase {
  roleId?: string;
  name?: string;
  /** 权限等阶 */
  level?: number;
  /** 探索等级 */
  worldLevel?: number;
  avatarUrl?: string;
  charNum?: number;
  weaponNum?: number;
  mainMission?: {
    description?: string;
    [key: string]: unknown;
  };
  createTime?: string;
  lastLoginTime?: string;
  saveTime?: string;
}

/** 理智（体力）（detail.dungeon） */
export interface SklandCardDungeon {
  curStamina?: number;
  maxStamina?: number;
  /** 理智回满时间（秒级时间戳） */
  maxTs?: string;
}

/** 每日活跃（detail.dailyMission） */
export interface SklandCardDailyMission {
  dailyActivation?: number;
  maxDailyActivation?: number;
}

/** 每周任务（detail.weeklyMission） */
export interface SklandCardWeeklyMission {
  score?: number;
  total?: number;
}

/** 通行证（detail.bpSystem） */
export interface SklandCardBpSystem {
  curLevel?: number;
  maxLevel?: number;
}

/** 稀有度描述对象，key 形如 `rarity_3` ~ `rarity_6` */
export interface SklandRarity {
  key?: string;
  [key: string]: unknown;
}

/** 干员静态数据（chars[].charData） */
export interface SklandCharData {
  id?: string;
  name?: string;
  charName?: string;
  rarity?: SklandRarity;
  [key: string]: unknown;
}

/** 干员所持武器（chars[].weapon） */
export interface SklandCharWeapon {
  level?: number;
  /** 精炼等级 0-5 */
  refineLevel?: number;
  /** 突破等级 0-4 */
  breakthroughLevel?: number;
  weaponData?: {
    id?: string;
    name?: string;
    weaponName?: string;
    rarity?: SklandRarity;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

/** 干员条目（detail.chars[]） */
export interface SklandCardChar {
  charData?: SklandCharData;
  level?: number;
  /** 精英化阶段 0-4 */
  evolvePhase?: number;
  /** 潜能 0-5 */
  potentialLevel?: number;
  /** 技能等级映射：`{ [skillId]: { level, maxLevel } }` */
  userSkills?: Record<string, { level?: number; maxLevel?: number }>;
  weapon?: SklandCharWeapon;
  [key: string]: unknown;
}

/** 地区建设（detail.domain[]） */
export interface SklandCardDomain {
  name?: string;
  level?: number;
  settlements?: unknown[];
  collections?: unknown;
  [key: string]: unknown;
}

/** 终末地角色卡片（data.detail） */
export interface SklandEndfieldCardDetail {
  base?: SklandCardBase;
  chars?: SklandCardChar[];
  domain?: SklandCardDomain[];
  dungeon?: SklandCardDungeon;
  bpSystem?: SklandCardBpSystem;
  dailyMission?: SklandCardDailyMission;
  weeklyMission?: SklandCardWeeklyMission;
  achieve?: unknown;
  spaceShip?: unknown;
  config?: unknown;
  currentTs?: string;
  quickaccess?: unknown[];
  [key: string]: unknown;
}

/** GET /web/v1/game/endfield/card/detail 的 data */
export interface SklandCardDetailData {
  detail?: SklandEndfieldCardDetail;
}

/** UC 中转：扫码登录会话 */
export interface SklandQrSession {
  /** 扫码会话 ID，轮询状态时回传 */
  scanId: string;
  /** 二维码内容（鹰角 deep link），由前端渲染为二维码图片 */
  qrContent: string;
}

/** UC 中转：扫码状态查询结果 */
export interface SklandQrStatus {
  /** 0 表示已换取到凭证，100/101/102 为等待、待确认等中间态 */
  status: number;
  msg: string | null;
  cred: string | null;
  token: string | null;
}

/** 页面使用的森空岛凭证对 */
export interface SklandCredential {
  cred: string;
  token: string;
}
