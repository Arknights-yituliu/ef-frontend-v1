<script lang="ts" setup></script>

<template>
  <v-card class="card">
    <v-card-title>
      <div class="card-title">
        <img
          alt="Factorio Lab Logo"
          class="card-title-icon"
          src="https://factory.ef.yituliu.cn/favicon-32x32.png"
        />
        <b>{{ $t('component.home.factorioLab.factorioLab') }}</b>
        <div class="flex-1" />
        <v-btn
          :text="$t('component.home.factorioLab.goToFactorioLab')"
          append-icon="mdi-open-in-new"
          color="primary"
          prepend-icon="mdi-web"
          @click="openNewPage('https://factory.ef.yituliu.cn/')"
        >
        </v-btn>
      </div>
    </v-card-title>
    <v-card-text>
      {{ $t('component.home.factorioLab.description') }}
    </v-card-text>
  </v-card>
</template>

<style scoped></style>
