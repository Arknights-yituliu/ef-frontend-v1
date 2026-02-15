export function useTheme () {
  const theme = useState<'light' | 'dark'>('theme', () => 'light');

  const setTheme = (newTheme: 'light' | 'dark') => {
    theme.value = newTheme;
    if (import.meta.client) {
      document.documentElement.dataset.theme = newTheme;

      // Nuxt Content 会以根元素是否存在 dark 类来确定主题
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
      localStorage.setItem('theme', newTheme);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme.value === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const initTheme = () => {
    if (import.meta.client) {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
      setTheme(initialTheme);
    }
  };

  // 在客户端初始化主题
  if (import.meta.client) {
    initTheme();
  }

  return {
    theme: readonly(theme),
    setTheme,
    toggleTheme,
  };
}
