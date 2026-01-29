<template>
  <div class="test-container">
    <h1>测试页面 - 文字颜色验证</h1>

    <div class="test-section">
      <h2>主要文字颜色 (var(--theme-text-primary))</h2>
      <p class="text-primary">这是主要文字颜色的测试文本，应该显示为深色（明色主题）或浅色（暗色主题）</p>
    </div>

    <div class="test-section">
      <h2>次要文字颜色 (var(--theme-text-secondary))</h2>
      <p class="text-secondary">这是次要文字颜色的测试文本，应该比主要文字颜色稍浅</p>
    </div>

    <div class="test-section">
      <h2>第三级文字颜色 (var(--theme-text-tertiary))</h2>
      <p class="text-tertiary">这是第三级文字颜色的测试文本，应该更浅</p>
    </div>

    <div class="test-section">
      <h2>辅助文字颜色 (var(--theme-text-light))</h2>
      <p class="text-light">这是辅助文字颜色的测试文本，应该是最浅的</p>
    </div>

    <div class="test-section">
      <h2>禁用文字颜色 (var(--theme-text-disabled))</h2>
      <p class="text-disabled">这是禁用文字颜色的测试文本</p>
    </div>

    <div class="test-section">
      <h2>强调色文字 (var(--theme-accent-color))</h2>
      <p class="text-accent">这是强调色文字的测试文本，应该突出显示</p>
    </div>

    <div class="test-section">
      <h2>不同字体大小测试</h2>
      <p style="font-size: 1rem; color: var(--theme-text-primary);">1rem - 标准大小</p>
      <p style="font-size: 1.125rem; color: var(--theme-text-secondary);">1.125rem - 稍大</p>
      <p style="font-size: 1.5rem; color: var(--theme-text-primary);">1.5rem - 更大</p>
      <p style="font-size: 2rem; color: var(--theme-text-tertiary);">2rem - 大号</p>
      <p style="font-size: 3rem; color: var(--theme-accent-color);">3rem - 特大</p>
    </div>

    <div class="test-section">
      <h2>背景色测试</h2>
      <p class="bg-primary">主要背景色 (var(--theme-bg-primary))</p>
      <p class="bg-secondary">次要背景色 (var(--theme-bg-secondary))</p>
      <p class="bg-tertiary">第三背景色 (var(--theme-bg-tertiary))</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// 测试页面 - 用于验证主题系统的文字颜色
</script>

<style scoped>
.test-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.test-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  border: 1px solid var(--theme-border);
  border-radius: 0.5rem;
  background-color: var(--theme-bg-secondary);
}

.test-section h2 {
  margin-bottom: 1rem;
  color: var(--theme-text-primary);
}

/* 文字颜色测试 */
.text-primary {
  color: var(--theme-text-primary);
}

.text-secondary {
  color: var(--theme-text-secondary);
}

.text-tertiary {
  color: var(--theme-text-tertiary);
}

.text-light {
  color: var(--theme-text-light);
}

.text-disabled {
  color: var(--theme-text-disabled);
}

.text-accent {
  color: var(--theme-accent-color);
}

/* 背景色测试 */
.bg-primary {
  padding: 1rem;
  margin-bottom: 0.5rem;
  background-color: var(--theme-bg-primary);
  color: var(--theme-text-primary);
}

.bg-secondary {
  padding: 1rem;
  margin-bottom: 0.5rem;
  background-color: var(--theme-bg-secondary);
  color: var(--theme-text-primary);
}

.bg-tertiary {
  padding: 1rem;
  background-color: var(--theme-bg-tertiary);
  color: var(--theme-text-primary);
}
</style>