import routes from '@/custom/route/routes.json'

// 项目公共配置对象
export default defineAppConfig({
  /**
   * 路由配置，为侧边栏服务
   */
  menu: {
    routes
  },
  /**
   * 文档路由前缀列表，用于在中间件等位置统一判定文档页面
   */
  docsRoutePrefixes: ['/introduction'],
  initialLoader: {
    /**
     * 是否启用初始加载动画
     */
    enabled: true,
    /**
     * 初始加载动画持续时间（毫秒）
     */
    loadingDuration: 1500
  }
})
