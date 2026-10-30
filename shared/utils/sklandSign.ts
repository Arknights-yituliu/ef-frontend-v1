import Hex from 'crypto-js/enc-hex';
import HmacSHA256 from 'crypto-js/hmac-sha256';
import MD5 from 'crypto-js/md5';

/**
 * 森空岛（Skland）zonai 接口签名工具
 *
 * 国服签名规则：
 * ```
 * timestamp = Math.floor((当前毫秒时间戳 - 300) / 1000)
 * secret    = path + body/query + timestamp + json({ platform, timestamp, dId, vName })
 * sign      = MD5(HEX(HMAC-SHA256(token, secret)))
 * ```
 * 参与签名的 `platform` / `dId` / `vName` 必须与请求头中的值完全一致。
 */

/** 平台标识：3 表示网页端，服务端会校验该请求头 */
const SKLAND_PLATFORM = '3';
/** 设备标识：浏览器端使用固定的 UA 字符串 */
const SKLAND_DID =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/118.0';
/** 客户端版本号 */
const SKLAND_VERSION = '1.2.0';

/** 参与签名的固定字段（键顺序即 JSON 序列化顺序，必须保持不变） */
export interface SklandSignFields {
  platform: string;
  timestamp: string;
  dId: string;
  vName: string;
}

/**
 * 构造森空岛 zonai 接口的签名请求头
 * @param cred 森空岛登录凭据，写入 `cred` 请求头
 * @param token 签名密钥（auth/refresh 或 generate_cred_by_code 返回）
 * @param path 完整接口路径，如 `/api/v1/game/player/binding`
 * @param query GET 请求的 query 原串（不含 `?`），必须与最终 URL 完全一致
 * @param body POST 请求体的原始 JSON 字符串，必须与发送内容逐字符一致
 * @returns 可直接用于 fetch 的请求头
 */
export function buildSklandHeaders(
  cred: string,
  token: string,
  path: string,
  query = '',
  body?: string,
): Record<string, string> {
  const timestamp = String(Math.floor((Date.now() - 300) / 1000));
  const signFields: SklandSignFields = {
    platform: SKLAND_PLATFORM,
    timestamp,
    dId: SKLAND_DID,
    vName: SKLAND_VERSION,
  };
  const payload = body ?? query;
  const raw = `${path}${payload}${timestamp}${JSON.stringify(signFields)}`;

  // 先 HMAC-SHA256 取十六进制串，再对该串做 MD5，得到最终 sign
  const hexHmac = HmacSHA256(raw, token).toString(Hex);
  const sign = MD5(hexHmac).toString(Hex);

  // 与 frontend-v2-plus 保持一致：只发送签名相关头，User-Agent 由浏览器自动携带
  return {
    cred,
    sign,
    ...signFields,
  };
}
