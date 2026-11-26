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
        <div class="d-flex flex-column ga-2">
          <a
            v-for="videoUrl in tutorialVideoUrls"
            :key="videoUrl"
            class="video-link text-body-1"
            :href="videoUrl"
            rel="noopener noreferrer"
            target="_blank"
          >
            <v-icon class="mr-1" icon="mdi-open-in-new" size="20" />
            {{ videoUrl }}
          </a>
        </div>
      </v-card-text>
    </v-card>

    <!-- 蓝图码 -->
    <v-expansion-panels v-model="openedPanels" class="mb-6" multiple variant="accordion">
      <v-expansion-panel v-for="region in blueprintRegions" :key="region.key" :value="region.key">
        <v-expansion-panel-title>
          <v-icon class="mr-2" color="success" icon="mdi-qrcode" />
          {{ region.title }}
          <v-chip class="ml-2" size="small" variant="tonal">{{ region.count }}</v-chip>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-list density="compact">
            <template v-for="(entry, index) in region.items" :key="index">
              <div
                v-if="entry.type === 'section'"
                class="blueprint-section text-subtitle-2 font-weight-bold"
              >
                {{ entry.title }}
              </div>
              <v-list-item v-else class="blueprint-item">
                <v-list-item-title class="d-flex flex-wrap align-center ga-2">
                  <v-chip class="font-weight-bold" color="primary" label variant="flat">
                    {{ entry.label }}
                  </v-chip>
                  <span class="blueprint-code">{{ entry.code }}</span>
                  <v-btn
                    :color="entry.copied ? 'success' : undefined"
                    :icon="entry.copied ? 'mdi-check' : 'mdi-content-copy'"
                    size="small"
                    variant="text"
                    @click="entry.copy(entry.code)"
                  />
                </v-list-item-title>
              </v-list-item>
            </template>
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

// 蓝图码条目：分类标题与蓝图具体条目为两种数据类型
interface BlueprintSection {
  type: 'section';
  title: string;
}

interface BlueprintCode {
  type: 'code';
  label: string;
  code: string;
}

type BlueprintEntry = BlueprintSection | BlueprintCode;

// 教学视频
const tutorialVideoUrls = [
  'https://www.bilibili.com/video/BV1DSy1zrEVw',
  'https://www.bilibili.com/video/BV1JzyBzKENg',
];

// 基地一图流图片
const images = [
  {
    url: 'https://cos.yituliu.cn/endfield/blueprints/2026-11-26/幻灯片8.JPG',
  },
  {
    url: 'https://cos.yituliu.cn/endfield/blueprints/2026-11-26/幻灯片9.JPG',
  },
  {
    url: 'https://cos.yituliu.cn/endfield/blueprints/2026-11-26/幻灯片10.JPG',
  },
  {
    url: 'https://cos.yituliu.cn/endfield/blueprints/2026-11-26/幻灯片11.JPG',
  },
  {
    url: 'https://cos.yituliu.cn/endfield/blueprints/2026-11-26/幻灯片12.JPG',
  },
  {
    url: 'https://cos.yituliu.cn/endfield/blueprints/2026-11-26/幻灯片1.JPG',
  },
  {
    url: 'https://cos.yituliu.cn/endfield/blueprints/2026-11-26/幻灯片2.JPG',
  },
  {
    url: 'https://cos.yituliu.cn/endfield/blueprints/2026-11-26/幻灯片4.JPG',
  },
];

