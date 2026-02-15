import prettier from 'eslint-config-prettier';
import vuetify from 'eslint-config-vuetify';
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
  vuetify({
    ts: false,
    imports: false,
  }),
  prettier,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off', // 允许使用 any 类型
      '@typescript-eslint/no-inferrable-types': 'off', // 允许显式声明类型，即使 TypeScript 可以推断出来
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ], // 允许未使用的变量（以 _ 开头的参数或变量）
      'unicorn/no-negated-condition': 'off', // 允许 if 条件语句使用否定条件
      'unicorn/prefer-ternary': 'off', // 允许 if-else 语句而不是三元表达式
      'vue/multi-word-component-names': 'off', // 允许单词组件名称
      'vue/valid-v-slot': 'off', // 允许 v-slot 指令使用修饰符
    },
  },
);
