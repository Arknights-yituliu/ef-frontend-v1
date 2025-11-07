// 在下载`@mdi/font`包之后再引入
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((app) => {
    const vuetify = createVuetify({
        theme: {
            defaultTheme: 'light',
            themes: {
                light: {
                    colors: {
                        // 使用 global.css 中定义的浅色主题颜色
                        primary: '#191919', // --theme-text-primary
                        secondary: '#888', // --theme-text-secondary
                        accent: '#191919', // --theme-accent-color
                        background: '#fafafa', // --theme-bg-primary
                        surface: '#ffffff', // --theme-bg-secondary
                        'on-primary': '#ffffff',
                        'on-secondary': '#ffffff',
                        'on-accent': '#ffffff',
                        'on-background': '#191919', // --theme-text-primary
                        'on-surface': '#191919', // --theme-text-primary
                        'on-error': '#ffffff',
                        'on-warning': '#ffffff',
                        'on-info': '#ffffff',
                        'on-success': '#ffffff',
                    },
                },
                dark: {
                    colors: {
                        // 使用 global.css 中定义的深色主题颜色
                        primary: '#fffa00', // 深色主题强调色
                        secondary: '#ccc', // 深色主题次要文本色
                        accent: '#fffa00', // 深色主题强调色
                        background: '#191919', // 深色主题背景
                        surface: '#1f1f1f', // 深色主题表面层
                        'on-primary': '#191919',
                        'on-secondary': '#191919',
                        'on-accent': '#191919',
                        'on-background': '#ffffff', // 深色主题前景色
                        'on-surface': '#ffffff', // 深色主题表面前景
                        'on-error': '#ffffff',
                        'on-warning': '#ffffff',
                        'on-info': '#ffffff',
                        'on-success': '#ffffff',
                    },
                },
            },
        },
    })
    app.vueApp.use(vuetify)
})
