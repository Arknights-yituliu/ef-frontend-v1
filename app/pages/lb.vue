<script setup lang="ts">
definePageMeta({
  layout: 'default',
});

useHead({
  title: '隐藏页面入口',
});

const hiddenPages = [
  {
    title: '版本资源作图',
    description: '用于自定义版本资源统计图内容、KV 与展示文案。',
    path: '/tools/version-reward-diy',
    icon: 'mdi-image-edit',
  },
];
</script>

<template>
  <v-container class="hidden-page-hub">
    <section class="hub-header">
      <div class="hub-kicker">LAB</div>
      <h1 class="hub-title">隐藏页面入口</h1>
      <p class="hub-description">这里集中放置不展示在侧边栏中的调试、作图与临时工具页面。</p>
    </section>

    <section class="hidden-links">
      <NuxtLink
        v-for="page in hiddenPages"
        :key="page.path"
        class="hidden-link"
        :to="page.path"
      >
        <span class="link-icon">
          <v-icon size="28">{{ page.icon }}</v-icon>
        </span>
        <span class="link-body">
          <span class="link-title">{{ page.title }}</span>
          <span class="link-path">{{ page.path }}</span>
          <span class="link-description">{{ page.description }}</span>
        </span>
        <v-icon class="link-arrow" size="24">mdi-arrow-right</v-icon>
      </NuxtLink>
    </section>
  </v-container>
</template>

<style scoped>
.hidden-page-hub {
  width: min(100%, 960px);
  padding-top: 4rem;
  padding-bottom: 4rem;
}

.hub-header {
  margin-bottom: 2rem;
}

.hub-kicker {
  width: fit-content;
  margin-bottom: 0.75rem;
  padding: 0.2rem 0.55rem;
  border: 1px solid var(--theme-border-active);
  color: var(--theme-text-secondary);
  font-size: var(--font-size-xs);
  font-weight: 700;
  line-height: 1.4;
}

.hub-title {
  margin: 0;
  color: var(--theme-text-primary);
  font-size: clamp(2rem, 6vw, 4rem);
  font-weight: 800;
  line-height: 1.05;
}

.hub-description {
  max-width: 42rem;
  margin: 1rem 0 0;
  color: var(--theme-text-secondary);
  font-size: var(--font-size-md);
  line-height: 1.8;
}

.hidden-links {
  display: grid;
  gap: 1rem;
}

.hidden-link {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1rem;
  min-height: 6.5rem;
  padding: 1.25rem;
  border: 1px solid var(--theme-border);
  border-radius: 8px;
  background-color: var(--theme-glass-bg);
  color: var(--theme-text-primary);
  text-decoration: none;
  box-shadow: 0 0.5rem 1.5rem var(--theme-shadow-accent);
  transition:
    border-color var(--transition-base),
    background-color var(--transition-base),
    transform var(--transition-base),
    box-shadow var(--transition-base);
}

.hidden-link:hover {
  border-color: var(--theme-border-active);
  background-color: var(--theme-glass-bg-hover);
  box-shadow: 0 0.75rem 2rem var(--theme-shadow-accent-hover);
  transform: translateY(-2px);
}

.link-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.25rem;
  height: 3.25rem;
  border: 1px solid var(--theme-border);
  border-radius: 8px;
  background-color: var(--theme-bg-tertiary);
  color: var(--theme-text-primary);
}

.link-body {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.3rem;
}

.link-title {
  font-size: var(--font-size-lg);
  font-weight: 700;
  line-height: 1.3;
}

.link-path {
  color: var(--theme-text-tertiary);
  font-family: monospace;
  font-size: var(--font-size-sm);
  overflow-wrap: anywhere;
}

.link-description {
  color: var(--theme-text-secondary);
  font-size: var(--font-size-sm);
  line-height: 1.6;
}

.link-arrow {
  color: var(--theme-text-secondary);
  transition: transform var(--transition-base);
}

.hidden-link:hover .link-arrow {
  transform: translateX(0.25rem);
}

@media screen and (max-width: 600px) {
  .hidden-page-hub {
    padding-top: 2rem;
    padding-bottom: 2rem;
  }

  .hidden-link {
    grid-template-columns: auto 1fr;
    align-items: flex-start;
  }

  .link-arrow {
    display: none;
  }
}
</style>
