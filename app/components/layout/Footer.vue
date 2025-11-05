<template>
  <footer class="app-footer">
    <!-- 装饰背景 -->
    <div class="footer-bg-decorator"></div>
    
    <!-- 顶部装饰条 -->
    <div class="footer-top-decoration"></div>
    
    <!-- 版权信息 -->
    <div class="footer-content">
      <div class="footer-title">{{ $t('footer.copyrightTitle') }}</div>
      <div class="footer-text">
        <p>{{ $t('footer.copyrightText1') }}</p>
        <p>
          {{ $t('footer.copyrightText2') }}
          <a 
            href="https://creativecommons.org/licenses/by-nc/4.0/deed.zh" 
            target="_blank" 
            rel="noopener noreferrer"
            class="footer-link"
          >
            {{ $t('footer.copyrightLink') }}
          </a>
          {{ $t('footer.copyrightText3') }}
        </p>
        <p>
          {{ $t('footer.copyrightText4') }}
          <a 
            href="https://jq.qq.com/?_wv=1027&k=ZmORnr5F" 
            target="_blank" 
            rel="noopener noreferrer"
            class="footer-link"
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
        src="#"
        alt="备案图标" 
        class="beian-icon"
        @error="handleImageError"
      />
      <a 
        href="https://beian.miit.gov.cn/" 
        target="_blank" 
        rel="noopener noreferrer"
        class="beian-link"
      >
        {{ $t('footer.beian') }}
      </a>
    </div>
  </footer>
</template>

<script setup lang="ts">
const handleImageError = (event: Event) => {
  // 如果备案图标加载失败，隐藏图片元素
  const target = event.target as HTMLImageElement
  if (target) {
    target.style.display = 'none'
  }
}
</script>

<style scoped>
.app-footer {
  background-color: var(--theme-bg-secondary);
  border-top: 2px solid var(--theme-accent-color);
  padding: 2.5rem 3.75rem;
  position: relative;
  overflow: hidden;
  margin-top: auto;
}

/* 装饰背景 - 斜条纹 */
.footer-bg-decorator {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: linear-gradient(
    -45deg,
    transparent,
    transparent 13.9512529279%,
    var(--theme-decorative-overlay-medium) 0,
    var(--theme-decorative-overlay-medium) 36.0487470721%,
    transparent 0,
    transparent 63.9512529279%,
    var(--theme-decorative-overlay-medium) 0,
    var(--theme-decorative-overlay-medium) 86.0487470721%,
    transparent 0,
    transparent
  );
  background-size: 0.5rem 0.5rem;
  opacity: 0.5;
  pointer-events: none;
}

/* 顶部装饰条 */
.footer-top-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 0.375rem;
  background-color: var(--theme-accent-color);
  opacity: 0.8;
  box-shadow: 0 0 0.5rem var(--theme-accent-color);
}

.footer-top-decoration::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(
    -45deg,
    transparent,
    transparent 13.9512529279%,
    var(--theme-decorative-overlay-strong) 0,
    var(--theme-decorative-overlay-strong) 36.0487470721%,
    transparent 0,
    transparent 63.9512529279%,
    var(--theme-decorative-overlay-strong) 0,
    var(--theme-decorative-overlay-strong) 86.0487470721%,
    transparent 0,
    transparent
  );
  background-size: 0.5rem 0.5rem;
}

/* 版权信息 */
.footer-content {
  position: relative;
  margin-bottom: 2rem;
  z-index: 1;
}

.footer-title {
  font-size: var(--font-size-base);
  color: var(--theme-text-primary);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
}

.footer-text {
  position: relative;
  z-index: 1;
}

.footer-text p {
  font-size: var(--font-size-sm);
  color: var(--theme-text-secondary);
  line-height: 1.75;
  margin-bottom: 1rem;
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
  gap: 0.75rem;
  position: relative;
  z-index: 1;
  margin-top: 2rem;
}

.beian-icon {
  width: 1.25rem;
  height: 1.25rem;
  object-fit: contain;
  filter: drop-shadow(0 0 0.25rem var(--theme-accent-color));
}

.beian-link {
  font-size: var(--font-size-sm);
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
    padding: 1.5rem;
  }
}
</style>

