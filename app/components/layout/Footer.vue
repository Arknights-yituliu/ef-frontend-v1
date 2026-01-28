<template>
  <v-footer class="app-footer">
    <!-- 顶部装饰条 -->
    <div class="footer-top-decoration" />

    <!-- 版权信息容器 -->
    <div class="footer-content">
      <!-- 版权声明标题 -->
      <!-- <div class="footer-section">
        <div class="footer-title">{{ $t('footer.copyrightTitle') }}</div>
      </div> -->

      <!-- 版权声明内容 -->
      <div class="footer-section">
        <!-- <div class="section-label">{{ $t('footer.copyrightNotice') }}</div> -->
        <div class="section-text">
          {{ $t('footer.copyrightText1') }}
        </div>
      </div>

      <!-- 许可协议 -->
      <div class="footer-section">
        <!-- <div class="section-label">{{ $t('footer.license') }}</div> -->
        <div class="section-text">
          {{ $t('footer.copyrightText2') }}
          <a
            href="https://creativecommons.org/licenses/by-nc/4.0/deed.zh"
            target="_blank"
            rel="noopener noreferrer"
            class="license-link"
          >
            {{ $t('footer.copyrightLink') }}
          </a>
        </div>
        <div class="section-text license-terms" v-html="licenseTermsHtml" />
      </div>

      <!-- 社区参与 -->
      <div class="footer-section">
        <!-- <div class="section-label">{{ $t('footer.community') }}</div> -->
        <div class="section-text">
          {{ $t('footer.copyrightText4') }}
          <a
            href="https://qm.qq.com/cgi-bin/qm/qr?k=zuIC56a53O_-xpNk06eAJXrxjlJruD6f"
            target="_blank"
            rel="noopener noreferrer"
            class="community-link"
          >
            {{ $t('footer.developmentGroup') }}
          </a>
          {{ $t('footer.copyrightText5') }}
        </div>
      </div>

      <!-- 备案信息 -->
      <div class="footer-beian">
        <img
          src="/images/website-record.png"
          alt="备案图标"
          class="beian-icon"
          @error="handleImageError"
        >
        <a
          href="https://beian.miit.gov.cn/"
          target="_blank"
          rel="noopener noreferrer"
          class="beian-link"
        >
          {{ $t('footer.beian') }}
        </a>
      </div>
    </div>
  </v-footer>
</template>

<script setup lang="ts">
const { locale } = useI18n();

const handleImageError = (event: Event) => {
  // 如果备案图标加载失败，隐藏图片元素
  const target = event.target as HTMLImageElement;
  if (target) {
    target.style.display = 'none';
  }
};

// 生成包含平台链接的许可协议 HTML
const licenseTermsHtml = computed(() => {
  if (locale.value === 'zh-CN') {
    return '进行许可。转载、公开或以任何形式复制、发行、再传播本页任何内容时，必须注明从终末地一图流转载，并提供版权标识、许可协议标识、免责标识和直接指向被引用页面的链接；且如果上述行为发生在包括但不限于<a href="https://space.bilibili.com/354661246" target="_blank" rel="noopener noreferrer" class="license-link">BiliBili</a>、<a href="https://www.skland.com/profile?id=3679911155887" target="_blank" rel="noopener noreferrer" class="license-link">森空岛</a>、<a href="https://v.douyin.com/xv9ONpQ8Xsw/" target="_blank" rel="noopener noreferrer" class="license-link">抖音</a>、<a href="https://www.xiaohongshu.com/user/profile/67c985a1000000000e0116b1" target="_blank" rel="noopener noreferrer" class="license-link">小红书</a>、<a href="https://www.taptap.cn/user/756425677" target="_blank" rel="noopener noreferrer" class="license-link">TapTap</a>等平台时，必须提供指向@逻辑元LogicalByte主页的有效链接；且未经许可不得将本站内容或由其衍生作品用于商业目的。';
  }
  // 英文版本（保持原样，不添加平台链接）
  return '. When reposting, publishing, or reproducing, distributing, or redistributing any content on this page in any form, you must indicate that it is reposted from Arknights EndField Yituliu, and provide copyright identification, license agreement identification, disclaimer identification, and a direct link to the referenced page; and you may not use the content of this site or its derivative works for commercial purposes without permission.';
});
</script>

