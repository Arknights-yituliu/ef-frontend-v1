import { createVuetify } from 'vuetify';

// 导入Vuetify语言包（用于切换时更新）
import { en, zhHans } from 'vuetify/locale';
// 在下载`@mdi/font`包之后再引入
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

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
  });

  app.vueApp.use(vuetify);
});
