import type {
  UcCodeUsage,
  UcEfAccount,
  UcEfPlayerData,
  UcEfPlayerDataSaveParams,
  UcEfPlayerDataSaveResult,
  UcLoginByEmailParams,
  UcLoginByPasswordParams,
  UcLoginVO,
  UcProfileVO,
  UcRegisterParams,
  UcRequestConfig,
  UcResponse,
  UcUpdateProfileParams,
} from '@/shared/types/userCenter';
import { ucBaseUrl, ucClientId } from '@/custom/config/base-url';

/** 会话令牌在 localStorage 中的存储键（与 UserCenter 前端保持一致） */
const UC_TOKEN_KEY = 'UC_TOKEN';
/** 用户 id 在 localStorage 中的存储键 */
const UC_UID_KEY = 'UC_UID';

/** UserCenter 业务错误（HTTP 200 但 code !== 200，或网络层错误） */
export class UcApiError extends Error {
  /** 业务错误码；网络层错误时为 HTTP 状态码或 -1 */
  code: number;

  constructor(code: number, message: string) {
    super(message);
    this.name = 'UcApiError';
    this.code = code;
  }
}

/** 401/未登录相关的错误码，统一触发本地会话清理 */
const UNAUTHORIZED_CODES = new Set([80_001, 80_002]);

/**
 * UserCenter 用户中心能力集合：会话状态、请求封装、登录注册与个人中心相关接口
 * @returns 会话状态、弹窗状态与全部接口方法
 */
