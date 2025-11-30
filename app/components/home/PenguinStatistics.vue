<script setup lang="ts">
const openNewPage = (url: string) => {
  window.open(url)
}


</script>

<template>
  <v-card class="home-navigation-card" elevation="6">
    <v-card-title>
      <div class="home-navigation-card-title">
        <img src="~/assets/icon/penguin_stats_logo.png" alt=""
             class="home-navigation-card-title-icon"/>
        <b>{{ $t('component.home.penguinStatistics.penguinStatistics') }}</b>
      </div>
    </v-card-title>
    <v-card-text>
      {{ $t('component.home.penguinStatistics.penguinStatisticsDescription')}}
<!--      企鹅物流数据统计（Penguin Statistics）是企鹅物流旗下数据处理部门（误），致力于明日方舟各素材的掉率统计。-->
       <div class="penguin-statistics-function-group">
         <v-card class="penguin-statistics-function" hover>
            <v-card-text>
              <v-icon icon="mdi-treasure-chest" size="42"></v-icon>
              <h2>{{ $t('component.home.penguinStatistics.itemDropRates') }}</h2>
              <span>{{ $t('component.home.penguinStatistics.itemDropRatesDoc') }}</span>
            </v-card-text>
         </v-card>
         <v-card class="penguin-statistics-function" hover>
           <v-card-text>
             <v-icon icon="mdi-cube" size="42"></v-icon>
             <h2>{{ $t('component.home.penguinStatistics.stageDropRates') }}</h2>
             <span>{{ $t('component.home.penguinStatistics.stageDropRatesDoc') }}</span>
           </v-card-text>
         </v-card>
         <v-card class="penguin-statistics-function" hover>
           <v-card-text>
             <v-icon icon="mdi-upload" size="42"></v-icon>
             <h2>{{ $t('component.home.penguinStatistics.dropReports') }}</h2>
             <span>{{ $t('component.home.penguinStatistics.dropReportsDoc') }}</span>
           </v-card-text>
         </v-card>
         <v-card class="penguin-statistics-function" hover>
           <v-card-text>
             <v-icon icon="mdi-directions-fork" size="42"></v-icon>
             <h2>{{ $t('component.home.penguinStatistics.farmingPlanner') }}</h2>
             <span>{{ $t('component.home.penguinStatistics.farmingPlannerDoc') }}</span>
           </v-card-text>
         </v-card>
       </div>

      <v-btn prepend-icon="mdi-github"
             color="primary"
             :text="$t('component.home.penguinStatistics.penguinStatistics')"
             @click="openNewPage('https://penguin-stats.cn/')"
             append-icon="mdi-open-in-new">
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<style scoped>

.penguin-statistics-function-group{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  text-align: center;
  margin: var(--spacing-xl) 0;
}

.penguin-statistics-function{
  width: 24%;
  margin: var( --spacing-xs) 0;
}

@media screen and (max-width: 1440px){
  .penguin-statistics-function{
    width: 30%;
  }
}

@media screen and (max-width: 1280px){
  .penguin-statistics-function{
    width: 48%;
  }
}


</style>
