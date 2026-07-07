<script lang="ts" setup></script>

<template>
  <v-card class="home-card">
    <div class="home-card-header">
      <div class="home-card-title">
        <img
          alt="Endfield Lab Logo"
          class="home-card-title-icon"
          src="https://factory.ef.yituliu.cn/favicon-32x32.png"
        />
        <b>{{ $t('component.home.endfieldLab.endfieldLab') }}</b>
      </div>
      <div class="flex-1" />
      <v-btn
        append-icon="mdi-open-in-new"
        color="primary"
        href="https://factory.ef.yituliu.cn/"
        prepend-icon="mdi-web"
        size="small"
        target="_blank"
        :text="$t('component.home.endfieldLab.goToEndfieldLab')"
      />
    </div>
    <div class="home-card-content">
      <p class="mb-3">{{ $t('component.home.endfieldLab.description') }}</p>
      <div class="video-container">
        <iframe
          allowfullscreen="true"
          border="0"
          frameborder="no"
          framespacing="0"
          scrolling="no"
          src="//player.bilibili.com/player.html?autoplay=false&isOutside=true&aid=115783980156084&bvid=BV1XNBYBkE8f&cid=34986264090&p=1"
        />
      </div>
    </div>
  </v-card>
</template>

<style scoped>
.video-container {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 aspect ratio */
  border-radius: var(--radius-md);
  overflow: hidden;
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
