<script lang="ts" setup></script>

<template>
  <v-card class="card">
    <v-card-title>
      <header class="card-title">
        <img
          alt="Endfield Lab Logo"
          class="card-title-icon"
          src="https://factory.ef.yituliu.cn/favicon-32x32.png"
        />
        <b>{{ $t('component.home.endfieldLab.endfieldLab') }}</b>
        <div class="flex-1" />
        <v-btn
          :text="$t('component.home.endfieldLab.goToEndfieldLab')"
          append-icon="mdi-open-in-new"
          color="primary"
          prepend-icon="mdi-web"
          href="https://factory.ef.yituliu.cn/"
          target="_blank"
        />
      </header>
    </v-card-title>
    <v-card-text>
      {{ $t('component.home.endfieldLab.description') }}
      <v-responsive :aspect-ratio="16 / 9" class="mt-4">
        <iframe
          class="w-100 h-100 rounded-lg"
          src="//player.bilibili.com/player.html?autoplay=false&isOutside=true&aid=115783980156084&bvid=BV1XNBYBkE8f&cid=34986264090&p=1"
          scrolling="no"
          border="0"
          frameborder="no"
          framespacing="0"
          allowfullscreen="true"
        />
      </v-responsive>
    </v-card-text>
  </v-card>
</template>

<style scoped></style>
