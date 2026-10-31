/**
 * UserCenterV1（Orange Auth）接口类型定义
 *
 * 说明：服务端所有接口统一返回 `{ code, msg, data }`，
 * 业务失败同样以 HTTP 200 返回，需通过 `code === 200` 判断是否成功。
 */

/** UC 统一响应结构 */
export interface UcResponse<T = unknown> {
  code: number;
  msg: string;
  data: T;
}

/** 登录/注册成功后返回的会话信息（LoginVO） */
export interface UcLoginVO {
  /** 会话令牌，后续请求以 `Authorization: Bearer <token>` 携带 */
  token: string;
  uid: number | string;
  nickname?: string | null;
  avatar?: string | null;
  email?: string | null;
}

/** 用户资料（GET /user/profile） */
export interface UcProfileVO {
  uid: number | string;
  email: string | null;
  nickname: string;
  avatar: string | null;
  /** 1 表示正常，小于 0 表示已封禁 */
  status: number;
  registerTime: string;
  lastLoginTime: string | null;
}

/** 密码登录参数（邮箱与用户名二选一） */
export interface UcLoginByPasswordParams {
  accountType: 'password';
  /** 使用邮箱登录时填写 */
  email?: string;
  /** 使用用户名登录时填写 */
  userName?: string;
  password: string;
}

/** 邮箱验证码登录参数 */
export interface UcLoginByEmailParams {
  accountType: 'email';
  email: string;
  verificationCode: string;
}

/** 登录参数（POST /auth/login） */
export type UcLoginParams = UcLoginByPasswordParams | UcLoginByEmailParams;

/** 注册参数（POST /auth/register） */
export interface UcRegisterParams {
  email: string;
  /** 3-20 位字母、数字或下划线 */
  userName: string;
  /** 6-32 位字母、数字或 @_ */
  password: string;
  verificationCode: string;
  nickname?: string;
}

/** 邮箱验证码用途 */
export type UcCodeUsage = 'register' | 'login' | 'reset';

/** 修改资料参数（POST /user/profile/update） */
export interface UcUpdateProfileParams {
  nickname?: string;
  avatar?: string;
}

/** 已绑定的终末地角色（GET /user/ef-accounts，不含玩家数据正文） */
export interface UcEfAccount {
  /** 终末地游戏内角色 UID */
  roleId: string;
  /** 服务器 ID，未传时为空串 */
  serverId: string;
  /** 首次导入该角色数据的时间 */
  createTime: string | null;
  /** 最近一次导入该角色数据的时间 */
  updateTime: string;
}

/** 终末地玩家数据读取结果（GET /user/ef-accounts/player-data） */
export interface UcEfPlayerData {
  roleId: string;
  serverId: string;
  /** 保存时提交的 JSON 对象，服务端原样返回 */
  playerData: Record<string, unknown>;
  updateTime: string;
}

/** 保存终末地玩家数据参数（POST /user/ef-accounts/player-data/save） */
export interface UcEfPlayerDataSaveParams {
  /** 终末地游戏内角色 UID，不超过 32 位可见 ASCII 字符 */
  roleId: string;
  /** 服务器 ID，可省略（按空串保存） */
  serverId?: string;
  /** 玩家数据 JSON 对象，序列化后不超过 2MB */
  playerData: Record<string, unknown>;
}

/** 保存终末地玩家数据结果 */
export interface UcEfPlayerDataSaveResult {
  roleId: string;
  serverId: string;
  /** 本次保存时间 */
  updateTime: string;
}

/** ucRequest 请求配置 */
export interface UcRequestConfig {
  /** HTTP 方法，默认 GET */
  method?: 'GET' | 'POST';
  /** 相对 UC 基址的接口路径 */
  url?: string;
  /** 请求体 */
  data?: unknown;
  /** 是否携带会话令牌，默认 true */
  auth?: boolean;
}
