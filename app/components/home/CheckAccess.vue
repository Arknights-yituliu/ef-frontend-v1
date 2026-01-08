<script lang="ts" setup></script>

<template>
  <v-card class="card">
    <v-card-title>
      <header class="card-title">
        <icon-endfield-icon class="card-title-icon" />
        <b>{{ $t('component.home.checkAccess.betaTestIICheckAccess') }}</b>
        <div class="flex-1" />
      </header>
    </v-card-title>
    <v-card-text>
      <img alt="" class="test-kv" src="https://cos.yituliu.cn/endfield/other/test-kv.jpg" />
      <v-btn
        class="check-access-btn"
        href="https://endfield.hypergryph.com/checkAccess"
        target="_blank"
      >
        <span>
          {{ $t('component.home.checkAccess.checkAccessOnEndfieldOfficialSite') }}
        </span>
        <v-icon icon="mdi-open-in-new" />
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
