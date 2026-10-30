import type {
  SklandBindingEntry,
  SklandCardDetailData,
  SklandCredential,
  SklandEndfieldCardDetail,
  SklandEndfieldRole,
  SklandPlayerBindingData,
  SklandQrSession,
  SklandQrStatus,
  SklandRefreshData,
  SklandResponse,
  SklandTeenagerData,
} from '@/shared/types/skland';
import type { UcResponse } from '@/shared/types/userCenter';
import { ucBaseUrl, ucClientId } from '@/custom/config/base-url';
import { buildSklandHeaders } from '@/shared/utils/sklandSign';

/** zonai 接口基址（国服） */
const ZONAI_BASE_URL = 'https://zonai.skland.com';
/** 森空岛游戏标识：明日方舟终末地 */
const ENDFIELD_APP_CODE = 'endfield';

/** 森空岛相关请求错误 */
export class SklandApiError extends Error {
  /** 业务错误码；网络层错误时为 HTTP 状态码或 -1 */
  code: number;

  constructor(code: number, message: string) {
    super(message);
    this.name = 'SklandApiError';
    this.code = code;
  }
}

/** 凭证失效错误码：10000 未授权 / 10002 登录失效 */
const CREDENTIAL_EXPIRED_CODES = new Set([10_000, 10_002]);

/**
 * 判断错误是否为凭证失效（需要用户重新获取 cred）
 * @param error 捕获到的错误
 * @returns 是否属于凭证失效
 */
export function isCredentialExpiredError(error: unknown): boolean {
  return error instanceof SklandApiError && CREDENTIAL_EXPIRED_CODES.has(error.code);
}

/**
 * 森空岛能力集合：凭证获取（三种方式）与终末地角色数据查询
 * 所有函数均为无状态调用，凭证仅由调用方保存在页面内存中
 */
