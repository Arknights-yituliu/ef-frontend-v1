/**
 * 文档门户全局路由中间件
 *
 * 功能说明：
 * - 这是一个全局中间件（.global.ts），会在每次路由变化时执行
 * - 当用户从非文档页面跳转到文档页面时，会在新窗口打开文档，而不是在当前窗口导航
 * - 当用户在文档页面之间跳转时，保持正常的导航行为（在当前窗口打开）
 *
 * 使用场景：
 * 适用于文档门户网站，希望文档内容在新窗口打开，保持主站点的上下文
 */
export default defineNuxtRouteMiddleware((to, from) => {
  // 从应用配置中获取文档路由前缀列表
  // 例如：['/introduction', '/operations'] 等
  const { docsRoutePrefixes = [] } = useAppConfig();

  /**
   * 判断给定的路由是否为文档路由
   * @param route - 要检查的路由对象（to 或 from）
   * @returns 如果是文档路由返回 true，否则返回 false
   */
  const isDocsRoute = (route: typeof to | typeof from) => {
    // 如果没有配置文档路由前缀，或者路由路径不存在，则不是文档路由
    if (docsRoutePrefixes.length === 0 || !route?.path) {
      return false;
    }

    // 检查路由路径是否以任何一个配置的前缀开头
    return docsRoutePrefixes.some((prefix) => route.path.startsWith(prefix));
  };

  // 如果目标路由不是文档路由，直接放行，不做任何处理
  if (!isDocsRoute(to)) {
    return;
  }

  // 检查来源路由是否为文档路由
  // 用于判断用户是否是从文档页面跳转过来的
  const cameFromDocs = isDocsRoute(from);

  // 仅在客户端环境下执行，且用户不是从文档页面跳转过来的情况下
  // 即：从非文档页面跳转到文档页面时
  if (import.meta.client && !cameFromDocs) {
    // 获取目标路由的完整路径（包含查询参数和哈希）
    let targetUrl = to.fullPath || to.path;
    if (targetUrl) {
      // 对 github.io 链接进行特殊处理，如果当前 url 路径中包含 github.io ，在 url 前追加 /ef-frontend-v1 （先写死）
      if (targetUrl.includes('github.io')) {
        targetUrl = targetUrl.replace('github.io', 'github.io/ef-frontend-v1');
      }

      // 在新窗口打开文档页面
      window.open(targetUrl, '_blank', 'noopener noreferrer');
    }
    // 中止当前导航，因为已经在 new 窗口打开了
    // 这样可以保持用户停留在原页面
    return abortNavigation();
  }

  // 如果是从文档页面跳转到另一个文档页面，则正常导航（不返回任何值）
  // 或者是在服务端渲染时，也正常导航
});
