// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt({
  files: ['**/*.ts', '**/*.vue'],
  rules: {
    'no-console': 'off', // 允许 console.log 语句
    '@typescript-eslint/no-unused-vars': 'off', // 允许未使用的变量和方法
    '@typescript-eslint/no-explicit-any': 'off', // 允许 any 类型
    'vue/valid-v-slot': 'off', // 允许 v-slot 指令使用修饰符
  },
});
