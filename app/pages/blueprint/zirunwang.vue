<template>
  <div class="page-container">
    <h1 class="page-title">{{ $t('page.blueprint.zirunwang.title') }}</h1>
    <p class="page-description">{{ $t('page.blueprint.zirunwang.description') }}</p>

    <v-container>
      <v-row>
          <v-col
          v-for="(card, index) in cards"
          :key="card.id"
          cols="12"
        >
          <v-card class="large-card mb-4">
            <v-card-title class="card-title">{{ card.title }}</v-card-title>
            <v-card-subtitle v-if="card.subtitle" class="card-subtitle">
              {{ card.subtitle }}
            </v-card-subtitle>
            
            <!-- 紧凑布局：段落、需求、产出全部在一行 -->
            <v-card-text>
              <!-- 段落 -->
              <div v-if="card.paragraphs && card.paragraphs.length" class="paragraphs-row">
                <div v-for="(paragraph, pIndex) in card.paragraphs" :key="pIndex" class="paragraph-item">
                  {{ paragraph }}
                </div>
              </div>
              
              <!-- 需求和产出分成两行 -->
              <!-- 第一行：需求 -->
              <div v-if="card.requirements" class="data-section">
                <div class="section-header-inline">需求</div>
                <div class="single-row">
                  <div class="compact-item">
                    <div class="compact-label">科技</div>
                    <div class="compact-value">{{ card.requirements.tech }}</div>
                  </div>
                  <div class="compact-item">
                    <div class="compact-label">基地</div>
                    <div class="compact-value">{{ card.requirements.base }}</div>
                  </div>
                  <div class="compact-item">
                    <div class="compact-label">源矿</div>
                    <div class="compact-value">{{ card.requirements.sourceOre }}</div>
                  </div>
                  <div class="compact-item">
                    <div class="compact-label">紫晶</div>
                    <div class="compact-value">{{ card.requirements.purpleCrystal }}</div>
                  </div>
                  <div class="compact-item">
                    <div class="compact-label">蓝铁</div>
                    <div class="compact-value">{{ card.requirements.blueIron }}</div>
                  </div>
                </div>
              </div>
              
              <!-- 第二行：产出 -->
              <div v-if="card.production" class="data-section">
                <div class="section-header-inline">产出</div>
                <div class="single-row">
                  <div class="compact-item">
                    <div class="compact-label">电力</div>
                    <div class="compact-value">{{ card.production.power }}</div>
                  </div>
                  <div class="compact-item">
                    <div class="compact-label">调度券</div>
                    <div class="compact-value">{{ card.production.ticket }}</div>
                  </div>
                  <div class="compact-item">
                    <div class="compact-label">物品</div>
                    <div class="compact-value">{{ card.production.item }}</div>
                  </div>
                </div>
              </div>
              
              <!-- 轮播图 -->
              <v-divider class="my-4"></v-divider>
              <div class="carousel-section">
                <div class="section-header">图片展示</div>
                <v-carousel
                  cycle
                  height="300"
                  hide-delimiter-background
                  show-arrows-on-hover
                >
                  <v-carousel-item v-for="(item, index) in carouselItems" :key="index">
                    <div class="carousel-slide" :style="{ backgroundColor: item.color }">
                      <div class="slide-content">
                        <div class="slide-title">{{ item.title }}</div>
                        <div class="slide-color">{{ item.color }}</div>
                      </div>
                    </div>
                  </v-carousel-item>
                </v-carousel>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
interface CardData {
  id: string;
  title: string;
  subtitle?: string;
  paragraphs: string[];
  requirements?: {
    tech: string;
    base: string;
    sourceOre: string;
    purpleCrystal: string;
    blueIron: string;
  };
  production?: {
    power: string;
    ticket: string;
    item: string;
  };
}

definePageMeta({
  layout: 'default',
});

const cards: CardData[] = [
  {
    id: '1',
    title: '四号谷地',
    subtitle: '这里是一个关于工业规划与资源管理的专业平台',
    paragraphs: [
      '欢迎来到个人蓝图站页面。',
      '这是一个新创建的页面，目前不在侧边栏导航中显示。',
      '您可以直接通过 URL 访问此页面，或将其链接到其他页面。'
    ],
    requirements: {
      tech: '三级科技',
      base: '四号基地',
      sourceOre: '1000',
      purpleCrystal: '500',
      blueIron: '800'
    },
    production: {
      power: '-500/小时',
      ticket: '+10/天',
      item: '基础材料'
    }
  }
];

const carouselItems = [
  {
    title: '红色主题',
    color: 'rgb(255, 0, 0)'
  },
  {
    title: '绿色主题',
    color: 'rgb(0, 255, 0)'
  },
  {
    title: '蓝色主题',
    color: 'rgb(0, 0, 255)'
  }
];
</script>

<style scoped>
.page-container {
  padding: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: var(--v-theme-primary);
}

.page-description {
  font-size: 1.1rem;
  color: var(--v-theme-on-surface-variant);
  margin-bottom: 2rem;
}

.large-card {
  padding: 1.5rem;
  margin: 2rem 0;
}

.card-title {
  font-size: 2rem;
  font-weight: bold;
  padding-bottom: 1rem;
  color: var(--v-theme-primary);
}

.card-subtitle {
  font-size: 1.1rem;
  color: var(--v-theme-on-surface-variant);
  padding-bottom: 1rem;
  opacity: 0.87;
}

.paragraphs-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.paragraph-item {
  flex: 1;
  min-width: 200px;
  padding: 0.5rem;
  background-color: var(--v-theme-surface-variant);
  border-radius: 4px;
  font-size: 0.9rem;
}

.compact-section {
  margin-top: 0.5rem;
}

.section-header-inline {
  font-size: 0.9rem;
  font-weight: bold;
  margin-right: 0.5rem;
  color: var(--v-theme-primary);
  display: inline-block;
}

.carousel-section {
  margin-top: 1.5rem;
}

.carousel-slide {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slide-content {
  text-align: center;
  color: white;
}

.slide-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.slide-color {
  font-size: 1.2rem;
  font-family: monospace;
  opacity: 0.9;
}

.section-title {
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: var(--v-theme-primary);
}

.single-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  flex-wrap: nowrap;
}

.compact-item {
  flex: 1;
  min-width: 80px;
  padding: 0.5rem;
  border: 1px solid var(--v-theme-outline);
  border-radius: 4px;
  background-color: var(--v-theme-surface-variant);
  text-align: center;
}

.compact-label {
  font-size: 0.8rem;
  color: var(--v-theme-on-surface-variant);
  margin-bottom: 0.25rem;
  opacity: 0.7;
}

.compact-value {
  font-size: 1rem;
  font-weight: bold;
  color: var(--v-theme-primary);
}
</style>
