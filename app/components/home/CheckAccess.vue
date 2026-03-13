<script lang="ts" setup></script>

<template>
  <v-card class="home-card">
    <div class="home-card-header">
      <div class="home-card-title">
        <icon-endfield-icon class="home-card-title-icon" />
        <b>{{ $t('component.home.checkAccess.betaTestIICheckAccess') }}</b>
      </div>
      <div class="flex-1" />
      <v-btn
        append-icon="mdi-open-in-new"
        color="primary"
        href="https://endfield.hypergryph.com/checkAccess"
        prepend-icon="mdi-open-in-new"
        size="small"
        target="_blank"
        :text="$t('component.home.checkAccess.checkAccessOnEndfieldOfficialSite')"
      />
    </div>
    <div class="home-card-content">
      <img alt="" class="test-kv" src="https://cos.yituliu.cn/endfield/other/test-kv.jpg" >
    </div>
  </v-card>
</template>

<style scoped>
.test-kv {
  width: 100%;
  display: block;
  border-radius: var(--radius-md);
  object-fit: cover;
}
</style>
