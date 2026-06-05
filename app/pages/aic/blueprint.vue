<template>
  <v-container class="page-container" fluid>
    <!-- 页面标题 -->
    <div class="page-header mb-6">
      <h1 class="page-title">「寻遗散记」毕业蓝图</h1>
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
            href="https://www.bilibili.com/video/BV1bR7k67EaH"
            rel="noopener noreferrer"
            target="_blank"
          >
            <v-icon class="mr-1" icon="mdi-open-in-new" size="20" />
            https://www.bilibili.com/video/BV1bR7k67EaH
          </a>
        </p>
        <p>
          <a
            class="video-link text-body-1"
            href="https://www.bilibili.com/video/BV1Wn596bEHK"
            rel="noopener noreferrer"
            target="_blank"
          >
            <v-icon class="mr-1" icon="mdi-open-in-new" size="20" />
            https://www.bilibili.com/video/BV1Wn596bEHK
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

// 基地一图流图片
const images = [
  {
    url: 'https://cos.yituliu.cn/endfield/blueprints/2026-06-05/武陵城.webp',
  },
  {
    url: 'https://cos.yituliu.cn/endfield/blueprints/2026-06-05/景玉谷.webp',
  },
  {
    url: 'https://cos.yituliu.cn/endfield/blueprints/2026-06-05/首墩.webp',
  },
];

// 蓝图码列表
interface BlueprintItem {
  label: string;
  code: string;
}

const blueprints: BlueprintItem[] = [
  { label: '优质芽针针剂', code: 'EF01E750A1939oOA3uIa' },
  { label: '装备原件三合一（可选）', code: 'EF0170i86I3E3516O0Ai' },
  { label: '瓶装液化重息壤（可选）', code: 'EF01u28U5eA6A092AoOU' },
  { label: '1.2下武陵城1', code: 'EF018OIe2A707108UI73' },
  { label: '1.2下武陵城2', code: 'EF013Eo74iU9Uaoa0579' },
  { label: '1.2下武陵城3', code: 'EF0170i86I3E3515O0Ai' },
  { label: '1.2下武陵城4', code: 'EF01o5uiEUeae69uIieO' },
  { label: '1.2下景玉谷1', code: 'EF015i2179aoauIOeIoe' },
  { label: '1.2下景玉谷2', code: 'EF018OIe2A7071uOUI73' },
  { label: '1.2下首墩1', code: 'EF01o5uiEUeae699IieO' },
  { label: '1.2下首墩2', code: 'EF01eaAo9u8O845ioAi8' },
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
