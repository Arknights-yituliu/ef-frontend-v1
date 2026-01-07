/**
 * 文档路径规范化全局中间件
 *
 * 功能说明：
 * - 这是一个全局中间件（.global.ts），会在每次路由变化时执行
 * - 检查当前路由是否为文档路由（根据 routes.json 中的 isDocs: true 判断）
 * - 如果路径末尾存在斜杠，则重定向到没有斜杠的版本
 *
 * 判断规则：
 * - 检查路由配置中是否有 isDocs: true 的标记
 * - 支持父路由和子路由的 isDocs 标记
 */
export default defineNuxtRouteMiddleware((to) => {
  // 从应用配置中获取路由配置
  const appConfig = useAppConfig();
  const routes = appConfig.menu?.routes || [];

  /**
   * 递归检查路由配置，判断给定路径是否匹配 isDocs: true 的路由
   * @param path - 要检查的路径
   * @param routeItems - 路由配置项数组
   * @param parentIsDocs - 父路由是否有 isDocs: true 标记
   * @returns 如果匹配 isDocs: true 的路由返回 true，否则返回 false
   */
  const isDocsRoute = (
    path: string,
    routeItems: Array<{
      routePath?: string;
      isDocs?: boolean;
      children?: Array<any>;
    }>,
    parentIsDocs = false,
  ): boolean => {
    for (const item of routeItems) {
      // 如果当前项有 routePath，检查路径是否匹配
      if (item.routePath) {
        // 检查路径是否精确匹配或以其开头
        const isMatchingPath = path === item.routePath || path.startsWith(item.routePath + '/');

        // 如果路径匹配，且（当前项有 isDocs 或父路由有 isDocs），则返回 true
        if (isMatchingPath && (item.isDocs || parentIsDocs)) {
          return true;
        }
      }

      // 检查子路由（递归）
      if (item.children && item.children.length > 0) {
        // 如果当前项有 isDocs，传递给子路由
        const currentIsDocs = item.isDocs || parentIsDocs;
        if (isDocsRoute(path, item.children, currentIsDocs)) {
          return true;
        }
      }
    }

    return false;
  };

  // 获取当前路径（不包含查询参数和哈希）
  const currentPath = to.path;

  // 如果路径不是文档路由，直接放行
  if (!isDocsRoute(currentPath, routes)) {
    return;
  }

  // 检查路径末尾是否有斜杠（根路径 '/' 除外）
  if (currentPath !== '/' && currentPath.endsWith('/')) {
    // 删除末尾的斜杠
    const normalizedPath = currentPath.replace(/\/$/, '');

    // 重定向到规范化后的路径
    return navigateTo(normalizedPath, { redirectCode: 301, replace: true });
  }
});
