// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-11-05',
  devtools: { enabled: true },
  css: ['~/assets/css/global.css'],
  
  modules: [
    '@nuxtjs/i18n'
  ],
  
  i18n: {
    locales: [
      {
        code: 'zh-CN',
        label: '中文',
        file: 'zh-CN.json'
      },
      {
        code: 'en-US',
        label: 'English',
        file: 'en-US.json'
      }
    ],
    langDir: 'locales',
    defaultLocale: 'zh-CN',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    }
  }
})
