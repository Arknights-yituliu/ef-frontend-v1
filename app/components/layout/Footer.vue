<template>
  <v-footer class="app-footer">
    <!-- 顶部装饰条 -->
    <div class="footer-top-decoration" />

    <!-- 版权信息 -->
    <div class="footer-content">
      <div class="footer-title">{{ $t('footer.copyrightTitle') }}</div>
      <div class="footer-text">
        <p>{{ $t('footer.copyrightText1') }}</p>
        <p>
          {{ $t('footer.copyrightText2') }}
          <a
            class="footer-link"
            href="https://creativecommons.org/licenses/by-nc/4.0/deed.zh"
            rel="noopener noreferrer"
            target="_blank"
          >
            {{ $t('footer.copyrightLink') }}
          </a>
          {{ $t('footer.copyrightText3') }}
        </p>
        <p>
          {{ $t('footer.copyrightText4') }}
          <a
            class="footer-link"
            href="https://qm.qq.com/cgi-bin/qm/qr?k=zuIC56a53O_-xpNk06eAJXrxjlJruD6f"
            rel="noopener noreferrer"
            target="_blank"
          >
            {{ $t('footer.developmentGroup') }}
          </a>
          {{ $t('footer.copyrightText5') }}
        </p>
      </div>
    </div>

    <!-- 备案信息 -->
    <div class="footer-beian">
      <img
        alt="备案图标"
        class="beian-icon"
        src="/images/website-record.png"
        @error="handleImageError"
      />
      <a
        class="beian-link"
        href="https://beian.miit.gov.cn/"
        rel="noopener noreferrer"
        target="_blank"
      >
        {{ $t('footer.beian') }}
      </a>
    </div>
  </v-footer>
</template>

<script setup lang="ts">
function handleImageError(event: Event) {
  // 如果备案图标加载失败，隐藏图片元素
  const target = event.target as HTMLImageElement;
  if (target) {
    target.style.display = 'none';
  }
}
</script>

<style scoped>
.app-footer {
  display: block;
  background-color: var(--theme-bg-secondary);
  border-top: 2px solid var(--theme-accent-color);
  padding: 1.5rem 1rem;
  position: relative;
  overflow: hidden;
  margin-top: auto;
}

/* 顶部装饰条 */
.footer-top-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 0.25rem;
  background-color: var(--theme-accent-color);
  opacity: 0.8;
  box-shadow: 0 0 0.5rem var(--theme-accent-color);
}

/* 版权信息 */
.footer-content {
  position: relative;
  margin-bottom: 1rem;
  z-index: 1;
}

.footer-title {
  font-size: 0.875rem;
  color: var(--theme-text-primary);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.footer-text {
  position: relative;
  z-index: 1;
}

.footer-text p {
  font-size: 0.8125rem;
  color: var(--theme-text-secondary);
  line-height: 1.5;
  margin-bottom: 0.5rem;
}

.footer-text p:last-child {
  margin-bottom: 0;
}

.footer-link {
  color: var(--theme-text-primary);
  text-decoration: none;
  font-weight: 500;
  transition: all var(--transition-fast);
  border-bottom: 1px solid transparent;
  position: relative;
}

.footer-link:hover {
  color: var(--theme-text-primary);
  border-bottom-color: var(--theme-accent-color);
  text-shadow: 0 0 0.5rem var(--theme-shadow-accent-strong);
}

.footer-link::after {
  content: '';
  position: absolute;
  bottom: -0.125rem;
  left: 0;
  width: 0;
  height: 1px;
  background-color: var(--theme-accent-color);
  transition: width var(--transition-fast);
}

.footer-link:hover::after {
  width: 100%;
}

/* 备案信息 */
.footer-beian {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  position: relative;
  z-index: 1;
  margin-top: 1rem;
}

.beian-icon {
  width: 1rem;
  height: 1rem;
  object-fit: contain;
  filter: drop-shadow(0 0 0.25rem var(--theme-accent-color));
}

.beian-link {
  font-size: 0.8125rem;
  color: var(--theme-text-secondary);
  text-decoration: none;
  transition: all var(--transition-fast);
  font-weight: 500;
}

.beian-link:hover {
  color: var(--theme-text-primary);
  text-shadow: 0 0 0.5rem var(--theme-shadow-accent-strong);
}

@media (orientation: portrait) {
  .app-footer {
    padding: 1rem;
  }
}
</style>