const cnEntries: BlueprintEntry[] = [
  { type: 'section', title: '武陵最终毕业产线' },
  { type: 'code', label: '1.7武陵城1', code: 'EF01u28U5eA6A07oAoOU' },
  { type: 'code', label: '1.7武陵城2', code: 'EF01ao6532OeOAiEoe5e' },
  { type: 'code', label: '1.7武陵城3', code: 'EF018OIe2A707192UI73' },
  { type: 'code', label: '1.7武陵城4', code: 'EF013Eo74iU9Ua590579' },
  { type: 'code', label: '1.7景玉谷1', code: 'EF01A67ua8I4IEAi91eO' },
  { type: 'code', label: '1.7景玉谷2', code: 'EF01E750A1939o8O3uIa' },
  { type: 'code', label: '首墩缘缘庄做菜', code: 'EF01u28U5eA6A0OiAoOU' },
  { type: 'code', label: '1.7应龙关1', code: 'EF018OIe2A70713iUI73' },
  { type: 'code', label: '1.7应龙关2', code: 'EF015i2179aoau70eIoe' },
  { type: 'code', label: '1.7旧水坝1', code: 'EF0170i86I3E352aO0Ai' },
  { type: 'code', label: '1.7旧水坝2', code: 'EF016u02oO4A47iEO83e' },
  { type: 'code', label: '1.7旧水坝3', code: 'EF01I43AO7i1i9o85o08' },
  { type: 'code', label: '1.7旧水坝4', code: 'EF013Eo74iU9Ua5O0579' },
  { type: 'code', label: '赤铜零件模块', code: 'EF0170i86I3E35I7O0Ai' },
  { type: 'code', label: '赫铜零件模块', code: 'EF0170i86I3E352IO0Ai' },
  { type: 'code', label: '赤铜耐压罐模块', code: 'EF01A67ua8I4IE539ieO' },
  { type: 'code', label: '瓶装液化重息壤模块', code: 'EF018OIe2A7071o2UI73' },
  { type: 'section', title: '重建禁区活动产线' },
  { type: 'code', label: '1.7 一阶段', code: 'EF01u28U5eA6A078AoOU' },
  { type: 'code', label: '1.7 二阶段', code: 'EF0170i86I3E35o4O0Ai' },
  { type: 'code', label: '1.7 一二阶段合订本', code: 'EF013Eo74iU9UaO10579' },
  { type: 'code', label: '1.7 三四阶段 1', code: 'EF01eaAo9u8O8448oAi8' },
  { type: 'code', label: '1.7 三四阶段 2', code: 'EF018OIe2A707149UI73' },
];

// 亚服蓝图码
const asiaEntries: BlueprintEntry[] = [
  { type: 'section', title: '武陵最终毕业产线' },
  { type: 'code', label: '1.7武陵城1', code: 'EFO01a65I1U3E6A9Uoe5e' },
  { type: 'code', label: '1.7武陵城2', code: 'EFO019aE80iI4aeAO5uI2' },
  { type: 'code', label: '1.7武陵城3', code: 'EFO01521A43702u16eIoe' },
  { type: 'code', label: '1.7武陵城4', code: 'EFO01I3A2u0Oe39765o08' },
  { type: 'code', label: '1.7景玉谷1', code: 'EFO0101OoaAu21iA2E179' },
  { type: 'code', label: '1.7景玉谷2', code: 'EFO01eAo1i293A4a9oAi8' },
  { type: 'code', label: '首墩缘缘庄做菜', code: 'EFO0101OoaAu21i19E179' },
  { type: 'code', label: '1.7应龙关1', code: 'EFO01194u678O9U2u34O7' },
  { type: 'code', label: '1.7应龙关2', code: 'EFO01194u678O9Uii34O7' },
  { type: 'code', label: '1.7旧水坝1', code: 'EFO018Ie5o62UI12eUI73' },
  { type: 'code', label: '1.7旧水坝2', code: 'EFO01O4ai5uU94I359oe4' },
  { type: 'code', label: '1.7旧水坝3', code: 'EFO019aE80iI4aeA45uI2' },
  { type: 'code', label: '1.7旧水坝4', code: 'EFO01a65I1U3E6A90oe5e' },
  { type: 'code', label: '赤铜零件模块', code: 'EFO0101OoaAu21i10E179' },
  { type: 'code', label: '赫铜零件模块', code: 'EFO01O4ai5uU94I319oe4' },
  { type: 'code', label: '赤铜耐压罐模块', code: 'EFO01Ue30751IeOE87Oa8' },
  { type: 'code', label: '瓶装液化重息壤模块', code: 'EFO0160239eo507UuO83e' },
  { type: 'section', title: '重建禁区活动产线' },
  { type: 'code', label: '1.7 一阶段', code: 'EFO01194u678O9U134O7' },
  { type: 'code', label: '1.7 二阶段', code: 'EFO019aE80iI4ae75uI2' },
  { type: 'code', label: '1.7 一二阶段合订本', code: 'EFO01a65I1U3E6AAoe5e' },
  { type: 'code', label: '1.7 三四阶段 1', code: 'EFO0160239eo5076O83e' },
  { type: 'code', label: '1.7 三四阶段 2', code: 'EFO0101OoaAu21i1oE179' },
];

