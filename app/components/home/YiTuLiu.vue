<script lang="ts" setup></script>

<template>
  <v-card class="card">
    <v-card-title>
      <div class="card-title">
        <img alt="" class="card-title-icon" src="~/assets/icon/yituliu-icon.png" />
        <b>{{ $t('component.home.yiTuLiu.title') }}</b>
        <div class="flex-1" />
        <v-btn
          append-icon="mdi-open-in-new"
          color="primary"
          prepend-icon="mdi-web"
          :text="$t('component.home.yiTuLiu.goToYiTuLiu')"
          @click="openNewPage('https://ark.yituliu.cn/')"
        >
        </v-btn>
      </div>
    </v-card-title>
    <v-card-text>
      {{ $t('component.home.yiTuLiu.description') }}
      <p class="p-title">
        {{ $t('component.home.yiTuLiu.materialPlanning') }}
      </p>
      <p class="p-li">
        <a href="https://ark.yituliu.cn/" class="simple-link">
          <b>{{ $t('component.home.yiTuLiu.eliteMaterialRecommendation') }}：</b
          >{{ $t('component.home.yiTuLiu.eliteMaterialRecommendationDoc') }}
        </a>
      </p>
      <p class="p-li">
        <a href="https://ark.yituliu.cn/material/store" class="simple-link">
          <b>{{ $t('component.home.yiTuLiu.shopValue') }}：</b
          >{{ $t('component.home.yiTuLiu.shopValueDoc') }}
        </a>
      </p>
      <p class="p-li">
        <a href="https://ark.yituliu.cn/material/elite" class="simple-link">
          <b>{{ $t('component.home.yiTuLiu.operatorE2ValueTable') }}：</b
          >{{ $t('component.home.yiTuLiu.operatorE2ValueTableDoc') }}
        </a>
      </p>
      <p class="p-title">
        {{ $t('component.home.yiTuLiu.practicalTools') }}
      </p>
      <p class="p-li">
        <a href="https://ark.yituliu.cn/tools/gachaCalc" class="simple-link">
          <b>{{ $t('component.home.yiTuLiu.savePullCalculator') }}：</b
          >{{ $t('component.home.yiTuLiu.savePullCalculatorDoc') }}
        </a>
      </p>
      <p class="p-li">
        <a href="https://ark.yituliu.cn/tools/scheduleV2" class="simple-link">
          <b>{{ $t('component.home.yiTuLiu.scheduleGenerator') }}：</b
          >{{ $t('component.home.yiTuLiu.scheduleGeneratorDoc') }}
        </a>
      </p>
      <p class="p-li">
        <a href="https://ark.yituliu.cn/tools/specializationTimeCalculate" class="simple-link">
          <b>{{ $t('component.home.yiTuLiu.specializationHalfCalculator') }}：</b
          >{{ $t('component.home.yiTuLiu.specializationHalfCalculatorDoc') }}
        </a>
      </p>
    </v-card-text>
  </v-card>
</template>
