// Nuxt 配置文件
// 参考文档：https://nuxt.com/docs/4.x/api/nuxt-config
import vuetify, {transformAssetUrls} from 'vite-plugin-vuetify'
import path from 'path';

export default defineNuxtConfig({
  /**
   * SSR (Server-Side Rendering) 配置
   * 设置为 false 时，应用将以 SPA (Single Page Application) 模式运行
   * 这意味着所有页面都在客户端渲染，适合静态站点生成 (SSG)
   * 参考：https://nuxt.com/docs/4.x/api/nuxt-config#ssr
   */
  ssr: false,

  /**
   * 应用配置 (app)
   * 用于配置应用的基础设置，如头部信息、基础URL等
   * 参考：https://nuxt.com/docs/4.x/api/nuxt-config#app
   */
  app: {
    /**
     * 头部配置 (head)
     * 设置默认的 HTML <head> 标签内容，包括 title、meta、link、script 等
     * 这些配置会应用到所有页面，也可以在页面中通过 useHead() 覆盖
     * 参考：https://nuxt.com/docs/4.x/api/nuxt-config#app-head
     */
    head: {
      title: '终末地一图流',
      link: [{rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},],
      meta: [{
        name: 'description',
        content: '根据《明日方舟：终末地》建造的数据解析平台，致力于以数据的视角解读游戏内容，构建友好理性的社区。'
      },],
    },
  },

  /**
   * 兼容性日期 (compatibilityDate)
   * 指定 Nuxt 的兼容性日期，用于确定使用哪些 API 和特性
   * 格式：YYYY-MM-DD
   * 参考：https://nuxt.com/docs/4.x/api/nuxt-config#compatibilitydate
   */
  compatibilityDate: '2025-11-05',

  /**
   * 开发工具 (devtools)
   * 启用 Nuxt DevTools，提供开发时的调试和分析功能
   * 参考：https://nuxt.com/docs/4.x/api/nuxt-config#devtools
   */
  devtools: {enabled: true},

  /**
   * 全局 CSS 文件
   * 指定要在整个应用中全局加载的 CSS 文件、模块或库
   * 这些样式会在应用启动时自动导入
   * 参考：https://nuxt.com/docs/4.x/api/nuxt-config#css
   */
  css: ['~/assets/css/global.css'],

  /**
   * 模块配置 (modules)
   * 注册 Nuxt 模块，扩展应用功能
   * 参考：https://nuxt.com/docs/4.x/api/nuxt-config#modules
   */
  modules: [// @nuxtjs/i18n - 国际化模块，提供多语言支持
    // 参考：https://nuxt.com/modules/i18n
    '@nuxtjs/i18n', // @nuxt/content - 内容管理模块，用于处理 Markdown 等文件
    // 参考：https://content.nuxt.com/docs/getting-started/configuration
    '@nuxt/content', // Vuetify 插件配置（自定义模块函数）
    // 通过 Vite 钩子注册 Vuetify 插件，启用自动导入功能
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({autoImport: true}))
      })
    }, '@nuxtjs/seo'],

  /**
   * Nuxt Content 配置
   * 配置内容模块的行为，包括 Markdown 处理、代码高亮、目录生成等
   * 参考：https://content.nuxt.com/docs/getting-started/configuration
   */
  content: {
    build: {
      markdown: {
        toc: {
          // 目录深度：生成到 h3 级别的标题
          depth: 3, // 搜索深度：在目录中搜索到 h3 级别
          searchDepth: 3,
        }, /**
         * 代码高亮配置
         * 配置代码块的语法高亮主题和支持的语言
         */
        highlight: {
          theme: {
            default: 'github-light', dark: 'github-dark',
          }, // 支持的语言列表
          langs: ['json', 'js', 'ts', 'html', 'css', 'vue', 'shell', 'bash', 'md', 'mdc', 'yaml'],
        },
      },
    }, /**
     * 渲染器配置 (renderer)
     * 控制内容渲染的行为
     */
    renderer: {
      /**
       * 锚点链接配置 (anchorLinks)
       * 为标题自动生成锚点链接，方便跳转
       */
      anchorLinks: {
        h1: true, h2: true, h3: true,
      },
    }, /**
     * 监听配置 (watch)
     * 配置内容文件的监听选项（开发模式）
     */
    watch: {
      enabled: true,    // 启用文件监听
      port: 4000,       // 监听端口
      showURL: true,    // 显示监听 URL
    } as { enabled: boolean } & Record<string, unknown>,
  },

  /**
   * 国际化配置 (i18n)
   * 配置多语言支持，包括语言列表、默认语言、语言检测等
   * 参考：https://nuxt.com/modules/i18n
   */
  i18n: {
    /**
     * 语言列表 (locales)
     * 定义应用支持的所有语言
     */
    locales: [{
      code: 'zh-CN',      // 语言代码
      label: '中文',      // 显示标签
      file: 'zh-CN.json'  // 语言文件路径（相对于 langDir）
    }, {
      code: 'en-US', label: 'English', file: 'en-US.json'
    }],

    /**
     * 语言文件目录 (langDir)
     * 存储语言文件的目录路径
     */
    langDir: 'locales',

    /**
     * 默认语言 (defaultLocale)
     * 当无法检测到用户语言时使用的默认语言
     */
    defaultLocale: 'zh-CN',

    /**
     * 路由策略 (strategy)
     * 'no_prefix': 不在 URL 中添加语言前缀
     * 其他选项：'prefix_except_default', 'prefix', 'prefix_and_default'
     */
    strategy: 'no_prefix',

    /**
     * 浏览器语言检测 (detectBrowserLanguage)
     * 配置是否自动检测用户浏览器的语言偏好
     */
    detectBrowserLanguage: {
      useCookie: true,              // 使用 Cookie 存储用户语言偏好
      cookieKey: 'i18n_redirected', // Cookie 键名
      redirectOn: 'root'            // 在根路径时进行重定向
    }
  },

  /**
   * 构建配置 (build)
   * 配置构建过程的选项
   * 参考：https://nuxt.com/docs/4.x/api/nuxt-config#build
   */
  build: {
    /**
     * 转译配置 (transpile)
     * 指定需要转译的模块（通常用于 ES6+ 或 TypeScript 模块）
     * Vuetify 需要转译以兼容构建过程
     */
    transpile: ['vuetify'],
  },

  /**
   * Vite 配置
   * 自定义 Vite 构建工具的选项
   * 参考：https://nuxt.com/docs/4.x/api/nuxt-config#vite
   */
  vite: {
    vue: {
      /**
       * 模板配置 (template)
       * 配置 Vue 模板的处理选项
       */
      template: {
        /**
         * 资源 URL 转换 (transformAssetUrls)
         * 自动转换模板中的资源 URL，使其在 Vuetify 组件中正常工作
         * 例如：将 <v-img src="..."> 中的路径正确解析
         */
        transformAssetUrls,
      },
    }, /**
     * 构建配置 (build)
     * 配置 Vite 构建过程的选项
     */
    build: {
      /**
       * CSS 代码分割 (cssCodeSplit)
       * 设置为 false 时，所有 CSS 会合并到一个文件中，以减少 HTTP 请求
       */
      cssCodeSplit: false,

      /**
       * Chunk 大小警告限制 (chunkSizeWarningLimit)
       * 当构建的 chunk 超过此大小时显示警告（单位：KB）
       */
      chunkSizeWarningLimit: 1000,

      /**
       * 资源内联限制 (assetsInlineLimit)
       * 小于此大小的资源会被内联为 base64，减少 HTTP 请求
       * 单位：字节
       */
      assetsInlineLimit: 4096, // 4KB 以下的资源内联

      /**
       * Rollup 选项 (rollupOptions)
       * 自定义 Rollup 打包配置
       */
      rollupOptions: {
        /**
         * 输出配置 (output)
         * 控制构建输出的格式和分块策略
         */
        output: {
          /**
           * 动态导入内联 (inlineDynamicImports)
           * 保持为 true 以强制 Rollup 将所有动态导入内联到主 bundle 中
           */
          inlineDynamicImports: true,
        },
      },
    },
  },

  /**
   * 路径别名配置 (alias)
   * 定义额外的路径别名，方便在代码中引用文件
   * 这些别名会自动添加到 TypeScript 配置中，提供类型支持和自动补全
   * 参考：https://nuxt.com/docs/4.x/api/nuxt-config#alias
   */
  alias: {
    /**
     * '@' 别名指向项目根目录
     * 使用示例：import utils from '@/shared/utils/helper'
     */
    '@': path.resolve(__dirname)
  },
})
