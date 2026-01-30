import { useTheme as useVuetifyTheme } from 'vuetify';

export const useTheme = () => {
  // 使用Vuetify的useTheme
  const vuetifyTheme = useVuetifyTheme();

  const toggleTheme = () => {
    const newTheme = vuetifyTheme.global.name.value === 'light' ? 'dark' : 'light';
    vuetifyTheme.global.name.value = newTheme;
    
    if (import.meta.client) {
      localStorage.setItem('theme', newTheme);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme.value === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const initTheme = () => {
    if (import.meta.client) {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = (savedTheme || (prefersDark ? 'dark' : 'light')) as 'light' | 'dark';

      vuetifyTheme.global.name.value = initialTheme;
      document.documentElement.setAttribute('data-theme', initialTheme);
    }
  };

  // 监听Vuetify主题变化，同步data-theme属性
  watch(() => vuetifyTheme.global.name.value, (newTheme) => {
    if (import.meta.client) {
      document.documentElement.setAttribute('data-theme', newTheme);
    }
  });

  if (import.meta.client) {
    initTheme();
  }

  return {
    theme: computed(() => vuetifyTheme.global.name.value as 'light' | 'dark'),
    toggleTheme,
  };
};