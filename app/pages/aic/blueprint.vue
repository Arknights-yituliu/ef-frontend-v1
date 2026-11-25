<template>
  <v-container class="page-container" fluid>
    <!-- 页面标题 -->
    <div class="page-header mb-6">
      <h1 class="page-title">「穿越甚大蘑境与你相逢」毕业蓝图</h1>
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
        <a
          class="video-link text-body-1"
          href="https://www.bilibili.com/video/BV1JzyBzKENg"
          rel="noopener noreferrer"
          target="_blank"
        >
          <v-icon class="mr-1" icon="mdi-open-in-new" size="20" />
          https://www.bilibili.com/video/BV1JzyBzKENg
        </a>
      </v-card-text>
    </v-card>

    <!-- 蓝图码 -->
    <v-expansion-panels v-model="openedPanels" class="mb-6" multiple variant="accordion">
      <v-expansion-panel v-for="region in blueprintRegions" :key="region.key" :value="region.key">
        <v-expansion-panel-title>
          <v-icon class="mr-2" color="success" icon="mdi-qrcode" />
          {{ region.title }}
          <v-chip class="ml-2" size="small" variant="tonal">{{ region.items.length }}</v-chip>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-list density="compact">
            <v-list-item
              v-for="({ label, code, copy, copied }, index) in region.items"
              :key="index"
              class="blueprint-item"
            >
              <v-list-item-title class="d-flex flex-wrap align-center ga-2">
                <v-chip class="font-weight-bold" color="primary" label variant="flat">
                  {{ label }}
                </v-chip>
                <span class="blueprint-code">{{ code }}</span>
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
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

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
    url: 'https://cos.yituliu.cn/endfield/blueprints/2026-10-15/幻灯片8.JPG',
  },
  {
    url: 'https://cos.yituliu.cn/endfield/blueprints/2026-09-02/幻灯片4.JPG',
  },
  {
    url: 'https://cos.yituliu.cn/endfield/blueprints/2026-10-15/幻灯片1.JPG',
  },
];

// 蓝图码列表
interface BlueprintItem {
  label: string;
  code: string;
}

const blueprints: BlueprintItem[] = [
  { label: '1.7 一阶段', code: 'EF01u28U5eA6A078AoOU' },
  { label: '1.7 二阶段', code: 'EF0170i86I3E35o4O0Ai' },
  { label: '1.7 一二阶段合订本', code: 'EF013Eo74iU9UaO10579' },
  { label: '1.4武陵城1', code: 'EF015i2179aoauU8eIoe' },
  { label: '1.4武陵城2', code: 'EF018OIe2A7071IeUI73' },
  { label: '1.4武陵城3', code: 'EF01u28U5eA6A0i6AoOU' },
  { label: '1.4景玉谷1', code: 'EF01u28U5eA6A080AoOU' },
  { label: '1.4景玉谷2', code: 'EF01ao6532OeOA71oe5e' },
  { label: '1.5应龙关1', code: 'EF01E750A1939ouE3uIa' },
  { label: '1.5应龙关2', code: 'EF01A67ua8I4IEai9ieO' },
  { label: '（多合一）1.6集成蓝图', code: 'EF01081Ou4E7Ei90E179' },
  { label: '（模块化）1.6打粉模块', code: 'EF01ao6532OeOAOioe5e' },
  { label: '（模块化）1.6灌装模块', code: 'EF015i2179aoauiEeIoe' },
  { label: '（模块化）1.6反应模块', code: 'EF018OIe2A7071a9UI73' },
  { label: '赫铜零件模块', code: 'EF01E750A1939oI43uIa' },
  { label: '赤铜零件模块', code: 'EF0170i86I3E35I7O0Ai' },
  { label: '赤铜耐压罐模块', code: 'EF01A67ua8I4IE539ieO' },
  { label: '瓶装液化重息壤', code: 'EF018OIe2A7071o2UI73' },
];

// 亚服蓝图码
const asiaBlueprints: BlueprintItem[] = [
  { label: '1.7 一阶段', code: 'EFO01194u678O9U134O7' },
  { label: '1.7 二阶段', code: 'EFO019aE80iI4ae75uI2' },
  { label: '1.7 一二阶段合订本', code: 'EFO01a65I1U3E6AAoe5e' },
];

// 欧美服蓝图码
const euUsBlueprints: BlueprintItem[] = [
  { label: '1.7 一阶段', code: 'EFO01IaoOoe8aO9a5o08' },
  { label: '1.7 二阶段', code: 'EFO01IaoOoe8aO965o08' },
  { label: '1.7 一二阶段合订本', code: 'EFO011ea8aO0e8Ue34O7' },
];

interface BlueprintRegion {
  key: 'cn' | 'asia' | 'eu-us';
  title: string;
  blueprints: BlueprintItem[];
}

const openedPanels = ref<string[]>(['cn']);

const blueprintRegions = ref(
  (
    [
      { key: 'cn', title: '国服蓝图码', blueprints },
      { key: 'asia', title: '亚服蓝图码', blueprints: asiaBlueprints },
      { key: 'eu-us', title: '欧美服蓝图码', blueprints: euUsBlueprints },
    ] as BlueprintRegion[]
  ).map((region) => ({
    ...region,
    items: region.blueprints.map((blueprint) => ({ ...blueprint, ...useClipboard() })),
  })),
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

.blueprint-code {
  font-family: var(--font-mono, monospace);
  word-break: break-all;
}

.blueprint-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.04);
}
</style>
