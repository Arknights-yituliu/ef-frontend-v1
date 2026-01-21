export const useTheme = () => {
  // 统一使用灰色主题，不再支持暗色模式
  const theme = useState<'light'>('theme', () => 'light');

  const initTheme = () => {
    if (import.meta.client) {
      // 设置默认主题
      document.documentElement.setAttribute('data-theme', 'light');
    }
  };

  // 在客户端初始化主题
  if (import.meta.client) {
    initTheme();
  }

  return {
    theme: readonly(theme),
  };
};
