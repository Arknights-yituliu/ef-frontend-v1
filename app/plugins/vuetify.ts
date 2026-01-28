// 在下载`@mdi/font`包之后再引入
import '@mdi/font/css/materialdesignicons.css';

import 'vuetify/styles';
import { createVuetify } from 'vuetify';
// 导入Vuetify语言包（用于切换时更新）
import { en, zhHans } from 'vuetify/locale';

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    locale: {
      locale: 'zhHans',
      fallback: 'en',
      messages: {
        en,
        zhHans,
      },
    },
    theme: {
      defaultTheme: 'light',
      themes: {
        light: {
          colors: {
            // 使用自定义主题系统的颜色
            primary: '#2c2c2c', // --theme-text-primary
            secondary: '#666666', // --theme-text-secondary
            accent: '#2c2c2c', // --theme-accent-color
            background: 'transparent', // 使用透明，让CSS变量控制
            surface: 'transparent', // 使用透明，让CSS变量控制
            'on-primary': '#ffffff',
            'on-secondary': '#ffffff',
            'on-accent': '#ffffff',
            'on-background': '#2c2c2c', // --theme-text-primary
            'on-surface': '#2c2c2c', // --theme-text-primary
            'on-error': '#ffffff',
            'on-warning': '#ffffff',
            'on-info': '#ffffff',
            'on-success': '#ffffff',
          },
        },
        dark: {
          colors: {
            // 使用自定义主题系统的颜色
            primary: '#e8e8e8', // --theme-text-primary
            secondary: '#b8b8b8', // --theme-text-secondary
            accent: '#e8e8e8', // --theme-accent-color
            background: 'transparent', // 使用透明，让CSS变量控制
            surface: 'transparent', // 使用透明，让CSS变量控制
            'on-primary': '#1a1a1a',
            'on-secondary': '#1a1a1a',
            'on-accent': '#1a1a1a',
            'on-background': '#e8e8e8', // --theme-text-primary
            'on-surface': '#e8e8e8', // --theme-text-primary
            'on-error': '#ffffff',
            'on-warning': '#ffffff',
            'on-info': '#ffffff',
            'on-success': '#ffffff',
          },
        },
      },
    },
  });

  app.vueApp.use(vuetify);
});
