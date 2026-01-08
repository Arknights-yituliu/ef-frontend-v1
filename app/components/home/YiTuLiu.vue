<script lang="ts" setup></script>

<template>
  <v-card class="card">
    <v-card-title>
      <header class="card-title">
        <img
          alt="明日方舟一图流 LOGO"
          class="card-title-icon"
          src="https://cos.yituliu.cn/endfield/icons/yituliu-icon.png"
        />
        <b>{{ $t('component.home.yiTuLiu.title') }}</b>
        <div class="flex-1" />
        <v-btn
          :text="$t('component.home.yiTuLiu.goToYiTuLiu')"
          append-icon="mdi-open-in-new"
          color="primary"
          href="https://ark.yituliu.cn/"
          prepend-icon="mdi-web"
          target="_blank"
        />
      </header>
    </v-card-title>
    <v-card-text>
      {{ $t('component.home.yiTuLiu.description') }}
      <p class="p-title">
        {{ $t('component.home.yiTuLiu.materialPlanning') }}
      </p>
      <p class="p-li">
        <a class="simple-link" href="https://ark.yituliu.cn/" target="_blank">
          <b>{{ $t('component.home.yiTuLiu.eliteMaterialRecommendation') }}：</b
          >{{ $t('component.home.yiTuLiu.eliteMaterialRecommendationDoc') }}
        </a>
      </p>
      <p class="p-li">
        <a class="simple-link" href="https://ark.yituliu.cn/material/store" target="_blank">
          <b>{{ $t('component.home.yiTuLiu.shopValue') }}：</b
          >{{ $t('component.home.yiTuLiu.shopValueDoc') }}
        </a>
      </p>
      <p class="p-li">
        <a class="simple-link" href="https://ark.yituliu.cn/material/elite" target="_blank">
          <b>{{ $t('component.home.yiTuLiu.operatorE2ValueTable') }}：</b
          >{{ $t('component.home.yiTuLiu.operatorE2ValueTableDoc') }}
        </a>
      </p>
      <p class="p-title">
        {{ $t('component.home.yiTuLiu.practicalTools') }}
      </p>
      <p class="p-li">
        <a class="simple-link" href="https://ark.yituliu.cn/tools/gachaCalc" target="_blank">
          <b>{{ $t('component.home.yiTuLiu.savePullCalculator') }}：</b
          >{{ $t('component.home.yiTuLiu.savePullCalculatorDoc') }}
        </a>
      </p>
      <p class="p-li">
        <a class="simple-link" href="https://ark.yituliu.cn/tools/scheduleV2" target="_blank">
          <b>{{ $t('component.home.yiTuLiu.scheduleGenerator') }}：</b
          >{{ $t('component.home.yiTuLiu.scheduleGeneratorDoc') }}
        </a>
      </p>
      <p class="p-li">
        <a class="simple-link" href="https://ark.yituliu.cn/tools/specializationTimeCalculate" target="_blank">
          <b>{{ $t('component.home.yiTuLiu.specializationHalfCalculator') }}：</b
          >{{ $t('component.home.yiTuLiu.specializationHalfCalculatorDoc') }}
        </a>
      </p>
    </v-card-text>
  </v-card>
</template>
