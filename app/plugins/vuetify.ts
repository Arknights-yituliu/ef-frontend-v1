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
            primary: '#2c2c2c',
            secondary: '#666666',
            accent: '#2c2c2c',
            background: '#F2F2F2',
            surface: '#f5f5f5',
            'on-primary': '#ffffff',
            'on-secondary': '#ffffff',
            'on-accent': '#ffffff',
            'on-background': '#2c2c2c',
            'on-surface': '#2c2c2c',
            error: '#b71c1c',
            info: '#0288d1',
            success: '#43a047',
            warning: '#f57c00',
          },
        },
        dark: {
          colors: {
            primary: '#e8e8e8',
            secondary: '#b8b8b8',
            accent: '#e8e8e8',
            background: '#1a1a1a',
            surface: '#2d2d2d',
            'on-primary': '#1a1a1a',
            'on-secondary': '#1a1a1a',
            'on-accent': '#1a1a1a',
            'on-background': '#e8e8e8',
            'on-surface': '#e8e8e8',
            error: '#ef5350',
            info: '#42a5f5',
            success: '#66bb6a',
            warning: '#ffa726',
          },
        },
      },
    },
  });

  app.vueApp.use(vuetify);
});