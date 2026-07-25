<template>
  <v-container class="page-container" fluid>
    <!-- 页面标题 -->
    <div class="page-header mb-6">
      <h1 class="page-title">「向渊行」毕业蓝图</h1>
    </div>

    <!-- 教学视频 -->
    <v-card class="mb-6">
      <v-card-item>
        <template #prepend>
          <v-icon color="red" icon="mdi-video" size="32" />
        </template>
        <v-card-title class="text-h6 font-weight-bold">教学视频</v-card-title>
      </v-card-item>
      <v-card-text>
        <p class="mb-3">
          <a
            class="video-link text-body-1"
            href="https://www.bilibili.com/video/BV1bjKK67EVP"
            rel="noopener noreferrer"
            target="_blank"
          >
            <v-icon class="mr-1" icon="mdi-open-in-new" size="20" />
            https://www.bilibili.com/video/BV1bjKK67EVP
          </a>
        </p>
      </v-card-text>
    </v-card>

    <!-- 蓝图码 -->
    <v-card class="mb-6">
      <v-card-item>
        <template #prepend>
          <v-icon color="success" icon="mdi-qrcode" size="32" />
        </template>
        <v-card-title class="text-h6 font-weight-bold">蓝图码</v-card-title>
      </v-card-item>
      <v-divider />
      <v-list>
        <v-list-item
          v-for="({ label, code, copy, copied }, index) in blueprintsWithClipboard"
          :key="index"
          class="blueprint-item"
        >
          <v-list-item-title>
            <v-chip class="font-weight-bold" color="primary" label variant="flat">
              {{ label }}
            </v-chip>
            <span class="mx-2">{{ code }}</span>
            <v-btn
              :color="copied ? 'success' : undefined"
              :icon="copied ? 'mdi-check' : 'mdi-content-copy'"
              size="small"
              variant="text"
              @click="copy(code)"
            />
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>

    <!-- 基地一图流 -->
    <v-card class="mb-6">
      <v-card-item>
        <template #prepend>
          <v-icon color="primary" icon="mdi-image-multiple" size="32" />
        </template>
        <v-card-title class="text-h6 font-weight-bold">基地一图流</v-card-title>
      </v-card-item>
      <v-card-text>
        <v-img v-for="(image, index) in images" :key="index" cover :src="image.url" />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core';

definePageMeta({
  layout: 'default',
});

const { t } = useI18n();

usePageSeo({
  title: () => `${t('menu.blueprints')} - ${t('layout.siteName')}`,
  description: () => 'AIC blueprint showcase with downloadable images and reference codes.',
});

// 基地一图流图片
const images = [
  {
    url: 'https://cos.yituliu.cn/endfield/blueprints/2026-07-18/幻灯片1.webp',
  },
  {
    url: 'https://cos.yituliu.cn/endfield/blueprints/2026-07-18/幻灯片2.webp',
  },
  {
    url: 'https://cos.yituliu.cn/endfield/blueprints/2026-07-18/幻灯片3.webp',
  },
  {
    url: 'https://cos.yituliu.cn/endfield/blueprints/2026-07-18/幻灯片4.webp',
  },
  {
    url: 'https://cos.yituliu.cn/endfield/blueprints/2026-07-18/幻灯片7.webp',
  },
  {
    url: 'https://cos.yituliu.cn/endfield/blueprints/2026-07-18/幻灯片8.webp',
  },
];

// 蓝图码列表
interface BlueprintItem {
  label: string;
  code: string;
}

const blueprints: BlueprintItem[] = [
  { label: '1.4武陵城1', code: 'EF015i2179aoauU8eIoe' },
  { label: '1.4武陵城2', code: 'EF018OIe2A7071IeUI73' },
  { label: '1.4武陵城3', code: 'EF01u28U5eA6A0i6AoOU' },
  { label: '1.4景玉谷1', code: 'EF01u28U5eA6A080AoOU' },
  { label: '1.4景玉谷2', code: 'EF01ao6532OeOA71oe5e' },
  { label: '1.4应龙关1', code: 'EF013Eo74iU9UaI90579' },
  { label: '1.4应龙关2', code: 'EF0170i86I3E35iuO0Ai' },
  { label: '赫铜零件模块', code: 'EF01E750A1939oI43uIa' },
  { label: '赤铜零件模块', code: 'EF0170i86I3E35I7O0Ai' },
  { label: '赤铜耐压罐模块', code: 'EF01A67ua8I4IE539ieO' },
  { label: '瓶装液化重息壤', code: 'EF018OIe2A7071o2UI73' },
];

const blueprintsWithClipboard = ref(
  blueprints.map((blueprint) => ({ ...blueprint, ...useClipboard() })),
);
</script>

<style scoped>
.video-link {
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
  word-break: break-all;
}

.video-link:hover {
  text-decoration: underline;
}

.blueprint-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.04);
}
</style>