// 欧美服蓝图码
const euUsEntries: BlueprintEntry[] = [
  { type: 'section', title: '武陵最终毕业产线' },
  { type: 'code', label: '1.7武陵城1', code: 'EFO01o08E8730E65IieO' },
  { type: 'code', label: '1.7武陵城2', code: 'EFO01iOe0e87O02u72U4' },
  { type: 'code', label: '1.7武陵城3', code: 'EFO01iOe0e87O02o072U4' },
  { type: 'code', label: '1.7武陵城4', code: 'EFO0136u4uAI64ai0579' },
  { type: 'code', label: '1.7景玉谷1', code: 'EFO0172U6UuA2658EO0Ai' },
  { type: 'code', label: '1.7景玉谷2', code: 'EFO01u1I5Iio150aaAoOU' },
  { type: 'code', label: '首墩缘缘庄做菜', code: 'EFO01A5iaioe5aEIe9ieO' },
  { type: 'code', label: '1.7应龙关1', code: 'EFO01IaoOoe8aO9795o08' },
  { type: 'code', label: '1.7应龙关2', code: 'EFO0158O7O0E87u9AeIoe' },
  { type: 'code', label: '1.7旧水坝1', code: 'EFO016i1o15aio71oO83e' },
  { type: 'code', label: '1.7旧水坝2', code: 'EFO012I4i415Ii858eIOo' },
  { type: 'code', label: '1.7旧水坝3', code: 'EFO01IaoOoe8aO9745o08' },
  { type: 'code', label: '1.7旧水坝4', code: 'EFO011ea8aO0e8U2434O7' },
  { type: 'code', label: '赤铜零件模块', code: 'EFO01o08E8730E632IieO' },
  { type: 'code', label: '赫铜零件模块', code: 'EFO01u1I5Iio150aUAoOU' },
  { type: 'code', label: '赤铜耐压罐模块', code: 'EFO0172U6UuA26550O0Ai' },
  { type: 'code', label: '瓶装液化重息壤模块', code: 'EFO0158O7O0E87uaoeIoe' },
  { type: 'section', title: '重建禁区活动产线' },
  { type: 'code', label: '1.7 一阶段', code: 'EFO01IaoOoe8aO9a5o08' },
  { type: 'code', label: '1.7 二阶段', code: 'EFO01IaoOoe8aO965o08' },
  { type: 'code', label: '1.7 一二阶段合订本', code: 'EFO011ea8aO0e8Ue34O7' },
  { type: 'code', label: '1.7 三四阶段 1', code: 'EFO0158O7O0E87u8eIoe' },
  { type: 'code', label: '1.7 三四阶段 2', code: 'EFO01iOe0e87O02872U4' },
];

interface BlueprintRegion {
  key: 'cn' | 'asia' | 'eu-us';
  title: string;
  entries: BlueprintEntry[];
}

const openedPanels = ref<string[]>(['cn']);

const blueprintRegions = ref(
  (
    [
      { key: 'cn', title: '国服蓝图码', entries: cnEntries },
      { key: 'asia', title: '亚服蓝图码', entries: asiaEntries },
      { key: 'eu-us', title: '欧美服蓝图码', entries: euUsEntries },
    ] as BlueprintRegion[]
  ).map((region) => ({
    ...region,
    count: region.entries.filter((entry) => entry.type === 'code').length,
    items: region.entries.map((entry) =>
      entry.type === 'code' ? { ...entry, ...useClipboard() } : entry,
    ),
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

.blueprint-section {
  margin: 16px 0 4px;
  color: rgba(var(--v-theme-primary), 0.9);
  border-left: 3px solid rgb(var(--v-theme-primary));
  padding-left: 8px;
}

.blueprint-section:first-child {
  margin-top: 0;
}

.blueprint-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.04);
}
</style>