export function useSkland() {
  /**
   * 调用 UserCenterV1 的森空岛中转接口（公开，无需登录态）
   * @param url 相对 UC 基址的接口路径
   * @param data POST 请求体
   * @returns 成功时的 data 字段
   */
  async function ucRequest<T>(url: string, data?: unknown): Promise<T> {
    let body: UcResponse<T> | undefined;
    try {
      body = await $fetch<UcResponse<T>>(url, {
        baseURL: ucBaseUrl,
        method: 'POST',
        headers: { 'UC-Client-Id': ucClientId },
        body: (data as Record<string, unknown>) ?? {},
        timeout: 20_000,
      });
    } catch (error) {
      const fetchError = error as { status?: number; data?: UcResponse<T> };
      // 服务端以非 200 HTTP 状态返回时，错误详情通常仍在 data 中
      if (fetchError.data && typeof fetchError.data.code === 'number') {
        throw new SklandApiError(fetchError.data.code, fetchError.data.msg || '请求失败');
      }
      throw new SklandApiError(fetchError.status ?? -1, '网络异常，请稍后再试');
    }

    if (!body || body.code !== 200) {
      throw new SklandApiError(body?.code ?? -1, body?.msg || '请求失败');
    }
    return body.data;
  }

  /**
   * 调用 zonai 已签名接口
   * @param cred 森空岛 cred
   * @param token 签名密钥
   * @param path 完整接口路径
   * @param query GET 的 query 原串（不含 `?`）
   * @returns 成功时的 data 字段
   */
  async function zonaiRequest<T>(
    cred: string,
    token: string,
    path: string,
    query = '',
  ): Promise<T> {
    const headers = buildSklandHeaders(cred, token, path, query);
    const url = `${ZONAI_BASE_URL}${path}${query ? `?${query}` : ''}`;

    let body: SklandResponse<T> | undefined;
    try {
      body = await $fetch<SklandResponse<T>>(url, { headers, timeout: 20_000 });
    } catch (error) {
      const fetchError = error as { status?: number; data?: SklandResponse<T> };
      if (fetchError.data && typeof fetchError.data.code === 'number') {
        throw new SklandApiError(fetchError.data.code, fetchError.data.message || '森空岛请求失败');
      }
      throw new SklandApiError(fetchError.status ?? -1, '森空岛接口请求失败，请稍后重试');
    }

    if (!body || body.code !== 0) {
      throw new SklandApiError(body?.code ?? -1, body?.message || '森空岛请求失败');
    }
    return body.data;
  }

  /**
   * 方式一：用直接输入的 cred 换取签名 token（GET /api/v1/auth/refresh）
   * @param cred 森空岛 cred
   * @returns 签名 token
   */
  async function refreshTokenByCred(cred: string): Promise<string> {
    const url = `${ZONAI_BASE_URL}/api/v1/auth/refresh`;
    let body: SklandResponse<SklandRefreshData> | undefined;
    try {
      body = await $fetch<SklandResponse<SklandRefreshData>>(url, {
        headers: { cred },
        timeout: 20_000,
      });
    } catch (error) {
      const fetchError = error as { status?: number; data?: SklandResponse<SklandRefreshData> };
      if (fetchError.data && typeof fetchError.data.code === 'number') {
        throw new SklandApiError(
          fetchError.data.code,
          fetchError.data.message || 'cred 无效或已过期',
        );
      }
      throw new SklandApiError(fetchError.status ?? -1, '网络异常，请稍后再试');
    }

    if (!body || body.code !== 0 || !body.data?.token) {
      throw new SklandApiError(body?.code ?? -1, body?.message || 'cred 无效或已过期');
    }
    return body.data.token;
  }

  /**
   * 方式二：用鹰角官网 token 通过 UC 中转换取森空岛凭证
   * @param hgToken 鹰角通行证 token
   * @returns cred 与签名 token
   */
  async function credFromHgToken(hgToken: string): Promise<SklandCredential> {
    return ucRequest<SklandCredential>('/skland/hg/cred-token', { token: hgToken });
  }

  /**
   * 方式三：申请扫码登录二维码
   * @returns 扫码会话（scanId + 二维码内容）
   */
  async function createQrSession(): Promise<SklandQrSession> {
    return ucRequest<SklandQrSession>('/skland/qr/create');
  }

  /**
   * 方式三：查询扫码状态（建议 1.5~2 秒轮询）
   * @param scanId 扫码会话 ID
   * @returns 扫码状态，status 为 0 时携带凭证
   */
  async function checkQrStatus(scanId: string): Promise<SklandQrStatus> {
    return ucRequest<SklandQrStatus>(`/skland/qr/check?scanId=${encodeURIComponent(scanId)}`);
  }

  /**
   * 获取终末地账号下的角色列表与账号级 userId
   * @param cred 森空岛 cred
   * @param token 签名密钥
   * @returns 角色列表（已展平 bindingList[].roles[]）与 userId
   */
  async function fetchEndfieldRoles(
    cred: string,
    token: string,
  ): Promise<{ userId: string; roles: SklandEndfieldRole[] }> {
    const binding = await zonaiRequest<SklandPlayerBindingData>(
      cred,
      token,
      '/api/v1/game/player/binding',
    );
    const group = binding.list?.find((item) => item.appCode === ENDFIELD_APP_CODE);
    const entries: SklandBindingEntry[] = group?.bindingList ?? [];
    const roles = entries.flatMap((entry) => entry.roles ?? []);

    // userId 优先取 teenager 接口，失败时回退到绑定条目 uid
    let userId = '';
    try {
      const teenager = await zonaiRequest<SklandTeenagerData>(cred, token, '/api/v1/user/teenager');
      userId = String(teenager.teenager?.userId ?? '');
    } catch {
      // teenager 接口不可用时不阻塞主流程
    }
    if (!userId) {
      userId = entries[0]?.uid ?? '';
    }

    return { userId, roles };
  }

  /**
   * 获取终末地角色卡片详情
   * @param cred 森空岛 cred
   * @param token 签名密钥
   * @param params 角色标识与账号级 userId
   * @returns 角色卡片 detail
   */
  async function fetchCardDetail(
    cred: string,
    token: string,
    params: { roleId: string; serverId: string; userId: string },
  ): Promise<SklandEndfieldCardDetail> {
    // query 顺序即签名串顺序，需与最终 URL 完全一致
    const query = new URLSearchParams({
      roleId: params.roleId,
      serverId: params.serverId,
      userId: params.userId,
    }).toString();
    const data = await zonaiRequest<SklandCardDetailData>(
      cred,
      token,
      '/web/v1/game/endfield/card/detail',
      query,
    );
    return data.detail ?? {};
  }

  return {
    refreshTokenByCred,
    credFromHgToken,
    createQrSession,
    checkQrStatus,
    fetchEndfieldRoles,
    fetchCardDetail,
  };
}