<style scoped>
.app-footer {
  display: block;
  background-color: var(--theme-bg-secondary);
  border-top: 2px solid var(--theme-accent-color);
  padding: 1rem 1.5rem 0.75rem 1.5rem;
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
  background: linear-gradient(90deg, 
    var(--theme-accent-color) 0%, 
    var(--theme-accent-color) 100%);
  opacity: 0.8;
  box-shadow: 0 0 0.5rem var(--theme-accent-color);
}

/* 内容容器 */
.footer-content {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
}

/* 版权声明标题 */
.footer-section {
  margin-bottom: 0.75rem;
}

.footer-title {
  font-size: 0.875rem;
  color: var(--theme-text-primary);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
  padding-bottom: 0.25rem;
  border-bottom: 2px solid var(--theme-accent-color);
  display: inline-block;
}

/* 分区标签 */
.section-label {
  font-size: 0.8125rem;
  color: var(--theme-text-primary);
  font-weight: 600;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
}

.section-label::before {
  content: '';
  display: inline-block;
  width: 0.1875rem;
  height: 0.75rem;
  background-color: var(--theme-accent-color);
  margin-right: 0.375rem;
  border-radius: 0.125rem;
  box-shadow: 0 0 0.25rem var(--theme-accent-color);
}

/* 分区文本 */
.section-text {
  font-size: 0.75rem;
  color: var(--theme-text-secondary);
  line-height: 1.4;
  margin-bottom: 0.25rem;
  padding-left: 0.5rem;
}

.section-text:last-child {
  margin-bottom: 0;
}

.license-terms {
  font-style: italic;
  opacity: 0.9;
}

/* 许可协议链接 */
.license-link {
  color: var(--theme-accent-color);
  text-decoration: none;
  font-weight: 600;
  transition: all var(--transition-fast);
  border-bottom: 1px solid var(--theme-accent-color);
  position: relative;
  display: inline-block;
}

.license-link:hover {
  color: var(--theme-text-primary);
  background-color: rgba(var(--theme-accent-color-rgb), 0.1);
  padding: 0.125rem 0.25rem;
  margin: -0.125rem -0.25rem;
  text-shadow: 0 0 0.5rem var(--theme-accent-color);
  box-shadow: 0 0 0.5rem var(--theme-shadow-accent-strong);
}

/* 社区链接 */
.community-link {
  color: var(--theme-text-primary);
  text-decoration: none;
  font-weight: 600;
  transition: all var(--transition-fast);
  border-bottom: 1px solid transparent;
  position: relative;
}

.community-link:hover {
  color: var(--theme-accent-color);
  border-bottom-color: var(--theme-accent-color);
  text-shadow: 0 0 0.5rem var(--theme-accent-color);
}

/* 备案信息 */
.footer-beian {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  position: relative;
  z-index: 1;
  margin-top: 0.75rem;
  padding-top: 0.5rem;
  border-top: 1px solid var(--theme-accent-color);
  opacity: 0.8;
}

.beian-icon {
  width: 1rem;
  height: 1rem;
  object-fit: contain;
  filter: drop-shadow(0 0 0.25rem var(--theme-accent-color));
}

.beian-link {
  font-size: 0.75rem;
  color: var(--theme-text-secondary);
  text-decoration: none;
  transition: all var(--transition-fast);
  font-weight: 500;
}

.beian-link:hover {
  color: var(--theme-text-primary);
  text-shadow: 0 0 0.5rem var(--theme-shadow-accent-strong);
}

/* 响应式设计 */
@media (orientation: portrait) {
  .app-footer {
    padding: 0.75rem 1rem 0.5rem 1rem;
  }

  .footer-title {
    font-size: 0.8125rem;
  }

  .section-label {
    font-size: 0.75rem;
  }

  .section-text {
    font-size: 0.6875rem;
    line-height: 1.3;
  }
}
</style>