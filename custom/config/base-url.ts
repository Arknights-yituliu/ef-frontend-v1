/** 终末地资源后端基址 */
const baseUrl = 'https://endfield.backend.yituliu.cn';

/**
 * UserCenter 运行环境标识
 * 通过构建期环境变量 `VITE_UC_ENV` 注入，取值 `local` 时对接本机服务，其余情况对接线上服务
 * 使用示例：`yarn dev:local`
 */
const ucEnv = (import.meta.env.VITE_UC_ENV ?? '').trim().toLowerCase();

/** UserCenterV1（Orange Auth）服务基址：local 环境指向本机 8080，其余指向统一认证域名 */
export const ucBaseUrl = ucEnv === 'local' ? 'http://127.0.0.1:8080' : 'https://auth.yituliu.cn';

/**
 * 本站点在 UserCenterV1 中登记的客户端标识（OAuth client_id）
 * 登录/注册接口通过 `UC-Client-Id` 请求头传递，缺失会导致会话来源客户端为空
 */
export const ucClientId = 'ef-yituliu';

export default baseUrl;
