<script lang="ts" setup></script>

<template>
  <v-card class="home-card">
    <div class="home-card-header">
      <div class="home-card-title">
        <img
          alt="Penguin Statistics Logo"
          class="home-card-title-icon"
          src="https://cos.yituliu.cn/endfield/icons/penguin_stats_logo.png"
        />
        <b>{{ $t('component.home.penguinStatistics.penguinStatistics') }}</b>
      </div>
      <div class="flex-1" />
      <v-btn
        :text="$t('component.home.penguinStatistics.penguinStatistics')"
        append-icon="mdi-open-in-new"
        color="primary"
        prepend-icon="mdi-web"
        size="small"
        href="https://penguin-stats.cn/"
        target="_blank"
      />
    </div>
    <div class="home-card-content">
      <p class="mb-3">{{ $t('component.home.penguinStatistics.penguinStatisticsDescription') }}</p>
      <div class="penguin-statistics-function-group">
        <a
          class="penguin-statistics-function"
          href="https://penguin-stats.cn/result/item"
          target="_blank"
        >
          <v-icon icon="mdi-treasure-chest" size="32" />
          <div class="function-title">
            {{ $t('component.home.penguinStatistics.itemDropRates') }}
          </div>
          <div class="function-desc">
            {{ $t('component.home.penguinStatistics.itemDropRatesDoc') }}
          </div>
        </a>

        <a
          class="penguin-statistics-function"
          href="https://penguin-stats.cn/result/stage"
          target="_blank"
        >
          <v-icon icon="mdi-cube" size="32" />
          <div class="function-title">
            {{ $t('component.home.penguinStatistics.stageDropRates') }}
          </div>
          <div class="function-desc">
            {{ $t('component.home.penguinStatistics.stageDropRatesDoc') }}
          </div>
        </a>

        <a
          class="penguin-statistics-function"
          href="https://penguin-stats.cn/report/stage"
          target="_blank"
        >
          <v-icon icon="mdi-upload" size="32" />
          <div class="function-title">{{ $t('component.home.penguinStatistics.dropReports') }}</div>
          <div class="function-desc">
            {{ $t('component.home.penguinStatistics.dropReportsDoc') }}
          </div>
        </a>

        <a
          class="penguin-statistics-function"
          href="https://penguin-stats.cn/planner"
          target="_blank"
        >
          <v-icon icon="mdi-directions-fork" size="32" />
          <div class="function-title">
            {{ $t('component.home.penguinStatistics.farmingPlanner') }}
          </div>
          <div class="function-desc">
            {{ $t('component.home.penguinStatistics.farmingPlannerDoc') }}
          </div>
        </a>
      </div>
    </div>
  </v-card>
</template>

<style scoped>
.penguin-statistics-function-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-sm);
}

.penguin-statistics-function {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--spacing-md);
  background-color: var(--theme-bg-secondary);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--theme-text-primary);
  transition:
    background-color var(--transition-fast),
    transform var(--transition-fast);
}

.penguin-statistics-function:hover {
  background-color: var(--theme-bg-tertiary);
  transform: translateY(-2px);
}

.function-title {
  font-size: var(--font-size-sm);
  font-weight: 600;
  margin-top: var(--spacing-xs);
  margin-bottom: var(--spacing-xs);
}

.function-desc {
  font-size: var(--font-size-xs);
  color: var(--theme-text-secondary);
  line-height: 1.4;
}
</style>
