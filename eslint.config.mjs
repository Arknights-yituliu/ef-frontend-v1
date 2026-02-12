// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';
import prettier from 'eslint-config-prettier';
import vuetify from 'eslint-config-vuetify';

export default withNuxt(vuetify, prettier, {
  rules: {
    '@typescript-eslint/no-explicit-any': 'off', // 允许使用 any 类型
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ], // 允许未使用的变量（以 _ 开头的参数或变量）
    'vue/multi-word-component-names': 'off', // 允许单词组件名称
    'vue/valid-v-slot': 'off', // 允许 v-slot 指令使用修饰符
  },
});
