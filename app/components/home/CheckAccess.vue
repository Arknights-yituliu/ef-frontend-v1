<script lang="ts" setup></script>

<template>
  <v-card class="card">
    <v-card-title>
      <div class="card-title">
        <icon-endfield-icon class="card-title-icon" />
        <b>{{ $t('component.home.checkAccess.betaTestIICheckAccess') }}</b>
        <div class="flex-1"></div>
      </div>
    </v-card-title>
    <v-card-text>
      <img alt="" class="test-kv" src="https://cos.yituliu.cn/endfield/other/test-kv.jpg" />
      <v-btn
        class="check-access-btn"
        @click="() => openNewPage('https://endfield.hypergryph.com/checkAccess')"
      >
        <span>
          {{ $t('component.home.checkAccess.checkAccessOnEndfieldOfficialSite') }}
        </span>
        <v-icon icon="mdi-open-in-new"></v-icon>
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.check-access-btn {
  display: block;
  text-align: center;
  margin: var(--spacing-md) auto;
  width: 90%;
  align-content: center;
}

.test-kv {
  width: 90%;
  display: block;
  margin: auto;
}
</style>
