<script lang="ts" setup>

</script>

<template>
  <v-card class="card">
    <v-card-title>
      <div class="card-title">
        <img alt="" class="card-title-icon"
             src="~/assets/icon/penguin_stats_logo.png"/>
        <b>{{ $t('component.home.penguinStatistics.penguinStatistics') }}</b>
        <div class="flex-1"/>
        <v-btn :text="$t('component.home.penguinStatistics.penguinStatistics')"
               append-icon="mdi-open-in-new"
               color="primary"
               prepend-icon="mdi-web"
               @click="openNewPage('https://penguin-stats.cn/')">
        </v-btn>
      </div>
    </v-card-title>
    <v-card-text>
      {{ $t('component.home.penguinStatistics.penguinStatisticsDescription') }}
      <!--      企鹅物流数据统计（Penguin Statistics）是企鹅物流旗下数据处理部门（误），致力于明日方舟各素材的掉率统计。-->
      <div class="penguin-statistics-function-group">
        <v-card class="penguin-statistics-function" hover @click="()=>openNewPage('https://penguin-stats.cn/report/item')">
          <v-card-text>
            <v-icon icon="mdi-treasure-chest" size="42"></v-icon>
            <h2>{{ $t('component.home.penguinStatistics.itemDropRates') }}</h2>
            <span>{{ $t('component.home.penguinStatistics.itemDropRatesDoc') }}</span>
          </v-card-text>
        </v-card>

        <v-card class="penguin-statistics-function" hover @click="()=>openNewPage('https://penguin-stats.cn/report/stage')">
          <v-card-text>
            <v-icon icon="mdi-cube" size="42"></v-icon>
            <h2>{{ $t('component.home.penguinStatistics.stageDropRates') }}</h2>
            <span>{{ $t('component.home.penguinStatistics.stageDropRatesDoc') }}</span>
          </v-card-text>
        </v-card>
        <v-card class="penguin-statistics-function" hover @click="()=>openNewPage('https://penguin-stats.cn/report/stage')">
          <v-card-text>
            <v-icon icon="mdi-upload" size="42"></v-icon>
            <h2>{{ $t('component.home.penguinStatistics.dropReports') }}</h2>
            <span>{{ $t('component.home.penguinStatistics.dropReportsDoc') }}</span>
          </v-card-text>
        </v-card>
        <v-card class="penguin-statistics-function" hover @click="()=>openNewPage('https://penguin-stats.cn/planner')">
          <v-card-text>
            <v-icon icon="mdi-directions-fork" size="42"></v-icon>
            <h2>{{ $t('component.home.penguinStatistics.farmingPlanner') }}</h2>
            <span>{{ $t('component.home.penguinStatistics.farmingPlannerDoc') }}</span>
          </v-card-text>
        </v-card>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>

.penguin-statistics-function-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  text-align: center;
  margin: var(--spacing-xl) 0;
}

.penguin-statistics-function {
  width: 24%;
  margin: var(--spacing-xs) 0;
}

@media screen and (max-width: 1440px) {
  .penguin-statistics-function {
    width: 30%;
  }
}

@media screen and (max-width: 1280px) {
  .penguin-statistics-function {
    width: 48%;
  }
}


</style>