export function useUserCenter() {
  /** 当前会话令牌（空串表示未登录） */
  const token = useState<string>('uc-token', () => '');
  /** 当前用户 id */
  const uid = useState<string>('uc-uid', () => '');
  /** 当前用户资料，加载成功前为 null */
  const profile = useState<UcProfileVO | null>('uc-profile', () => null);
  /** 登录弹窗是否打开 */
  const isLoginDialogOpen = useState<boolean>('uc-login-dialog-open', () => false);
  /** 是否已完成本地会话恢复（避免重复读取 localStorage） */
  const hasRestored = useState<boolean>('uc-has-restored', () => false);

  /** 是否已登录（仅有令牌即视为已登录，资料可能尚未加载） */
  const isLoggedIn = computed(() => Boolean(token.value));

  /** 清空本地会话与用户资料 */
  function clearSession(): void {
    token.value = '';
    uid.value = '';
    profile.value = null;
    if (import.meta.client) {
      localStorage.removeItem(UC_TOKEN_KEY);
      localStorage.removeItem(UC_UID_KEY);
    }
  }

  /**
   * 保存会话令牌与用户 id 到内存与 localStorage
   * @param loginVO 登录/注册接口返回的会话信息
   */
  function setSession(loginVO: UcLoginVO): void {
    token.value = loginVO.token;
    uid.value = loginVO.uid ? String(loginVO.uid) : '';
    if (import.meta.client) {
      localStorage.setItem(UC_TOKEN_KEY, token.value);
      localStorage.setItem(UC_UID_KEY, uid.value);
    }
  }

  /** 从 localStorage 恢复会话（仅执行一次） */
  function restoreSession(): void {
    if (!import.meta.client || hasRestored.value) {
      return;
    }
    hasRestored.value = true;
    token.value = localStorage.getItem(UC_TOKEN_KEY) || '';
    uid.value = localStorage.getItem(UC_UID_KEY) || '';
  }

  /**
   * UserCenter 统一请求封装
   * - 自动携带 `UC-Client-Id`（登录/注册必需，其余接口用于记录来源客户端）
   * - `auth` 为 true 时携带 `Authorization: Bearer <token>`
   * - 统一判定 `code === 200`，其余情况抛出 UcApiError
   * @param config 请求配置
   * @returns 成功时的完整响应体
   */
  async function ucRequest<T = unknown>({
    method = 'GET',
    url = '',
    data = null,
    auth = true,
  }: UcRequestConfig = {}): Promise<UcResponse<T>> {
    const headers: Record<string, string> = { 'UC-Client-Id': ucClientId };
    if (auth && token.value) {
      headers.Authorization = `Bearer ${token.value}`;
    }

    let body: UcResponse<T> | undefined;
    try {
      body = await $fetch<UcResponse<T>>(url, {
        baseURL: ucBaseUrl,
        method,
        headers,
        body: method === 'POST' ? ((data as Record<string, unknown>) ?? {}) : undefined,
        credentials: 'include',
        timeout: 15_000,
      });
    } catch (error) {
      const fetchError = error as {
        status?: number;
        statusCode?: number;
        data?: UcResponse<T>;
        message?: string;
      };
      // 服务端以非 200 HTTP 状态返回时，错误详情通常仍在 data 中
      if (fetchError.data && typeof fetchError.data.code === 'number') {
        if (auth && UNAUTHORIZED_CODES.has(fetchError.data.code)) {
          clearSession();
        }
        throw new UcApiError(fetchError.data.code, fetchError.data.msg || '请求失败');
      }
      const status = fetchError.status ?? fetchError.statusCode;
      throw new UcApiError(status ?? -1, status ? `HTTP ${status}` : '网络异常，请稍后再试');
    }

    if (!body || body.code !== 200) {
      if (auth && body && UNAUTHORIZED_CODES.has(body.code)) {
        clearSession();
      }
      throw new UcApiError(body?.code ?? -1, body?.msg || '请求失败');
    }

    return body;
  }

  // ---------------- 认证相关 ----------------

  /**
   * 发送邮箱验证码
   * @param email 接收验证码的邮箱
   * @param usage 验证码用途（注册/登录/重置密码）
   */
  async function sendCode(email: string, usage: UcCodeUsage): Promise<void> {
    await ucRequest({
      method: 'POST',
      url: '/auth/send-code',
      data: { email, usage },
      auth: false,
    });
  }

  /**
   * 密码登录（邮箱或用户名二选一）
   * @param params 登录参数
   */
  async function loginByPassword(params: UcLoginByPasswordParams): Promise<UcLoginVO> {
    const response = await ucRequest<UcLoginVO>({
      method: 'POST',
      url: '/auth/login',
      data: params,
      auth: false,
    });
    setSession(response.data);
    return response.data;
  }

  /**
   * 邮箱验证码登录
   * @param params 登录参数
   */
  async function loginByEmail(params: UcLoginByEmailParams): Promise<UcLoginVO> {
    const response = await ucRequest<UcLoginVO>({
      method: 'POST',
      url: '/auth/login',
      data: params,
      auth: false,
    });
    setSession(response.data);
    return response.data;
  }

  /**
   * 注册（成功后服务端直接返回会话，等同于已登录）
   * @param params 注册参数
   */
  async function register(params: UcRegisterParams): Promise<UcLoginVO> {
    const response = await ucRequest<UcLoginVO>({
      method: 'POST',
      url: '/auth/register',
      data: params,
      auth: false,
    });
    setSession(response.data);
    return response.data;
  }

  /**
   * 发送重置密码验证码（发送到账号绑定的邮箱）
   * @param account 邮箱或用户名
   */
  async function sendResetCode(account: string): Promise<void> {
    await ucRequest({
      method: 'POST',
      url: '/auth/reset-code',
      data: { account },
      auth: false,
    });
  }

  /**
   * 通过验证码重置密码（成功后服务端会踢出全部会话）
   * @param account 邮箱或用户名
   * @param code 邮箱验证码
   * @param newPassword 新密码
   */
  async function resetPassword(account: string, code: string, newPassword: string): Promise<void> {
    await ucRequest({
      method: 'POST',
      url: '/auth/reset-password',
      data: { account, code, newPassword },
      auth: false,
    });
  }

  /** 退出登录：通知服务端吊销会话，并始终清理本地状态 */
  async function logout(): Promise<void> {
    try {
      if (token.value) {
        await ucRequest({ method: 'POST', url: '/auth/logout' });
      }
    } catch {
      // 令牌可能已失效，退出流程不因此中断
    } finally {
      clearSession();
    }
  }

  // ---------------- 个人资料 ----------------

  /**
   * 获取当前用户资料
   * @returns 用户资料，同时写入本地状态
   */
  async function fetchProfile(): Promise<UcProfileVO> {
    const response = await ucRequest<UcProfileVO>({ url: '/user/profile' });
    profile.value = response.data;
    return response.data;
  }

  /**
   * 更新昵称与头像
   * @param params 需要更新的字段
   */
  async function updateProfile(params: UcUpdateProfileParams): Promise<void> {
    await ucRequest({ method: 'POST', url: '/user/profile/update', data: params });
    if (profile.value) {
      profile.value = { ...profile.value, ...params };
    }
  }

  /**
   * 修改密码（成功后建议重新登录）
   * @param oldPassword 原密码
   * @param newPassword 新密码
   */
  async function changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await ucRequest({ method: 'POST', url: '/user/password', data: { oldPassword, newPassword } });
  }

  // ---------------- 邮箱绑定 ----------------

  /**
   * 绑定邮箱（仅未绑定邮箱时可用）
   * @param email 待绑定邮箱
   * @param code 邮箱验证码
   */
  async function bindEmail(email: string, code: string): Promise<void> {
    await ucRequest({ method: 'POST', url: '/user/email/bind', data: { email, code } });
  }

  /** 发送换绑邮箱验证码（验证码发送到当前已绑定邮箱） */
  async function sendChangeEmailCode(): Promise<void> {
    await ucRequest({ method: 'POST', url: '/user/email/send-change-code' });
  }

  /**
   * 换绑邮箱
   * @param oldCode 旧邮箱收到的验证码
   * @param newEmail 新邮箱
   * @param newCode 新邮箱收到的验证码
   */
  async function changeEmail(oldCode: string, newEmail: string, newCode: string): Promise<void> {
    await ucRequest({
      method: 'POST',
      url: '/user/email/change',
      data: { oldCode, newEmail, newCode },
    });
  }

  // ---------------- 终末地玩家数据 ----------------

  /**
   * 查询当前用户已绑定的终末地角色列表（不含玩家数据正文）
   * @returns 已绑定角色列表，按最近导入时间倒序
   */
  async function listEfAccounts(): Promise<UcEfAccount[]> {
    const response = await ucRequest<UcEfAccount[]>({ url: '/user/ef-accounts' });
    return response.data ?? [];
  }

  /**
   * 读取指定角色的终末地玩家数据
   * @param roleId 终末地游戏内角色 UID
   * @param serverId 服务器 ID，可省略
   * @returns 玩家数据；绑定存在但数据行缺失时返回 null
   */
  async function fetchEfPlayerData(
    roleId: string,
    serverId?: string,
  ): Promise<UcEfPlayerData | null> {
    const params = new URLSearchParams({ roleId });
    if (serverId) {
      params.set('serverId', serverId);
    }
    const response = await ucRequest<UcEfPlayerData | null>({
      url: `/user/ef-accounts/player-data?${params.toString()}`,
    });
    return response.data ?? null;
  }

  /**
   * 保存终末地玩家数据（已存在则整份覆盖，首次上传同时建立角色绑定）
   * @param params 角色标识与玩家数据 JSON 对象
   * @returns 本次写入的角色标识与保存时间
   */
  async function saveEfPlayerData(
    params: UcEfPlayerDataSaveParams,
  ): Promise<UcEfPlayerDataSaveResult> {
    const response = await ucRequest<UcEfPlayerDataSaveResult>({
      method: 'POST',
      url: '/user/ef-accounts/player-data/save',
      data: params,
    });
    return response.data;
  }

  /** 打开登录弹窗 */
  function openLoginDialog(): void {
    isLoginDialogOpen.value = true;
  }

  /** 关闭登录弹窗 */
  function closeLoginDialog(): void {
    isLoginDialogOpen.value = false;
  }

  // 客户端首次调用时恢复本地会话
  if (import.meta.client) {
    restoreSession();
  }

  return {
    token: readonly(token),
    uid: readonly(uid),
    profile: readonly(profile),
    isLoggedIn,
    isLoginDialogOpen,
    openLoginDialog,
    closeLoginDialog,
    restoreSession,
    clearSession,
    fetchProfile,
    updateProfile,
    changePassword,
    sendCode,
    loginByPassword,
    loginByEmail,
    register,
    sendResetCode,
    resetPassword,
    logout,
    bindEmail,
    sendChangeEmailCode,
    changeEmail,
    listEfAccounts,
    fetchEfPlayerData,
    saveEfPlayerData,
  };
}
