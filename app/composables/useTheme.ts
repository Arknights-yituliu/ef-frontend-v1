export const useTheme = () => {
  const theme = useState<'light' | 'dark'>('theme', () => 'light');

  const toggleTheme = () => {
    const newTheme = theme.value === 'light' ? 'dark' : 'light';
    theme.value = newTheme;
    if (import.meta.client) {
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    }
  };

  const initTheme = () => {
    if (import.meta.client) {
      // 从 localStorage 读取保存的主题，如果没有则使用默认值
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
      
      theme.value = initialTheme as 'light' | 'dark';
      document.documentElement.setAttribute('data-theme', initialTheme);
    }
  };

  // 在客户端初始化主题
  if (import.meta.client) {
    initTheme();
  }

  return {
    theme: readonly(theme),
    toggleTheme,
  };
};
